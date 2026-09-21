import type { Review, Collection } from './types';

const products = [
  {
    name: 'NOW Psyllium Husk Powder',
    slug: 'now-psyllium-husk-powder',
    asin: 'B007729DSE',
    listing: '12 oz powder',
    category: 'fat-burners' as const,
    summary:
      'A fibre powder, not a thermogenic fat burner. The distinction matters when comparing weight-management products.',
    source: 'https://www.nowfoods.com/products/supplements/psyllium-husk-powder',
    facts:
      'The manufacturer lists a 9 g serving with 7 g dietary fibre. Its directions specify at least 12 oz of liquid and immediate consumption. This powder belongs in a discussion about fibre; its label does not establish fat loss.',
    caution:
      'NOW warns against use with swallowing difficulties and inadequate liquid because of choking risk. Its label advises medical consultation for medicines, medical conditions, pregnancy or nursing.',
    takeaway:
      'Compare powder weight, fibre content and the preparation instructions. Do not mistake a larger scoop for stronger evidence of weight loss.',
    whoFor:
      'Someone looking at fibre intake who wants the serving weight and the fibre content stated outright, with nothing hidden inside a blend.',
    pros: [
      'One ingredient, one number: 7 g of dietary fibre in a 9 g serving, printed on the panel',
      'No proprietary blend, so there is nothing to work backwards from',
      'Liquid volume and timing are given as explicit directions rather than fine print',
    ],
    cons: [
      'Shelved as a fat burner, but nothing on the label supports a fat-loss claim',
      'Needs at least 12 oz of liquid and must be drunk immediately, which suits some routines badly',
      'No batch-level third-party certificate is published alongside the product page',
    ],
    ingredients: [
      {
        name: 'Psyllium husk powder',
        dose: '9 g per serving, providing 7 g dietary fibre',
        evidence_rating: 'moderate' as const,
        note: 'A soluble fibre that absorbs water and adds bulk. The evidence for fibre intake, regularity and cholesterol is reasonable; the evidence for psyllium as a weight-loss agent in its own right is not. NIH rates related konjac fibre as having little to no effect on weight loss, and psyllium is not marketed here with a weight claim either.',
      },
    ],
    faqs: [
      {
        question: 'Why is a fibre powder in the fat burners category?',
        answer:
          'Because that is where retailers shelve it. The category reflects how these products are sold, not a claim that they burn fat. Psyllium is a fibre, and this page says so rather than playing along with the placement.',
      },
      {
        question: 'How much liquid does it actually need?',
        answer:
          'The manufacturer specifies at least 12 oz per serving, taken immediately rather than left to stand. This is a genuine safety instruction: psyllium swells, and NOW warns about choking risk with inadequate liquid or swallowing difficulty.',
      },
      {
        question: 'Is 7 g of fibre a lot?',
        answer:
          'It is a meaningful share of a typical daily target, but it is an addition to your diet rather than a replacement for it. Adding fibre quickly can cause bloating and cramping, so increases are usually gradual.',
      },
    ],
  },
  {
    name: 'NOW L-Theanine 100 mg',
    slug: 'now-l-theanine-100-mg',
    asin: 'B0013OXESM',
    listing: '90 veg capsules',
    category: 'nootropics' as const,
    summary:
      'A closer look at a relaxation-labelled formula containing both L-theanine and decaffeinated green tea.',
    source: 'https://www.nowfoods.com/products/supplements/l-theanine-100-mg-veg-capsules',
    facts:
      'The manufacturer lists 100 mg L-theanine and 250 mg decaffeinated green tea per capsule, with 90 capsules per bottle. This is not a single-ingredient L-theanine capsule. The label markets relaxation; that claim should not be stretched into a promise of better memory.',
    caution:
      'The manufacturer says to take with food, avoid an empty stomach and not exceed its recommended dose. It advises medical consultation for pregnancy, nursing, medicines or medical conditions, including liver disease.',
    takeaway:
      'Read the full ingredient panel when comparing the 100 mg and 200 mg versions. A shared brand name does not establish an identical formula.',
    whoFor:
      'Someone comparing theanine products who wants to see both actives itemised before deciding whether the green tea content belongs in their routine.',
    pros: [
      'Both actives carry their own amounts — 100 mg L-theanine, 250 mg green tea extract',
      'The green tea is decaffeinated, so the capsule is not an unlabelled stimulant',
      '90 capsules per bottle makes cost per serving straightforward to calculate',
    ],
    cons: [
      'The product name says L-theanine; the panel shows a two-ingredient formula',
      'Marketed for relaxation, which is not evidence of better memory, focus or productivity',
      'Concentrated green tea extract carries documented liver-injury reports in some people',
    ],
    ingredients: [
      {
        name: 'L-theanine',
        dose: '100 mg per capsule',
        evidence_rating: 'moderate' as const,
        note: 'An amino acid found in tea, most studied alongside caffeine for short-term alertness and subjective calm. Trials commonly use 100–200 mg. Evidence for broader or longer-term cognitive benefit is much thinner than the category marketing suggests.',
      },
      {
        name: 'Decaffeinated green tea extract',
        dose: '250 mg per capsule',
        evidence_rating: 'weak' as const,
        note: 'Present in addition to the theanine rather than instead of it. NIH notes concentrated green tea extract can cause adverse effects and has been linked to liver injury in some people — a different risk profile from drinking tea. Worth knowing if you also take a separate green tea product.',
      },
    ],
    faqs: [
      {
        question: 'Is this pure L-theanine?',
        answer:
          'No. Each capsule also contains 250 mg of decaffeinated green tea extract. If you specifically want a single-ingredient theanine capsule, this is not it, and the product name alone will not tell you that.',
      },
      {
        question: 'Will it make me more focused?',
        answer:
          'The label markets relaxation, not focus. Most theanine research pairs it with caffeine and measures short-term alertness or subjective calm. Treating that as proof of improved memory or concentration goes well beyond what was tested.',
      },
      {
        question: 'Does the 200 mg version just contain double?',
        answer:
          'Do not assume so. A shared brand name does not guarantee the same formula — the accompanying ingredients can differ between strengths. Compare the full panels side by side rather than the front labels.',
      },
    ],
  },
  {
    name: 'NOW Glucomannan 575 mg',
    slug: 'now-glucomannan-575-mg',
    asin: 'B000MGWI02',
    listing: '180 veg capsules',
    category: 'fat-burners' as const,
    summary:
      'Sold for weight management, priced per bottle, and labelled with a number that is not the serving. A good test of whether you read panels.',
    source: 'https://www.nowfoods.com/products/supplements/glucomannan-575-mg-veg-capsules',
    facts:
      'The front of the bottle says 575 mg. The Supplement Facts panel says a serving is three capsules, providing 1,725 mg of glucomannan from konjac root and 2 g of dietary fibre. The 180-capsule bottle is therefore 60 servings, not 180 — roughly two months, not six.',
    caution:
      'Bulk-forming fibres swell on contact with liquid and carry a choking risk if taken with too little. Anyone with swallowing difficulty, a history of bowel obstruction, diabetes medication or scheduled surgery should take advice first. Fibre can also affect how other medicines are absorbed, so doses are usually spaced apart.',
    takeaway:
      'Work out the cost per serving, not per capsule, and check the claim against the evidence for the ingredient rather than the category it is shelved in.',
    whoFor:
      'Someone comparing fibre supplements who wants to see how a front-label number differs from a labelled serving before deciding what a bottle actually costs to use.',
    pros: [
      'Full serving disclosed: 1,725 mg glucomannan and 2 g dietary fibre, no proprietary blend',
      'Konjac root is named as the source, with the botanical species given',
      'Single ingredient, so the panel can be checked against research directly',
    ],
    cons: [
      'The front label reads 575 mg; a serving is three capsules at 1,725 mg',
      '180 capsules looks like a long supply but is 60 servings',
      'Marketed for healthy weight management, where the evidence for glucomannan is weak',
    ],
    ingredients: [
      {
        name: 'Glucomannan (from konjac root)',
        dose: '1,725 mg per 3-capsule serving',
        evidence_rating: 'weak' as const,
        note: 'A soluble fibre that absorbs water and adds bulk, which is the basis of the satiety claim. NIH’s Office of Dietary Supplements concludes glucomannan has little to no effect on weight loss. It can cause gastrointestinal symptoms and must be taken with adequate fluid.',
      },
    ],
    faqs: [
      {
        question: 'Why does the label say 575 mg if a serving is 1,725 mg?',
        answer:
          'Because 575 mg is the amount in one capsule and the labelled serving is three. Both numbers are truthful; only one tells you what you are taking. This is the most common way a supplement label misleads without lying.',
      },
      {
        question: 'How long does a 180-capsule bottle last?',
        answer:
          'Sixty servings, so about two months at the labelled serving. Comparing it on bottle price against a product with a one-capsule serving would be comparing two months against six.',
      },
      {
        question: 'Does glucomannan cause weight loss?',
        answer:
          'The NIH Office of Dietary Supplements concludes it has little to no effect on weight loss. Promoting fullness is a plausible mechanism, but a plausible mechanism is not a demonstrated outcome, and the category it is shelved in does not change that.',
      },
    ],
  },
  {
    name: 'NOW Omega-3 Molecularly Distilled',
    slug: 'now-omega-3-molecularly-distilled',
    asin: 'B001GCU6KA',
    listing: '200 softgels',
    category: 'wellness' as const,
    summary:
      'The number on the front is fish oil. The number that matters is EPA and DHA, and it is about a third as large.',
    source: 'https://www.nowfoods.com/products/supplements/omega-3-molecularly-distilled-softgels',
    facts:
      'A serving is two softgels: 2,000 mg of fish oil concentrate providing 360 mg EPA and 240 mg DHA. The front of the bottle leads with 1,000 mg per softgel, but only about 30 per cent of that weight is the omega-3 the product is bought for. The 200-softgel bottle is 100 servings.',
    caution:
      'Omega-3s can affect bleeding, which matters if you take an anticoagulant or have surgery scheduled. This is a fish-derived product and unsuitable for anyone with a fish allergy. Discuss higher intakes with a healthcare professional rather than estimating.',
    takeaway:
      'Compare products on their EPA and DHA totals per serving, never on the fish oil milligrams printed on the front.',
    whoFor:
      'Someone comparing fish oil products who wants the actual EPA and DHA amounts rather than the headline oil weight.',
    pros: [
      'EPA and DHA are itemised separately — 360 mg and 240 mg — not merged into one omega-3 figure',
      'Molecular distillation is named on the label, and the serving is stated as two softgels',
      'Sold in four bottle counts, so cost per serving can be compared directly',
    ],
    cons: [
      'The prominent 1,000 mg figure is fish oil weight, not omega-3 content',
      'Only about 600 mg of a 2,000 mg serving is EPA plus DHA',
      'No batch-level oxidation or purity certificate is published beside the product',
    ],
    ingredients: [
      {
        name: 'EPA (eicosapentaenoic acid)',
        dose: '360 mg per 2-softgel serving',
        evidence_rating: 'moderate' as const,
        note: 'Evidence is outcome-specific rather than general. EPA and DHA are genuinely important nutrients, but a fish-oil capsule is not an established all-purpose health or memory product, and observational links to eating fish do not transfer automatically to supplements.',
      },
      {
        name: 'DHA (docosahexaenoic acid)',
        dose: '240 mg per 2-softgel serving',
        evidence_rating: 'moderate' as const,
        note: 'Listed separately from EPA, which is what makes cross-brand comparison possible. Products quoting only a combined omega-3 number, or only fish oil weight, cannot be compared like for like.',
      },
      {
        name: 'Fish oil concentrate',
        dose: '2,000 mg per 2-softgel serving',
        evidence_rating: 'none' as const,
        note: 'The carrier weight, not an active dose. Roughly 1,400 mg of each serving is oil other than EPA and DHA. Treating this figure as the strength of the product is the central mistake this category invites.',
      },
    ],
    faqs: [
      {
        question: 'Is 1,000 mg of fish oil the same as 1,000 mg of omega-3?',
        answer:
          'No, and the gap is large. Two softgels give 2,000 mg of fish oil but 600 mg of EPA plus DHA. Any comparison between fish oil products has to use the EPA and DHA lines or it is measuring the wrong thing.',
      },
      {
        question: 'How many softgels is a serving?',
        answer:
          'Two. So the 200-softgel bottle is 100 servings. Compare that against a competitor’s one-softgel serving before concluding which bottle is better value.',
      },
      {
        question: 'What does molecularly distilled mean?',
        answer:
          'It is a processing method used to reduce contaminants such as heavy metals. It describes the process, not a verified result for the bottle in your hand — a batch-specific certificate of analysis from a named laboratory would be the evidence for that.',
      },
    ],
  },
  {
    name: 'Nature Made Vitamin D3 1000 IU',
    slug: 'nature-made-vitamin-d3-1000-iu',
    asin: 'B004U3Y8OM',
    listing: '300 softgels',
    category: 'wellness' as const,
    summary:
      'A clearly named vitamin D3 softgel. Check the strength and bottle count carefully when comparing listings.',
    source: 'https://www.naturemade.com/products/vitamin-d3-25-mcg-1000-iu-softgels',
    facts:
      'The product title and benefits section specify 25 mcg (1000 IU) per softgel. The manufacturer offers multiple bottle counts. One introductory sentence on its page inconsistently says 50 mcg; check the actual package panel before purchase rather than repeating that inconsistency.',
    caution:
      'An appropriate vitamin D dose depends on individual circumstances. Discuss personal use with a healthcare professional, particularly alongside other supplements or medicines.',
    takeaway:
      'Compare the same strength and softgel count. A price comparison with a higher-strength bottle is not a like-for-like comparison.',
    whoFor:
      'Someone who already knows the vitamin D strength they are looking for and wants to compare listings without being caught out by bottle count or unit confusion.',
    pros: [
      'Strength given in both mcg and IU, which is what makes cross-brand comparison possible',
      'A single active ingredient — nothing to disentangle from a blend',
      'Sold in several bottle counts, so cost per softgel can be compared directly',
    ],
    cons: [
      'The manufacturer’s own page contradicts itself: one line reads 50 mcg against a 25 mcg product title',
      'The right dose depends on blood levels and clinical context this label cannot know',
      'Multiple bottle counts and strengths make marketplace listings easy to misread',
    ],
    ingredients: [
      {
        name: 'Vitamin D3 (cholecalciferol)',
        dose: '25 mcg (1000 IU) per softgel',
        evidence_rating: 'strong' as const,
        note: 'Strong evidence for correcting a documented deficiency; that is not the same as a universal benefit at any dose for everyone. Baseline status, age, sun exposure and clinical context determine what is appropriate, and high-dose routines warrant professional oversight rather than guesswork.',
      },
    ],
    faqs: [
      {
        question: 'Is it 25 mcg or 50 mcg?',
        answer:
          'The product title and benefits section both say 25 mcg (1000 IU). A single introductory line on the manufacturer’s page says 50 mcg, which contradicts the rest of the listing. Read the Supplement Facts panel on the package you are actually buying — that is the authoritative number.',
      },
      {
        question: 'What is the difference between mcg and IU?',
        answer:
          'They are two units for the same thing: 25 mcg equals 1000 IU of vitamin D. Labels vary in which they lead with, which is precisely how strength comparisons go wrong between brands.',
      },
      {
        question: 'Is 1000 IU the right amount for me?',
        answer:
          'This page cannot answer that, and neither can the label. Appropriate vitamin D intake depends on your blood level, age, diet and any medicines you take. It is a reasonable question for a doctor or pharmacist, who can test rather than estimate.',
      },
    ],
  },
  {
    name: 'ColonBroom Psyllium Fiber Powder',
    slug: 'colonbroom-psyllium-fiber-powder',
    asin: 'B0DT1F2XYV',
    listing: '50 servings, tropical fruits',
    published: '2026-09-21T00:00:00Z',
    updated: '2026-09-21T00:00:00Z',
    image:
      'https://m.media-amazon.com/images/W/BW_MEDIAX_AVIF_MEASUREMENT_1306696-T3/images/I/61GVKtyzPKL._AC_SL1500_.jpg',
    category: 'fat-burners' as const,
    summary:
      'A flavoured psyllium husk powder sold for weight management at roughly six times the price per gram of plain psyllium — and the brand does not publish its Supplement Facts panel in readable text.',
    source: 'https://colonbroom.com/',
    sourceNote:
      'We could not find a Supplement Facts panel in readable text anywhere on the brand’s own site, and the Amazon listing shows it only as an image. The per-serving figure below is therefore taken from Forbes Health rather than from the manufacturer, and is cited as such.',
    facts:
      'A one-scoop serving is reported to contain 3.6 g of psyllium husk powder, alongside 49 mg of sodium from pink Himalayan salt, natural flavour, citric acid, rebaudioside A from stevia, fruit and vegetable juice powder and organic rice hulls. The Amazon listing is 9.9 oz — roughly 280 g — for 50 servings at $34.97 at the time of checking. That works out at about 70 cents a serving, or roughly 19 cents per gram of psyllium husk once the flavourings are set aside.',
    caution:
      'Psyllium swells rapidly in liquid and has caused choking and oesophageal obstruction when taken with too little. Take it with a full glass of water, drink it promptly, and never immediately before lying down. Avoid it entirely with swallowing difficulty or a history of bowel obstruction. Because it slows absorption, separate it from medicines by at least two hours — this matters particularly for thyroid medication, lithium, carbamazepine and glucose-lowering drugs. Bloating and cramping are common in the first weeks.',
    takeaway:
      'Work out the cost per gram of psyllium rather than per tub, and check the serving against the 7 to 10 g used in the research before deciding whether one scoop is doing the job you bought it for.',
    whoFor:
      'Someone who wants flavoured, pre-measured psyllium and is willing to pay a premium for convenience, having already understood that the active ingredient is available plain for a fraction of the price.',
    pros: [
      'The active ingredient is psyllium husk, which has genuinely strong evidence for regularity and cholesterol',
      'Flavoured and stevia-sweetened, which makes a famously unpleasant ingredient easier to take daily',
      'Pre-measured scoops remove the guesswork that puts people off bulk psyllium powder',
      'Single active ingredient — there is no proprietary blend hiding what you are taking',
    ],
    cons: [
      'No Supplement Facts panel published in readable text on the brand’s own site, so the serving figure cannot be verified at source',
      'About 19 cents per gram of psyllium against roughly 3 cents for plain psyllium powder — close to six times the price',
      'A 3.6 g scoop is around half the 7 to 10 g daily amount used in the cholesterol research',
      'Marketed for weight management, where the evidence for psyllium is limited rather than strong',
      'Manufactured by Gut Health UAB in Lithuania and distributed by Karma Processing Inc in Delaware, with no manufacturing detail on the packaging',
    ],
    ingredients: [
      {
        name: 'Psyllium husk powder',
        dose: '3.6 g per serving (reported)',
        evidence_rating: 'strong' as const,
        note: 'The only active ingredient, and a genuinely well-supported one — psyllium carries an FDA-authorised health claim for soluble fibre and coronary heart disease. The caveat is amount: research on cholesterol generally uses 7 to 10 g daily, so a single 3.6 g scoop sits at roughly half that. The evidence for weight loss specifically is much weaker than the marketing around this product implies.',
      },
      {
        name: 'Sodium (from pink Himalayan salt)',
        dose: '49 mg per serving',
        evidence_rating: 'none' as const,
        note: 'Present for taste and mixing rather than as an active. Pink Himalayan salt is chemically salt; the colour does not confer a benefit over any other sodium source.',
      },
      {
        name: 'Rebaudioside A (stevia leaf extract)',
        dose: 'Not disclosed',
        evidence_rating: 'none' as const,
        note: 'A sweetener. Its job is palatability, which is not a trivial thing for a psyllium product, but it is not a functional ingredient and no amount is disclosed.',
      },
      {
        name: 'Fruit and vegetable juice powder',
        dose: 'Not disclosed',
        evidence_rating: 'none' as const,
        note: 'Used for colour and flavour. At an undisclosed amount in a 5.6 g scoop it cannot be contributing meaningful nutrition, and it should not be read as a serving of produce.',
      },
    ],
    faqs: [
      {
        question: 'What is actually in ColonBroom?',
        answer:
          'Psyllium husk powder, reported at 3.6 g per serving, plus salt, natural flavour, citric acid, stevia extract, fruit and vegetable juice powder and rice hulls. The active ingredient is psyllium; everything else is there to make it taste and mix better.',
      },
      {
        question: 'Is ColonBroom just psyllium husk?',
        answer:
          'Functionally, yes. It is flavoured, sweetened, pre-portioned psyllium. That is not a criticism of whether it works — psyllium works — but it does mean the comparison worth making is against plain psyllium powder rather than against other branded gut products.',
      },
      {
        question: 'Why is it more expensive than plain psyllium?',
        answer:
          'You are paying for flavouring, portioning and brand. At $34.97 for 50 servings of 3.6 g, a gram of psyllium works out around 19 cents. A 12 oz tub of plain psyllium husk powder is about 3 cents a gram. Whether convenience is worth roughly six times the price is a reasonable thing to decide for yourself, but it should be a decision rather than an accident.',
      },
      {
        question: 'Does ColonBroom cause weight loss?',
        answer:
          'The evidence for psyllium as a weight-loss agent is limited. It can make meals more filling, which may reduce how much you eat, but it does not change metabolism or fat storage. Our psyllium evidence page grades weight loss at C while grading cholesterol and regularity at A.',
      },
      {
        question: 'Is one scoop enough?',
        answer:
          'For regularity, possibly. For the cholesterol benefit, the research generally uses 7 to 10 g of psyllium daily, and a 3.6 g scoop is about half. Two scoops would reach the studied range, which also doubles the cost per day.',
      },
      {
        question: 'Why can I not find the Supplement Facts panel?',
        answer:
          'We could not either. There is no ingredients page on the brand site that we could locate, and the Amazon listing shows the panel only as an image rather than as text. That is why the serving figure on this page is attributed to Forbes Health rather than to the manufacturer.',
      },
    ],
    references: [
      {
        id: 'forbes-colonbroom',
        text: 'Forbes Health. ColonBroom Review — the source of the 3.6 g per serving figure and the ingredient list used on this page, as the manufacturer does not publish a readable panel.',
        url: 'https://www.forbes.com/health/supplements/colon-broom-review/',
      },
      {
        id: 'fda-psyllium-cb',
        text: 'US Food and Drug Administration. Health claim: soluble fiber from certain foods and risk of coronary heart disease, 21 CFR 101.81.',
        url: 'https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-101/subpart-E/section-101.81',
      },
      {
        id: 'ods-weightloss-cb',
        text: 'NIH Office of Dietary Supplements. Dietary Supplements for Weight Loss — Fact Sheet for Consumers.',
        url: 'https://ods.od.nih.gov/factsheets/WeightLoss-Consumer/',
      },
    ],
    history: [
      {
        date: '2026-09-21',
        note: 'First published. Price and serving count checked against the Amazon listing on this date; the per-serving psyllium figure attributed to Forbes Health because no readable manufacturer panel could be found.',
      },
    ],
  },
];

