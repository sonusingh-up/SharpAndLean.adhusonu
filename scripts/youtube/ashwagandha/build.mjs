/*
 * Writes .out/video.html and .out/timeline.json for the YouTube explainer
 * "Ashwagandha benefits: what it can and can't do" (1920×1080).
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
const sumita = `data:image/jpeg;base64,${b64(join(here, 'assets', 'sumita.jpg'))}`;
// The reviewer's photo and credit, shown as a small badge.
const credit = (t, extra = '') => `<div class="credit" data-in="${t}" ${extra}><img src="${sumita}" alt=""><span><small>Script checked by</small><b>Sumita Bhatti</b><small>Clinical Nutritionist</small></span></div>`;
const plant = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M0 0 q-14 70 -6 130 q6 60 -20 120 M-4 110 q-40 30 -60 90 M-2 150 q34 30 44 86" fill="none" stroke="url(#gold)" stroke-width="22" stroke-linecap="round"/>
  <path d="M0 0 V-230" stroke="#2f7c72" stroke-width="14" stroke-linecap="round"/>
  ${[[-1, -70, -32], [1, -110, 30], [-1, -160, -24], [1, -200, 26]].map(([d, yy, r]) => `<path d="M0 ${yy} q${d * 90} -50 ${d * 150} -6 q${-d * 60} 50 ${-d * 150} 6 z" fill="url(#teal)" transform="rotate(${r} 0 ${yy})"/>`).join('')}
  ${[[-34, -236], [30, -250], [0, -274]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="20" fill="#e07a5f"/><circle cx="${cx - 6}" cy="${cy - 6}" r="6" fill="#fff" opacity=".5"/>`).join('')}
</g>`;
const rowCard = (t, kind, title, sub) => `<div class="li ${kind}" data-in="${t}" data-from="l"><b>${kind === 'ok' ? '✓' : kind === 'mid' ? '~' : '!'}</b><span>${title}<small>${sub}</small></span></div>`;

/* 1. Hook */
S('shimmer', st('hook', 0.4), 0.7);
scenes.push(scene('hook', 'split', `
  <div class="txt wide">
    <p class="kicker" data-in="${st('hook', 0.2)}">Ashwagandha benefits: what trials show</p>
    <h1 class="title" data-in="${st('hook', 0.35)}">Ashwagandha</h1>
    <div class="chips">${[['Stress', 'stress,'], ['Sleep', 'sleep,'], ['Testosterone', 'testosterone']].map(([c, p]) => `<div class="chip plain" data-pop="${S('pop', on('hook', p), 0.6)}">${c}</div>`).join('')}</div>
    <p class="lead" data-in="${on('hook', 'Here is')}">What it <em>can</em> do, what it <em>can't</em>,<br>and who should not take it.</p>
    ${credit(on('hook', 'how much people'))}
  </div>
  <svg class="viz" viewBox="0 0 900 760"><g data-in="${st('hook', 0.3)}" data-from="z"><circle cx="560" cy="380" r="300" fill="#d8b876" opacity=".14" filter="url(#blur40)"/><g data-float="12,8,0">${plant(560, 420, 1.25)}</g></g></svg>`));

/* 2. The short answer */
scenes.push(scene('answer', 'split', `
  <div class="txt">${head('answer', 'The short answer', 'It may help with <em>stress and sleep.</em>')}</div>
  <div class="col">
    ${rowCard(S('tick', on('answer', 'It may help'), 0.8), 'ok', 'Stress and sleep', 'May help')}
    ${rowCard(S('tick', on('answer', 'The effect on sleep'), 0.8), 'mid', 'The sleep effect is small', 'And the trials are short')}
    ${rowCard(S('warn', on('answer', 'it is not safe'), 0.5), 'bad', 'Not safe for everyone', 'Safety comes later in this video')}
  </div>`));

/* 3. What it is */
A.root = S('chime', on('what', 'the root'), 0.7);
A.with = S('pop', on('what', 'withanolides'), 0.7);
scenes.push(scene('what', 'split', `
  <div class="txt">${head('what', 'What it is', 'A shrub: <em>Withania somnifera.</em>')}
    <p class="note" data-in="${on('what', 'Supplements mostly')}">Supplements mostly use the root.</p>
  </div>
  <svg class="viz" viewBox="0 0 900 760">
    <g data-in="${st('what', 0.4)}" data-from="z"><g data-float="8,7,0">${plant(330, 400, 1.15)}</g></g>
    <g data-in="${A.root}"><path d="M380 560 H560" stroke="#d8b876" stroke-width="4" stroke-dasharray="4 10" stroke-linecap="round"/><rect x="560" y="520" width="280" height="80" rx="40" fill="url(#gold)"/><text x="700" y="570" text-anchor="middle" class="t30 b ink">Root</text></g>
    <g data-pop="${A.with}" data-org="700px 300px"><path d="M700 220 l70 40 v80 l-70 40 l-70 -40 v-80 z" fill="none" stroke="#7cc47e" stroke-width="8" filter="url(#glowS)"/><text x="700" y="440" text-anchor="middle" class="t34 b cream">Withanolides</text><text x="700" y="482" text-anchor="middle" class="t24 dim b">its best-known compounds</text></g>
  </svg>`));

