import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  compareListings,
  costPerStandard,
  formatMoney,
  listingCost,
  standardLabel,
} from '../lib/serving-cost';

// The worked example in the article and its hero figure: Myprotein Impact Vegan
// Protein, 1 kg on offer at £19.99, 33 servings of 24 g of protein.
const myproteinVegan = { price: 19.99, servings: 33, perServing: 24, perDay: 1 };
// Optimum Nutrition Gold Standard 100% Plant at Boots: £28.00, 21 servings of 24 g.
const onPlant = { price: 28, servings: 21, perServing: 24, perDay: 1 };

test('the worked example gives 61p a serving and £2.52 per 100 g of protein', () => {
  const cost = listingCost(myproteinVegan);
  assert.ok(cost);
  assert.equal(formatMoney(cost.perServing), '61p');
  assert.equal(formatMoney(costPerStandard(myproteinVegan, 'g') as number), '£2.52');
  assert.equal(cost.days, 33);
});

test('the calculator default comparison matches the article', () => {
  assert.equal(formatMoney(costPerStandard(onPlant, 'g') as number), '£5.56');
  const result = compareListings(onPlant, myproteinVegan, 'g');
  assert.deepEqual(result, { cheaper: 'b', percentMore: 120 });
});

test('servings a day change the daily cost and how long a pack lasts, not the unit cost', () => {
  // Myprotein Alpha Men: 120 tablets, two a serving. Taking two servings a day
  // doubles the daily cost and halves the days, as the article warns.
  const once = listingCost({ price: 7.99, servings: 60, perServing: 1, perDay: 1 });
  const twice = listingCost({ price: 7.99, servings: 60, perServing: 1, perDay: 2 });
  assert.ok(once && twice);
  assert.equal(formatMoney(once.perDay), '13p');
  assert.equal(formatMoney(twice.perDay), '27p');
  assert.equal(twice.days, 30);
  assert.equal(once.perServing, twice.perServing);
});

test('units scale to their standard amount', () => {
  const gainer = { price: 32.95, servings: 8, perServing: 1250, perDay: 1 };
  // Serious Mass: £32.95 for 8 servings of about 1,250 kcal is £3.30 per 1,000 kcal.
  assert.equal(formatMoney(costPerStandard(gainer, 'kcal') as number), '£3.30');
  assert.equal(standardLabel('kcal'), '1,000 kcal');
  assert.equal(standardLabel('g'), '100 g');
  assert.equal(standardLabel('mg'), '1,000 mg');
});

test('missing or non-positive inputs give no answer rather than a wrong one', () => {
  assert.equal(listingCost({ ...myproteinVegan, servings: 0 }), null);
  assert.equal(listingCost({ ...myproteinVegan, price: Number.NaN }), null);
  assert.equal(compareListings(myproteinVegan, { ...onPlant, perServing: -1 }, 'g'), null);
});

test('near-identical prices are called the same', () => {
  const a = { price: 20, servings: 30, perServing: 24, perDay: 1 };
  const b = { price: 20.1, servings: 30, perServing: 24, perDay: 1 };
  assert.deepEqual(compareListings(a, b, 'g'), { cheaper: 'same', percentMore: 0 });
});

test('money formats as pence under a pound and pounds above', () => {
  assert.equal(formatMoney(0.055), '5.5p');
  assert.equal(formatMoney(0.61), '61p');
  assert.equal(formatMoney(2.524), '£2.52');
});
