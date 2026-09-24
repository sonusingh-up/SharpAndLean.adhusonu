import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check } from 'lucide-react';
import { SiteShell } from '@/components/site';
import { Newsletter } from '@/components/newsletter';
import { FaqSchema, pageMeta } from '@/components/seo';
import { getReviews } from '@/lib/data';
import { ingredients } from '@/lib/ingredients';
import { authorProfile, teamProfile } from '@/lib/author';
import type { Review } from '@/lib/types';
import s from './home.module.css';

/*
 * Homepage: warm cream and deep pine, a light sans with one italic serif word
 * per heading, bento cards, and every figure derived from the same data as the
 * review and ingredient pages, so nothing here can drift from what they say.
 */

export const revalidate = 3600;
// The root segment does not inherit the title template from its own layout, so
// the homepage has to carry the brand itself or it ships a title with no brand
// and no category term in it.
export const metadata = pageMeta(
  'Evidence-Graded Supplement Research & Review | SharpAndLean',
  'Ingredient-level supplement research, evidence graded A-F by a clinical nutritionist. Fat burners, nootropics, wellness. Independently funded, never sponsored.',
  '/',
);

const CATEGORY: Record<string, string> = {
  'fat-burners': 'Fat burners',
  nootropics: 'Nootropics',
  wellness: 'Wellness',
};

const path = (r: Review) => `/${r.category_slug}/${r.slug}`;
const tone = (score: number) => (score >= 7 ? s.good : score >= 5 ? s.fair : s.poor);
const dated = (iso: string | null) =>
  iso
    ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(new Date(iso))
    : '';

/* Small original glyphs for the topic chips: capsules, tablets and label marks. */
type Glyph = 'capsule' | 'tablet' | 'drop' | 'leaf' | 'scale' | 'label' | 'half' | 'spark';
function Glyph({ kind }: { kind: Glyph }) {
  const common = { width: 34, height: 26, viewBox: '0 0 34 26', 'aria-hidden': true } as const;
  switch (kind) {
    case 'capsule':
      return (
        <svg {...common}>
          <rect x="4" y="8" width="26" height="11" rx="5.5" fill="var(--cream-deep)" stroke="var(--pine)" />
          <path d="M17 8h7.5a5.5 5.5 0 0 1 0 11H17z" fill="var(--terracotta)" />
        </svg>
      );
    case 'tablet':
      return (
        <svg {...common}>
          <circle cx="13" cy="13" r="8" fill="var(--ochre)" />
          <circle cx="22" cy="13" r="8" fill="none" stroke="var(--pine)" />
        </svg>
      );
    case 'drop':
      return (
        <svg {...common}>
          <path d="M17 3c5 7 8 10.5 8 14a8 8 0 0 1-16 0c0-3.5 3-7 8-14z" fill="var(--pine)" />
          <circle cx="14" cy="17" r="2.2" fill="var(--cream)" />
        </svg>
      );
    case 'leaf':
      return (
        <svg {...common}>
          <path d="M6 20C8 8 18 4 28 5c-1 10-8 17-22 15z" fill="var(--sage)" />
          <path d="M6 20 22 10" stroke="var(--pine)" />
        </svg>
      );
    case 'scale':
      return (
        <svg {...common}>
          <path d="M5 19h24L17 5z" fill="var(--terracotta)" />
          <rect x="11" y="19" width="12" height="3" fill="var(--pine)" />
        </svg>
      );
    case 'label':
      return (
        <svg {...common}>
          <rect x="8" y="3" width="18" height="20" rx="2" fill="var(--cream)" stroke="var(--pine)" />
          <path d="M11 9h12M11 13h9M11 17h11" stroke="var(--pine)" />
          <circle cx="26" cy="5" r="4" fill="var(--terracotta)" />
        </svg>
      );
    case 'half':
      return (
        <svg {...common}>
          <circle cx="17" cy="13" r="9" fill="none" stroke="var(--pine)" />
          <path d="M17 4a9 9 0 0 1 0 18z" fill="var(--ochre)" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M17 3l2.6 7.4L27 13l-7.4 2.6L17 23l-2.6-7.4L7 13l7.4-2.6z" fill="var(--terracotta)" />
        </svg>
      );
  }
}

/**
 * A scalloped outline — a circle with evenly spaced rounded bumps — as an SVG
 * data URI, used as a CSS mask so the shape scales with its box.
 */