/* 4. Stress: the review */
A.low = on('stress', 'lowered stress');
A.cort = S('chime', on('stress', 'cortisol'), 0.8);
S('whoosh', A.low, 0.5);
const down = (x, label, sub, t) => `<g data-in="${t}"><rect x="${x}" y="120" width="360" height="520" rx="40" fill="#12302c" stroke="#2f5d56" stroke-width="3"/>
  <g ${k([[t, { y: -120, o: 0 }], [t + 0.9, { y: 0, o: 1 }]])}><path d="M${x + 180} 210 V420 M${x + 110} 350 L${x + 180} 430 L${x + 250} 350" fill="none" stroke="#7cc47e" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" filter="url(#glowS)"/></g>
  <text x="${x + 180}" y="530" text-anchor="middle" class="t36 b cream">${label}</text><text x="${x + 180}" y="580" text-anchor="middle" class="t26 b dim">${sub}</text></g>`;
scenes.push(scene('stress', 'split', `
  <div class="txt">${head('stress', 'Stress: the review', 'Lower stress scores, and <em>lower cortisol.</em>')}
    <div class="chips">
      <div class="chip" data-pop="${S('pop', on('stress', 'seven trials'), 0.6)}"><b>7</b>trials</div>
      <div class="chip" data-pop="${S('pop', on('stress', 'four hundred'), 0.6)}"><b>491</b>adults</div>
      <div class="chip" data-pop="${S('pop', on('stress', 'six to eight weeks'), 0.6)}"><b>6–8</b>weeks</div>
    </div>
  </div>
  <svg class="viz" viewBox="0 0 900 760">${down(60, 'Stress and anxiety', 'scores went down', A.low)}${down(480, 'Cortisol', 'the stress hormone', A.cort)}</svg>`));

/* 5. The catch */
const catches = [['All 7 trials', 'were in India', 'All seven'], ['Most', 'were small', 'most were small'], ['None longer', 'than about 2 months', 'none ran longer']];
scenes.push(scene('catch', 'stack', `
  ${head('catch', 'Read the small print', 'There is <em>a catch.</em>')}
  <div class="cards3">${catches.map(([a, b, p]) => `<div class="hc" data-in="${S('flip', on('catch', p), 0.8)}" data-from="z"><b class="big">${a}</b><span>${b}</span></div>`).join('')}</div>`));

/* 6. Not every trial agrees */
scenes.push(scene('disagree', 'split', `
  <div class="txt">${head('disagree', 'Not every trial agrees', 'One 12-week study found <em>no drop in stress.</em>')}
    <div class="chips"><div class="chip" data-pop="${S('pop', on('disagree', 'one hundred and twenty'), 0.6)}"><b>120</b>adults</div><div class="chip" data-pop="${S('pop', on('disagree', 'twelve-week'), 0.6)}"><b>12</b>weeks</div></div>
  </div>
  <div class="col">
    ${rowCard(S('warn', on('disagree', 'did not lower'), 0.5), 'bad', 'Perceived stress', 'No change against placebo')}
    ${rowCard(S('tick', on('disagree', 'although people'), 0.8), 'ok', 'Fatigue', 'People felt less tired')}
  </div>`));

/* 7. Anxiety */
A.unclear = S('tick', on('anxiety', 'still unclear'), 0.8);
scenes.push(scene('anxiety', 'split', `
  <div class="txt">${head('anxiety', 'Anxiety', 'The evidence is <em>still unclear.</em>')}
    <p class="tag" data-pop="${on('anxiety', 'the US national')}">US National Center for Complementary and Integrative Health</p>
  </div>
  <svg class="viz" viewBox="0 0 900 760"><g data-in="${st('anxiety', 0.4)}" data-from="z">
    <path d="M110 560 A340 340 0 0 1 790 560" fill="none" stroke="#3d5a55" stroke-width="64" stroke-linecap="round"/>
    <text x="110" y="660" text-anchor="middle" class="t30 dim b">Doesn't help</text><text x="790" y="660" text-anchor="middle" class="t30 dim b">Helps</text>
    <g data-org="450px 560px" ${k([[st('anxiety'), { r: -50, e: 'io' }], [st('anxiety', 1.2), { r: 40, e: 'io' }], [st('anxiety', 2.4), { r: -30, e: 'io' }], [st('anxiety', 3.6), { r: 24, e: 'io' }], [A.unclear, { r: -12, e: 'io' }], [A.unclear + 1, { r: 8, e: 'io' }], [A.unclear + 2, { r: -4 }]])}><path d="M438 560 L450 250 L462 560 z" fill="#fbf9f5" filter="url(#shadow)"/></g>
    <circle cx="450" cy="560" r="34" fill="url(#gold)"/><text x="450" y="200" text-anchor="middle" class="t150 b ochre" data-pop="${A.unclear}">?</text>
  </g></svg>`));

