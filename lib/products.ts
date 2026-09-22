import type { Collection } from './types';
import { articles } from './articles';
import { toReview } from './articles/to-review';

/*
 * Product pages are assembled from lib/articles/*.ts — one file per article,
 * registered in lib/articles/index.ts. This module only adapts them to the
 * Review shape the components consume, and holds the editorial collections,
 * which are not product articles.
 */

export const productReviews = articles.map(toReview);

export const productAsins: Record<string, string> = Object.fromEntries(
  articles.filter((a) => a.asin).map((a) => [a.slug, a.asin as string]),
);

/**
 * A collection before its defaults are filled in. Everything a page must have
 * but rarely wants to state — publication flags, dates, SEO fallbacks — is
 * optional here and supplied below, so a short entry stays short and a page
 * that wants its own SEO title can say so.
 */
type CollectionDraft = Omit<
  Collection,
  'is_published' | 'seo_title' | 'seo_desc' | 'published_at' | 'updated_at'
> &
  Partial<Pick<Collection, 'seo_title' | 'seo_desc' | 'published_at' | 'updated_at'>>;

const DEFAULT_COLLECTION_DATE = '2026-09-20T00:00:00Z';

/**
 * The id of the review with this slug, resolved at import time.
 *
 * Comparison pages reference their two products by id, and those ids are
 * derived from registry position. Looking them up by slug means reordering
 * lib/articles/index.ts cannot silently repoint a comparison at the wrong
 * product — it throws here instead.
 */
function reviewId(slug: string): string {
  const review = productReviews.find((r) => r.slug === slug);
  if (!review) {
    throw new Error(`No product article with slug "${slug}" — referenced by a collection.`);
  }
  return review.id;
}

