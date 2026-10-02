/*
 * Writes .out/reel.html and .out/timeline.json for the Reel that explains
 * "How to Get in Shape Fast for Men: Your First 8 Weeks".
 *
 * Every word and number on screen is read from lib/editorials/get-in-shape-men.ts.
 * If the article changes so that a figure used here no longer appears in it,
 * this script throws instead of rendering a Reel that disagrees with the page.
 *
 * The page has no CSS animations or timers: window.seek(t) sets every style
 * from t, so each frame is a pure function of time and can be captured one by one.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..', '..');
const out = join(here, '.out');
const require = createRequire(import.meta.url);

/* ---------- read the article ---------- */

const src = readFileSync(join(root, 'lib', 'editorials', 'get-in-shape-men.ts'), 'utf8');
const need = (re, what) => {
  const m = src.match(re);
  if (!m) throw new Error(`get-in-shape-men.ts no longer contains ${what}; update the Reel storyboard.`);
  return m;
};
const strip = (s) => s.replace(/<[^>]+>/g, '').trim();

const title = need(/title: '([^']+)'/, 'a title')[1];

// The weekly table: Day | Activity | Starting approach.
const dayRows = [...src.matchAll(/<tr><td>(\w+day)<\/td><td>([^<]+)<\/td><td>([^<]+)<\/td><\/tr>/g)].map(
  (m) => ({ day: m[1], activity: m[2], approach: m[3] }),
);
if (dayRows.length !== 7) throw new Error(`Expected 7 days in the weekly table, found ${dayRows.length}`);
const minutes = need(/<td>Tuesday<\/td><td>[^<]+<\/td><td>(\d+–\d+) comfortable minutes/, 'the Tuesday minutes')[1];

// The five exercises: "<h3>1. Chair squat: 6–10 repetitions</h3>".
const exercises = [...src.matchAll(/<h3>\d\. ([^:]+): (\d+)–(\d+) repetitions( each side)?<\/h3>/g)].map((m) => ({
  name: m[1],
  low: +m[2],
  high: +m[3],
  eachSide: Boolean(m[4]),
}));
if (exercises.length !== 5) throw new Error(`Expected 5 exercises, found ${exercises.length}`);

// The three stages: "<strong>Weeks 1–2: establish a baseline.</strong>".
const stages = [...src.matchAll(/<strong>(Weeks \d–\d): ([^.]+)\.<\/strong>/g)].map((m) => ({ weeks: m[1], text: m[2] }));
if (stages.length !== 3) throw new Error(`Expected 3 stages, found ${stages.length}`);

const proteinPerKg = need(/<strong>([\d.]+) g of protein per kilogram of body weight daily<\/strong>/, 'the protein reference')[1];
const [, exampleKg, exampleGrams] = need(/At (\d+) kg, that is about (\d+) g across the day, including food/, 'the worked protein example');
const sleepHours = need(/at least (seven) hours for adults/, 'the sleep recommendation') && 7;
need(/Start with two full-body strength sessions each week/, 'two strength sessions a week');
need(/aerobic activity you can recover from, food that matches your goal, and enough sleep/, 'the four-part formula');
need(/lose excess fat, build muscle, or improve everyday fitness/, 'the three goals');
need(/punishing six-day split/, 'the six-day split line');
need(/Eight weeks is a useful review point, not a deadline for visible abs/, 'the eight-week review line');
need(/generally healthy adult beginners/, 'the audience line');
need(/Stop exercising and seek urgent help for chest pain or fainting/, 'the safety line');

/* ---------- timeline (seconds) ---------- */

const S = { hook: 0, formula: 3, goal: 7, week: 10, moves: 15, stages: 21, fuel: 25, close: 27.6 };
const END = 31;
const EX_START = S.moves + 0.35;
const EX_LEN = 1.1;
const DAY_START = S.week + 0.55;
const DAY_STEP = 0.52;
const CTA_AT = 1.2;
const STAGE_AT = [S.stages + 0.5, S.stages + 1.6, S.stages + 2.7];

const formula = [
  { icon: 'dumbbell', text: '2 strength sessions a week' },
  { icon: 'heart', text: 'Cardio you can recover from' },
  { icon: 'bowl', text: 'Food that matches your goal' },
  { icon: 'moon', text: `${sleepHours}+ hours of sleep` },
];
const goals = ['Lose fat', 'Build muscle', 'Feel fitter'];
const dayLabel = (r) => (r.day === 'Tuesday' ? `${r.activity} · ${minutes} min` : r.activity);