/* 8. Sleep */
A.small = S('stamp', on('sleep', 'a small but real'), 0.9);
scenes.push(scene('sleep', 'split', `
  <div class="txt">${head('sleep', 'Sleep', 'A <em>small but real</em> improvement.')}
    <div class="chips"><div class="chip" data-pop="${S('pop', on('sleep', 'five trials'), 0.6)}"><b>5</b>trials</div><div class="chip" data-pop="${S('pop', on('sleep', 'three hundred'), 0.6)}"><b>372</b>adults</div></div>
  </div>
  <svg class="viz" viewBox="0 0 900 760"><g data-in="${st('sleep', 0.4)}" data-from="z">
    <g data-float="12,9,0"><circle cx="450" cy="330" r="190" fill="url(#moon)" filter="url(#glowS)"/><circle cx="560" cy="270" r="170" fill="#0f2925"/></g>
    ${[[640, 170, 30], [720, 300, 22], [600, 420, 18]].map(([x, y, s], i) => `<text x="${x}" y="${y}" class="b cream" style="font-size:${s * 2}px" data-float="10,${5 + i},${i}">z</text>`).join('')}
    <g data-pop="${A.small}" data-org="450px 620px"><g transform="rotate(-5 450 620)"><rect x="250" y="572" width="400" height="96" rx="18" fill="#0e2421" stroke="#d8b876" stroke-width="6"/><text x="450" y="634" text-anchor="middle" class="t36 b ochre">SMALL EFFECT</text></g></g>
  </g></svg>`));

/* 9. Who it helped */
const best = [['600 mg', 'a day', 'six hundred milligrams'], ['8 weeks', 'or longer', 'at least eight weeks'], ['Insomnia', 'already present', 'already had insomnia']];
scenes.push(scene('who', 'stack', `
  ${head('who', 'Where it worked best', 'Higher dose, longer use, <em>real insomnia.</em>')}
  <div class="cards3">${best.map(([a, b, p]) => `<div class="hc" data-in="${S('pop', on('who', p), 0.7)}" data-from="z"><b class="big">${a}</b><span>${b}</span></div>`).join('')}</div>`));

/* 10. Dose */
A.dose = S('chime', on('dose', 'three hundred to six hundred'), 0.9);
scenes.push(scene('dose', 'split', `
  <div class="txt">${head('dose', 'How much', 'What most trials <em>actually used.</em>')}
    <div class="stat" data-in="${A.dose}"><b>300–600</b><span>mg a day<small>of root extract</small></span></div>
  </div>
  <svg class="viz" viewBox="0 0 900 760"><g data-in="${st('dose', 0.5)}" data-from="z">
    ${[[300, 250, -28], [560, 380, 18], [360, 520, -8]].map(([x, y, r], i) => `<g data-float="9,${6 + i},${i}"><g data-pop="${r2(st('dose', 0.6 + i * 0.25))}">${capsule(x, y, '#a9813c', '#d8b876', r, 260, 104)}</g></g>`).join('')}
  </g></svg>`));

/* 11. Read the label */
A.look = S('whoosh', on('label', 'Look for', -0.2), 0.6);
scenes.push(scene('label', 'split', `
  <div class="txt">${head('label', 'Read the label', 'Extracts <em>differ.</em>')}</div>
  <div class="label wide" ${k([[st('label', 0.6), { x: 80, o: 0, s: 0.94 }], [st('label', 1.2), { x: 0, o: 1, s: 1 }]])}>
    <strong>Supplement facts</strong>
    <p class="strike"><span>Capsule weight<small>the whole capsule</small></span><i>not this</i></p>
    <p class="hit"><span>Ashwagandha extract, mg<small>the amount of extract</small></span><i>this</i>
      <svg viewBox="0 0 660 110" preserveAspectRatio="none"><rect x="5" y="5" width="650" height="100" rx="22" fill="none" stroke="#2f7c72" stroke-width="7" pathLength="1" data-draw="${S('tick', on('label', 'the amount of extract'), 0.9)}" data-dur="0.6"/></svg></p>
    <p class="hit"><span>Withanolides, %<small>how concentrated it is</small></span><i>and this</i>
      <svg viewBox="0 0 660 110" preserveAspectRatio="none"><rect x="5" y="5" width="650" height="100" rx="22" fill="none" stroke="#2f7c72" stroke-width="7" pathLength="1" data-draw="${S('tick', on('label', 'the percentage'), 0.9)}" data-dur="0.6"/></svg></p>
  </div>`));

/* 12. Other claims */
scenes.push(scene('claims', 'split', `
  <div class="txt">${head('claims', 'Other claims', 'Testosterone, muscle <em>and memory.</em>')}</div>
  <div class="col">
    ${rowCard(S('tick', on('claims', 'limited evidence'), 0.8), 'mid', 'Testosterone', 'Limited evidence')}
    ${rowCard(S('warn', on('claims', 'not enough'), 0.5), 'bad', 'Athletic performance', 'Not enough evidence')}
    ${rowCard(S('warn', on('claims', 'brain function'), 0.5), 'bad', 'Memory and focus', 'Not enough evidence')}
  </div>`));

