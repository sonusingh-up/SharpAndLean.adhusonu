import { test } from 'node:test';
import assert from 'node:assert/strict';
import { proteinTarget, ratesFor, toKg, fromKg, roundTo5 } from '../lib/protein';

const base = { weight: 70, unit: 'kg' as const, goal: 'muscle' as const, age: 'under-65' as const, meals: 4 };

test('a 70 kg beginner lifting for muscle gets the figures the article quotes', () => {
  const result = proteinTarget(base);
  assert.ok(result);
  // 1.6 g/kg is 112 g; the range is 1.4–2.2 g/kg, 98–154 g.
  assert.equal(result.target, 110);
  assert.equal(result.low, 100);
  assert.equal(result.high, 155);
  // 112 g over four meals is 28 g, about 30 g a meal.
  assert.equal(result.perMeal, 30);
});

test('each goal uses its published rate', () => {
  assert.deepEqual(ratesFor('health', 'under-65'), { low: 0.8, target: 1.2, high: 1.6 });
  assert.deepEqual(ratesFor('muscle', 'under-65'), { low: 1.4, target: 1.6, high: 2.2 });
  assert.deepEqual(ratesFor('fat-loss', 'under-65'), { low: 1.2, target: 1.6, high: 2.2 });
});

test('over 65, the floor and target rise to the PROT-AGE minimums', () => {
  assert.deepEqual(ratesFor('health', '65-plus'), { low: 1.0, target: 1.2, high: 1.6 });
  // Goals already above those minimums are unchanged.
  assert.deepEqual(ratesFor('muscle', '65-plus'), ratesFor('muscle', 'under-65'));
});

test('pounds and kilograms give the same answer', () => {
  const inPounds = proteinTarget({ ...base, weight: 154.3, unit: 'lb' });
  assert.equal(inPounds?.target, proteinTarget(base)?.target);
  assert.ok(Math.abs(toKg(fromKg(82, 'lb'), 'lb') - 82) < 1e-9);
});

test('per-meal grams follow the number of meals', () => {
  assert.equal(proteinTarget({ ...base, meals: 3 })?.perMeal, 35);
  assert.equal(proteinTarget({ ...base, meals: 5 })?.perMeal, 20);
});

test('missing or implausible weights return no result rather than a wrong one', () => {
  for (const weight of [0, -5, Number.NaN, 20, 400]) {
    assert.equal(proteinTarget({ ...base, weight }), null, `weight ${weight}`);
  }
});

test('targets are rounded to the nearest 5 g', () => {
  assert.equal(roundTo5(112), 110);
  assert.equal(roundTo5(113), 115);
  assert.equal(roundTo5(84), 85);
});
