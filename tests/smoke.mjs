// Run against a development/preview server with no Supabase credentials.
const origin = process.env.TEST_ORIGIN || 'http://localhost:3000';
const paths = [
  '/',
  '/fat-burners',
  '/nootropics',
  '/wellness',
  '/fat-burners/daily-balance-review',
  '/best',
  '/best/sample-shortlist',
  '/compare',
  '/compare/daily-balance-vs-metabolic-support',
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
  '/admin/reviews/sample-1',
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
const results = [];
for (let start = 0; start < paths.length; start += 4) {
  results.push(
    ...(await Promise.all(
      paths.slice(start, start + 4).map(async (path) => {
        const response = await fetch(origin + path, { redirect: 'manual' });
        const text = await response.text();
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
if (!robots.includes('Disallow: /')) throw new Error('Preview must block indexing');
console.log(
  `${results.length} routes checked, including protected CMS redirects; 404, preview form failure, revalidation auth and robots checks passed.`,
);
