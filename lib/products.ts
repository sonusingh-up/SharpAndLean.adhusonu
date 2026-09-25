import type { Collection } from './types';
import { articles } from './articles';
import { toReview } from './articles/to-review';
import { getInShapeMen } from './editorials/get-in-shape-men';
import { getInShapeWomen } from './editorials/get-in-shape-women';

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
  getInShapeWomen,
  getInShapeMen,
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
<thead><tr><td></td><th>ON Gold Standard 100% Whey</th><th>Myprotein Impact Whey</th></tr></thead>
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
    published_at: '2026-09-22T00:00:00Z',
    updated_at: '2026-09-25T00:00:00Z',
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
    references: [
      {
        id: 'step1',
        text: 'Wilding JPH et al. (2021). Once-weekly semaglutide in adults with overweight or obesity. STEP 1 — mean weight reduction of about 15 per cent over 68 weeks, and the body composition sub-study behind the lean mass figures.',
        url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa2032183',
      },
      {
        id: 'step1-extension',
        text: 'Wilding JPH et al. (2022). Weight regain and cardiometabolic effects after withdrawal of semaglutide: the STEP 1 trial extension. Diabetes, Obesity and Metabolism — a mean 11.6 percentage points regained over 52 weeks off treatment.',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9542252/',
      },
      {
        id: 'surmount1',
        text: 'Jastreboff AM et al. (2022). Tirzepatide once weekly for the treatment of obesity. SURMOUNT-1 — 20.9 per cent mean weight reduction on 15 mg at 72 weeks.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/35658024/',
      },
      {
        id: 'surmount5',
        text: 'Aronne LJ et al. (2025). Tirzepatide as compared with semaglutide for the treatment of obesity. SURMOUNT-5 — head-to-head at maximum tolerated dose over 72 weeks.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/40353578/',
      },
      {
        id: 'select',
        text: 'Lincoff AM et al. (2023). Semaglutide and cardiovascular outcomes in obesity without diabetes. SELECT — 17,604 participants, major adverse cardiovascular events 6.5 per cent against 8.0 per cent on placebo.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/37952131/',
      },
      {
        id: 'wegovy-label',
        text: 'US Food and Drug Administration. WEGOVY (semaglutide) injection prescribing information — the boxed warning on thyroid C-cell tumours, the contraindications, and the adverse reaction rates quoted on this page.',
        url: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2025/215256s024lbl.pdf',
      },
      {
        id: 'who-naion',
        text: 'World Health Organization (27 June 2025). The use of semaglutide medicines and risk of non-arteritic anterior ischemic optic neuropathy (NAION) — the EMA PRAC conclusion that NAION is a very rare side effect, up to 1 in 10,000 users.',
        url: 'https://www.who.int/news/item/27-06-2025-27-06-2025-semaglutide-medicines-naion',
      },
      {
        id: 'fda-unapproved',
        text: 'US Food and Drug Administration. FDA’s concerns with unapproved GLP-1 drugs used for weight loss — dosing errors, salt forms, counterfeits, research-use-only labelling, and the advice to use a licensed prescriber and pharmacy.',
        url: 'https://www.fda.gov/drugs/drug-alerts-and-statements/fdas-concerns-unapproved-glp-1-drugs-used-weight-loss',
      },
      {
        id: 'lean-mass-review',
        text: 'Neeland IJ et al. (2024). Changes in lean body mass with glucagon-like peptide-1-based therapies and mitigation strategies. Diabetes, Obesity and Metabolism — context for the proportion of weight lost as lean tissue and what protein and resistance training do about it.',
        url: 'https://dom-pubs.onlinelibrary.wiley.com/doi/10.1111/dom.15728',
      },
      {
        id: 'fibre-glp1',
        text: 'Dietary fibers to boost endogenous GLP-1 secretion and satiety: a scoping review (2026). Frontiers in Endocrinology — 52 studies, 1,085 participants; GLP-1 rises showed only a non-significant tendency toward increased satiety.',
        url: 'https://www.frontiersin.org/journals/endocrinology/articles/10.3389/fendo.2026.1880500/full',
      },
      {
        id: 'amarasate',
        text: 'Amarasate — overview of the bitter hops extract and its published human trials, including the 24-week C4 trial of 150 adults reported in Obesity Pillars in July 2026. We were unable to open the paper itself; the trial figures here come from the institute and trade reporting of it.',
        url: 'https://en.wikipedia.org/wiki/Amarasate',
      },
      {
        id: 'pendulum-trial',
        text: 'Perraudeau F et al. Improvements to postprandial glucose control in subjects with type 2 diabetes: a multicenter, double-blind, randomized trial of a novel probiotic formulation. BMJ Open Diabetes Research & Care — the human trial behind Pendulum, with glycaemic rather than weight endpoints.',
        url: 'https://drc.bmj.com/content/8/1/e001319',
      },
      {
        id: 'schwitzer-pendulum',
        text: 'Schwitzer G. Analysis of celebrity-endorsed GLP-1 probiotic marketing — notes that the company’s GLP-1 claims rest on preclinical studies rather than studies in people.',
        url: 'https://garyschwitzer.substack.com/p/the-one-supplement-halle-berry-swears',
      },
      {
        id: 'ucla-berberine',
        text: 'UCLA Health. What to know about berberine, the so-called “nature’s Ozempic” — the AMPK mechanism, the limited trial evidence, and the drug interactions.',
        url: 'https://www.uclahealth.org/news/article/what-know-about-berberine-so-called-natures-ozempic',
      },
      {
        id: 'nice-ta1026',
        text: 'National Institute for Health and Care Excellence. Tirzepatide for managing overweight and obesity (TA1026) — the BMI thresholds and phased NHS rollout cited in the access section.',
        url: 'https://www.nice.org.uk/guidance/ta1026',
      },
    ],
    history: [
      {
        date: '2026-09-25',
        note: 'Added Lemme to the supplement section. The Pendulum GLP-1 Probiotic and Supergut cards now link to full reviews, and the Pendulum card points to the GLP-1 Probiotic listing rather than the single-strain Akkermansia product it previously linked to. Supergut’s product is now named GLP-1 Daily Support. Linked the new ranking of GLP-1 supplements and the guide to natural GLP-1 alternatives.',
      },
      {
        date: '2026-09-25',
        note: 'Pendulum’s BMJ Open Diabetes Research & Care trial is now quoted from its abstract — 76 participants, a primary outcome at p = 0.0500, HbA1c 0.6 points lower — rather than the 33 per cent figure from press coverage, matching our Pendulum Akkermansia review.',
      },
      {
        date: '2026-09-23',
        note: 'Rewritten for an international readership and re-researched from primary sources. The earlier draft treated the UK as the default and recommended protein and vitamin D; access by country is now one section among several, and the product block carries supplements actually marketed for GLP-1. Added a contents sidebar, a to-scale figure comparing the trial results, and the full source list below.',
      },
      {
        date: '2026-09-23',
        note: 'Corrected an overstatement in the first draft. It said nothing sold as a supplement comes close to the drugs, which is too absolute: Amarasate has randomised human trials measuring appetite hormones and weight, reporting 3.77 kg against 0.40 kg on placebo over 24 weeks. The page now reports that alongside its limitations — small earlier trials, a manufacturer-linked research programme, and an effect roughly a quarter the size of the drugs.',
      },
      {
        date: '2026-09-22',
        note: 'First published.',
      },
    ],
    recommendations: [
      {
        name: 'Calocurb (Amarasate bitter hops extract)',
        brand: 'Calocurb',
        evidence: 'Randomised human trials, manufacturer-linked',
        note: 'The only product in this category with randomised controlled human evidence measuring both appetite hormones and weight. Amarasate is a bitter hops extract in an enteric-coated capsule, designed to reach the small intestine and trigger bitter taste receptors that release GLP-1, CCK and PYY. In a 24-week double-blind placebo-controlled trial of 150 adults with a BMI of 25 to 35, reported in Obesity Pillars in July 2026, participants lost 3.77 kg against 0.40 kg on placebo, with lean mass preserved. Read that with two caveats: the earlier trials were small (19 to 30 people) and the research programme originates with the New Zealand institute that developed and licenses the extract. It is also roughly a quarter of what the drugs achieve.',
        url: 'https://sharpandlean.com/recommended/calocurb',
        image: 'https://m.media-amazon.com/images/I/71xeuKkRK1L._AC_SX569_.jpg',
        reviewSlug: 'fat-burners/calocurb-review',
      },
      {
        name: 'GLP-1 Probiotic (Akkermansia muciniphila)',
        brand: 'Pendulum',
        evidence: 'Human trial for blood glucose; GLP-1 claim preclinical',
        note: 'The best-known probiotic sold for GLP-1, built on Akkermansia muciniphila plus butyrate-producing strains — the idea being that butyrate stimulates L-cells to release GLP-1. Pendulum does have a published human trial in BMJ Open Diabetes Research & Care, but its endpoints were glycaemic: in 76 people with type 2 diabetes over 12 weeks, post-meal glucose improved against placebo at p = 0.0500 — exactly on the conventional threshold — with HbA1c 0.6 points lower. That is a real, if marginal, result for a real outcome. It is not weight loss, and Pendulum’s own footnotes say the GLP-1 claims rest on preclinical studies and that the product is not intended for weight loss.',
        url: 'https://www.amazon.com/dp/B0CY3VZDYP',
        image: 'https://m.media-amazon.com/images/I/61X-PbaZxpL._AC_SL1500_.jpg',
        reviewSlug: 'fat-burners/pendulum-glp-1-probiotic-review',
      },
      {
        name: 'GLP-1 Daily Support (formerly GLP-1 Booster) prebiotic fibre blend',
        brand: 'Supergut',
        evidence: 'Mechanism established; effect on appetite inconsistent',
        note: 'A prebiotic fibre drink built on resistant starch and other fermentable fibres, with 6 g of fibre a scoop. The mechanism is genuinely well documented: fermentable fibre reaches the colon, gut bacteria convert it to short-chain fatty acids, and those activate receptors on L-cells that release GLP-1. The problem is magnitude. A 2026 scoping review pooling 52 studies in 1,085 participants found only some fibre types raised GLP-1 consistently, and studies showing a GLP-1 rise had only a non-significant tendency to also report increased satiety. Worth eating as fibre. Not a drug, and priced well above plain psyllium.',
        url: 'https://www.amazon.com/dp/B0DRWLTRHB',
        image: 'https://m.media-amazon.com/images/I/71cTbhrU5tL._AC_UL320_.jpg',
        reviewSlug: 'fat-burners/supergut-glp-1-booster-review',
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
<h3>The citrus-and-saffron capsule: Lemme</h3>
<p>The best-known product in the category, Lemme GLP-1 Daily — now sold as Lemme Reset — combines three extracts, each at the dose used in its own trial. Its GLP-1 ingredient, Eriomin lemon extract, raised GLP-1 by about 15 per cent in people with prediabetes; the same trial found no change in weight or BMI. The weight evidence comes instead from its blood-orange extract, Morosil. Our <a href="/fat-burners/lemme-glp-1-daily-review">full review</a> goes through all three.</p>
<h3>The probiotics: a real trial, for a different outcome</h3>
<p>Products built on <em>Akkermansia muciniphila</em> and butyrate-producing strains are the second-biggest segment. The logic is sound: butyrate stimulates L-cells to release GLP-1.</p>
<p>Pendulum, the best-known, does have a published human trial in <em>BMJ Open Diabetes Research & Care</em> — in 76 people with type 2 diabetes over 12 weeks, post-meal glucose improved against placebo at p = 0.0500, exactly on the conventional threshold, with HbA1c 0.6 points lower. That is a real, if marginal, result. It is also a glycaemic result, not a weight-loss one. The health journalism watchdog Gary Schwitzer has specifically noted that the company's GLP-1 claims rest on preclinical studies rather than studies in people — a distinction the marketing does not make.</p>
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
<p><strong>If you want to try without a prescription:</strong> the free habits come first — our guide to <a href="/learn/natural-glp-1-alternatives">natural GLP-1 alternatives</a> ranks food, protein, eating order and pace alongside the supplements.</p>
<p><strong>If you are looking at a supplement:</strong> read the panel first. If it will not tell you how much of each ingredient it contains, stop there. If it will, then ask what human evidence exists for that specific ingredient at that specific amount — and note that "clinically studied" frequently refers to a trial at a different dose, in a different population, or measuring something other than weight.</p>
<p>The products below are the best-known things sold in this category. They are listed because people are buying them and deserve an accurate account of what is behind each one, not because any of them replaces a prescription. Each has now been reviewed and scored in full, and each card links to its review. Our <a href="/best/glp-1-supplements-for-weight-loss">ranking of every GLP-1 supplement we have reviewed</a> puts them side by side.</p>
`,
  },
  {
    id: 'best-glp-1-supplements',
    kind: 'best_lists' as const,
    title: 'The best GLP-1 supplements for weight loss in 2026, ranked',
    slug: 'glp-1-supplements-for-weight-loss',
    published_at: '2026-09-25T00:00:00Z',
    updated_at: '2026-09-25T00:00:00Z',
    seo_title: 'Best GLP-1 Supplements 2026: 5 Ranked by the Evidence',
    seo_desc:
      'Five GLP-1 supplements reviewed in full and ranked. One has weight trials on its own extract, one has honest doses, and three we would not buy to lose weight.',
    summary:
      'Every GLP-1 supplement we have reviewed in full, ranked by the same five criteria as our reviews. One has randomised trials measuring both GLP-1 and weight on its own extract — and even that one does roughly a quarter of what the drugs do.',
    verdict:
      'Our pick is Calocurb, the only one with weight-loss trials of the extract itself: 3.77 kg against 0.40 kg on placebo over 24 weeks. Lemme Reset is a distant but defensible second. The other three are ranked for completeness — we would not buy any of them to lose weight.',
    takeaways: [
      'Calocurb (6.6/10) is the only GLP-1 supplement we have found with randomised trials of its own extract measuring the hormones and, separately, the weight: 3.77 kg against 0.40 kg on placebo over 24 weeks.',
      'Lemme Reset, formerly GLP-1 Daily (6.2/10), has the best-dosed label in the aisle — but the ingredient behind its GLP-1 claim did not change weight in its own trial.',
      'Pendulum Akkermansia (4.0), Supergut GLP-1 Daily Support (3.8) and Pendulum GLP-1 Probiotic (3.2) rest on preclinical work, a different product’s trial, or a customer survey.',
      'The best supplement result is about 4 per cent of body weight. Semaglutide produced about 15 per cent and tirzepatide 20.9 per cent in their trials.',
      'At the directed doses these cost about $1.50 to $4.00 a day. Plain fibre does part of the same job for well under a dollar.',
    ],
    items: [
      {
        review_id: reviewId('calocurb-review'),
        rank: 1,
        why_it_made_the_list:
          'Best evidenced, by a distance. The only product here with randomised human trials of its own extract measuring GLP-1, CCK and PYY and, separately, weight — 3.77 kg against 0.40 kg on placebo over 24 weeks — at exactly the dose on the label. The catch is price: about $4 a day at the label’s target dose, because a “one month” bottle lasts 22 days.',
      },
      {
        review_id: reviewId('lemme-glp-1-daily-review'),
        rank: 2,
        why_it_made_the_list:
          'Best-dosed label. Three extracts, each at the amount used in its own trial, on a panel you can read. But the lemon extract that raised GLP-1 did not change weight in its trial, the combination has never been tested, and class actions challenge the GLP-1 marketing. The blood-orange extract did the most: 4.2 per cent weight loss against 2.2 per cent on placebo over six months, alongside diet and exercise.',
      },
      {
        review_id: reviewId('pendulum-akkermansia-review'),
        rank: 3,
        why_it_made_the_list:
          'Honest label, wrong job. A clean single-strain panel from the company that pioneered live Akkermansia, at about a hundredth of the studied dose. The carton says it increases GLP-1 production; the one human trial that measured GLP-1 found no significant change. Buy it for gut health if at all, not for weight.',
      },
      {
        review_id: reviewId('supergut-glp-1-booster-review'),
        rank: 4,
        why_it_made_the_list:
          'Decent fibre, borrowed claim. A low-FODMAP resistant-starch powder with a real mechanism, and a company trial that lowered HbA1c — of a meal-replacement shake, in type 2 diabetes. A scoop holds 6 g of fibre; the weight research on resistant starch used 40 g a day. The brand’s own non-GLP-1 fibre costs $10 less a tub.',
      },
      {
        review_id: reviewId('pendulum-glp-1-probiotic-review'),
        rank: 5,
        why_it_made_the_list:
          'Preclinical, by its own label. Pendulum footnotes its GLP-1 claims as based on preclinical studies and says the product is not intended for weight loss. The cravings figures come from an uncontrolled survey of 274 customers, and a comparable Akkermansia product costs about a ninth as much.',
      },
    ],
    faqs: [
      {
        question: 'What is the best GLP-1 supplement?',
        answer:
          'Of the five we have reviewed in full, Calocurb. It is the only one with randomised human trials of its own extract that measured both appetite hormones including GLP-1 and, in a 24-week trial of 150 adults, weight: 3.77 kg lost against 0.40 kg on placebo. It is also the most expensive, at about $4 a day at the label’s target dose.',
      },
      {
        question: 'Do GLP-1 supplements actually work?',
        answer:
          'A few have modest evidence; most have very little. The best result we have found is about 4 per cent of body weight over six months. Several products raise GLP-1 in a trial or in theory without any measured effect on weight, and some rest on animal studies or customer surveys. None contains GLP-1 or acts like the prescription drugs.',
      },
      {
        question: 'Are GLP-1 supplements as good as Ozempic or Wegovy?',
        answer:
          'No. Semaglutide, sold as Ozempic and Wegovy, produced about 15 per cent weight loss over 68 weeks in STEP 1, and tirzepatide 20.9 per cent over 72 weeks in SURMOUNT-1. The best supplement result is roughly a quarter of that. The drugs keep GLP-1 signalling active for a week; a supplement can at most nudge your own hormone, which lasts about two minutes.',
      },
      {
        question: 'Is Lemme GLP-1 Daily worth it?',
        answer:
          'It has the best-dosed label of the products we ranked, and its blood-orange extract has a six-month trial behind it. But its GLP-1 ingredient did not change weight in its own trial, the product itself has never been tested, and it faces class actions over its GLP-1 marketing. At about $2 to $2.70 a day, we rank it a distant second.',
      },
      {
        question: 'Are GLP-1 supplements safe?',
        answer:
          'The five we ranked are generally well tolerated; the common effects are digestive, especially while starting fibre or probiotics. Two lower blood glucose in trials, so people on diabetes medicines should check with their prescriber. Supplements are not approved by the FDA for safety or effectiveness before sale, and anyone pregnant should ask first.',
      },
      {
        question: 'Is berberine a GLP-1 supplement?',
        answer:
          'Not really. Berberine is often called nature’s Ozempic, but it acts mainly through the AMPK enzyme, closer to metformin than to semaglutide, and does not act on the GLP-1 receptor. Small trials report modest weight changes. It interacts with diabetes medicines and some other drugs. We have not reviewed a berberine product, so it is not ranked here.',
      },
      {
        question: 'How much do GLP-1 supplements cost?',
        answer:
          'At the directed doses and prices checked on 25 September 2026: Calocurb about $4.00 a day, Pendulum GLP-1 Probiotic $2.97 bought once, Pendulum Akkermansia $2.83, Lemme Reset $2.67 and Supergut $1.50 to $3.00 depending on one or two scoops. Subscriptions cut most of these by 15 to 35 per cent.',
      },
    ],
    references: [
      {
        id: 'best-glp1-amarasate',
        text: 'Amarasate — overview of the bitter hops extract sold as Calocurb and its published human trials, including the 24-week C4 trial of 150 adults reported in Obesity Pillars in July 2026. We were unable to open that paper; its figures come from the institute and trade reporting of it.',
        url: 'https://en.wikipedia.org/wiki/Amarasate',
      },
      {
        id: 'best-glp1-walker',
        text: 'Walker EG et al. (2022). An extract of hops modulates gut peptide hormone secretion and reduces energy intake in healthy weight men: a randomised, cross-over clinical trial. American Journal of Clinical Nutrition 115(3):925-940.',
        url: 'https://www.medrxiv.org/content/10.1101/2021.06.25.21259514v2.full',
      },
      {
        id: 'best-glp1-eriomin',
        text: 'Ribeiro CB et al. (2019). Effectiveness of Eriomin in managing hyperglycemia and reversal of prediabetes condition. Phytotherapy Research 33(7):1921-1933 — GLP-1 +15 per cent; no effect on anthropometric variables.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/31183921/',
      },
      {
        id: 'best-glp1-morosil',
        text: 'Briskey D, Malfa GA, Rao A (2022). Effectiveness of “Moro” blood orange standardized extract on weight loss in overweight but otherwise healthy men and women. Nutrients 14(3):427 — 4.2 against 2.2 per cent over six months; 98 of 180 completed.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/35276783/',
      },
      {
        id: 'best-glp1-depommier',
        text: 'Depommier C et al. (2019). Supplementation with Akkermansia muciniphila in overweight and obese human volunteers. Nature Medicine 25:1096-1103 — 10^10 bacteria daily; plasma GLP-1 did not change significantly.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/31263284/',
      },
      {
        id: 'best-glp1-frias',
        text: 'Frias JP et al. (2023). A microbiome-targeting fibre-enriched nutritional formula improves quality of life and haemoglobin A1c in type 2 diabetes. Diabetes, Obesity and Metabolism 25(5):1203-1212 — the Supergut shake trial.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/36594522/',
      },
      {
        id: 'best-glp1-li',
        text: 'Li H et al. (2024). Resistant starch intake facilitates weight loss in humans by reshaping the gut microbiota. Nature Metabolism 6(3):578-597 — 40 g a day, 2.8 kg over eight weeks.',
        url: 'https://www.nature.com/articles/s42255-024-00988-y',
      },
      {
        id: 'best-glp1-fibre-review',
        text: 'Dietary fibers to boost endogenous GLP-1 secretion and satiety: a scoping review (2026). Frontiers in Endocrinology — 52 studies, 1,085 participants; GLP-1 rises showed only a non-significant tendency toward increased satiety.',
        url: 'https://www.frontiersin.org/journals/endocrinology/articles/10.3389/fendo.2026.1880500/full',
      },
      {
        id: 'best-glp1-step1',
        text: 'Wilding JPH et al. (2021). Once-weekly semaglutide in adults with overweight or obesity. STEP 1 — about 15 per cent mean weight loss over 68 weeks.',
        url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa2032183',
      },
      {
        id: 'best-glp1-surmount1',
        text: 'Jastreboff AM et al. (2022). Tirzepatide once weekly for the treatment of obesity. SURMOUNT-1 — 20.9 per cent mean weight loss on 15 mg at 72 weeks.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/35658024/',
      },
      {
        id: 'best-glp1-berberine',
        text: 'UCLA Health. What to know about berberine, the so-called “nature’s Ozempic” — the AMPK mechanism, the limited trial evidence and the drug interactions.',
        url: 'https://www.uclahealth.org/news/article/what-know-about-berberine-so-called-natures-ozempic',
      },
      {
        id: 'best-glp1-fda',
        text: 'US Food and Drug Administration. Questions and answers on dietary supplements — supplements are not approved by the FDA for safety or effectiveness before sale.',
        url: 'https://www.fda.gov/food/information-consumers-using-dietary-supplements/questions-and-answers-dietary-supplements',
      },
    ],
    history: [
      {
        date: '2026-09-25',
        note: 'First published, ranking the five GLP-1 supplements reviewed in full on this site by their published scores. Full reviews of Lemme Reset, Supergut GLP-1 Daily Support and Pendulum GLP-1 Probiotic were written for this ranking rather than listing them unreviewed. Prices checked on this date.',
      },
    ],
    body: `
<h2>The short answer</h2>
<p>If you want one GLP-1 supplement with real evidence behind it, it is <a href="/fat-burners/calocurb-review">Calocurb</a>. Its bitter hops extract has been tested in randomised human trials that measured the gut hormones it claims to release and, separately, the weight people lost — at exactly the dose on the label. It is expensive, and its effect is modest. It is also the only product in this aisle where the GLP-1 claim and the weight claim come from trials of the same extract.</p>
<p>If you want a cheaper, well-dosed appetite formula and can accept that its GLP-1 claim is the weakest part of it, <a href="/fat-burners/lemme-glp-1-daily-review">Lemme Reset</a> is a defensible second. We would not buy the other three to lose weight, and their own small print increasingly says the same.</p>
<p>Keep the scale in mind. The best supplement result here — 3.77 kg over 24 weeks — is about 4 per cent of body weight. Semaglutide produced about 15 per cent in STEP 1 and tirzepatide 20.9 per cent in SURMOUNT-1. Our <a href="/learn/glp-1">GLP-1 explainer</a> charts the difference to scale. No supplement is a substitute for those drugs.</p>

<h2>How we ranked them</h2>
<p>Every product here has a full review on this site, scored against the same <a href="/evidence-grading">five published criteria</a>: evidence for the marketed claim, dose against the studied amount, label transparency, value against the generic equivalent, and safety. The ranking is simply the score. Nothing was re-scored for this page.</p>
<p>We only rank products we have reviewed in full. Three of the five were reviewed specifically for this page, because a list that ranks products nobody has examined is a list of guesses. Products we have not reviewed — including berberine and the many unbranded capsules titled "GLP-1 supplement" — are discussed below but not ranked.</p>
<p>These are desk reviews: we read the labels, the retailer listings and the trials, and nobody here took the products. Prices were checked on 25 September 2026. Where a product has a commercial link, we may earn a commission. The scores were set in the reviews, and the second-ranked product has no commercial link at all.</p>

<h2>What "GLP-1 supplement" means on a label</h2>
<p>None of these products contains GLP-1, and none acts like the drugs. Your own GLP-1 is released by the gut after eating and broken down within about two minutes; semaglutide is engineered to last a week. A supplement can at most encourage your gut to release a little more of its own hormone.</p>
<p>The products here try to do that in three ways. Calocurb uses bitter compounds that trigger receptors in the small intestine. Lemme uses a lemon flavonoid that raised GLP-1 in a trial. Supergut and Pendulum use fibre and bacteria that feed the short-chain fatty acid pathway. The question for each is the same: in people, at the dose on the label, does anything measurable happen to appetite or weight?</p>

<h2>1. Calocurb: the one with the evidence</h2>
<p>Calocurb's active is Amarasate, a New Zealand hops extract in a delayed-release capsule. A crossover trial in the <em>American Journal of Clinical Nutrition</em> found it raised GLP-1, CCK and PYY and cut how much people ate at the next meal. A 24-week trial of 150 adults, reported in 2026, found 3.77 kg of weight loss against 0.40 kg on placebo. The four-capsule daily dose on the label is the dose in the trials.</p>
<p>The caveats are real. The research comes from the institute that developed and licenses the extract, the early trials were small, and we could not open the 24-week paper itself. And the price is steep: at the label's target dose the "one month" bottle lasts 22 days, which puts it at about $4 a day. Our <a href="/fat-burners/calocurb-review">full review</a> scores it 6.6 out of 10.</p>

<h2>2. Lemme Reset: the right doses, the wrong mechanism</h2>
<p>Lemme's product, launched as GLP-1 Daily and now sold as Lemme Reset, is the best-known name in the category and the best-dosed label: Eriomin lemon extract, Supresa saffron and Morosil blood orange, each at the amount used in its own trial.</p>
<p>The trouble is the ingredient in the name. Eriomin raised GLP-1 by about 15 per cent in people with prediabetes, and the same trial found no change in weight or BMI. The weight evidence comes from Morosil — 4.2 per cent against 2.2 per cent on placebo over six months, with dieting and exercise, in a trial where only 98 of 180 finished. The combination has never been tested, and class actions filed in 2025 and 2026 challenge the GLP-1 marketing. Our <a href="/fat-burners/lemme-glp-1-daily-review">full review</a> scores it 6.2.</p>

<h2>3 to 5: three we would not buy to lose weight</h2>
<p><strong><a href="/wellness/pendulum-akkermansia-review">Pendulum Akkermansia</a> (4.0)</strong> is an honestly labelled single-strain probiotic whose carton says it increases GLP-1 production. The one randomised human trial that measured GLP-1 after <em>Akkermansia</em> found no significant change, using a hundred times the amount in this capsule.</p>
<p><strong><a href="/fat-burners/supergut-glp-1-booster-review">Supergut GLP-1 Daily Support</a> (3.8)</strong>, formerly GLP-1 Booster, is a pleasant, low-FODMAP resistant-starch fibre with a real mechanism behind it. The company's trial tested a meal-replacement shake in type 2 diabetes and reported blood sugar, and the resistant-starch weight trial used 40 g a day against the 6 g of mixed fibre in a scoop.</p>
<p><strong><a href="/fat-burners/pendulum-glp-1-probiotic-review">Pendulum GLP-1 Probiotic</a> (3.2)</strong> is footnoted by Pendulum itself: the GLP-1 claims are based on preclinical studies, and the product is not intended for weight loss. The cravings figures come from an uncontrolled survey of 274 customers.</p>
<p>All three may have a place — as a probiotic, as a fibre — for someone who wants those things. None earns its GLP-1 label.</p>

<h2>What we left out, and why</h2>
<p><strong>Berberine</strong> is the most common "nature's Ozempic" on social media. It acts mainly through the AMPK enzyme, closer to metformin than to semaglutide, and does not act on the GLP-1 receptor. Small trials report modest weight changes, and it interacts with diabetes medicines and other drugs. We have not reviewed a berberine product, so it is not ranked.</p>
<p><strong>Unbranded "GLP-1" capsules</strong> now fill marketplace search results. Many use proprietary blends that do not state how much of anything is inside. Where a label will not give amounts, no assessment is possible — we have reviewed products of that shape, with <a href="/fat-burners/slimset-review">one disclosed dose out of five</a> and <a href="/fat-burners/sodamelt-review">none at all</a>.</p>
<p><strong>Prescription GLP-1 drugs</strong> are not supplements and are not ranked here. If you are considering them through an online service, our <a href="/fat-burners/medvi-weight-loss-review">Medvi review</a> covers what to check, including the difference between compounded and FDA-approved versions and what the approved drugs now cost bought direct.</p>

<h2>The cheaper route to try first</h2>
<p>Much of what these products offer — a little more fullness, steadier eating, better digestion — is what plain fibre does, for a fraction of the price. <a href="/fat-burners/now-glucomannan-575-mg">NOW Glucomannan</a> costs 45 to 90 cents a day and has better evidence for cholesterol than for weight. <a href="/fat-burners/now-psyllium-husk-powder">Plain psyllium powder</a> is cheaper still and well evidenced for regularity.</p>
<p>Neither is a GLP-1 product, and neither will match the drugs. But if the realistic goal is a modest nudge to appetite alongside diet and exercise, start there before paying $2 to $4 a day for a label. Our guide to <a href="/learn/natural-glp-1-alternatives">natural GLP-1 alternatives</a> ranks the free habits — food, protein, eating order and pace — alongside the supplements.</p>

<h2>How to judge any GLP-1 supplement yourself</h2>
<ul>
<li><strong>Is there a trial of the product, or only of its ingredients?</strong> "Clinically studied ingredients" usually means the second.</li>
<li><strong>Did the trial measure weight, or only GLP-1 or blood sugar?</strong> A hormone rising on a blood test is not the same as losing weight.</li>
<li><strong>Is the dose on the label the dose in the trial?</strong> Check the panel, and look for a proprietary blend that hides the amounts.</li>
<li><strong>Who ran it, and in whom?</strong> Supplier-funded trials in people with diabetes or prediabetes tell you less about a healthy buyer.</li>
<li><strong>What does the small print say?</strong> "Based on preclinical studies" and "not intended for weight loss" are answers, not disclaimers.</li>
<li><strong>What does a day cost at the directed dose?</strong> Divide the price by days of supply, not by the serving count on the front.</li>
</ul>
`,
  },
  {
    id: 'natural-glp-1-alternatives',
    kind: 'articles' as const,
    title: 'The best natural GLP-1 alternatives, ranked by what actually works',
    slug: 'natural-glp-1-alternatives',
    published_at: '2026-09-25T00:00:00Z',
    updated_at: '2026-09-25T00:00:00Z',
    seo_title: 'Best Natural GLP-1 Alternatives (2026): Ranked by Evidence',
    seo_desc:
      'There is no natural Ozempic, but some foods, habits and a few supplements do raise GLP-1 or curb appetite. Eight options ranked by trial evidence, from free to $4 a day.',
    summary:
      'There is no natural Ozempic. But some foods, eating habits and a few supplements measurably raise your own GLP-1 or make you eat less — and the best of them cost nothing. Eight options, ranked by what the trials show, with the numbers kept honest.',
    verdict:
      'Start with the free habits: eating mostly unprocessed food cut intake by about 500 kcal a day in a controlled trial, and putting protein first has 24 trials behind it. If you want a supplement, Amarasate (Calocurb) is the only natural extract with weight-loss trials, and viscous fibre is the cheap runner-up. None of it comes close to the drugs.',
    takeaways: [
      'Nothing natural works like semaglutide or tirzepatide, which produced about 15 and 21 per cent weight loss in their trials. Natural options work in single kilograms.',
      'The strongest evidence is free: people ate about 500 kcal a day less on an unprocessed diet than on an ultra-processed one, in a controlled inpatient trial.',
      'Protein at meals raises GLP-1, improves fullness and protects muscle; 24 trials found slightly more fat loss on higher-protein diets.',
      'Eating carbohydrate last raised GLP-1 by about 38 per cent, and eating a meal over 30 minutes rather than 5 raised it by about 41 per cent — both in small, short studies.',
      'Among supplements, only Amarasate has weight-loss trials on the extract itself. Viscous fibre is cheaper and modest; berberine is not a GLP-1 agonist; the apple cider vinegar trial was retracted.',
    ],
    productsIntro: {
      label: 'If you want it in a tub',
      heading: 'The products we have reviewed for these.',
      text: 'Each has a full review on this site, with its score and what its label actually contains. They come after the free habits above for a reason, and none is a substitute for a prescribed medicine.',
    },
    items: [
      {
        review_id: reviewId('myprotein-impact-whey-review'),
        rank: 1,
        why_it_made_the_list:
          'For the protein-first habit. The cheapest defensible whey we have reviewed, at about £1.10 a serving in the UK — but any plain whey does the same job. The diet trials worked through total protein, not a brand, and the pre-meal whey study used a large 50 g dose.',
      },
      {
        review_id: reviewId('now-glucomannan-575-mg'),
        rank: 2,
        why_it_made_the_list:
          'Viscous fibre in capsules, fully labelled, at 45 to 90 cents a day. Take it with a full glass of water before meals, as the EU-authorised claim specifies. Expect a small effect at most: a 2014 analysis of eight trials found no significant weight difference.',
      },
      {
        review_id: reviewId('now-psyllium-husk-powder'),
        rank: 3,
        why_it_made_the_list:
          'The cheapest way to test viscous fibre: plain powder, with 7 g of fibre in a 9 g serving. Weight results are mixed; the more favourable 2023 analysis found about 2.1 kg over nearly five months at around 10.8 g a day.',
      },
      {
        review_id: reviewId('calocurb-review'),
        rank: 4,
        why_it_made_the_list:
          'The only natural extract with trials measuring GLP-1 and weight on the extract itself: 3.77 kg against 0.40 kg on placebo over 24 weeks. At about $4 a day it is the most expensive option here, which is why it sits after the free habits.',
      },
    ],
    faqs: [
      {
        question: 'What is the best natural alternative to Ozempic?',
        answer:
          'Nothing natural does what Ozempic does. The best-evidenced natural approach is eating mostly unprocessed food, which cut intake by about 500 kcal a day in a controlled trial, followed by putting protein at every meal. If you want a supplement, Amarasate (sold as Calocurb) is the only natural extract with weight-loss trials, at about 3.4 kg more than placebo over 24 weeks.',
      },
      {
        question: 'What foods increase GLP-1 naturally?',
        answer:
          'Protein raises GLP-1 after a meal, and whey taken before a meal raised it sharply in a small trial. Fermentable fibre — legumes, oats, green bananas, cooked-and-cooled starches — feeds gut bacteria that stimulate GLP-1. How you eat matters too: eating carbohydrate last and eating more slowly both raised GLP-1 in controlled studies.',
      },
      {
        question: 'Is there a natural supplement that works like a GLP-1 drug?',
        answer:
          'No. Supplements can at most nudge your own GLP-1, which the body breaks down in about two minutes; the drugs keep the signal active for a week. The best supplement result we have found is about 4 per cent of body weight over six months, against about 15 per cent for semaglutide in STEP 1.',
      },
      {
        question: 'Is berberine a natural GLP-1?',
        answer:
          'No. Berberine acts mainly through the AMPK enzyme, closer to metformin, and does not act on the GLP-1 receptor. A 2026 meta-analysis of 23 trials found a weight difference of just under 1 kg, and the authors flagged weak blinding and reporting. It also interacts with diabetes medicines and other drugs.',
      },
      {
        question: 'Does apple cider vinegar help weight loss?',
        answer:
          'The trial that made the claim famous — 120 young people in Lebanon, reporting 6 to 8 kg lost — was retracted in September 2025 after the journal found its analyses could not be replicated and its data showed patterns inconsistent with random allocation. There is no good evidence left behind it.',
      },
      {
        question: 'Can natural approaches stop weight coming back after a GLP-1 drug?',
        answer:
          'None has been shown to. When people stopped semaglutide in the STEP 1 extension, they regained about two-thirds of their lost weight within a year. The habits here — unprocessed food, protein, fibre — are sensible to build while on treatment, and protein with resistance training helps protect muscle, but they are not a proven substitute for staying on it.',
      },
      {
        question: 'Are GLP-1 supplements natural alternatives?',
        answer:
          'Most are plant or bacterial products, so in that sense yes, but most do not do what their labels imply. Our ranking of the five GLP-1 supplements we have reviewed in full found one with real weight-loss trials, one well-dosed formula whose GLP-1 ingredient did not change weight, and three we would not buy to lose weight.',
      },
    ],
    references: [
      {
        id: 'nat-hall-2019',
        text: 'Hall KD et al. (2019). Ultra-processed diets cause excess calorie intake and weight gain: an inpatient randomized controlled trial of ad libitum food intake. Cell Metabolism 30(1):67-77 — 20 adults, two weeks on each diet; 508 kcal a day more eaten on the ultra-processed diet; 0.9 kg gained against 0.9 kg lost.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/31105044/',
      },
      {
        id: 'nat-hall-2019-hormones',
        text: 'Hall KD et al. (2019), full text — fasting PYY rose and ghrelin fell on the unprocessed diet; fasting active GLP-1 was lower than baseline on the ultra-processed diet (1.25 against 1.88 pg/ml, p = 0.027).',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7946062/',
      },
      {
        id: 'nat-wycherley-2012',
        text: 'Wycherley TP et al. (2012). Effects of energy-restricted high-protein, low-fat compared with standard-protein, low-fat diets: a meta-analysis of randomized controlled trials. American Journal of Clinical Nutrition 96(6):1281-1298 — 24 trials, 1,063 people; −0.79 kg weight, −0.87 kg fat mass, 0.43 kg more lean mass kept.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/23097268/',
      },
      {
        id: 'nat-jakubowicz-2014',
        text: 'Jakubowicz D et al. (2014). Incretin, insulinotropic and glucose-lowering effects of whey protein pre-load in type 2 diabetes: a randomised clinical trial. Diabetologia 57(9):1807-1811 — 15 people, 50 g whey before breakfast; total GLP-1 +141 per cent, glucose −28 per cent.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/25005331/',
      },
      {
        id: 'nat-shukla-2017',
        text: 'Shukla AP et al. (2017). Carbohydrate-last meal pattern lowers postprandial glucose and insulin excursions in type 2 diabetes. BMJ Open Diabetes Research & Care 5(1):e000440 — 16 people; glucose iAUC 53 per cent lower and GLP-1 iAUC higher (3,488 against 2,519 pg/mL×min) with carbohydrate last.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28989726/',
      },
      {
        id: 'nat-kokkinos-2010',
        text: 'Kokkinos A et al. (2010). Eating slowly increases the postprandial response of the anorexigenic gut hormones, peptide YY and glucagon-like peptide-1. Journal of Clinical Endocrinology & Metabolism 95(1):333-337 — 17 men; GLP-1 AUC 8,794 against 6,219 pmol/L·min when the same meal took 30 minutes rather than 5.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/19875483/',
      },
      {
        id: 'nat-slyper-2021',
        text: 'Slyper A (2021). Oral processing, satiation and obesity: overview and hypotheses. Diabetes, Metabolic Syndrome and Obesity 14:3399-3415 — eating speed as a risk factor for obesity in observational research.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/34345176/',
      },
      {
        id: 'nat-amarasate',
        text: 'Amarasate — overview of the bitter hops extract sold as Calocurb and its human trials, including the 24-week trial of 150 adults reported in Obesity Pillars in July 2026. We were unable to open that paper; its figures come from the institute and trade reporting of it.',
        url: 'https://en.wikipedia.org/wiki/Amarasate',
      },
      {
        id: 'nat-walker-2022',
        text: 'Walker EG et al. (2022). An extract of hops modulates gut peptide hormone secretion and reduces energy intake in healthy weight men: a randomised, cross-over clinical trial. American Journal of Clinical Nutrition 115(3):925-940.',
        url: 'https://www.medrxiv.org/content/10.1101/2021.06.25.21259514v2.full',
      },
      {
        id: 'nat-onakpoya-2014',
        text: 'Onakpoya I, Posadzki P, Ernst E (2014). The efficacy of glucomannan supplementation in overweight and obesity: a systematic review and meta-analysis of randomized clinical trials. Journal of the American College of Nutrition 33(1):70-78 — eight RCTs, −0.22 kg, not significant.',
        url: 'https://www.tandfonline.com/doi/abs/10.1080/07315724.2014.870013',
      },
      {
        id: 'nat-efsa-glucomannan',
        text: 'EU-authorised glucomannan weight claim (EFSA opinions 2009-2010): in the context of an energy-restricted diet, at least 3 g a day in three 1 g doses with 1-2 glasses of water before meals.',
        url: 'https://www.nutraingredients.com/Article/2011/10/11/UK-researcher-EFSA-voodoo-lily-weight-loss-approval-is-strange/',
      },
      {
        id: 'nat-psyllium-2019',
        text: 'Systematic review and meta-analysis of psyllium supplementation and body weight in randomised trials — no significant overall effect.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/30880409/',
      },
      {
        id: 'nat-psyllium-2023',
        text: '2023 systematic review and meta-analysis of psyllium for weight loss with narrower selection criteria — about 2.1 kg at an average 10.8 g a day over roughly 4.8 months.',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10389520/',
      },
      {
        id: 'nat-li-2024',
        text: 'Li H et al. (2024). Resistant starch intake facilitates weight loss in humans by reshaping the gut microbiota. Nature Metabolism 6(3):578-597 — 37 people, 40 g a day for eight weeks, 2.8 kg against control starch.',
        url: 'https://www.nature.com/articles/s42255-024-00988-y',
      },
      {
        id: 'nat-fibre-review',
        text: 'Dietary fibers to boost endogenous GLP-1 secretion and satiety: a scoping review (2026). Frontiers in Endocrinology — 52 studies, 1,085 participants; GLP-1 rises showed only a non-significant tendency toward increased satiety.',
        url: 'https://www.frontiersin.org/journals/endocrinology/articles/10.3389/fendo.2026.1880500/full',
      },
      {
        id: 'nat-berberine-2026',
        text: 'Elahi Vahed I et al. (2026). The effect of berberine on obesity indices: a systematic review and meta-analysis. International Journal of Obesity 50(1):53-73 — 23 trials; body weight −0.88 kg; the authors call for better blinding, randomisation and reporting of purity and dose.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/41310257/',
      },
      {
        id: 'nat-berberine-ucla',
        text: 'UCLA Health. What to know about berberine, the so-called “nature’s Ozempic” — the AMPK mechanism, limited trial evidence and drug interactions.',
        url: 'https://www.uclahealth.org/news/article/what-know-about-berberine-so-called-natures-ozempic',
      },
      {
        id: 'nat-acv-retraction',
        text: 'BMJ Group (September 2025). BMJ Group retracts trial on apple cider vinegar and weight loss — analyses could not be replicated, and the dataset showed patterns inconsistent with random allocation.',
        url: 'https://bmjgroup.com/bmj-group-retracts-trial-on-apple-cider-vinegar-and-weight-loss/',
      },
      {
        id: 'nat-step1',
        text: 'Wilding JPH et al. (2021). Once-weekly semaglutide in adults with overweight or obesity. STEP 1 — about 15 per cent mean weight loss over 68 weeks.',
        url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa2032183',
      },
      {
        id: 'nat-surmount1',
        text: 'Jastreboff AM et al. (2022). Tirzepatide once weekly for the treatment of obesity. SURMOUNT-1 — 20.9 per cent mean weight loss on 15 mg at 72 weeks.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/35658024/',
      },
      {
        id: 'nat-step1-extension',
        text: 'Wilding JPH et al. (2022). Weight regain and cardiometabolic effects after withdrawal of semaglutide: the STEP 1 trial extension — a mean 11.6 percentage points regained over 52 weeks off treatment.',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9542252/',
      },
    ],
    history: [
      {
        date: '2026-09-25',
        note: 'First published. Every trial figure was read from its PubMed abstract, and the Hall 2019 hormone results from the full text. The ranking weighs evidence for eating less or losing weight first, then direct GLP-1 evidence, then cost and risk.',
      },
    ],
    body: `
<h2>What a natural alternative can and cannot do</h2>
<p>GLP-1 drugs work mainly by making you less hungry. They keep a gut hormone's signal switched on for a week at a time, slow the stomach, and quiet appetite in the brain, so people eat less without fighting themselves. In the trials that produced about 15 per cent weight loss for semaglutide and 20.9 per cent for tirzepatide, that is what was happening.</p>
<p>A natural alternative can do two things. It can raise your own GLP-1 a little — through food, fibre or the way you eat — or it can make you eat less by some other route. It cannot do what the drugs do, because your own GLP-1 is broken down within about two minutes. So the useful question is not "which one is nature's Ozempic" but "which ones measurably reduce how much people eat, or how much they weigh, in trials".</p>
<p>That is what this page ranks. The effects are real, and they are measured in single kilograms, not in percentages of body weight. Nothing here is medical advice, and if you are considering the drugs, that conversation belongs with a doctor. Our <a href="/learn/glp-1">GLP-1 explainer</a> covers what they do and what happens when you stop.</p>

<h2>How we ranked them</h2>
<p>Evidence first: randomised trials measuring what people ate or what they weighed count for more than trials measuring a hormone, and those count for more than theory. Then cost and risk: a free habit with good evidence ranks above a supplement with similar evidence, because it is free and cannot interact with your medicines. Where a number is from a small or short study, we say so.</p>

<h2>1. Eat mostly unprocessed food</h2>
<p>The single strongest piece of evidence on this page did not involve a supplement. In 2019, researchers at the US National Institutes of Health admitted 20 adults to a clinical centre and gave them two weeks of ultra-processed meals and two weeks of unprocessed meals, in random order. The menus were matched for calories offered, sugar, fat, fibre and protein. People could eat as much or as little as they liked.</p>
<p>On the ultra-processed diet they ate about <strong>508 kcal a day more</strong>, and gained 0.9 kg. On the unprocessed diet they lost 0.9 kg. The hormone results fit: on the unprocessed diet the appetite-suppressing hormone PYY rose and the hunger hormone ghrelin fell, and during the ultra-processed fortnight fasting active GLP-1 dropped below its starting level.</p>
<p>It was a small, short trial, and eating in a research ward is not eating at home. But it is causal evidence that the kind of food on the plate changes how much people eat without their trying. That is the closest thing on this page to what the drugs do, and it costs nothing extra.</p>

<h2>2. Put protein at every meal</h2>
<p>Protein is the macronutrient most consistently linked to fullness, and eating it raises GLP-1. A 2012 meta-analysis of 24 weight-loss trials in 1,063 people compared higher-protein and standard-protein diets with the same calories. The higher-protein diets produced slightly more weight loss (0.79 kg) and fat loss (0.87 kg), kept 0.43 kg more lean mass, and were reported as more filling in three of the five trials that asked.</p>
<p>Taking protein before a meal has a sharper, shorter effect. In a small 2014 trial in 15 people with type 2 diabetes, 50 g of whey 30 minutes before breakfast raised total GLP-1 by 141 per cent and cut the post-meal glucose rise by 28 per cent. That is a large dose of whey, in people with diabetes, measured over one morning — a mechanism shown clearly, not a weight-loss result.</p>
<p>The practical version is unglamorous: a real source of protein at each meal, from food where you can. A whey shake is a convenient way to get there, not a necessary one. Protein matters more if you are losing weight quickly, because it helps protect muscle.</p>

<h2>3. Eat vegetables and protein before the carbohydrate</h2>
<p>The order you eat a meal in changes its hormone response. In a 2017 study, 16 people with type 2 diabetes ate the same meal three ways on different days. When they ate the carbohydrate last — ten minutes after the protein and vegetables — the post-meal glucose rise was <strong>53 per cent smaller</strong> than when they ate it first, and GLP-1 was about <strong>38 per cent higher</strong>.</p>
<p>It is a small study, in people with diabetes, over single meals, and there is no long-term weight trial of eating this way. But it costs nothing, it measured GLP-1 directly, and it works with any diet.</p>

<h2>4. Slow down</h2>
<p>In a 2010 study, 17 healthy men ate the same 675 kcal bowl of ice cream on two occasions, once in 5 minutes and once over 30. Over the 30-minute meal, GLP-1 was about <strong>41 per cent higher</strong> and PYY about 27 per cent higher, with a trend towards feeling fuller afterwards.</p>
<p>Like eating order, it is a small acute study with no weight outcome. Eating fast is also linked to weight gain in observational research, which cannot prove cause. As a free habit that measurably raises the body's own GLP-1, it earns its place.</p>

<h2>5. Amarasate (Calocurb): the one natural extract with weight trials</h2>
<p>If you want a supplement, this is the one with the evidence. Amarasate is a bitter hops extract in a delayed-release capsule that triggers bitter receptors in the small intestine, releasing GLP-1, CCK and PYY. A crossover trial in the <em>American Journal of Clinical Nutrition</em> measured those hormones rising and found people ate less at the next meal. A 24-week trial of 150 adults, reported in 2026, found <strong>3.77 kg lost against 0.40 kg on placebo</strong>.</p>
<p>The research comes from the institute that developed and licenses the extract, and we could not open the 24-week paper itself. It also costs about $4 a day at the label's target dose — which, with an effect of about 3.4 kg over six months, is why it ranks below four free habits. Our <a href="/fat-burners/calocurb-review">Calocurb review</a> goes through every trial.</p>

<h2>6. Viscous fibre before meals</h2>
<p>Viscous fibres such as glucomannan (from konjac) and psyllium thicken in the stomach, slow emptying and can make a meal more filling. The evidence for weight is modest and mixed. A 2014 meta-analysis of eight glucomannan trials found a difference of 0.22 kg that was not statistically significant. For psyllium, one systematic review found no significant overall effect, while a 2023 analysis with narrower criteria found about 2.1 kg over nearly five months at around 10.8 g a day.</p>
<p>The EU does authorise a glucomannan weight claim — at 3 g a day, in three 1 g doses with one or two glasses of water before meals, alongside a calorie-restricted diet. That dose and the water matter: both fibres must be taken with plenty of liquid because of the choking risk. Our reviews of <a href="/fat-burners/now-glucomannan-575-mg">NOW Glucomannan</a> and <a href="/fat-burners/now-psyllium-husk-powder">NOW Psyllium</a> cover the labels and doses.</p>

<h2>7. Resistant starch — but only at a real dose</h2>
<p>Fermentable fibres, resistant starch especially, feed gut bacteria that produce short-chain fatty acids, and those stimulate the cells that release GLP-1. The mechanism is well established. The magnitude is the problem: a 2026 scoping review of 52 studies found that where fibre raised GLP-1, people did not reliably feel fuller.</p>
<p>There is one encouraging trial. In a 2024 study in <em>Nature Metabolism</em>, 37 people with excess weight took 40 g of resistant starch a day for eight weeks and lost 2.8 kg against a control starch. But 40 g is a large amount of a purified high-amylose maize starch, and fibre products sold for GLP-1 can contain a small fraction of it — our <a href="/fat-burners/supergut-glp-1-booster-review">Supergut review</a> found 6 g of mixed fibre a scoop. Cooked-and-cooled potatoes and rice, green bananas, oats and legumes are sensible foods; they are not a trial dose.</p>

<h2>8. Berberine: popular, and not a GLP-1 alternative</h2>
<p>Berberine is the most-shared "nature's Ozempic". It is a plant alkaloid that acts mainly through the AMPK enzyme, which makes it closer to metformin than to semaglutide, and it does not act on the GLP-1 receptor. A 2026 meta-analysis of 23 trials found <strong>0.88 kg</strong> of weight loss against control, and its authors called for better blinding, randomisation and reporting of what was actually in the capsules.</p>
<p>It can also lower blood sugar alongside diabetes medicines and interacts with other drugs. We have not reviewed a berberine product. On the evidence, it ranks last of the eight, and the nickname should go.</p>

<h2>What to skip</h2>
<p><strong>Apple cider vinegar.</strong> The 2024 trial behind the claim — 120 young people in Lebanon, reporting 6 to 8 kg lost — was retracted in September 2025 after the journal found the analyses could not be replicated and the data showed patterns inconsistent with random allocation. Nothing solid remains behind it.</p>
<p><strong>Probiotics sold for GLP-1.</strong> The one randomised trial of <em>Akkermansia</em> to measure GLP-1 found no significant change, at a hundred times the dose in Pendulum's products. Our reviews of <a href="/wellness/pendulum-akkermansia-review">Pendulum Akkermansia</a> and <a href="/fat-burners/pendulum-glp-1-probiotic-review">Pendulum GLP-1 Probiotic</a> go through it.</p>
<p><strong>Extracts sold as GLP-1 boosters.</strong> Raising GLP-1 on a blood test is not the same as losing weight. The lemon extract in <a href="/fat-burners/lemme-glp-1-daily-review">Lemme Reset</a> raised GLP-1 in its trial without changing weight. Our <a href="/best/glp-1-supplements-for-weight-loss">ranking of GLP-1 supplements</a> covers the five best-known products.</p>
<p><strong>Anything with a proprietary blend.</strong> If the label will not say how much of each ingredient is inside, there is no way to compare it with a trial.</p>

<h2>The honest scale</h2>
<p>Put the numbers side by side. Unprocessed food: about 500 kcal a day less eaten, over two weeks. Higher protein: about 0.8 kg more weight loss. Amarasate: about 3.4 kg more than placebo over six months. Berberine: under 1 kg. Semaglutide: about 15 per cent of body weight. Tirzepatide: about 21 per cent.</p>
<p>The natural options are worth doing because they are cheap, safe and add up — the food and eating habits especially, which you can use together. They are not a substitute for a prescription if you qualify for one and want the results the drug trials showed. And no natural approach has been shown to stop the weight returning after someone stops a GLP-1 drug: in the STEP 1 extension, people regained about two-thirds of their loss within a year of stopping.</p>
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
