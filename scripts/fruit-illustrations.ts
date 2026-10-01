/*
 * Flat, house-style illustrations of fruit for /learn articles, drawn as SVG
 * and rendered to JPG. They are illustrations, not photographs, and the
 * articles' alt text and captions say so. Run: npm run illustrate:fruit
 */
import sharp from 'sharp';

const C = {
  page: '#f5f1ea',
  panel: '#dce3da',
  pine: '#1c3a36',
  teal: '#2e7b70',
  coral: '#e0735a',
  cream: '#fbf8f2',
};
const W = 2400;
const H = 1350;

/** A soft plate the fruit sits on. */
function plate(cx: number, cy: number, rx: number, ry: number) {
  return (
    `<ellipse cx="${cx}" cy="${cy + 28}" rx="${rx + 20}" ry="${ry + 16}" fill="#000" fill-opacity="0.06"/>` +
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${C.cream}"/>` +
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx - 60}" ry="${ry - 36}" fill="none" stroke="#e8e1d5" stroke-width="6"/>`
  );
}

function background(extra = '') {
  return (
    `<rect width="${W}" height="${H}" fill="${C.page}"/>` +
    `<circle cx="2150" cy="180" r="420" fill="${C.panel}" fill-opacity="0.7"/>` +
    `<circle cx="260" cy="1220" r="360" fill="${C.coral}" fill-opacity="0.12"/>` +
    extra
  );
}

/** Shared gradients, placed once per image. */
const defs = `<defs>
  <radialGradient id="prune-skin" cx="0.38" cy="0.32" r="0.75">
    <stop offset="0" stop-color="#7a4a6c"/>
    <stop offset="0.45" stop-color="#48213f"/>
    <stop offset="1" stop-color="#1f0c1a"/>
  </radialGradient>
</defs>`;

