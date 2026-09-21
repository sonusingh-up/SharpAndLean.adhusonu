import type { Collection } from './types';
import { articles } from './articles';
import { toReview } from './articles/to-review';

/*
 * Product pages are assembled from lib/articles/*.ts — one file per article,
 * registered in lib/articles/index.ts. This module only adapts them to the
 * Review shape the components consume, and holds the editorial collections,
 * which are not product articles.
 */

export const productReviews = articles.map(toReview);

export const productAsins: Record<string, string> = Object.fromEntries(
  articles.filter((a) => a.asin).map((a) => [a.slug, a.asin as string]),
);

export const editorialCollections: Collection[] = [
  {
    id: 'label-shortlist',
    kind: 'best_lists',
    title: 'How to build a supplement shortlist',
    slug: 'build-a-supplement-shortlist',
    summary: 'A practical selection method: purpose, disclosed amounts, evidence and total cost.',
    body: '<h2>Start with the question</h2><p>Write down the purpose before selecting a brand. A fibre powder, a relaxation formula and a vitamin have different jobs and should not compete for one best-product score.</p><h2>Build a comparable list</h2><p>Record the serving size, ingredient amounts, bottle count and cost per serving. Match the actual strength and form before comparing prices. Keep a link to the manufacturer label beside each entry.</p><h2>Check what is missing</h2><p>Ask whether a research citation concerns the finished formula. Record testing documents by batch and date. If a label hides individual doses, record that uncertainty.</p><h2>Read the product overviews</h2><p><a href="/fat-burners/now-psyllium-husk-powder">NOW Psyllium Husk Powder</a>, <a href="/nootropics/now-l-theanine-100-mg">NOW L-Theanine 100 mg</a> and <a href="/wellness/nature-made-vitamin-d3-1000-iu">Nature Made Vitamin D3 1000 IU</a> illustrate different label questions. This list is not a ranking.</p>',
  },
  {
    id: 'label-comparison',
    kind: 'comparisons',
    title: 'Compare supplements without mixing up doses',
    slug: 'compare-labels-and-serving-costs',
    summary:
      'Separate capsule count, daily serving and ingredient amount before deciding which listing offers value.',
    body: '<h2>Price per bottle misses the point</h2><p>Divide the bottle price by the number of labelled servings. A 60-capsule bottle taken two capsules at a time contains 30 servings. A 30-capsule bottle taken one at a time also contains 30. Delivery charges and subscription conditions still affect the final cost.</p><h2>Match the formula</h2><p>Compare the exact form, strength and ingredient list. A product containing L-theanine plus green tea is different from pure L-theanine. A vitamin D bottle with a different strength is a different comparison even if the packaging looks similar.</p><h2>Keep evidence separate</h2><p>A cheaper serving is not proof of better effectiveness. Compare the relevance of the research independently, then consider testing documentation and practical use. Mark unverified details clearly.</p><h2>Check the source</h2><p>Use the manufacturer information linked in each product overview and compare it with the package offered by the seller. Marketplace listing titles can combine variants.</p>',
  },
].map((row) => ({
  ...row,
  kind: row.kind as Collection['kind'],
  is_published: true,
  seo_title: row.title,
  seo_desc: row.summary,
  published_at: '2026-09-20T00:00:00Z',
  updated_at: '2026-09-20T00:00:00Z',
}));
