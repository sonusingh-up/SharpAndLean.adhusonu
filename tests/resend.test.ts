import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ResendClient, ResendError } from '../lib/email/resend';
import { contactSchema } from '../lib/validation';

function provider(responses: Array<[number, unknown]>) {
  const calls: Array<{ url: string; init: RequestInit }> = [];
  const transport: typeof fetch = async (url, init) => {
    calls.push({ url: String(url), init: init! });
    const next = responses.shift();
    assert.ok(next, 'Unexpected provider call');
    return Response.json(next[1], { status: next[0] });
  };
  return { calls, client: new ResendClient('test-key', transport) };
}

test('newsletter creates only missing contacts in the configured segment', async () => {
  const { client, calls } = provider([[404, {}], [200, { id: 'new-contact' }]]);
  assert.equal(await client.subscribe('reader+tag@example.com', 'newsletter'), true);
  assert.match(calls[0].url, /reader%2Btag%40example.com$/);
  assert.deepEqual(JSON.parse(calls[1].init.body as string), {
    email: 'reader+tag@example.com', segments: [{ id: 'newsletter' }],
  });
  assert.equal(calls[1].init.cache, 'no-store');
});

test('newsletter never resets an existing opt-out', async () => {
  const { client, calls } = provider([[200, { id: 'opted-out', unsubscribed: true }]]);
  assert.equal(await client.subscribe('reader@example.com', 'newsletter'), false);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].init.method, 'GET');
});

test('repeat subscriptions add segment membership without changing preferences', async () => {
  const { client, calls } = provider([
    [200, { id: 'existing', unsubscribed: false }],
    [200, { data: [], has_more: false }],
    [200, { id: 'newsletter' }],
  ]);
  assert.equal(await client.subscribe('reader@example.com', 'newsletter'), true);
  assert.equal(calls[1].url, 'https://api.resend.com/contacts/existing/segments');
  assert.equal(calls[2].url, 'https://api.resend.com/contacts/existing/segments/newsletter');
  assert.equal(calls[2].init.method, 'POST');
  assert.equal(calls[2].init.body, undefined);
});

test('an existing newsletter member gets no duplicate welcome', async () => {
  const { client, calls } = provider([
    [200, { id: 'existing', unsubscribed: false }],
    [200, { data: [{ id: 'newsletter' }], has_more: false }],
  ]);
  assert.equal(await client.subscribe('reader@example.com', 'newsletter'), false);
  assert.equal(calls.length, 2);
});

test('welcome uses published template and hides the address in its idempotency key', async () => {
  const { client, calls } = provider([[200, { id: 'welcome-1' }]]);
  await client.sendWelcome('reader@example.com', 'Site <website@sharpandlean.com>');
  const body = JSON.parse(calls[0].init.body as string);
  assert.equal(body.template.id, 'newsletter-welcome');
  assert.deepEqual(body.to, ['reader@example.com']);
  assert.doesNotMatch(new Headers(calls[0].init.headers).get('Idempotency-Key')!, /reader@example/);
});

test('weekly digest sends once for a given Resend broadcast name and segment', async () => {
  const digest = { name: 'SharpAndLean weekly digest 2026-09-27', from: 'Site <website@sharpandlean.com>',
    segmentId: 'newsletter', subject: 'New this week', html: '<a href="{{{RESEND_UNSUBSCRIBE_URL}}}">Unsubscribe</a>', text: 'Unsubscribe: {{{RESEND_UNSUBSCRIBE_URL}}}' };
  const { client, calls } = provider([[200, { data: [], has_more: false }], [200, { id: 'broadcast-1' }]]);
  assert.equal(await client.sendWeeklyDigest(digest), true);
  assert.equal(calls[0].url, 'https://api.resend.com/broadcasts?limit=100');
  assert.deepEqual(JSON.parse(calls[1].init.body as string), {
    name: digest.name, from: digest.from, segment_id: digest.segmentId,
    subject: digest.subject, html: digest.html, text: digest.text, send: true,
  });
  const duplicate = provider([[200, { data: [{ name: digest.name, segment_id: digest.segmentId }], has_more: false }]]);
  assert.equal(await duplicate.client.sendWeeklyDigest(digest), false);
  assert.equal(duplicate.calls.length, 1);
});

test('provider failures do not leak response bodies or register new contacts', async () => {
  for (const status of [401, 403, 429, 500]) {
    const { client, calls } = provider([[status, { message: 'private details' }]]);
    await assert.rejects(client.subscribe('reader@example.com', 'newsletter'), (error: unknown) => {
      assert.ok(error instanceof ResendError);
      assert.equal(error.status, status);
      assert.doesNotMatch(error.message, /private|reader|test-key/);
      return true;
    });
    assert.equal(calls.length, 1);
  }
});

test('contact delivery fixes the destination, uses the branded template and deduplicates retries', async () => {
  const { client, calls } = provider([[200, { id: 'email-1' }], [200, { id: 'email-1' }]]);
  const message = { name: 'A Reader', email: 'reader@example.com', subject: 'Correction', message: '<script>plain text only</script>' };
  await client.sendContact(message, 'Site <website@sharpandlean.com>', 'editor@example.com');
  await client.sendContact(message, 'Site <website@sharpandlean.com>', 'editor@example.com');
  const body = JSON.parse(calls[0].init.body as string);
  assert.deepEqual(body.to, ['editor@example.com']);
  assert.equal(body.reply_to, message.email);
  assert.equal(body.html, undefined);
  assert.equal(body.text, undefined);
  assert.equal(body.template.id, 'contact-notification');
  assert.deepEqual(body.template.variables, {
    SENDER_NAME: message.name,
    SENDER_EMAIL: message.email,
    MESSAGE_SUBJECT: message.subject,
    MESSAGE_BODY: message.message,
  });
  const first = new Headers(calls[0].init.headers).get('Idempotency-Key');
  assert.equal(first, new Headers(calls[1].init.headers).get('Idempotency-Key'));
  assert.doesNotMatch(first!, /reader@example/);
});

test('malformed provider success and network failures do not report delivery', async () => {
  const input = { name: 'Reader', email: 'reader@example.com', subject: 'Hello', message: 'A message for you.' };
  const { client } = provider([[200, {}]]);
  await assert.rejects(client.sendContact(input, 'site@example.com', 'editor@example.com'), ResendError);
  const offline = new ResendClient('test', async () => { throw new Error('private network info'); });
  await assert.rejects(offline.subscribe(input.email, 'newsletter'), ResendError);
});

test('contact validation blocks header injection, recipient override, bots and missing consent', () => {
  const valid = { name: 'Reader', email: 'READER@example.com', subject: 'A correction', message: 'Please check the label.', consent: 'yes', website: '' };
  assert.equal(contactSchema.parse(valid).email, 'reader@example.com');
  for (const invalid of [
    { ...valid, subject: 'Hi\r\nBcc: victim@example.com' },
    { ...valid, to: 'victim@example.com' },
    { ...valid, website: 'bot.example' },
    { ...valid, consent: undefined },
    { ...valid, message: 'x'.repeat(5001) },
  ]) assert.equal(contactSchema.safeParse(invalid).success, false);
});
