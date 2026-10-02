import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, FileText, Trophy } from 'lucide-react';
import {
  rankedProteins,
  percentOfClaim,
  proteinPerGram,
  metalLimits,
  reportUrl,
  type MetalReading,
  type ProteinLabResult,
} from '@/lib/protein-lab-tests';
import { HandsOnBlock } from './hands-on-note';
import s from './protein-lab.module.css';

/*
 * The lab-results blocks for the protein guide. Both read from
 * lib/protein-lab-tests.ts and its ranking, so the order, the winners and
 * every figure on the page come from one place.
 */

const metalNames = { arsenic: 'As', cadmium: 'Cd', mercury: 'Hg', lead: 'Pb' } as const;

function metalState(m: MetalReading) {
  if (m === 'undetected') return { cls: s.mNone, text: 'Not detected' };
  if (m === 'below-loq') return { cls: s.mTrace, text: 'Trace, below quantifiable level' };
  return { cls: s.mFound, text: `${m} µg per serving` };
}

function Metals({ r }: { r: ProteinLabResult }) {
  return (
    <ul className={s.metals}>
      {(Object.keys(metalNames) as (keyof typeof metalNames)[]).map((k) => {
        const st = metalState(r.metals[k]);
        return (
          <li
            key={k}
            className={`${s.metal} ${st.cls}`}
            title={`${k[0].toUpperCase()}${k.slice(1)}: ${st.text} (limit ${metalLimits[k]} µg/day)`}
          >
            <span aria-hidden="true">{metalNames[k]}</span>
            <span className={s.srOnly}>
              {k}: {st.text}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function ProteinLabResults() {
  const ranked = rankedProteins();
  return (
    <div className={`${s.panel} not-prose`}>
      <div className={s.head}>
        <span className={s.kicker}>Labdoor lab results · tested Nov–Dec 2024</span>
        <h3 className={s.title}>All nine, ranked on the lab data</h3>
        <p className={s.lede}>
          Protein found against the label, how much of each scoop is protein, and heavy metals per
          serving. Every product passed; the ranking separates the clean passes from the rest.
        </p>
        <ul className={s.legend} aria-label="Heavy metal key">
          <li>
            <span className={`${s.dot} ${s.mNone}`} /> Not detected
          </li>
          <li>
            <span className={`${s.dot} ${s.mTrace}`} /> Trace below quantifiable level
          </li>
          <li>
            <span className={`${s.dot} ${s.mFound}`} /> Measured
          </li>
        </ul>
      </div>

      <ol className={s.rows}>
        {ranked.map((r, i) => {
          const pct = percentOfClaim(r);
          const winner = i < 2;
          return (
            <li className={`${s.row} ${winner ? s.winner : ''}`} key={r.id}>
              <span className={s.rank}>
                {winner ? <Trophy size={15} aria-label={`Top ${i + 1}`} /> : i + 1}
              </span>
              <div className={s.product}>
                <span className={s.brand}>{r.brand}</span>
                <strong>{r.product}</strong>
                <span className={s.chips}>
                  <span className={s.chip}>{r.type}</span>
                  <span className={s.chipMuted}>{r.serving}</span>
                </span>
                <a
                  className={s.reportChip}
                  href={reportUrl(r)}
                  target="_blank"
                  rel="noopener"
                  aria-label={`Full lab report for ${r.brand} ${r.product} (PDF)`}
                >
                  <FileText size={13} aria-hidden="true" /> Full report
                </a>
              </div>
              <div className={`${s.cell} ${s.cellClaim}`}>
                <span className={s.cellLabel}>Protein vs label</span>
                <span className={s.figure}>
                  {r.found} g <span>of {r.claimed} g</span>
                </span>
                <span className={s.meter} aria-hidden="true">
                  <span
                    className={`${s.meterFill} ${pct < 100 ? s.meterShort : ''}`}
                    style={{ width: `${Math.min(pct, 110) / 1.1}%` }}
                  />
                  <span className={s.meterMark} />
                </span>
                <span className={`${s.pct} ${pct < 100 ? s.pctShort : ''}`}>
                  {pct.toFixed(1)}% of claim
                </span>
              </div>
              <div className={`${s.cell} ${s.cellWeight}`}>
                <span className={s.cellLabel}>Protein share</span>
                <span className={s.figure}>{proteinPerGram(r).toFixed(0)}%</span>
                <span className={s.sub}>of the scoop</span>
              </div>
              <div className={`${s.cell} ${s.cellMetals}`}>
                <span className={s.cellLabel}>Heavy metals</span>
                <Metals r={r} />
              </div>
            </li>
          );
        })}
      </ol>
      <p className={s.foot}>
        Source: Labdoor Certificates of Analysis, samples tested by Anresco Laboratories and
        released 10–13 December 2024. Limits are USP daily limits: arsenic 15, cadmium 5, mercury
        15, lead 5 µg. All nine passed microbiology and showed under 0.01% free amino acids — no
        sign of amino-acid spiking. Results apply to the lots tested.
      </p>
    </div>
  );
}

/** The seven that did not win: the lab read on each, and the tester's notes when written. */
export function ProteinOthers() {
  const others = rankedProteins().slice(2);
  return (
    <ol className={`${s.others} not-prose`}>
      {others.map((r, i) => (
        <li className={s.other} key={r.id} id={`tested-${r.id}`}>
          <div className={s.otherHead}>
            <span className={s.otherShot}>
              {r.image ? (
                <Image
                  src={r.image}
                  alt={`${r.brand} ${r.product}`}
                  fill
                  sizes="80px"
                  className={s.otherImg}
                />
              ) : (
                <span className={s.otherBlank} aria-hidden="true">
                  {r.brand
                    .split(/\s+/)
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 2)}
                </span>
              )}
              <span className={s.otherRank}>{i + 3}</span>
            </span>
            <div>
              <span className={s.brand}>{r.brand}</span>
              <h3 className={s.otherName}>{r.product}</h3>
            </div>
            <Metals r={r} />
          </div>
          <dl className={s.otherStats}>
            <div>
              <dt>Found</dt>
              <dd>
                {r.found} g of {r.claimed} g
              </dd>
            </div>
            <div>
              <dt>Of claim</dt>
              <dd>{percentOfClaim(r).toFixed(1)}%</dd>
            </div>
            <div>
              <dt>Protein share</dt>
              <dd>{proteinPerGram(r).toFixed(0)}% protein</dd>
            </div>
            <div>
              <dt>Lot</dt>
              <dd>
                {r.lot} · exp. {r.expires}
              </dd>
            </div>
          </dl>
          <p className={s.read}>{r.read}</p>
          <HandsOnBlock note={r.handsOn} />
          <div className={s.otherActions}>
            <a className={s.reportButton} href={reportUrl(r)} target="_blank" rel="noopener">
              <FileText size={15} aria-hidden="true" /> View the full lab report
              <span>PDF · lot {r.lot}</span>
            </a>
            {r.review && (
              <Link className={s.reviewLink} href={r.review.href}>
                {r.review.label} <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