/** One prune: a lumpy, glossy, wrinkled oval with its stem end. */
function prune(x: number, y: number, s: number, rot: number) {
  const body =
    'M-128 4 C-130 -52 -70 -96 -6 -92 C64 -98 126 -58 130 -6 C134 50 84 92 12 94 C-60 98 -126 62 -128 4 Z';
  const wrinkles = [
    'M-104 -30 C-70 -46 -40 -20 -6 -34 S60 -30 98 -44',
    'M-114 12 C-80 -2 -46 22 -10 6 S58 16 110 2',
    'M-96 52 C-60 38 -24 60 12 44 S70 56 96 40',
    'M-70 -64 C-50 -56 -30 -70 -12 -60',
    'M20 70 C40 62 60 76 80 64',
    'M-60 76 C-44 70 -30 80 -16 72',
  ]
    .map(
      (d, i) =>
        `<path d="${d}" fill="none" stroke="${i % 2 ? '#8a5a7e' : '#14060f'}" stroke-opacity="${i % 2 ? 0.35 : 0.55}" stroke-width="${i < 3 ? 5 : 3.5}" stroke-linecap="round"/>`,
    )
    .join('');
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
    <ellipse cx="6" cy="30" rx="124" ry="70" fill="#000" fill-opacity="0.14"/>
    <path d="${body}" fill="url(#prune-skin)"/>
    ${wrinkles}
    <ellipse cx="96" cy="-4" rx="14" ry="10" fill="#1a0915"/>
    <ellipse cx="-50" cy="-52" rx="40" ry="13" fill="#fff" fill-opacity="0.32" transform="rotate(-16 -50 -52)"/>
    <ellipse cx="18" cy="-66" rx="14" ry="5" fill="#fff" fill-opacity="0.22"/>
  </g>`;
}

/** A cut grapefruit half, seen from above: rind, pith and pink segments. */
function grapefruitHalf(x: number, y: number, r: number, rot: number) {
  const n = 12;
  let segs = '';
  for (let i = 0; i < n; i++) {
    const a0 = ((i + 0.08) / n) * Math.PI * 2;
    const a1 = ((i + 0.92) / n) * Math.PI * 2;
    const ri = r * 0.8;
    const rc = r * 0.1;
    const p = (a: number, rr: number) =>
      `${(Math.cos(a) * rr).toFixed(1)} ${(Math.sin(a) * rr).toFixed(1)}`;
    segs += `<path d="M${p(a0, rc)} L${p(a0, ri)} A${ri} ${ri} 0 0 1 ${p(a1, ri)} L${p(a1, rc)} Z" fill="url(#gf-flesh)"/>`;
    // juice vesicle highlights
    const am = (a0 + a1) / 2;
    segs += `<ellipse cx="${(Math.cos(am) * r * 0.52).toFixed(1)}" cy="${(Math.sin(am) * r * 0.52).toFixed(1)}" rx="${(r * 0.1).toFixed(1)}" ry="${(r * 0.035).toFixed(1)}" fill="#fff" fill-opacity="0.22" transform="rotate(${((am * 180) / Math.PI).toFixed(1)} ${(Math.cos(am) * r * 0.52).toFixed(1)} ${(Math.sin(am) * r * 0.52).toFixed(1)})"/>`;
  }
  return `<g transform="translate(${x} ${y}) rotate(${rot})">
    <ellipse cx="10" cy="${r * 0.18}" rx="${r * 1.02}" ry="${r * 0.98}" fill="#000" fill-opacity="0.1"/>
    <circle r="${r}" fill="#e89a3c"/>
    <circle r="${r * 0.95}" fill="#f2b453"/>
    <circle r="${r * 0.86}" fill="#fbeedd"/>
    <circle r="${r * 0.82}" fill="#f6d9cf"/>
    ${segs}
    <circle r="${r * 0.1}" fill="#fbeedd"/>
  </g>`;
}

/** A whole grapefruit: dimpled, blushed citrus skin. */
function grapefruitWhole(x: number, y: number, r: number) {
  let dots = '';
  for (let i = 0; i < 70; i++) {
    const a = i * 2.39996;
    const d = Math.sqrt(i / 70) * r * 0.9;
    dots += `<circle cx="${(Math.cos(a) * d).toFixed(1)}" cy="${(Math.sin(a) * d).toFixed(1)}" r="3.2" fill="#c9782a" fill-opacity="0.35"/>`;
  }
  return `<g transform="translate(${x} ${y})">
    <ellipse cx="14" cy="${r * 0.9}" rx="${r * 0.95}" ry="${r * 0.2}" fill="#000" fill-opacity="0.1"/>
    <circle r="${r}" fill="url(#gf-skin)"/>
    ${dots}
    <ellipse cx="${-r * 0.35}" cy="${-r * 0.4}" rx="${r * 0.28}" ry="${r * 0.12}" fill="#fff" fill-opacity="0.35" transform="rotate(-30 ${-r * 0.35} ${-r * 0.4})"/>
  </g>`;
}

/** One raisin: a small, dark, crumpled blob with irregular creases. */
function raisin(x: number, y: number, s: number, rot: number, v: number) {
  const shapes = [
    'M-26 0 C-30 -14 -18 -22 -6 -20 C2 -26 18 -22 24 -12 C32 -2 26 14 14 18 C4 24 -10 22 -18 16 C-26 12 -24 6 -26 0 Z',
    'M-24 -4 C-22 -18 -8 -22 4 -18 C16 -22 28 -10 26 2 C28 14 16 22 4 20 C-8 24 -22 16 -24 6 C-28 2 -26 -2 -24 -4 Z',
    'M-28 2 C-26 -12 -12 -20 0 -16 C12 -24 24 -14 26 -2 C30 10 20 20 8 18 C-4 22 -18 20 -24 12 C-30 8 -28 4 -28 2 Z',
  ];
  const creases = [
    'M-14 -10 C-6 -4 -10 6 -2 10',
    'M6 -14 C2 -6 10 0 6 8',
    'M-18 6 C-12 2 -8 8 -4 4',
    'M10 10 C14 4 18 8 20 2',
  ];
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
    <path d="${shapes[v % 3]}" fill="url(#raisin-skin)"/>
    ${creases
      .filter((_, i) => (i + v) % 4 !== 0)
      .map(
        (d) =>
          `<path d="${d}" fill="none" stroke="#12060a" stroke-opacity="0.55" stroke-width="2.2" stroke-linecap="round"/>`,
      )
      .join('')}
    <ellipse cx="-8" cy="-10" rx="6" ry="2.5" fill="#fff" fill-opacity="0.22" transform="rotate(-20 -8 -10)"/>
  </g>`;
}

