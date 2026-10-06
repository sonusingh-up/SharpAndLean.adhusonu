/*
 * Writes .out/video.html and .out/timeline.json for the YouTube explainer
 * "5 signs of B12 deficiency, and who really needs a supplement" (1920×1080).
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
const jpg = (file) => `data:image/jpeg;base64,${b64(join(here, 'assets', file))}`;
const sumita = jpg('sumita.jpg');
const credit = (t, cls = '') => `<div class="credit ${cls}" data-in="${t}"><img src="${sumita}" alt=""><span><small>Script checked by</small><b>Sumita Bhatti</b><small>Clinical Nutritionist</small></span></div>`;
const take = (t, label, text) => `<div class="take" data-in="${S('chime', t, 0.45)}"><b>${label}</b><span>${text}</span></div>`;
// A full-frame photograph that drifts slowly (kb = start x, y, scale → end x, y, scale), under a scrim for the text.
const cine = (id, img, kb, inner, cls = '') =>
  `<section class="scene cine ${cls}" data-s="${T[id].s}" data-e="${T[id].e}"><div class="bg" data-kb="${kb}" style="background-image:url(${jpg(img + '.jpg')})"></div><div class="scrim"></div><div class="cam">${inner}</div></section>`;
const meter = (t, level, label) => `<div class="meter" data-in="${t}"><small>How strongly it points to B12</small><div class="segs">${[1, 2, 3, 4].map((i) => `<i class="${i <= level ? 'on' : ''}" ${i <= level ? k([[t + 0.2 + i * 0.16, { sx: 0 }], [t + 0.6 + i * 0.16, { sx: 1 }]]) : ''}></i>`).join('')}</div><b>${label}</b></div>`;
const sign = (id, n, img, kb, title, sub, extra, level, label, levelAt) => {
  S('riser', st(id, -0.9), 0.5); S('boom', st(id, 0.25), 0.9);
  return cine(id, img, kb, `
  <div class="num" ${k([[st(id, 0.1), { o: 0, s: 1.5, x: -40 }], [st(id, 0.9), { o: 1, s: 1, x: 0 }]])}>${n}</div>
  <div class="stxt">
    <p class="kicker" data-in="${st(id, 0.35)}">Sign ${n} of 5</p>
    <h2 class="h2 serif" data-wipe="${st(id, 0.5)}">${title}</h2>
    <i class="rule" ${k([[st(id, 0.9), { sx: 0 }], [st(id, 1.7), { sx: 1 }]])}></i>
    ${sub}
    ${extra}
    ${meter(levelAt, level, label)}
  </div>`, 'sign');
};

/* 1. Hook */
S('boom', st('hook', 0.2), 1); S('shimmer', on('hook', 'It might be'), 0.7);
scenes.push(cine('hook', 'hero', '2,0,1.08,-2,-1,1.2', `
  <div class="stxt wide">
    <p class="kicker" data-in="${st('hook', 0.4)}">Vitamin B12 deficiency</p>
    <h1 class="mega" data-wipe="${st('hook', 0.6)}"><b>5</b> signs</h1>
    <p class="megasub" data-wipe="${on('hook', 'five signs')}"><em>to take seriously</em></p>
    <i class="rule" ${k([[on('hook', 'the test'), { sx: 0 }], [on('hook', 'the test', 0.8), { sx: 1 }]])}></i>
    <p class="lead" data-in="${on('hook', 'who really needs')}">…and who really needs a supplement.</p>
    ${credit(on('hook', 'who really needs', 0.6))}
  </div>
  <div class="tags">
    <span data-pop="${S('pop', on('hook', 'Tired all the time'), 0.5)}">Tired all the time?</span>
    <span data-pop="${S('pop', on('hook', 'Pins and needles'), 0.5)}">Pins and needles?</span>
  </div>`));

