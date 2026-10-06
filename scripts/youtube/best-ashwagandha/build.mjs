/*
 * Writes .out/video.html and .out/timeline.json for the YouTube explainer
 * "Best ashwagandha brands you can try in 2026" (1920×1080).
 *
 * Scenes are timed to the recorded narration (use-recorded.mjs writes each
 * line's length to .out/vo.json). Animation and sound cues are placed on the
 * words they belong to: on('dose', 'three hundred and fifty') is the moment
 * that phrase is spoken, estimated from its position in the line.
 *
 * window.seek(t) sets every style from t, so each frame is a pure function of
 * time. Every figure on screen is listed in script.md with its source.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '.out');
const require = createRequire(import.meta.url);

/* ---------- narration and timeline ---------- */

const script = JSON.parse(readFileSync(join(here, 'narration.json'), 'utf8'));
const vo = JSON.parse(readFileSync(join(out, 'vo.json'), 'utf8'));
const LEAD = 0.5; // scene is on screen this long before the voice starts
const TAIL = 0.55; // and this long after it stops
const HOLD = 5; // extra time on the last scene
let cursor = 0;
const T = {};
const L = {};
script.lines.forEach((l, i) => {
  const dur = vo[l.id];
  const last = i === script.lines.length - 1;
  const len = LEAD + dur + TAIL + (last ? HOLD : 0);
  T[l.id] = { s: cursor, e: cursor + len, vo: cursor + LEAD, dur };
  L[l.id] = l;
  cursor += len;
});
const END = Math.ceil(cursor * 30) / 30;
const r2 = (x) => +x.toFixed(2);
// When a phrase is spoken: its character position in the line, as a share of the line's length.
const on = (id, phrase, shift = 0) => {
  const i = L[id].say.indexOf(phrase);
  if (i < 0) throw new Error(`"${phrase}" is not in the "${id}" line`);
  return r2(T[id].vo + (i / L[id].say.length) * T[id].dur + shift);
};
const st = (id, d = 0) => r2(T[id].s + d);

// Sound cues, collected while the scenes are written. S() returns the time so it can sit inline.
const SFX = [];
const S = (name, t, vol = 1) => { SFX.push({ name, t: r2(t), vol }); return r2(t); };

// Captions: sentence timing from the spoken text, then short chunks, then one time per word.
const captions = [];
for (const l of script.lines) {
  const split = (s) => s.split(/(?<=[.?!:])\s+/);
  const said = split(l.say);
  const shown = split(l.text);
  if (said.length !== shown.length) throw new Error(`Caption and spoken sentences differ in "${l.id}"`);
  const total = said.reduce((a, s) => a + s.length, 0);
  let t = T[l.id].vo;
  shown.forEach((sentence, si) => {
    const d = (said[si].length / total) * T[l.id].dur;
    const words = sentence.trim().split(/\s+/);
    const parts = Math.ceil(words.length / 11);
    const size = Math.ceil(words.length / parts);
    const chars = words.join('').length;
    let wt = t;
    for (let i = 0; i < words.length; i += size) {
      const chunk = words.slice(i, i + size);
      const ws = chunk.map((w) => { const o = { w, s: r2(wt) }; wt += (w.length / chars) * d; return o; });
      captions.push({ s: ws[0].s, e: r2(wt), words: ws });
    }
    t += d;
  });
}

/* ---------- assets ---------- */

const b64 = (p) => readFileSync(p).toString('base64');
const fontFile = (pkg, file) => b64(join(dirname(require.resolve(`@fontsource/${pkg}/package.json`)), 'files', file));
const face = (family, weight, style, data) =>
  `@font-face{font-family:'${family}';font-weight:${weight};font-style:${style};src:url(data:font/woff2;base64,${data}) format('woff2');}`;
const fonts = [
  face('DM Sans', 300, 'normal', fontFile('dm-sans', 'dm-sans-latin-300-normal.woff2')),
  face('DM Sans', 600, 'normal', fontFile('dm-sans', 'dm-sans-latin-600-normal.woff2')),
  face('DM Sans', 400, 'normal', fontFile('dm-sans', 'dm-sans-latin-400-normal.woff2')),
  face('DM Sans', 500, 'normal', fontFile('dm-sans', 'dm-sans-latin-500-normal.woff2')),
  face('DM Sans', 700, 'normal', fontFile('dm-sans', 'dm-sans-latin-700-normal.woff2')),
  face('Newsreader', 400, 'italic', fontFile('newsreader', 'newsreader-latin-400-italic.woff2')),
].join('\n');

/* ---------- helpers for the scenes ---------- */

const k = (keys) => `data-k='${JSON.stringify(keys.map(([t, p]) => [r2(t), p]))}'`;
const scene = (id, cls, inner) =>
  `<section class="scene ${cls}" data-s="${T[id].s}" data-e="${T[id].e}"><div class="cam">${inner}</div></section>`;
const head = (id, kicker, h2, sub = '') => `
  <p class="kicker" data-in="${st(id, 0.15)}">${kicker}</p>
  <h2 class="h2" data-in="${st(id, 0.3)}">${h2}</h2>
  ${sub ? `<p class="sub" data-in="${st(id, 0.55)}">${sub}</p>` : ''}`;
