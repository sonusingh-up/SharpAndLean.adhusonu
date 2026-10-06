/*
 * Writes .out/video.html and .out/timeline.json for the YouTube explainer
 * "Magnesium for sleep: what it can and can't do" (1920×1080).
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

/* 1. Hook */
A.mg = S('shimmer', on('hook', 'magnesium?'), 0.9);
S('clock', st('hook', 0.3), 0.8); S('clock', st('hook', 1.5), 0.6);
scenes.push(scene('hook', 'full', `
  <svg class="art" viewBox="0 0 1920 1080">
    <g data-float="14,9,0"><circle cx="1620" cy="230" r="120" fill="url(#moon)" filter="url(#glowS)"/>
      <circle cx="1585" cy="200" r="20" fill="#cfb37a" opacity=".5"/><circle cx="1655" cy="265" r="13" fill="#cfb37a" opacity=".45"/><circle cx="1640" cy="190" r="8" fill="#cfb37a" opacity=".4"/></g>
    <g data-in="${st('hook', 0.2)}" data-from="z">
      <g ${k([[st('hook'), { x: 0, y: 0, s: 1, o: 1 }], [A.mg - 0.2, {}], [A.mg + 0.7, { x: -200, y: -235, s: 0.42, o: 0.35 }]])} data-org="1330px 600px">
        <circle cx="1330" cy="600" r="232" fill="#0e2421" stroke="#d8b876" stroke-width="6" filter="url(#shadow)"/>
        <circle cx="1330" cy="600" r="232" fill="url(#gloss)" opacity=".35"/>
        ${Array.from({ length: 12 }, (_, i) => `<rect x="1326" y="384" width="8" height="${i % 3 ? 16 : 30}" rx="4" fill="#d8b876" opacity="${i % 3 ? 0.5 : 0.95}" transform="rotate(${i * 30} 1330 600)"/>`).join('')}
        <rect x="1323" y="480" width="14" height="128" rx="7" fill="#fbf9f5" transform="rotate(92 1330 600)"/>
        <g data-org="1330px 600px" ${k([[st('hook'), { r: 30, e: 'lin' }], [T.hook.e, { r: 52 }]])}><rect x="1325" y="420" width="10" height="188" rx="5" fill="#fbf9f5"/></g>
        <circle cx="1330" cy="600" r="13" fill="#e07a5f"/>
        <text x="1330" y="720" text-anchor="middle" class="t30 dim">3:07 am</text>
      </g>
    </g>
    <g data-pop="${A.mg}" data-org="1400px 600px">
      <g data-float="10,6,1.2">
        <circle cx="1400" cy="600" r="250" fill="#d8b876" opacity=".16" filter="url(#blur40)"/>
        <g data-spin="26" data-org="1400px 600px"><ellipse cx="1400" cy="600" rx="262" ry="96" fill="none" stroke="#d8b876" stroke-width="3" opacity=".7"/><circle cx="1662" cy="600" r="13" fill="#f3b596" filter="url(#glowS)"/><circle cx="1138" cy="600" r="13" fill="#f3b596" filter="url(#glowS)"/></g>
        <g transform="rotate(60 1400 600)"><g data-spin="-34" data-org="1400px 600px"><ellipse cx="1400" cy="600" rx="262" ry="96" fill="none" stroke="#d8b876" stroke-width="3" opacity=".55"/><circle cx="1662" cy="600" r="11" fill="#7cc47e" filter="url(#glowS)"/></g></g>
        <g transform="rotate(-60 1400 600)"><g data-spin="40" data-org="1400px 600px"><ellipse cx="1400" cy="600" rx="262" ry="96" fill="none" stroke="#d8b876" stroke-width="3" opacity=".55"/><circle cx="1138" cy="600" r="11" fill="#7cc47e" filter="url(#glowS)"/></g></g>
        <rect x="1270" y="470" width="260" height="260" rx="44" fill="url(#gold)" filter="url(#shadow)"/>
        <rect x="1270" y="470" width="260" height="260" rx="44" fill="url(#gloss)"/>
        <text x="1300" y="528" class="t34 b ink">12</text>
        <text x="1400" y="650" text-anchor="middle" class="t150 b ink">Mg</text>
        <text x="1400" y="702" text-anchor="middle" class="t28 b ink">Magnesium</text>
      </g>
    </g>
  </svg>
  <div class="txt wide">
    <p class="kicker" data-in="${st('hook', 0.2)}">The only video you need</p>
    <h1 class="title" data-in="${st('hook', 0.35)}">Magnesium<br>for sleep</h1>
    <p class="lead" data-in="${on('hook', 'Here is')}">What it <em>can</em> do, what it <em>can't</em>,<br>and how to take it safely.</p>
  </div>`));

/* 2. The short answer */
A.swing = on('answer', 'Magnesium may');
A.settle = S('chime', on('answer', 'a little'), 0.8);
A.notpill = S('stamp', on('answer', 'not a sleeping pill'), 0.9);
S('tick', A.swing, 0.7);
scenes.push(scene('answer', 'split', `
  <div class="txt">
    ${head('answer', 'The short answer', 'It may help <em>a little.</em>')}
    <p class="note" data-in="${on('answer', 'mostly if')}">Mostly if you are not getting enough of it.</p>
  </div>
  <svg class="viz" viewBox="0 0 900 760">
    <g data-in="${st('answer', 0.4)}" data-from="z">
      <path d="M110 560 A340 340 0 0 1 280 265.6" fill="none" stroke="#3d5a55" stroke-width="64" stroke-linecap="round"/>
      <path d="M306 251 A340 340 0 0 1 594 251" fill="none" stroke="#2f7c72" stroke-width="64" filter="url(#glowT)"/>
      <path d="M620 265.6 A340 340 0 0 1 790 560" fill="none" stroke="#e07a5f" stroke-width="64" stroke-linecap="round" ${k([[A.notpill, { o: 1 }], [A.notpill + 0.4, { o: 0.25 }]])}/>
      <text x="120" y="660" text-anchor="middle" class="t30 dim b">No help</text>
      <text x="450" y="150" text-anchor="middle" class="t34 b cream">Small help</text>
      <text x="780" y="660" text-anchor="middle" class="t30 dim b">Sleeping pill</text>
      <g data-org="450px 560px" ${k([[st('answer'), { r: -78 }], [A.swing, { r: -78, e: 'io' }], [A.swing + 0.7, { r: 70, e: 'io' }], [A.settle - 0.1, { r: 70, e: 'io' }], [A.settle + 0.55, { r: -8, e: 'back' }], [A.settle + 1.0, { r: 0 }]])}>
        <path d="M438 560 L450 250 L462 560 z" fill="#fbf9f5" filter="url(#shadow)"/>
      </g>
      <circle cx="450" cy="560" r="34" fill="url(#gold)"/><circle cx="450" cy="560" r="12" fill="#183b37"/>
      <g data-pop="${A.notpill}" data-org="780px 420px"><g transform="rotate(-12 780 420)"><rect x="640" y="382" width="280" height="76" rx="14" fill="none" stroke="#e07a5f" stroke-width="6"/><text x="780" y="434" text-anchor="middle" class="t34 b terra">NOT THIS</text></g></g>
    </g>
  </svg>`));

