// Run against a development/preview server with no Supabase credentials.
const origin = process.env.TEST_ORIGIN || 'http://localhost:3000';
// Fixed routes only. Review, guide and comparison URLs are discovered from the
// sitemap below, so this list cannot drift when content slugs change.
const paths = [
  '/',
  '/fat-burners',
  '/nootropics',
  '/wellness',
  '/best',
  '/compare',
  '/author/sumita-bhatti',
  '/about',
  '/contact',
  '/affiliate-disclosure',
  '/medical-disclaimer',
  '/privacy-policy',
  '/terms',
  '/sign-in',
  '/sign-up',
  '/admin',
  '/admin/reviews',
  '/admin/reviews/new',
  '/admin/best-lists/new',
  '/admin/comparisons/new',
  '/admin/articles/new',
  '/admin/media',
  '/admin/subscribers',
  '/admin/community',
  '/admin/login',
  '/robots.txt',
  '/sitemap.xml',
];
// Without Clerk keys the proxy answers every auth route with 503 instead of a
// sign-in redirect, so detect which of the two states the server is running in.
const authRoute = (path) => path.startsWith('/admin') || path === '/sign-in' || path === '/sign-up';
const authConfigured = (await fetch(origin + '/sign-in', { redirect: 'manual' })).status !== 503;

const sitemap = await (await fetch(origin + '/sitemap.xml')).text();
const contentPaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => new URL(match[1]).pathname,
);
if (!contentPaths.length)
  throw new Error('The sitemap listed no pages. Is NEXT_PUBLIC_DEMO_MODE set to true?');
const allPaths = [...new Set([...paths, ...contentPaths])];

const results = [];
for (let start = 0; start < allPaths.length; start += 4) {
  results.push(
    ...(await Promise.all(
      allPaths.slice(start, start + 4).map(async (path) => {
        const response = await fetch(origin + path, { redirect: 'manual' });
        const text = await response.text();
        if (!authConfigured && authRoute(path)) {
          if (response.status !== 503)
            throw new Error(
              `${path}: auth routes must report 503 when Clerk is unconfigured (${response.status})`,
            );
          return path;
        }
        if (path.startsWith('/admin')) {
          if (
            ![302, 303, 307, 308].includes(response.status) ||
            !response.headers.get('location')?.includes('/sign-in')
          )
            throw new Error(
              `${path}: anonymous CMS access was not redirected to sign-in (${response.status})`,
            );
          return path;
        }
        if (response.status !== 200 || text.includes('Module not found'))
          throw new Error(`${path}: ${response.status}`);
        return path;
      }),
    )),
  );
}
const missing = await fetch(origin + '/not-a-real-page');
if (missing.status !== 404) throw new Error('Missing page must return 404');
const newsletter = await fetch(origin + '/api/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'preview-test@example.com', consent: 'yes' }),
});
if (newsletter.status !== 503) throw new Error('Unconfigured newsletter must return 503');
const revalidate = await fetch(origin + '/api/revalidate', { method: 'POST' });
if (revalidate.status !== 401) throw new Error('Unprotected revalidation');
const robots = await (await fetch(origin + '/robots.txt')).text();
// Matches the editorial desk being blocked, or the whole site in demo mode.
if (!/^Disallow: \/(admin)?$/m.test(robots) || !robots.includes('Sitemap:'))
  throw new Error('robots.txt must block the editorial desk and declare the sitemap');
console.log(
  `${results.length} routes checked, including ${
    authConfigured ? 'protected CMS redirects' : 'unavailable auth routes'
  }; 404, preview form failure, revalidation auth and robots checks passed.`,
);
