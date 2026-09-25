import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Check, AlertTriangle, X } from 'lucide-react';
import { categories } from '@/lib/sample';
import {
  buildComparison,
  formatAmount,
  formatMoney,
  formatRange,
  formatScore,
  type Comparison,
  type DoseRow,
  type Flag,
} from '@/lib/compare';
import type { Review } from '@/lib/types';
import { AffiliateButton } from './review-page';
import { CompareToggle } from './compare-tray';

/*
 * The comparison report. Rendered on generated /compare/a-vs-b pages and under
 * the prose of editorial comparisons, so both carry the same numbers. Every
 * figure comes from lib/compare.ts; this file only lays them out.
 */

const MARKERS = ['A', 'B', 'C'];

function Marker({ i }: { i: number }) {
  return (
    <span className={`cmp-marker cmp-m${i}`} aria-hidden="true">
      {MARKERS[i]}
    </span>
  );
}

function reviewHref(r: Review) {
  return `/${r.category_slug}/${r.slug}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function ComparisonReport({
  reviews,
  showProducts = true,
}: {
  reviews: Review[];
  /** Editorial pages introduce the products themselves; generated ones need the cards. */
  showProducts?: boolean;
}) {
  const c = buildComparison(reviews);
  return (
    <div className="cmp" style={{ '--cmp-n': reviews.length } as React.CSSProperties}>
      {showProducts && <ProductCards c={c} />}
      <Verdict c={c} />
      <Scores c={c} />
      {c.doses.length > 0 && <Doses c={c} />}
      <Costs c={c} />
      <LabelChecks c={c} />
      <Method />
    </div>
  );
}

function ProductCards({ c }: { c: Comparison }) {
  return (
    <div className="cmp-cards">
      {c.reviews.map((r, i) => {
        const cost = c.costs[i];
        return (
          <article className="cmp-card" key={r.id}>
            <Link className="cmp-card-media" href={reviewHref(r)} tabIndex={-1} aria-hidden="true">
              {r.featured_image_url ? (
                <Image
                  src={r.featured_image_url}
                  alt=""
                  fill
                  sizes="(max-width: 700px) 40vw, 200px"
                />
              ) : (
                <span className="comparison-placeholder">No image</span>
              )}
            </Link>
            <div className="cmp-card-body">
              <span className="cmp-card-cat">
                <Marker i={i} />
                {categories.find((cat) => cat.slug === r.category_slug)?.name}
              </span>
              <h2>
                <Link href={reviewHref(r)}>{c.names[i]}</Link>
              </h2>
              <p className="cmp-card-score">
                {r.score === null ? (
                  <span>Not scored</span>
                ) : (
                  <>
                    <strong>{formatScore(r.score)}</strong>
                    <span>/10</span>
                  </>
                )}
              </p>
              <p className="cmp-card-cost">
                {cost
                  ? `${formatMoney(cost.perServing, cost.currency)} a serving`
                  : 'No dated price on file'}
              </p>
              <Link className="text-link" href={reviewHref(r)}>
                Read the review <ArrowUpRight size={15} />
              </Link>
              <AffiliateButton review={r} />
            </div>
          </article>
        );
      })}
    </div>
  );
}

function Verdict({ c }: { c: Comparison }) {
  return (
    <section className="cmp-section" id="verdict">
      <h2>The short answer</h2>
      <p className="cmp-headline">{c.headline}</p>
      {c.crossCategory && (
        <p className="cmp-note">
          These sit in different categories. They are compared because one review names the other as
          an alternative, so read the dose rows with that in mind.
        </p>
      )}
      <div className="cmp-picks">
        {c.reviews.map((r, i) => {
          const reasons = c.picks[i].reasons;
          return (
            <div className="cmp-pick" key={r.id}>
              <h3>
                <Marker i={i} /> Pick {c.names[i]} if…
              </h3>
              {reasons.length ? (
                <ul>
                  {reasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              ) : (
                <p>
                  {r.score === null
                    ? 'It has not been scored, so there is no criterion on which it leads. The label and cost rows below still apply.'
                    : c.reviews.every((o) => o === r || o.score === null)
                      ? 'Nothing else here has been scored, so there is no head-to-head on the criteria. Its own scores are below.'
                      : 'It does not lead on any criterion we score. Read its review for the case in its favour.'}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Scores({ c }: { c: Comparison }) {
  const anyScored = c.criteria.some((row) => row.scores.some((s) => s !== null));
  return (
    <section className="cmp-section" id="scores">
      <h2>Criterion by criterion</h2>
      <p className="cmp-sub">
        The five criteria every review is scored on, published on{' '}
        <Link href="/evidence-grading">the grading page</Link>. The overall score is their average.
      </p>
      {anyScored ? (
        <div className="cmp-criteria">
          {c.criteria.map((row) => (
            <div className="cmp-criterion" key={row.name}>
              <h3>{row.name}</h3>
              <p className="cmp-what">{row.what}</p>
              {row.scores.map((score, i) => (
                <div className={`cmp-bar-row${row.leaders.includes(i) ? ' is-lead' : ''}`} key={i}>
                  <span className="cmp-bar-label">
                    <Marker i={i} />
                    <span className="cmp-bar-name">{c.names[i]}</span>
                  </span>
                  <span className="cmp-bar" aria-hidden="true">
                    <span
                      className={`cmp-bar-fill cmp-f${i}`}
                      style={{ width: `${(score ?? 0) * 10}%` }}
                    />
                  </span>
                  <span className="cmp-bar-value">
                    {score === null ? 'Not scored' : `${score}/10`}
                    {row.leaders.includes(i) && <span className="cmp-lead">Leads</span>}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p>Neither product has been scored yet.</p>
      )}
    </section>
  );
}

function Doses({ c }: { c: Comparison }) {
  return (
    <section className="cmp-section" id="doses">
      <h2>Dose against the studied amount</h2>
      <p className="cmp-sub">
        What one labelled serving delivers, placed against the range on each ingredient’s evidence
        page. Where a label gives no figure, there is nothing to place, and that is the finding.
      </p>
      <div className="cmp-doses">
        {c.doses.map((row) => (
          <DoseBlock key={row.ingredient.slug} row={row} c={c} />
        ))}
      </div>
    </section>
  );
}

function DoseBlock({ row, c }: { row: DoseRow; c: Comparison }) {
  const range = row.ingredient.studiedDose;
  // A linear track wide enough for the range and every placed amount, so a
  // serving that is a sliver of the studied dose looks like one.
  const PER = { mcg: 1, mg: 1e3, g: 1e6 } as const;
  const toRange = (value: number, unit: keyof typeof PER) =>
    range ? (value * PER[unit]) / PER[range.unit] : 0;
  const placed = row.cells.map((cell) =>
    cell.status === 'present' && cell.amount ? toRange(cell.amount.value, cell.amount.unit) : null,
  );
  const trackMax = range
    ? Math.max(
        range.max * 1.35,
        ...placed.filter((v): v is number => v !== null).map((v) => v * 1.1),
      )
    : 0;
  const pct = (v: number) => `${Math.min(100, (v / trackMax) * 100)}%`;
  return (
    <div className="cmp-dose">
      <div className="cmp-dose-head">
        <h3>
          <Link href={`/ingredients/${row.ingredient.slug}`}>{row.ingredient.name}</Link>
          <span className={`cmp-grade grade-${row.ingredient.grade.toLowerCase()}`}>
            Evidence {row.ingredient.grade}
          </span>
        </h3>
        <p>
          {range
            ? `${range.basis}: ${formatRange(range)}`
            : 'No single studied range in label units, so amounts are shown but not placed.'}
        </p>
      </div>
      {range && placed.some((v) => v !== null) && (
        <div className="cmp-track" role="img" aria-label={trackLabel(row, c)}>
          <span
            className="cmp-track-band"
            style={{ left: pct(range.min), width: `calc(${pct(range.max)} - ${pct(range.min)})` }}
          />
          {placed.map((v, i) =>
            v === null ? null : (
              <span className={`cmp-track-pin cmp-m${i}`} style={{ left: pct(v) }} key={i}>
                {MARKERS[i]}
              </span>
            ),
          )}
          <span className="cmp-track-scale">
            <span>0</span>
            <span>{formatAmount(trackMax, range.unit)}</span>
          </span>
        </div>
      )}
      <ul className="cmp-dose-cells">
        {row.cells.map((cell, i) => (
          <li key={i}>
            <Marker i={i} />
            <span className="cmp-dose-name">{c.names[i]}</span>
            {cell.status === 'absent' ? (
              <span className="cmp-muted">Not in the formula</span>
            ) : (
              <span className="cmp-dose-value">
                {cell.lines.map((l) => l.dose).join('; ')}
                {cell.placement && (
                  <span className={`cmp-place place-${cell.placement}`}>
                    {cell.placement === 'within'
                      ? 'In range'
                      : cell.placement === 'below'
                        ? 'Below range'
                        : 'Above range'}
                  </span>
                )}
                {cell.undisclosed && <span className="cmp-place place-hidden">Undisclosed</span>}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function trackLabel(row: DoseRow, c: Comparison) {
  const range = row.ingredient.studiedDose!;
  const parts = row.cells.flatMap((cell, i) =>
    cell.status === 'present' && cell.amount
      ? [`${c.names[i]} ${formatAmount(cell.amount.value, cell.amount.unit)}`]
      : [],
  );
  return `${row.ingredient.name}: studied ${formatRange(range)}; ${parts.join('; ')}`;
}

function Costs({ c }: { c: Comparison }) {
  const currencies = new Set(c.costs.flatMap((x) => (x ? [x.currency] : [])));
  return (
    <section className="cmp-section" id="cost">
      <h2>What it actually costs</h2>
      <p className="cmp-sub">
        Price divided by labelled servings, from a dated listing. A serving is whatever the label
        calls one, which is why the studied-dose row matters more than the headline figure.
      </p>
      <ul className="cmp-costs">
        {c.reviews.map((r, i) => {
          const cost = c.costs[i];
          return (
            <li key={r.id}>
              <span className="cmp-bar-label">
                <Marker i={i} />
                <span className="cmp-bar-name">{c.names[i]}</span>
              </span>
              {cost ? (
                <span>
                  <strong>{formatMoney(cost.perServing, cost.currency)}</strong> a serving ·{' '}
                  {formatMoney(cost.price, cost.currency)} for {cost.servings} servings at{' '}
                  {cost.source}, checked {formatDate(cost.checkedAt)}
                </span>
              ) : (
                <span className="cmp-muted">
                  {r.product_price && !/check current/i.test(r.product_price)
                    ? `${r.product_price}. No per-serving figure: servings not recorded.`
                    : 'No dated price on file.'}
                </span>
              )}
            </li>
          );
        })}
      </ul>
      {c.studiedCosts.map(({ row, costs }) => (
        <div className="cmp-studied-cost" key={row.ingredient.slug}>
          <h3>Cost to reach a studied dose of {row.ingredient.name}</h3>
          <ul className="cmp-costs">
            {costs.map((sc, i) => (
              <li key={i}>
                <span className="cmp-bar-label">
                  <Marker i={i} />
                  <span className="cmp-bar-name">{c.names[i]}</span>
                </span>
                {sc ? (
                  <span>
                    <strong>{formatMoney(sc.cost, sc.currency)}</strong>
                    {sc.servingsNeeded > 1.01
                      ? ` · takes ${Math.round(sc.servingsNeeded * 10) / 10} servings`
                      : ' · one serving reaches it'}
                  </span>
                ) : (
                  <span className="cmp-muted">Cannot be worked out: amount or price missing</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
      {currencies.size > 1 && (
        <p className="cmp-note">
          These prices are in different currencies from different markets, so they are shown side by
          side but not ranked against each other.
        </p>
      )}
    </section>
  );
}

const FLAG_ICON: Record<Flag['tone'], React.ReactNode> = {
  good: <Check size={15} aria-label="Good" />,
  warn: <AlertTriangle size={15} aria-label="Caution" />,
  bad: <X size={15} aria-label="Problem" />,
};

function LabelChecks({ c }: { c: Comparison }) {
  return (
    <section className="cmp-section" id="label">
      <h2>Label checks</h2>
      <p className="cmp-sub">
        What each label discloses, and what it leaves out. Read from the reviews, not from the
        marketing.
      </p>
      <div className="cmp-flags">
        {c.reviews.map((r, i) => (
          <div className="cmp-flag-col" key={r.id}>
            <h3>
              <Marker i={i} /> {c.names[i]}
            </h3>
            <ul>
              {c.flags[i].map((f) => (
                <li className={`flag-${f.tone}`} key={f.text}>
                  {FLAG_ICON[f.tone]}
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>
            <CompareToggle slug={r.slug} name={c.names[i]} category={r.category_slug} />
          </div>
        ))}
      </div>
    </section>
  );
}

function Method() {
  return (
    <section className="cmp-section cmp-method" id="method">
      <h2>How this comparison is built</h2>
      <ul>
        <li>
          Scores are the ones already published in each review. Nothing is re-scored for the
          comparison, and a product leads a criterion only when it outscores the rest.
        </li>
        <li>
          Doses are read from the label rows in each review and placed against the studied range on
          the matching ingredient page. A figure that is not printed is never estimated.
        </li>
        <li>
          Costs use a dated retailer price divided by labelled servings. Prices in different
          currencies are never ranked against each other.
        </li>
        <li>
          Only products in the same category, or ones a review names as an alternative, can be
          compared. Commission never changes what appears here.
        </li>
      </ul>
    </section>
  );
}
