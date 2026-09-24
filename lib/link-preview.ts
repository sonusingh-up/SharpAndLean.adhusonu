import { lookup } from 'node:dns/promises';
import { BlockList, isIP, type LookupFunction } from 'node:net';
import http from 'node:http';
import https from 'node:https';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { createBrotliDecompress, createGunzip, createInflate } from 'node:zlib';
import type { Readable } from 'node:stream';
import { isPaidLink } from './link-rel';

/**
 * Server-side fetcher behind the link-mention preview cards.
 *
 * It takes a URL from the public internet — which means from anyone — and makes
 * a request to it from inside our infrastructure, so every step is defensive:
 *
 * - http(s) only, no credentials, no non-default ports, no bare hostnames;
 * - every hostname is resolved and refused if any address is private, loopback,
 *   link-local, reserved or an IPv4-in-IPv6 wrapper of one;
 * - the connection is pinned to the address that passed the check, so DNS
 *   cannot answer differently between checking and connecting;
 * - redirects are followed by hand, three at most, each one re-checked;
 * - a single five-second deadline covers DNS, redirects and the body;
 * - bodies are capped after decompression, so a small gzip cannot expand into
 *   a large one;
 * - images are identified by their bytes, never by the upstream Content-Type,
 *   and SVG is refused outright because it can carry script;
 * - affiliate links are refused, because requesting one from the server would
 *   register a click the reader never made.
 */

export const PREVIEW_ENDPOINT = '/api/notion-mention-link';

const TIMEOUT_MS = 5_000;
const MAX_HTML_BYTES = 512 * 1024;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_REDIRECTS = 3;
const USER_AGENT =
  'Mozilla/5.0 (compatible; SharpAndLeanLinkPreview/1.0; +https://sharpandlean.com/about)';

export class PreviewError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
  }
}

export type LinkPreview = {
  url: string;
  title: string;
  description?: string;
  siteName: string;
  domain: string;
  /** Signed same-origin proxy path, never the third-party URL. */
  image?: string;
  /** Signed same-origin proxy path, never the third-party URL. */
  favicon?: string;
};

/* Special-purpose and non-routable ranges. IPv4-mapped, NAT64, 6to4 and Teredo
   ranges are refused wholesale: each can wrap a private IPv4 address, and no
   public site needs to be reached through one.

   Two lists, not one: a BlockList also tests IPv4 addresses against its IPv6
   rules in mapped form, so the ::ffff:0:0/96 rule would otherwise block every
   IPv4 address on the internet. */
const blockedV4 = new BlockList();
const blockedV6 = new BlockList();
for (const [network, prefix] of [
  ['0.0.0.0', 8],
  ['10.0.0.0', 8],
  ['100.64.0.0', 10],
  ['127.0.0.0', 8],
  ['169.254.0.0', 16],
  ['172.16.0.0', 12],
  ['192.0.0.0', 24],
  ['192.0.2.0', 24],
  ['192.88.99.0', 24],
  ['192.168.0.0', 16],
  ['198.18.0.0', 15],
  ['198.51.100.0', 24],
  ['203.0.113.0', 24],
  ['224.0.0.0', 4],
  ['240.0.0.0', 4],
] as const) {
  blockedV4.addSubnet(network, prefix, 'ipv4');
}
for (const [network, prefix] of [
  ['::', 96],
  ['::ffff:0:0', 96],
  ['64:ff9b::', 96],
  ['64:ff9b:1::', 48],
  ['100::', 64],
  ['2001::', 32],
  ['2001:db8::', 32],
  ['2002::', 16],
  ['fc00::', 7],
  ['fe80::', 10],
  ['fec0::', 10],
  ['ff00::', 8],
] as const) {
  blockedV6.addSubnet(network, prefix, 'ipv6');
}

function bareHost(hostname: string) {
  return hostname.replace(/^\[|\]$/g, '');
}

export function isPublicAddress(address: string) {
  const bare = bareHost(address).split('%')[0];
  const family = isIP(bare);
  try {
    if (family === 4) return !blockedV4.check(bare, 'ipv4');
    if (family === 6) return !blockedV6.check(bare, 'ipv6');
  } catch {
    return false;
  }
  return false;
}

/** Validates a URL before anything is resolved or requested. */
export function parseTarget(raw: string): URL {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new PreviewError('Invalid URL');
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new PreviewError('Only http and https URLs can be previewed');
  }
  if (url.username || url.password) throw new PreviewError('URLs with credentials are refused');
  // URL drops a port that matches the scheme default, so anything left is non-standard.
  if (url.port) throw new PreviewError('Non-standard ports are refused');

  const host = bareHost(url.hostname);
  if (isIP(host)) {
    if (!isPublicAddress(host)) throw new PreviewError('Private addresses are refused');
  } else if (!host.includes('.') || /(^|\.)localhost$/i.test(host)) {
    throw new PreviewError('Only public domain names can be previewed');
  }
  if (isPaidLink(url.href)) throw new PreviewError('Affiliate links are not previewed');

  url.hash = '';
  return url;
}

