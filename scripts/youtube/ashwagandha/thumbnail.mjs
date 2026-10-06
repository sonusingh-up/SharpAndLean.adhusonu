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

const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:'DM Sans';font-weight:700;src:url(data:font/woff2;base64,${font('dm-sans', 'dm-sans-latin-700-normal.woff2')}) format('woff2')}
@font-face{font-family:'Newsreader';font-style:italic;src:url(data:font/woff2;base64,${font('newsreader', 'newsreader-latin-400-italic.woff2')}) format('woff2')}
*{margin:0;box-sizing:border-box}
body{width:1280px;height:720px;overflow:hidden;font-family:'DM Sans';color:#fbf9f5;position:relative;
 background:radial-gradient(800px 600px at 82% 30%,#2c6259 0%,rgba(44,98,89,0) 70%),radial-gradient(700px 600px at 0% 100%,#4a3a20 0%,rgba(74,58,32,0) 65%),linear-gradient(160deg,#102a26,#081614)}
.logo{position:absolute;left:56px;top:44px;display:flex;align-items:center;gap:12px;font-size:30px}
.mark{display:grid;grid-template-columns:15px 15px;gap:4px}.mark i{width:15px;height:15px;border-radius:4px;background:#fbf9f5}.mark i:last-child{background:#7cc47e}
h1{position:absolute;left:56px;top:160px;font-size:118px;line-height:.94;letter-spacing:-.045em;text-shadow:0 10px 40px rgba(0,0,0,.5)}
h1 em{display:block;font-family:'Newsreader';font-weight:400;color:#d8b876;font-size:136px;letter-spacing:-.02em}
.tag{position:absolute;left:56px;bottom:60px;background:#e07a5f;color:#fff;font-size:44px;letter-spacing:-.02em;padding:16px 34px;border-radius:999px}
svg{position:absolute;right:-30px;top:70px;width:560px;height:560px;overflow:visible}
</style>
<div class="logo"><span class="mark"><i></i><i></i><i></i><i></i></span>SharpAndLean</div>
<h1>Ashwagandha<em>benefits?</em></h1>
<div class="tag">What the trials really show</div>
<svg viewBox="0 0 560 560"><defs>
 <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6e2b3"/><stop offset="1" stop-color="#b98f45"/></linearGradient>
 <linearGradient id="t" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4aa597"/><stop offset="1" stop-color="#256a61"/></linearGradient>
 <filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40"/></filter></defs>
 <circle cx="280" cy="280" r="230" fill="#d8b876" opacity=".3" filter="url(#b)"/>
 <g transform="translate(280 330) scale(1.05)">
  <path d="M0 0 q-14 70 -6 130 q6 60 -20 120 M-4 110 q-40 30 -60 90 M-2 150 q34 30 44 86" fill="none" stroke="url(#g)" stroke-width="24" stroke-linecap="round"/>
  <path d="M0 0 V-230" stroke="#2f7c72" stroke-width="16" stroke-linecap="round"/>
  ${[[-1, -70, -32], [1, -110, 30], [-1, -160, -24], [1, -200, 26]].map(([d, y, r]) => `<path d="M0 ${y} q${d * 90} -50 ${d * 150} -6 q${-d * 60} 50 ${-d * 150} 6 z" fill="url(#t)" transform="rotate(${r} 0 ${y})"/>`).join('')}
  ${[[-34, -236], [30, -250], [0, -274]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="22" fill="#e07a5f"/>`).join('')}
 </g>
</svg>`;
if (new RegExp('Sharp' + '\\s*(&|and\\s)', 'i').test(html.replace(/base64,[A-Za-z0-9+/=]+/g, ''))) throw new Error('Write the brand name as one word.');

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: join(dest, 'ashwagandha-thumbnail.jpg'), type: 'jpeg', quality: 92 });
await browser.close();

const tl = JSON.parse(readFileSync(join(here, '.out', 'timeline.json'), 'utf8'));
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const chapters = tl.chapters.map((c) => `${mmss(c.s)} ${c.name}`).join('\n');
writeFileSync(join(dest, 'ashwagandha-description.md'), `# Upload details: ashwagandha benefits

**Title**

Ashwagandha Benefits: What It Can and Can't Do (Stress, Sleep, Safety)

**Description**

Ashwagandha benefits, checked against the trials: what it does for stress and sleep, how much people took, the side effects, and who should not take it.

The short version: ashwagandha may help with stress and sleep. The effect on sleep is small, the trials are short, and it is not safe for everyone.

Chapters
${chapters}

Sources
1. NIH Office of Dietary Supplements. Ashwagandha: fact sheet for health professionals. https://ods.od.nih.gov/factsheets/Ashwagandha-HealthProfessional/
2. NIH National Center for Complementary and Integrative Health. Ashwagandha. https://www.nccih.nih.gov/health/ashwagandha

Script checked by Sumita Bhatti, Clinical Nutritionist. Narration is an AI voice.

This video is general information, not medical advice. Speak to a pharmacist or doctor before starting a supplement, especially if you are pregnant or breastfeeding, have a thyroid or autoimmune condition, or take regular medication.

More plain-English supplement guides: https://sharpandlean.com

**Tags**

ashwagandha benefits, ashwagandha, ashwagandha side effects, ashwagandha for sleep, ashwagandha for stress, ashwagandha dosage, ashwagandha for anxiety, KSM-66, withanolides, is ashwagandha safe, SharpAndLean

**Upload settings**

- Thumbnail: ashwagandha-thumbnail.jpg
- Playlist: Science, plainly
- Category: Education
- Audience: not made for kids
- Altered content: no (animation with a disclosed AI voice)
`);
console.log('thumbnail and description written');