/* 13. Side effects */
S('swell', st('side', 0.2), 0.8);
scenes.push(scene('side', 'split', `
  <div class="txt">${head('side', 'Now, safety', 'The common side effects <em>are mild.</em>')}
    ${credit(st('side', 0.9))}
  </div>
  <div class="col">${[['Stomach upset', 'stomach upset'], ['Loose stools', 'loose stools'], ['Nausea', 'nausea'], ['Drowsiness', 'drowsiness']].map(([c, p]) => `<div class="chip warn big" data-pop="${S('pop', on('side', p), 0.7)}"><b>!</b>${c}</div>`).join('')}</div>`));

/* 14. How long */
A.three = on('long', 'three months');
A.beyond = S('warn', on('long', 'Beyond that'), 0.5);
scenes.push(scene('long', 'split', `
  <div class="txt">${head('long', 'How long', 'About <em>three months.</em>')}
    <p class="note" data-in="${A.beyond}">Beyond that, nobody has good data.</p>
  </div>
  <svg class="viz" viewBox="0 0 900 760">
    ${[0, 1, 2].map((i) => { const t = S('flip', A.three - 0.6 + i * 0.35, 0.8); return `<g ${k([[t, { y: -80, o: 0, r: -8 }], [t + 0.5, { y: 0, o: 1, r: [-5, 2, 6][i], e: 'back' }]])}>
      <rect x="${60 + i * 150}" y="${130 + i * 80}" width="270" height="300" rx="26" fill="#fbf9f5" filter="url(#shadow)"/><rect x="${60 + i * 150}" y="${130 + i * 80}" width="270" height="74" rx="26" fill="#2f7c72"/>
      <text x="${195 + i * 150}" y="${180 + i * 80}" text-anchor="middle" class="t28 b cream">Month ${i + 1}</text>
      ${Array.from({ length: 20 }, (_, d) => `<circle cx="${106 + i * 150 + (d % 5) * 44}" cy="${248 + i * 80 + Math.floor(d / 5) * 42}" r="10" fill="#7cc47e"/>`).join('')}</g>`; }).join('')}
    <g data-pop="${A.beyond}" data-org="700px 690px"><rect x="560" y="640" width="290" height="100" rx="24" fill="#0e2421" stroke="#e07a5f" stroke-width="5"/><text x="705" y="702" text-anchor="middle" class="t36 b terra">Month 4+  ?</text></g>
  </svg>`));

/* 15. Liver */
A.stop = S('warn', on('liver', 'Stop and see'), 0.6);
scenes.push(scene('liver', 'split', `
  <div class="txt">${head('liver', 'Rare, but serious', 'Liver injury <em>has been reported.</em>')}
    <p class="tag" data-pop="${A.stop}">Stop, and see a doctor</p>
  </div>
  <div class="col">
    ${rowCard(S('pop', on('liver', 'skin or eyes'), 0.6), 'bad', 'Yellow skin or eyes', 'Jaundice')}
    ${rowCard(S('pop', on('liver', 'itching'), 0.6), 'bad', 'Itching', 'Pruritus')}
    ${rowCard(S('pop', on('liver', 'dark urine'), 0.6), 'bad', 'Dark urine', 'A general liver warning sign')}
  </div>`));

/* 16. Thyroid */
A.raise = S('chime', on('thyroid', 'raise thyroid'), 0.7);
scenes.push(scene('thyroid', 'split', `
  <div class="txt">${head('thyroid', 'Thyroid', 'It can raise <em>thyroid hormones.</em>')}
    <p class="note" data-in="${on('thyroid', 'so avoid it')}">Thyroid condition? Avoid it unless your doctor agrees.</p>
  </div>
  <svg class="viz" viewBox="0 0 900 760"><g data-in="${st('thyroid', 0.4)}" data-from="z"><g data-float="8,7,0">
    <path d="M330 250 q-110 40 -100 190 q10 130 110 150 q70 10 90 -90 l20 0 q20 100 90 90 q100 -20 110 -150 q10 -150 -100 -190 q-40 90 -110 120 q-70 -30 -110 -120 z" fill="#b9603f" filter="url(#shadow)"/>
    <path d="M330 250 q-110 40 -100 190 q10 130 110 150 q70 10 90 -90 l20 0 q20 100 90 90 q100 -20 110 -150 q10 -150 -100 -190 q-40 90 -110 120 q-70 -30 -110 -120 z" fill="url(#gloss)"/></g>
    <g ${k([[A.raise, { y: 120, o: 0 }], [A.raise + 0.9, { y: 0, o: 1 }]])}><path d="M740 520 V250 M670 330 L740 240 L810 330" fill="none" stroke="#e07a5f" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" filter="url(#glowS)"/><text x="740" y="600" text-anchor="middle" class="t30 b terra">T3 and T4</text></g>
  </g></svg>`));