type Pin = { address: string; family: 4 | 6 };

async function resolvePublic(url: URL): Promise<Pin> {
  const host = bareHost(url.hostname);
  const literal = isIP(host);
  if (literal) return { address: host, family: literal as 4 | 6 };

  let records: { address: string; family: number }[];
  try {
    records = await lookup(host, { all: true, verbatim: true });
  } catch {
    throw new PreviewError('Host could not be resolved', 502);
  }
  // Refuse the host if any answer is private: a name that resolves both ways is
  // either misconfigured or trying to race the check.
  if (!records.length || records.some((r) => !isPublicAddress(r.address))) {
    throw new PreviewError('Host resolves to a private address');
  }
  const [first] = records;
  return { address: first.address, family: first.family === 6 ? 6 : 4 };
}

type RawResponse = {
  status: number;
  headers: http.IncomingHttpHeaders;
  body: Buffer;
  location?: string;
};

function decoded(res: http.IncomingMessage): Readable {
  const encoding = String(res.headers['content-encoding'] || 'identity').toLowerCase();
  if (encoding === 'identity') return res;
  if (encoding === 'gzip' || encoding === 'x-gzip') return res.pipe(createGunzip());
  if (encoding === 'deflate') return res.pipe(createInflate());
  if (encoding === 'br') return res.pipe(createBrotliDecompress());
  throw new PreviewError('Unsupported content encoding', 502);
}

function requestOnce(
  url: URL,
  pin: Pin,
  accept: string,
  maxBytes: number,
  truncate: boolean,
  signal: AbortSignal,
): Promise<RawResponse> {
  // Answer the socket's lookup with the address that was already checked. The
  // TLS handshake still uses the hostname, so certificates are verified normally.
  const pinned: LookupFunction = (_hostname, options, callback) => {
    if (options.all) callback(null, [{ address: pin.address, family: pin.family }]);
    else callback(null, pin.address, pin.family);
  };
  const client = url.protocol === 'https:' ? https : http;

  return new Promise<RawResponse>((resolve, reject) => {
    let settled = false;
    const finish = (fn: () => void) => {
      if (settled) return;
      settled = true;
      fn();
    };

    const req = client.request(
      url,
      {
        method: 'GET',
        agent: false,
        lookup: pinned,
        signal,
        headers: {
          'user-agent': USER_AGENT,
          accept,
          'accept-encoding': 'gzip, deflate, br',
          'accept-language': 'en',
        },
      },
      (res) => {
        const status = res.statusCode ?? 0;
        if (status >= 300 && status < 400 && res.headers.location) {
          res.resume();
          finish(() => resolve({ status, headers: res.headers, body: Buffer.alloc(0), location: res.headers.location }));
          return;
        }
        const declared = Number(res.headers['content-length']);
        if (!truncate && Number.isFinite(declared) && declared > maxBytes) {
          res.destroy();
          finish(() => reject(new PreviewError('Response too large', 502)));
          return;
        }

        let stream: Readable;
        try {
          stream = decoded(res);
        } catch (error) {
          res.destroy();
          finish(() => reject(error));
          return;
        }
        const chunks: Buffer[] = [];
        let total = 0;
        const done = () => finish(() => resolve({ status, headers: res.headers, body: Buffer.concat(chunks) }));

        stream.on('data', (chunk: Buffer) => {
          if (settled) return;
          const room = maxBytes - total;
          if (chunk.length > room) {
            if (!truncate) {
              finish(() => reject(new PreviewError('Response too large', 502)));
            } else {
              // Page metadata lives in <head>, so the first slice of an oversized
              // page is still enough to read it.
              chunks.push(chunk.subarray(0, room));
              total = maxBytes;
              done();
            }
            res.destroy();
            stream.destroy();
            return;
          }
          chunks.push(chunk);
          total += chunk.length;
        });
        stream.on('end', done);
        stream.on('error', (error) => finish(() => reject(error)));
        res.on('error', (error) => finish(() => reject(error)));
      },
    );
    req.on('error', (error) => finish(() => reject(error)));
    req.end();
  });
}

