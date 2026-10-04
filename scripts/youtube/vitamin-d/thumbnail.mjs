/*
 * Draws the YouTube thumbnail (1280×720) in the website's light style and
 * writes the description with chapter times taken from .out/timeline.json.
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
const rays = Array.from({ length: 16 }, (_, i) => `<line x1="300" y1="${i % 2 ? 70 : 28}" x2="300" y2="128" stroke="#a9813c" stroke-width="9" stroke-linecap="round" transform="rotate(${i * 22.5} 300 300)"/>`).join('');

const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:'DM Sans';font-weight:300;src:url(data:font/woff2;base64,${font('dm-sans', 'dm-sans-latin-300-normal.woff2')}) format('woff2')}
@font-face{font-family:'DM Sans';font-weight:700;src:url(data:font/woff2;base64,${font('dm-sans', 'dm-sans-latin-700-normal.woff2')}) format('woff2')}
@font-face{font-family:'Newsreader';font-style:italic;src:url(data:font/woff2;base64,${font('newsreader', 'newsreader-latin-400-italic.woff2')}) format('woff2')}
*{margin:0;box-sizing:border-box}
body{width:1280px;height:720px;overflow:hidden;font-family:'DM Sans';color:#1c2a28;position:relative;
 background:radial-gradient(760px 620px at 88% 18%,rgba(243,181,150,.6),rgba(243,181,150,0) 70%),radial-gradient(700px 600px at 0% 100%,rgba(47,124,114,.2),rgba(47,124,114,0) 65%),#fbf9f5}
.logo{position:absolute;left:56px;top:44px;display:flex;align-items:center;gap:12px;font-size:30px;font-weight:700}
.mark{display:grid;grid-template-columns:15px 15px;gap:4px}.mark i{width:15px;height:15px;border-radius:4px;background:#1c2a28}.mark i:last-child{background:#7cc47e}
h1{position:absolute;left:52px;top:130px;font-size:176px;line-height:.92;font-weight:300;letter-spacing:-.04em}
h1 em{font-family:'Newsreader';font-weight:400;color:#2f7c72;font-size:1.12em}
p{position:absolute;left:58px;top:330px;font-size:70px;line-height:1.05;font-weight:700;letter-spacing:-.035em}
.tag{position:absolute;left:56px;bottom:56px;background:#183b37;color:#fbf9f5;font-size:44px;font-weight:700;letter-spacing:-.02em;padding:16px 34px;border-radius:999px}
svg{position:absolute;right:40px;top:120px;width:500px;height:500px;overflow:visible}
.dose{position:absolute;right:120px;bottom:60px;background:#fff;border:2px solid #e8e1d5;box-shadow:0 8px 0 0 #e8e1d5;border-radius:26px;padding:14px 30px;font-size:58px;font-weight:700;letter-spacing:-.03em;color:#183b37}
</style>
<div class="logo"><span class="mark"><i></i><i></i><i></i><i></i></span>SharpAndLean</div>
<h1>Vitamin <em>D</em></h1>
<p>How much?<br>Which form?</p>
<div class="tag">And who is actually low</div>
<svg viewBox="0 0 600 600">${rays}<circle cx="300" cy="300" r="150" fill="#f6e8c9" stroke="#a9813c" stroke-width="9"/></svg>
<div class="dose">10 mcg = 400 IU</div>`;
if (new RegExp('Sharp' + '\\s*(&|and\\s)', 'i').test(html.replace(/base64,[A-Za-z0-9+/=]+/g, ''))) throw new Error('Write the brand name as one word.');

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: join(dest, 'vitamin-d-thumbnail.jpg'), type: 'jpeg', quality: 92 });
await browser.close();

const tl = JSON.parse(readFileSync(join(here, '.out', 'timeline.json'), 'utf8'));
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const chapters = tl.chapters.map((c) => `${mmss(c.s)} ${c.name}`).join('\n');
writeFileSync(join(dest, 'vitamin-d-description.md'), `# Upload details: Vitamin D

**Title**

Vitamin D: How Much to Take, Which Form, and Who Is Low

**Description**

How much vitamin D should you take, which form is best, and who is actually low? The plain answers, from UK and US guidance.

The short version: for most UK adults, 10 micrograms (400 IU) a day from October to March, and all year if you get little sun, cover your skin or have dark skin. A plain vitamin D3 is all most people need. Check the units (1 microgram is 40 IU) and stay under 100 micrograms (4,000 IU) a day.

Chapters
${chapters}

Full guide, with every source: https://sharpandlean.com/guides/vitamin-d-how-much-which-form-who-is-low

Script checked by Sumita Bhatti, Clinical Nutritionist. Narration is an AI voice.

This video is general information, not medical advice. Check with a doctor or pharmacist first if you have kidney disease, a condition that affects calcium, or take regular medicines.

**Tags**

vitamin d, how much vitamin d should i take, vitamin d dosage, vitamin d3, vitamin d3 vs d2, vitamin d deficiency, vitamin d iu to mcg, vitamin d upper limit, vitamin d in winter, vegan vitamin d, SharpAndLean

**Upload settings**

- Thumbnail: vitamin-d-thumbnail.jpg
- Playlist: Science, plainly
- Category: Education
- Audience: not made for kids
`);
console.log('thumbnail and description written');
