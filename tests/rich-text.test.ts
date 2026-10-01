import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { RichText } from '../components/rich-text';
import { fruitTableHtml, fruits } from '../lib/fruit-gi';

function render(html: string) {
  return renderToStaticMarkup(createElement(RichText, { html }));
}

test('wide fruit tables get a keyboard-accessible scroll container, not the whole article', () => {
  const output = render(`<h2>The short answer</h2><p>Introductory text.</p>${fruitTableHtml()}`);
  assert.match(output, /<p>Introductory text\.<\/p><div class="article-table-scroll"/);
  assert.match(
    output,
    /role="region" aria-label="Table \(scroll horizontally if needed\)" tabindex="0"/,
  );
  assert.equal((output.match(/class="article-table-scroll"/g) || []).length, 1);
  assert.equal((output.match(/<tr>/g) || []).length, fruits.length + 1);
  assert.equal((output.match(/<th>/g) || []).length, 5);
  assert.match(output, /<a[^>]+href="\/learn\/are-raisins-good-for-diabetes"[^>]*>Raisins<\/a>/);
  assert.match(output, /<\/tbody>\s*<\/table><\/div><\/div>$/);
});

test('table captions, row headers and spans are preserved for comparison layouts', () => {
  const output = render(
    '<table><caption>Comparison</caption><thead><tr><th></th><th colspan="2">Values</th></tr></thead><tbody><tr><th rowspan="2">Fruit</th><td>Apple</td><td>Pear</td></tr><tr><td>5</td><td>6</td></tr></tbody></table>',
  );
  assert.match(output, /<table><caption>Comparison<\/caption><thead>/);
  assert.match(output, /<th colSpan="2">Values<\/th>/);
  assert.match(output, /<tbody><tr><th rowSpan="2">Fruit<\/th><td>Apple<\/td><td>Pear<\/td>/);
});

test('normal prose stays outside scroll containers and table content is still sanitised', () => {
  assert.doesNotMatch(render('<h2>Introduction</h2><p>Ordinary text.</p>'), /article-table-scroll/);
  const output = render(
    '<table onclick="alert(1)"><tbody><tr><td><script>alert(1)</script>Safe</td></tr></tbody></table>',
  );
  assert.doesNotMatch(output, /onclick|<script|alert\(1\)/);
  assert.match(output, /<td>Safe<\/td>/);
});

test('a registered responsive fruit block replaces its fallback without duplicating the table', () => {
  const output = renderToStaticMarkup(
    createElement(RichText, {
      html: `<p>Before.</p><div data-tool="fruit-comparison">${fruitTableHtml()}</div><p>After.</p>`,
      tools: {
        'fruit-comparison': createElement('div', { 'data-fruit-comparison': true }, 'Comparison'),
      },
    }),
  );
  assert.match(
    output,
    /<p>Before\.<\/p><div data-fruit-comparison="true">Comparison<\/div><p>After\.<\/p>/,
  );
  assert.doesNotMatch(output, /<table|article-table-scroll/);
});