async function fetchPinned(start: URL, accept: string, maxBytes: number, truncate: boolean) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const deadline = new Promise<never>((_, reject) => {
    controller.signal.addEventListener('abort', () => reject(new PreviewError('Timed out', 504)), {
      once: true,
    });
  });
  deadline.catch(() => {});

  try {
    let url = start;
    for (let hop = 0; ; hop++) {
      const pin = await Promise.race([resolvePublic(url), deadline]);
      const res = await Promise.race([
        requestOnce(url, pin, accept, maxBytes, truncate, controller.signal),
        deadline,
      ]);
      if (res.location !== undefined) {
        if (hop >= MAX_REDIRECTS) throw new PreviewError('Too many redirects', 502);
        url = parseTarget(new URL(res.location, url).href);
        continue;
      }
      if (res.status < 200 || res.status >= 300) {
        throw new PreviewError(`Upstream responded ${res.status}`, 502);
      }
      return { url, headers: res.headers, body: res.body };
    }
  } catch (error) {
    if (controller.signal.aborted) throw new PreviewError('Timed out', 504);
    if (error instanceof PreviewError) throw error;
    throw new PreviewError('Preview unavailable', 502);
  } finally {
    clearTimeout(timer);
  }
}

/* ---------- Metadata ---------- */

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—',
  hellip: '…', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', middot: '·', copy: '©',
  reg: '®', trade: '™',
};

function decodeEntities(value: string) {
  return value.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
    if (entity[0] === '#') {
      const code = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
      return Number.isInteger(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match;
    }
    return NAMED_ENTITIES[entity.toLowerCase()] ?? match;
  });
}

