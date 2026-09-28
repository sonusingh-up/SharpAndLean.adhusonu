import { test } from 'node:test';
import assert from 'node:assert/strict';
import { productReviews } from '../lib/products';
import { ingredients } from '../lib/ingredients';
import {
  allComparePairs,
  buildComparison,
  canCompare,
  indexableComparePairs,
  isIndexableComparison,
  listedComparePairs,
  productName,
  verdictFor,
  parseAmount,
  placeAmount,
  resolveComparison,
} from '../lib/compare';
import { canonicalCompareSlug, comparePath, splitCompareSlug } from '../lib/compare-path';

const bySlug = (slug: string) => {
  const r = productReviews.find((v) => v.slug === slug);
  assert.ok(r, `missing fixture product ${slug}`);
  return r;
};

test('dose strings parse only when they open with a mass', () => {
  assert.deepEqual(parseAmount('1,725 mg per 3-capsule serving'), { value: 1725, unit: 'mg' });
  assert.deepEqual(parseAmount('25 mcg (1000 IU) per softgel'), { value: 25, unit: 'mcg' });
  assert.deepEqual(parseAmount('3.6 g per serving (reported)'), { value: 3.6, unit: 'g' });
  // Nothing printed means nothing placed: never a guessed figure.
  assert.equal(parseAmount('Not disclosed (proprietary blend)'), null);
  assert.equal(parseAmount('100 million AFU per capsule'), null);
  assert.equal(parseAmount('Within the 96 per cent protein component'), null);
});

test('amounts are placed against a range across units', () => {
  const range = { min: 5, max: 20, unit: 'g' as const, per: 'day' as const, basis: 'Trial range' };
  assert.equal(placeAmount({ value: 276, unit: 'mg' }, range), 'below');
  assert.equal(placeAmount({ value: 12_000, unit: 'mg' }, range), 'within');
  assert.equal(placeAmount({ value: 21, unit: 'g' }, range), 'above');
});

test('comparison slugs have one canonical order', () => {
  assert.equal(canonicalCompareSlug(['b', 'a']), 'a-vs-b');
  assert.equal(comparePath(['zeta', 'alpha', 'mid']), '/compare/alpha-vs-mid-vs-zeta');
  assert.deepEqual(splitCompareSlug('a-vs-b'), ['a', 'b']);
  assert.equal(splitCompareSlug('a'), null);
  assert.equal(splitCompareSlug('a-vs-a'), null);
  assert.equal(splitCompareSlug('a-vs-b-vs-c-vs-d'), null);
});

test('only same-category products or named alternatives can be compared', () => {
  // Same category.
  assert.ok(
    canCompare(bySlug('kinetica-whey-protein-review'), bySlug('myprotein-impact-whey-review')),
  );
  // Different categories, but the theanine review names Yu Sleep as its alternative.
  assert.ok(canCompare(bySlug('now-l-theanine-100-mg'), bySlug('yu-sleep-review')));
  // Different categories with no editorial link.
  assert.ok(!canCompare(bySlug('now-l-theanine-100-mg'), bySlug('slimset-review')));
});

test('every generated pair resolves to itself and no product slug is ambiguous', () => {
  for (const r of productReviews) assert.ok(!r.slug.includes('-vs-'), r.slug);
  const pairs = allComparePairs(productReviews);
  assert.ok(pairs.length > 0);
  for (const pair of pairs) {
    const slug = canonicalCompareSlug(pair.map((r) => r.slug));
    const found = resolveComparison(slug, productReviews);
    assert.ok(found, slug);
    assert.equal(found.canonical, slug);
  }
  // Reversed order still resolves, to the same canonical slug, so it can redirect.
  const reversed = resolveComparison(
    'myprotein-impact-whey-review-vs-kinetica-whey-protein-review',
    productReviews,
  );
  assert.equal(reversed?.canonical, 'kinetica-whey-protein-review-vs-myprotein-impact-whey-review');
  assert.equal(resolveComparison('now-l-theanine-100-mg-vs-slimset-review', productReviews), null);
});

test('a comparison surfaces the dose gap a bottle price hides', () => {
  const c = buildComparison([bySlug('colonbroom-review-2026'), bySlug('now-psyllium-husk-powder')]);
  const psyllium = c.doses.find((d) => d.ingredient.slug === 'psyllium-husk');
  assert.ok(psyllium?.shared);
  const [colonbroom, now] = psyllium.cells;
  assert.equal(colonbroom.status === 'present' && colonbroom.placement, 'below');
  assert.equal(now.status === 'present' && now.placement, 'within');
  // ColonBroom needs more than one serving to reach 5 g, so its cost scales up.
  const cost = c.studiedCosts.find((s) => s.row.ingredient.slug === 'psyllium-husk')?.costs[0];
  assert.ok(cost && cost.servingsNeeded > 1);
  assert.ok(c.flags[0].some((f) => f.tone === 'bad' && /no stated amount/.test(f.text)));
});

