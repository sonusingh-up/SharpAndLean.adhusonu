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
const img = (f) => `data:image/jpeg;base64,${readFileSync(join(here, 'assets', f)).toString('base64')}`;

const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:'DM Sans';font-weight:300;src:url(data:font/woff2;base64,${font('dm-sans', 'dm-sans-latin-300-normal.woff2')}) format('woff2')}
@font-face{font-family:'DM Sans';font-weight:700;src:url(data:font/woff2;base64,${font('dm-sans', 'dm-sans-latin-700-normal.woff2')}) format('woff2')}
@font-face{font-family:'Newsreader';font-style:italic;src:url(data:font/woff2;base64,${font('newsreader', 'newsreader-latin-400-italic.woff2')}) format('woff2')}
*{margin:0;box-sizing:border-box}
body{width:1280px;height:720px;overflow:hidden;font-family:'DM Sans';color:#1c2a28;position:relative;background:#dcebe6}
.logo{position:absolute;left:56px;top:44px;display:flex;align-items:center;gap:12px;font-size:30px;font-weight:700}
.mark{display:grid;grid-template-columns:15px 15px;gap:4px}.mark i{width:15px;height:15px;border-radius:4px;background:#1c2a28}.mark i:last-child{background:#7cc47e}
h1{position:absolute;left:52px;top:160px;font-size:106px;line-height:.96;font-weight:300;letter-spacing:-.04em}
h1 em{font-family:'Newsreader';font-weight:400;color:#2f7c72}
.tag{position:absolute;left:56px;bottom:56px;background:#183b37;color:#fbf9f5;font-size:44px;font-weight:700;letter-spacing:-.02em;padding:16px 34px;border-radius:999px}
.yr{position:absolute;left:530px;bottom:56px;font-size:44px;font-weight:700;padding:14px 30px;border-radius:999px;border:3px solid #183b37}
.cards{position:absolute;right:48px;top:70px;display:grid;grid-template-columns:230px 230px;gap:18px}
.c{height:280px;border-radius:34px;background:#fff;display:grid;place-items:center}
.c img{max-width:170px;max-height:230px}
</style>
<div class="logo"><span class="mark"><i></i><i></i><i></i><i></i></span>SharpAndLean</div>
<h1>Best<br>ashwagandha<br><em>brands.</em></h1>
<div class="tag">6 labels compared</div><div class="yr">2026</div>
<div class="cards">${['now-ksm66', 'jarrow', 'gaia', 'goli'].map((p) => `<div class="c"><img src="${img(p + '.jpg')}"></div>`).join('')}</div>`;
if (new RegExp('Sharp' + '\\s*(&|and\\s)', 'i').test(html.replace(/base64,[A-Za-z0-9+/=]+/g, ''))) throw new Error('Write the brand name as one word.');

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: join(dest, 'best-ashwagandha-thumbnail.jpg'), type: 'jpeg', quality: 92 });
await browser.close();

const tl = JSON.parse(readFileSync(join(here, '.out', 'timeline.json'), 'utf8'));
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const chapters = tl.chapters.map((c) => `${mmss(c.s)} ${c.name}`).join('\n');
writeFileSync(join(dest, 'best-ashwagandha-description.md'), `# Upload details: Best ashwagandha brands 2026

**Title**

Best Ashwagandha Brands You Can Try in 2026 (6 Labels Compared)

**Description**

Which ashwagandha brand is worth buying in 2026? We read six US labels line by line and compared the extract, the daily dose, the withanolides and the cost a day.

The short version: buy the extract, not the brand. A named root extract at 300 to 600 mg a day, with nothing hidden. Our pick is NOW KSM-66 Ashwagandha 600 mg at about 37 cents a day; Jarrow's 300 mg capsules suit a split dose; NOW Ashwagandha 450 mg is the budget choice.

Chapters
${chapters}

Full guide, with every label and source: https://sharpandlean.com/best/ashwagandha-which-brand-is-the-best-to-buy-in-2026

How we did it: label figures and list prices were read from each maker's own website on 1 October 2026. We did not test the capsules, none of these products is scored, and prices change, so check the cost a day before you buy. We earn nothing from the products named here.

Narration is an AI voice. This video is general information, not medical advice. Do not take ashwagandha if you are pregnant or breastfeeding, and check with your doctor first if you have a thyroid or liver condition, an autoimmune disease, or take regular medicines.

**Tags**

best ashwagandha brand, best ashwagandha 2026, ashwagandha brands, KSM-66 ashwagandha, ashwagandha supplement, NOW KSM-66, Jarrow ashwagandha, Goli ashwagandha gummies, Gaia Herbs ashwagandha, Sensoril, which ashwagandha to buy, SharpAndLean

**Upload settings**

- Thumbnail: best-ashwagandha-thumbnail.jpg
- Playlist: Buying guides
- Category: Education
- Audience: not made for kids
`);
console.log('thumbnail and description written');