// A two-tone capsule with a highlight, drawn around its centre.
const capsule = (x, y, a, b, rot = -28, w = 190, h = 78) => `
  <g transform="translate(${x} ${y}) rotate(${rot})">
    <ellipse cx="6" cy="${h / 2 + 22}" rx="${w / 2}" ry="12" fill="#000" opacity=".28" filter="url(#blur8)"/>
    <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="${b}"/>
    <path d="M${-w / 2 + h / 2} ${-h / 2} h${w / 2 - h / 2} v${h} h${-(w / 2 - h / 2)} a${h / 2} ${h / 2} 0 0 1 0 ${-h} z" fill="${a}"/>
    <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="url(#gloss)"/>
    <rect x="${-w / 2 + 22}" y="${-h / 2 + 10}" width="${w - 44}" height="12" rx="6" fill="#fff" opacity=".45"/>
  </g>`;
const tick = (x, y, s = 1, t = 0, c = '#7cc47e') =>
  `<path d="M${x - 16 * s} ${y} l${11 * s} ${12 * s} l${22 * s} ${-26 * s}" fill="none" stroke="${c}" stroke-width="${8 * s}" stroke-linecap="round" stroke-linejoin="round" pathLength="1" data-draw="${t}" data-dur="0.35"/>`;

/* ---------- scenes ---------- */

const A = {}; // times used more than once
const scenes = [];
const jpg = (file) => `data:image/jpeg;base64,${b64(join(here, 'assets', file))}`;
// A line of text that rises into place from behind a mask.
const rise = (text, t, cls = '') => `<span class="ln ${cls}"><span data-rise="${r2(t)}">${text}</span></span>`;
// Kicker plus a heading set as separate rising lines.
const H = (id, kicker, lines, cls = '') => `
  <p class="kicker" data-in="${st(id, 0.3)}">${kicker}</p>
  <h2 class="h2 ${cls}">${lines.map((l, i) => rise(l, st(id, 0.4 + i * 0.14))).join('')}</h2>`;
const rowAt = (t, title, sub = '', mark = '') => `<div class="row" data-in="${S('tick', t, 0.5)}"><i>${mark}</i><span>${title}${sub ? `<small>${sub}</small>` : ''}</span></div>`;

/* 1. Hook */
S('shimmer', st('hook', 0.5), 0.4);
const packs = ['now-ksm66', 'jarrow', 'now-450', 'le', 'gaia', 'goli'];
A.six = on('hook', 'We read six');
scenes.push(scene('hook', 'c-paper split', `
  <div class="txt">
    <p class="kicker" data-in="${st('hook', 0.3)}">2026 buying guide</p>
    <h1 class="title">${rise('The best', st('hook', 0.4))}${rise('ashwagandha', st('hook', 0.54))}${rise('<em>brands.</em>', st('hook', 0.68))}</h1>
    <p class="lead" data-in="${A.six}">Six US labels, read line by line.</p>
  </div>
  <div class="grid6">${packs.map((p, i) => `<div class="tile" data-in="${S('tick', r2(A.six + 0.15 + i * 0.13), 0.35)}">${p === 'le' ? '<b>Life<br>Extension</b>' : `<img src="${jpg(p + '.jpg')}" alt="">`}</div>`).join('')}</div>`));

/* 2. The short answer */
const musts = [['A named root extract', 'a named root extract'], ['300–600 mg a day', 'three hundred to six hundred'], ['Nothing hidden', 'with nothing hidden']];
scenes.push(scene('answer', 'dark stack', `
  ${H('answer', 'The short answer', ['Buy the extract,', '<em>not the brand.</em>'], 'xl')}
  <div class="chips">${musts.map(([a, p]) => `<span class="chip" data-in="${S('tick', on('answer', p), 0.5)}">${a}</span>`).join('')}</div>`));

/* 3. How we chose */
const ev = [['250–600 mg', 'a day, in most of the trials', 'two hundred and fifty'], ['8 weeks', 'the usual length of a trial', 'for eight weeks'], ['KSM-66', 'the extract several of them used', 'Several used']];
scenes.push(scene('how', 'c-cream split', `
  <div class="txt">${H('how', 'How we chose', ['We started with', '<em>the evidence,</em>', 'not the brands.'])}</div>
  <div class="stats">${ev.map(([a, b, p]) => `<div class="st" data-in="${S('tick', on('how', p), 0.5)}"><b>${a}</b><span>${b}</span></div>`).join('')}</div>`));

/* 4. What we read */
scenes.push(scene('method', 'c-sage split', `
  <div class="txt">${H('method', 'What we read', ['The maker’s label,', '<em>not a retailer listing.</em>'])}
    <p class="note" data-in="${on('method', 'We did not test')}">Labels and list prices read on 1 October 2026. We did not test the capsules ourselves.</p>
  </div>
  <div class="rows">
    ${rowAt(on('method', 'Supplement Facts'), 'The Supplement Facts panel', '', '1')}
    ${rowAt(on('method', 'the daily dose'), 'The daily dose', 'At the suggested use', '2')}
    ${rowAt(on('method', 'the cost a day'), 'The cost a day', 'At the maker’s list price', '3')}
  </div>`));

/* 5. Which extract */
const ext = [['KSM-66', 'Root only', 'The best studied: used in many stress, sleep and strength trials', 'K S M sixty-six is'], ['Sensoril', 'Root and leaf', 'Also trial tested. More concentrated, so dosed lower', 'Sensoril is'], ['Plain root powder', 'Not an extract', 'Much weaker per capsule', 'Plain root powder']];
scenes.push(scene('extracts', 'c-butter stack', `
  ${H('extracts', 'Which extract', ['Three things a label <em>can mean.</em>'])}
  <div class="cols3">${ext.map(([a, b, c, p]) => `<div class="colx" data-in="${S('tick', on('extracts', p), 0.5)}"><p class="eyebrow">${b}</p><b>${a}</b><span>${c}</span></div>`).join('')}</div>`));