const timeline = {
  end: END,
  whoosh: Object.values(S).slice(1),
  pop: [
    ...formula.map((_, i) => S.formula + 0.5 + i * 0.75),
    ...goals.map((_, i) => S.goal + 0.45 + i * 0.35),
    ...dayRows.map((_, i) => DAY_START + i * DAY_STEP),
    ...exercises.map((_, i) => EX_START + i * EX_LEN),
    ...STAGE_AT,
    S.close + CTA_AT,
  ],
  tick: [
    ...exercises.flatMap((e, i) =>
      Array.from({ length: e.high }, (_, k) => EX_START + i * EX_LEN + 0.15 + (0.75 * (k + 1)) / e.high),
    ),
    ...Array.from({ length: 8 }, (_, k) => S.fuel + 0.3 + (0.8 * (k + 1)) / 8),
  ],
  chime: S.close + CTA_AT,
};

/* ---------- assets ---------- */

const fontFile = (pkg, file) =>
  readFileSync(join(dirname(require.resolve(`@fontsource/${pkg}/package.json`)), 'files', file)).toString('base64');
const face = (family, weight, style, b64) =>
  `@font-face{font-family:'${family}';font-weight:${weight};font-style:${style};src:url(data:font/woff2;base64,${b64}) format('woff2');}`;
const fonts = [
  face('DM Sans', 400, 'normal', fontFile('dm-sans', 'dm-sans-latin-400-normal.woff2')),
  face('DM Sans', 500, 'normal', fontFile('dm-sans', 'dm-sans-latin-500-normal.woff2')),
  face('DM Sans', 700, 'normal', fontFile('dm-sans', 'dm-sans-latin-700-normal.woff2')),
  face('Newsreader', 400, 'italic', fontFile('newsreader', 'newsreader-latin-400-italic.woff2')),
].join('\n');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const icons = {
  dumbbell: `<rect x="6" y="26" width="10" height="28" rx="4"/><rect x="18" y="18" width="10" height="44" rx="4"/><rect x="28" y="35" width="24" height="10" rx="3"/><rect x="52" y="18" width="10" height="44" rx="4"/><rect x="64" y="26" width="10" height="28" rx="4"/>`,
  heart: `<path d="M40 68 C12 48 6 32 14 20 C22 9 36 12 40 24 C44 12 58 9 66 20 C74 32 68 48 40 68Z"/><path d="M14 42 H30 L36 30 L44 52 L50 42 H66" fill="none" stroke="#fbf9f5" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`,
  bowl: `<path d="M8 38 H72 C72 58 58 70 40 70 C22 70 8 58 8 38Z"/><circle cx="28" cy="26" r="8"/><circle cx="46" cy="22" r="9"/><circle cx="60" cy="29" r="6"/>`,
  moon: `<path d="M54 10 C36 12 24 26 24 42 C24 59 38 72 55 72 C63 72 70 69 75 64 C56 64 44 52 44 36 C44 25 48 16 54 10Z"/><circle cx="20" cy="20" r="4"/><circle cx="64" cy="26" r="3"/>`,
};

/*
 * Exercise figures: side-view stick figures. Each has two poses (a, b) given
 * as joint coordinates in a 600×480 box with the floor at y=440; seek() blends
 * between them. `far` chains are the limbs on the far side of the body, drawn
 * lighter and behind.
 */
