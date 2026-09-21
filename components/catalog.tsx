'use client';
import { useState } from 'react';
import type { Review } from '@/lib/types';
import { ReviewCard } from './review-card';
export function Catalog({
  reviews,
  paginated = false,
}: {
  reviews: Review[];
  paginated?: boolean;
}) {
  // Nothing is sorted by a score that does not exist. Label overviews carry no
  // score, so offering "Highest score" as the default promises a ranking the
  // site deliberately does not produce.
  const hasScores = reviews.some((r) => r.score !== null);
  // Defaulting to score while most of the list is unscored puts one product on
  // top of a pile of ties, which reads as a ranking of everything. Offer the
  // sort as soon as anything is scored; only lead with it once most of the
  // list can actually be ordered by it.
  const mostlyScored = reviews.filter((r) => r.score !== null).length > reviews.length / 2;
  const hasPrices = reviews.some((r) => r.price_amount !== null);
  const [sort, setSort] = useState(mostlyScored ? 'score' : 'newest');
  const [page, setPage] = useState(1);
  const sorted = [...reviews].sort((a, b) =>
    sort === 'price'
      ? (a.price_amount ?? Infinity) - (b.price_amount ?? Infinity)
      : sort === 'name'
        ? a.title.localeCompare(b.title)
        : sort === 'newest'
          ? new Date(b.published_at || b.updated_at).getTime() -
            new Date(a.published_at || a.updated_at).getTime()
          : (b.score ?? -1) - (a.score ?? -1),
  );
  const currencies = new Set(reviews.filter((r) => r.price_amount !== null).map((r) => r.currency));
  const shown = paginated ? sorted.slice((page - 1) * 6, page * 6) : sorted;
  return (
    <>
      <div className="catalog-bar">
        <span>
          {reviews.length}{' '}
          {reviews.some((r) => r.is_sample)
            ? 'sample reviews'
            : hasScores
              ? reviews.length === 1
                ? 'review'
                : 'reviews'
              : reviews.length === 1
                ? 'label overview'
                : 'label overviews'}
        </span>
        <label>
          Sort by{' '}
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
          >
            {hasScores && <option value="score">Highest score</option>}
            <option value="newest">Most recent</option>
            <option value="name">Name: A to Z</option>
            {hasPrices && (
              <option value="price" disabled={currencies.size > 1}>
                Price: low to high
              </option>
            )}
          </select>
        </label>
      </div>
      <div className="review-grid">
        {shown.map((r) => (
          <ReviewCard review={r} key={r.id} />
        ))}
      </div>
      {paginated && reviews.length > 6 && (
        <div className="pagination">
          <button
            className="button button-light"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span>
            Page {page} of {Math.ceil(reviews.length / 6)}
          </span>
          <button
            className="button"
            disabled={page * 6 >= reviews.length}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
