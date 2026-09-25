import type { MetadataRoute } from 'next';
import { siteUrl, demoMode } from '@/lib/config';
import { getReviews, getCollections } from '@/lib/data';
import { authors } from '@/lib/author';
import { ingredients } from '@/lib/ingredients';
import { guides } from '@/lib/guides';
import { allComparePairs } from '@/lib/compare';
import { comparePath } from '@/lib/compare-path';
export const revalidate = 3600;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (demoMode) return [];
  const [reviews, best, comparisons, articles] = await Promise.all([
    getReviews(),
    getCollections('best_lists'),
    getCollections('comparisons'),
    getCollections('articles'),
  ]);
  return [
    ...[
      '',
      '/fat-burners',
      '/nootropics',
      '/wellness',
      '/best',
      '/compare',
      '/about',

      '/contact',
      '/affiliate-disclosure',
      '/medical-disclaimer',
      '/privacy-policy',
      '/terms',
      ...authors.map((a) => `/author/${a.slug}`),
      '/ingredients',
      '/guides',
      '/evidence-grading',
      ...ingredients.map((i) => `/ingredients/${i.slug}`),
      ...guides.map((g) => `/guides/${g.slug}`),
    ].map((path) => ({
      url: siteUrl + path,
      changeFrequency: 'weekly' as const,
      priority: path ? 0.7 : 1,
    })),
    ...reviews.map((r) => ({
      url: `${siteUrl}/${r.category_slug}/${r.slug}`,
      lastModified: r.updated_at,
    })),
    // Generated head-to-heads. A pair an editorial page already covers
    // redirects there, so it is left out rather than listed twice.
    ...allComparePairs(reviews.filter((r) => !r.is_sample))
      .filter(
        (pair) =>
          !comparisons.some((c) =>
            pair.every((r) => r.id === c.product_a_id || r.id === c.product_b_id),
          ),
      )
      .map((pair) => ({
        url: siteUrl + comparePath(pair.map((r) => r.slug)),
        lastModified: pair
          .map((r) => r.updated_at)
          .sort()
          .at(-1),
      })),
    ...[...best, ...comparisons, ...articles].map((c) => ({
      url: `${siteUrl}/${c.kind === 'best_lists' ? 'best' : c.kind === 'comparisons' ? 'compare' : 'learn'}/${c.slug}`,
      lastModified: c.updated_at,
    })),
  ];
}