const figures = [
  {
    // Chair squat: stand ↔ touch the seat.
    prop: `<rect x="330" y="300" width="130" height="16" rx="8"/><rect x="444" y="170" width="16" height="270" rx="8"/><rect x="336" y="316" width="14" height="124" rx="7"/>`,
    a: { head: [262, 78], sh: [262, 135], hip: [268, 245], knee: [262, 345], foot: [258, 440], toe: [218, 440], el: [258, 200], hand: [262, 262] },
    b: { head: [262, 150], sh: [282, 200], hip: [348, 292], knee: [246, 320], foot: [258, 440], toe: [218, 440], el: [228, 230], hand: [176, 222] },
    near: [['sh', 'hip', 'knee', 'foot', 'toe'], ['sh', 'el', 'hand']],
    far: [],
  },
  {
    // Wall push-up: arms long ↔ chest to the wall.
    prop: `<rect x="96" y="40" width="30" height="400" rx="10"/>`,
    a: { head: [296, 122], sh: [316, 172], hip: [388, 300], knee: [416, 372], foot: [440, 440], toe: [404, 440], el: [224, 180], hand: [134, 186] },
    b: { head: [214, 138], sh: [244, 186], hip: [352, 306], knee: [398, 374], foot: [440, 440], toe: [404, 440], el: [206, 262], hand: [134, 186] },
    near: [['sh', 'hip', 'knee', 'foot', 'toe'], ['sh', 'el', 'hand']],
    far: [],
  },
  {
    // Supported dumbbell row: arm long ↔ elbow towards the hip.
    prop: `<rect x="120" y="322" width="200" height="18" rx="9"/><rect x="136" y="340" width="14" height="100" rx="7"/><rect x="290" y="340" width="14" height="100" rx="7"/>`,
    a: { head: [176, 214], sh: [232, 232], hip: [388, 250], knee: [414, 346], foot: [436, 440], toe: [398, 440], el: [240, 300], hand: [246, 366], k2: [334, 340], f2: [316, 440], t2: [280, 440], e2: [228, 280], h2: [222, 322] },
    b: { head: [176, 214], sh: [232, 232], hip: [388, 250], knee: [414, 346], foot: [436, 440], toe: [398, 440], el: [312, 204], hand: [296, 270], k2: [334, 340], f2: [316, 440], t2: [280, 440], e2: [228, 280], h2: [222, 322] },
    near: [['sh', 'hip', 'knee', 'foot', 'toe'], ['sh', 'el', 'hand']],
    far: [['hip', 'k2', 'f2', 't2'], ['sh', 'e2', 'h2']],
    weight: 'hand',
  },
  {
    // Glute bridge: hips down ↔ hips lifted.
    prop: '',
    a: { head: [128, 408], sh: [186, 418], hip: [318, 424], knee: [420, 330], foot: [462, 440], toe: [500, 440], el: [250, 432], hand: [312, 436] },
    b: { head: [128, 408], sh: [186, 414], hip: [318, 340], knee: [424, 318], foot: [462, 440], toe: [500, 440], el: [250, 432], hand: [312, 436] },
    near: [['sh', 'hip', 'knee', 'foot', 'toe'], ['sh', 'el', 'hand']],
    far: [],
  },
  {
    // Bird dog: all fours ↔ opposite arm and leg reach.
    prop: '',
    a: { head: [184, 252], sh: [236, 268], hip: [392, 272], knee: [396, 440], foot: [478, 436], el: [236, 356], hand: [236, 440], k2: [400, 440], f2: [482, 436], e2: [240, 356], h2: [240, 440] },
    b: { head: [184, 244], sh: [236, 268], hip: [392, 272], knee: [396, 440], foot: [478, 436], el: [236, 356], hand: [236, 440], k2: [474, 276], f2: [556, 270], e2: [166, 258], h2: [96, 250] },
    near: [['sh', 'hip', 'knee', 'foot'], ['sh', 'el', 'hand']],
    far: [['hip', 'k2', 'f2'], ['sh', 'e2', 'h2']],
  },
];

/* ---------- scenes ---------- */

const logo = `<div id="logo"><span class="mark"><i></i><i></i><i></i><i></i></span>SharpAndLean</div>`;

const hook = `
<section class="scene" data-s="${S.hook}" data-e="${S.formula}">
  <p class="kicker" data-in="${S.hook + 0.1}">Men · Your first 8 weeks</p>
  <h1 class="hero" data-in="${S.hook + 0.25}">Get in shape <em>fast?</em></h1>
  <p class="hero2" data-in="${S.hook + 1.35}">You don’t need a six-day split.</p>
  <div class="sixdays">
    ${Array.from({ length: 6 }, (_, i) => `<span class="sd" data-pop="${(S.hook + 1.55 + i * 0.07).toFixed(2)}" data-strike="${(S.hook + 2.1 + i * 0.06).toFixed(2)}"><b></b></span>`).join('')}
  </div>
</section>`;

