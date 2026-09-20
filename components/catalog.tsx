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
  const [sort, setSort] = useState('score');
  const [page, setPage] = useState(1);
  const sorted = [...reviews].sort((a, b) =>
    sort === 'price'
      ? (a.price_amount ?? Infinity) - (b.price_amount ?? Infinity)
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
          {reviews.length} {reviews.some((r) => r.is_sample) ? 'sample reviews' : 'reviews'}
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
            <option value="score">Highest score</option>
            <option value="newest">Most recent</option>
            <option value="price" disabled={currencies.size > 1}>
              Price: low to high
            </option>
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
