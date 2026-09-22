import type { ProductArticle } from './types';

import { nowPsylliumHuskPowder } from './now-psyllium-husk-powder';
import { nowLTheanine100Mg } from './now-l-theanine-100-mg';
import { nowGlucomannan575Mg } from './now-glucomannan-575-mg';
import { nowOmega3MolecularlyDistilled } from './now-omega-3-molecularly-distilled';
import { natureMadeVitaminD31000Iu } from './nature-made-vitamin-d3-1000-iu';
import { colonbroomReview2026 } from './colonbroom-review-2026';
import { optimumNutritionUkReview2026 } from './optimum-nutrition-uk-review-2026';
import { myproteinImpactWhey } from './myprotein-impact-whey-review';
import { kineticaWheyProtein } from './kinetica-whey-protein-review';
import { slimsetReview } from './slimset-review';
import { sodameltReview } from './sodamelt-review';
import { yuSleepReview } from './yu-sleep-review';

/**
 * The registry. Publishing an article is two steps: write the file next to
 * this one, then add it here. Nothing else in the codebase needs touching —
 * routes, sitemap, search index and schema all read from this list.
 *
 * Order is display order wherever a list is not explicitly sorted.
 */
export const articles: ProductArticle[] = [
  nowPsylliumHuskPowder,
  nowLTheanine100Mg,
  nowGlucomannan575Mg,
  nowOmega3MolecularlyDistilled,
  natureMadeVitaminD31000Iu,
  colonbroomReview2026,
  optimumNutritionUkReview2026,
  myproteinImpactWhey,
  kineticaWheyProtein,
  slimsetReview,
  sodameltReview,
  yuSleepReview,
];

/* Two articles sharing a slug would silently shadow each other in routing, and
   the symptom (one page serving the other's content) is hard to trace back.
   Fail at import time instead. */
const seen = new Set<string>();
for (const a of articles) {
  if (seen.has(a.slug)) {
    throw new Error(
      `Duplicate article slug "${a.slug}" in lib/articles/index.ts — slugs must be unique.`,
    );
  }
  seen.add(a.slug);
}

export function getArticle(slug: string): ProductArticle | undefined {
  return articles.find((a) => a.slug === slug);
}

export function articlesByCategory(category: string): ProductArticle[] {
  return articles.filter((a) => a.category === category);
}

export type { ProductArticle } from './types';
