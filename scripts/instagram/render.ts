/*
 * Instagram slide templates (1080 × 1350, the 4:5 portrait feed size), drawn
 * as SVG in the site palette and rendered to JPG with sharp — the same
 * approach as scripts/og-cards.ts, so no browser is needed.
 *
 * Text is wrapped with an average-glyph-width estimate rather than real font
 * metrics. `fit()` shrinks a block until it fits its box, so long pros or
 * summaries degrade to smaller type instead of overflowing.
 */
import sharp from 'sharp';

export const W = 1080;
export const H = 1350;

export const C = {
  paper: '#fbf9f5',
  cream: '#f3efe7',
  creamDeep: '#e8e1d5',
  pine: '#183b37',
  pine2: '#22504a',
  teal: '#2f7c72',
  ochre: '#a9813c',
  ochreLight: '#d8b876',
  terracotta: '#e07a5f',
  peach: '#f3b596',
  ink: '#1c2a28',
  muted: '#5d6865',
  green: '#7cc47e',
};

const SANS = "'DM Sans', Helvetica, Arial, sans-serif";
const SERIF = "Newsreader, Georgia, 'Times New Roman', serif";

export const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ---------- text layout ---------- */

/** Rough average glyph width as a fraction of font size. */
const WIDTH = { sans: 0.46, sansBold: 0.52, serif: 0.43 } as const;
type Face = keyof typeof WIDTH;

