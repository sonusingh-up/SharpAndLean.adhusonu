import type { HandsOnNote } from './types';

/*
 * Lab results for the nine protein powders in the /best/ guide "I tried 9
 * protein powders: here are the best 2".
 *
 * Every figure is transcribed from a Labdoor Certificate of Analysis: samples
 * bought and tested November–December 2024 by Anresco Laboratories, released
 * by Labdoor on 10 or 13 December 2024. They are Labdoor's results, not ours,
 * and they describe the lot tested — labels can change after a test (NOW's
 * current chocolate isolate lists a 33 g scoop, where the tested lot's was
 * 28 g), so the guide says so rather than applying them to every tub.
 *
 * Heavy-metal limits are the USP daily limits Labdoor grades against:
 * arsenic 15, cadmium 5, mercury 15 and lead 5 micrograms.
 *
 * `handsOn` is written only from Pankaj Singh's own notes. Until they arrive
 * it is left out, and nothing renders in its place.
 */

/** 'undetected', 'below-loq' (present, too little to quantify) or micrograms per serving. */
export type MetalReading = 'undetected' | 'below-loq' | number;

export type ProteinLabResult = {
  id: string;
  brand: string;
  product: string;
  type: string;
  lot: string;
  expires: string;
  /** Labdoor release date, ISO. */
  released: string;
  serving: string;
  servingGrams: number;
  claimed: number;
  found: number;
  metals: { arsenic: MetalReading; cadmium: MetalReading; mercury: MetalReading; lead: MetalReading };
  /** Total plate count, cfu/g, as reported (USP limit 1,000). */
  plateCount: string;
  /** Free amino acids, % — a high figure would suggest amino-acid spiking. */
  freeAminoAcids: string;
  /** Our one-paragraph reading of the result. */
  read: string;
  /**
   * Product photo, from the maker's store or the matching Amazon listing, and
   * checked against the product name. Left out where we could not confirm the
   * image shows the product tested, or the host blocks server-side fetches.
   */
  image?: string;
  /**
   * Our own full review of this brand's product, where one exists. The label
   * says what was reviewed, since it may be a different market or variant
   * from the lot Labdoor tested.
   */
  review?: { href: string; label: string };
  handsOn?: HandsOnNote;
};

export const metalLimits = { arsenic: 15, cadmium: 5, mercury: 15, lead: 5 } as const;

