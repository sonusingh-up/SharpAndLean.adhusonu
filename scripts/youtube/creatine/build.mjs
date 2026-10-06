/*
 * Writes .out/video.html and .out/timeline.json for the YouTube explainer
 * "Creatine benefits: what it does and how to take it" (1920×1080).
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
const jpg = (file) => `data:image/${file.endsWith('.png') ? 'png' : 'jpeg'};base64,${b64(join(here, 'assets', file))}`;
const sumita = jpg('sumita.jpg');
const credit = (t, cls = '') => `<div class="credit ${cls}" data-in="${t}"><img src="${sumita}" alt=""><span><small>Script checked by</small><b>Sumita Bhatti</b><small>Clinical Nutritionist</small></span></div>`;
// The one thing to do or remember from a scene, shown as a bar above the captions.
const take = (t, label, text) => `<div class="take" data-in="${S('chime', t, 0.5)}"><b>${label}</b><span>${text}</span></div>`;
const stepHead = (id, n, h2, optional = '') => `
  <div class="step" data-pop="${S('pop', st(id, 0.2), 0.7)}"><small>Step</small><b>${n}</b>${optional ? `<i>${optional}</i>` : ''}</div>
  <h2 class="h2" data-in="${st(id, 0.35)}">${h2}</h2>`;
const row = (t, kind, title, sub) => `<div class="li ${kind}" data-in="${t}" data-from="l"><b>${kind === 'ok' ? '✓' : kind === 'mid' ? '~' : '✕'}</b><span>${title}${sub ? `<small>${sub}</small>` : ''}</span></div>`;
const tub = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  <ellipse cx="0" cy="250" rx="190" ry="26" fill="#000" opacity=".35" filter="url(#blur8)"/>
  <rect x="-150" y="-150" width="300" height="400" rx="34" fill="#fbf9f5" filter="url(#shadow)"/><rect x="-150" y="-150" width="300" height="400" rx="34" fill="url(#gloss)"/>
  <rect x="-166" y="-210" width="332" height="84" rx="22" fill="#183b37"/><rect x="-166" y="-210" width="332" height="84" rx="22" fill="url(#gloss)"/>
  <rect x="-150" y="-40" width="300" height="170" fill="url(#teal)"/>
  <text x="0" y="30" text-anchor="middle" class="t40 b cream">CREATINE</text><text x="0" y="74" text-anchor="middle" class="t24 b cream">monohydrate</text>
  <text x="0" y="190" text-anchor="middle" class="t26 b muted">unflavoured</text></g>`;
const ring = (score, t, cx = 110, cy = 110, r = 86) => { const c = 2 * Math.PI * r; return `<svg class="ring" viewBox="0 0 220 220"><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(251,249,245,.14)" stroke-width="18"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${score >= 8 ? '#7cc47e' : '#d8b876'}" stroke-width="18" stroke-linecap="round" pathLength="1" data-draw="${t}" data-dur="1.1" data-to="${score / 10}" transform="rotate(-90 ${cx} ${cy})"/>
  <text x="${cx}" y="${cy + 18}" text-anchor="middle" class="t64 b cream"><tspan data-count="${score}" data-at="${t}" data-dur="1.1" data-dec="1">0.0</tspan></text><text x="${cx}" y="${cy + 52}" text-anchor="middle" class="t20 b dim">out of 10</text></svg>`; };
const product = (id, file, brand, name, score, facts, kicker) => scene(id, 'split', `
  <div class="shot" data-in="${st(id, 0.25)}" data-from="z"><div data-float="8,7,0"><img src="${jpg(file)}" alt=""></div></div>
  <div class="pinfo">
    <p class="kicker" data-in="${st(id, 0.15)}">${kicker}</p>
    <h2 class="h2 sm" data-in="${st(id, 0.3)}"><small>${brand}</small>${name}</h2>
    <div class="prow">
      <div data-in="${st(id, 0.6)}">${ring(score, S('chime', on(id, 'scored'), 0.7))}</div>
      <div class="facts">${facts.map(([f, p, kind]) => `<div class="fact ${kind || ''}" data-in="${S('tick', on(id, p), 0.7)}" data-from="l">${f}</div>`).join('')}</div>
    </div>
    <p class="fine2" data-in="${st(id, 1)}">UK prices seen on 28 September 2026. Confirm the price before you buy.</p>
  </div>`);

/* 1. Hook */
S('shimmer', st('hook', 0.4), 0.7);
const agenda = [['What it does', 'what it does'], ['Exactly how to take it', 'exactly how'], ['The myths', 'the myths'], ['Three powders we reviewed', 'the three powders']];
scenes.push(scene('hook', 'split', `
  <div class="txt wide">
    <p class="kicker" data-in="${st('hook', 0.2)}">Creatine benefits, and how to take it</p>
    <h1 class="title" data-in="${st('hook', 0.35)}">Creatine</h1>
    <p class="lead" data-in="${st('hook', 0.6)}">The <em>best-studied</em> sports supplement there is.</p>
    ${credit(on('hook', 'Here is what'))}
  </div>
  <div class="col">
    ${agenda.map(([a, p], i) => `<div class="li num" data-in="${S('tick', on('hook', p), 0.8)}" data-from="l"><b>${i + 1}</b><span>${a}</span></div>`).join('')}
  </div>`));

