import type { ProductArticle } from './types';

export const kineticaWheyProtein: ProductArticle = {
  slug: 'kinetica-whey-protein',
  name: 'Kinetica Whey Protein',
  brand: 'Kinetica',
  category: 'wellness',
  summary:
    'A whey blend whose selling point is the thing most big brands only half-offer: Informed Sport batch testing on the retail product, rather than certification of the factory it came from.',
  listing: '2.27 kg, 76 servings',
  image: 'https://m.media-amazon.com/images/I/61-3HdTLUmL._AC_SY879_.jpg',
  source: 'https://www.kineticasports.com/products/whey-protein-powder-vanilla-2-27kg',
  sourceNote:
    'Figures read from the brand’s own product page for the 2.27 kg vanilla pack on 22 September 2026, with the ingredient list and directions cross-checked against the Amazon.co.uk listing for the same pack. No GBP price is published here: the brand page we could reach quoted in euros.',
  facts:
    'A 30 g scoop provides 23 g of protein and 5.54 g of naturally occurring BCAAs, and the 2.27 kg pack is sold as 76 servings. That is about 77 per cent protein by weight. The vanilla ingredient list is a Whey Protein Blend (97%) of whey protein concentrate, whey protein isolate and hydrolysed whey protein concentrate, all from milk, with soya lecithin as an emulsifier, plus natural flavouring, the stabiliser sodium carboxymethylcellulose and the sweetener sucralose. Directions are one scoop into 170–200 ml of water, to a maximum of three servings a day.',
  caution:
    'Contains milk and soya. The blend is led by concentrate rather than isolate, so it carries more lactose than an isolate-first product. Not for anyone with a cow’s milk protein allergy. The three-servings-a-day ceiling is the manufacturer’s own instruction and is worth following.',
  takeaway:
    'The reason to look at this one is batch testing. The brand states the product is Informed Sport approved and batch tested against the WADA list, which is a stronger claim than a manufacturer saying its factory holds a site registration. If you are subject to drug testing, verify the specific batch code on your tub in the certifier’s database rather than relying on the packaging — strict liability means the certificate, not the logo, is what protects you.',
  ingredients: [
    {
      name: 'Whey protein blend (concentrate, isolate, hydrolysed concentrate)',
      dose: '23 g protein per 30 g serving',
      evidence_rating: 'strong',
      note: 'Listed at 97 per cent of the formula, all milk-derived. The evidence rating is for protein supplementation alongside resistance training generally, not for this brand. Concentrate is named first, so it is the largest part of the blend.',
    },
    {
      name: 'Naturally occurring BCAAs',
      dose: '5.54 g per serving',
      evidence_rating: 'weak',
      note: 'Quantified on the brand page, which is more than most whey labels do — but these are intrinsic to whey rather than added, and every whey contains them. Research on isolated BCAA supplements is a separate and much weaker literature that does not transfer here.',
    },
    {
      name: 'Soya lecithin (emulsifier)',
      dose: 'Within the 97 per cent protein blend',
      evidence_rating: 'none',
      note: 'A processing aid for mixability. It is a declared allergen alongside milk.',
    },
    {
      name: 'Sodium carboxymethylcellulose (stabiliser) and sucralose (sweetener)',
      dose: 'Not quantified',
      evidence_rating: 'none',
      note: 'Texture and taste ingredients. Flavoured versions also add natural flavouring and, in some flavours, a colour such as beetroot red.',
    },
  ],
  published: '2026-09-22T00:00:00Z',
  updated: '2026-09-22T00:00:00Z',
};