export const productReviews: Review[] = products.map((p, index) => ({
  id: `editorial-product-${index + 1}`,
  product_name: p.name,
  title: p.name,
  slug: p.slug,
  category_slug: p.category,
  score: null,
  verdict: 'Manufacturer-label overview',
  summary: p.summary,
  body: `<h2>What this page covers</h2><p>This is a source-based product overview, not a hands-on test or a clinical endorsement. No effectiveness score has been assigned.</p><h2>Read the label</h2><p>${p.facts}</p><h2>Before use</h2><p>${p.caution}</p><h2>What to compare</h2><p>${p.takeaway}</p><h2>Sources and shopping</h2><p><a href="${p.source}" target="_blank" rel="noopener noreferrer">Manufacturer product information</a>${'sourceNote' in p && p.sourceNote ? ` — ${p.sourceNote}` : ' — the label figures above are taken from this page.'}</p><p>The commercial link on this page points to the ${p.listing} listing, checked against the manufacturer label above. Other pack sizes and strengths exist, so confirm the seller, strength and package size on arrival. Prices and stock change and are not quoted here.</p>`,
  pros: p.pros,
  cons: p.cons,
  ingredients: p.ingredients,
  faqs: p.faqs,
  affiliate_url: '',
  affiliate_network: '',
  product_price: 'Check current seller price',
  price_amount: null,
  currency: 'USD',
  third_party_tested: false,
  money_back_guarantee: 'Check seller return policy',
  featured_image_url: 'image' in p && p.image ? p.image : '',
  og_image_url: '',
  seo_title: p.name + ' — Label Overview',
  seo_desc: p.summary,
  is_published: true,
  published_at: 'published' in p && p.published ? p.published : '2026-09-20T00:00:00Z',
  updated_at: 'updated' in p && p.updated ? p.updated : '2026-09-20T00:00:00Z',
  who_for: p.whoFor,
  who_avoid: p.caution,
  score_breakdown: {},
  // The manufacturer page is the source every figure on the overview is taken
  // from, so it is cited rather than only linked inside the body copy.
  references:
    'references' in p && p.references
      ? p.references
      : [
          {
            id: `manufacturer-${p.slug}`,
            text: `${p.name} — manufacturer product information and Supplement Facts panel, the source of every figure on this page.`,
            url: p.source,
          },
        ],
  history:
    'history' in p && p.history
      ? p.history
      : [
          { date: '2026-09-20', note: 'First published as a manufacturer-label overview.' },
          {
            date: '2026-09-21',
            note: 'Ingredient rows linked to their evidence pages; commercial link changed from a keyword search to the verified listing.',
          },
        ],
}));

