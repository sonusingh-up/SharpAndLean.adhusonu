'use server';
import { requireAdmin } from '@/lib/supabase/server';
import { reviewSchema, collectionSchema } from '@/lib/validation';
import { cleanHtml } from '@/lib/content';
import { refreshContent } from '@/lib/revalidate';
export async function saveContent(
  kind: string,
  input: unknown,
): Promise<{ id?: string; error?: string }> {
  try {
    const { db } = await requireAdmin();
    if (kind === 'reviews') {
      const parsed = reviewSchema.parse(input);
      const { ingredients, faqs, ...record } = parsed;
      record.body = cleanHtml(record.body);
      const { data, error } = await db.rpc('save_review', {
        p_data: record,
        p_ingredients: ingredients,
        p_faqs: faqs,
      });
      if (error) throw error;
      refreshContent();
      return { id: data };
    }
    if (!['best_lists', 'comparisons', 'articles'].includes(kind))
      throw new Error('Unsupported content type.');
    const parsed = collectionSchema.parse(input);
    if (
      kind === 'comparisons' &&
      (!parsed.product_a_id || !parsed.product_b_id || parsed.product_a_id === parsed.product_b_id)
    )
      throw new Error('Choose two different products.');
    if (kind === 'best_lists' && parsed.is_published && !parsed.items.length)
      throw new Error('Add at least one product before publishing.');
    if (
      parsed.is_published &&
      (!parsed.body || !parsed.summary || !parsed.seo_title || !parsed.seo_desc)
    )
      throw new Error('Complete content and SEO fields before publishing.');
    const { items, faqs, ...record } = parsed;
    record.body = cleanHtml(record.body);
    const { data, error } = await db.rpc('save_collection', {
      p_kind: kind,
      p_data: record,
      p_items: items,
      p_faqs: faqs,
    });
    if (error) throw error;
    refreshContent();
    return { id: data };
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      const e = error as unknown as { issues: { message: string; path: string[] }[] };
      return {
        error: e.issues
          .map((v) => `${v.path.join('.')}: ${v.message}`)
          .slice(0, 4)
          .join(' · '),
      };
    }
    return { error: error instanceof Error ? error.message : 'The content could not be saved.' };
  }
}
export async function moderate(id: string, approved: boolean) {
  try {
    const { db } = await requireAdmin();
    const { error } = await db
      .from('community_reviews')
      .update({ is_approved: approved, moderation_status: approved ? 'approved' : 'rejected' })
      .eq('id', id);
    if (error) throw error;
    refreshContent();
    return { ok: true };
  } catch {
    return { error: 'The moderation change could not be saved.' };
  }
}
