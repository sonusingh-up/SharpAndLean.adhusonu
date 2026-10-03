/*
 * Draws the creatine thumbnail (1280×720): warm background, a scoop of powder
 * and the headline. thumbnail.mjs still writes the description.
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

// Powder: a deterministic spray of specks around the scoop.
let seed = 5;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const specks = Array.from({ length: 130 }, () => {
  const a = -Math.PI * (0.1 + rnd() * 0.8), d = 60 + rnd() * 330;
  return `<circle cx="${(905 + Math.cos(a) * d * 1.15).toFixed(0)}" cy="${(400 + Math.sin(a) * d * 0.8).toFixed(0)}" r="${(2 + rnd() * 9).toFixed(1)}" fill="#fff" opacity="${(0.5 + rnd() * 0.5).toFixed(2)}"/>`;
}).join('');

const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:'DM Sans';font-weight:700;src:url(data:font/woff2;base64,${font('dm-sans', 'dm-sans-latin-700-normal.woff2')}) format('woff2')}
@font-face{font-family:'Newsreader';font-style:italic;src:url(data:font/woff2;base64,${font('newsreader', 'newsreader-latin-400-italic.woff2')}) format('woff2')}
*{margin:0;box-sizing:border-box}
body{width:1280px;height:720px;overflow:hidden;font-family:'DM Sans';color:#1c2a28;position:relative;
 background:radial-gradient(700px 520px at 74% 44%,#ffd9a8 0%,rgba(255,217,168,0) 70%),linear-gradient(135deg,#f3b596 0%,#e9906f 55%,#d96f52 100%)}
.logo{position:absolute;left:56px;top:44px;display:flex;align-items:center;gap:12px;font-size:30px}
.mark{display:grid;grid-template-columns:15px 15px;gap:4px}.mark i{width:15px;height:15px;border-radius:4px;background:#1c2a28}.mark i:last-child{background:#183b37}
h1{position:absolute;left:52px;top:128px;font-size:170px;line-height:.9;letter-spacing:-.055em}
h1 em{display:block;margin-top:6px;font-family:'Newsreader';font-weight:400;font-size:112px;letter-spacing:-.02em;color:#183b37}
.pill{position:absolute;left:56px;bottom:56px;background:#183b37;color:#fbf9f5;font-size:44px;letter-spacing:-.02em;padding:18px 36px;border-radius:999px}
.badge{position:absolute;right:54px;top:44px;width:190px;height:190px;border-radius:50%;background:#fbf9f5;display:grid;place-items:center;text-align:center;transform:rotate(10deg);box-shadow:0 18px 40px rgba(60,20,10,.3)}
.badge b{display:block;font-size:64px;line-height:1;letter-spacing:-.04em}.badge span{display:block;font-size:24px;letter-spacing:.06em;text-transform:uppercase;color:#5d6865}
svg{position:absolute;inset:0;width:1280px;height:720px}
</style>
<svg viewBox="0 0 1280 720"><defs>
 <linearGradient id="sc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2f7c72"/><stop offset="1" stop-color="#143630"/></linearGradient>
 <linearGradient id="pw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e9e2d6"/></linearGradient>
 <filter id="sh" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="22" stdDeviation="20" flood-color="#5a1f10" flood-opacity=".4"/></filter>
</defs>
 ${specks}
 <g transform="rotate(-14 880 470)" filter="url(#sh)">
  <rect x="1040" y="446" width="270" height="46" rx="23" fill="url(#sc)"/>
  <path d="M700 430 h360 v70 a180 150 0 0 1 -360 0 z" fill="url(#sc)"/>
  <ellipse cx="880" cy="430" rx="180" ry="46" fill="#0f2925"/>
  <path d="M712 432 q40 -150 168 -160 q130 6 168 160 a168 40 0 0 1 -336 0 z" fill="url(#pw)"/>
 </g>
</svg>
<div class="logo"><span class="mark"><i></i><i></i><i></i><i></i></span>SharpAndLean</div>
<h1>Creatine<em>benefits</em></h1>
<div class="pill">How to take it, in 4 steps</div>
<div class="badge"><div><b>3–5 g</b><span>a day</span></div></div>`;
if (new RegExp('Sharp' + '\\s*(&|and\\s)', 'i').test(html.replace(/base64,[A-Za-z0-9+/=]+/g, ''))) throw new Error('Write the brand name as one word.');

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: join(dest, 'creatine-thumbnail.jpg'), type: 'jpeg', quality: 92 });
await browser.close();
console.log('thumbnail written');
