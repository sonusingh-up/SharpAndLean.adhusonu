import Link from 'next/link';
import { ashwagandha } from '@/lib/ingredient-pages/ashwagandha';
import { EvidenceBadge } from './evidence';
import s from './ashwagandha-guide.module.css';

/*
 * Visual blocks for "Ashwagandha: Why you need to take?". The grades come
 * from the ingredient page, so the article cannot drift from it; only the
 * one-line summaries live here. A summary whose claim is missing from the
 * ingredient page throws at render, rather than show a card with no grade.
 */

const verdicts: { claim: string; short: string; stat: string }[] = [
  {
    claim: 'For stress and anxiety',
    short: 'Lower stress and anxiety scores than placebo across 12 trials.',
    stat: '1,002 adults',
  },
  {
    claim: 'For sleep',
    short: 'A small improvement, larger with insomnia and 600 mg a day.',
    stat: '400 people',
  },
  {
    claim: 'For strength and recovery, alongside training',
    short: 'Promising in small trials of people who were training.',
    stat: '5 strength trials',
  },
  {
    claim: 'For testosterone and male fertility',
    short: 'Modest rises in testosterone; men did not feel more energetic.',
    stat: '+14.7% in 8 weeks',
  },
  {
    claim: 'For memory and thinking',
    short: 'A few small, short trials. Plausible, not established.',
    stat: 'Few trials',
  },
  {
    claim: 'For weight loss',
    short: 'No good evidence of meaningful weight loss.',
    stat: 'One small trial',
  },
];

export function AshwagandhaEvidence() {
  const cards = verdicts.map((v) => {
    const match = ashwagandha.claims.find((c) => c.claim === v.claim);
    if (!match) throw new Error(`Ashwagandha claim "${v.claim}" is not on the ingredient page.`);
    return { ...v, grade: match.grade };
  });

  return (
    <div className={`${s.panel} not-prose`}>
      <div className={s.head}>
        <span className={s.eyebrow}>Evidence scorecard</span>
        <h3 className={s.title}>What ashwagandha can and cannot do</h3>
        <p className={s.lede}>
          Each claim graded separately, A to F.{' '}
          <Link href="/evidence-grading">How grades work</Link>
        </p>
      </div>
      <ul className={s.grid}>
        {cards.map((c) => (
          <li className={`${s.card} ${s[`g${c.grade}`]}`} key={c.claim}>
            <EvidenceBadge grade={c.grade} size="sm" linked={false} />
            <strong className={s.claim}>{c.claim.replace(/^For /, '')}</strong>
            <span className={s.short}>{c.short}</span>
            <span className={s.stat}>{c.stat}</span>
          </li>
        ))}
      </ul>
      <p className={s.foot}>
        Full evidence, dose and references on the{' '}
        <Link href={`/ingredients/${ashwagandha.slug}`}>ashwagandha ingredient page</Link>.
      </p>
    </div>
  );
}

const worthTrying = [
  'You feel stressed most days and want to try something alongside sleep, exercise and talking therapies',
  'You sleep lightly and are happy to give it eight weeks',
  'You are a healthy adult on no regular medicines',
  'You will choose a named, standardised root extract',
];

const askFirst = [
  'You are pregnant, trying to conceive or breastfeeding',
  'You have liver disease or have had liver problems',
  'You have a thyroid condition or take thyroid medicine',
  'You take sedatives, sleeping tablets, or diabetes or blood-pressure medicine',
  'You have an autoimmune condition or take immune-suppressing drugs',
  'You have hormone-sensitive prostate cancer, or surgery within two weeks',
];

