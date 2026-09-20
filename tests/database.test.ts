import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

test('migration, atomic publishing, RLS and rate limits work together', async () => {
  const db = new PGlite();
  try {
    await db.exec(
      `create role anon; create role authenticated; create role service_role; create schema auth; create table auth.users(id uuid primary key); create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$; grant usage on schema auth to authenticated,anon; grant execute on function auth.uid() to authenticated,anon; create schema storage; create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]); create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text); alter table storage.objects enable row level security;`,
    );
    await db.exec(
      await readFile(new URL('../supabase/migrations/001_initial.sql', import.meta.url), 'utf8'),
    );
    await db.exec(
      `create function auth.jwt() returns jsonb language sql stable as $$ select jsonb_build_object('sub', nullif(current_setting('request.jwt.claim.sub',true),'')) $$;`,
    );
    await db.exec(
      await readFile(new URL('../supabase/migrations/002_clerk_auth.sql', import.meta.url), 'utf8'),
    );
    const admin = '11111111-1111-4111-8111-111111111111',
      outsider = '22222222-2222-4222-8222-222222222222';
    await db.query('insert into auth.users(id) values($1),($2)', [admin, outsider]);
    await db.query('insert into admin_users values($1)', [admin]);
    await db.query('insert into clerk_admin_users(clerk_user_id) values($1)', [
      'user_clerk_editor',
    ]);
    const category = (await db.query<{ id: string }>('select id from categories limit 1')).rows[0]
      .id;
    const author = (await db.query<{ id: string }>('select id from authors limit 1')).rows[0].id;
    const record = {
      title: 'Permission test',
      slug: 'permission-test',
      category_id: category,
      author_id: author,
      product_name: 'Test product',
      is_published: false,
      score: null,
      summary: 'Test summary',
      body: '<p>Test body</p>',
      verdict: '',
      pros: [],
      cons: [],
      affiliate_url: '',
      affiliate_network: '',
      product_price: '',
      price_amount: null,
      currency: 'USD',
      third_party_tested: false,
      money_back_guarantee: '',
      featured_image_url: '',
      og_image_url: '',
      seo_title: 'Test review',
      seo_desc: 'Test description',
      who_for: '',
      who_avoid: '',
      score_breakdown: {},
    };
    await db.exec(
      `set role authenticated; select set_config('request.jwt.claim.sub','${outsider}',false);`,
    );
    assert.equal(
      (await db.query<{ is_admin: boolean }>('select is_admin()')).rows[0].is_admin,
      false,
    );
    await assert.rejects(() =>
      db.query('select save_review($1,$2,$3)', [JSON.stringify(record), '[]', '[]']),
    );
    await db.exec(`select set_config('request.jwt.claim.sub','${admin}',false);`);
    const result = await db.query<{ id: string }>('select save_review($1,$2,$3) as id', [
      JSON.stringify(record),
      JSON.stringify([
        { name: 'Test ingredient', dose: '1mg', evidence_rating: 'none', note: 'Fixture' },
      ]),
      JSON.stringify([{ question: 'Q?', answer: 'A.' }]),
    ]);
    const id = result.rows[0].id;
    await db.exec('set role anon');
    assert.equal((await db.query('select * from reviews')).rows.length, 0);
    assert.equal((await db.query('select * from review_ingredients')).rows.length, 0);
    assert.equal((await db.query('select * from review_faqs')).rows.length, 0);
    await assert.rejects(() => db.query('select * from subscribers'));
    await db.exec('set role authenticated');
    await db.query('select save_review($1,$2,$3)', [
      JSON.stringify({ ...record, id, is_published: true }),
      '[]',
      '[]',
    ]);
    await db.exec('set role anon');
    const published = await db.query<{ published_at: string }>('select * from reviews');
    assert.equal(published.rows.length, 1);
    assert.ok(published.rows[0].published_at);
    await db.exec(
      `set role authenticated; select set_config('request.jwt.claim.sub','${outsider}',false);`,
    );
    await db.query("update reviews set title='Unauthorized' where id=$1", [id]);
    await db.exec('reset role');
    assert.equal(
      (await db.query<{ title: string }>('select title from reviews')).rows[0].title,
      'Permission test',
    );
    await db.exec(
      `set role authenticated; select set_config('request.jwt.claim.sub','${admin}',false);`,
    );
    await assert.rejects(() =>
      db.query('select save_review($1,$2,$3)', [
        JSON.stringify({ ...record, id, title: 'Should roll back' }),
        JSON.stringify([{ name: 'Bad', evidence_rating: 'invalid' }]),
        '[]',
      ]),
    );
    await db.exec('reset role');
    assert.equal(
      (await db.query<{ title: string }>('select title from reviews')).rows[0].title,
      'Permission test',
    );
    await db.exec(
      `set role authenticated; select set_config('request.jwt.claim.sub','${admin}',false);`,
    );
    const guide = {
      title: 'Test guide',
      slug: 'test-guide',
      category_id: category,
      summary: 'Test',
      body: 'Test',
      is_published: true,
      seo_title: 'Test',
      seo_desc: 'Test',
    };
    await db.query('select save_collection($1,$2,$3,$4)', [
      'best_lists',
      JSON.stringify(guide),
      JSON.stringify([{ review_id: id, rank: 1, why_it_made_the_list: 'Test' }]),
      '[]',
    ]);
    await db.exec('set role anon');
    assert.equal((await db.query('select * from best_list_items')).rows.length, 1);
    await db.exec(
      `set role authenticated; select set_config('request.jwt.claim.sub','${admin}',false);`,
    );
    await db.query('select save_review($1,$2,$3)', [
      JSON.stringify({ ...record, id, is_published: false }),
      '[]',
      '[]',
    ]);
    await db.exec('set role anon');
    assert.equal((await db.query('select * from reviews')).rows.length, 0);
    assert.equal((await db.query('select * from best_list_items')).rows.length, 0);
    await db.exec('set role service_role');
    assert.equal(
      (await db.query<{ ok: boolean }>("select consume_rate_limit('test',1) as ok")).rows[0].ok,
      true,
    );
    assert.equal(
      (await db.query<{ ok: boolean }>("select consume_rate_limit('test',1) as ok")).rows[0].ok,
      false,
    );
    await db.exec('set role anon');
    await assert.rejects(() => db.query("select consume_rate_limit('bypass',5)"));
    await db.exec(
      "set role authenticated; select set_config('request.jwt.claim.sub','user_regular_reader',false);",
    );
    assert.equal(
      (await db.query<{ is_admin: boolean }>('select is_admin()')).rows[0].is_admin,
      false,
    );
    assert.equal((await db.query('select * from reviews')).rows.length, 0);
    await assert.rejects(() =>
      db.query("insert into clerk_admin_users(clerk_user_id) values ('user_regular_reader')"),
    );
    await assert.rejects(() =>
      db.query('select save_review($1,$2,$3)', [JSON.stringify(record), '[]', '[]']),
    );
    await db.exec("select set_config('request.jwt.claim.sub','user_clerk_editor',false);");
    assert.equal(
      (await db.query<{ is_admin: boolean }>('select is_admin()')).rows[0].is_admin,
      true,
    );
    await db.query('select save_review($1,$2,$3)', [
      JSON.stringify({ ...record, id, title: 'Clerk editor update' }),
      '[]',
      '[]',
    ]);
    assert.equal(
      (await db.query<{ title: string }>('select title from reviews where id=$1', [id])).rows[0]
        .title,
      'Clerk editor update',
    );
    await assert.rejects(() =>
      db.query("insert into clerk_admin_users(clerk_user_id) values ('user_other')"),
    );
  } finally {
    await db.close();
  }
});