/* 2. The short answer */
A.dose = S('chime', on('answer', 'Three to five grams'), 0.9);
scenes.push(scene('answer', 'split', `
  <div class="txt">${head('answer', 'The short answer', 'A little more <em>strength, power and muscle.</em>')}
    <div class="stat" data-in="${A.dose}"><b>3–5 g</b><span>a day<small>plain creatine monohydrate</small></span></div>
  </div>
  <div class="col">
    ${row(S('tick', on('answer', 'alongside resistance'), 0.8), 'mid', 'Works alongside resistance training', 'Not on its own')}
    ${row(S('tick', on('answer', 'adds a little'), 0.8), 'ok', 'Strength, power and muscle', 'A little extra')}
    ${row(S('warn', on('answer', 'It does nothing'), 0.5), 'bad', 'Endurance', 'No benefit')}
  </div>`));

/* 3. How it works */
A.raise = S('whoosh', on('works', 'A supplement raises'), 0.6);
A.rep = S('chime', on('works', 'a rep or two'), 0.8);
scenes.push(scene('works', 'split', `
  <div class="txt">${head('works', 'How it works', 'Fuel for <em>short, all-out efforts.</em>')}
    <p class="note" data-in="${on('works', 'Your muscles store')}">Muscles store creatine to rebuild energy fast.</p>
  </div>
  <svg class="viz" viewBox="0 0 900 760">
    <g data-in="${st('works', 0.5)}">
      <text x="450" y="90" text-anchor="middle" class="t30 b dim">Creatine stored in muscle</text>
      <rect x="140" y="150" width="620" height="170" rx="40" fill="#12302c" stroke="#fbf9f5" stroke-width="6"/><rect x="770" y="200" width="30" height="70" rx="10" fill="#fbf9f5"/>
      <rect x="160" y="170" width="480" height="130" rx="26" fill="url(#teal)"/>
      <rect x="640" y="170" width="100" height="130" rx="26" fill="url(#gold)" filter="url(#glowS)" data-org="640px 235px" ${k([[A.raise, { sx: 0 }], [A.raise + 1, { sx: 1 }]])}/>
      <text x="400" y="252" text-anchor="middle" class="t40 b cream">Your normal store</text>
      <g data-pop="${r2(A.raise + 0.6)}" data-org="690px 400px"><text x="690" y="420" text-anchor="middle" class="t64 b ochre">+20%</text></g>
    </g>
    <g data-pop="${A.rep}" data-org="450px 600px"><rect x="210" y="520" width="480" height="150" rx="40" fill="#fbf9f5" filter="url(#shadow)"/><text x="450" y="590" text-anchor="middle" class="t44 b ink">+1 or 2 reps</text><text x="450" y="636" text-anchor="middle" class="t26 b muted">per hard set</text></g>
  </svg>`));

