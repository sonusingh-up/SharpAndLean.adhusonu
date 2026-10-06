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
h1{position:absolute;left:56px;top:160px;font-size:150px;line-height:.94;letter-spacing:-.045em;text-shadow:0 10px 40px rgba(0,0,0,.5)}
h1 em{display:block;font-family:'Newsreader';font-weight:400;color:#d8b876;font-size:136px;letter-spacing:-.02em}
.tag{position:absolute;left:56px;bottom:60px;background:#e07a5f;color:#fff;font-size:44px;letter-spacing:-.02em;padding:16px 34px;border-radius:999px}
svg{position:absolute;right:30px;top:80px;width:560px;height:560px;overflow:visible}
</style>
<div class="logo"><span class="mark"><i></i><i></i><i></i><i></i></span>SharpAndLean</div>
<h1>Creatine<em>benefits</em></h1>
<div class="tag">How to take it, step by step</div>
<svg viewBox="0 0 560 560"><defs>
 <linearGradient id="t" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4aa597"/><stop offset="1" stop-color="#256a61"/></linearGradient>
 <linearGradient id="gl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".0"/><stop offset=".3" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient>
 <filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40"/></filter>
 <filter id="s" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="20" stdDeviation="20" flood-opacity=".5"/></filter></defs>
 <circle cx="280" cy="290" r="240" fill="#d8b876" opacity=".3" filter="url(#b)"/>
 <g transform="rotate(8 280 300)">
 <rect x="110" y="150" width="340" height="380" rx="40" fill="#fbf9f5" filter="url(#s)"/>
 <rect x="110" y="270" width="340" height="170" fill="url(#t)"/>
 <rect x="110" y="150" width="340" height="380" rx="40" fill="url(#gl)"/>
 <rect x="92" y="80" width="376" height="96" rx="26" fill="#183b37"/><rect x="92" y="80" width="376" height="96" rx="26" fill="url(#gl)"/>
 <text x="280" y="346" text-anchor="middle" font-size="50" font-weight="700" fill="#fbf9f5" font-family="DM Sans">CREATINE</text>
 <text x="280" y="402" text-anchor="middle" font-size="40" font-weight="700" fill="#fbf9f5" font-family="DM Sans">3–5 g a day</text>
 </g>
</svg>`;
if (new RegExp('Sharp' + '\\s*(&|and\\s)', 'i').test(html.replace(/base64,[A-Za-z0-9+/=]+/g, ''))) throw new Error('Write the brand name as one word.');



const tl = JSON.parse(readFileSync(join(here, '.out', 'timeline.json'), 'utf8'));
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const chapters = tl.chapters.map((c) => `${mmss(c.s)} ${c.name}`).join('\n');
writeFileSync(join(dest, 'b12-deficiency-description.md'), `# Upload details: B12 deficiency

**Title**

5 Signs of B12 Deficiency (and Who Really Needs a Supplement)

**Description**

B12 deficiency symptoms build slowly and are easy to blame on something else. These are the five signs to take seriously, the blood test that confirms it, and who really needs a B12 supplement.

The short version: tiredness and breathlessness, pins and needles, balance problems, a sore red tongue, and memory or mood changes. Vegans always need B12; most people over 50 and anyone on metformin or a long-term acid reducer should ask about it. For everyone else, extra B12 does nothing.

Chapters
${chapters}

Full guide, with every source: https://sharpandlean.com/guides/b12-deficiency-signs-who-needs-a-supplement

Script checked by Sumita Bhatti, Clinical Nutritionist. Narration is an AI voice, and the background images are AI-generated illustrations, not photographs of real patients.

This video is general information, not medical advice. See a doctor promptly if you have numbness, pins and needles, balance problems or confusion.

**Tags**

b12 deficiency symptoms, vitamin b12 deficiency, signs of b12 deficiency, b12 deficiency, vitamin b12, who needs b12 supplement, b12 for vegans, pernicious anaemia, metformin b12, cyanocobalamin, SharpAndLean

**Upload settings**

- Thumbnail: b12-deficiency-thumbnail.jpg
- Playlist: Science, plainly
- Category: Education
- Audience: not made for kids
- Altered content: the images are AI-generated but illustrative; YouTube's altered-content label is for realistic depictions of real people or events, so it should not be required. Tick it if you prefer to be cautious.
`);
console.log('thumbnail and description written');
