import type { FAQ } from './types';
import type { HistoryEntry } from '@/components/article-footer';
import { isLive, slot } from './schedule';

/**
 * Transparent A–F evidence grading.
 *
 * The bands are published at /evidence-grading and applied per claimed benefit
 * rather than per ingredient, because evidence strength almost always varies by
 * what is being claimed. An ingredient with good evidence for one outcome and
 * none for another should not average into a single reassuring letter.
 */
export type EvidenceGrade = 'A' | 'B' | 'C' | 'D' | 'F';

export const gradeBands: { grade: EvidenceGrade; label: string; criteria: string }[] = [
  {
    grade: 'A',
    label: 'Strong evidence',
    criteria:
      'Five or more independent studies, 500+ combined participants, consistent positive results, including randomised controlled trials or meta-analyses.',
  },
  {
    grade: 'B',
    label: 'Moderate evidence',
    criteria:
      'Two to four studies with adequate sample sizes. Positive overall, but less consistent than grade A.',
  },
  {
    grade: 'C',
    label: 'Limited evidence',
    criteria:
      'One or two studies, or small sample sizes. Promising but inconclusive, and a larger trial could reasonably overturn it.',
  },
  {
    grade: 'D',
    label: 'Weak evidence',
    criteria:
      'Mechanistic or theoretical support only, animal studies, or human results that contradict each other.',
  },
  {
    grade: 'F',
    label: 'Not supported',
    criteria:
      'The majority of available evidence shows no effect, or shows the opposite of the marketed claim.',
  },
];

export type Citation = {
  id: string;
  text: string;
  url?: string;
};

export type ClaimEvidence = {
  claim: string;
  grade: EvidenceGrade;
  body: string;
  /** Citation ids referenced by this claim. */
  refs?: string[];
};

export type IngredientPage = {
  slug: string;
  name: string;
  /** Names as they appear on labels, used to match product ingredient rows. */
  aliases: string[];
  category: string;
  /** Overall grade. Always the weakest defensible reading, never an average. */
  grade: EvidenceGrade;
  /** 60–100 words. Written to stand alone as a complete answer. */
  quickAnswer: string;
  /**
   * The handful of numbers a reader should leave with even if they read
   * nothing else. Rendered as a panel directly under the quick answer, so
   * keep it to four to six rows and put the figure in `value`.
   */
  atAGlance?: { label: string; value: string; note?: string }[];
  whatIsIt: string;
  mechanism: string;
  claims: ClaimEvidence[];
  dosage: string;
  /** Where commercial products commonly diverge from the studied amount. */
  dosageGap: string;
  safety: string;
  faqs: FAQ[];
  references: Citation[];
  editorNote: string;
  related: string[];
  updated: string;
  /**
   * When the page goes live, usually slot(date, n) from lib/schedule. Omitted
   * means live now. Until then the page is a 404 and appears in no list.
   */
  published?: string;
  /** Real publication events only. An invented edit trail is worse than none. */
  history?: HistoryEntry[];
};

