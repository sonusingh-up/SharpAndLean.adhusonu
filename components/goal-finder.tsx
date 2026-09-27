'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, Search } from 'lucide-react';
import { findGoalProfile, goalProfiles } from '@/lib/goals';
import s from '@/app/home.module.css';

export type GoalReview = {
  slug: string;
  title: string;
  href: string;
  category: string;
  goalTags: string[];
  image?: string;
  score: number | null;
};

/** Result rows shown before "show all". */
const MAX_RESULTS = 6;

/** Same thresholds as the homepage cards, so a score reads the same colour everywhere. */
const tone = (score: number) => (score >= 7 ? s.good : score >= 5 ? s.fair : s.poor);

/** Staggers a list: each item reads its position from --i. */
const stagger = (i: number) => ({ '--i': i }) as CSSProperties;

/**
 * The highest-scored reviews for a goal, with the rest one click away so a
 * low-scored or newly published review is never unreachable. Keyed by goal
 * where it is used, so choosing another goal collapses it again.
 */
function ResultList({ matches }: { matches: GoalReview[] }) {
  const [showAll, setShowAll] = useState(false);
  const shown = showAll ? matches : matches.slice(0, MAX_RESULTS);
  const hidden = matches.length - MAX_RESULTS;

  return (
    <>
      <ul className={s.goalResultList}>
        {shown.map((review, i) => (
          // Rows revealed by "show all" stagger from zero rather than from six.
          <li key={review.slug} style={stagger(i < MAX_RESULTS ? i : i - MAX_RESULTS)}>
            <Link
              href={review.href}
              className={`${s.goalResultLink} ${review.score !== null ? tone(review.score) : ''}`}
            >
              <span className={s.goalResultImg}>
                {review.image && <Image src={review.image} alt="" fill sizes="52px" />}
              </span>
              <span className={s.goalResultText}>
                <small>{review.category}</small>
                <strong>{review.title}</strong>
              </span>
              {review.score !== null ? (
                <span className={s.goalResultScore}>
                  {review.score.toFixed(1)}
                  <small>/10</small>
                </span>
              ) : (
                <ArrowUpRight size={16} aria-hidden="true" />
              )}
            </Link>
          </li>
        ))}
      </ul>
      {hidden > 0 && (
        <button
          type="button"
          className={s.goalMore}
          aria-expanded={showAll}
          onClick={() => setShowAll((open) => !open)}
        >
          {showAll
            ? `Show the ${MAX_RESULTS} highest-scored only`
            : `Show all ${matches.length} reviews (${hidden} more)`}
        </button>
      )}
    </>
  );
}