/* 3. What magnesium is */
A.half = on('need', 'about half');
const dimmed = new Set();
{ let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647; while (dimmed.size < 48) dimmed.add(Math.floor(rnd() * 100)); }
const dimOrder = [...dimmed];
S('pop', on('need', 'three hundred'), 0.7); S('tick', A.half, 0.6); S('tick', A.half + 0.5, 0.5); S('tick', A.half + 1.0, 0.4); S('chime', A.half + 1.7, 0.7);
scenes.push(scene('need', 'split', `
  <div class="txt">
    ${head('need', 'What magnesium is', 'A mineral your <em>nerves and muscles</em> depend on.')}
    <div class="stat" data-in="${on('need', 'Adults need')}"><b>310–420</b><span>mg a day<small>recommended for adults</small></span></div>
  </div>
  <svg class="viz" viewBox="0 0 900 760">
    <g data-in="${on('need', 'and about half', -0.5)}">
      ${Array.from({ length: 100 }, (_, i) => {
        const x = 150 + (i % 10) * 62, y = 70 + Math.floor(i / 10) * 56;
        const j = dimOrder.indexOf(i);
        const anim = j >= 0 ? ` ${k([[A.half + j * 0.035, { o: 0 }], [A.half + j * 0.035 + 0.25, { o: 1 }]])}` : '';
        return `<g><circle cx="${x}" cy="${y}" r="10" fill="#7cc47e"/><rect x="${x - 13}" y="${y + 13}" width="26" height="24" rx="11" fill="#7cc47e"/>${j >= 0 ? `<g${anim}><circle cx="${x}" cy="${y}" r="10" fill="#e07a5f"/><rect x="${x - 13}" y="${y + 13}" width="26" height="24" rx="11" fill="#e07a5f"/></g>` : ''}</g>`;
      }).join('')}
      <text x="150" y="690" class="t64 b terra"><tspan data-count="48" data-at="${A.half}" data-dur="1.7" data-dec="0">0</tspan>%</text>
      <text x="300" y="668" class="t30 b cream">of Americans get less than</text>
      <text x="300" y="706" class="t30 b cream">recommended from food</text>
    </g>
  </svg>`));

/* 4. Body stores and blood tests */
A.blood = S('pop', on('store', 'Less than one percent'), 0.8);
A.test = S('whoosh', on('store', 'so a standard blood test', -0.2), 0.7);
A.stamp = S('stamp', on('store', 'does not show'), 1);
scenes.push(scene('store', 'split', `
  <div class="txt">
    ${head('store', 'Hard to measure', 'A blood test sees <em>less than 1%</em> of it.')}
    <div class="rows" style="margin-top:44px">
      <div class="row3" data-in="${st('store', 0.9)}"><i style="background:#d8b876"></i><b>50–60%</b><span>in your bones</span></div>
      <div class="row3" data-in="${st('store', 1.3)}"><i style="background:#2f7c72"></i><b>Most of the rest</b><span>in soft tissue</span></div>
      <div class="row3" data-in="${A.blood}"><i style="background:#e07a5f"></i><b>Under 1%</b><span>in blood serum</span></div>
    </div>
  </div>
  <svg class="viz" viewBox="0 0 900 760">
    <g data-in="${st('store', 0.5)}" data-from="z"><g data-float="8,7,0">
      <circle cx="300" cy="130" r="62" fill="#d8b876" opacity=".9"/>
      <path d="M210 230 q90 -40 180 0 q46 20 52 90 l14 190 q4 34 -30 34 l-18 0 l-8 -150 l-10 0 l0 296 q0 34 -40 34 q-34 0 -36 -34 l-4 -190 l-20 0 l-4 190 q-2 34 -36 34 q-40 0 -40 -34 l0 -296 l-10 0 l-8 150 l-18 0 q-34 0 -30 -34 l14 -190 q6 -70 52 -90 z" fill="#2f7c72" filter="url(#glowT)"/>
      <g fill="none" stroke="#d8b876" stroke-width="12" stroke-linecap="round" opacity=".9"><path d="M300 250 V500"/><path d="M256 290 H344 M250 330 H350 M256 370 H344"/><path d="M262 540 V690 M338 540 V690"/><path d="M196 300 L182 470 M404 300 L418 470"/></g>
      <circle cx="300" cy="330" r="16" fill="#e07a5f" filter="url(#glowS)" ${k([[A.blood, { s: 0 }], [A.blood + 0.4, { s: 1.6, e: 'back' }], [A.blood + 0.9, { s: 1 }]])}/>
    </g></g>
    <g ${k([[A.test, { x: 420, o: 0 }], [A.test + 0.7, { x: 0, o: 1 }]])}>
      <rect x="500" y="170" width="340" height="430" rx="26" fill="#fbf9f5" filter="url(#shadow)"/>
      <text x="532" y="232" class="t28 b ink">Blood test</text>
      <rect x="532" y="256" width="276" height="4" fill="#1c2a28"/>
      <text x="532" y="312" class="t24 muted">Serum magnesium</text>
      <rect x="532" y="334" width="276" height="18" rx="9" fill="#e8e1d5"/><rect x="620" y="334" width="110" height="18" rx="9" fill="#7cc47e"/><circle cx="676" cy="343" r="14" fill="#183b37"/>
      <text x="532" y="400" class="t24 muted">Looks normal</text>
      <rect x="532" y="430" width="220" height="12" rx="6" fill="#e8e1d5"/><rect x="532" y="460" width="260" height="12" rx="6" fill="#e8e1d5"/><rect x="532" y="490" width="180" height="12" rx="6" fill="#e8e1d5"/>
      <g data-pop="${A.stamp}" data-org="670px 540px"><g transform="rotate(-9 670 540)"><rect x="522" y="504" width="296" height="72" rx="14" fill="#fbf9f5" stroke="#e07a5f" stroke-width="6"/><text x="670" y="548" text-anchor="middle" class="t20 b terra">NOT THE FULL PICTURE</text></g></g>
    </g>
  </svg>`));

