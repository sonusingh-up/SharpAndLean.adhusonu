/*
 * Writes .out/video.html and .out/timeline.json for the Instagram reel
 * "Best ashwagandha brands: the top three" (1080×1920).
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
const jpg = (file) => `data:image/jpeg;base64,${b64(join(here, 'assets', file))}`;
// A line of text that rises into place from behind a mask.
const rise = (text, t) => `<span class="ln"><span data-rise="${r2(t)}">${text}</span></span>`;
const H = (id, kicker, lines, cls = '') => `
  <p class="kicker" data-in="${st(id, 0.2)}">${kicker}</p>
  <h2 class="h2 ${cls}">${lines.map((l, i) => rise(l, st(id, 0.25 + i * 0.12))).join('')}</h2>`;

/* 1. Hook: everything is on screen from the first frame */
S('shimmer', 0.1, 0.4);
scenes.push(scene('hook', 'c-paper', `
  <p class="kicker" data-in="-2">2026 buying guide</p>
  <h1 class="h2 xl">${rise('6 ashwagandha', -2)}${rise('labels.', -2)}${rise('<em>3 worth buying.</em>', on('hook', 'These three', -0.2))}</h1>
  <div class="trio">${['now-ksm66', 'jarrow', 'now-450'].map((p, i) => `<div class="tile" ${k([[0, { y: 0, s: 1 }], [on('hook', 'These three') + i * 0.1, { y: 0, s: 1 }], [on('hook', 'These three') + 0.3 + i * 0.1, { y: -22, s: 1.05, e: 'io' }], [on('hook', 'These three') + 0.75 + i * 0.1, { y: 0, s: 1, e: 'io' }]])}><img src="${jpg(p + '.jpg')}" alt=""></div>`).join('')}</div>`));

/* 2. The rule */
scenes.push(scene('rule', 'dark', `
  ${H('rule', 'The rule', ['Buy the', 'extract,', '<em>not the brand.</em>'], 'xl')}
  <div class="chips">
    <span class="chip" data-in="${S('tick', on('rule', 'a named root extract'), 0.5)}">A named root extract</span>
    <span class="chip" data-in="${S('tick', on('rule', 'three hundred to six'), 0.5)}">300–600 mg a day</span>
  </div>`));

/* 3–5. The three picks */
const prod = (id, cls, n, award, name, img, stats, fit, tone) => scene(id, `${cls} prod`, `
  <p class="kicker" data-in="${st(id, 0.2)}"><u>${n} / 03</u>${award}</p>
  <h2 class="h2">${name.map((l, i) => rise(l, st(id, 0.25 + i * 0.12))).join('')}</h2>
  <div class="pack" data-in="${st(id, 0.35)}" data-from="z"><img src="${jpg(img)}" alt=""><span class="fit ${tone}" data-in="${st(id, 1)}">${fit}</span></div>
  <div class="stats">${stats.map(([l, v, note, p, c]) => `<div class="sp ${c || ''}" data-in="${S('tick', on(id, p), 0.5)}"><p class="eyebrow">${l}</p><b>${v}</b><span>${note}</span></div>`).join('')}</div>`);
S('chime', st('p1', 0.3), 0.5);
scenes.push(prod('p1', 'c-sage', '01', 'Best overall', ['NOW KSM-66', '<em>600 mg</em>'], 'now-ksm66.jpg',
  [['Daily dose', '600 mg', '1 capsule a day', 'One capsule a day'], ['Cost a day', '$0.37', 'List price', 'About thirty-seven']], 'Matches the trials', 'good'));
scenes.push(prod('p2', 'c-butter', '02', 'Best split dose', ['Jarrow Formulas', '<em>300 mg</em>'], 'jarrow.jpg',
  [['Daily dose', '600 mg', '1 capsule, twice a day', 'One capsule twice'], ['Cost a day', '$0.42', 'List price', 'About forty-two']], 'Matches the trials', 'good'));
scenes.push(prod('p3', 'c-peach', '03', 'Best budget', ['NOW Ashwagandha', '<em>450 mg</em>'], 'now-450.jpg',
  [['Cost a day', '$0.19', 'List price', 'Nineteen cents'], ['The trade-off', 'Generic', 'Not an extract the trials tested', 'But it is not', 'sm']], 'Partly matches', 'mixed'));

/* 6. Gummies */
scenes.push(scene('gummy', 'c-blush prod', `
  ${H('gummy', 'And the gummies?', ['Goli gummies', '<em>cost far more.</em>'])}
  <div class="pack" data-in="${st('gummy', 0.35)}" data-from="z"><img src="${jpg('goli.jpg')}" alt=""><span class="fit poor" data-in="${st('gummy', 1)}">4× the capsules</span></div>
  <div class="stats">
    <div class="sp" data-in="${S('warn', on('gummy', 'About a dollar'), 0.3)}"><p class="eyebrow">Cost a day</p><b>$1.67</b><span>List price, 4 gummies</span></div>
    <div class="sp" data-in="${S('tick', on('gummy', 'eight grams'), 0.5)}"><p class="eyebrow">Sugar a day</p><b>8 g</b><span>At the full dose</span></div>
  </div>`));

/* 7. Milligrams */
scenes.push(scene('mg', 'dark', `
  ${H('mg', 'Remember', ['A bigger number', '<em>is not a stronger product.</em>'])}
  <div class="versus">
    <div class="vs" data-in="${S('tick', st('mg', 0.9), 0.5)}"><p class="eyebrow">Gaia Herbs capsule</p><b>350 mg</b><span><strong>2.5 mg</strong> of withanolides</span></div>
    <div class="vs" data-in="${S('chime', on('mg', 'is not a stronger'), 0.5)}"><p class="eyebrow">KSM-66 capsule</p><b>600 mg</b><span>about <strong>30 mg</strong> of withanolides</span></div>
  </div>`));

/* 8. Safety */
scenes.push(scene('safety', 'c-peach', `
  ${H('safety', 'Before you buy any brand', ['Not if you are', '<em>pregnant or</em>', '<em>breastfeeding.</em>'], 'xl')}
  <p class="note" data-in="${S('warn', st('safety', 1.2), 0.3)}">Check with your doctor first if you have a thyroid or liver condition, or take regular medicines.</p>`));

/* 9. Call to action */
S('swell', st('cta', 0.2), 0.5);
scenes.push(scene('cta', 'c-sage centre', `
  <div class="lockup" data-in="${st('cta', 0.25)}"><span class="mark"><i></i><i></i><i></i><i></i></span>SharpAndLean</div>
  <h2 class="h2">${rise('All six, compared', st('cta', 0.35))}${rise('<em>on our YouTube channel.</em>', st('cta', 0.47))}</h2>
  <p class="srcs" data-pop="${S('pop', on('cta', 'Follow'), 0.5)}">Follow @sharpandlean</p>
  <p class="fine" data-in="${st('cta', 0.9)}">General information, not medical advice. Labels and list prices read 1 October 2026.</p>`));

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
    const u=E.io(pin);s.el.style.clipPath=u<1?'inset('+((1-u)*100).toFixed(3)+'% 0 0 0)':'none';
    s.cam.style.transform='translateY('+((1-u)*90-E.io(pout)*120).toFixed(2)+'px)';
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

const html = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>Best ashwagandha brands: the top three</title><style>${css}</style></head><body>
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
