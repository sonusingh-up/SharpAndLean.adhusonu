import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  extractMetadata,
  isUsablePreview,
  isPublicAddress,
  parseTarget,
  PreviewError,
  signAsset,
  sniffImageType,
  verifyAsset,
} from '../lib/link-preview';

test('link previews refuse private, loopback, link-local and wrapped addresses', () => {
  for (const address of [
    '127.0.0.1',
    '10.1.2.3',
    '172.16.0.1',
    '192.168.1.1',
    '169.254.169.254', // cloud metadata service
    '100.64.0.1',
    '0.0.0.0',
    '::1',
    '::',
    '::ffff:127.0.0.1',
    '::ffff:7f00:1',
    'fe80::1',
    'fc00::1',
    'fd12:3456::1',
    '64:ff9b::7f00:1',
    '2002:7f00:1::',
    '[::1]',
    'not-an-ip',
  ]) {
    assert.equal(isPublicAddress(address), false, address);
  }
  for (const address of ['8.8.8.8', '1.1.1.1', '2606:4700:4700::1111']) {
    assert.equal(isPublicAddress(address), true, address);
  }
});

test('link previews refuse unsafe URLs before anything is resolved', () => {
  for (const raw of [
    'ftp://example.com/file',
    'javascript:alert(1)',
    'file:///etc/passwd',
    'https://user:pass@example.com/',
    'https://example.com:8443/',
    'http://example.com:443/',
    'http://localhost/',
    'http://api.localhost/',
    'http://intranet/',
    'http://127.0.0.1/',
    'http://2130706433/', // 127.0.0.1 written as an integer
    'http://0x7f.1/', // and in hex
    'http://[::1]/',
    'http://169.254.169.254/latest/meta-data/',
    'not a url',
  ]) {
    assert.throws(() => parseTarget(raw), PreviewError, raw);
  }
});

test('link previews refuse affiliate links, which would register a false click', () => {
  assert.throws(() => parseTarget('https://sharpandlean.com/recommended/calocurb'));
  assert.throws(() => parseTarget('https://amzn.to/4dr7gR2'));
  assert.throws(() => parseTarget('https://www.amazon.com/dp/B0CGJWF7SN?tag=site-20'));
});

test('link previews accept ordinary public URLs and drop the fragment', () => {
  assert.equal(
    parseTarget('https://pubmed.ncbi.nlm.nih.gov/31263284/#abstract').href,
    'https://pubmed.ncbi.nlm.nih.gov/31263284/',
  );
  assert.equal(parseTarget('https://example.com:443/a').href, 'https://example.com/a');
});

test('page metadata is read from Open Graph first, with entities decoded', () => {
  const html = `<!doctype html><html><head>
    <title>Fallback title</title>
    <meta property="og:title" content="Supplementation with Akkermansia &amp; friends">
    <meta name="description" content="Plain description">
    <meta property="og:description" content='It&#39;s a &quot;trial&quot;'>
    <meta property="og:site_name" content="Nature Medicine">
    <meta property="og:image" content="/media/cover.png">
    <link rel="icon" type="image/svg+xml" href="/icon.svg">
    <link rel="icon" href="/favicon-32.png">
  </head><body><meta property="og:title" content="Ignored, outside head"></body></html>`;
  const found = extractMetadata(html, new URL('https://www.nature.com/articles/x'));
  assert.equal(found.title, 'Supplementation with Akkermansia & friends');
  assert.equal(found.description, 'It\'s a "trial"');
  assert.equal(found.siteName, 'Nature Medicine');
  assert.equal(found.image, 'https://www.nature.com/media/cover.png');
  // The SVG icon is skipped because the proxy refuses SVG.
  assert.equal(found.favicon, 'https://www.nature.com/favicon-32.png');
});

test('page metadata falls back to the title tag, the domain and /favicon.ico', () => {
  const found = extractMetadata('<head><title> A  page\n title </title></head>', new URL('https://www.fda.gov/x'));
  assert.equal(found.title, 'A page title');
  assert.equal(found.siteName, 'fda.gov');
  assert.equal(found.description, undefined);
  assert.equal(found.image, undefined);
  assert.equal(found.favicon, 'https://www.fda.gov/favicon.ico');

  const empty = extractMetadata('<p>no head</p>', new URL('https://example.org/'));
  assert.equal(empty.title, 'example.org');
});

test('page metadata never yields a non-http image URL', () => {
  const found = extractMetadata(
    '<head><meta property="og:image" content="javascript:alert(1)"><link rel="icon" href="data:image/png;base64,AAAA"></head>',
    new URL('https://example.com/'),
  );
  assert.equal(found.image, undefined);
  assert.equal(found.favicon, undefined);
});

test('proxied images are identified by their bytes, and SVG or HTML is refused', () => {
  const pad = (head: number[]) => Buffer.from([...head, ...new Array(16).fill(0)]);
  assert.equal(sniffImageType(pad([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])), 'image/png');
  assert.equal(sniffImageType(pad([0xff, 0xd8, 0xff, 0xe0])), 'image/jpeg');
  assert.equal(sniffImageType(Buffer.from('GIF89a\0\0\0\0\0\0\0\0')), 'image/gif');
  assert.equal(sniffImageType(Buffer.from('RIFF\0\0\0\0WEBPVP8 ')), 'image/webp');
  assert.equal(sniffImageType(pad([0, 0, 1, 0, 1, 0])), 'image/x-icon');
  assert.equal(sniffImageType(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>')), undefined);
  assert.equal(sniffImageType(Buffer.from('<!doctype html><script>alert(1)</script>')), undefined);
  assert.equal(sniffImageType(Buffer.from('tiny')), undefined);
});

test('the image proxy only serves URLs the server signed', () => {
  const url = 'https://www.nature.com/media/cover.png';
  const sig = signAsset(url);
  assert.equal(verifyAsset(url, sig), true);
  assert.equal(verifyAsset('https://evil.example/cover.png', sig), false);
  assert.equal(verifyAsset(url, sig.slice(1)), false);
  assert.equal(verifyAsset(url, ''), false);
});

test('bot-challenge pages and empty pages are not presented as the source', () => {
  for (const title of [
    'Checking your browser - reCAPTCHA',
    'Just a moment...',
    'Attention Required! | Cloudflare',
    'Robot Check',
    'Access Denied',
    'Pardon Our Interruption',
  ]) {
    assert.equal(isUsablePreview({ title }, 'example.com'), false, title);
  }
  assert.equal(isUsablePreview({ title: 'pubmed.ncbi.nlm.nih.gov' }, 'pubmed.ncbi.nlm.nih.gov'), false);
  assert.equal(isUsablePreview({ title: 'Questions and Answers on Dietary Supplements' }, 'fda.gov'), true);
  assert.equal(isUsablePreview({ title: 'fda.gov', description: 'A real description' }, 'fda.gov'), true);
});