/* 5. Who runs low */
const risks = [
  ['Older adults', 'Absorb less, lose more', 'Older adults', '<circle cx="0" cy="-16" r="13"/><path d="M-20 34 q0 -34 20 -34 q20 0 20 34 z"/><path d="M28 -4 v40" stroke-width="5" stroke="currentColor" fill="none" stroke-linecap="round"/>'],
  ['Type 2 diabetes', 'More is lost in urine', 'type two diabetes', '<path d="M0 -34 q26 34 26 52 a26 26 0 0 1 -52 0 q0 -18 26 -52 z"/>'],
  ['Gut conditions', "Such as Crohn's or coeliac disease", 'gut conditions', '<path d="M-26 -26 h36 a16 16 0 0 1 0 32 h-22 a14 14 0 0 0 0 28 h38" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round"/>'],
  ['Heavy drinking', 'Poor intake, more lost', 'people who drink heavily', '<path d="M-22 -32 h44 l-6 30 a16 16 0 0 1 -32 0 z"/><rect x="-4" y="12" width="8" height="18"/><rect x="-18" y="28" width="36" height="7" rx="3"/>'],
  ['Long-term PPIs', 'Acid reducers, usually over a year', 'Long-term use', '<g transform="rotate(-35)"><rect x="-34" y="-15" width="68" height="30" rx="15"/><rect x="-2" y="-15" width="4" height="30" fill="#183b37"/></g>'],
];
scenes.push(scene('risk', 'stack', `
  ${head('risk', 'Who is more likely to run low', 'Five groups <em>worth knowing.</em>')}
  <div class="cards5">
    ${risks.map(([title, sub, phrase, icon], i) => {
      const t = S('flip', on('risk', phrase), 0.8);
      return `<div class="rc" ${k([[t, { ry: -90, o: 0, y: 30 }], [t + 0.55, { ry: 0, o: 1, y: 0, e: 'back' }]])}>
        <svg viewBox="-50 -50 100 100" style="color:${i % 2 ? '#d8b876' : '#f3b596'}"><circle r="48" fill="#183b37"/><g fill="currentColor">${icon}</g></svg>
        <b>${title}</b><span>${sub}</span>
        <div class="lvl"><i ${k([[t + 0.5, { sx: 0.92 }], [t + 1.5, { sx: 0.38, e: 'io' }]])}></i></div>
      </div>`;
    }).join('')}
  </div>`));

/* 6. Why it might help */
A.calm = on('why', 'calm the nervous');
A.proof = S('stamp', on('why', 'It does not prove'), 1);
S('shimmer', A.calm - 0.3, 0.6);
const pulse = (delay, slow) => {
  const keys = [];
  let t = T.why.s + delay;
  while (t < T.why.e) {
    const dur = t > A.calm + 0.4 ? slow : 1.1;
    keys.push([t, { x: 0, o: 0, e: 'lin' }], [t + 0.12, { x: 40, o: 1, e: 'lin' }], [t + dur, { x: 520, o: 1, e: 'lin' }], [t + dur + 0.15, { x: 560, o: 0 }]);
    t += dur + (t > A.calm + 0.4 ? 1.5 : 0.45);
  }
  return k(keys);
};
scenes.push(scene('why', 'split', `
  <div class="txt">
    ${head('why', 'Why it might help', 'It helps regulate the signals that <em>calm the nervous system.</em>')}
    <p class="note" data-in="${on('why', 'That explains')}">That explains the idea.</p>
  </div>
  <svg class="viz" viewBox="0 0 900 760">
    <g data-in="${st('why', 0.4)}" data-from="z">
      <g fill="none" stroke="#2f7c72" stroke-width="14" stroke-linecap="round">
        <path d="M200 380 q-70 -90 -150 -110" pathLength="1" data-draw="${st('why', 0.5)}" data-dur="0.9"/><path d="M200 380 q-90 10 -160 80" pathLength="1" data-draw="${st('why', 0.6)}" data-dur="0.9"/>
        <path d="M200 380 q-20 -120 30 -200" pathLength="1" data-draw="${st('why', 0.7)}" data-dur="0.9"/><path d="M200 380 q-10 120 -70 190" pathLength="1" data-draw="${st('why', 0.8)}" data-dur="0.9"/>
        <path d="M200 380 q60 -110 150 -150" pathLength="1" data-draw="${st('why', 0.9)}" data-dur="0.9"/>
      </g>
      <path d="M270 380 H790" stroke="#2f7c72" stroke-width="18" stroke-linecap="round" pathLength="1" data-draw="${st('why', 0.9)}" data-dur="1"/>
      ${[330, 440, 550, 660].map((x, i) => `<rect x="${x}" y="356" width="84" height="48" rx="24" fill="#f3efe7" opacity=".92" data-pop="${st('why', 1.3 + i * 0.12)}"/>`).join('')}
      <g fill="none" stroke="#2f7c72" stroke-width="12" stroke-linecap="round"><path d="M790 380 l70 -60"/><path d="M790 380 l80 0"/><path d="M790 380 l70 60"/></g>
      <circle cx="864" cy="318" r="14" fill="#d8b876"/><circle cx="876" cy="380" r="14" fill="#d8b876"/><circle cx="864" cy="442" r="14" fill="#d8b876"/>
      <circle cx="200" cy="380" r="92" fill="url(#teal)" filter="url(#glowT)"/><circle cx="200" cy="380" r="92" fill="url(#gloss)"/><circle cx="200" cy="380" r="34" fill="#183b37" opacity=".55"/>
      <g ${pulse(1.2, 2.6)}><circle cx="270" cy="380" r="17" fill="#f3b596" filter="url(#glowS)"/></g>
      <g ${pulse(1.75, 2.6)}><circle cx="270" cy="380" r="17" fill="#f3b596" filter="url(#glowS)"/></g>
      ${[[150, 290], [262, 330], [170, 474]].map(([x, y], i) => `<g ${k([[A.calm - 0.4 + i * 0.18, { y: -260, o: 0 }], [A.calm + 0.2 + i * 0.18, { y: 0, o: 1, e: 'back' }]])}><circle cx="${x}" cy="${y}" r="34" fill="url(#gold)" filter="url(#shadow)"/><text x="${x}" y="${y + 9}" text-anchor="middle" class="t24 b ink">Mg</text></g>`).join('')}
      <g data-pop="${A.proof}" data-org="560px 600px"><g transform="rotate(-6 560 600)"><rect x="330" y="552" width="460" height="96" rx="18" fill="#0e2421" stroke="#e07a5f" stroke-width="6"/><text x="560" y="614" text-anchor="middle" class="t36 b terra">MECHANISM, NOT PROOF</text></g></g>
    </g>
  </svg>`));