test('picks follow the published criterion scores', () => {
  const c = buildComparison([
    bySlug('kinetica-whey-protein-review'),
    bySlug('myprotein-impact-whey-review'),
  ]);
  // Kinetica scores 9 against 6 for label transparency; Myprotein 9 against 7 for value.
  assert.ok(c.picks[0].reasons.some((r) => /label disclosed/.test(r)));
  assert.ok(c.picks[1].reasons.some((r) => /value/.test(r)));
  assert.match(c.headline, /Kinetica Whey Protein scores 8\.0\/10/);
  for (const p of c.picks) assert.ok(p.reasons.length <= 3);
});

test('studied ranges are internally consistent', () => {
  for (const i of ingredients) {
    if (!i.studiedDose) continue;
    assert.ok(i.studiedDose.min > 0 && i.studiedDose.min <= i.studiedDose.max, i.slug);
  }
});

test('only editor-linked pairs are indexed; unrelated same-category pairs and three-way sets are not', () => {
  // Linked as alternatives: a real head-to-head.
  assert.equal(
    isIndexableComparison([
      bySlug('myprotein-impact-creatine-review'),
      bySlug('optimum-nutrition-micronised-creatine-review'),
    ]),
    true,
  );
  // Same category, but nobody searches magnesium against a mass gainer.
  const unrelated = [bySlug('dr-wilsons-mighty-magnesium-review'), bySlug('mutant-mass-review')];
  assert.equal(canCompare(unrelated[0], unrelated[1]), true);
  assert.equal(isIndexableComparison(unrelated), false);
  // Three-way comparisons are never indexed.
  assert.equal(
    isIndexableComparison([
      bySlug('bulk-creatine-monohydrate-review'),
      bySlug('myprotein-impact-creatine-review'),
      bySlug('optimum-nutrition-micronised-creatine-review'),
    ]),
    false,
  );
  const all = allComparePairs(productReviews);
  const indexed = indexableComparePairs(productReviews);
  assert.ok(indexed.length > 0 && indexed.length < all.length);
  for (const pair of indexed) assert.ok(isIndexableComparison(pair));
});

test('the short answer names the higher scorer, with both scores, and stays quiet when unscored', () => {
  const a = bySlug('myprotein-impact-creatine-review');
  const b = bySlug('optimum-nutrition-micronised-creatine-review');
  const c = buildComparison([a, b]);
  assert.ok(c.verdict, 'a scored pair has a short answer');
  const [hi, lo] = [a, b].sort((x, y) => (y.score ?? 0) - (x.score ?? 0));
  if (hi.score !== lo.score) {
    assert.match(
      c.verdict,
      new RegExp(`^${productName(hi).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} is the better pick`),
    );
  }
  assert.ok(c.verdict.includes(hi.score!.toFixed(1)) && c.verdict.includes(lo.score!.toFixed(1)));

  // Level scores say so rather than naming a winner.
  const tied = verdictFor(
    [
      { ...a, score: 6 },
      { ...b, score: 6 },
    ],
    ['A', 'B'],
    [null, null],
  );
  assert.match(tied!, /score level/);
  // A cheaper runner-up is named; a clear winner on price is credited.
  const usd = (perServing: number) => ({
    perServing,
    currency: 'USD',
    price: perServing * 30,
    servings: 30,
    source: 'Test',
    checkedAt: '2026-09-28',
  });
  assert.match(
    verdictFor(
      [
        { ...a, score: 7 },
        { ...b, score: 5 },
      ],
      ['A', 'B'],
      [usd(1), usd(0.5)],
    )!,
    /though B costs less per serving/,
  );
  assert.match(
    verdictFor(
      [
        { ...a, score: 7 },
        { ...b, score: 5 },
      ],
      ['A', 'B'],
      [usd(0.5), usd(1)],
    )!,
    /also the cheapest per serving/,
  );
  // An unscored product means no verdict.
  assert.equal(verdictFor([{ ...a, score: null }, b], ['A', 'B'], [null, null]), null);
});

test('listed pairs are the indexable pairs minus those an editorial comparison covers', () => {
  const indexed = indexableComparePairs(productReviews);
  const [first] = indexed;
  const listed = listedComparePairs(productReviews, [
    { product_a_id: first[0].id, product_b_id: first[1].id },
  ]);
  assert.equal(listed.length, indexed.length - 1);
  assert.ok(!listed.some((p) => p[0].id === first[0].id && p[1].id === first[1].id));
});
