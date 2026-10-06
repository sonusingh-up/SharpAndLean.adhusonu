/*
 * Writes .out/video.html and .out/timeline.json for the Instagram Reel
 * "New vs old sunscreen filters" (1080×1920).
 *
 * A deliberately quiet look: paper background, one accent colour, hairlines
 * and large type. Scenes are timed to the recorded narration and cues sit on
 * the words they belong to. window.seek(t) sets every style from t.
 * Every claim on screen is listed with its source in narration.json.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '.out');
const require = createRequire(import.meta.url);

const script = JSON.parse(readFileSync(join(here, 'narration.json'), 'utf8'));
const vo = JSON.parse(readFileSync(join(out, 'vo.json'), 'utf8'));
const LEAD = 0.35, TAIL = 0.4, HOLD = 2.2;
let cursor = 0;
const T = {}, L = {};
script.lines.forEach((l, i) => {
  const len = LEAD + vo[l.id] + TAIL + (i === script.lines.length - 1 ? HOLD : 0);
  T[l.id] = { s: cursor, e: cursor + len, vo: cursor + LEAD, dur: vo[l.id] };
  L[l.id] = l;
  cursor += len;
});
const END = Math.ceil(cursor * 30) / 30;
const r2 = (x) => +x.toFixed(2);
const on = (id, phrase, shift = 0) => {
  const i = L[id].say.indexOf(phrase);
  if (i < 0) throw new Error(`"${phrase}" is not in the "${id}" line`);
  return r2(T[id].vo + (i / L[id].say.length) * T[id].dur + shift);
};
const st = (id, d = 0) => r2(T[id].s + d);
const SFX = [];
const S = (name, t, vol = 1) => { SFX.push({ name, t: r2(t), vol }); return r2(t); };
const k = (keys) => `data-k='${JSON.stringify(keys.map(([t, p]) => [r2(t), p]))}'`;

const captions = [];
for (const l of script.lines) {
  const split = (s) => s.split(/(?<=[.?!:,])\s+/);
  const said = split(l.say), shown = split(l.text);
  if (said.length !== shown.length) throw new Error(`Caption and spoken phrases differ in "${l.id}"`);
  const total = said.reduce((a, s) => a + s.length, 0);
  let t = T[l.id].vo;
  shown.forEach((phrase, i) => {
    const d = (said[i].length / total) * T[l.id].dur;
    const words = phrase.trim().split(/\s+/);
    const chars = words.join('').length;
    let wt = t;
    const ws = words.map((w) => { const o = { w, s: r2(wt) }; wt += (w.length / chars) * d; return o; });
    captions.push({ s: r2(t), e: r2(t + d), words: ws });
    t += d;
  });
}

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

const scene = (id, inner) => `<section class="scene" data-s="${T[id].s}" data-e="${T[id].e}">${inner}</section>`;
const A = {};
const scenes = [];

/* 1. Hook */
A.changed = S('chime', on('hook', 'That just changed'), 0.7);
S('tick', st('hook', 0.3), 0.6);
scenes.push(scene('hook', `
  <p class="eyebrow" data-in="${st('hook', 0.1)}">US sunscreen</p>
  <p class="huge" data-in="${st('hook', 0.2)}"><span data-count="27" data-at="${st('hook', 0.3)}" data-dur="1.4" data-dec="0">0</span></p>
  <h1 class="h1" data-in="${on('hook', 'years')}">years of the<br>same old filters.</h1>
  <i class="rule" ${k([[A.changed - 0.1, { sx: 0 }], [A.changed + 0.6, { sx: 1 }]])}></i>
  <h2 class="h2" data-in="${A.changed}"><em>That just changed.</em></h2>`));

/* 2. Old */
A.breaks = S('tick', on('old', 'breaks down'), 0.7);
A.stab = S('pop', on('old', 'extra stabilisers'), 0.5);
scenes.push(scene('old', `
  <p class="eyebrow terra" data-in="${st('old', 0.1)}">Old</p>
  <h1 class="h1" data-in="${st('old', 0.2)}">Avobenzone</h1>
  <p class="sub" data-in="${st('old', 0.4)}">The usual UVA filter in US sunscreens</p>
  <div class="meter" data-in="${st('old', 0.6)}">
    <svg viewBox="0 0 120 120" class="sun"><circle cx="60" cy="60" r="22" fill="none" stroke="#1c2a28" stroke-width="4"/><g stroke="#1c2a28" stroke-width="4" stroke-linecap="round" data-spin="14" data-org="60px 60px">${Array.from({ length: 8 }, (_, i) => `<path d="M60 14 V26" transform="rotate(${i * 45} 60 60)"/>`).join('')}</g></svg>
    <div class="track"><u class="terra" ${k([[A.breaks, { sx: 1, e: 'io' }], [A.breaks + 2.6, { sx: 0.3 }]])}></u></div>
    <span>Stability in sunlight</span>
  </div>
  <p class="line" data-in="${A.breaks}">Breaks down in sunlight</p>
  <p class="line" data-in="${A.stab}">Needs extra stabilisers</p>`));