/* 4. What the trials found */
A.bench = on('results', 'one point four');
A.squat = on('results', 'five point six');
S('whoosh', A.bench, 0.5); S('chime', A.squat, 0.8);
scenes.push(scene('results', 'split', `
  <div class="txt">${head('results', 'What the trials found', 'Extra strength, <em>on top of training.</em>')}
    <div class="chips"><div class="chip" data-pop="${S('pop', on('results', 'sixty-nine'), 0.6)}"><b>69</b>trials</div><div class="chip" data-pop="${S('pop', on('results', 'nearly two thousand'), 0.6)}"><b>1,937</b>people</div></div>
  </div>
  <svg class="viz" viewBox="0 0 900 760"><g data-in="${st('results', 0.6)}">
    <path d="M110 620 H800" stroke="#fbf9f5" stroke-width="5" stroke-linecap="round"/>
    <rect x="200" y="140" width="200" height="478" rx="22" fill="url(#teal)" data-org="300px 618px" ${k([[A.bench, { sy: 0 }], [A.bench + 1, { sy: 0.25 }]])}/>
    <rect x="510" y="140" width="200" height="478" rx="22" fill="url(#gold)" filter="url(#glowS)" data-org="610px 618px" ${k([[A.squat, { sy: 0 }], [A.squat + 1.1, { sy: 1 }]])}/>
    <text x="300" y="470" text-anchor="middle" class="t64 b cream" data-in="${A.bench}">+<tspan data-count="1.4" data-at="${A.bench}" data-dur="1" data-dec="1">0.0</tspan> kg</text>
    <text x="610" y="110" text-anchor="middle" class="t64 b ochre" data-in="${A.squat}">+<tspan data-count="5.6" data-at="${A.squat}" data-dur="1.1" data-dec="1">0.0</tspan> kg</text>
    <text x="300" y="680" text-anchor="middle" class="t34 b cream">Bench press</text><text x="610" y="680" text-anchor="middle" class="t34 b cream">Squat</text>
  </g></svg>`));

/* 5. Keep it in proportion */
scenes.push(scene('caveat', 'stack', `
  ${head('caveat', 'Keep it in proportion', 'The gain comes through <em>the extra training.</em>')}
  <div class="cards2">
    <div class="hc ok" data-in="${S('tick', on('caveat', 'The gain comes'), 0.8)}" data-from="z"><b class="big">Creatine + training</b><span>A little more strength and muscle</span></div>
    <div class="hc bad" data-in="${S('warn', on('caveat', 'Without training'), 0.5)}" data-from="z"><b class="big">Creatine alone</b><span>Little to gain</span></div>
  </div>`));

/* 6. Step 1: the form */
S('swell', st('step1', 0.1), 0.8);
scenes.push(scene('step1', 'split', `
  <div class="txt">${stepHead('step1', 1, 'Buy plain <em>monohydrate powder.</em>')}</div>
  <div class="col">
    ${row(S('tick', on('step1', 'buy plain'), 0.8), 'ok', 'Creatine monohydrate', 'The form used in almost all the research')}
    ${row(S('tick', on('step1', 'micronised'), 0.8), 'ok', 'Micronised', 'The same thing, ground finer')}
    ${row(S('warn', on('step1', 'No other form'), 0.5), 'bad', 'Fancier forms', 'None has done better in trials')}
  </div>
  ${take(on('step1', 'and micronised'), 'Do this', 'Choose plain, unflavoured creatine monohydrate powder')}`));

/* 7. Step 2: the dose */
A.every = on('step2', 'every day');
scenes.push(scene('step2', 'split', `
  <div class="txt">${stepHead('step2', 2, 'Take <em>3 to 5 g</em> a day, every day.')}</div>
  <div class="col">
    <div class="week" data-in="${st('step2', 0.6)}">${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => `<div><i data-pop="${S('tick', A.every + i * 0.22, 0.5)}">✓</i><span>${d}</span></div>`).join('')}</div>
    ${row(S('pop', on('step2', 'Timing matters'), 0.6), 'mid', 'Any time of day', 'Timing matters much less than consistency')}
    ${row(S('pop', on('step2', 'whatever makes'), 0.6), 'ok', 'With water, juice, a shake or a meal', 'Whatever makes it a habit')}
  </div>
  ${take(on('step2', 'so take it'), 'Do this', '3 to 5 g a day, at the same point in your routine')}`));

