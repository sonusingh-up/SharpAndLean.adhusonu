import type { ShortlistPick } from './types';

/*
 * US ashwagandha products named in the /best/ guide "Ashwagandha: Which
 * brand is the best to buy in 2026?". The guide's comparison table, award
 * tiles and product cards are all built from this list, so they cannot
 * disagree.
 *
 * Every label figure was read from the manufacturer's own product page on
 * 1 October 2026; prices are the maker's list price that day, not Amazon's.
 * None of these products has a full review or a score on this site. Links are
 * plain Amazon product pages with no affiliate tag (affiliate: false), except
 * Life Extension, whose single-bottle listing we could not find on Amazon, so
 * it links to the maker.
 *
 * KSM-66 is sold as standardised to at least 5% withanolides, so "about
 * 30 mg" in 600 mg; the NOW, Jarrow and Goli labels do not print the figure.
 */

export const ashwagandhaShortlist: ShortlistPick[] = [
  {
    id: 'now-ksm66',
    award: 'Best overall',
    name: 'NOW KSM-66 Ashwagandha 600 mg',
    brand: 'NOW Foods',
    image: 'https://m.media-amazon.com/images/I/71duB5y1C3L._AC_SL1500_.jpg',
    url: 'https://www.amazon.com/dp/B0DHWGVVT2',
    retailer: 'Amazon',
    affiliate: false,
    bestFor: 'Most people: the trial extract and dose in one capsule a day.',
    headline: '$0.37 a day',
    specs: [
      { label: 'Extract', value: 'KSM-66', note: 'Organic root' },
      { label: 'Daily dose', value: '600 mg', note: '1 capsule' },
      { label: 'Withanolides', value: '~30 mg', note: 'Not printed' },
      { label: 'Cost a day', value: '$0.37', note: 'List price' },
      { label: 'Pack', value: '90 capsules', note: '$32.99 · 3 months' },
    ],
    fit: { label: 'Matches the trials', tone: 'good' },
    pros: [
      'KSM-66 root extract at 600 mg — the extract behind many stress and sleep trials, at the dose that did best',
      'One capsule a day, and one bottle is a three-month course',
      'Cheapest KSM-66 per day of our picks at list price',
      'Label warns against use in pregnancy and flags thyroid and liver conditions',
    ],
    cons: [
      'Withanolide percentage is not printed on the label',
      '600 mg in one dose may be a lot to start on if your stomach is sensitive',
      'No USP or NSF mark found on the maker’s page',
    ],
    verdict:
      'The simplest way to take what the trials took. One capsule gives 600 mg of organic KSM-66 root extract, and nothing else is added beyond the capsule and flow agents. The label carries the right cautions — not for pregnancy, and check with a doctor if you take thyroid medicine or have liver or thyroid problems. At the $32.99 list price for 90 capsules it works out at about 37 cents a day, and three months’ supply — the longest you should take it without checking in with a doctor — is a single bottle.',
    source: 'https://www.nowfoods.com/products/supplements/ksm-66-ashwagandha-veg-capsules',
  },
  {
    id: 'jarrow',
    award: 'Best split dose',
    name: 'Jarrow Formulas Ashwagandha 300 mg',
    brand: 'Jarrow Formulas',
    image: 'https://m.media-amazon.com/images/I/71i-9gwXQkL._AC_SL1500_.jpg',
    url: 'https://www.amazon.com/dp/B0013OQEO8',
    retailer: 'Amazon',
    affiliate: false,
    bestFor: 'Anyone who wants two smaller doses, or to start at 300 mg.',
    headline: '$0.42 a day',
    specs: [
      { label: 'Extract', value: 'KSM-66', note: 'Root' },
      { label: 'Daily dose', value: '600 mg', note: '1 capsule twice a day' },
      { label: 'Withanolides', value: '~30 mg', note: 'Not printed' },
      { label: 'Cost a day', value: '$0.42', note: 'List price' },
      { label: 'Pack', value: '120 capsules', note: '$24.99 · 2 months' },
    ],
    fit: { label: 'Matches the trials', tone: 'good' },
    pros: [
      'Exactly the 300 mg twice-a-day pattern of the best-known stress trial',
      'Easy to start at one capsule a day and build up',
      'Splitting the dose can ease stomach upset and daytime drowsiness',
    ],
    cons: [
      'Two capsules a day to remember',
      'A little dearer per day than NOW’s one-a-day',
      'Some retail listings still call it Sensoril — check the label on your bottle',
    ],
    verdict:
      'The 2012 stress trial gave 300 mg of root extract twice a day, and this is that pattern exactly: one 300 mg KSM-66 capsule morning and evening. Splitting the dose suits people who get an upset stomach or daytime drowsiness from 600 mg at once, and makes it easy to drop to 300 mg a day. Older listings describe this product as Sensoril; Jarrow’s current label is KSM-66 root extract, so check the panel on the bottle you receive. A 120-capsule bottle lasts two months at the full dose.',
    source: 'https://jarrow.com/products/ashwagandha-300-mg-120-veggie-caps',
  },
  {
    id: 'now-450',
    award: 'Best budget',
    name: 'NOW Ashwagandha 450 mg',
    brand: 'NOW Foods',
    image: 'https://m.media-amazon.com/images/I/71Ng0iqtNxL._AC_SL1500_.jpg',
    url: 'https://www.amazon.com/dp/B0768GW2R8',
    retailer: 'Amazon',
    affiliate: false,
    bestFor: 'Keeping the cost down with a properly standardised extract.',
    headline: '$0.19 a day',
    specs: [
      { label: 'Extract', value: 'Standardised', note: 'Root and leaf, min. 2.4%' },
      { label: 'Daily dose', value: '450 mg', note: '1 capsule' },
      { label: 'Withanolides', value: '≥10.8 mg', note: 'Printed' },
      { label: 'Cost a day', value: '$0.19', note: 'List price' },
      { label: 'Pack', value: '180 capsules', note: '$34.99 · 6 months' },
    ],
    fit: { label: 'Partly matches', tone: 'mixed' },
    pros: [
      'Half the daily cost of the KSM-66 capsules',
      'Withanolide content printed on the label — at least 2.4%',
      'Sold in 30, 90, 120 and 180 capsules',
    ],
    cons: [
      'A generic extract, not one of the branded extracts the trials tested',
      'Includes leaf, which falls outside traditional, root-only use',
    ],
    verdict:
      'Half the daily cost of the KSM-66 products, and a properly standardised extract — at least 2.4 per cent withanolides, so at least 10.8 mg a capsule, printed on the label. The trade-off is that it is a generic root-and-leaf extract rather than one of the branded extracts the trials tested, so the dose is in the studied range but the evidence does not transfer directly. A reasonable choice if cost matters more than matching a specific study.',
    source: 'https://www.nowfoods.com/products/supplements/ashwagandha-450-mg-veg-capsules',
  },
  {
    id: 'life-extension',
    award: 'Best low dose',
    name: 'Life Extension Optimized Ashwagandha',
    brand: 'Life Extension',
    url: 'https://www.lifeextension.com/vitamins-supplements/item00888/optimized-ashwagandha-extract',
    retailer: 'Life Extension',
    affiliate: false,
    bestFor: 'Starting low with a concentrated, trial-tested extract.',
    headline: '250 mg a day',
    specs: [
      { label: 'Extract', value: 'Sensoril', note: 'Root and leaf' },
      { label: 'Daily dose', value: '250 mg', note: '1 capsule twice a day' },
      { label: 'Withanolides', value: '10%', note: 'As glycosides' },
      { label: 'Cost a day', value: '—', note: 'Price not shown' },
      { label: 'Pack', value: '60 capsules', note: '1 month' },
    ],
    fit: { label: 'Matches the trials', tone: 'good' },
    pros: [
      'Sensoril is a trial-tested extract, studied at 125 to 500 mg a day',
      '250 mg a day is a gentle place to start',
      'Standardisation printed in full: 10% withanolide glycosides, 32% oligosaccharides',
    ],
    cons: [
      'Includes leaf, which falls outside traditional, root-only use',
      'Label says to take it on an empty stomach',
      'Price hidden until you sign in; no single bottle found on Amazon',
    ],
    verdict:
      'Sensoril is a more concentrated root-and-leaf extract, so its trials used smaller doses, 125 to 500 mg a day. This is 125 mg a capsule, taken twice daily — 250 mg a day, in the lower half of that range, which makes it a sensible way to start low. A 60-capsule bottle is a month’s supply. Life Extension shows its price only to signed-in customers, and we could not find the single bottle on Amazon, so this links to the maker.',
    source: 'https://www.lifeextension.com/vitamins-supplements/item00888/optimized-ashwagandha-extract',
  },
  {
    id: 'gaia',
    award: 'For whole-root fans',
    name: 'Gaia Herbs Ashwagandha Root',
    brand: 'Gaia Herbs',
    image: 'https://m.media-amazon.com/images/I/719AIJq2-HL._SL1500_.jpg',
    url: 'https://www.amazon.com/dp/B005P0WXN2',
    retailer: 'Amazon',
    affiliate: false,
    bestFor: 'People who want organic, traditional root rather than a concentrate.',
    headline: '$0.42 a capsule',
    specs: [
      { label: 'Extract', value: 'Root + extract', note: 'Organic' },
      { label: 'Daily dose', value: '350 mg', note: 'Per capsule' },
      { label: 'Withanolides', value: '2.5 mg', note: 'Per capsule' },
      { label: 'Cost a day', value: '$0.42', note: 'Per capsule' },
      { label: 'Pack', value: '60 capsules', note: '$25.19' },
    ],
    fit: { label: 'Below trial levels', tone: 'poor' },
    pros: [
      'Organic root and root extract only — no leaf',
      'Withanolide content stated honestly on the label',
      'Liquid capsule, vegan',
    ],
    cons: [
      '2.5 mg of withanolides a capsule — about a twelfth of a 600 mg KSM-66 capsule',
      'Not comparable to the extracts the trials used',
    ],
    verdict:
      'Gaia’s liquid capsules use organic ashwagandha root and root extract in vegetable glycerin, and — to its credit — the label states the withanolide content: 2.5 mg a capsule. That is the problem as well as the virtue. It is about a twelfth of the roughly 30 mg in a 600 mg KSM-66 capsule, so this is closer to traditional root than to the concentrated extracts the trials used. Choose it if you prefer a whole-root, organic product; do not expect it to match the trial results capsule for capsule.',
    source: 'https://www.gaiaherbs.com/products/ashwagandha-root',
  },
  {
    id: 'goli',
    award: 'If you want a gummy',
    name: 'Goli Ashwagandha & Vitamin D Gummies',
    brand: 'Goli',
    image: 'https://m.media-amazon.com/images/I/71FKBWkm2SL._AC_SL1500_.jpg',
    url: 'https://www.amazon.com/dp/B094T2BZCK',
    retailer: 'Amazon',
    affiliate: false,
    bestFor: 'Only if you will not take a capsule — and do not take other vitamin D.',
    headline: '$1.67 a day',
    specs: [
      { label: 'Extract', value: 'KSM-66', note: 'Root' },
      { label: 'Daily dose', value: '600 mg', note: '2 gummies twice a day' },
      { label: 'Withanolides', value: '~30 mg', note: 'Not printed' },
      { label: 'Cost a day', value: '$1.67', note: 'List price' },
      { label: 'Pack', value: '60 gummies', note: '$25.00 · 15 days' },
    ],
    fit: { label: 'Matches, with extras', tone: 'mixed' },
    pros: [
      'Uses KSM-66 and reaches 600 mg at the suggested four gummies',
      'Easy to take if you struggle with capsules',
    ],
    cons: [
      '8 g of sugar a day at the full dose',
      '2,000 IU of vitamin D2 a day — half the adult upper limit, before any other vitamin D',
      'About four times the daily cost of the capsules; a bottle lasts 15 days',
    ],
    verdict:
      'The best-known ashwagandha gummy does use KSM-66, and at the suggested two gummies twice a day you reach 600 mg. But look at what comes with it: four gummies a day is 8 g of sugar and 50 mcg (2,000 IU) of vitamin D2 — more than three times the US daily amount of 600 IU and half the 4,000 IU upper limit, which adds up fast if you already take vitamin D. A 60-gummy bottle lasts 15 days, so at the $25 list price it costs about $1.67 a day. Fine as a treat; poor value as a daily habit.',
    source: 'https://goli.com/products/1-bottle-of-ashwagandha-gummies',
  },
];
