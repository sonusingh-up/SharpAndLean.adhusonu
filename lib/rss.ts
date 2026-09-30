import sanitizeHtml from 'sanitize-html';
import { authorProfile, teamProfile } from './author';
import type { Review, Collection } from './types';
import type { Guide } from './guides';
import type { IngredientPage } from './ingredients';
import { rssFeeds, type RssFeed, type RssTopic } from './rss-config';

export type RssEntry = {
  path: string;
  title: string;
  summary: string;
  intro?: string;
  published: string | null;
  authors: string[];
  topics: RssTopic[];
  category: string;
  image?: string;
};

type Sources = {
  reviews: Review[];
  collections: Collection[];
  guides: Guide[];
  ingredients: IngredientPage[];
};

export function rssEntries({ reviews, collections, guides, ingredients }: Sources): RssEntry[] {
  return [
    ...reviews
      .filter((r) => r.is_published && !r.is_sample)
      .map((r): RssEntry => ({
        path: `/${r.category_slug}/${r.slug}`,
        title: r.seo_title || r.title,
        summary: r.summary,
        intro: r.body.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i)?.[1],
        published: r.published_at,
        authors: [
          (r.written_by ?? (r.is_label_overview ? 'team' : 'clinician')) === 'team'
            ? teamProfile.name
            : authorProfile.name,
        ],
        topics: ['supplements'],
        category: r.is_label_overview ? 'Supplement label overviews' : 'Supplement reviews',
        image: r.og_image_url || r.result_image?.src || r.featured_image_url || undefined,
      })),
    ...collections
      .filter((c) => c.is_published)
      .map((c): RssEntry => {
        const isLearn = c.kind === 'articles';
        const topics: RssTopic[] = !isLearn
          ? ['supplements']
          : c.topic === 'fitness'
            ? ['fitness']
            : c.topic === 'food'
              ? ['nutrition']
              : c.topic === 'vitamins' || c.topic === 'weight-loss'
                ? ['nutrition', 'supplements']
                : [];
        // This article is filed under training on the site and belongs in food/nutrition too.
        if (c.slug === 'how-much-protein-should-a-beginner-eat') topics.push('nutrition');
        return {
          path: `/${isLearn ? 'learn' : c.kind === 'best_lists' ? 'best' : 'compare'}/${c.slug}`,
          title: c.title,
          summary: c.summary,
          intro: c.body.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i)?.[1],
          published: c.published_at,
          authors: c.authors?.length ? c.authors.map((a) => a.name) : [teamProfile.name],
          topics,
          category: isLearn
            ? (c.topic ?? 'Learn')
            : c.kind === 'best_lists'
              ? 'Buying guides'
              : 'Comparisons',
          image: c.figure?.src,
        };
      }),
    ...guides.map((g): RssEntry => ({
      path: `/guides/${g.slug}`,
      title: g.title,
      summary: g.summary,
      intro: g.hook,
      published: g.published,
      authors: [teamProfile.name],
      topics: ['supplements'],
      category: g.topic || 'Supplement guides',
    })),
    ...ingredients.map((i): RssEntry => ({
      path: `/ingredients/${i.slug}`,
      title: i.seoTitle || `${i.name}: evidence, dosage and safety`,
      summary: i.quickAnswer,
      intro: i.whatIsIt,
      // An update is not a publication. Undated pages stay out until an editor supplies a date.
      published:
        i.history?.find((event) => /\b(first published|published)\b/i.test(event.note))?.date ??
        null,
      authors: [teamProfile.name],
      topics: ['supplements'],
      category: 'Ingredient evidence',
      image: i.figure?.src,
    })),
  ];
}

