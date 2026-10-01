import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { ArrowDown, ArrowUpRight, Check, FileText, Minus, Trophy } from 'lucide-react';
import type { Collection, ShortlistPick } from '@/lib/types';
import { authorProfile, getAuthorBySlug, teamProfile } from '@/lib/author';
import { linkRel } from '@/lib/link-rel';
import { RichText } from './rich-text';
import { ReferenceBox, PageHistory } from './article-footer';
import { HandsOnBlock } from './hands-on-note';
import b from './best-guide.module.css';

/*
 * The layout for a /best/ guide with a `shortlist`. It is built for the
 * question the reader arrived with — "which one should I buy?" — so it answers
 * that first and justifies it after: the top pick, an award per product, a
 * side-by-side table, then a card per pick and the buying guide.
 *
 * Nothing here shows a score. A pick links to its review once one exists and
 * says plainly that none does until then, and a link is called an affiliate
 * link only when it is one.
 */

type TocItem = { id: string; title: string };

const fitClass = { good: b.fitGood, mixed: b.fitMixed, poor: b.fitPoor };

function relFor(pick: ShortlistPick) {
  return pick.affiliate ? 'sponsored nofollow noopener noreferrer' : linkRel(pick.url);
}

function linkNote(pick: ShortlistPick) {
  return pick.affiliate
    ? 'Affiliate link: we may earn a commission at no extra cost to you.'
    : `Plain link to ${pick.retailer}. We earn nothing from it.`;
}

function FitBadge({ pick }: { pick: ShortlistPick }) {
  if (!pick.fit) return null;
  return <span className={`${b.fit} ${fitClass[pick.fit.tone]}`}>{pick.fit.label}</span>;
}