export function wrap(text: string, size: number, maxWidth: number, face: Face = 'sans'): string[] {
  const perLine = Math.max(8, Math.floor(maxWidth / (size * WIDTH[face])));
  const words = text.replace(/\s+/g, ' ').trim().split(' ');
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (next.length > perLine && line) {
      lines.push(line);
      line = w;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

/** Largest size between max and min whose wrapped block fits maxHeight. */
export function fit(
  text: string,
  opts: { max: number; min: number; width: number; height: number; lh?: number; face?: Face },
) {
  const lh = opts.lh ?? 1.25;
  for (let size = opts.max; size >= opts.min; size -= 2) {
    const lines = wrap(text, size, opts.width, opts.face);
    if (lines.length * size * lh <= opts.height) return { size, lines, lh };
  }
  // Still too long at the minimum size: truncate with an ellipsis.
  const size = opts.min;
  const maxLines = Math.max(1, Math.floor(opts.height / (size * lh)));
  const lines = wrap(text, size, opts.width, opts.face).slice(0, maxLines);
  lines[lines.length - 1] = lines[lines.length - 1].replace(/[\s,;:.—-]*\S*$/, '') + '…';
  return { size, lines, lh };
}

export function textBlock(
  x: number,
  y: number,
  t: { size: number; lines: string[]; lh: number },
  attrs: string,
) {
  // y is the top of the block; SVG text y is the baseline.
  return t.lines
    .map(
      (l, i) =>
        `<text x="${x}" y="${Math.round(y + t.size * 0.9 + i * t.size * t.lh)}" ${attrs} font-size="${t.size}">${esc(l)}</text>`,
    )
    .join('');
}

export const blockHeight = (t: { size: number; lines: string[]; lh: number }) =>
  t.lines.length * t.size * t.lh;

/* ---------- shared chrome ---------- */

export function scoreColour(score: number) {
  if (score >= 7) return C.teal;
  if (score >= 5) return C.ochre;
  return C.terracotta;
}

function mark(x: number, y: number, light = false) {
  const ink = light ? C.paper : C.ink;
  const sq = (dx: number, dy: number, fill: string) =>
    `<rect x="${x + dx}" y="${y + dy}" width="18" height="18" rx="5" fill="${fill}"/>`;
  return sq(0, 0, ink) + sq(22, 0, ink) + sq(0, 22, ink) + sq(22, 22, C.green);
}

export type Theme = 'light' | 'dark';

export function frame(body: string, opts: { page: number; total: number; theme?: Theme }) {
  const dark = opts.theme === 'dark';
  const bg = dark ? C.pine : C.paper;
  const fg = dark ? C.paper : C.ink;
  const sub = dark ? '#b9c9c4' : C.muted;
  const blobs = dark
    ? `<circle cx="1040" cy="80" r="380" fill="${C.teal}" fill-opacity="0.35"/>
       <circle cx="40" cy="1330" r="360" fill="${C.ochre}" fill-opacity="0.18"/>`
    : `<circle cx="1060" cy="60" r="380" fill="#2c6b64" fill-opacity="0.12"/>
       <circle cx="20" cy="1340" r="360" fill="#f2a07f" fill-opacity="0.18"/>`;
  const dots = Array.from({ length: opts.total }, (_, i) => {
    const active = i === opts.page - 1;
    const cx = W - 80 - (opts.total - 1 - i) * 22;
    return `<circle cx="${cx}" cy="1268" r="${active ? 6 : 4}" fill="${fg}" fill-opacity="${active ? 0.9 : 0.25}"/>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${bg}"/>
  ${blobs}
  ${body}
  ${mark(80, 1248, dark)}
  <text x="132" y="1279" font-family="${SANS}" font-size="28" font-weight="700" fill="${fg}">Sharp&amp;Lean</text>
  <text x="318" y="1279" font-family="${SANS}" font-size="22" fill="${sub}">sharpandlean.com</text>
  ${opts.total > 1 ? dots : ''}
</svg>`;
}

export function kicker(text: string, y = 150, colour: string = C.ochre) {
  return `<text x="80" y="${y}" font-family="${SANS}" font-size="26" font-weight="700" letter-spacing="4" fill="${colour}">${esc(text.toUpperCase())}</text>`;
}

/* ---------- slide types ---------- */

export type Slide =
  | {
      kind: 'cover';
      kicker: string;
      hook: string;
      product?: string;
      score?: number | null;
      cta?: string;
    }
  | { kind: 'statement'; kicker: string; text: string; note?: string; theme?: Theme }
  | { kind: 'summary'; kicker: string; text: string; verdict?: string }
  | { kind: 'scores'; kicker: string; title: string; rows: { label: string; value: number }[]; note?: string }
  | { kind: 'list'; kicker: string; title: string; items: string[]; tone: 'good' | 'bad' | 'neutral' }
  | { kind: 'cta'; title: string; line: string; small: string; kicker?: string };

function cover(s: Extract<Slide, { kind: 'cover' }>) {
  const hook = fit(s.hook, { max: 110, min: 60, width: 920, height: 600, lh: 1.1, face: 'sansBold' });
  let out = kicker(s.kicker);
  out += textBlock(80, 210, hook, `font-family="${SANS}" font-weight="700" fill="${C.ink}"`);
  const hookEnd = 210 + blockHeight(hook);
  if (s.product) {
    const p = fit(s.product, { max: 40, min: 28, width: s.score != null ? 560 : 900, height: 110, lh: 1.2 });
    out += `<rect x="80" y="${hookEnd + 40}" width="60" height="6" rx="3" fill="${C.teal}"/>`;
    out += textBlock(80, hookEnd + 70, p, `font-family="${SERIF}" font-style="italic" fill="${C.pine}"`);
  }
  if (s.score != null) {
    const col = scoreColour(s.score);
    const cx = 830;
    const cy = 1010;
    const r = 150;
    const circ = 2 * Math.PI * (r - 14);
    const pct = Math.max(0, Math.min(1, s.score / 10));
    out += `
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffffff" stroke="${C.creamDeep}" stroke-width="2"/>
      <circle cx="${cx}" cy="${cy}" r="${r - 14}" fill="none" stroke="${C.cream}" stroke-width="18"/>
      <circle cx="${cx}" cy="${cy}" r="${r - 14}" fill="none" stroke="${col}" stroke-width="18" stroke-linecap="round"
        stroke-dasharray="${(circ * pct).toFixed(1)} ${circ.toFixed(1)}" transform="rotate(-90 ${cx} ${cy})"/>
      <text x="${cx}" y="${cy + 28}" text-anchor="middle" font-family="${SANS}" font-size="104" font-weight="700" fill="${C.ink}">${s.score.toFixed(1)}</text>
      <text x="${cx}" y="${cy + 72}" text-anchor="middle" font-family="${SANS}" font-size="26" fill="${C.muted}">out of 10</text>
      <text x="${cx}" y="${cy - 70}" text-anchor="middle" font-family="${SANS}" font-size="20" font-weight="700" letter-spacing="3" fill="${col}">OUR SCORE</text>`;
  }
  out += `<text x="80" y="1150" font-family="${SANS}" font-size="30" font-weight="600" fill="${C.teal}">${esc(s.cta ?? 'Swipe for the breakdown  →')}</text>`;
  return out;
}

function statement(s: Extract<Slide, { kind: 'statement' }>) {
  const dark = s.theme === 'dark';
  const t = fit(s.text, { max: 76, min: 44, width: 900, height: s.note ? 640 : 820, lh: 1.18, face: 'serif' });
  let out = kicker(s.kicker, 150, dark ? C.ochreLight : C.ochre);
  out += textBlock(80, 230, t, `font-family="${SERIF}" fill="${dark ? C.paper : C.ink}"`);
  if (s.note) {
    const n = fit(s.note, { max: 34, min: 24, width: 900, height: 230, lh: 1.35 });
    const y = 230 + blockHeight(t) + 60;
    out += `<rect x="80" y="${y}" width="60" height="6" rx="3" fill="${dark ? C.ochreLight : C.teal}"/>`;
    out += textBlock(80, y + 36, n, `font-family="${SANS}" fill="${dark ? '#d6e2de' : C.muted}"`);
  }
  return out;
}

function summary(s: Extract<Slide, { kind: 'summary' }>) {
  const t = fit(s.text, { max: 64, min: 34, width: 920, height: s.verdict ? 600 : 880, lh: 1.28, face: 'serif' });
  let out = kicker(s.kicker);
  out += textBlock(80, 210, t, `font-family="${SERIF}" fill="${C.ink}"`);
  if (s.verdict) {
    const v = fit(s.verdict, { max: 44, min: 28, width: 840, height: 300, lh: 1.3 });
    const boxH = blockHeight(v) + 130;
    const y = Math.min(1180 - boxH, 210 + blockHeight(t) + 60);
    out += `<rect x="80" y="${y}" width="920" height="${boxH}" rx="32" fill="${C.pine}"/>
      <text x="120" y="${y + 62}" font-family="${SANS}" font-size="22" font-weight="700" letter-spacing="3" fill="${C.ochreLight}">OUR VERDICT</text>`;
    out += textBlock(120, y + 88, v, `font-family="${SANS}" font-weight="500" fill="${C.paper}"`);
  }
  return out;
}

function scores(s: Extract<Slide, { kind: 'scores' }>) {
  const title = fit(s.title, { max: 64, min: 44, width: 900, height: 170, lh: 1.15 });
  let out = kicker(s.kicker);
  out += textBlock(80, 200, title, `font-family="${SANS}" font-weight="700" fill="${C.ink}"`);
  const top = 200 + blockHeight(title) + 50;
  const avail = (s.note ? 1110 : 1190) - top;
  const rowH = Math.min(170, avail / s.rows.length);
  const labelSize = rowH < 110 ? 28 : rowH < 140 ? 32 : 36;
  s.rows.forEach((r, i) => {
    const y = top + i * rowH;
    const col = scoreColour(r.value);
    const w = Math.max(14, (820 * r.value) / 10);
    const label = r.label.length > 52 ? r.label.slice(0, 50) + '…' : r.label;
    out += `<text x="80" y="${y + labelSize}" font-family="${SANS}" font-size="${labelSize}" font-weight="600" fill="${C.ink}">${esc(label)}</text>
      <rect x="80" y="${y + labelSize + 18}" width="820" height="26" rx="13" fill="${C.cream}"/>
      <rect x="80" y="${y + labelSize + 18}" width="${w}" height="26" rx="13" fill="${col}"/>
      <text x="1000" y="${y + labelSize + 41}" text-anchor="end" font-family="${SANS}" font-size="34" font-weight="700" fill="${col}">${Number.isInteger(r.value) ? r.value : r.value.toFixed(1)}</text>`;
  });
  if (s.note) {
    const n = fit(s.note, { max: 26, min: 22, width: 900, height: 80, lh: 1.3 });
    out += textBlock(80, 1125, n, `font-family="${SANS}" fill="${C.muted}"`);
  }
  return out;
}

function list(s: Extract<Slide, { kind: 'list' }>) {
  const col = s.tone === 'good' ? C.teal : s.tone === 'bad' ? C.terracotta : C.ochre;
  const glyph = s.tone === 'good' ? '✓' : s.tone === 'bad' ? '!' : '•';
  const title = fit(s.title, { max: 68, min: 46, width: 900, height: 170, lh: 1.15 });
  let out = kicker(s.kicker, 150, col);
  out += textBlock(80, 200, title, `font-family="${SANS}" font-weight="700" fill="${C.ink}"`);
  let y = 200 + blockHeight(title) + 50;
  const gap = 28;
  const avail = 1190 - y - gap * (s.items.length - 1) - 70 * s.items.length;
  // One type size for every card, the largest at which all of them fit together.
  let size = 44;
  for (; size > 24; size -= 2) {
    const total = s.items.reduce((h, item) => h + wrap(item, size, 770).length * size * 1.3, 0);
    if (total <= avail) break;
  }
  for (const item of s.items) {
    const t = { size, lines: wrap(item, size, 770), lh: 1.3 };
    const h = blockHeight(t) + 70;
    out += `<rect x="80" y="${y}" width="920" height="${h}" rx="28" fill="#ffffff" stroke="${C.creamDeep}" stroke-width="2"/>
      <circle cx="140" cy="${y + 64}" r="26" fill="${col}"/>
      <text x="140" y="${y + 75}" text-anchor="middle" font-family="${SANS}" font-size="30" font-weight="700" fill="#ffffff">${glyph}</text>`;
    out += textBlock(196, y + 36, t, `font-family="${SANS}" fill="${C.ink}"`);
    y += h + gap;
  }
  return out;
}

function cta(s: Extract<Slide, { kind: 'cta' }>) {
  const t = fit(s.title, { max: 96, min: 56, width: 920, height: 520, lh: 1.1, face: 'sansBold' });
  let out = kicker(s.kicker ?? 'Read the full review', 150, C.ochreLight);
  out += textBlock(80, 230, t, `font-family="${SANS}" font-weight="700" fill="${C.paper}"`);
  const y = 230 + blockHeight(t) + 70;
  const pillW = Math.min(920, Math.round(s.line.length * 38 * 0.5) + 110);
  out += `<rect x="80" y="${y}" width="${pillW}" height="110" rx="55" fill="${C.paper}"/>
    <text x="130" y="${y + 70}" font-family="${SANS}" font-size="38" font-weight="700" fill="${C.pine}">${esc(s.line)}</text>`;
  const sm = fit(s.small, { max: 26, min: 20, width: 900, height: 200, lh: 1.4 });
  out += textBlock(80, 1200 - blockHeight(sm) - 20, sm, `font-family="${SANS}" fill="#b9c9c4"`);
  return out;
}

export function slideSvg(s: Slide, page: number, total: number): string {
  switch (s.kind) {
    case 'cover':
      return frame(cover(s), { page, total });
    case 'statement':
      return frame(statement(s), { page, total, theme: s.theme });
    case 'summary':
      return frame(summary(s), { page, total });
    case 'scores':
      return frame(scores(s), { page, total });
    case 'list':
      return frame(list(s), { page, total });
    case 'cta':
      return frame(cta(s), { page, total, theme: 'dark' });
  }
}

export async function renderSlide(s: Slide, page: number, total: number, out: string) {
  await sharp(Buffer.from(slideSvg(s, page, total)))
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(out);
}
