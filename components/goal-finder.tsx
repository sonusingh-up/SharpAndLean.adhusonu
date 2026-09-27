'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight, Search } from 'lucide-react';
import { findGoalProfile, goalProfiles } from '@/lib/goals';
import s from '@/app/home.module.css';

export type GoalReview = {
  slug: string;
  title: string;
  href: string;
  category: string;
  goalTags: string[];
};

export function GoalFinder({ reviews }: { reviews: GoalReview[] }) {
  const [query, setQuery] = useState('');
  const selected = findGoalProfile(query);
  const matches = useMemo(() => {
    if (!selected) return [];
    return reviews.filter((review) => review.goalTags.includes(selected.id));
  }, [reviews, selected]);

  return (
    <div className={s.goalTool}>
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
      <div className={s.goalChoices} aria-label="Popular goals">
        {goalProfiles.map((goal) => (
          <button
            type="button"
            key={goal.id}
            className={s.goalChoice}
            aria-pressed={selected?.id === goal.id}
            onClick={() => setQuery(goal.label)}
          >
            {goal.label}
          </button>
        ))}
      </div>

      <div id="goal-search-results" className={s.goalResults} aria-live="polite">
        {selected ? (
          <>
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
              <ul className={s.goalResultList}>
                {matches.map((review) => (
                  <li key={review.slug}>
                    <Link href={review.href} className={s.goalResultLink}>
                      <span>
                        <small>{review.category} · Editorial review</small>
                        <strong>{review.title}</strong>
                      </span>
                      <ArrowUpRight size={17} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
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
          </>
        ) : (
          <p className={s.goalEmpty}>
            {query.trim().length > 1
              ? 'No exact goal match yet. Try weight loss, build muscle, probiotics, sleep, focus or heart health.'
              : 'Results link to our reviews and ingredient evidence—not a “best for you” medical recommendation.'}
          </p>
        )}
      </div>
    </div>
  );
}