export const productAsins: Record<string, string> = Object.fromEntries(
  products.filter((p) => p.asin).map((p) => [p.slug, p.asin]),
);

export const editorialCollections: Collection[] = [
  {
    id: 'label-shortlist',
    kind: 'best_lists',
    title: 'How to build a supplement shortlist',
    slug: 'build-a-supplement-shortlist',
    summary: 'A practical selection method: purpose, disclosed amounts, evidence and total cost.',
    body: '<h2>Start with the question</h2><p>Write down the purpose before selecting a brand. A fibre powder, a relaxation formula and a vitamin have different jobs and should not compete for one best-product score.</p><h2>Build a comparable list</h2><p>Record the serving size, ingredient amounts, bottle count and cost per serving. Match the actual strength and form before comparing prices. Keep a link to the manufacturer label beside each entry.</p><h2>Check what is missing</h2><p>Ask whether a research citation concerns the finished formula. Record testing documents by batch and date. If a label hides individual doses, record that uncertainty.</p><h2>Read the product overviews</h2><p><a href="/fat-burners/now-psyllium-husk-powder">NOW Psyllium Husk Powder</a>, <a href="/nootropics/now-l-theanine-100-mg">NOW L-Theanine 100 mg</a> and <a href="/wellness/nature-made-vitamin-d3-1000-iu">Nature Made Vitamin D3 1000 IU</a> illustrate different label questions. This list is not a ranking.</p>',
  },
  {
    id: 'label-comparison',
    kind: 'comparisons',
    title: 'Compare supplements without mixing up doses',
    slug: 'compare-labels-and-serving-costs',
    summary:
      'Separate capsule count, daily serving and ingredient amount before deciding which listing offers value.',
    body: '<h2>Price per bottle misses the point</h2><p>Divide the bottle price by the number of labelled servings. A 60-capsule bottle taken two capsules at a time contains 30 servings. A 30-capsule bottle taken one at a time also contains 30. Delivery charges and subscription conditions still affect the final cost.</p><h2>Match the formula</h2><p>Compare the exact form, strength and ingredient list. A product containing L-theanine plus green tea is different from pure L-theanine. A vitamin D bottle with a different strength is a different comparison even if the packaging looks similar.</p><h2>Keep evidence separate</h2><p>A cheaper serving is not proof of better effectiveness. Compare the relevance of the research independently, then consider testing documentation and practical use. Mark unverified details clearly.</p><h2>Check the source</h2><p>Use the manufacturer information linked in each product overview and compare it with the package offered by the seller. Marketplace listing titles can combine variants.</p>',
  },
].map((row) => ({
  ...row,
  kind: row.kind as Collection['kind'],
  is_published: true,
  seo_title: row.title,
  seo_desc: row.summary,
  published_at: '2026-09-20T00:00:00Z',
  updated_at: '2026-09-20T00:00:00Z',
}));
