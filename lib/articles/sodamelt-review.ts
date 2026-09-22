import type { ProductArticle } from './types';

export const sodameltReview: ProductArticle = {
  slug: 'sodamelt-review',
  name: 'SodaMelt',
  brand: 'SodaMelt',
  category: 'fat-burners',
  summary:
    'Sold as a daily “metabolic wellness” capsule for bloating, and built on a proprietary blend containing cascara sagrada, buckthorn and Chinese rhubarb — three stimulant laxatives — on a page that promises no harsh laxatives and recommends taking it every day for three to six months.',
  verdict:
    'The page tells you what this does if you read the ingredient list rather than the headline, and the usage advice does not match the formula',
  // Scored against the five published criteria on /evidence-grading.
  scoreBreakdown: {
    // Psyllium is genuinely well evidenced for regularity, which keeps this off the
    // floor. Nothing here supports "metabolic wellness", and NCCIH finds no evidence
    // that goldenseal is useful for any health condition.
    'Evidence for the marketed claim': 2,
    // An explicit proprietary blend. Twelve ingredients, no amount published for any
    // of them, in a single daily capsule.
    'Dose against the studied amount': 1,
    // No Supplement Facts panel with quantities anywhere on the page, and the blend
    // is named as a blend rather than broken out.
    'Label transparency': 1,
    // $2.97 a day at the single-bottle price for a blend whose plainest equivalents —
    // psyllium, or a pharmacy stimulant laxative — cost pennies per dose.
    'Value against the generic equivalent': 1,
    // The page says "non-habit-forming" and advises daily use for three to six
    // months, while the formula contains several stimulant laxatives. Cramping,
    // dependency and electrolyte loss are not mentioned, and the goldenseal
    // interaction is not flagged. The generic "consult your physician" line is the
    // only thing keeping this off 0.
    'Safety and tolerability': 2,
  },
  seoTitle: 'SodaMelt Review 2026: Is It Just a Laxative Blend?',
  seoDescription:
    'SodaMelt is sold for bloating and metabolic wellness. Its blend holds three stimulant laxatives, no doses — and it says take one every day for months.',
  listing: '30 capsules, one-month supply',
  image: '/images/sodamelt.webp',
  affiliateUrl: 'https://sharpandlean.com/recommended/sodamelt',
  alternatives: ['colonbroom-review-2026', 'slimset-review'],
  writtenBy: 'team',
  price: '$89 for 30 capsules, or $49 a bottle on the six-bottle pack',
  guarantee: '60-day money-back guarantee, empty bottles accepted',
  thirdPartyTested: false,
  source: 'https://sodamelt.com/funnelb3/',
  sourceNote:
    'Every figure, ingredient and quotation on this page was read from the product’s own sales page on 22 September 2026. There is no retailer listing to cross-check against; the page names BuyGoods as the retailer and states that its role “does not constitute an endorsement, approval or review of this product”.',
  body: `
<h2>Our take: read the ingredient list before the headline</h2>
<p>SodaMelt is sold as a “Natural Metabolic Wellness Formula for a Lighter, More Balanced Body”, aimed at people who feel bloated after meals. One vegetable capsule a day, 20 to 30 minutes before a meal, with a glass of water. It is a pleasant, unthreatening pitch.</p>
<p>The ingredient list is a different document. Alongside psyllium husk and a probiotic, the proprietary blend contains cascara sagrada bark, buckthorn bark and Chinese rhubarb root. Those three are anthraquinone stimulant laxatives — the class of ingredient that works by prompting the bowel to contract. The page’s own description of cascara sagrada says so in softer words: “a botanical with centuries of traditional use in encouraging natural bowel elimination”.</p>
<p>Two sentences on that page sit badly against that formula. The first is the promise of “a simple daily ritual, without harsh laxatives or complicated routines”. The second is the FAQ advice that “most people use SodaMelt consistently for at least 3 to 6 months”. Daily stimulant laxative use over three to six months is not what these ingredients are conventionally used for, and the page nowhere mentions cramping, dependency or electrolyte loss.</p>
<p>That is the review. If you are bloated and want a fibre supplement, psyllium on its own is cheap, well evidenced and sold with its dose printed on the tub. What is being sold here is that, plus a stimulant laxative stack you cannot measure, at $2.97 a day.</p>
<p>This is a desk review of a sales page and published sources. Nobody here has bought or taken this product, and no independent listing exists to check the page against.</p>

<h2>What is actually in the capsule</h2>
<p>The page names twelve ingredients: psyllium husk, cascara sagrada (bark), aloe vera (leaf), oat (straw), Chinese rhubarb (root), scabrous gentian (root), goldenseal (root), buckthorn (bark), bentonite, <em>Lactobacillus acidophilus</em>, alfalfa (herb) and calcium as calcium carbonate. The capsule itself is hypromellose, with rice flour, magnesium stearate and silicon dioxide as other ingredients.</p>
<p>Crucially, these are described as a <strong>proprietary blend</strong>. No milligram amount is published for any of the twelve, and no Supplement Facts panel appears anywhere on the page. That matters more here than in most products, because the ingredients in this list do very different things at very different amounts, and several of them are active in small quantities.</p>
<p>Group them and the formula becomes legible. Psyllium husk is a bulk-forming fibre with real evidence behind it — our <a href="/ingredients/psyllium-husk">psyllium husk evidence page</a> covers what it does and does not do. Cascara sagrada, buckthorn and Chinese rhubarb are stimulant laxatives. Aloe vera is ambiguous as listed: the inner-leaf gel is not a laxative, while the latex from just under the leaf skin very much is, and “Aloe Vera (Leaf)” does not tell you which is in the bottle. Bentonite is an adsorbent clay. <em>L. acidophilus</em> is a probiotic with neither a strain designation nor a colony count. Oat straw, scabrous gentian and alfalfa are filler botanicals with no quantity attached. Calcium carbonate is a mineral and a common tablet base.</p>
<p>So the answer to “what does this do” is not mysterious. A fibre, several laxatives, a clay and a probiotic, in unknown proportions.</p>

<h2>The laxatives, and what the FDA actually decided about two of them</h2>
<p>This is the part of the page a buyer most needs and is least likely to find, so it is worth setting out carefully and without overstating it.</p>
<p>In a final rule published on 9 May 2002 and effective from 5 November that year, the FDA determined that aloe and cascara sagrada were <strong>not generally recognised as safe and effective</strong> as stimulant laxatives in over-the-counter drug products. The ruling named cascara sagrada bark, its extracts and fluidextracts, and casanthranol, along with aloe and its extracts. The reason was not a finding of harm: the agency had reclassified these ingredients and asked manufacturers for mutagenicity, carcinogenicity and genotoxicity data, and the data were not submitted. Products containing them had to be reformulated or discontinued.</p>
<p>Now the qualification, which is just as important. That rule covers over-the-counter <em>drug</em> products. It does not cover dietary supplements, which are regulated under a different framework and are not approved by the FDA for safety or effectiveness before sale. So cascara sagrada in a supplement is entirely legal, and nothing about its presence here is a violation of anything.</p>
<p>What it does mean is this: the FDA asked for safety data on these ingredients as laxatives, did not get it, and removed them from the shelf where they were sold as laxatives. They remain available in supplements sold for what is recognisably the same purpose. A reader deciding whether to take one daily for three to six months deserves to know that, and the page does not say it.</p>
<p>Buckthorn and Chinese rhubarb were not named in that rule, but they belong to the same anthraquinone class and work the same way. Stimulant laxatives as a group are conventionally used briefly rather than continuously, and prolonged use is the context in which dependency is discussed.</p>

<h2>Two claims that do not sit together</h2>
<p>The page states, twice, that every ingredient is “non-habit-forming”. It also recommends, in the FAQ, that “most people use SodaMelt consistently for at least 3 to 6 months”, and the six-bottle package exists to make that easy — 180 capsules bought at once.</p>
<p>We are not going to tell you that this product will cause dependency, because that would require knowing how much of each laxative is in a capsule, and the blend does not say. What we will say is that “non-habit-forming” is a strong, unqualified reassurance to place on a formula built around stimulant laxatives, and that the dependency question is precisely the one a reader should be able to resolve from the label. The proprietary blend is what stops them.</p>
<p>The same gap swallows the ordinary side-effect discussion. Cramping, urgency, loose stools and electrolyte loss are the predictable consequences of this class of ingredient, and none of them appears anywhere on the page. Nor does any suggestion that use should be limited in duration — the advice runs the other way.</p>

<h2>Goldenseal, bentonite, and the medicines you already take</h2>
<p>Two ingredients here interact with medication in ways the page does not mention, and both deserve a sentence.</p>
<p>Goldenseal is the more concerning. The US National Center for Complementary and Integrative Health states that there is not enough evidence to determine whether goldenseal is useful for any health condition, and that no rigorous studies have evaluated its effects on health conditions in people. It also reports that levels of metformin — the most commonly prescribed diabetes medicine — decreased by about 25 per cent in healthy adults given goldenseal extract alongside it. A product sold for “metabolic wellness” is likely to reach people taking metformin, and a 25 per cent reduction in a diabetes medicine is not a footnote. NCCIH also advises that goldenseal should not be used in pregnancy or breastfeeding, or given to infants.</p>
<p>Bentonite is an adsorbent clay, which is the point of including it and also the problem: adsorbents bind things, and what they bind includes medicines taken around the same time. Separating doses is the standard precaution, and the page gives no timing guidance at all beyond taking the capsule before a meal.</p>
<p>The page’s only warning is the generic one: “If you are pregnant, nursing, taking medication, or have a medical condition, consult your physician before using our products.” That sentence is doing an enormous amount of work for a twelve-ingredient blend containing several laxatives, a known enzyme-interacting botanical and a binder. If you take any regular medicine, take the bottle to a pharmacist rather than relying on it.</p>

<h2>Price, and a figure that does not reconcile</h2>
<p>One bottle is $89, reduced from $99, plus shipping. Three bottles are $177, billed as $59 each, reduced from $447. Six bottles are $294, billed as $49 each, reduced from $894, with free US shipping. Three digital bonuses are included, with a claimed value of $141.</p>
<p>That is $2.97 a day for one bottle, $1.97 across three and $1.63 across six. The cheapest rate needs six months paid upfront, which is also the duration the FAQ recommends.</p>
<p>The savings maths does not reconcile, in exactly the way it does not on the SlimSet page. The single-bottle offer sets the regular price at $99. The three-bottle “was” price of $447 and the six-bottle “was” price of $894 both work out at $149 a bottle. The same bottle cannot regularly cost $99 and $149, and the larger figure is the one used to generate the headline saving. For what it is worth, both products list the same postal address — PO Box 12730, Ogden, UT 84412 — and use an identical price ladder.</p>
<p>Against that, consider what the plainest equivalents cost. Psyllium husk is sold by the tub with its dose printed on it, for pennies a serving; our <a href="/fat-burners/colonbroom-review-2026">ColonBroom review</a> works through that comparison for a flavoured psyllium product. A pharmacy stimulant laxative, with its active and its amount on the box and a duration limit on the label, costs less again.</p>

<h2>The guarantee, and what the page does get right</h2>
<p>Credit where it is due, because the refund terms here are better stated than on most pages of this kind. The guarantee is 60 days and the wording is specific about the thing that usually causes arguments: “just send back the bottles, even empty ones, and we’ll refund every penny. No questions asked.” Accepting empty bottles is a real commitment and it is unusual to say so.</p>
<p>It still does not say who pays return postage, or whether the 60 days run from order or delivery — worth asking before buying six bottles against a 60-day window. The page also states clearly that the order is “a single one-time payment. No subscriptions, no auto-shipments, and no hidden fees — ever”, which matters in a category where rebilling is a common complaint.</p>
<p>The page states the product is made in the USA in an FDA-registered, GMP-certified facility, and that the ingredients are non-GMO and gluten-free. Facility registration describes manufacturing conditions, not an assessment of the product, and the FDA does not approve supplements for safety or effectiveness before sale. No third-party testing or batch certificate is mentioned.</p>

<h2>Sources and shopping: what to ask before you order</h2>
<p>If you are considering this, the single most useful thing you can do is ask the company for a photograph of the Supplement Facts panel with the milligram amount of every ingredient in the proprietary blend. That panel exists on the bottle. Until you have seen it, you cannot know how much cascara sagrada, buckthorn or rhubarb you would be taking daily for three to six months, and neither can we.</p>
<p>Then ask a pharmacist, not the company, about the interaction question — specifically if you take metformin, any regular medicine, or anything where timing matters. Bring the ingredient list. That conversation takes five minutes and is worth more than anything on this page.</p>
<p>Our commercial link is <a href="https://sharpandlean.com/recommended/sodamelt">our SodaMelt link</a>. It earns a commission at no extra cost to you, and it has not moved the 1.4 above — which is the lowest score published on this site, and is what the five criteria produce for a proprietary blend of stimulant laxatives sold for daily use with no amounts disclosed and no side effects mentioned.</p>
<p>The fair summary: there is nothing exotic or unknowable about these ingredients. They are well-characterised botanicals, several of them laxatives, and the problem is not that they are mysterious but that the page describes them as something else and will not tell you how much you are getting. If the bloating is the real issue, a plain psyllium product and a conversation with a pharmacist will cost you less and tell you more.</p>
`,
  whoFor:
    'We cannot identify anyone from the published information. Someone who wants a fibre supplement should buy plain psyllium with its dose printed on it. Someone who needs a laxative should buy one labelled as a laxative, with its active ingredient, its amount and its duration limit on the box.',
  whoAvoid:
    'Anyone taking metformin or any regular medicine, because of the goldenseal interaction and the binding effect of bentonite. Anyone pregnant or breastfeeding — NCCIH advises against goldenseal specifically. Anyone intending to follow the page’s advice and take it daily for three to six months without first seeing how much stimulant laxative is in a capsule.',
  pros: [
    'Psyllium husk is listed first and is a genuinely well-evidenced fibre for regularity',
    'The refund terms are unusually specific: 60 days, and empty bottles are explicitly accepted',
    'The page states plainly that the order is a one-time payment with no subscriptions or auto-shipments',
    'The full ingredient list is published, even though the amounts are not',
  ],
  cons: [
    'An explicit proprietary blend: twelve ingredients and no milligram amount for any of them',
    'Contains cascara sagrada, buckthorn and Chinese rhubarb — three stimulant laxatives — on a page promising “without harsh laxatives”',
    'Recommends daily use for at least three to six months, which is not how stimulant laxatives are conventionally used',
    'States every ingredient is “non-habit-forming” without qualification',
    'No mention anywhere of cramping, urgency, dependency or electrolyte loss',
    'Goldenseal reduced metformin levels by about 25 per cent in the research NCCIH cites, and the page does not flag it',
    'The single-bottle regular price is $99, but the multi-bottle savings are calculated from $149 a bottle',
  ],
  ingredients: [
    {
      name: 'Psyllium husk',
      dose: 'Not disclosed (proprietary blend)',
      evidence_rating: 'strong',
      note: 'The one ingredient here with a solid evidence base, and it is for regularity rather than metabolism. The rating describes psyllium generally, not this product. Research doses are measured in grams, which a single capsule containing eleven other ingredients cannot deliver.',
    },
    {
      name: 'Cascara sagrada (bark)',
      dose: 'Not disclosed (proprietary blend)',
      evidence_rating: 'weak',
      note: 'An anthraquinone stimulant laxative. The page describes it as “encouraging natural bowel elimination”. The FDA determined in 2002 that cascara sagrada was not generally recognised as safe and effective as a stimulant laxative in over-the-counter drug products, after requested toxicity data were not submitted. That ruling does not cover supplements.',
    },
    {
      name: 'Buckthorn (bark)',
      dose: 'Not disclosed (proprietary blend)',
      evidence_rating: 'weak',
      note: 'A second anthraquinone stimulant laxative, in the same class as cascara and working the same way. The page gives it no description at all — it appears only in the list of what the proprietary blend “also includes”.',
    },
    {
      name: 'Chinese rhubarb (root)',
      dose: 'Not disclosed (proprietary blend)',
      evidence_rating: 'weak',
      note: 'A third anthraquinone laxative. Three ingredients from the same class in one capsule, with no amounts, makes the total laxative load impossible for a buyer to estimate.',
    },
    {
      name: 'Aloe vera (leaf)',
      dose: 'Not disclosed (proprietary blend)',
      evidence_rating: 'weak',
      note: 'Ambiguous as listed. Inner-leaf gel is not a laxative; the latex just under the leaf skin is, and the FDA’s 2002 ruling covered aloe as a stimulant laxative in OTC drugs. “Aloe Vera (Leaf)” does not distinguish between them, and in a laxative-led formula the distinction is the whole question.',
    },
    {
      name: 'Goldenseal (root)',
      dose: 'Not disclosed (proprietary blend)',
      evidence_rating: 'none',
      note: 'NCCIH states there is not enough evidence to determine whether goldenseal is useful for any health condition, and that no rigorous human studies have been done. It also reports metformin levels falling about 25 per cent when goldenseal was taken alongside it, and advises against use in pregnancy, breastfeeding and infants.',
    },
    {
      name: 'Bentonite',
      dose: 'Not disclosed (proprietary blend)',
      evidence_rating: 'none',
      note: 'An adsorbent clay. Adsorbents bind what is in the gut with them, including medicines taken at the same time, which is why dose separation is the usual precaution. The page offers no timing guidance beyond taking the capsule before a meal.',
    },
    {
      name: 'Lactobacillus acidophilus',
      dose: 'Not disclosed, and no strain or colony count given',
      evidence_rating: 'none',
      note: 'Probiotic evidence is strain-specific, and a species name is not a strain. Without a strain designation, a colony-forming-unit count and a viability guarantee at end of shelf life, there is nothing here to evaluate.',
    },
    {
      name: 'Oat (straw), scabrous gentian (root), alfalfa (herb), calcium carbonate',
      dose: 'Not disclosed (proprietary blend)',
      evidence_rating: 'none',
      note: 'The remainder of the blend, with no individual descriptions on the page and no amounts. Calcium carbonate is a mineral and a common tablet base; the three botanicals have no established role at any amount this capsule could contain.',
    },
  ],
  faqs: [
    {
      question: 'Is SodaMelt a laxative?',
      answer:
        'The page does not use that word about itself — it promises “a simple daily ritual, without harsh laxatives”. But the blend contains cascara sagrada, buckthorn and Chinese rhubarb, which are anthraquinone stimulant laxatives, and possibly aloe latex depending on which part of the leaf is used. The page’s own description of cascara sagrada is that it encourages “natural bowel elimination”. Judge the formula by the ingredients rather than the framing.',
    },
    {
      question: 'Will it make me lose weight?',
      answer:
        'Nothing in this formula addresses body fat. Laxatives move stool and water, and any change on the scale from that is neither fat loss nor durable. The page is careful not to promise weight loss outright — it talks about feeling “lighter” and about “metabolic wellness” — but the distinction between feeling lighter and being lighter is the one worth holding on to.',
    },
    {
      question: 'Is it safe to take every day for three to six months?',
      answer:
        'That is what the FAQ recommends, and it is the part of the page we would question hardest. Stimulant laxatives are conventionally used briefly rather than continuously, and prolonged use is the context in which dependency, cramping and electrolyte loss are discussed. None of those appear anywhere on the page. Because the blend is proprietary, you cannot tell how much of each laxative a capsule contains — which is exactly the information needed to answer this question.',
    },
    {
      question: 'What did the FDA decide about cascara sagrada and aloe?',
      answer:
        'In a final rule effective 5 November 2002, the FDA determined that aloe and cascara sagrada were not generally recognised as safe and effective as stimulant laxatives in over-the-counter drug products, after it requested mutagenicity, carcinogenicity and genotoxicity data from manufacturers and did not receive it. Products had to be reformulated or discontinued. That rule applies to OTC drugs, not to dietary supplements, so their presence here is legal — but the reason they left the drug shelf is worth knowing.',
    },
    {
      question: 'Can I take it with my medication?',
      answer:
        'Ask a pharmacist, and take the ingredient list with you. Two ingredients specifically warrant the question: goldenseal, which NCCIH reports reduced metformin levels by about 25 per cent, and bentonite, an adsorbent clay that can bind medicines taken around the same time. The page’s only guidance is a generic line about consulting your physician if you take medication.',
    },
    {
      question: 'Why is this the lowest-scoring product on the site?',
      answer:
        'Because four of the five criteria depend on information the page does not publish, and the fifth is where the formula and the marketing disagree. There are no amounts for any of twelve ingredients, so dose and transparency both score 1. Value cannot be calculated and the plain equivalents cost pennies. The safety mark is 2 rather than lower only because the page does carry a generic advice-to-consult line.',
    },
    {
      question: 'Is the refund guarantee any good?',
      answer:
        'The wording is better than most: 60 days, and “send back the bottles, even empty ones”. Accepting empties removes the usual argument. It does not say who pays return postage or whether the 60 days run from order or delivery, which is worth clarifying in writing before buying a six-bottle pack — that is 180 days of product against a 60-day window.',
    },
    {
      question: 'What should I take instead for bloating?',
      answer:
        'That depends on the cause, which is the honest answer and also why a pharmacist or GP is the right first stop — persistent bloating has a differential that a supplement does not address. If you want a fibre supplement, plain psyllium husk is inexpensive, well evidenced for regularity and sold with its dose printed on the tub, which is everything this blend is not.',
    },
  ],
  references: [
    {
      id: 'sodamelt-page',
      text: 'SodaMelt official sales page — the source of every price, ingredient, claim, direction, warning and guarantee quoted here, read on 22 September 2026.',
      url: 'https://sodamelt.com/funnelb3/',
    },
    {
      id: 'fda-2002-laxatives',
      text: 'US Food and Drug Administration. Status of Certain Additional Over-the-Counter Drug Category II and III Active Ingredients, final rule, Federal Register 9 May 2002, effective 5 November 2002 — aloe and cascara sagrada determined not generally recognised as safe and effective as OTC stimulant laxatives after requested toxicity data were not submitted.',
      url: 'https://www.federalregister.gov/documents/2002/05/09/02-11510/status-of-certain-additional-over-the-counter-drug-category-ii-and-iii-active-ingredients',
    },
    {
      id: 'mskcc-aloe-cascara',
      text: 'Memorial Sloan Kettering Cancer Center. FDA rules that aloe and cascara are not safe as stimulant laxatives — the ingredients named, the reason, and the requirement to reformulate or discontinue within 180 days.',
      url: 'https://www.mskcc.org/cancer-care/diagnosis-treatment/symptom-management/integrative-medicine/herbs/news-alerts/fda-rules-aloe-cascara-are-not-safe-stimulant-laxatives',
    },
    {
      id: 'nccih-goldenseal',
      text: 'National Center for Complementary and Integrative Health. Goldenseal — no rigorous human studies and insufficient evidence for any health condition; metformin levels fell about 25 per cent when taken with goldenseal extract; not for use in pregnancy, breastfeeding or infants.',
      url: 'https://www.nccih.nih.gov/health/goldenseal',
    },
    {
      id: 'fda-supplements-sm',
      text: 'US Food and Drug Administration. Questions and answers on dietary supplements — supplements are not approved by the FDA for safety or effectiveness before sale, and facility registration is not product approval.',
      url: 'https://www.fda.gov/food/information-consumers-using-dietary-supplements/questions-and-answers-dietary-supplements',
    },
  ],
  history: [
    {
      date: '2026-09-22',
      note: 'First published. Scored 1.4 out of 10 against the five published criteria, the lowest on this site. The marks reflect an explicit proprietary blend covering twelve ingredients with no amounts, and a formula containing three stimulant laxatives sold on a page that promises no harsh laxatives, recommends daily use for three to six months, describes every ingredient as non-habit-forming, and does not mention cramping, dependency or electrolyte loss anywhere.',
    },
    {
      date: '2026-09-22',
      note: 'All product figures, ingredients and quotations read from the company’s own sales page on this date; no retailer listing exists to cross-check against. The FDA position on aloe and cascara sagrada was taken from the 2002 final rule and confirmed against Memorial Sloan Kettering’s summary; the goldenseal findings are NCCIH’s. If a Supplement Facts panel showing amounts is supplied, this page will be updated and the dose and transparency scores revisited.',
    },
  ],
  published: '2026-09-22T00:00:00Z',
  updated: '2026-09-22T00:00:00Z',
};
