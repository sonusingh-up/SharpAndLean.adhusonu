/*
 * Comparison URLs, kept free of server imports so the client-side compare tray
 * can build the same address the server will accept.
 *
 * A comparison of A and B lives at /compare/a-vs-b with the slugs sorted, so
 * every set of products has exactly one address. The server redirects any
 * other ordering to it, which stops b-vs-a from competing with a-vs-b in search.
 */

export const MAX_COMPARE = 3;
const SEPARATOR = '-vs-';

export function canonicalCompareSlug(slugs: string[]): string {
  return [...new Set(slugs)].sort().join(SEPARATOR);
}

export function comparePath(slugs: string[]): string {
  return `/compare/${canonicalCompareSlug(slugs)}`;
}

/** The product slugs in a comparison slug, or null if it cannot be one. */
export function splitCompareSlug(slug: string): string[] | null {
  const parts = slug.split(SEPARATOR);
  if (parts.length < 2 || parts.length > MAX_COMPARE) return null;
  if (parts.some((p) => !p) || new Set(parts).size !== parts.length) return null;
  return parts;
}
