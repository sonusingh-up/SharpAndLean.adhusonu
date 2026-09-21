// Runs the checks that need a running server: the route smoke test and the
// full sitemap validation.
//
// `npm test` chains this after the unit tests. If no server is reachable it
// skips rather than failing, so the unit suite stays usable on its own — with
// one exception: when CI is set, or TEST_ORIGIN was passed explicitly, a
// missing server is a failure rather than a silent pass.
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const origin = process.env.TEST_ORIGIN || 'http://localhost:3000';
const mustRun = Boolean(process.env.CI || process.env.TEST_ORIGIN);

const reachable = await fetch(origin, { signal: AbortSignal.timeout(5000) }).then(
  () => true,
  () => false,
);

if (!reachable) {
  const msg = `No server reachable at ${origin}`;
  if (mustRun) {
    console.error(`${msg} — required because ${process.env.CI ? 'CI' : 'TEST_ORIGIN'} is set.`);
    process.exit(1);
  }
  console.log(`${msg} — skipping live checks. Start the dev server to run them.`);
  process.exit(0);
}

const run = (file) =>
  new Promise((resolve) => {
    const child = spawn(process.execPath, [join(here, file)], {
      stdio: 'inherit',
      env: { ...process.env, TEST_ORIGIN: origin },
    });
    child.on('close', (code) => resolve({ file, code }));
  });

// Both run even if the first fails, so one broken route does not hide another.
const results = [];
for (const file of ['smoke.mjs', 'sitemap.mjs']) {
  console.log(`\n--- ${file} ---`);
  results.push(await run(file));
}

const failed = results.filter((r) => r.code !== 0);
if (failed.length) {
  console.error(`\n${failed.map((f) => f.file).join(', ')} failed.`);
  process.exit(1);
}
console.log('\nLive checks passed.');