/* 8. Step 3: loading */
A.load = S('whoosh', on('step3', 'Loading with'), 0.6);
A.three = S('whoosh', on('step3', 'Three grams a day'), 0.6);
scenes.push(scene('step3', 'split', `
  <div class="txt">${stepHead('step3', 3, 'Loading gets you there <em>sooner.</em>', 'optional')}
    <div class="rows" style="margin-top:34px">
      <div class="row3" data-in="${A.load}"><i style="background:#d8b876"></i><b>20 g a day</b><span>4 × 5 g, for 5–7 days</span></div>
      <div class="row3" data-in="${A.three}"><i style="background:#7cc47e"></i><b>3 g a day</b><span>about 4 weeks</span></div>
    </div>
  </div>
  <svg class="viz" viewBox="0 0 900 760"><g data-in="${st('step3', 0.6)}">
    <path d="M120 120 V600 H820" fill="none" stroke="#fbf9f5" stroke-width="5" stroke-linecap="round"/>
    <path d="M120 200 H820" stroke="#fbf9f5" stroke-width="3" stroke-dasharray="4 12" opacity=".5"/><text x="140" y="180" class="t24 b dim">Muscle fully topped up</text>
    ${[0, 7, 14, 21, 28].map((d) => `<text x="${120 + d * 25}" y="646" text-anchor="middle" class="t24 b dim">${d}</text>`).join('')}<text x="470" y="700" text-anchor="middle" class="t26 b dim">Days</text>
    <path d="M120 600 C170 420 220 220 270 200 H820" fill="none" stroke="#d8b876" stroke-width="12" stroke-linecap="round" pathLength="1" data-draw="${A.load}" data-dur="2.2" filter="url(#glowS)"/>
    <path d="M120 600 C320 500 560 300 820 200" fill="none" stroke="#7cc47e" stroke-width="12" stroke-linecap="round" pathLength="1" data-draw="${A.three}" data-dur="2.6"/>
    <g data-pop="${S('pop', on('step3', 'in about a week'), 0.7)}" data-org="270px 200px"><circle cx="270" cy="200" r="20" fill="#d8b876"/><text x="300" y="262" class="t28 b ochre">about a week</text></g>
    <g data-pop="${S('pop', on('step3', 'in about four weeks'), 0.7)}" data-org="820px 200px"><circle cx="820" cy="200" r="20" fill="#7cc47e"/><text x="840" y="150" text-anchor="end" class="t28 b" fill="#7cc47e">about 4 weeks</text></g>
  </g></svg>
  ${take(on('step3', 'gets to the same level'), 'Remember', 'Both routes end at the same level. Loading is only faster')}`));

/* 9. Step 4: what to expect */
A.kg = S('chime', on('step4', 'one to two kilograms'), 0.8);
scenes.push(scene('step4', 'split', `
  <div class="txt">${stepHead('step4', 4, 'Expect the scale to <em>go up a little.</em>')}
    <div class="stat" data-in="${A.kg}"><b>+1–2 kg</b><span>in week one<small>often, especially with loading</small></span></div>
  </div>
  <svg class="viz" viewBox="0 0 900 760"><g data-in="${st('step4', 0.5)}" data-from="z">
    <rect x="170" y="230" width="560" height="380" rx="60" fill="#fbf9f5" filter="url(#shadow)"/><rect x="170" y="230" width="560" height="380" rx="60" fill="url(#gloss)"/>
    <circle cx="450" cy="400" r="130" fill="#0e2421"/>
    ${Array.from({ length: 12 }, (_, i) => `<rect x="447" y="284" width="6" height="${i % 3 ? 12 : 22}" rx="3" fill="#d8b876" transform="rotate(${i * 30} 450 400)"/>`).join('')}
    <g data-org="450px 400px" ${k([[st('step4'), { r: -20 }], [A.kg, { r: -20, e: 'back' }], [A.kg + 1, { r: 26 }]])}><rect x="445" y="300" width="10" height="110" rx="5" fill="#e07a5f"/></g><circle cx="450" cy="400" r="14" fill="#fbf9f5"/>
    <g data-pop="${S('pop', on('step4', 'mostly water'), 0.7)}" data-org="700px 190px"><path d="M700 110 q52 68 52 104 a52 52 0 0 1 -104 0 q0 -36 52 -104 z" fill="#7fb4d6" filter="url(#glowS)"/><text x="700" y="232" text-anchor="middle" class="t20 b ink">water</text></g>
  </g></svg>
  ${take(on('step4', 'That is mostly'), 'Remember', 'Early weight gain is mostly water in muscle, not fat')}`));

