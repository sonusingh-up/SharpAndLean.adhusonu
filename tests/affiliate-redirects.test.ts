import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { affiliateRedirectResponse, affiliateRedirectSchema, productSlug, validDestination } from '../lib/affiliate-redirects';

test('recommendation slugs and destination validation', () => {
  assert.equal(productSlug('NOW Psyllium Husk Powder'), 'now-psyllium-husk-powder');
  assert.equal(productSlug(' Café + Fibre! '), 'cafe-fibre');
  const base = { name: 'Test product', slug: 'test-product', destination: 'https://www.amazon.com/dp/B007729DSE?tag=test-20', enabled: true };
  assert.ok(affiliateRedirectSchema.safeParse(base).success);
  for (const destination of ['javascript:alert(1)', '//evil.com', 'http://merchant.com', 'https://user:pass@merchant.com', 'https://127.0.0.1', 'https://[::1]', 'https://localhost', 'https://app.internal', 'https://sharpandlean.com/recommended/test', 'https://www.sharpandlean.com/', 'https://merchant.com:8443', 'https://merchant.com/\r\nLocation:evil']) {
    assert.equal(validDestination(destination), false, destination);
  }
  assert.equal(validDestination('https://preview.vercel.app/recommended/test', 'https://preview.vercel.app'), false);
  for (const slug of ['../test', 'Test', 'a/b', 'two words', 'a--b', '']) {
    assert.equal(affiliateRedirectSchema.safeParse({ ...base, slug }).success, false);
  }
});

test('redirect preserves tracking parameters and cannot be permanently cached', () => {
  const target = 'https://merchant.com/product?tag=my-id&subid=a%2Fb#offer';
  const response = affiliateRedirectResponse(target, 'https://sharpandlean.com');
  assert.equal(response.status, 302);
  assert.equal(response.headers.get('Location'), target);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.equal(response.headers.get('X-Robots-Tag'), 'noindex, nofollow');
  assert.equal(affiliateRedirectResponse(null, 'https://sharpandlean.com').status, 404);
  assert.equal(affiliateRedirectResponse('javascript:alert(1)', 'https://sharpandlean.com').status, 404);
  assert.equal(affiliateRedirectResponse(null, 'https://sharpandlean.com', true).status, 503);
});

test('affiliate migration restricts writes to editors and hides disabled links', async () => {
  const db = new PGlite();
  try {
    await db.exec(`create role anon; create role authenticated;
      create function public.is_admin() returns boolean language sql stable as $$
      select current_setting('test.editor', true) = 'yes' $$;`);
    await db.exec(await readFile(new URL('../supabase/migrations/003_affiliate_redirects.sql', import.meta.url), 'utf8'));
    await db.exec("set role authenticated; select set_config('test.editor','no',false)");
    await assert.rejects(() => db.exec("insert into affiliate_redirects(name,slug,destination) values('Product','product','https://merchant.com/p')"));
    await db.exec("select set_config('test.editor','yes',false)");
    await db.exec("insert into affiliate_redirects(name,slug,destination) values('Product','product','https://merchant.com/p?tag=abc')");
    await assert.rejects(() => db.exec("insert into affiliate_redirects(name,slug,destination) values('Other','product','https://merchant.com/q')"));
    await db.exec('set role anon');
    assert.equal((await db.query('select * from affiliate_redirects')).rows.length, 1);
    await assert.rejects(() => db.exec("update affiliate_redirects set destination='https://evil.com'"));
    await db.exec("set role authenticated; select set_config('test.editor','no',false)");
    await db.exec("update affiliate_redirects set destination='https://evil.com'");
    assert.equal((await db.query<{ destination: string }>('select destination from affiliate_redirects')).rows[0].destination, 'https://merchant.com/p?tag=abc');
    await db.exec("select set_config('test.editor','yes',false); update affiliate_redirects set enabled=false");
    assert.equal((await db.query('select * from affiliate_redirects')).rows.length, 1);
    await db.exec('set role anon');
    assert.equal((await db.query('select * from affiliate_redirects')).rows.length, 0);
    await db.exec("set role authenticated; select set_config('test.editor','no',false)");
    assert.equal((await db.query('select * from affiliate_redirects')).rows.length, 0);
  } finally { await db.close(); }
});
