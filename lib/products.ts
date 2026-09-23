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
      'Same 900 g tub, same 30 servings, £7 apart at the cheapest. Both UK labels side by side: protein per scoop, protein by weight, and what the gap buys.',
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
  {
    id: 'glp-1-explained',
    kind: 'articles' as const,
    title: 'GLP-1, explained properly',
    slug: 'glp-1',
    seo_title: 'What Is GLP-1? Drugs, Supplements and the Real Numbers',
    seo_desc:
      'Semaglutide lost 15%, tirzepatide 21%, the best-evidenced supplement 4.3%. Every GLP-1 figure traced to its trial — plus what happens when you stop.',
    summary:
      'A hormone your gut has always made, a drug class that reset what weight loss medicine can do, and a fast-growing aisle of supplements borrowing the name. This page separates the three, with every figure traced to its trial.',
    figure: {
      src: '/images/glp-1-weight-loss-scale.svg',
      alt: 'Bar chart comparing mean weight loss: tirzepatide 20.9 per cent, semaglutide about 15 per cent, Amarasate 4.3 per cent and placebo 0.5 per cent.',
      caption:
        'Mean percentage weight loss reported in four separate trials: tirzepatide 15 mg over 72 weeks (SURMOUNT-1), semaglutide 2.4 mg over 68 weeks (STEP 1), and the Amarasate and placebo arms of the 150-person C4 trial over 24 weeks, reported in Obesity Pillars in July 2026. Different durations and populations, shown together for scale rather than as a head-to-head comparison.',
    },
    verdict:
      'One supplement in this category has real randomised human evidence. It produced about a quarter of the weight loss the drugs produce. Everything else in the aisle is weaker than that, and several products have no human data at all.',
    takeaways: [
      'GLP-1 is a hormone released by your gut after eating. Your own version lasts about two minutes; the drugs are engineered to last a week.',
      'Semaglutide produced about 15 per cent weight loss over 68 weeks (STEP 1) and tirzepatide about 21 per cent over 72 (SURMOUNT-1). Head to head in SURMOUNT-5, tirzepatide won.',
      'Semaglutide also cut major cardiovascular events from 8.0 to 6.5 per cent in SELECT, across 17,604 people — a hard outcome, not a surrogate.',
      'Side effects are common, not rare: nausea 44 per cent, vomiting 24 per cent, constipation 24 per cent in the Wegovy trials. The EMA added NAION, a rare sudden vision loss, in 2025.',
      'Stopping reverses most of it. The STEP 1 extension saw a mean 11.6 percentage points regained within a year — about two-thirds of everything lost.',
      'Among supplements, only Amarasate (Calocurb) has randomised human trials measuring GLP-1 and weight: 3.77 kg over 24 weeks versus 0.40 kg on placebo. Real, and roughly a quarter of the drug effect.',
      'Berberine is not "nature’s Ozempic" — it acts on AMPK, not the GLP-1 receptor. Several probiotic and fibre products base their GLP-1 claims on preclinical work rather than human trials.',
    ],
    recommendations: [
      {
        name: 'Calocurb (Amarasate bitter hops extract)',
        brand: 'Calocurb',
        evidence: 'Randomised human trials, manufacturer-linked',
        note: 'The only product in this category with randomised controlled human evidence measuring both appetite hormones and weight. Amarasate is a bitter hops extract in an enteric-coated capsule, designed to reach the small intestine and trigger bitter taste receptors that release GLP-1, CCK and PYY. In a 24-week double-blind placebo-controlled trial of 150 adults with a BMI of 25 to 35, reported in Obesity Pillars in July 2026, participants lost 3.77 kg against 0.40 kg on placebo, with lean mass preserved. Read that with two caveats: the earlier trials were small (19 to 30 people) and the research programme originates with the New Zealand institute that developed and licenses the extract. It is also roughly a quarter of what the drugs achieve.',
        url: 'https://www.amazon.com/Calocurb-Supplement-Activator-Patented-Overeating/dp/B09SL1T2CM',
        image: 'https://m.media-amazon.com/images/I/71xeuKkRK1L._AC_SX569_.jpg',
      },
      {
        name: 'GLP-1 Probiotic (Akkermansia muciniphila)',
        brand: 'Pendulum',
        evidence: 'Human trial for blood glucose; GLP-1 claim preclinical',
        note: 'The best-known probiotic sold for GLP-1, built on Akkermansia muciniphila plus butyrate-producing strains — the idea being that butyrate stimulates L-cells to release GLP-1. Pendulum does have a published human trial in BMJ Open Diabetes Research & Care, but its endpoints were glycaemic: a 0.6 per cent HbA1c reduction and 33 per cent smaller post-meal glucose spikes in type 2 diabetes at 12 weeks. That is a real result for a real outcome. It is not weight loss, and the health journalism watchdog Gary Schwitzer has pointed out that the company’s GLP-1 claims specifically rest on preclinical studies rather than studies in people.',
        url: 'https://www.amazon.com/Pendulum-Akkermansia-Probiotic-Supplement-Increases/dp/B0B3GF96C3',
        image: 'https://m.media-amazon.com/images/I/613AuyXrzVL._AC_SX569_.jpg',
      },
      {
        name: 'GLP-1 Booster prebiotic fibre blend',
        brand: 'Supergut',
        evidence: 'Mechanism established; effect on appetite inconsistent',
        note: 'A prebiotic fibre drink built on resistant starch and other fermentable fibres. The mechanism is genuinely well documented: fermentable fibre reaches the colon, gut bacteria convert it to short-chain fatty acids, and those activate receptors on L-cells that release GLP-1. The problem is magnitude. A 2026 scoping review pooling 52 studies in 1,085 participants found only some fibre types raised GLP-1 consistently, and studies showing a GLP-1 rise had only a non-significant tendency to also report increased satiety. Worth eating as fibre. Not a drug, and priced well above plain psyllium.',
        url: 'https://www.amazon.com/s?k=supergut+glp-1+booster+fiber',
        image: 'https://m.media-amazon.com/images/I/71cTbhrU5tL._AC_UL320_.jpg',
      },
    ],
    faqs: [
      {
        question: 'What does GLP-1 actually stand for?',
        answer:
          'Glucagon-like peptide-1. It is an incretin hormone released by L-cells in your gut wall after eating. It prompts insulin release when blood glucose is high, suppresses glucagon, slows how fast the stomach empties, and signals fullness to the brain. Your own GLP-1 is destroyed by an enzyme called DPP-4 within about two minutes. The drugs are engineered to resist that and last for days.',
      },
      {
        question: 'Do any GLP-1 supplements actually work?',
        answer:
          'One has randomised human evidence worth taking seriously. Amarasate, the bitter hops extract sold as Calocurb, produced 3.77 kg of weight loss over 24 weeks against 0.40 kg on placebo in a 150-person double-blind trial. That is real — and it is roughly a quarter of what semaglutide or tirzepatide achieve. Most other products in the category rest on mechanism, preclinical work or trials in a different outcome entirely, and some have no GLP-1 mechanism at all.',
      },
      {
        question: 'Is berberine "nature’s Ozempic"?',
        answer:
          'No, and the nickname is misleading about the mechanism rather than just the magnitude. Berberine is a plant alkaloid that acts mainly through the AMPK enzyme — closer to how metformin behaves than how semaglutide does. It does not act on the GLP-1 receptor. Trials in people with a BMI of 25 to 29.9 taking about 1 g daily for eight weeks or more have reported modest reductions in weight and waist circumference, but they are small and, as UCLA Health puts it, the amount of weight you can lose is unclear. It can also potentiate diabetes medicines and interacts with anti-rejection drugs.',
      },
      {
        question: 'How much weight do people lose on the prescription drugs?',
        answer:
          'In STEP 1, semaglutide 2.4 mg produced a mean reduction of about 15 per cent over 68 weeks. In SURMOUNT-1, tirzepatide 15 mg produced 20.9 per cent over 72 weeks. SURMOUNT-5 compared them directly in adults with obesity and without diabetes and found tirzepatide superior on both weight and waist circumference. These are trial averages with regular clinical contact and lifestyle support, not guarantees.',
      },
      {
        question: 'What happens if I stop?',
        answer:
          'Most of the weight returns. In the STEP 1 extension, participants who had lost 17.3 per cent regained a mean of 11.6 percentage points within a year of stopping — roughly two-thirds — and blood pressure and most lipid markers drifted back toward baseline. Just under half were still at least 5 per cent below their starting weight after that year. These are treatments for a chronic condition rather than a course you finish.',
      },
      {
        question: 'Do the drugs cause muscle loss?',
        answer:
          'They cause lean mass loss, as any large weight loss does. In the STEP 1 body composition sub-study around 39 to 40 per cent of weight lost was lean tissue, with absolute lean mass down about 9.7 per cent. The fuller picture is that the ratio of lean to fat mass still improved, from 1.34 to 1.57, so body composition got better even as absolute muscle fell. Protein intake and resistance training are the recognised ways to protect the lean side.',
      },
      {
        question: 'What are the main side effects?',
        answer:
          'Mostly gastrointestinal and common. In the Wegovy 2.4 mg trials: nausea 44 per cent, diarrhoea 30 per cent, vomiting 24 per cent, constipation 24 per cent, against 16, 16, 6 and 11 per cent on placebo. Serious but rarer concerns include pancreatitis and gallbladder disease, and the label carries a boxed warning about thyroid C-cell tumours seen in rodents. In 2025 the EMA classified NAION — a sudden, usually irreversible vision loss — as a very rare side effect of semaglutide, up to 1 in 10,000 users, and the WHO issued an alert.',
      },
      {
        question: 'Are compounded or online GLP-1 products safe?',
        answer:
          'The FDA has been unusually blunt. Compounded versions are not reviewed for safety, effectiveness or quality, and as of 31 May 2026 the agency had logged 990 adverse event reports involving compounded semaglutide and more than 730 involving compounded tirzepatide. A recurring cause is ten-fold dosing errors from confusion over syringe units. It has also warned about counterfeit products, "semaglutide sodium" and "semaglutide acetate" salt forms that are different active ingredients with no safety data, and products sold with dosing instructions while labelled "for research purposes".',
      },
      {
        question: 'Can a supplement replace the injection?',
        answer:
          'No, and the gap is one of kind rather than degree. A drug that holds GLP-1 signalling open for a week is doing something structurally different from a capsule that nudges your own two-minute hormone. The best supplement evidence in this category is about a quarter of the drug effect, from smaller and shorter trials. If you qualify for a prescription and want the results the trials showed, a supplement is not the route to them.',
      },
    ],
    body: `
<h2>Three different things share one name</h2>
<p>Almost every argument about GLP-1 is a confusion between three separate things that ended up sharing a label.</p>
<p>The first is <strong>a hormone</strong> your gut has made your whole life. The second is <strong>a class of prescription drugs</strong> built to imitate it, which produced the largest weight losses ever recorded outside surgery. The third is <strong>a supplement category</strong> that grew up around the name, ranging from products with genuine randomised trials to products with no plausible mechanism at all.</p>
<p>This page takes them in turn, with every figure traced to a named trial or regulator. It is written for anyone deciding whether to ask a doctor about these drugs, anyone already on one, and anyone holding a bottle labelled "GLP-1 support" and wondering what it can actually do.</p>
<p>Nothing here is medical advice, and this site neither sells nor prescribes these medicines. Where the honest answer is "nobody knows yet", it says so.</p>

<h2>The hormone: what GLP-1 is and what it does</h2>
<p>Glucagon-like peptide-1 is an incretin — a hormone released from the gut when food arrives, telling the rest of the body about it. It is produced mainly by L-cells concentrated in the lower small intestine and colon, within minutes of eating.</p>
<p>It does four things that matter here. It stimulates insulin secretion, but only when blood glucose is already elevated, which is why it lowers glucose without insulin's hypoglycaemia risk. It suppresses glucagon, the hormone telling the liver to release stored glucose. It slows gastric emptying, so food leaves the stomach more gradually. And it acts on appetite centres in the brain, producing the sensation of having had enough.</p>
<p>The catch — and the reason the entire drug class exists — is duration. Native GLP-1 is degraded by an enzyme called DPP-4 within roughly two minutes. As a therapy that is useless: you cannot dose a hormone with a two-minute half-life. Every pharmaceutical advance here has been an answer to that single problem.</p>
<p>Worth holding onto: this is <em>your own physiology</em>. The drugs are not introducing an alien mechanism. They hold open a switch your body already flips several times a day, for a week at a time instead of two minutes. That distinction is also the honest reason a supplement cannot match them — nudging a two-minute hormone slightly higher is a different kind of intervention from sustaining the signal for days.</p>

<h2>The drugs: what they are and what the trials found</h2>
<p>Two molecules dominate, sold under four names, which causes constant confusion.</p>
<p><strong>Semaglutide</strong> is a GLP-1 receptor agonist, sold as Ozempic for type 2 diabetes, Wegovy for weight management, and Rybelsus as an oral tablet. <strong>Tirzepatide</strong> is a dual agonist activating both the GLP-1 and GIP receptors, sold as Mounjaro for diabetes and Zepbound for weight management. Same molecule, different brand, different licensed indication and dosing.</p>
<p>In <strong>STEP 1</strong>, semaglutide 2.4 mg weekly produced a mean weight reduction of about 15 per cent over 68 weeks. In <strong>SURMOUNT-1</strong>, tirzepatide 15 mg produced 20.9 per cent over 72 weeks. For scale: weight-loss drugs before this class typically delivered 3 to 8 per cent.</p>
<p>In 2025 the two were compared directly. <strong>SURMOUNT-5</strong> randomised adults with obesity and without diabetes to the maximum tolerated dose of either drug for 72 weeks and found tirzepatide superior on both weight reduction and waist circumference.</p>
<p>Weight is not the only endpoint that moved. <strong>SELECT</strong> enrolled 17,604 people aged 45 or over with existing cardiovascular disease, a BMI of 27 or higher and no diabetes. Semaglutide cut major adverse cardiovascular events — cardiovascular death, non-fatal heart attack, non-fatal stroke — from 8.0 to 6.5 per cent, a 20 per cent relative reduction. That is a hard clinical outcome rather than a surrogate marker, and it is what moved these drugs from cosmetic to cardiometabolic in most clinicians' minds.</p>

<h2>What they cost you: side effects, honestly</h2>
<p>Side effects are common, mostly gastrointestinal, and usually worst while the dose is being escalated.</p>
<p>From the Wegovy 2.4 mg adult trials: nausea in 44 per cent, diarrhoea in 30 per cent, vomiting in 24 per cent, constipation in 24 per cent — against 16, 16, 6 and 11 per cent on placebo. Headache affected 14 per cent, fatigue 11 per cent, dyspepsia 9 per cent, dizziness 8 per cent. These are not rare inconveniences. They are the experience of a large fraction of everyone taking the drug.</p>
<p>The serious concerns deserve naming precisely rather than either dismissing or sensationalising:</p>
<ul>
<li><strong>Thyroid C-cell tumours.</strong> The label carries a boxed warning. Semaglutide caused these tumours in rodents at clinically relevant exposures; human relevance is unknown. Contraindicated in anyone with a personal or family history of medullary thyroid carcinoma, or with MEN 2.</li>
<li><strong>Pancreatitis.</strong> Acute pancreatitis, including fatal cases, has been reported with this class. In a two-year trial the rates were similar between semaglutide and placebo — 8 cases against 10 — so the signal is not clear-cut, but it stays on the label.</li>
<li><strong>Gallbladder disease.</strong> Around 1.6 per cent on the 2.4 mg dose. Rapid weight loss of any kind raises gallstone risk.</li>
<li><strong>NAION.</strong> In 2025 the EMA's safety committee concluded that non-arteritic anterior ischaemic optic neuropathy — sudden, usually irreversible vision loss in one eye — is a very rare side effect of semaglutide, up to 1 in 10,000 users. The WHO issued a global alert. Sudden vision change means contacting a doctor immediately.</li>
</ul>
<p>Keep the rare risks in proportion. One in 10,000 is genuinely very rare, and the cardiovascular benefit in SELECT was measured in whole percentage points across 17,604 people. But "very rare" is not "never", and someone who cannot tolerate persistent nausea is having the single most common reaction to the drug, not failing at it.</p>

<h2>The muscle question</h2>
<p>In the STEP 1 body composition sub-study, roughly <strong>39 to 40 per cent of the weight lost was lean mass</strong>, with absolute lean mass falling about 9.7 per cent. Headlines have run with that figure alone, which is misleading — losing some lean tissue is a normal part of losing any substantial amount of weight, by any method including diet alone.</p>
<p>The fuller picture is that the <em>proportion</em> of lean mass to total body mass increased, and the lean-to-fat ratio improved from 1.34 at baseline to 1.57 at week 68. Body composition improved overall even as absolute muscle fell. Both statements are true, and quoting either alone produces a distorted article.</p>
<p>What follows practically is not controversial. If appetite is suppressed by a third, every remaining mouthful has to work harder, and protein is the macronutrient with the clearest role in defending lean tissue during weight loss. Resistance training is the other half — the signal that tells the body to keep the muscle it has. Our <a href="/ingredients/whey-protein-blend">whey protein evidence page</a> covers what protein does and does not do.</p>

<h2>Stopping: the finding nobody puts on a billboard</h2>
<p>The STEP 1 trial extension followed participants for a year after treatment ended. Having reached a mean 17.3 per cent weight loss at 68 weeks, they regained a mean of <strong>11.6 percentage points</strong> over the next 52 weeks — roughly two-thirds of everything lost. Blood pressure returned to baseline. Most lipid markers and C-reactive protein rose substantially. A small relative HbA1c improvement persisted, and 48.2 per cent remained at least 5 per cent below their starting weight.</p>
<p>That is not a scandal and not a reason to avoid the drugs. It is how a treatment for a chronic relapsing condition behaves — blood pressure medication stops working when you stop taking it too. But it reframes the decision from "how much will I lose" to "what does the next decade look like", which is a question about cost, access and tolerability.</p>

<h2>The supplement aisle, graded honestly</h2>
<p>This is the part this site exists for, and it is more interesting than either the promoters or the debunkers usually allow. The category is not uniformly worthless — but it is wildly uneven, and the differences are not visible from the packaging.</p>
<h3>The one with real human trials: Amarasate</h3>
<p>Amarasate is a bitter hops extract developed in New Zealand and sold as Calocurb. The mechanism is unusual and plausible: an enteric-coated capsule carries the bitter compounds past the stomach into the small intestine, where bitter taste receptors — the same family found on the tongue — trigger release of GLP-1, CCK and PYY.</p>
<p>Unlike almost everything else in this aisle, it has been tested in people. Early trials were small: 30 fasted men in 2019, 19 healthy-weight men in 2022, 30 women in 2024, reporting 25 to 40 per cent reductions in hunger and cravings and 14 to 18 per cent reductions in energy intake. Then a 24-week double-blind placebo-controlled trial of 150 adults with a BMI of 25 to 35, reported in <em>Obesity Pillars</em> in July 2026, found participants lost <strong>3.77 kg against 0.40 kg on placebo</strong>, with lean mass preserved.</p>
<p>Two caveats matter. The research programme originates with the New Zealand institute that developed the extract and licenses it commercially, which is a real interest to declare. And the comparison that puts it in perspective: 3.77 kg over 24 weeks is roughly a quarter of what the drugs deliver. It is a genuine effect at a much smaller scale — which is a far more useful description than either "natural Ozempic" or "snake oil".</p>
<h3>The probiotics: a real trial, for a different outcome</h3>
<p>Products built on <em>Akkermansia muciniphila</em> and butyrate-producing strains are the second-biggest segment. The logic is sound: butyrate stimulates L-cells to release GLP-1.</p>
<p>Pendulum, the best-known, does have a published human trial in <em>BMJ Open Diabetes Research & Care</em> — a 0.6 per cent HbA1c reduction and 33 per cent smaller post-meal glucose spikes at 12 weeks in type 2 diabetes. That is a real result. It is also a glycaemic result, not a weight-loss one. The health journalism watchdog Gary Schwitzer has specifically noted that the company's GLP-1 claims rest on preclinical studies rather than studies in people — a distinction the marketing does not make.</p>
<h3>The fibre drinks: mechanism yes, magnitude no</h3>
<p>Prebiotic fibre products are the third segment, and the mechanism is the best documented of any of them. Fermentable fibre reaches the colon, gut bacteria ferment it into short-chain fatty acids — acetate, propionate, butyrate — and those activate FFAR2 and FFAR3 receptors on L-cells, releasing GLP-1. Propionate is the most potent.</p>
<p>The magnitude is where it falls down. A 2026 scoping review pooled 52 studies in 1,085 participants and found the results mixed: only certain fibre types raised GLP-1 consistently, and — the part that matters — studies reporting a GLP-1 increase showed only a <em>non-significant</em> tendency to also report increased satiety, with a confidence interval including the null. Raising the hormone on a blood test did not reliably translate into eating less.</p>
<h3>Berberine, and the rest of the shelf</h3>
<p>Berberine gets called "nature's Ozempic", mostly by social media. It is a plant alkaloid acting through the AMPK enzyme — mechanistically closer to metformin than to semaglutide, and not acting on the GLP-1 receptor at all. Small trials at around 1 g daily report modest reductions in weight and waist circumference; UCLA Health's summary is that the amount you can lose is unclear. It can potentiate diabetes medicines, interacts with anti-rejection drugs, and is harmful to infants.</p>
<p>Below that sits the bulk of the category: apple cider vinegar and BHB "keto" blends relabelled as GLP-1 boosters, and proprietary formulas that will not say how much of anything is in them. We have reviewed products of that shape — <a href="/fat-burners/slimset-review">one disclosed dose out of five</a>, <a href="/fat-burners/sodamelt-review">a twelve-ingredient proprietary blend with no amounts at all</a>. Where a product will not tell you the quantities, no discussion of mechanism is possible, and the "GLP-1" on the label is doing marketing work rather than describing the formula.</p>

<h2>Compounded and counterfeit versions</h2>
<p>A grey market grew alongside the shortages, and the regulator's language about it is unusually direct.</p>
<p>The FDA states that compounded GLP-1 drugs are unapproved products that do not undergo review for safety, effectiveness or quality before marketing. As of 31 May 2026 it had received 990 adverse event reports associated with compounded semaglutide and more than 730 for compounded tirzepatide. A recurring cause is <strong>ten-fold dosing errors</strong> from confusion over syringe units — by patients and sometimes by clinicians.</p>
<p>It has also flagged counterfeit Ozempic that may contain the wrong ingredient, too much, too little or none; "semaglutide sodium" and "semaglutide acetate" salt forms that are different active ingredients with no safety data; products sold with dosing instructions while labelled "for research purposes" or "not for human consumption"; and improper refrigeration in transit. Its advice is simple: a prescription from a licensed prescriber, filled at a licensed pharmacy, and multi-dose vials discarded 28 days after first use.</p>

<h2>Access varies enormously by country</h2>
<p>Where you live changes this decision more than almost anything else. In the United States both semaglutide and tirzepatide are FDA-approved for weight management, and the binding constraint is insurance coverage and out-of-pocket cost. Across the European Union the EMA has authorised the same molecules, with national reimbursement rules differing widely between member states.</p>
<p>In England, NICE recommends tirzepatide for adults with a BMI of at least 35 and one weight-related condition, and semaglutide from a BMI of 30 with a weight-related condition, with thresholds reduced by 2.5 kg/m² for people from some minority ethnic backgrounds; NHS primary care prescribing of tirzepatide began a phased rollout on 23 June 2025 from the highest-need group. In much of Asia, Latin America and Africa, access is largely private-pay where it exists at all, and the counterfeit risk described above is correspondingly higher.</p>
<p>The practical point for an international reader: the trial results are the same everywhere, and the cost, eligibility and supply chain are not. Check your own country's regulator rather than assuming a headline from elsewhere applies.</p>

<h2>So what should you actually do?</h2>
<p><strong>If you are considering a prescription:</strong> that conversation is with a doctor. Useful questions are what the side-effect profile means for your life, what happens when you stop, what it costs over years rather than months, and whether you are eligible under your country's rules. Do not buy from a site that does not require a prescription.</p>
<p><strong>If you are already taking one:</strong> protein intake and resistance training are the two things most within your control, for the lean mass reason above. Constipation affects around a quarter of users and responds to fibre and fluid — raise fibre gradually and mention it to your prescriber, since these drugs already slow gastric emptying.</p>
<p><strong>If you are looking at a supplement:</strong> read the panel first. If it will not tell you how much of each ingredient it contains, stop there. If it will, then ask what human evidence exists for that specific ingredient at that specific amount — and note that "clinically studied" frequently refers to a trial at a different dose, in a different population, or measuring something other than weight.</p>
<p>The products below are the best-known things sold in this category. They are listed because people are buying them and deserve an accurate account of what is behind each one, not because any of them replaces a prescription. None has been reviewed and scored here yet, and each card says so.</p>
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
