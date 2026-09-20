import 'server-only';
import { createHash, createHmac } from 'node:crypto';

/**
 * Amazon Associates integration.
 *
 * Two independent pieces, deliberately separated:
 *
 *  1. `amazonLink()` builds a tagged affiliate URL. It needs only the partner
 *     tag, works immediately, and is what actually earns commission.
 *  2. `getAmazonItems()` calls the Product Advertising API for live title,
 *     image, price and availability. PA-API additionally requires access keys
 *     AND an Associates account that has made three qualifying sales in the
 *     last 180 days — until then every request returns 403.
 *
 * Everything degrades quietly: with no tag you get a plain product URL, with no
 * keys you get links without live metadata. Nothing throws at render time.
 */

const PARTNER_TAG = process.env.AMAZON_PARTNER_TAG || '';
const ACCESS_KEY = process.env.AMAZON_ACCESS_KEY || '';
const SECRET_KEY = process.env.AMAZON_SECRET_KEY || '';
const HOST = process.env.AMAZON_HOST || 'webservices.amazon.com';
const REGION = process.env.AMAZON_REGION || 'us-east-1';
const MARKETPLACE = process.env.AMAZON_MARKETPLACE || 'www.amazon.com';

export const hasAmazonTag = Boolean(PARTNER_TAG);
export const hasAmazonApi = Boolean(PARTNER_TAG && ACCESS_KEY && SECRET_KEY);

export type AmazonItem = {
  asin: string;
  url: string;
  title?: string;
  image?: string;
  price?: string;
  priceAmount?: number | null;
  currency?: string;
  available?: boolean;
};

/** A tagged product URL. Safe to call with no credentials configured. */
export function amazonLink(asin: string): string {
  const base = `https://${MARKETPLACE}/dp/${encodeURIComponent(asin)}`;
  return PARTNER_TAG ? `${base}?tag=${encodeURIComponent(PARTNER_TAG)}` : base;
}

/** A tagged keyword-search URL, for products with no known ASIN. */
export function amazonSearchLink(keywords: string): string {
  const base = `https://${MARKETPLACE}/s?k=${encodeURIComponent(keywords)}`;
  return PARTNER_TAG ? `${base}&tag=${encodeURIComponent(PARTNER_TAG)}` : base;
}

const sha256 = (value: string) => createHash('sha256').update(value, 'utf8').digest('hex');
const hmac = (key: Buffer | string, value: string) =>
  createHmac('sha256', key).update(value, 'utf8').digest();

/** AWS Signature Version 4, as PA-API v5 requires. */
function sign(payload: string, target: string, path: string) {
  const stamp = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
  const date = stamp.slice(0, 8);
  const headers: Record<string, string> = {
    'content-encoding': 'amz-1.0',
    host: HOST,
    'x-amz-date': stamp,
    'x-amz-target': target,
  };
  const signedHeaders = Object.keys(headers).sort().join(';');
  const canonicalHeaders = Object.keys(headers)
    .sort()
    .map((k) => `${k}:${headers[k]}\n`)
    .join('');
  const canonicalRequest = [
    'POST',
    path,
    '',
    canonicalHeaders,
    signedHeaders,
    sha256(payload),
  ].join('\n');

  const scope = `${date}/${REGION}/ProductAdvertisingAPI/aws4_request`;
  const toSign = ['AWS4-HMAC-SHA256', stamp, scope, sha256(canonicalRequest)].join('\n');

  let key: Buffer = hmac(`AWS4${SECRET_KEY}`, date);
  key = hmac(key, REGION);
  key = hmac(key, 'ProductAdvertisingAPI');
  key = hmac(key, 'aws4_request');
  const signature = createHmac('sha256', key).update(toSign, 'utf8').digest('hex');

  return {
    ...headers,
    'content-type': 'application/json; charset=utf-8',
    Authorization: `AWS4-HMAC-SHA256 Credential=${ACCESS_KEY}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
  };
}

type CacheEntry = { items: Record<string, AmazonItem>; at: number };
let cache: CacheEntry | null = null;
// Amazon requires displayed prices to be current, so this is deliberately short.
const TTL = 60 * 60 * 1000;

/**
 * Fetch live data for up to 10 ASINs (PA-API's per-request limit).
 * Returns tagged-link-only entries when the API is unavailable, so callers
 * always get something usable.
 */
export async function getAmazonItems(asins: string[]): Promise<Record<string, AmazonItem>> {
  const unique = [...new Set(asins.filter(Boolean))].slice(0, 10);
  const fallback = Object.fromEntries(
    unique.map((asin) => [asin, { asin, url: amazonLink(asin) } as AmazonItem]),
  );
  if (!unique.length || !hasAmazonApi) return fallback;

  if (cache && Date.now() - cache.at < TTL && unique.every((a) => cache!.items[a])) {
    return Object.fromEntries(unique.map((a) => [a, cache!.items[a]]));
  }

  const payload = JSON.stringify({
    ItemIds: unique,
    ItemIdType: 'ASIN',
    Resources: [
      'ItemInfo.Title',
      'Images.Primary.Large',
      'Offers.Listings.Price',
      'Offers.Listings.Availability.Message',
    ],
    PartnerTag: PARTNER_TAG,
    PartnerType: 'Associates',
    Marketplace: MARKETPLACE,
  });

  try {
    const path = '/paapi5/getitems';
    const response = await fetch(`https://${HOST}${path}`, {
      method: 'POST',
      headers: sign(payload, 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems', path),
      body: payload,
      // Revalidate alongside the rest of the page cache.
      next: { revalidate: 3600 },
    });
    if (!response.ok) return fallback;
    const data = await response.json();
    const items: Record<string, AmazonItem> = { ...fallback };
    for (const item of data?.ItemsResult?.Items || []) {
      const listing = item?.Offers?.Listings?.[0];
      items[item.ASIN] = {
        asin: item.ASIN,
        // DetailPageURL already carries the partner tag.
        url: item.DetailPageURL || amazonLink(item.ASIN),
        title: item?.ItemInfo?.Title?.DisplayValue,
        image: item?.Images?.Primary?.Large?.URL,
        price: listing?.Price?.DisplayAmount,
        priceAmount: listing?.Price?.Amount ?? null,
        currency: listing?.Price?.Currency,
        available: Boolean(listing?.Availability?.Message),
      };
    }
    cache = { items: { ...(cache?.items || {}), ...items }, at: Date.now() };
    return Object.fromEntries(unique.map((a) => [a, items[a]]));
  } catch {
    return fallback;
  }
}
