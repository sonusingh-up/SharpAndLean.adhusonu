import { test } from 'node:test';
import assert from 'node:assert/strict';
import { instagramEmbedSrc } from '../lib/social-embed';
import { articles } from '../lib/articles';

test('instagram reel and post addresses become embed addresses', () => {
  assert.equal(
    instagramEmbedSrc('https://www.instagram.com/reel/DP36fqrjjOx/'),
    'https://www.instagram.com/reel/DP36fqrjjOx/embed/',
  );
  assert.equal(
    instagramEmbedSrc('https://www.instagram.com/supergut/reel/DOwaozajgB0/'),
    'https://www.instagram.com/reel/DOwaozajgB0/embed/',
  );
  assert.equal(
    instagramEmbedSrc('https://www.instagram.com/p/DP2B0YnieLV'),
    'https://www.instagram.com/p/DP2B0YnieLV/embed/',
  );
});

test('anything that is not an instagram reel or post is refused', () => {
  for (const url of [
    'http://www.instagram.com/reel/abc/',
    'https://instagram.com.evil.example/reel/abc/',
    'https://www.instagram.com/supergut/',
    'https://www.youtube.com/watch?v=abc',
    'javascript:alert(1)',
  ]) {
    assert.equal(instagramEmbedSrc(url), null, url);
  }
});

test('every article social embed has a valid address', () => {
  for (const a of articles) {
    if (a.socialEmbed) assert.ok(instagramEmbedSrc(a.socialEmbed.url), a.slug);
  }
});
