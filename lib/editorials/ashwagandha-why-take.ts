import type { Collection } from '../types';

/*
 * The reader-facing companion to the ashwagandha ingredient page
 * (lib/ingredient-pages/ashwagandha.ts). The scorecard block reads its grades
 * from that page; every dose and trial figure below must agree with it.
 * The title is the one the editor asked for; the answer inside is the honest
 * one — most people do not need it, and some should not take it.
 */
export const ashwagandhaWhyTake: Collection = {
  id: 'ashwagandha-why-take',
  kind: 'articles',
  slug: 'ashwagandha-why-you-need-to-take',
  topic: 'vitamins',
  title: 'Ashwagandha: Why you need to take?',
  seo_title: 'Ashwagandha: Why Take It, and When Not To',
  seo_desc:
    'Why people take ashwagandha: what trials show for stress and sleep, the right dose, the liver and thyroid risks, and who should avoid it.',
  summary:
    'Ashwagandha is the herb most people reach for when stress starts to affect their sleep. Trials of 300 to 600 mg of root extract a day for eight weeks show lower stress, lower cortisol and slightly better sleep — but they are small and short, and the herb can affect the liver and thyroid. Here is why you might take it, how to do it properly, and when you should not.',
  is_published: true,
  about: [{ name: 'Ashwagandha', sameAs: 'https://en.wikipedia.org/wiki/Withania_somnifera' }],
  evidenceReviewed: false,
  authors: [{ name: 'SLN Team', slug: 'snl-team', type: 'Organization' }],
  published_at: '2026-10-01T00:00:00Z',
  updated_at: '2026-10-01T00:00:00Z',
  figure: {
    src: '/images/illustration-ashwagandha.jpg',
    alt: 'Illustration of dried ashwagandha roots on a cream plate beside a bowl of root powder and two capsules, with a sprig of green leaves and red berries in papery husks.',
    caption:
      'Ashwagandha root, root powder and capsules, with the leaves and red “winter cherry” berries of the plant. SharpAndLean illustration.',
  },
  takeaways: [
    'The main reason to take ashwagandha is stress: 12 trials in 1,002 adults found lower stress and anxiety scores than placebo, though the certainty of the evidence is low.',
    'It may help you sleep a little better, especially with insomnia and at 600 mg a day for eight weeks or more.',
    'Use a named, standardised root extract at 300 to 600 mg a day, give it eight weeks, and stop after about three months.',
    'Do not take it if you are pregnant or breastfeeding, or have liver or thyroid problems. Rare liver injury has been reported, and Denmark has banned it from supplements.',
  ],
  body: `
<h2>The short answer</h2>
<p><strong>You do not <em>need</em> ashwagandha</strong> — nobody is deficient in it, and it is not a vitamin. But there is a reasonable case for <em>trying</em> it if stress is wearing you down and has started to affect your sleep. Of all the herbs sold for stress, it has the most placebo-controlled trials behind it, and they point the same way: at 300 to 600 mg of root extract a day, people report feeling less stressed after about eight weeks, their cortisol falls, and they sleep a little better.</p>
<p>That is the case for it. The case for caution is just as real: the trials are small, short and mostly funded by extract makers; it has been linked to rare liver injury; it can change thyroid hormone levels; and Denmark has taken it off the shelves. Used well, it is a short, deliberate experiment — not something to take forever.</p>

<h2>What is ashwagandha?</h2>
<p>Ashwagandha (<em>Withania somnifera</em>) is a small shrub in the nightshade family whose root has been used in Ayurvedic medicine for thousands of years. Its Sanskrit name means roughly “smell of the horse”, after the root’s odour and the strength it was said to give. You will also see it called Indian ginseng or winter cherry.</p>
<p>It is sold as an <strong>adaptogen</strong> — a plant said to help the body cope with stress. That is a traditional and marketing term rather than a medical one, but it explains why ashwagandha turns up in everything from sleep gummies to “cortisol” blends and testosterone boosters. The compounds thought to do the work are called <strong>withanolides</strong>.</p>

<h2>Why people take it: the evidence, claim by claim</h2>
<p>We grade each claim separately, because a herb can have decent evidence for one thing and none for another. Here is how ashwagandha stands.</p>
<div data-tool="ashwagandha-evidence"></div>

<h3>1. For stress and anxiety — the main reason</h3>
<p>A 2022 meta-analysis pooled <strong>12 randomised trials and 1,002 adults</strong> and found ashwagandha lowered stress and anxiety scores more than placebo, with 300 to 600 mg a day doing best for stress. In one of the best-known trials, 64 chronically stressed adults took 300 mg of root extract twice a day for 60 days: their stress scores fell by <strong>44 per cent</strong>, and their cortisol by <strong>27.9 per cent</strong> against 7.9 per cent on placebo.</p>
<p>Encouraging — but the review’s own authors rated the certainty of the evidence as low. Most trials ran for eight weeks, were small, and were paid for by the company whose extract was being tested. It is not a treatment for an anxiety disorder, and if anxiety is stopping you living normally, that is a conversation for your GP.</p>

<h3>2. For sleep</h3>
<p>A 2021 review of <strong>five trials and 400 people</strong> found a small but real improvement in sleep. It was bigger in people with insomnia, at doses of 600 mg a day or more, and after at least eight weeks. People also felt more alert on waking. It will not knock you out like a sleeping pill — the effect is gentler than that, and it takes weeks.</p>

<h3>3. For training, testosterone and memory</h3>
<p>These are the claims that sell supplements to men and students, and they rest on thinner ground. A 2021 analysis found gains in strength and fitness in people who were training, but the strength result came from just five small trials. An eight-week trial in 43 men aged 40 to 70 found testosterone rose <strong>14.7 per cent</strong> more than on placebo — yet the men did not feel more energetic. A few small trials report better memory scores. All are worth watching; none is established.</p>

<h3>4. For weight loss — no</h3>
<p>Ashwagandha often appears in “cortisol belly” products on the idea that less stress means less stress eating. There is no good evidence that it causes meaningful weight loss.</p>

<h2>Is ashwagandha for you?</h2>
<div data-tool="ashwagandha-fit"></div>

<h2>How to take it properly</h2>
<h3>The dose</h3>
<p>Almost every trial used <strong>250 to 600 mg a day of a standardised root extract</strong>, either once a day or split into two doses. For stress, 300 to 600 mg did best; for sleep, the benefit was clearer at 600 mg. Many people take it in the evening because it can make you drowsy, but no trial has shown that timing matters.</p>
<h3>Choose the right form</h3>
<p>This matters more than the brand. A label that just says “ashwagandha 500 mg” may be plain root powder, which is far weaker than the extracts that were actually tested. Look for a named extract or a withanolide percentage on the panel.</p>
<table>
<thead><tr><th>Form on the label</th><th>What it is</th><th>What to know</th></tr></thead>
<tbody>
<tr><td><strong>KSM-66</strong></td><td>Root-only extract, about 5% withanolides</td><td>Used in many of the stress, sleep and strength trials; typical dose 300 mg once or twice a day</td></tr>
<tr><td><strong>Sensoril</strong></td><td>Root and leaf extract, at least 10% withanolides</td><td>Studied at lower doses, 125–500 mg a day</td></tr>
<tr><td><strong>Shoden</strong></td><td>Root and leaf extract, about 35% withanolide glycosides</td><td>Used in the testosterone trial at 600 mg a day</td></tr>
<tr><td><strong>Root powder</strong></td><td>Dried, ground root, not concentrated</td><td>Traditional use runs to several grams a day; milligram doses of powder were not what the trials tested</td></tr>
<tr><td><strong>Gummies and blends</strong></td><td>Ashwagandha mixed with other ingredients</td><td>Often a hidden amount in a proprietary blend, plus sugar, melatonin or caffeine</td></tr>
</tbody>
</table>
<p>Not sure which product to buy? We compared six US labels on extract, dose and cost a day in <a href="/best/ashwagandha-which-brand-is-the-best-to-buy-in-2026">which ashwagandha brand is best to buy</a>.</p>
<h3>Run it as an eight-week experiment</h3>
<p>What to expect along the way is covered week by week in <a href="/learn/ashwagandha-what-happens-if-you-take-it-daily">what happens if you take ashwagandha daily</a>.</p>
<div data-tool="ashwagandha-plan"></div>

<h2>The risks you should know about</h2>
<p>Most people in trials had no problems beyond mild stomach upset, loose stools or drowsiness. But a few risks are worth taking seriously, because they are not printed on the tub.</p>
<ul>
<li><strong>Liver injury.</strong> The NIH’s LiverTox database rates ashwagandha a probable cause of liver injury. It is rare, typically appears 2 to 12 weeks after starting, and usually clears within months of stopping — but severe cases have occurred, mostly in people with existing liver disease.</li>
<li><strong>Thyroid.</strong> It can raise thyroid hormone levels. Avoid it with an overactive thyroid, and check with your doctor if you take thyroid medicine.</li>
<li><strong>Pregnancy and breastfeeding.</strong> Do not take it. It has traditionally been linked to miscarriage and there are no safety data.</li>
<li><strong>Medicines.</strong> It may add to the effect of sedatives and sleeping tablets, lower blood sugar and blood pressure, and stimulate the immune system. Ask a pharmacist if you take any regular medicine.</li>
<li><strong>Surgery.</strong> Stop two weeks before an operation.</li>
</ul>
<h3>Why Denmark banned it — and where the UK stands</h3>
<p>In 2023, Denmark banned ashwagandha from food supplements after its national food institute concluded that a safe level of intake could not be established, citing possible effects on hormones and reproduction. Researchers and the industry have criticised the assessment behind the ban. In the UK, the Food Standards Agency has asked the Committee on Toxicity to review its safety; the committee has noted possible effects on the thyroid, blood sugar and reproduction as well as the liver case reports, and no safe level has yet been set. In the US it is sold as a dietary supplement, which means nobody checks it for safety or effectiveness before it goes on sale.</p>
<p>None of this means a short course is dangerous for a healthy adult. It does mean ashwagandha is not the harmless “natural” herb the packaging suggests, and that taking it for years is a step into the unknown.</p>

<h2>What to try before — or alongside — ashwagandha</h2>
<p>A supplement works best on top of the basics, not instead of them. The things with the strongest evidence for stress and sleep cost nothing: a regular sleep and wake time, less caffeine after midday, daylight and exercise, and talking therapies such as CBT, which the NHS offers free through its talking therapies service. If you want something gentler to try first, <a href="/ingredients/l-theanine">L-theanine</a> has a cleaner safety record, though its evidence is narrower.</p>

<h2>The bottom line</h2>
<p>If stress is getting to you and you are a healthy adult on no regular medicines, ashwagandha is one of the few herbs with a reasonable body of trials behind it. Choose a named root extract, take 300 to 600 mg a day, give it eight weeks, and stop if nothing changes — or at three months regardless. If you are pregnant, have liver or thyroid problems, or take regular medicines, it is not for you without a doctor’s say-so. And if stress or poor sleep has gone on for months, the most useful next step is your GP, not a supplement.</p>
<p>For the full evidence grades, dose ranges and every reference, see our <a href="/ingredients/ashwagandha">ashwagandha ingredient page</a>.</p>
`,
  faqs: [
    {
      question: 'Why should I take ashwagandha?',
      answer:
        'The best reason is stress. Trials of 300 to 600 mg of root extract a day for eight weeks found lower stress and anxiety scores and lower cortisol than placebo, and a small improvement in sleep. You do not need it — it is not a nutrient — but it may be worth a short trial if stress is affecting your sleep.',
    },
    {
      question: 'How long does ashwagandha take to work?',
      answer:
        'The trials measured their results after about eight weeks, and the sleep benefit was clearer after eight weeks or more. If nothing has changed after two months, it is unlikely to.',
    },
    {
      question: 'How much ashwagandha should I take a day?',
      answer:
        '250 to 600 mg a day of a standardised root extract, the range used in most trials. 300 to 600 mg did best for stress, and around 600 mg for sleep. Root powder is much weaker, so the same milligram figure is not equivalent.',
    },
    {
      question: 'Can I take ashwagandha every day long term?',
      answer:
        'Daily use for up to about three months has usually been well tolerated in trials, but there is no good long-term safety data. Rare liver injury and thyroid effects have been reported, so it is sensible to use it for a set period and then stop.',
    },
    {
      question: 'Who should not take ashwagandha?',
      answer:
        'Anyone pregnant or breastfeeding, with liver disease, a thyroid condition, an autoimmune disease or hormone-sensitive prostate cancer, or with surgery coming up. Ask a doctor or pharmacist first if you take sedatives, thyroid, diabetes, blood-pressure or immune-suppressing medicines.',
    },
    {
      question: 'Is ashwagandha banned in the UK?',
      answer:
        'No. It is legal in the UK, but the Committee on Toxicity is reviewing its safety at the Food Standards Agency’s request and no safe level has been set. Denmark banned it from food supplements in 2023.',
    },
    {
      question: 'Does ashwagandha make you sleepy?',
      answer:
        'It can. Drowsiness is one of its common side effects, which is why many people take it in the evening. It is not a sedative in the way a sleeping tablet is, and it should not be combined with sleeping tablets without advice.',
    },
  ],
  references: [
    {
      id: 'akhgarjand-2022',
      text: 'Akhgarjand C et al. (2022). Does ashwagandha supplementation have a beneficial effect on the management of anxiety and stress? A systematic review and meta-analysis of randomized controlled trials. Phytotherapy Research — 12 trials, 1,002 participants; certainty low.',
      url: 'https://onlinelibrary.wiley.com/doi/10.1002/ptr.7598',
    },
    {
      id: 'chandrasekhar-2012',
      text: 'Chandrasekhar K, Kapoor J, Anishetty S (2012). A prospective, randomized double-blind, placebo-controlled study of safety and efficacy of a high-concentration full-spectrum extract of ashwagandha root in reducing stress and anxiety in adults. Indian Journal of Psychological Medicine 34(3):255-262.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/23439798/',
    },
    {
      id: 'cheah-2021',
      text: 'Cheah KL et al. (2021). Effect of ashwagandha (Withania somnifera) extract on sleep: a systematic review and meta-analysis. PLoS One 16(9):e0257843 — 5 trials, 400 participants.',
      url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0257843',
    },
    {
      id: 'bonilla-2021',
      text: 'Bonilla DA et al. (2021). Effects of ashwagandha (Withania somnifera) on physical performance: systematic review and Bayesian meta-analysis. Journal of Functional Morphology and Kinesiology 6(1):20.',
      url: 'https://www.mdpi.com/2411-5142/6/1/20',
    },
    {
      id: 'lopresti-2019',
      text: 'Lopresti AL, Drummond PD, Smith SJ (2019). A randomized, double-blind, placebo-controlled, crossover study examining the hormonal and vitality effects of ashwagandha in aging, overweight males. American Journal of Men’s Health.',
      url: 'https://doi.org/10.1177/1557988319835985',
    },
    {
      id: 'ods-ashwagandha',
      text: 'NIH Office of Dietary Supplements. Ashwagandha: is it helpful for stress, anxiety, or sleep? — Fact Sheet for Health Professionals.',
      url: 'https://ods.od.nih.gov/factsheets/Ashwagandha-HealthProfessional/',
    },
    {
      id: 'livertox-ashwagandha',
      text: 'NIH LiverTox — Ashwagandha. Probable cause of clinically apparent liver injury; onset typically 2 to 12 weeks after starting.',
      url: 'https://www.ncbi.nlm.nih.gov/books/NBK548536/',
    },
    {
      id: 'mcgill-denmark',
      text: 'McGill Office for Science and Society. Why did Denmark ban ashwagandha?',
      url: 'https://www.mcgill.ca/oss/article/critical-thinking-health-and-nutrition/why-did-denmark-ban-ashwagandha',
    },
    {
      id: 'fsa-cot',
      text: 'UK Committee on Toxicity. Review of the safety of ashwagandha in food supplements, requested by the Food Standards Agency — ongoing in 2026.',
      url: 'https://www.gov.uk/government/publications/19th-may-2026-committee-on-toxicity-meeting/final-minutes-of-the-19th-may-2026-cot-meeting',
    },
  ],
  history: [
    {
      date: '2026-10-01',
      note: 'First published, with an evidence scorecard drawn from the ashwagandha ingredient page. Figures checked against the meta-analyses, NIH, LiverTox and regulatory sources listed. Not yet reviewed by a clinician.',
    },
  ],
};