/* 6–11. The six picks */
const prod = (id, cls, n, award, name, img, specs, fit, tone, catchText, catchPhrase) => scene(id, `${cls} split prod`, `
  <div class="txt">
    <p class="kicker" data-in="${st(id, 0.3)}"><u>${n} / 06</u>${award}</p>
    <h2 class="h2">${name.map((l, i) => rise(l, st(id, 0.4 + i * 0.14))).join('')}</h2>
    <div class="specs">${specs.map(([l, v, note, p]) => `<div class="sp" data-in="${S('tick', on(id, p), 0.5)}"><p class="eyebrow">${l}</p><b>${v}</b><span>${note}</span></div>`).join('')}</div>
    <div class="foot"><span class="fit ${tone}" data-in="${st(id, 1.4)}">${fit}</span><span class="catch" data-in="${S('pop', on(id, catchPhrase), 0.4)}">${catchText}</span></div>
  </div>
  <div class="pack" data-in="${st(id, 0.45)}" data-from="r">${img ? `<img src="${jpg(img)}" alt="">` : '<div class="disc"><b>125 mg</b><span>a capsule,<br>twice a day</span></div>'}</div>`);
S('chime', st('p1', 0.5), 0.5);
scenes.push(prod('p1', 'c-sage', '01', 'Best overall', ['NOW KSM-66', '<em>Ashwagandha 600 mg</em>'], 'now-ksm66.jpg',
  [['Extract', 'KSM-66', 'Organic root', 'gives the extract'], ['Daily dose', '600 mg', '1 capsule a day', 'One capsule a day'], ['Cost a day', '$0.37', 'One bottle lasts 3 months', 'about thirty-seven cents']],
  'Matches the trials', 'good', 'Withanolide % is not printed on the label', 'The catch'));
scenes.push(prod('p2', 'c-butter', '02', 'Best split dose', ['Jarrow Formulas', '<em>Ashwagandha 300 mg</em>'], 'jarrow.jpg',
  [['Extract', 'KSM-66', 'Root', 'It is K S M'], ['Daily dose', '600 mg', '1 capsule, twice a day', 'one capsule twice a day'], ['Cost a day', '$0.42', 'List price', 'About forty-two']],
  'Matches the trials', 'good', 'Some listings still say Sensoril: check your bottle', 'Some listings'));
scenes.push(prod('p3', 'c-peach', '03', 'Best budget', ['NOW Ashwagandha', '<em>450 mg</em>'], 'now-450.jpg',
  [['Cost a day', '$0.19', 'List price', 'About nineteen'], ['Withanolides', '≥10.8 mg', 'Printed on the label', 'with the withanolide content'], ['Extract', 'Standardised', 'Root and leaf', 'generic root and leaf']],
  'Partly matches', 'mixed', 'Not one of the extracts the trials tested', 'not one of the extracts'));
scenes.push(prod('p4', 'c-sky', '04', 'Best low dose', ['Life Extension', '<em>Optimized Ashwagandha</em>'], '',
  [['Extract', 'Sensoril', 'Root and leaf', 'It uses Sensoril'], ['Daily dose', '250 mg', '1 capsule, twice a day', 'two hundred and fifty'], ['Cost a day', '—', 'Price not shown', 'The price is hidden']],
  'Matches the trials', 'good', 'Price hidden until you sign in', 'until you sign in'));
scenes.push(prod('p5', 'c-leaf', '05', 'For whole-root fans', ['Gaia Herbs', '<em>Ashwagandha Root</em>'], 'gaia.jpg',
  [['Extract', 'Root + extract', 'Organic, no leaf', 'is organic'], ['Withanolides', '2.5 mg', 'A capsule, printed', 'two and a half milligrams'], ['Capsule', '350 mg', '$0.42 a capsule', 'honest about']],
  'Below trial levels', 'poor', 'About a twelfth of a 600 mg KSM-66 capsule', 'about a twelfth'));
scenes.push(prod('p6', 'c-blush', '06', 'If you want a gummy', ['Goli Ashwagandha', '<em>& Vitamin D gummies</em>'], 'goli.jpg',
  [['Extract', 'KSM-66', 'Root', 'Goli does use'], ['Daily dose', '600 mg', '4 gummies a day', 'four gummies a day'], ['Cost a day', '$1.67', 'A bottle lasts 15 days', 'about a dollar sixty-seven']],
  'Matches, with extras', 'mixed', '8 g of sugar and 2,000 IU of vitamin D a day', 'eight grams of sugar'));

/* 12. Cost a day */
const costs = [['NOW Ashwagandha 450 mg', 0.19, '$0.19', 'Nineteen cents', ''], ['NOW KSM-66 600 mg', 0.37, '$0.37', 'Thirty-seven', ''], ['Jarrow 300 mg', 0.42, '$0.42', 'Forty-two', ''], ['Goli gummies', 1.67, '$1.67', 'And a dollar', 'hot']];
scenes.push(scene('cost', 'c-paper stack', `
  ${H('cost', 'Side by side', ['Cost a day, <em>at list price.</em>'])}
  <div class="bars">${costs.map(([n, v, label, p, c]) => { const t = S('tick', on('cost', p), 0.5); return `<div class="bar ${c}" data-in="${t}"><b>${n}</b><div class="track"><u ${k([[t, { sx: 0 }], [t + 1.1, { sx: v / 1.8, e: 'io' }]])}></u></div><strong>${label}</strong></div>`; }).join('')}</div>
  <p class="fine2" data-in="${st('cost', 1.2)}">Maker’s list prices on 1 October 2026 at the suggested daily use. Life Extension does not show a price; Gaia Herbs is $0.42 a capsule.</p>`));