const formulaScene = `
<section class="scene top" data-s="${S.formula}" data-e="${S.goal}">
  <p class="kicker" data-in="${S.formula + 0.1}">The formula</p>
  <h2 class="h2" data-in="${S.formula + 0.2}">Four things, <em>repeated.</em></h2>
  <div class="formula">
    ${formula
      .map(
        (f, i) => `
    <div class="fcard" data-pop="${S.formula + 0.5 + i * 0.75}">
      <svg viewBox="0 0 80 80" width="132" height="132" fill="currentColor">${icons[f.icon]}</svg>
      <span>${esc(f.text)}</span>
    </div>`,
      )
      .join('')}
  </div>
</section>`;

const goalScene = `
<section class="scene top" data-s="${S.goal}" data-e="${S.week}">
  <p class="kicker" data-in="${S.goal + 0.1}">Pick one goal</p>
  <div class="goals">
    ${goals.map((g, i) => `<div class="goal g${i}" data-flip="${S.goal + 0.45 + i * 0.35}"><b>${i + 1}</b>${esc(g)}</div>`).join('')}
  </div>
  <p class="line" data-in="${S.goal + 1.6}"><em>Choose one.</em> Your food should match it.</p>
</section>`;

const weekScene = `
<section class="scene top" data-s="${S.week}" data-e="${S.moves}">
  <p class="kicker" data-in="${S.week + 0.1}">The week</p>
  <h2 class="h2 sm" data-in="${S.week + 0.2}">One week you can <em>repeat.</em></h2>
  <div class="days">
    ${dayRows
      .map((r, i) => {
        const strength = /strength/i.test(r.activity);
        return `<div class="day ${strength ? 'strong' : ''}" data-fill="${(DAY_START + i * DAY_STEP).toFixed(2)}"><i class="fill"></i><b>${r.day.slice(0, 3)}</b><span>${esc(dayLabel(r))}</span></div>`;
      })
      .join('')}
  </div>
</section>`;

const movesScene = `
<section class="scene top" data-s="${S.moves}" data-e="${S.stages}">
  <p class="kicker" data-in="${S.moves + 0.1}">Five moves</p>
  <div class="steps">${exercises.map((_, i) => `<span class="step" data-i="${i}"></span>`).join('')}</div>
  <div class="exwrap">
    ${exercises
      .map(
        (e, i) => `
    <div class="ex" data-i="${i}">
      <svg class="fig" viewBox="0 0 600 480" width="820" height="656">
        <rect x="20" y="440" width="560" height="10" rx="5" fill="#e8e1d5"/>
        <g fill="#d8b876">${figures[i].prop}</g>
        <g class="far"></g><g class="near"></g>
      </svg>
      <h3>${esc(e.name)}</h3>
      <div class="reps"><span class="count">0</span><span class="range">${e.low}–${e.high} reps${e.eachSide ? '<br>each side' : ''}</span></div>
    </div>`,
      )
      .join('')}
  </div>
</section>`;

const stagesScene = `
<section class="scene" data-s="${S.stages}" data-e="${S.fuel}">
  <p class="kicker" data-in="${S.stages + 0.1}">Eight weeks</p>
  <h2 class="h2 sm" data-in="${S.stages + 0.2}">Progress, <em>gradually.</em></h2>
  <div class="track"><i id="trackfill"></i><b id="trackdot"></b>
    <span class="mark2" style="left:25%"></span><span class="mark2" style="left:50%"></span>
  </div>
  <div class="stages">
    ${stages.map((s, i) => `<div class="stage" data-on="${STAGE_AT[i]}"><b>${esc(s.weeks)}</b><span>${esc(s.text)}</span></div>`).join('')}
  </div>
</section>`;

const fuelScene = `
<section class="scene" data-s="${S.fuel}" data-e="${S.close}">
  <p class="kicker" data-in="${S.fuel + 0.1}">Fuel</p>
  <p class="big" data-in="${S.fuel + 0.15}"><span data-count="${proteinPerKg}" data-dec="1" data-at="${S.fuel + 0.3}" data-dur="0.8">0</span> g</p>
  <p class="cap" data-in="${S.fuel + 0.45}">protein per kg of body weight, as a <em>reference point.</em></p>
  <p class="cap2" data-in="${S.fuel + 1.15}">At ${exampleKg} kg that’s about ${exampleGrams} g a day, including food.</p>
</section>`;

