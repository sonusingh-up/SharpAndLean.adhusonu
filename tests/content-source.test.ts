import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Configuring Supabase must not, by itself, move the site off its file-based
// catalogue. getReviews() returns the database rows as-is, so an empty reviews
// table would publish an empty site the moment the keys were set.
test('database-backed tools do not switch editorial content to Supabase', async () => {
  const config = await readFile(new URL('../lib/config.ts', import.meta.url), 'utf8');
  const data = await readFile(new URL('../lib/data.ts', import.meta.url), 'utf8');

  // Content follows an explicit opt-in, never the mere presence of credentials.
  assert.match(config, /contentFromSupabase\s*=\s*hasSupabase\s*&&\s*process\.env\.CONTENT_SOURCE === 'supabase'/);

  // Every editorial reader falls back to files; only the community feed, which
  // has no file equivalent, keys off Supabase being configured at all.
  const editorial = ['getReviews', 'getCollections', 'getCategoryData', 'getAuthor'];
  for (const fn of editorial) {
    const body = data.slice(data.indexOf(`export async function ${fn}`));
    const guard = body.slice(0, body.indexOf('publicClient()'));
    assert.match(guard, /!contentFromSupabase/, `${fn} must gate on the content source`);
    assert.doesNotMatch(guard, /!hasSupabase/, `${fn} must not gate on credentials alone`);
  }

  const community = data.slice(data.indexOf('export async function getCommunity'));
  assert.match(community.slice(0, community.indexOf('publicClient()')), /!hasSupabase/);
});

test('the default deployment keeps content in files', async () => {
  const example = await readFile(new URL('../.env.example', import.meta.url), 'utf8');
  assert.match(example, /^CONTENT_SOURCE=files$/m);
});