/** One grape: a glossy green sphere. */
function grape(x: number, y: number, r: number) {
  return `<g transform="translate(${x} ${y})">
    <circle r="${r}" fill="url(#grape-skin)"/>
    <ellipse cx="${-r * 0.35}" cy="${-r * 0.38}" rx="${r * 0.3}" ry="${r * 0.14}" fill="#fff" fill-opacity="0.45" transform="rotate(-30 ${-r * 0.35} ${-r * 0.38})"/>
  </g>`;
}

/** A whole peach: warm blush, soft crease and a leaf. */
function peachWhole(x: number, y: number, r: number, rot: number) {
  return `<g transform="translate(${x} ${y}) rotate(${rot})">
    <ellipse cx="12" cy="${r * 0.92}" rx="${r * 0.9}" ry="${r * 0.18}" fill="#000" fill-opacity="0.1"/>
    <path d="M0 ${-r * 0.92} C${r * 0.62} ${-r * 1.02} ${r * 1.04} ${-r * 0.5} ${r * 0.98} ${r * 0.08} C${r * 0.94} ${r * 0.66} ${r * 0.5} ${r * 0.98} 0 ${r * 0.98} C${-r * 0.5} ${r * 0.98} ${-r * 0.96} ${r * 0.64} ${-r * 0.98} ${r * 0.06} C${-r * 1.02} ${-r * 0.5} ${-r * 0.6} ${-r * 1.02} 0 ${-r * 0.92} Z" fill="url(#peach-skin)"/>
    <path d="M${r * 0.06} ${-r * 0.88} C${r * 0.3} ${-r * 0.4} ${r * 0.28} ${r * 0.3} ${r * 0.04} ${r * 0.9}" fill="none" stroke="#c9523f" stroke-opacity="0.45" stroke-width="${r * 0.05}" stroke-linecap="round"/>
    <ellipse cx="${-r * 0.42}" cy="${-r * 0.42}" rx="${r * 0.26}" ry="${r * 0.12}" fill="#fff" fill-opacity="0.3" transform="rotate(-35 ${-r * 0.42} ${-r * 0.42})"/>
    <path d="M${r * 0.04} ${-r * 0.9} C${r * 0.06} ${-r * 1.06} ${r * 0.1} ${-r * 1.14} ${r * 0.16} ${-r * 1.2}" fill="none" stroke="#6b4a2a" stroke-width="${r * 0.06}" stroke-linecap="round"/>
    <path d="M${r * 0.14} ${-r * 1.14} C${r * 0.5} ${-r * 1.42} ${r * 0.98} ${-r * 1.3} ${r * 1.08} ${-r * 1.06} C${r * 0.7} ${-r * 0.92} ${r * 0.36} ${-r * 0.96} ${r * 0.14} ${-r * 1.14} Z" fill="#6f9e4f"/>
    <path d="M${r * 0.2} ${-r * 1.14} C${r * 0.5} ${-r * 1.18} ${r * 0.8} ${-r * 1.14} ${r * 1.02} ${-r * 1.08}" fill="none" stroke="#557d3a" stroke-width="${r * 0.02}"/>
  </g>`;
}

