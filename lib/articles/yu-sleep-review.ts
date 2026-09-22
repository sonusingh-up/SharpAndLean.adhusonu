import type { ProductArticle } from './types';

export const yuSleepReview: ProductArticle = {
  slug: 'yu-sleep-review',
  name: 'Yu Sleep',
  brand: 'Yu Sleep',
  category: 'wellness',
  summary:
    'Nano-emulsified sleep drops built on a sensible idea — 0.9 mg of melatonin rather than the usual megadose — and sold on a 3,400-person study with no name, a 67 per cent weight-loss statistic with no source, and a formula containing 5-HTP with no warning of any kind attached to it.',
  verdict:
    'The melatonin dose is the most sensible thing on the page, and everything around it is asserted rather than shown',
  // Scored against the five published criteria on /evidence-grading.
  scoreBreakdown: {
    // Low-dose melatonin has real evidence for sleep timing, and L-theanine and
    // magnesium are reasonable inclusions. None of that supports "resets your
    // sleep pressure system" or the weight-loss claim, and NCCIH notes guidelines
    // lack sufficient evidence to recommend melatonin for chronic insomnia.
    'Evidence for the marketed claim': 3,
    // Melatonin at 0.9 mg is disclosed and is genuinely a well-chosen amount.
    // The other nine ingredients have no quantity at all.
    'Dose against the studied amount': 2,
    // No Supplement Facts panel, no bottle volume, no servings per bottle and no
    // dropper volume. You cannot work out what a dose is or how long a bottle
    // lasts from anything published.
    'Label transparency': 1,
    // $2.30 a day on the smallest package, for a formula whose disclosed active
    // costs pennies. Cost per serving cannot be calculated at all.
    'Value against the generic equivalent': 2,
    // Contains 5-HTP, and we could find no warning anywhere on the page — not
    // about antidepressants, not about pregnancy, not about driving. Every
    // authoritative source on 5-HTP says that first conversation belongs with a
    // doctor.
    'Safety and tolerability': 1,
  },
  seoTitle: 'Yu Sleep Review 2026: Does It Work, and Where’s the Study?',
  seoDescription:
    'Yu Sleep gets the melatonin dose right at 0.9 mg. Then it cites a 3,400-person study with no name, and puts 5-HTP in the bottle with no warning at all.',
  listing: 'Sleep drops, bottle size and servings not disclosed',
  // Cropped from the supplied promotional graphic to the bottles alone: the
  // original carried the seller's money-back badge and its payment-processor
  // line, which do not belong inside this site's own product card.
  image: '/images/yu-sleep.webp',
  affiliateUrl: 'https://sharpandlean.com/recommended/yu-sleep',
  // Nothing here is comparable yet: the only other sleep-adjacent page is a label
  // overview, and a comparison card must lead to a full review. An explicit empty
  // list says so, rather than letting the category fallback offer whey protein.
  alternatives: [],
  writtenBy: 'team',
  price: '$138 for a two-month package, down to $49 a month on the six-month',
  guarantee: '60-day money-back guarantee stated on the sales page',
  thirdPartyTested: false,
  source: 'https://loveyusleep.com/',
  sourceNote:
    'Every figure, ingredient and quotation on this page was read from the product’s own sales page on 22 September 2026. No Supplement Facts panel, bottle volume or servings-per-bottle figure appears anywhere on it, and there is no retailer listing to cross-check against.',
  body: `
<h2>Our take: the one good decision, and everything asserted around it</h2>
<p>Start with what Yu Sleep gets right, because it is genuinely uncommon. The page leads with “No morning grogginess — only 0.9mg melatonin”, and that is a considered choice rather than a shortcut. Most melatonin on the shelf is 5 or 10 mg, which is many times what the body produces and a frequent cause of the next-morning hangover people complain about. Under a milligram is closer to physiological, and building a product around that is the decision of someone who has read the field.</p>
<p>Almost everything else on the page is asserted rather than shown. The formula lists ten ingredients and quantifies one of them. The headline results — “89% reported significant improvement within the first few days”, “96% reported a life-changing transformation by month three” — come from a study described as “3,400 participants. Six months. Full medical monitoring and sleep tracking” and “the largest independent sleep restoration study conducted outside of Big Pharma”, which is named nowhere, published nowhere we could find, and attributed to no institution.</p>
<p>Then there is the claim that should stop a reader: “67% of them report unintentional weight loss within the first three months. Without changing their diet or exercise.” That is a weight-loss claim on a sleep product, sourced to the same unnamed study.</p>
<p>And one omission that matters more than any of it. The formula contains 5-HTP, the direct precursor to serotonin, and we could find no warning of any kind on the page — nothing about antidepressants, nothing about pregnancy, nothing about driving. People with sleep problems are disproportionately likely to be taking an antidepressant. That is the conversation this page should be starting and does not.</p>
<p>This is a desk review of a sales page and published sources. Nobody here has bought or taken this product, and no independent listing exists to check the page against.</p>

<h2>What is in the bottle, and what is not on the page</h2>
<p>Ten ingredients are named: red tart cherry extract, 5-HTP, vitamin B6, vitamin B2, magnesium glycinate, apigenin, lemon balm extract, L-theanine, melatonin at 0.9 mg per serving, and GABA. Only the melatonin carries a number.</p>
<p>As a sleep formula this is a defensible list rather than a random one, which is worth saying. Low-dose melatonin, magnesium glycinate, <a href="/ingredients/l-theanine">L-theanine</a> and lemon balm are all plausible inclusions with at least some supporting research, and apigenin and tart cherry are common in the category. GABA is the weakest of them: it is poorly absorbed orally and whether meaningful amounts reach the brain is genuinely disputed. 5-HTP is the one that changes the safety conversation, and we come back to it below.</p>
<p>What is missing is more unusual than the missing milligrams. There is no bottle volume in millilitres. There is no servings-per-bottle figure. The directions are “take 2 droppers 30 minutes before bed”, and a dropper is not a unit — it depends entirely on the pipette. So a reader cannot work out what a dose is, cannot work out how long a bottle lasts, and cannot calculate a cost per serving. Packages are sold by month rather than by bottle, which is the only reason the price arithmetic below is possible at all.</p>
<p>It is also worth flagging what a missing panel means specifically for melatonin. NCCIH cites a 2023 analysis that found 22 of 25 over-the-counter melatonin gummy products were inaccurately labelled, some containing up to three and a half times the stated amount. Melatonin labelling has a documented accuracy problem, which makes the 0.9 mg figure both the best thing on the page and the one most worth verifying against an actual panel.</p>

<h2>The study that is not named</h2>
<p>The page devotes a section to “The Study Behind Yu Sleep’s Formula”: 3,400 participants, six months, full medical monitoring and sleep tracking, described as the largest independent sleep restoration study conducted outside of big pharma. Every headline percentage on the page traces back to it.</p>
<p>A trial of that description would be a significant piece of work. It would have a name, a principal investigator, an ethics approval, a registration number and — six months of medical monitoring on 3,400 people being expensive — a publication. None of that is given. We could not find the study, and the page does not point to it.</p>
<p>The page does carry a “Scientific References” section with twenty PubMed links, which at a glance looks like the missing evidence. It is not. Those references are about the ingredients in general — melatonin, L-theanine, magnesium and the rest — not about Yu Sleep, and none of them is the 3,400-person trial. This is a common and effective pattern: a wall of real citations positioned next to claims they do not support. The citations are genuine; the connection is not.</p>
<p>The same applies to the team. The page says the formula “came out of a team with over 50 years of combined sleep research experience led by Dr. Andrew Collins”, who “left pharmaceutical work”. No credentials, institution, qualification or biography is given for him. A named doctor with no verifiable details is a claim, not a credential, and the absence is the point: this site does not publish its own clinician’s employer or degrees without documentation either, and it says so.</p>
<p>The absorption claim goes the same way. “Nano-emulsified sleep drops for 99% absorption (not the 22% you get from capsules)” is a precise, testable, two-number statement with no source attached to it. Numbers that specific normally come from somewhere.</p>

<h2>5-HTP, and the warning that is not there</h2>
<p>This is the part of the review we would ask you to read if you read nothing else.</p>
<p>5-HTP is the immediate precursor to serotonin — the body converts one into the other. Memorial Sloan Kettering’s monograph states that patients taking selective serotonin reuptake inhibitors, monoamine oxidase inhibitors or tricyclic antidepressants should avoid 5-HTP without physician supervision, because of the theoretical potential for serotonin syndrome, a serious condition. Case reports exist of mania with MAOIs and of serotonin syndrome with linezolid.</p>
<p>We want to be precise rather than alarming, because precision is the point. Confirmed human cases of serotonin syndrome caused by 5-HTP are rare, and MSKCC describes the risk as theoretical. The ordinary side effects reported are gastrointestinal — nausea, vomiting, diarrhoea — with headache and, ironically for a sleep product, insomnia less commonly. Older 5-HTP products were also associated with contaminants linked to eosinophilia-myalgia syndrome, an issue that resolved when the contaminated material was replaced.</p>
<p>So the problem is not that this product will harm you. The problem is that every authoritative source on 5-HTP says the same thing — talk to your doctor first if you take a serotonergic medicine — and the page says nothing. Insomnia and depression travel together; a substantial share of the people this page is aimed at will be on an SSRI. A single sentence would cover it. There is not one.</p>
<p>The same silence covers everything else. No pregnancy or breastfeeding caution, despite NCCIH noting there is insufficient research on melatonin in pregnancy. No caution about driving or operating machinery after taking a sedating product. No mention of blood thinners or epilepsy, which NCCIH flags as needing medical supervision alongside melatonin. If you take any regular medicine, take the ingredient list to a pharmacist before the first dose.</p>

<h2>What the evidence supports, and what it does not</h2>
<p>Melatonin is the most studied thing here, and the picture is narrower than the marketing. NCCIH reports promising results for jet lag, for delayed sleep-wake phase disorder — where it helped people fall asleep an average of 22 to 34 minutes earlier — for some children’s sleep disorders, and for pre-surgery anxiety.</p>
<p>For chronic insomnia, which is what “stops your 3AM wake ups” describes, NCCIH states that professional guidelines lack sufficient evidence to recommend melatonin. That is the product’s central promise, set against the specific conclusion of the body reviewing the evidence. NCCIH also notes that short-term use appears safe for most people but that information on long-term safety is lacking — relevant to a page recommending three to six months and selling a six-month package.</p>
<p><a href="/ingredients/l-theanine">L-theanine</a> is graded B on this site, and the grade is for its use alongside caffeine; for subjective stress and sleep the evidence is graded C, drawn from small trials with self-reported outcomes. Magnesium glycinate and lemon balm are reasonable but modest. None of this adds up to a “complete sleep system reset”, and none of it says anything about body weight.</p>
<p>On that last point: better sleep is genuinely associated with better weight regulation in population research, so the idea is not absurd. But an association in epidemiology is not 67 per cent of customers losing weight without changing diet or exercise, and the distance between the two is exactly where a claim like that should have a citation.</p>

<h2>Price, and one thing the page does honestly</h2>
<p>Three packages: two months at $138, reduced from $198; three months at $177, reduced from $297; six months at $294, reduced from $594, with shipping included on the largest. That is $2.30, $1.97 and $1.63 a day respectively.</p>
<p>Here the page deserves credit, and it is a real contrast with others we have reviewed. Every “was” price works out at exactly $99 a month across all three packages, so the discounts of 30, 40 and 50 per cent are internally consistent and the “save $300” figure on the six-month is arithmetically correct. That sounds like a low bar. It is one that several competing sales pages fail.</p>
<p>What you cannot do is the calculation that matters. With no bottle volume, no dropper volume and no servings-per-bottle figure, cost per serving is unobtainable. You are buying months rather than doses, and taking on trust that a month’s package contains a month of doses at the intended strength.</p>
<p>For scale, the one disclosed active — 0.9 mg of melatonin — costs a fraction of a penny per dose in any form. The rest of the formula is not exotic either: magnesium glycinate, L-theanine and lemon balm are commodity ingredients sold openly with their amounts printed. Our <a href="/wellness/now-l-theanine-100-mg">NOW L-Theanine overview</a> shows what a fully disclosed single-ingredient label looks like.</p>

<h2>The guarantee and the seller</h2>
<p>The guarantee is 60 days: “Love it, or get every penny back. No questions asked.” As with most pages of this kind, the mechanics are absent — whether bottles must be returned, who pays return postage, whether part-used bottles qualify, and whether the 60 days run from order or delivery. On a six-month package that is 180 days of product against a 60-day window, so those terms are worth having in writing first.</p>
<p>We found no subscription, autoship or rebill language, which is worth stating plainly because it is a common failure in this category and this page does not have it. Orders are described as one-time purchases of a two, three or six-month supply. The checkout is handled by BuyGoods, which will be the name on your statement rather than Yu Sleep.</p>
<p>There is scarcity framing — “we’re constantly selling out and we have limited inventory” — but no countdown timer or expiring-offer device.</p>

<h2>Sources and shopping: what to ask before you order</h2>
<p>Two questions, in this order. First, ask a pharmacist or your GP whether 5-HTP is appropriate alongside anything you already take, and bring the ingredient list. If you take an antidepressant of any kind, that conversation should happen before you order, not after the bottle arrives.</p>
<p>Second, ask the company for a photograph of the Supplement Facts panel showing the millilitre volume of a dropper, the servings per bottle and the amount of every one of the ten ingredients. Without it you cannot know what you are taking or what it costs per dose, and given the documented labelling problems with melatonin products, the panel is the only thing that would confirm the 0.9 mg figure the whole pitch rests on.</p>
<p>Our commercial link is <a href="https://sharpandlean.com/recommended/yu-sleep">our Yu Sleep link</a>. It earns a commission at no extra cost to you and has not moved any of the five marks above. The score is 1.8, and it would rise quickly if a panel and a warning appeared — this is a page held down by what it omits, not by a formula anyone has shown to be bad.</p>
<p>The fair summary: somebody on this team understood that 0.9 mg of melatonin is a better idea than 10 mg, and that is not nothing. But a sensible dose inside an undisclosed formula, sold on a study with no name and a weight-loss statistic with no source, is not something we can recommend buying six months of.</p>
`,
  whoFor:
    'Nobody we can identify from what is published. Someone attracted by the low-dose melatonin idea — which is the sound part of this product — can buy 0.5 to 1 mg melatonin on its own, with the amount printed on the bottle, for a fraction of the price and with a warning label attached.',
  whoAvoid:
    'Anyone taking an SSRI, SNRI, MAOI, tricyclic antidepressant or any other serotonergic medicine, unless a doctor has cleared it, because of the 5-HTP. Anyone pregnant or breastfeeding. Anyone on blood thinners or with epilepsy, which NCCIH flags as needing medical supervision with melatonin. Anyone who needs to drive or operate machinery soon after a dose.',
  pros: [
    '0.9 mg of melatonin is a genuinely well-judged dose, well below the 5–10 mg that causes next-day grogginess',
    'The ingredient list is a coherent sleep formula rather than a random assembly — magnesium glycinate, L-theanine and lemon balm all belong in one',
    'The discount arithmetic is internally consistent: every “was” price works out at $99 a month across all three packages',
    'No subscription, autoship or rebill language anywhere, which is a common failure this page avoids',
    'A 60-day money-back guarantee is offered',
  ],
  cons: [
    'Contains 5-HTP, and we could find no warning on the page about antidepressants, pregnancy, driving or medication of any kind',
    'Nine of the ten ingredients have no amount published, and there is no Supplement Facts panel',
    'No bottle volume, no dropper volume and no servings per bottle, so a dose cannot be defined or costed',
    'Every headline statistic traces to a 3,400-person study that is named nowhere and attributed to no institution',
    '“67% of them report unintentional weight loss” is a weight-loss claim on a sleep product with no source',
    'The “99% absorption (not the 22% you get from capsules)” figures carry no citation',
    'Twenty PubMed references are about the ingredients in general, not about this product or the study cited',
    'Dr Andrew Collins is named with no credentials, institution or biography',
  ],
  ingredients: [
    {
      name: 'Melatonin',
      dose: '0.9 mg per serving',
      evidence_rating: 'moderate',
      note: 'The only disclosed amount, and a well-chosen one — most products use 5 to 10 mg. NCCIH reports promising evidence for jet lag and delayed sleep-wake phase disorder, but states that professional guidelines lack sufficient evidence to recommend melatonin for chronic insomnia, which is what this product is sold for. Long-term safety information is lacking.',
    },
    {
      name: '5-HTP',
      dose: 'Not disclosed',
      evidence_rating: 'weak',
      note: 'The direct precursor to serotonin, and the reason this page needed a warning it does not have. MSKCC advises that people taking SSRIs, MAOIs or tricyclic antidepressants avoid it without physician supervision, given the theoretical potential for serotonin syndrome. Confirmed human cases are rare. Usual side effects are gastrointestinal, with insomnia reported less commonly.',
    },
    {
      name: 'L-theanine',
      dose: 'Not disclosed',
      evidence_rating: 'moderate',
      note: 'Graded B on our evidence page, though that grade is for use alongside caffeine; for subjective stress and sleep the grade is C, from small trials with self-reported outcomes. A reasonable inclusion in a sleep formula, and studied amounts are 100 to 200 mg — which is not something a dropper of undisclosed volume lets you confirm.',
    },
    {
      name: 'Magnesium glycinate',
      dose: 'Not disclosed',
      evidence_rating: 'weak',
      note: 'A well-tolerated magnesium form commonly used in sleep products. The amount matters a great deal here, because different magnesium salts carry very different amounts of elemental magnesium, and the page gives neither the compound weight nor the elemental figure.',
    },
    {
      name: 'GABA',
      dose: 'Not disclosed',
      evidence_rating: 'weak',
      note: 'The weakest inclusion on pharmacological grounds. Orally administered GABA is poorly absorbed, and whether meaningful amounts cross the blood–brain barrier is disputed. Its presence on a label is easier to justify as marketing than as mechanism.',
    },
    {
      name: 'Apigenin, lemon balm extract, red tart cherry extract',
      dose: 'Not disclosed',
      evidence_rating: 'weak',
      note: 'Conventional botanicals in this category. Lemon balm has modest supporting research for relaxation; tart cherry is a natural source of melatonin, which in a product already dosing melatonin directly makes its contribution impossible to separate. No amounts are given for any of them.',
    },
    {
      name: 'Vitamin B6, vitamin B2',
      dose: 'Not disclosed',
      evidence_rating: 'none',
      note: 'B6 is a cofactor in the conversion of 5-HTP to serotonin, which is a plausible reason to include it. Without amounts there is nothing to assess, and neither vitamin is a sleep aid in its own right in people who are not deficient.',
    },
  ],
  faqs: [
    {
      question: 'Does Yu Sleep work?',
      answer:
        'We cannot say, and the page does not establish it. The percentages it quotes come from a 3,400-person study that is named nowhere and attributed to no institution. What can be said is that 0.9 mg of melatonin is a sensible dose, and that NCCIH reports melatonin has promising evidence for jet lag and delayed sleep-wake phase disorder while professional guidelines lack sufficient evidence to recommend it for chronic insomnia — which is the problem this product is sold for.',
    },
    {
      question: 'Is Yu Sleep safe to take with antidepressants?',
      answer:
        'Ask your doctor before ordering, not after. Yu Sleep contains 5-HTP, the direct precursor to serotonin, and Memorial Sloan Kettering advises that people taking SSRIs, MAOIs or tricyclic antidepressants avoid 5-HTP without physician supervision because of the theoretical potential for serotonin syndrome. Confirmed human cases are rare, so this is a caution rather than an alarm — but the sales page carries no warning about it at all, which is why we are raising it here.',
    },
    {
      question: 'Is 0.9 mg of melatonin enough?',
      answer:
        'It is a deliberate choice and a defensible one. Doses of 5 to 10 mg are far above what the body produces and are a common cause of next-morning grogginess, which the page correctly identifies. Sub-milligram doses are closer to physiological. The catch is that melatonin labelling has a documented accuracy problem — NCCIH cites an analysis finding 22 of 25 gummy products inaccurately labelled — and no Supplement Facts panel is published here to confirm the figure.',
    },
    {
      question: 'Will it make me lose weight?',
      answer:
        'The page claims “67% of them report unintentional weight loss within the first three months. Without changing their diet or exercise.” No source is given for that figure. Better sleep is associated with better weight regulation in population research, so the underlying idea is not absurd, but an epidemiological association is a very long way from two-thirds of customers losing weight without changing anything. Treat it as an unsupported claim.',
    },
    {
      question: 'What is the 3,400-person study?',
      answer:
        'We could not find out. The page describes “3,400 participants. Six months. Full medical monitoring and sleep tracking” and calls it the largest independent sleep restoration study conducted outside of big pharma, but gives no study name, investigator, institution, registration or publication. The twenty PubMed links in the Scientific References section are about the ingredients in general and are not that study.',
    },
    {
      question: 'How many servings are in a bottle?',
      answer:
        'The page does not say. It gives no bottle volume in millilitres, no dropper volume and no servings-per-bottle figure, and the directions are “take 2 droppers 30 minutes before bed”. Packages are sold as two, three or six-month supplies, so you are buying months rather than doses and taking on trust that they match.',
    },
    {
      question: 'What does it cost per day?',
      answer:
        'About $2.30 a day on the two-month package, $1.97 on the three-month and $1.63 on the six-month. To the page’s credit, the discount arithmetic is internally consistent — every “was” price works out at exactly $99 a month. Cost per serving cannot be calculated, because a serving is not defined anywhere.',
    },
    {
      question: 'Why does this score 1.8?',
      answer:
        'Because of omissions rather than any demonstrated fault. Label transparency scores 1 with no panel, no bottle volume and no serving definition. Safety scores 1 because a formula containing 5-HTP carries no warning of any kind. Evidence scores 3 rather than lower because low-dose melatonin, L-theanine and magnesium are reasonable choices. The score would rise quickly if a panel and a warning were published.',
    },
  ],
  references: [
    {
      id: 'yusleep-page',
      text: 'Yu Sleep official sales page — the source of every price, ingredient, claim, direction and guarantee quoted here, read on 22 September 2026.',
      url: 'https://loveyusleep.com/',
    },
    {
      id: 'nccih-melatonin',
      text: 'National Center for Complementary and Integrative Health. Melatonin: What You Need To Know — evidence for jet lag and delayed sleep-wake phase disorder, the absence of sufficient evidence for guidelines to recommend it in chronic insomnia, the lack of long-term safety data, and the 2023 finding that 22 of 25 melatonin gummy products were inaccurately labelled.',
      url: 'https://www.nccih.nih.gov/health/melatonin-what-you-need-to-know',
    },
    {
      id: 'mskcc-5htp',
      text: 'Memorial Sloan Kettering Cancer Center. 5-HTP monograph — advice that patients taking SSRIs, MAOIs or tricyclic antidepressants avoid 5-HTP without physician supervision given the theoretical potential for serotonin syndrome, the reported adverse effects, and the historical contamination associated with eosinophilia-myalgia syndrome.',
      url: 'https://www.mskcc.org/cancer-care/integrative-medicine/herbs/5-htp-01',
    },
    {
      id: 'fda-supplements-ys',
      text: 'US Food and Drug Administration. Questions and answers on dietary supplements — supplements are not approved by the FDA for safety or effectiveness before sale.',
      url: 'https://www.fda.gov/food/information-consumers-using-dietary-supplements/questions-and-answers-dietary-supplements',
    },
  ],
  history: [
    {
      date: '2026-09-22',
      note: 'First published. Scored 1.8 out of 10 against the five published criteria. The marks reflect omissions rather than any demonstrated fault in the formula: no Supplement Facts panel, no bottle or dropper volume, no servings per bottle, nine of ten ingredients unquantified, and no warning of any kind attached to a formula containing 5-HTP. The evidence mark of 3 is the highest here because the 0.9 mg melatonin dose and several other inclusions are well chosen.',
    },
    {
      date: '2026-09-22',
      note: 'All product figures, ingredients and quotations read from the company’s own sales page on this date. The melatonin evidence and labelling-accuracy findings are NCCIH’s; the 5-HTP interaction advice is Memorial Sloan Kettering’s. We could not locate the 3,400-participant study the page attributes its results to, and the page gives no name, investigator, institution or publication for it. If a Supplement Facts panel is supplied, or the study identified, this page will be updated and the scores revisited.',
    },
  ],
  published: '2026-09-22T00:00:00Z',
  updated: '2026-09-22T00:00:00Z',
};
