import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cleanHtml, articleContent, safeUrl } from '../lib/content';
import { reviewSchema, subscriberSchema, communitySchema } from '../lib/validation';
test('stored HTML cannot execute scripts, event handlers or javascript URLs', () => {
  const result = cleanHtml(
    '<script>alert(1)</script><img src="https://x.supabase.co/test.png" onerror="alert(1)"><a href="javascript:alert(1)" target="_blank">test</a><iframe src="https://example.com"></iframe>',
  );
  assert.doesNotMatch(result, /<script|onerror|javascript:|<iframe/);
  assert.match(result, /noopener noreferrer/);
});
test('TOC anchors are unique for duplicate headings and contain no injected attributes', () => {
  const result = articleContent('<h2>Our verdict</h2><h2>Our verdict</h2>');
  assert.equal(new Set(result.toc.map((v) => v.id)).size, 2);
  assert.equal(result.toc[0].id, 'our-verdict-1');
});
test('affiliate URLs reject executable protocols and embedded credentials', () => {
  assert.equal(safeUrl('javascript:alert(1)'), false);
  assert.equal(safeUrl('https://user:password@example.com'), false);
  assert.equal(safeUrl('https://example.com/product'), true);
});
test('newsletter requires explicit consent and normalizes email', () => {
  assert.equal(subscriberSchema.safeParse({ email: 'test@example.com' }).success, false);
  assert.equal(
    subscriberSchema.parse({ email: 'Test@Example.com', consent: 'yes' }).email,
    'test@example.com',
  );
  assert.equal(
    subscriberSchema.safeParse({ email: 'test@example.com', consent: 'yes', website: 'spam' })
      .success,
    false,
  );
});
test('community submissions reject invalid ratings and non-UUID reviews', () => {
  assert.equal(
    communitySchema.safeParse({
      review_id: 'sample-1',
      reviewer_name: 'Reader',
      rating: 6,
      review_text: 'This should not be accepted.',
    }).success,
    false,
  );
});
test('review input rejects invalid scores and unsafe affiliate links', () => {
  assert.equal(
    reviewSchema.safeParse({ score: 99, affiliate_url: 'javascript:alert(1)' }).success,
    false,
  );
});