/* 13. Milligrams mislead */
scenes.push(scene('mg', 'dark stack', `
  ${H('mg', 'One thing to remember', ['A bigger number', '<em>is not a stronger product.</em>'])}
  <div class="versus">
    <div class="vs" data-in="${S('tick', on('mg', 'A higher milligram'), 0.5)}"><p class="eyebrow">Gaia Herbs capsule</p><b>350 mg</b><span>contains <strong>2.5 mg</strong> of withanolides</span></div>
    <div class="vs" data-in="${S('chime', on('mg', 'Compare the extract'), 0.5)}"><p class="eyebrow">KSM-66 capsule</p><b>600 mg</b><span>contains about <strong>30 mg</strong> of withanolides</span></div>
  </div>`));

/* 14. What to check */
const checks = [['A named extract, or a withanolide %', 'A named extract'], ['250–600 mg of extract a day', 'Two hundred and fifty to six hundred'], ['Root, rather than leaf', 'Root, rather'], ['No proprietary blend', 'No proprietary'], ['Warnings for pregnancy, thyroid and liver', 'And clear warnings']];
scenes.push(scene('check', 'c-cream split', `
  <div class="txt narrow">${H('check', 'Read the label', ['Five checks', '<em>on any label.</em>'])}</div>
  <div class="rows tight">${checks.map(([a, p], i) => rowAt(on('check', p), a, '', i + 1)).join('')}</div>`));

/* 15. Organic */
scenes.push(scene('organic', 'c-leaf stack', `
  ${H('organic', 'Is organic better?', ['Organic is how it was grown,', '<em>not how strong it is.</em>'])}
  <p class="note" data-in="${on('organic', 'Check the extract')}">Check the extract and the dose first.</p>`));

/* 16–17. What to avoid */
scenes.push(scene('avoid1', 'c-peach split', `
  <div class="txt narrow">${H('avoid1', 'What to avoid', ['Blends and', '<em>stacked extras.</em>'])}</div>
  <div class="rows">
    ${rowAt(on('avoid1', 'Proprietary blends'), 'Proprietary blends', 'They do not say how much ashwagandha you are taking', '×')}
    ${rowAt(on('avoid1', 'And stacked formulas'), 'Stacked formulas', 'Added melatonin, magnesium or L-theanine: a mixture', '×')}
  </div>`));
scenes.push(scene('avoid2', 'c-butter split', `
  <div class="txt narrow">${H('avoid2', 'What to avoid', ['Claims to', '<em>be wary of.</em>'])}</div>
  <div class="rows">
    ${rowAt(on('avoid2', 'A capsule advertising'), '“1,000 mg” or more', 'Often root powder, or a less concentrated extract', '×')}
    ${rowAt(on('avoid2', 'And clinically proven'), '“Clinically proven”', 'Only counts if the label matches the trials', '×')}
  </div>`));

/* 18. Before you buy */
scenes.push(scene('safety', 'c-blush split', `
  <div class="txt narrow">${H('safety', 'Before you buy any brand', ['It is not', '<em>for everyone.</em>'])}</div>
  <div class="rows tight">
    ${rowAt(S('warn', on('safety', 'pregnant or breastfeeding'), 0.3), 'Pregnant or breastfeeding', 'Do not take it', '×')}
    ${rowAt(on('safety', 'a thyroid or liver'), 'A thyroid or liver condition', 'Check with your doctor first', '!')}
    ${rowAt(on('safety', 'an autoimmune'), 'An autoimmune disease', 'Check with your doctor first', '!')}
    ${rowAt(on('safety', 'take regular medicines'), 'Regular medicines', 'Check with your doctor first', '!')}
  </div>`));

/* 19. How long */
A.wk = on('liver', 'usually two');
scenes.push(scene('liver', 'c-sky stack', `
  ${H('liver', 'How long to take it', ['Plan an eight week trial,', '<em>and stop by about three months.</em>'])}
  <div class="weeks" data-in="${st('liver', 0.8)}">
    <div class="axis"><u ${k([[st('liver', 0.9), { sx: 0 }], [st('liver', 2.1), { sx: 1, e: 'io' }]])}></u></div>
    <div class="zone" data-in="${S('warn', A.wk, 0.3)}"><span>Rare liver injury has been reported, usually 2 to 12 weeks after starting</span></div>
    <div class="wk" style="left:0"><i></i><b>Start</b></div>
    <div class="wk" style="left:66.667%"><div data-in="${S('tick', on('liver', 'plan an eight'), 0.5)}"><i></i><b>Week 8</b><span>the trial</span></div></div>
    <div class="wk" style="left:100%"><div data-in="${S('tick', on('liver', 'and stop by'), 0.5)}"><i></i><b>Week 12</b><span>stop</span></div></div>
  </div>`));