/* 10. What to skip */
A.failed = on('skip', 'five failed');
A.none = S('warn', on('skip', 'three contained'), 0.6);
scenes.push(scene('skip', 'split', `
  <div class="txt">${head('skip', 'What to skip', 'Gummies <em>can fail.</em>')}
    <div class="gums" data-in="${on('skip', 'in one test')}">${Array.from({ length: 12 }, (_, i) => { const bad = i >= 7; const zero = i >= 9; return `<div class="gum">${bad ? `<i ${k([[A.failed + (i - 7) * 0.12, { o: 0 }], [A.failed + (i - 7) * 0.12 + 0.3, { o: 1 }]])}>${zero ? `<u ${k([[A.none, { o: 0 }], [A.none + 0.3, { o: 1 }]])}>0</u>` : ''}</i>` : ''}</div>`; }).join('')}</div>
    <p class="sub sm" data-in="${A.failed}"><b>5 of 12</b> gummy products failed testing. <b>3</b> contained no creatine.</p>
  </div>
  <div class="col">
    ${row(S('tick', on('skip', 'Gummies can fail'), 0.7), 'bad', 'Creatine gummies', 'Heat and moisture break creatine down')}
    ${row(S('tick', on('skip', 'Pre-workout blends'), 0.7), 'bad', 'Pre-workout blends', 'Often only 1 to 2 g, below the studied dose')}
  </div>
  ${take(on('skip', 'Pre-workout blends', 1.2), 'Do this', 'Stick to plain powder for a known dose')}`));

/* 11. Myth: hair loss */
A.myth = S('stamp', on('hair', 'found no change'), 1);
scenes.push(scene('hair', 'stack', `
  ${head('hair', 'Myth check', 'Does creatine cause <em>hair loss?</em>')}
  <div class="cards2">
    <div class="hc" data-in="${S('flip', on('hair', 'That traces'), 0.8)}" data-from="z"><small class="yr">2009</small><b class="big">One study, 20 rugby players</b><span>The hormone DHT rose after a week of loading.</span></div>
    <div class="hc ok" data-in="${S('flip', on('hair', 'A twenty twenty-five'), 0.8)}" data-from="z"><small class="yr">2025</small><b class="big">Randomised trial, 5 g a day, 12 weeks</b><span>No change in DHT, hair density or hair thickness.</span>
      <div class="stampd" data-pop="${A.myth}">NOT SHOWN TO CAUSE HAIR LOSS</div></div>
  </div>`));

/* 12. Kidneys */
A.tell = S('whoosh', on('kidney', 'But it can nudge', -0.2), 0.6);
scenes.push(scene('kidney', 'split', `
  <div class="txt">${head('kidney', 'Kidneys', 'Safe for <em>healthy kidneys.</em>')}
    <div class="lis">${row(S('tick', on('kidney', 'found no change'), 0.8), 'ok', 'No change in kidney markers', 'In a review of studies in healthy people')}</div>
  </div>
  <svg class="viz" viewBox="0 0 900 760">
    <g data-in="${st('kidney', 0.4)}" data-from="z"><g data-float="8,7,0" transform="translate(-170 40) scale(.8)">
      <path d="M470 120 q190 0 210 190 q14 150 -110 250 q-110 84 -200 20 q-70 -54 -20 -130 q40 -60 30 -110 q-12 -60 -40 -110 q-30 -110 130 -110 z" fill="#b9603f" filter="url(#shadow)"/>
      <path d="M470 120 q190 0 210 190 q14 150 -110 250 q-110 84 -200 20 q-70 -54 -20 -130 q40 -60 30 -110 q-12 -60 -40 -110 q-30 -110 130 -110 z" fill="url(#gloss)"/></g></g>
    <g ${k([[A.tell, { x: 380, o: 0 }], [A.tell + 0.7, { x: 0, o: 1 }]])}>
      <rect x="470" y="200" width="380" height="400" rx="26" fill="#fbf9f5" filter="url(#shadow)"/>
      <text x="502" y="262" class="t28 b ink">Blood test</text><rect x="502" y="284" width="316" height="4" fill="#1c2a28"/>
      <text x="502" y="340" class="t24 muted">Creatinine</text>
      <rect x="502" y="362" width="316" height="18" rx="9" fill="#e8e1d5"/><rect x="600" y="362" width="120" height="18" rx="9" fill="#7cc47e"/>
      <g ${k([[A.tell + 0.8, { x: 0, e: 'io' }], [A.tell + 2, { x: 70 }]])}><circle cx="660" cy="371" r="14" fill="#183b37"/></g>
      <text x="502" y="430" class="t24 muted">Can read slightly high</text><text x="502" y="464" class="t24 muted">without kidney damage</text>
      <rect x="502" y="500" width="316" height="64" rx="32" fill="#183b37"/><text x="660" y="542" text-anchor="middle" class="t24 b cream">Tell your doctor first</text>
    </g>
  </svg>
  ${take(on('kidney', 'so tell your doctor'), 'Do this', 'Mention creatine before any kidney blood test')}`));

