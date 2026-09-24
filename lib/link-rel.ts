/* Kept apart from lib/content.ts so client components can import it without
   pulling sanitize-html (and its postcss dependency) into the browser bundle. */

/* Commission-earning links. `/recommended/` is this site's own affiliate
   redirect namespace, so a body link into it is a paid link even though the
   host is ours. */
const PAID_LINK =
  /clickbank|hop\.clickbank|awin|gurumedia|amzn\.to|amazon\.[a-z.]+[^\s"]*[?&]tag=|\/recommended\//i;

export function isPaidLink(href: string) {
  return PAID_LINK.test(href);
}

/**
 * The `rel` for a link in body copy.
 *
 * Every outbound link is nofollow, including citations. The links are here so a
 * reader can check a figure, which they still can; what the site does not do is
 * hand ranking signal to the manufacturers, retailers and organisations it
 * writes about. Internal links are relative and keep passing equity normally.
 */
export function linkRel(href?: string) {
  if (!href) return 'noopener noreferrer';
  if (isPaidLink(href)) return 'sponsored nofollow noopener noreferrer';
  return /^https?:\/\//i.test(href) ? 'nofollow noopener noreferrer' : 'noopener noreferrer';
}

/**
 * The absolute URL a body link should preview, or undefined for none.
 *
 * In-page jumps, mail and phone links stay plain, and so do affiliate links:
 * previewing one means the server requesting it, which registers a click
 * nobody made. Site-relative links preview the site's own page, resolved
 * against `origin` — pass the canonical origin, not the browser's, which is
 * localhost in development.
 */
export function previewTarget(href: string | undefined, origin: string) {
  if (!href || href.startsWith('#') || isPaidLink(href)) return undefined;
  if (/^https?:\/\//i.test(href)) return href;
  if (href.startsWith('/') && !href.startsWith('//')) {
    try {
      return new URL(href, origin).href;
    } catch {
      return undefined;
    }
  }
  return undefined;
}
