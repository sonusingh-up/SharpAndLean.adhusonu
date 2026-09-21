import { z } from 'zod';

export const redirectSlug = z.string().min(1).max(140).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export function productSlug(name: string) {
  return name.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 140).replace(/-$/, '');
}
export function validDestination(value: string, siteOrigin?: string) {
  try {
    const u = new URL(value);
    const host = u.hostname.toLowerCase();
    return u.protocol === 'https:' && !u.username && !u.password && !u.port &&
      !/[\s\\]/.test(value) && /^[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,}$/i.test(host) &&
      !/(^|\.)(localhost|local|internal|test|invalid|example)$/.test(host) &&
      host !== 'sharpandlean.com' && !host.endsWith('.sharpandlean.com') &&
      (!siteOrigin || host !== new URL(siteOrigin).hostname.toLowerCase());
  } catch { return false; }
}
export const affiliateRedirectSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().trim().min(2).max(200),
  slug: redirectSlug,
  destination: z.string().trim().min(1).max(4000).refine(v => validDestination(v),
    'Use an external HTTPS affiliate URL, without credentials or a custom port.'),
  enabled: z.boolean(),
});
export type AffiliateRedirect = z.infer<typeof affiliateRedirectSchema> & { id: string };

export function affiliateRedirectResponse(destination: string | null, siteOrigin: string, unavailable = false) {
  const headers = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' };
  if (unavailable) return new Response('Link service is temporarily unavailable.', { status: 503, headers });
  if (!destination || !validDestination(destination, siteOrigin)) {
    return new Response('This recommendation link is unavailable.', { status: 404, headers });
  }
  return new Response(null, { status: 302, headers: { ...headers, Location: destination } });
}