export const proteinLabResults: ProteinLabResult[] = [
  {
    id: 'now-sports-whey-isolate',
    image: 'https://m.media-amazon.com/images/I/71LqBwkqtyL._AC_SL1500_.jpg',
    brand: 'NOW Sports',
    product: 'Whey Protein Isolate',
    type: 'Whey isolate',
    lot: '336100',
    expires: '06/2027',
    released: '2024-12-13',
    serving: '1 scoop (28 g)',
    servingGrams: 28,
    claimed: 25,
    found: 25,
    metals: { arsenic: 'undetected', cadmium: 'undetected', mercury: 'undetected', lead: 'undetected' },
    plateCount: '400',
    freeAminoAcids: '<0.01',
    read: 'Exactly the 25 g it claims, no heavy metal detected, and the most protein per gram of powder of the nine — 89 per cent of the scoop. The tested lot had a 28 g scoop; NOW’s current chocolate label lists 25 g of protein in a 33 g scoop, so check the panel on your tub.',
  },
  {
    id: 'naked-egg',
    image: 'https://nakednutrition.com/cdn/shop/files/egg-protein-powder-3LB.jpg',
    brand: 'Naked Nutrition',
    product: 'Naked Egg — Egg White Protein',
    type: 'Egg white',
    lot: '2-4268-NE',
    expires: '09/2026',
    released: '2024-12-10',
    serving: '2 scoops (31 g)',
    servingGrams: 31,
    claimed: 25,
    found: 25.3,
    metals: { arsenic: 'undetected', cadmium: 'undetected', mercury: 'undetected', lead: 'undetected' },
    plateCount: '100',
    freeAminoAcids: '<0.01',
    read: 'Slightly more than claimed — 25.3 g against 25 g — with no heavy metal detected and 82 per cent protein by weight. Egg white with under 1 per cent sunflower lecithin, so it is the pick for anyone avoiding dairy.',
  },
  {
    id: 'bloom-whey-isolate',
    image: 'https://cdn.shopify.com/s/files/1/0143/0952/3556/files/bloom_whey_van_01_c725feb9-a79f-4813-acf4-ba14d28ca9f5.png',
    brand: 'Bloom Nutrition',
    product: 'Whey Protein Isolate',
    type: 'Whey isolate',
    lot: '0018D4A-A',
    expires: '04/2026',
    released: '2024-12-10',
    serving: '1 scoop (27.9 g)',
    servingGrams: 27.9,
    claimed: 22,
    found: 22.7,
    metals: { arsenic: 'undetected', cadmium: 'undetected', mercury: 'undetected', lead: 'undetected' },
    plateCount: '<100',
    freeAminoAcids: '<0.01',
    read: '103 per cent of its label and nothing detected — a clean result. It ranks below the top two only because its serving is smaller, at 22 g of protein a scoop.',
  },
  {
    id: 'optimum-gold-standard',
    review: {
      href: '/wellness/optimum-nutrition-uk-review-2026',
      label: 'Read our full review (UK version)',
    },
    image: 'https://m.media-amazon.com/images/I/71TOpLJnZJL._AC_SL1500_.jpg',
    brand: 'Optimum Nutrition',
    product: 'Gold Standard 100% Whey (Chocolate Malt)',
    type: 'Whey blend',
    lot: '0001250135',
    expires: '08/2026',
    released: '2024-12-13',
    serving: '1 scoop (32 g)',
    servingGrams: 32,
    claimed: 24,
    found: 24.1,
    metals: { arsenic: 'undetected', cadmium: 'undetected', mercury: 'undetected', lead: 'undetected' },
    plateCount: '<100',
    freeAminoAcids: '<0.01',
    read: 'Right on its 24 g label with nothing detected. As a flavoured whey blend it carries more non-protein ingredients than the isolates — 75 per cent protein by weight.',
  },
  {
    id: 'true-nutrition-isolate',
    brand: 'True Nutrition',
    product: 'rBGH/Soy-Free Whey Protein Isolate',
    type: 'Whey isolate',
    lot: '0424-049',
    expires: '04/2026',
    released: '2024-12-10',
    serving: '1 scoop (34 g)',
    servingGrams: 34,
    claimed: 30,
    found: 29.2,
    metals: { arsenic: 'undetected', cadmium: 'undetected', mercury: 'undetected', lead: 'undetected' },
    plateCount: '<100',
    freeAminoAcids: '<0.01',
    read: 'The most protein per scoop of the nine, 29.2 g, and nothing detected — but 0.8 g short of its 30 g claim. That is well within the legal tolerance; it is why it sits below the powders that met their labels.',
  },
  {
    id: 'raw-grass-fed-whey',
    image: 'https://m.media-amazon.com/images/I/81WITL2vO8L._AC_SL1484_.jpg',
    brand: 'Raw Organic Whey',
    product: 'Raw Grass Fed Whey',
    type: 'Grass-fed whey',
    lot: 'AC228242-1',
    expires: '08/2026',
    released: '2024-12-13',
    serving: '5 tbsp (25 g)',
    servingGrams: 25,
    claimed: 21,
    found: 20.3,
    metals: { arsenic: 'undetected', cadmium: 'undetected', mercury: 'undetected', lead: 'undetected' },
    plateCount: '200',
    freeAminoAcids: '<0.01',
    read: 'A one-ingredient whey with nothing detected, but the largest shortfall of the nine: 20.3 g against 21 g claimed, 97 per cent of the label.',
  },
  {
    id: 'myprotein-impact-isolate',
    review: {
      href: '/wellness/myprotein-impact-whey-review',
      label: 'Read our Impact Whey review (standard whey, UK)',
    },
    image: 'https://static.thcdn.com/productimg/original/10852482-2555304620117685.jpg',
    brand: 'Myprotein',
    product: 'Impact Whey Isolate',
    type: 'Whey isolate',
    lot: 'U41582255',
    expires: '12/2025',
    released: '2024-12-10',
    serving: '1 scoop (31.5 g)',
    servingGrams: 31.5,
    claimed: 25,
    found: 25.3,
    metals: { arsenic: 'undetected', cadmium: 'undetected', mercury: 'undetected', lead: 'below-loq' },
    plateCount: '<100',
    freeAminoAcids: '<0.01',
    read: 'Met its 25 g claim, but lead was present below the level that can be quantified — far under the limit, and still a step behind the six with nothing detected. The tested lot expired in December 2025.',
  },
  {
    id: 'orgain-plant',
    image: 'https://m.media-amazon.com/images/I/71q+3R9+Z6L._SL1500_.jpg',
    brand: 'Orgain',
    product: 'Organic Plant-Based Protein',
    type: 'Plant-based',
    lot: 'T24E085',
    expires: '09/2026',
    released: '2024-12-10',
    serving: '2 scoops (46 g)',
    servingGrams: 46,
    claimed: 21,
    found: 21.1,
    metals: { arsenic: 'undetected', cadmium: 'undetected', mercury: 'undetected', lead: 'below-loq' },
    plateCount: '200',
    freeAminoAcids: '<0.01',
    read: 'Accurate to its 21 g label, with a trace of lead below the quantifiable level. It needs a 46 g serving to get there, so only 46 per cent of the powder is protein.',
  },
  {
    id: 'klean-isolate',
    brand: 'Klean Athlete',
    product: 'Klean Isolate',
    type: 'Whey isolate',
    lot: '24225-2C2',
    expires: '08/2026',
    released: '2024-12-10',
    serving: '1 scoop (29 g)',
    servingGrams: 29,
    claimed: 20,
    found: 21.2,
    metals: { arsenic: 'undetected', cadmium: 1.74, mercury: 'undetected', lead: 'below-loq' },
    plateCount: '<100',
    freeAminoAcids: '<0.01',
    read: 'Over-delivered on protein — 21.2 g against 20 g — but it was the only one with a measurable heavy metal: 1.74 µg of cadmium a scoop, about a third of the 5 µg daily limit, plus a trace of lead. Still a pass; two scoops a day would use up about 70 per cent of the cadmium limit.',
  },
];

