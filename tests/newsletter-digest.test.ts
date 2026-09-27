import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recentDigestItems, weeklyDigest } from '../lib/email/digest';
import type { Collection, Review } from '../lib/types';
import type { Guide } from '../lib/guides';

const now = new Date('2026-09-27T08:00:00Z');

test('weekly digest includes only newly published content, not drafts, old or future pages', () => {
  const articles = [
    { title: 'New <article>', summary: 'A useful & brief summary', slug: 'new', published_at: '2026-09-26T00:00:00Z', is_published: true },
    { title: 'Draft', summary: 'Not live', slug: 'draft', published_at: '2026-09-26T00:00:00Z', is_published: false },
    { title: 'Old', summary: 'No longer fresh', slug: 'old', published_at: '2026-09-12T00:00:00Z', is_published: true },
    { title: 'Future', summary: 'Not yet', slug: 'future', published_at: '2026-09-28T00:00:00Z', is_published: true },
  ] as Collection[];
  const reviews = [{ title: 'Review', summary: 'A review', category_slug: 'wellness', slug: 'review', published_at: '2026-09-25T00:00:00Z', is_published: true }] as Review[];
  const guides = [{ title: 'Guide', summary: 'A guide', slug: 'guide', topic: 'Wellness', published: '2026-09-24T00:00:00Z' }] as Guide[];
  const items = recentDigestItems(now, articles, reviews, guides);
  assert.equal(items.length, 3);
  const digest = weeklyDigest(now, items)!;
  assert.equal(digest.name, 'SharpAndLean weekly digest 2026-09-27');
  assert.match(digest.html, /New &lt;article&gt;/);
  assert.match(digest.html, /A useful &amp; brief summary/);
  assert.match(digest.html, /\/images\/logo.png/);
  assert.match(digest.html, /\{\{\{RESEND_UNSUBSCRIBE_URL\}\}\}/);
  assert.doesNotMatch(digest.html, /Draft|Future|Old/);
  assert.match(digest.text, /Unsubscribe:/);
});

test('no new content means no broadcast', () => {
  assert.equal(weeklyDigest(now, recentDigestItems(now, [], [], [])), null);
});
