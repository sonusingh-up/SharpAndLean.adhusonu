import type { ProductArticle } from './types';

export const myproteinImpactWhey: ProductArticle = {
  slug: 'myprotein-impact-whey',
  name: 'Myprotein Impact Whey Protein',
  brand: 'Myprotein',
  category: 'wellness',
  summary:
    'The UK value benchmark for whey: a three-item label built on whey protein concentrate, sold in a 900 g tub that lines up serving-for-serving with the better-known brands.',
  listing: '900 g, 30 servings, vanilla',
  image: 'https://static.thcdn.com/productimg/original/10530943-6705347406722854.png',
  source: 'https://www.myprotein.com/p/sports-nutrition/impact-whey-protein-powder/10530943/',
  sourceNote:
    'Figures read from the brand’s own UK product page on 22 September 2026, for the 900 g vanilla pack. Protein content varies by flavour — the site advertises “up to 23 g” across the range — so check the panel for the flavour you order.',
  marketplace: {
    source: 'Myprotein',
    price: 32.99,
    currency: 'GBP',
    servings: 30,
    checkedAt: '2026-09-22',
  },
  facts:
    'The 900 g pack is sold as 30 servings, which works out at a 30 g scoop. Myprotein’s own comparison table gives the Original version 22 g of protein and 114 kcal per serving, at 73 per cent protein by weight; the headline figure across flavours is “up to 23 g”. The vanilla ingredient list is Whey Protein Concentrate (Milk) (96%) with emulsifiers soya and sunflower lecithin, flavouring and the sweetener sucralose, and the product is marked suitable for vegetarians. The listed price on the day we looked was £32.99, down from £34.99, which the site itself states as £1.10 per serving.',
  caution:
    'Contains milk and soya, both declared in bold on the label. This is whey protein concentrate rather than isolate, so it carries more lactose than an isolate-led product — relevant if whey has upset you before. Anyone with a cow’s milk protein allergy should avoid it, and anyone with reduced kidney function or on a protein-restricted diet should take the label to a clinician rather than reasoning from a product page.',
  takeaway:
    'This is the price anchor for UK whey. Convert it to cost per 100 g of protein — £32.99 over 30 servings of 22 g is about £5.00 per 100 g — and compare any premium brand against that figure before paying more. The brand describes the range as “quality tested” and “certified by world leading labs” without naming a certifier on the page we read, so treat that as marketing language rather than a batch certificate.',
  ingredients: [
    {
      name: 'Whey protein concentrate (milk)',
      dose: '22 g protein per 30 g serving (vanilla)',
      evidence_rating: 'strong',
      note: 'Listed at 96 per cent of the formula. The evidence rating is for protein supplementation alongside resistance training generally, not for this brand. Concentrate rather than isolate means a lower protein percentage by weight — 73 per cent here — and more lactose.',
    },
    {
      name: 'Emulsifiers: soya and sunflower lecithin',
      dose: 'Within the 96 per cent protein component',
      evidence_rating: 'none',
      note: 'Processing aids that help the powder disperse in liquid. Soya is a declared allergen.',
    },
    {
      name: 'Flavouring',
      dose: 'Not quantified',
      evidence_rating: 'none',
      note: 'Varies by flavour, and flavour choice is what moves the protein figure between 20 g and 23 g across the range. Read the panel for the one you order.',
    },
    {
      name: 'Sucralose (sweetener)',
      dose: 'Not quantified',
      evidence_rating: 'none',
      note: 'An artificial sweetener. Worth knowing about if you prefer to avoid them; it has no bearing on the protein content.',
    },
  ],
  published: '2026-09-22T00:00:00Z',
  updated: '2026-09-22T00:00:00Z',
};
