import type { Collection, ShortlistPick } from '../types';
import { proteinLabResults, reportUrl } from '../protein-lab-tests';
import { siteUrl } from '../config';

/*
 * "I tried 9 protein powders: here are the best 2" — a /best/ guide.
 *
 * Two kinds of evidence, kept apart on the page:
 * - Lab results: Labdoor's Certificates of Analysis for all nine (tested by
 *   Anresco, released December 2024), transcribed in lib/protein-lab-tests.ts,
 *   which also holds the ranking. They are credited to Labdoor throughout.
 * - First-hand use: Pankaj Singh's notes, one per powder, written only from
 *   what he sends. Until they arrive the `handsOn` fields are left out and
 *   nothing renders in their place.
 *
 * Buy buttons are Amazon affiliate links (amzn.to), so the cards carry the
 * affiliate notice. Prices were read on 1 October 2026: NOW's on Amazon,
 * Naked Egg's on Naked's own store, as each spec note says.
 */

const picks: ShortlistPick[] = [
  {
    id: 'now-sports-whey-isolate',
    award: 'Best overall',
    name: 'NOW Sports Whey Protein Isolate',
    brand: 'NOW Sports',
    image: 'https://m.media-amazon.com/images/I/71LqBwkqtyL._AC_SL1500_.jpg',
    url: 'https://amzn.to/4yvS3Xs',
    retailer: 'Amazon',
    affiliate: true,
    report: { url: reportUrl({ id: 'now-sports-whey-isolate' }), label: 'Labdoor' },
    bestFor: 'Anyone who wants exactly the protein on the label, with nothing detected in the lab.',
    headline: '25 g of 25 g',
    specs: [
      { label: 'Protein found', value: '25.0 g', note: 'of 25 g claimed' },
      { label: 'Of label', value: '100%', note: 'Labdoor, Dec 2024' },
      { label: 'By weight', value: '89%', note: 'Tested lot' },
      { label: 'Heavy metals', value: 'None', note: 'All four undetected' },
      { label: 'Price', value: '$47.36', note: 'Amazon · 1.8 lb' },
    ],
    fit: { label: 'Clean pass', tone: 'good' },
    pros: [
      'Delivered exactly its 25 g protein claim',
      'No arsenic, cadmium, mercury or lead detected',
      'The most protein per gram of any of the nine — 89% of the tested scoop',
      'No sign of amino-acid spiking',
    ],
    cons: [
      'NOW’s current chocolate label lists a 33 g scoop; the tested lot’s was 28 g',
      'NOW’s own list price ($86.99) is far above Amazon’s',
      'One lot, tested in late 2024 — later batches were not re-tested',
    ],
    verdict:
      'The only powder of the nine that hit its protein claim to the gram while also showing no heavy metals at all, and it did it with the least non-protein filler: 25 g of protein in a 28 g scoop. That is what a whey isolate is supposed to look like. One thing to check: NOW’s current chocolate isolate lists 25 g of protein in a 33 g scoop, so the tub you buy may be made differently from the lot Labdoor tested. The protein claim is the same; read the panel on yours.',
  },
  {
    id: 'naked-egg',
    award: 'Runner-up · best dairy-free',
    name: 'Naked Egg — Egg White Protein',
    brand: 'Naked Nutrition',
    image: 'https://nakednutrition.com/cdn/shop/files/egg-protein-powder-3LB.jpg',
    url: 'https://amzn.to/4j0a1wo',
    retailer: 'Amazon',
    affiliate: true,
    report: { url: reportUrl({ id: 'naked-egg' }), label: 'Labdoor' },
    bestFor: 'Anyone avoiding dairy who still wants a clean, accurately labelled protein.',
    headline: '25.3 g of 25 g',
    specs: [
      { label: 'Protein found', value: '25.3 g', note: 'of 25 g claimed' },
      { label: 'Of label', value: '101%', note: 'Labdoor, Dec 2024' },
      { label: 'By weight', value: '82%', note: 'Tested lot' },
      { label: 'Heavy metals', value: 'None', note: 'All four undetected' },
      { label: 'Price', value: '$79.99', note: 'Naked’s store · 3 lb · $1.81/serving' },
    ],
    fit: { label: 'Clean pass', tone: 'good' },
    pros: [
      'Slightly more protein than claimed — 25.3 g against 25 g',
      'No heavy metals detected',
      'Dairy-free: egg white with under 1% sunflower lecithin, per the maker',
      '$1.81 a serving at the maker’s one-off price',
    ],
    cons: [
      'A serving is two scoops (31 g)',
      'Not for anyone with an egg allergy',
      'One lot, tested in late 2024; that lot expires 09/2026',
    ],
    verdict:
      'Egg white is a complete protein, and this one over-delivered slightly on its label with nothing detected in the lab — one of only four powders here to meet or beat its label with no heavy metal found. It ranks second only because a little more of each scoop is not protein (82% against NOW’s 89%). If you avoid dairy, or whey does not sit well with you, this is the one to buy.',
  },
];

