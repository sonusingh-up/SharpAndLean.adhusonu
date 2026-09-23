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
    seo_title: 'GLP-1 Explained: The Hormone, The Drugs, The Supplements',
    seo_desc:
      'What GLP-1 actually is, what the drugs do and cost you, what happens when you stop, and why no supplement is "nature’s Ozempic" — with the trial numbers.',
    summary:
      'A hormone your gut has always made, a class of drugs that changed obesity medicine, and an aisle of supplements claiming to do the same thing. This page separates the three, with the trial figures attached.',
    verdict:
      'Nothing sold as a supplement raises GLP-1 enough to matter. The supplements that genuinely help are the ones that address what the drugs do to your muscle and your diet.',
    takeaways: [
      'GLP-1 is a hormone released by your gut after eating. The drugs are long-acting copies that survive in the blood for days rather than minutes.',
      'In trials, semaglutide produced about 15 per cent weight loss over 68 weeks and tirzepatide about 21 per cent over 72. No supplement is within an order of magnitude of that.',
      'Around 39 to 40 per cent of the weight lost on semaglutide in STEP 1 was lean mass — which is why protein and resistance training matter more on these drugs, not less.',
      'Stopping matters: in the STEP 1 extension, participants regained about two-thirds of the lost weight within a year of withdrawal.',
      'Berberine is not "nature’s Ozempic". It works through a different pathway, the human trials are small, and the effect is nowhere near comparable.',
      'Fibre does raise your own GLP-1 — modestly, inconsistently, and without reliably making you eat less. It is worth eating. It is not a drug.',
    ],
    items: [
      {
        review_id: reviewId('kinetica-whey-protein-review'),
        rank: 1,
        why_it_made_the_list:
          'Not a GLP-1 product, and that is the point. Roughly 39 to 40 per cent of the weight lost on semaglutide in STEP 1 came from lean mass, and appetite suppression makes hitting a protein target genuinely hard. This is the best-labelled protein we have reviewed — a full macro panel and all nineteen amino acids per scoop, batch tested under Informed Sport — at about the same cost per gram of protein as the budget brands. If you are eating far less, what you do eat has to be denser.',
      },
      {
        review_id: reviewId('myprotein-impact-whey-review'),
        rank: 2,
        why_it_made_the_list:
          'The same job for less money, and the figure every other tub should be measured against: roughly £5.00 per 100 g of protein. It carries an LGC Informed Protein certification, which verifies the protein content is real rather than inflated with free amino acids — worth something when protein is the one macronutrient you are trying not to lose. Concentrate rather than isolate, so more lactose; if nausea is already an issue, that is worth knowing.',
      },
      {
        review_id: reviewId('nature-made-vitamin-d3-1000-iu'),
        rank: 3,
        why_it_made_the_list:
          'When total food intake drops by a third, micronutrient intake drops with it, and vitamin D is one of the easiest to fall short on because so little of it comes from food anyway. This is a single ingredient, USP verified for potency, at about six cents a day. Ask for a blood test rather than guessing — but if the answer is low, this is the cheapest well-verified way to fix it.',
      },
    ],
    faqs: [
      {
        question: 'What does GLP-1 actually stand for?',
        answer:
          'Glucagon-like peptide-1. It is a hormone released by L-cells in your gut wall after you eat, and it does several things at once: it prompts insulin release when blood glucose is high, suppresses glucagon, slows how fast the stomach empties, and signals fullness to the brain. Your own GLP-1 is broken down within minutes. The drugs are engineered versions that resist that breakdown and last for days.',
      },
      {
        question: 'Is there a natural GLP-1 supplement that works like Ozempic?',
        answer:
          'No. Nothing sold over the counter comes close, and the gap is not small — it is roughly two orders of magnitude. Berberine, the compound most often called "nature’s Ozempic", works through a different mechanism entirely and has only preliminary human evidence. Fibre genuinely does stimulate your own GLP-1, but a scoping review of 52 studies found the rise did not reliably translate into eating less.',
      },
      {
        question: 'How much weight do people lose on GLP-1 drugs?',
        answer:
          'In the STEP 1 trial, semaglutide 2.4 mg produced a mean weight reduction of about 15 per cent over 68 weeks. In SURMOUNT-1, tirzepatide 15 mg produced about 21 per cent over 72 weeks. In the head-to-head SURMOUNT-5 trial, tirzepatide beat semaglutide on both weight and waist circumference. Those are averages from trials with regular clinical contact and lifestyle support, not guarantees.',
      },
      {
        question: 'What happens if I stop taking it?',
        answer:
          'Most of the weight comes back. In the STEP 1 trial extension, participants who had lost 17.3 per cent regained a mean of 11.6 percentage points within a year of stopping — about two-thirds of what they had lost — and blood pressure and most lipid markers drifted back toward baseline. Just under half were still at least 5 per cent below their starting weight a year later. These are treatments for a chronic condition, not a course of antibiotics.',
      },
      {
        question: 'Do GLP-1 drugs cause muscle loss?',
        answer:
          'They cause lean mass loss, as any substantial weight loss does. In the STEP 1 body composition sub-study, around 39 to 40 per cent of the weight lost was lean tissue, with absolute lean mass falling about 9.7 per cent. The more useful framing is that the ratio of lean to fat mass improved overall — from 1.34 to 1.57 — so body composition got better even as absolute muscle fell. Protein intake and resistance training are the recognised ways to protect the lean side of that.',
      },
      {
        question: 'What are the main side effects?',
        answer:
          'Gastrointestinal, mostly, and common. In the Wegovy 2.4 mg trials, nausea affected 44 per cent, diarrhoea 30 per cent, vomiting 24 per cent and constipation 24 per cent, against 16, 16, 6 and 11 per cent on placebo. Rarer but serious concerns include pancreatitis and gallbladder disease, and the label carries a boxed warning about thyroid C-cell tumours seen in rodents. In 2025 the EMA added NAION, a rare form of sudden vision loss, as a very rare side effect — up to 1 in 10,000 users.',
      },
      {
        question: 'Are compounded or online GLP-1 products safe?',
        answer:
          'The FDA has been unusually direct about this. Compounded versions are not reviewed for safety, effectiveness or quality, and the agency has logged well over a thousand adverse event reports involving compounded semaglutide and tirzepatide — including ten-fold dosing errors caused by confusion over syringe units. It has also warned about counterfeit products, different salt forms with no safety data, and products falsely labelled "for research purposes". Get a prescription from a licensed prescriber and fill it at a licensed pharmacy.',
      },
      {
        question: 'Can I get these on the NHS?',
        answer:
          'Yes, within criteria. NICE recommends tirzepatide for adults with a BMI of at least 35 and at least one weight-related condition, and semaglutide at a BMI of at least 30 with a weight-related condition, with thresholds reduced by 2.5 for people from some minority ethnic backgrounds. Primary care access to tirzepatide began a phased rollout in England from 23 June 2025, starting with the highest-need group — a BMI of at least 40 plus four of five listed conditions.',
      },
      {
        question: 'Should I take a fibre supplement instead?',
        answer:
          'Not instead — that comparison does not hold. But fibre is worth taking on its own merits, and it becomes more relevant on a GLP-1 drug rather than less, because constipation affects around a quarter of users. Plain psyllium husk is the cheapest well-evidenced option and is sold with its dose printed on the tub. Raise the dose gradually, take it with plenty of water, and check with your prescriber first, since these drugs already slow gastric emptying.',
      },
    ],
    body: `
<h2>Three different things share one name</h2>
<p>Almost every argument about GLP-1 is really a confusion between three separate things that have ended up sharing a label.</p>
<p>The first is <strong>a hormone</strong> your gut has made your entire life. The second is <strong>a class of prescription drugs</strong> built to imitate it, which have produced the largest weight losses ever recorded outside surgery. The third is <strong>an aisle of supplements</strong> borrowing the name, none of which does what the drugs do.</p>
<p>This page takes them one at a time, with the numbers attached. It is written for someone deciding whether to ask a doctor about these drugs, someone already taking one and wondering what else they should be doing, and someone standing in front of a bottle labelled "GLP-1 support" wondering whether it is worth twenty pounds.</p>
<p>Nothing here is medical advice, and this site does not sell or prescribe these medicines. Where we cite a trial we name it, and where the honest answer is "nobody knows yet" we say so.</p>

<h2>The hormone: what GLP-1 is and what it does</h2>
<p>Glucagon-like peptide-1 is an incretin — a hormone released from the gut in response to food, which tells the rest of the body that food has arrived. It is produced mainly by L-cells concentrated in the lower small intestine and colon, and it is released within minutes of eating.</p>
<p>It does four things that matter here. It stimulates insulin secretion, but only when blood glucose is elevated, which is why it lowers glucose without the hypoglycaemia risk of insulin itself. It suppresses glucagon, the hormone that tells the liver to release stored glucose. It slows gastric emptying, so food leaves the stomach more gradually. And it acts on appetite centres in the brain, producing the sensation of having had enough.</p>
<p>The catch, and the reason the drugs exist, is duration. Native GLP-1 is degraded by an enzyme called DPP-4 within about two minutes of release. As a therapy it is useless: you cannot dose a hormone with a two-minute half-life. Every pharmaceutical advance in this area has essentially been an answer to that one problem.</p>
<p>It is worth holding onto the fact that this is <em>your own physiology</em>. The drugs are not introducing an alien mechanism. They are holding open a switch your body already flips several times a day, for days at a time instead of minutes.</p>

<h2>The drugs: what they are and what the trials found</h2>
<p>The current generation is dominated by two molecules sold under four names, which causes endless confusion.</p>
<p><strong>Semaglutide</strong> is a GLP-1 receptor agonist. It is sold as Ozempic for type 2 diabetes, Wegovy for weight management, and Rybelsus as an oral tablet. <strong>Tirzepatide</strong> is a dual agonist — it activates both the GLP-1 and GIP receptors — and is sold as Mounjaro for diabetes and Zepbound for weight management. Same molecule, different brand name, different licensed indication and dose.</p>
<p>The trial results are the reason this class changed obesity medicine rather than merely joining it.</p>
<p>In <strong>STEP 1</strong>, semaglutide 2.4 mg weekly produced a mean weight reduction of about 15 per cent over 68 weeks. In <strong>SURMOUNT-1</strong>, tirzepatide 15 mg produced a mean reduction of 20.9 per cent over 72 weeks. For context, the weight-loss drugs available before this class typically delivered 3 to 8 per cent, and the supplements reviewed on this site have no demonstrated effect on body weight at all.</p>
<p>In 2025 the two were compared directly. <strong>SURMOUNT-5</strong> randomised adults with obesity and without diabetes to the maximum tolerated dose of either drug for 72 weeks, and found tirzepatide superior to semaglutide on both weight reduction and waist circumference.</p>
<p>Weight is not the only endpoint that moved. <strong>SELECT</strong> enrolled 17,604 people aged 45 or over with existing cardiovascular disease, a BMI of 27 or higher and no diabetes, and found semaglutide reduced major adverse cardiovascular events — cardiovascular death, non-fatal heart attack, non-fatal stroke — from 8.0 per cent to 6.5 per cent, a 20 per cent relative reduction. That is a hard outcome, not a surrogate marker, and it is the finding that moved these drugs from cosmetic to cardiometabolic in most clinicians' minds.</p>

<h2>What they cost you: side effects, honestly</h2>
<p>The side effects are common, mostly gastrointestinal, and usually worst during dose escalation.</p>
<p>From the Wegovy 2.4 mg adult trials: nausea in 44 per cent of participants, diarrhoea in 30 per cent, vomiting in 24 per cent and constipation in 24 per cent — against 16, 16, 6 and 11 per cent on placebo. Headache affected 14 per cent, fatigue 11 per cent, dyspepsia 9 per cent and dizziness 8 per cent. These are not rare inconveniences; they are the experience of a large fraction of everyone taking the drug.</p>
<p>The serious concerns are rarer and worth naming precisely rather than either dismissing or sensationalising:</p>
<ul>
<li><strong>Thyroid C-cell tumours.</strong> The label carries a boxed warning. Semaglutide caused thyroid C-cell tumours in rodents at clinically relevant exposures; whether this translates to humans is unknown. It is contraindicated in anyone with a personal or family history of medullary thyroid carcinoma, or with MEN 2.</li>
<li><strong>Pancreatitis.</strong> Acute pancreatitis, including fatal cases, has been reported with this drug class. In a two-year trial the rates were similar between semaglutide and placebo — 8 cases versus 10 — so the signal is not clear-cut, but it remains on the label.</li>
<li><strong>Gallbladder disease.</strong> Reported in about 1.6 per cent on the 2.4 mg dose. Rapid weight loss of any kind raises gallstone risk.</li>
<li><strong>NAION.</strong> In 2025 the EMA's safety committee concluded that non-arteritic anterior ischaemic optic neuropathy — a sudden, usually irreversible loss of vision in one eye — is a very rare side effect of semaglutide, affecting up to 1 in 10,000 users, and the WHO issued an alert. Sudden vision changes warrant contacting a doctor immediately.</li>
</ul>
<p>Put the rare risks in proportion. One in 10,000 is genuinely very rare, and the cardiovascular benefit in SELECT was measured in whole percentage points across 17,604 people. But "very rare" is not "never", and a person who cannot tolerate persistent nausea is not being weak — they are having the most common reaction to the drug.</p>

<h2>The muscle question, and why it changes what you should eat</h2>
<p>This is the part most relevant to a site about supplements, and the part most often reported badly in both directions.</p>
<p>In the STEP 1 body composition sub-study, roughly <strong>39 to 40 per cent of the weight lost was lean mass</strong>, with absolute lean mass falling around 9.7 per cent. Headlines have run with that figure alone, which is misleading — losing some lean tissue is a normal part of losing any substantial amount of weight, including through diet alone or bariatric surgery.</p>
<p>The fuller picture is that the <em>proportion</em> of lean mass to total body mass increased, and the lean-to-fat ratio improved from 1.34 at baseline to 1.57 at week 68. Body composition got better overall, even as absolute muscle fell. Both statements are true, and quoting either one alone produces a distorted article.</p>
<p>What follows practically is not controversial. If a drug is suppressing your appetite by a third, every remaining mouthful has to work harder, and protein is the macronutrient with the clearest role in defending lean tissue during weight loss. Resistance training is the other half of it — the stimulus that tells the body to keep the muscle it has.</p>
<p>This is the honest reason a supplement appears on this page at all. Not because protein powder raises GLP-1, and not because it makes the drug work better. Because a protein target that was achievable at your old appetite may not be achievable at your new one, and a shake is a cheap, unglamorous way to close the gap. Our <a href="/ingredients/whey-protein-blend">whey protein evidence page</a> sets out what protein does and does not do, and the recommendations at the foot of this article are scored reviews rather than sponsorships.</p>

<h2>Stopping: the finding nobody puts on a billboard</h2>
<p>The STEP 1 trial extension followed participants for a year after treatment ended. Having reached a mean 17.3 per cent weight loss at 68 weeks, they regained a mean of <strong>11.6 percentage points</strong> over the following 52 weeks — roughly two-thirds of everything lost. Blood pressure returned to baseline. Most lipid markers and C-reactive protein rose substantially. A small relative improvement in HbA1c persisted, and 48.2 per cent were still at least 5 per cent below their starting weight.</p>
<p>That result is not a scandal and it is not a reason to avoid the drugs. It is the expected behaviour of a treatment for a chronic, relapsing condition: blood pressure medication does not work after you stop taking it either. But it reframes the decision. The question is not "how much will I lose" but "what does the next decade look like", and that is a question about cost, access, tolerability and whether you can stay on it.</p>

<h2>"Nature's Ozempic": what the supplement aisle is selling</h2>
<p>Now the part this site exists for. The moment these drugs became famous, an entire product category attached itself to the name.</p>
<h3>Berberine</h3>
<p>The compound most often called "nature's Ozempic", largely because of TikTok. Berberine is a plant alkaloid found in goldenseal, barberry and Oregon grape. It is not a GLP-1 agonist and does not work through the GLP-1 receptor — its main described mechanism is activation of the AMPK enzyme, which is closer to how metformin behaves than to how semaglutide behaves.</p>
<p>Is there anything there? Some. Studies in people with a BMI of 25 to 29.9 taking about 1 g daily for at least eight weeks have reported reductions in weight, BMI and waist circumference. But the trials are small, the quality is limited, and as UCLA Health puts it, the amount of weight you can lose with berberine is unclear. Against a 15 to 21 per cent figure from two large randomised trials, "unclear and probably modest" is not a comparison — it is a different category.</p>
<p>It is also not risk-free. Gastrointestinal effects are common, it may potentiate diabetes medicines and cause excessive glucose lowering, it interacts with anti-rejection drugs, and it is harmful to infants.</p>
<h3>"GLP-1 support" blends</h3>
<p>The broader category is a proprietary blend with a name borrowed from a drug. We have reviewed several supplements of this general shape, and the pattern repeats: <a href="/fat-burners/slimset-review">one disclosed dose out of five</a>, <a href="/fat-burners/sodamelt-review">a twelve-ingredient proprietary blend with no amounts at all</a>. When a product cannot tell you how much of anything is in it, no discussion of mechanism is possible.</p>
<h3>What actually does raise your own GLP-1</h3>
<p>Here is the genuinely interesting part, and it is more modest than either side of the argument tends to admit.</p>
<p>Fibre does stimulate endogenous GLP-1, and the mechanism is well described: fermentable fibre reaches the colon, gut bacteria ferment it into short-chain fatty acids — acetate, propionate, butyrate — and those activate receptors on the L-cells that release GLP-1. Propionate is the most potent of the three. Protein and fat arriving in the small intestine stimulate GLP-1 release too.</p>
<p>So the mechanism is real. The magnitude is the problem. A 2026 scoping review pooled 52 studies in 1,085 participants and found the results mixed: only certain fibre types produced consistent GLP-1 rises, and — the part that matters — studies reporting increased GLP-1 showed only a non-significant tendency to also report increased satiety, with a confidence interval including the null. Raising the hormone on a blood test did not reliably translate into eating less.</p>
<p>The reasonable conclusion is that eating fibre and protein is worth doing, for many reasons including this one, and that it is not a pharmacological intervention. A drug that holds GLP-1 signalling open for a week is doing something different in kind, not merely in degree, from a bowl of oats.</p>

<h2>Compounded and online versions: the FDA has been blunt</h2>
<p>A shortage-driven grey market grew alongside these drugs, and the regulator's language about it is unusually direct.</p>
<p>The FDA states that compounded GLP-1 drugs are unapproved products that do not undergo review for safety, effectiveness or quality before marketing. As of 31 May 2026 it had received 990 adverse event reports associated with compounded semaglutide and more than 730 associated with compounded tirzepatide. A recurring cause is <strong>ten-fold dosing errors</strong> arising from confusion over syringe units — patients and sometimes clinicians measuring in the wrong scale.</p>
<p>The agency has also flagged counterfeit Ozempic that may contain the wrong ingredient, too much, too little or none; "semaglutide sodium" and "semaglutide acetate" salt forms that are different active ingredients from the approved drug with no safety data behind them; products sold with dosing instructions while labelled "for research purposes" or "not for human consumption"; and improper refrigeration in transit. It has proposed excluding semaglutide, tirzepatide and liraglutide from the bulk substances list outsourcing facilities may compound from.</p>
<p>The advice is simple and worth following: a prescription from a licensed prescriber, filled at a licensed pharmacy, and multi-dose vials discarded 28 days after first use.</p>

<h2>Access in the UK</h2>
<p>For UK readers, NHS access is real but tightly criteria-bound. NICE recommends tirzepatide for adults with a BMI of at least 35 and at least one weight-related condition, and semaglutide for a BMI of at least 30 with a weight-related condition. Thresholds are reduced by 2.5 kg/m² for people from some minority ethnic backgrounds, reflecting different risk at the same BMI.</p>
<p>Primary care prescribing of tirzepatide in England began a phased rollout on 23 June 2025, starting with the highest-need group: a BMI of at least 40 plus four of five listed weight-related conditions. The phasing is a funding and capacity decision, not a clinical one, and eligibility widens over time.</p>

<h2>So what should you actually do?</h2>
<p><strong>If you are considering a GLP-1 drug:</strong> the conversation is with a doctor, and the questions worth bringing are what the side effect profile means for your life, what happens when you stop, what it will cost over years rather than months, and whether you qualify on the NHS. Do not buy it from a website that does not require a prescription.</p>
<p><strong>If you are already taking one:</strong> the two things most within your control are protein intake and resistance training, for the lean mass reason above. Constipation affects around a quarter of users and responds to fibre, fluid and gradual dose increases — with the caveat that these drugs already slow gastric emptying, so raise fibre gradually and mention it to your prescriber. If total food intake has dropped substantially, micronutrients are worth a conversation and a blood test rather than a guess.</p>
<p><strong>If you are looking at a supplement labelled "GLP-1":</strong> read the panel. If it does not tell you how much of each ingredient is in it, there is no discussion to have. If it does, the honest ceiling on what any of it can do is modest, and nothing in that aisle is comparable to a drug that produced 15 to 21 per cent weight loss in randomised trials.</p>
<p>The products listed below are on this page for the second group, not the first. None of them raises GLP-1 to any meaningful degree and none is a substitute for a prescription. They are here because they address what the drugs actually do to your muscle and your nutrient intake — and because each has been scored on this site against the same five criteria as everything else.</p>
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
