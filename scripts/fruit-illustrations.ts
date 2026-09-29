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

const pieces: Record<string, () => string> = {
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