export const bestProteinPowders: Collection = {
  id: 'best-protein-powders',
  kind: 'best_lists',
  slug: 'i-tried-9-protein-powders-here-are-the-best-2',
  title: 'I tried 9 protein powders: here are the best 2',
  seo_title: 'I Tried 9 Protein Powders: The Best 2, Lab-Tested',
  seo_desc:
    'Nine protein powders, nine Labdoor lab reports. Six had no heavy metals detected; NOW Sports Whey Isolate and Naked Egg also hit their protein claims.',
  summary:
    'Nine protein powders, nine lab reports. Every one passed Labdoor’s tests, but only six had no heavy metals detected at all. Of those, NOW Sports Whey Protein Isolate delivered its label to the gram with the highest share of protein in every scoop, and Naked Egg beat its label as a dairy-free egg-white protein. Here is how all nine ranked, and why.',
  is_published: true,
  evidenceReviewed: true,
  authors: [{ name: 'SLN Team', slug: 'snl-team', type: 'Organization' }],
  testedBy: 'pankaj-singh',
  published_at: '2026-10-01T00:00:00Z',
  updated_at: '2026-10-01T00:00:00Z',
  figure: {
    src: '/images/og-best-protein-powders.jpg',
    alt: 'SharpAndLean card: I tried 9 protein powders, here are the best 2. NOW Sports Whey Protein Isolate, 25.0 g of 25 g protein, and Naked Egg, 25.3 g of 25 g, both with no heavy metals detected in Labdoor lab tests.',
    caption: 'The two winners of nine Labdoor-tested protein powders. SharpAndLean graphic.',
  },
  about: [
    { name: 'Protein supplement', sameAs: 'https://en.wikipedia.org/wiki/Protein_supplement' },
    { name: 'Whey protein', sameAs: 'https://en.wikipedia.org/wiki/Whey_protein' },
    { name: 'Heavy metals', sameAs: 'https://en.wikipedia.org/wiki/Heavy_metals' },
  ],
  // The lab results as a Dataset, so search and answer engines can read and
  // credit them: Labdoor is the creator; this site only publishes the ranking.
  extraSchema: [
    {
      '@type': 'Dataset',
      '@id': `${siteUrl}/best/i-tried-9-protein-powders-here-are-the-best-2#lab-results`,
      name: 'Labdoor lab results for nine protein powders, December 2024',
      description:
        'Protein found against the label claim, free amino acids, heavy metals per serving (arsenic, cadmium, mercury, lead) and microbiology for nine protein powders sold in the US: NOW Sports Whey Protein Isolate, Naked Egg, Bloom Whey Protein Isolate, Optimum Nutrition Gold Standard 100% Whey, True Nutrition Whey Protein Isolate, Raw Grass Fed Whey, Myprotein Impact Whey Isolate, Orgain Organic Plant-Based Protein and Klean Isolate. From Labdoor certificates of analysis, tested by Anresco Laboratories and released 10 to 13 December 2024; transcribed and ranked by SharpAndLean.',
      url: `${siteUrl}/best/i-tried-9-protein-powders-here-are-the-best-2`,
      creator: { '@type': 'Organization', name: 'Labdoor', url: 'https://labdoor.com' },
      publisher: { '@id': `${siteUrl}/#organization` },
      datePublished: '2026-10-01',
      temporalCoverage: '2024-11/2024-12',
      isAccessibleForFree: true,
      keywords: [
        'protein powder lab test',
        'whey protein heavy metals',
        'protein powder label accuracy',
        'amino acid spiking',
      ],
      variableMeasured: [
        'Protein per serving, found against label claim (g)',
        'Free amino acids (%)',
        'Arsenic per serving (µg)',
        'Cadmium per serving (µg)',
        'Mercury per serving (µg)',
        'Lead per serving (µg)',
        'Total plate count (cfu/g)',
        'Yeast and mould (cfu/g)',
        'Salmonella, Shigella, E. coli and Staphylococcus aureus',
      ],
      distribution: proteinLabResults.map((r) => ({
        '@type': 'DataDownload',
        name: `${r.brand} ${r.product} — lot ${r.lot}`,
        encodingFormat: 'application/pdf',
        contentUrl: `${siteUrl}${reportUrl(r)}`,
      })),
    },
  ],
  heroFacts: [
    { value: '9', label: 'powders tested' },
    { value: 'Labdoor', label: 'lab reports' },
    { value: 'No', label: 'paid placements' },
  ],
  takeaways: [
    'All nine passed Labdoor’s tests: protein within 97–106% of the label, no amino-acid spiking, clean microbiology.',
    'Six had no arsenic, cadmium, mercury or lead detected. Three had traces, and Klean Isolate had measurable cadmium — about a third of the daily limit per scoop.',
    'Best overall: NOW Sports Whey Protein Isolate — exactly 25 g of 25 g, nothing detected, 89% protein by weight.',
    'Runner-up: Naked Egg — 25.3 g of 25 g, nothing detected, and dairy-free.',
  ],
  body: `
<h2>How we ranked them</h2>
<p>Pankaj Singh, our hands-on tester, used all nine powders. The ranking itself, though, does not rest on taste. It rests on what an independent lab found inside each tub: Labdoor bought the nine and had them tested by <strong>Anresco Laboratories</strong> in November and December 2024, and we ranked them on those results with three rules, in this order:</p>
<ol>
<li><strong>Nothing detected beats any trace.</strong> A powder with no arsenic, cadmium, mercury or lead found ranks above one with a trace, and a trace ranks above a measurable amount — even when every result is under the limit.</li>
<li><strong>Delivering the label beats falling short.</strong> A powder with at least the protein it claims ranks above one that came in under.</li>
<li><strong>More protein per gram of powder wins.</strong> The share of each scoop that is actually protein, so less of what you pay for is flavouring, thickener or filler. Results within one point are a tie, settled by protein per serving.</li>
</ol>
<p>Price is not part of the ranking: it changes weekly and differs by retailer. The prices on the two winners were checked on 1 October 2026 — NOW’s on Amazon, Naked Egg’s on Naked’s own store; the buttons go to Amazon, where the price may differ.</p>

<h2>The lab results, all nine</h2>
<div data-tool="protein-lab-results"></div>

<h2>The other seven</h2>
<p>None of these failed. The ranking separates good from best, and on a different day, or a different batch, the order below the top two could shuffle.</p>
<p>Two of these brands have full reviews on this site, though of their UK versions: our <a href="/wellness/optimum-nutrition-uk-review-2026">Optimum Nutrition Gold Standard 100% Whey review</a> and our <a href="/wellness/myprotein-impact-whey-review">Myprotein Impact Whey review</a> — the standard Impact Whey rather than the Impact Whey Isolate tested here. We also compare the two head to head in <a href="/compare/optimum-nutrition-vs-myprotein-impact-whey">Optimum Nutrition vs Myprotein Impact Whey</a>.</p>
<div data-tool="protein-others"></div>

<h2>What the lab tests actually check</h2>
<h3>Is the protein really there?</h3>
<p>The lab measures the protein in a serving and compares it with the label. US rules allow some natural variation, but a naturally occurring nutrient like protein must be present at <strong>at least 80 per cent</strong> of the amount declared. All nine cleared that by a wide margin: the lowest, Raw Grass Fed Whey, was at 97 per cent.</p>
<h3>Is it spiked?</h3>
<p>Cheap single amino acids such as glycine can be added to make a powder test higher for protein than it really is — “amino spiking”. The giveaway is a high level of <em>free</em> amino acids. Every powder here showed under 0.01 per cent, so there is no sign of it in any of the nine.</p>
<h3>Heavy metals</h3>
<p>Labdoor grades against the US Pharmacopeia’s daily limits: <strong>5 micrograms</strong> each of lead and cadmium, <strong>15</strong> each of arsenic and mercury. “Below LOQ” means the metal was present but below the lowest level the lab can measure reliably — tiny, but not zero. Six powders had nothing detected. Myprotein and Orgain had a trace of lead; Klean Isolate had a trace of lead and 1.74 µg of cadmium per scoop, about a third of the daily limit.</p>
<h3>Microbiology</h3>
<p>All nine were tested for total bacteria, yeast and mould, E. coli, Staphylococcus, Salmonella and Shigella, and all nine passed comfortably. It is not a differentiator here, which is why it is not in the ranking.</p>

<h2>What these results can’t tell you</h2>
<ul>
<li><strong>They cover one lot each.</strong> Labdoor tested a single batch of each powder in late 2024. A later batch may differ, and labels change — NOW’s current chocolate isolate already lists a different scoop size from the lot tested.</li>
<li><strong>They are not our tests.</strong> The lab work is Labdoor’s; we have transcribed the reports and ranked them. The first-hand notes are Pankaj’s, from using the powders himself.</li>
<li><strong>They say nothing about taste or mixing.</strong> That is what the hands-on notes are for, and it is one person’s experience.</li>
<li><strong>They are not a medical recommendation.</strong> Most people can get enough protein from food; a powder is a convenience. Anyone with kidney disease should ask their doctor before adding one.</li>
</ul>

<h2>How much protein do you need?</h2>
<p>Less than the tubs suggest. Most active adults do well on 1.2 to 1.6 g of protein per kilogram of body weight a day, spread across meals — our <a href="/learn/how-much-protein-should-a-beginner-eat">protein calculator</a> works out your number and how much of it a scoop covers.</p>

<h2>The bottom line</h2>
<p>You can buy any of these nine without worrying that the protein is missing — all of them passed. If you want the cleanest result, buy one of the six with nothing detected, and of those, <strong>NOW Sports Whey Protein Isolate</strong> gave the most protein for the least powder, exactly as labelled. If you avoid dairy, <strong>Naked Egg</strong> matched it for purity and beat its own label. Whichever you choose, check the Supplement Facts on your tub against the tested figures here, because a lab report is only as current as the batch it tested.</p>
`,
  productsIntro: {
    label: 'The best 2',
    heading: 'Why these two won',
    text: 'The two winners side by side. Lab figures are Labdoor’s, from the lots tested in December 2024; prices were checked on 1 October 2026 — NOW’s on Amazon, Naked Egg’s on Naked’s own store — and Amazon’s may differ.',
  },
  shortlist: picks,
  faqs: [
    {
      question: 'Which protein powder is the cleanest?',
      answer:
        'Of the nine lab-tested here, six had no arsenic, cadmium, mercury or lead detected: NOW Sports Whey Protein Isolate, Naked Egg, Bloom Whey Protein Isolate, Optimum Nutrition Gold Standard 100% Whey, True Nutrition Whey Protein Isolate and Raw Grass Fed Whey.',
    },
    {
      question: 'Do protein powders contain heavy metals?',
      answer:
        'Some contain traces. In these nine lab reports, three had lead present below the level the lab could measure, and one, Klean Isolate, had 1.74 µg of cadmium per scoop — about a third of the 5 µg daily limit. All nine were under the limits.',
    },
    {
      question: 'Do protein powders really contain the protein on the label?',
      answer:
        'These nine did. Every one contained 97 to 106 per cent of its labelled protein, and none showed signs of amino-acid spiking, where cheap amino acids are added to inflate a protein test.',
    },
    {
      question: 'Is whey isolate better than whey concentrate?',
      answer:
        'Isolate is more filtered, so there is less lactose and fat per scoop, which suits people who find concentrate hard to digest. It does not guarantee more protein per gram: in these results one isolate, Klean, was 73 per cent protein by weight, below Raw’s grass-fed whey at 81 per cent. Concentrate is usually cheaper and fine for most people who tolerate dairy.',
    },
    {
      question: 'What is the best dairy-free protein powder?',
      answer:
        'Of the two dairy-free powders tested here, Naked Egg came out best: 25.3 g of protein against its 25 g label, no heavy metals detected, and 82 per cent protein by weight. Orgain’s plant protein also met its label but had a trace of lead and needs a 46 g serving.',
    },
    {
      question: 'Who did the lab testing?',
      answer:
        'Labdoor, an independent supplement-testing company, bought the products and had them analysed by Anresco Laboratories in November and December 2024. The results are Labdoor’s; this page transcribes and ranks them.',
    },
  ],
  references: [
    ...proteinLabResults.map((r) => ({
      id: `labdoor-${r.id}`,
      text: `Labdoor. Certificate of Analysis — ${r.brand} ${r.product}, lot ${r.lot} (expires ${r.expires}). Tested by Anresco Laboratories, released ${new Date(r.released).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}.`,
      url: reportUrl(r),
    })),
    {
      id: 'labdoor',
      text: 'Labdoor — independent supplement testing and rankings.',
      url: 'https://labdoor.com/rankings/protein',
    },
    {
      id: 'fda-101-9',
      text: 'US Food and Drug Administration. 21 CFR 101.9(g)(4)(ii) — naturally occurring (Class II) nutrients must be present at at least 80 per cent of the value declared on the label.',
      url: 'https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-101/subpart-A/section-101.9',
    },
    {
      id: 'now-label',
      text: 'NOW Foods. Whey Protein Isolate, Creamy Chocolate — current label and list price, read 1 October 2026.',
      url: 'https://www.nowfoods.com/products/sports-nutrition/whey-protein-isolate-creamy-chocolate-powder',
    },
    {
      id: 'naked-label',
      text: 'Naked Nutrition. Naked Egg — Egg White Protein Powder, 3 lb — product page and price, read 1 October 2026.',
      url: 'https://nakednutrition.com/products/egg-white-protein-powder',
    },
  ],
  history: [
    {
      date: '2026-10-01',
      note: 'First published. Nine powders ranked on Labdoor’s December 2024 lab reports, credited to Labdoor and transcribed from its certificates of analysis.',
    },
  ],
};
