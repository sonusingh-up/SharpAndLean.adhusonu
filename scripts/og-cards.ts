/*
 * Social-share cards (1200 × 630) for pages that have no illustration of their
 * own, drawn as SVG in the site palette and rendered to JPG. The figures on a
 * card must match the page: the protein card's come from
 * lib/protein-lab-tests.ts. Run: npx tsx scripts/og-cards.ts
 */
import sharp from 'sharp';
import { rankedProteins } from '../lib/protein-lab-tests';

const W = 1200;
const H = 630;
const C = {
  paper: '#fbf9f5',
  cream: '#f3efe7',
  pine: '#183b37',
  teal: '#2f7c72',
  ochre: '#a9813c',
  terracotta: '#e07a5f',
  ink: '#1c2a28',
  muted: '#5d6865',
};
const sans = 'Helvetica, Arial, sans-serif';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

/** The site's mark: four rounded squares, the last one green. */
function mark(x: number, y: number) {
  const sq = (dx: number, dy: number, fill: string) =>
    `<rect x="${x + dx}" y="${y + dy}" width="14" height="14" rx="4" fill="${fill}"/>`;
  return sq(0, 0, C.ink) + sq(17, 0, C.ink) + sq(0, 17, C.ink) + sq(17, 17, '#7cc47e');
}

function proteinCard() {
  const [first, second] = rankedProteins();
  const winner = (y: number, n: string, name: string, found: number, claimed: number) => `
    <rect x="690" y="${y}" width="440" height="138" rx="22" fill="#fff" stroke="#e8e1d5" stroke-width="2"/>
    <circle cx="738" cy="${y + 46}" r="22" fill="${C.pine}"/>
    <text x="738" y="${y + 53}" text-anchor="middle" font-family="${sans}" font-size="20" font-weight="700" fill="#fff">${n}</text>
    <text x="776" y="${y + 40}" font-family="${sans}" font-size="15" font-weight="700" letter-spacing="2" fill="${C.ochre}">${n === '1' ? 'BEST OVERALL' : 'RUNNER-UP · DAIRY-FREE'}</text>
    <text x="776" y="${y + 66}" font-family="${sans}" font-size="23" font-weight="600" fill="${C.ink}">${esc(name)}</text>
    <text x="716" y="${y + 112}" font-family="${sans}" font-size="21" font-weight="700" fill="${C.pine}">${found} g of ${claimed} g</text>
    <text x="870" y="${y + 112}" font-family="${sans}" font-size="18" fill="${C.muted}">protein</text>
    <rect x="958" y="${y + 92}" width="150" height="30" rx="15" fill="#e3eee7"/>
    <text x="1033" y="${y + 113}" text-anchor="middle" font-family="${sans}" font-size="15" font-weight="700" fill="${C.pine}">No metals found</text>`;
  return `
  <rect width="${W}" height="${H}" fill="${C.paper}"/>
  <circle cx="1180" cy="40" r="300" fill="#2c6b64" fill-opacity="0.16"/>
  <circle cx="40" cy="640" r="280" fill="#f2a07f" fill-opacity="0.22"/>
  <text x="70" y="110" font-family="${sans}" font-size="18" font-weight="700" letter-spacing="3" fill="${C.ochre}">BEST-OF GUIDE · LAB-TESTED</text>
  <text x="70" y="190" font-family="${sans}" font-size="58" font-weight="300" fill="${C.ink}">I tried 9 protein</text>
  <text x="70" y="258" font-family="${sans}" font-size="58" font-weight="300" fill="${C.ink}">powders:</text>
  <text x="70" y="326" font-family="${sans}" font-size="58" font-weight="300" fill="${C.pine}">here are the best 2</text>
  <text x="70" y="394" font-family="${sans}" font-size="23" fill="${C.muted}">Ranked on nine Labdoor lab reports:</text>
  <text x="70" y="426" font-family="${sans}" font-size="23" fill="${C.muted}">protein vs label, heavy metals, purity.</text>
  ${[0, 1, 2, 3, 4, 5, 6, 7, 8]
    .map(
      (i) =>
        `<rect x="${70 + i * 44}" y="470" width="34" height="34" rx="17" fill="${i < 6 ? '#e3eee7' : i < 8 ? '#f6e9cc' : '#fbdcd1'}"/>`,
    )
    .join('')}
  <text x="70" y="536" font-family="${sans}" font-size="16" fill="${C.muted}">6 clean · 2 traces · 1 measurable metal</text>
  ${mark(70, 568)}
  <text x="112" y="592" font-family="${sans}" font-size="22" font-weight="600" fill="${C.ink}">Sharp&amp;Lean</text>
  ${winner(150, '1', 'NOW Sports Whey Isolate', first.found, first.claimed)}
  ${winner(318, '2', 'Naked Egg — Egg White', second.found, second.claimed)}`;
}

const cards: Record<string, () => string> = {
  'og-best-protein-powders': proteinCard,
};

Promise.all(
  Object.entries(cards).map(([name, draw]) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${draw()}</svg>`;
    const out = `public/images/${name}.jpg`;
    return sharp(Buffer.from(svg))
      .jpeg({ quality: 88, mozjpeg: true })
      .toFile(out)
      .then(() => console.log(`Wrote ${out}`));
  }),
);