/** The full Labdoor report, served from public/lab-reports. */
export const reportUrl = (r: Pick<ProteinLabResult, 'id'>) => `/lab-reports/labdoor-${r.id}.pdf`;

export const percentOfClaim = (r: ProteinLabResult) => (r.found / r.claimed) * 100;
export const proteinPerGram = (r: ProteinLabResult) => (r.found / r.servingGrams) * 100;
export const cleanMetals = (r: ProteinLabResult) =>
  Object.values(r.metals).every((m) => m === 'undetected');

/**
 * The guide's ranking, in the order it is explained on the page:
 * 1. no heavy metal detected at all, ahead of any trace or measurable amount;
 * 2. at least the protein the label claims, ahead of any shortfall;
 * 3. protein per gram of powder — how little of the scoop is not protein —
 *    with results within one point treated as a tie and settled by protein
 *    per serving.
 */
export function rankedProteins(results: ProteinLabResult[] = proteinLabResults) {
  const metalScore = (r: ProteinLabResult) =>
    Object.values(r.metals).some((m) => typeof m === 'number')
      ? 2
      : Object.values(r.metals).some((m) => m === 'below-loq')
        ? 1
        : 0;
  return [...results].sort((a, b) => {
    const metals = metalScore(a) - metalScore(b);
    if (metals) return metals;
    const accuracy = Number(a.found < a.claimed) - Number(b.found < b.claimed);
    if (accuracy) return accuracy;
    const density = proteinPerGram(b) - proteinPerGram(a);
    if (Math.abs(density) >= 1) return density;
    return b.found - a.found;
  });
}
