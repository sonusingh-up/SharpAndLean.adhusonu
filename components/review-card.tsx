import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, FlaskConical, Brain, Leaf, Flame } from 'lucide-react';
import type { Review } from '@/lib/types';
import { categories } from '@/lib/sample';
export function ReviewCard({ review }: { review: Review }) {
  const Icon =
    review.category_slug === 'fat-burners'
      ? Flame
      : review.category_slug === 'nootropics'
        ? Brain
        : Leaf;
  return (
    <article className="review-card">
      <Link
        className={`review-art art-${review.category_slug}`}
        href={`/${review.category_slug}/${review.slug}`}
        tabIndex={-1}
        aria-hidden="true"
      >
        {review.featured_image_url ? (
          <Image
            src={review.featured_image_url}
            alt=""
            fill
            sizes="(max-width: 700px) 90vw, 40vw"
          />
        ) : (
          <div className="editorial-cover">
            <span>SHARP & LEAN / REVIEW NOTES</span>
            <Icon strokeWidth={1} size={76} />
            <span>INGREDIENTS. EVIDENCE. PERSPECTIVE.</span>
          </div>
        )}
        <span className="art-chip">{review.is_sample ? 'Sample content' : 'Editorial review'}</span>
        <span className="circle art-arrow">
          <ArrowUpRight size={19} />
        </span>
      </Link>
      <div className="review-card-content">
        <div className="review-meta">
          <span>{categories.find((c) => c.slug === review.category_slug)?.name}</span>
          <span>{review.score === null ? 'Unrated' : `${review.score.toFixed(1)} / 10`}</span>
        </div>
        <h3>
          <Link href={`/${review.category_slug}/${review.slug}`}>{review.title}</Link>
        </h3>
        <p>{review.summary}</p>
        <div className="review-card-bottom">
          <span>
            <FlaskConical size={14} />{' '}
            {review.is_sample ? 'Review format preview' : 'Ingredient analysis'}
          </span>
          <Link href={`/${review.category_slug}/${review.slug}`}>
            Read review <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
