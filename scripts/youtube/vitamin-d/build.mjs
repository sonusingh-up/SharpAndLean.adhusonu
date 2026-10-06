/*
 * Writes .out/video.html and .out/timeline.json for the YouTube explainer
 * "Vitamin D: how much, which form, and who is low" (1920×1080).
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
const jpg = (file) => `data:image/${file.endsWith('.png') ? 'png' : 'jpeg'};base64,${b64(join(here, 'assets', file))}`;
const sumita = jpg('sumita.jpg');
const credit = (t, cls = '') => `<div class="credit ${cls}" data-in="${t}"><img src="${sumita}" alt=""><span><small>Script checked by</small><b>Sumita Bhatti</b><small>Clinical Nutritionist</small></span></div>`;
// The one thing to do or remember from a scene, shown as a bar above the captions.
const take = (t, label, text) => `<div class="take" data-in="${S('chime', t, 0.45)}"><b>${label}</b><span>${text}</span></div>`;
const row = (t, kind, title, sub) => `<div class="li ${kind}" data-in="${t}" data-from="l"><b>${kind === 'ok' ? '✓' : kind === 'num' ? '?' : kind === 'dot' || kind === 'mid' ? '' : '✕'}</b><span>${title}${sub ? `<small>${sub}</small>` : ''}</span></div>`;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const winter = (i) => i < 3 || i > 8;
// A thin-line sun whose rays turn slowly.
const sun = (cls = 'sun') => `<svg class="${cls}" viewBox="0 0 600 600">
  <g data-spin="5" data-org="300px 300px">${Array.from({ length: 16 }, (_, i) => `<line x1="300" y1="${i % 2 ? 78 : 40}" x2="300" y2="130" stroke="#a9813c" stroke-width="5" stroke-linecap="round" transform="rotate(${i * 22.5} 300 300)"/>`).join('')}</g>
  <circle cx="300" cy="300" r="128" fill="#f6e8c9" stroke="#a9813c" stroke-width="5"/>
  <text x="300" y="338" text-anchor="middle" style="font-size:110px;font-weight:300;letter-spacing:-.04em" fill="#183b37">D</text></svg>`;
const ico = {
  meal: '<svg viewBox="0 0 120 120" fill="none" stroke="#183b37" stroke-width="4" stroke-linecap="round"><circle cx="66" cy="60" r="40"/><circle cx="66" cy="60" r="24"/><path d="M14 22v30a8 8 0 0 0 16 0V22M22 22v76"/></svg>',
  clock: '<svg viewBox="0 0 120 120" fill="none" stroke="#183b37" stroke-width="4" stroke-linecap="round"><circle cx="60" cy="60" r="44"/><path d="M60 32v28l20 12"/></svg>',
  cal: '<svg viewBox="0 0 120 120" fill="none" stroke="#183b37" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><rect x="16" y="24" width="88" height="80" rx="12"/><path d="M16 46h88M38 14v20M82 14v20M40 74l14 14 26-28"/></svg>',
  drop: '<svg viewBox="0 0 120 120" fill="none" stroke="#183b37" stroke-width="4" stroke-linejoin="round"><path d="M60 14c18 26 30 42 30 58a30 30 0 0 1-60 0c0-16 12-32 30-58z" fill="#f6e8c9"/></svg>',
  leaf: '<svg viewBox="0 0 120 120" fill="none" stroke="#183b37" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 100C20 50 50 20 104 18c0 54-30 84-84 82z" fill="#dcebe6"/><path d="M20 100l52-52"/></svg>',
  lichen: '<svg viewBox="0 0 120 120" fill="none" stroke="#183b37" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M60 104V62M60 62c-22 0-36-14-36-36 22 0 36 14 36 36zM60 62c22 0 36-14 36-36-22 0-36 14-36 36zM60 86c-14 0-24-8-28-20M60 86c14 0 24-8 28-20" fill="none"/></svg>',
};
const person = (c) => `<svg viewBox="0 0 100 190"><circle cx="50" cy="34" r="28" fill="${c}"/><path d="M8 186v-56a42 42 0 0 1 84 0v56z" fill="${c}"/></svg>`;

/* 1. Hook */
S('shimmer', st('hook', 0.4), 0.5);
const asks = [['How much?', 'how much'], ['Which form?', 'which form'], ['Who is actually low?', 'who is actually low']];
scenes.push(scene('hook', 'split', `
  <div class="txt wide">
    <p class="kicker" data-in="${st('hook', 0.2)}">How much, which form, and who is low</p>
    <h1 class="title" data-in="${st('hook', 0.35)}">Vitamin <em>D</em></h1>
    <p class="lead" data-in="${st('hook', 0.6)}">The supplement almost everyone is told to take.</p>
    ${credit(on('hook', 'Here are the plain'))}
  </div>
  <div class="col">
    <div class="sunwrap" data-in="${st('hook', 0.5)}" data-from="z">${sun()}</div>
    ${asks.map(([a, p]) => row(S('tick', on('hook', p), 0.7), 'num', a)).join('')}
  </div>`));