/* 20. The bottom line */
const finals = [['Most people', 'NOW KSM-66 600 mg', 'For most people'], ['Split dose', 'Jarrow 300 mg', 'For a split dose'], ['Budget', 'NOW Ashwagandha 450 mg', 'On a budget']];
A.end = S('swell', on('verdict', 'The full guide'), 0.5);
scenes.push(scene('verdict', 'dark split', `
  <div class="txt">${H('verdict', 'The bottom line', ['Buy the extract,', '<em>not the brand.</em>'])}
    <div class="finals">${finals.map(([a, b, p]) => `<div class="fin" data-in="${S('tick', on('verdict', p), 0.5)}"><p class="eyebrow">${a}</p><b>${b}</b></div>`).join('')}</div>
    <p class="note" data-in="${on('verdict', 'Compare the cost')}">Compare the cost a day, not the price of the bottle.</p>
  </div>
  <div class="end" data-in="${A.end}">
    <div class="lockup"><span class="mark"><i></i><i></i><i></i><i></i></span>SharpAndLean</div>
    <p class="url">sharpandlean.com</p>
    <p class="srcs">Read the full guide</p>
    <p class="fine">General information, not medical advice. Labels and list prices read 1 October 2026.</p>
  </div>`));

/* scene changes */
script.lines.slice(1).forEach((l) => S('whoosh', T[l.id].s - 0.3, 0.22));

/* ---------- page ---------- */

