import Link from 'next/link';
import type { EvidenceGrade } from '@/lib/ingredients';

const labels: Record<EvidenceGrade, string> = {
  A: 'Strong evidence',
  B: 'Moderate evidence',
  C: 'Limited evidence',
  D: 'Weak evidence',
  F: 'Not supported',
};

/**
 * The grade is a link, not decoration: a letter nobody can audit is worth less
 * than no letter at all, so it always points at the published criteria.
 */
export function EvidenceBadge({
  grade,
  size = 'md',
  linked = true,
}: {
  grade: EvidenceGrade;
  size?: 'sm' | 'md' | 'lg';
  /** Set false when the badge sits inside another link — nested anchors are
      invalid HTML and break hydration. */
  linked?: boolean;
}) {
  const className = `evidence-badge evidence-${grade.toLowerCase()} evidence-${size}`;
  const title = `${labels[grade]} — see how grades are assigned`;
  const inner = (
    <>
      <span className="evidence-letter">{grade}</span>
      <span className="evidence-label">{labels[grade]}</span>
    </>
  );
  if (!linked)
    return (
      <span className={className} title={title}>
        {inner}
      </span>
    );
  return (
    <Link className={className} href="/evidence-grading" title={title}>
      {inner}
    </Link>
  );
}

/** 60–100 word answer written to stand alone in a snippet or AI answer. */
export function QuickAnswer({ children }: { children: React.ReactNode }) {
  return (
    <aside className="quick-answer" aria-label="Quick answer">
      <span className="quick-answer-label">The short answer</span>
      <p>{children}</p>
    </aside>
  );
}

export function KeyTakeaways({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <aside className="key-takeaways" aria-label="Key takeaways">
      <span className="quick-answer-label">Key takeaways</span>
      <ul>
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </aside>
  );
}

/** A named opinion on this specific topic, not recycled bio copy. */
export function ExpertNote({
  author = 'Sumita Bhatti',
  role = 'Clinical Nutritionist',
  href = '/author/sumita-bhatti',
  children,
}: {
  author?: string;
  role?: string;
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="expert-note">
      <span className="quick-answer-label">Editorial note</span>
      <blockquote>{children}</blockquote>
      <Link className="expert-note-by" href={href}>
        {author} <span>{role}</span>
      </Link>
    </aside>
  );
}

export function TableOfContents({ items }: { items: { id: string; title: string }[] }) {
  if (items.length < 3) return null;
  return (
    <nav className="toc" aria-label="On this page">
      <span className="quick-answer-label">On this page</span>
      <ol>
        {items.map((t) => (
          <li key={t.id}>
            <a href={`#${t.id}`}>{t.title}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Figures are passed in from real counts rather than hard-coded, so the strip
 * cannot drift into claiming volume the site has not published.
 */
export function TrustBar({ published, years }: { published: number; years: number }) {
  return (
    <div className="trust-bar">
      <span>
        <strong>{published}</strong> {published === 1 ? 'page' : 'pages'} published
      </span>
      <span>
        <strong>{years}+</strong> years clinical experience
      </span>
      <span>
        <strong>Zero</strong> paid rankings
      </span>
    </div>
  );
}