/* 7. Older trials */
A.race = S('whoosh', on('trials', 'found people fell asleep'), 0.6);
A.won = S('chime', on('trials', 'seventeen minutes'), 0.9);
A.total = S('tick', on('trials', 'But total sleep time'), 0.8);
A.small = S('tick', on('trials', 'the trials were small'), 0.7);
A.quality = S('warn', on('trials', 'low to very low'), 0.5);
scenes.push(scene('trials', 'stack', `
  ${head('trials', 'What the older trials show', 'Asleep about <em>17 minutes faster.</em>')}
  <svg class="wideviz" viewBox="0 0 1728 520">
    <g data-in="${st('trials', 0.8)}">
      <text x="0" y="74" class="t34 b cream">Magnesium</text><text x="0" y="214" class="t34 b dim">Placebo</text>
      <rect x="260" y="40" width="1180" height="48" rx="24" fill="#22443f"/><rect x="260" y="180" width="1180" height="48" rx="24" fill="#22443f"/>
      <rect x="260" y="40" width="1180" height="48" rx="24" fill="url(#teal)" data-org="260px 64px" ${k([[A.race, { sx: 0.02, e: 'io' }], [A.won, { sx: 0.78 }]])} filter="url(#glowT)"/>
      <rect x="260" y="180" width="1180" height="48" rx="24" fill="#8a7a5a" data-org="260px 204px" ${k([[A.race, { sx: 0.02, e: 'io' }], [A.won, { sx: 0.62, e: 'io' }], [A.won + 1.6, { sx: 0.78 }]])}/>
      <g ${k([[A.race, { x: 0, e: 'io' }], [A.won, { x: 900 }]])}><circle cx="284" cy="64" r="34" fill="url(#gold)" filter="url(#shadow)"/><text x="284" y="74" text-anchor="middle" class="t24 b ink">Mg</text></g>
      <g ${k([[A.race, { x: 0, e: 'io' }], [A.won, { x: 712, e: 'io' }], [A.won + 1.6, { x: 900 }]])}><circle cx="284" cy="204" r="34" fill="#cfc6b4"/></g>
      <path d="M1184 20 V250" stroke="#d8b876" stroke-width="5" stroke-dasharray="4 12" stroke-linecap="round"/>
      <text x="1184" y="296" text-anchor="middle" class="t28 b ochre">Asleep</text>
      <g data-pop="${A.won}" data-org="1560px 134px"><rect x="1420" y="60" width="290" height="150" rx="30" fill="#fbf9f5" filter="url(#shadow)"/><text x="1565" y="140" text-anchor="middle" class="t64 b ink"><tspan data-count="17" data-at="${A.won}" data-dur="0.9" data-dec="0">0</tspan> min</text><text x="1565" y="184" text-anchor="middle" class="t26 b muted">sooner</text></g>
    </g>
    <g data-in="${st('trials', 1.4)}"><rect x="0" y="340" width="400" height="150" rx="28" fill="#12302c" stroke="#2f5d56" stroke-width="3"/><text x="34" y="404" class="t40 b cream">3 trials</text><text x="34" y="452" class="t28 dim b">151 older adults</text></g>
    <g data-in="${A.total}"><rect x="430" y="340" width="430" height="150" rx="28" fill="#12302c" stroke="#2f5d56" stroke-width="3"/><text x="464" y="404" class="t40 b cream">Total sleep time</text><text x="464" y="452" class="t28 b terra">No clear improvement</text></g>
    <g data-in="${A.small}"><rect x="890" y="340" width="838" height="150" rx="28" fill="#12302c" stroke="#2f5d56" stroke-width="3"/>
      <text x="924" y="380" class="t24 b dim">Evidence quality</text>
      ${['High', 'Moderate', 'Low', 'Very low'].map((q, i) => `<rect x="${924 + i * 194}" y="414" width="182" height="20" rx="10" fill="${['#7cc47e', '#d8b876', '#e9a06a', '#e07a5f'][i]}" opacity="${i > 1 ? 1 : 0.35}"/><text x="${1015 + i * 194}" y="470" text-anchor="middle" class="t24 b ${i > 1 ? 'cream' : 'dim'}">${q}</text>`).join('')}
      <g ${k([[A.small, { x: 0, e: 'io' }], [A.quality, { x: 100, e: 'io' }], [A.quality + 0.8, { x: 485, e: 'back' }]])}><path d="M1003 388 l24 0 l-12 20 z" fill="#fbf9f5"/></g>
    </g>
  </svg>`));

/* 8. The 2025 trial */
A.b1 = on('newtrial', 'their insomnia scores');
A.small2 = S('stamp', on('newtrial', 'The effect was small'), 0.9);
S('pop', on('newtrial', 'one hundred and fifty-five'), 0.6); S('pop', on('newtrial', 'two hundred and fifty'), 0.6); S('pop', on('newtrial', 'After four weeks'), 0.6); S('whoosh', A.b1, 0.5);
scenes.push(scene('newtrial', 'split', `
  <div class="txt">
    ${head('newtrial', 'The 2025 trial', 'A real effect, but <em>a small one.</em>')}
    <div class="chips">
      <div class="chip" data-pop="${on('newtrial', 'one hundred and fifty-five')}"><b>155</b>adults</div>
      <div class="chip" data-pop="${on('newtrial', 'two hundred and fifty')}"><b>250 mg</b>bisglycinate a day</div>
      <div class="chip" data-pop="${on('newtrial', 'After four weeks')}"><b>4</b>weeks</div>
    </div>
  </div>
  <svg class="viz" viewBox="0 0 900 760">
    <g data-in="${st('newtrial', 0.6)}">
      <text x="450" y="60" text-anchor="middle" class="t28 b dim">Change in insomnia score at week 4</text>
      <text x="450" y="98" text-anchor="middle" class="t24 dim">Insomnia Severity Index · lower is better</text>
      <path d="M110 150 H790" stroke="#fbf9f5" stroke-width="5" stroke-linecap="round"/><text x="100" y="140" class="t24 b dim">0</text>
      <rect x="210" y="152" width="200" height="430" rx="22" fill="url(#teal)" filter="url(#glowT)" data-org="310px 152px" ${k([[A.b1, { sy: 0 }], [A.b1 + 1.1, { sy: 1 }]])}/>
      <rect x="490" y="152" width="200" height="254" rx="22" fill="#8a7a5a" data-org="590px 152px" ${k([[A.b1 + 0.2, { sy: 0 }], [A.b1 + 1.2, { sy: 1 }]])}/>
      <text x="310" y="660" text-anchor="middle" class="t64 b cream">−<tspan data-count="3.9" data-at="${A.b1}" data-dur="1.1" data-dec="1">0.0</tspan></text>
      <text x="590" y="484" text-anchor="middle" class="t64 b dim">−<tspan data-count="2.3" data-at="${r2(A.b1 + 0.2)}" data-dur="1" data-dec="1">0.0</tspan></text>
      <text x="310" y="710" text-anchor="middle" class="t30 b cream">Magnesium</text><text x="590" y="534" text-anchor="middle" class="t30 b dim">Placebo</text>
      <g data-pop="${A.small2}" data-org="700px 640px"><g transform="rotate(-7 700 640)"><rect x="560" y="596" width="300" height="88" rx="16" fill="#0e2421" stroke="#d8b876" stroke-width="6"/><text x="710" y="654" text-anchor="middle" class="t36 b ochre">SMALL EFFECT</text></g></g>
    </g>
  </svg>`));