/* 2. Why it is easy to miss */
A.store = on('why', 'two to five years');
A.perm = S('boom', on('why', 'left untreated'), 0.7);
S('heart', A.store, 0.8);
scenes.push(cine('why', 'nerves', '-2,0,1.1,2,1,1.22', `
  <div class="stxt">
    <p class="kicker" data-in="${st('why', 0.3)}">Why it hides</p>
    <h2 class="h2 serif" data-wipe="${st('why', 0.45)}">Easy to miss.</h2>
    <i class="rule" ${k([[st('why', 0.9), { sx: 0 }], [st('why', 1.7), { sx: 1 }]])}></i>
    <div class="stat" data-in="${A.store}"><b>2–5 years</b><span>of B12<small>stored in your liver</small></span></div>
    <p class="warnline" data-in="${A.perm}">Left untreated, nerve damage can become <em>permanent.</em></p>
  </div>
  <svg class="viz" viewBox="40 160 820 400"><g data-in="${on('why', 'Your liver stores')}">
    <text x="60" y="210" class="t28 b dim">Your B12 reserve</text>
    <rect x="60" y="240" width="780" height="70" rx="35" fill="rgba(251,249,245,.12)" stroke="rgba(251,249,245,.3)" stroke-width="2"/>
    <rect x="60" y="240" width="780" height="70" rx="35" fill="url(#gold)" filter="url(#glowS)" data-org="60px 275px" ${k([[A.store, { sx: 1, e: 'io' }], [A.perm, { sx: 0.06 }]])}/>
    ${[0, 1, 2, 3, 4, 5].map((y) => `<path d="M${60 + y * 156} 330 v18" stroke="#fbf9f5" stroke-width="3" opacity=".6"/><text x="${60 + y * 156}" y="384" text-anchor="middle" class="t24 b dim">${y === 0 ? 'now' : y + ' yr'}</text>`).join('')}
    <g data-in="${on('why', 'creep in slowly')}"><text x="60" y="470" class="t34 b cream">Symptoms creep in slowly</text><text x="60" y="514" class="t26 dim b">and are easy to blame on stress, age or a busy life</text></g>
  </g></svg>`));

/* 3–7. The five signs */
A.cells = on('s1', 'fewer red blood cells');
scenes.push(sign('s1', 1, 'tired', '3,0,1.1,-1,0,1.2', 'Tiredness, weakness and breathlessness', `<p class="note" data-in="${on('s1', 'that rest does not fix')}">…that rest does not fix.</p>`, `
  <svg class="mini" viewBox="0 0 760 150" data-in="${A.cells}">
    ${Array.from({ length: 9 }, (_, i) => `<g ${i % 2 ? k([[A.cells + 0.4 + i * 0.1, { o: 1, s: 1 }], [A.cells + 1.1 + i * 0.1, { o: 0.16, s: 0.8 }]]) : ''}><g data-float="6,${4 + (i % 3)},${i}"><ellipse cx="${46 + i * 82}" cy="62" rx="34" ry="28" fill="#c7392f"/><ellipse cx="${46 + i * 82}" cy="62" rx="15" ry="11" fill="#8f211b"/></g></g>`).join('')}
    <text x="6" y="140" class="t24 b dim">Fewer red blood cells, so less oxygen reaches muscles and brain</text>
  </svg>`, 1, 'Low on its own', on('s1', 'On its own')));