function scallopMask(bumps: number, depth: number) {
  const size = 200;
  const c = size / 2;
  const outer = c;
  const inner = c * (1 - depth);
  const step = (Math.PI * 2) / bumps;
  const pt = (r: number, a: number) =>
    `${(c + r * Math.cos(a)).toFixed(2)} ${(c + r * Math.sin(a)).toFixed(2)}`;
  let d = `M${pt(inner, 0)}`;
  for (let i = 0; i < bumps; i++) {
    const a0 = i * step;
    d += ` Q${pt(outer * 1.04, a0 + step / 2)} ${pt(inner, a0 + step)}`;
  }
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${size} ${size}'><path d='${d} Z'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
const PHOTO_MASK = scallopMask(12, 0.1);
const BADGE_MASK = scallopMask(9, 0.16);

/** The site's four-square mark, for the team, which has no photograph. */
function TeamMark({ className }: { className: string }) {
  return (
    <span className={className} aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

const TOPICS: { label: string; href: string; glyph: Glyph }[] = [
  { label: 'Fat burners', href: '/fat-burners', glyph: 'scale' },
  { label: 'Nootropics', href: '/nootropics', glyph: 'spark' },
  { label: 'Wellness', href: '/wellness', glyph: 'leaf' },
  { label: 'GLP-1 supplements', href: '/learn/glp-1', glyph: 'half' },
  { label: 'Protein', href: '/ingredients/whey-protein-blend', glyph: 'tablet' },
  { label: 'Probiotics', href: '/ingredients/akkermansia-muciniphila', glyph: 'capsule' },
  { label: 'Fibre', href: '/ingredients/psyllium-husk', glyph: 'leaf' },
  { label: 'Omega-3', href: '/ingredients/omega-3', glyph: 'drop' },
  { label: 'Vitamin D', href: '/ingredients/vitamin-d3', glyph: 'half' },
  { label: 'Stimulants', href: '/ingredients/green-tea-extract', glyph: 'spark' },
  { label: 'Sleep and calm', href: '/ingredients/gaba', glyph: 'tablet' },
  { label: 'Sweeteners', href: '/ingredients/rebaudioside-a', glyph: 'drop' },
  { label: 'Capsules and fillers', href: '/ingredients/capsule-excipients', glyph: 'capsule' },
  { label: 'Head-to-head comparisons', href: '/compare', glyph: 'label' },
];

const CHECKS = [
  [
    'Serving size',
    'How many capsules make one serving, and how many servings are in the tub. A bottle of 120 at four a serving is thirty days, not a hundred and twenty.',
  ],
  [
    'Disclosed amounts',
    'Every active ingredient should show its own amount. A “proprietary blend” total tells you the order, and nothing else.',
  ],
  [
    'Total stimulants',
    'Add up caffeine from every source on the panel — guarana, green tea extract, plain caffeine — then add your coffee.',
  ],
  [
    'Testing claims',
    'A real result names the laboratory, the batch and the date. “Made in an FDA-registered facility” is not a test.',
  ],
];

const LABEL_VS_US = [
  ['“Clinically proven”', 'Which trial, what dose it used, and whether this bottle contains that dose'],
  ['“Proprietary blend, 1,250 mg”', 'Whether each ingredient’s amount is disclosed at all'],
  ['“Supports GLP-1”', 'Whether anyone measured GLP-1 in people taking it'],
  ['“Lab tested”', 'Which laboratory, which batch, and on what date'],
  ['“Best seller”', 'The price per serving against a generic with the same dose'],
];

export default async function Home() {
  const all = await getReviews();
  const scored = all
    .filter((r): r is Review & { score: number } => r.score !== null)
    .sort((a, b) => b.score - a.score);
  const top = scored.slice(0, 3);
  const lowest = scored[scored.length - 1];
  const latest = [...all]
    .sort((a, b) => Date.parse(b.published_at ?? '') - Date.parse(a.published_at ?? ''))
    .slice(0, 4);
  const sources =
    all.reduce((n, r) => n + (r.references?.length ?? 0), 0) +
    ingredients.reduce((n, i) => n + i.references.length, 0);

  return (
    <SiteShell>
      <FaqSchema
        faqs={[
          {
            question: 'How do you read a Supplement Facts panel?',
            answer:
              'Check four things: the serving size and how many servings the container holds, whether every active ingredient shows its own amount, the total stimulant content added across all sources, and whether any testing claim names a laboratory, a batch and a date.',
          },
          {
            question: 'What is a proprietary blend?',
            answer:
              'A proprietary blend lists several ingredients under one combined total instead of giving each its own amount. You learn the order the ingredients appear in and nothing else, which makes it impossible to check any single dose against the research.',
          },
          {
            question: 'Does the FDA approve dietary supplements?',
            answer:
              'No. Dietary supplements are regulated under the Dietary Supplement Health and Education Act of 1994 and are not approved by the FDA for safety or effectiveness before they go on sale. Manufacturers are responsible for their own safety and labelling, and the FDA acts after the fact.',
          },
          {
            question: 'Does “made in an FDA-registered facility” mean a supplement is FDA approved?',
            answer:
              'No. It means a facility submitted a registration. It is not FDA approval of the product, the formula or any claim made for it.',
          },
        ]}
      />
      <div className={s.page}>
        {/* ── Hero bento ───────────────────────────────────────── */}
        <section className={s.hero}>
          <div className={s.heroMain}>
            <p className={s.eyebrow}>Independent supplement research</p>
            <h1 className={s.display}>
              Know your supplements.
              <br />
              Start with <em>the label.</em>
            </h1>
            <p className={s.lede}>
              Every product scored against the same five criteria, every ingredient graded A–F,
              every claim checked against the research — and every paid link marked.
            </p>
            <div className={s.heroActions}>
              <a href="#top-rated" className={s.btn}>
                Explore reviews
              </a>
              <Link href="/evidence-grading" className={s.btnGhost}>
                How we score
              </Link>
            </div>
            <div className={s.people}>
              <span className={s.avatars}>
                <Image src="/images/sumita.jpg" alt="" width={52} height={52} />
                <TeamMark className={s.teamAvatar} />
              </span>
              <p>
                Evidence reviewed by {authorProfile.name}, {authorProfile.title.toLowerCase()}. Labels,
                prices and sources checked by the {teamProfile.name}.
              </p>
            </div>
            <p className={s.sourcesLabel}>Sources we cite</p>
            <p className={s.sources}>
              <span>NIH</span>
              <span>FDA</span>
              <span>EFSA</span>
              <span>WHO</span>
              <span>PubMed</span>
            </p>
          </div>

          <div className={s.heroPhoto}>
            <Image
              src="/images/hero-supplements.webp"
              alt="Beige supplement capsules spilling from a white bottle beside green sprigs"
              fill
              priority
              sizes="(max-width: 960px) 100vw, 42vw"
            />
            <Link href="/evidence-grading" className={s.pill}>
              <span className={s.pillIcon}>
                <ArrowRight size={16} />
              </span>
              How we score
            </Link>
          </div>

          <div className={s.heroStats}>
            <Image src="/images/card-best.webp" alt="" fill sizes="(max-width: 960px) 100vw, 42vw" />
            <ul>
              <li>{scored.length} products scored against five published criteria</li>
              <li>{ingredients.length} ingredients graded A–F, claim by claim</li>
              <li>Ranked by score — never by commission</li>
            </ul>
          </div>
        </section>

        {/* ── Gradient band ────────────────────────────────────── */}
        <section className={s.band}>
          <div className={s.bandGrid}>
            <article className={s.quoteCard}>
              <p className={s.quoteMark}>“</p>
              <p className={s.quote}>
                An ingredient with good evidence at 400 mg tells you nothing about a capsule
                containing 40 mg.
              </p>
              <p className={s.attrib}>The SharpAndLean standard</p>
            </article>
            <article className={s.statCard}>
              <p className={s.statFigure}>
                {lowest ? lowest.score.toFixed(1) : '—'}
                <small>/10</small>
              </p>
              <p>
                Our lowest score so far{lowest ? `, for ${lowest.title}` : ''}. We publish the low
                ones too.
              </p>
            </article>
            <article className={s.statCard}>
              <p className={s.statFigure}>{sources}</p>
              <p>sources cited across our reviews and ingredient pages, each one linked</p>
            </article>
            <article className={s.quoteCard}>
              <p className={s.eyebrow}>Why we publish low scores</p>
              <p className={s.quote}>
                A review site that only publishes good scores is an advertisement.
              </p>
              <p className={s.attrib}>The SharpAndLean standard</p>
            </article>
          </div>
        </section>

        {/* ── Topics ───────────────────────────────────────────── */}
        <section className={s.section}>
          <header className={`${s.head} ${s.headCenter}`}>
            <p className={s.eyebrow}>What we cover</p>
            <h2 className={s.h2}>
              Every shelf, <em>one method</em>
            </h2>
            <p>
              Fat burners, focus formulas or a daily vitamin — the questions do not change: what is
              in it, how much, and does the research use that amount.
            </p>
          </header>
          <ul className={s.chips}>
            {TOPICS.map((t) => (
              <li key={t.label}>
                <Link href={t.href} className={s.chip}>
                  <Glyph kind={t.glyph} />
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className={s.center}>
            <Link href="/ingredients" className={s.btn}>
              See every ingredient
            </Link>
          </p>
        </section>

        {/* ── Top rated ────────────────────────────────────────── */}
        <section className={`${s.section} ${s.cream}`} id="top-rated">
          <header className={s.head}>
            <p className={s.eyebrow}>What scores best</p>
            <h2 className={s.h2}>
              The best we’ve <em>reviewed</em>
            </h2>
            <p>
              Ranked by their score against the five criteria, never by what pays. Label overviews
              carry no score, so they do not appear here.
            </p>
          </header>
          <div className={s.cards3}>
            {top.map((r) => (
              <Link key={r.id} href={path(r)} className={`${s.card} ${tone(r.score)}`}>
                <span className={s.cardImg}>
                  {r.featured_image_url ? (
                    <Image src={r.featured_image_url} alt="" fill sizes="(max-width: 960px) 90vw, 30vw" />
                  ) : null}
                </span>
                <span className={s.cardBody}>
                  <span className={s.cardKicker}>{CATEGORY[r.category_slug]}</span>
                  <strong className={s.cardTitle}>{r.title}</strong>
                  <span className={s.cardText}>{r.verdict}</span>
                  <span className={s.cardFoot}>
                    <span className={s.score}>
                      {r.score.toFixed(1)}
                      <small>/10</small>
                    </span>
                    <span className={s.pillBtn}>
                      <span className={s.pillIcon}>
                        <ArrowRight size={15} />
                      </span>
                      Read the review
                    </span>
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── How we read a label ──────────────────────────────── */}
        <section className={`${s.section} ${s.dark}`} id="method">
          <header className={`${s.head} ${s.headCenter}`}>
            <p className={s.eyebrow}>How to read a Supplement Facts panel</p>
            <h2 className={s.h2}>
              Four checks, <em>before</em> you buy
            </h2>
          </header>
          <ol className={s.steps}>
            {CHECKS.map(([title, text], i) => (
              <li key={title}>
                <span className={s.stepNum}>
                  <em>{String(i + 1).padStart(2, '0')}</em>
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
          <p className={s.center}>
            <Link href="/evidence-grading" className={s.btnLight}>
              How we grade
            </Link>
          </p>
        </section>

        {/* ── The label says / we check ────────────────────────── */}
        <section className={s.section}>
          <header className={`${s.head} ${s.headCenter}`}>
            <p className={s.eyebrow}>The SharpAndLean difference</p>
            <h2 className={s.h2}>
              A different kind of <em>review</em>
            </h2>
          </header>
          <div className={s.table} role="table" aria-label="What labels claim, and what we check">
            <div className={s.tableHead} role="row">
              <span role="columnheader">The front of the bottle says</span>
              <span role="columnheader">What we check</span>
            </div>
            {LABEL_VS_US.map(([claim, check]) => (
              <div key={claim} className={s.tableRow} role="row">
                <span role="cell" className={s.claim}>
                  {claim}
                </span>
                <span role="cell" className={s.check}>
                  <span className={s.tick}>
                    <Check size={13} strokeWidth={3} />
                  </span>
                  {check}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Latest ───────────────────────────────────────────── */}
        <section className={`${s.section} ${s.cream}`}>
          <header className={s.head}>
            <p className={s.eyebrow}>Under the microscope</p>
            <h2 className={s.h2}>
              Just <em>reviewed</em>
            </h2>
          </header>
          <div className={s.cards4}>
            {latest.map((r) => (
              <Link
                key={r.id}
                href={path(r)}
                className={`${s.mini} ${r.score !== null ? tone(r.score) : ''}`}
              >
                <span className={s.miniImg}>
                  {r.featured_image_url ? (
                    <Image src={r.featured_image_url} alt="" fill sizes="(max-width: 640px) 90vw, 22vw" />
                  ) : null}
                </span>
                <span className={s.cardKicker}>
                  {CATEGORY[r.category_slug]} · {dated(r.published_at)}
                </span>
                <strong>{r.title}</strong>
                <span className={s.miniScore}>
                  {r.score !== null ? `${r.score.toFixed(1)} / 10` : 'Label overview'}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Where to start ───────────────────────────────────── */}
        <section className={s.section}>
          <header className={`${s.head} ${s.headCenter}`}>
            <p className={s.eyebrow}>Where to start</p>
            <h2 className={s.h2}>
              Three ways <em>in</em>
            </h2>
          </header>
          <div className={s.cards3}>
            {[
              {
                kicker: 'Start with',
                title: 'Product reviews',
                text: 'Scored out of ten against dose, evidence, label, value and safety.',
                href: '#top-rated',
                cta: 'Browse the scores',
                img: '/images/hero-supplements.webp',
                accent: s.accentPine,
              },
              {
                kicker: 'Start with',
                title: 'Ingredients',
                text: `${ingredients.length} ingredients, each claim graded A to F against the published research.`,
                href: '/ingredients',
                cta: 'Open the library',
                img: '/images/card-fat.webp',
                accent: s.accentOchre,
              },
              {
                kicker: 'Start with',
                title: 'Explainers',
                text: 'GLP-1 drugs against GLP-1 supplements, to scale, and guides to reading a label.',
                href: '/learn/glp-1',
                cta: 'Read the GLP-1 guide',
                img: '/images/glp-1-weight-loss-scale.svg',
                accent: s.accentTerra,
              },
            ].map((c) => (
              <Link key={c.title} href={c.href} className={`${s.door} ${c.accent}`}>
                <span className={s.doorImg}>
                  <Image src={c.img} alt="" fill sizes="(max-width: 960px) 90vw, 30vw" />
                </span>
                <span className={s.cardKicker}>{c.kicker}</span>
                <strong className={s.doorTitle}>{c.title}</strong>
                <span className={s.cardText}>{c.text}</span>
                <span className={s.doorBtn}>
                  <span className={s.pillIcon}>
                    <ArrowRight size={15} />
                  </span>
                  {c.cta}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── People ───────────────────────────────────────────── */}
        <section className={`${s.section} ${s.dark}`}>
          <div className={s.personRow}>
            <div>
              <p className={s.eyebrow}>Our evidence reviewer</p>
              <h2 className={s.h2}>
                {authorProfile.name}, <em>{authorProfile.title.toLowerCase()}</em>
              </h2>
              <p className={s.personText}>{authorProfile.role}</p>
              <p className={s.personText}>{authorProfile.credentials.join(' · ')}</p>
              <Link href={`/author/${authorProfile.slug}`} className={s.btnLight}>
                Meet {authorProfile.name.split(' ')[0]}
              </Link>
            </div>
            <div className={s.scallopWrap}>
              <div className={s.scallop} style={{ ['--mask' as string]: PHOTO_MASK }}>
                <Image src="/images/sumita.jpg" alt={authorProfile.name} fill sizes="320px" />
              </div>
              <span className={s.badge} style={{ ['--mask' as string]: BADGE_MASK }}>
                Evidence
                <br />
                reviewer
              </span>
            </div>
          </div>
          <div className={`${s.personRow} ${s.personFlip}`}>
            <div className={s.archWrap}>
              <div className={s.arch}>
                <Image src="/images/trust-panel.webp" alt="" fill sizes="320px" />
                <span className={s.archMark}>
                  <TeamMark className={s.teamMarkLarge} />
                  <span>SNL Team</span>
                </span>
              </div>
            </div>
            <div>
              <p className={s.eyebrow}>Our editorial desk</p>
              <h2 className={s.h2}>
                The {teamProfile.name}, <em>behind every label</em>
              </h2>
              <p className={s.personText}>{teamProfile.role}</p>
              <ul className={s.teamList}>
                {teamProfile.credentials.map((c) => (
                  <li key={c}>
                    <span className={s.tick}>
                      <Check size={12} strokeWidth={3} />
                    </span>
                    {c}
                  </li>
                ))}
              </ul>
              <Link href={`/author/${teamProfile.slug}`} className={s.btnLight}>
                Meet the team
              </Link>
            </div>
          </div>
        </section>

        {/* ── Newsletter ───────────────────────────────────────── */}
        <section className={s.section}>
          <div className={s.letter}>
            <div>
              <p className={s.eyebrow}>Occasional, not relentless</p>
              <h2 className={s.h2}>
                When a label changes, <em>you’ll know</em>
              </h2>
              <p>
                New reviews, reformulations worth knowing about, and corrections when we get
                something wrong. Unsubscribe in one click.
              </p>
            </div>
            <Newsletter />
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