/* 9. Who benefits most */
A.least = on('who', 'eating the least');
A.fits = S('chime', on('who', 'most likely to help'), 0.8);
S('plate', A.least - 0.2, 0.6);
const bits = [[300, 340], [360, 300], [250, 400], [340, 420], [400, 370], [290, 280], [380, 440], [230, 330]];
scenes.push(scene('who', 'split', `
  <div class="txt">
    ${head('who', 'Who benefits most', 'The people eating <em>the least magnesium.</em>')}
    <p class="tag" data-pop="${S('pop', on('who', 'That is an early signal'), 0.6)}">Early signal, from an exploratory analysis</p>
  </div>
  <svg class="viz" viewBox="0 0 900 760">
    <g data-in="${st('who', 0.5)}" data-from="z">
      <ellipse cx="320" cy="400" rx="250" ry="250" fill="#000" opacity=".3" filter="url(#blur20)" transform="translate(10 26)"/>
      <circle cx="320" cy="370" r="240" fill="#fbf9f5"/><circle cx="320" cy="370" r="176" fill="none" stroke="#e8e1d5" stroke-width="6"/>
      ${bits.map(([x, y], i) => `<g ${k([[A.least + i * 0.22, { s: 1, o: 1 }], [A.least + i * 0.22 + 0.35, { s: 0, o: 0 }]])}><ellipse cx="${x}" cy="${y}" rx="30" ry="20" fill="${['#2f7c72', '#a9813c', '#7cc47e', '#d8b876'][i % 4]}" transform="rotate(${i * 37} ${x} ${y})"/></g>`).join('')}
      <text x="320" y="668" text-anchor="middle" class="t30 b dim">Magnesium in the diet</text>
      <rect x="660" y="120" width="130" height="500" rx="65" fill="#22443f"/>
      <rect x="660" y="120" width="130" height="500" rx="65" fill="url(#gold)" filter="url(#glowS)" data-org="725px 620px" ${k([[A.least, { sy: 0.14, e: 'io' }], [A.least + 2.2, { sy: 0.9 }]])}/>
      <text x="725" y="668" text-anchor="middle" class="t30 b ochre">Improvement</text>
      <path d="M590 372 h44 m-18 -18 l18 18 l-18 18" fill="none" stroke="#fbf9f5" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/>
    </g>
  </svg>`));

/* 10. Which form */
const forms = [
  ['Citrate', 'Dissolves well, absorbed better', 'like citrate', '#2f7c72', '#7cc47e', 'ok'],
  ['Glycinate', 'The form the 2025 trial used', 'Glycinate is', '#a9813c', '#d8b876', 'note'],
  ['Oxide', 'Absorbed less well', 'absorbed better than oxide', '#b9603f', '#e07a5f', 'bad'],
  ['Carbonate · chloride · gluconate', 'With oxide: most likely to cause diarrhoea', 'carbonate, chloride', '#b9603f', '#f3b596', 'bad'],
];
A.diar = S('warn', on('forms', 'most likely to cause'), 0.5);
scenes.push(scene('forms', 'stack', `
  ${head('forms', 'Which form', 'Pick one that <em>dissolves well.</em>')}
  <div class="cards4">
    ${forms.map(([name, sub, phrase, a, b, kind], i) => {
      const t = S('pills', on('forms', phrase), 0.7);
      return `<div class="fc ${kind}" data-in="${t}" data-from="z">
        <svg viewBox="0 0 300 190"><g data-float="7,5,${i}">${capsule(150, 88, a, b)}</g></svg>
        <b>${name}</b><span>${sub}</span>
      </div>`;
    }).join('')}
  </div>`));

/* 11. 'Special' forms */
A.nohead = S('stamp', on('noform', 'No form has been shown'), 1);
S('pills', st('noform', 0.6), 0.6);
scenes.push(scene('noform', 'stack', `
  ${head('noform', 'Forms sold “for sleep”', 'No form has <em>beaten the others.</em>')}
  <svg class="wideviz" viewBox="0 0 1728 500">
    <g data-in="${st('noform', 0.6)}">
      ${[0, 1, 2].map((i) => `<rect x="0" y="${40 + i * 140}" width="1728" height="110" rx="26" fill="#12302c" stroke="#2f5d56" stroke-width="3"/>
        <g ${k([[T.noform.s, { x: 0, e: 'io' }], ...Array.from({ length: 14 }, (_, j) => [T.noform.s + 1 + j * 0.7 + i * 0.2, { x: j % 2 ? 0 : 14, e: 'io' }])])}>${capsule(200, 95 + i * 140, ['#2f7c72', '#a9813c', '#b9603f'][i], ['#7cc47e', '#d8b876', '#f3b596'][i], 0, 170, 66)}</g>`).join('')}
      <path d="M330 30 V470" stroke="#fbf9f5" stroke-width="6" stroke-dasharray="14 14"/>
      <text x="350" y="492" class="t24 b dim">START</text>
      <g transform="translate(1560 60)">${Array.from({ length: 24 }, (_, i) => `<rect x="${(i % 4) * 30}" y="${Math.floor(i / 4) * 30}" width="30" height="30" fill="${(i + Math.floor(i / 4)) % 2 ? '#fbf9f5' : '#1c2a28'}"/>`).join('')}<rect x="-10" y="-20" width="10" height="420" rx="5" fill="#d8b876"/></g>
      <g data-pop="${A.nohead}" data-org="930px 250px"><g transform="rotate(-4 930 250)"><rect x="560" y="176" width="740" height="150" rx="24" fill="#fbf9f5" filter="url(#shadow)"/><text x="930" y="244" text-anchor="middle" class="t44 b ink">No head-to-head trials</text><text x="930" y="294" text-anchor="middle" class="t28 b muted">comparing forms for sleep</text></g></g>
    </g>
  </svg>`));

/* 12. How much */
A.lim = S('chime', on('dose', 'three hundred and fifty'), 0.9);
A.label = S('whoosh', on('dose', 'Check the label', -0.2), 0.7);
A.elem = S('tick', on('dose', 'elemental magnesium'), 0.9);
const gauge = (fillKeys, extra = '') => `
  <rect x="640" y="60" width="150" height="620" rx="75" fill="#22443f"/>
  <rect x="640" y="60" width="150" height="620" rx="75" fill="url(#teal)" data-org="715px 680px" ${fillKeys}/>
  <rect x="640" y="60" width="150" height="620" rx="75" fill="url(#gloss)" opacity=".5"/>
  ${[0, 100, 200, 300, 400, 500].map((v) => `<text x="820" y="${690 - v * 1.24}" class="t24 b dim">${v}</text>`).join('')}
  ${extra}`;