A.nerve = on('s2', 'because nerve damage');
scenes.push(sign('s2', 2, 'hands', '-3,0,1.1,1,-1,1.22', 'Pins and needles, or numbness', `<p class="note" data-in="${on('s2', 'in your hands')}">…in your hands and feet.</p>`, `
  <div class="urgent" data-pop="${S('stamp', on('s2', 'get you to a doctor'), 0.9)}">See a doctor soonest</div>
  <svg class="mini" viewBox="0 0 760 110" data-in="${A.nerve}">
    <path d="M10 50 C120 0 200 100 310 50 S500 0 610 50 S720 80 750 50" fill="none" stroke="#7fd3c4" stroke-width="6" stroke-linecap="round" pathLength="1" data-draw="${A.nerve}" data-dur="1.4" filter="url(#glowS)"/>
    ${[120, 300, 470, 640].map((x, i) => `<circle cx="${x}" cy="${[26, 52, 26, 56][i]}" r="10" fill="#f3b596" filter="url(#glowS)" ${k([[A.nerve + 1 + i * 0.25, { s: 0, o: 0 }], [A.nerve + 1.2 + i * 0.25, { s: 1.8, o: 1 }], [A.nerve + 1.7 + i * 0.25, { s: 0.6, o: 0.3 }], [A.nerve + 2.2 + i * 0.25, { s: 1.6, o: 1 }], [A.nerve + 2.8 + i * 0.25, { s: 1, o: 0.8 }]])}/>`).join('')}
    <text x="6" y="104" class="t24 b dim">Nerve damage can start before any anaemia shows up</text>
  </svg>`, 2, 'Moderate', A.nerve + 1.6));
A.unst = on('s3', 'Feeling unsteady');
scenes.push(sign('s3', 3, 'feet', '2,-1,1.12,-2,1,1.22', 'Problems with balance and coordination', `<p class="note" data-in="${A.unst}">Unsteady, especially in the dark. Stumbling.</p>`, `
  <div class="urgent" data-pop="${S('stamp', on('s3', 'These need prompt'), 0.9)}">Needs prompt medical assessment</div>
  <svg class="mini" viewBox="0 0 760 120" data-in="${A.unst}">
    <path d="M10 90 H750" stroke="rgba(251,249,245,.35)" stroke-width="3" stroke-dasharray="4 12" stroke-linecap="round"/>
    <g data-org="380px 90px" ${k([[A.unst, { r: 0, e: 'io' }], [A.unst + 0.8, { r: -9, e: 'io' }], [A.unst + 1.6, { r: 7, e: 'io' }], [A.unst + 2.4, { r: -6, e: 'io' }], [A.unst + 3.2, { r: 5, e: 'io' }], [A.unst + 4, { r: -3, e: 'io' }], [A.unst + 5, { r: 0 }]])}><path d="M40 90 H720" stroke="#d8b876" stroke-width="10" stroke-linecap="round"/><circle cx="380" cy="60" r="22" fill="#fbf9f5"/></g>
  </svg>`, 3, 'Moderate to high, if you are at risk', on('s3', 'These need prompt')) + '');
A.repl = on('s4', 'replaced quickly');
scenes.push(sign('s4', 4, 'mirror', '4,0,1.14,1,0,1.24', 'A sore, red tongue and mouth ulcers', '', `
  <svg class="mini" viewBox="0 0 760 140" data-in="${A.repl}">
    ${Array.from({ length: 10 }, (_, i) => `<g ${k([[A.repl + i * 0.18, { s: 1, o: 1 }], [A.repl + 0.5 + i * 0.18, { s: 0.5, o: 0.25 }], [A.repl + 1.2 + i * 0.18, { s: 1, o: i % 3 === 0 ? 0.25 : 1 }]])}><circle cx="${40 + i * 74}" cy="56" r="28" fill="${i % 3 === 0 ? '#c7392f' : '#f3b596'}"/></g>`).join('')}
    <text x="6" y="132" class="t24 b dim">Mouth cells renew fast, so they are among the first to suffer</text>
  </svg>`, 3, 'Fairly distinctive', on('s4', 'among the first')));
