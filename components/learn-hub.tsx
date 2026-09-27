import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Calculator, ListChecks, Scale, Target } from 'lucide-react';
import { SectionLabel } from '@/components/site';
import {
  getIngredient,
  gradeBands,
  ingredients,
  type EvidenceGrade,
  type IngredientPage,
} from '@/lib/ingredients';
import type { Collection } from '@/lib/types';
import type { Guide } from '@/lib/guides';
import s from './learn-hub.module.css';

type Topic = NonNullable<Collection['topic']> | 'other';

/** Hub sections, in the order they appear. */
const topics: { id: Topic; label: string; blurb: string }[] = [
  {
    id: 'fitness',
    label: 'Training and protein',
    blurb: 'Starting to exercise, and how much protein supports it.',
  },
  {
    id: 'vitamins',
    label: 'Vitamins and everyday health',
    blurb: 'Which vitamins are worth taking, who needs them, and which to skip.',
  },
  {
    id: 'weight-loss',
    label: 'Weight loss and GLP-1',
    blurb: 'What GLP-1 drugs and supplements do, and the approaches with the best evidence.',
  },
  { id: 'other', label: 'More reading', blurb: 'Everything else we have explained.' },
];

/** Interactive tools on the site, each on the page that explains its numbers. */
const tools = [
  {
    icon: Calculator,
    title: 'Protein calculator',
    text: 'Your daily protein target, and how much at each meal.',
    href: '/learn/how-much-protein-should-a-beginner-eat',
  },
  {
    icon: ListChecks,
    title: 'Vitamin checker',
    text: 'Which vitamins the guidelines say are worth taking for you.',
    href: '/learn/which-vitamins-should-you-take-daily',
  },
  {
    icon: Target,
    title: 'Goal finder',
    text: 'Pick a goal and see every product we have reviewed for it.',
    href: '/#goal-finder-title',
  },
  {
    icon: Scale,
    title: 'Compare products',
    text: 'Line up two or three products by dose, cost and score.',
    href: '/compare#build',
  },
];

/** The ingredient reference pages most often reached from these articles. */
const referenceSlugs = [
  'vitamin-d3',
  'folic-acid',
  'vitamin-b12',
  'whey-protein-blend',
  'omega-3',
  'psyllium-husk',
];

/**
 * The grade as a compact letter, in the site's evidence colours. The label is
 * spoken rather than shown, so a list of grades does not repeat it six times.
 */
function GradeMark({ grade }: { grade: EvidenceGrade }) {
  const label = gradeBands.find((b) => b.grade === grade)?.label ?? '';
  return (
    <span
      className={`${s.gradeMark} evidence-${grade.toLowerCase()}`}
      title={`Grade ${grade}: ${label.toLowerCase()}`}
    >
      <span className="evidence-letter" aria-hidden="true">
        {grade}
      </span>
      <span className="sr-only">
        Grade {grade}, {label.toLowerCase()}.
      </span>
    </span>
  );
}

/** The one number a reader most wants from an ingredient page, when it has one. */
function keyFact(ing: IngredientPage) {
  const first = ing.atAGlance?.[0];
  if (first) return `${first.label}: ${first.value}`;
  const d = ing.studiedDose;
  if (d) return `Studied dose: ${d.min}–${d.max} ${d.unit} ${d.per === 'day' ? 'a day' : 'per dose'}`;
  // Otherwise the claim the evidence supports best.
  const best = [...ing.claims].sort((a, b) => a.grade.localeCompare(b.grade))[0];
  return best ? `Best supported: ${best.claim.replace(/^For /, '').toLowerCase()} (${best.grade})` : ing.category;
}