/* 2. The short answer */
A.dose = S('chime', on('answer', 'ten micrograms a day'), 0.8);
A.oct = S('whoosh', on('answer', 'from October'), 0.4);
const allYear = [['Get little sun', 'get little sun'], ['Cover your skin', 'cover your skin'], ['Have dark skin', 'have dark skin']];
scenes.push(scene('answer', 'split', `
  <div class="txt">${head('answer', 'The short answer', 'For most UK adults, <em>a small daily dose.</em>')}
    <div class="stat" data-in="${A.dose}"><b>10 mcg</b><span>a day<small data-in="${on('answer', 'four hundred')}">= 400 IU</small></span></div>
  </div>
  <div class="col">
    <div class="card months" data-in="${st('answer', 0.7)}">
      <p class="eyebrow">Take it from October to March</p>
      <div class="mrow">${MONTHS.map((m, i) => `<div class="m">${m}${winter(i) ? `<u data-in="${r2(A.oct + ((i + 3) % 12) * 0.07)}" data-from="z">${m}</u>` : ''}</div>`).join('')}</div>
    </div>
    <div class="card allyear" data-in="${on('answer', 'And all year')}">
      <p class="eyebrow">Or all year, if you</p>
      <div class="pills">${allYear.map(([a, p]) => `<span class="pill" data-pop="${S('pop', on('answer', p), 0.6)}">${a}</span>`).join('')}</div>
    </div>
  </div>`));

/* 3. Why only winter */
A.apr = S('chime', on('season', 'from about April'), 0.6);
scenes.push(scene('season', 'stack', `
  ${head('season', 'Why only winter', 'The UK sun is only strong enough <em>from April to September.</em>')}
  <div class="yearwrap">
    <div class="year" data-in="${on('season', 'Your skin makes')}">${MONTHS.map((m, i) => `<div class="ym${winter(i) ? '' : ' hot'}">${winter(i) ? '' : `<u data-in="${r2(A.apr + (i - 3) * 0.1)}" data-from="z">${sun('s')}</u>`}<span>${m}</span></div>`).join('')}</div>
    <div class="legend"><span data-in="${r2(A.apr + 0.7)}"><i class="hot"></i>Skin can make vitamin D from sunlight</span><span data-in="${r2(A.apr + 0.9)}"><i></i>Sun too weak, so take a supplement</span></div>
  </div>`));

/* 4. UK and US advice */
A.us = S('chime', on('us', 'six hundred'), 0.6);
scenes.push(scene('us', 'stack', `
  ${head('us', 'UK and US advice', 'American advice is <em>a little higher.</em>')}
  <div class="cards2">
    <div class="hc" data-in="${st('us', 0.6)}"><p class="eyebrow">United Kingdom</p><b class="big">400 IU</b><span>a day, which is 10 micrograms</span></div>
    <div class="hc" data-in="${A.us}"><p class="eyebrow">United States</p><b class="big">600 IU</b><span>a day <i data-in="${S('tick', on('us', 'eight hundred'), 0.6)}">· 800 IU over 70</i></span></div>
  </div>
  ${take(on('us', 'Either is'), 'Remember', 'Either is a reasonable, safe daily amount')}`));

/* 5. The unit trap */
const conv = [['1', '40', 'One microgram'], ['10', '400', 'ten micrograms is'], ['25', '1,000', 'twenty-five']];
scenes.push(scene('units', 'split', `
  <div class="txt">${head('units', 'The unit trap', '1 microgram <em>is 40 IU.</em>')}
    <p class="note" data-in="${S('warn', on('units', 'Mixing them up'), 0.35)}">Mixing them up is the most common way people take far more than they meant to.</p>
  </div>
  <div class="col">
    <div class="card tbl" data-in="${st('units', 0.6)}">
      <div class="th"><span>Micrograms (mcg)</span><span></span><span>IU</span></div>
      ${conv.map(([a, b, p]) => `<div class="tr" data-in="${S('tick', on('units', p), 0.7)}" data-from="l"><b>${a}</b><i>=</i><b>${b}</b></div>`).join('')}
    </div>
  </div>`));