A.improve = S('sparkle', on('s5', 'they can improve'), 0.9);
const dots = [[60, 40], [170, 90], [280, 30], [390, 96], [500, 44], [610, 92], [700, 36]];
scenes.push(sign('s5', 5, 'memory', '-2,0,1.1,2,0,1.2', 'Memory problems, low mood or confusion', `<p class="note" data-in="${on('s5', 'often put down to age')}">Often put down to age.</p>`, `
  <svg class="mini" viewBox="0 0 760 150" data-in="${st('s5', 1.2)}">
    <g ${k([[st('s5', 1.4), { o: 1 }], [on('s5', 'often put down to age'), { o: 0.18, e: 'io' }], [A.improve, { o: 0.18 }], [A.improve + 1.2, { o: 1 }]])}>
      <path d="${dots.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ')}" fill="none" stroke="#7fd3c4" stroke-width="4" filter="url(#glowS)"/>
      ${dots.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13" fill="#d8b876"/>`).join('')}
    </g>
    <text x="6" y="142" class="t24 b dim" data-in="${A.improve}">When deficiency is the cause, these can improve with treatment</text>
  </svg>`, 1, 'Low on its own, but worth ruling out', A.improve + 0.8));

/* 8. The blood test */
A.only = S('boom', on('test', 'A blood test'), 0.7);
const bands = [['Deficiency likely', 'below 180', '#e07a5f'], ['Indeterminate', '180–350', '#d8b876'], ['Deficiency unlikely', 'above 350', '#7cc47e']];
scenes.push(cine('test', 'blood', '-3,0,1.1,0,0,1.2', `
  <div class="stxt">
    <p class="kicker" data-in="${st('test', 0.3)}">None of these is proof</p>
    <h2 class="h2 serif" data-wipe="${A.only}">A blood test is the only way to know.</h2>
    <i class="rule" ${k([[A.only + 0.4, { sx: 0 }], [A.only + 1.2, { sx: 1 }]])}></i>
    <div class="bands" data-in="${r2(A.only + 1)}">${bands.map(([a, b, c], i) => `<div style="border-color:${c}" data-in="${r2(A.only + 1.2 + i * 0.3)}"><b style="color:${c}">${b}</b><span>${a}</span></div>`).join('')}</div>
    <p class="fine2" data-in="${r2(A.only + 2.2)}">Total B12 in ng/L, as NICE's 2024 guideline reads the first test. Laboratories may use their own cut-offs.</p>
  </div>
  ${take(on('test', 'tell your doctor'), 'Do this', 'Tell your doctor about any supplement you already take')}`));

/* 9. Vegans */
S('riser', st('vegan', -0.9), 0.5); S('boom', on('vegan', 'Vegans, without'), 0.8);
scenes.push(cine('vegan', 'vegan', '2,0,1.1,-2,0,1.2', `
  <div class="stxt">
    <p class="kicker" data-in="${st('vegan', 0.3)}">Who really needs a supplement</p>
    <h2 class="h2 serif" data-wipe="${on('vegan', 'Vegans, without')}">Vegans. <em>Without exception.</em></h2>
    <i class="rule" ${k([[on('vegan', 'At least ten', -0.4), { sx: 0 }], [on('vegan', 'At least ten', 0.4), { sx: 1 }]])}></i>
    <div class="duo">
      <div class="stat" data-in="${S('chime', on('vegan', 'At least ten'), 0.7)}"><b>10 mcg</b><span>a day<small>at least</small></span></div>
      <em class="or" data-in="${on('vegan', 'or two thousand')}">or</em>
      <div class="stat" data-in="${S('chime', on('vegan', 'or two thousand'), 0.7)}"><b>2,000 mcg</b><span>once a week<small>at least</small></span></div>
    </div>
    <p class="fine2" data-in="${on('vegan', 'or two thousand', 0.8)}">Plant foods contain no natural B12.</p>
  </div>`));

/* 10. Over 50 */
A.acid = on('over50', 'less stomach acid');
scenes.push(cine('over50', 'older', '-2,0,1.1,2,-1,1.2', `
  <div class="stxt">
    <p class="kicker" data-in="${st('over50', 0.3)}">Who really needs a supplement</p>
    <h2 class="h2 serif" data-wipe="${st('over50', 0.45)}">Most people <em>over 50.</em></h2>
    <i class="rule" ${k([[st('over50', 0.9), { sx: 0 }], [st('over50', 1.7), { sx: 1 }]])}></i>
    <svg class="mini" viewBox="0 0 760 170" data-in="${A.acid}">
      <text x="6" y="34" class="t26 b dim">Stomach acid, which frees B12 from food</text>
      <rect x="6" y="56" width="700" height="46" rx="23" fill="rgba(251,249,245,.12)"/>
      <rect x="6" y="56" width="700" height="46" rx="23" fill="url(#gold)" data-org="6px 79px" ${k([[A.acid, { sx: 0.95, e: 'io' }], [A.acid + 2.4, { sx: 0.4 }]])}/>
      <text x="6" y="146" class="t24 b dim">Falls with age</text>
    </svg>
  </div>
  ${take(on('over50', 'lean on fortified'), 'Do this', 'Lean on fortified foods or a small supplement')}`));

/* 11. Medicines */
scenes.push(cine('meds', 'tablets', '0,2,1.12,0,-2,1.22', `
  <div class="stxt">
    <p class="kicker" data-in="${st('meds', 0.3)}">Who should ask for a check</p>
    <h2 class="h2 serif" data-wipe="${st('meds', 0.45)}">Two common <em>medicines.</em></h2>
    <i class="rule" ${k([[st('meds', 0.9), { sx: 0 }], [st('meds', 1.7), { sx: 1 }]])}></i>
    <div class="pair">
      <div data-in="${S('pop', on('meds', 'metformin'), 0.6)}"><b>Metformin</b><span>Lowers B12 absorption</span></div>
      <div data-in="${S('pop', on('meds', 'acid-reducing'), 0.6)}"><b>Long-term acid reducers</b><span>Such as omeprazole</span></div>
    </div>
  </div>
  ${take(on('meds', 'ask their doctor'), 'Do this', 'Ask your doctor whether your B12 has been checked')}`));

/* 12. Pernicious anaemia */
S('boom', on('pa', 'One warning'), 0.8);
scenes.push(cine('pa', 'clinic', '-3,0,1.1,0,0,1.2', `
  <div class="stxt">
    <p class="kicker terra" data-in="${st('pa', 0.3)}">One warning</p>
    <h2 class="h2 serif" data-wipe="${on('pa', 'Pernicious anaemia')}">Pernicious anaemia.</h2>
    <i class="rule" ${k([[on('pa', 'the most common'), { sx: 0 }], [on('pa', 'the most common', 0.8), { sx: 1 }]])}></i>
    <p class="note" data-in="${on('pa', 'the most common')}">The most common cause of deficiency in the UK.</p>
    <div class="pair">
      <div class="no" data-in="${S('warn', on('pa', 'is not fixed'), 0.5)}"><b>✕ Shop-bought supplement</b><span>Does not fix it</span></div>
      <div class="yes" data-in="${S('chime', on('pa', 'usually injections'), 0.6)}"><b>✓ Medical treatment</b><span>Usually injections</span></div>
    </div>
  </div>`));

/* 13. Who does not need one */
A.enough = S('chime', on('noneed', 'almost certainly'), 0.8);
A.energy = S('boom', on('noneed', 'And no'), 0.6);
scenes.push(cine('noneed', 'foods', '2,0,1.1,-2,0,1.2', `
  <div class="stxt">
    <p class="kicker" data-in="${st('noneed', 0.3)}">Who does not need one</p>
    <h2 class="h2 serif" data-wipe="${A.enough}">You almost certainly <em>get enough</em> if…</h2>
    <div class="checks">${[['You are under 50', 'under fifty'], ['You eat meat, fish, eggs or dairy', 'eat meat'], ['You take neither medicine', 'take neither']].map(([v, p]) => { const t = S('tick', on('noneed', p), 0.9); return `<div class="ck" data-in="${t}" data-from="l"><svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="28" fill="#183b37" stroke="#7cc47e" stroke-width="3"/>${tick(28, 30, 0.9, r2(t + 0.15))}</svg>${v}</div>`; }).join('')}</div>
    <p class="warnline" data-in="${A.energy}">More energy from B12? <em>Only if you were deficient.</em></p>
  </div>`));

/* 14. Which kind */
scenes.push(cine('form', 'hero', '-2,1,1.14,2,-1,1.26', `
  <div class="stxt">
    <p class="kicker" data-in="${st('form', 0.3)}">Which kind</p>
    <h2 class="h2 serif" data-wipe="${on('form', 'Cyanocobalamin')}">Cyanocobalamin.</h2>
    <i class="rule" ${k([[on('form', 'usually the cheapest', -0.4), { sx: 0 }], [on('form', 'usually the cheapest', 0.4), { sx: 1 }]])}></i>
    <p class="note" data-in="${on('form', 'usually the cheapest')}">The most common form, and usually the cheapest.</p>
    <p class="warnline" data-in="${S('chime', on('form', 'No form has'), 0.6)}">No form has been shown to be <em>better than the others.</em></p>
  </div>`));

/* 15. Verdict */
const verdicts = [['Take the five signs seriously', 'Take the five signs'], ['Act fast on pins and needles or balance problems', 'especially pins'], ['Get a blood test rather than guessing', 'get a blood test']];
A.src = S('swell', on('verdict', 'The full guide'), 0.8);
S('riser', st('verdict', -0.9), 0.5); S('boom', st('verdict', 0.25), 0.9);
scenes.push(cine('verdict', 'nerves', '2,0,1.2,-2,0,1.1', `
  <div class="stxt wide">
    <p class="kicker" data-in="${st('verdict', 0.3)}">The verdict</p>
    <h2 class="h2 serif" data-wipe="${st('verdict', 0.45)}">Who you are matters <em>more than the dose.</em></h2>
    <div class="checks">${verdicts.map(([v, p]) => { const t = S('tick', on('verdict', p), 0.9); return `<div class="ck" data-in="${t}" data-from="l"><svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="28" fill="#183b37" stroke="#7cc47e" stroke-width="3"/>${tick(28, 30, 0.9, r2(t + 0.15))}</svg>${v}</div>`; }).join('')}</div>
  </div>
  <div class="end" data-in="${A.src}" data-from="z">
    <div class="lockup"><span class="mark"><i></i><i></i><i></i><i></i></span>SharpAndLean</div>
    <p class="url">sharpandlean.com</p>
    <p class="srcs">Read the full guide</p>
    <div>${credit(r2(A.src + 0.3), 'centre')}</div>
    <p class="fine">General information, not medical advice. See a doctor promptly for numbness, pins and needles, balance problems or confusion.</p>
  </div>`, 'tight'));

/* scene changes */
script.lines.slice(1).forEach((l) => S('whoosh', T[l.id].s - 0.12, 0.3));

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
html,body{background:#050e0d}
.lb{position:absolute;left:0;right:0;height:132px;background:#030807;z-index:6}
#lbt{top:0}#lbb{bottom:0}
#grain{position:absolute;inset:0;z-index:5;opacity:.07;mix-blend-mode:overlay;pointer-events:none}
#leak{position:absolute;top:-300px;left:0;width:420px;height:1700px;z-index:5;pointer-events:none;background:linear-gradient(90deg,rgba(255,214,150,0),rgba(255,214,150,.09),rgba(255,214,150,0));filter:blur(30px)}
#vig{background:radial-gradient(ellipse at center,rgba(0,0,0,0) 45%,rgba(0,0,0,.62) 100%)}
#bar{z-index:8;height:5px}
#logo{top:44px;font-size:32px}
#rail{top:40px}
#cap{bottom:38px}
#cap span{background:none;border:0;font-size:35px;padding:0 20px;max-width:1500px;color:rgba(251,249,245,.5)}
.bg{position:absolute;inset:-4%;background-size:cover;background-position:center;transform-origin:50% 50%;filter:saturate(1.05) contrast(1.04)}
.scrim{position:absolute;inset:0;background:linear-gradient(90deg,rgba(4,12,11,.95) 0%,rgba(4,12,11,.84) 38%,rgba(4,12,11,.35) 72%,rgba(4,12,11,.12) 100%)}
.cine>.cam{padding:186px 110px 216px;display:flex;align-items:center;gap:44px}
.stxt{flex:0 0 880px;position:relative;z-index:2}
.stxt.wide{flex:0 0 1000px}
.sign .stxt{flex:0 0 820px}
.cine .viz{flex:1;height:600px}
.num{flex:0 0 250px;font-family:'Newsreader',serif;font-style:italic;font-size:500px;line-height:.8;color:transparent;-webkit-text-stroke:3px #d8b876;text-shadow:0 0 60px rgba(216,184,118,.35);text-align:center;transform-origin:50% 50%}
.h2.serif{font-size:72px;line-height:1.05;letter-spacing:-.03em;margin-top:14px}
.rule{display:block;margin-top:26px;width:260px;height:3px;background:linear-gradient(90deg,#d8b876,rgba(216,184,118,0));transform-origin:0 50%}
.cine .note{margin-top:22px;font-size:38px}
.mega{font-size:230px;line-height:.9;font-weight:700;letter-spacing:-.05em;margin-top:6px;text-shadow:0 14px 60px rgba(0,0,0,.6)}
.mega b{font-family:'Newsreader',serif;font-style:italic;font-weight:400;color:#d8b876;font-size:1.25em;margin-right:16px}
.megasub{font-size:96px;line-height:1;margin-top:4px}
.cine .lead{margin-top:26px;font-size:46px}
.tags{position:absolute;right:120px;top:250px;display:grid;gap:18px;justify-items:end}
.tags span{padding:16px 30px;border-radius:999px;font-size:36px;font-weight:700;background:rgba(4,12,11,.6);border:1.5px solid rgba(216,184,118,.6);backdrop-filter:blur(8px)}
.warnline{margin-top:30px;font-size:42px;line-height:1.2;font-weight:700;letter-spacing:-.02em;padding-left:22px;border-left:5px solid #e07a5f}
.warnline em{color:#f3b596}
.mini{display:block;margin-top:26px;width:760px;overflow:visible}
.meter{margin-top:24px;display:grid;grid-template-columns:auto 1fr;align-items:center;column-gap:20px;row-gap:8px;font-size:28px}
.meter small{grid-column:1/3}
.meter b{white-space:nowrap}
.meter small{font-size:22px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#b9c9c4}
.segs{display:flex;gap:6px}
.segs i{width:54px;height:14px;border-radius:7px;background:rgba(251,249,245,.16);overflow:hidden;position:relative}
.segs i.on{background:#d8b876;transform-origin:0 50%}
.meter b{color:#d8b876;font-size:30px}
.urgent{display:inline-block;margin-top:22px;padding:12px 26px;border:4px solid #e07a5f;border-radius:14px;color:#f3b596;font-size:32px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;transform-origin:left center}
.bands{margin-top:28px;display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.bands div{padding:18px 22px;border-radius:22px;border:2px solid;background:rgba(4,12,11,.55)}
.bands b{display:block;font-size:44px;letter-spacing:-.02em}.bands span{display:block;margin-top:4px;font-size:25px;font-weight:700;color:#d6e2de}
.duo{margin-top:6px;display:flex;align-items:center;gap:24px}
.duo .stat{margin-top:26px;padding:22px 30px}.duo .stat b{font-size:76px}
.or{margin-top:26px;font-size:44px}
.cine .stat{background:rgba(4,12,11,.6);backdrop-filter:blur(8px)}
.pair{margin-top:28px;display:grid;grid-template-columns:1fr 1fr;gap:18px}
.pair div{padding:24px 28px;border-radius:26px;background:rgba(4,12,11,.6);border:1.5px solid rgba(251,249,245,.2)}
.pair b{display:block;font-size:38px;letter-spacing:-.02em;line-height:1.1}.pair span{display:block;margin-top:8px;font-size:27px;color:#b9c9c4;font-weight:500}
.pair .no{border-color:rgba(224,122,95,.75)}.pair .no b{color:#f3b596}
.pair .yes{border-color:rgba(124,196,126,.75)}.pair .yes b{color:#a9e0ab}
.kicker.terra{color:#f3b596}
.cine .checks{margin-top:26px}
.cine .ck{background:rgba(4,12,11,.6);padding:14px 26px;font-size:36px}
.cine .fine2{margin-top:18px;font-size:22px}
.cine .credit{background:rgba(4,12,11,.55)}
.take{bottom:158px;left:110px;right:110px}
.cine .end{position:relative;z-index:2}
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
const scenes=q('.scene').map((el)=>{const bg=el.querySelector('.bg');return{el,bg,kb:bg?bg.dataset.kb.split(',').map(Number):null,cam:el.querySelector('.cam'),a:+el.dataset.s,e:+el.dataset.e}});const wipes=mk('[data-wipe]');const grain=document.getElementById('grain'),leak=document.getElementById('leak');(()=>{const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d'),im=g.createImageData(256,256);let sd=3;for(let i=0;i<im.data.length;i+=4){sd=(sd*16807)%2147483647;const v=sd%256;im.data[i]=im.data[i+1]=im.data[i+2]=v;im.data[i+3]=255}g.putImageData(im,0,0);grain.style.backgroundImage='url('+c.toDataURL()+')'})();
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
    s.el.style.filter=o<1?'blur('+((1-o)*10).toFixed(1)+'px)':'none';if(s.bg){const b=s.kb,u=E.io(p);s.bg.style.transform='translate('+(b[0]+(b[3]-b[0])*u).toFixed(3)+'%,'+(b[1]+(b[4]-b[1])*u).toFixed(3)+'%) scale('+(b[2]+(b[5]-b[2])*u).toFixed(4)+')';}
  }
  {const f=Math.round(t*30);grain.style.backgroundPosition=((f*73)%256)+'px '+((f*151)%256)+'px';leak.style.transform='translateX('+(((t*38)%2600)-800).toFixed(1)+'px) rotate(18deg)';}for(const{el,sc}of wipes){if(sc&&!live.has(sc))continue;const w=E.out(clamp((t-+el.dataset.wipe)/0.9));el.style.opacity=w>0?1:0;el.style.clipPath='inset(-10% '+((1-w)*100).toFixed(2)+'% -10% 0)';el.style.transform='translateX('+((1-w)*-24).toFixed(2)+'px)';}for(const{el,sc}of ins){if(sc&&!live.has(sc))continue;const p=E.out(clamp((t-+el.dataset.in)/0.6));const f=FROM[el.dataset.from||'u'];el.style.opacity=p;el.style.transform='translate('+((1-p)*f[0]).toFixed(2)+'px,'+((1-p)*f[1]).toFixed(2)+'px) scale('+(f[2]+(1-f[2])*p).toFixed(4)+')';}
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

const html = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>5 signs of B12 deficiency, and who really needs a supplement</title><style>${css}</style></head><body>
<div id="sky"></div><div id="aur"></div><div id="aur2"></div><canvas id="dust" width="1920" height="1080"></canvas>
${defs}
${scenes.join('')}
<div id="vig"></div><div id="leak"></div><div id="grain"></div><div class="lb" id="lbt"></div><div class="lb" id="lbb"></div>
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