/* 13. Who should ask first */
const askFirst = [['Kidney disease', 'kidney disease'], ['Diabetes that affects your kidneys', 'diabetes that'], ['Medicines that strain the kidneys', 'medicines that strain'], ['Pregnancy and breastfeeding', 'pregnancy']];
scenes.push(scene('ask', 'split tight', `
  <div class="txt">${head('ask', 'Who should ask first', 'Check with a <em>doctor</em> if any apply.')}</div>
  <div class="col">${askFirst.map(([a, p]) => `<div class="li mid" data-in="${S('pop', on('ask', p), 0.6)}" data-from="l"><b>!</b><span>${a}</span></div>`).join('')}</div>`));

/* 14. Brain and mood */
A.unproven = S('tick', on('brain', 'promising but unproven'), 0.8);
scenes.push(scene('brain', 'split', `
  <div class="txt">${head('brain', 'Brain and mood', 'Promising, <em>but unproven.</em>')}
    <p class="tag" data-pop="${S('pop', on('brain', 'The European'), 0.6)}">EFSA, 2024: effect not established at 3 g a day</p>
  </div>
  <svg class="viz" viewBox="0 0 900 760"><g data-in="${st('brain', 0.4)}" data-from="z">
    <path d="M110 560 A340 340 0 0 1 280 265.6" fill="none" stroke="#3d5a55" stroke-width="64" stroke-linecap="round"/>
    <path d="M306 251 A340 340 0 0 1 594 251" fill="none" stroke="#d8b876" stroke-width="64" filter="url(#glowS)"/>
    <path d="M620 265.6 A340 340 0 0 1 790 560" fill="none" stroke="#3d5a55" stroke-width="64" stroke-linecap="round"/>
    <text x="120" y="660" text-anchor="middle" class="t30 dim b">No evidence</text><text x="450" y="150" text-anchor="middle" class="t34 b cream">Promising</text><text x="780" y="660" text-anchor="middle" class="t30 dim b">Proven</text>
    <g data-org="450px 560px" ${k([[st('brain'), { r: -70, e: 'io' }], [A.unproven, { r: 30, e: 'io' }], [A.unproven + 0.8, { r: -6, e: 'back' }], [A.unproven + 1.4, { r: 0 }]])}><path d="M438 560 L450 250 L462 560 z" fill="#fbf9f5" filter="url(#shadow)"/></g>
    <circle cx="450" cy="560" r="34" fill="url(#gold)"/>
  </g></svg>`));

/* 15. Which one to buy */
S('swell', st('picks', 0.1), 0.8);
const three = [['myp.jpg', 'Myprotein', 'Impact Creatine'], ['bulk.jpg', 'Bulk', 'Creatine Monohydrate'], ['on.jpg', 'Optimum Nutrition', 'Micronised Creatine']];
scenes.push(scene('picks', 'stack', `
  ${head('picks', 'Which one to buy', 'Same compound. <em>Different price.</em>')}
  <div class="cards3">${three.map(([f, b, n], i) => `<div class="pc" data-in="${S('pop', on('picks', 'three plain') + i * 0.3, 0.7)}" data-from="z"><figure><img src="${jpg(f)}" alt=""></figure><small>${b}</small><b>${n}</b></div>`).join('')}</div>`));

/* 16–18. The three reviews */
scenes.push(product('myp', 'myp.jpg', 'Myprotein', 'Impact Creatine', 8.6, [['3 g creatine per serving', 'Three grams'], ['About £3.20 per 100 g, on offer', 'about three pounds twenty']], 'Our top score'));
scenes.push(product('bulk', 'bulk.jpg', 'Bulk', 'Creatine Monohydrate', 8.2, [['About £2.60 per 100 g', 'about two pounds sixty'], ['The cheapest we saw', 'the cheapest']], 'Best price'));
scenes.push(product('on', 'on.jpg', 'Optimum Nutrition', 'Micronised Creatine', 7.4, [['Same dose, same compound', 'Same dose'], ['£6.31–£7.49 per 100 g at list price', 'about twice the price', 'bad']], 'Good product, higher price'));

