import type { Collection } from '../types';

/*
 * Ashwagandha every day: what changes, week by week, and what is unknown past
 * three months. Companion to "Ashwagandha: Why you need to take?" and the
 * ingredient page (lib/ingredient-pages/ashwagandha.ts); every dose and trial
 * figure here, and in the timeline and body-change blocks in
 * components/ashwagandha-guide.tsx, must agree with that page.
 * The lead image is an illustration, not a photograph.
 */
export const ashwagandhaDaily: Collection = {
  id: 'ashwagandha-daily',
  kind: 'articles',
  slug: 'ashwagandha-what-happens-if-you-take-it-daily',
  topic: 'vitamins',
  title: 'Ashwagandha: What happens if we take daily?',
  seo_title: 'Ashwagandha Every Day: What Happens, Week by Week',
  seo_desc:
    'Ashwagandha daily: what changes by week 1, 4 and 8, its effects on cortisol, sleep, thyroid and testosterone, and why to stop at three months.',
  summary:
    'Take ashwagandha every day and not much happens in the first week, apart from drowsiness or an upset stomach in some people. By week eight — where the trials measured — stress scores and cortisol are usually lower and sleep slightly better. Thyroid hormones, testosterone and blood sugar can shift too. Past three months, nobody knows: there are no long-term trials of daily use.',
  is_published: true,
  about: [{ name: 'Ashwagandha', sameAs: 'https://en.wikipedia.org/wiki/Withania_somnifera' }],
  evidenceReviewed: false,
  authors: [{ name: 'SLN Team', slug: 'snl-team', type: 'Organization' }],
  published_at: '2026-10-01T00:00:00Z',
  updated_at: '2026-10-01T00:00:00Z',
  figure: {
    src: '/images/illustration-ashwagandha-daily.jpg',
    alt: 'Illustration of a seven-day pill organiser holding ashwagandha capsules, beside a mug of warm milk, a small bowl of root powder, two dried roots and a sprig of ashwagandha leaves with red berries.',
    caption:
      'A daily habit: ashwagandha capsules in a week’s organiser, and root powder traditionally stirred into warm milk. SharpAndLean illustration.',
  },
  takeaways: [
    'The first week is mostly about side effects: some people feel drowsy or get an upset stomach. The stress and sleep benefits take weeks.',
    'By week eight, trials found lower stress scores, cortisol down 27.9 per cent in one study, and slightly better sleep.',
    'Daily ashwagandha can also raise thyroid hormones and testosterone and slightly lower blood sugar — changes that matter if you have a thyroid condition or take diabetes medicines.',
    'Safety data run to about three months. Rare liver injury usually appears 2 to 12 weeks in. Stop at three months, or check with your doctor before carrying on.',
  ],
  body: `
<h2>The short answer</h2>
<p>If you take ashwagandha every day, <strong>very little happens in the first week</strong> — except, for some people, drowsiness or an upset stomach. The effects people take it for build slowly. In the trials, which mostly measured results after <strong>eight weeks</strong> of 250 to 600 mg of root extract a day, people felt less stressed, their cortisol fell, and they slept a little better.</p>
<p>Daily use also changes things you might not expect: it can raise thyroid hormones, nudge up testosterone and slightly lower blood sugar. And after about <strong>three months</strong>, the evidence runs out. Nobody has properly studied what taking it every day for years does, which is why the sensible pattern is a set course, not a permanent habit.</p>

<h2>Week by week: what to expect</h2>
<div data-tool="ashwagandha-daily-timeline"></div>

<h2>What daily ashwagandha changes in your body</h2>
<p>These are the effects that have actually been measured in people, rather than in animals or test tubes. Some are why people take it; others are reasons to be careful.</p>
<div data-tool="ashwagandha-body-changes"></div>

<h3>1. Cortisol and stress come down</h3>
<p>This is the main event. In a 60-day trial of 64 chronically stressed adults taking 300 mg of root extract twice a day, serum cortisol fell by <strong>27.9 per cent</strong>, against 7.9 per cent on placebo, and stress scores fell by 44 per cent. A 2022 meta-analysis of 12 trials and 1,002 adults found the same direction overall, though it rated the certainty of the evidence as low. Most of these trials were small and funded by the makers of the extract being tested.</p>

<h3>2. Sleep gets slightly better</h3>
<p>A review of five trials and 400 people found a small improvement in sleep, larger in people with insomnia, at 600 mg a day or more, and after at least eight weeks. People also felt more alert on waking. Do not expect a sleeping-pill effect; this is a gradual, modest shift.</p>

<h3>3. Thyroid hormones can rise</h3>
<p>This is the change most people do not know about. In an eight-week trial of 50 adults with a mildly underactive thyroid, 600 mg a day raised T4 by <strong>9.3 per cent at week 4 and 19.6 per cent at week 8</strong>, and lowered TSH. For someone with an underactive thyroid that looks helpful; for someone with an <strong>overactive thyroid, or already on thyroid medicine</strong>, it is a reason to avoid it or check with a doctor first. In healthy volunteers, thyroid levels generally stayed in the normal range.</p>

<h3>4. Testosterone may edge up</h3>
<p>In an eight-week crossover trial, 43 men aged 40 to 70 taking 600 mg a day had salivary testosterone <strong>14.7 per cent</strong> higher than on placebo. They did not, however, report feeling noticeably more energetic. A modest hormone rise is not the same as a health benefit, and for anyone with a hormone-sensitive condition such as prostate cancer it is a caution.</p>

<h3>5. Blood sugar may dip slightly</h3>
<p>A 2025 meta-analysis found daily ashwagandha lowered fasting blood glucose by about 3 mg/dL (roughly 0.2 mmol/L) — a small effect, with very low certainty — and found no clear change in HbA1c. That is irrelevant for most people, but worth knowing if you take medicine for diabetes, where it could add to the drug’s effect.</p>

<h3>6. Your liver — usually fine, rarely not</h3>
<p>In controlled trials of healthy adults, liver blood tests generally stayed normal: an eight-week trial of 300 mg twice a day found no effect on liver function, and a 2026 twelve-week study using 2,000 mg a day found no clinically important changes. But outside trials, the NIH’s LiverTox database rates ashwagandha a <strong>probable cause of liver injury</strong>. The reported cases usually began <strong>2 to 12 weeks after starting</strong> daily use, with jaundice, itching and tiredness, and most recovered after stopping. It is rare — but it is exactly the time frame of a typical daily course.</p>

<h2>How much, and when in the day</h2>
<ul>
<li><strong>Dose:</strong> 250 to 600 mg a day of a standardised root extract — the range used in nearly every trial. 300 mg twice a day and 600 mg once a day are the most studied patterns.</li>
<li><strong>Time of day:</strong> no trial has shown timing matters. Because drowsiness is a common side effect, many people take it in the evening, with food to spare their stomach.</li>
<li><strong>Consistency:</strong> the trial effects came from taking it every day for weeks. Occasional use has not been tested.</li>
<li><strong>Form:</strong> look for a named extract or withanolide percentage on the label. Plain root powder at the same milligram dose is much weaker. Our <a href="/best/ashwagandha-which-brand-is-the-best-to-buy-in-2026">guide to the best ashwagandha brands</a> compares six US products.</li>
</ul>

<h2>Can you take ashwagandha every day long term?</h2>
<p>Nobody knows, and that is the honest answer. The NIH says ashwagandha appears well tolerated for up to about three months, but that long-term safety is unknown. The longest good-quality trials run for eight to twelve weeks. The changes above — to thyroid hormones, testosterone, blood sugar and, rarely, the liver — have not been followed over years.</p>
<p>Regulators are cautious too. Denmark banned ashwagandha from food supplements in 2023 because it could not establish a safe level of intake, and the UK’s Committee on Toxicity is still reviewing its safety for the Food Standards Agency.</p>
<p>Given that evidence, a practical approach:</p>
<ul>
<li>Take it for <strong>eight weeks</strong>, then judge whether it has helped.</li>
<li>If it has not, stop — it is unlikely to start working later.</li>
<li>If it has, stop at around <strong>three months</strong> and see how you feel without it.</li>
<li>If you want to carry on beyond that, talk to your GP, and ask whether liver and thyroid blood tests make sense.</li>
</ul>

<h2>What happens when you stop?</h2>
<p>There is no evidence that ashwagandha causes withdrawal symptoms or dependence, and no trial has reported a “rebound” when people stop. The honest expectation is that any benefit fades as the effect wears off, over days to weeks, and that the things you did alongside it — sleep routine, exercise, dealing with the cause of the stress — are what keep you feeling better. If you stop because of side effects such as stomach upset or drowsiness, these usually settle within a few days.</p>

<h2>Who should not take it daily</h2>
<ul>
<li><strong>Pregnant or breastfeeding women</strong> — there are no safety data, and it has traditionally been linked to miscarriage.</li>
<li><strong>Anyone with liver disease</strong>, or who has had liver problems with a supplement before.</li>
<li><strong>Anyone with an overactive thyroid</strong>, or taking thyroid medicine without their doctor knowing.</li>
<li><strong>People taking sedatives, sleeping tablets, or diabetes, blood-pressure or immune-suppressing medicines</strong> — ask a pharmacist first.</li>
<li><strong>People with autoimmune conditions or hormone-sensitive prostate cancer.</strong></li>
<li><strong>Anyone having surgery</strong> — stop two weeks before.</li>
</ul>
<p>Stop straight away and see a doctor if you notice yellowing of the skin or eyes, dark urine, pale stools, itching all over, or pain under your right ribs.</p>

<h2>The bottom line</h2>
<p>Taking ashwagandha every day is a slow experiment, not a quick fix. Expect little in the first week, judge it at eight weeks, and stop by three months unless your doctor is happy for you to continue. Along the way it may lower your stress and help you sleep a little better — and it may also move your thyroid hormones, testosterone and blood sugar, which is why it is not a supplement to take on autopilot.</p>
<p>For the full evidence grades and references, see our <a href="/ingredients/ashwagandha">ashwagandha ingredient page</a>.</p>
`,
  faqs: [
    {
      question: 'What happens if I take ashwagandha every day?',
      answer:
        'Little in the first week, apart from possible drowsiness or stomach upset. After about eight weeks of 250 to 600 mg of root extract a day, trials found lower stress scores and cortisol and slightly better sleep. It can also raise thyroid hormones and testosterone and slightly lower blood sugar.',
    },
    {
      question: 'How long does it take for ashwagandha to work?',
      answer:
        'Most trials measured results after eight weeks, and the sleep benefit was clearer after eight weeks or more. Some people feel calmer sooner, but that has not been well tested. If nothing has changed by two months, it is unlikely to.',
    },
    {
      question: 'Is it safe to take ashwagandha every day?',
      answer:
        'For healthy adults, daily use for up to about three months has usually been well tolerated in trials. Long-term safety is unknown, and rare liver injury has been reported, usually 2 to 12 weeks after starting. Take it for a set period rather than indefinitely.',
    },
    {
      question: 'Should I take a break from ashwagandha?',
      answer:
        'Yes. Because safety data only run to about three months, a sensible pattern is to judge it at eight weeks and stop by three months. If you want to continue, discuss it with your GP, who may suggest liver and thyroid blood tests.',
    },
    {
      question: 'Is it better to take ashwagandha in the morning or at night?',
      answer:
        'Trials have not shown that timing matters. Many people take it in the evening because drowsiness is a common side effect, and taking it with food can help if it upsets your stomach.',
    },
    {
      question: 'Does ashwagandha affect the thyroid?',
      answer:
        'It can. In an eight-week trial in people with a mildly underactive thyroid, 600 mg a day raised T4 by 19.6 per cent. Avoid it if you have an overactive thyroid, and tell your doctor if you take thyroid medicine.',
    },
    {
      question: 'What happens when you stop taking ashwagandha?',
      answer:
        'No withdrawal symptoms or rebound effects have been reported. Any benefit is likely to fade gradually over days to weeks, and side effects such as drowsiness or stomach upset usually settle within a few days.',
    },
  ],
  references: [
    {
      id: 'chandrasekhar-2012',
      text: 'Chandrasekhar K, Kapoor J, Anishetty S (2012). A prospective, randomized double-blind, placebo-controlled study of safety and efficacy of a high-concentration full-spectrum extract of ashwagandha root in reducing stress and anxiety in adults. Indian Journal of Psychological Medicine 34(3):255-262 — 64 adults, 60 days.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/23439798/',
    },
    {
      id: 'akhgarjand-2022',
      text: 'Akhgarjand C et al. (2022). Does ashwagandha supplementation have a beneficial effect on the management of anxiety and stress? A systematic review and meta-analysis of randomized controlled trials. Phytotherapy Research — 12 trials, 1,002 participants; certainty low.',
      url: 'https://onlinelibrary.wiley.com/doi/10.1002/ptr.7598',
    },
    {
      id: 'cheah-2021',
      text: 'Cheah KL et al. (2021). Effect of ashwagandha (Withania somnifera) extract on sleep: a systematic review and meta-analysis. PLoS One 16(9):e0257843 — 5 trials, 400 participants.',
      url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0257843',
    },
    {
      id: 'sharma-2018',
      text: 'Sharma AK, Basu I, Singh S (2018). Efficacy and safety of ashwagandha root extract in subclinical hypothyroid patients: a double-blind, randomized placebo-controlled trial. Journal of Alternative and Complementary Medicine 24(3):243-248 — 50 adults, 600 mg a day for 8 weeks.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/28829155/',
    },
    {
      id: 'lopresti-2019',
      text: 'Lopresti AL, Drummond PD, Smith SJ (2019). A randomized, double-blind, placebo-controlled, crossover study examining the hormonal and vitality effects of ashwagandha in aging, overweight males. American Journal of Men’s Health.',
      url: 'https://doi.org/10.1177/1557988319835985',
    },
    {
      id: 'glucose-2025',
      text: 'The effects of ashwagandha (Withania somnifera) supplementation on fasting blood glucose and HbA1c: a systematic review and dose-response meta-analysis of randomized controlled trials (2025) — fasting glucose −3.09 mg/dL; HbA1c inconclusive; certainty very low.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/42641800/',
    },
    {
      id: 'verma-2021',
      text: 'Verma N et al. (2021). Safety of ashwagandha root extract: a randomized, placebo-controlled study in healthy volunteers. Complementary Therapies in Medicine — 80 adults, 300 mg twice a day for 8 weeks.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/33338583/',
    },
    {
      id: 'movva-2026',
      text: 'Movva et al. (2026). Safety and tolerability of ashwagandha (Withania somnifera) root extract in healthy adults: a prospective, non-comparative study. Frontiers in Nutrition — 145 adults, 2,000 mg a day for 12 weeks; no placebo group.',
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC13233343/',
    },
    {
      id: 'ods-ashwagandha',
      text: 'NIH Office of Dietary Supplements. Ashwagandha: is it helpful for stress, anxiety, or sleep? — Fact Sheet for Health Professionals. Well tolerated for up to about 3 months; long-term safety unknown.',
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
  ],
  history: [
    {
      date: '2026-10-01',
      note: 'First published, with a week-by-week timeline and a panel of measured body changes. Figures checked against the trials, meta-analyses, NIH and LiverTox sources listed. Not yet reviewed by a clinician.',
    },
  ],
};
