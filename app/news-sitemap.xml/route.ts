import { siteUrl, demoMode } from '@/lib/config';
import { getReviews, getCollections } from '@/lib/data';

/**
 * Google News sitemap.
 *
 * Separate from sitemap.xml because it answers a different question: not "what
 * exists here" but "what was published in the last two days". Google is
 * explicit that URLs older than that must drop out, so this file is usually
 * short and is frequently empty. An empty news sitemap is valid and is the
 * correct state for a site that does not publish daily — it is not a bug to be
 * fixed by widening the window.
 *
 * Revalidated every ten minutes so a newly published article becomes visible to
 * Google News well inside its own two-day window.
 */
export const revalidate = 600;

const WINDOW_MS = 2 * 24 * 60 * 60 * 1000;
/** Google's limit is 1,000 news entries per sitemap. */
const MAX_ENTRIES = 1000;

/** Publication name must match how the site appears on news.google.com. */
const PUBLICATION_NAME = 'SharpAndLean';
const PUBLICATION_LANGUAGE = 'en';

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

type NewsEntry = { path: string; title: string; published: string };

function entry({ path, title, published }: NewsEntry) {
  return `  <url>
    <loc>${escapeXml(new URL(path, siteUrl).href)}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(PUBLICATION_NAME)}</news:name>
        <news:language>${PUBLICATION_LANGUAGE}</news:language>
      </news:publication>
      <news:publication_date>${published}</news:publication_date>
      <news:title>${escapeXml(title)}</news:title>
    </news:news>
  </url>`;
}

export async function GET() {
  const headers = {
    'Content-Type': 'application/xml; charset=utf-8',
    'Cache-Control': 'public, max-age=0, s-maxage=600, stale-while-revalidate=3600',
  };

  const render = (entries: NewsEntry[]) =>
    new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${entries.map(entry).join('\n')}
</urlset>
`,
      { headers },
    );

  if (demoMode) return render([]);

  const [reviews, best, comparisons, articles] = await Promise.all([
    getReviews(),
    getCollections('best_lists'),
    getCollections('comparisons'),
    getCollections('articles'),
  ]);

  const cutoff = Date.now() - WINDOW_MS;
  const candidates: NewsEntry[] = [
    ...reviews.map((r) => ({
      path: `/${r.category_slug}/${r.slug}`,
      title: r.seo_title || r.title,
      published: r.published_at,
    })),
    ...best.map((c) => ({ path: `/best/${c.slug}`, ...common(c) })),
    ...comparisons.map((c) => ({ path: `/compare/${c.slug}`, ...common(c) })),
    ...articles.map((c) => ({ path: `/learn/${c.slug}`, ...common(c) })),
  ].filter((e): e is NewsEntry => Boolean(e.published));

  const fresh = candidates
    .filter((e) => {
      const at = Date.parse(e.published);
      return Number.isFinite(at) && at >= cutoff;
    })
    .sort((a, b) => Date.parse(b.published) - Date.parse(a.published))
    .slice(0, MAX_ENTRIES)
    // W3C format. Dates are stored as ISO strings already; normalise anything
    // that is only a date so Google never receives an ambiguous value.
    .map((e) => ({ ...e, published: new Date(e.published).toISOString() }));

  return render(fresh);
}

function common(c: { seo_title: string; title: string; published_at: string | null }) {
  return { title: c.seo_title || c.title, published: c.published_at ?? '' };
}