const css = `
${fonts}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1920px;height:1080px;overflow:hidden;background:#fbf9f5}
body{font-family:'DM Sans',sans-serif;color:#1c2a28;position:relative}
em{font-family:'Newsreader',serif;font-style:italic;font-weight:400;color:#2f7c72}
#sky,#aur,#aur2,#dust,#vig{display:none}
#bar{position:absolute;left:0;right:0;bottom:0;height:6px;background:rgba(28,42,40,.1);z-index:60}
#bar i{display:block;height:100%;width:0;background:#183b37}
#logo{position:absolute;left:120px;top:60px;z-index:60;display:flex;align-items:center;gap:14px;font-weight:700;font-size:30px;letter-spacing:-.01em;color:#1c2a28}
.mark{display:grid;grid-template-columns:15px 15px;gap:5px}
.mark i{width:15px;height:15px;border-radius:4px;background:currentColor}
.mark i:last-child{background:#7cc47e}
#rail{position:absolute;right:120px;top:62px;z-index:60;font-size:24px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#5d6865}
#rail span{display:none}#rail span.on{display:flex;gap:16px}
#rail b{font-weight:600;color:#a9813c}#rail b::before{content:'0'}
#cap{position:absolute;left:0;right:0;bottom:56px;z-index:60;text-align:center}
#cap span{display:inline-block;max-width:1500px;padding:12px 30px;border-radius:999px;background:#fff;font-size:34px;line-height:1.25;font-weight:500;color:rgba(28,42,40,.45)}
#cap u{text-decoration:none;color:#1c2a28}
#cap u.now{color:#2f7c72}
body.dk #logo{color:#fbf9f5}body.dk #rail{color:#b9c9c4}body.dk #rail b{color:#d8b876}
body.dk #bar{background:rgba(251,249,245,.14)}body.dk #bar i{background:#d8b876}

.scene{position:absolute;inset:0;display:none}
.c-paper{background:#fbf9f5}.c-cream{background:#f3efe7}.c-sage{background:#dcebe6}.c-butter{background:#f6e8c9}
.c-peach{background:#f8dccd}.c-blush{background:#fbe6e0}.c-leaf{background:#e3eed9}.c-sky{background:#dfe9ee}
.dark{background:#183b37;color:#fbf9f5}.dark em{color:#d8b876}
.cam{position:absolute;inset:0;padding:170px 120px 190px;display:flex}
.split>.cam{align-items:center;gap:90px}
.stack>.cam{flex-direction:column;justify-content:center}
.txt{flex:0 0 820px}.txt.narrow{flex:0 0 640px}
.ln{display:block;overflow:hidden;padding-bottom:.14em;margin-bottom:-.14em}
.ln>span{display:block}
.kicker,.eyebrow{font-size:24px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#a9813c}
.dark .kicker,.dark .eyebrow{color:#d8b876}
.kicker u{text-decoration:none;margin-right:22px;padding-right:22px;border-right:2px solid currentColor;font-variant-numeric:tabular-nums}
.title{margin-top:20px;font-size:170px;line-height:.98;font-weight:300;letter-spacing:-.04em}
.lead{margin-top:40px;font-size:44px;font-weight:400;color:#3d4c48}
.h2{margin-top:20px;font-size:92px;line-height:1.06;font-weight:300;letter-spacing:-.03em}
.h2.xl{font-size:150px;letter-spacing:-.04em}
.note{margin-top:36px;font-size:38px;line-height:1.3;color:#3d4c48;max-width:1100px}
.dark .note{color:#d6e2de}
.fine2{margin-top:34px;font-size:26px;color:#5d6865}

.grid6{flex:1;display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.tile{height:300px;border-radius:28px;background:#f3efe7;display:grid;place-items:center;overflow:hidden}
.tile img{max-width:74%;max-height:80%;mix-blend-mode:multiply}
.tile b{font-size:38px;font-weight:300;line-height:1.1;text-align:center;letter-spacing:-.02em}

.chips{margin-top:70px;display:flex;gap:20px}
.chip{padding:20px 40px;border-radius:999px;border:2px solid rgba(251,249,245,.4);font-size:42px;font-weight:400;letter-spacing:-.01em}

.stats,.rows{flex:1;display:grid;align-content:center}
.st{display:flex;align-items:baseline;gap:34px;padding:34px 0;border-top:2px solid rgba(28,42,40,.16)}
.st:last-child{border-bottom:2px solid rgba(28,42,40,.16)}
.st b{flex:0 0 430px;font-size:88px;font-weight:300;letter-spacing:-.035em;line-height:1;white-space:nowrap}
.st span{font-size:34px;color:#3d4c48;line-height:1.2}

.row{display:flex;align-items:center;gap:34px;padding:34px 0;border-top:2px solid rgba(28,42,40,.16);font-size:50px;font-weight:400;letter-spacing:-.02em;line-height:1.12}
.row:last-child{border-bottom:2px solid rgba(28,42,40,.16)}
.row i{flex:0 0 70px;font-family:'Newsreader',serif;font-style:italic;font-size:64px;color:#2f7c72;text-align:center;line-height:1}
.row small{display:block;margin-top:8px;font-size:30px;color:#5d6865;letter-spacing:0}
.rows.tight .row{padding:24px 0;font-size:44px}
.c-peach .row i,.c-butter .row i,.c-blush .row i{color:#c25a3f}

.cols3{margin-top:70px;display:grid;grid-template-columns:repeat(3,1fr);gap:50px}
.colx{padding-top:30px;border-top:2px solid rgba(28,42,40,.2)}
.colx b{display:block;margin-top:14px;font-size:72px;font-weight:300;letter-spacing:-.03em;line-height:1.05}
.colx span{display:block;margin-top:18px;font-size:34px;line-height:1.3;color:#3d4c48}

.prod .txt{flex:1}
.prod .h2{font-size:96px}
.specs{margin-top:54px;display:grid;grid-template-columns:repeat(3,1fr);gap:36px}
.sp{padding-top:22px;border-top:2px solid rgba(28,42,40,.2)}
.sp b{display:block;margin-top:10px;font-size:62px;font-weight:500;letter-spacing:-.03em;line-height:1.05;white-space:nowrap}
.sp span{display:block;margin-top:8px;font-size:28px;color:#3d4c48}
.foot{margin-top:44px;display:flex;align-items:center;gap:26px}
.fit{flex:none;padding:12px 28px;border-radius:999px;font-size:28px;font-weight:600;background:#183b37;color:#fbf9f5}
.fit.mixed{background:#a9813c}.fit.poor{background:#c25a3f}
.catch{font-size:32px;color:#3d4c48}
.pack{flex:0 0 540px;height:620px;display:grid;place-items:center;background:#fff;border-radius:48px}
.pack img{max-width:420px;max-height:500px}
.disc{width:460px;height:460px;border-radius:50%;background:#dfe9ee;display:grid;place-content:center;text-align:center}
.disc b{font-size:100px;font-weight:300;letter-spacing:-.04em;line-height:1}
.disc span{margin-top:14px;font-size:32px;color:#5d6865;line-height:1.2}

.bars{margin-top:64px;display:grid;gap:34px}
.bar{display:grid;grid-template-columns:520px 1fr 170px;align-items:center;gap:30px;font-size:40px}
.bar b{font-weight:400;letter-spacing:-.02em}
.track{height:20px;border-radius:10px;background:rgba(28,42,40,.08)}
.track u{display:block;height:100%;border-radius:10px;background:#183b37;transform-origin:0 50%}
.bar.hot .track u{background:#e07a5f}
.bar strong{font-size:56px;font-weight:500;letter-spacing:-.03em;text-align:right;font-variant-numeric:tabular-nums}

.versus{margin-top:70px;display:grid;grid-template-columns:1fr 1fr;gap:70px}
.vs{padding-top:30px;border-top:2px solid rgba(251,249,245,.3)}
.vs b{display:block;margin-top:10px;font-size:150px;font-weight:300;letter-spacing:-.045em;line-height:1}
.vs span{display:block;margin-top:14px;font-size:38px;color:#d6e2de}
.vs strong{color:#d8b876;font-weight:600}

.weeks{position:relative;margin:170px 60px 0;height:160px}
.axis{position:absolute;left:0;right:0;top:0;height:6px;border-radius:3px;background:rgba(28,42,40,.12)}
.axis u{display:block;height:100%;border-radius:3px;background:#183b37;transform-origin:0 50%}
.zone{position:absolute;left:16.667%;right:0;top:-96px;height:70px;border-radius:16px;background:rgba(224,122,95,.22);display:grid;place-items:center;font-size:28px;color:#8f3f28;font-weight:500}
.wk{position:absolute;top:0;width:0}
.wk i{position:absolute;left:-11px;top:-8px;width:22px;height:22px;border-radius:50%;background:#183b37}
.wk b{position:absolute;top:36px;left:-150px;width:300px;text-align:center;font-size:44px;font-weight:400;letter-spacing:-.02em}
.wk span{position:absolute;top:96px;left:-150px;width:300px;text-align:center;font-size:28px;color:#5d6865}

.finals{margin-top:44px;display:grid;gap:0}
.fin{display:flex;align-items:baseline;gap:30px;padding:22px 0;border-top:2px solid rgba(251,249,245,.22)}
.fin .eyebrow{flex:0 0 230px}
.fin b{white-space:nowrap;font-size:44px;font-weight:400;letter-spacing:-.02em}
.dark .txt .note{margin-top:30px;font-size:32px}
.end{flex:1;text-align:center}
.lockup{display:inline-flex;align-items:center;gap:22px;font-size:72px;font-weight:700;letter-spacing:-.02em}
.lockup .mark{grid-template-columns:34px 34px;gap:10px}.lockup .mark i{width:34px;height:34px;border-radius:9px}
.url{margin-top:18px;font-size:44px;color:#d8b876}
.srcs{margin-top:30px;display:inline-block;padding:14px 34px;border-radius:999px;background:#fbf9f5;color:#183b37;font-size:32px;font-weight:600}
.fine{margin:30px auto 0;max-width:560px;font-size:24px;line-height:1.4;color:#b9c9c4}
`;