/* 19. The value rule */
A.rule = on('rule', 'divide the price');
A.good = S('chime', on('rule', 'Around three pounds'), 0.8);
const bars = [['Bulk', 2.6, '£2.60', '#7cc47e'], ['Myprotein', 3.2, '£3.20', '#d8b876'], ['Optimum Nutrition', 6.31, 'from £6.31', '#e07a5f']];
scenes.push(scene('rule', 'stack', `
  ${head('rule', 'The value rule', 'Price ÷ pack weight = <em>cost per 100 g.</em>')}
  <div class="vbars" data-in="${A.rule}">
    ${bars.map(([n, v, label, c], i) => `<div class="vb"><b>${n}</b><div class="vt"><u style="background:${c}" ${k([[A.rule + 0.2 + i * 0.2, { sx: 0 }], [A.rule + 1.2 + i * 0.2, { sx: v / 7.5 }]])}></u></div><strong>${label}</strong></div>`).join('')}
    <i class="vline" data-in="${A.good}"><span>about £3: good value</span></i>
  </div>
  ${take(A.good, 'Do this', 'Aim for about £3 per 100 g or less')}`));

/* 20. Verdict */
const verdicts = [['Plain creatine monohydrate powder', 'Plain monohydrate'], ['3 to 5 g a day, every day', 'three to five grams'], ['Alongside resistance training', 'with training'], ['Expect modest gains, and a little water weight', 'Expect modest']];
A.src = S('swell', on('verdict', 'Full reviews'), 0.8);
scenes.push(scene('verdict', 'split tight', `
  <div class="txt wide">
    ${head('verdict', 'The verdict', 'Simple, cheap, <em>and it works.</em>')}
    <div class="checks">${verdicts.map(([v, p]) => { const t = S('tick', on('verdict', p), 0.9); return `<div class="ck" data-in="${t}" data-from="l"><svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="28" fill="#183b37" stroke="#7cc47e" stroke-width="3"/>${tick(28, 30, 0.9, r2(t + 0.15))}</svg>${v}</div>`; }).join('')}</div>
  </div>
  <div class="end" data-in="${A.src}" data-from="z">
    <div class="lockup"><span class="mark"><i></i><i></i><i></i><i></i></span>SharpAndLean</div>
    <p class="url">sharpandlean.com</p>
    <p class="srcs">Full reviews of all three</p>
    <div>${credit(r2(A.src + 0.3), 'centre')}</div>
    <p class="fine">General information, not medical advice. Speak to a doctor first if you have kidney disease or are pregnant or breastfeeding.</p>
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
#rail{position:absolute;right:96px;top:50px;z-index:7;display:flex;gap:10px}
#rail span{display:flex;align-items:center;gap:10px;padding:8px 18px 8px 8px;border-radius:999px;font-size:22px;font-weight:700;color:#8fa59f;background:rgba(251,249,245,.05);border:1.5px solid rgba(251,249,245,.1)}
#rail b{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:rgba(251,249,245,.12);font-size:18px}
#rail span.done{color:#b9c9c4}#rail span.done b{background:#2f7c72;color:#fff}
#rail span.on{color:#1c2a28;background:#d8b876;border-color:#d8b876}#rail span.on b{background:#1c2a28;color:#d8b876}
.cam{padding-bottom:250px}
.take{position:absolute;left:96px;right:96px;bottom:150px;display:flex;align-items:center;gap:22px;padding:14px 30px 14px 14px;border-radius:22px;background:#fbf9f5;color:#1c2a28;font-size:36px;font-weight:700;letter-spacing:-.015em;box-shadow:0 20px 50px rgba(0,0,0,.4)}
.take b{flex:none;padding:10px 22px;border-radius:14px;background:#183b37;color:#d8b876;font-size:24px;letter-spacing:.12em;text-transform:uppercase}
.step{display:inline-flex;align-items:center;gap:16px;padding:10px 28px 10px 12px;border-radius:999px;background:#d8b876;color:#1c2a28;transform-origin:left center}
.step small{font-size:26px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;margin-left:14px}
.step b{width:70px;height:70px;border-radius:50%;background:#1c2a28;color:#d8b876;display:grid;place-items:center;font-size:44px}
.step i{font-style:normal;font-size:24px;font-weight:700;opacity:.7}
.step+.h2{margin-top:26px}
.li.num b{background:#d8b876;color:#1c2a28}
.mini{width:100%;height:230px;overflow:visible}
.cards2{margin-top:50px;display:grid;grid-template-columns:1fr 1fr;gap:30px}
.hc{position:relative}
.hc.ok{border-color:rgba(124,196,126,.7)}.hc.bad{border-color:rgba(224,122,95,.65)}
.hc .big{font-size:56px;line-height:1.08}
.hc.bad .big{color:#f3b596}.hc.ok .big{color:#a9e0ab}
.yr{display:block;font-size:30px;font-weight:700;letter-spacing:.14em;color:#b9c9c4;margin-bottom:10px}
.stampd{display:inline-block;margin-top:26px;padding:12px 22px;border:5px solid #7cc47e;border-radius:14px;color:#7cc47e;font-size:28px;font-weight:700;letter-spacing:.04em;transform-origin:left center}
.week{display:grid;grid-template-columns:repeat(7,1fr);gap:12px;margin-bottom:10px}
.week div{display:grid;justify-items:center;gap:10px;padding:18px 0;border-radius:22px;background:rgba(251,249,245,.07);border:1.5px solid rgba(251,249,245,.14);font-size:24px;font-weight:700;color:#b9c9c4}
.week i{font-style:normal;width:62px;height:62px;border-radius:50%;background:#2f7c72;color:#fff;display:grid;place-items:center;font-size:34px}
.gums{margin-top:36px;display:grid;grid-template-columns:repeat(6,84px);gap:14px}
.gum{position:relative;height:66px;border-radius:22px;background:linear-gradient(160deg,#f3b596,#e07a5f)}
.gum i{position:absolute;inset:0;border-radius:22px;background:#3d4c48;display:grid;place-items:center;font-style:normal}
.gum u{text-decoration:none;font-size:34px;font-weight:700;color:#f3b596}
.sub.sm{font-size:34px;margin-top:22px}.sub.sm b{color:#d8b876}
.shot{flex:0 0 620px;height:620px;border-radius:56px;background:#fff;display:grid;place-items:center;overflow:hidden;box-shadow:0 40px 90px rgba(0,0,0,.5)}
.shot img{max-width:540px;max-height:540px;object-fit:contain}
.pinfo{flex:1}
.h2.sm{font-size:76px}.h2 small{display:block;font-size:30px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#b9c9c4;margin-bottom:8px}
.prow{margin-top:34px;display:flex;align-items:center;gap:36px}
.ring{width:220px;height:220px;flex:none}
.facts{display:grid;gap:14px;flex:1}
.fact{padding:20px 28px;border-radius:24px;font-size:38px;font-weight:700;letter-spacing:-.02em;background:rgba(251,249,245,.08);border:1.5px solid rgba(124,196,126,.6)}
.fact.bad{border-color:rgba(224,122,95,.7);color:#f3b596}
.fine2{margin-top:24px;font-size:24px;color:#9fb3ad}
.pc{border-radius:44px;padding:26px 30px 34px;background:linear-gradient(160deg,rgba(255,255,255,.1),rgba(255,255,255,.035));border:1.5px solid rgba(251,249,245,.16)}
.pc figure{height:300px;border-radius:30px;background:#fff;display:grid;place-items:center;overflow:hidden}
.pc img{max-width:260px;max-height:260px;object-fit:contain}
.pc small{display:block;margin-top:22px;font-size:24px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#b9c9c4}
.pc b{display:block;margin-top:6px;font-size:44px;letter-spacing:-.025em}
.vbars{position:relative;margin-top:50px;display:grid;gap:22px}
.vb{display:grid;grid-template-columns:360px 1fr 240px;align-items:center;gap:26px;font-size:40px}
.vt{height:56px;border-radius:28px;background:rgba(251,249,245,.1);overflow:hidden}
.vt u{display:block;height:100%;border-radius:28px;transform-origin:0 50%}
.vb strong{font-size:44px;color:#d8b876;text-align:right}
.vline{position:absolute;top:-16px;bottom:-16px;left:calc(386px + (100% - 652px) * 0.4);width:5px;border-radius:3px;background:#fbf9f5}
.vline span{position:absolute;bottom:-46px;left:-150px;width:300px;text-align:center;font-style:normal;font-size:26px;font-weight:700}
.credit.centre{margin-top:24px}
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
    const z=1+0.035*p+(1-E.out(fin))*0.07-E.io(fout)*0.05;
    s.cam.style.transform='translate('+(Math.sin(t*0.21)*8).toFixed(2)+'px,'+(Math.cos(t*0.17)*6).toFixed(2)+'px) scale('+z.toFixed(4)+')';
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

const html = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>Creatine benefits: what it does and how to take it</title><style>${css}</style></head><body>
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
