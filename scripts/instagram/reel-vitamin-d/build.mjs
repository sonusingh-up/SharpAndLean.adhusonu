/*
 * Writes .out/video.html and .out/timeline.json for the Instagram reel
 * "Vitamin D: the unit trap" (1080×1920).
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
const LEAD = 0.25; // scene is on screen this long before the voice starts
const TAIL = 0.3; // and this long after it stops
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
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const winter = (i) => i < 3 || i > 8;
const drop = '<svg viewBox="0 0 120 120" fill="none" stroke="#183b37" stroke-width="4" stroke-linejoin="round"><path d="M60 14c18 26 30 42 30 58a30 30 0 0 1-60 0c0-16 12-32 30-58z" fill="#f6e8c9"/></svg>';

/* 1. Hook */
S('shimmer', st('hook', 0.2), 0.5);
scenes.push(scene('hook', '', `
  ${head('hook', 'Vitamin D', 'Check your <em>vitamin D label.</em>')}
  <div class="versus">
    <div class="card unit" data-in="${S('tick', on('hook', 'Micrograms'), 0.7)}" data-from="l"><b>mcg</b><span>micrograms</span></div>
    <div class="ne" data-pop="${S('stamp', on('hook', 'are not the same'), 0.5)}">≠</div>
    <div class="card unit" data-in="${S('tick', on('hook', 'I U are'), 0.7)}" data-from="r"><b>IU</b><span>international units</span></div>
  </div>`));

/* 2. The conversion */
const conv = [['1', '40', 'One microgram'], ['10', '400', 'ten micrograms is'], ['25', '1,000', 'twenty-five']];
scenes.push(scene('conv', '', `
  ${head('conv', 'The conversion', '1 microgram <em>is 40 IU.</em>')}
  <div class="card tbl" data-in="${st('conv', 0.4)}">
    <div class="th"><span>Micrograms</span><span></span><span>IU</span></div>
    ${conv.map(([a, b, p]) => `<div class="tr" data-in="${S('tick', on('conv', p), 0.7)}" data-from="l"><b>${a}</b><i>=</i><b>${b}</b></div>`).join('')}
  </div>`));

/* 3. The trap */
scenes.push(scene('trap', 'sm', `
  ${head('trap', 'The unit trap', 'Mix them up, and you take <em>far more than you meant to.</em>')}
  <div class="card eg ok" data-in="${st('trap', 0.7)}"><p class="eyebrow">A label that says</p><b>1,000 IU</b><span>is 25 micrograms</span></div>
  <div class="card eg bad" data-in="${S('warn', on('trap', 'far more'), 0.4)}"><p class="eyebrow">But 1,000 micrograms</p><b>40,000 IU</b><span>ten times the adult upper limit</span></div>`));

/* 4. The dose */
A.oct = S('whoosh', on('dose', 'from October'), 0.4);
scenes.push(scene('dose', '', `
  ${head('dose', 'How much', 'Most UK adults: <em>10 micrograms a day.</em>')}
  <div class="stat" data-in="${S('chime', on('dose', 'ten micrograms'), 0.7)}"><b>10 mcg</b><span>= 400 IU</span></div>
  <div class="card months" data-in="${st('dose', 0.8)}">
    <p class="eyebrow">October to March</p>
    <div class="mrow">${MONTHS.map((m, i) => `<div class="m">${m}${winter(i) ? `<u data-in="${r2(A.oct + ((i + 3) % 12) * 0.06)}" data-from="z">${m}</u>` : ''}</div>`).join('')}</div>
  </div>`));

/* 5. The upper limit */
A.lim = S('swell', on('limit', 'one hundred micrograms'), 0.5);
scenes.push(scene('limit', '', `
  ${head('limit', 'The upper limit', 'For adults, <em>100 micrograms a day.</em>')}
  <div class="gauge" data-in="${st('limit', 0.4)}">
    <u ${k([[A.lim, { sx: 0 }], [A.lim + 1.2, { sx: 1, e: 'io' }]])}></u><div class="over"></div>
    <div class="mk l" style="left:8%"><div data-in="${r2(A.lim + 0.2)}"><span>10 mcg<small>the daily dose</small></span><i></i></div></div>
    <div class="mk red" style="left:80%"><div data-in="${r2(A.lim + 1.1)}"><span>100 mcg<small>the upper limit</small></span><i></i></div></div>
  </div>
  <div class="stat" data-in="${S('tick', on('limit', 'four thousand'), 0.7)}"><b>100 mcg</b><span>= 4,000 IU</span></div>`));