export const ingredients: IngredientPage[] = [
  {
    slug: 'l-theanine',
    name: 'L-theanine',
    aliases: ['l-theanine', 'theanine'],
    category: 'Amino acid',
    grade: 'B',
    quickAnswer:
      'L-theanine is an amino acid found almost exclusively in tea. The best-supported use is short-term: taken with caffeine, it reliably changes how the caffeine feels, reducing jitteriness while attention improves. Evidence that it improves memory, or does much on its own without caffeine, is considerably thinner. Typical studied doses are 100–200 mg. It is well tolerated, but it is not a sedative and not a treatment for an anxiety disorder.',
    whatIsIt:
      'L-theanine is a non-protein amino acid produced by the tea plant, Camellia sinensis, and by a small number of mushrooms. A cup of brewed tea contains roughly 25–60 mg depending on the leaf and the brew, which is why supplement doses of 100–200 mg are several cups worth in a single capsule. Commercially it is either extracted from tea or produced by fermentation; the synthetic form used in most supplements is chemically identical to the tea-derived form.',
    mechanism:
      'L-theanine is structurally similar to glutamate, which lets it cross the blood–brain barrier and interact with glutamate receptors. It is associated with increased alpha-wave activity in the brain — the electrical pattern present during relaxed wakefulness rather than drowsiness — which is the physiological basis for the claim that it produces calm without sedation. It is also proposed to modulate GABA, dopamine and serotonin, though the human evidence for those pathways is much weaker than the marketing implies. Most of what is reliably observed happens alongside caffeine rather than instead of it.',
    claims: [
      {
        claim: 'Taken with caffeine, for attention and reduced jitteriness',
        grade: 'B',
        body: 'This is the strongest use and the one most trials actually tested. Combination studies typically pair 100–250 mg of L-theanine with 40–100 mg of caffeine and measure attention-switching tasks and self-reported alertness. The consistent finding is that the combination improves attention more than either alone, and that theanine blunts the unpleasant edge of caffeine. Note what this does not show: a benefit from theanine by itself.',
        refs: ['haskell2008'],
      },
      {
        claim: 'For subjective stress and relaxation',
        grade: 'C',
        body: 'Several small trials report reduced self-reported stress and improved sleep quality, generally at 200 mg daily. Sample sizes are small, outcomes are self-reported rather than clinical, and study quality varies. Promising and plausible, but not established, and not comparable to treatment for a diagnosed anxiety disorder.',
      },
      {
        claim: 'For memory or long-term cognitive performance',
        grade: 'D',
        body: 'This is where the category marketing runs furthest ahead of the research. Trials measuring memory specifically are few, small, and inconsistent, and an improvement in attention while caffeinated is not evidence of better memory. Any product sold on a memory claim carrying only theanine is making a claim its own ingredient does not support.',
      },
    ],
    dosage:
      'Studied doses cluster at 100–200 mg, most often as a single dose taken with caffeine for acute effects, or 200 mg daily in the stress and sleep trials. Higher intakes have been used in research without notable problems, but there is no evidence that more produces more effect, and the acute studies that found benefits used the lower end of that range.',
    dosageGap:
      'The common commercial problem is not underdosing — 100–200 mg per capsule is typical and matches the research. It is what comes with it. Several popular products pair theanine with green tea extract or other actives and market the result as a theanine product, so the panel is worth reading in full rather than trusting the name on the front.',
    safety:
      'L-theanine is generally well tolerated and has no established serious adverse effects at supplement doses. Because it may modestly lower blood pressure, anyone taking antihypertensive medication should raise it with a clinician. It is often combined with caffeine in commercial products, so the total caffeine from every source is the number that matters for anyone sensitive to stimulants. Safety in pregnancy and breastfeeding has not been established, and it has not been studied adequately in children. It is not a substitute for treatment of a diagnosed anxiety or sleep disorder.',
    faqs: [
      {
        question: 'Does L-theanine work without caffeine?',
        answer:
          'The evidence is much weaker. Most trials showing a clear cognitive effect gave theanine alongside caffeine and measured the combination. Taken alone, the reliable findings are limited to modest, self-reported changes in stress and relaxation.',
      },
      {
        question: 'How much L-theanine is in a cup of tea?',
        answer:
          'Roughly 25 to 60 mg, depending on the leaf, quantity and brewing time. A 200 mg capsule is therefore several cups worth in one dose, which is why supplement effects are not directly comparable to drinking tea.',
      },
      {
        question: 'Will L-theanine make me drowsy?',
        answer:
          'It is not a sedative. The associated increase in alpha-wave activity corresponds to relaxed wakefulness rather than sleepiness, which is the basis for the claim that it produces calm without drowsiness.',
      },
      {
        question: 'Is L-theanine the same as green tea extract?',
        answer:
          'No, and the distinction matters. Green tea extract is a concentrated preparation containing catechins such as EGCG and carries documented liver-injury reports in some people. L-theanine is a single amino acid with a different and much more benign safety profile. Some products contain both.',
      },
      {
        question: 'Can I take L-theanine every day?',
        answer:
          'Daily use at 200 mg has been used in trials without notable problems. There is no established reason to cycle it, but there is also no long-term safety data running to years, so open-ended daily use is a judgement call worth raising with a clinician.',
      },
    ],
    references: [
      {
        id: 'haskell2008',
        text: 'Haskell CF, Kennedy DO, Milne AL, Wesnes KA, Scholey AB. The effects of L-theanine, caffeine and their combination on cognition and mood. Biological Psychology, 2008.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/18006208/',
      },
      {
        id: 'ods-livertox',
        text: 'NIH LiverTox: Clinical and Research Information on Drug-Induced Liver Injury — green tea extract entry, relevant where theanine products also contain catechins.',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK547852/',
      },
    ],
    editorNote:
      'My reservation with this ingredient is not safety, it is scope creep. Theanine has a genuine, narrow, well-tested use — it changes how caffeine feels — and that finding has been stretched to cover focus, memory and productivity claims it was never asked to support. If a product is sold to you on memory, look for what else is in the capsule, because it is unlikely to be the theanine doing the work.',
    related: ['green-tea-extract', 'vitamin-d3'],
    history: [
      { date: '2026-09-21', note: 'First published with per-claim evidence grades.' },
      { date: '2026-09-21', note: 'Related-ingredient links extended as the reference set grew.' },
    ],
    updated: '2026-09-21',
  },
  {
    slug: 'glucomannan',
    name: 'Glucomannan',
    aliases: ['glucomannan', 'konjac root', 'konjac glucomannan', 'amorphophallus konjac'],
    category: 'Soluble fibre',
    grade: 'D',
    quickAnswer:
      'Glucomannan is a soluble fibre from konjac root that absorbs water and forms a gel, which is why it is sold for appetite control and weight loss. The NIH Office of Dietary Supplements concludes it has little to no effect on weight loss. It does have reasonable support as a fibre for regularity and cholesterol. It must be taken with substantial liquid because it swells, and it carries a genuine choking risk if taken with too little.',
    whatIsIt:
      'Glucomannan is a water-soluble dietary fibre extracted from the root of Amorphophallus konjac, a plant long used in East Asian cooking to make konjac flour and shirataki noodles. It is exceptionally absorbent — it can take up many times its own weight in water — and that physical property, rather than any metabolic action, is the whole basis of its use in supplements.',
    mechanism:
      'Taken with water, glucomannan forms a viscous gel in the stomach. The proposed effect is mechanical: the gel adds bulk, slows gastric emptying and is intended to promote a feeling of fullness that reduces how much someone eats. The same viscosity is the plausible mechanism behind its effects on cholesterol absorption and stool bulk. Importantly, this is a physical mechanism, not a metabolic one — it does not increase energy expenditure or alter how fat is stored, whatever the category it is shelved in implies.',
    claims: [
      {
        claim: 'For weight loss',
        grade: 'F',
        body: 'The NIH Office of Dietary Supplements reviewed the available trials and concludes glucomannan has little to no effect on weight loss. Individual small studies have reported modest differences, but the body of evidence as a whole does not support the claim that is printed on most of the packaging. This is the clearest example on this site of a plausible mechanism failing to produce a demonstrated outcome.',
        refs: ['ods-weightloss'],
      },
      {
        claim: 'For regularity and stool bulk',
        grade: 'B',
        body: 'As a bulk-forming soluble fibre, glucomannan behaves the way other soluble fibres do, and the evidence for fibre intake and regularity is reasonable. This is the use most consistent with what the ingredient physically does, and notably it is not usually the use it is marketed for.',
      },
      {
        claim: 'For cholesterol already in the healthy range',
        grade: 'C',
        body: 'Viscous fibres can reduce absorption of dietary cholesterol and bile acids, and some trials report modest reductions in total and LDL cholesterol. The effect sizes are small, the trials are not large, and this should not be read as a substitute for treatment where treatment is indicated.',
      },
    ],
    dosage:
      'Trials have generally used 1 to 4 g daily, divided across doses and taken shortly before meals with a large glass of water. Commercial capsule products frequently use a three-capsule serving to reach roughly 1.7 g, which is inside that range but at the lower end.',
    dosageGap:
      'The recurring problem here is not the dose, it is the arithmetic. A bottle labelled 575 mg on the front may define a serving as three capsules, so the serving is 1,725 mg and a 180-capsule bottle is 60 servings rather than 180. That turns an apparent six-month supply into two months, and it makes a per-bottle price comparison against a one-capsule-serving product meaningless.',
    safety:
      'Glucomannan swells rapidly on contact with liquid, and this is a genuine safety concern rather than a formality. Taken with inadequate liquid, or by anyone with difficulty swallowing, it can obstruct the throat or oesophagus. It should always be taken with a full glass of water and never immediately before lying down. Because it slows absorption, it can interfere with how other medicines and nutrients are taken up, so doses are usually separated by at least an hour or two from medication. Anyone with a history of bowel obstruction, existing gastrointestinal disease, diabetes medication or scheduled surgery should take advice before starting. Bloating, cramping and flatulence are common when starting, and increasing intake gradually helps.',
    faqs: [
      {
        question: 'Does glucomannan actually cause weight loss?',
        answer:
          'On the available evidence, no. The NIH Office of Dietary Supplements concludes it has little to no effect on weight loss. Promoting a feeling of fullness is a plausible mechanism, but a plausible mechanism is not a demonstrated result, and it is the result that matters.',
      },
      {
        question: 'Why does the bottle say 575 mg when a serving is 1,725 mg?',
        answer:
          '575 mg is the amount in one capsule and the labelled serving is three. Both figures are accurate; only the serving tells you what you are actually taking. Always work from the Supplement Facts panel rather than the number on the front.',
      },
      {
        question: 'How much water does it need?',
        answer:
          'A full glass, at minimum, with every dose. This is a safety instruction rather than a suggestion — glucomannan expands substantially and has caused obstruction when taken with too little liquid.',
      },
      {
        question: 'Can I take it with my medication?',
        answer:
          'Not at the same time. Viscous fibres can slow or reduce the absorption of other substances, so glucomannan is usually taken well apart from medicines. Check with a pharmacist, who can advise on the specific spacing for what you take.',
      },
      {
        question: 'Is glucomannan the same as psyllium?',
        answer:
          'Both are bulk-forming soluble fibres with similar handling requirements, but they come from different plants and the evidence differs by use. Neither is established as a weight-loss agent.',
      },
    ],
    references: [
      {
        id: 'ods-weightloss',
        text: 'NIH Office of Dietary Supplements. Dietary Supplements for Weight Loss — Fact Sheet for Consumers.',
        url: 'https://ods.od.nih.gov/factsheets/WeightLoss-Consumer/',
      },
    ],
    editorNote:
      'This is the ingredient I point to when someone asks why we grade by claim rather than by ingredient. Glucomannan is a perfectly reasonable fibre that does what fibres do, and it is sold almost entirely for the one thing the evidence says it does not do. A single letter grade for the whole ingredient would hide exactly the distinction a buyer needs.',
    related: ['psyllium-husk', 'green-tea-extract'],
    history: [
      { date: '2026-09-21', note: 'First published with per-claim evidence grades.' },
      { date: '2026-09-21', note: 'Related-ingredient links extended as the reference set grew.' },
    ],
    updated: '2026-09-21',
  },
  {
    slug: 'vitamin-d3',
    name: 'Vitamin D3',
    aliases: ['vitamin d3', 'vitamin d', 'cholecalciferol', 'vitamin d3 (cholecalciferol)'],
    category: 'Fat-soluble vitamin',
    grade: 'A',
    quickAnswer:
      'Vitamin D3 (cholecalciferol) is the form of vitamin D your skin makes from sunlight. The evidence for correcting a documented deficiency is strong and uncontroversial. The evidence that supplementing benefits people who are not deficient is much weaker — the large VITAL trial found no reduction in cancer or cardiovascular events in a generally replete population. The useful question is not whether vitamin D matters, but whether your level is actually low, which requires a blood test rather than a guess.',
    whatIsIt:
      'Vitamin D3, or cholecalciferol, is the form of vitamin D produced in skin on exposure to UVB light and found in oily fish, egg yolk and fortified foods. It is fat-soluble, which means it is stored in the body rather than excreted freely, and that storage capacity is why excessive intake can accumulate to harm in a way most water-soluble vitamins cannot. D3 is generally more effective than D2 (ergocalciferol) at raising and maintaining blood levels.',
    mechanism:
      'Vitamin D is a prohormone rather than a vitamin in the classical sense. It is hydroxylated first in the liver to 25-hydroxyvitamin D — the form measured in a blood test — and then in the kidney to the active hormone calcitriol. Calcitriol regulates calcium and phosphate absorption in the gut and their handling in bone and kidney, which is the basis of its established role in bone health. Vitamin D receptors are present in many other tissues, which is the origin of the wide range of proposed benefits; presence of a receptor, however, is not evidence of a clinical effect from supplementation.',
    claims: [
      {
        claim: 'For correcting a documented deficiency',
        grade: 'A',
        body: 'This is settled and not seriously disputed. Where blood levels are low, supplementation raises them, and correcting deficiency prevents rickets in children and osteomalacia in adults. This is the use vitamin D supplements exist for, and it depends on knowing your level.',
        refs: ['ods-vitd'],
      },
      {
        claim: 'For bone health and fracture risk',
        grade: 'B',
        body: 'Supported, but with important conditions. The benefit is clearest in older adults, in people who are deficient, and generally when taken with adequate calcium. In populations that are already replete, trials have been much less impressive, and very high intermittent doses have in some studies been associated with worse outcomes rather than better.',
      },
      {
        claim: 'For preventing cancer or cardiovascular disease',
        grade: 'D',
        body: 'The VITAL trial randomised 25,871 adults to 2,000 IU of vitamin D3 daily or placebo and found no significant reduction in invasive cancer incidence or major cardiovascular events over roughly five years. Observational studies repeatedly associate low vitamin D with poor outcomes, but that association has not translated into benefit from supplementing people who are not deficient.',
        refs: ['vital2019'],
      },
      {
        claim: 'For immune function generally',
        grade: 'C',
        body: 'There is a real mechanistic basis and some trial evidence for a modest effect on respiratory infection, with the benefit concentrated in people who were deficient to begin with. Generalising that into a broad immune-support claim for everyone goes beyond what has been shown.',
      },
    ],
    dosage:
      'The recommended dietary allowance in the United States is 600 IU (15 mcg) daily for most adults and 800 IU (20 mcg) from age 71, with a tolerable upper intake level of 4,000 IU (100 mcg) daily for adults. Common supplement strengths are 1,000 IU (25 mcg) and 2,000 IU (50 mcg). Where deficiency has been diagnosed, clinicians often use substantially higher short-term repletion doses, which is a decision for them rather than for a label.',
    dosageGap:
      'The problem in this category is unit confusion rather than underdosing. The same product may be described as 25 mcg on one line and 1,000 IU on another, and manufacturer pages sometimes contradict themselves between the two. Because the numbers differ by a factor of forty, a reader comparing a mcg figure against an IU figure can be badly wrong about relative strength. Always compare in the same unit, taken from the Supplement Facts panel.',
    safety:
      'Vitamin D is fat-soluble and accumulates, so excessive long-term intake can cause hypercalcaemia, with nausea, weakness, frequent urination, kidney stones and, in severe cases, kidney damage. The adult upper limit of 4,000 IU daily should not be exceeded without clinical supervision. It interacts with several medicines, including some diuretics, steroids, statins and weight-loss drugs that reduce fat absorption. Anyone with sarcoidosis, hyperparathyroidism, kidney disease or a history of kidney stones should not supplement without advice. Because the right dose depends on a measured blood level, this is one of the clearest cases where testing beats estimating.',
    faqs: [
      {
        question: 'Is 25 mcg the same as 1,000 IU?',
        answer:
          'Yes. They are two units for the same amount of vitamin D, and 1 mcg equals 40 IU. Labels vary in which they lead with, which is exactly how cross-brand strength comparisons go wrong.',
      },
      {
        question: 'Should I take vitamin D if I am not deficient?',
        answer:
          'The evidence for benefit in people who are already replete is weak. The large VITAL trial found no reduction in cancer or cardiovascular events at 2,000 IU daily in a generally sufficient population. Testing your level is a more useful step than supplementing on the assumption that you are low.',
      },
      {
        question: 'What is the difference between D2 and D3?',
        answer:
          'D3 (cholecalciferol) is the form made in skin and is generally more effective at raising and sustaining blood levels than D2 (ergocalciferol). D2 is usually plant-derived and is the common choice in vegan products.',
      },
      {
        question: 'Can you take too much vitamin D?',
        answer:
          'Yes, and this matters more than for most vitamins because it is stored rather than excreted. The adult tolerable upper intake level is 4,000 IU daily. Sustained intake above that without supervision can cause hypercalcaemia and kidney problems.',
      },
      {
        question: 'Does vitamin D need to be taken with food?',
        answer:
          'It is fat-soluble, so absorption improves when it is taken with a meal containing some fat. This is a reasonable habit rather than a strict requirement.',
      },
    ],
    references: [
      {
        id: 'ods-vitd',
        text: 'NIH Office of Dietary Supplements. Vitamin D — Fact Sheet for Health Professionals.',
        url: 'https://ods.od.nih.gov/factsheets/VitaminD-HealthProfessional/',
      },
      {
        id: 'vital2019',
        text: 'Manson JE, Cook NR, Lee I-M, et al. Vitamin D Supplements and Prevention of Cancer and Cardiovascular Disease (VITAL). New England Journal of Medicine, 2019. n=25,871.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/30415629/',
      },
    ],
    editorNote:
      'Vitamin D is the ingredient people most often take on faith. It has the strongest evidence base on this site for one specific job — fixing a deficiency — and some of the weakest for the broad preventive claims it gets sold on. Those two facts sit together comfortably once you stop treating a nutrient as either good or bad. Get the blood test; it answers the question the label cannot.',
    related: ['omega-3', 'psyllium-husk'],
    history: [
      { date: '2026-09-21', note: 'First published with per-claim evidence grades.' },
      { date: '2026-09-21', note: 'Related-ingredient links extended as the reference set grew.' },
    ],
    updated: '2026-09-21',
  },
  {
    slug: 'psyllium-husk',
    name: 'Psyllium husk',
    aliases: ['psyllium', 'psyllium husk', 'plantago ovata', 'ispaghula'],
    category: 'Soluble fibre',
    grade: 'A',
    quickAnswer:
      'Psyllium husk is a soluble fibre from the seeds of Plantago ovata. It is one of the few supplement ingredients carrying an FDA-authorised health claim: soluble fibre from psyllium may reduce the risk of heart disease when eaten as part of a low-fat diet. The evidence for lowering LDL cholesterol and for treating constipation is genuinely strong. Evidence that it causes weight loss is not. It must be taken with a full glass of liquid.',
    whatIsIt:
      'Psyllium husk is the outer coating of the seed of Plantago ovata, a plant grown mainly in India. It is roughly 70 per cent soluble fibre, far higher than most food sources, which is why a modest scoop delivers an amount of soluble fibre that would take a large volume of vegetables to match. It is the active ingredient in several long-standing pharmacy bulk-forming laxatives as well as in supplements sold for general fibre intake.',
    mechanism:
      'Psyllium is highly hydrophilic: in water it forms a viscous gel. That single physical property drives all of its established effects. In the gut the gel increases stool water content and bulk, which is what relieves constipation, and paradoxically also firms loose stool by absorbing excess water. The same viscosity traps bile acids and prevents their reabsorption, so the liver draws on circulating cholesterol to make more — which is the mechanism behind the LDL reduction. It also slows gastric emptying and the rate at which carbohydrate is absorbed, which is why it modestly blunts post-meal glucose rises. Note that none of this is metabolic: psyllium does not alter how energy is stored or burned.',
    claims: [
      {
        claim: 'For lowering LDL cholesterol',
        grade: 'A',
        body: 'This is among the best-supported claims for any ingredient covered on this site, and it is unusual in carrying formal regulatory recognition. The FDA permits an authorised health claim linking soluble fibre from psyllium husk to reduced risk of coronary heart disease, which requires significant scientific agreement rather than a single promising trial. Multiple randomised trials and meta-analyses report reductions in total and LDL cholesterol at doses of roughly 7 to 10 g daily. Effect sizes are modest, and this supports rather than replaces treatment where treatment is indicated.',
        refs: ['fda-psyllium'],
      },
      {
        claim: 'For constipation and regularity',
        grade: 'A',
        body: 'Psyllium is an established bulk-forming laxative with decades of clinical use behind it, not merely a supplement with supportive trials. It increases stool bulk and water content, and it is routinely recommended as a first-line approach for chronic constipation. Its usefulness in both constipation and loose stool follows from the same gel-forming property acting in opposite directions on stool water.',
      },
      {
        claim: 'For blood glucose control',
        grade: 'B',
        body: 'By slowing gastric emptying and carbohydrate absorption, psyllium modestly reduces post-meal glucose rises, and trials in people with type 2 diabetes report small improvements in glycaemic markers. The effect is real but not large, and it is an adjunct to dietary management rather than a substitute for it. Anyone on glucose-lowering medication should raise it with a clinician, because the combination can require dose adjustment.',
      },
      {
        claim: 'For weight loss',
        grade: 'C',
        body: 'The satiety mechanism is plausible and there is some trial evidence for modest reductions in appetite and energy intake, but the body of evidence does not establish psyllium as a weight-loss agent. It is frequently shelved alongside thermogenics, which invites a comparison the label does not support. If it helps, it helps by making meals more filling, not by changing metabolism.',
      },
    ],
    dosage:
      'Trials for cholesterol generally use about 7 to 10 g of psyllium daily, divided across doses with meals — the FDA health claim is built around roughly 7 g of soluble fibre per day. For constipation, typical use is 5 to 10 g daily. A common powder serving is around 9 g of husk providing about 7 g of dietary fibre, which sits squarely in the studied range. Start at a fraction of the target dose and build up over a week or two.',
    dosageGap:
      'Psyllium is one of the rare ingredients where commercial products routinely hit the studied dose, because the effective amount is cheap and the product is mostly fibre. The more common mismatch is format: capsule versions often contain half a gram or less each, so reaching a 7 g dose means swallowing ten or more capsules, and the per-serving arithmetic on the label rarely makes that obvious. Compare grams of fibre per serving, not capsule counts.',
    safety:
      'The central safety issue is swelling. Psyllium expands rapidly on contact with liquid and has caused choking and oesophageal obstruction when taken with too little. Always take it with a full glass of water or more, drink it promptly rather than letting it thicken in the glass, and never take it immediately before lying down. It should be avoided by anyone with difficulty swallowing or a history of bowel obstruction or oesophageal narrowing. Because it slows absorption, it can reduce the uptake of medicines taken at the same time, so doses are generally separated by at least two hours — this matters particularly for thyroid medication, lithium, carbamazepine and some diabetes drugs. Bloating, cramping and flatulence are common in the first weeks and usually settle if intake is increased gradually. Allergic reactions are rare but documented, most often in people with repeated occupational exposure to the powder.',
    faqs: [
      {
        question: 'Does psyllium help you lose weight?',
        answer:
          'Not directly, and the evidence does not support it as a weight-loss agent. It can make meals more filling, which may reduce how much you eat, but it does not affect metabolism or fat storage. It is often shelved with fat burners, which invites a claim its own label does not make.',
      },
      {
        question: 'How much water does psyllium need?',
        answer:
          'At least a full glass per serving, taken promptly. This is a safety instruction rather than a preference: psyllium swells substantially, and taking it with insufficient liquid has caused choking and obstruction.',
      },
      {
        question: 'Is psyllium safe to take every day?',
        answer:
          'Daily use is common and generally well tolerated, and it is routinely recommended for chronic constipation. Increase the dose gradually, keep fluid intake up, and space it away from medication. Persistent changes in bowel habit warrant a clinician rather than a supplement.',
      },
      {
        question: 'Can psyllium interfere with my medication?',
        answer:
          'Yes. By slowing absorption it can reduce how much of another drug reaches the bloodstream when taken at the same time. A gap of at least two hours is the usual advice, and it matters most for thyroid medication, lithium, carbamazepine and glucose-lowering drugs. A pharmacist can advise on your specific list.',
      },
      {
        question: 'What is the difference between psyllium and glucomannan?',
        answer:
          'Both are viscous soluble fibres with similar handling requirements, but the evidence differs sharply by use. Psyllium has an FDA-authorised health claim for cholesterol and established use for constipation. Glucomannan has neither, and the NIH concludes it has little to no effect on the weight loss it is usually sold for.',
      },
    ],
    references: [
      {
        id: 'fda-psyllium',
        text: 'US Food and Drug Administration. Health claim: soluble fiber from certain foods and risk of coronary heart disease, 21 CFR 101.81 — includes soluble fibre from psyllium husk.',
        url: 'https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-101/subpart-E/section-101.81',
      },
      {
        id: 'ods-fibre',
        text: 'NIH Office of Dietary Supplements. Dietary Supplements for Weight Loss — Fact Sheet for Consumers, covering fibre supplements and weight outcomes.',
        url: 'https://ods.od.nih.gov/factsheets/WeightLoss-Consumer/',
      },
    ],
    editorNote:
      'Psyllium is the ingredient I would point to if someone asked what a good supplement looks like. It does one physical thing, that one thing produces several well-documented effects, the effective dose is cheap and disclosed, and the regulator has reviewed the cholesterol claim rather than taking a manufacturer at its word. It is also the one people abandon fastest, because a fortnight of bloating arrives before any of the benefits do. Build up slowly and the tolerance issue mostly disappears.',
    related: ['glucomannan', 'omega-3'],
    history: [{ date: '2026-09-21', note: 'First published with per-claim evidence grades.' }],
    updated: '2026-09-21',
  },
  {
    slug: 'green-tea-extract',
    name: 'Green tea extract',
    aliases: [
      'green tea extract',
      'green tea',
      'camellia sinensis extract',
      'egcg',
      'epigallocatechin',
    ],
    category: 'Botanical extract',
    grade: 'C',
    quickAnswer:
      'Green tea extract is a concentrated preparation of the catechins in green tea, principally EGCG. The NIH states it might help with a small amount of weight loss — an effect too small to matter much in practice. The more important fact is the safety profile: concentrated extract has been linked to liver injury in some people, a risk that does not apply to drinking tea. Treating the capsule and the beverage as equivalent is the central mistake in this category.',
    whatIsIt:
      'Green tea extract is made by concentrating the polyphenols from the leaves of Camellia sinensis, the same plant that produces black and oolong tea. The compounds of interest are catechins, and the most studied is epigallocatechin gallate, usually abbreviated EGCG. A cup of brewed green tea contains roughly 50 to 100 mg of EGCG; supplement capsules commonly deliver several hundred milligrams, and some deliver far more. That concentration step is what separates a food from a supplement here, and it is also what changes the risk profile.',
    mechanism:
      'Catechins are proposed to influence weight through two routes: mild inhibition of the enzyme that breaks down noradrenaline, which modestly raises energy expenditure and fat oxidation, and some inhibition of digestive enzymes that reduces fat absorption. Both effects are real in laboratory conditions and both are small in people. Many products pair the extract with caffeine, and since green tea naturally contains caffeine unless it has been removed, part of what is attributed to catechins in some trials is likely the stimulant. The antioxidant activity that dominates the marketing is well demonstrated in a test tube and poorly translated into clinical outcomes.',
    claims: [
      {
        claim: 'For weight loss',
        grade: 'C',
        body: 'The NIH Office of Dietary Supplements concludes green tea might help with a small amount of weight loss. That phrasing is doing careful work: some trials find a difference, the difference is small, and results are inconsistent across studies and populations. Trials often combine catechins with caffeine, which makes attribution difficult. This is a marginal effect being sold as a primary one.',
        refs: ['ods-weightloss-gt'],
      },
      {
        claim: 'For raising metabolic rate',
        grade: 'C',
        body: 'Short-term studies do report modest increases in energy expenditure and fat oxidation after catechin doses, frequently alongside caffeine. The increases are small, appear to diminish with habitual caffeine use, and have not been shown to accumulate into meaningful weight change over months. A measurable change in a metabolic chamber is not the same as a change on the scale.',
      },
      {
        claim: 'For cardiovascular or cholesterol benefit',
        grade: 'C',
        body: 'Observational research associates green tea consumption with better cardiovascular markers, and some trials report small reductions in LDL cholesterol. The evidence is mostly drawn from drinking tea rather than taking concentrated extract, and the association in population studies cannot be transferred to a capsule without evidence that the capsule produces the same result.',
      },
      {
        claim: 'For general antioxidant or anti-ageing benefit',
        grade: 'D',
        body: 'Catechins demonstrate antioxidant activity in laboratory assays, and that finding underpins an enormous amount of marketing. Translating it into a clinical outcome in humans is a different matter, and the trials that would establish it have largely not been done. A mechanism in a test tube is a reason to investigate, not a reason to claim.',
      },
    ],
    dosage:
      'Trials examining weight and metabolic outcomes have typically used 250 to 500 mg of catechins daily, often standardised to EGCG content and frequently with caffeine. There is no established effective dose, because there is no well-established effect to titrate against. Products vary enormously, from modest amounts matching a cup or two of tea to doses many times higher.',
    dosageGap:
      'The concern here runs opposite to most ingredients: the problem is products that exceed the studied range rather than fall short of it. Because the marketing rewards a bigger number, some extracts deliver EGCG far above what trials used, which is precisely where the liver signal appears. It is also common to find green tea extract added to products sold as something else — a theanine capsule, a pre-workout, a multi-ingredient fat burner — so someone taking several products can accumulate a total they never intended.',
    safety:
      'This is the section that matters most. Concentrated green tea extract has been linked to liver injury in some people, and the NIH LiverTox database catalogues the case reports. The risk is associated with the concentrated extract rather than with drinking tea, appears more likely at higher doses and on an empty stomach, and can occur in people with no prior liver problem. Stop taking it and seek medical attention for yellowing of the skin or eyes, dark urine, pale stools, persistent nausea, unusual fatigue or pain in the upper right abdomen. Anyone with existing liver disease, or taking medication metabolised by the liver, should not take concentrated extract without medical advice. Unless a product states it is decaffeinated, it also contributes caffeine to your daily total, and green tea extract appears in many multi-ingredient formulas where it is easy to miss. It may also reduce absorption of iron and some medicines, including certain beta-blockers and statins.',
    faqs: [
      {
        question: 'Is green tea extract the same as drinking green tea?',
        answer:
          'No, and the difference is the whole point. A cup of tea contains roughly 50 to 100 mg of EGCG; capsules commonly contain several hundred. The liver-injury reports are associated with the concentrated extract, not with the beverage, so the safety of tea drinking cannot be used to vouch for a supplement.',
      },
      {
        question: 'Can green tea extract damage your liver?',
        answer:
          'There are documented case reports of liver injury associated with concentrated green tea extract, catalogued in the NIH LiverTox database. It is uncommon, but it has occurred in people without prior liver disease. Higher doses and taking it on an empty stomach appear to increase the risk.',
      },
      {
        question: 'Does green tea extract burn fat?',
        answer:
          'The NIH position is that green tea might help with a small amount of weight loss. Short-term studies show modest increases in energy expenditure, often alongside caffeine, but these have not been shown to produce meaningful weight change over time. It is a marginal effect sold as a primary benefit.',
      },
      {
        question: 'Does green tea extract contain caffeine?',
        answer:
          'Usually yes, unless the label specifically says decaffeinated. That matters because it appears in many multi-ingredient products, so it can add to a daily caffeine total that is already higher than someone realises.',
      },
      {
        question: 'Who should avoid it?',
        answer:
          'Anyone with existing liver disease or taking medication metabolised by the liver should not take concentrated extract without medical advice. It is also worth avoiding on an empty stomach, and worth checking whether it is already present in other products you take.',
      },
    ],
    references: [
      {
        id: 'ods-weightloss-gt',
        text: 'NIH Office of Dietary Supplements. Dietary Supplements for Weight Loss — Fact Sheet for Consumers, green tea section.',
        url: 'https://ods.od.nih.gov/factsheets/WeightLoss-Consumer/',
      },
      {
        id: 'livertox-gt',
        text: 'NIH LiverTox: Clinical and Research Information on Drug-Induced Liver Injury — green tea extract.',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK547852/',
      },
    ],
    editorNote:
      'Green tea extract is the clearest example on this site of a food being turned into something with a different risk profile and sold on the food’s reputation. Nobody worries about a cup of green tea, and they are right not to. A capsule delivering several times the catechin content of that cup is a different proposition, and the case reports are real. My practical concern is accumulation: it turns up quietly inside theanine products, pre-workouts and fat burners, so the person most at risk is often the one who never chose to take it at all.',
    related: ['l-theanine', 'glucomannan'],
    history: [{ date: '2026-09-21', note: 'First published with per-claim evidence grades.' }],
    updated: '2026-09-21',
  },
  {
    slug: 'omega-3',
    name: 'Omega-3 (EPA and DHA)',
    aliases: [
      'omega-3',
      'omega 3',
      'fish oil',
      'epa',
      'dha',
      'eicosapentaenoic',
      'docosahexaenoic',
    ],
    category: 'Fatty acid',
    grade: 'B',
    quickAnswer:
      'EPA and DHA are the long-chain omega-3 fatty acids found in oily fish. The evidence that high doses lower triglycerides is strong and clinically established. The evidence that supplements prevent heart disease or cancer in the general population is weak — the VITAL trial, with 25,871 participants, found no reduction in either. The practical point on any label is that fish oil milligrams are not omega-3 milligrams, and the gap is usually large.',
    whatIsIt:
      'Omega-3 is a family of polyunsaturated fats. The two that matter clinically are eicosapentaenoic acid (EPA) and docosahexaenoic acid (DHA), found in oily fish such as salmon, sardines and mackerel, and in algae, which is where the fish get them. A third, ALA, comes from plant sources like flaxseed and converts to EPA and DHA only inefficiently in humans, so an ALA product is not a substitute. Supplements are sold as fish oil, krill oil, cod liver oil or algal oil, and they differ substantially in how much actual EPA and DHA they deliver per capsule.',
    mechanism:
      'EPA and DHA are incorporated into cell membranes, where they influence membrane fluidity and act as precursors to signalling molecules involved in resolving inflammation. DHA is structurally important in the brain and retina. In the liver, they reduce production of very-low-density lipoprotein, which is the mechanism behind the well-established triglyceride reduction. They also have a mild antiplatelet effect, which is the basis of the bleeding caution rather than a benefit to seek.',
    claims: [
      {
        claim: 'For lowering triglycerides',
        grade: 'A',
        body: 'This is the established clinical use and it is not in serious dispute. High doses, generally around 2 to 4 g of combined EPA and DHA daily, reliably reduce triglycerides, with larger reductions in people whose levels start higher. Prescription omega-3 preparations exist specifically for this indication. Note the dose: this is several times what a typical one-capsule supplement serving provides.',
      },
      {
        claim: 'For preventing heart disease or cancer in the general population',
        grade: 'D',
        body: 'The VITAL trial randomised 25,871 adults to 1 g of omega-3 daily or placebo and found no significant reduction in major cardiovascular events or invasive cancer over roughly five years. This is a large, well-conducted trial in a generally healthy population, and it directly contradicts how most fish oil is marketed. Observational associations between eating fish and better cardiovascular outcomes remain, but they have not transferred to supplements in people who are not deficient or high-risk.',
        refs: ['vital-omega'],
      },
      {
        claim: 'For high-risk patients already on statins',
        grade: 'B',
        body: 'This is a genuine exception worth stating precisely. REDUCE-IT randomised 8,179 statin-treated patients with elevated triglycerides to 4 g daily of icosapent ethyl — a purified, prescription-only ethyl ester of EPA — and found a significant reduction in cardiovascular events. That result belongs to a specific prescription product at a specific dose in a specific high-risk group. It is not evidence for an over-the-counter fish oil capsule, and a separate trial of a different omega-3 preparation did not replicate the benefit.',
        refs: ['reduceit'],
      },
      {
        claim: 'For memory and cognitive function',
        grade: 'D',
        body: 'DHA is structurally important in the brain, which makes the claim plausible and keeps it in circulation. Trials of supplementation for cognitive performance or prevention of decline in older adults have been largely disappointing and inconsistent. Structural importance is not the same as benefit from adding more once intake is adequate.',
      },
      {
        claim: 'For joint pain in rheumatoid arthritis',
        grade: 'B',
        body: 'Among the inflammatory claims, this one has the most support. Trials report modest reductions in joint tenderness and morning stiffness, generally at higher doses taken over months. The effect is real but modest, and it is an adjunct to treatment rather than a replacement for it.',
      },
    ],
    dosage:
      'General intake guidance is usually expressed as roughly 250 to 500 mg of combined EPA and DHA daily, which one to two servings of oily fish per week broadly covers. The triglyceride-lowering effect requires far more — around 2 to 4 g of combined EPA and DHA daily, which is a clinical dose rather than a maintenance one and warrants medical supervision. The important habit is to read the EPA and DHA lines on the Supplement Facts panel and ignore the fish oil total on the front.',
    dosageGap:
      'This category has the widest gap between the front label and the panel of anything on this site. A product advertising 1,000 mg per softgel is quoting the weight of the oil, not the omega-3 in it. A two-softgel serving of 2,000 mg fish oil commonly provides around 600 mg of EPA plus DHA — roughly 30 per cent, with the rest being other fats. Someone aiming for a 2 g therapeutic dose from that product would need six or seven softgels, not two. Concentrated products exist that deliver far more per capsule, and they can only be identified by comparing the EPA and DHA lines.',
    safety:
      'Omega-3s have a mild antiplatelet effect, so they can increase bleeding risk, which matters for anyone taking an anticoagulant or antiplatelet drug and for anyone with surgery scheduled — supplements are commonly stopped a week or two beforehand. Fish-derived products are unsuitable for anyone with a fish or shellfish allergy; algal oil is the alternative. Common side effects are fishy aftertaste, belching and gastrointestinal upset, which taking capsules with food or frozen can reduce. Cod liver oil is a separate caution: it contains vitamin A, which accumulates and can reach harmful levels, so it should not be dosed as though it were plain fish oil. Oils oxidise, and a rancid product is both unpleasant and less useful; check expiry dates and store as directed. Doses above about 3 g daily from supplements are generally a matter for a clinician rather than self-selection.',
    faqs: [
      {
        question: 'Is 1,000 mg of fish oil the same as 1,000 mg of omega-3?',
        answer:
          'No, and the difference is usually large. The front-label figure is the weight of the oil; the EPA and DHA lines on the Supplement Facts panel tell you how much omega-3 it contains. A 2,000 mg serving commonly provides about 600 mg of EPA plus DHA.',
      },
      {
        question: 'Does fish oil prevent heart attacks?',
        answer:
          'In the general population, the evidence says no. The VITAL trial followed 25,871 adults taking 1 g daily and found no significant reduction in major cardiovascular events. A benefit was found in REDUCE-IT, but that used a prescription-only purified EPA product at 4 g daily in statin-treated patients with elevated triglycerides — a different product, dose and population.',
      },
      {
        question: 'How much EPA and DHA do I actually need?',
        answer:
          'General guidance is roughly 250 to 500 mg combined per day, which one to two servings of oily fish weekly broadly covers. The triglyceride-lowering dose is far higher, around 2 to 4 g, and belongs under medical supervision rather than self-selection.',
      },
      {
        question: 'Is krill oil better than fish oil?',
        answer:
          'Krill oil is often marketed on better absorption, but it typically contains considerably less EPA and DHA per capsule and costs more. Compare the EPA and DHA amounts per serving and the price of reaching your target from each, rather than comparing the claims.',
      },
      {
        question: 'Can I take fish oil before surgery?',
        answer:
          'Raise it with your surgeon. Omega-3s have a mild antiplatelet effect, and supplements are commonly stopped one to two weeks before a procedure. The same caution applies alongside anticoagulant or antiplatelet medication.',
      },
    ],
    references: [
      {
        id: 'vital-omega',
        text: 'Manson JE, Cook NR, Lee I-M, et al. Marine n−3 Fatty Acids and Prevention of Cardiovascular Disease and Cancer (VITAL). New England Journal of Medicine, 2019. n=25,871.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/30415637/',
      },
      {
        id: 'reduceit',
        text: 'Bhatt DL, Steg PG, Miller M, et al. Cardiovascular Risk Reduction with Icosapent Ethyl for Hypertriglyceridemia (REDUCE-IT). New England Journal of Medicine, 2019. n=8,179.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/30415628/',
      },
      {
        id: 'ods-omega3',
        text: 'NIH Office of Dietary Supplements. Omega-3 Fatty Acids — Fact Sheet for Health Professionals.',
        url: 'https://ods.od.nih.gov/factsheets/Omega3FattyAcids-HealthProfessional/',
      },
    ],
    editorNote:
      'Omega-3 is where I most often see someone doing everything right and still missing. They have read that fish oil is good for the heart, they buy a reputable 1,000 mg product, they take one a day — and they are getting perhaps 300 mg of EPA and DHA against a therapeutic target seven times higher, for a benefit that the largest trial in a healthy population did not find anyway. The honest summary is narrow: strong for triglycerides at clinical doses, real but product-specific for one high-risk group, and unconvincing as general insurance. Eating fish remains the easier version of this.',
    related: ['vitamin-d3', 'psyllium-husk'],
    history: [{ date: '2026-09-21', note: 'First published with per-claim evidence grades.' }],
    updated: '2026-09-21',
  },
  {
    slug: 'pink-himalayan-salt',
    name: 'Pink Himalayan salt',
    aliases: [
      'pink himalayan salt',
      'himalayan pink salt',
      'himalayan salt',
      'pink salt',
      'sodium (from pink himalayan salt)',
      'pink himalayan sea salt',
    ],
    category: 'Mineral salt',
    grade: 'F',
    quickAnswer:
      'Pink Himalayan salt is rock salt mined in Pakistan, and it is 96 to 99 per cent sodium chloride — chemically the same substance as table salt. The trace minerals that give it its colour are real but nutritionally negligible. A 2020 analysis of 31 samples calculated that you would need roughly 30 g a day, about six teaspoons, before those minerals made a meaningful contribution, which would push sodium intake 592 per cent above the recommended limit. In a supplement it is a flavour and mixing agent, not an active ingredient.',
    atAGlance: [
      {
        label: 'What it actually is',
        value: '96–99% sodium chloride',
        note: 'The same compound as table salt. The remaining 1–4% is trace minerals, mostly iron oxide, which is what makes it pink.',
      },
      {
        label: 'Typical supplement serving',
        value: '40–60 mg sodium',
        note: 'Around 2% of the 2,300 mg Daily Value — a rounding error against the 3,400 mg the average American already eats.',
      },
      {
        label: 'To get useful minerals',
        value: '~30 g per day',
        note: 'About six teaspoons. That much salt carries 592% of the recommended sodium intake, so the minerals arrive with a dose that outweighs them.',
      },
      {
        label: 'Iodine content',
        value: 'None added',
        note: 'Unlike iodized table salt. Swapping one for the other removes a deliberate public-health fortification and replaces it with nothing.',
      },
      {
        label: 'Sodium per gram vs table salt',
        value: 'Effectively identical',
        note: 'Coarse crystals mean less sodium per teaspoon by volume. That is a measuring artefact, not a property of the salt.',
      },
      {
        label: 'Why it is in your supplement',
        value: 'Taste and texture',
        note: 'It sharpens flavour and helps powders dissolve. That is a legitimate job — it is just not a nutritional one.',
      },
    ],
    whatIsIt:
      'Pink Himalayan salt is halite — rock salt — mined almost entirely at Khewra in Pakistan’s Salt Range, a formation that sits south of the Himalayas rather than in them. The deposit is ancient, laid down by an inland sea several hundred million years ago, and the salt is cut from the rock rather than evaporated from seawater. Chemically it is sodium chloride at somewhere between 96 and 99 per cent by weight, with the balance made up of trace minerals. Iron oxide is the one that matters visually: it is the reason the crystals run from pale pink to deep red. Marketing frequently claims 84 trace minerals, a figure that is technically arguable if you count every element detectable by mass spectrometry down to parts per billion, and misleading in every sense that would matter to a person eating it. Not all pink salt comes from Pakistan either — the 2020 Australian analysis included samples originating in Peru and elsewhere, and found their mineral profiles differed.',
    mechanism:
      'Sodium is a genuinely essential nutrient, and nothing on this page disputes that. It is the principal cation in extracellular fluid, and the body uses it to hold fluid volume steady, to conduct nerve impulses and to contract muscle. Too little causes hyponatraemia, which is dangerous; too much, sustained over years, raises blood pressure by drawing water into the bloodstream and increasing blood volume, which is the mechanism behind sodium’s association with cardiovascular disease. All of that is true of sodium from any source. The relevant point for this page is that sodium chloride dissociates into sodium and chloride ions in solution regardless of what colour the crystal was, so pink salt does exactly what white salt does, at the same molar quantity. The trace minerals travel alongside but do not change that behaviour, and they are present in quantities several orders of magnitude below the amounts at which any of them are physiologically active.',
    claims: [
      {
        claim: 'For trace mineral nutrition',
        grade: 'F',
        body: 'This is the central marketing claim and the evidence runs directly against it. A 2020 analysis in Foods measured 25 minerals across 31 pink salt samples against an iodized white salt control. Pink salt did contain more calcium, magnesium, potassium and iron — the claim is not fabricated. The problem is the arithmetic. The authors calculated that over 30 g of pink salt per day, roughly six teaspoons, would be needed before those minerals made any meaningful contribution to nutrient intake, and that consuming that much would exceed recommended sodium intake by 592 per cent. Their conclusion was that any nutritional advantage is counteracted by the sodium arriving with it. At the 40 to 60 mg of sodium a supplement serving typically contributes, the mineral quantities are smaller still by a factor of several hundred.',
        refs: ['foods-pink-salt'],
      },
      {
        claim: 'As a lower-sodium alternative to table salt',
        grade: 'F',
        body: 'Gram for gram, pink salt and table salt deliver essentially the same amount of sodium, because both are almost entirely sodium chloride. The widespread belief that pink salt is lower in sodium comes from a measuring artefact: coarse crystals pack less densely, so a teaspoon of flaked pink salt weighs less than a teaspoon of fine table salt and therefore carries less sodium. Grind it finer and the difference disappears. Anyone salting by weight, or reading a Supplement Facts panel that states sodium in milligrams, gets no reduction whatsoever. Nutrition labels quantify sodium, not salt crystals, which is why the panel is the thing to read.',
        refs: ['fda-sodium'],
      },
      {
        claim: 'For electrolyte replacement',
        grade: 'D',
        body: 'The underlying idea has merit in the right setting. Sodium is the electrolyte lost in the largest quantity in sweat, and replacing it matters during prolonged endurance exercise or heavy heat exposure, where sweat losses can run to several hundred milligrams of sodium per litre. The grade is low because of dose, not because of principle. A supplement contributing 40 to 60 mg of sodium is not meaningful electrolyte replacement for anyone, and for a sedentary person eating a typical diet already well above the recommended limit, additional sodium is not a deficit being corrected. The claim earns D rather than F because the mechanism is real and the ingredient is the right one — it is the amount and the context that fail.',
      },
      {
        claim: 'For hydration, detoxification or pH balance',
        grade: 'F',
        body: 'These claims have no support and, in the case of pH, no coherent mechanism. Blood pH is held within a narrow range by the respiratory and renal systems, and no dietary salt shifts it; a substance that did would be a medical emergency rather than a wellness product. Detoxification is not a defined physiological process that salt participates in. The hydration claim borrows credibility from the genuine role of sodium in fluid balance, but that role is already being filled many times over by an average intake of 3,400 mg a day. Adding a further 49 mg does not hydrate anyone.',
        refs: ['fda-sodium'],
      },
      {
        claim: 'As a source of iodine',
        grade: 'F',
        body: 'Pink salt is not iodized, and this is the one respect in which substituting it for table salt makes a measurable difference — in the wrong direction. Salt iodization is a deliberate public-health fortification credited with largely eliminating iodine deficiency disorders in countries that adopted it. Specialty salts, pink salt included, are generally sold uniodized, so a household that replaces its iodized table salt with pink salt and does not eat much dairy, seafood or egg has quietly removed a fortification without replacing it. Iodine requirements rise in pregnancy, which is when this matters most. This is not an argument against pink salt at the dinner table so much as an argument for knowing what the swap involves.',
        refs: ['ods-iodine'],
      },
    ],
    dosage:
      'There is no supplemental dose of pink salt to target, because the problem in developed countries is excess rather than deficiency. The reference points worth holding: the National Academies set an Adequate Intake of 1,500 mg of sodium per day for adults and, in 2019, introduced a Chronic Disease Risk Reduction intake of 2,300 mg — the level above which reducing intake is expected to lower chronic disease risk. The FDA Daily Value used on nutrition labels is the same 2,300 mg. Average intake in the United States is about 3,400 mg per day. Against those numbers, a supplement serving contributing 40 to 60 mg of sodium is approximately 2 per cent of the Daily Value, which is neither a benefit nor, on its own, a problem.',
    dosageGap:
      'The usual gap on this site is a product containing less of an active than the research used. Pink salt inverts it: the amount is disclosed honestly and is trivially small, while the implication drawn from its presence is large. A Supplement Facts panel listing 49 mg of sodium from pink Himalayan salt is accurate and unremarkable; the packaging language about mineral-rich ancient salt is doing work the 49 mg cannot support. The practical check is to read the sodium line in milligrams and ignore the adjectives — and then to remember that more than 70 per cent of dietary sodium arrives from packaged and prepared foods rather than from anything you add or any supplement you take.',
    safety:
      'At the quantities found in supplements, pink salt raises no specific safety concern: 49 mg of sodium is a fraction of what a slice of bread contributes. The genuine considerations are about salt in the diet as a whole, and about contamination. Sustained high sodium intake raises blood pressure, and hypertension is a leading modifiable risk factor for heart attack, stroke and kidney disease, so anyone advised to restrict sodium — for hypertension, heart failure or chronic kidney disease — should count supplement sodium alongside everything else rather than treating it as exempt. On contamination, the 2020 Foods analysis is worth knowing about: pink salt samples contained substantially more aluminium than the white salt control, and one sample of Peruvian origin contained 2.59 mg/kg of lead, above the Food Standards Australia New Zealand maximum of 2 mg/kg and roughly 130 times the control. That was one sample of 31 and should not be read as a general finding about pink salt, but it does mean unrefined mined salt is not automatically purer than refined salt, which is often the implication. Finally, the absence of added iodine is a real consideration for anyone whose diet is low in dairy, seafood and eggs, and particularly during pregnancy.',
    faqs: [
      {
        question: 'Is pink Himalayan salt healthier than table salt?',
        answer:
          'No. It is 96 to 99 per cent sodium chloride, the same compound as table salt, and it delivers the same sodium per gram. It does contain more trace minerals, but a 2020 analysis found you would need about 30 g a day — six teaspoons — before those minerals mattered nutritionally, at which point sodium intake would be 592 per cent above the recommended limit. Table salt also carries added iodine, which pink salt does not.',
      },
      {
        question: 'Does pink Himalayan salt contain less sodium?',
        answer:
          'Not by weight. The confusion comes from crystal size: coarse pink salt packs less densely, so a teaspoon of it weighs less and therefore holds less sodium than a teaspoon of fine table salt. That is a property of the grind, not the salt. Any label stating sodium in milligrams has already removed the illusion.',
      },
      {
        question: 'What are the 84 trace minerals in pink Himalayan salt?',
        answer:
          'The figure counts every element detectable in a sensitive mass-spectrometry scan, including some present at parts per billion and some, like aluminium and lead, that nobody would market as a benefit. The minerals consistently found in measurable amounts are calcium, magnesium, potassium and iron. Their quantities are several orders of magnitude below the level at which any of them do anything.',
      },
      {
        question: 'Why is pink Himalayan salt in my fibre supplement?',
        answer:
          'For taste and mixing. Salt sharpens flavour and helps a powder dissolve evenly, which matters a great deal in a psyllium drink that is otherwise unpleasant. That is a legitimate formulation reason. It becomes a problem only when the packaging presents a flavouring agent as a nutritional feature.',
      },
      {
        question: 'Does pink Himalayan salt really come from the Himalayas?',
        answer:
          'Not quite. Almost all of it is mined at Khewra in Pakistan’s Salt Range, a distinct geological formation lying south of the Himalayan range. Some salt sold as pink salt originates elsewhere entirely, including Peru, and the 2020 analysis found mineral profiles varied by origin.',
      },
      {
        question: 'Should I worry about lead in pink Himalayan salt?',
        answer:
          'Not on the basis of the supplement amounts discussed here. It is worth knowing that one Peruvian sample of the 31 analysed in 2020 exceeded the Australian maximum contaminant level for lead, and that pink salt averaged far more aluminium than refined white salt. One sample is not a general finding, but it does undercut the assumption that unrefined mined salt is inherently cleaner than refined salt.',
      },
      {
        question: 'Do I need to count supplement sodium if I am on a low-sodium diet?',
        answer:
          'Yes, in the sense that everything counts — though 49 mg is small enough that it will rarely be the deciding factor. If you have been advised to restrict sodium for blood pressure, heart failure or kidney disease, the useful habit is reading the sodium line on every panel rather than assuming supplements are exempt. A dietitian or pharmacist can help you set a realistic daily total.',
      },
    ],
    references: [
      {
        id: 'foods-pink-salt',
        text: 'Fayet-Moore F, Wibisono C, Carr P, et al. An Analysis of the Mineral Composition of Pink Salt Available in Australia. Foods. 2020;9(10):1490 — 31 pink salt samples and an iodized white salt control; source of the 30 g per day, 592 per cent sodium, aluminium and lead findings cited on this page.',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7603209/',
      },
      {
        id: 'fda-sodium',
        text: 'US Food and Drug Administration. Sodium in Your Diet — the 2,300 mg Daily Value, the 3,400 mg average American intake, the share of sodium coming from packaged and prepared foods, and the blood pressure mechanism.',
        url: 'https://www.fda.gov/food/nutrition-education-resources-materials/sodium-your-diet',
      },
      {
        id: 'nasem-sodium',
        text: 'National Academies of Sciences, Engineering, and Medicine. Dietary Reference Intakes for Sodium and Potassium, 2019 — the 1,500 mg Adequate Intake and the 2,300 mg Chronic Disease Risk Reduction intake.',
        url: 'https://www.nationalacademies.org/news/sodium-and-potassium-dietary-reference-intake-values-updated-in-new-report',
      },
      {
        id: 'ods-iodine',
        text: 'NIH Office of Dietary Supplements. Iodine — Fact Sheet for Consumers, covering iodized salt as a dietary iodine source and requirements in pregnancy.',
        url: 'https://ods.od.nih.gov/factsheets/Iodine-Consumer/',
      },
    ],
    editorNote:
      'I have no objection to pink salt. It is pleasant, it looks good on a table, and in a fibre powder it does a real job making the drink tolerable. What I object to is the inference people are invited to draw from it — that a salt with visible minerals in it is a nutritional ingredient rather than a seasoning. The 2020 Australian analysis settled that question in the most useful way possible, by doing the arithmetic rather than arguing about it: six teaspoons a day before the minerals matter, at almost six times the sodium you should be eating. The part I would actually raise in clinic is the iodine, because it is the one change that has a measurable direction. If a household has moved entirely to pink or sea salt and does not eat much dairy, seafood or egg, that is worth a conversation — especially in pregnancy.',
    related: ['psyllium-husk', 'glucomannan'],
    history: [
      {
        date: '2026-09-21',
        note: 'First published with per-claim evidence grades. Mineral, sodium, aluminium and lead figures taken from the 2020 Foods analysis of 31 pink salt samples; intake reference values from the FDA and the 2019 National Academies DRI report.',
      },
    ],
    updated: '2026-09-21',
  },
  {
    slug: 'rebaudioside-a',
    name: 'Rebaudioside A (stevia)',
    aliases: [
      'rebaudioside a',
      'rebaudioside',
      'reb a',
      'stevia leaf extract',
      'steviol glycosides',
      'stevia rebaudiana',
      'stevia',
    ],
    category: 'Sweetener',
    grade: 'D',
    quickAnswer:
      'Rebaudioside A is one of several sweet molecules — steviol glycosides — purified from the leaves of Stevia rebaudiana. It is 200 to 400 times sweeter than sugar, adds no calories and does not raise blood glucose, and it is genuinely good at those things. What the evidence does not support is the reason it usually appears on a weight-management label: the WHO reviewed non-sugar sweeteners in 2023 and advised against using them for weight control. The phrase "leaf extract" also oversells it — the FDA permits the purified glycoside, not the leaf.',
    atAGlance: [
      {
        label: 'Sweetness',
        value: '200–400× sugar',
        note: 'Which is why the amount used is measured in milligrams, and why it is almost never disclosed on a panel.',
      },
      {
        label: 'Calories and blood glucose',
        value: 'Neither',
        note: 'Steviol glycosides are not metabolised for energy and do not raise blood glucose. This part of the pitch is accurate.',
      },
      {
        label: 'What is actually permitted',
        value: '≥95% pure glycosides',
        note: 'The FDA does not permit whole stevia leaf or crude extracts in food, and blocks their import for that use. "Leaf extract" is an industrial purification.',
      },
      {
        label: 'Acceptable daily intake',
        value: '4 mg/kg body weight',
        note: 'Expressed as steviol equivalents — about 280 mg a day for a 70 kg adult. EFSA reviewed this again in 2024 and declined to raise it.',
      },
      {
        label: 'For weight control',
        value: 'WHO advises against',
        note: 'A 2023 conditional recommendation covering all non-sugar sweeteners, stevia included, after a review found no long-term benefit for body fat.',
      },
      {
        label: 'Why it is in your supplement',
        value: 'Palatability',
        note: 'It makes an unpleasant powder drinkable. That is a real job, and it is not a nutritional one.',
      },
    ],
    whatIsIt:
      'Stevia rebaudiana is a South American shrub whose leaves contain a family of intensely sweet compounds called steviol glycosides. Rebaudioside A is the one most commonly isolated, usually alongside smaller amounts of stevioside, rebaudioside D and rebaudioside M. The important distinction, and the one the marketing works hardest to blur, is between the leaf and the molecule. What reaches a supplement is the product of extraction, filtration and crystallisation, ending at a powder that is at minimum 95 per cent steviol glycosides. The FDA has raised no objection to GRAS conclusions for those high-purity preparations, but it has been explicit that whole stevia leaf and crude stevia extracts are not GRAS, and their import for use as sweeteners is not permitted. A label reading "stevia leaf extract" therefore describes the origin of a purified compound, not a botanical preparation — which is the opposite of the impression the words create.',
    mechanism:
      'Steviol glycosides bind the sweet taste receptor on the tongue, the same T1R2/T1R3 heterodimer that sucrose activates, but far more tightly, which is the entire basis of the several-hundred-fold sweetness. At higher concentrations they also engage bitter receptors, which is why stevia carries the liquorice-like aftertaste that formulators spend so much effort masking. Metabolically the molecule behaves quite differently from sugar: the glycosides pass through the small intestine largely intact, are hydrolysed by colonic bacteria to the steviol backbone, absorbed, conjugated in the liver and excreted in urine. Nothing in that path yields usable energy, which is why the ingredient is non-caloric, and nothing in it involves insulin, which is why it does not raise blood glucose. Whether the same colonic step has meaningful effects on the gut microbiome is an open question rather than a settled harm.',
    claims: [
      {
        claim: 'For sweetness without sugar or calories',
        grade: 'A',
        body: 'This is the claim the ingredient actually delivers on, and it is closer to a physical property than a health effect. Steviol glycosides are 200 to 400 times sweeter than sucrose by weight, contribute no usable energy, and are permitted for this use by regulators in the US, EU and elsewhere following repeated safety evaluations. If the question is whether a sweetener can replace sugar in a formulation without adding calories, the answer is yes and it is not seriously disputed.',
        refs: ['fda-sweeteners'],
      },
      {
        claim: 'For weight control',
        grade: 'D',
        body: 'The WHO issued a guideline in 2023 recommending against the use of non-sugar sweeteners — naming stevia and stevia derivatives explicitly — to control body weight or reduce the risk of noncommunicable disease. Its systematic review found no long-term benefit for body fat in adults or children, and raised the possibility of undesirable long-term associations with type 2 diabetes, cardiovascular disease and mortality. The grade is D rather than F because the picture genuinely contradicts itself: short-term trials where a sweetener displaces sugar do tend to show small reductions in weight, while longer observational data point the other way. WHO classed its own recommendation as conditional for exactly this reason, noting the observed links may be confounded by who chooses to use these products and how.',
        refs: ['who-nss'],
      },
      {
        claim: 'For blood glucose and use in diabetes',
        grade: 'B',
        body: 'Steviol glycosides are not metabolised to glucose and do not provoke an insulin response, so substituting them for sugar lowers the glycaemic load of whatever they are sweetening. This is the one area the WHO guideline deliberately carved out: its recommendation does not apply to people who already have diabetes and use these sweeteners to manage blood sugar. The grade sits at B rather than A because the benefit is a consequence of removing sugar rather than an effect of stevia itself, and because the long-term outcome data in this population are thinner than the mechanism suggests.',
        refs: ['who-nss'],
      },
      {
        claim: 'Because it is natural, being derived from a leaf',
        grade: 'F',
        body: 'This is a framing rather than a testable benefit, and on the facts it does not survive. The permitted ingredient is at least 95 per cent purified steviol glycosides; the leaf itself and crude extracts of it are not GRAS in the United States and cannot be imported for use as sweeteners, because the FDA considers the toxicological data on them insufficient. So the regulator has permitted the industrially purified molecule and declined to permit the botanical the marketing evokes. That is not an argument that Reb A is unsafe — the evidence supports the opposite — but "natural because it comes from a plant" is precisely backwards as a description of why it is allowed in your drink.',
        refs: ['fda-sweeteners'],
      },
    ],
    dosage:
      'There is no beneficial dose of a sweetener to target, only a ceiling not to cross. JECFA set an acceptable daily intake of 0 to 4 mg per kilogram of body weight per day, expressed as steviol equivalents, and EFSA reviewed the question again in 2024 — rejecting an industry request to raise the figure to 6 or 16 mg/kg on the grounds of insufficient justification. For a 70 kg adult the ADI works out at roughly 280 mg of steviol equivalents daily. Because the compound is several hundred times sweeter than sugar, the quantities needed to sweeten a drink are measured in tens of milligrams, so ordinary use sits comfortably below that ceiling. An ADI is a conservative lifetime-exposure threshold built with a hundred-fold safety factor, not a line beyond which harm begins.',
    dosageGap:
      'The gap here is disclosure rather than quantity. Steviol glycosides are almost always listed among the other ingredients with no amount attached, because at these weights they are a flavouring rather than a nutrient and no regulation compels a figure. That is defensible for what the ingredient does — but it means a reader cannot reconstruct their intake against the ADI from the panel, and it means a product can lean on the word stevia in its marketing while declining to say how much is in it. If you want to know, the honest answer is that nobody outside the manufacturer does.',
    safety:
      'High-purity steviol glycosides have been through repeated regulatory evaluation and come out the other side: the FDA has not objected to GRAS conclusions for preparations of at least 95 per cent purity, and the JECFA acceptable daily intake has held at 4 mg/kg body weight as steviol equivalents through successive reviews, most recently EFSA in 2024. At the amounts used in food and supplements, no consistent pattern of harm has been established. Two caveats are worth stating plainly. The first is that the colonic bacteria which cleave steviol glycosides are themselves being acted on, and the longer-term consequences for the gut microbiome are an open research question rather than a resolved one. The second is the WHO signal: observational data associate long-term non-sugar sweetener use with type 2 diabetes, cardiovascular disease and mortality, and while WHO itself flagged confounding as a likely explanation and graded the recommendation conditional, it did not dismiss the finding. Whole stevia leaf and crude extracts are a separate matter and are not permitted in US food at all. Tolerance is generally good; the most common complaint is the bitter or liquorice-like aftertaste, which is a palatability issue rather than a safety one.',
    faqs: [
      {
        question: 'Is stevia safe?',
        answer:
          'The purified form used in food has a good safety record and has cleared repeated regulatory review. The FDA has raised no objection to GRAS conclusions for steviol glycosides of at least 95 per cent purity, and the acceptable daily intake has stayed at 4 mg per kilogram of body weight as steviol equivalents, with EFSA declining in 2024 to raise it. Whole stevia leaf and crude extracts are a different product and are not permitted in US food.',
      },
      {
        question: 'Does stevia help you lose weight?',
        answer:
          'The WHO advised against using non-sugar sweeteners, stevia included, for weight control in 2023, after a review found no long-term benefit for body fat. Replacing sugar with a sweetener can reduce calories in the short term, and trials show small effects, but longer-term data do not show the benefit persisting. WHO graded its recommendation conditional because the evidence genuinely conflicts.',
      },
      {
        question: 'Does stevia raise blood sugar or insulin?',
        answer:
          'No. Steviol glycosides are not broken down into glucose and do not trigger an insulin response. WHO specifically excluded people with existing diabetes from its recommendation against non-sugar sweeteners, on the basis that managing blood sugar is a different question from managing weight.',
      },
      {
        question: 'Is stevia leaf extract natural?',
        answer:
          'Less than the phrase suggests. What is permitted in food is at least 95 per cent purified steviol glycosides, produced by extraction and crystallisation. The whole leaf and crude extracts — the things most people picture — are not GRAS in the United States and cannot be imported for use as sweeteners. The purified molecule is the version regulators have judged safe.',
      },
      {
        question: 'How much stevia is too much?',
        answer:
          'The acceptable daily intake is 4 mg per kilogram of body weight per day as steviol equivalents, roughly 280 mg for a 70 kg adult. Because the compound is 200 to 400 times sweeter than sugar, normal use falls well below that. An ADI already includes a hundred-fold safety margin, so exceeding it occasionally is not the same as being harmed.',
      },
      {
        question: 'Why does stevia have an aftertaste?',
        answer:
          'Because steviol glycosides activate bitter taste receptors as well as sweet ones, more noticeably at higher concentrations. Rebaudioside A is used in preference to stevioside partly because it is cleaner in this respect, and formulators often blend glycosides or add salt and flavouring to mask what remains.',
      },
    ],
    references: [
      {
        id: 'fda-sweeteners',
        text: 'US Food and Drug Administration. Aspartame and Other Sweeteners in Food — high-purity steviol glycosides at 95 per cent minimum purity, the 200 to 400 times sweetness figure, and the exclusion of whole stevia leaf and crude extracts from food use.',
        url: 'https://www.fda.gov/food/food-additives-petitions/aspartame-and-other-sweeteners-food',
      },
      {
        id: 'who-nss',
        text: 'World Health Organization. WHO advises not to use non-sugar sweeteners for weight control, 15 May 2023 — the conditional recommendation, the sweeteners named including stevia, and the exclusion of people with existing diabetes.',
        url: 'https://www.who.int/news/item/15-05-2023-who-advises-not-to-use-non-sugar-sweeteners-for-weight-control-in-newly-released-guideline',
      },
      {
        id: 'efsa-steviol',
        text: 'EFSA Panel on Food Additives and Flavourings. Scientific opinion on steviol glycosides (E 960a–d) and the acceptable daily intake for steviol. EFSA Journal, 2024 — maintained the ADI at 4 mg/kg body weight per day and rejected a request to raise it.',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11533382/',
      },
    ],
    editorNote:
      'Stevia is one of the few ingredients on this site where I think the product is fine and the story around it is the problem. As a sweetener it works, it is well characterised, and putting it in a psyllium drink is a sensible formulation decision rather than a cynical one — fibre powders that taste unbearable get abandoned, and an abandoned supplement helps nobody. What I would push back on is the chain of implication: that because it came from a leaf it is natural, that because it is natural it is healthy, and that because it is healthy the weight-management product containing it must work. The WHO guidance is the part worth actually reading, and the honest reading of it is that it found no benefit rather than proof of harm.',
    related: ['pink-himalayan-salt', 'psyllium-husk'],
    history: [
      {
        date: '2026-09-21',
        note: 'First published with per-claim evidence grades. Purity, sweetness and permitted-form details from the FDA; the weight-control position from the 2023 WHO guideline; the acceptable daily intake from the 2024 EFSA opinion.',
      },
    ],
    updated: '2026-09-21',
  },
  {
    slug: 'fruit-and-vegetable-juice-powder',
    name: 'Fruit and vegetable juice powder',
    aliases: [
      'fruit and vegetable juice powder',
      'fruit and vegetable powder',
      'fruit & vegetable juice powder',
      'fruit and vegetable blend',
      'vegetable juice powder',
      'fruit juice powder',
      'fruit and vegetable concentrate',
    ],
    category: 'Whole-food concentrate',
    grade: 'D',
    quickAnswer:
      'Fruit and vegetable juice powder is dehydrated juice or pulp, used in supplements for colour and flavour and sold on the suggestion that it stands in for produce. Taken as the product itself, at the capsule doses used in trials, concentrates do raise plasma carotenoid and vitamin levels and show modest movement in some cardiovascular markers. As an undisclosed trace in a drink mix, it does neither. Even the reviews most favourable to the ingredient state plainly that it cannot replace eating fruit and vegetables.',
    atAGlance: [
      {
        label: 'What it is',
        value: 'Dehydrated juice or pulp',
        note: 'No standard composition and no legal definition. Two products carrying this ingredient line may share almost nothing.',
      },
      {
        label: 'Amount in most formulas',
        value: 'Not disclosed',
        note: 'It is listed without a quantity, which is permitted for a colour or flavour ingredient — and makes the nutritional implication impossible to check.',
      },
      {
        label: 'Dose used in trials',
        value: 'Six capsules a day',
        note: 'Taken as the supplement itself. That is orders of magnitude above a pinch used to tint a fibre drink.',
      },
      {
        label: 'Best-supported effect',
        value: 'Raises plasma carotenoids',
        note: 'Real, repeatable, and the strongest thing this ingredient class has going for it — at capsule doses.',
      },
      {
        label: 'Replaces produce?',
        value: 'No — and reviews say so',
        note: 'Including a 2019 review with an author affiliated to the Juice Plus+ Science Institute, which states supplementation cannot replace fresh fruit and vegetables.',
      },
      {
        label: 'Regulatory history',
        value: 'FDA has acted on this',
        note: 'A 2019 warning letter cited a marketer claiming its capsules provided "over 10 servings of fruits and vegetables every day".',
      },
    ],
    whatIsIt:
      'Fruit and vegetable juice powder is exactly what the name says and nothing more specific: juice or pulp from some combination of produce, dried — by spray, drum or freeze drying — into a powder. There is no standard recipe, no defined composition and no legal definition of the term, so the ingredient line tells you the category and not the contents. What survives the drying varies with the method and the starting material. Carotenoids and some polyphenols hold up reasonably well; vitamin C degrades readily with heat and oxygen, which is why some powders have ascorbic acid added back and then list it separately. Fibre is largely removed when the starting point is juice rather than whole fruit. In practice these powders appear in two quite different roles, and conflating them is the source of most of the confusion on this page: as the entire product, in capsules taken by the handful, and as a small colouring and flavouring addition to something else.',
    mechanism:
      'There is no single mechanism, because this is a mixture rather than a compound. The plausible active constituents are the carotenoids, polyphenols, vitamins and minerals carried over from the source produce, and the proposed pathway is the familiar one offered for fruit and vegetable intake generally: antioxidant and anti-inflammatory activity, improved endothelial function, and reductions in markers such as homocysteine. The crucial limitation is that this reasoning is borrowed. The evidence that eating fruit and vegetables is good for people comes from studying people who eat fruit and vegetables — whole foods, with their fibre, water, structure and the displacement of other foods they cause. A dried juice extract shares some constituents with that and not others, so the benefit has to be demonstrated for the powder rather than inherited from the produce. Some of it has been. Most of it has not.',
    claims: [
      {
        claim: 'For raising plasma carotenoid and vitamin levels',
        grade: 'B',
        body: 'This is the strongest claim the ingredient class has, and it is a straightforwardly measurable one. Trials of encapsulated fruit, vegetable and berry juice concentrates consistently report increases in circulating carotenoids and several vitamins after supplementation. The reservation is not whether it happens but what it means: a higher plasma carotenoid reading is a biomarker of intake rather than a health outcome, and the studies establishing it have largely been short, small, and conducted in specific groups such as athletes and smokers. Raising a marker is a necessary step towards a benefit, not the benefit itself.',
      },
      {
        claim: 'For cardiovascular risk markers',
        grade: 'C',
        body: 'A 2019 systematic review in the Journal of Clinical Medicine gathered 13 articles covering eight concentrate products and reported movement in total cholesterol, LDL, homocysteine, systolic blood pressure, BMI and TNF-alpha, with the strongest signal for homocysteine. The authors were candid about the limits: small numbers of trials, small samples, most durations under two months, and heterogeneous designs, concluding that the effect on biomarkers and on primary cardiovascular disorders cannot be confirmed with certainty. Two further things belong in the reader’s hands. The evidence base is closely tied to industry — one author of that review lists an affiliation with the Juice Plus+ Science Institute while the paper declares no conflict of interest, and the individual trials are frequently funded or supplied by manufacturers. And the doses are those of the product taken on its own, not of a trace ingredient.',
        refs: ['jcm-concentrates', 'jcp-chapple'],
      },
      {
        claim: 'As a substitute for eating fruit and vegetables',
        grade: 'F',
        body: 'Nobody credible claims this, including the researchers most sympathetic to the ingredient: the 2019 review states that supplementation cannot replace the consumption of fresh fruit and vegetables. The FDA has treated the stronger versions of the claim as a compliance matter. Its 2019 warning letter to the marketer of a whole-food fruit and vegetable capsule range cited, among other violations, marketing asserting the products provided "over 10 servings of fruits and vegetables every day". Dietary guidance on produce rests on studies of people eating produce, and a dried extract lacks the fibre, volume, water and displacement effect that come with it.',
        refs: ['fda-balance-of-nature', 'jcm-concentrates'],
      },
      {
        claim: 'At the amounts used for colour and flavour in a drink mix',
        grade: 'F',
        body: 'This is the version most readers of this site will actually encounter, and it is the weakest. Where a fibre powder or similar formula lists fruit and vegetable juice powder among its minor ingredients at an undisclosed amount, the quantity is there to tint and flavour the product. The trials showing biomarker effects used six capsules a day of concentrate taken as the supplement itself. A pinch in a 5 g scoop is smaller by orders of magnitude, and no evidence supports a nutritional contribution at that scale. The ingredient is doing an honest job; the packaging is the part that overstates it.',
        refs: ['jcp-chapple'],
      },
    ],
    dosage:
      'There is no established effective dose, because the ingredient is not standardised to anything. The most-studied form is encapsulated concentrate taken as the product in its own right — the periodontal trial in the Journal of Clinical Periodontology used six capsules daily, split morning and evening, over nine months, and that is broadly typical of the literature. Nothing comparable exists for powders used as a minor component of another formula, and no conversion between the two is meaningful. Where a product does quantify the powder, compare it against the gram-level daily amounts used in trials rather than against a serving of fruit, because no defensible equivalence to produce exists.',
    dosageGap:
      'This is one of the widest gaps on the site, and it runs in both directions at once. The studied form is grams per day of concentrate taken as the whole product; the commercial form most people meet is an unquantified pinch used as a colourant. Meanwhile the implied benefit is the largest available — that you are somehow getting your produce in. When an amount is not disclosed you cannot close that gap yourself, and the absence of a figure should be read as what it is: the ingredient is present for appearance and taste, because an ingredient present for nutrition would have a number next to it.',
    safety:
      'At the amounts used in ordinary supplements this ingredient raises no particular safety concern; it is dried food. Three practical points are worth keeping. First, people with fruit or vegetable allergies need the source list, and a blanket ingredient line such as "fruit and vegetable juice powder" may not provide it — check the full declaration and the allergen statement rather than assuming. Second, concentrated fruit powders can carry meaningful amounts of sugar and of potassium or oxalate depending on what went into them, which matters for anyone managing diabetes, kidney disease or a history of oxalate stones. Third, and most relevant in practice, the risk is not toxicological but substitutional: treating a powder as a stand-in for produce means missing the fibre, volume and satiety that make fruit and vegetables useful in the first place. If you are eating well, this ingredient adds very little. If you are not, it does not fix it.',
    faqs: [
      {
        question: 'Does fruit and vegetable powder count as a serving of vegetables?',
        answer:
          'No. There is no defensible equivalence between a dried extract and a serving of produce, and the FDA has issued a warning letter over marketing that claimed capsules delivered more than ten servings of fruits and vegetables a day. Even the systematic review most favourable to concentrates states that supplementation cannot replace fresh fruit and vegetables.',
      },
      {
        question: 'Is there any real evidence for these powders?',
        answer:
          'Some, and it is worth being precise about it. Trials of encapsulated concentrates taken as the product itself do raise plasma carotenoid and vitamin levels reliably, and a 2019 review found modest movement in cardiovascular markers such as homocysteine. Those studies were small, short and often manufacturer-funded, and the authors concluded the effect on primary cardiovascular disorders cannot be confirmed with certainty.',
      },
      {
        question: 'Why is fruit and vegetable juice powder in my fibre supplement?',
        answer:
          'For colour and flavour, in almost every case. It is typically listed with no amount, which is permitted for a flavouring or colouring ingredient and is the clearest signal available of what it is doing. A component included for nutrition would carry a quantity.',
      },
      {
        question: 'Do these powders still contain fibre and vitamin C?',
        answer:
          'Often much less than the source produce. Fibre is largely lost when the starting material is juice rather than whole fruit, and vitamin C degrades with heat and oxygen during drying — some manufacturers add ascorbic acid back, which then appears separately on the panel. There is no standard process, so retention varies between products.',
      },
      {
        question: 'How much of the research is funded by the manufacturers?',
        answer:
          'A substantial share. The periodontal trial cited on this page was funded in part by the manufacturer of the product tested, and the 2019 systematic review includes an author affiliated with that manufacturer’s science institute while declaring no conflict of interest. That does not make the findings wrong, but it is context a reader is entitled to have before weighing them.',
      },
      {
        question: 'Should I take a greens or fruit-and-veg powder instead of eating vegetables?',
        answer:
          'No, and that framing is where the harm sits. The guidance to eat produce comes from studying people who eat produce, with the fibre, water and fullness that involves. A powder can raise some blood markers. It cannot do the displacement work that makes vegetables useful, and treating it as permission to skip them is a worse outcome than not taking it at all.',
      },
    ],
    references: [
      {
        id: 'jcm-concentrates',
        text: 'Lamprecht M, et al. Fruit and Vegetable Concentrate Supplementation and Cardiovascular Health: A Systematic Review from a Public Health Perspective. Journal of Clinical Medicine. 2019;8(11):1914 — 13 articles across eight concentrate products; source of the biomarker findings, the stated limitations, and the conclusion that supplementation cannot replace fresh produce.',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6912365/',
      },
      {
        id: 'jcp-chapple',
        text: 'Chapple ILC, et al. Adjunctive daily supplementation with encapsulated fruit, vegetable and berry juice powder concentrates and clinical periodontal outcomes: a double-blind RCT. Journal of Clinical Periodontology. 2012;39(1):62–72 — the six-capsules-daily dose cited on this page; funded in part by the manufacturer of the product tested.',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3267052/',
      },
      {
        id: 'fda-balance-of-nature',
        text: 'US Food and Drug Administration. Warning Letter to Evig LLC dba Balance of Nature, 20 August 2019 — cites marketing claiming the products provide "over 10 servings of fruits and vegetables every day", alongside unapproved drug claims and nutrition labelling violations.',
        url: 'https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/evig-llc-dba-balance-nature-580888-08202019',
      },
    ],
    editorNote:
      'The thing I find genuinely useful about this ingredient is how reliably its disclosure tells you what it is for. When a product wants you to believe the fruit and vegetable powder is nutritional, it puts the phrase on the front of the pack and leaves the amount off the back. When a powder is included at a dose that could plausibly do something, the manufacturer says so, because that number is the selling point. So the absence of a figure is not an oversight to complain about — it is the answer. Beyond that, my objection is the one I would raise in clinic: the people most drawn to these products are usually the ones eating least produce, and a powder that raises a carotenoid reading while leaving the diet unchanged is a worse outcome than it appears, because it feels like the problem has been addressed.',
    related: ['pink-himalayan-salt', 'psyllium-husk'],
    history: [
      {
        date: '2026-09-21',
        note: 'First published with per-claim evidence grades. Biomarker and cardiovascular findings from the 2019 Journal of Clinical Medicine systematic review; the studied dose and funding disclosure from the 2012 Journal of Clinical Periodontology trial; the servings claim from the FDA warning letter of 20 August 2019.',
      },
    ],
    updated: '2026-09-21',
  },
  {
    slug: 'whey-protein-blend',
    name: 'Whey protein blend',
    aliases: [
      'whey protein blend',
      'whey protein concentrate',
      'whey protein isolate',
      'hydrolysed whey protein',
      'hydrolyzed whey protein',
      'whey protein',
      'whey',
    ],
    category: 'Protein',
    grade: 'A',
    quickAnswer:
      'Whey is the protein fraction of milk, sold as concentrate, isolate, hydrolysate or a blend of all three. For building and keeping muscle alongside resistance training it has about the strongest evidence of anything covered on this site — but that evidence is about eating enough protein in a day, not about whey specifically or about any brand. It helps strength recover between hard sessions and does not touch soreness. Most UK adults already eat enough protein; the people it genuinely helps are those training hard enough to need 1.2 to 2.0 g per kilogram a day.',
    atAGlance: [
      {
        label: 'Protein per scoop',
        value: '20–25 g typical',
        note: 'Around the amount at which muscle protein synthesis is maximised in young adults from a fast-digesting protein. A bigger scoop is not a proportionally bigger effect.',
      },
      {
        label: 'Daily target that matters',
        value: '≈1.6 g/kg',
        note: 'Where the pooled benefit plateaued across 49 trials. Total daily protein does the work; the shake is one way to reach it.',
      },
      {
        label: 'Per meal',
        value: '0.4 g/kg × 4 meals',
        note: 'The distribution most consistent with the data — roughly 32 g four times a day for an 80 kg adult, from any source.',
      },
      {
        label: 'Protein by weight',
        value: '70–80% of the powder',
        note: 'Concentrate sits nearer 70 per cent, isolate-led blends nearer 80. A price per kilogram of powder is not a price per kilogram of protein.',
      },
      {
        label: 'What a GB label may claim',
        value: 'Muscle mass and bones',
        note: 'The only authorised protein claims. Fat loss, recovery time and performance are marketing, not approved wording.',
      },
      {
        label: 'Kidney risk in healthy adults',
        value: 'None established',
        note: '28 trials and 1,358 participants without kidney disease: the change in filtration rate did not differ between higher- and lower-protein diets.',
      },
    ],
    whatIsIt:
      'Whey is what separates from the curds when milk is coagulated to make cheese — historically a waste stream, now the most-sold sports supplement in the world. It contains roughly a fifth of milk’s protein, the rest being casein, and it is unusually rich in the branched-chain amino acids, particularly leucine. What reaches a tub is that liquid concentrated and dried, and how far the processing goes is the only thing separating the three forms you will see on a panel. Concentrate is filtered least and typically arrives at 70 to 80 per cent protein by weight, carrying more of the milk’s fat, carbohydrate and lactose with it. Isolate is filtered further to around 90 per cent, which strips most of the lactose and most of the fat. Hydrolysate is protein that has been partly broken into shorter chains before you drink it. A “blend” is simply two or three of these in one tub, and the order they are listed in tells you which dominates. None of this changes the amino acids that end up in your bloodstream; it changes the protein density of the powder, the lactose load, the price and the taste.',
    mechanism:
      'Muscle protein is in constant turnover, being broken down and rebuilt around the clock. Resistance training raises the rate of synthesis for roughly a day afterwards, and eating protein raises it too — but only for a few hours, and only up to a point. Whey is well suited to that job for two reasons. It digests quickly, producing a sharp rise in circulating amino acids rather than the slow drip casein gives, and it is high in leucine, the amino acid that acts less as a building block than as a signal, triggering the mTOR pathway that switches synthesis on. That signalling threshold is why the useful dose is a step rather than a slope: below roughly 2 to 3 g of leucine in a sitting the response is blunted, and well above it the extra protein is largely oxidised for energy rather than built into tissue. The practical consequence runs against how these products are sold. If the mechanism is a switch that can be flipped several times a day, then spreading protein across meals matters more than what is in any one shake, and a second scoop does considerably less than the first.',
    claims: [
      {
        claim: 'Building and keeping muscle alongside resistance training',
        grade: 'A',
        body: 'This is the claim the ingredient earns. A 2018 systematic review and meta-analysis in the British Journal of Sports Medicine pooled 49 studies and 1,863 participants and found that protein supplementation significantly increased gains in both muscle size and strength during prolonged resistance training. That is a large, consistent body of randomised evidence, and it clears the bar for an A comfortably. Two caveats keep it honest rather than diluting it. The benefit plateaued at roughly 1.6 g of protein per kilogram of body weight per day, so it is a claim about reaching an intake rather than about adding a supplement on top of one already met. And the finding is about protein: the same analysis found source mattered less than total amount, so nothing here distinguishes whey from an equivalent quantity of chicken, milk or a well-constructed plant blend. It also does nothing without the training.',
        refs: ['morton2018'],
      },
      {
        claim: 'Recovering strength between hard sessions',
        grade: 'B',
        body: 'Better supported than most people expect, and for a narrower outcome than most people assume. A 2022 systematic review with meta-analysis in the European Journal of Clinical Nutrition found protein supplementation preserved maximal voluntary contraction in the days after damaging resistance exercise — isokinetic strength at 24, 48 and 72 hours, isometric at 96 — and lowered creatine kinase, a blood marker of muscle damage, at 48 and 72 hours. A whey-specific meta-analysis reached a similar conclusion, reporting a small-to-medium effect on the recovery of muscle function across the 24 to 96 hours after exercise. B rather than A because effect sizes are modest, protocols vary, and the whey-specific analysis found no benefit for creatine kinase where the broader protein one did. If you train the same muscles again within two or three days, this is a real and measurable reason to get the protein in.',
        refs: ['recovery2022', 'davies2018'],
      },
      {
        claim: 'Reducing muscle soreness',
        grade: 'F',
        body: 'Both of the reviews above looked for this and did not find it. Protein supplementation had no effect on muscle soreness compared with control, even while the same trials showed strength being preserved and damage markers falling. That dissociation is genuinely interesting — it means the powder can be helping you in a way you cannot feel, and that feeling fine is not evidence it worked — but as a marketing claim it fails on the evidence. If a product is sold to you on the promise that you will ache less tomorrow, the research says otherwise.',
        refs: ['recovery2022', 'davies2018'],
      },
      {
        claim: 'For fat loss or weight management',
        grade: 'D',
        body: 'Not an authorised claim on a GB label, and not one the ingredient supports on its own terms. The plausible mechanisms — protein is more satiating than carbohydrate or fat, and a higher protein intake during energy restriction helps preserve lean mass — are about total protein in the diet, not about a powder. Adding a shake to an otherwise unchanged diet adds calories; it only helps if it displaces something. There is a specific trap here too: a flavoured whey mixed with milk is a 250 to 300 kcal drink that many people count as a supplement rather than as food. The grade is D rather than F because the underlying mechanism is real and the effect can be engineered deliberately, not because any trial has shown a whey powder causing weight loss.',
        refs: ['gb-nhc'],
      },
      {
        claim: 'Whey being better than other protein sources, and timing it around training',
        grade: 'D',
        body: 'Whey does have properties the others lack: it digests faster and carries more leucine per gram than most proteins, which is a defensible reason to prefer it in the specific hours around training. What does not follow is the conclusion drawn from it. The 2018 meta-analysis found total daily protein a stronger predictor of gains than either source or timing, and the review of per-meal dosing concluded that what matters is hitting roughly 0.4 g per kilogram across at least four feedings, not landing one of them in a particular window. The “anabolic window” as sold — a narrow post-workout period during which a fast protein is uniquely effective — is a much stronger claim than the data support. Convenience is the honest reason to drink a shake after training, and it is a perfectly good one.',
        refs: ['morton2018', 'schoenfeld2018'],
      },
      {
        claim: 'Choosing a product for its BCAA or glutamine content',
        grade: 'F',
        body: 'These are not added ingredients. Branched-chain amino acids and glutamic acid are intrinsic components of whey, present in every tub on the shelf in much the same proportion, so advertising them is describing dairy protein rather than differentiating a product. Two things make this worth flagging. Research on isolated BCAA supplements is a separate and considerably weaker literature that does not transfer to whole protein — taking whey is not taking a BCAA supplement, and the case for the latter is poor. And the glutamine figure quoted on packaging is very often the panel’s glutamic acid figure, which is a different amino acid; we found exactly that on one product covered here. A number on the front of a tub that every competitor could print is not a reason to choose it.',
      },
    ],
    dosage:
      'Two numbers govern this and they answer different questions. For the day, roughly 1.6 g of protein per kilogram of body weight is where the pooled benefit plateaued across 49 trials, with the confidence interval reaching about 2.2 g/kg; the British Nutrition Foundation cites American College of Sports Medicine figures of 1.2 to 2.0 g/kg for people training hard. For the sitting, the review of per-meal dosing concluded that about 0.4 g per kilogram across at least four meals is the distribution most consistent with the data — around 32 g four times a day for an 80 kg adult, from any source. A 20 to 25 g scoop is roughly the amount at which muscle protein synthesis is maximised in young adults from a fast-digesting protein, which is why almost every whey on the market lands there. Note what this means for buying: one scoop is a portion of a day’s protein, not a dose of a drug, and the right number of scoops is whatever closes the gap between what you eat and the target. For most UK adults that gap is zero — average intakes are 76 g a day against a Reference Nutrient Intake near 56 g for men and 45 g for women.',
    dosageGap:
      'The gap on a whey label is rarely underdosing — 20 to 25 g a scoop is close to universal — but there are four places the panel and the packaging drift apart. First, protein by weight: a powder at 73 per cent protein and one at 80 per cent look identical on a shelf, and a price per kilogram of powder is not a price per kilogram of protein. Convert to cost per 100 g of protein and the ranking between tubs moves. Second, the headline figure is often the best case across a flavour range — a front-of-pack “up to 23 g” can sit above the panel of the specific flavour in your basket. Third, protein content itself has a documented accuracy problem; the practice of inflating a protein reading with free amino acids has its own name, amino spiking, and its own certification programme in response, which tells you how real it is. Fourth, the intrinsic amino acid figures discussed above get promoted as features. None of these is hidden. All of them require reading the back rather than the front.',
    safety:
      'For a healthy adult, whey is a food and the risk profile is close to drinking milk. Two allergens are the real issues and both are declared in bold on a GB label. Whey is a dairy product, so anyone with a cow’s milk protein allergy must avoid it entirely; and most commercial blends use soya lecithin as an emulsifier. Lactose is a separate question from allergy: concentrate retains more of it, isolate much less, so someone who reacted to a cheap concentrate may do fine on an isolate. Gastrointestinal complaints in the first week — bloating, wind, loose stools — are the usual reason people abandon a tub, and a large pack is a poor way to discover this. On kidneys, the fear is more durable than the evidence: a 2018 systematic review and meta-analysis of 28 trials and 1,358 participants without kidney disease found that the change in glomerular filtration rate did not differ between higher- and lower-protein diets. That finding is specifically about people with healthy kidneys, and it does not extend to anyone with existing renal impairment or on a protein-restricted diet for a medical reason, who should take any supplement to their clinician. Contamination is a genuine, separate concern for anyone subject to anti-doping rules, where strict liability makes a batch-level certificate — not a factory registration, and not a label accuracy certification — the thing that matters.',
    faqs: [
      {
        question: 'Does whey protein actually build muscle?',
        answer:
          'Alongside resistance training, yes, and the evidence is strong: a meta-analysis of 49 trials and 1,863 participants found protein supplementation increased gains in both muscle size and strength. The honest framing is that it works by helping you reach a daily protein intake, with the pooled benefit plateauing near 1.6 g per kilogram of body weight. If you already hit that from food, adding a shake has nothing left to do. And nothing happens without the training.',
      },
      {
        question: 'Is whey better than getting protein from food?',
        answer:
          'Not for the outcome most people care about. The same meta-analysis found total daily protein a stronger predictor of gains than protein source. Whey digests faster and carries more leucine per gram than most proteins, which is a reasonable reason to prefer it in the hours around training, but the advantage is narrow. Where it genuinely wins is practical: 24 g of protein in a shaker, portable and costing less than most animal foods per gram of protein.',
      },
      {
        question: 'Concentrate, isolate or hydrolysate — which should I buy?',
        answer:
          'Concentrate unless you have a reason not to, because it is the cheapest per gram of protein. Isolate is filtered further to roughly 90 per cent protein with most of the lactose removed, which is worth paying for if concentrate upsets your stomach and a waste of money if it does not. Hydrolysate is pre-broken into shorter chains and is the most expensive; the case for it in a healthy adult is thin. None of them changes what reaches your bloodstream.',
      },
      {
        question: 'Do I have to drink it straight after training?',
        answer:
          'No. The anabolic window as marketed — a narrow post-workout period when a fast protein is uniquely effective — is a stronger claim than the evidence supports. Total daily protein predicted gains better than timing did, and the per-meal research points to roughly 0.4 g per kilogram spread across at least four feedings rather than one well-placed shake. Drinking it after training is convenient, which is a perfectly good reason on its own.',
      },
      {
        question: 'Will whey protein damage my kidneys?',
        answer:
          'There is no evidence of that in people with healthy kidneys. A 2018 systematic review and meta-analysis of 28 randomised trials and 1,358 participants without kidney disease found the change in glomerular filtration rate did not differ between higher- and lower-protein diets. This does not apply to anyone with existing kidney disease or on a protein-restricted diet, who should discuss any supplement with their clinician first.',
      },
      {
        question: 'Will it stop me being sore?',
        answer:
          'No, and this is one of the clearer negative findings in the area. Reviews that found protein preserved strength and lowered creatine kinase in the days after damaging exercise found no effect on soreness at all. The useful implication is the reverse of the marketing: feeling fine is not evidence the protein worked, and aching is not evidence it failed.',
      },
      {
        question: 'Why do labels advertise BCAAs and glutamine?',
        answer:
          'Because whey contains them naturally and it sounds like a feature. Every whey on the shelf carries broadly the same proportions, so the figure differentiates nothing. Worth knowing: the research on isolated BCAA supplements is separate and much weaker, and the “glutamine” number on packaging is frequently the panel’s glutamic acid figure — a different amino acid.',
      },
      {
        question: 'What can a whey product legally claim in the UK?',
        answer:
          'Under the Great Britain nutrition and health claims register, the authorised protein claims are that protein contributes to the growth and maintenance of muscle mass, and to the maintenance of normal bones. Anything past that wording — fat loss, faster recovery, improved performance — is marketing language rather than an approved claim, whatever the front of the tub says.',
      },
    ],
    references: [
      {
        id: 'morton2018',
        text: 'Morton RW et al. (2018). A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength in healthy adults. British Journal of Sports Medicine — 49 studies, 1,863 participants, benefit plateauing near 1.6 g/kg/day, with source and timing less predictive than total intake.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28698222/',
      },
      {
        id: 'recovery2022',
        text: 'Systematic review with meta-analysis (2022), European Journal of Clinical Nutrition. The impact of dietary protein supplementation on recovery from resistance exercise-induced muscle damage — maximal voluntary contraction preserved at 24 to 96 hours and creatine kinase lowered at 48 and 72 hours, with no effect on muscle soreness.',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10393778/',
      },
      {
        id: 'davies2018',
        text: 'Davies RW et al. (2018). The effect of whey protein supplementation on the temporal recovery of muscle function following resistance training: a systematic review and meta-analysis — a small-to-medium effect on recovery of muscle function across 24 to 96 hours, and no benefit for creatine kinase.',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5852797/',
      },
      {
        id: 'schoenfeld2018',
        text: 'Schoenfeld BJ and Aragon AA (2018). How much protein can the body use in a single meal for muscle-building? Journal of the International Society of Sports Nutrition — roughly 0.4 g/kg per meal across at least four meals, against the earlier 20 to 25 g per-sitting figure for fast-digesting protein.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/29497353/',
      },
      {
        id: 'devries2018',
        text: 'Devries MC et al. (2018). Changes in kidney function do not differ between healthy adults consuming higher- compared with lower- or normal-protein diets: a systematic review and meta-analysis. The Journal of Nutrition — 28 trials, 1,358 participants without kidney disease.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/30383278/',
      },
      {
        id: 'bnf-protein',
        text: 'British Nutrition Foundation. Protein — the UK Reference Nutrient Intake of 0.75 g/kg/day, average UK intakes of 76.0 g/day for adults aged 19 to 64, the American College of Sports Medicine range of 1.2 to 2.0 g/kg/day for those training hard, and the statement that most UK adults do not need supplemental protein.',
        url: 'https://www.nutrition.org.uk/nutritional-information/protein/',
      },
      {
        id: 'gb-nhc',
        text: 'Great Britain nutrition and health claims register — the authorised protein claims a GB label may make, covering growth and maintenance of muscle mass and maintenance of normal bones.',
        url: 'https://www.gov.uk/government/publications/great-britain-nutrition-and-health-claims-nhc-register',
      },
    ],
    editorNote:
      'This is the rare ingredient page where my job is mostly to talk the evidence down rather than up. The A grade is deserved, and I would not want a reader to leave thinking otherwise — but an A for “protein helps you build muscle when you train” is close to an A for a nutrient doing its job, and the supplement industry has spent thirty years dressing that up as something proprietary. What I see in clinic is people buying a second tub before they have worked out what they already eat. The first question is not which whey; it is how many grams of protein were in yesterday. If the answer is already 1.6 g per kilogram, the powder has nothing to add and the money is better spent elsewhere. If it is nowhere near, then a scoop is a cheap, well-evidenced, thoroughly unglamorous way to close the gap — and the cheapest tub that you will actually drink will do it as well as the expensive one.',
    related: ['omega-3', 'rebaudioside-a'],
    history: [
      {
        date: '2026-09-22',
        note: 'First published with per-claim evidence grades. Muscle-mass and timing findings from the 2018 British Journal of Sports Medicine meta-analysis; recovery and soreness findings from the 2022 European Journal of Clinical Nutrition review and the 2018 whey-specific meta-analysis; per-meal dosing from Schoenfeld and Aragon; kidney safety from the 2018 Journal of Nutrition meta-analysis; UK intakes from the British Nutrition Foundation and permitted claims from the GB register.',
      },
    ],
    updated: '2026-09-22',
  },
  {
    slug: 'maca-root',
    name: 'Maca root',
    aliases: [
      'maca root',
      'maca root powder',
      'maca root extract',
      'gelatinized maca',
      'gelatinised maca',
      'lepidium meyenii',
      'maca powder',
      'maca extract',
    ],
    category: 'Root / adaptogen',
    grade: 'D',
    quickAnswer:
      'Maca is a turnip-like root from the high Andes, sold as a powder or capsule for libido, energy, fertility and menopausal symptoms. A handful of small trials suggest it may modestly improve sexual desire and some menopausal symptoms, but the reviews that pooled them called the evidence limited. It does not raise testosterone: the trial that measured it directly found no change. It is a food in Peru and appears well tolerated, so the main risk is spending money on a promise that is larger than the research.',
    atAGlance: [
      {
        label: 'Typical studied dose',
        value: '1.5–3 g a day',
        note: 'Dried root powder, usually for 6 to 12 weeks. Extract products vary too much to convert reliably.',
      },
      {
        label: 'Effect on testosterone',
        value: 'None measured',
        note: 'A 12-week randomised trial in men at 1.5 g and 3 g a day found serum testosterone unchanged at every time point.',
      },
      {
        label: 'Libido trials',
        value: '4 RCTs, all small',
        note: 'Three of four were positive in a 2010 systematic review, which still judged the evidence too limited to be conclusive.',
      },
      {
        label: 'Menopause trials',
        value: '4 RCTs, all small',
        note: 'All favourable on symptom scores, but a 2011 review said numbers and quality were too low for firm conclusions.',
      },
      {
        label: 'Safety profile',
        value: 'Food-like',
        note: 'Eaten as a staple in Peru. Long-term supplement safety at high doses has not been studied properly.',
      },
    ],
    whatIsIt:
      'Maca (Lepidium meyenii) is a root vegetable in the same family as radish, cabbage and broccoli. It grows at 4,000 metres and above in the Peruvian Andes, where it has been eaten for centuries, usually boiled, baked or made into a porridge or drink. The root comes in yellow, red and black varieties, and some supplement brands sell them separately on the strength of small studies suggesting they behave differently. Most of what you find on a shelf is dried, ground root, either raw or "gelatinised". Gelatinised maca has been cooked under pressure to remove the starch, which makes it easier to digest and closer to how it is traditionally eaten. Extracts also exist, but they are not standardised to any agreed marker compound, so one brand’s 500 mg extract cannot be compared with another’s.',
    mechanism:
      'Nobody knows how maca works, if it does. That is worth saying plainly, because product pages often write as if the mechanism were settled. The root contains compounds called macamides and macaenes, which are unique to maca, along with glucosinolates, sterols and a lot of ordinary carbohydrate and protein. Early marketing claimed maca acted as a hormone or boosted testosterone. The human evidence contradicts that: in a 12-week trial in men it did not change testosterone, oestradiol, LH, FSH or prolactin. The current theory is that any effect on desire or mood acts somewhere other than the sex hormones, possibly in the brain, but this is a hypothesis drawn largely from animal work rather than a demonstrated pathway in people.',
    claims: [
      {
        claim: 'Improving sexual desire and function',
        grade: 'C',
        body: 'This is maca’s best-supported claim, and it is still thin. A 2010 systematic review in BMC Complementary and Alternative Medicine found four randomised, placebo-controlled trials. Two reported a significant improvement in sexual desire or dysfunction, in healthy menopausal women and healthy men. One, in cyclists, found no effect. The fourth, in men with mild erectile dysfunction, reported an improvement on a standard erectile function score. The authors concluded the evidence was limited, because the trials were few, small and short. A small pilot trial in people with sexual side effects from SSRI antidepressants found a possible dose-related benefit. That is a promising signal, not a finding. The grade is C: something may be there, and a single well-run trial could confirm or erase it.',
        refs: ['shin2010', 'dording2008'],
      },
      {
        claim: 'Easing menopausal symptoms',
        grade: 'C',
        body: 'A 2011 systematic review in Maturitas found four randomised trials of maca in peri- and postmenopausal women. All four reported favourable effects on standard menopause symptom scores. The reviewers still concluded the evidence was limited, and they were right to: the total number of women was small, the methods were weak, and several trials came from the same group of researchers. For anyone weighing maca against treatments with a real evidence base, such as hormone therapy or the non-hormonal drugs, maca is not in the same league. Hot flushes also respond strongly to placebo, which makes small trials especially easy to over-read.',
        refs: ['lee2011'],
      },
      {
        claim: 'Raising testosterone',
        grade: 'F',
        body: 'This is the claim to be most sceptical of, because it has actually been tested and failed. A 12-week double-blind randomised trial published in the Journal of Endocrinology gave healthy men 1.5 g or 3 g of maca a day. Serum testosterone was not affected at any time point, and neither were the other reproductive hormones measured. The same research group separately found that the men’s reported sexual desire improved without any change in testosterone. So if maca does anything for libido, it does not do it through testosterone. A product sold as a "testosterone booster" on the strength of maca is selling a mechanism the research has ruled out.',
        refs: ['gonzales2003'],
      },
      {
        claim: 'Improving male fertility and sperm quality',
        grade: 'D',
        body: 'A few small trials have reported increases in semen volume, sperm count or motility with maca, and there is a larger body of animal work. The human studies are too small and too short to build a fertility decision on, and none has shown an increase in pregnancies, which is the outcome that matters. Anyone trying to conceive is better served by a fertility assessment than by a root powder, and should not use maca as a reason to delay one.',
      },
      {
        claim: 'Energy, stamina and mood',
        grade: 'D',
        body: 'Maca is widely sold as an energy food and an "adaptogen". Neither label has a scientific definition that trials can test directly, and the human studies on energy, exercise performance and mood are few, small and inconsistent. Maca is a nutritious, carbohydrate-rich vegetable, and a spoonful in a smoothie will provide calories, but that is not the same as a stimulant effect, and it does not have one.',
      },
    ],
    dosage:
      'Most human trials used 1.5 to 3 g of dried maca root a day, typically for 6 to 12 weeks, and occasionally up to 3.5 g. That is roughly a heaped teaspoon to a tablespoon of powder. Capsule products often provide 500 mg to 750 mg per capsule, so matching a studied dose means three to six capsules a day. Gelatinised powder is cooked, which is closer to how maca is eaten in Peru and tends to be easier on the stomach. Effects, where reported, took weeks rather than days to appear.',
    dosageGap:
      'The common gap is the capsule. A single 500 mg capsule is a third of the lowest studied dose, and many products direct one or two a day. Extracts make it harder still: a label reading "maca extract 4:1, 500 mg" is claiming to equal 2 g of root, but there is no agreed standard, and the trials mostly used whole powdered root rather than extracts. The other gap is colour. Black, red and yellow maca are sometimes sold at a premium on the basis of differences seen mainly in animal studies. There is no human evidence that justifies paying more for a particular colour.',
    safety:
      'Maca is a staple food in the Andes and has been eaten in large quantities for generations, which is reassuring. In trials lasting up to about three months, side effects were uncommon and mild, mostly stomach upset. That is not the same as knowing that high-dose, long-term use as a supplement is safe, because no one has studied it properly. Three points deserve care. First, maca is a brassica and contains glucosinolates, which in large amounts can interfere with thyroid function in people who are short of iodine. This is theoretical for most people, but anyone with thyroid disease should mention maca to their clinician, and raw powder carries more of these compounds than cooked. Second, anyone with a hormone-sensitive condition, such as some breast cancers, endometriosis or fibroids, should ask before using it. The human evidence suggests maca does not act as a hormone, but the question has not been settled. Third, there is a published case of maca interfering with a laboratory testosterone test in a woman, so tell whoever orders your blood tests that you take it. There is not enough safety data for pregnancy or breastfeeding.',
    faqs: [
      {
        question: 'Does maca increase testosterone?',
        answer:
          'No. A 12-week randomised trial gave men 1.5 g or 3 g of maca a day and found serum testosterone unchanged at every point, along with the other reproductive hormones. Some of the same men reported more sexual desire, which suggests that if maca affects libido, it does so through some route other than testosterone.',
      },
      {
        question: 'Does maca work for libido?',
        answer:
          'Possibly, a little. A 2010 systematic review found four small randomised trials, three of which reported benefits for sexual desire or function. The reviewers still concluded the evidence was too limited to be sure. If you try it, give it six to eight weeks at 1.5 to 3 g a day, which is what the trials used, and be honest with yourself about whether it made a difference.',
      },
      {
        question: 'Can maca help with menopause symptoms?',
        answer:
          'Four small trials all reported improvements in symptom scores, but a 2011 review judged the evidence limited because the trials were small and methodologically weak. Menopause symptoms respond strongly to placebo, which makes small trials easy to over-read. Maca is not a substitute for a conversation about treatments with much stronger evidence.',
      },
      {
        question: 'What is the difference between raw and gelatinised maca?',
        answer:
          'Gelatinised maca has been cooked under pressure and dried, which removes most of the starch. It is closer to how maca is eaten in Peru, where it is always cooked, and many people find it easier to digest. Raw powder keeps more of the glucosinolates, the compounds with a theoretical effect on the thyroid. For most people either is fine; gelatinised is the more cautious choice.',
      },
      {
        question: 'Is red or black maca better than yellow?',
        answer:
          'There is no good human evidence that one colour is better for any purpose. The differences come mainly from animal studies. Paying a premium for a specific colour is paying for a hypothesis.',
      },
      {
        question: 'How much maca should I take?',
        answer:
          'Human trials mostly used 1.5 to 3 g of dried root a day, which is about one to three teaspoons of powder or three to six typical capsules. A single 500 mg capsule is a third of the lowest studied amount.',
      },
      {
        question: 'Is maca safe?',
        answer:
          'For most healthy adults at food-like amounts it appears to be, and trials of up to three months reported few side effects. If you have thyroid disease or a hormone-sensitive condition, or you are pregnant or breastfeeding, check with a clinician first. Also tell whoever orders your blood tests, as maca has been reported to interfere with a testosterone assay.',
      },
    ],
    references: [
      {
        id: 'shin2010',
        text: 'Shin BC, Lee MS, Yang EJ, Lim HS, Ernst E (2010). Maca (L. meyenii) for improving sexual function: a systematic review. BMC Complementary and Alternative Medicine 10:44 — four RCTs, three positive and one negative, evidence judged limited.',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2928177/',
      },
      {
        id: 'lee2011',
        text: 'Lee MS, Shin BC, Yang EJ, Lim HJ, Ernst E (2011). Maca (Lepidium meyenii) for treatment of menopausal symptoms: a systematic review. Maturitas 70(3):227-233 — four RCTs, all favourable, evidence judged limited.',
        url: 'https://www.maturitas.org/article/S0378-5122(11)00262-3/abstract',
      },
      {
        id: 'gonzales2003',
        text: 'Gonzales GF et al. (2003). Effect of Lepidium meyenii (Maca), a root with aphrodisiac and fertility-enhancing properties, on serum reproductive hormone levels in adult healthy men. Journal of Endocrinology 176(1):163-168 — 12-week RCT at 1.5 g and 3 g a day; testosterone and other reproductive hormones unchanged.',
        url: 'https://joe.bioscientifica.com/view/journals/joe/176/1/163.xml',
      },
      {
        id: 'dording2008',
        text: 'Dording CM et al. (2008). A double-blind, randomized, pilot dose-finding study of maca root (L. meyenii) for the management of SSRI-induced sexual dysfunction. CNS Neuroscience & Therapeutics.',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6494062/',
      },
      {
        id: 'maca-assay',
        text: 'First case report of testosterone assay-interference in a female taking maca (Lepidium meyenii).',
        url: 'https://pubmed.ncbi.nlm.nih.gov/22700073/',
      },
      {
        id: 'mskcc-maca',
        text: 'Memorial Sloan Kettering Cancer Center. Maca — integrative medicine monograph covering uses, evidence and cautions.',
        url: 'https://www.mskcc.org/cancer-care/integrative-medicine/herbs/maca',
      },
    ],
    editorNote:
      'Maca is a good example of a claim surviving after the research has answered it. The testosterone question was tested more than twenty years ago, in a proper randomised trial, and the answer was no. Yet "testosterone support" is still one of the most common reasons it is sold. What is left once you take that away is modest and genuinely uncertain: a few small trials hinting at better libido and fewer menopausal symptoms. It is a reasonable thing to try, cheaply and for a limited time, provided nobody is paying premium prices for a mechanism that has already been disproved.',
    related: ['l-theanine', 'gaba'],
    history: [
      {
        date: '2026-09-25',
        note: 'First published with per-claim evidence grades. Libido findings from the 2010 BMC systematic review and the SSRI pilot trial; menopause findings from the 2011 Maturitas review; hormone findings from the 2003 Journal of Endocrinology trial.',
      },
    ],
    published: slot('2026-09-25', 1),
    updated: '2026-09-25',
  },
  {
    slug: 'grape-seed-extract',
    name: 'Grape seed extract',
    aliases: [
      'grape seed extract',
      'grapeseed extract',
      'vitis vinifera seed extract',
      'grape seed proanthocyanidins',
    ],
    category: 'Plant polyphenol',
    grade: 'C',
    quickAnswer:
      'Grape seed extract is a concentrate of the polyphenols found in the seeds of wine grapes, mainly compounds called proanthocyanidins. Its best-supported use is blood pressure: a meta-analysis of 16 trials found a modest average fall, clearest in younger people and those carrying extra weight. The evidence for cholesterol is weak, and "antioxidant" claims mean very little on their own. It is generally well tolerated, but it may add to the effect of blood thinners.',
    atAGlance: [
      {
        label: 'Typical studied dose',
        value: '150–300 mg a day',
        note: 'Of standardised extract, usually for 4 to 16 weeks. Some trials went higher.',
      },
      {
        label: 'Average blood pressure fall',
        value: '≈6 / 3 mmHg',
        note: 'Systolic and diastolic, pooled across 16 trials and 810 people. An earlier 9-trial analysis found a much smaller systolic effect.',
      },
      {
        label: 'Who responded most',
        value: 'Under 50, BMI 25+',
        note: 'The reduction was significant only in younger subjects and larger in those who were overweight or had metabolic disorders.',
      },
      {
        label: 'Effect on LDL cholesterol',
        value: 'Not significant',
        note: 'Pooled trials have not shown a reliable change in lipids.',
      },
      {
        label: 'Main interaction',
        value: 'Blood thinners',
        note: 'Grape seed polyphenols have anticoagulant and antiplatelet activity in laboratory studies.',
      },
    ],
    whatIsIt:
      'Grape seed extract is made from the seeds of grapes, usually Vitis vinifera, the species used for wine. The seeds are a by-product of wine and juice production, which is part of why the extract is cheap. What makes it interesting is its concentration of oligomeric proanthocyanidins, or OPCs: chains of polyphenol building blocks that also give red wine, tea and dark chocolate some of their bitterness and astringency. Good-quality extracts are standardised, typically to 90 per cent or more total polyphenols or to a stated OPC percentage. The number on the label only means something if that standardisation is given. "Grape seed 500 mg" with no percentage could be almost anything.',
    mechanism:
      'In laboratory work, grape seed polyphenols act as antioxidants, help the lining of blood vessels release nitric oxide, and reduce some markers of inflammation. The nitric oxide effect is the plausible link to blood pressure: blood vessels that relax more easily lower the pressure inside them. The word "antioxidant" deserves a caution, though. A compound that neutralises free radicals in a test tube does not necessarily do so in the body at the doses that are absorbed, and large trials of antioxidant supplements have repeatedly failed to show the benefits predicted from laboratory work. Proanthocyanidins are also poorly absorbed intact. Much of what reaches the bloodstream consists of smaller compounds made by gut bacteria, which may be responsible for part of the effect.',
    claims: [
      {
        claim: 'Lowering blood pressure',
        grade: 'B',
        body: 'This is the claim the ingredient earns. A 2016 meta-analysis in Medicine pooled 16 randomised trials with 810 participants. It found average falls of about 6 mmHg systolic and 2.8 mmHg diastolic. That is similar in size to a meaningful cut in dietary salt, and smaller than a single blood pressure drug. The detail matters: the reduction was statistically significant only in trials of people under 50, and it was larger in people who were overweight or had metabolic disorders. An earlier 2011 meta-analysis of nine trials found a much smaller systolic effect, about 1.5 mmHg. B rather than A because the trials are small, they disagree about the size of the effect, and the benefit is concentrated in particular groups. It is a plausible add-on for someone with mildly raised blood pressure. It is not a replacement for prescribed treatment.',
        refs: ['zhang2016', 'feringa2011'],
      },
      {
        claim: 'Improving cholesterol',
        grade: 'D',
        body: 'The 2011 meta-analysis that looked at cardiovascular risk markers found no significant effect on LDL cholesterol, HDL cholesterol or triglycerides. Individual small trials have reported improvements, but they do not hold up when pooled. If cholesterol is the reason you are considering grape seed extract, the evidence points elsewhere, for example to soluble fibres such as psyllium, or to prescribed treatment where it is indicated.',
        refs: ['feringa2011'],
      },
      {
        claim: 'Circulation and chronic venous insufficiency',
        grade: 'D',
        body: 'Grape seed extract has a long history of use in parts of Europe for heavy, swollen legs and poor venous circulation, and there are older trials suggesting benefit. Most are small, short and methodologically weak by current standards. The idea is plausible given the effects on blood vessels, but it has not been tested properly.',
      },
      {
        claim: 'General antioxidant protection and anti-ageing',
        grade: 'D',
        body: 'Proanthocyanidins are powerful antioxidants in a test tube. That is true and nearly meaningless for a buyer. Antioxidant capacity measured in a laboratory does not predict health effects in people, and the large trials of antioxidant supplements, for vitamins E and C and beta-carotene, did not deliver the benefits the laboratory work promised. A label claiming "antioxidant protection" is describing chemistry, not an outcome anyone has shown in trials of grape seed extract.',
      },
    ],
    dosage:
      'Blood pressure trials typically used 150 to 300 mg a day of standardised extract for 4 to 16 weeks, and a few used more. Look for a label that states the standardisation, commonly 90 to 95 per cent polyphenols or a stated OPC percentage. It is usually taken with food. If you are trying it for blood pressure, measure before you start and again after two to three months, on the same device at the same time of day. A home reading is the only way to know whether it is doing anything for you.',
    dosageGap:
      'The gap here is usually standardisation rather than dose. A product listing "grape seed extract 100 mg" without a polyphenol or OPC percentage gives you no way to compare it with the trials, which used standardised extracts. Multi-ingredient "heart health" or "antioxidant" blends are worse: grape seed often appears as a small part of a proprietary blend at a fraction of the studied amount. The other trap is "grape extract" or "resveratrol", which are different materials from grape seed extract and should not borrow its evidence.',
    safety:
      'Grape seed extract is generally well tolerated in trials lasting up to several months. The reported side effects are mild: headache, nausea, stomach upset, dizziness and an itchy scalp. The one interaction worth taking seriously is with blood thinners. In laboratory studies grape seed polyphenols have anticoagulant and antiplatelet activity, so combining the extract with warfarin, clopidogrel, aspirin or similar drugs could in principle increase bleeding risk. Stop it before planned surgery, and check with a clinician if you take any of those drugs or have a bleeding disorder. Because it can lower blood pressure, anyone already on blood pressure medication should monitor their readings. There is not enough information on use in pregnancy or breastfeeding, and grape allergy is a contraindication.',
    faqs: [
      {
        question: 'Does grape seed extract lower blood pressure?',
        answer:
          'Modestly, in some people. A meta-analysis of 16 trials found average falls of about 6 mmHg systolic and 3 mmHg diastolic. The effect was clearest in people under 50 and in those who were overweight or had metabolic disorders. An earlier analysis found a smaller effect. If you try it, check your blood pressure before and after two to three months so you know whether it is working for you.',
      },
      {
        question: 'Can I take it instead of my blood pressure medication?',
        answer:
          'No. The average effect is smaller than a single blood pressure drug and inconsistent between people. If you take medication and want to add grape seed extract, talk to your clinician and keep monitoring, because the two effects could add together.',
      },
      {
        question: 'Does it lower cholesterol?',
        answer:
          'Not reliably. A 2011 meta-analysis of cardiovascular risk markers found no significant effect on LDL, HDL or triglycerides. Soluble fibres such as psyllium have much better evidence for LDL cholesterol.',
      },
      {
        question: 'What should I look for on the label?',
        answer:
          'A stated standardisation, such as "95% polyphenols" or a stated OPC percentage, and an amount of 150 to 300 mg a day. Without the standardisation there is no way to compare the product with the trials.',
      },
      {
        question: 'Is grape seed extract the same as resveratrol?',
        answer:
          'No. Resveratrol is a different polyphenol, found mainly in grape skins and in Japanese knotweed. Grape seed extract is rich in proanthocyanidins. They have different research bases, and one should not borrow the other’s evidence.',
      },
      {
        question: 'Is it safe with blood thinners?',
        answer:
          'Check with your doctor first. Grape seed polyphenols have anticoagulant and antiplatelet activity in laboratory studies, which could add to the effect of drugs such as warfarin, clopidogrel or aspirin. Stop taking it before planned surgery.',
      },
    ],
    references: [
      {
        id: 'zhang2016',
        text: 'Zhang H et al. (2016). The impact of grape seed extract treatment on blood pressure changes: a meta-analysis of 16 randomized controlled trials. Medicine 95(33) — 810 participants; systolic −6.08 mmHg and diastolic −2.80 mmHg, significant only in subjects under 50 and greater with BMI of 25 or above.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/27537554/',
      },
      {
        id: 'feringa2011',
        text: 'Feringa HHH et al. (2011). The effect of grape seed extract on cardiovascular risk markers: a meta-analysis of randomized controlled trials. Journal of the American Dietetic Association 111(8):1173-1181 — nine trials; systolic −1.54 mmHg, no significant effect on lipids.',
        url: 'https://www.jandonline.org/article/S0002-8223(11)00587-6/abstract',
      },
      {
        id: 'gse-anticoag',
        text: 'Dual anticoagulant/antiplatelet activity of polyphenolic grape seeds extract. Nutrients, 2019 — laboratory evidence behind the bleeding-risk caution.',
        url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6356405/',
      },
      {
        id: 'gse-2021-rct',
        text: 'Grape seed extract positively modulates blood pressure and perceived stress: a randomized, double-blind, placebo-controlled study in healthy volunteers. Nutrients, 2021.',
        url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7922661/',
      },
    ],
    editorNote:
      'Grape seed extract is often sold as an antioxidant, which is the least useful thing to say about it. The more interesting finding is the blood pressure result: small, real and concentrated in particular groups. That makes it a reasonable thing for someone with mildly raised blood pressure to try, provided they measure before and after rather than trusting that it is working. If readers take one habit from this page, it should be that one. A home blood pressure monitor costs less than a few bottles and settles the question.',
    related: ['omega-3', 'green-tea-extract'],
    history: [
      {
        date: '2026-09-25',
        note: 'First published with per-claim evidence grades. Blood pressure findings from the 2016 Medicine meta-analysis and the 2011 Journal of the American Dietetic Association meta-analysis, which also supplied the lipid findings; bleeding caution from the 2019 laboratory study of anticoagulant activity.',
      },
    ],
    published: slot('2026-09-25', 2),
    updated: '2026-09-25',
  },
  {
    slug: 'capsicum-annuum',
    name: 'Capsicum annuum (capsaicin)',
    aliases: [
      'capsicum annuum',
      'capsicum annuum extract',
      'capsicum extract',
      'capsicum fruit',
      'capsicum',
      'cayenne pepper',
      'cayenne',
      'red pepper extract',
      'chilli pepper extract',
      'chili pepper extract',
      'capsaicin',
      'capsaicinoids',
      'capsinoids',
      'capsimax',
    ],
    category: 'Thermogenic / plant extract',
    grade: 'D',
    quickAnswer:
      'Capsicum annuum is the chilli pepper, and capsaicin is the compound that makes it hot. It appears in fat burners because it slightly raises energy expenditure and can slightly reduce appetite. Both effects are real in trials and both are small: tens of calories, not hundreds. The longer trials have not turned that into meaningful weight loss. Topical capsaicin is a different story: as a high-strength skin patch it is a licensed treatment for some nerve pain, but that says nothing about a capsule.',
    atAGlance: [
      {
        label: 'Extra energy burned',
        value: '≈34 kcal a day',
        note: 'Pooled increase in resting metabolic rate across trials. Roughly one small biscuit.',
      },
      {
        label: 'Less eaten at a meal',
        value: '≈74 kcal',
        note: 'Pooled reduction in intake when capsaicinoids were taken before a meal, in short laboratory studies.',
      },
      {
        label: 'Weight regain after dieting',
        value: 'No difference',
        note: 'A 3-month trial at 135 mg capsaicin a day found more fat burning but no less weight regain than placebo.',
      },
      {
        label: 'Common side effects',
        value: 'Burning, reflux',
        note: 'Stomach and throat burning, heartburn and loose stools, especially on an empty stomach.',
      },
      {
        label: 'Where capsaicin has strong evidence',
        value: 'Skin patch for nerve pain',
        note: 'A prescription 8% patch — a different use, route and dose from any fat burner.',
      },
    ],
    whatIsIt:
      'Capsicum annuum is the species that gives us bell peppers, jalapeños, paprika and cayenne. The heat comes from a family of compounds called capsaicinoids, of which capsaicin is the main one. Sweet peppers have almost none. Supplements use extracts standardised to a capsaicinoid content, often around 2 per cent, and some use coated beadlets, such as the branded Capsimax, designed to release in the gut rather than the mouth so the capsule does not burn on the way down. A related group, capsinoids, comes from a non-pungent pepper variety. Capsinoids act on the same receptor without the heat and have been studied separately.',
    mechanism:
      'Capsaicin activates a receptor called TRPV1, the same one that responds to heat. That is why chilli feels hot and why the body responds as if it were warming up: the sympathetic nervous system becomes slightly more active, the body burns a little more energy and shifts slightly towards burning fat. Some studies suggest it activates brown fat, a heat-producing tissue that adults have in small and variable amounts. Capsaicin may also reduce appetite through signals from the gut. All of this is well documented in short laboratory studies. The problem is scale. The extra energy burned is a few tens of calories a day, and the body adjusts to repeated exposure, which may be why the effect has not produced much weight loss over months.',
    claims: [
      {
        claim: 'Increasing energy expenditure ("thermogenesis")',
        grade: 'C',
        body: 'The effect is real and it is small. A 2012 critical review and meta-analysis in Chemical Senses concluded that capsaicin and capsiate both increase energy expenditure and fat burning, especially at high doses, and that the magnitude is small. A later meta-analysis put the pooled increase in resting metabolic rate at about 34 kcal a day. For scale, that is roughly one small biscuit. The grade is C rather than higher because the studies are mostly short and acute, doses vary widely, and the effect may fade with regular use. Nobody should build a weight-loss plan on 34 calories.',
        refs: ['ludy2012', 'zsiga2020'],
      },
      {
        claim: 'Reducing appetite and food intake',
        grade: 'C',
        body: 'A 2014 meta-analysis in Appetite found that taking capsaicinoids before a meal reduced how much people ate at that meal by about 74 kcal. That is a genuine finding, and it is the most useful part of the capsaicin story. It comes from short laboratory studies, though, and nobody has shown that it persists over weeks, or that people do not simply eat more later. Treat it as a small effect on one meal rather than a lasting change in appetite.',
        refs: ['whiting2014'],
      },
      {
        claim: 'Weight loss or keeping weight off',
        grade: 'D',
        body: 'This is the claim fat burners make, and the longer trials do not support it. In a 2003 trial in the British Journal of Nutrition, people who had just lost weight took 135 mg of capsaicin a day or a placebo for three months. The capsaicin group burned more fat, but regained just as much weight. A 12-week trial of 6 mg a day of capsinoids, published in the American Journal of Clinical Nutrition in 2009, found a loss of abdominal fat but no significant difference in body weight. The European Food Safety Authority reviewed the evidence for capsaicin and maintaining weight after weight loss and did not accept the claim. D, because the mechanism is real but the outcome that matters has not been shown.',
        refs: ['lejeune2003', 'snitker2009', 'efsa-capsaicin'],
      },
      {
        claim: 'Relieving nerve pain (topical use)',
        grade: 'B',
        body: 'Included so the evidence is not borrowed by the wrong product. A 2017 Cochrane review of high-concentration (8 per cent) capsaicin patches, a prescription treatment applied in clinic, found moderate-quality evidence of moderate or better pain relief for a minority of people with post-herpetic neuralgia, with about 12 people needing treatment for one extra person to benefit. That is a real, licensed medical use. It is a different dose, route and product from a capsicum capsule in a fat burner, and none of it transfers.',
        refs: ['derry2017'],
      },
    ],
    dosage:
      'There is no single agreed oral dose. Trials of capsaicin for energy expenditure used widely varying amounts, from a few milligrams to more than 100 mg a day of capsaicin, often in food. The capsinoid trial used 6 mg a day. Branded capsicum extracts in supplements commonly provide 2 to 4 mg of capsaicinoids per serving, often from 100 to 200 mg of an extract standardised to about 2 per cent. Taking it with food reduces stomach irritation. If you want the appetite effect, it has only been shown when taken shortly before a meal.',
    dosageGap:
      'Most fat burners that include capsicum list it inside a proprietary blend, so you cannot tell how much capsaicinoid you are getting. Where the amount is listed, it is often an extract weight rather than the capsaicinoid content. "Capsicum annuum 100 mg" at 2 per cent is 2 mg of capsaicinoids. Check whether the label gives the standardisation. The bigger gap, though, is between the mechanism and the promise. Even a product dosed exactly as in the trials delivers an effect measured in tens of calories.',
    safety:
      'Capsaicin is safe in food amounts for most people, but concentrated extracts can cause stomach pain, burning, heartburn, nausea and diarrhoea, particularly on an empty stomach. People with reflux, gastritis, ulcers or irritable bowel syndrome are likely to find it uncomfortable. Because it raises sympathetic activity, it is usually combined in fat burners with caffeine and other stimulants, and the combination is harder on the heart than capsicum alone. Anyone with high blood pressure or a heart rhythm problem should look at the whole formula, not just this ingredient. Capsaicin may interact with blood thinners and some blood pressure medicines, although the evidence is limited. Keep the capsules away from eyes and broken skin, and wash your hands after opening one.',
    faqs: [
      {
        question: 'Does capsaicin burn fat?',
        answer:
          'It increases energy expenditure and fat burning slightly: pooled trials put the extra energy burned at about 34 kcal a day. That is real but tiny, and a three-month trial found it did not stop people regaining weight after a diet. It is not a meaningful fat-loss tool on its own.',
      },
      {
        question: 'Does it reduce appetite?',
        answer:
          'In short laboratory studies, taking capsaicinoids before a meal reduced intake by about 74 kcal at that meal. Nobody has shown this lasts over weeks or that people do not compensate later.',
      },
      {
        question: 'Is eating chilli the same as taking a capsicum supplement?',
        answer:
          'Broadly, yes. Many trials used capsaicin in food or as red pepper. Supplements offer a measured dose and, in coated forms, less burning in the mouth. Neither delivers a large effect.',
      },
      {
        question: 'What is Capsimax?',
        answer:
          'A branded capsicum extract in coated beadlets, designed to release in the gut so it does not burn the mouth and throat. The coating changes comfort, not the size of the effect.',
      },
      {
        question: 'Are there side effects?',
        answer:
          'Stomach burning, heartburn, nausea and loose stools are common with concentrated extracts, especially on an empty stomach. People with reflux or a sensitive gut often cannot tolerate it. In fat burners it is usually combined with stimulants, so check the full label if you have heart or blood pressure problems.',
      },
      {
        question: 'Does capsaicin help with pain?',
        answer:
          'As a high-strength skin patch prescribed for nerve pain, yes, for a minority of people. That evidence is about a medical treatment applied to the skin and has nothing to do with a capsicum capsule.',
      },
    ],
    references: [
      {
        id: 'ludy2012',
        text: 'Ludy MJ, Moore GE, Mattes RD (2012). The effects of capsaicin and capsiate on energy balance: critical review and meta-analyses of studies in humans. Chemical Senses 37(2):103-121 — small increases in energy expenditure and fat oxidation, greater at higher doses.',
        url: 'https://academic.oup.com/chemse/article/37/2/103/273510',
      },
      {
        id: 'zsiga2020',
        text: '(2020). The effect of capsaicinoids or capsinoids in red pepper on thermogenesis in healthy adults: a systematic review and meta-analysis — resting metabolic rate increased by about 34 kcal a day against placebo.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/33063385/',
      },
      {
        id: 'whiting2014',
        text: 'Whiting S, Derbyshire EJ, Tiwari B (2014). Could capsaicinoids help to support weight management? A systematic review and meta-analysis of energy intake data. Appetite 73 — ad libitum intake reduced by 309.9 kJ (74 kcal) at the meal after dosing.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/24246368/',
      },
      {
        id: 'lejeune2003',
        text: 'Lejeune MPGM, Kovacs EMR, Westerterp-Plantenga MS (2003). Effect of capsaicin on substrate oxidation and weight maintenance after modest body-weight loss in human subjects. British Journal of Nutrition 90(3):651-659 — 135 mg a day sustained fat oxidation but did not limit three-month weight regain.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/13129472/',
      },
      {
        id: 'snitker2009',
        text: 'Snitker S et al. (2009). Effects of novel capsinoid treatment on fatness and energy metabolism in humans: possible pharmacogenetic implications. American Journal of Clinical Nutrition 89(1):45-50 — 6 mg a day for 12 weeks; abdominal fat loss, no significant difference in body weight.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/19056576/',
      },
      {
        id: 'efsa-capsaicin',
        text: 'EFSA Panel on Dietetic Products, Nutrition and Allergies (2011). Scientific Opinion on the substantiation of health claims related to capsaicin and maintenance of body weight after weight loss, increase in carbohydrate oxidation, and contribution to normal hair growth. EFSA Journal 9(6):2210.',
        url: 'https://efsa.onlinelibrary.wiley.com/doi/abs/10.2903/j.efsa.2011.2210',
      },
      {
        id: 'derry2017',
        text: 'Derry S et al. (2017). Topical capsaicin (high concentration) for chronic neuropathic pain in adults. Cochrane Database of Systematic Reviews — eight studies, 2,488 participants; NNT of about 12 for moderate relief in post-herpetic neuralgia.',
        url: 'https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD007393.pub4/full',
      },
    ],
    editorNote:
      'Capsicum is a good ingredient for learning to separate "does it do something" from "does it do enough". The answer to the first question is yes: capsaicin measurably raises energy expenditure, and most ingredients in the fat-burner aisle cannot say that much. The answer to the second is no. Thirty-odd calories a day is well inside the noise of an ordinary day’s eating. When a label says "thermogenic", it is making a true statement about a trivial effect. The number is the part worth remembering.',
    related: ['green-tea-extract', 'gymnema-sylvestre', 'glucomannan'],
    history: [
      {
        date: '2026-09-25',
        note: 'First published with per-claim evidence grades. Energy expenditure findings from the 2012 Chemical Senses meta-analyses and the 2020 thermogenesis meta-analysis; appetite from the 2014 Appetite meta-analysis; weight outcomes from the 2003 British Journal of Nutrition and 2009 AJCN trials and the 2011 EFSA opinion; topical use from the 2017 Cochrane review.',
      },
    ],
    published: slot('2026-09-25', 3),
    updated: '2026-09-25',
  },
  {
    slug: 'gymnema-sylvestre',
    name: 'Gymnema sylvestre',
    aliases: [
      'gymnema sylvestre',
      'gymnema sylvestre extract',
      'gymnema leaf',
      'gymnema',
      'gymnemic acid',
      'gymnemic acids',
      'gurmar',
    ],
    category: 'Herbal extract',
    grade: 'D',
    quickAnswer:
      'Gymnema sylvestre is a climbing plant used in Ayurvedic medicine, where its Hindi name, gurmar, means "sugar destroyer". Chewed or taken as a lozenge, it temporarily stops you tasting sweetness, and in controlled studies that cut how many sweets people ate. As a capsule for blood sugar, the trials are small, varied and of low quality. It can add to the effect of diabetes medicines, and there are published cases of liver injury.',
    atAGlance: [
      {
        label: 'Sweet-taste block',
        value: '30–60 minutes',
        note: 'Gymnemic acids bind sweet receptors on the tongue. Only works if it touches the tongue — a swallowed capsule does not.',
      },
      {
        label: 'Sweets eaten after a lozenge',
        value: '44% less',
        note: 'In a 67-person placebo-controlled experiment, total candy intake fell by 44%. A short-term laboratory result.',
      },
      {
        label: 'Blood sugar trials',
        value: '10 studies, 419 people',
        note: 'A 2021 meta-analysis reported falls in glucose and HbA1c against baseline, but with extreme heterogeneity.',
      },
      {
        label: 'Typical capsule dose',
        value: '200–800 mg a day',
        note: 'Of extract, usually standardised to about 25% gymnemic acids. Trial doses vary widely.',
      },
      {
        label: 'Two real risks',
        value: 'Low blood sugar, liver',
        note: 'It can add to diabetes medicines, and there are case reports of drug-induced hepatitis.',
      },
    ],
    whatIsIt:
      'Gymnema sylvestre is a woody climbing plant native to the forests of India, Africa and Australia. Its leaves have been used in Ayurvedic medicine for centuries for what would now be called diabetes. The active compounds are a family of saponins called gymnemic acids. If you chew a gymnema leaf and then eat a spoonful of sugar, the sugar tastes like sand. That unusual effect is where the Hindi name gurmar, "sugar destroyer", comes from. Supplements come as capsules of dried leaf or extract, usually standardised to about 25 per cent gymnemic acids, and as lozenges, mints and teas designed to act on the tongue.',
    mechanism:
      'Gymnema has two separate proposed actions, and it matters which one a product relies on. The first is on the tongue. Gymnemic acids have a structure similar to glucose and bind to the sweet taste receptors, temporarily blocking them for roughly 30 to 60 minutes without affecting salty, sour, bitter or savoury tastes. This is well demonstrated in people, and it only happens if the gymnema touches your tongue. The second action, claimed for capsules, is on blood sugar. Laboratory and animal studies suggest gymnemic acids may slow sugar absorption from the gut and may support insulin release from the pancreas. The human evidence for this second action is far weaker than for the first.',
    claims: [
      {
        claim: 'Blocking sweet taste and reducing sugar cravings',
        grade: 'B',
        body: 'This is the best-supported use, and it depends on the format. In a 2017 double-blind experiment published in the Journal of Psychopharmacology, 67 adults sucked either a gymnemic acid lozenge or a placebo after tasting their favourite sweets. The gymnema group was 31 per cent less likely to take the first offered serving, and total sweet intake fell by 44 per cent. Other studies of gymnema mints have found similar drops in desire and intake. The receptor mechanism is clearly established, which strengthens the case. B rather than A because the studies are short, mostly single sessions, and nobody has shown that the effect changes long-term sugar intake or weight. It also only works as a lozenge, mint or tea that touches the tongue, and taste returns within about an hour.',
        refs: ['stice2017'],
      },
      {
        claim: 'Lowering blood sugar in type 2 diabetes',
        grade: 'C',
        body: 'A 2021 meta-analysis in Phytotherapy Research pooled 10 studies with 419 participants. It reported reductions in fasting glucose, post-meal glucose and HbA1c. Before taking that at face value, look at how it was done: many comparisons were against the participants’ own starting values rather than a placebo group, and heterogeneity between studies was extreme, at 90 to 99 per cent. That means the trials disagreed so much that a single pooled number is hard to interpret. Several trials were small, unblinded or used gymnema alongside other herbs. There is a signal worth testing properly. There is not enough to treat gymnema as a diabetes therapy, and it must never replace prescribed medication.',
        refs: ['devangan2021'],
      },
      {
        claim: 'Weight loss',
        grade: 'D',
        body: 'Gymnema is often added to fat burners and "carb blocker" products on the strength of the two actions above. There is no good trial evidence that it causes weight loss. A capsule cannot block sweet taste because it is swallowed, and the effect on sugar absorption in people is unproven. At best, a lozenge might help someone skip a dessert.',
      },
    ],
    dosage:
      'Trials of gymnema for blood sugar have used widely varying doses, commonly 200 to 800 mg a day of extract standardised to about 25 per cent gymnemic acids, split across meals, and some older studies used more. For the sweet-taste effect the dose matters less than the format: a lozenge, mint or strong tea held in the mouth for a minute before eating something sweet. The effect lasts about 30 to 60 minutes.',
    dosageGap:
      'The biggest gap is the format. Many products are capsules marketed for "sugar cravings", but a swallowed capsule never touches your taste buds and cannot deliver the one effect gymnema has reliably shown. The second gap is standardisation. A label listing gymnema leaf powder without a gymnemic acid percentage cannot be compared with trials that used standardised extracts. Third, in multi-ingredient fat burners gymnema is often a small part of a proprietary blend at an undisclosed dose.',
    safety:
      'The most important risk is low blood sugar in people who take diabetes medicines. If gymnema lowers glucose even modestly, it adds to the effect of insulin, sulfonylureas and other glucose-lowering drugs, and the combination could cause hypoglycaemia. Anyone with diabetes should discuss it with their prescriber before starting, and monitor glucose closely if they do. There are also published case reports of drug-induced liver injury, including a 60-year-old woman who developed acute hepatitis within one to two weeks of starting a gymnema tea; she recovered after stopping it and receiving treatment. Liver injury appears to be rare, but anyone who develops fatigue, dark urine, pale stools or yellowing skin while taking gymnema should stop and see a doctor. Stomach upset is the commonest minor side effect. It should be stopped before surgery because of the blood sugar effect, and there is not enough safety data for pregnancy or breastfeeding.',
    faqs: [
      {
        question: 'Does gymnema stop sugar cravings?',
        answer:
          'As a lozenge, mint or tea that touches your tongue, it temporarily blocks sweet taste for 30 to 60 minutes. In one controlled experiment that cut sweet intake by 44 per cent in a single session. A swallowed capsule does not touch your taste buds, so it cannot have this effect.',
      },
      {
        question: 'Does gymnema lower blood sugar?',
        answer:
          'Possibly, modestly. A 2021 meta-analysis of 10 small studies reported reductions in glucose and HbA1c, but many comparisons were against starting values rather than placebo, and the studies disagreed hugely. It is not a substitute for diabetes treatment.',
      },
      {
        question: 'Can I take gymnema with metformin or insulin?',
        answer:
          'Only after talking to your prescriber. If gymnema lowers blood sugar, it adds to your medicines, which could cause hypoglycaemia. If you are given the go-ahead, monitor your glucose more closely than usual when you start.',
      },
      {
        question: 'Will gymnema help me lose weight?',
        answer:
          'There is no good evidence that it does. Its reliable effect is blocking sweet taste for up to an hour, which might help you skip a dessert. That is not the same as a weight-loss effect.',
      },
      {
        question: 'Is gymnema safe for the liver?',
        answer:
          'Liver injury appears rare, but there are published cases of drug-induced hepatitis. Stop taking it and see a doctor if you develop tiredness, dark urine, pale stools or yellowing of the skin or eyes.',
      },
      {
        question: 'How long does the sweet-blocking effect last?',
        answer:
          'Usually 30 to 60 minutes. It affects only sweetness; salty, sour, bitter and savoury tastes are unchanged.',
      },
    ],
    references: [
      {
        id: 'stice2017',
        text: 'Stice E, Yokum S, Gau JM (2017). Gymnemic acids lozenge reduces short-term consumption of high-sugar food: a placebo controlled experiment. Journal of Psychopharmacology — 67 adults; 31% fewer took the first offered serving and total candy intake fell 44%.',
        url: 'https://journals.sagepub.com/doi/10.1177/0269881117728541',
      },
      {
        id: 'devangan2021',
        text: 'The effect of Gymnema sylvestre supplementation on glycemic control in type 2 diabetes patients: a systematic review and meta-analysis. Phytotherapy Research, 2021 — 10 studies, 419 participants; reductions versus baseline with heterogeneity of 80 to 99 per cent.',
        url: 'https://onlinelibrary.wiley.com/doi/10.1002/ptr.7265',
      },
      {
        id: 'gymnema-sweet-review',
        text: 'Consuming Gymnema sylvestre reduces the desire for high-sugar sweet foods. Nutrients, 2020 — mint study and summary of the sweet-taste receptor mechanism.',
        url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7230589/',
      },
      {
        id: 'shiyovich2010',
        text: 'Shiyovich A et al. (2010). Toxic hepatitis induced by Gymnema sylvestre, a natural remedy for type 2 diabetes mellitus. American Journal of the Medical Sciences.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/20856101/',
      },
    ],
    editorNote:
      'Gymnema does something few supplements can claim: you can feel it working. Chew a leaf, eat some sugar, and the sweetness is gone. The frustrating part is that the most common products throw that effect away by putting the herb in a capsule that goes straight past the tongue. If you want to try it for sugar cravings, a lozenge or tea before dessert is the format with the evidence. For blood sugar the picture is much less clear, and the interaction with diabetes medicines is the reason to involve your prescriber rather than experiment alone.',
    related: ['capsicum-annuum', 'glucomannan', 'psyllium-husk'],
    history: [
      {
        date: '2026-09-25',
        note: 'First published with per-claim evidence grades. Sweet-taste findings from the 2017 Journal of Psychopharmacology experiment and the 2020 Nutrients mint study; blood sugar findings from the 2021 Phytotherapy Research meta-analysis; liver caution from the 2010 case report.',
      },
    ],
    published: slot('2026-09-25', 4),
    updated: '2026-09-25',
  },
  {
    slug: 'gaba',
    name: 'GABA',
    aliases: [
      'gaba',
      'gamma-aminobutyric acid',
      'gamma aminobutyric acid',
      'γ-aminobutyric acid',
      'pharmagaba',
    ],
    category: 'Amino acid / neurotransmitter',
    grade: 'D',
    quickAnswer:
      'GABA (gamma-aminobutyric acid) is the brain’s main calming chemical messenger, which is why it is sold as a supplement for stress and sleep. The catch is that it is not clear how much swallowed GABA reaches the brain at all. A 2020 systematic review of 14 placebo-controlled trials found limited evidence for stress and very limited evidence for sleep. It appears safe at typical doses, but it is not a supplement equivalent of the calming medicines that act on the GABA system.',
    atAGlance: [
      {
        label: 'Typical dose',
        value: '100–300 mg',
        note: 'Most human trials used amounts in this range, often from fermentation-derived GABA.',
      },
      {
        label: 'Trials reviewed',
        value: '14 studies',
        note: 'A 2020 systematic review of placebo-controlled human trials on stress and sleep.',
      },
      {
        label: 'Verdict on stress',
        value: 'Limited evidence',
        note: 'Some small studies report lower stress markers; others do not.',
      },
      {
        label: 'Verdict on sleep',
        value: 'Very limited',
        note: 'A few small trials, mostly short, some funded by manufacturers.',
      },
      {
        label: 'Reaches the brain?',
        value: 'Disputed',
        note: 'Whether oral GABA crosses the blood–brain barrier in meaningful amounts is unresolved.',
      },
    ],
    whatIsIt:
      'GABA is an amino acid that the brain makes for itself from glutamate. It is the main inhibitory neurotransmitter: it damps down nerve signalling, which is why drugs that increase its effect, such as benzodiazepines, calm and sedate. GABA also occurs naturally in foods such as fermented products, tea, tomatoes and some grains, and some Japanese "GABA tea" and chocolate products are enriched with it. Supplements are either synthetic or produced by bacterial fermentation. PharmaGABA, a fermented form made with Lactobacillus hilgardii, is the ingredient used in many of the trials. A GABA supplement is not the same as a medicine that acts on the GABA system; the two work in completely different ways.',
    mechanism:
      'The obvious theory is that taking GABA tops up the brain’s supply and calms it. The problem is the blood–brain barrier, which controls what passes from the bloodstream into the brain. It has long been thought that GABA crosses it poorly. A 2015 review in Frontiers in Psychology concluded that the studies on this question are contradictory and methodologically varied, so the issue is genuinely unresolved rather than settled either way. The authors also raised another possibility: that any effect comes through the gut’s own nervous system, which uses GABA too and communicates with the brain through the vagus nerve. That is plausible, but it has not been demonstrated in people. In short, there is no established mechanism by which a GABA capsule would reliably calm the brain.',
    claims: [
      {
        claim: 'Reducing stress and anxiety',
        grade: 'D',
        body: 'A 2020 systematic review in Frontiers in Neuroscience examined 14 placebo-controlled human studies of oral GABA and concluded there was limited evidence for stress benefits. Some small trials reported lower stress markers, such as changes in brainwave patterns, heart rate variability or salivary stress hormones, during a laboratory stress task. Others found nothing. Trials were small and short, used different doses and outcome measures, and several were funded by GABA manufacturers. Given the unresolved question of whether GABA reaches the brain, and the mixed results, D is the fair grade. There is no evidence that GABA helps with a diagnosed anxiety disorder, and it should not replace treatment for one.',
        refs: ['hepsomali2020', 'boonstra2015'],
      },
      {
        claim: 'Improving sleep',
        grade: 'D',
        body: 'The same 2020 review found very limited evidence for sleep. A few small trials reported that GABA shortened the time it took to fall asleep or improved self-rated sleep quality, but the studies were small, often short and not always well blinded. GABA is also a common ingredient in multi-ingredient sleep blends, usually at an undisclosed dose alongside melatonin, magnesium and other herbs, so any benefit from those products cannot be credited to GABA.',
        refs: ['hepsomali2020'],
      },
      {
        claim: 'Working like calming medicines that act on GABA',
        grade: 'F',
        body: 'Sometimes implied, never supported. Benzodiazepines and similar drugs do not supply GABA; they make the brain’s existing GABA receptors respond more strongly. A GABA supplement does something entirely different, and may not reach the brain at all. There is no evidence that it produces comparable calming or sedative effects, and anyone taking one of those medicines should not assume a GABA supplement can replace it or help them come off it.',
        refs: ['boonstra2015'],
      },
    ],
    dosage:
      'Most human trials used 100 to 300 mg of GABA, taken once, either before a stress task or about an hour before bed. Some sleep studies used daily dosing for a few weeks. Many trials used fermentation-derived GABA. There is no established optimal dose, and higher doses have not been shown to work better.',
    dosageGap:
      'The dose on a single-ingredient GABA product is usually within the studied range, so the gap is elsewhere. In multi-ingredient sleep and stress blends, GABA is frequently hidden inside a proprietary blend with no stated amount. The larger gap is between what the label implies and what the evidence shows: a product sold as "calming" or "for restful sleep" on the strength of GABA’s role in the brain is borrowing the reputation of a neurotransmitter, not the results of trials of the supplement.',
    safety:
      'GABA appears to be well tolerated at the doses used in trials. Reported side effects are uncommon and mild, and include stomach upset, headache, drowsiness and a tingling sensation. Because some studies suggest it may lower blood pressure slightly, people taking blood pressure medicines should monitor their readings. Take care about combining it with alcohol or sedative medicines, including sleeping tablets, benzodiazepines and some antidepressants and anti-epileptic drugs, until you have checked with a pharmacist, and do not drive if it makes you drowsy. There is not enough safety information for pregnancy, breastfeeding or children. If you are struggling with anxiety or insomnia that affects your daily life, speak to a clinician; both conditions have treatments with far stronger evidence than this.',
    faqs: [
      {
        question: 'Does GABA supplement cross into the brain?',
        answer:
          'It is genuinely unclear. It has long been thought that GABA crosses the blood–brain barrier poorly, but a 2015 review found the studies contradictory and concluded the question is unresolved. Any effect might instead act through the gut’s nervous system, but that has not been shown in people.',
      },
      {
        question: 'Does GABA help with anxiety?',
        answer:
          'There is limited evidence it may reduce some measures of stress in small, short laboratory studies. There is no evidence it treats an anxiety disorder, and it should not replace proper treatment.',
      },
      {
        question: 'Does GABA help you sleep?',
        answer:
          'The evidence is very limited. A few small trials reported slightly faster sleep onset or better self-rated sleep, but a 2020 systematic review judged the overall evidence very limited.',
      },
      {
        question: 'Is GABA the same as Valium or other sedatives?',
        answer:
          'No. Those medicines make the brain’s GABA receptors respond more strongly; they do not supply GABA. A GABA supplement works in a different way, if it works, and there is no evidence of similar effects.',
      },
      {
        question: 'How much GABA should I take?',
        answer:
          'Trials mostly used 100 to 300 mg, taken before a stressful task or about an hour before bed. There is no evidence that higher doses work better.',
      },
      {
        question: 'Is GABA safe?',
        answer:
          'It appears safe at typical doses, with mild and uncommon side effects. Check with a pharmacist before combining it with alcohol, sleeping tablets or other sedating medicines, and monitor your blood pressure if you take medication for it.',
      },
    ],
    references: [
      {
        id: 'hepsomali2020',
        text: 'Hepsomali P, Groeger JA, Nishihira J, Scholey A (2020). Effects of oral gamma-aminobutyric acid (GABA) administration on stress and sleep in humans: a systematic review. Frontiers in Neuroscience 14:923 — 14 placebo-controlled studies; limited evidence for stress, very limited for sleep.',
        url: 'https://www.frontiersin.org/journals/neuroscience/articles/10.3389/fnins.2020.00923/full',
      },
      {
        id: 'boonstra2015',
        text: 'Boonstra E et al. (2015). Neurotransmitters as food supplements: the effects of GABA on brain and behavior. Frontiers in Psychology 6:1520 — evidence on blood–brain barrier passage contradictory; mechanism unclear.',
        url: 'https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2015.01520/full',
      },
    ],
    editorNote:
      'GABA is the clearest case of a supplement sold on the reputation of a molecule rather than the results of a trial. It is a real, important neurotransmitter, and the brain relies on it to calm itself. That is exactly why the label is persuasive, and why it tells you nothing. The questions that matter, whether a swallowed dose reaches the brain and whether it changes how people feel or sleep, have weak or contested answers. Nobody should expect much from it, and it should never stand in for a proper assessment of anxiety or insomnia.',
    related: ['l-theanine', 'maca-root'],
    history: [
      {
        date: '2026-09-26',
        note: 'First published with per-claim evidence grades. Stress and sleep findings from the 2020 Frontiers in Neuroscience systematic review; blood–brain barrier and mechanism discussion from the 2015 Frontiers in Psychology review.',
      },
    ],
    published: slot('2026-09-26', 1),
    updated: '2026-09-26',
  },
];

/**
 * Ingredient pages whose publish time has passed. Anything a reader can see —
 * pages, lists, the sitemap, search, links from reviews — must read this rather
 * than `ingredients`, which also holds scheduled pages.
 */
export function liveIngredients(now: number = Date.now()) {
  return ingredients.filter((i) => isLive(i.published, now));
}

export function getIngredient(slug: string) {
  return liveIngredients().find((i) => i.slug === slug);
}

/** Match a free-text product ingredient name to an ingredient page, if one exists. */
export function findIngredientByName(name: string) {
  const needle = name.toLowerCase().trim();
  return liveIngredients().find(
    (i) =>
      i.aliases.some((a) => needle === a || needle.includes(a)) ||
      needle.includes(i.name.toLowerCase()),
  );
}