function clean(value: string | undefined, max: number) {
  if (!value) return undefined;
  const text = decodeEntities(value)
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return undefined;
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

const ATTRIBUTE = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

function attributes(tag: string) {
  const out: Record<string, string> = {};
  const inner = tag.replace(/^<[a-z]+/i, '').replace(/\/?>$/, '');
  for (const m of inner.matchAll(ATTRIBUTE)) {
    const name = m[1].toLowerCase();
    if (!(name in out)) out[name] = m[2] ?? m[3] ?? m[4] ?? '';
  }
  return out;
}

function absoluteHttp(value: string | undefined, base: URL) {
  if (!value) return undefined;
  try {
    const url = new URL(decodeEntities(value.trim()), base);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : undefined;
  } catch {
    return undefined;
  }
}

export function domainOf(url: URL | string) {
  return new URL(url).hostname.replace(/^www\./, '');
}

/** Reads title, description, image, favicon and site name from a page's <head>. */
export function extractMetadata(html: string, pageUrl: URL) {
  const headEnd = html.search(/<\/head\s*>/i);
  const head = headEnd === -1 ? html : html.slice(0, headEnd);

  const meta = new Map<string, string>();
  for (const [tag] of head.matchAll(/<meta\b[^>]*>/gi)) {
    const attrs = attributes(tag);
    const key = (attrs.property || attrs.name || attrs.itemprop || '').toLowerCase();
    if (key && attrs.content !== undefined && !meta.has(key)) meta.set(key, attrs.content);
  }

  const icons: { rel: string[]; href: string; type: string }[] = [];
  for (const [tag] of head.matchAll(/<link\b[^>]*>/gi)) {
    const attrs = attributes(tag);
    const rel = (attrs.rel || '').toLowerCase().split(/\s+/);
    if (attrs.href && (rel.includes('icon') || rel.includes('apple-touch-icon'))) {
      icons.push({ rel, href: attrs.href, type: (attrs.type || '').toLowerCase() });
    }
  }
  // SVG icons are refused by the image proxy, so prefer a raster one.
  const raster = icons.filter((i) => !i.type.includes('svg') && !/\.svg(?:$|[?#])/i.test(i.href));
  const icon = raster.find((i) => i.rel.includes('icon')) ?? raster[0];

  const titleTag = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  const domain = domainOf(pageUrl);

  return {
    title:
      clean(meta.get('og:title'), 200) ??
      clean(meta.get('twitter:title'), 200) ??
      clean(titleTag, 200) ??
      domain,
    description:
      clean(meta.get('og:description'), 400) ??
      clean(meta.get('twitter:description'), 400) ??
      clean(meta.get('description'), 400),
    siteName: clean(meta.get('og:site_name'), 80) ?? clean(meta.get('application-name'), 80) ?? domain,
    image: absoluteHttp(
      meta.get('og:image:secure_url') ?? meta.get('og:image') ?? meta.get('twitter:image') ?? meta.get('twitter:image:src'),
      pageUrl,
    ),
    favicon: absoluteHttp(icon?.href ?? '/favicon.ico', pageUrl),
  };
}

/* Bot-protection interstitials answer 200 with a page of their own, so their
   title would be shown as the source's ("Checking your browser - reCAPTCHA").
   A page that yields neither a title nor a description has nothing to preview
   either. Both count as unavailable rather than as a result. */
const INTERSTITIAL =
  /checking your browser|just a moment...|attention required|verify (?:that )?you are (?:a )?human|are you a (?:robot|human)|robot check|captcha|access denied|security check|pardon our interruption|request rejected|ddos-guard|enable javascript and cookies/i;

export function isUsablePreview(found: { title: string; description?: string }, domain: string) {
  if (INTERSTITIAL.test(found.title)) return false;
  return found.title !== domain || Boolean(found.description);
}

function charsetOf(contentType: string | undefined, body: Buffer) {
  const fromHeader = contentType?.match(/charset=["']?([\w-]+)/i)?.[1];
  const fromMeta = body.subarray(0, 2048).toString('latin1').match(/<meta[^>]+charset=["']?([\w-]+)/i)?.[1];
  return fromHeader || fromMeta || 'utf-8';
}

function decodeHtml(body: Buffer, contentType: string | undefined) {
  try {
    return new TextDecoder(charsetOf(contentType, body)).decode(body);
  } catch {
    return new TextDecoder('utf-8').decode(body);
  }
}

/* ---------- Asset signing ---------- */

let devKey: Buffer | undefined;

/* The image proxy only serves URLs this server signed while reading a page's
   metadata, so it cannot be used to hotlink arbitrary images through the site.
   The key is derived rather than taken directly, so the secret it comes from
   is never used for two purposes. */
function signingKey() {
  const secret = process.env.LINK_PREVIEW_SECRET || process.env.REVALIDATE_SECRET;
  if (secret) return createHmac('sha256', secret).update('link-preview-assets').digest();
  // Local development only. Every production instance needs the same key, which
  // is why one of the variables above must be set there.
  devKey ??= randomBytes(32);
  return devKey;
}

export function signAsset(url: string) {
  return createHmac('sha256', signingKey()).update(url).digest('base64url').slice(0, 32);
}

export function verifyAsset(url: string, signature: string) {
  const expected = Buffer.from(signAsset(url));
  const given = Buffer.from(signature);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

function assetPath(url: string | undefined) {
  if (!url) return undefined;
  const params = new URLSearchParams({ asset: '1', url, sig: signAsset(url) });
  return `${PREVIEW_ENDPOINT}?${params}`;
}

/* ---------- Public entry points ---------- */

const CACHE_TTL_MS = 60 * 60 * 1000;
const CACHE_MAX = 500;
const cache = new Map<string, { value: LinkPreview; expires: number }>();
const pending = new Map<string, Promise<LinkPreview>>();

export async function fetchLinkPreview(raw: string): Promise<LinkPreview> {
  const target = parseTarget(raw);
  const key = target.href;

  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.value;

  let request = pending.get(key);
  if (!request) {
    request = (async () => {
      const { url, headers, body } = await fetchPinned(
        target,
        'text/html,application/xhtml+xml;q=0.9,*/*;q=0.1',
        MAX_HTML_BYTES,
        true,
      );
      const contentType = String(headers['content-type'] || '');
      if (!/text\/html|application\/xhtml\+xml/i.test(contentType)) {
        throw new PreviewError('Not an HTML page', 415);
      }
      const found = extractMetadata(decodeHtml(body, contentType), url);
      if (!isUsablePreview(found, domainOf(url))) {
        throw new PreviewError('The source does not allow automated previews', 502);
      }
      const value: LinkPreview = {
        url: target.href,
        domain: domainOf(target),
        title: found.title,
        description: found.description,
        siteName: found.siteName,
        image: assetPath(found.image),
        favicon: assetPath(found.favicon),
      };
      if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value!);
      cache.set(key, { value, expires: Date.now() + CACHE_TTL_MS });
      return value;
    })().finally(() => pending.delete(key));
    pending.set(key, request);
  }
  return request;
}

/** Identifies an image by its leading bytes. Upstream Content-Type is not trusted. */
export function sniffImageType(body: Buffer): string | undefined {
  if (body.length < 12) return undefined;
  if (body[0] === 0x89 && body.subarray(1, 4).toString('latin1') === 'PNG') return 'image/png';
  if (body[0] === 0xff && body[1] === 0xd8 && body[2] === 0xff) return 'image/jpeg';
  if (body.subarray(0, 4).toString('latin1') === 'GIF8') return 'image/gif';
  if (body.subarray(0, 4).toString('latin1') === 'RIFF' && body.subarray(8, 12).toString('latin1') === 'WEBP') {
    return 'image/webp';
  }
  if (body.subarray(4, 12).toString('latin1') === 'ftypavif') return 'image/avif';
  if (body[0] === 0 && body[1] === 0 && body[2] === 1 && body[3] === 0) return 'image/x-icon';
  return undefined;
}

export async function fetchPreviewAsset(raw: string) {
  const target = parseTarget(raw);
  const { body } = await fetchPinned(
    target,
    'image/avif,image/webp,image/png,image/jpeg,image/gif,image/x-icon;q=0.9,*/*;q=0.1',
    MAX_IMAGE_BYTES,
    false,
  );
  const type = sniffImageType(body);
  if (!type) throw new PreviewError('Not a supported image', 415);
  return { body, type };
}