/** A peach cut in half, stone in place. */
function peachHalf(x: number, y: number, r: number, rot: number) {
  return `<g transform="translate(${x} ${y}) rotate(${rot})">
    <ellipse cx="10" cy="${r * 0.2}" rx="${r * 1.02}" ry="${r * 0.96}" fill="#000" fill-opacity="0.1"/>
    <circle r="${r}" fill="#e4744f"/>
    <circle r="${r * 0.94}" fill="url(#peach-flesh)"/>
    <ellipse rx="${r * 0.4}" ry="${r * 0.5}" fill="#b5553a" fill-opacity="0.35"/>
    <path d="M0 ${-r * 0.4} C${r * 0.3} ${-r * 0.36} ${r * 0.34} ${r * 0.2} 0 ${r * 0.44} C${-r * 0.34} ${r * 0.2} ${-r * 0.3} ${-r * 0.36} 0 ${-r * 0.4} Z" fill="url(#peach-stone)"/>
    <path d="M${-r * 0.1} ${-r * 0.24} C0 ${-r * 0.1} ${-r * 0.1} ${r * 0.06} 0 ${r * 0.2}" fill="none" stroke="#5a2a1a" stroke-opacity="0.5" stroke-width="${r * 0.025}" stroke-linecap="round"/>
    <path d="M${r * 0.1} ${-r * 0.18} C${r * 0.02} 0 ${r * 0.12} ${r * 0.1} ${r * 0.04} ${r * 0.26}" fill="none" stroke="#5a2a1a" stroke-opacity="0.45" stroke-width="${r * 0.02}" stroke-linecap="round"/>
  </g>`;
}

/** A dried ashwagandha root: a long, tapering, lightly ringed taproot with rootlets. */
function ashRoot(x: number, y: number, len: number, w: number, rot: number) {
  const body = `M0 ${-w / 2} C${len * 0.3} ${-w * 0.62} ${len * 0.72} ${-w * 0.28} ${len} 0 C${len * 0.72} ${w * 0.26} ${len * 0.3} ${w * 0.58} 0 ${w / 2} C${-w * 0.2} ${w * 0.3} ${-w * 0.2} ${-w * 0.3} 0 ${-w / 2} Z`;
  let rings = '';
  for (let i = 1; i < 7; i++) {
    const t = i / 7.5;
    const hw = (w / 2) * (1 - t * 0.85);
    rings += `<path d="M${len * t} ${-hw} C${len * t + 6} ${-hw * 0.3} ${len * t - 6} ${hw * 0.3} ${len * t} ${hw}" fill="none" stroke="#8a6238" stroke-opacity="0.4" stroke-width="3" stroke-linecap="round"/>`;
  }
  const rootlets = [
    [0.3, -1, 0.1],
    [0.44, 1, 0.09],
    [0.6, -1, 0.07],
    [0.74, 1, 0.06],
  ]
    .map(([t, side, l]) => {
      const sx = len * t;
      const sy = side * (w / 2) * (1 - t * 0.85);
      return `<path d="M${sx} ${sy} C${sx + len * l * 0.2} ${sy + side * 30} ${sx + len * l * 0.8} ${sy + side * 24} ${sx + len * l} ${sy + side * 48}" fill="none" stroke="#b58a58" stroke-width="${Math.max(3, w * 0.07)}" stroke-linecap="round"/>`;
    })
    .join('');
  return `<g transform="translate(${x} ${y}) rotate(${rot})">
    <path d="${body}" fill="#000" fill-opacity="0.1" transform="translate(10 18)"/>
    ${rootlets}
    <path d="${body}" fill="url(#ash-root)"/>
    ${rings}
    <ellipse cx="${-w * 0.02}" cy="0" rx="${w * 0.12}" ry="${w * 0.42}" fill="#e8d2ad"/>
    <ellipse cx="${len * 0.3}" cy="${-w * 0.26}" rx="${len * 0.16}" ry="${w * 0.07}" fill="#fff" fill-opacity="0.25"/>
  </g>`;
}

