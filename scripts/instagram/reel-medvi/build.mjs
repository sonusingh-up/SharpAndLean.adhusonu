/*
 * Writes .out/video.html and .out/timeline.json for the Instagram reel
 * "MEDVi Weight Loss review" (1080×1920).
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
const LEAD = 0.2; // scene is on screen this long before the voice starts
const TAIL = 0.25; // and this long after it stops
const HOLD = 1.6; // extra time on the last scene
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
    const parts = Math.ceil(words.length / 6);
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
const vial = `data:image/webp;base64,${b64(join(here, 'assets', 'medvi.webp'))}`;
// A line of text that rises into place from behind a mask.
const rise = (text, t) => `<span class="ln"><span data-rise="${r2(t)}">${text}</span></span>`;
const H = (id, kicker, lines, cls = '') => `
  <p class="kicker" data-in="${st(id, 0.2)}">${kicker}</p>
  <h2 class="h2 ${cls}">${lines.map((l, i) => rise(l, st(id, 0.25 + i * 0.12))).join('')}</h2>`;
const row = (t, mark, title, sub = '') => `<div class="row" data-in="${S('tick', t, 0.5)}" data-from="l"><i>${mark}</i><span>${title}${sub ? `<small>${sub}</small>` : ''}</span></div>`;
const heart = '<svg viewBox="0 0 64 64"><path d="M32 54C12 40 6 30 6 21a13 13 0 0 1 26-3 13 13 0 0 1 26 3c0 9-6 19-26 33z" fill="#e07a5f"/></svg>';

/* 1. Hook: product and title on screen from the first frame */
S('shimmer', 0.1, 0.4);
A.sc = S('chime', on('hook', 'four point two'), 0.6);
scenes.push(scene('hook', 'c-paper', `
  <p class="kicker" data-in="-2">Review</p>
  <h1 class="h2 xl">${rise('MEDVi', -2)}${rise('<em>Weight Loss</em>', -2)}</h1>
  <div class="heroRow">
    <div class="shot" ${k([[0, { s: 0.94 }], [0.7, { s: 1, e: 'io' }]])}><img src="${vial}" alt=""></div>
    <div class="score" data-in="${A.sc}" data-from="z">
      <svg viewBox="0 0 300 300"><circle cx="150" cy="150" r="128" fill="none" stroke="rgba(28,42,40,.12)" stroke-width="18"/><circle cx="150" cy="150" r="128" fill="none" stroke="#e07a5f" stroke-width="18" stroke-linecap="round" pathLength="1" data-draw="${A.sc}" data-dur="1.1" data-to="0.42" transform="rotate(-90 150 150)"/></svg>
      <b><span data-count="4.2" data-at="${A.sc}" data-dur="1.1" data-dec="1">0.0</span></b><span>out of 10</span>
    </div>
  </div>`));

/* 2. What it is */
scenes.push(scene('what', 'c-sky', `
  ${H('what', 'What it is', ['A storefront,', '<em>not a clinic.</em>'])}
  <div class="rows">
    ${row(on('what', 'a telehealth storefront'), '1', 'MEDVi runs the website and the ads')}
    ${row(on('what', 'It is not'), '2', 'An outside clinician network prescribes')}
    ${row(on('what', 'or a pharmacy'), '3', 'Outside pharmacies make and ship it')}
  </div>`));

/* 3. What works */
A.n = S('chime', on('good', 'by about fifteen'), 0.5);
scenes.push(scene('good', 'c-sage', `
  ${H('good', 'What works', ['The drugs', '<em>themselves.</em>'])}
  <div class="big" data-in="${A.n}"><b><span data-count="14.9" data-at="${A.n}" data-dur="1" data-dec="1">0.0</span>%</b></div>
  <p class="note" data-in="${r2(A.n + 0.3)}">Mean weight loss on branded semaglutide over 68 weeks, in the STEP 1 trial.</p>`));

/* 4. The catch */
scenes.push(scene('comp', 'c-peach', `
  ${H('comp', 'The catch', ['Compounded,', '<em>not FDA-reviewed.</em>'])}
  <div class="lab bad" data-in="${S('warn', on('comp', 'compounded versions'), 0.3)}"><i>×</i><span>Compounded injections<small>Not reviewed by the FDA for safety, effectiveness or quality</small></span></div>
  <div class="lab bad" data-in="${S('warn', on('comp', 'And we found'), 0.3)}"><i>×</i><span>“GLP-1 tablets”<small>We found no published human evidence</small></span></div>`));