const closeScene = `
<section class="scene dark" data-s="${S.close}" data-e="${END + 1}">
  <p class="closing" data-in="${S.close + 0.15}">8 weeks is a <em>review point,</em> not a deadline for abs.</p>
  <div class="cta" data-pop="${S.close + CTA_AT}">Full 8-week plan → link in bio</div>
  <p class="url" data-in="${S.close + CTA_AT + 0.2}">sharpandlean.com</p>
  <p class="save" data-in="${S.close + CTA_AT + 0.4}">Save this for your first week.</p>
  <p class="fine" data-in="${S.close + CTA_AT + 0.6}">General information for healthy adult beginners. Not medical advice. Stop and seek help for chest pain or fainting.</p>
</section>`;

/* ---------- page ---------- */

const css = `
${fonts}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;overflow:hidden;background:#fbf9f5}
body{font-family:'DM Sans',sans-serif;color:#1c2a28;position:relative}
em{font-family:'Newsreader',serif;font-style:italic;font-weight:400}
.blob{position:absolute;border-radius:50%}
#b1{width:900px;height:900px;background:#2f7c72;opacity:.12;right:-320px;top:-280px}
#b2{width:820px;height:820px;background:#f3b596;opacity:.3;left:-340px;bottom:-260px}
#bar{position:absolute;left:0;right:0;top:0;height:10px;background:rgba(28,42,40,.1);z-index:6}
#bar i{display:block;height:100%;width:0;background:#2f7c72}
#logo{position:absolute;left:72px;top:262px;z-index:6;display:flex;align-items:center;gap:14px;font-weight:700;font-size:36px;letter-spacing:-.01em}
#logo .mark{display:grid;grid-template-columns:18px 18px;gap:5px}
#logo .mark i{width:18px;height:18px;border-radius:5px;background:currentColor}
#logo .mark i:last-child{background:#7cc47e}
.scene{position:absolute;left:0;right:0;top:0;bottom:0;padding:350px 72px 420px;opacity:0;display:flex;flex-direction:column;justify-content:center}
.scene.top{justify-content:flex-start;padding-top:348px}
.scene.dark{background:#183b37;color:#fbf9f5}
.kicker{font-size:34px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#a9813c}
.hero{margin-top:30px;font-size:168px;line-height:1;font-weight:700;letter-spacing:-.04em}
.hero em{display:block;color:#2f7c72;font-size:1.12em;letter-spacing:-.02em}
.hero2{margin-top:64px;font-size:78px;line-height:1.12;font-weight:700;letter-spacing:-.02em}
.sixdays{margin-top:52px;display:flex;gap:18px}
.sd{position:relative;width:132px;height:132px;border-radius:32px;background:#f3efe7;border:3px solid #e8e1d5}
.sd b{position:absolute;left:14px;right:14px;top:50%;height:8px;margin-top:-4px;border-radius:4px;background:#e07a5f;transform-origin:left center;transform:rotate(-38deg) scaleX(0)}
.h2{margin-top:18px;font-size:96px;line-height:1.02;font-weight:700;letter-spacing:-.035em}
.h2.sm{font-size:84px}
.h2 em{color:#2f7c72}
.formula{margin-top:44px;display:grid;grid-template-columns:1fr 1fr;gap:24px}
.fcard{background:#fff;border:3px solid #e8e1d5;border-radius:44px;padding:48px 40px 52px;min-height:400px;display:flex;flex-direction:column;justify-content:space-between;gap:30px;font-size:58px;line-height:1.12;font-weight:700;letter-spacing:-.02em;color:#1c2a28}
.fcard svg{color:#2f7c72}
.fcard:nth-child(2) svg{color:#e07a5f}.fcard:nth-child(3) svg{color:#a9813c}.fcard:nth-child(4) svg{color:#183b37}
.goals{margin-top:52px;display:grid;gap:28px;perspective:1600px}
.goal{display:flex;align-items:center;gap:34px;border-radius:44px;padding:54px 52px;font-size:104px;font-weight:700;letter-spacing:-.03em;backface-visibility:hidden}
.goal b{width:108px;height:108px;border-radius:50%;display:grid;place-items:center;font-size:46px;background:rgba(255,255,255,.28)}
.goal.g0{background:#e07a5f;color:#fff}.goal.g1{background:#183b37;color:#fbf9f5}.goal.g2{background:#d8b876;color:#1c2a28}
.line{margin-top:64px;font-size:70px;line-height:1.15;font-weight:700;letter-spacing:-.02em}
.line em{color:#2f7c72;font-size:1.1em}
.days{margin-top:36px;display:grid;gap:14px}
.day{position:relative;overflow:hidden;display:flex;align-items:center;gap:28px;height:118px;padding:0 34px;border-radius:34px;background:#f3efe7;font-size:48px;font-weight:500;letter-spacing:-.01em}
.day .fill{position:absolute;left:0;top:0;bottom:0;width:0;background:#fff;border-radius:30px}
.day.strong .fill{background:#183b37}
.day b,.day span{position:relative}
.day b{width:118px;font-size:38px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#a9813c}
.day.strong{font-weight:700}
.steps{margin-top:26px;display:flex;gap:12px}
.step{flex:1;height:12px;border-radius:6px;background:#e8e1d5;overflow:hidden;position:relative}
.step::after{content:'';position:absolute;left:0;top:0;bottom:0;width:var(--w,0%);background:#2f7c72;border-radius:6px}
.exwrap{position:relative;margin-top:28px;height:1090px}
.ex{position:absolute;left:0;right:0;top:0;opacity:0}
.fig{display:block;margin:0 auto;background:#fff;border:3px solid #e8e1d5;border-radius:48px;width:936px;height:650px}
.fig .near polyline{fill:none;stroke:#183b37;stroke-width:30;stroke-linecap:round;stroke-linejoin:round}
.fig .far polyline{fill:none;stroke:#2f7c72;stroke-width:26;stroke-linecap:round;stroke-linejoin:round;opacity:.75}
.fig .near circle.head{fill:#183b37}
.fig .weight{fill:#e07a5f}
.ex h3{margin-top:40px;font-size:88px;line-height:1.02;font-weight:700;letter-spacing:-.03em}
.reps{margin-top:18px;display:flex;align-items:center;gap:30px}
.count{min-width:210px;font-size:190px;line-height:1;font-weight:700;letter-spacing:-.04em;color:#2f7c72;font-variant-numeric:tabular-nums}
.range{font-size:54px;line-height:1.15;font-weight:500;color:#5d6865}
.track{position:relative;margin-top:70px;height:34px;border-radius:17px;background:#e8e1d5}
#trackfill{position:absolute;left:0;top:0;bottom:0;width:0;border-radius:17px;background:#2f7c72}
#trackdot{position:absolute;top:50%;left:0;width:70px;height:70px;margin:-35px 0 0 -35px;border-radius:50%;background:#183b37;border:8px solid #fbf9f5}
.mark2{position:absolute;top:-10px;bottom:-10px;width:5px;margin-left:-2px;background:#fbf9f5;border-radius:3px}
.stages{margin-top:70px;display:grid;gap:24px}
.stage{background:#fff;border:3px solid #e8e1d5;border-radius:42px;padding:44px 46px;transform-origin:left center}
.stage b{display:block;font-size:36px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#a9813c}
.stage span{display:block;margin-top:10px;font-size:70px;line-height:1.08;font-weight:700;letter-spacing:-.025em}
.stage span::first-letter{text-transform:uppercase}
.big{margin-top:10px;font-size:340px;line-height:1.12;font-weight:700;letter-spacing:-.05em;color:#183b37;font-variant-numeric:tabular-nums}
.cap{margin-top:8px;font-size:70px;line-height:1.14;font-weight:700;letter-spacing:-.02em}
.cap em{color:#2f7c72;font-size:1.08em}
.cap2{margin-top:48px;font-size:52px;line-height:1.25;font-weight:500;color:#5d6865;padding:32px 36px;background:#fff;border:3px solid #e8e1d5;border-radius:36px}
.closing{font-size:112px;line-height:1.05;font-weight:700;letter-spacing:-.035em}
.closing em{color:#d8b876;font-size:1.06em}
.cta{margin-top:64px;align-self:flex-start;white-space:nowrap;transform-origin:left center;background:#fbf9f5;color:#183b37;font-weight:700;font-size:56px;letter-spacing:-.02em;padding:38px 52px;border-radius:999px}
.url{margin-top:26px;font-size:46px;font-weight:700;color:#d8b876;letter-spacing:.01em}
.save{margin-top:52px;font-size:58px;font-weight:500}
.fine{margin-top:44px;font-size:36px;line-height:1.35;color:#b9c9c4}
`;

