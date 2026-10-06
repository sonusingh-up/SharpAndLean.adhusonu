/*
 * Draws the B12 thumbnail (1280×720) over the capsule photograph.
 *
 *   node thumbnail-art.mjs
 */
import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dest = join(here, '..', '..', '..', 'social', 'youtube');
const require = createRequire(import.meta.url);
const font = (pkg, file) => readFileSync(join(dirname(require.resolve(`@fontsource/${pkg}/package.json`)), 'files', file)).toString('base64');
const hero = readFileSync(join(here, 'assets', 'hero.jpg')).toString('base64');

const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:'DM Sans';font-weight:700;src:url(data:font/woff2;base64,${font('dm-sans', 'dm-sans-latin-700-normal.woff2')}) format('woff2')}
@font-face{font-family:'Newsreader';font-style:italic;src:url(data:font/woff2;base64,${font('newsreader', 'newsreader-latin-400-italic.woff2')}) format('woff2')}
*{margin:0;box-sizing:border-box}
body{width:1280px;height:720px;overflow:hidden;font-family:'DM Sans';color:#fbf9f5;position:relative;background:#050e0d}
.bg{position:absolute;inset:0;background:url(data:image/jpeg;base64,${hero}) 70% 50%/125% no-repeat}
.scrim{position:absolute;inset:0;background:linear-gradient(90deg,rgba(4,12,11,.96) 0%,rgba(4,12,11,.8) 42%,rgba(4,12,11,.1) 78%)}
.logo{position:absolute;left:56px;top:44px;display:flex;align-items:center;gap:12px;font-size:30px}
.mark{display:grid;grid-template-columns:15px 15px;gap:4px}.mark i{width:15px;height:15px;border-radius:4px;background:#fbf9f5}.mark i:last-child{background:#7cc47e}
.five{position:absolute;left:40px;top:96px;font-family:'Newsreader';font-style:italic;font-size:470px;line-height:1;color:#d8b876;text-shadow:0 0 70px rgba(216,184,118,.45)}
h1{position:absolute;left:300px;top:190px;font-size:150px;line-height:.92;letter-spacing:-.05em;text-shadow:0 10px 40px rgba(0,0,0,.7)}
h1 em{display:block;font-family:'Newsreader';font-weight:400;font-size:86px;letter-spacing:-.01em;color:#d8b876;margin-top:10px}
.pill{position:absolute;left:56px;bottom:56px;background:#e07a5f;color:#fff;font-size:42px;letter-spacing:-.02em;padding:16px 34px;border-radius:999px}
</style>
<div class="bg"></div><div class="scrim"></div>
<div class="logo"><span class="mark"><i></i><i></i><i></i><i></i></span>SharpAndLean</div>
<div class="five">5</div>
<h1>signs<em>of B12 deficiency</em></h1>
<div class="pill">And who really needs a supplement</div>`;
if (new RegExp('Sharp' + '\\s*(&|and\\s)', 'i').test(html.replace(/base64,[A-Za-z0-9+/=]+/g, ''))) throw new Error('Write the brand name as one word.');

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: join(dest, 'b12-deficiency-thumbnail.jpg'), type: 'jpeg', quality: 92 });
await browser.close();
console.log('thumbnail written');
