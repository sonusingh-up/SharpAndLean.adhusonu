'use server';
import { requireAdmin } from '@/lib/supabase/server';
import { affiliateRedirectSchema, validDestination } from '@/lib/affiliate-redirects';
import { siteUrl } from '@/lib/config';
import { revalidatePath } from 'next/cache';

export async function saveAffiliateRedirect(input: unknown): Promise<{ error?: string; ok?: boolean }> {
  try {
    const { db } = await requireAdmin();
    const parsed = affiliateRedirectSchema.safeParse(input);
    if (!parsed.success) return { error: parsed.error.issues[0].message };
    const { id, ...record } = parsed.data;
    if (!validDestination(record.destination, siteUrl)) return { error: 'The destination must be on an external website.' };
    // Editing never renames a public URL or overwrites another product's slug.
    const result = id
      ? await db.from('affiliate_redirects').update({ name: record.name, destination: record.destination, enabled: record.enabled }).eq('id', id).select('id').single()
      : await db.from('affiliate_redirects').insert(record).select('id').single();
    if (result.error) return { error: result.error.code === '23505'
      ? 'That URL is already in use. Choose another slug.'
      : 'Could not save the link. Check editor access and apply migration 003_affiliate_redirects.sql.' };
    revalidatePath('/admin/affiliate-links');
    return { ok: true };
  } catch { return { error: 'Could not save. Sign in with an approved editor account and try again.' }; }
}
