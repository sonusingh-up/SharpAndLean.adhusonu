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

const pieces: Record<string, () => string> = {
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
