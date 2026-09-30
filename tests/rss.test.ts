import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { productReviews, editorialCollections } from '../lib/products';
import { guides } from '../lib/guides';
import { ingredients } from '../lib/ingredients';
import { rssFeeds } from '../lib/rss-config';
import {
  feedImageUrl,
  renderRss,
  rssEntries,
  selectRssEntries,
  xmlText,
  type RssEntry,
} from '../lib/rss';

const now = new Date('2026-09-30T12:00:00Z');
const siteUrl = 'https://sharpandlean.com';
const sources = { reviews: productReviews, collections: editorialCollections, guides, ingredients };
const entries = rssEntries(sources);
const example: RssEntry = {
  path: '/learn/example',
  title: 'Fruit & fitness <explained>',
  summary: 'A useful starting point.',
  intro: 'A longer introduction written by the editorial team.',
  published: '2026-09-30T00:00:00Z',
  authors: ['A & B'],
  topics: ['fitness'],
  category: 'Fitness',
  image: '/images/fitness/glute-bridge-correct-form.png',
};

test('RSS has a master endpoint and three independently addressable topic endpoints', async () => {
  for (const [key, feed] of Object.entries(rssFeeds)) {
    const source = await readFile(new URL(`../app${feed.path}/route.ts`, import.meta.url), 'utf8');
    assert.ok(source.includes(`rssResponse('${key}')`));
    assert.match(source, /revalidate = 600/);
  }
});

test('topic feeds include matching content without losing articles from the master feed', () => {
  const all = selectRssEntries(entries, 'all', now);
  const fitness = selectRssEntries(entries, 'fitness', now);
  const nutrition = selectRssEntries(entries, 'nutrition', now);
  const supplements = selectRssEntries(entries, 'supplements', now);
  assert.ok(all.length >= 20);
  assert.ok(fitness.some((e) => e.path === '/learn/how-to-do-a-glute-bridge'));
  assert.ok(nutrition.some((e) => e.path === '/learn/how-much-protein-should-a-beginner-eat'));
  assert.ok(nutrition.some((e) => e.path === '/learn/eating-prunes-every-day-for-a-week'));
  assert.ok(supplements.some((e) => e.path === '/guides/what-a-supplement-label-hides'));
  assert.ok(supplements.some((e) => e.path.startsWith('/ingredients/')));
  assert.ok(supplements.some((e) => e.path.startsWith('/wellness/')));
  assert.ok(!nutrition.some((e) => e.path === '/learn/how-to-do-a-glute-bridge'));
  for (const group of [fitness, nutrition, supplements]) {
    assert.ok(group.every((e) => all.some((a) => a.path === e.path)));
  }
});

test('drafts and sample reviews are excluded before syndication', () => {
  const result = rssEntries({
    ...sources,
    guides: [],
    ingredients: [],
    reviews: [
      { ...productReviews[0], is_published: false },
      { ...productReviews[0], is_sample: true },
    ],
    collections: [{ ...editorialCollections[0], is_published: false }],
  });
  assert.equal(result.length, 0);
});

test('date filtering keeps real older dates and excludes undated, invalid and future entries', () => {
  const result = selectRssEntries(
    [
      example,
      { ...example },
      { ...example, path: '/old', published: '2020-01-01' },
      { ...example, path: '/missing', published: null },
      { ...example, path: '/invalid', published: 'not a date' },
      { ...example, path: '/future', published: '2027-01-01' },
      { ...example, path: '//unrelated.example/story' },
    ],
    'all',
    now,
  );
  assert.deepEqual(
    result.map((e) => e.path),
    [example.path, '/old'],
  );
  assert.equal(result[1].published, '2020-01-01');
});

test('an ingredient update date is never substituted for a missing publication date', () => {
  const result = rssEntries({
    reviews: [],
    collections: [],
    guides: [],
    ingredients: [{ ...ingredients[0], history: undefined, updated: '2026-09-30' }],
  });
  assert.equal(result[0].published, null);
  assert.equal(selectRssEntries(result, 'all', now).length, 0);
});

test('RSS includes escaped XML, canonical GUIDs, actual authors and publication dates', () => {
  const xml = renderRss({ entries: [example], feed: 'fitness', siteUrl, now });
  assert.match(xml, /<rss version="2.0"/);
  assert.match(xml, /Fruit &amp; fitness &lt;explained&gt;/);
  assert.match(xml, /<dc:creator>A &amp; B<\/dc:creator>/);
  assert.match(xml, /<guid isPermaLink="true">https:\/\/sharpandlean.com\/learn\/example<\/guid>/);
  assert.match(xml, /<pubDate>Wed, 30 Sep 2026 00:00:00 GMT<\/pubDate>/);
  assert.match(xml, /atom:link href="https:\/\/sharpandlean.com\/feeds\/fitness.xml"/);
  assert.equal(xmlText('Hello\u0000\u000b & 🥑'), 'Hello &amp; 🥑');
  assert.ok(!xml.includes('localhost'));
});

test('images are absolute and only verified byte lengths become enclosures', () => {
  const image = new URL(example.image!, siteUrl).href;
  const withoutSize = renderRss({ entries: [example], feed: 'all', siteUrl, now });
  assert.ok(withoutSize.includes(`<media:content url="${image}" medium="image" type="image/png"`));
  assert.ok(!withoutSize.includes('<enclosure'));
  const withSize = renderRss({
    entries: [example],
    feed: 'all',
    siteUrl,
    now,
    imageLengths: new Map([[image, 947031]]),
  });
  assert.ok(withSize.includes(`<enclosure url="${image}" type="image/png" length="947031"`));
  for (const unsafe of [
    'javascript:alert(1)',
    'data:image/png;base64,abc',
    'https://user:secret@example.com/a.jpg',
  ]) {
    assert.equal(feedImageUrl(unsafe, siteUrl), undefined);
  }
});

test('HTML in excerpts is stripped and cannot become active script in a feed reader', () => {
  const xml = renderRss({
    entries: [
      {
        ...example,
        summary: 'Safe <script>alert(1)</script><img src=x onerror=alert(2)> text & more',
      },
    ],
    feed: 'all',
    siteUrl,
    now,
  });
  assert.ok(!xml.includes('alert('));
  assert.ok(!xml.includes('onerror'));
  assert.ok(xml.includes('text &amp;amp; more')); // XML decodes to HTML, then the reader decodes HTML entities.
  assert.ok(xml.includes(example.intro!));
});

test('feed discovery survives page-level canonical metadata', async () => {
  const layout = await readFile(new URL('../app/layout.tsx', import.meta.url), 'utf8');
  const seo = await readFile(new URL('../components/seo.tsx', import.meta.url), 'utf8');
  assert.ok(layout.includes('alternates: { types: rssAlternates }'));
  assert.ok(seo.includes('alternates: { canonical: path, types: rssAlternates }'));
});