/** Minutes to read, at an ordinary 220 words a minute. */
function readingTime(html: string) {
  const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function LearnHub({ articles, guides }: { articles: Collection[]; guides: Guide[] }) {
  const byTopic = (id: Topic) => articles.filter((a) => (a.topic ?? 'other') === id);
  const references = referenceSlugs.map(getIngredient).filter((i) => i !== undefined);

  return (
    <>
      <section className={s.tools} aria-labelledby="learn-tools">
        <h2 id="learn-tools" className={s.sectionTitle}>
          Work it out for yourself
        </h2>
        <div className={s.toolGrid}>
          {tools.map(({ icon: Icon, title, text, href }) => (
            <Link className={s.tool} href={href} key={title}>
              <span className={s.toolIcon} aria-hidden="true">
                <Icon size={18} />
              </span>
              <strong>{title}</strong>
              <span>{text}</span>
            </Link>
          ))}
        </div>
      </section>

      {topics.map((topic) => {
        const list = byTopic(topic.id);
        if (!list.length) return null;
        return (
          <section className={s.topic} key={topic.id} aria-labelledby={`topic-${topic.id}`}>
            <header className={s.topicHead}>
              <div>
                <h2 id={`topic-${topic.id}`} className={s.sectionTitle}>
                  {topic.label}
                </h2>
                <p>{topic.blurb}</p>
              </div>
              <span className={s.count}>
                {list.length} {list.length === 1 ? 'article' : 'articles'}
              </span>
            </header>
            <div className={s.grid}>
              {list.map((a) => (
                <Link className={s.card} href={`/learn/${a.slug}`} key={a.id}>
                  <span className={s.media}>
                    {a.figure ? (
                      <Image src={a.figure.src} alt="" fill sizes="(max-width: 700px) 92vw, 360px" />
                    ) : (
                      <span className={s.mediaFallback}>{topic.label}</span>
                    )}
                  </span>
                  <span className={s.body}>
                    <span className={s.meta}>{readingTime(a.body)} min read</span>
                    <strong className={s.title}>{a.title}</strong>
                    <span className={s.summary}>{a.summary}</span>
                    <span className={s.more}>
                      Read the article <ArrowUpRight size={15} aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <section className={s.references} aria-labelledby="learn-references">
        <div className={s.referenceIntro}>
          <SectionLabel>Reference</SectionLabel>
          <h2 id="learn-references" className={s.sectionTitle}>
            Ingredient pages
          </h2>
          <p>
            One page per ingredient: what it does, what the research shows for each claim, how much
            to take and what to watch for.
          </p>
          <div className={s.legend}>
            <span className={s.legendTitle}>Every claim is graded</span>
            <ul>
              {gradeBands.map((band) => (
                <li key={band.grade}>
                  <GradeMark grade={band.grade} />
                  {band.label.replace(/ evidence$/, '')}
                </li>
              ))}
            </ul>
          </div>
          <div className={s.referenceLinks}>
            <Link className="text-link" href="/ingredients">
              All {ingredients.length} ingredients <ArrowUpRight size={14} />
            </Link>
            <Link className="text-link" href="/evidence-grading">
              How we grade <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
        <ul className={s.referenceList}>
          {references.map((ing) => (
            <li key={ing.slug}>
              <Link href={`/ingredients/${ing.slug}`}>
                <GradeMark grade={ing.grade} />
                <span className={s.referenceText}>
                  <strong>{ing.name}</strong>
                  <small>
                    {ing.category} · {ing.claims.length} graded claims
                  </small>
                  <span className={s.referenceFact}>{keyFact(ing)}</span>
                </span>
                <ArrowUpRight className={s.referenceArrow} size={16} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {guides.length > 0 && (
        <section className={s.topic} aria-labelledby="learn-guides">
          <header className={s.topicHead}>
            <div>
              <h2 id="learn-guides" className={s.sectionTitle}>
                Skills for reading a label
              </h2>
              <p>Guides that teach something you can do yourself with a bottle in your hand.</p>
            </div>
            <Link className="text-link" href="/guides">
              All guides <ArrowUpRight size={14} />
            </Link>
          </header>
          <div className={s.guideList}>
            {guides.map((g) => (
              <Link className={s.guide} href={`/guides/${g.slug}`} key={g.slug}>
                <strong>{g.title}</strong>
                <span>{g.summary}</span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