/* 3. New */
const pros = [['UVA and UVB cover', 'covers UVA'], ['Stays stable in the sun', 'stays stable'], ['Very little passes through skin', 'very little']];
scenes.push(scene('new', `
  <p class="eyebrow teal" data-in="${st('new', 0.1)}">New · FDA, June 2026</p>
  <h1 class="h1" data-in="${st('new', 0.2)}">Bemotrizinol</h1>
  <p class="sub" data-in="${st('new', 0.4)}">Used in Europe and Asia for decades</p>
  <div class="meter" data-in="${st('new', 0.6)}">
    <svg viewBox="0 0 120 120" class="sun"><circle cx="60" cy="60" r="22" fill="none" stroke="#1c2a28" stroke-width="4"/><g stroke="#1c2a28" stroke-width="4" stroke-linecap="round" data-spin="14" data-org="60px 60px">${Array.from({ length: 8 }, (_, i) => `<path d="M60 14 V26" transform="rotate(${i * 45} 60 60)"/>`).join('')}</g></svg>
    <div class="track"><u class="teal" ${k([[st('new', 0.7), { sx: 0 }], [st('new', 1.6), { sx: 1 }]])}></u></div>
    <span>Stability in sunlight</span>
  </div>
  ${pros.map(([p, phrase]) => { const t = S('tick', on('new', phrase), 0.7); return `<p class="line ok" data-in="${t}"><svg viewBox="0 0 40 40"><path d="M8 21 l8 9 l16 -19" fill="none" stroke="#2f7c72" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" pathLength="1" data-draw="${r2(t + 0.1)}" data-dur="0.35"/></svg>${p}</p>`; }).join('')}`));

/* 4. Picks */
// Product photos are the brands' own pack shots (assets/), shown to identify the products named.
const img = (file) => `data:image/${file.endsWith('.png') ? 'png' : 'jpeg'};base64,${b64(join(here, 'assets', file))}`;
const picks = [
  ['Ultra Violette', 'Unblock Screen SPF 50', '$40', 'Ultra Violette', 'uv.jpg'],
  ['Neutrogena', 'Ultra Sheer Daily Face<br>SPF 70', 'from $17', 'two Neutrogena', 'n70.jpg'],
  ['Neutrogena', 'Clear Face SPF 60', 'from $17', 'from about', 'n60.png'],
];
scenes.push(scene('picks', `
  <p class="eyebrow teal" data-in="${st('picks', 0.1)}">On sale in the US</p>
  <h1 class="h1 xs" data-in="${st('picks', 0.2)}">The first three <em>with it.</em></h1>
  <div class="list">
    ${picks.map(([brand, name, price, phrase, file]) => { const t = S('pop', on('picks', phrase), 0.6); return `<div class="item" data-in="${t}"><figure><img src="${img(file)}" alt=""></figure><span><small>${brand}</small>${name}</span><i>${price}</i></div>`; }).join('')}
  </div>
  <p class="fine" data-in="${on('picks', 'from about')}">The first US sunscreens with bemotrizinol. Prices as reported in September 2026. We have not tested them.</p>`));

/* 5. CTA */
A.full = S('chime', on('cta', 'The full comparison'), 0.7);
scenes.push(scene('cta', `
  <p class="eyebrow" data-in="${st('cta', 0.1)}">One more thing</p>
  <h1 class="h1 sm" data-in="${st('cta', 0.2)}">Older sunscreens <em>still work.</em></h1>
  <p class="sub" data-in="${on('cta', 'so keep wearing')}">Keep wearing yours.</p>
  <i class="rule" ${k([[A.full - 0.1, { sx: 0 }], [A.full + 0.6, { sx: 1 }]])}></i>
  <p class="eyebrow teal" data-in="${A.full}">Full comparison</p>
  <p class="url" data-in="${r2(A.full + 0.25)}">sharpandlean.com</p>
  <p class="bio" data-in="${r2(A.full + 0.9)}">Link in bio</p>`));

script.lines.slice(1).forEach((l) => S('whoosh', T[l.id].s - 0.1, 0.35));

const css = `
${fonts}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;overflow:hidden;background:#fbf9f5}
body{font-family:'DM Sans',sans-serif;color:#1c2a28;position:relative}
em{font-family:'Newsreader',serif;font-style:italic;font-weight:400;color:#2f7c72}
#logo{position:absolute;left:84px;top:230px;z-index:3;display:flex;align-items:center;gap:14px;font-weight:700;font-size:36px;letter-spacing:-.01em}
.mark{display:grid;grid-template-columns:17px 17px;gap:5px}
.mark i{width:17px;height:17px;border-radius:5px;background:#1c2a28}
.mark i:last-child{background:#7cc47e}
#steps{position:absolute;right:84px;top:246px;z-index:3;display:flex;gap:10px}
#steps i{width:44px;height:5px;border-radius:3px;background:#d9d2c5}
#steps i.on{background:#1c2a28}
#cap{position:absolute;left:84px;right:84px;top:1430px;z-index:3;font-size:44px;line-height:1.25;font-weight:500;color:#a39d92;min-height:120px}
#cap u{text-decoration:none;color:#1c2a28}
.scene{position:absolute;left:84px;right:84px;top:380px;height:1010px;display:none;flex-direction:column;justify-content:center}
.eyebrow{font-size:30px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#5d6865}
.eyebrow.teal{color:#2f7c72}.eyebrow.terra{color:#e07a5f}
.huge{font-size:420px;line-height:.9;font-weight:700;letter-spacing:-.06em;margin-top:10px;font-variant-numeric:tabular-nums}
.h1{margin-top:18px;font-size:112px;line-height:1.02;font-weight:700;letter-spacing:-.04em}
.h1.sm{font-size:96px}
.h1.xs{font-size:84px;margin-top:12px}
.list+.fine{margin-top:20px;font-size:25px}
.h2{margin-top:44px;font-size:96px;line-height:1.05;letter-spacing:-.02em;font-weight:400}
.sub{margin-top:22px;font-size:42px;line-height:1.25;color:#5d6865;font-weight:500}
.rule{display:block;margin-top:56px;height:3px;background:#1c2a28;transform-origin:0 50%}
.rule+.eyebrow{margin-top:56px}
.meter{margin-top:70px;display:grid;grid-template-columns:96px 1fr;column-gap:26px;row-gap:14px;align-items:center}
.sun{width:96px;height:96px}
.track{height:14px;border-radius:7px;background:#e8e1d5;overflow:hidden}
.track u{display:block;height:100%;border-radius:7px;transform-origin:0 50%}
.track u.teal{background:#2f7c72}.track u.terra{background:#e07a5f}
.meter span{grid-column:2;font-size:28px;color:#5d6865;font-weight:500}
.line{margin-top:44px;padding-top:40px;border-top:2px solid #e2dbce;font-size:56px;line-height:1.15;font-weight:700;letter-spacing:-.025em;display:flex;align-items:center;gap:24px}
.line+.line{margin-top:40px}
.line svg{flex:none;width:52px;height:52px}
.list{margin-top:34px}
.item figure{width:170px;height:196px;border-radius:20px;background:#fff;border:2px solid #e8e1d5;display:grid;place-items:center;overflow:hidden}
.item img{max-width:150px;max-height:176px;object-fit:contain}
.item{display:grid;grid-template-columns:170px 1fr auto;align-items:center;gap:30px;padding:18px 0;border-top:2px solid #e2dbce;font-size:45px;line-height:1.12;font-weight:700;letter-spacing:-.025em}
.item:last-child{border-bottom:2px solid #e2dbce}
.item b{font-size:30px;color:#2f7c72;font-variant-numeric:tabular-nums}
.item small{display:block;margin-bottom:8px;font-size:28px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#5d6865}
.item i{font-style:normal;font-size:40px;font-weight:500;color:#5d6865;white-space:nowrap}
.fine{margin-top:36px;font-size:28px;line-height:1.4;color:#8a8479}
.url{margin-top:18px;font-size:104px;line-height:1;font-weight:700;letter-spacing:-.045em}
.bio{margin-top:40px;align-self:flex-start;border:3px solid #1c2a28;border-radius:999px;padding:18px 40px;font-size:40px;font-weight:700}
`;

const js = `
const END=${END}, CAPS=${JSON.stringify(captions)};
const clamp=(x)=>Math.max(0,Math.min(1,x));
const E={out:(x)=>1-Math.pow(1-x,3),lin:(x)=>x,io:(x)=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2};
const q=(s)=>[...document.querySelectorAll(s)];
const DEF={x:0,y:0,s:1,sx:1,sy:1,o:1};
const KS=q('[data-k]').map((el)=>{const raw=JSON.parse(el.dataset.k);let cur={...DEF};return{el,keys:raw.map(([t,p])=>{cur={...cur,...p};return[t,{...cur,e:p.e||'out'}]})}});
const at=(keys,t)=>{if(t<=keys[0][0])return keys[0][1];for(let i=0;i<keys.length-1;i++){const a=keys[i],b=keys[i+1];if(t<b[0]){const u=E[a[1].e]((t-a[0])/(b[0]-a[0]));const o={};for(const n in DEF)o[n]=a[1][n]+(b[1][n]-a[1][n])*u;return o}}return keys[keys.length-1][1]};
const scenes=q('.scene').map((el)=>({el,a:+el.dataset.s,e:+el.dataset.e}));
const ins=q('[data-in]'),draws=q('[data-draw]'),counts=q('[data-count]'),spins=q('[data-spin]');
draws.forEach((el)=>{el.style.strokeDasharray='1 1'});
spins.forEach((el)=>{el.style.transformBox='view-box';el.style.transformOrigin=el.dataset.org});
const cap=document.getElementById('cap'),steps=q('#steps i');
let last=-1;
window.seek=(t)=>{
  scenes.forEach((s,i)=>{
    const fin=s.a===0?1:clamp((t-s.a+0.1)/0.2),fout=i===scenes.length-1?0:clamp((t-s.e+0.1)/0.2);
    const o=Math.min(fin,1-fout);
    s.el.style.display=o>0?'flex':'none';s.el.style.opacity=o;
    if(t>=s.a-0.1)steps.forEach((d,j)=>d.className=j<=i?'on':'');
  });
  for(const el of ins){const p=E.out(clamp((t-+el.dataset.in)/0.5));el.style.opacity=p;el.style.transform='translateY('+((1-p)*28).toFixed(2)+'px)';}
  for(const{el,keys}of KS){const p=at(keys,t);el.style.opacity=p.o;el.style.transform='translate('+p.x+'px,'+p.y+'px) scale('+(p.sx*p.s).toFixed(4)+','+(p.sy*p.s).toFixed(4)+')';}
  for(const el of draws){const p=E.io(clamp((t-+el.dataset.draw)/(+el.dataset.dur||0.6)));el.style.strokeDashoffset=(1-p).toFixed(4);el.style.opacity=p>0?1:0;}
  for(const el of counts){const p=E.out(clamp((t-+el.dataset.at)/(+el.dataset.dur||0.9)));el.textContent=(+el.dataset.count*p).toFixed(+el.dataset.dec);}
  for(const el of spins){el.style.transform='rotate('+((t*+el.dataset.spin)%360).toFixed(2)+'deg)';}
  const ci=CAPS.findIndex((c)=>t>=c.s&&t<c.e+0.2);
  if(ci<0){cap.style.opacity=0;last=-1}else{const c=CAPS[ci];cap.style.opacity=1;let n=0;for(const w of c.words)if(t>=w.s)n++;const key=ci*100+n;if(key!==last){last=key;cap.innerHTML=c.words.map((w,i)=>i<n?'<u>'+w.w+'</u>':w.w).join(' ');}}
};
window.seek(0);
`;

const html = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>New vs old sunscreen filters</title><style>${css}</style></head><body>
<div id="logo"><span class="mark"><i></i><i></i><i></i><i></i></span>SharpAndLean</div>
<div id="steps">${script.lines.map(() => '<i></i>').join('')}</div>
${scenes.join('')}
<div id="cap"></div>
<script>${js}</script></body></html>`;

const visible = html.replace(/data:[a-z]+\/[a-z0-9]+;base64,[A-Za-z0-9+/=]+/g, '');
if (new RegExp('Sharp' + '\\s*(&|and\\s)', 'i').test(visible)) throw new Error('Write the brand name as one word, with no ampersand or spaces.');

mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'video.html'), html);
writeFileSync(join(out, 'timeline.json'), JSON.stringify({ end: END, scenes: T, order: script.lines.map((l) => l.id), sfx: SFX.sort((a, b) => a.t - b.t) }, null, 2));
console.log(`video.html written, ${END.toFixed(2)} s, ${SFX.length} sound cues`);
