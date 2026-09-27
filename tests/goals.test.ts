import { test } from 'node:test';
import assert from 'node:assert/strict';
import { goalProfiles, findGoalProfile } from '../lib/goals';
import { productReviews } from '../lib/products';
import { ingredients } from '../lib/ingredients';
import { reviewSchema } from '../lib/validation';

test('goal finder understands common search phrasing and no-space terms', () => {
  assert.equal(findGoalProfile('weightloss')?.id, 'weight-loss');
  assert.equal(findGoalProfile('I want to lose weight')?.id, 'weight-loss');
  assert.equal(findGoalProfile('weightgain')?.id, 'weight-gain');
  assert.equal(findGoalProfile('build muscle')?.id, 'weight-gain');
  assert.equal(findGoalProfile('Probiotics')?.id, 'probiotics');
  assert.equal(findGoalProfile('Akkermansia')?.id, 'probiotics');
  assert.equal(findGoalProfile('Glucomannan')?.id, 'weight-loss');
  assert.equal(findGoalProfile('L-theanine')?.id, 'focus');
  assert.equal(findGoalProfile('omega-3')?.id, 'heart-health');
  assert.equal(findGoalProfile('sleep quality')?.id, 'sleep');
  assert.equal(findGoalProfile('something unrelated'), undefined);
  assert.equal(findGoalProfile('w'), undefined);
});

test('every explicitly tagged product and ingredient destination exists', () => {
  for (const goal of goalProfiles) {
    for (const ingredient of goal.ingredients) {
      const slug = ingredient.href.split('/').at(-1);
      assert.ok(ingredients.some((entry) => entry.slug === slug), `${goal.id}: ${ingredient.href}`);
    }
  }
  for (const review of productReviews) {
    for (const goalId of review.goal_tags ?? []) {
      assert.ok(goalProfiles.some((goal) => goal.id === goalId), `${review.slug}: unknown goal ${goalId}`);
    }
  }
});

test('the admin form accepts exactly the goals the finder shows', () => {
  const accepted = reviewSchema.shape.goal_tags.unwrap().element.options;
  assert.deepEqual([...accepted].sort(), goalProfiles.map((goal) => goal.id).sort());
});
