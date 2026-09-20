import 'server-only';
import { create, insertMultiple, search as oramaSearch } from '@orama/orama';
import { getReviews, getCollections } from './data';
import { categories } from './sample';
import { informationPages, categoryGuides } from './editorial-content';

export type SearchHit = {
  title: string;
  summary: string;
  url: string;
  kind: string;
};

const schema = {
  title: 'string',
  summary: 'string',
  body: 'string',
  kind: 'string',
  url: 'string',
} as const;

// Ingredient names on this site are routinely hyphenated — L-Theanine, 5-HTP,
// Alpha-GPC. Orama's default tokenizer keeps "l-theanine" as a single token, so
// a search for "theanine" would miss it. Splitting on every non-alphanumeric
// character indexes both halves and makes those queries work.
const tokenizer = {
  language: 'english',
  normalizationCache: new Map(),
  tokenize: (raw: string) =>
    String(raw)
      .toLowerCase()
      .split(/[^a-z0-9]+/i)
      .filter(Boolean),
};

const strip = (html: string) =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

async function collectDocuments() {
  // Articles are deliberately excluded: the sitemap maps them to /learn/<slug>,
  // but no such route exists, so indexing them would produce results that 404.
  const [reviews, bestLists, comparisons] = await Promise.all([
    getReviews(),
    getCollections('best_lists'),
    getCollections('comparisons'),
  ]);

  return [
    ...reviews.map((r) => ({
      title: r.title,
      summary: r.summary || r.verdict || '',
      body: strip(`${r.product_name} ${r.who_for} ${r.body}`),
      kind: categories.find((c) => c.slug === r.category_slug)?.name || 'Review',
      url: `/${r.category_slug}/${r.slug}`,
    })),
    ...bestLists.map((c) => ({
      title: c.title,
      summary: c.summary,
      body: strip(c.body),
      kind: 'Best-of guide',
      url: `/best/${c.slug}`,
    })),
    ...comparisons.map((c) => ({
      title: c.title,
      summary: c.summary,
      body: strip(c.body),
      kind: 'Comparison',
      url: `/compare/${c.slug}`,
    })),
    ...categories.map((c) => ({
      title: c.name,
      summary: c.description,
      body: strip(categoryGuides[c.slug] || ''),
      kind: 'Category',
      url: `/${c.slug}`,
    })),
    ...Object.entries(informationPages).map(([slug, page]) => ({
      title: page.title,
      summary: page.intro,
      body: strip(page.body),
      kind: 'Page',
      url: `/${slug}`,
    })),
  ];
}

type Index = Awaited<ReturnType<typeof buildIndex>>;
let cached: { index: Index; builtAt: number } | null = null;
const TTL = 5 * 60 * 1000;

async function buildIndex() {
  const db = create({ schema, components: { tokenizer } } as never);
  insertMultiple(db, (await collectDocuments()) as never);
  return db;
}

export async function searchSite(term: string, limit = 8): Promise<SearchHit[]> {
  const query = term.trim();
  if (query.length < 2) return [];
  if (!cached || Date.now() - cached.builtAt > TTL) {
    cached = { index: await buildIndex(), builtAt: Date.now() };
  }
  const result = oramaSearch(cached.index, {
    term: query,
    limit,
    // Titles matter more than a passing mention deep in the body copy.
    boost: { title: 3, summary: 2 },
    properties: ['title', 'summary', 'body'],
  } as never) as unknown as { hits: { document: SearchHit }[] };
  return result.hits.map((h) => ({
    title: h.document.title,
    summary: h.document.summary,
    url: h.document.url,
    kind: h.document.kind,
  }));
}
