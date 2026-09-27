/**
 * Rules behind the vitamin checker on /learn/which-vitamins-should-you-take-daily.
 *
 * Only advice a public-health body actually gives is encoded here — NHS,
 * USPSTF, the NIH Office of Dietary Supplements, the Endocrine Society — and
 * each rule names the source the article cites. The checker recommends nothing
 * those sources do not.
 */

export type AgeBand = 'under-50' | '50-74' | '75-plus';

export type VitaminSituation =
  | 'pregnancy'
  | 'uk-winter'
  | 'little-sun'
  | 'vegan'
  | 'b12-medicine'
  | 'absorption';

export type VitaminInput = { age: AgeBand; situations: VitaminSituation[] };

export type VitaminAdvice = {
  id: 'folic-acid' | 'vitamin-d' | 'vitamin-b12' | 'specialist';
  name: string;
  amount: string;
  when: string;
  reasons: string[];
};

export const situationLabels: Record<VitaminSituation, string> = {
  pregnancy: 'I could become pregnant, am trying, or am pregnant',
  'uk-winter': 'I live in the UK, or somewhere with long, dark winters',
  'little-sun': 'I’m rarely outdoors, cover most of my skin, or have dark skin',
  vegan: 'I eat a vegan diet, or very few animal foods',
  'b12-medicine': 'I take metformin, or a stomach-acid medicine like omeprazole, long term',
  absorption: 'I’ve had weight-loss surgery, or have coeliac or Crohn’s disease',
};

export function vitaminAdvice({ age, situations }: VitaminInput): VitaminAdvice[] {
  const has = (s: VitaminSituation) => situations.includes(s);
  const advice: VitaminAdvice[] = [];

  // USPSTF 2023 (A recommendation) and NHS: 400 mcg, started before pregnancy.
  if (has('pregnancy')) {
    advice.push({
      id: 'folic-acid',
      name: 'Folic acid',
      amount: '400 micrograms a day',
      when: 'From before you stop contraception until 12 weeks of pregnancy',
      reasons: [
        'Lowers the risk of neural tube defects such as spina bifida — the strongest evidence for any everyday supplement.',
        'In pregnancy, avoid supplements containing vitamin A (retinol) and fish liver oils.',
      ],
    });
  }

  // NHS: everyone in autumn and winter; year-round with little sun or dark
  // skin. Endocrine Society 2024: supplementation in pregnancy and over 75.
  const yearRound = has('little-sun') || age === '75-plus';
  if (yearRound || has('uk-winter') || has('pregnancy')) {
    const reasons: string[] = [];
    if (has('little-sun')) {
      reasons.push('Little sun on your skin, or darker skin, means making less vitamin D all year.');
    }
    if (age === '75-plus') {
      reasons.push('Over 75, the Endocrine Society suggests a daily vitamin D supplement.');
    }
    if (has('uk-winter') && !yearRound) {
      reasons.push('From October to March the sun is too weak in the UK to make enough vitamin D.');
    }
    if (has('pregnancy')) {
      reasons.push('Recommended in pregnancy and while breastfeeding.');
    }
    advice.push({
      id: 'vitamin-d',
      name: 'Vitamin D',
      amount:
        age === '75-plus'
          ? '10 to 20 micrograms (400 to 800 IU) a day'
          : '10 micrograms (400 IU) a day',
      when: yearRound ? 'All year round' : 'October to March',
      reasons: [...reasons, 'More is not better: stay under 100 micrograms (4,000 IU) a day.'],
    });
  }

  // NIH ODS: over-50s should get B12 mainly from fortified foods or
  // supplements; vegans have no natural source; metformin and acid
  // suppressants lower absorption.
  const over50 = age !== 'under-50';
  if (has('vegan') || over50 || has('b12-medicine')) {
    const reasons: string[] = [];
    if (has('vegan')) reasons.push('Vitamin B12 is found naturally only in animal foods.');
    if (over50) {
      reasons.push('After 50 many people absorb less B12 from food, but still absorb it from supplements and fortified foods.');
    }
    if (has('b12-medicine')) {
      reasons.push('Metformin and stomach-acid medicines can lower B12 levels — ask your doctor whether to test yours.');
    }
    const supplement = has('vegan') || over50;
    advice.push({
      id: 'vitamin-b12',
      name: 'Vitamin B12',
      amount: supplement ? 'A daily supplement or B12-fortified foods' : 'Ask about a B12 blood test',
      when: supplement ? 'Every day' : 'At your next review',
      reasons,
    });
  }

  if (has('absorption')) {
    advice.push({
      id: 'specialist',
      name: 'A plan from your specialist',
      amount: 'As prescribed',
      when: 'Ongoing',
      reasons: [
        'Surgery and gut conditions can cause several deficiencies at once, so general advice does not apply — follow the supplement plan your specialist or dietitian gives you.',
      ],
    });
  }

  return advice;
}
