/*
 * Draws the YouTube thumbnail (1280×720) and writes the description with
 * chapter times taken from .out/timeline.json.
 *
 *   node thumbnail.mjs
 */
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dest = join(here, '..', '..', '..', 'social', 'youtube');
const require = createRequire(import.meta.url);
const font = (pkg, file) => readFileSync(join(dirname(require.resolve(`@fontsource/${pkg}/package.json`)), 'files', file)).toString('base64');
const MIME = { jpg: 'jpeg', png: 'png', webp: 'webp' };
const img = (f) => `data:image/${MIME[f.split('.').pop()]};base64,${readFileSync(join(here, 'assets', f)).toString('base64')}`;
const tubs = [['now.png', 1, 1], ['bulk.jpg', 1, 2], ['on.webp', 1.55, 4], ['thorne.webp', 1.25, 5]];

const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:'DM Sans';font-weight:700;src:url(data:font/woff2;base64,${font('dm-sans', 'dm-sans-latin-700-normal.woff2')}) format('woff2')}
@font-face{font-family:'Newsreader';font-style:italic;src:url(data:font/woff2;base64,${font('newsreader', 'newsreader-latin-400-italic.woff2')}) format('woff2')}
*{margin:0;box-sizing:border-box}
body{width:1280px;height:720px;overflow:hidden;font-family:'DM Sans';color:#fbf9f5;position:relative;background:#183b37}
.logo{position:absolute;left:52px;top:40px;display:flex;align-items:center;gap:12px;font-size:30px;font-weight:700}
.mark{display:grid;grid-template-columns:15px 15px;gap:4px}.mark i{width:15px;height:15px;border-radius:4px;background:#fbf9f5}.mark i:last-child{background:#7cc47e}
h1{position:absolute;left:48px;top:110px;font-size:150px;line-height:.9;font-weight:700;letter-spacing:-.05em}
h1 em{display:block;font-family:'Newsreader';font-weight:400;color:#d8b876;font-size:164px;letter-spacing:-.03em}
.tag{position:absolute;right:52px;top:36px;background:#d8b876;color:#1c2a28;font-size:40px;font-weight:700;letter-spacing:-.02em;padding:10px 28px;border-radius:999px}
.row{position:absolute;left:48px;right:48px;bottom:44px;display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
.c{position:relative;height:270px;border-radius:30px;background:#fff;display:grid;place-items:center;overflow:hidden}
.c img{max-width:190px;max-height:220px}
.c b{position:absolute;left:14px;top:6px;font-family:'Newsreader';font-style:italic;font-weight:400;font-size:84px;line-height:1;color:#183b37}
.sub{position:absolute;right:52px;top:150px;width:420px;text-align:right;font-size:58px;line-height:1.02;font-weight:700;letter-spacing:-.035em}
.sub span{color:#f3b596}
</style>
<div class="logo"><span class="mark"><i></i><i></i><i></i><i></i></span>SharpAndLean</div>
<div class="tag">2026</div>
<h1>Best<em>creatine</em></h1>
<div class="sub">7 ranked by <span>cost a day</span></div>
<div class="row">${tubs.map(([f, z, n]) => `<div class="c"><img src="${img(f)}" style="transform:scale(${z})"><b>${n}</b></div>`).join('')}</div>`;
if (new RegExp('Sharp' + '\\s*(&|and\\s)', 'i').test(html.replace(/base64,[A-Za-z0-9+/=]+/g, ''))) throw new Error('Write the brand name as one word.');

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: join(dest, 'best-creatine-thumbnail.jpg'), type: 'jpeg', quality: 92 });
await browser.close();

const tl = JSON.parse(readFileSync(join(here, '.out', 'timeline.json'), 'utf8'));
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const chapters = tl.chapters.map((c) => `${mmss(c.s)} ${c.name}`).join('\n');
writeFileSync(join(dest, 'best-creatine-description.md'), `# Upload details: Best creatine powder 2026

**Title**

Best Creatine Powder in 2026: 7 Ranked by Cost a Day

**Description**

Which creatine powder is worth buying in 2026? We read the labels and US list prices on the makers' own websites and counted down seven, with the cost a day and the catch for each.

Where to buy (links to be added):
► 1. NOW Sports Creatine Monohydrate - [ADD LINK]
► 2. BulkSupplements Creatine Monohydrate - [ADD LINK]
► 3. Nutricost Creatine Monohydrate - [ADD LINK]
► 4. Optimum Nutrition Micronized Creatine - [ADD LINK]
► 5. Thorne Creatine - [ADD LINK]
► 6. Transparent Labs Creatine HMB - [ADD LINK]
► 7. Kaged Creatine HCl - [ADD LINK]

[AFFILIATE DISCLOSURE: if any link above is an affiliate link, keep this line: "Some links are affiliate links. We may earn a commission if you buy, at no extra cost to you. It does not change the ranking." Delete it if none are.]

The short version: plain creatine monohydrate, 3 to 5 g a day. NOW Sports is our pick at about 21 cents a day with Informed Sport certification; BulkSupplements is the cheapest at about 15 cents a day; Thorne is the pick if you are drug tested (NSF Certified for Sport).

Chapters
${chapters}

More on creatine, with every source: https://sharpandlean.com/ingredients/creatine-monohydrate

How we did it: label figures and one-time list prices were read from each maker's own US website on 7 October 2026, and the cost a day is worked out at 5 g a day in the pack size shown (Kaged at its 3 g label dose). We did not test the powders and these seven are not scored reviews. Prices change, so check the cost a day before you buy.

Narration is an AI voice. This video is general information, not medical advice. Speak to a doctor first if you have kidney disease or are pregnant or breastfeeding.

**Tags**

best creatine, best creatine powder, best creatine 2026, creatine monohydrate, best creatine monohydrate, creatine supplement, NOW Sports creatine, Thorne creatine, Optimum Nutrition creatine, Nutricost creatine, BulkSupplements creatine, creatine HCl vs monohydrate, SharpAndLean

**Upload settings**

- Thumbnail: best-creatine-thumbnail.jpg
- Playlist: Buying guides
- Category: Education
- Audience: not made for kids
- Paid promotion: tick "includes paid promotion" only if a brand paid for placement; affiliate links alone need the disclosure line above
`);
console.log('thumbnail and description written');
