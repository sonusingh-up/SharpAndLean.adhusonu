/*
 * Writes .out/video.html and .out/timeline.json for the YouTube pilot
 * "ColonBroom GLP-1 Booster: we read the label" (1920×1080).
 *
 * Scenes are timed to the narration: tts.py writes each line's length to
 * .out/vo.json, and every scene lasts as long as its line. Figures come from
 * lib/articles/colonbroom-glp-1-booster-review.ts and the build fails if one
 * of them is no longer in that file.
 *
 * As with the Reels, window.seek(t) sets every style from t, so each frame is
 * a pure function of time.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..', '..');
const out = join(here, '.out');
const require = createRequire(import.meta.url);

/* ---------- the review ---------- */

const src = readFileSync(join(root, 'lib', 'articles', 'colonbroom-glp-1-booster-review.ts'), 'utf8');
const need = (re, what) => {
  const m = src.match(re);
  if (!m) throw new Error(`The review no longer contains ${what}; update the video script.`);
  return m;
};
const criteria = ['Evidence for the marketed claim', 'Dose against the studied amount', 'Label transparency', 'Value against the generic equivalent', 'Safety and tolerability'];
const scores = criteria.map((c) => ({ label: c, value: +need(new RegExp(`'${c}': (\\d+)`), `a score for "${c}"`)[1] }));
const overall = Math.round((scores.reduce((a, s) => a + s.value, 0) / scores.length) * 10) / 10;
need(/Berberis aristata bark powder, 200 mg/, 'the 200 mg bark powder line');
need(/more than 1,000 mg of berberine a day/, 'the 1,000 mg research dose');
need(/Resveratrol and quercetin showed no significant effect on body weight in their own meta-analyses/, 'the resveratrol and quercetin finding');
need(/No trial of the product; the GLP-1 papers cited are a pathway review and a cell study/, 'the GLP-1 evidence line');
need(/Three formulas under one name since April 2025, and four different sets of directions/, 'the formulas line');
need(/a natural GLP-1 supplement designed to support appetite control/, 'the brand’s GLP-1 description');
need(/buy a product that states how much berberine you are getting/, 'the verdict line');
need(/Quercetin dihydrate, 200 mg/, 'the quercetin amount');
need(/Polygonum cuspidatum root extract 200:1, 200 mg/, 'the knotweed amount');
need(/15 mcg/, 'the zinc misprint');
need(/a fifth of the 1 g a day/, 'the one-fifth comparison');

/* ---------- narration and timeline ---------- */

const script = JSON.parse(readFileSync(join(here, 'narration.json'), 'utf8'));
const vo = JSON.parse(readFileSync(join(out, 'vo.json'), 'utf8'));
const LEAD = 0.45; // scene is on screen this long before the voice starts
const TAIL = 0.45; // and this long after it stops
const HOLD = 2.6; // extra time on the last scene
let cursor = 0;
const T = {};
script.lines.forEach((l, i) => {
  const dur = vo[l.id];
  const last = i === script.lines.length - 1;
  const len = LEAD + dur + TAIL + (last ? HOLD : 0);
  T[l.id] = { s: cursor, e: cursor + len, vo: cursor + LEAD, dur };
  cursor += len;
});
const END = Math.ceil(cursor * 30) / 30;
// A point in a scene, as a fraction of its narration: at('dose', 0.5) is halfway through the line.
const at = (id, f) => +(T[id].vo + f * T[id].dur).toFixed(2);

