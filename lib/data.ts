import { productReviews, editorialCollections } from './products';
import { demoMode, hasSupabase } from './config';
import type { Review, Collection } from './types';
import { publicClient } from './supabase/server';
export async function getReviews(): Promise<Review[]> {
  if (!hasSupabase) return productReviews;
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
