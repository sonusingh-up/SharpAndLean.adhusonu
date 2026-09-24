import {
  PreviewError,
  fetchLinkPreview,
  fetchPreviewAsset,
  verifyAsset,
} from '@/lib/link-preview';

// DNS resolution and address pinning need Node's net APIs.
export const runtime = 'nodejs';

const CACHE_OK = 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800';
// Failures are cached briefly so a dead or bot-blocking source is not
// re-requested on every hover.
const CACHE_ERROR = 'public, max-age=60, s-maxage=300';

/* Per-instance limiter. It needs no dependencies and catches a single client
   hammering one instance; it is not a substitute for a platform rate limit if
   the site ever runs many instances. Assets get a separate, larger bucket
   because one preview can load an image and a favicon. */
const WINDOW_MS = 60_000;
const LIMITS = { metadata: 60, asset: 120 } as const;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(key: string, limit: number) {
  const now = Date.now();
  if (hits.size > 5_000) {
    for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
  }
  const entry = hits.get(key);
  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > limit;
}

function clientId(request: Request) {
  return (
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

function json(body: unknown, status: number, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers });
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const target = params.get('url');
  const isAsset = params.get('asset') === '1';

  if (!target) return json({ error: 'Missing url' }, 400);

  const bucket = isAsset ? 'asset' : 'metadata';
  if (rateLimited(`${bucket}:${clientId(request)}`, LIMITS[bucket])) {
    return json({ error: 'Too many requests' }, 429, {
      'Retry-After': '60',
      'Cache-Control': 'no-store',
    });
  }

  try {
    if (isAsset) {
      if (!verifyAsset(target, params.get('sig') ?? '')) {
        return json({ error: 'Invalid signature' }, 403, { 'Cache-Control': 'no-store' });
      }
      const { body, type } = await fetchPreviewAsset(target);
      return new Response(new Uint8Array(body), {
        headers: {
          'Content-Type': type,
          'Cache-Control': CACHE_OK,
          // Belt and braces: the bytes are already verified as a raster image,
          // but nothing served from here should ever be able to run script.
          'Content-Security-Policy': "default-src 'none'; sandbox",
          'Cross-Origin-Resource-Policy': 'same-origin',
        },
      });
    }

    return json(await fetchLinkPreview(target), 200, { 'Cache-Control': CACHE_OK });
  } catch (error) {
    const status = error instanceof PreviewError ? error.status : 502;
    const message = error instanceof PreviewError ? error.message : 'Preview unavailable';
    return json({ error: message }, status, { 'Cache-Control': CACHE_ERROR });
  }
}