/* 6. Is more better? */
A.res = S('stamp', on('more', 'did not reduce'), 0.5);
const trial = [['Healthy adults', 'Nearly 26,000', 'nearly twenty-six'], ['Daily dose', '2,000 IU', 'two thousand'], ['Length', '5 years', 'for five years']];
scenes.push(scene('more', 'split', `
  <div class="txt">${head('more', 'Is more better?', 'More is <em>not better.</em>')}
    <p class="note" data-in="${st('more', 0.9)}">A higher dose was tested in a large trial of healthy adults.</p>
  </div>
  <div class="col">
    <div class="card trial" data-in="${st('more', 0.6)}">
      <p class="eyebrow">The VITAL trial</p>
      ${trial.map(([a, b, p]) => `<div class="trow" data-in="${S('tick', on('more', p), 0.6)}" data-from="l"><span>${a}</span><b>${b}</b></div>`).join('')}
      <div class="result" data-pop="${A.res}">No reduction in cancer, heart attacks or strokes</div>
    </div>
  </div>`));

/* 7. The upper limit */
A.lim = S('swell', on('limit', 'one hundred micrograms'), 0.5);
const harm = [['Bones', 'bones'], ['Kidneys', 'kidneys'], ['Heart', 'the heart']];
scenes.push(scene('limit', 'stack', `
  ${head('limit', 'The upper limit', 'For adults, <em>100 micrograms a day.</em>')}
  <div class="gauge" data-in="${st('limit', 0.6)}">
    <u ${k([[A.lim, { sx: 0 }], [A.lim + 1.4, { sx: 1, e: 'io' }]])}></u><div class="over"></div>
    <div class="mk" style="left:8%"><div data-in="${r2(A.lim + 0.3)}"><span>10 mcg<small>the daily dose</small></span><i></i></div></div>
    <div class="mk red" style="left:80%"><div data-in="${r2(A.lim + 1.3)}"><span>100 mcg = 4,000 IU<small>the upper limit</small></span><i></i></div></div>
  </div>
  <div class="harm">
    <p data-in="${S('warn', on('limit', 'raises calcium'), 0.35)}">Too much for too long raises calcium in the blood, which can harm</p>
    ${harm.map(([a, p]) => `<span class="pill warn" data-pop="${S('pop', on('limit', p), 0.6)}">${a}</span>`).join('')}
  </div>`));

/* 8. Which form */
const forms = [['drop', 'Vitamin D3', 'All most people need', 'The default', 'A plain vitamin D three', 'ok'], ['leaf', 'Vitamin D2', 'Works as a daily dose too', 'Suits vegans', 'D two works', ''], ['lichen', 'D3 from lichen', 'The same vitamin D3', 'Suits vegans', 'as does D three', '']];
scenes.push(scene('form', 'stack', `
  ${head('form', 'Which form', 'A plain vitamin D3 <em>is all most people need.</em>')}
  <div class="cards3">${forms.map(([i, a, b, tag, p, kind]) => `<div class="hc ${kind}" data-in="${S('tick', on('form', p), 0.7)}">${ico[i]}<b>${a}</b><span>${b}</span><em class="tag">${tag}</em></div>`).join('')}</div>`));

/* 9. What to skip */
scenes.push(scene('k2', 'split', `
  <div class="txt">${head('k2', 'What to skip', 'Two things <em>you can leave out.</em>')}</div>
  <div class="col">
    ${row(S('tick', on('k2', 'vitamin K two'), 0.7), 'bad', 'Vitamin K2 with it', 'You do not need it')}
    ${row(S('tick', on('k2', 'skip high strength'), 0.7), 'bad', 'High-strength tubs', 'Unless a doctor advises one')}
  </div>`));

