import { test } from 'node:test';
import assert from 'node:assert/strict';
import { vitaminAdvice, type VitaminInput } from '../lib/vitamins';

const ids = (input: VitaminInput) => vitaminAdvice(input).map((a) => a.id);
const find = (input: VitaminInput, id: string) => vitaminAdvice(input).find((a) => a.id === id);

test('a healthy adult under 50 with nothing ticked is told no daily vitamin', () => {
  assert.deepEqual(ids({ age: 'under-50', situations: [] }), []);
});

test('UK winters alone give vitamin D for October to March at 10 micrograms', () => {
  const d = find({ age: 'under-50', situations: ['uk-winter'] }, 'vitamin-d');
  assert.equal(d?.when, 'October to March');
  assert.equal(d?.amount, '10 micrograms (400 IU) a day');
});

test('little sun or age 75 and over make vitamin D year-round', () => {
  assert.equal(find({ age: 'under-50', situations: ['little-sun', 'uk-winter'] }, 'vitamin-d')?.when, 'All year round');
  const older = find({ age: '75-plus', situations: [] }, 'vitamin-d');
  assert.equal(older?.when, 'All year round');
  assert.equal(older?.amount, '10 to 20 micrograms (400 to 800 IU) a day');
});

test('every vitamin D recommendation carries the upper limit', () => {
  const d = find({ age: 'under-50', situations: ['uk-winter'] }, 'vitamin-d');
  assert.ok(d?.reasons.some((r) => r.includes('100 micrograms (4,000 IU)')));
});

test('pregnancy gives folic acid first, then vitamin D, and warns about vitamin A', () => {
  const advice = vitaminAdvice({ age: 'under-50', situations: ['pregnancy'] });
  assert.deepEqual(advice.map((a) => a.id), ['folic-acid', 'vitamin-d']);
  assert.equal(advice[0].amount, '400 micrograms a day');
  assert.ok(advice[0].reasons.some((r) => r.includes('vitamin A')));
});

test('vegans and over-50s get B12 as a supplement; medicine alone gets a test', () => {
  assert.equal(find({ age: 'under-50', situations: ['vegan'] }, 'vitamin-b12')?.amount, 'A daily supplement or B12-fortified foods');
  assert.equal(find({ age: '50-74', situations: [] }, 'vitamin-b12')?.amount, 'A daily supplement or B12-fortified foods');
  assert.equal(find({ age: 'under-50', situations: ['b12-medicine'] }, 'vitamin-b12')?.amount, 'Ask about a B12 blood test');
});

test('surgery or a gut condition defers to a specialist plan', () => {
  assert.deepEqual(ids({ age: 'under-50', situations: ['absorption'] }), ['specialist']);
});
