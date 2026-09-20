import type { MetadataRoute } from 'next';
import { siteUrl, demoMode } from '@/lib/config';
import { getReviews, getCollections } from '@/lib/data';
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
      '/author/sumita-bhatti',
      '/contact',
      '/affiliate-disclosure',
      '/medical-disclaimer',
      '/privacy-policy',
      '/terms',
    ].map((path) => ({
      url: siteUrl + path,
      changeFrequency: 'weekly' as const,
      priority: path ? 0.7 : 1,
    })),
    ...reviews.map((r) => ({
      url: `${siteUrl}/${r.category_slug}/${r.slug}`,
      lastModified: r.updated_at,
    })),
    ...[...best, ...comparisons, ...articles].map((c) => ({
      url: `${siteUrl}/${c.kind === 'best_lists' ? 'best' : c.kind === 'comparisons' ? 'compare' : 'learn'}/${c.slug}`,
      lastModified: c.updated_at,
    })),
  ];
}
