import { productReviews, productAsins, editorialCollections } from './products';
import { hasSupabase } from './config';
import type { Review, Collection } from './types';
import { publicClient } from './supabase/server';
import { amazonLink, amazonSearchLink, hasAmazonTag } from './amazon';
export async function getReviews(): Promise<Review[]> {
  // With no partner tag configured the affiliate slot stays empty rather than
  // showing an untagged commercial link.
  if (!hasSupabase)
    return productReviews.map((review) => {
      // An article that names its own commercial link keeps it. The Amazon
      // fallback below is a US .com link, so silently replacing a deliberate
      // link would send, say, a UK reader to the wrong marketplace.
      if (review.affiliate_url || !hasAmazonTag) return review;
      const asin = productAsins[review.slug];
      return {
        ...review,
        // A verified ASIN gives a direct listing; otherwise fall back to a
        // tagged search so the link still works and still earns.
        affiliate_url: asin ? amazonLink(asin) : amazonSearchLink(review.product_name),
        affiliate_network: 'Amazon',
      };
    });
  const { data, error } = await publicClient()
    .from('reviews')
    .select('*, categories(slug), ingredients:review_ingredients(*), faqs:review_faqs(*)')
    .eq('is_published', true)
    .order('score', { ascending: false, nullsFirst: false });
  if (error) throw new Error('Reviews could not be loaded.');
  return (data || []).map(
    (r) =>
      ({
        ...r,
        category_slug: r.categories.slug,
        ingredients: r.ingredients.sort(
          (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order,
        ),
        faqs: r.faqs.sort(
          (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order,
        ),
      }) as Review,
  );
}
export async function getCollections(kind: Collection['kind']): Promise<Collection[]> {
  if (!hasSupabase) return editorialCollections.filter((row) => row.kind === kind);
  const select =
    kind === 'best_lists' ? '*, items:best_list_items(*), faqs:best_list_faqs(*)' : '*';
  const { data, error } = await publicClient()
    .from(kind)
    .select(select)
    .eq('is_published', true)
    .order('updated_at', { ascending: false });
  if (error) throw new Error('Content could not be loaded.');
  return ((data || []) as unknown as Record<string, unknown>[]).map((row) => ({
    ...row,
    kind,
  })) as unknown as Collection[];
}
export async function getCategoryData(slug: string) {
  if (!hasSupabase) return null;
  const { data, error } = await publicClient()
    .from('categories')
    .select('*,faqs:category_faqs(*)')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw new Error('Category could not be loaded.');
  return data;
}
export async function getAuthor() {
  if (!hasSupabase) return null;
  const { data, error } = await publicClient()
    .from('authors')
    .select('*')
    .eq('slug', 'sumita-bhatti')
    .maybeSingle();
  if (error) throw new Error('Author could not be loaded.');
  return data;
}
export async function getCommunity(id: string) {
  if (!hasSupabase) return [];
  const { data } = await publicClient()
    .from('community_reviews')
    .select('id,reviewer_name,rating,review_text,created_at')
    .eq('review_id', id)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(50);
  return data || [];
}
