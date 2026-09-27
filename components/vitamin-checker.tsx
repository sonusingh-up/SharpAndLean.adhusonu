'use client';

import { useId, useState } from 'react';
import { Check } from 'lucide-react';
import {
  situationLabels,
  vitaminAdvice,
  type AgeBand,
  type VitaminSituation,
} from '@/lib/vitamins';
import s from './vitamin-checker.module.css';

const ages: [AgeBand, string][] = [
  ['under-50', 'Under 50'],
  ['50-74', '50 to 74'],
  ['75-plus', '75 or over'],
];

const situations = Object.keys(situationLabels) as VitaminSituation[];

export function VitaminChecker() {
  const id = useId();
  const [age, setAge] = useState<AgeBand>('under-50');
  const [picked, setPicked] = useState<VitaminSituation[]>([]);

  const toggle = (situation: VitaminSituation) =>
    setPicked((current) =>
      current.includes(situation)
        ? current.filter((x) => x !== situation)
        : [...current, situation],
    );

  const advice = vitaminAdvice({ age, situations: picked });

  return (
    <div className={`not-prose ${s.checker}`}>
      <form className={s.inputs} aria-label="Vitamin checker" onSubmit={(e) => e.preventDefault()}>
        <fieldset className={s.field}>
          <legend className={s.label}>Your age</legend>
          <div className={s.chips}>
            {ages.map(([value, label]) => (
              <label className={s.chip} key={value}>
                <input
                  type="radio"
                  name={`${id}-age`}
                  value={value}
                  checked={age === value}
                  onChange={() => setAge(value)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className={s.field}>
          <legend className={s.label}>Tick any that apply</legend>
          <div className={s.options}>
            {situations.map((situation) => (
              <label className={s.option} key={situation}>
                <input
                  type="checkbox"
                  checked={picked.includes(situation)}
                  onChange={() => toggle(situation)}
                />
                <span>
                  <i aria-hidden="true">
                    <Check size={13} strokeWidth={3} />
                  </i>
                  {situationLabels[situation]}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </form>

      <div className={s.result} aria-live="polite">
        <span className={s.resultLabel}>
          {advice.length ? 'Worth taking for you' : 'Your result'}
        </span>
        {advice.length ? (
          <ol className={s.list}>
            {advice.map((a) => (
              <li className={s.item} key={a.id}>
                <div className={s.itemHead}>
                  <strong>{a.name}</strong>
                  <span>{a.when}</span>
                </div>
                <p className={s.amount}>{a.amount}</p>
                <ul className={s.reasons}>
                  {a.reasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        ) : (
          <div className={s.none}>
            <strong>You probably don’t need a daily vitamin.</strong>
            <p>
              A varied diet covers most healthy adults. If you live in the UK, the NHS still suggests
              everyone considers vitamin D from October to March — tick that option to see it.
            </p>
          </div>
        )}
        <p className={s.skip}>
          Usually not worth it: a multivitamin for general health, vitamin C for colds, vitamin E,
          beta-carotene, and high doses of vitamin A or B6.
        </p>
      </div>

      <p className={s.caveat}>
        General guidance for adults, from the NHS, the US Preventive Services Task Force, the NIH and
        the Endocrine Society. It is not a diagnosis: if you take regular medicines or have a health
        condition, check with your pharmacist or doctor before starting a supplement.
      </p>
    </div>
  );
}
