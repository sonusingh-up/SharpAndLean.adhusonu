import type { IngredientPage } from '../ingredients';

/*
 * Ashwagandha (Withania somnifera). Written for readers in any country, with
 * the regulatory position set out side by side: Denmark's ban, the UK
 * assessment still in progress, the NIH summary for the US.
 *
 * The blog article in lib/editorials/ashwagandha-why-take.ts reads its claim
 * cards from this page, so a grade changed here changes there too. Doses and
 * trial figures quoted in that article must agree with the ones below.
 */

export const ashwagandha: IngredientPage = {
  slug: 'ashwagandha',
  name: 'Ashwagandha',
  seoTitle: 'Ashwagandha: Evidence, Dosage and Safety',
  seoDescription:
    'Ashwagandha at 250–600 mg of root extract a day may modestly ease stress and help sleep. The evidence, the dose, the liver and thyroid cautions, and who should avoid it.',
  aliases: [
    'ashwagandha',
    'ashwagandha root',
    'ashwagandha root extract',
    'ashwagandha extract',
    'withania somnifera',
    'withania somnifera root extract',
    'ksm-66',
    'ksm-66 ashwagandha',
    'sensoril',
    'shoden',
    'indian ginseng',
    'winter cherry',
  ],
  category: 'Botanical extract',
  grade: 'C',
  quickAnswer:
    'Ashwagandha is a root used in Ayurvedic medicine and sold today mainly for stress and sleep. Trials of 250 to 600 mg of extract a day for eight weeks report lower stress scores, lower cortisol and slightly better sleep, but most are small, short and funded by extract makers, and a 2022 meta-analysis rated the certainty low. It is usually well tolerated for up to three months. It has, though, been linked to rare liver injury and changes in thyroid hormones, and Denmark has banned it from food supplements.',
  atAGlance: [
    {
      label: 'Studied dose',
      value: '250–600 mg a day',
      note: 'Of a standardised root extract, usually for eight weeks. Not the same as raw root powder.',
    },
    {
      label: 'Best-supported use',
      value: 'Stress and anxiety',
      note: 'A 2022 meta-analysis of 12 trials and 1,002 adults found lower scores than placebo, with low certainty.',
    },
    {
      label: 'Sleep',
      value: 'Small benefit',
      note: 'Five trials, 400 people: a small improvement, larger in people with insomnia and at 600 mg a day or more.',
    },
    {
      label: 'Safety data',
      value: 'About 3 months',
      note: 'The NIH says it appears well tolerated for up to about three months. Long-term safety is unknown.',
    },
    {
      label: 'Rare but serious',
      value: 'Liver injury',
      note: 'Case reports of jaundice 2 to 12 weeks after starting. Most recovered once they stopped.',
    },
    {
      label: 'Avoid if',
      value: 'Pregnant, thyroid or liver problems',
      note: 'Also check first if you take sedatives, diabetes, blood-pressure, thyroid or immune-suppressing medicines.',
    },
  ],
  whatIsIt: `Ashwagandha, Withania somnifera, is a small evergreen shrub in the nightshade family that grows across India, the Middle East and parts of Africa. Its root has been used in Ayurvedic medicine for around 3,000 years as a rasayana, or tonic. The Sanskrit name is usually translated as "smell of the horse", after the root's odour and the strength it was supposed to give. It is also sold as Indian ginseng or winter cherry, though it is not related to true ginseng.

The compounds most studied are withanolides, a group of steroid-like molecules, along with alkaloids and saponins. Supplements come in two broad kinds. Root powder is the dried, ground root, traditionally taken at several grams a day. Extracts concentrate the root, or root and leaf, and are standardised to a stated withanolide content. Most modern trials used a branded extract: KSM-66 (root only, about 5 per cent withanolides), Sensoril (root and leaf, at least 10 per cent) or Shoden (root and leaf, about 35 per cent withanolide glycosides). These are not interchangeable, and a result from one does not automatically apply to another or to plain powder.

It is marketed as an "adaptogen" — a substance said to help the body resist stress. That is a traditional and commercial term rather than a recognised pharmacological class.`,
  mechanism: `How ashwagandha works in people is not settled. The leading idea is that it dampens the body's main stress system, the hypothalamic–pituitary–adrenal (HPA) axis, and so lowers cortisol. Several trials do report lower morning cortisol, which fits, but a fall in cortisol is a laboratory marker rather than proof that someone feels less stressed.

In animal and cell studies, withanolides and other constituents act on GABA receptors, the same calming system targeted by some sleep and anxiety medicines, which is a plausible route to the sleep effects. Other proposed actions — on inflammation, thyroid hormones and sex hormones — come mostly from animal work, with a few small human trials. The same breadth of activity is why regulators worry about side effects: something that shifts thyroid, blood sugar and reproductive hormones can do so in people who did not want it to.`,
  claims: [
    {
      claim: 'For stress and anxiety',
      grade: 'B',
      body: `This is the use with the most trials behind it. A 2022 meta-analysis pooled 12 randomised trials and 1,002 adults and found ashwagandha lowered anxiety and stress scores more than placebo, with doses of 300 to 600 mg a day doing best for stress. The authors rated the certainty of the evidence as low. One of the most cited trials, from 2012, gave 64 chronically stressed adults 300 mg of root extract twice a day for 60 days: perceived-stress scores fell by 44 per cent and serum cortisol by 27.9 per cent, against 7.9 per cent on placebo.

The grade is B rather than A because the trials are small, short — usually eight weeks — mostly from India, and often funded by the companies that make the extract being tested. Measures of stress are self-reported, and cortisol does not always move in step with how people say they feel. It is not a treatment for an anxiety disorder.`,
      refs: ['akhgarjand-2022', 'chandrasekhar-2012'],
    },
    {
      claim: 'For sleep',
      grade: 'B',
      body: `A 2021 meta-analysis of five randomised trials and 400 people found a small but significant improvement in overall sleep with ashwagandha extract. The effect was larger in people with insomnia, at doses of 600 mg a day or more, and when it was taken for at least eight weeks. People also reported feeling more alert on waking and less anxious, and no serious side effects were recorded.

Five trials is a modest base, the effect is small, and none lasted long. It may help some people sleep a little better; it is not a sleeping pill and should not replace treatment for persistent insomnia.`,
      refs: ['cheah-2021'],
    },
    {
      claim: 'For strength and recovery, alongside training',
      grade: 'C',
      body: `A 2021 Bayesian meta-analysis of 12 trials found ashwagandha improved strength and power, cardiorespiratory fitness and recovery compared with placebo in healthy adults who were training. The strength analysis rested on five trials, all small, and most tested the same branded extract.

The signal is interesting, and the effect estimate was medium-sized, but the evidence is nowhere near that for creatine. Treat it as unproven for performance.`,
      refs: ['bonilla-2021'],
    },
    {
      claim: 'For testosterone and male fertility',
      grade: 'C',
      body: `In a 2019 crossover trial, 43 overweight men aged 40 to 70 took 600 mg a day of an extract for eight weeks. Salivary testosterone rose 14.7 per cent and DHEA-S 18 per cent more than with placebo, but the men did not report meaningfully more energy or vigour. Small trials in men with fertility problems report better sperm counts and motility.

The rises are modest, the trials small, and a higher testosterone reading is not the same as a health benefit. For anyone with a hormone-sensitive condition, such as prostate cancer, it is a reason for caution rather than a selling point.`,
      refs: ['lopresti-2019'],
    },
    {
      claim: 'For memory and thinking',
      grade: 'C',
      body: `A handful of small trials, some in adults with mild cognitive impairment, report better scores on memory and attention tests after eight weeks. They are few, small and short, and have not been replicated at scale. Plausible, not established.`,
    },
    {
      claim: 'For weight loss',
      grade: 'D',
      body: `Ashwagandha is often added to "cortisol" and weight-loss products on the idea that lower stress means less stress eating. One small trial in stressed adults reported fewer food cravings and a slight fall in weight, but there is no good evidence that ashwagandha causes meaningful weight loss. Buying it for that reason is buying a mechanism rather than a result.`,
    },
  ],
  dosage: `Most trials used 250 to 600 mg a day of a standardised root extract, taken once or split into two doses, for eight to twelve weeks. For stress, 300 to 600 mg a day did best in the 2022 meta-analysis; for sleep, the benefit was clearer at 600 mg a day or more. Many people take it in the evening, since drowsiness is a common effect, but no trial has shown that timing matters.

These doses refer to extracts. Root powder is far less concentrated, and traditional Ayurvedic use runs to several grams a day, so a milligram figure only means something when you know which form it is. Effects in trials built up over weeks rather than days.

Because long-term safety data run to only about three months, the cautious approach is to use it for a defined period and stop, rather than indefinitely.`,
  studiedDose: { min: 250, max: 600, unit: 'mg', per: 'day', basis: 'Trial range (extract)' },
  dosageGap: `The most common gap is not the dose but the form. A label that says "ashwagandha 500 mg" without naming an extract or a withanolide percentage may be plain root powder, which is not what the trials tested. Look for the extract name or the standardisation on the panel.

The second gap is combination. Ashwagandha turns up in sleep blends, "cortisol" formulas, testosterone boosters and gummies alongside magnesium, melatonin, rhodiola and caffeine, often in a proprietary blend that hides the amount. Someone taking two or three such products can end up above the studied range without realising it.

Extracts also differ. Root-only and root-plus-leaf extracts have different chemical profiles, and leaf falls outside traditional, root-only use. A trial on one branded extract is evidence for that extract.`,
  safety: `In trials, ashwagandha has usually been well tolerated for up to about three months. The common side effects are mild: loose stools, nausea, stomach upset and drowsiness. Long-term safety has not been studied.

Liver injury is the most serious risk. The NIH LiverTox database rates ashwagandha a probable cause of clinically apparent liver injury. Cases typically appear 2 to 12 weeks after starting, with jaundice, itching, nausea and tiredness, and most resolve within a few months of stopping; rare severe cases have occurred, mainly in people with existing liver disease. Stop taking it and see a doctor if you notice yellowing of the skin or eyes, dark urine, pale stools, itching or pain in the upper right abdomen.

It can raise thyroid hormone levels, so avoid it with an overactive thyroid and check with your doctor if you take thyroid medicine. It may lower blood sugar and blood pressure, add to the effect of sedatives such as benzodiazepines and sleeping tablets, and stimulate the immune system, which matters for autoimmune disease and immune-suppressing medicines.

Do not take it if you are pregnant or breastfeeding: it has traditionally been linked to miscarriage and there are no safety data. Stop it two weeks before surgery. Avoid it with a hormone-sensitive prostate cancer, and if you are allergic to nightshades.

Regulators disagree. Denmark banned ashwagandha from food supplements in 2023 after its national food institute could not establish a safe level of intake. In the UK, the Food Standards Agency asked the Committee on Toxicity to assess its safety; the committee has noted possible effects on the thyroid, blood sugar and reproduction and liver case reports, and no safe level has been set while that work continues. In the US it is sold as a dietary supplement without pre-market approval.`,
  faqs: [
    {
      question: 'What does ashwagandha actually do?',
      answer:
        'The best evidence is for stress: trials of 250 to 600 mg of extract a day for eight weeks report lower stress and anxiety scores and lower cortisol than placebo. There is smaller evidence for slightly better sleep. Claims for testosterone, strength, memory and weight loss rest on small or few trials.',
    },
    {
      question: 'How long does ashwagandha take to work?',
      answer:
        'Trials measured their effects after about eight weeks, and the sleep benefit was clearer after eight weeks or more. Some people report feeling calmer sooner, but that has not been well tested. If nothing has changed after two months, it is unlikely to.',
    },
    {
      question: 'Is it safe to take ashwagandha every day?',
      answer:
        'For healthy adults, daily use for up to about three months has usually been well tolerated in trials. Beyond that, there is no good safety data. Rare liver injury has been reported, and it can affect thyroid hormones, so it is sensible to use it for a set period and stop.',
    },
    {
      question: 'Who should not take ashwagandha?',
      answer:
        'Anyone pregnant or breastfeeding, with liver disease, an overactive thyroid, an autoimmune condition or hormone-sensitive prostate cancer, or scheduled for surgery. Check with a doctor or pharmacist first if you take sedatives, thyroid medicine, diabetes or blood-pressure medicines, or immune-suppressing drugs.',
    },
    {
      question: 'Is ashwagandha banned?',
      answer:
        'In Denmark, yes: it was banned from food supplements in 2023 because a safe level could not be established. It remains legal in the UK, where its safety is under review by the Committee on Toxicity, and in the US, where it is sold as a dietary supplement.',
    },
    {
      question: 'Does ashwagandha increase testosterone?',
      answer:
        'In small trials, modestly. One eight-week trial in 43 men aged 40 to 70 found salivary testosterone rose 14.7 per cent more than with placebo, but the men did not feel noticeably more energetic. It is not a substitute for assessment of low testosterone.',
    },
    {
      question: 'What is KSM-66?',
      answer:
        'A branded ashwagandha extract made from the root only and standardised to about 5 per cent withanolides. It is the extract used in many of the stress and strength trials. Sensoril and Shoden are other branded extracts that include leaf and are standardised differently.',
    },
    {
      question: 'Should I take ashwagandha in the morning or at night?',
      answer:
        'Trials have not shown that timing matters. Because drowsiness is a common side effect, many people take it in the evening, and it was often split into morning and evening doses in the studies.',
    },
  ],
  references: [
    {
      id: 'akhgarjand-2022',
      text: 'Akhgarjand C et al. (2022). Does ashwagandha supplementation have a beneficial effect on the management of anxiety and stress? A systematic review and meta-analysis of randomized controlled trials. Phytotherapy Research — 12 trials, 1,002 participants; certainty of evidence low.',
      url: 'https://onlinelibrary.wiley.com/doi/10.1002/ptr.7598',
    },
    {
      id: 'chandrasekhar-2012',
      text: 'Chandrasekhar K, Kapoor J, Anishetty S (2012). A prospective, randomized double-blind, placebo-controlled study of safety and efficacy of a high-concentration full-spectrum extract of ashwagandha root in reducing stress and anxiety in adults. Indian Journal of Psychological Medicine 34(3):255-262 — 64 adults, 300 mg twice daily for 60 days.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/23439798/',
    },
    {
      id: 'cheah-2021',
      text: 'Cheah KL, Norhayati MN, Husniati Yaacob L, Abdul Rahman R (2021). Effect of ashwagandha (Withania somnifera) extract on sleep: a systematic review and meta-analysis. PLoS One 16(9):e0257843 — 5 trials, 400 participants.',
      url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0257843',
    },
    {
      id: 'bonilla-2021',
      text: 'Bonilla DA et al. (2021). Effects of ashwagandha (Withania somnifera) on physical performance: systematic review and Bayesian meta-analysis. Journal of Functional Morphology and Kinesiology 6(1):20.',
      url: 'https://www.mdpi.com/2411-5142/6/1/20',
    },
    {
      id: 'lopresti-2019',
      text: 'Lopresti AL, Drummond PD, Smith SJ (2019). A randomized, double-blind, placebo-controlled, crossover study examining the hormonal and vitality effects of ashwagandha (Withania somnifera) in aging, overweight males. American Journal of Men’s Health 13(2).',
      url: 'https://doi.org/10.1177/1557988319835985',
    },
    {
      id: 'ods-ashwagandha',
      text: 'NIH Office of Dietary Supplements. Ashwagandha: is it helpful for stress, anxiety, or sleep? — Fact Sheet for Health Professionals. Well tolerated for up to about 3 months; long-term safety unknown.',
      url: 'https://ods.od.nih.gov/factsheets/Ashwagandha-HealthProfessional/',
    },
    {
      id: 'livertox-ashwagandha',
      text: 'NIH LiverTox: Clinical and Research Information on Drug-Induced Liver Injury — Ashwagandha. Likelihood score C (probable cause of clinically apparent liver injury).',
      url: 'https://www.ncbi.nlm.nih.gov/books/NBK548536/',
    },
    {
      id: 'bjornsson-2020',
      text: 'Björnsson HK et al. (2020). Ashwagandha-induced liver injury: a case series from Iceland and the US Drug-Induced Liver Injury Network. Liver International.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/31991029/',
    },
    {
      id: 'mcgill-denmark',
      text: 'McGill Office for Science and Society. Why did Denmark ban ashwagandha? — on the 2023 ban and the DTU Food Institute risk assessment behind it.',
      url: 'https://www.mcgill.ca/oss/article/critical-thinking-health-and-nutrition/why-did-denmark-ban-ashwagandha',
    },
    {
      id: 'fsa-cot',
      text: 'UK Committee on Toxicity (COT). Review of the safety of ashwagandha in food supplements — requested by the Food Standards Agency; assessment ongoing in 2026.',
      url: 'https://www.gov.uk/government/publications/19th-may-2026-committee-on-toxicity-meeting/final-minutes-of-the-19th-may-2026-cot-meeting',
    },
  ],
  editorNote:
    'Ashwagandha has better evidence than most herbs sold for stress — a dozen placebo-controlled trials pointing the same way is more than rhodiola or holy basil can show. But "better than most herbs" is a low bar. The trials are short, small and largely paid for by the people selling the extract, and the safety file has real entries in it: liver case reports, thyroid effects and a European country that has taken it off the shelves. If you try it, choose a named, standardised root extract at 300 to 600 mg, give it eight weeks, stop if it is not doing anything, and do not treat it as something to take for years.',
  related: ['l-theanine', 'creatine-monohydrate'],
  history: [
    {
      date: '2026-10-01',
      note: 'First published with per-claim evidence grades: stress and anxiety, and sleep (B); strength, testosterone, and memory (C); weight loss (D). Safety section covers the NIH LiverTox rating, thyroid effects, the 2023 Danish ban and the UK Committee on Toxicity review.',
    },
  ],
  updated: '2026-10-01',
};
