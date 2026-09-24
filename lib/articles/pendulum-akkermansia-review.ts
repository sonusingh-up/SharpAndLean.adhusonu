import type { ProductArticle } from './types';

export const pendulumAkkermansiaReview: ProductArticle = {
  slug: 'pendulum-akkermansia-review',
  name: 'Pendulum Akkermansia',
  brand: 'Pendulum',
  category: 'wellness',
  summary:
    'The first company to sell live Akkermansia muciniphila, with one of the cleanest labels in the supplement aisle — and a dose roughly 100 times below the amount used in the first randomised human trial of this organism, where the heat-killed form did more than the live one Pendulum sells.',
  verdict:
    'An honestly labelled bottle of a genuinely interesting organism, at a hundredth of the studied dose and roughly five times the price of a spec-identical generic',
  // Scored against the five published criteria on /evidence-grading.
  scoreBreakdown: {
    // The gut-lining and permeability claims carry the brand's own footnote:
    // "based on preclinical studies". The human numbers are uncontrolled
    // consumer surveys. The first randomised human trial of A. muciniphila got
    // its headline results from the pasteurised form, not the live one, and
    // found no effect on GLP-1 — which is the claim printed on the box.
    'Evidence for the marketed claim': 3,
    // 100 million AFU against the 10 billion bacteria a day used in Depommier
    // 2019, and against the 10 billion to 150 billion range across the human
    // literature. Two to three orders of magnitude below the studied amount.
    'Dose against the studied amount': 2,
    // One named strain with a designation, quantified; the prebiotic
    // quantified; four excipients named; no proprietary blend; the preclinical
    // caveat actually printed. Genuinely above average for this aisle. Marked
    // down for AFU without explaining what AFU is, and for two different
    // survey sizes given on the same page.
    'Label transparency': 7,
    // A 90-capsule bottle with the same 100 million AFU and more inulin sells
    // for $29.99. This one is $145 on subscription and $225 at list.
    'Value against the generic equivalent': 2,
    // A normal human gut commensal with real safety work behind it, and the
    // brand discloses the adjustment-period symptoms. It is still a live
    // organism, and there are populations where caution is warranted.
    'Safety and tolerability': 6,
  },
  seoTitle: 'Pendulum Akkermansia Review: Is It Worth $145?',
  seoDescription:
    'Pendulum Akkermansia is honestly labelled and 100x below the studied dose. What the key human trial found, and the $29.99 bottle with the same AFU count.',
  listing: '90 delayed-release capsules, 100 million AFU per capsule',
  image: '/images/pendulum-akkermansia.webp',
  resultImage: {
    src: '/images/pendulum-akkermansia-label.webp',
    alt: 'The Pendulum Akkermansia carton shown from three sides: the claims panel, the front panel and the Supplement Facts panel listing Akkermansia muciniphila WB-STR-0001 at 100 million AFU and chicory inulin at 276 mg.',
    caption:
      'The whole label in three panels. The Supplement Facts side is unusually clean for this aisle: one named strain, one quantified prebiotic, four excipients, no proprietary blend. The left panel is where the four headline claims sit — including "increases GLP-1 production", the one the human trial data does not support.',
  },
  affiliateUrl: 'https://sharpandlean.com/recommended/pendulum-akkermansia-probiotic',
  alternatives: ['calocurb-review', 'colonbroom-review-2026'],
  writtenBy: 'team',
  price: '$145 for 90 capsules on a 3-month subscription; $75 plus $10 shipping for 30 capsules one-time',
  guarantee: '30 days from first delivery, refunded minus shipping, with no need to return the product',
  thirdPartyTested: true,
  source: 'https://pendulumlife.com/products/pendulum-akkermansia-probiotic-gut-health',
  sourceNote:
    'Prices, claims, footnotes, survey sizes, refund terms and FAQ answers were read from the brand’s own product page on 24 September 2026. The Supplement Facts panel — Akkermansia muciniphila WB-STR-0001 at 100 million AFU, chicory inulin at 276 mg, and four excipients — was read from photographs of the carton. Directions, the star rating and the customer-review themes come from the Amazon.com listing for the 90-capsule pack, read the same day; from this connection that listing prices in rupees, so every dollar figure on this page comes from the brand’s US store instead.',
  marketplace: {
    source: 'Pendulum (3-month subscription)',
    price: 145,
    currency: 'USD',
    servings: 90,
    checkedAt: '2026-09-24',
  },
  body: `
<h2>Our take: the best label in the aisle, attached to the wrong dose</h2>
<p>Pendulum deserves credit before the criticism starts, because the criticism is heavy. This is a biotech company that solved a real technical problem — <em>Akkermansia muciniphila</em> is an oxygen-intolerant gut organism that is genuinely difficult to grow and stabilise, and Pendulum was first to put a live one in a capsule you can buy. The label is one of the cleanest we have examined: a single strain, named down to its designation, with a number next to it, a quantified prebiotic, four excipients and not a proprietary blend in sight. Most of this aisle cannot manage that.</p>
<p>The problem is arithmetic, and it is not close. Every capsule delivers 100 million AFU. The first randomised, placebo-controlled human trial of this organism — still the only one to test live against pasteurised — gave people 10 billion bacteria a day. That is a hundredfold gap, and the wider human literature runs up to 150 billion — so against the upper end of it, the gap is fifteen hundredfold.</p>
<p>It gets worse when you read which arm of that trial worked. Depommier and colleagues ran three groups for three months: live <em>A. muciniphila</em>, pasteurised (heat-killed) <em>A. muciniphila</em>, and placebo. The pasteurised arm improved insulin sensitivity by about 29 per cent and cut fasting insulin by about 34 per cent. The live arm improved an insulin-resistance score, but the headline results — insulin sensitivity against placebo, insulin levels, cholesterol, and the activity of an enzyme called DPP-IV — all came from the pasteurised arm. Pendulum sells the live one, and sells "live" as the feature.</p>
<p>And then there is the box. The carton in front of us lists four claims, one of which is "increases GLP-1 production". That same trial measured blood GLP-1 directly and found supplementation did not affect it. This is not a case of evidence being thin; it is a case of the single most relevant human measurement pointing the other way.</p>
<p>What you are left with is a well-made product with honest small print and a marketing layer that outruns it, priced at roughly five times what a bottle with the same AFU count costs. That combination is why this page scores 4.0 rather than 7.</p>

<h2>What is actually in the capsule</h2>
<p>From the carton: serving size one capsule, 90 servings per container. <strong>Akkermansia muciniphila WB-STR-0001, 100 million AFU.</strong> <strong>Chicory inulin, 276 mg.</strong> Other ingredients: hypromellose (vegetarian capsule), microcrystalline cellulose, l-leucine, silica. Non-GMO Project Verified. Manufactured for and distributed by Pendulum Therapeutics, San Francisco.</p>
<p>Directions on the Amazon listing: take one daily with food, store in a cool dry place away from excessive heat. The brand's own FAQ adds that refrigeration "is best though not required" — so it travels, and it is not a cold-chain product in the way some live probiotics are.</p>
<p>Two things on that panel are worth slowing down for.</p>
<p><strong>WB-STR-0001 is a real strain designation, and it has been in a published trial.</strong> That trial is Perraudeau and colleagues, 2020, in <em>BMJ Open Diabetes Research &amp; Care</em>: a multicentre, double-blind, placebo-controlled study of a formulation called WBF-011 in people with type 2 diabetes, reporting that its primary outcome — total glucose over three hours after a meal — improved against placebo by 36.1 mg/dL/180 min, at p = 0.0500, exactly on the conventional threshold, with A1C 0.6 points lower as a secondary outcome. Genuine work in a genuine journal, with a result at the very edge of significance. But WBF-011 is a <em>five</em>-strain formulation plus a prebiotic, and WB-STR-0001 is one of the five. The trial tells you what the blend did. It does not isolate what this strain did, and it is not a trial of this product. The study's authors were Pendulum employees, which does not invalidate a placebo-controlled design but is worth knowing.</p>
<p><strong>AFU is not CFU, and the label does not say so.</strong> CFU — colony forming units — counts cells that actually grow into colonies on a plate, and it is the long-standing standard for probiotics. AFU counts cells by flow cytometry that hold a fluorescent dye out, which indicates an intact membrane rather than a demonstrated ability to grow. There is a defensible reason to use it here: <em>Akkermansia</em> is awkward to culture, which is the whole reason it took a biotech company to commercialise it. But AFU counts run higher than CFU counts from the same sample, and the correlation between an AFU number and biological viability across a shelf life is not established. A reader comparing "100 million AFU" against "10 billion bacteria a day" in a trial is not comparing like with like, and the gap is more likely to be wider than narrower.</p>

<h2>The evidence, claim by claim</h2>
<p>Pendulum states four things on or around this product. Here is what sits behind each.</p>
<h3>"Fortifies the gut lining" and "reduces gut permeability"</h3>
<p>Both carry the brand's own asterisk: <em>*Based on preclinical studies.</em> Preclinical means animals and cell culture. We want to be fair here — printing that footnote is more honest than most of this aisle manages, and the underlying mechanism is coherent. <em>A. muciniphila</em> feeds on mucin, the protective layer over the gut wall, and in doing so appears to stimulate the gut to make more of it. That is the "reset, replenish, reinforce" story on the product page, and it is a reasonable reading of the animal work.</p>
<p>It is still animal work. A mechanism that holds in a mouse is a hypothesis about a human, not a result in one.</p>
<h3>"Increases GLP-1 production"</h3>
<p>This is the claim we would ask them to remove. It appears on the carton and in the Amazon listing title ("GLP-1 Support"), though notably <em>not</em> among the headline claims on the brand's own product page, which sticks to gut lining and permeability. That discrepancy is itself informative: the packaging is making a claim the website's own claim stack does not.</p>
<p>The Depommier trial measured plasma GLP-1 as an outcome. Supplementation did not significantly change it. That is the trial this whole category leans on, and it looked with a dose a hundred times larger than the one in this capsule.</p>
<p>There is a separate Pendulum product actually called GLP-1 Probiotic, which is a multi-strain formula. Whatever the merits of that one, the claim has migrated onto the single-strain carton, and the human data does not come with it.</p>
<h3>The percentages: 82%, 77%, 67%, 91%</h3>
<p>These are the numbers you see on the marketing graphics, and they are consumer surveys, which the brand does disclose in small print. Per the product page's own FAQ: a survey of 172 people over 12 weeks produced 82 per cent reporting improved bowel movements, 77 per cent improved gut health, 71 per cent reduced gas and bloating, and 67 per cent reduced diarrhoea. A separate survey of 86 people over three months produced 91 per cent reporting reduced overall food cravings and 86 per cent reduced sugar cravings.</p>
<p>A survey of people who chose to buy a product and knew they were taking it has no placebo group, no blinding and no objective measurement. It tells you what customers reported. It cannot separate the capsule from the expectation of the capsule, and for outcomes as suggestible as "cravings" and "gut health" that distinction is most of the question. Note also that the footnote under the cravings graphic says 80 people while the FAQ on the same page says 86 — a small inconsistency, but on a page where these are the only human numbers offered, small inconsistencies matter.</p>
<h3>"Recommended by more than 16,000 medical professionals" and "#1 GI doctor recommended"</h3>
<p>We cannot check either figure and neither is sourced on the page. Endorsement counts are not evidence about a product; they are evidence about a marketing programme.</p>

<h2>The price problem, with a specific number attached</h2>
<p>From the brand's US store on 24 September 2026:</p>
<ul>
<li><strong>One-time purchase:</strong> only a 1-month supply is offered — $75, plus $10 shipping. That is $85 for 30 capsules, about <strong>$2.83 a day</strong>.</li>
<li><strong>1-month subscription:</strong> $54 a month against a $75 list price. About <strong>$1.80 a day</strong>.</li>
<li><strong>3-month subscription:</strong> $145 billed every 90 days against a $225 list price. About <strong>$1.61 a day</strong> — the cheapest way in.</li>
</ul>
<p>Now the comparison that decides the value score. Codeage sells a 90-capsule Akkermansia bottle at <strong>100 million AFU</strong> per capsule with chicory inulin, in an enteric-coated capsule, for <strong>$29.99</strong> at Target. Same AFU count. Same prebiotic. More of it — 435 mg against 276 mg. Same 90 capsules. That is about <strong>33 cents a day</strong>.</p>
<p>Pendulum at its cheapest is 4.8 times that price. Bought once, it is 8.5 times.</p>
<p>The honest counter-argument is strain provenance: Codeage's is <em>A. muciniphila</em> AH39, Pendulum's is WB-STR-0001, and strains of the same species are not interchangeable — that principle is real and well established in probiotic science. Pendulum's strain has been in a published human trial and AH39 has not, as far as we can find. So there is something you are paying for.</p>
<p>What there is not is a trial showing that WB-STR-0001 at 100 million AFU outperforms AH39 at 100 million AFU, or outperforms nothing at all. In the absence of that, a reader is being asked to pay a 380 to 750 per cent premium for a difference nobody has measured. We score value against the generic equivalent, and by that test this is a 2.</p>
<p>We are not reviewing the Codeage product here and we are not recommending it — we have not researched it to the standard this site requires, and naming it is not an endorsement. It is a price benchmark, which is exactly what the value criterion needs.</p>

<h2>What customers actually report</h2>
<p>The Amazon listing for the 90-capsule pack carries 4.3 stars from 1,383 ratings, which sounds healthy until you look at the distribution: 71 per cent five-star and <strong>10 per cent one-star</strong>, with very little in between. That shape usually means a product that either does something noticeable for you or nothing at all, and Amazon's own review summary reads that way — some report gut-health improvements, others report stomach pain and nausea, and many note no noticeable results after a month of use. On value the summary is blunter than we would be: customers describing it as an expensive mistake, and saying they will not buy it again.</p>
<p>The most useful review on that page is a five-star one. A customer with a stool test showing depleted Akkermansia took this for a few months, retested, and the Akkermansia came back in range. That is a single uncontrolled anecdote and we would not build a claim on it — but it is the right <em>kind</em> of evidence for this product, because it measures the thing the capsule is supposed to change rather than how somebody felt. It also points at who this product makes sense for, which we come back to below.</p>

<h2>Safety: a live organism, and where caution applies</h2>
<p><em>A. muciniphila</em> is a normal resident of healthy human guts — more than 1 per cent of the bacteria in adult faeces — and it has real safety work behind it. The Depommier trial's primary endpoints were safety and tolerability, and it passed them. This is not a stimulant, a hormone or a novel chemical.</p>
<p>The brand is straightforward about the adjustment period: increased gas, bloating, nausea or loose stools in the first couple of weeks, usually resolving. That matches what the one-star Amazon reviews describe, and disclosing it up front is to Pendulum's credit.</p>
<p>Where we would add caution beyond what the brand says:</p>
<ul>
<li><strong>Inflammatory bowel disease.</strong> The organism's mechanism is degrading the mucin layer to stimulate replacement. In a gut where that barrier is already compromised, that logic is not obviously benign, and ConsumerLab flags exactly this concern. Ask a gastroenterologist first.</li>
<li><strong>Colorectal cancer, or elevated risk of it.</strong> Some research has found increased susceptibility associated with higher <em>Akkermansia</em> levels. The picture is genuinely unsettled, which is itself a reason for caution rather than against it.</li>
<li><strong>Parkinson's disease.</strong> Elevated <em>Akkermansia</em> has been repeatedly observed in people with Parkinson's. Whether that is cause, consequence or coincidence is not known.</li>
<li><strong>Multiple sclerosis.</strong> The literature here actively contradicts itself — elevated abundance has been proposed as a risk factor for CNS autoimmunity, while other work associates it with reduced disability. Nobody should be taking a position on this from a supplement label.</li>
<li><strong>Pregnancy and breastfeeding.</strong> Untested. The brand says so plainly, which is more than most do.</li>
<li><strong>Immunosuppression.</strong> Live organisms carry a different risk profile to pasteurised or inert products in anyone immunocompromised. This is a general probiotic caution, and it applies here with the word "live" printed on the front.</li>
</ul>
<p>None of these are reasons for a healthy adult to be alarmed. They are reasons for specific groups to ask a clinician rather than a product page.</p>

<h2>The dose defence, taken seriously</h2>
<p>Pendulum's implicit answer to the dose gap is that <em>Akkermansia</em> is a keystone strain that works by colonising and establishing itself, not by arriving in bulk — so you are seeding a population rather than delivering a payload, and 100 million live cells is plenty to seed with. That is a coherent argument and we do not want to strawman it.</p>
<p>Three things stop it settling the question. First, it is an argument, not a result: there is no published trial of this strain at this dose showing colonisation or a clinical outcome. Second, the trial evidence that does exist points the other way on the seeding logic, because the arm that did most was the <em>heat-killed</em> one, which cannot colonise anything — implying the benefit came from bacterial components rather than from a living population establishing itself. Third, AFU does not certify that the cells can grow, and growing is the entire premise of seeding.</p>
<p>If Pendulum ran a trial of this product at this dose against placebo, with a microbiome readout and a clinical endpoint, this page would change. They have the strain, the manufacturing and the money to do it. Until then the most defensible sentence about the dose is that nobody has shown it is enough.</p>

<h2>Who this is actually for</h2>
<p>There is a real use case here, and it is narrower than the marketing.</p>
<p>If you have had stool testing that specifically showed depleted <em>Akkermansia</em>, and you are working with a clinician or dietitian who wants to replenish it, then a single-strain product with a named designation, a quantified count, third-party testing and a published trial behind the strain is a rational thing to buy — and Pendulum is the most credible manufacturer in that small market. You have a measurable target and a way to retest. That is a completely different proposition from taking it on spec, and the best recent trial points the same way: a 2025 randomised trial of a different live strain in 58 people with type 2 diabetes found no benefit overall, but real reductions in weight, fat mass and HbA1c in those who started with low <em>Akkermansia</em> — and nothing in those who started high.</p>
<p>If you are buying it because you saw "GLP-1" on the box and want to lose weight, we would say plainly: buy something else, or nothing. The GLP-1 claim is the weakest thing on this label. Our <a href="/learn/glp-1">GLP-1 explainer</a> charts what the drugs and the best-evidenced supplement actually achieve, to scale, and this product does not appear on that chart because there is no human weight-loss trial of it to plot.</p>
<p>And if you are buying it for general gut health with no test and no specific deficiency, the fair summary is that you are paying $1.61 to $2.83 a day for an organism whose benefits in humans are, so far, a preclinical hypothesis and a customer survey.</p>

<h2>Before you buy: five things to check</h2>
<ol>
<li><strong>Which Pendulum product is it?</strong> Akkermansia, Metabolic Daily, Glucose Control and GLP-1 Probiotic are four different formulations at four different prices, and the trial people cite was run on the Glucose Control lineage, not on this one.</li>
<li><strong>Which pack?</strong> The 30-capsule and 90-capsule packs are sold side by side and the per-day cost differs by nearly half.</li>
<li><strong>Subscription or one-time?</strong> One-time is a 1-month pack only and adds $10 shipping. If you are trialling it, that trial costs $85, not $75.</li>
<li><strong>The refund window is 30 days from first delivery</strong>, refunded minus shipping, with no need to return the bottle. That is a fair policy, but 30 days is shorter than the 12 weeks their own surveys ran for — decide before the window closes, not when the bottle empties.</li>
<li><strong>Compare AFU to AFU.</strong> If another bottle says 500 million or 60 billion AFU, that is not automatically better and not automatically comparable, because different labs count differently. What it does mean is that 100 million is not a high number in this category.</li>
</ol>
`,
  whoFor:
    'Someone whose stool testing has specifically shown depleted Akkermansia, working with a clinician who wants it replenished and can retest — the one situation where a single-strain, named-designation, third-party-tested product is worth a premium over a generic.',
  whoAvoid:
    'Anyone buying it for weight loss or cravings on the strength of the GLP-1 claim on the box, which the human trial data does not support. Anyone with inflammatory bowel disease, colorectal cancer or a raised risk of it, or Parkinson’s disease, without a clinician’s view first. Anyone pregnant or breastfeeding — it is untested. Anyone immunosuppressed, because this is a live organism. And anyone who would not pay five times the price of a bottle with the same AFU count if the branding were removed.',
  pros: [
    'One of the cleanest Supplement Facts panels on this site — a single strain named to its designation, quantified, with the prebiotic quantified and no proprietary blend',
    'The preclinical basis for the gut-lining claims is actually footnoted on the page rather than hidden',
    'The strain, WB-STR-0001, has appeared in a published double-blind placebo-controlled trial in BMJ Open Diabetes Research & Care',
    'A real manufacturing achievement: stabilising a live oxygen-intolerant anaerobe in a shelf-stable capsule is genuinely hard',
    'Adjustment-period side effects, the absence of pregnancy data and the refund terms are all disclosed plainly',
    'Third-party tested, Non-GMO Project Verified, and no refrigeration required',
  ],
  cons: [
    '100 million AFU against the 10 billion bacteria a day used in the first randomised human trial — a hundredfold gap, and up to 1,500-fold against the wider literature',
    'In that trial the pasteurised form produced the headline results; the live form improved one insulin-resistance score',
    '"Increases GLP-1 production" is printed on the carton, and the same trial measured GLP-1 and found no effect',
    'A 90-capsule bottle with the same 100 million AFU and more inulin sells for $29.99; this is $145 on subscription and $225 at list',
    'The headline percentages are uncontrolled consumer surveys with no placebo group and self-reported outcomes',
    'The published trial credited to this strain was run on a five-strain blend, by authors employed by Pendulum',
    'AFU is presented as if it were CFU, with no explanation of the difference anywhere on the label',
    'Two different survey sizes are given for the cravings figure on the same product page — 80 in the footnote, 86 in the FAQ',
    '10 per cent of 1,383 Amazon ratings are one-star, with stomach pain, nausea and no noticeable effect the recurring themes',
  ],
  ingredients: [
    {
      name: 'Akkermansia muciniphila WB-STR-0001',
      dose: '100 million AFU per capsule',
      evidence_rating: 'weak',
      note: 'A real gut commensal with a serious research literature behind the species, and a named strain that has been through a published placebo-controlled trial — as one of five strains in a different product. The problem is the amount. Depommier 2019 gave 10 billion bacteria a day for three months; the wider human literature runs from 10 billion to 150 billion. This is 100 million, counted in AFU rather than CFU, which if anything overstates the comparison. The rating here is for this strain at this dose for these claims, not for the organism.',
    },
    {
      name: 'Chicory inulin',
      dose: '276 mg per capsule',
      evidence_rating: 'moderate',
      note: 'A well-studied prebiotic fibre, included to feed the strain. The evidence for inulin as a fibre is decent, but doses used in fibre research are measured in grams — typically 5 to 10 g a day — and this is a quarter of a gram. At 276 mg it is there to support the capsule’s own payload rather than to do anything measurable for you. It is also the ingredient most likely to be behind the first-fortnight gas and bloating.',
    },
    {
      name: 'Hypromellose, microcrystalline cellulose, l-leucine, silica',
      dose: 'Not quantified',
      evidence_rating: 'none',
      note: 'A vegetarian capsule shell, a bulking agent, a flow agent and an anti-caking agent. Standard, inert, and correctly listed as other ingredients. The hypromellose shell is doing delayed-release work, which matters for an organism that has to survive the stomach.',
    },
  ],
  faqs: [
    {
      question: 'Does Pendulum Akkermansia actually work?',
      answer:
        'For its marketed claims, that has not been shown in humans at this dose. The gut-lining and permeability claims carry the brand’s own footnote that they are based on preclinical — that is, animal and cell-culture — studies. The human percentages you see on the marketing are consumer surveys of 172 and 86 customers with no placebo group. The first randomised placebo-controlled human trial of this organism used 100 times the dose, and the pasteurised form did most of the work; the live form improved one insulin-resistance score. What does get reported consistently is narrower and more specific: people with depleted Akkermansia on stool testing seeing it come back into range.',
    },
    {
      question: 'Why is the dose only 100 million when trials used 10 billion?',
      answer:
        'Pendulum’s position is that Akkermansia is a keystone strain that colonises and establishes rather than needing to arrive in bulk, so a smaller live dose seeds a population. That is a coherent argument with no trial behind it. It is also undercut by the trial evidence itself: the arm that produced results used pasteurised, heat-killed bacteria, which cannot colonise anything — suggesting the benefit came from bacterial components rather than from a living population taking hold.',
    },
    {
      question: 'Does it increase GLP-1?',
      answer:
        'The carton says it does. The Depommier trial measured plasma GLP-1 directly and found supplementation did not affect it, at a hundred times this dose. That is the trial the category leans on. Note also that the claim appears on the packaging and in the Amazon listing title but not among the headline claims on Pendulum’s own product page, which stick to gut lining and permeability. If GLP-1 is why you are considering this, read our GLP-1 explainer first.',
    },
    {
      question: 'What is AFU, and is it the same as CFU?',
      answer:
        'No. CFU counts bacteria that actually grow into visible colonies on a plate, and it is the established standard for probiotics. AFU counts cells by flow cytometry that keep a fluorescent dye out, which shows an intact membrane rather than a demonstrated ability to grow. There is a fair reason to use it — Akkermansia is notoriously hard to culture — but AFU numbers run higher than CFU numbers from the same sample, and the link between an AFU count and real viability across a shelf life is not established. It means the gap between this label and the trial dose is more likely wider than narrower.',
    },
    {
      question: 'Is there a cheaper Akkermansia that is the same?',
      answer:
        'There is a cheaper one with the same numbers on the panel. Codeage sells 90 capsules at 100 million AFU with 435 mg of chicory inulin — more than the 276 mg here — for $29.99, about 33 cents a day against $1.61 to $2.83 here. The honest caveat is that they are different strains (AH39 against WB-STR-0001) and strains of one species are not interchangeable, so this is not a like-for-like swap. But nobody has published a trial showing WB-STR-0001 at this dose outperforms anything, so the premium is being charged for a difference that has not been measured. We have not reviewed the Codeage product and are not recommending it; it is here as a price benchmark.',
    },
    {
      question: 'What are the side effects?',
      answer:
        'The brand discloses an adjustment period of increased gas, bloating, nausea or loose stools in roughly the first 14 days, usually resolving. Amazon reviews bear that out, with stomach pain and nausea recurring in the 10 per cent of ratings that are one-star. Separately, caution is warranted — ask a clinician first — in inflammatory bowel disease, in colorectal cancer or raised risk of it, in Parkinson’s disease, in pregnancy and breastfeeding where it is untested, and in anyone immunosuppressed, since this is a live organism.',
    },
    {
      question: 'Does it need refrigerating?',
      answer:
        'No. The Amazon directions say to store in a cool dry place away from excessive heat, and the brand’s FAQ says refrigeration "is best though not required" and that you can travel with it. That is a genuine advantage over live probiotics that need a cold chain, and it is part of what the manufacturing process was built to achieve.',
    },
    {
      question: 'What does it cost per day?',
      answer:
        'On the 3-month subscription, $145 for 90 capsules is about $1.61 a day. On the 1-month subscription, $54 is about $1.80. Buying once is the expensive route: only a 30-capsule pack is offered one-time, at $75 plus $10 shipping, which is $85 for a month, or about $2.83 a day. List prices without a subscription are $75 and $225.',
    },
    {
      question: 'Is the refund policy any good?',
      answer:
        'It is reasonable, and worth understanding precisely. Thirty days from your first order delivery, full refund minus shipping and handling, and you do not need to return the product. The catch is the calendar: 30 days is shorter than the 12 weeks Pendulum’s own consumer surveys ran for, so if you are giving it a fair trial you will pass the refund deadline before you have the answer. Decide inside the window rather than when the bottle runs out. Orders shipped outside the United States are not eligible.',
    },
    {
      question: 'Is Pendulum a legitimate company?',
      answer:
        'Yes, and that is worth saying clearly given how critical this page is. It is a biotech company that solved a genuine technical problem, publishes in peer-reviewed journals, puts strain designations and real numbers on its labels, third-party tests, and prints its own preclinical caveats. Our criticisms are about dose, price and one specific claim on a carton — not about whether the bottle contains what it says.',
    },
  ],
  references: [
    {
      id: 'pendulum-product-page',
      text: 'Pendulum. Akkermansia product page — prices ($75 and $225 list, $54 and $145 on subscription, $10 shipping on one-time orders), the "based on preclinical studies" footnotes, the 172-person and 86-person consumer surveys, the refund terms and the storage and safety FAQ answers, read on 24 September 2026.',
      url: 'https://pendulumlife.com/products/pendulum-akkermansia-probiotic-gut-health',
    },
    {
      id: 'depommier-2019',
      text: 'Depommier C et al. (2019). Supplementation with Akkermansia muciniphila in overweight and obese human volunteers: a proof-of-concept exploratory study. Nature Medicine 25:1096-1103 — 40 enrolled, 32 completed, 10^10 bacteria daily for three months. Pasteurised A. muciniphila improved insulin sensitivity by 28.62 ± 7.02% (P = 0.002) and reduced insulinaemia by 34.08 ± 7.12% (P = 0.006); the live form significantly improved the insulin-resistance score but did not reproduce those results or the fall in DPP-IV activity; plasma GLP-1 did not change significantly and HbA1c was not modified.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/31263284/',
    },
    {
      id: 'zhang-2025',
      text: 'Zhang Y et al. (2025). Akkermansia muciniphila supplementation in patients with overweight/obese type 2 diabetes: efficacy depends on its baseline levels in the gut. Cell Metabolism 37(3):592-605 — 12 weeks, 58 participants, live strain AKK-WST01. No significant between-group difference overall; reductions in body weight, fat mass and HbA1c only in participants with low baseline A. muciniphila.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/39879980/',
    },
    {
      id: 'perraudeau-2020',
      text: 'Perraudeau F et al. (2020). Improvements to postprandial glucose control in subjects with type 2 diabetes: a multicenter, double blind, randomized placebo-controlled trial of a novel probiotic formulation. BMJ Open Diabetes Research & Care — the WBF-011 trial, a five-strain formulation including Akkermansia muciniphila WB-STR-0001, 76 participants over 12 weeks; the primary outcome, glucose total AUC, improved by 36.1 mg/dL/180 min against placebo at p = 0.0500, with A1C 0.6 lower as a secondary outcome. The authors were Pendulum employees.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/32675291/',
    },
    {
      id: 'afu-cfu-enumeration',
      text: 'NutraIngredients. The enumeration debate: CFU vs AFU and TFU in measuring Akkermansia muciniphila — AFU counts membrane-intact cells by flow cytometry rather than culturable colonies, AFU counts consistently exceed CFU counts from the same sample, and the correlation to biological viability over shelf life is not established. This piece is a sponsored promotional feature by a competing probiotic manufacturer, which we note because it has a commercial interest in the criticism.',
      url: 'https://www.nutraingredients.com/News/Promotional-features/probiotic-enumeration-for-akkermansia-muciniphila-products/',
    },
    {
      id: 'consumerlab-akkermansia',
      text: 'ConsumerLab. Akkermansia muciniphila: safety and health benefits — research doses ranging from 10 billion to 150 billion cells daily, and cautions for inflammatory bowel disease, colorectal cancer risk and Parkinson’s disease.',
      url: 'https://www.consumerlab.com/answers/akkermansia-muciniphila-health-benefits-and-safety/akkermansia-muciniphila/',
    },
    {
      id: 'codeage-target',
      text: 'Codeage Akkermansia muciniphila AH39, 100 million AFU with 435 mg chicory inulin, 90 capsules — $29.99 at Target, read on 24 September 2026. Used here as a price benchmark for the value criterion, not as a recommendation; this site has not reviewed it.',
      url: 'https://www.target.com/p/codeage-akkermansia-muciniphila-100-million-afu-daily-synbiotic-probiotic-prebiotic-chicory-inulin-90ct/-/A-90928113',
    },
    {
      id: 'pendulum-amazon',
      text: 'Pendulum Akkermansia, 90 Capsules — Amazon.com listing. The directions ("take 1 daily with food"), the "GLP-1 Support" title claim, the 4.3 rating across 1,383 ratings with 10% one-star, and the customer-review themes, read on 24 September 2026.',
      url: 'https://www.amazon.com/Pendulum-Akkermansia-Probiotic-Prebiotic-Fiber/dp/B0CGJWF7SN',
    },
    {
      id: 'fda-supplements-pa',
      text: 'US Food and Drug Administration. Questions and answers on dietary supplements — supplements are not approved by the FDA for safety or effectiveness before sale.',
      url: 'https://www.fda.gov/food/information-consumers-using-dietary-supplements/questions-and-answers-dietary-supplements',
    },
  ],
  history: [
    {
      date: '2026-09-24',
      note: 'First published. Scored 4.0 out of 10. The label transparency mark of 7 is among the higher marks on this site and is genuinely earned. It is pulled down by a dose mark of 2 — 100 million AFU against the 10 billion bacteria a day used in the first randomised human trial — and a value mark of 2, because a 90-capsule bottle with the same AFU count and more inulin sells for $29.99 against $145 here.',
    },
    {
      date: '2026-09-24',
      note: 'The "increases GLP-1 production" claim on the carton is contradicted by the Depommier trial, which measured plasma GLP-1 and found no effect at a hundred times this dose. We note that this claim appears on the packaging and the Amazon listing title but not among the headline claims on Pendulum’s own product page.',
    },
    {
      date: '2026-09-24',
      note: 'Label figures were read from photographs of the carton rather than from a published panel we could open ourselves. From this connection Amazon.com prices in rupees, so every dollar figure comes from Pendulum’s US store, and the Codeage benchmark from Target.',
    },
    {
      date: '2026-09-24',
      note: 'Corrected two overstatements about the Depommier 2019 trial after reading its full text rather than the abstract. The live form was not ineffective: it significantly improved an insulin-resistance score, though the headline results (insulin sensitivity against placebo, insulin levels, cholesterol and DPP-IV activity) came from the pasteurised form. And it is the first randomised human trial of the organism, not the only one — a 2025 Cell Metabolism trial of a different live strain is now cited. The GLP-1 finding is confirmed by the full text. The WBF-011 trial is now quoted from its abstract — a primary outcome at p = 0.0500 — rather than the 33 per cent figure from press coverage. The score is unchanged.',
    },
  ],
  published: '2026-09-24T00:00:00Z',
  updated: '2026-09-24T00:00:00Z',
};
