/*
 * Draws public/images/fruit-glycaemic-load.jpg from lib/fruit-gi.ts, so the
 * chart and the article table can never disagree. Run: npm run chart:fruit-gl
 */
import sharp from 'sharp';
import { rankedFruits, glycaemicLoad, giBand, glBand, fruits } from '../lib/fruit-gi';

const C = {
  page: '#f5f1ea',
  panel: '#dce3da',
  pine: '#1c3a36',
  teal: '#2e7b70',
  coral: '#e0735a',
  ink: '#1c2a28',
  muted: '#5d6865',
};
const F = 'Liberation Sans, Arial, sans-serif';
const list = rankedFruits();
const W = 2400;
const rowH = 62;
const panel = { x: 120, y: 300, w: 2160, h: 190 + list.length * rowH };
const H = panel.y + panel.h + 260;
const x0 = 760;
const x1 = 1900;
const max = Math.max(16, Math.ceil(Math.max(...list.map(glycaemicLoad)) / 2) * 2);
const X = (v: number) => x0 + (v / max) * (x1 - x0);
const text = (x: number, y: number, s: string, size: number, fill: string, extra = '') =>
  `<text x="${x}" y="${y}" font-family="${F}" font-size="${size}" fill="${fill}" ${extra}>${s}</text>`;

let g = `<rect width="${W}" height="${H}" fill="${C.page}"/>`;
g += text(120, 165, `${fruits.length} FRUITS BY GLYCAEMIC LOAD`, 78, C.pine, 'letter-spacing="1"');
g += text(
  120,
  240,
  'Glycaemic load of one serving, lowest first — with each fruit’s glycaemic index',
  40,
  C.ink,
);
g += `<rect x="${panel.x}" y="${panel.y}" width="${panel.w}" height="${panel.h}" rx="44" fill="${C.panel}"/>`;
g += text(panel.x + 60, panel.y + 70, 'FRUIT (SERVING)', 28, C.muted, 'letter-spacing="2"');
g += text(x0, panel.y + 70, 'GLYCAEMIC LOAD PER SERVING', 28, C.muted, 'letter-spacing="2"');
g += text(
  panel.x + panel.w - 60,
  panel.y + 70,
  'GI',
  28,
  C.muted,
  'letter-spacing="2" text-anchor="end"',
);
const top = panel.y + 100;
const bottom = top + list.length * rowH;
g += `<rect x="${X(0)}" y="${top}" width="${X(10.5) - X(0)}" height="${bottom - top}" fill="#ffffff" fill-opacity="0.35"/>`;
g += `<line x1="${X(10.5)}" y1="${top}" x2="${X(10.5)}" y2="${bottom}" stroke="${C.pine}" stroke-width="3" stroke-dasharray="10 8"/>`;
for (const t of [0, 5]) {
  if (t <= max) g += text(X(t), bottom + 50, String(t), 28, C.muted, 'text-anchor="middle"');
}
g += text(X(10.5) + 14, bottom + 50, '10: low / medium line', 28, C.pine);
list.forEach((f, i) => {
  const cy = top + i * rowH + rowH / 2;
  const gl = glycaemicLoad(f);
  const r = Math.round(gl);
  g += text(
    panel.x + 60,
    cy + 12,
    `${f.name}${f.servingG === 120 ? '' : ` (${f.servingG} g)`}`,
    36,
    C.ink,
  );
  g += `<rect x="${X(0)}" y="${cy - 18}" width="${Math.max(X(gl) - X(0), 30)}" height="36" rx="18" fill="${glBand(gl) === 'low' ? C.teal : C.coral}"/>`;
  g += text(X(gl) + 18, cy + 11, String(r), 32, C.pine, 'font-weight="bold"');
  g += text(
    panel.x + panel.w - 60,
    cy + 12,
    `${f.approximate ? '~' : ''}${f.gi}`,
    34,
    giBand(f.gi) === 'low' ? C.teal : C.coral,
    'font-weight="bold" text-anchor="end"',
  );
});
const ly = panel.y + panel.h + 60;
g += `<rect x="126" y="${ly}" width="44" height="26" rx="13" fill="${C.teal}"/>`;
g += text(186, ly + 23, 'Low (GL 10 or under; GI 55 or under)', 30, C.pine);
g += `<rect x="846" y="${ly}" width="44" height="26" rx="13" fill="${C.coral}"/>`;
g += text(906, ly + 23, 'Medium or high', 30, C.pine);
g += text(
  120,
  ly + 90,
  'Serving: 120 g fresh fruit (the GI tables’ standard serving); 30 g dried fruit (one 5 A Day portion). GI: published averages; values vary by variety and ripeness.',
  26,
  C.muted,
);
g += text(
  120,
  ly + 135,
  'GL = GI × net carbohydrate in a serving ÷ 100, our calculation from USDA FoodData Central carbohydrate and fibre. SharpAndLean chart.',
  26,
  C.muted,
);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${g}</svg>`;
sharp(Buffer.from(svg))
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile('public/images/fruit-glycaemic-load.jpg')
  .then(() =>
    console.log(`Wrote public/images/fruit-glycaemic-load.jpg (${W}×${H}, ${list.length} fruits)`),
  );
