import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ingredients, findIngredientByName, getIngredient } from '../lib/ingredients';
import { vitaminAdvice } from '../lib/vitamins';

test('ingredient slugs are unique', () => {
  const slugs = ingredients.map((i) => i.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test('every claim cites references that exist on its page', () => {
  for (const i of ingredients) {
    const ids = new Set(i.references.map((r) => r.id));
    for (const c of i.claims) {
      for (const ref of c.refs ?? []) {
        assert.ok(ids.has(ref), `${i.slug}: claim "${c.claim}" cites missing reference "${ref}"`);
      }
    }
  }
});

test('related ingredients all exist', () => {
  for (const i of ingredients) {
    for (const slug of i.related) {
      assert.ok(getIngredient(slug), `${i.slug}: related ingredient "${slug}" does not exist`);
    }
  }
});

test('the vitamin pages keep the quick-answer format', () => {
  for (const slug of ['vitamin-d3', 'folic-acid', 'vitamin-b12']) {
    const words = getIngredient(slug)!.quickAnswer.split(/\s+/).length;
    assert.ok(words >= 60 && words <= 100, `${slug}: quick answer is ${words} words`);
    const description = getIngredient(slug)!.seoDescription ?? '';
    assert.ok(description.length > 0 && description.length <= 160, `${slug}: description is ${description.length} characters`);
  }
});

test('label names reach the right vitamin page', () => {
  assert.equal(findIngredientByName('Vitamin D3 (as cholecalciferol)')?.slug, 'vitamin-d3');
  assert.equal(findIngredientByName('Folate (as L-methylfolate)')?.slug, 'folic-acid');
  assert.equal(findIngredientByName('Folic acid')?.slug, 'folic-acid');
  assert.equal(findIngredientByName('Vitamin B12 (as methylcobalamin)')?.slug, 'vitamin-b12');
  assert.equal(findIngredientByName('Cyanocobalamin')?.slug, 'vitamin-b12');
});

test('the ingredient pages and the vitamin checker give the same doses', () => {
  const advice = vitaminAdvice({ age: 'under-50', situations: ['pregnancy', 'vegan'] });
  const folic = advice.find((a) => a.id === 'folic-acid');
  const d = advice.find((a) => a.id === 'vitamin-d');
  assert.ok(folic?.amount.startsWith('400 micrograms'));
  assert.ok(getIngredient('folic-acid')!.atAGlance!.some((row) => row.value.startsWith('400 mcg')));
  assert.ok(d?.amount.startsWith('10 micrograms (400 IU)'));
  assert.ok(getIngredient('vitamin-d3')!.atAGlance!.some((row) => row.value.startsWith('10 mcg (400 IU)')));
});
