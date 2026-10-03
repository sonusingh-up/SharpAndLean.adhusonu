/*
 * Instagram profile assets: the profile picture and story-highlight covers.
 * Run: npx tsx scripts/instagram/brand.ts  → social/instagram/brand/*.jpg
 *
 * Instagram crops both to a circle, so everything sits inside the centre.
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { C, esc } from './render';

const OUT = join(__dirname, '..', '..', 'social', 'instagram', 'brand');
const SANS = "'DM Sans', Helvetica, Arial, sans-serif";

function avatar() {
  const S = 1080;
  const sq = 230;
  const gap = 40;
  const x0 = (S - (sq * 2 + gap)) / 2;
  const cell = (dx: number, dy: number, fill: string) =>
    `<rect x="${x0 + dx * (sq + gap)}" y="${x0 + dy * (sq + gap)}" width="${sq}" height="${sq}" rx="64" fill="${fill}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}">
    <rect width="${S}" height="${S}" fill="${C.pine}"/>
    ${cell(0, 0, C.paper)}${cell(1, 0, C.paper)}${cell(0, 1, C.paper)}${cell(1, 1, C.green)}
  </svg>`;
}

const HIGHLIGHTS: [string, string][] = [
  ['start-here', 'START HERE'],
  ['scores', 'SCORES'],
  ['glp-1', 'GLP-1'],
  ['protein', 'PROTEIN'],
  ['creatine', 'CREATINE'],
  ['ask-sumita', 'ASK SUMITA'],
];

function highlight(label: string) {
  const Wd = 1080;
  const Ht = 1920;
  const words = label.split(' ');
  const size = words.length > 1 ? 120 : label.length > 7 ? 130 : 160;
  const lines = words
    .map(
      (w, i) =>
        `<text x="${Wd / 2}" y="${Ht / 2 + (i - (words.length - 1) / 2) * size * 1.05 + size * 0.35}" text-anchor="middle" font-family="${SANS}" font-size="${size}" font-weight="700" letter-spacing="4" fill="${C.paper}">${esc(w)}</text>`,
    )
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${Wd}" height="${Ht}">
    <rect width="${Wd}" height="${Ht}" fill="${C.pine}"/>
    <circle cx="${Wd / 2}" cy="${Ht / 2}" r="470" fill="${C.teal}" fill-opacity="0.35"/>
    <rect x="${Wd / 2 - 40}" y="${Ht / 2 - 330}" width="36" height="36" rx="10" fill="${C.paper}"/>
    <rect x="${Wd / 2 + 4}" y="${Ht / 2 - 330}" width="36" height="36" rx="10" fill="${C.green}"/>
    ${lines}
  </svg>`;
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  await sharp(Buffer.from(avatar())).jpeg({ quality: 92 }).toFile(join(OUT, 'profile-picture.jpg'));
  for (const [file, label] of HIGHLIGHTS) {
    await sharp(Buffer.from(highlight(label))).jpeg({ quality: 90 }).toFile(join(OUT, `highlight-${file}.jpg`));
  }
  console.log(`Wrote profile picture and ${HIGHLIGHTS.length} highlight covers to ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
