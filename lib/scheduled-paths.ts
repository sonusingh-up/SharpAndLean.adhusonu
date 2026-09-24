import { articles } from './articles';
import { ingredients } from './ingredients';
import { guides } from './guides';
import { editorialCollections } from './products';
import { siteUrl } from './config';
import { isLive } from './schedule';

/**
 * Paths of content that exists in the code but is not live yet.
 *
 * Hand-written links — in review bodies, guide callouts, "read next" lists —
 * are plain URLs, so nothing stops a piece from linking to one scheduled after
 * it. Rendering those links would send readers to a 404 and tell crawlers the
 * page exists. The renderers use this to show the link text without the link
 * until the target goes live, at which point the link appears by itself.
 *
 * Kept out of lib/content.ts on purpose: this module imports the content
 * registries, and the registries' import chain must not loop back to it.
 */
export function scheduledPaths(now: number = Date.now()): Set<string> {
  const collectionSection = { best_lists: 'best', comparisons: 'compare', articles: 'learn' };
  return new Set([
    ...articles.filter((a) => !isLive(a.published, now)).map((a) => `/${a.category}/${a.slug}`),
    ...ingredients.filter((i) => !isLive(i.published, now)).map((i) => `/ingredients/${i.slug}`),
    ...guides.filter((g) => !isLive(g.published, now)).map((g) => `/guides/${g.slug}`),
    ...editorialCollections
      .filter((c) => !isLive(c.published_at, now))
      .map((c) => `/${collectionSection[c.kind]}/${c.slug}`),
  ]);
}

/** Whether an href points at a scheduled page on this site. External links never do. */
export function isScheduledHref(href: string | undefined, paths: Set<string>): boolean {
  if (!href || paths.size === 0) return false;
  let path = href;
  if (path.startsWith(siteUrl)) path = path.slice(siteUrl.length) || '/';
  else if (/^https?:\/\/(www\.)?sharpandlean\.com/i.test(path)) path = path.replace(/^https?:\/\/[^/]+/i, '') || '/';
  if (!path.startsWith('/')) return false;
  path = path.split(/[?#]/)[0].replace(/\/+$/, '');
  return paths.has(path);
}