/* 5. The record */
scenes.push(scene('fda', 'c-butter', `
  ${H('fda', 'The record', ['An FDA', '<em>warning letter.</em>'])}
  <div class="letter" data-in="${S('stamp', on('fda', 'a warning letter'), 0.5)}"><p class="eyebrow">20 February 2026</p><b>Addressed to MEDVi, LLC</b><span>Over labelling of compounded semaglutide and tirzepatide</span></div>
  <p class="note" data-in="${on('fda', 'Medvi says')}">MEDVi says it concerned an affiliate’s website.</p>`));

/* 6. The price */
scenes.push(scene('price', 'dark', `
  ${H('price', 'The price', ['The same price,', '<em>bought direct.</em>'])}
  <div class="duo">
    <div class="sp" data-in="${st('price', 0.8)}"><p class="eyebrow">MEDVi compounded refill</p><b>$299</b><span>a month</span></div>
    <div class="sp" data-in="${S('chime', on('price', 'two hundred'), 0.5)}"><p class="eyebrow">Approved Wegovy pill, direct</p><b>$299</b><span>a month, at maintenance</span></div>
  </div>`));

/* 7. Call to action */
S('swell', st('cta', 0.2), 0.5);
A.like = S('pop', on('cta', 'Like and follow'), 0.6);
scenes.push(scene('cta', 'c-sage centre', `
  <div class="lockup" data-in="${st('cta', 0.25)}"><span class="mark"><i></i><i></i><i></i><i></i></span>SharpAndLean</div>
  <h2 class="h2">${rise('The full review', st('cta', 0.35))}${rise('<em>at sharpandlean.com</em>', st('cta', 0.47))}</h2>
  <div class="acts">
    <span class="like" ${k([[A.like, { s: 0, o: 0 }], [A.like + 0.3, { s: 1.25, o: 1, e: 'back' }], [A.like + 0.55, { s: 1 }], [A.like + 1.1, { s: 1 }], [A.like + 1.3, { s: 1.18, e: 'io' }], [A.like + 1.5, { s: 1, e: 'io' }]])}>${heart}Like</span>
    <span class="srcs" data-pop="${r2(A.like + 0.25)}">Follow @sharpandlean</span>
  </div>
  <p class="fine" data-in="${st('cta', 0.9)}">A desk review: nothing was purchased. General information, not medical advice.</p>`));

/* scene changes */
script.lines.slice(1).forEach((l) => S('whoosh', T[l.id].s - 0.3, 0.22));

/* ---------- page ---------- */