/** Remove characters XML 1.0 cannot represent, while keeping emoji/supplementary Unicode. */
export function xmlText(value: string) {
  return value
    .replace(/[^\x09\x0A\x0D\x20-\uD7FF\uE000-\uFFFD\u{10000}-\u{10FFFF}]/gu, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function feedImageUrl(src: string | undefined, siteUrl: string) {
  if (!src) return undefined;
  try {
    const url = new URL(src, siteUrl);
    return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password
      ? url.href
      : undefined;
  } catch {
    return undefined;
  }
}

export function imageMime(src: string) {
  const extension = new URL(src).pathname.split('.').at(-1)?.toLowerCase();
  return (
    {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      gif: 'image/gif',
      avif: 'image/avif',
      svg: 'image/svg+xml',
    } as Record<string, string>
  )[extension ?? ''];
}

export function selectRssEntries(entries: RssEntry[], feed: RssFeed, now = new Date()) {
  const seen = new Set<string>();
  return entries
    .filter((entry) => {
      const time = Date.parse(entry.published ?? '');
      if (!Number.isFinite(time) || time > now.getTime() || !entry.title.trim()) return false;
      if (feed !== 'all' && !entry.topics.includes(feed)) return false;
      // Feed links must remain local canonical content, never off-site or protocol-relative.
      if (!entry.path.startsWith('/') || entry.path.startsWith('//') || entry.path.includes('\\'))
        return false;
      if (seen.has(entry.path)) return false;
      seen.add(entry.path);
      return true;
    })
    .sort(
      (a, b) => Date.parse(b.published!) - Date.parse(a.published!) || a.path.localeCompare(b.path),
    );
}

function excerpt(entry: RssEntry) {
  const text = (html: string) =>
    sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).trim();
  const summary = text(entry.summary);
  const intro = text(entry.intro || '');
  // Keep the author's actual words, not generated filler to satisfy a character count.
  return `<p>${summary}</p>${summary.length < 300 && intro && intro !== summary ? `<p>${intro}</p>` : ''}`;
}

export function renderRss({
  entries,
  feed,
  siteUrl,
  now = new Date(),
  imageLengths = new Map(),
}: {
  entries: RssEntry[];
  feed: RssFeed;
  siteUrl: string;
  now?: Date;
  /** Known byte lengths only. Remote media remains valid Media RSS, without an invented size. */
  imageLengths?: Map<string, number>;
}) {
  const info = rssFeeds[feed];
  const feedUrl = new URL(info.path, siteUrl).href;
  const items = selectRssEntries(entries, feed, now).map((entry) => {
    const url = new URL(entry.path, siteUrl).href;
    const image = feedImageUrl(entry.image, siteUrl);
    const mime = image ? imageMime(image) : undefined;
    const length = image ? imageLengths.get(image) : undefined;
    const description = `${image ? `<p><img src="${xmlText(image)}" alt="${xmlText(entry.title)}" /></p>` : ''}${excerpt(entry)}`;
    return `    <item>
      <title>${xmlText(entry.title)}</title>
      <link>${xmlText(url)}</link>
      <guid isPermaLink="true">${xmlText(url)}</guid>
      <pubDate>${new Date(entry.published!).toUTCString()}</pubDate>
      <dc:creator>${xmlText(entry.authors.join(', '))}</dc:creator>
      <category>${xmlText(entry.category)}</category>
      <description>${xmlText(description)}</description>${
        image
          ? `
      <media:content url="${xmlText(image)}" medium="image"${mime ? ` type="${mime}"` : ''} />
      <media:thumbnail url="${xmlText(image)}" />`
          : ''
      }${
        image && mime && length !== undefined
          ? `
      <enclosure url="${xmlText(image)}" type="${mime}" length="${length}" />`
          : ''
      }
    </item>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${xmlText(info.title)}</title>
    <link>${xmlText(new URL('/', siteUrl).href)}</link>
    <description>${xmlText(info.description)}</description>
    <language>en-GB</language>
    <atom:link href="${xmlText(feedUrl)}" rel="self" type="application/rss+xml" />
    <lastBuildDate>${now.toUTCString()}</lastBuildDate>
    <ttl>60</ttl>
${items.join('\n')}
  </channel>
</rss>
`;
}