/** An ashwagandha leaf: a broad oval with a midrib. */
function ashLeaf(x: number, y: number, s: number, rot: number) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
    <path d="M0 0 C40 -70 170 -80 230 0 C170 80 40 70 0 0 Z" fill="url(#ash-leaf)"/>
    <path d="M0 0 C80 -4 160 -2 226 0" fill="none" stroke="#4d7a3c" stroke-width="5" stroke-linecap="round"/>
    ${[50, 100, 150]
      .map(
        (px) =>
          `<path d="M${px} 0 L${px + 34} -34 M${px} 0 L${px + 34} 34" stroke="#4d7a3c" stroke-opacity="0.6" stroke-width="3" stroke-linecap="round"/>`,
      )
      .join('')}
  </g>`;
}

/** The "winter cherry": a red berry sitting in its opened papery husk. */
function ashBerry(x: number, y: number, r: number, open: boolean) {
  const husk = open
    ? `<path d="M0 ${r * 0.9} C${-r * 1.6} ${r * 0.6} ${-r * 1.7} ${-r * 1.1} ${-r * 0.4} ${-r * 1.9} C${-r * 0.6} ${-r * 0.8} ${-r * 0.4} ${r * 0.2} 0 ${r * 0.9} Z" fill="#d9a05b"/>
       <path d="M0 ${r * 0.9} C${r * 1.6} ${r * 0.6} ${r * 1.7} ${-r * 1.1} ${r * 0.4} ${-r * 1.9} C${r * 0.6} ${-r * 0.8} ${r * 0.4} ${r * 0.2} 0 ${r * 0.9} Z" fill="#c98a45"/>`
    : `<path d="M0 ${-r * 1.9} C${r * 1.3} ${-r * 1.3} ${r * 1.4} ${r * 0.6} 0 ${r * 1.2} C${-r * 1.4} ${r * 0.6} ${-r * 1.3} ${-r * 1.3} 0 ${-r * 1.9} Z" fill="#d9a05b"/>
       <path d="M0 ${-r * 1.9} C${r * 0.4} ${-r * 0.8} ${r * 0.4} ${r * 0.4} 0 ${r * 1.2}" fill="none" stroke="#b07a3c" stroke-width="4"/>`;
  const berry = open
    ? `<circle cy="${-r * 0.1}" r="${r}" fill="url(#ash-berry)"/>
       <ellipse cx="${-r * 0.35}" cy="${-r * 0.45}" rx="${r * 0.28}" ry="${r * 0.14}" fill="#fff" fill-opacity="0.5" transform="rotate(-30 ${-r * 0.35} ${-r * 0.45})"/>`
    : '';
  return `<g transform="translate(${x} ${y})">${husk}${berry}</g>`;
}

/** A two-tone capsule. */
function capsule(x: number, y: number, rot: number) {
  return `<g transform="translate(${x} ${y}) rotate(${rot})">
    <rect x="-86" y="-30" width="172" height="60" rx="30" fill="#000" fill-opacity="0.1" transform="translate(6 12)"/>
    <path d="M0 -30 H-56 A30 30 0 0 0 -56 30 H0 Z" fill="${C.pine}"/>
    <path d="M0 -30 H56 A30 30 0 0 1 56 30 H0 Z" fill="#efe4cf"/>
    <rect x="-70" y="-20" width="56" height="9" rx="4.5" fill="#fff" fill-opacity="0.25"/>
    <rect x="14" y="-20" width="56" height="9" rx="4.5" fill="#fff" fill-opacity="0.6"/>
  </g>`;
}

const pieces: Record<string, () => string> = {
  ashwagandha() {
    let g =
      `<defs>
        <linearGradient id="ash-root" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2c393"/><stop offset="0.55" stop-color="#c79c64"/><stop offset="1" stop-color="#a37645"/></linearGradient>
        <linearGradient id="ash-leaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8fb86a"/><stop offset="1" stop-color="#5f8f48"/></linearGradient>
        <radialGradient id="ash-berry" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#ff8a6a"/><stop offset="0.55" stop-color="#e0473a"/><stop offset="1" stop-color="#a82a24"/></radialGradient>
        <radialGradient id="ash-powder" cx="0.5" cy="0.3" r="0.7"><stop offset="0" stop-color="#ecd8b4"/><stop offset="1" stop-color="#cfaf7c"/></radialGradient>
        <linearGradient id="bowl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e9e2d6"/></linearGradient>
      </defs>` + background();
    g += plate(1080, 800, 740, 320);
    // sprig behind the plate: stem, leaves, berries in their husks
    g += `<path d="M1500 420 C1620 360 1760 330 1930 300" fill="none" stroke="#5e7d45" stroke-width="14" stroke-linecap="round"/>`;
    g += ashLeaf(1560, 400, 1.15, -60);
    g += ashLeaf(1680, 350, 1.05, 30);
    g += ashLeaf(1800, 320, 1.1, -55);
    g += ashLeaf(1880, 305, 0.9, 20);
    g += ashBerry(1640, 470, 34, true);
    g += ashBerry(1770, 430, 32, false);
    g += ashBerry(1900, 390, 30, true);
    // roots on the plate
    g += ashRoot(560, 700, 900, 78, 4);
    g += ashRoot(640, 820, 780, 66, -3);
    g += ashRoot(600, 930, 640, 56, -9);
    // bowl of root powder
    g += `<ellipse cx="1760" cy="1000" rx="300" ry="40" fill="#000" fill-opacity="0.08"/>`;
    g += `<path d="M1480 790 C1495 930 1600 990 1760 990 C1920 990 2025 930 2040 790 Z" fill="url(#bowl)"/>`;
    g += `<ellipse cx="1760" cy="790" rx="280" ry="54" fill="#f3ede3"/>`;
    g += `<path d="M1510 796 C1560 700 1680 660 1760 662 C1850 660 1960 700 2010 796 C1900 830 1620 830 1510 796 Z" fill="url(#ash-powder)"/>`;
    g += `<ellipse cx="1700" cy="700" rx="70" ry="16" fill="#fff" fill-opacity="0.3"/>`;
    // capsules in front
    g += capsule(1330, 1120, -12);
    g += capsule(1540, 1160, 18);
    return g;
  },
  'ashwagandha-daily'() {
    let g =
      `<defs>
        <linearGradient id="ash-root" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2c393"/><stop offset="0.55" stop-color="#c79c64"/><stop offset="1" stop-color="#a37645"/></linearGradient>
        <linearGradient id="ash-leaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8fb86a"/><stop offset="1" stop-color="#5f8f48"/></linearGradient>
        <radialGradient id="ash-berry" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#ff8a6a"/><stop offset="0.55" stop-color="#e0473a"/><stop offset="1" stop-color="#a82a24"/></radialGradient>
        <radialGradient id="ash-powder" cx="0.5" cy="0.3" r="0.7"><stop offset="0" stop-color="#ecd8b4"/><stop offset="1" stop-color="#cfaf7c"/></radialGradient>
        <linearGradient id="bowl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e9e2d6"/></linearGradient>
        <linearGradient id="organiser" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a5a52"/><stop offset="1" stop-color="${C.pine}"/></linearGradient>
        <linearGradient id="mug" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e9e2d6"/><stop offset="0.4" stop-color="#ffffff"/><stop offset="1" stop-color="#e2d9ca"/></linearGradient>
        <radialGradient id="milk" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#f6e6c8"/><stop offset="1" stop-color="#e6cfa4"/></radialGradient>
      </defs>` + background();
    // sprig, top right
    g += `<path d="M1560 300 C1680 250 1820 230 1990 210" fill="none" stroke="#5e7d45" stroke-width="14" stroke-linecap="round"/>`;
    g += ashLeaf(1620, 285, 1.05, -60);
    g += ashLeaf(1740, 250, 1, 28);
    g += ashLeaf(1860, 225, 1.05, -55);
    g += ashBerry(1700, 350, 32, true);
    g += ashBerry(1840, 315, 30, false);
    // seven-day organiser: a tray of lidless compartments, one capsule each
    const ox = 250;
    const oy = 560;
    const cw = 196;
    const ch = 250;
    const gap = 16;
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const trayW = 7 * cw + 8 * gap;
    g += `<rect x="${ox + 14}" y="${oy + 30}" width="${trayW}" height="${ch + 2 * gap + 40}" rx="36" fill="#000" fill-opacity="0.1"/>`;
    g += `<rect x="${ox}" y="${oy}" width="${trayW}" height="${ch + 2 * gap + 40}" rx="36" fill="url(#organiser)"/>`;
    days.forEach((d, i) => {
      const x = ox + gap + i * (cw + gap);
      const y = oy + gap;
      g += `<rect x="${x}" y="${y}" width="${cw}" height="${ch}" rx="24" fill="#f7f2e9"/>`;
      g += `<rect x="${x}" y="${y}" width="${cw}" height="${ch * 0.3}" rx="24" fill="#000" fill-opacity="0.05"/>`;
      g += `<text x="${x + cw / 2}" y="${oy + ch + gap + 34}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="30" font-weight="700" fill="#f3efe7" fill-opacity="0.85">${d}</text>`;
      // the days already taken are empty; today and the rest hold a capsule
      if (i >= 3) g += capsule(x + cw / 2, y + ch * 0.58, i % 2 ? 24 : -18);
    });
    // mug of warm milk, right
    g += `<ellipse cx="2020" cy="1150" rx="230" ry="34" fill="#000" fill-opacity="0.08"/>`;
    g += `<path d="M2170 880 C2270 880 2290 1040 2170 1060" fill="none" stroke="#e2d9ca" stroke-width="34" stroke-linecap="round"/>`;
    g += `<path d="M1840 820 L1860 1110 C1862 1135 1885 1150 1910 1150 L2110 1150 C2135 1150 2158 1135 2160 1110 L2180 820 Z" fill="url(#mug)"/>`;
    g += `<ellipse cx="2010" cy="820" rx="170" ry="36" fill="#efe7da"/>`;
    g += `<ellipse cx="2010" cy="824" rx="150" ry="28" fill="url(#milk)"/>`;
    g += `<path d="M1960 760 C1930 720 1990 690 1960 650 M2040 770 C2010 730 2070 700 2040 660" fill="none" stroke="#c9bfae" stroke-opacity="0.7" stroke-width="10" stroke-linecap="round"/>`;
    // small bowl of powder, front left
    g += `<ellipse cx="560" cy="1210" rx="190" ry="28" fill="#000" fill-opacity="0.08"/>`;
    g += `<path d="M390 1080 C400 1170 470 1205 560 1205 C650 1205 720 1170 730 1080 Z" fill="url(#bowl)"/>`;
    g += `<ellipse cx="560" cy="1080" rx="170" ry="34" fill="#f3ede3"/>`;
    g += `<path d="M408 1084 C440 1030 510 1010 560 1012 C615 1010 682 1030 712 1084 C640 1104 480 1104 408 1084 Z" fill="url(#ash-powder)"/>`;
    // two roots resting by the bowl
    g += ashRoot(800, 1150, 520, 50, -6);
    g += ashRoot(860, 1240, 420, 42, 3);
    return g;
  },

  peaches() {
    let g =
      `<defs>
        <radialGradient id="peach-skin" cx="0.3" cy="0.3" r="0.9"><stop offset="0" stop-color="#ffd39a"/><stop offset="0.45" stop-color="#f7a85f"/><stop offset="0.8" stop-color="#e8674a"/><stop offset="1" stop-color="#c94a3a"/></radialGradient>
        <radialGradient id="peach-flesh" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#f08a4c"/><stop offset="0.45" stop-color="#fbb24f"/><stop offset="1" stop-color="#fdc86a"/></radialGradient>
        <radialGradient id="peach-stone" cx="0.4" cy="0.35" r="0.7"><stop offset="0" stop-color="#b0683f"/><stop offset="1" stop-color="#6e3520"/></radialGradient>
      </defs>` + background();
    g += plate(1200, 800, 760, 320);
    g += peachWhole(1470, 700, 250, 6);
    g += peachHalf(930, 800, 230, -10);
    return g;
  },
  raisins() {
    let g =
      `<defs>
        <radialGradient id="raisin-skin" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#7a4a4a"/><stop offset="0.5" stop-color="#4a2426"/><stop offset="1" stop-color="#231014"/></radialGradient>
        <radialGradient id="grape-skin" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#e3f0a8"/><stop offset="0.55" stop-color="#b5cf5e"/><stop offset="1" stop-color="#7f9b34"/></radialGradient>
        <linearGradient id="bowl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e9e2d6"/></linearGradient>
      </defs>` + background();
    // grape bunch (left)
    const bunch: [number, number][] = [];
    const rows = [5, 5, 4, 4, 3, 2, 1];
    let k = 0;
    rows.forEach((n, row) => {
      for (let i = 0; i < n; i++) {
        k++;
        const jx = Math.sin(k * 12.9898) * 22;
        const jy = Math.cos(k * 78.233) * 18;
        bunch.push([770 + (i - (n - 1) / 2) * 104 + (row % 2) * 30 + jx, 470 + row * 92 + jy]);
      }
    });
    g += `<ellipse cx="770" cy="1210" rx="330" ry="40" fill="#000" fill-opacity="0.07"/>`;
    g += `<path d="M770 470 C770 400 790 350 830 320" fill="none" stroke="#6b4a2a" stroke-width="18" stroke-linecap="round"/>`;
    g += `<path d="M810 340 C870 300 950 320 980 360 C920 380 860 380 810 340 Z" fill="#7aa35a"/>`;
    bunch.forEach(([x, y], i) => (g += grape(x, y, 60 + ((i * 7) % 5) * 3)));
    // bowl of raisins (right)
    g += `<ellipse cx="1600" cy="1010" rx="420" ry="46" fill="#000" fill-opacity="0.08"/>`;
    g += `<path d="M1210 760 C1230 930 1380 1000 1600 1000 C1820 1000 1970 930 1990 760 Z" fill="url(#bowl)"/>`;
    g += `<ellipse cx="1600" cy="760" rx="390" ry="70" fill="#f3ede3"/>`;
    const spots: [number, number, number, number][] = [];
    for (let i = 0; i < 110; i++) {
      const a = i * 2.39996;
      const d = Math.sqrt(i / 110);
      const x = 1600 + Math.cos(a) * d * 340;
      const heap = (1 - Math.min(1, Math.abs(x - 1600) / 360)) * 120;
      spots.push([
        x,
        770 - heap * (0.35 + 0.65 * (1 - d)) + Math.sin(a) * d * 40,
        0.95 + (i % 3) * 0.08,
        (i * 47) % 360,
      ]);
    }
    spots.sort((p, q) => p[1] - q[1]);
    spots.forEach(([x, y, sc, r], i) => (g += raisin(x, y, sc, r, i)));
    return g;
  },
  grapefruit() {
    let g =
      `<defs>
        <radialGradient id="gf-flesh" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#f7a08c"/><stop offset="1" stop-color="#e4604f"/></radialGradient>
        <radialGradient id="gf-skin" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#ffd27a"/><stop offset="0.6" stop-color="#f2a94a"/><stop offset="1" stop-color="#d9772f"/></radialGradient>
      </defs>` + background();
    g += plate(1200, 780, 760, 330);
    g += grapefruitWhole(1560, 640, 250);
    g += grapefruitHalf(1000, 780, 260, 8);
    return g;
  },
  prunes() {
    let g = defs + background();
    g += plate(1200, 760, 720, 330);
    const spots: [number, number, number, number][] = [
      [900, 690, 1.3, -14],
      [1215, 630, 1.36, 6],
      [1510, 700, 1.26, 22],
      [1050, 880, 1.34, 12],
      [1370, 880, 1.3, -8],
    ];
    for (const [x, y, s, r] of spots) g += prune(x, y, s, r);
    return g;
  },
};

const only = process.argv[2];
const names = only ? [only] : Object.keys(pieces);
Promise.all(
  names.map((name) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${pieces[name]()}</svg>`;
    const out = `public/images/illustration-${name}.jpg`;
    return sharp(Buffer.from(svg))
      .jpeg({ quality: 88, mozjpeg: true })
      .toFile(out)
      .then(() => console.log(`Wrote ${out}`));
  }),
);
