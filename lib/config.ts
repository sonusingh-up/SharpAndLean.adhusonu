export const supabasePublicKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const hasSupabase = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && supabasePublicKey);
export const demoMode = false;
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
