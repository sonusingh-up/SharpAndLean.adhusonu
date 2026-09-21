import { createClient } from '@supabase/supabase-js';
import { hasSupabase, supabasePublicKey, siteUrl } from '@/lib/config';
import { affiliateRedirectResponse, redirectSlug } from '@/lib/affiliate-redirects';

export const dynamic = 'force-dynamic';
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!redirectSlug.safeParse(slug).success) return affiliateRedirectResponse(null, siteUrl);
  if (!hasSupabase) return affiliateRedirectResponse(null, siteUrl, true);
  try {
    // Do not reuse the editorial client's hour-long cache: destination edits must take effect immediately.
    const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, supabasePublicKey!, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' }) },
    });
    const { data, error } = await db.from('affiliate_redirects').select('destination')
      .eq('slug', slug).eq('enabled', true).maybeSingle();
    return affiliateRedirectResponse(data?.destination ?? null, siteUrl, Boolean(error));
  } catch { return affiliateRedirectResponse(null, siteUrl, true); }
}
