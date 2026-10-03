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
h1{position:absolute;left:56px;top:150px;font-size:132px;line-height:.94;letter-spacing:-.045em;text-shadow:0 10px 40px rgba(0,0,0,.5)}
h1 em{display:block;font-family:'Newsreader';font-weight:400;color:#d8b876;font-size:136px;letter-spacing:-.02em}
.tag{position:absolute;left:56px;bottom:60px;background:#e07a5f;color:#fff;font-size:44px;letter-spacing:-.02em;padding:16px 34px;border-radius:999px}
svg{position:absolute;right:20px;top:90px;width:560px;height:560px;overflow:visible}
</style>
<div class="logo"><span class="mark"><i></i><i></i><i></i><i></i></span>SharpAndLean</div>
<h1>Magnesium<em>for sleep?</em></h1>
<div class="tag">What the trials really show</div>
<svg viewBox="0 0 560 560"><defs>
 <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6e2b3"/><stop offset="1" stop-color="#b98f45"/></linearGradient>
 <filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40"/></filter>
 <filter id="s" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="20" stdDeviation="20" flood-opacity=".5"/></filter></defs>
 <circle cx="280" cy="280" r="230" fill="#d8b876" opacity=".3" filter="url(#b)"/>
 ${[0, 60, -60].map((r) => `<g transform="rotate(${r} 280 280)"><ellipse cx="280" cy="280" rx="268" ry="98" fill="none" stroke="#d8b876" stroke-width="4" opacity=".75"/><circle cx="548" cy="280" r="15" fill="${r ? '#7cc47e' : '#f3b596'}"/></g>`).join('')}
 <rect x="130" y="130" width="300" height="300" rx="52" fill="url(#g)" filter="url(#s)"/>
 <text x="166" y="198" font-size="40" font-weight="700" fill="#1c2a28" font-family="DM Sans">12</text>
 <text x="280" y="346" text-anchor="middle" font-size="178" font-weight="700" letter-spacing="-8" fill="#1c2a28" font-family="DM Sans">Mg</text>
</svg>`;
if (new RegExp('Sharp' + '\\s*(&|and\\s)', 'i').test(html.replace(/base64,[A-Za-z0-9+/=]+/g, ''))) throw new Error('Write the brand name as one word.');

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: join(dest, 'magnesium-sleep-thumbnail.jpg'), type: 'jpeg', quality: 92 });
await browser.close();

const tl = JSON.parse(readFileSync(join(here, '.out', 'timeline.json'), 'utf8'));
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const chapters = tl.chapters.map((c) => `${mmss(c.s)} ${c.name}`).join('\n');
writeFileSync(join(dest, 'magnesium-sleep-description.md'), `# Upload details: magnesium for sleep

**Title**

Magnesium for Sleep: What It Can and Can't Do (The Only Video You Need)

**Description**

Can't sleep, and someone told you to try magnesium? Here is what the trials show, which form to pick, how much is safe, and who should check with a pharmacist first.

The short version: magnesium may help a little, mostly if you are not getting enough of it. It is not a sleeping pill.

Chapters
${chapters}

Sources
1. NIH Office of Dietary Supplements. Magnesium: fact sheet for health professionals. https://ods.od.nih.gov/factsheets/Magnesium-HealthProfessional/
2. Mah J, Pitre T. Oral magnesium supplementation for insomnia in older adults: a systematic review and meta-analysis. BMC Complementary Medicine and Therapies, 2021. https://link.springer.com/article/10.1186/s12906-021-03297-z
3. Schuster and colleagues. Randomised, placebo-controlled trial of magnesium bisglycinate in adults reporting poor sleep. Nature and Science of Sleep, 2025. https://pubmed.ncbi.nlm.nih.gov/40918053/

Script checked by Sumita Bhatti, Clinical Nutritionist. Narration is an AI voice.

This video is general information, not medical advice. Speak to a pharmacist or doctor before starting a supplement, especially if you have kidney disease, are pregnant, or take regular medication.

More plain-English supplement guides: https://sharpandlean.com

**Tags**

magnesium for sleep, magnesium glycinate, magnesium citrate, magnesium oxide, insomnia, sleep supplements, does magnesium help you sleep, magnesium dosage, magnesium side effects, magnesium rich foods, SharpAndLean

**Upload settings**

- Thumbnail: magnesium-sleep-thumbnail.jpg
- Playlist: Science, plainly
- Category: Education
- Audience: not made for kids
- Altered content: no (animation with a disclosed AI voice)
`);
console.log('thumbnail and description written');