const js = `
const END=${END}, EX_START=${EX_START}, EX_LEN=${EX_LEN}, STAGE_AT=${JSON.stringify(STAGE_AT)}, S_STAGES=${S.stages}, S_FUEL=${S.fuel};
const FIGS=${JSON.stringify(figures.map(({ prop, ...f }) => f))};
const HIGH=${JSON.stringify(exercises.map((e) => e.high))};
const clamp=(x)=>Math.max(0,Math.min(1,x));
const out3=(x)=>1-Math.pow(1-x,3);
const inout=(x)=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
const back=(x)=>{const c=1.70158,c3=c+1;return 1+c3*Math.pow(x-1,3)+c*Math.pow(x-1,2)};
const q=(s)=>[...document.querySelectorAll(s)];
const scenes=q('.scene'), ins=q('[data-in]'), pops=q('[data-pop]'), flips=q('[data-flip]'), counts=q('[data-count]');
const fills=q('[data-fill]'), strikes=q('[data-strike]'), stageEls=q('.stage'), exEls=q('.ex'), stepEls=q('.step');
const NS='http://www.w3.org/2000/svg';
// Build the figure elements once; seek() only moves them.
exEls.forEach((el,i)=>{
  const f=FIGS[i];
  const mk=(g,chain)=>{const p=document.createElementNS(NS,'polyline');g.appendChild(p);return {p,chain}};
  const near=el.querySelector('.near'), far=el.querySelector('.far');
  el._far=f.far.map((c)=>mk(far,c));
  el._near=f.near.map((c)=>mk(near,c));
  const head=document.createElementNS(NS,'circle');head.setAttribute('r',36);head.setAttribute('class','head');near.appendChild(head);el._head=head;
  if(f.weight){const w=document.createElementNS(NS,'rect');w.setAttribute('class','weight');w.setAttribute('width',76);w.setAttribute('height',34);w.setAttribute('rx',12);near.appendChild(w);el._weight=w;}
});
const bar=document.querySelector('#bar i'), barWrap=document.getElementById('bar'), logo=document.getElementById('logo');
window.seek=(t)=>{
  let dark=0;
  for(const s of scenes){
    const a=+s.dataset.s,e=+s.dataset.e;
    // 0.2 s cross-fade centred on the cut, so the two scenes overlap and no frame is blank.
    const fin=a===0?1:clamp((t-a+0.1)/0.2), fout=clamp((t-e+0.1)/0.2);
    const o=Math.min(fin,1-fout);
    s.style.opacity=o;
    s.style.transform='translateY('+((1-fin)*70-fout*70)+'px)';
    if(s.classList.contains('dark'))dark=o;
  }
  for(const el of ins){
    const p=out3(clamp((t-+el.dataset.in)/0.5));
    el.style.opacity=p;el.style.transform='translateY('+((1-p)*60)+'px)';
  }
  for(const el of pops){
    const x=clamp((t-+el.dataset.pop)/0.45);
    el.style.opacity=clamp(x*3);el.style.transform='scale('+(x<=0?0:back(x))+')';
  }
  for(const el of flips){
    const x=clamp((t-+el.dataset.flip)/0.5);
    el.style.opacity=clamp(x*2.5);
    el.style.transform='rotateX('+((1-back(x))*-95)+'deg)';
  }
  for(const el of strikes){
    const p=out3(clamp((t-+el.dataset.strike)/0.25));
    el.firstElementChild.style.transform='rotate(-38deg) scaleX('+p+')';
  }
  for(const el of counts){
    const p=out3(clamp((t-+el.dataset.at)/(+el.dataset.dur||0.9)));
    el.textContent=(+el.dataset.count*p).toFixed(+el.dataset.dec);
  }
  for(const el of fills){
    const p=out3(clamp((t-+el.dataset.fill)/0.45));
    el.querySelector('.fill').style.width=(p*100)+'%';
    el.style.opacity=0.35+0.65*p;
    if(el.classList.contains('strong'))el.style.color=p>0.5?'#fbf9f5':'#1c2a28';
    el.querySelector('b').style.color=el.classList.contains('strong')&&p>0.5?'#d8b876':'#a9813c';
  }
  // Five moves: one exercise at a time.
  exEls.forEach((el,i)=>{
    const a=EX_START+i*EX_LEN, last=i===exEls.length-1;
    const fin=clamp((t-a+0.08)/0.16), fout=last?0:clamp((t-a-EX_LEN+0.08)/0.16);
    const o=Math.min(fin,1-fout);
    el.style.opacity=o;
    el.style.transform='translateX('+((1-fin)*80-fout*80)+'px)';
    stepEls[i].style.setProperty('--w',(clamp((t-a)/EX_LEN)*100)+'%');
    if(o<=0)return;
    const f=FIGS[i];
    // Two smooth reps of the movement while the exercise is on screen.
    const m=0.5-0.5*Math.cos(2*Math.PI*Math.max(0,t-a)/(EX_LEN/2));
    const P={};for(const k in f.a)P[k]=[f.a[k][0]+(f.b[k][0]-f.a[k][0])*m,f.a[k][1]+(f.b[k][1]-f.a[k][1])*m];
    for(const g of [...el._far,...el._near])g.p.setAttribute('points',g.chain.map((k)=>P[k][0].toFixed(1)+','+P[k][1].toFixed(1)).join(' '));
    el._head.setAttribute('cx',P.head[0]);el._head.setAttribute('cy',P.head[1]);
    if(el._weight){el._weight.setAttribute('x',P[f.weight][0]-38);el._weight.setAttribute('y',P[f.weight][1]-4);}
    const c=Math.round(HIGH[i]*clamp((t-a-0.15)/0.75));
    el.querySelector('.count').textContent=c;
  });
  // Eight weeks: weeks 1–2, 3–4 and 5–8 as a quarter, a quarter and a half of the bar.
  const stops=[0,0.25,0.5,1];
  let prog=0;
  STAGE_AT.forEach((at,i)=>{const p=inout(clamp((t-at)/0.9));prog=Math.max(prog,stops[i]+(stops[i+1]-stops[i])*p*(t>=at?1:0));});
  if(t<STAGE_AT[0])prog=0;
  document.getElementById('trackfill').style.width=(prog*100)+'%';
  document.getElementById('trackdot').style.left=(prog*100)+'%';
  stageEls.forEach((el,i)=>{
    const on=out3(clamp((t-STAGE_AT[i])/0.4));
    const next=STAGE_AT[i+1]??Infinity;
    const off=clamp((t-next)/0.3);
    el.style.opacity=0.35+0.65*on-0.35*off*on;
    el.style.transform='scale('+(0.94+0.06*on-0.03*off)+')';
    el.style.borderColor=on>0.5&&off<0.5?'#2f7c72':'#e8e1d5';
  });
  document.getElementById('b1').style.transform='translate('+(Math.sin(t*0.5)*50)+'px,'+(Math.cos(t*0.4)*60)+'px) scale('+(1+Math.sin(t*0.3)*0.06)+')';
  document.getElementById('b2').style.transform='translate('+(Math.cos(t*0.45)*60)+'px,'+(Math.sin(t*0.5)*50)+'px)';
  logo.style.color=dark>0.5?'#fbf9f5':'#1c2a28';
  barWrap.style.background=dark>0.5?'rgba(251,249,245,.18)':'rgba(28,42,40,.1)';
  bar.style.background=dark>0.5?'#d8b876':'#2f7c72';
  bar.style.width=(clamp(t/END)*100)+'%';
};
window.seek(0);
`;

const html = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>${esc(title)}: Reel</title><style>${css}</style></head><body>
<div class="blob" id="b1"></div><div class="blob" id="b2"></div>
${hook}${formulaScene}${goalScene}${weekScene}${movesScene}${stagesScene}${fuelScene}${closeScene}
<div id="bar"><i></i></div>
${logo}
<script>${js}</script></body></html>`;

// Brand rule: one word, no ampersand and no spaces.
const wrongBrand = new RegExp('Sharp' + '\\s*(&|and\\s)', 'i');
if (wrongBrand.test(html.replace(/data:font[^)]+/g, ''))) throw new Error('Write the brand name as one word, with no ampersand or spaces.');

mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'reel.html'), html);
writeFileSync(join(out, 'timeline.json'), JSON.stringify({ ...timeline, scenes: S }, null, 2));
console.log(`reel.html written (${(html.length / 1024).toFixed(0)} KB), ${END} s`);
console.log({ exercises: exercises.map((e) => `${e.name} ${e.low}–${e.high}${e.eachSide ? ' each side' : ''}`), stages: stages.map((s) => `${s.weeks}: ${s.text}`), protein: `${proteinPerKg} g/kg, ${exampleKg} kg → ${exampleGrams} g` });