const limitLine = (t) => `<path d="M560 246 H870" stroke="#e07a5f" stroke-width="8" stroke-linecap="round" pathLength="1" data-draw="${t}" data-dur="0.5"/>
  <g data-in="${t}"><rect x="330" y="206" width="220" height="80" rx="18" fill="#e07a5f"/><text x="440" y="244" text-anchor="middle" class="t30 b cream">350 mg</text><text x="440" y="272" text-anchor="middle" class="t20 b cream">upper limit</text></g>`;
scenes.push(scene('dose', 'split', `
  <div class="txt">
    ${head('dose', 'How much', 'Stay under <em>350 mg</em> a day from supplements.')}
    <div class="label" ${k([[A.label, { x: -80, o: 0, s: 0.92 }], [A.label + 0.6, { x: 0, o: 1, s: 1 }]])}>
      <strong>Supplement facts</strong>
      <p class="strike"><span>Magnesium compound<small>total weight of the ingredient</small></span><i>not this</i></p>
      <p class="hit"><span>Elemental magnesium<small>the magnesium itself</small></span><i>this number</i>
        <svg viewBox="0 0 660 110" preserveAspectRatio="none"><rect x="5" y="5" width="650" height="100" rx="22" fill="none" stroke="#2f7c72" stroke-width="7" pathLength="1" data-draw="${A.elem}" data-dur="0.6"/></svg></p>
    </div>
  </div>
  <svg class="viz" viewBox="0 0 900 760">
    <g data-in="${st('dose', 0.5)}">
      ${gauge(k([[st('dose', 0.8), { sy: 0.02, e: 'io' }], [A.lim, { sy: 0.7 }]]), limitLine(A.lim))}
      <text x="715" y="736" text-anchor="middle" class="t24 b dim">mg a day, adults</text>
    </g>
  </svg>`));

/* 13. Side effects */
A.over = S('warn', st('side', 0.7), 0.7);
A.lower = S('whoosh', on('side', 'lower the dose'), 0.6);
scenes.push(scene('side', 'split', `
  <div class="txt">
    ${head('side', 'Too much', 'Your gut <em>tells you first.</em>')}
    <div class="chips col">
      ${[['Diarrhoea', 'diarrhoea'], ['Nausea', 'nausea'], ['Stomach cramps', 'stomach cramps']].map(([c, p]) => `<div class="chip warn" data-pop="${S('pop', on('side', p), 0.7)}"><b>!</b>${c}</div>`).join('')}
    </div>
    <p class="note" data-in="${A.lower}">Lower the dose, or change the form.</p>
  </div>
  <svg class="viz" viewBox="0 0 900 760">
    <g ${k([[A.over + 0.5, { x: 0 }], ...Array.from({ length: 10 }, (_, i) => [A.over + 0.6 + i * 0.08, { x: i % 2 ? -9 : 9, e: 'lin' }]), [A.over + 1.5, { x: 0 }]])}>
      ${gauge(k([[st('side'), { sy: 0.7, e: 'io' }], [A.over + 0.6, { sy: 0.93 }], [A.lower, { sy: 0.93, e: 'io' }], [A.lower + 1.4, { sy: 0.5 }]]), `<path d="M560 246 H870" stroke="#e07a5f" stroke-width="8" stroke-linecap="round"/><rect x="330" y="206" width="220" height="80" rx="18" fill="#e07a5f"/><text x="440" y="244" text-anchor="middle" class="t30 b cream">350 mg</text><text x="440" y="272" text-anchor="middle" class="t20 b cream">upper limit</text>
      <rect x="640" y="60" width="150" height="190" rx="75" fill="#e07a5f" opacity=".0" ${k([[A.over + 0.3, { o: 0 }], [A.over + 0.7, { o: 0.75 }], [A.lower + 0.5, { o: 0.75 }], [A.lower + 1.2, { o: 0 }]])}/>`)}
    </g>
  </svg>`));

/* 14. Laxatives */
A.lax = S('pills', on('laxative', 'the active ingredient'), 0.6);
A.five = S('chime', on('laxative', 'five hundred'), 0.9);
A.well = S('warn', on('laxative', 'well over'), 0.5);
scenes.push(scene('laxative', 'split', `
  <div class="txt">
    ${head('laxative', 'That is no accident', 'Magnesium is what makes <em>some laxatives work.</em>')}
    <div class="stat" data-in="${A.five}"><b><i data-count="500" data-at="${A.five}" data-dur="1" data-dec="0">0</i> mg</b><span>per tablespoon<small>milk of magnesia</small></span></div>
  </div>
  <svg class="viz" viewBox="0 0 900 760">
    <g data-in="${A.lax}" data-from="z"><g data-float="8,7,0">
      <ellipse cx="270" cy="700" rx="150" ry="18" fill="#000" opacity=".35" filter="url(#blur8)"/>
      <rect x="205" y="70" width="130" height="80" rx="16" fill="#d8b876"/><rect x="225" y="140" width="90" height="50" fill="#cfe3ee"/>
      <path d="M150 250 q0 -64 60 -64 h120 q60 0 60 64 v390 q0 50 -50 50 h-140 q-50 0 -50 -50 z" fill="#7fb4d6" filter="url(#shadow)"/>
      <path d="M150 250 q0 -64 60 -64 h120 q60 0 60 64 v390 q0 50 -50 50 h-140 q-50 0 -50 -50 z" fill="url(#gloss)"/>
      <rect x="150" y="320" width="240" height="230" fill="#fbf9f5"/>
      <text x="270" y="392" text-anchor="middle" class="t30 b ink">Milk of</text><text x="270" y="434" text-anchor="middle" class="t30 b ink">magnesia</text>
      <rect x="196" y="462" width="148" height="46" rx="23" fill="#183b37"/><text x="270" y="494" text-anchor="middle" class="t24 b cream">Laxative</text>
    </g></g>
    <g data-in="${A.five}">
      <text x="480" y="300" class="t26 b dim">One tablespoon</text>
      <rect x="480" y="330" width="390" height="56" rx="28" fill="#22443f"/>
      <rect x="480" y="330" width="390" height="56" rx="28" fill="#e07a5f" data-org="480px 358px" ${k([[A.five, { sx: 0.02 }], [A.five + 1, { sx: 1 }]])}/>
      <path d="M753 306 V410" stroke="#fbf9f5" stroke-width="6" stroke-linecap="round"/>
      <text x="753" y="450" text-anchor="middle" class="t24 b cream">350 mg limit</text>
      <text x="870" y="300" text-anchor="end" class="t26 b terra">500 mg</text>
    </g>
  </svg>`));