const defs = `<svg width="0" height="0" style="position:absolute"><defs>
<linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f0d9a5"/><stop offset="1" stop-color="#b98f45"/></linearGradient>
<linearGradient id="teal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4aa597"/><stop offset="1" stop-color="#256a61"/></linearGradient>
<linearGradient id="gloss" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".34"/><stop offset=".45" stop-color="#fff" stop-opacity=".04"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>
<radialGradient id="moon" cx=".38" cy=".34" r=".8"><stop offset="0" stop-color="#fff6de"/><stop offset=".6" stop-color="#ead49d"/><stop offset="1" stop-color="#c9a961"/></radialGradient>
<filter id="shadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#000" flood-opacity=".4"/></filter>
<filter id="glowS" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="glowT" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14" result="b"/><feColorMatrix in="b" values="0 0 0 0 .3  0 0 0 0 .75  0 0 0 0 .68  0 0 0 .6 0" result="c"/><feMerge><feMergeNode in="c"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="blur8"><feGaussianBlur stdDeviation="8"/></filter><filter id="blur20"><feGaussianBlur stdDeviation="20"/></filter><filter id="blur40" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40"/></filter>
</defs></svg>`;

const chapters = script.lines.map((l) => ({ s: T[l.id].s, name: l.chapter, sec: l.section }));

