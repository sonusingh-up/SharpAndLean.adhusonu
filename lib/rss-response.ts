import { stat } from 'node:fs/promises';
import path from 'node:path';
import { getCollections, getReviews } from './data';
import { siteUrl, demoMode } from './config';
import { guides } from './guides';
import { ingredients } from './ingredients';
import { supergut } from './brands/supergut';
import { teamProfile } from './author';
import { feedImageUrl, renderRss, rssEntries, selectRssEntries } from './rss';
import type { RssFeed } from './rss-config';

export async function rssResponse(feed: RssFeed) {
  const now = new Date();
  const [reviews, articles, best, comparisons] = demoMode
    ? [[], [], [], []]
    : await Promise.all([
        getReviews(),
        getCollections('articles'),
        getCollections('best_lists'),
        getCollections('comparisons'),
      ]);
  const entries = demoMode
    ? []
    : rssEntries({
        reviews,
        collections: [...articles, ...best, ...comparisons],
        guides,
        ingredients,
      });
  if (!demoMode)
    entries.push({
      path: supergut.path,
      title: supergut.title,
      summary: supergut.intro,
      published: supergut.published,
      authors: [teamProfile.name],
      topics: ['supplements'],
      category: 'Supplement guides',
      image: supergut.figure.src,
    });
  const selected = selectRssEntries(entries, feed, now);
  const imageLengths = new Map<string, number>();
  const publicRoot = path.resolve(process.cwd(), 'public');
  const origin = new URL(siteUrl).origin;
  await Promise.all(
    [...new Set(selected.map((entry) => feedImageUrl(entry.image, siteUrl)))].map(async (src) => {
      if (!src) return;
      const url = new URL(src);
      if (url.origin !== origin || !url.pathname.startsWith('/images/')) return;
      try {
        const file = path.resolve(publicRoot, `.${decodeURIComponent(url.pathname)}`);
        const relative = path.relative(publicRoot, file);
        if (relative.startsWith('..') || path.isAbsolute(relative)) return;
        const info = await stat(file);
        if (info.isFile()) imageLengths.set(src, info.size);
      } catch {
        // Static hosts may serve public assets outside the function filesystem.
        // Keep the image in Media RSS and the excerpt; never guess an enclosure size.
      }
    }),
  );
  return new Response(renderRss({ entries: selected, feed, siteUrl, now, imageLengths }), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
      'X-Content-Type-Options': 'nosniff',
      ...(demoMode ? { 'X-Robots-Tag': 'noindex, nofollow' } : {}),
    },
  });
}
