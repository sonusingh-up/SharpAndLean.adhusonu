import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { isLive, slot, PUBLISH_SLOTS, PUBLISH_UTC_OFFSET } from '../lib/schedule';
import { ingredients, liveIngredients } from '../lib/ingredients';
import { guides } from '../lib/guides';
import { articles } from '../lib/articles';
import { editorialCollections } from '../lib/products';
import { scheduledPaths, isScheduledHref } from '../lib/scheduled-paths';

const root = new URL('../', import.meta.url);

test('publish times: absent is live, future is hidden, unparseable is hidden', () => {
  const now = Date.parse('2026-09-25T00:00:00Z');
  assert.equal(isLive(undefined, now), true);
  assert.equal(isLive('2026-09-24T23:59:59Z', now), true);
  assert.equal(isLive('2026-09-25T00:00:00Z', now), true);
  assert.equal(isLive('2026-09-25T00:00:01Z', now), false);
  // A typo must hide a page, never publish it early.
  assert.equal(isLive('2026-13-45', now), false);
});

test('slot() writes the offset, so a slot means the same instant everywhere', () => {
  assert.equal(slot('2026-09-25', 1), `2026-09-25T09:00:00${PUBLISH_UTC_OFFSET}`);
  assert.equal(Date.parse(slot('2026-09-25', 1)), Date.parse('2026-09-25T03:30:00Z'));
  assert.throws(() => slot('25/09/2026', 1));
});

test('every publish time in the content parses', () => {
  const dates: [string, string | undefined][] = [
    ...articles.map((a) => [`article ${a.slug}`, a.published] as [string, string | undefined]),
    ...ingredients.map((i) => [`ingredient ${i.slug}`, i.published] as [string, string | undefined]),
    ...guides.map((g) => [`guide ${g.slug}`, g.published] as [string, string | undefined]),
    ...editorialCollections.map((c) => [`collection ${c.slug}`, c.published_at] as [string, string | undefined]),
  ];
  for (const [what, date] of dates) {
    if (date === undefined) continue;
    // An unparseable date silently hides a page forever; fail loudly instead.
    assert.ok(Number.isFinite(Date.parse(date)), `${what} has an unparseable publish time "${date}"`);
  }
});

test('a scheduled ingredient is hidden before its slot and shown after it', () => {
  const scheduled = ingredients.find((i) => i.published && Date.parse(i.published) > Date.parse('2026-01-01'));
  if (!scheduled?.published) return; // nothing queued right now
  const at = Date.parse(scheduled.published);
  assert.ok(!liveIngredients(at - 1).some((i) => i.slug === scheduled.slug));
  assert.ok(liveIngredients(at).some((i) => i.slug === scheduled.slug));

  const before = scheduledPaths(at - 1);
  assert.ok(isScheduledHref(`/ingredients/${scheduled.slug}`, before));
  assert.ok(isScheduledHref(`https://sharpandlean.com/ingredients/${scheduled.slug}#dose`, before));
  assert.ok(!isScheduledHref(`/ingredients/${scheduled.slug}`, scheduledPaths(at)));
  assert.ok(!isScheduledHref('https://example.com/ingredients/x', before));
});

test('reviews and collections are filtered by publish time at the source', async () => {
  const data = await readFile(new URL('lib/data.ts', root), 'utf8');
  assert.match(data, /export async function getReviews[\s\S]*?\.filter\(\(r\) => isLive\(r\.published_at\)\)/);
  assert.match(data, /export async function getCollections[\s\S]*?\.filter\(\(c\) => isLive\(c\.published_at\)\)/);
});

// The leak this whole feature exists to prevent: a page that reads the full
// registry instead of the live one would list a scheduled page early.
test('nothing a reader can see imports the unfiltered ingredient or guide lists', async () => {
  const allowed = new Set(['lib/ingredients.ts', 'lib/guides.ts', 'lib/scheduled-paths.ts']);
  const files: string[] = [];
  for (const dir of ['app', 'components', 'lib']) {
    for (const entry of await readdir(new URL(`${dir}/`, root), { recursive: true })) {
      if (/\.(ts|tsx)$/.test(entry)) files.push(`${dir}/${entry.replace(/\\/g, '/')}`);
    }
  }
  for (const file of files) {
    if (allowed.has(file)) continue;
    const source = await readFile(new URL(file, root), 'utf8');
    for (const match of source.matchAll(/import\s*\{([^}]*)\}\s*from\s*'[^']*\/(ingredients|guides)'/g)) {
      const names = match[1].split(',').map((n) => n.trim().replace(/^type\s+/, ''));
      assert.ok(
        !names.includes('ingredients') && !names.includes('guides'),
        `${file} imports the unfiltered ${match[2]} list; use live${match[2] === 'guides' ? 'Guides' : 'Ingredients'}()`,
      );
    }
  }
});

test('the GitHub workflow fires at exactly the publish slots', async () => {
  const workflow = await readFile(new URL('.github/workflows/publish-slots.yml', root), 'utf8');
  const cron = workflow.match(/cron:\s*'(\d+) ([\d,]+) \* \* \*'/);
  assert.ok(cron, 'publish-slots.yml must have a daily cron line');
  const minute = Number(cron[1]);
  const fired = cron[2].split(',').map((h) => Number(h) * 60 + minute).sort((a, b) => a - b);

  const [sign, hh, mm] = PUBLISH_UTC_OFFSET.match(/([+-])(\d\d):(\d\d)/)!.slice(1);
  const offset = (sign === '-' ? -1 : 1) * (Number(hh) * 60 + Number(mm));
  const expected = PUBLISH_SLOTS.map((s) => {
    const [h, m] = s.split(':').map(Number);
    return (((h * 60 + m - offset) % 1440) + 1440) % 1440;
  }).sort((a, b) => a - b);

  assert.deepEqual(fired, expected);
});