export function AshwagandhaFit() {
  return (
    <div className={`${s.fit} not-prose`}>
      <section className={`${s.fitCol} ${s.fitYes}`} aria-labelledby="ash-fit-yes">
        <span className={s.fitIcon} aria-hidden="true">
          ✓
        </span>
        <h3 id="ash-fit-yes" className={s.fitTitle}>
          Might be worth a try if…
        </h3>
        <ul className={s.fitList}>
          {worthTrying.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>
      <section className={`${s.fitCol} ${s.fitNo}`} aria-labelledby="ash-fit-no">
        <span className={s.fitIcon} aria-hidden="true">
          !
        </span>
        <h3 id="ash-fit-no" className={s.fitTitle}>
          Skip it, or ask a doctor first, if…
        </h3>
        <ul className={s.fitList}>
          {askFirst.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

const steps = [
  {
    when: 'Before you start',
    what: 'Pick a named root extract (such as KSM-66) at 300–600 mg a day. Check it is not already in another product you take.',
  },
  {
    when: 'Weeks 1–2',
    what: 'Watch for loose stools, nausea or daytime drowsiness. Taking it in the evening, with food, helps some people.',
  },
  {
    when: 'Weeks 3–6',
    what: 'Any effect on stress or sleep builds slowly. Note how you sleep and feel, so you are not guessing later.',
  },
  {
    when: 'Week 8',
    what: 'Decide. The trials measured their results here. No change by now? It is unlikely to come — stop.',
  },
  {
    when: 'By month 3',
    what: 'Take a break. Safety data run to about three months, so do not let it become open-ended.',
  },
];

export function AshwagandhaPlan() {
  return (
    <ol className={`${s.plan} not-prose`} aria-label="An eight-week trial of ashwagandha">
      {steps.map((step, i) => (
        <li className={s.step} key={step.when}>
          <span className={s.stepNum} aria-hidden="true">
            {i + 1}
          </span>
          <div>
            <strong className={s.stepWhen}>{step.when}</strong>
            <p className={s.stepWhat}>{step.what}</p>
          </div>
        </li>
      ))}
      <li className={s.warn}>
        <strong>Stop at once and see a doctor</strong> if you notice yellow skin or eyes, dark
        urine, pale stools, itching or pain under your right ribs — possible signs of liver injury.
      </li>
    </ol>
  );
}

/* ---------- "What happens if you take it daily" blocks ---------- */

type Phase = {
  when: string;
  tone: 'early' | 'mid' | 'peak' | 'caution' | 'stop';
  headline: string;
  points: string[];
};

const phases: Phase[] = [
  {
    when: 'Days 1–7',
    tone: 'early',
    headline: 'Mostly side effects, if anything',
    points: [
      'Some people feel drowsy or a little calmer in the evening.',
      'Nausea, loose stools or an upset stomach are the usual complaints — nausea affected about 1 in 20 in one safety study.',
      'Stress and sleep benefits have not had time to show.',
    ],
  },
  {
    when: 'Weeks 2–4',
    tone: 'mid',
    headline: 'Early changes start',
    points: [
      'Any calming effect is still building — trials judged their results at week 8, not before.',
      'Thyroid hormones can already be shifting: T4 was up 9.3% at week 4 in one trial.',
      'Stomach side effects usually settle by now.',
    ],
  },
  {
    when: 'Week 8',
    tone: 'peak',
    headline: 'Where the trials measured results',
    points: [
      'Stress scores down 44% and cortisol down 27.9% in one 60-day trial.',
      'Sleep a little better — most clearly with insomnia, at 600 mg a day.',
      'No change by now? It is unlikely to come.',
    ],
  },
  {
    when: 'Month 3',
    tone: 'caution',
    headline: 'The edge of the safety data',
    points: [
      'The NIH says it appears well tolerated for up to about three months.',
      'Most liver-injury cases began 2 to 12 weeks after starting — inside this window.',
      'A sensible point to stop, or to review with your doctor.',
    ],
  },
  {
    when: 'Beyond 3 months',
    tone: 'stop',
    headline: 'Unknown territory',
    points: [
      'There are no good long-term trials of daily use.',
      'Effects on the thyroid, hormones and liver over years have not been studied.',
      'If you carry on, ask your doctor about liver and thyroid blood tests.',
    ],
  },
];

export function AshwagandhaDailyTimeline() {
  return (
    <div className={`${s.panel} not-prose`}>
      <div className={s.head}>
        <span className={s.eyebrow}>Taking it every day</span>
        <h3 className={s.title}>What happens, week by week</h3>
        <p className={s.lede}>
          Based on trials of 250–600 mg of root extract a day. Individual responses vary.
        </p>
      </div>
      <ol className={s.phases}>
        {phases.map((p) => (
          <li className={`${s.phase} ${s[`tone_${p.tone}`]}`} key={p.when}>
            <div className={s.phaseRail} aria-hidden="true">
              <span className={s.phaseDot} />
            </div>
            <div className={s.phaseBody}>
              <span className={s.phaseWhen}>{p.when}</span>
              <strong className={s.phaseHeadline}>{p.headline}</strong>
              <ul className={s.phasePoints}>
                {p.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

type BodyChange = {
  area: string;
  direction: 'down' | 'up' | 'mixed';
  figure: string;
  detail: string;
  kind: 'benefit' | 'watch' | 'risk';
};

const bodyChanges: BodyChange[] = [
  {
    area: 'Cortisol',
    direction: 'down',
    figure: '−27.9%',
    detail: 'Serum cortisol after 60 days, against −7.9% on placebo.',
    kind: 'benefit',
  },
  {
    area: 'Stress & anxiety',
    direction: 'down',
    figure: '12 trials',
    detail: 'Lower scores than placebo in 1,002 adults. Certainty low.',
    kind: 'benefit',
  },
  {
    area: 'Sleep',
    direction: 'up',
    figure: 'Small gain',
    detail: 'Five trials, 400 people. Clearer with insomnia and after 8 weeks.',
    kind: 'benefit',
  },
  {
    area: 'Thyroid hormones',
    direction: 'up',
    figure: 'T4 +19.6%',
    detail: 'At 8 weeks in people with an underactive thyroid. A risk if yours is overactive.',
    kind: 'watch',
  },
  {
    area: 'Testosterone',
    direction: 'up',
    figure: '+14.7%',
    detail: 'In men aged 40–70 after 8 weeks. They did not feel more energetic.',
    kind: 'watch',
  },
  {
    area: 'Blood sugar',
    direction: 'down',
    figure: '−3 mg/dL',
    detail: 'A slight fall in fasting glucose, very low certainty. Matters with diabetes medicines.',
    kind: 'watch',
  },
  {
    area: 'Liver',
    direction: 'mixed',
    figure: 'Rare injury',
    detail: 'Normal liver tests in trials, but case reports of jaundice 2–12 weeks in.',
    kind: 'risk',
  },
];

const arrows = { down: '↓', up: '↑', mixed: '!' };
const kindLabel = { benefit: 'Possible benefit', watch: 'Worth watching', risk: 'Rare risk' };

export function AshwagandhaBodyChanges() {
  return (
    <div className={`${s.panel} not-prose`}>
      <div className={s.head}>
        <span className={s.eyebrow}>Inside your body</span>
        <h3 className={s.title}>What daily ashwagandha changes</h3>
        <p className={s.lede}>
          The effects measured in trials — the ones you might want, and the ones to keep an eye on.
        </p>
      </div>
      <ul className={s.bodyGrid}>
        {bodyChanges.map((b) => (
          <li className={`${s.bodyCard} ${s[`kind_${b.kind}`]}`} key={b.area}>
            <div className={s.bodyTop}>
              <span className={s.bodyArrow} aria-hidden="true">
                {arrows[b.direction]}
              </span>
              <span className={s.bodyKind}>{kindLabel[b.kind]}</span>
            </div>
            <strong className={s.bodyArea}>{b.area}</strong>
            <span className={s.bodyFigure}>{b.figure}</span>
            <span className={s.short}>{b.detail}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- "Which brand" guide: label checklist ---------- */

const checks = [
  {
    title: 'A named extract or a withanolide %',
    text: 'KSM-66, Sensoril or Shoden — or a stated percentage. “Ashwagandha 500 mg” alone may be plain powder.',
  },
  {
    title: '250–600 mg a day of extract',
    text: 'The range the trials used. Work it out from the serving size, not the number on the front.',
  },
  {
    title: 'Root, unless you choose otherwise',
    text: 'Most trials used root extract. Root-and-leaf extracts differ chemically and are dosed lower.',
  },
  {
    title: 'Nothing hidden',
    text: 'Avoid proprietary blends that hide the ashwagandha amount, and check for added melatonin, caffeine or vitamin D.',
  },
  {
    title: 'Safety warnings on the label',
    text: 'Good labels warn against use in pregnancy and flag thyroid and liver conditions. It is a sign the maker takes this seriously.',
  },
  {
    title: 'Cost per day, not per bottle',
    text: 'A cheap bottle of gummies can cost four times more a day than capsules once you take the full dose.',
  },
];

export function AshwagandhaBuyChecklist() {
  return (
    <ol className={`${s.checklist} not-prose`} aria-label="What to check before you buy">
      {checks.map((c, i) => (
        <li className={s.check} key={c.title}>
          <span className={s.checkNum} aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
          <div>
            <strong className={s.checkTitle}>{c.title}</strong>
            <p className={s.checkText}>{c.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