/* 17. Who should avoid it */
const avoid = [['Pregnancy and breastfeeding', 'pregnancy'], ['Hormone-sensitive prostate cancer', 'hormone-sensitive'], ['Autoimmune conditions', 'autoimmune'], ['Before surgery', 'before surgery']];
scenes.push(scene('avoid', 'split tight', `
  <div class="txt">${head('avoid', 'Who should avoid it', 'Skip it if any of these <em>apply to you.</em>')}</div>
  <div class="col">${avoid.map(([a, p]) => `<div class="li bad" data-in="${S('pop', on('avoid', p), 0.6)}" data-from="l"><b>✕</b><span>${a}</span></div>`).join('')}</div>`));

/* 18. Medicines */
const meds = [['Diabetes', 'diabetes'], ['Blood pressure', 'blood pressure'], ['Thyroid', 'thyroid,'], ['Seizures', 'seizures'], ['Sleep and sedatives', 'sleep,'], ['Immunosuppressants', 'immunosuppressants']];
scenes.push(scene('meds', 'stack', `
  ${head('meds', 'Medicines it may interact with', 'Ask a <em>pharmacist</em> first.')}
  <div class="grid6">${meds.map(([m, p]) => `<div class="mc" data-in="${S('pills', on('meds', p), 0.6)}" data-from="z"><svg viewBox="0 0 220 110">${capsule(110, 50, '#3c6fa0', '#9cc3e6', -18, 130, 54)}</svg><b>${m}</b></div>`).join('')}</div>`));

/* 19. Verdict */
const verdicts = [['May ease stress, and help sleep a little', 'may ease stress'], ['300 to 600 mg a day, for eight weeks', 'Try three hundred'], ['Stop at three months', 'stop at three months'], ['Skip it if any warning applies to you', 'skip it']];
A.src = S('swell', on('verdict', 'Sources are'), 0.8);
scenes.push(scene('verdict', 'split tight', `
  <div class="txt wide">
    ${head('verdict', 'The verdict', 'Modest help, <em>with real cautions.</em>')}
    <div class="checks">${verdicts.map(([v, p]) => { const t = S('tick', on('verdict', p), 0.9); return `<div class="ck" data-in="${t}" data-from="l"><svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="28" fill="#183b37" stroke="#7cc47e" stroke-width="3"/>${tick(28, 30, 0.9, r2(t + 0.15))}</svg>${v}</div>`; }).join('')}</div>
  </div>
  <div class="end" data-in="${A.src}" data-from="z">
    <div class="lockup"><span class="mark"><i></i><i></i><i></i><i></i></span>SharpAndLean</div>
    <p class="url">sharpandlean.com</p>
    <div class="credit centre"><img src="${sumita}" alt=""><span><small>Script checked by</small><b>Sumita Bhatti</b><small>Clinical Nutritionist</small></span></div>
    <p class="srcs">Sources in the description</p>
    <p class="fine">General information, not medical advice. Speak to a pharmacist or doctor before starting a supplement, especially if you are pregnant, have a thyroid condition or take regular medication.</p>
  </div>`));

/* scene changes */
script.lines.slice(1).forEach((l, i) => S(i % 4 === 3 ? 'swell' : 'whoosh', T[l.id].s - 0.12, 0.45));

/* ---------- page ---------- */

