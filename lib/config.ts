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
// Supabase being configured says nothing about where editorial content lives.
// Product pages are assembled from lib/articles/*.ts, so content stays
// file-based unless a deployment opts in explicitly. Keeping the two apart
// lets database-backed tools — the admin CMS and the /recommended redirects —
// run without emptying a site whose reviews are files.
export const contentFromSupabase = hasSupabase && process.env.CONTENT_SOURCE === 'supabase';
// Google Analytics loads only where a measurement ID is configured, so local
// development and preview deployments never report into the property. Demo
// builds stay out of it as well, alongside their noindex.
export const gaId = demoMode ? '' : process.env.NEXT_PUBLIC_GA_ID || '';