/* 10. When to take it */
const whens = [['meal', 'With a meal', 'with a meal'], ['clock', 'At any time of day', 'at any time'], ['cal', 'Consistency beats timing', 'Consistency']];
scenes.push(scene('when', 'stack', `
  ${head('when', 'When to take it', 'With a meal, <em>at any time of day.</em>')}
  <div class="cards3">${whens.map(([i, a, p]) => `<div class="hc" data-in="${S('tick', r2(Math.max(on('when', a === 'With a meal' ? 'Take it' : p), st('when', 0.6))), 0.7)}">${ico[i]}<b>${a}</b></div>`).join('')}</div>`));

/* 11. Who is low */
A.one = S('chime', on('who', 'About one in five'), 0.7);
scenes.push(scene('who', 'split', `
  <div class="txt">${head('who', 'Who is low', 'About <em>one in five</em> UK adults.')}
    <p class="note" data-in="${on('who', 'and more in winter')}">Across the year, and more in winter.</p>
  </div>
  <div class="col">
    <div class="card people" data-in="${st('who', 0.6)}">
      <div class="prow">${[0, 1, 2, 3, 4].map((i) => `<div class="pp">${person('#e8e1d5')}${i === 0 ? `<u data-in="${A.one}" data-from="z">${person('#e07a5f')}</u>` : ''}</div>`).join('')}</div>
      <p class="fine2">19% of UK adults aged 19 to 64 have a blood level below 25 nmol/L.</p>
    </div>
  </div>`));

/* 12. Skin colour */
A.b57 = S('swell', on('skin', 'fifty-seven'), 0.5);
const anc = [['South Asian ancestry', 57, '#e07a5f', 0], ['Black African ancestry', 39, '#d8b876', 0.35]];
scenes.push(scene('skin', 'stack', `
  ${head('skin', 'Skin colour', 'Skin colour makes <em>the biggest difference.</em>')}
  <div class="card vbars" data-in="${on('skin', 'In one large')}">
    <p class="eyebrow">Deficient in winter and spring</p>
    ${anc.map(([n, v, c, d]) => `<div class="vb"><b>${n}</b><div class="vt"><u style="background:${c}" ${k([[A.b57 + d, { sx: 0 }], [A.b57 + d + 1.2, { sx: v / 100, e: 'io' }]])}></u></div><strong><span data-count="${v}" data-at="${r2(A.b57 + d)}" data-dur="1.2" data-dec="0">0</span>%</strong></div>`).join('')}
    <p class="fine2">UK Biobank, more than 440,000 adults.</p>
  </div>`));

/* 13. Others at risk */
const risk = [['People who are rarely outdoors', 'people who are rarely'], ['People who cover their skin', 'people who cover'], ['Older people', 'older people'], ['Breastfed babies', 'breastfed babies']];
scenes.push(scene('groups', 'split', `
  <div class="txt">${head('groups', 'Others at risk', 'Also <em>at risk.</em>')}</div>
  <div class="col">${risk.map(([a, p]) => row(S('tick', on('groups', p), 0.7), 'dot', a)).join('')}</div>`));

/* 14. Do you need a test? */
A.no = S('chime', on('test', 'No.'), 0.6);
scenes.push(scene('test', 'split', `
  <div class="txt">${head('test', 'Do you need a test?', 'No blood test <em>needed first.</em>')}</div>
  <div class="col">
    ${row(A.no, 'ok', 'The standard dose', 'Testing does not change the advice')}
    <div class="card aside" data-in="${on('test', 'For the standard')}"><p class="eyebrow">Worth a test</p><p>See a doctor if you have bone pain or muscle weakness.</p></div>
  </div>`));

/* 15. Who should check first */
const first = [['Kidney disease', '', 'kidney disease'], ['A condition that affects calcium', '', 'a condition that affects'], ['Certain medicines', 'Such as some diuretics or steroids', 'certain medicines']];
scenes.push(scene('check', 'split', `
  <div class="txt">${head('check', 'Check first', 'Ask a doctor or pharmacist <em>if you have</em>')}</div>
  <div class="col">${first.map(([a, b, p]) => row(S('tick', on('check', p), 0.7), 'mid', a, b)).join('')}</div>`));