/* 6. The form */
scenes.push(scene('form', '', `
  ${head('form', 'Which form', 'Plain vitamin D3 <em>is all most people need.</em>')}
  <div class="card d3" data-in="${S('chime', on('form', 'a plain vitamin'), 0.6)}">${drop}<div><b>Vitamin D3</b><span>No extras needed</span></div></div>`));

/* 7. Call to action */
A.cta = S('swell', st('cta', 0.2), 0.6);
scenes.push(scene('cta', 'centre', `
  <div class="lockup" data-in="${A.cta}" data-from="z"><span class="mark"><i></i><i></i><i></i><i></i></span>SharpAndLean</div>
  <p class="h2" data-in="${st('cta', 0.4)}">The full video is on <em>our YouTube channel.</em></p>
  <p class="srcs" data-pop="${S('pop', on('cta', 'Follow'), 0.6)}">Follow @sharpandlean</p>
  <p class="fine" data-in="${st('cta', 0.8)}">General information, not medical advice.</p>`));

/* scene changes */
script.lines.slice(1).forEach((l) => S('whoosh', T[l.id].s - 0.12, 0.28));

/* ---------- page ---------- */

const css = `
${fonts}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;overflow:hidden;background:#fbf9f5}
body{font-family:'DM Sans',sans-serif;color:#1c2a28;position:relative}
em{font-family:'Newsreader',serif;font-style:italic;font-weight:400;color:#2f7c72}
#sky{position:absolute;inset:0;background:#fbf9f5}
#aur{position:absolute;right:-520px;top:-420px;width:1400px;height:1300px;border-radius:50%;background:radial-gradient(closest-side,rgba(243,181,150,.42),rgba(243,181,150,0))}
#aur2{position:absolute;left:-560px;bottom:-460px;width:1400px;height:1300px;border-radius:50%;background:radial-gradient(closest-side,rgba(47,124,114,.17),rgba(47,124,114,0))}
#dust,#vig,#rail{display:none}
#bar{position:absolute;left:0;right:0;top:0;height:10px;background:#e8e1d5;z-index:7}
#bar i{display:block;height:100%;width:0;background:#2f7c72}
#logo{position:absolute;left:72px;top:230px;z-index:7;display:flex;align-items:center;gap:16px;font-weight:700;font-size:44px;letter-spacing:-.01em}
.mark{display:grid;grid-template-columns:22px 22px;gap:6px}
.mark i{width:22px;height:22px;border-radius:6px;background:currentColor}
.mark i:last-child{background:#7cc47e}
#cap{position:absolute;left:0;right:0;bottom:450px;z-index:7;text-align:center}
#cap span{display:inline-block;max-width:900px;padding:16px 34px;border-radius:24px;background:#183b37;font-size:48px;line-height:1.25;font-weight:500;color:rgba(251,249,245,.55)}
#cap u{text-decoration:none;color:#fbf9f5}
#cap u.now{color:#d8b876}
.scene{position:absolute;inset:0;display:none;z-index:2}
.cam{position:absolute;inset:0;padding:340px 72px 660px;display:flex;flex-direction:column;justify-content:center;transform-origin:50% 50%}
.centre>.cam{align-items:center;text-align:center}
.kicker,.eyebrow{font-size:32px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#a9813c}
.h2{margin-top:20px;font-size:104px;line-height:1.05;font-weight:300;letter-spacing:-.025em}
.card,.stat{background:#fff;border:2px solid #e8e1d5;box-shadow:0 10px 0 0 #e8e1d5;border-radius:34px}
.versus{margin-top:60px;display:grid;grid-template-columns:1fr 110px 1fr;align-items:center}
.unit{padding:44px 20px;text-align:center}
.unit b{display:block;font-size:130px;line-height:1;font-weight:500;letter-spacing:-.04em;color:#183b37}
.unit span{display:block;margin-top:12px;font-size:32px;color:#5d6865}
.ne{text-align:center;font-size:120px;font-weight:300;color:#e07a5f}
.tbl{margin-top:56px;padding:34px 50px 16px}
.th,.tr{display:grid;grid-template-columns:1fr 90px 1fr;align-items:center}
.th{font-size:28px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#a9813c;padding-bottom:18px;border-bottom:2px solid #e8e1d5}
.th span:last-child,.tr b:last-child{text-align:right}
.tr{padding:26px 0;border-bottom:2px solid #f3efe7;font-size:124px;line-height:1;letter-spacing:-.03em}
.tr:last-child{border-bottom:0}
.tr b{font-weight:300}.tr b:last-child{font-weight:500;color:#2f7c72}
.tr i{font-style:normal;font-size:64px;color:#a9813c;text-align:center}
.eg{margin-top:44px;padding:34px 44px}
.eg+.eg{margin-top:28px}
.eg b{display:block;margin-top:8px;font-size:110px;line-height:1;font-weight:500;letter-spacing:-.04em;color:#183b37}
.eg span{display:block;margin-top:10px;font-size:40px;color:#3d4c48}
.sm .h2{font-size:84px}.sm .eg{margin-top:34px;padding:26px 40px}.sm .eg+.eg{margin-top:24px}.sm .eg b{font-size:92px}.sm .eg span{font-size:36px}
.eg.bad{background:#fbe9e2;border-color:#e07a5f;box-shadow:0 10px 0 0 #e07a5f}
.eg.bad b,.eg.bad span{color:#9c432b}
.stat{margin-top:50px;align-self:flex-start;display:inline-flex;align-items:baseline;gap:26px;padding:30px 46px}
.stat b{font-size:130px;line-height:1;font-weight:500;letter-spacing:-.04em;color:#183b37;white-space:nowrap}
.stat span{font-size:60px;font-weight:700;color:#2f7c72;white-space:nowrap}
.months{margin-top:36px;padding:34px 38px}
.mrow{margin-top:22px;display:grid;grid-template-columns:repeat(6,1fr);gap:12px}
.m{position:relative;height:96px;border-radius:18px;background:#f3efe7;display:grid;place-items:center;font-size:32px;font-weight:600;color:#5d6865}
.m u{position:absolute;inset:0;border-radius:18px;background:#2f7c72;color:#fff;display:grid;place-items:center;text-decoration:none}
.gauge{position:relative;margin-top:210px;height:76px;border-radius:38px;background:#f3efe7;border:2px solid #e8e1d5}
.gauge>u{position:absolute;left:0;top:0;bottom:0;width:80%;border-radius:38px 0 0 38px;background:#2f7c72;transform-origin:0 50%}
.over{position:absolute;left:80%;right:0;top:0;bottom:0;border-radius:0 38px 38px 0;background:repeating-linear-gradient(135deg,#f3b596 0 16px,#fbe3d8 16px 32px)}
.mk{position:absolute;top:-150px;bottom:-16px;width:0}
.mk>div{position:absolute;inset:0}
.mk i{position:absolute;left:-3px;top:132px;bottom:0;width:6px;border-radius:3px;background:#1c2a28}
.mk span{position:absolute;top:0;font-size:46px;font-weight:600;line-height:1.15;white-space:nowrap}
.mk small{display:block;font-size:32px;font-weight:400;color:#5d6865}
.mk.l span{left:-60px}
.mk.red span{right:-160px;text-align:right;color:#9c432b}.mk.red i{background:#e07a5f}
.d3{margin-top:56px;padding:40px 46px;display:flex;align-items:center;gap:36px}
.d3 svg{flex:none;width:170px;height:170px}
.d3 b{display:block;font-size:84px;font-weight:500;letter-spacing:-.03em;color:#183b37}
.d3 span{display:block;margin-top:6px;font-size:40px;color:#3d4c48}
.lockup{display:inline-flex;align-items:center;gap:24px;font-size:92px;font-weight:700;letter-spacing:-.02em}
.lockup .mark{grid-template-columns:44px 44px;gap:12px}.lockup .mark i{width:44px;height:44px;border-radius:12px}
.centre .h2{margin-top:70px;font-size:92px}
.srcs{margin-top:60px;display:inline-block;padding:22px 46px;border-radius:999px;background:#183b37;color:#fbf9f5;font-size:48px;font-weight:600}
.fine{margin-top:44px;font-size:32px;color:#5d6865}
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

const html = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>Vitamin D: the unit trap</title><style>${css}</style></head><body>
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