// Captions: each sentence, split into short chunks, timed by its share of the characters.
const captions = [];
for (const l of script.lines) {
  const chunks = [];
  for (const sentence of l.text.split(/(?<=[.?!])\s+/)) { // not on the point in 2.8
    const words = sentence.trim().split(/\s+/);
    const parts = Math.ceil(words.length / 13);
    const size = Math.ceil(words.length / parts);
    for (let i = 0; i < words.length; i += size) chunks.push(words.slice(i, i + size).join(' '));
  }
  const total = chunks.reduce((a, c) => a + c.length, 0);
  let t = T[l.id].vo;
  for (const c of chunks) {
    const d = (c.length / total) * T[l.id].dur;
    captions.push({ s: +t.toFixed(2), e: +(t + d).toFixed(2), text: c });
    t += d;
  }
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
const product = `data:image/jpeg;base64,${b64(join(here, 'assets', 'product.jpg'))}`;
const sumita = `data:image/jpeg;base64,${b64(join(here, 'assets', 'sumita.jpg'))}`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const colour = (v) => (v >= 7 ? '#2f7c72' : v >= 5 ? '#a9813c' : '#e07a5f');

/* ---------- scenes ---------- */

const scene = (id, cls, inner) => `<section class="scene ${cls}" data-s="${T[id].s}" data-e="${T[id].e}">${inner}</section>`;

const hook = scene('hook', 'split', `
  <div class="l">
    <p class="kicker" data-in="${T.hook.s + 0.1}">Review · Weight management</p>
    <h1 class="title" data-in="${T.hook.s + 0.25}">ColonBroom<br>GLP-1 Booster</h1>
    <p class="quote" data-in="${at('hook', 0.2)}">Sold as “a natural GLP-1 supplement”</p>
    <p class="lead" data-in="${at('hook', 0.62)}">We read the <em>label.</em></p>
  </div>
  <div class="r"><div class="pack" data-pop="${T.hook.s + 0.3}"><img src="${product}" alt=""></div></div>`);

const label = scene('label', 'split', `
  <div class="l">
    <p class="kicker" data-in="${T.label.s + 0.1}">What is on the label</p>
    <h2 class="h2" data-in="${T.label.s + 0.2}">200 mg of <em>bark powder</em></h2>
    <p class="lead sm" data-in="${at('label', 0.6)}">That is the weight of the ground bark, not of the berberine inside it.</p>
  </div>
  <div class="r">
    <div class="panel" data-in="${T.label.s + 0.3}">
      <b class="ph">Supplement Facts</b>
      <div class="prow hl" data-hl="${at('label', 0.3)}"><span>Berberis aristata bark powder</span><i>200 mg</i></div>
      <div class="prow"><span>Polygonum cuspidatum root extract</span><i>200 mg</i></div>
      <div class="prow"><span>Quercetin dihydrate</span><i>200 mg</i></div>
      <div class="prow"><span>Zinc (as zinc oxide)</span><i>15 mcg</i></div>
      <p class="pn">Serving: two capsules. Amazon “new formula” listing, as printed.</p>
    </div>
    <div class="tag" data-pop="${at('label', 0.66)}">Berberine content: not stated</div>
  </div>`);

const dose = scene('dose', 'stack', `
  <p class="kicker" data-in="${T.dose.s + 0.1}">Dose against the research</p>
  <h2 class="h2" data-in="${T.dose.s + 0.2}">At most <em>a fifth</em> of the studied dose</h2>
  <div class="bars">
    <div class="brow" data-in="${at('dose', 0.02)}"><span class="bl">Weight research<small>berberine a day</small></span><span class="bt"><i class="bf teal" data-bar="${at('dose', 0.08)}" data-w="100"></i></span><b class="bv">more than 1,000 mg</b></div>
    <div class="brow" data-in="${at('dose', 0.42)}"><span class="bl">This label<small>bark powder, per serving</small></span><span class="bt"><i class="bf terra" data-bar="${at('dose', 0.5)}" data-w="20"></i></span><b class="bv">200 mg</b></div>
  </div>
  <p class="note" data-in="${at('dose', 0.75)}">Even if every milligram were berberine. The label does not say how much is.</p>`);

const others = scene('others', 'stack', `
  <p class="kicker" data-in="${T.others.s + 0.1}">The other two extracts</p>
  <h2 class="h2" data-in="${T.others.s + 0.2}">No effect on <em>body weight</em></h2>
  <div class="cards2">
    <div class="xc" data-pop="${at('others', 0.22)}"><span class="x">×</span><b>Resveratrol</b><small>from Polygonum cuspidatum root extract</small></div>
    <div class="xc" data-pop="${at('others', 0.36)}"><span class="x">×</span><b>Quercetin</b><small>quercetin dihydrate</small></div>
  </div>
  <p class="note" data-in="${at('others', 0.55)}">No significant effect on body weight in their own meta-analyses.</p>`);

const claim = scene('claim', 'stack', `
  <p class="kicker" data-in="${T.claim.s + 0.1}">The GLP-1 claim</p>
  <h2 class="h2" data-in="${T.claim.s + 0.2}">“Natural GLP-1 supplement” <em>on what evidence?</em></h2>
  <div class="cards3">
    <div class="ev bad" data-pop="${at('claim', 0.28)}"><b>0</b><span>trials of the product</span></div>
    <div class="ev" data-pop="${at('claim', 0.62)}"><b>1</b><span>pathway review, cited by the brand</span></div>
    <div class="ev" data-pop="${at('claim', 0.82)}"><b>1</b><span>cell study, cited by the brand</span></div>
  </div>`);

const formulas = scene('formulas', 'stack', `
  <p class="kicker" data-in="${T.formulas.s + 0.1}">One name, several products</p>
  <h2 class="h2" data-in="${T.formulas.s + 0.2}">Which one are you <em>buying?</em></h2>
  <div class="nums">
    <div class="nb" data-in="${at('formulas', 0.0)}"><b data-count="3" data-dec="0" data-at="${at('formulas', 0.02)}" data-dur="0.6">0</b><span>formulas under one name<small>since April 2025</small></span></div>
    <div class="nb" data-in="${at('formulas', 0.62)}"><b data-count="4" data-dec="0" data-at="${at('formulas', 0.64)}" data-dur="0.6">0</b><span>different sets of directions<small>across the brand’s pages and listings</small></span></div>
  </div>`);

const saidAt = [0.2, 0.33, 0.44, 0.6, 0.71]; // roughly where each score is spoken
const score = scene('score', 'split wide', `
  <div class="l">
    <p class="kicker" data-in="${T.score.s + 0.1}">Our score</p>
    <div class="srows">
      ${scores.map((s, i) => `
      <div class="srow" data-in="${at('score', saidAt[i] - 0.06)}">
        <span>${esc(s.label)}</span>
        <span class="st"><i style="background:${colour(s.value)}" data-bar="${at('score', saidAt[i])}" data-w="${s.value * 10}"></i></span>
        <b style="color:${colour(s.value)}">${s.value}</b>
      </div>`).join('')}
    </div>
  </div>
  <div class="r">
    <div class="dial" data-pop="${at('score', 0.84)}">
      <svg viewBox="0 0 400 400" width="520" height="520">
        <circle cx="200" cy="200" r="170" fill="none" stroke="#f3efe7" stroke-width="26"/>
        <circle id="ring" cx="200" cy="200" r="170" fill="none" stroke="${colour(overall)}" stroke-width="26" stroke-linecap="round" transform="rotate(-90 200 200)" stroke-dasharray="0 1068"/>
      </svg>
      <div class="dn"><small>Overall</small><b data-count="${overall}" data-dec="1" data-at="${at('score', 0.86)}" data-dur="0.8">0</b><span>out of 10</span></div>
    </div>
  </div>`);

const verdict = scene('verdict', 'dark stack', `
  <p class="kicker light" data-in="${T.verdict.s + 0.1}">Our verdict</p>
  <h2 class="closing" data-in="${T.verdict.s + 0.2}">Want to try berberine? Buy one that <em>states the dose.</em></h2>
  <div class="row">
    <div class="credit" data-in="${at('verdict', 0.42)}">
      <img src="${sumita}" alt="">
      <span><small>Method set by</small><b>Sumita Bhatti</b><small>Clinical Nutritionist</small></span>
    </div>
    <div class="cta" data-pop="${at('verdict', 0.72)}">Full review, with every source → sharpandlean.com</div>
  </div>
  <p class="fine" data-in="${at('verdict', 0.42)}">Desk review of the label and published research. Nobody at SharpAndLean has taken the product. Not medical advice: speak to a pharmacist or GP before starting a supplement, especially in pregnancy or if you take medication.</p>`);

/* ---------- page ---------- */

const css = `
${fonts}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1920px;height:1080px;overflow:hidden;background:#fbf9f5}
body{font-family:'DM Sans',sans-serif;color:#1c2a28;position:relative}
em{font-family:'Newsreader',serif;font-style:italic;font-weight:400;color:#2f7c72}
.blob{position:absolute;border-radius:50%}
#b1{width:1000px;height:1000px;background:#2f7c72;opacity:.1;right:-300px;top:-420px}
#b2{width:900px;height:900px;background:#f3b596;opacity:.26;left:-360px;bottom:-460px}
#bar{position:absolute;left:0;right:0;top:0;height:8px;background:rgba(28,42,40,.1);z-index:6}
#bar i{display:block;height:100%;width:0;background:#2f7c72}
#logo{position:absolute;left:96px;top:60px;z-index:6;display:flex;align-items:center;gap:14px;font-weight:700;font-size:34px;letter-spacing:-.01em}
#logo .mark{display:grid;grid-template-columns:17px 17px;gap:5px}
#logo .mark i{width:17px;height:17px;border-radius:5px;background:currentColor}
#logo .mark i:last-child{background:#7cc47e}
#cap{position:absolute;left:0;right:0;bottom:54px;z-index:6;text-align:center}
#cap span{display:inline-block;max-width:1500px;padding:14px 30px;border-radius:18px;background:rgba(28,42,40,.86);color:#fbf9f5;font-size:36px;line-height:1.25;font-weight:500}
.scene{position:absolute;inset:0;padding:150px 96px 170px;opacity:0;display:flex}
.scene.split{align-items:center;gap:80px}
.scene.split .l{flex:1.15}.scene.split .r{flex:1;display:flex;flex-direction:column;align-items:center;gap:26px}
.scene.split.wide .l{flex:1.5}
.scene.stack{flex-direction:column;justify-content:center}
.scene.dark{background:#183b37;color:#fbf9f5}
.kicker{font-size:30px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#a9813c}
.kicker.light{color:#d8b876}
.title{margin-top:22px;font-size:128px;line-height:1;font-weight:700;letter-spacing:-.04em}
.quote{margin-top:36px;font-size:44px;font-weight:500;color:#5d6865}
.lead{margin-top:30px;font-size:84px;line-height:1.05;font-weight:700;letter-spacing:-.03em}
.lead em{font-size:1.08em}
.lead.sm{font-size:48px;line-height:1.2;letter-spacing:-.015em;font-weight:500;color:#3d4c48}
.pack{width:560px;height:560px;border-radius:56px;background:#fff;border:3px solid #e8e1d5;display:grid;place-items:center;overflow:hidden}
.pack img{width:520px;height:520px;object-fit:contain}
.h2{margin-top:18px;font-size:96px;line-height:1.03;font-weight:700;letter-spacing:-.035em}
.panel{width:760px;background:#fff;border:4px solid #1c2a28;border-radius:22px;padding:30px 34px 26px}
.ph{display:block;font-size:54px;font-weight:700;letter-spacing:-.02em;padding-bottom:14px;border-bottom:10px solid #1c2a28}
.prow{position:relative;display:flex;justify-content:space-between;gap:20px;padding:20px 12px;border-bottom:2px solid #d9d2c5;font-size:34px;font-weight:500;border-radius:10px}
.prow i{font-style:normal;font-weight:700;white-space:nowrap}
.pn{margin-top:16px;font-size:26px;color:#5d6865}
.tag{background:#e07a5f;color:#fff;font-weight:700;font-size:38px;padding:18px 32px;border-radius:999px}
.bars{margin-top:70px;display:grid;gap:44px}
.brow{display:grid;grid-template-columns:360px 1fr 440px;align-items:center;gap:34px}
.bl{font-size:44px;font-weight:700;letter-spacing:-.02em;line-height:1.1}
.bl small,.nb small,.xc small{display:block;margin-top:6px;font-size:28px;font-weight:500;letter-spacing:0;color:#5d6865}
.bt{height:76px;border-radius:38px;background:#f3efe7;overflow:hidden}
.bf{display:block;height:100%;width:0;border-radius:38px}
.bf.teal{background:#2f7c72}.bf.terra{background:#e07a5f}
.bv{white-space:nowrap;font-size:44px;font-weight:700;letter-spacing:-.02em}
.note{margin-top:56px;font-size:42px;line-height:1.25;font-weight:500;color:#3d4c48;max-width:1500px}
.cards2{margin-top:60px;display:grid;grid-template-columns:1fr 1fr;gap:32px}
.xc{position:relative;background:#fff;border:3px solid #e8e1d5;border-radius:40px;padding:44px 48px 46px 170px}
.xc b{display:block;font-size:72px;letter-spacing:-.03em}
.x{position:absolute;left:44px;top:50%;margin-top:-48px;width:96px;height:96px;border-radius:50%;background:#e07a5f;color:#fff;display:grid;place-items:center;font-size:72px;font-weight:700;line-height:1}
.cards3{margin-top:64px;display:grid;grid-template-columns:repeat(3,1fr);gap:30px}
.ev{background:#fff;border:3px solid #e8e1d5;border-radius:40px;padding:40px 44px 46px}
.ev b{display:block;font-size:170px;line-height:1;font-weight:700;letter-spacing:-.04em;color:#a9813c}
.ev.bad b{color:#e07a5f}
.ev span{display:block;margin-top:10px;font-size:42px;line-height:1.15;font-weight:700;letter-spacing:-.02em}
.nums{margin-top:64px;display:grid;grid-template-columns:1fr 1fr;gap:32px}
.nb{display:flex;align-items:center;gap:40px;background:#fff;border:3px solid #e8e1d5;border-radius:40px;padding:40px 48px}
.nb b{font-size:230px;line-height:.95;font-weight:700;letter-spacing:-.05em;color:#183b37;font-variant-numeric:tabular-nums}
.nb span{font-size:50px;line-height:1.1;font-weight:700;letter-spacing:-.02em}
.srows{margin-top:44px;display:grid;gap:30px}
.srow{display:grid;grid-template-columns:1fr 80px;row-gap:12px;align-items:center;font-size:40px;font-weight:700;letter-spacing:-.015em}
.srow .st{grid-column:1;grid-row:2;height:30px;border-radius:15px;background:#f3efe7;overflow:hidden}
.srow .st i{display:block;height:100%;width:0;border-radius:15px}
.srow b{grid-column:2;grid-row:1/3;text-align:right;font-size:64px}
.dial{position:relative;width:520px;height:520px;background:#fff;border-radius:50%}
.dn{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.dn small{font-size:28px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#e07a5f}
.dn b{font-size:210px;line-height:1;font-weight:700;letter-spacing:-.05em;font-variant-numeric:tabular-nums}
.dn span{font-size:36px;color:#5d6865}
.closing{margin-top:20px;font-size:100px;line-height:1.04;font-weight:700;letter-spacing:-.035em;max-width:1600px}
.closing em{color:#d8b876}
.row{margin-top:56px;display:flex;align-items:center;gap:44px}
.credit{display:flex;align-items:center;gap:26px}
.credit img{width:150px;height:150px;border-radius:50%;object-fit:cover;object-position:50% 20%;border:5px solid #d8b876}
.credit small{display:block;font-size:28px;color:#b9c9c4}
.credit b{display:block;font-size:46px;letter-spacing:-.02em}
.cta{transform-origin:left center;background:#fbf9f5;color:#183b37;font-weight:700;font-size:44px;letter-spacing:-.02em;padding:34px 46px;border-radius:999px;white-space:nowrap}
.fine{margin-top:44px;font-size:28px;line-height:1.4;color:#b9c9c4;max-width:1500px}
`;

const js = `
const END=${END}, CAPS=${JSON.stringify(captions)};
const clamp=(x)=>Math.max(0,Math.min(1,x));
const out3=(x)=>1-Math.pow(1-x,3);
const back=(x)=>{const c=1.70158,c3=c+1;return 1+c3*Math.pow(x-1,3)+c*Math.pow(x-1,2)};
const q=(s)=>[...document.querySelectorAll(s)];
const scenes=q('.scene'), ins=q('[data-in]'), pops=q('[data-pop]'), counts=q('[data-count]'), bars=q('[data-bar]'), hls=q('[data-hl]');
const bar=document.querySelector('#bar i'), barWrap=document.getElementById('bar'), logo=document.getElementById('logo'), cap=document.querySelector('#cap span'), ring=document.getElementById('ring');
const RING_AT=${at('score', 0.86)}, RING=${overall / 10};
window.seek=(t)=>{
  let dark=0;
  for(const s of scenes){
    const a=+s.dataset.s,e=+s.dataset.e;
    const fin=a===0?1:clamp((t-a+0.12)/0.24), fout=s===scenes[scenes.length-1]?0:clamp((t-e+0.12)/0.24); // the last scene holds to the end
    const o=Math.min(fin,1-fout);
    s.style.opacity=o;
    s.style.transform='translateX('+((1-fin)*60-fout*60)+'px)';
    if(s.classList.contains('dark'))dark=o;
  }
  for(const el of ins){const p=out3(clamp((t-+el.dataset.in)/0.55));el.style.opacity=p;el.style.transform='translateY('+((1-p)*44)+'px)';}
  for(const el of pops){const x=clamp((t-+el.dataset.pop)/0.45);el.style.opacity=clamp(x*3);el.style.transform='scale('+(x<=0?0:back(x))+')';}
  for(const el of counts){const p=out3(clamp((t-+el.dataset.at)/(+el.dataset.dur||0.9)));el.textContent=(+el.dataset.count*p).toFixed(+el.dataset.dec);}
  for(const el of bars){const p=out3(clamp((t-+el.dataset.bar)/0.9));el.style.width=(p*+el.dataset.w)+'%';}
  for(const el of hls){const p=out3(clamp((t-+el.dataset.hl)/0.4));el.style.background='rgba(216,184,118,'+(0.5*p)+')';el.style.transform='scale('+(1+0.03*p)+')';}
  const rp=out3(clamp((t-RING_AT)/0.8));ring.setAttribute('stroke-dasharray',(1068*RING*rp).toFixed(1)+' 1068');
  const c=CAPS.find((c)=>t>=c.s&&t<c.e);
  cap.textContent=c?c.text:'';cap.style.opacity=c?1:0;
  cap.style.background=dark>0.5?'rgba(251,249,245,.94)':'rgba(28,42,40,.86)';cap.style.color=dark>0.5?'#183b37':'#fbf9f5';
  document.getElementById('b1').style.transform='translate('+(Math.sin(t*0.3)*60)+'px,'+(Math.cos(t*0.25)*50)+'px)';
  document.getElementById('b2').style.transform='translate('+(Math.cos(t*0.28)*70)+'px,'+(Math.sin(t*0.3)*40)+'px)';
  logo.style.color=dark>0.5?'#fbf9f5':'#1c2a28';
  barWrap.style.background=dark>0.5?'rgba(251,249,245,.18)':'rgba(28,42,40,.1)';
  bar.style.background=dark>0.5?'#d8b876':'#2f7c72';
  bar.style.width=(clamp(t/END)*100)+'%';
};
window.seek(0);
`;

const html = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>ColonBroom GLP-1 Booster: we read the label</title><style>${css}</style></head><body>
<div class="blob" id="b1"></div><div class="blob" id="b2"></div>
${hook}${label}${dose}${others}${claim}${formulas}${score}${verdict}
<div id="bar"><i></i></div>
<div id="logo"><span class="mark"><i></i><i></i><i></i><i></i></span>SharpAndLean</div>
<div id="cap"><span></span></div>
<script>${js}</script></body></html>`;

// Brand rule: one word, no ampersand and no spaces.
const visible = html.replace(/data:[a-z]+\/[a-z0-9]+;base64,[A-Za-z0-9+/=]+/g, '');
if (new RegExp('Sharp' + '\\s*(&|and\\s)', 'i').test(visible)) throw new Error('Write the brand name as one word, with no ampersand or spaces.');

mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'video.html'), html);
writeFileSync(
  join(out, 'timeline.json'),
  JSON.stringify({ end: END, scenes: T, order: script.lines.map((l) => l.id), captions }, null, 2),
);
console.log(`video.html written, ${END.toFixed(2)} s, overall score ${overall}`);