/* 16. Verdict */
const verdicts = [['10 mcg a day through the darker months', 'Ten micrograms'], ['Plain vitamin D3', 'Plain D three'], ['Check the units', 'Check the units'], ['Stay under 100 mcg a day', 'stay under']];
A.src = S('swell', on('verdict', 'The full guide'), 0.6);
scenes.push(scene('verdict', 'split tight', `
  <div class="txt wide">
    ${head('verdict', 'The verdict', 'Small dose, <em>plain form.</em>')}
    <div class="checks">${verdicts.map(([v, p]) => { const t = S('tick', on('verdict', p), 0.8); return `<div class="ck" data-in="${t}" data-from="l"><svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="28" fill="#2f7c72"/>${tick(28, 30, 0.9, r2(t + 0.15), '#fff')}</svg>${v}</div>`; }).join('')}</div>
  </div>
  <div class="end" data-in="${A.src}" data-from="z">
    <div class="lockup"><span class="mark"><i></i><i></i><i></i><i></i></span>SharpAndLean</div>
    <p class="url">sharpandlean.com</p>
    <p class="srcs">Read the full guide</p>
    <div>${credit(r2(A.src + 0.3), 'centre')}</div>
    <p class="fine">General information, not medical advice.</p>
  </div>`));

/* scene changes */
script.lines.slice(1).forEach((l) => S('whoosh', T[l.id].s - 0.12, 0.28));

/* ---------- page ---------- */

