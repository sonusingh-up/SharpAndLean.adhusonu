export const supabasePublicKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const hasSupabase = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && supabasePublicKey);
export const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
// Canonical URLs, Open Graph URLs, the sitemap and every JSON-LD @id derive
// from this. Without the explicit variable a Vercel deployment would otherwise
// publish canonicals pointing at localhost, so fall back to the deployment URL
// before the local default.
const vercelHost =
  process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  process.env.NEXT_PUBLIC_VERCEL_URL ||
  process.env.VERCEL_URL;
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (vercelHost ? `https://${vercelHost}` : '') ||
  'http://localhost:3000'
).replace(/\/+$/, '');
