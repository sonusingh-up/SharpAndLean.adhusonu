import type { FAQ } from './types';

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
    related: ['glucomannan', 'vitamin-d3'],
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
    related: ['l-theanine', 'vitamin-d3'],
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
    related: ['glucomannan', 'l-theanine'],
    updated: '2026-09-21',
  },
];

export function getIngredient(slug: string) {
  return ingredients.find((i) => i.slug === slug);
}

/** Match a free-text product ingredient name to an ingredient page, if one exists. */
export function findIngredientByName(name: string) {
  const needle = name.toLowerCase().trim();
  return ingredients.find(
    (i) =>
      i.aliases.some((a) => needle === a || needle.includes(a)) ||
      needle.includes(i.name.toLowerCase()),
  );
}