const css = `
${fonts}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1920px;height:1080px;overflow:hidden;background:#0b1f1c}
body{font-family:'DM Sans',sans-serif;color:#fbf9f5;position:relative}
em{font-family:'Newsreader',serif;font-style:italic;font-weight:400;color:#d8b876}
#sky{position:absolute;inset:0;background:radial-gradient(1200px 800px at 78% 12%,#24524b 0%,rgba(36,82,75,0) 70%),radial-gradient(1100px 900px at 8% 100%,#3a2f1e 0%,rgba(58,47,30,0) 65%),linear-gradient(160deg,#102a26 0%,#0b1f1c 60%,#091815 100%)}
#aur{position:absolute;left:-200px;top:-300px;width:1500px;height:1000px;border-radius:50%;background:radial-gradient(closest-side,rgba(47,124,114,.34),rgba(47,124,114,0));filter:blur(20px)}
#aur2{position:absolute;right:-300px;bottom:-420px;width:1300px;height:1000px;border-radius:50%;background:radial-gradient(closest-side,rgba(216,184,118,.2),rgba(216,184,118,0))}
#dust{position:absolute;inset:0}
#vig{position:absolute;inset:0;z-index:5;pointer-events:none;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 55%,rgba(0,0,0,.5) 100%)}
#bar{position:absolute;left:0;right:0;top:0;height:8px;background:rgba(251,249,245,.14);z-index:7}
#bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#2f7c72,#d8b876)}
#logo{position:absolute;left:96px;top:56px;z-index:7;display:flex;align-items:center;gap:14px;font-weight:700;font-size:34px;letter-spacing:-.01em}
.mark{display:grid;grid-template-columns:17px 17px;gap:5px}
.mark i{width:17px;height:17px;border-radius:5px;background:currentColor}
.mark i:last-child{background:#7cc47e}
#chap{position:absolute;right:96px;top:60px;z-index:7;font-size:26px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#b9c9c4}
#chap b{color:#d8b876;margin-right:14px;font-variant-numeric:tabular-nums}
#cap{position:absolute;left:0;right:0;bottom:50px;z-index:7;text-align:center}
#cap span{display:inline-block;max-width:1560px;padding:14px 32px;border-radius:20px;background:rgba(6,18,16,.82);border:1px solid rgba(251,249,245,.12);font-size:38px;line-height:1.25;font-weight:500;color:rgba(251,249,245,.55)}
#cap u{text-decoration:none;color:#fbf9f5}
#cap u.now{color:#d8b876}
.scene{position:absolute;inset:0;display:none;z-index:2}
.cam{position:absolute;inset:0;padding:160px 96px 190px;display:flex;transform-origin:50% 50%}
.split>.cam{align-items:center;gap:60px}
.stack>.cam{flex-direction:column;justify-content:center}
.full>.cam{align-items:center}
.txt{flex:0 0 800px;position:relative;z-index:2}
.txt.wide{flex:0 0 960px}
.viz{flex:1;height:730px;overflow:visible}
.art{position:absolute;inset:0;width:1920px;height:1080px;overflow:visible}
.wideviz{margin-top:50px;width:1728px;height:520px;overflow:visible}
svg text{font-family:'DM Sans',sans-serif}
svg [data-k],svg [data-pop],svg [data-in],svg [data-float]{transform-box:fill-box;transform-origin:center}
.b{font-weight:700}.ink{fill:#1c2a28}.cream{fill:#fbf9f5}.dim{fill:#b9c9c4}.muted{fill:#5d6865}.terra{fill:#e07a5f}.ochre{fill:#d8b876}
.t20{font-size:20px}.t24{font-size:24px}.t26{font-size:26px}.t28{font-size:28px}.t30{font-size:30px}.t34{font-size:34px}.t36{font-size:36px}.t40{font-size:40px}.t44{font-size:44px}.t64{font-size:64px;letter-spacing:-.03em}.t150{font-size:150px;letter-spacing:-.05em}
.kicker{font-size:30px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#d8b876}
.title{margin-top:20px;font-size:150px;line-height:.96;font-weight:700;letter-spacing:-.045em;text-shadow:0 10px 50px rgba(0,0,0,.45)}
.lead{margin-top:40px;font-size:52px;line-height:1.2;font-weight:500;color:#d6e2de}
.lead em{font-size:1.1em}
.h2{margin-top:18px;font-size:84px;line-height:1.04;font-weight:700;letter-spacing:-.035em;text-shadow:0 8px 40px rgba(0,0,0,.4)}
.stack .h2{max-width:1500px}
.h3{margin-top:14px;font-size:62px;line-height:1.06;font-weight:700;letter-spacing:-.03em}
.sub,.note{margin-top:34px;font-size:44px;line-height:1.25;font-weight:500;color:#d6e2de}
.glass,.rc,.fc,.hc,.chip,.li,.fr,.ck,.stat,.row3{background:linear-gradient(160deg,rgba(255,255,255,.1),rgba(255,255,255,.035));border:1.5px solid rgba(251,249,245,.16);box-shadow:0 24px 60px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.18)}
.stat{margin-top:44px;display:inline-flex;align-items:center;gap:30px;border-radius:36px;padding:30px 44px}
.stat b{font-size:118px;line-height:1;letter-spacing:-.045em;color:#d8b876;font-variant-numeric:tabular-nums;white-space:nowrap}
.stat b i{font-style:normal}
.stat span{white-space:nowrap}
.stat span{font-size:40px;font-weight:700;line-height:1.1}
.stat small,.li small,.fr small{display:block;margin-top:6px;font-size:26px;font-weight:500;color:#b9c9c4;letter-spacing:0}
.rows{display:grid;gap:18px}
.row3{display:flex;align-items:center;gap:24px;border-radius:28px;padding:24px 32px;font-size:36px}
.row3 i{width:26px;height:26px;border-radius:50%;flex:none}
.row3 b{font-size:44px;letter-spacing:-.02em;white-space:nowrap}
.row3 span{color:#b9c9c4;font-weight:500}
.cards5{margin-top:56px;display:grid;grid-template-columns:repeat(5,1fr);gap:24px;perspective:1600px}
.rc{border-radius:36px;padding:34px 30px 32px;display:flex;flex-direction:column;gap:12px;transform-origin:50% 50%}
.rc svg{width:104px;height:104px;margin-bottom:8px}
.rc b{font-size:38px;line-height:1.08;letter-spacing:-.02em}
.rc span{font-size:27px;line-height:1.25;color:#b9c9c4;font-weight:500;min-height:68px}
.lvl{margin-top:10px;height:16px;border-radius:8px;background:rgba(251,249,245,.14);overflow:hidden}
.lvl i{display:block;height:100%;border-radius:8px;background:linear-gradient(90deg,#e07a5f,#d8b876);transform-origin:0 50%}
.chips{margin-top:44px;display:flex;flex-wrap:wrap;gap:20px}
.chips.col{flex-direction:column;align-items:flex-start;gap:16px;margin-top:36px}
.chip{display:inline-flex;align-items:center;gap:18px;border-radius:999px;padding:16px 34px 16px 18px;font-size:40px;font-weight:700;letter-spacing:-.02em;transform-origin:left center}
.chip b{min-width:70px;height:70px;padding:0 20px;border-radius:35px;background:#d8b876;color:#1c2a28;display:grid;place-items:center;font-size:34px;white-space:nowrap}
.chip.warn b{background:#e07a5f;color:#fff}
.tag{margin-top:40px;display:inline-block;transform-origin:left center;background:#d8b876;color:#1c2a28;font-weight:700;font-size:34px;padding:18px 32px;border-radius:999px}
.cards4{margin-top:50px;display:grid;grid-template-columns:repeat(4,1fr);gap:26px}
.fc{border-radius:40px;padding:20px 34px 38px}
.fc svg{width:100%;height:200px;overflow:visible}
.fc b{display:block;font-size:44px;line-height:1.08;letter-spacing:-.025em;min-height:96px}
.fc span{display:block;margin-top:10px;font-size:30px;line-height:1.25;font-weight:500;color:#b9c9c4}
.fc.ok{border-color:rgba(124,196,126,.7)}.fc.ok span{color:#a9e0ab}
.fc.note{border-color:rgba(216,184,118,.7)}.fc.note span{color:#e6cf9c}
.fc.bad{border-color:rgba(224,122,95,.65)}.fc.bad span{color:#f3b596}
.label{margin-top:40px;width:720px;background:#fbf9f5;color:#1c2a28;border-radius:24px;padding:26px 30px 24px;box-shadow:0 30px 70px rgba(0,0,0,.45);transform-origin:left center}
.label strong{display:block;font-size:44px;letter-spacing:-.02em;padding-bottom:10px;border-bottom:9px solid #1c2a28}
.label p{position:relative;display:flex;justify-content:space-between;align-items:center;gap:20px;padding:18px 14px;font-size:32px;font-weight:700;border-bottom:2px solid #d9d2c5}
.label p small{display:block;font-size:22px;font-weight:500;color:#5d6865}
.label p i{font-style:normal;font-size:24px;white-space:nowrap;padding:8px 16px;border-radius:999px;background:#e8e1d5}
.label p.strike span{opacity:.5;text-decoration:line-through}
.label p.hit i{background:#2f7c72;color:#fff}
.label p svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.foods{margin-top:30px;display:grid;gap:11px}
.fr{display:grid;grid-template-columns:44px 420px 1fr 200px;align-items:center;gap:26px;border-radius:24px;padding:9px 34px;font-size:36px}
.fr i{width:34px;height:34px;border-radius:50%}
.fr b{letter-spacing:-.02em;display:flex;align-items:baseline;gap:16px}
.fr b small{margin:0}
.ft{height:30px;border-radius:15px;background:rgba(251,249,245,.1);overflow:hidden}
.ft u{display:block;height:100%;border-radius:15px;transform-origin:0 50%}
.fr strong{text-align:right;font-size:46px;letter-spacing:-.02em;font-variant-numeric:tabular-nums;color:#d8b876}
.even>.cam{align-items:flex-start;padding-top:190px;gap:70px}
.half{flex:1}
.half svg{margin-top:30px;width:100%;height:440px;overflow:visible}
.lis{margin-top:28px;display:grid;gap:12px}
.tight .h2{font-size:70px}
.tight .checks{margin-top:28px;gap:12px}
.tight .ck{padding:14px 28px;font-size:38px}
.li{display:flex;align-items:center;gap:26px;border-radius:28px;padding:13px 28px;font-size:36px;font-weight:700;letter-spacing:-.02em;line-height:1.1}
.li b{flex:none;width:64px;height:64px;border-radius:50%;display:grid;place-items:center;background:#e07a5f;color:#fff;font-size:38px}
.cards3{margin-top:60px;display:grid;grid-template-columns:repeat(3,1fr);gap:30px}
.hc{border-radius:44px;padding:44px 44px 50px}
.hc svg{width:150px;height:150px}
.hc b{display:block;margin-top:26px;font-size:54px;line-height:1.08;letter-spacing:-.03em}
.checks{margin-top:40px;display:grid;gap:16px}
.ck{display:flex;align-items:center;gap:26px;border-radius:30px;padding:20px 30px;font-size:42px;font-weight:700;letter-spacing:-.02em}
.ck svg{flex:none;width:64px;height:64px}
.end{flex:1;text-align:center}
.lockup{display:inline-flex;align-items:center;gap:22px;font-size:76px;font-weight:700;letter-spacing:-.02em}
.lockup .mark{grid-template-columns:36px 36px;gap:10px}.lockup .mark i{width:36px;height:36px;border-radius:10px}
.url{margin-top:20px;font-size:46px;font-weight:700;color:#d8b876}
.by{margin-top:34px;font-size:30px;color:#d6e2de}
.srcs{margin:26px auto 0;display:inline-block;padding:14px 30px;border-radius:999px;background:#fbf9f5;color:#183b37;font-size:32px;font-weight:700}
.col{flex:1;display:grid;gap:18px;align-content:center}
.li.ok b{background:#2f7c72}.li.mid b{background:#d8b876;color:#1c2a28}.li.bad b{background:#e07a5f}
.col .li{font-size:44px;padding:22px 32px}
.col .li b{width:72px;height:72px;font-size:40px}
.chip.plain{padding:16px 34px}
.chip.big{font-size:46px;padding:18px 40px 18px 20px;justify-self:start}
.hc .big{margin-top:0;font-size:76px;color:#d8b876}
.hc span{display:block;margin-top:12px;font-size:40px;font-weight:500;color:#d6e2de}
.label.wide{margin-top:0}
.label p.hit{margin-top:6px}
.grid6{margin-top:50px;display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.mc{display:flex;align-items:center;gap:20px;border-radius:32px;padding:22px 30px;font-size:42px;letter-spacing:-.02em;background:linear-gradient(160deg,rgba(255,255,255,.1),rgba(255,255,255,.035));border:1.5px solid rgba(251,249,245,.16);box-shadow:0 24px 60px rgba(0,0,0,.35)}
.mc svg{flex:none;width:170px;height:90px;overflow:visible}
.credit{margin-top:36px;display:inline-flex;align-items:center;gap:22px;padding:14px 34px 14px 14px;border-radius:999px;background:rgba(251,249,245,.08);border:1.5px solid rgba(216,184,118,.5)}
.credit img{width:104px;height:104px;border-radius:50%;object-fit:cover;object-position:50% 20%;border:4px solid #d8b876}
.credit small{display:block;font-size:24px;color:#b9c9c4;font-weight:500}
.credit b{display:block;font-size:36px;letter-spacing:-.02em}
.credit.centre{margin-top:30px;text-align:left}
.txt .chips+.lead{margin-top:30px}
.fine{margin:30px auto 0;max-width:640px;font-size:24px;line-height:1.4;color:#9fb3ad}
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

const chapters = script.lines.map((l) => ({ s: T[l.id].s, name: l.chapter }));

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
const bar=document.querySelector('#bar i'),cap=document.querySelector('#cap span'),chap=document.getElementById('chap'),aur=document.getElementById('aur'),aur2=document.getElementById('aur2');
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
    const z=1+0.035*p+(1-E.out(fin))*0.07-E.io(fout)*0.05;
    s.cam.style.transform='translate('+(Math.sin(t*0.21)*8).toFixed(2)+'px,'+(Math.cos(t*0.17)*6).toFixed(2)+'px) scale('+z.toFixed(4)+')';
    s.el.style.filter=o<1?'blur('+((1-o)*10).toFixed(1)+'px)':'none';
  }
  for(const{el,sc}of ins){if(sc&&!live.has(sc))continue;const p=E.out(clamp((t-+el.dataset.in)/0.6));const f=FROM[el.dataset.from||'u'];el.style.opacity=p;el.style.transform='translate('+((1-p)*f[0]).toFixed(2)+'px,'+((1-p)*f[1]).toFixed(2)+'px) scale('+(f[2]+(1-f[2])*p).toFixed(4)+')';}
  for(const{el,sc}of pops){if(sc&&!live.has(sc))continue;const x=clamp((t-+el.dataset.pop)/0.5);el.style.opacity=clamp(x*3);el.style.transform='scale('+(x<=0?0:E.back(x)).toFixed(4)+')';}
  for(const{el,keys,sc}of KS){if(sc&&!live.has(sc))continue;const p=at(keys,t);el.style.opacity=p.o;el.style.transform=tf(p);}
  for(const{el,sc}of draws){if(sc&&!live.has(sc))continue;const p=E.io(clamp((t-+el.dataset.draw)/(+el.dataset.dur||0.8)));el.style.strokeDashoffset=(1-p).toFixed(4);el.style.opacity=p>0?1:0;}
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
  if(hi!==lastCh){lastCh=hi;chap.innerHTML='<b>'+String(hi+1).padStart(2,'0')+' / '+CH.length+'</b>'+CH[hi].name;}
  bar.style.width=(clamp(t/END)*100)+'%';
};
window.seek(0);
`;

const html = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>Ashwagandha benefits: what it can and can't do</title><style>${css}</style></head><body>
<div id="sky"></div><div id="aur"></div><div id="aur2"></div><canvas id="dust" width="1920" height="1080"></canvas>
${defs}
${scenes.join('')}
<div id="vig"></div>
<div id="bar"><i></i></div>
<div id="logo"><span class="mark"><i></i><i></i><i></i><i></i></span>SharpAndLean</div>
<div id="chap"></div>
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
