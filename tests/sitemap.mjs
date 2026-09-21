// Fetches every URL in the generated sitemap and asserts each returns 200.
//
// The existing smoke test discovers review URLs from the sitemap but checks a
// fixed list of everything else. This one checks the whole sitemap, so a
// mapping that emits a URL no route serves is caught rather than assumed.
//
// Run against a dev or preview server: node tests/sitemap.mjs
const origin = process.env.TEST_ORIGIN || 'http://localhost:3000';

const res = await fetch(`${origin}/sitemap.xml`);
if (!res.ok) {
  console.error(`sitemap.xml returned ${res.status}`);
  process.exit(1);
}
const xml = await res.text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

if (!urls.length) {
  console.error('sitemap.xml contained no <loc> entries');
  process.exit(1);
}

// The sitemap is built from siteUrl, which may not match the host under test.
const toLocal = (u) => origin + new URL(u).pathname;

const failures = [];
const seen = new Set();
for (const url of urls) {
  const path = new URL(url).pathname;
  if (seen.has(path)) {
    failures.push({ path, status: 'DUPLICATE' });
    continue;
  }
  seen.add(path);
  try {
    const r = await fetch(toLocal(url), { redirect: 'manual' });
    if (r.status !== 200) failures.push({ path, status: r.status });
  } catch (err) {
    failures.push({ path, status: err.message });
  }
}

const grouped = urls.reduce((acc, u) => {
  const seg = new URL(u).pathname.split('/')[1] || '(home)';
  acc[seg] = (acc[seg] || 0) + 1;
  return acc;
}, {});

console.log(`${urls.length} sitemap URLs checked across ${Object.keys(grouped).length} sections:`);
console.log(
  Object.entries(grouped)
    .sort()
    .map(([k, v]) => `  ${k}: ${v}`)
    .join('\n'),
);

if (failures.length) {
  console.error(`\n${failures.length} broken sitemap entries:`);
  for (const f of failures) console.error(`  ${f.status}  ${f.path}`);
  process.exit(1);
}
console.log('\nAll sitemap URLs resolved to 200.');
