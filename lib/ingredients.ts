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
    related: ['green-tea-extract', 'vitamin-d3'],
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