/* 15. Food first */
const foods = [
  ['Pumpkin seeds', '1 oz', 156, 'pumpkin seeds', '#7cc47e'], ['Almonds', '1 oz', 80, 'almonds', '#d8b876'], ['Spinach, cooked', '½ cup', 78, 'cooked spinach', '#2f7c72'],
  ['Black beans', '½ cup', 60, 'Black beans', '#8a7a5a'], ['Brown rice', '½ cup', 42, 'brown rice', '#e9a06a'], ['Yogurt', '8 oz', 42, 'yogurt', '#f3efe7'],
];
scenes.push(scene('food', 'stack tight', `
  ${head('food', 'Food first', 'From food, there is <em>no upper limit.</em>')}
  <div class="foods">
    ${foods.map(([name, serving, mg, phrase, c]) => {
      const t = S('plate', on('food', phrase), 0.6);
      return `<div class="fr" data-in="${t}" data-from="l"><i style="background:${c}"></i><b>${name}<small>${serving}</small></b>
        <div class="ft"><u style="background:${c}" ${k([[t + 0.1, { sx: 0 }], [t + 1, { sx: mg / 170 }]])}></u></div>
        <strong><span data-count="${mg}" data-at="${r2(t + 0.1)}" data-dur="0.9" data-dec="0">0</span> mg</strong></div>`;
    }).join('')}
  </div>`));

/* 16. Refining and absorption */
A.strip = S('flip', on('refined', 'strips out'), 0.8);
A.whole = S('chime', on('refined', 'whole grains beat'), 0.7);
A.abs = S('whoosh', on('refined', 'And your body', -0.2), 0.6);
A.pct = on('refined', 'thirty to forty');
scenes.push(scene('refined', 'split even', `
  <div class="half">
    <p class="kicker" data-in="${st('refined', 0.15)}">Refining grains</p>
    <h2 class="h3" data-in="${st('refined', 0.3)}">Strips out <em>much of the magnesium.</em></h2>
    <svg viewBox="0 0 760 420" data-in="${st('refined', 0.6)}">
      <g ${k([[A.strip, { x: 0, y: 0, r: 0, o: 1 }], [A.strip + 0.9, { x: -150, y: -30, r: -24, o: 0.25 }]])}><path d="M250 60 q150 150 0 300 q-150 -150 0 -300 z" fill="#a9813c"/><text x="80" y="60" class="t24 b ochre">Bran</text></g>
      <path d="M250 96 q112 114 0 228 q-112 -114 0 -228 z" fill="#f3efe7"/>
      <g ${k([[A.strip + 0.15, { x: 0, y: 0, o: 1 }], [A.strip + 1.0, { x: 60, y: 130, o: 0.25 }]])}><ellipse cx="250" cy="296" rx="34" ry="26" fill="#d8b876"/><text x="300" y="350" class="t24 b ochre">Germ</text></g>
      <text x="470" y="150" class="t26 b dim">Magnesium left</text>
      <rect x="470" y="172" width="260" height="34" rx="17" fill="#22443f"/><rect x="470" y="172" width="260" height="34" rx="17" fill="url(#gold)" data-org="470px 189px" ${k([[A.strip, { sx: 1, e: 'io' }], [A.strip + 1.3, { sx: 0.25 }]])}/>
      <g data-in="${A.whole}"><rect x="455" y="250" width="300" height="64" rx="32" fill="#2f7c72"/><text x="605" y="291" text-anchor="middle" class="t24 b cream">Choose whole grains</text></g>
    </svg>
  </div>
  <div class="half" data-in="${A.abs}" data-from="r">
    <p class="kicker">Absorption</p>
    <h2 class="h3">Your body takes in <em>30–40%.</em></h2>
    <svg viewBox="0 0 760 420">
      <text x="0" y="60" class="t26 b dim">Eaten</text><text x="0" y="300" class="t26 b dim">Absorbed</text>
      ${Array.from({ length: 10 }, (_, i) => `<circle cx="${40 + i * 72}" cy="120" r="28" fill="url(#gold)" data-pop="${r2(A.abs + 0.3 + i * 0.06)}"/>`).join('')}
      ${Array.from({ length: 4 }, (_, i) => `<g ${k([[A.pct + i * 0.22, { y: -240, o: 0 }], [A.pct + i * 0.22 + 0.6, { y: 0, o: i === 3 ? 0.45 : 1, e: 'back' }]])}><circle cx="${40 + i * 72}" cy="360" r="28" fill="#7cc47e" filter="url(#glowS)"/></g>`).join('')}
      <text x="340" y="374" class="t40 b cream">3 to 4 in every 10</text>
    </svg>
  </div>`));

/* 17. Who should check first */
const checks = [
  ['Kidney disease', 'Kidneys clear the extra', 'Anyone with kidney disease'], ['Some antibiotics', 'Tetracyclines, quinolones', 'some antibiotics'],
  ['Osteoporosis medicines', 'Bisphosphonates', 'osteoporosis medicines'], ['Water tablets', 'Diuretics change levels', 'Some water tablets'],
];
A.two = S('clock', on('safety', 'at least two hours'), 0.9);
scenes.push(scene('safety', 'split tight', `
  <div class="txt">
    ${head('safety', 'Who should check first', 'Ask a <em>pharmacist</em> if any of these apply.')}
    <div class="lis">${checks.map(([a, b, p]) => `<div class="li" data-in="${S('pop', on('safety', p), 0.6)}" data-from="l"><b>!</b><span>${a}<small>${b}</small></span></div>`).join('')}</div>
  </div>
  <svg class="viz" viewBox="0 0 900 760">
    <g data-in="${st('safety', 0.5)}" data-from="z" ${k([[A.two - 0.6, { o: 1, x: 0 }], [A.two, { o: 0, x: -60 }]])}>
      <g data-float="8,7,0">
        <path d="M470 120 q190 0 210 190 q14 150 -110 250 q-110 84 -200 20 q-70 -54 -20 -130 q40 -60 30 -110 q-12 -60 -40 -110 q-30 -110 130 -110 z" fill="#b9603f" filter="url(#shadow)"/>
        <path d="M470 120 q190 0 210 190 q14 150 -110 250 q-110 84 -200 20 q-70 -54 -20 -130 q40 -60 30 -110 q-12 -60 -40 -110 q-30 -110 130 -110 z" fill="url(#gloss)"/>
        <path d="M400 360 q-60 30 -70 120 q-6 90 -10 190" fill="none" stroke="#d8b876" stroke-width="26" stroke-linecap="round"/>
      </g>
      ${Array.from({ length: 6 }, (_, i) => `<g ${k(Array.from({ length: 8 }, (_, j) => [[T.safety.s + i * 0.5 + j * 3, { x: 0, y: 0, o: 0, e: 'lin' }], [T.safety.s + i * 0.5 + j * 3 + 0.3, { x: 40, y: 20, o: 1, e: 'lin' }], [T.safety.s + i * 0.5 + j * 3 + 2.4, { x: 250, y: 240, o: 1, e: 'lin' }], [T.safety.s + i * 0.5 + j * 3 + 2.8, { x: 240, y: 420, o: 0 }]]).flat())}><circle cx="${90 + (i % 3) * 30}" cy="${130 + (i % 2) * 44}" r="15" fill="url(#gold)"/></g>`).join('')}
    </g>
    <g data-in="${A.two}" data-from="z">
      <circle cx="450" cy="380" r="270" fill="#0e2421" stroke="#d8b876" stroke-width="6" filter="url(#shadow)"/>
      ${Array.from({ length: 12 }, (_, i) => `<rect x="446" y="130" width="8" height="${i % 3 ? 16 : 30}" rx="4" fill="#d8b876" opacity="${i % 3 ? 0.5 : 0.95}" transform="rotate(${i * 30} 450 380)"/>`).join('')}
      <path d="M450 150 A230 230 0 0 1 649.2 265" fill="none" stroke="#7cc47e" stroke-width="22" stroke-linecap="round" pathLength="1" data-draw="${r2(A.two + 0.3)}" data-dur="1.2" filter="url(#glowS)"/>
      <g transform="translate(450 150)">${capsule(0, 0, '#a9813c', '#d8b876', 0, 120, 50)}</g>
      <g data-pop="${r2(A.two + 1.4)}" data-org="649px 265px"><g transform="translate(649 265)">${capsule(0, 0, '#3c6fa0', '#9cc3e6', 60, 120, 50)}</g></g>
      <text x="450" y="390" text-anchor="middle" class="t64 b cream">2 hours</text><text x="450" y="440" text-anchor="middle" class="t30 b dim">apart, at least</text>
    </g>
  </svg>`));

