import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isUuid } from '../lib/ids';

test('database UUID guard rejects file-backed editorial review IDs', () => {
  assert.equal(isUuid('editorial-product-2'), false);
  assert.equal(isUuid('editorial-product-18'), false);
  assert.equal(isUuid('12345678-1234-1234-1234-123456789abc'), true);
});
