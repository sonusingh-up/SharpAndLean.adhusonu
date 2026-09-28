'use client';

import { useId, useState } from 'react';
import {
  compareListings,
  costPerStandard,
  formatMoney,
  listingCost,
  standardLabel,
  type ActiveUnit,
  type Listing,
} from '@/lib/serving-cost';
import s from './serving-cost-calculator.module.css';

type Draft = { name: string; price: string; servings: string; perServing: string; perDay: string };

// Pre-filled with the article's worked comparison, so the tool opens on a real
// answer rather than an empty form.
const initial: Record<'a' | 'b', Draft> = {
  a: { name: 'ON Gold Standard 100% Plant', price: '28.00', servings: '21', perServing: '24', perDay: '1' },
  b: { name: 'Myprotein Impact Vegan', price: '19.99', servings: '33', perServing: '24', perDay: '1' },
};

const units: { id: ActiveUnit; label: string; hint: string }[] = [
  { id: 'g', label: 'Grams', hint: 'Protein, creatine, fibre' },
  { id: 'mg', label: 'Milligrams', hint: 'Caffeine, magnesium, B6' },
  { id: 'µg', label: 'Micrograms', hint: 'Vitamin D, B12, folic acid' },
  { id: 'kcal', label: 'Calories', hint: 'Weight gainers' },
];

const toListing = (d: Draft): Listing => ({
  price: Number(d.price),
  servings: Number(d.servings),
  perServing: Number(d.perServing),
  perDay: Number(d.perDay),
});

const days = (n: number) => `${Math.floor(n)} day${Math.floor(n) === 1 ? '' : 's'}`;

export function ServingCostCalculator() {
  const id = useId();
  const [unit, setUnit] = useState<ActiveUnit>('g');
  const [drafts, setDrafts] = useState(initial);

  const update = (key: 'a' | 'b', field: keyof Draft, value: string) =>
    setDrafts((d) => ({ ...d, [key]: { ...d[key], [field]: value } }));

  const listings = { a: toListing(drafts.a), b: toListing(drafts.b) };
  const verdict = compareListings(listings.a, listings.b, unit);
  const nameOf = (key: 'a' | 'b') => drafts[key].name.trim() || `Listing ${key.toUpperCase()}`;
  const per = standardLabel(unit);

  return (
    <div className={`not-prose ${s.calc}`}>
      <fieldset className={s.units}>
        <legend className={s.label}>The active ingredient is measured in</legend>
        <div className={s.unitRow}>
          {units.map((u) => (
            <label className={s.unit} key={u.id}>
              <input
                type="radio"
                name={`${id}-unit`}
                value={u.id}
                checked={unit === u.id}
                onChange={() => setUnit(u.id)}
              />
              <span>
                <strong>{u.label}</strong>
                <small>{u.hint}</small>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={s.listings}>
        {(['a', 'b'] as const).map((key) => {
          const d = drafts[key];
          const cost = listingCost(listings[key]);
          const standard = costPerStandard(listings[key], unit);
          const wins = verdict?.cheaper === key;
          return (
            <section className={`${s.listing} ${wins ? s.cheaper : ''}`} key={key} aria-label={nameOf(key)}>
              <input
                className={s.name}
                aria-label={`Name of listing ${key.toUpperCase()}`}
                value={d.name}
                placeholder={`Listing ${key.toUpperCase()}`}
                onChange={(e) => update(key, 'name', e.target.value)}
              />
              <div className={s.grid}>
                <Field id={`${id}-${key}-price`} label="Delivered price (£)" value={d.price} step="0.01" onChange={(v) => update(key, 'price', v)} />
                <Field id={`${id}-${key}-servings`} label="Servings in pack" value={d.servings} onChange={(v) => update(key, 'servings', v)} />
                <Field id={`${id}-${key}-per`} label={`Active per serving (${unit})`} value={d.perServing} onChange={(v) => update(key, 'perServing', v)} />
                <Field id={`${id}-${key}-day`} label="Servings a day" value={d.perDay} onChange={(v) => update(key, 'perDay', v)} />
              </div>
              <output className={s.result} aria-live="polite">
                {cost && standard !== null ? (
                  <>
                    <span className={s.resultLabel}>Per {per}</span>
                    <span className={s.number}>{formatMoney(standard)}</span>
                    <span className={s.detail}>
                      {formatMoney(cost.perServing)} a serving · {formatMoney(cost.perDay)} a day · lasts{' '}
                      {days(cost.days)}
                    </span>
                  </>
                ) : (
                  <span className={s.invalid}>Fill in all four numbers to see the cost.</span>
                )}
              </output>
            </section>
          );
        })}
      </div>

      <p className={s.verdict} aria-live="polite">
        {verdict
          ? verdict.cheaper === 'same'
            ? `The two cost the same per ${per}, to within 1 per cent. Decide on formula, testing and taste instead.`
            : `${nameOf(verdict.cheaper)} is cheaper per ${per}. ${nameOf(verdict.cheaper === 'a' ? 'b' : 'a')} costs ${verdict.percentMore} per cent more for the same amount of the active ingredient.`
          : 'Enter both listings to compare them.'}
      </p>
      <p className={s.caveat}>
        No servings figure on the pack? Divide the pack weight by the serving size. Compare the same form of
        the ingredient on both sides — and remember a lower price says nothing about whether it works.
      </p>
    </div>
  );
}

function Field(props: { id: string; label: string; value: string; step?: string; onChange: (v: string) => void }) {
  return (
    <div className={s.field}>
      <label className={s.fieldLabel} htmlFor={props.id}>
        {props.label}
      </label>
      <input
        id={props.id}
        className={s.input}
        type="number"
        inputMode="decimal"
        min="0"
        step={props.step ?? 'any'}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
}