export function GoalFinder({ reviews, children }: { reviews: GoalReview[]; children: ReactNode }) {
  const [query, setQuery] = useState('');
  const selected = findGoalProfile(query);

  // Reveal on scroll. The panel renders fully visible on the server; it is only
  // held back once JavaScript knows it is still below the fold, so a reader
  // without JavaScript, or a crawler, never sees an empty panel. A panel that
  // is already on screen, or a reader who prefers less motion, gets no reveal.
  const panelRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'static' | 'waiting' | 'shown'>('static');
  useEffect(() => {
    const el = panelRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) return;
    setPhase('waiting');
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPhase('shown');
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -15% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Best-scored first within each goal, so thumbnails and the shelf lead with
  // the strongest review rather than the oldest.
  const byGoal = useMemo(() => {
    const ranked = [...reviews].sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
    return Object.fromEntries(
      goalProfiles.map((goal) => [goal.id, ranked.filter((r) => r.goalTags.includes(goal.id))]),
    ) as Record<string, GoalReview[]>;
  }, [reviews]);

  const matches = selected ? byGoal[selected.id] : [];
  const covered = reviews.length;

  // The shelf shows the chosen goal's products, or one product from each of
  // the first goals when nothing is chosen yet.
  const shelf = useMemo(() => {
    if (selected) return byGoal[selected.id].filter((r) => r.image).slice(0, 3);
    const picks: GoalReview[] = [];
    for (const goal of goalProfiles) {
      const pick = byGoal[goal.id].find((r) => r.image && !picks.some((p) => p.slug === r.slug));
      if (pick) picks.push(pick);
      if (picks.length === 3) break;
    }
    return picks;
  }, [byGoal, selected]);

  const choose = (label: string, id: string) => setQuery(selected?.id === id ? '' : label);

  return (
    <div className={s.goalPanel} ref={panelRef} data-phase={phase}>
      <div className={s.goalIntro}>
        {children}

        <div className={`${s.goalShelf} ${s.reveal}`} style={stagger(1)} aria-hidden="true">
          {shelf.length > 0 && (
            <div className={s.shelfStage} key={selected?.id ?? 'all'}>
              {shelf.map((r, i) => (
                <span className={s.shelfItem} style={stagger(i)} key={r.slug}>
                  <Image src={r.image!} alt="" fill sizes="(max-width: 560px) 30vw, 150px" />
                </span>
              ))}
            </div>
          )}
          <ul className={s.shelfNotes} key={`notes-${selected?.id ?? 'all'}`}>
            <li>
              {selected
                ? `${selected.label} · ${matches.length} ${matches.length === 1 ? 'review' : 'reviews'}`
                : `${covered} reviews across ${goalProfiles.length} goals`}
            </li>
            <li>
              {selected
                ? `${selected.ingredients.length} ingredient evidence ${selected.ingredients.length === 1 ? 'page' : 'pages'}`
                : 'Every claim checked against the research'}
            </li>
          </ul>
        </div>
      </div>

      <div className={`${s.goalTool} ${s.reveal}`} style={stagger(2)}>
        <label className={s.goalSearchLabel} htmlFor="goal-search">
          Search a goal or ingredient
        </label>
        <div className={s.goalSearch}>
          <Search size={18} aria-hidden="true" />
          <input
            id="goal-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try “weightloss”, “weightgain” or “probiotics”"
            autoComplete="off"
            aria-controls="goal-search-results"
          />
        </div>

        <p className={s.goalPrompt}>Or start with a goal</p>
        <div className={s.goalChoices} role="group" aria-label="Popular goals">
          {goalProfiles.map((goal, i) => {
            const list = byGoal[goal.id];
            const thumb = list.find((r) => r.image)?.image;
            return (
              <button
                type="button"
                key={goal.id}
                className={`${s.goalTile} ${s.reveal}`}
                style={stagger(i + 3)}
                aria-pressed={selected?.id === goal.id}
                onClick={() => choose(goal.label, goal.id)}
              >
                <span className={s.goalTileImg}>
                  {thumb && <Image src={thumb} alt="" fill sizes="44px" />}
                </span>
                <span className={s.goalTileText}>
                  <strong>{goal.label}</strong>
                  <small>
                    {list.length} {list.length === 1 ? 'review' : 'reviews'}
                  </small>
                </span>
              </button>
            );
          })}
        </div>

        <div id="goal-search-results" className={s.goalResults} aria-live="polite">
          {selected ? (
            <div className={s.goalResultsInner} key={selected.id}>
              <div className={s.goalResultHead}>
                <div>
                  <p className={s.goalResultEyebrow}>EDITORIAL COVERAGE</p>
                  <h3>{selected.label}</h3>
                </div>
                <span className={s.goalResultCount}>
                  {matches.length} {matches.length === 1 ? 'review' : 'reviews'}
                </span>
              </div>
              <p className={s.goalCaveat}>{selected.note}</p>
              {matches.length ? (
                <ResultList matches={matches} />
              ) : (
                <p className={s.goalEmpty}>No matching reviews are published yet.</p>
              )}
              <div className={s.goalRelated}>
                <span>Ingredient evidence</span>
                {selected.ingredients.map((ingredient) => (
                  <Link href={ingredient.href} key={ingredient.href}>
                    {ingredient.title} <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                ))}
              </div>
              {selected.categoryLink && (
                <Link className={s.goalBrowse} href={selected.categoryLink.href}>
                  {selected.categoryLink.title} <ArrowRight size={14} aria-hidden="true" />
                </Link>
              )}
            </div>
          ) : (
            <p className={s.goalEmpty}>
              {query.trim().length > 1
                ? 'No exact goal match yet. Try weight loss, build muscle, probiotics, sleep, focus or heart health.'
                : 'Results link to our reviews and ingredient evidence—not a “best for you” medical recommendation.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
