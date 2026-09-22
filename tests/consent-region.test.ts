import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GET } from '../app/api/region/route';

const ask = async (country?: string) => {
  const response = await GET(
    new Request('https://sharpandlean.com/api/region', {
      headers: country ? { 'x-vercel-ip-country': country } : {},
    }),
  );
  return response.json() as Promise<{ country: string; consentRequired: boolean }>;
};

test('consent is required across the EEA, the UK and Switzerland', async () => {
  for (const country of ['DE', 'FR', 'IE', 'GB', 'CH', 'NO', 'IS', 'LI', 'HR', 'MT']) {
    assert.equal((await ask(country)).consentRequired, true, country);
  }
  // Lower case reaches the same answer; the header is not case-normalised upstream.
  assert.equal((await ask('gb')).consentRequired, true);
});

test('consent is not demanded where no such regime applies', async () => {
  for (const country of ['US', 'IN', 'JP', 'AU', 'BR', 'CA']) {
    assert.equal((await ask(country)).consentRequired, false, country);
  }
});

test('an unknown country errs towards asking', async () => {
  // A missing header must not be read as permission: the banner is the
  // recoverable mistake, setting a cookie on someone entitled to refuse is not.
  assert.equal((await ask()).consentRequired, true);
  assert.equal((await ask('')).consentRequired, true);
});