const css = `
${fonts}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;overflow:hidden;background:#fbf9f5}
body{font-family:'DM Sans',sans-serif;color:#1c2a28;position:relative}
em{font-family:'Newsreader',serif;font-style:italic;font-weight:400;color:#2f7c72}
#sky,#aur,#aur2,#dust,#vig,#rail{display:none}
#bar{position:absolute;left:0;right:0;top:0;height:10px;background:rgba(28,42,40,.1);z-index:60}
#bar i{display:block;height:100%;width:0;background:#183b37}
#logo{position:absolute;left:70px;top:210px;z-index:60;display:flex;align-items:center;gap:16px;font-weight:700;font-size:42px;letter-spacing:-.01em;color:#1c2a28}
.mark{display:grid;grid-template-columns:21px 21px;gap:6px}
.mark i{width:21px;height:21px;border-radius:6px;background:currentColor}
.mark i:last-child{background:#7cc47e}
#cap{position:absolute;left:0;right:0;bottom:340px;z-index:60;text-align:center}
#cap span{display:inline-block;max-width:920px;padding:16px 36px;border-radius:999px;background:#fff;font-size:46px;line-height:1.25;font-weight:500;color:rgba(28,42,40,.45)}
#cap u{text-decoration:none;color:#1c2a28}
#cap u.now{color:#2f7c72}
body.dk #logo{color:#fbf9f5}
body.dk #bar{background:rgba(251,249,245,.14)}body.dk #bar i{background:#d8b876}

.scene{position:absolute;inset:0;display:none}
.c-paper{background:#fbf9f5}.c-sage{background:#dcebe6}.c-butter{background:#f6e8c9}.c-peach{background:#f8dccd}.c-blush{background:#fbe6e0}
.dark{background:#183b37;color:#fbf9f5}.dark em{color:#d8b876}
.cam{position:absolute;inset:0;padding:300px 70px 470px;display:flex;flex-direction:column;justify-content:center}
.centre>.cam{align-items:center;text-align:center}
.ln{display:block;overflow:hidden;padding-bottom:.14em;margin-bottom:-.14em}
.ln>span{display:block}
.kicker,.eyebrow{font-size:32px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#a9813c}
.dark .kicker,.dark .eyebrow{color:#d8b876}
.kicker u{text-decoration:none;margin-right:22px;padding-right:22px;border-right:3px solid currentColor}
.h2{margin-top:22px;font-size:104px;line-height:1.04;font-weight:300;letter-spacing:-.035em}
.h2.xl{font-size:132px;letter-spacing:-.04em}
.note{margin-top:50px;font-size:46px;line-height:1.3;color:#3d4c48}

.trio{margin-top:70px;display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.tile{height:450px;border-radius:36px;background:#fff;display:grid;place-items:center}
.tile img{max-width:240px;max-height:360px}

.chips{margin-top:80px;display:grid;gap:22px;justify-items:start}
.chip{padding:24px 48px;border-radius:999px;border:3px solid rgba(251,249,245,.4);font-size:56px;letter-spacing:-.01em}

.prod .h2{font-size:100px}
.pack{position:relative;margin-top:44px;height:590px;border-radius:48px;background:#fff;display:grid;place-items:center}
.pack img{max-width:460px;max-height:500px}
.fit{position:absolute;left:30px;top:30px;padding:14px 30px;border-radius:999px;font-size:32px;font-weight:600;background:#183b37;color:#fbf9f5}
.fit.mixed{background:#a9813c}.fit.poor{background:#c25a3f}
.stats{margin-top:44px;display:grid;grid-template-columns:1fr 1fr;gap:40px}
.sp{padding-top:24px;border-top:3px solid rgba(28,42,40,.2)}
.sp b{display:block;margin-top:8px;font-size:120px;font-weight:500;letter-spacing:-.04em;line-height:1;white-space:nowrap}
.sp.sm b{font-size:96px}
.sp span{display:block;margin-top:10px;font-size:34px;line-height:1.2;color:#3d4c48}

.versus{margin-top:70px;display:grid;gap:50px}
.vs{padding-top:28px;border-top:3px solid rgba(251,249,245,.3)}
.vs b{display:block;margin-top:6px;font-size:190px;font-weight:300;letter-spacing:-.045em;line-height:1}
.vs span{display:block;margin-top:10px;font-size:48px;color:#d6e2de}
.vs strong{color:#d8b876;font-weight:600}

.c-sky{background:#dfe9ee}.c-leaf{background:#e3eed9}
.art{margin-top:40px;transform-origin:50% 50%}
.caps{display:block;width:100%;height:420px;overflow:visible}
.big{margin-top:60px;display:flex;align-items:baseline;gap:34px}
.big b{white-space:nowrap;font-size:300px;line-height:.82;font-weight:300;letter-spacing:-.06em;color:#183b37;font-variant-numeric:tabular-nums}
.big>span{font-size:50px;line-height:1.1;color:#3d4c48;max-width:360px}
.res{margin-top:50px;display:flex;align-items:center;gap:24px;padding:30px 36px;border-radius:34px;background:#fff;font-size:48px;font-weight:500;letter-spacing:-.02em;line-height:1.15}
.res svg{flex:none;width:76px;height:76px}
.fine2{margin-top:30px;font-size:30px;color:#5d6865}
.duo{margin-top:60px;display:grid;grid-template-columns:1fr 1fr;gap:40px}
.duo .sp b{font-size:170px;font-weight:300}
.duo .sp span{font-size:46px}
.warnbar{margin-top:56px;display:flex;align-items:center;gap:26px;padding:28px 34px;border-radius:30px;background:#fbe6e0;border:3px solid #e07a5f;color:#8f3f28;font-size:44px;font-weight:500;line-height:1.15;letter-spacing:-.015em}
.warnbar i{flex:none;width:70px;height:70px;border-radius:50%;background:#e07a5f;color:#fff;display:grid;place-items:center;font-style:normal;font-weight:700;font-size:44px}
.c-blush .warnbar{background:#fff}
.rows{margin-top:60px}
.row{display:flex;align-items:center;gap:30px;padding:36px 0;border-top:3px solid rgba(28,42,40,.16);font-size:58px;letter-spacing:-.02em;line-height:1.1}
.row:last-child{border-bottom:3px solid rgba(28,42,40,.16)}
.row i{flex:0 0 80px;font-family:'Newsreader',serif;font-style:italic;font-size:84px;color:#2f7c72;text-align:center;line-height:1}
.row small{display:block;margin-top:8px;font-size:34px;color:#5d6865;letter-spacing:0}
.dark .note{color:#d6e2de;font-size:54px}
.pills{margin-top:70px;display:flex;flex-wrap:wrap;gap:22px}
.pill{padding:26px 46px;border-radius:999px;background:#fff;font-size:58px;font-weight:500;letter-spacing:-.02em;transform-origin:left center}
.lab{margin-top:44px;display:flex;align-items:center;gap:30px;padding:36px 40px;border-radius:36px;background:#fff;font-size:56px;font-weight:500;letter-spacing:-.02em;border:3px solid transparent}
.lab+.lab{margin-top:26px}
.lab i{flex:none;width:84px;height:84px;border-radius:50%;display:grid;place-items:center;font-style:normal;font-size:50px;font-weight:700;color:#fff;background:#2f7c72}
.lab.bad{border-color:#e07a5f}.lab.bad i{background:#e07a5f}
.lab small{display:block;margin-top:8px;font-size:34px;font-weight:400;color:#5d6865;letter-spacing:0}
.acts{margin-top:64px;display:flex;flex-direction:column;align-items:center;gap:26px}
.acts .srcs{margin-top:0}
.like{display:inline-flex;align-items:center;gap:16px;padding:20px 40px 20px 30px;border-radius:999px;background:#fff;font-size:50px;font-weight:600;transform-origin:50% 50%}
.like svg{width:64px;height:64px}
.centre .h2{font-size:88px}
.heroRow{margin-top:60px;display:grid;grid-template-columns:1fr 1fr;gap:30px;align-items:center}
.shot{height:560px;border-radius:44px;background:#fff;display:grid;place-items:center;overflow:hidden;transform-origin:50% 50%}
.shot img{max-width:88%;max-height:88%}
.score{position:relative;height:440px;display:grid;place-content:center;text-align:center}
.score svg{position:absolute;left:50%;top:50%;width:420px;height:420px;margin:-210px 0 0 -210px}
.score b{position:relative;font-size:170px;font-weight:500;letter-spacing:-.05em;line-height:1;color:#183b37;font-variant-numeric:tabular-nums}
.score>span{position:relative;font-size:38px;color:#5d6865}
.letter{margin-top:56px;padding:40px 44px;border-radius:36px;background:#fff;border:3px solid #e07a5f;transform-origin:left center}
.letter b{display:block;margin-top:12px;font-size:64px;font-weight:500;letter-spacing:-.025em;line-height:1.08}
.letter span{display:block;margin-top:14px;font-size:38px;line-height:1.25;color:#3d4c48}
.dark .duo .sp{border-color:rgba(251,249,245,.3)}.dark .duo .sp span{color:#d6e2de}
.dark .duo .sp b{color:#d8b876;font-weight:500;font-size:150px}
.dark .duo .eyebrow{min-height:84px;line-height:1.3}
.row{font-size:50px}
.lockup{display:inline-flex;align-items:center;gap:24px;font-size:88px;font-weight:700;letter-spacing:-.02em}
.lockup .mark{grid-template-columns:42px 42px;gap:12px}.lockup .mark i{width:42px;height:42px;border-radius:12px}
.centre .h2{margin-top:80px;font-size:96px}
.srcs{margin-top:70px;display:inline-block;padding:24px 50px;border-radius:999px;background:#183b37;color:#fbf9f5;font-size:50px;font-weight:600}
.fine{margin-top:50px;font-size:30px;line-height:1.4;color:#5d6865;max-width:760px}
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
    const pin=i===0?1:clamp((t-s.a+0.25)/0.5),pout=nx?clamp((t-nx.a+0.25)/0.5):0;
    if(t>=s.a)cur=s;
    if(pin<=0||pout>=1){s.el.style.display='none';continue}
    live.add(s.el);s.el.style.display='block';s.el.style.zIndex=2+i;
    const u=E.io(pin);s.el.style.clipPath=u<1?(i%2?'inset(0 0 0 '+((1-u)*100).toFixed(3)+'%)':'inset('+((1-u)*100).toFixed(3)+'% 0 0 0)'):'none';
    s.cam.style.transform=(i%2?'translateX('+((1-u)*120-E.io(pout)*0).toFixed(2)+'px)':'translateY('+((1-u)*90).toFixed(2)+'px)')+' scale('+(1+(1-u)*0.06-E.io(pout)*0.05).toFixed(4)+')';s.cam.style.opacity=(1-E.io(pout)*0.6).toFixed(3);
  }
  document.body.className=cur.el.classList.contains('dark')?'dk':'';
  for(const{el,sc}of rises){if(sc&&!live.has(sc))continue;const p=E.out(clamp((t-+el.dataset.rise)/0.6));el.style.transform='translateY('+((1-p)*108).toFixed(2)+'%)';}
  for(const{el,sc}of ins){if(sc&&!live.has(sc))continue;const p=E.out(clamp((t-+el.dataset.in)/0.55));const f=FROM[el.dataset.from||'u'];el.style.opacity=p;el.style.transform='translate('+((1-p)*f[0]).toFixed(2)+'px,'+((1-p)*f[1]).toFixed(2)+'px) scale('+(f[2]+(1-f[2])*p).toFixed(4)+')';}
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

const html = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>MEDVi Weight Loss review</title><style>${css}</style></head><body>
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