/* 18. When to see a doctor */
A.three = on('doctor', 'more than three months');
A.see = S('swell', on('doctor', 'see a doctor'), 0.9);
scenes.push(scene('doctor', 'split', `
  <div class="txt">
    ${head('doctor', 'When to see a doctor', 'Slept badly for <em>more than 3 months?</em>')}
    <p class="note" data-in="${on('doctor', 'Long-term insomnia')}">Long-term insomnia has proven treatments.<br>A supplement should not delay them.</p>
  </div>
  <svg class="viz" viewBox="0 0 900 760">
    ${[0, 1, 2].map((i) => { const t = S('flip', A.three + i * 0.4, 0.8); return `<g ${k([[t, { y: -80, o: 0, r: -8 }], [t + 0.5, { y: 0, o: 1, r: [-5, 2, 6][i], e: 'back' }], [A.see, {}], [A.see + 0.6, { x: -30, o: 0.35 }]])}>
      <rect x="${40 + i * 120}" y="${150 + i * 70}" width="250" height="280" rx="26" fill="#fbf9f5" filter="url(#shadow)"/><rect x="${40 + i * 120}" y="${150 + i * 70}" width="250" height="70" rx="26" fill="#e07a5f"/>
      <text x="${165 + i * 120}" y="${198 + i * 70}" text-anchor="middle" class="t28 b cream">Month ${i + 1}</text>
      ${Array.from({ length: 20 }, (_, d) => `<circle cx="${82 + i * 120 + (d % 5) * 42}" cy="${262 + i * 70 + Math.floor(d / 5) * 40}" r="10" fill="${d % 3 ? '#c9d3d0' : '#5d6865'}"/>`).join('')}</g>`; }).join('')}
    <g data-in="${A.see}" data-from="r">
      <path d="M560 150 h270 v520 h-270 z" fill="url(#gold)" filter="url(#glowS)"/>
      <path d="M560 150 h270 v520 h-270 z" fill="#0e2421" data-org="560px 410px" ${k([[A.see + 0.2, { sx: 1, e: 'io' }], [A.see + 1.3, { sx: 0.3 }]])}/>
      <rect x="548" y="138" width="294" height="544" rx="10" fill="none" stroke="#fbf9f5" stroke-width="10"/>
      <g data-pop="${r2(A.see + 1.1)}" data-org="735px 400px"><circle cx="735" cy="400" r="70" fill="#183b37"/><path d="M735 360 v80 M695 400 h80" stroke="#fbf9f5" stroke-width="20" stroke-linecap="round"/></g>
    </g>
  </svg>`));

/* 19. The basics */
const basics = [
  ['A regular sleep window', 'a regular sleep window', '<circle r="34" fill="none" stroke="currentColor" stroke-width="9"/><path d="M0 -18 V0 L14 10" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>'],
  ['Less caffeine late in the day', 'less caffeine', '<path d="M-28 -14 h44 v22 a22 22 0 0 1 -44 0 z" fill="currentColor"/><path d="M16 -8 h8 a10 10 0 0 1 0 20 h-10" fill="none" stroke="currentColor" stroke-width="7"/><path d="M-40 34 L34 -36" stroke="#e07a5f" stroke-width="9" stroke-linecap="round"/>'],
  ['A dark, cool room', 'a dark, cool room', '<path d="M14 -34 a36 36 0 1 0 22 50 a28 28 0 0 1 -22 -50 z" fill="currentColor"/>'],
];
scenes.push(scene('habits', 'stack', `
  ${head('habits', 'The basics', 'These still <em>matter more.</em>')}
  <div class="cards3">
    ${basics.map(([title, phrase, icon]) => { const t = S('pop', on('habits', phrase), 0.7); return `<div class="hc" data-in="${t}" data-from="z"><svg viewBox="-60 -60 120 120" style="color:#d8b876"><circle r="58" fill="#183b37"/>${icon}</svg><b>${title}</b></div>`; }).join('')}
  </div>`));

/* 20. Verdict */
const verdicts = [
  ['Worth a try if your diet is low in it', 'worth a try'], ['Expect a small effect', 'Expect a small effect'],
  ['Stay under 350 mg a day from supplements', 'stay under'], ['Judge it after four weeks', 'judge it after'],
];
A.src = S('swell', on('verdict', 'Sources are'), 0.8);
scenes.push(scene('verdict', 'split tight', `
  <div class="txt wide">
    ${head('verdict', 'The verdict', 'Cheap, safe for most, and <em>modest.</em>')}
    <div class="checks">${verdicts.map(([v, p]) => { const t = S('tick', on('verdict', p), 0.9); return `<div class="ck" data-in="${t}" data-from="l"><svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="28" fill="#183b37" stroke="#7cc47e" stroke-width="3"/>${tick(28, 30, 0.9, r2(t + 0.15))}</svg>${v}</div>`; }).join('')}</div>
  </div>
  <div class="end" data-in="${A.src}" data-from="z">
    <div class="lockup"><span class="mark"><i></i><i></i><i></i><i></i></span>SharpAndLean</div>
    <p class="url">sharpandlean.com</p>
    <p class="by">Script checked by <b>Sumita Bhatti</b>, Clinical Nutritionist</p>
    <p class="srcs">Sources in the description</p>
    <p class="fine">General information, not medical advice. Speak to a pharmacist or doctor before starting a supplement, especially if you have kidney disease or take regular medication.</p>
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

const html = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>Magnesium for sleep: what it can and can't do</title><style>${css}</style></head><body>
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