const css = `
${fonts}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1920px;height:1080px;overflow:hidden;background:#fbf9f5}
body{font-family:'DM Sans',sans-serif;color:#1c2a28;position:relative}
em{font-family:'Newsreader',serif;font-style:italic;font-weight:400;color:#2f7c72}
#sky{position:absolute;inset:0;background:#fbf9f5}
#aur{position:absolute;right:-420px;top:-520px;width:1500px;height:1150px;border-radius:50%;background:radial-gradient(closest-side,rgba(243,181,150,.4),rgba(243,181,150,0))}
#aur2{position:absolute;left:-460px;bottom:-560px;width:1500px;height:1150px;border-radius:50%;background:radial-gradient(closest-side,rgba(47,124,114,.16),rgba(47,124,114,0))}
#dust,#vig{display:none}
#bar{position:absolute;left:0;right:0;top:0;height:8px;background:#e8e1d5;z-index:7}
#bar i{display:block;height:100%;width:0;background:#2f7c72}
#logo{position:absolute;left:96px;top:56px;z-index:7;display:flex;align-items:center;gap:14px;font-weight:700;font-size:34px;letter-spacing:-.01em;color:#1c2a28}
.mark{display:grid;grid-template-columns:17px 17px;gap:5px}
.mark i{width:17px;height:17px;border-radius:5px;background:currentColor}
.mark i:last-child{background:#7cc47e}
#rail{position:absolute;right:96px;top:50px;z-index:7;display:flex;gap:10px}
#rail span{display:flex;align-items:center;gap:10px;padding:8px 18px 8px 8px;border-radius:999px;font-size:22px;font-weight:600;color:#5d6865;background:#fff;border:1.5px solid #e8e1d5}
#rail b{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:#f3efe7;font-size:18px}
#rail span.done b{background:#2f7c72;color:#fff}
#rail span.on{color:#fbf9f5;background:#183b37;border-color:#183b37}#rail span.on b{background:#d8b876;color:#1c2a28}
#cap{position:absolute;left:0;right:0;bottom:50px;z-index:7;text-align:center}
#cap span{display:inline-block;max-width:1560px;padding:14px 32px;border-radius:20px;background:#183b37;font-size:38px;line-height:1.25;font-weight:500;color:rgba(251,249,245,.55)}
#cap u{text-decoration:none;color:#fbf9f5}
#cap u.now{color:#d8b876}
.scene{position:absolute;inset:0;display:none;z-index:2}
.cam{position:absolute;inset:0;padding:160px 96px 250px;display:flex;transform-origin:50% 50%}
.split>.cam{align-items:center;gap:60px}
.stack>.cam{flex-direction:column;justify-content:center}
.txt{flex:0 0 800px;position:relative;z-index:2}
.txt.wide{flex:0 0 940px}
.col{flex:1;display:grid;gap:22px;align-content:center}
svg text{font-family:'DM Sans',sans-serif}
svg [data-k],svg [data-pop],svg [data-in],svg [data-float]{transform-box:fill-box;transform-origin:center}
.kicker,.eyebrow{font-size:26px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#a9813c}
.title{margin-top:16px;font-size:190px;line-height:.96;font-weight:300;letter-spacing:-.035em}
.title em{font-size:1.08em}
.lead{margin-top:34px;font-size:50px;line-height:1.2;font-weight:400;color:#3d4c48}
.h2{margin-top:18px;font-size:84px;line-height:1.06;font-weight:300;letter-spacing:-.02em}
.stack .h2{max-width:1560px}
.sub,.note{margin-top:32px;font-size:42px;line-height:1.3;font-weight:400;color:#3d4c48}
.card,.li,.ck,.stat,.hc,.credit{background:#fff;border:1.5px solid #e8e1d5;box-shadow:0 8px 0 0 #e8e1d5}
.card{border-radius:28px;padding:34px 38px}
.stat{margin-top:44px;display:inline-flex;align-items:center;gap:30px;border-radius:28px;padding:28px 44px}
.stat b{font-size:118px;line-height:1;font-weight:500;letter-spacing:-.04em;color:#183b37;white-space:nowrap}
.stat span{font-size:40px;font-weight:500;line-height:1.1;white-space:nowrap;color:#3d4c48}
.stat small{display:block;margin-top:6px;font-size:40px;font-weight:700;color:#2f7c72}
.li{display:flex;align-items:center;gap:26px;border-radius:28px;padding:22px 32px;font-size:44px;font-weight:500;letter-spacing:-.02em;line-height:1.12}
.li b{flex:none;width:72px;height:72px;border-radius:50%;display:grid;place-items:center;background:#e07a5f;color:#fff;font-size:38px;font-weight:700}
.li small{display:block;margin-top:6px;font-size:30px;font-weight:400;color:#5d6865;letter-spacing:0}
.li.ok b{background:#2f7c72}.li.mid b{background:#d8b876;color:#1c2a28}.li.num b{background:#183b37;color:#d8b876}
.li.mid b::before{content:'!'}
.li.dot b{width:26px;height:26px;background:#e07a5f;margin:0 12px}
.sunwrap{justify-self:center;height:250px}
.sun{height:250px;width:250px;overflow:visible}
.months .mrow{margin-top:22px;display:grid;grid-template-columns:repeat(12,1fr);gap:8px}
.m{position:relative;height:84px;border-radius:14px;background:#f3efe7;display:grid;place-items:center;font-size:22px;font-weight:600;color:#5d6865}
.m u{position:absolute;inset:0;border-radius:14px;background:#2f7c72;color:#fff;display:grid;place-items:center;text-decoration:none}
.pills{margin-top:20px;display:flex;flex-wrap:wrap;gap:14px}
.pill{display:inline-block;padding:14px 28px;border-radius:999px;background:#f3efe7;border:1.5px solid #e8e1d5;font-size:34px;font-weight:500;transform-origin:left center}
.pill.warn{background:#fbe9e2;border-color:#e07a5f;color:#9c432b;font-size:40px;padding:14px 34px}
.yearwrap{margin-top:54px}
.year{display:grid;grid-template-columns:repeat(12,1fr);gap:12px}
.ym{position:relative;height:210px;border-radius:22px;background:#f3efe7;border:1.5px solid #e8e1d5;display:flex;align-items:flex-end;justify-content:center;padding-bottom:20px;font-size:30px;font-weight:600;color:#5d6865}
.ym span{position:relative}
.ym.hot span{color:#1c2a28}
.ym u{position:absolute;inset:-1.5px;border-radius:22px;background:#f6e8c9;border:1.5px solid #d8b876;display:grid;justify-items:center;padding-top:24px}
.ym .s{width:104px;height:104px;overflow:visible}
.ym .s text{display:none}
.legend{margin-top:30px;display:flex;gap:50px;font-size:34px;color:#3d4c48}
.legend span{display:flex;align-items:center;gap:16px}
.legend i{width:34px;height:34px;border-radius:10px;background:#f3efe7;border:1.5px solid #e8e1d5}
.legend i.hot{background:#f6e8c9;border-color:#d8b876}
.cards2{margin-top:46px;display:grid;grid-template-columns:1fr 1fr;gap:30px}
.cards3{margin-top:50px;display:grid;grid-template-columns:repeat(3,1fr);gap:30px}
.hc{position:relative;border-radius:28px;padding:36px 40px 40px}
.hc svg{width:110px;height:110px}
.hc b{display:block;margin-top:20px;font-size:50px;line-height:1.1;font-weight:500;letter-spacing:-.025em}
.hc .big{margin-top:10px;font-size:120px;line-height:1;letter-spacing:-.04em;color:#183b37}
.hc span{display:block;margin-top:10px;font-size:36px;font-weight:400;color:#3d4c48}
.hc span i{font-style:normal;display:inline-block;color:#2f7c72;font-weight:600}
.hc.ok{border-color:#2f7c72;box-shadow:0 8px 0 0 #2f7c72}
.tag{display:inline-block;margin-top:22px;padding:8px 22px;border-radius:999px;background:#f3efe7;font-size:30px;color:#2f7c72}
.tbl{padding:26px 44px 14px}
.th,.tr{display:grid;grid-template-columns:1fr 80px 1fr;align-items:center}
.th{font-size:24px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#a9813c;padding-bottom:14px;border-bottom:1.5px solid #e8e1d5}
.th span:last-child,.tr b:last-child{text-align:right}
.tr{padding:20px 0;border-bottom:1.5px solid #f3efe7;font-size:84px;line-height:1;letter-spacing:-.03em}
.tr:last-child{border-bottom:0}
.tr b{font-weight:300}.tr b:last-child{font-weight:500;color:#2f7c72}
.tr i{font-style:normal;font-size:50px;color:#a9813c;text-align:center}
.trial .trow{display:flex;justify-content:space-between;align-items:baseline;padding:18px 0;border-bottom:1.5px solid #f3efe7;font-size:34px;color:#5d6865}
.trial .trow b{font-size:50px;font-weight:500;letter-spacing:-.025em;color:#1c2a28}
.trial .eyebrow{margin-bottom:8px}
.result{margin-top:26px;padding:22px 28px;border-radius:20px;background:#fbe9e2;border:1.5px solid #e07a5f;color:#9c432b;font-size:38px;font-weight:600;line-height:1.2;letter-spacing:-.015em;transform-origin:left center}
.gauge{position:relative;margin-top:150px;height:64px;border-radius:32px;background:#f3efe7;border:1.5px solid #e8e1d5}
.gauge>u{position:absolute;left:0;top:0;bottom:0;width:80%;border-radius:32px 0 0 32px;background:#2f7c72;transform-origin:0 50%}
.over{position:absolute;left:80%;right:0;top:0;bottom:0;border-radius:0 32px 32px 0;background:repeating-linear-gradient(135deg,#f3b596 0 14px,#fbe3d8 14px 28px)}
.mk{position:absolute;top:-104px;bottom:-14px;width:0}
.mk>div{position:absolute;inset:0}
.mk i{position:absolute;left:-2.5px;top:92px;bottom:0;width:5px;border-radius:3px;background:#1c2a28}
.mk span{position:absolute;left:-250px;width:500px;text-align:center;top:0;font-size:36px;font-weight:600;line-height:1.15;white-space:nowrap}
.mk small{display:block;font-size:26px;font-weight:400;color:#5d6865}
.mk.red span{color:#9c432b}.mk.red i{background:#e07a5f}
.harm{margin-top:56px;display:flex;flex-wrap:wrap;align-items:center;gap:18px}
.harm p{font-size:38px;color:#3d4c48;margin-right:8px}
.people{padding:40px 44px 34px}
.people .prow{display:grid;grid-template-columns:repeat(5,1fr);gap:22px}
.pp{position:relative}
.pp svg{display:block;width:100%}
.pp u{position:absolute;inset:0}
.fine2{margin-top:24px;font-size:28px;line-height:1.35;color:#5d6865}
.vbars{margin-top:44px;display:grid;gap:26px;padding:36px 44px}
.vb{display:grid;grid-template-columns:480px 1fr 180px;align-items:center;gap:26px;font-size:42px}
.vb b{font-weight:500;letter-spacing:-.02em}
.vt{height:60px;border-radius:30px;background:#f3efe7;overflow:hidden}
.vt u{display:block;height:100%;border-radius:30px;transform-origin:0 50%}
.vb strong{font-size:64px;font-weight:500;letter-spacing:-.03em;color:#183b37;text-align:right;font-variant-numeric:tabular-nums}
.vbars .fine2{margin-top:0}
.aside p:last-child{margin-top:10px;font-size:38px;line-height:1.25;color:#3d4c48}
.tight .h2{font-size:76px}
.checks{margin-top:30px;display:grid;gap:16px}
.ck{display:flex;align-items:center;gap:24px;border-radius:24px;padding:16px 28px;font-size:38px;font-weight:500;letter-spacing:-.02em}
.ck svg{flex:none;width:58px;height:58px}
.end{flex:1;text-align:center}
.lockup{display:inline-flex;align-items:center;gap:22px;font-size:76px;font-weight:700;letter-spacing:-.02em}
.lockup .mark{grid-template-columns:36px 36px;gap:10px}.lockup .mark i{width:36px;height:36px;border-radius:10px}
.url{margin-top:18px;font-size:46px;font-weight:500;color:#2f7c72}
.srcs{margin:26px auto 0;display:inline-block;padding:14px 32px;border-radius:999px;background:#183b37;color:#fbf9f5;font-size:32px;font-weight:600}
.credit{margin-top:36px;display:inline-flex;align-items:center;gap:22px;padding:12px 34px 12px 12px;border-radius:999px}
.credit img{width:100px;height:100px;border-radius:50%;object-fit:cover;object-position:50% 20%;border:4px solid #d8b876}
.credit small{display:block;font-size:24px;color:#5d6865;font-weight:400}
.credit b{display:block;font-size:36px;font-weight:600;letter-spacing:-.02em}
.credit.centre{margin-top:26px;text-align:left}
.fine{margin:26px auto 0;max-width:640px;font-size:26px;line-height:1.4;color:#5d6865}
.take{position:absolute;left:96px;right:96px;bottom:150px;display:flex;align-items:center;gap:22px;padding:14px 30px 14px 14px;border-radius:22px;background:#183b37;color:#fbf9f5;font-size:36px;font-weight:500;letter-spacing:-.015em}
.take b{flex:none;padding:10px 22px;border-radius:14px;background:#d8b876;color:#1c2a28;font-size:24px;font-weight:700;letter-spacing:.12em;text-transform:uppercase}
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
const ins=mk('[data-in]'),pops=mk('[data-pop]'),draws=mk('[data-draw]'),counts=mk('[data-count]'),spins=mk('[data-spin]'),floats=mk('[data-float]');
draws.forEach(({el})=>{el.style.strokeDasharray='1 1'});
const bar=document.querySelector('#bar i'),cap=document.querySelector('#cap span'),rail=[...document.querySelectorAll('#rail span')],aur=document.getElementById('aur'),aur2=document.getElementById('aur2');
const cv=document.getElementById('dust'),cx=cv.getContext('2d');
let seed=11;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const P=Array.from({length:90},()=>({x:rnd()*1920,y:rnd()*1080,r:.8+rnd()*2.6,v:4+rnd()*14,ph:rnd()*6.28,tw:.3+rnd()*1.2,g:rnd()<.3}));
const FROM={u:[0,46,1],d:[0,-46,1],l:[-70,0,1],r:[70,0,1],z:[0,0,.86]};
let lastCap=-1,lastCh=-1;
window.seek=(t)=>{
  const live=new Set();
  for(const s of scenes){
    const fin=s.a===0?1:clamp((t-s.a+0.16)/0.32),last=s===scenes[scenes.length-1],fout=last?0:clamp((t-s.e+0.16)/0.32);
    const o=Math.min(fin,1-fout);
    if(o<=0){s.el.style.display='none';continue}
    live.add(s.el);s.el.style.display='block';s.el.style.opacity=o;
    const p=clamp((t-s.a)/(s.e-s.a));
    const z=1+0.02*p+(1-E.out(fin))*0.03-E.io(fout)*0.02;
    s.cam.style.transform='translate('+(Math.sin(t*0.21)*4).toFixed(2)+'px,'+(Math.cos(t*0.17)*3).toFixed(2)+'px) scale('+z.toFixed(4)+')';
    s.el.style.filter=o<1?'blur('+((1-o)*10).toFixed(1)+'px)':'none';
  }
  for(const{el,sc}of ins){if(sc&&!live.has(sc))continue;const p=E.out(clamp((t-+el.dataset.in)/0.6));const f=FROM[el.dataset.from||'u'];el.style.opacity=p;el.style.transform='translate('+((1-p)*f[0]).toFixed(2)+'px,'+((1-p)*f[1]).toFixed(2)+'px) scale('+(f[2]+(1-f[2])*p).toFixed(4)+')';}
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

const html = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>Vitamin D: how much, which form, and who is low</title><style>${css}</style></head><body>
<div id="sky"></div><div id="aur"></div><div id="aur2"></div><canvas id="dust" width="1920" height="1080"></canvas>
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
