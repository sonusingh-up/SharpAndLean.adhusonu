import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  fruits,
  fruitTableHtml,
  glBand,
  giBand,
  glycaemicLoad,
  netCarbs,
  rankedFruits,
} from '../lib/fruit-gi';
import { editorialCollections } from '../lib/products';
import { articleContent } from '../lib/content';

const article = editorialCollections.find((c) => c.slug === 'fruit-and-diabetes-glycaemic-index');

test('glycaemic load is GI times net carbohydrate per serving over 100', () => {
  const apple = fruits.find((f) => f.name === 'Apple')!;
  assert.equal(netCarbs(apple).toFixed(1), '13.7');
  assert.equal(Math.round(glycaemicLoad(apple)), 5);
  // Dried fruit is compared at a 30 g portion, not 120 g.
  assert.equal(fruits.find((f) => f.name === 'Raisins')!.servingG, 30);
});

test('bands follow the published cut-offs', () => {
  assert.equal(giBand(55), 'low');
  assert.equal(giBand(56), 'medium');
  assert.equal(giBand(70), 'high');
  assert.equal(glBand(10.4), 'low');
  assert.equal(glBand(12.2), 'medium');
  assert.equal(glBand(20), 'high');
});

test('the ranking runs from lowest to highest load, and names are unique', () => {
  const loads = rankedFruits().map((f) => Math.round(glycaemicLoad(f)));
  assert.deepEqual(
    loads,
    [...loads].sort((a, b) => a - b),
  );
  assert.equal(new Set(fruits.map((f) => f.name)).size, fruits.length);
});

test('the article table is generated from the data, one row per fruit', () => {
  assert.ok(article, 'fruit and diabetes article is registered');
  assert.ok(article.body.includes(fruitTableHtml()), 'article body carries the generated table');
  for (const f of fruits)
    assert.ok(article.body.includes(`${f.name}`), `${f.name} is in the article`);
  assert.ok(article.seo_title.includes(String(fruits.length)));
});

test('fruit links point at articles that exist', () => {
  for (const f of fruits.filter((x) => x.href)) {
    const slug = f.href!.replace('/learn/', '');
    assert.ok(
      editorialCollections.some((c) => c.kind === 'articles' && c.slug === slug),
      `${f.name}: ${f.href}`,
    );
  }
});

test('the responsive fruit block retains a complete plain-HTML table for content consumers', () => {
  const html = articleContent(article!.body).html;
  assert.match(html, /<div data-tool="fruit-comparison"><table>/);
  assert.equal((html.match(/<tr>/g) || []).length, fruits.length + 1);
  assert.ok(html.includes('Glycaemic load per serving'));
  assert.ok(html.includes('About 50 (low)'));
  assert.ok(html.includes('30 g'));
});