/** Product shot, or a lettered tile when the maker gives us no usable image. */
function Shot({ pick, sizes }: { pick: ShortlistPick; sizes: string }) {
  return pick.image ? (
    <Image src={pick.image} alt={pick.name} fill sizes={sizes} className={b.shotImg} />
  ) : (
    <span className={b.shotBlank} aria-hidden="true">
      {pick.brand
        .split(/\s+/)
        .map((w) => w[0])
        .join('')
        .slice(0, 2)}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function BestGuide({
  row,
  toc,
  tools,
  others,
}: {
  row: Collection;
  toc: TocItem[];
  tools: Record<string, ReactNode>;
  others: Collection[];
}) {
  const picks = row.shortlist ?? [];
  const top = picks[0];
  const columns = top.specs.map((s) => s.label);
  const writers = row.authors ?? [
    { name: teamProfile.name, slug: teamProfile.slug, type: 'Organization' as const },
  ];
  const facts = row.heroFacts ?? [
    { value: String(picks.length), label: 'products compared' },
    { value: 'Labels', label: 'read on makers’ own sites' },
    { value: 'No', label: 'paid placements' },
  ];
  // Everyone the page credits, each with a face: the writers, the person whose
  // first-hand use it rests on, and the clinician only once she has reviewed it.
  // A team byline has no photo, so it wears the site mark.
  const tester = row.testedBy ? getAuthorBySlug(row.testedBy) : undefined;
  const people = [
    ...writers.map((w) => {
      const profile = getAuthorBySlug(w.slug);
      return {
        role: 'Written by',
        slug: w.slug,
        name: profile?.name ?? w.name,
        photo: profile?.photo_url,
      };
    }),
    ...(tester
      ? [{ role: 'Tested by', slug: tester.slug, name: tester.name, photo: tester.photo_url }]
      : []),
    ...(row.evidenceReviewed !== false
      ? [
          {
            role: 'Evidence reviewed by',
            slug: authorProfile.slug,
            name: authorProfile.name,
            photo: authorProfile.photo_url,
          },
        ]
      : []),
  ];

  const tocLinks = (
    <>
      <a href="#compare">How they compare</a>
      <span className={b.tocGroup}>The picks</span>
      {picks.map((p) => (
        <a href={`#pick-${p.id}`} key={p.id}>
          {p.award}
        </a>
      ))}
      {toc.length > 0 && <span className={b.tocGroup}>Buying guide</span>}
      {toc.map((t) => (
        <a key={t.id} href={`#${t.id}`}>
          {t.title}
        </a>
      ))}
      {row.faqs?.length ? <a href="#faqs">Your questions</a> : null}
    </>
  );
  const tocCount = 1 + picks.length + toc.length + (row.faqs?.length ? 1 : 0);

  return (
    <div className={b.guide}>
      {/* ---------- Hero: the answer first ---------- */}
      <header className={b.hero}>
        <div className={b.heroText}>
          <span className={b.kicker}>
            <Trophy size={14} aria-hidden="true" /> Best-of guide ·{' '}
            {new Date(row.updated_at).getFullYear()}
          </span>
          <h1 className={b.title}>{row.title}</h1>
          <p className={b.summary}>{row.summary}</p>
          <ul className={b.facts}>
            {facts.map((f) => (
              <li key={f.label}>
                <strong>{f.value}</strong>
                <span>{f.label}</span>
              </li>
            ))}
          </ul>
          <div className={b.byline}>
            {people.map((p) => (
              <div className={b.person} key={`${p.role}-${p.slug}`}>
                <Image
                  className={b.avatar}
                  src={p.photo ?? '/images/logo.png'}
                  alt=""
                  width={38}
                  height={38}
                />
                <span>
                  <span className={b.role}>{p.role}</span>
                  <Link href={`/author/${p.slug}`}>{p.name}</Link>
                </span>
              </div>
            ))}
            <div className={b.person}>
              <span>
                <span className={b.role}>
                  {row.evidenceReviewed === false ? 'Updated · clinical review pending' : 'Updated'}
                </span>
                <span className={b.date}>{formatDate(row.updated_at)}</span>
              </span>
            </div>
          </div>
        </div>

        <aside className={b.topPick} aria-label="Our top pick">
          <span className={b.ribbon}>
            <Trophy size={14} aria-hidden="true" /> Our top pick
          </span>
          <div className={b.topMedia}>
            <Shot pick={top} sizes="(max-width: 900px) 50vw, 240px" />
          </div>
          <span className={b.topBrand}>{top.brand}</span>
          <h2 className={b.topName}>{top.name}</h2>
          <p className={b.topFor}>{top.bestFor}</p>
          <dl className={b.topStats}>
            {top.specs.slice(0, 4).map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
          <a className={b.buy} href={top.url} target="_blank" rel={relFor(top)}>
            Check price at {top.retailer} <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <a className={b.why} href={`#pick-${top.id}`}>
            Why it wins <ArrowDown size={14} aria-hidden="true" />
          </a>
          <p className={b.linkNote}>{linkNote(top)}</p>
        </aside>
      </header>

      {/* ---------- One award per product ---------- */}
      <nav
        className={`${b.awards} ${picks.length <= 3 ? b.awardsFew : ''}`}
        style={{ '--award-cols': picks.length } as CSSProperties}
        aria-label="Our picks at a glance"
      >
        <div className={b.awardsHead}>
          <span className={b.kicker}>Our picks at a glance</span>
          <span className={b.swipeHint} aria-hidden="true">
            Swipe to see all {picks.length} →
          </span>
        </div>
        <ol className={b.awardGrid}>
          {picks.map((p, i) => (
            <li key={p.id}>
              <a className={`${b.awardTile} ${i === 0 ? b.awardTop : ''}`} href={`#pick-${p.id}`}>
                <span className={b.awardRank}>{String(i + 1).padStart(2, '0')}</span>
                <span className={b.awardThumb}>
                  <Shot pick={p} sizes="72px" />
                </span>
                <span className={b.awardLabel}>{p.award}</span>
                <strong className={b.awardName}>{p.name}</strong>
                <span className={b.awardHeadline}>{p.headline}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* ---------- The quick verdict ---------- */}
      {row.takeaways?.length ? (
        <section className={b.verdict} aria-labelledby="quick-verdict">
          <div className={b.verdictHead}>
            <span className={b.kicker}>The quick verdict</span>
            <h2 id="quick-verdict">If you read nothing else</h2>
          </div>
          <ol className={b.verdictList}>
            {row.takeaways.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ol>
        </section>
      ) : null}

      {/* ---------- Side by side ---------- */}
      <section className={b.compare} id="compare" aria-labelledby="compare-title">
        <div className={b.sectionHead}>
          <span className={b.kicker}>Side by side</span>
          <h2 id="compare-title">How they compare</h2>
          <p>
            {row.productsIntro?.text ??
              'The figures that matter for each pick, taken from the manufacturer’s label.'}
          </p>
        </div>
        <div
          className={b.tableWrap}
          role="region"
          aria-label="Comparison table (scroll sideways if needed)"
          tabIndex={0}
        >
          <table className={b.table}>
            <thead>
              <tr>
                <th scope="col">Product</th>
                {columns.map((c) => (
                  <th scope="col" key={c}>
                    {c}
                  </th>
                ))}
                <th scope="col">Vs. evidence</th>
              </tr>
            </thead>
            <tbody>
              {picks.map((p, i) => (
                <tr key={p.id} className={i === 0 ? b.rowTop : undefined}>
                  <th scope="row">
                    <a className={b.tableProduct} href={`#pick-${p.id}`}>
                      <span className={b.tableRank} aria-hidden="true">
                        {i + 1}
                      </span>
                      <span className={b.tableThumb}>
                        <Shot pick={p} sizes="48px" />
                      </span>
                      <span>
                        <span className={b.tableAward}>{p.award}</span>
                        <span className={b.tableName}>{p.name}</span>
                      </span>
                    </a>
                  </th>
                  {p.specs.map((s) => (
                    <td key={s.label} data-label={s.label}>
                      <strong>{s.value}</strong>
                      {s.note && <span>{s.note}</span>}
                    </td>
                  ))}
                  <td data-label="Vs. evidence" className={b.fitCell}>
                    <FitBadge pick={p} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------- Detail, with a contents rail ---------- */}
      <div className={`review-layout ${b.layout}`}>
        <aside className={`review-sidebar ${b.sidebar}`}>
          <nav className={b.toc} aria-label="Table of contents">
            <h4>On this page</h4>
            {tocLinks}
          </nav>
        </aside>

        <div className={b.main}>
          {/* Below 800px the rail would land mid-page as a long list, so the
              same links fold into one menu at the top of the detail. */}
          <details className={b.mobileToc}>
            <summary>
              On this page <span>{tocCount} sections</span>
            </summary>
            <nav aria-label="Table of contents">{tocLinks}</nav>
          </details>
          <section id="picks" aria-labelledby="picks-title">
            <div className={b.sectionHead}>
              <span className={b.kicker}>{row.productsIntro?.label ?? 'The picks in detail'}</span>
              <h2 id="picks-title">{row.productsIntro?.heading ?? 'Why each one made the list'}</h2>
            </div>

            {picks.map((p, i) => (
              <article className={b.pick} id={`pick-${p.id}`} key={p.id}>
                <header className={b.pickHead}>
                  <span className={b.pickRank} aria-hidden="true">
                    {i + 1}
                  </span>
                  <div className={b.pickTitle}>
                    <span className={b.pickAward}>{p.award}</span>
                    <h3>{p.name}</h3>
                    <span className={b.pickBrand}>{p.brand}</span>
                  </div>
                  <FitBadge pick={p} />
                </header>

                <div className={b.pickGrid}>
                  <div className={b.pickMedia}>
                    <Shot pick={p} sizes="(max-width: 700px) 60vw, 200px" />
                  </div>
                  <div className={b.pickInfo}>
                    <p className={b.bestFor}>
                      <span>Best for</span>
                      {p.bestFor}
                    </p>
                    <p className={b.pickVerdict}>{p.verdict}</p>
                  </div>
                </div>

                <HandsOnBlock note={p.handsOn} />

                <dl className={b.specGrid}>
                  {p.specs.map((s) => (
                    <div key={s.label}>
                      <dt>{s.label}</dt>
                      <dd>
                        {s.value}
                        {s.note && <span>{s.note}</span>}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className={b.prosCons}>
                  <div className={b.pros}>
                    <h4>What we like</h4>
                    <ul>
                      {p.pros.map((x) => (
                        <li key={x}>
                          <Check size={15} aria-hidden="true" />
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={b.cons}>
                    <h4>Watch out for</h4>
                    <ul>
                      {p.cons.map((x) => (
                        <li key={x}>
                          <Minus size={15} aria-hidden="true" />
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <footer className={b.pickFoot}>
                  {p.reviewSlug ? (
                    <Link className="text-link" href={`/${p.reviewSlug}`}>
                      Read the full review <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>
                  ) : (
                    <p className={b.unscored}>
                      Not yet reviewed or scored on this site.
                    </p>
                  )}
                  <div className={b.pickActions}>
                    {p.report && (
                      <a className={b.reportLink} href={p.report.url} target="_blank" rel="noopener">
                        <span className={b.actionIcon} aria-hidden="true">
                          <FileText size={16} />
                        </span>
                        <span className={b.actionText}>
                          <strong>View lab report</strong>
                          <span>{p.report.label} · PDF</span>
                        </span>
                      </a>
                    )}
                    <a className={b.buyButton} href={p.url} target="_blank" rel={relFor(p)}>
                      <span className={b.actionText}>
                        <strong>Check price</strong>
                        <span>at {p.retailer}</span>
                      </span>
                      <span className={b.actionIcon} aria-hidden="true">
                        <ArrowUpRight size={17} />
                      </span>
                    </a>
                  </div>
                  <p className={b.linkNote}>{linkNote(p)}</p>
                </footer>
              </article>
            ))}
          </section>

          <section className={b.guideBody} aria-label="Buying guide">
            <span className={b.kicker}>The buying guide</span>
            <RichText html={row.body} tools={tools} />
          </section>

          {row.faqs && row.faqs.length > 0 && (
            <section className={`reading-section ${b.faqs}`} id="faqs">
              <h2>Your questions</h2>
              <div className="faq-list">
                {row.faqs.map((f) => (
                  <details key={f.question}>
                    <summary>{f.question}</summary>
                    <p>{f.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
          {row.references?.length ? <ReferenceBox references={row.references} /> : null}
          {row.history?.length ? <PageHistory entries={row.history} /> : null}
        </div>
      </div>

      {others.length > 0 && (
        <section className={b.others} aria-labelledby="more-guides">
          <h2 id="more-guides">More best-of guides</h2>
          <div className={b.otherGrid}>
            {others.map((c) => (
              <Link className={b.otherCard} href={`/best/${c.slug}`} key={c.id}>
                <strong>{c.title}</strong>
                <span>{c.summary}</span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
