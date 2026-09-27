import { articles } from '../articles';
import { toReview } from '../articles/to-review';

/**
 * The id a product review is published under, for an editorial's product
 * cards. Resolved from the article registry so it cannot drift when articles
 * are reordered, and it throws at import time rather than render a missing card.
 *
 * lib/products.ts keeps its own copy because importing it here would be circular.
 */
export function reviewIdFor(slug: string): string {
  const index = articles.findIndex((a) => a.slug === slug);
  if (index < 0) throw new Error(`No product article with slug "${slug}" — referenced by an editorial.`);
  return toReview(articles[index], index).id;
}