const js = `
const END=${END}, CAPS=${JSON.stringify(captions)}, CH=${JSON.stringify(chapters)};
const clamp=(x)=>Math.max(0,Math.min(1,x));
const E={out:(x)=>1-Math.pow(1-x,3),lin:(x)=>x,io:(x)=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2,back:(x)=>{const c=1.70158,c3=c+1;return 1+c3*Math.pow(x-1,3)+c*Math.pow(x-1,2)}};
const q=(s)=>[...document.querySelectorAll(s)];
const sceneOf=(el)=>el.closest('.scene');
const org=(el)=>{if(el.dataset.org){el.style.transformBox='view-box';el.style.transformOrigin=el.dataset.org;}};
const DEF={x:0,y:0,r:0,s:1,sx:1,sy:1,o:1,ry:0};
const KS=q('[data-k]').map((el)=>{org(el);const raw=JSON.parse(el.dataset.k);let cur={...DEF};const keys=raw.map(([t,p])=>{cur={...cur,...p};const o={...cur};o.e=p.e||'out';return[t,o]});return{el,keys,sc:sceneOf(el)}});
const tf=(p)=>'translate('+p.x.toFixed(2)+'px,'+p.y.toFixed(2)+'px) rotate('+p.r.toFixed(2)+'deg)'+(p.ry?' rotateY('+p.ry.toFixed(2)+'deg)':'')+' scale('+(p.sx*p.s).toFixed(4)+','+(p.sy*p.s).toFixed(4)+')';
const at=(keys,t)=>{if(t<=keys[0][0])return keys[0][1];for(let i=0;i<keys.length-1;i++){const a=keys[i],b=keys[i+1];if(t<b[0]){const u=E[a[1].e]((t-a[0])/(b[0]-a[0]));const o={};for(const n in DEF)o[n]=a[1][n]+(b[1][n]-a[1][n])*u;return o}}return keys[keys.length-1][1]};
const mk=(sel)=>q(sel).map((el)=>{org(el);return{el,sc:sceneOf(el)}});
const scenes=q('.scene').map((el)=>({el,cam:el.querySelector('.cam'),a:+el.dataset.s,e:+el.dataset.e}));
const rises=mk('[data-rise]');const ins=mk('[data-in]'),pops=mk('[data-pop]'),draws=mk('[data-draw]'),counts=mk('[data-count]'),spins=mk('[data-spin]'),floats=mk('[data-float]');
draws.forEach(({el})=>{el.style.strokeDasharray='1 1'});
const bar=document.querySelector('#bar i'),cap=document.querySelector('#cap span'),rail=[...document.querySelectorAll('#rail span')],aur=document.getElementById('aur'),aur2=document.getElementById('aur2');
const cv=document.getElementById('dust'),cx=cv.getContext('2d');
let seed=11;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const P=Array.from({length:90},()=>({x:rnd()*1920,y:rnd()*1080,r:.8+rnd()*2.6,v:4+rnd()*14,ph:rnd()*6.28,tw:.3+rnd()*1.2,g:rnd()<.3}));
const FROM={u:[0,34,1],d:[0,-34,1],l:[-50,0,1],r:[90,0,1],z:[0,0,.94]};
let lastCap=-1,lastCh=-1;
window.seek=(t)=>{
  const live=new Set();
  let cur=scenes[0];
  for(let i=0;i<scenes.length;i++){const s=scenes[i],nx=scenes[i+1];
    const pin=i===0?1:clamp((t-s.a+0.4)/0.8),pout=nx?clamp((t-nx.a+0.4)/0.8):0;
    if(t>=s.a)cur=s;
    if(pin<=0||pout>=1){s.el.style.display='none';continue}
    live.add(s.el);s.el.style.display='block';s.el.style.zIndex=2+i;
    const u=E.io(pin);s.el.style.clipPath=u<1?'inset('+((1-u)*100).toFixed(3)+'% 0 0 0)':'none';
    s.cam.style.transform='translateY('+((1-u)*90-E.io(pout)*120).toFixed(2)+'px)';
  }
  document.body.className=cur.el.classList.contains('dark')?'dk':'';
  for(const{el,sc}of rises){if(sc&&!live.has(sc))continue;const p=E.out(clamp((t-+el.dataset.rise)/0.9));el.style.transform='translateY('+((1-p)*108).toFixed(2)+'%)';}
  for(const{el,sc}of ins){if(sc&&!live.has(sc))continue;const p=E.out(clamp((t-+el.dataset.in)/0.85));const f=FROM[el.dataset.from||'u'];el.style.opacity=p;el.style.transform='translate('+((1-p)*f[0]).toFixed(2)+'px,'+((1-p)*f[1]).toFixed(2)+'px) scale('+(f[2]+(1-f[2])*p).toFixed(4)+')';}
  for(const{el,sc}of pops){if(sc&&!live.has(sc))continue;const x=clamp((t-+el.dataset.pop)/0.5);el.style.opacity=clamp(x*3);el.style.transform='scale('+(x<=0?0:E.back(x)).toFixed(4)+')';}
  for(const{el,keys,sc}of KS){if(sc&&!live.has(sc))continue;const p=at(keys,t);el.style.opacity=p.o;el.style.transform=tf(p);}
  for(const{el,sc}of draws){if(sc&&!live.has(sc))continue;const p=E.io(clamp((t-+el.dataset.draw)/(+el.dataset.dur||0.8)));el.style.strokeDashoffset=(1-p*(+el.dataset.to||1)).toFixed(4);el.style.opacity=p>0?1:0;}
  for(const{el,sc}of counts){if(sc&&!live.has(sc))continue;const p=E.out(clamp((t-+el.dataset.at)/(+el.dataset.dur||0.9)));el.textContent=(+el.dataset.count*p).toFixed(+el.dataset.dec);}
  for(const{el,sc}of spins){if(sc&&!live.has(sc))continue;el.style.transform='rotate('+((t*+el.dataset.spin)%360).toFixed(2)+'deg)';}
  for(const{el,sc}of floats){if(sc&&!live.has(sc))continue;const[a,per,ph]=el.dataset.float.split(',').map(Number);el.style.transform='translateY('+(Math.sin(t*6.2832/per+ph)*a).toFixed(2)+'px)';}
  cx.clearRect(0,0,1920,1080);
  for(const d of P){const y=((d.y-t*d.v)%1100+1100)%1100-10,x=d.x+Math.sin(t*0.3+d.ph)*18;const a=(0.25+0.35*(0.5+0.5*Math.sin(t*d.tw+d.ph)));cx.beginPath();cx.fillStyle=d.g?'rgba(216,184,118,'+a.toFixed(3)+')':'rgba(214,226,222,'+(a*0.7).toFixed(3)+')';cx.arc(x,y,d.r,0,6.2832);cx.fill();}
  aur.style.transform='translate('+(Math.sin(t*0.11)*140).toFixed(1)+'px,'+(Math.cos(t*0.09)*90).toFixed(1)+'px)';
  aur2.style.transform='translate('+(Math.cos(t*0.1)*120).toFixed(1)+'px,'+(Math.sin(t*0.12)*70).toFixed(1)+'px)';
  const ci=CAPS.findIndex((c)=>t>=c.s&&t<c.e+0.25);
  if(ci<0){cap.style.opacity=0;lastCap=-1}else{const c=CAPS[ci];cap.style.opacity=1;let n=0;for(const w of c.words)if(t>=w.s)n++;const key=ci*100+n;if(key!==lastCap){lastCap=key;cap.innerHTML=c.words.map((w,i)=>i<n?'<u'+(i===n-1?' class="now"':'')+'>'+w.w+'</u>':w.w).join(' ');}}
  let hi=0;for(let i=0;i<CH.length;i++)if(t>=CH[i].s-0.05)hi=i;
  if(hi!==lastCh){lastCh=hi;const sec=CH[hi].sec;rail.forEach((el,i)=>{el.className=i<sec?'done':i===sec?'on':''});}
  bar.style.width=(clamp(t/END)*100)+'%';
};
window.seek(0);
`;

const html = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>Best ashwagandha brands you can try in 2026</title><style>${css}</style></head><body>
<div id="sky"></div><div id="aur"></div><div id="aur2"></div><canvas id="dust" width="8" height="8"></canvas>
${defs}
${scenes.join('')}
<div id="vig"></div>
<div id="bar"><i></i></div>
<div id="logo"><span class="mark"><i></i><i></i><i></i><i></i></span>SharpAndLean</div>
<div id="rail">${script.sections.map((n, i) => `<span><b>${i + 1}</b>${n}</span>`).join('')}</div>
<div id="cap"><span></span></div>
<script>${js}</script></body></html>`;

// Brand rule: one word, no ampersand and no spaces.
const visible = html.replace(/data:[a-z]+\/[a-z0-9]+;base64,[A-Za-z0-9+/=]+/g, '');
if (new RegExp('Sharp' + '\\s*(&|and\\s)', 'i').test(visible)) throw new Error('Write the brand name as one word, with no ampersand or spaces.');

mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'video.html'), html);
writeFileSync(
  join(out, 'timeline.json'),
  JSON.stringify({ end: END, scenes: T, order: script.lines.map((l) => l.id), sfx: SFX.sort((a, b) => a.t - b.t), chapters }, null, 2),
);
console.log(`video.html written, ${END.toFixed(2)} s, ${SFX.length} sound cues`);