const collectionDrafts: CollectionDraft[] = [
  {
    id: 'label-shortlist',
    kind: 'best_lists' as const,
    title: 'How to build a supplement shortlist',
    slug: 'build-a-supplement-shortlist',
    summary: 'A practical selection method: purpose, disclosed amounts, evidence and total cost.',
    body: '<h2>Start with the question</h2><p>Write down the purpose before selecting a brand. A fibre powder, a relaxation formula and a vitamin have different jobs and should not compete for one best-product score.</p><h2>Build a comparable list</h2><p>Record the serving size, ingredient amounts, bottle count and cost per serving. Match the actual strength and form before comparing prices. Keep a link to the manufacturer label beside each entry.</p><h2>Check what is missing</h2><p>Ask whether a research citation concerns the finished formula. Record testing documents by batch and date. If a label hides individual doses, record that uncertainty.</p><h2>Read the product overviews</h2><p><a href="/fat-burners/now-psyllium-husk-powder">NOW Psyllium Husk Powder</a>, <a href="/nootropics/now-l-theanine-100-mg">NOW L-Theanine 100 mg</a> and <a href="/wellness/nature-made-vitamin-d3-1000-iu">Nature Made Vitamin D3 1000 IU</a> illustrate different label questions. This list is not a ranking.</p>',
  },
  {
    id: 'label-comparison',
    kind: 'comparisons' as const,
    title: 'Compare supplements without mixing up doses',
    slug: 'compare-labels-and-serving-costs',
    summary:
      'Separate capsule count, daily serving and ingredient amount before deciding which listing offers value.',
    body: '<h2>Price per bottle misses the point</h2><p>Divide the bottle price by the number of labelled servings. A 60-capsule bottle taken two capsules at a time contains 30 servings. A 30-capsule bottle taken one at a time also contains 30. Delivery charges and subscription conditions still affect the final cost.</p><h2>Match the formula</h2><p>Compare the exact form, strength and ingredient list. A product containing L-theanine plus green tea is different from pure L-theanine. A vitamin D bottle with a different strength is a different comparison even if the packaging looks similar.</p><h2>Keep evidence separate</h2><p>A cheaper serving is not proof of better effectiveness. Compare the relevance of the research independently, then consider testing documentation and practical use. Mark unverified details clearly.</p><h2>Check the source</h2><p>Use the manufacturer information linked in each product overview and compare it with the package offered by the seller. Marketplace listing titles can combine variants.</p>',
  },
  {
    id: 'on-vs-myprotein-whey',
    kind: 'comparisons' as const,
    title: 'Optimum Nutrition Gold Standard 100% Whey vs Myprotein Impact Whey Protein',
    slug: 'optimum-nutrition-vs-myprotein-impact-whey',
    seo_title: 'ON Gold Standard vs Myprotein Impact Whey: Worth £7 More?',
    seo_desc:
      'Same 900 g tub, same 30 servings, £7 apart at the cheapest. We put both UK labels side by side — protein per scoop, protein by weight, and what that gap actually buys.',
    summary:
      'Two 900 g tubs, thirty servings each, sold in the same country on the same day — and one costs at least £7 more. This is about as clean as a supplement comparison gets, so the only question left is what the extra money is actually buying.',
    verdict:
      'Myprotein wins on cost per gram of protein and Optimum Nutrition wins on protein density and label detail. Neither wins on results, because the research that supports both is about total daily protein rather than either brand.',
    takeaways: [
      'Like for like — 900 g, 30 servings — Impact Whey was £32.99 direct and Gold Standard ran £39.99 to £50.00 across seven UK retailers on 22 September 2026.',
      'Per 100 g of protein that is roughly £5.00 against £5.55 to £6.94: Gold Standard costs 11 to 39 per cent more depending on where you buy it.',
      'Gold Standard gives 24 g a scoop from an isolate-led blend; Impact Whey gives 22 g from 96 per cent concentrate. That is a difference in lactose and protein density, not in what the protein does.',
      'The buried number is protein by weight: 80 per cent for unflavoured Gold Standard, 77 per cent for its chocolate, 73 per cent for Impact Whey Original.',
      'Both carry a third-party certification and neither is the banned-substance kind. If you are drug tested, this comparison has no winner.',
    ],
    product_a_id: reviewId('optimum-nutrition-uk-review-2026'),
    product_b_id: reviewId('myprotein-impact-whey-review'),
    faqs: [
      {
        question: 'Which is better, Optimum Nutrition or Myprotein?',
        answer:
          'For building muscle, neither — the meta-analysis behind both products found total daily protein a stronger predictor of gains than protein source, so 24 g from one tub does what 24 g from the other does. For your wallet, Myprotein, by 11 to 39 per cent per gram of protein. For your stomach, possibly Optimum Nutrition, because an isolate-led blend carries less lactose than 96 per cent concentrate.',
      },
      {
        question: 'Is Gold Standard worth the extra money?',
        answer:
          'It depends entirely on where you buy it. At the £39.99 end of the UK range the gap is £7 on a 900 g tub, which is about 21p a serving — small enough that taste or tolerance can justify it. At Optimum Nutrition’s own £50.00 you are paying £17 more for two extra grams of protein a scoop, and that is much harder to defend.',
      },
      {
        question: 'Why does Gold Standard have more protein per scoop?',
        answer:
          'Because it is built on whey protein isolate rather than concentrate. Isolate is filtered further, so more of each gram of powder is protein and less is milk fat, carbohydrate and lactose. Unflavoured Gold Standard is about 80 per cent protein by weight against roughly 73 per cent for Impact Whey Original. Same amino acids, denser powder.',
      },
      {
        question: 'Which one is better for lactose intolerance?',
        answer:
          'Gold Standard, on the formulation. Its unflavoured blend leads with whey protein isolate, which is filtered to remove most of the lactose, while Impact Whey is 96 per cent concentrate and retains more. Neither is safe for a cow’s milk protein allergy — that is a different problem, and both declare milk in bold. If whey has upset you before, the honest answer is a dedicated isolate rather than either of these.',
      },
      {
        question: 'Are either of them tested for banned substances?',
        answer:
          'Not the versions compared here, on the companies’ own accounts. Optimum Nutrition says its Middlesbrough site is Informed-Sport registered and names which products are Informed Sport registered — the standard retail Gold Standard tub is not among them. Myprotein’s Impact Whey carries an LGC Informed Protein certification, which verifies protein content and purity rather than screening for banned substances. If you compete, look at a product with batch-level certification instead.',
      },
      {
        question: 'How do I compare protein powders properly?',
        answer:
          'Divide the delivered price by the servings on the pack, then divide that by the protein per serving and multiply by 100. You now have cost per 100 g of protein, which is the only figure that compares two tubs honestly. A price per kilogram of powder does not, because one powder can be 73 per cent protein and another 80.',
      },
      {
        question: 'Does the flavour change the numbers?',
        answer:
          'On both, yes. Optimum Nutrition’s unflavoured 900 g pack is 30 servings while flavoured packs of similar weight come in at 29, and the chocolate version drops to about 77 per cent protein by weight once cocoa and thickener are in. Myprotein headlines “up to 23 g” across more than forty flavours, and its own range table gives the Original version 22 g. Read the panel for the flavour in your basket, not the number on the front.',
      },
    ],
    body: `
<h2>Why this comparison is unusually clean</h2>
<p>Most supplement comparisons are rigged before they start, because the two products are not the same size, the same serving count or the same thing. This one genuinely is. Optimum Nutrition sells Gold Standard 100% Whey in a 900 g tub of 30 servings. Myprotein sells Impact Whey Protein in a 900 g tub of 30 servings. Both use a 30 g scoop. Both are sold in the UK to the same buyer on the same afternoon.</p>
<p>That means there is nowhere for either brand to hide. No pack-size trick, no scoop that is quietly smaller, no bundle that makes the arithmetic awkward. The only variables left are what is in the scoop and what the tub costs — which is exactly the comparison a shopper is trying to make and almost never gets.</p>
<p>All figures below were read from each brand’s own material or a named UK retailer on 22 September 2026, and every one of them can be re-checked. Prices move; the method does not.</p>

<h2>The two labels, side by side</h2>
<table>
<thead><tr><th>Read on 22 September 2026</th><th>ON Gold Standard 100% Whey</th><th>Myprotein Impact Whey</th></tr></thead>
<tbody>
<tr><th scope="row">Pack compared</th><td>900 g unflavoured, 30 servings</td><td>900 g, 30 servings</td></tr>
<tr><th scope="row">Serving</th><td>30 g scoop</td><td>30 g scoop</td></tr>
<tr><th scope="row">Protein per serving</th><td>24 g</td><td>22 g Original; “up to 23 g” across the range</td></tr>
<tr><th scope="row">Protein by weight</th><td>≈80% unflavoured; ≈77% Double Rich Chocolate</td><td>73% Original</td></tr>
<tr><th scope="row">Protein base</th><td>Blend led by whey protein isolate, with concentrate and hydrolysed isolate</td><td>Whey protein concentrate, 96% of the formula</td></tr>
<tr><th scope="row">UK price</th><td>£39.99–£50.00 across seven retailers; £50.00 on the brand’s own store</td><td>£32.99 direct, reduced from £34.99</td></tr>
<tr><th scope="row">Cost per serving</th><td>£1.33–£1.67</td><td>£1.10, the brand’s own figure</td></tr>
<tr><th scope="row">Cost per 100 g protein</th><td>£5.55–£6.94</td><td>≈£5.00</td></tr>
<tr><th scope="row">Full nutrition panel</th><td>Published via retailers: 116 kcal, 1.4 g fat, 1.8 g carbs, 1.3 g sugars, 0.11 g salt per 31 g chocolate scoop</td><td>Partial: 114 kcal and 73% protein on the brand page; fat, carbohydrate and salt not shown there</td></tr>
<tr><th scope="row">BCAAs advertised</th><td>5.5 g, naturally occurring</td><td>4.5 g</td></tr>
<tr><th scope="row">Amino acid profile</th><td>Not published</td><td>Not published</td></tr>
<tr><th scope="row">Third-party certification</th><td>Informed-Sport <em>site</em> registration; the standard retail tub is not a named Informed Sport product</td><td>LGC Informed Protein — verifies protein content and purity, not banned substances</td></tr>
</tbody>
</table>

<h2>The number that actually decides it</h2>
<p>Cost per serving is the figure both brands put in front of you, and it is the wrong one. Use cost per 100 g of protein instead: delivered price, divided by servings, divided by protein per serving, times a hundred. It is the only calculation that survives a difference in scoop size or protein density.</p>
<p>Run it and Impact Whey comes out at roughly £5.00 per 100 g of protein. Gold Standard lands between £5.55 and £6.94 depending on which of the seven UK retailers you buy from. In other words, the famous tub costs 11 per cent more at best and 39 per cent more at worst, for the same nutrient.</p>
<p>Note where the worst case is. On the day we looked, the most expensive place in the country to buy Gold Standard was Optimum Nutrition’s own store at £50.00, against £39.99 at the cheapest independent. That £10 spread inside one brand is larger than the gap between the brands at their best prices — which tells you that <em>where</em> you buy matters more here than <em>what</em> you buy.</p>
<p>The counter-argument is real but small. Gold Standard delivers two extra grams of protein per scoop, so over a 30-serving tub you get 720 g of protein against 660 g. If you are paying the £7 difference at the cheap end, you are buying 60 g of extra protein for £7 — about £11.67 per 100 g at the margin, which is worse value than either tub as a whole. That is the honest way to look at an upgrade: not what the tub costs, but what the difference costs.</p>

<h2>Isolate versus concentrate, and what it really changes</h2>
<p>This is the one genuine formulation difference, and it is worth understanding rather than taking on trust. Whey protein concentrate is filtered less, so it carries more of the milk’s fat, carbohydrate and lactose along with the protein. Isolate is filtered further, arriving at a denser powder with most of the lactose stripped out.</p>
<p>Gold Standard’s unflavoured blend names whey protein isolate first, with concentrate and hydrolysed isolate behind it. Impact Whey is whey protein concentrate at 96 per cent of the formula. That single choice explains almost everything else in the table: the protein per scoop, the protein by weight, and most of the price.</p>
<p>What it does not explain is results. The amino acids that reach your bloodstream are the same either way — filtration changes the powder, not the protein. So the practical question is narrow and personal: has whey upset your stomach before? If yes, the isolate-led blend is a defensible reason to pay more, and a dedicated isolate would be better still. If no, you are paying a premium for a problem you do not have.</p>
<p>Our <a href="/ingredients/whey-protein-blend">whey protein evidence page</a> goes through the forms and what each is and is not good for.</p>

<h2>Testing: two certifications, and neither is the one you might assume</h2>
<p>Both brands make a quality claim, and they are claims about completely different things — a distinction the packaging on either side does nothing to help with.</p>
<p>Optimum Nutrition states that its Middlesbrough manufacturing site is Informed-Sport registered, and separately names which of its products are Informed Sport registered: the England Rugby version of Gold Standard, Gold Standard 100% Plant and the Optimum Bar. The standard retail tub compared here is not on that list. Site registration describes the building; it does not describe the batch in your kitchen.</p>
<p>Myprotein’s Impact Whey is named in an LGC Informed Protein certification, announced in July 2025, which verifies true protein content free from amino acid spiking, product purity, and manufacturing standards. That is a meaningful certification in a category where label accuracy has a documented problem — but it is not a banned-substance programme, even though the same laboratory runs both.</p>
<p>So: one brand certifies the factory, the other certifies the protein number, and neither certifies the retail tub against the WADA list. For an ordinary buyer both are reassuring and Myprotein’s speaks more directly to the thing that actually goes wrong with cheap whey. For a drug-tested athlete, this comparison has no winner, and <a href="/wellness/kinetica-whey-protein-review">a batch-tested product</a> is the answer instead.</p>

<h2>What the research says about choosing between them</h2>
<p>Nothing, and that is the most useful finding on this page. The evidence behind both tubs is the same evidence: a 2018 meta-analysis of 49 trials and 1,863 participants found protein supplementation significantly increased gains in muscle size and strength alongside resistance training, with the benefit plateauing near 1.6 g of protein per kilogram of body weight per day.</p>
<p>That analysis specifically found total daily protein a stronger predictor of gains than protein source or timing. There is no trial showing Gold Standard outperforming Impact Whey, and given what the pooled data say about source, there is no reason to expect one. Both are dairy protein in a tub.</p>
<p>It is worth adding the prior question, because it decides more than the brand does. The British Nutrition Foundation puts average UK protein intakes at 76 g a day for adults aged 19 to 64, against a Reference Nutrient Intake near 56 g for men and 45 g for women, and states plainly that most people here do not need extra protein from supplements. If you are not training hard enough to be reaching for 1.2 to 2.0 g per kilogram, the correct answer to this comparison is neither.</p>

<h2>Where each one wins</h2>
<p><strong>Buy Impact Whey</strong> if the deciding factor is cost per gram of protein, which for most people it should be. It is cheaper by 11 to 39 per cent on that measure, it carries the certification that speaks to label accuracy, and its three-item ingredient list is as plain as whey gets. You accept a lower protein density and a bit more lactose for the saving.</p>
<p><strong>Buy Gold Standard</strong> if whey concentrate has given you trouble before, if you have found it at the £39.99 end rather than the £50.00 end, or if you have tried both and simply prefer it. Two extra grams a scoop and a fuller published panel are real advantages; they are just not large ones, and at the top of the UK price range they stop being worth paying for.</p>
<p><strong>Buy neither</strong> if you are drug tested, or if your protein intake is already adequate. Those are not evasions — they are the two situations where this entire comparison is the wrong question.</p>

<h2>How to check this yourself in two minutes</h2>
<p>Open both product pages. Write down the delivered price, the servings on the pack, and the protein per serving from the panel for the specific flavour — not the number on the front, which on one of these products is the best case across forty-plus flavours. Divide price by servings, then by protein, then multiply by 100.</p>
<p>Do it for the exact flavour and the exact retailer, because both move the answer. Gold Standard’s unflavoured pack is 30 servings while flavoured packs of similar weight are 29, and its chocolate version drops from roughly 80 per cent protein by weight to 77 once cocoa and thickener are accounted for. Impact Whey’s figure moves with flavour too, which is why its own page hedges with “up to”.</p>
<p>Then check the number you got against the range on this page. If your Gold Standard quote is near £5.55 per 100 g of protein, the gap is small enough to be a taste decision. If it is near £6.94, you have found the expensive end of a brand that has a cheap end, and the fix is a different retailer rather than a different brand.</p>
<p>Full detail on each is in the <a href="/wellness/optimum-nutrition-uk-review-2026">Optimum Nutrition Gold Standard review</a> and the <a href="/wellness/myprotein-impact-whey-review">Myprotein Impact Whey review</a>.</p>
`,
  },
];

export const editorialCollections: Collection[] = collectionDrafts.map((row) => ({
  ...row,
  is_published: true,
  seo_title: row.seo_title ?? row.title,
  seo_desc: row.seo_desc ?? row.summary,
  published_at: row.published_at ?? DEFAULT_COLLECTION_DATE,
  updated_at: row.updated_at ?? row.published_at ?? DEFAULT_COLLECTION_DATE,
}));
