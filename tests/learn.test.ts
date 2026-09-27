import { test } from 'node:test';
import assert from 'node:assert/strict';
import { editorialCollections } from '../lib/products';

const learnArticles = editorialCollections.filter((c) => c.kind === 'articles');

test('every /learn article is filed under a topic on the Learn hub', () => {
  for (const a of learnArticles) {
    assert.ok(a.topic, `${a.slug} has no topic, so it would fall into "More reading"`);
  }
});

test('the Learn hub tools point at articles that exist', () => {
  for (const slug of ['how-much-protein-should-a-beginner-eat', 'which-vitamins-should-you-take-daily']) {
    assert.ok(learnArticles.some((a) => a.slug === slug), `missing /learn/${slug}`);
  }
});
