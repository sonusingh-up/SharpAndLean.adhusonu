'use client';

import { useId, useState } from 'react';
import {
  WEIGHT_LIMITS_KG,
  fromKg,
  proteinTarget,
  toKg,
  type AgeGroup,
  type ProteinGoal,
  type WeightUnit,
} from '@/lib/protein';
import s from './protein-calculator.module.css';

const goals: { id: ProteinGoal; label: string; hint: string }[] = [
  { id: 'health', label: 'Eat well', hint: 'Not training yet' },
  { id: 'muscle', label: 'Build muscle', hint: 'Lifting 2–4 times a week' },
  { id: 'fat-loss', label: 'Lose fat', hint: 'Eating less, keeping muscle' },
];

/** Why the range is what it is, in one sentence per goal. */
const basis: Record<ProteinGoal, string> = {
  health:
    'From the 0.8 g/kg minimum that prevents deficiency to the 1.2–1.6 g/kg range in the 2025–2030 US Dietary Guidelines.',
  muscle:
    'Muscle gains from strength training stopped rising, on average, at about 1.6 g/kg; the range runs to 2.2 g/kg to cover individual variation.',
  'fat-loss':
    'Weight-loss trials used 1.2–1.6 g/kg; people lifting while eating less may benefit from up to 2.2 g/kg.',
};

const format = (n: number) =>
  n.toLocaleString('en-GB', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function ProteinCalculator() {
  const id = useId();
  const [weight, setWeight] = useState('70');
  const [unit, setUnit] = useState<WeightUnit>('kg');
  const [goal, setGoal] = useState<ProteinGoal>('muscle');
  const [age, setAge] = useState<AgeGroup>('under-65');
  const [meals, setMeals] = useState(4);

  const result = proteinTarget({ weight: Number(weight), unit, goal, age, meals });

  // Switching units converts the figure already entered rather than
  // reinterpreting 70 kg as 70 lb.
  const changeUnit = (next: WeightUnit) => {
    if (next === unit) return;
    const value = Number(weight);
    if (weight && Number.isFinite(value)) {
      setWeight(String(Math.round(fromKg(toKg(value, unit), next))));
    }
    setUnit(next);
  };

  const min = Math.round(fromKg(WEIGHT_LIMITS_KG.min, unit));
  const max = Math.round(fromKg(WEIGHT_LIMITS_KG.max, unit));

  return (
    <div className={`not-prose ${s.calc}`}>
      <form className={s.inputs} aria-label="Protein calculator" onSubmit={(e) => e.preventDefault()}>
        <div className={s.field}>
          <label className={s.label} htmlFor={`${id}-weight`}>
            Your weight
          </label>
          <div className={s.weightRow}>
            <input
              id={`${id}-weight`}
              className={s.weight}
              type="number"
              inputMode="decimal"
              min={min}
              max={max}
              step="any"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              aria-describedby={`${id}-weight-hint`}
            />
            <div className={s.segment} role="radiogroup" aria-label="Weight unit">
              {(['kg', 'lb'] as const).map((u) => (
                <label className={s.segmentOption} key={u}>
                  <input
                    type="radio"
                    name={`${id}-unit`}
                    value={u}
                    checked={unit === u}
                    onChange={() => changeUnit(u)}
                  />
                  <span>{u}</span>
                </label>
              ))}
            </div>
          </div>
          <p className={s.hint} id={`${id}-weight-hint`}>
            A lot of weight to lose? Enter a realistic goal weight instead — protein needs follow
            muscle, not fat.
          </p>
        </div>

        <fieldset className={s.field}>
          <legend className={s.label}>Your goal</legend>
          <div className={s.goals}>
            {goals.map((g) => (
              <label className={s.goal} key={g.id}>
                <input
                  type="radio"
                  name={`${id}-goal`}
                  value={g.id}
                  checked={goal === g.id}
                  onChange={() => setGoal(g.id)}
                />
                <span>
                  <strong>{g.label}</strong>
                  <small>{g.hint}</small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className={s.pair}>
          <fieldset className={s.field}>
            <legend className={s.label}>Age</legend>
            <div className={s.chips}>
              {(
                [
                  ['under-65', 'Under 65'],
                  ['65-plus', '65 or over'],
                ] as const
              ).map(([value, label]) => (
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
            <legend className={s.label}>Meals a day</legend>
            <div className={s.chips}>
              {[3, 4, 5].map((n) => (
                <label className={s.chip} key={n}>
                  <input
                    type="radio"
                    name={`${id}-meals`}
                    value={n}
                    checked={meals === n}
                    onChange={() => setMeals(n)}
                  />
                  <span>{n}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </form>

      <output className={s.result} htmlFor={`${id}-weight`} aria-live="polite">
        {result ? (
          <>
            <span className={s.resultLabel}>Your daily target</span>
            <span className={s.number}>
              {result.target}
              <small> g a day</small>
            </span>
            <span className={s.range}>
              Range {result.low}–{result.high} g · {format(result.rates.low)}–
              {format(result.rates.high)} g per kg
            </span>
            <span className={s.meal}>
              About <strong>{result.perMeal} g</strong> at each of {meals} meals
            </span>
            <span className={s.basis}>{basis[goal]}</span>
          </>
        ) : (
          <span className={s.invalid}>
            Enter a weight between {min} and {max} {unit} to see your target.
          </span>
        )}
      </output>

      <p className={s.caveat}>
        For healthy adults. Not for anyone with kidney disease, who is pregnant or breastfeeding,
        or under 18 — ask your doctor or a dietitian for a personal figure.
      </p>
    </div>
  );
}
