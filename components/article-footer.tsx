import type { Citation } from '@/lib/ingredients';
import { linkRel } from '@/lib/content';

export type HistoryEntry = {
  date: string;
  /** What actually changed. A date with no note is not a history. */
  note: string;
};

const longDate = (value: string) =>
  new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const shortDate = (value: string) =>
  new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

/**
 * Sources, collapsed by default.
 *
 * Citations belong on the page — they are how a reader checks a claim — but a
 * wall of them between the last paragraph and the footer buries the end of the
 * article. Collapsed keeps them one click away and visibly counted.
 */
export function ReferenceBox({ references }: { references: Citation[] }) {
  if (!references.length) return null;
  return (
    <details className="article-box reference-box">
      <summary>
        <span className="article-box-title">References</span>
        <span className="article-box-meta">
          {references.length} {references.length === 1 ? 'source' : 'sources'}
        </span>
      </summary>
      <div className="article-box-body">
        <ol>
          {references.map((r) => (
            <li key={r.id} id={`ref-${r.id}`}>
              {r.url ? (
                <a href={r.url} target="_blank" rel={linkRel(r.url)}>
                  {r.text}
                </a>
              ) : (
                r.text
              )}
            </li>
          ))}
        </ol>
      </div>
    </details>
  );
}

/**
 * Publication history.
 *
 * The summary carries the two dates a reader actually wants — first published
 * and last changed — so they are legible without expanding. Expanding shows
 * what each change was, because a date alone does not tell you whether a
 * conclusion moved or a typo was fixed.
 */
export function PageHistory({ entries }: { entries: HistoryEntry[] }) {
  if (!entries.length) return null;
  const sorted = [...entries].sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  return (
    <details className="article-box history-box">
      <summary>
        <span className="article-box-title">Page history</span>
        <span className="article-box-meta">
          Published <time dateTime={first.date}>{shortDate(first.date)}</time>
          {sorted.length > 1 && (
            <>
              {' · Updated '}
              <time dateTime={last.date}>{shortDate(last.date)}</time>
            </>
          )}
        </span>
      </summary>
      <div className="article-box-body">
        <ol className="history-list">
          {[...sorted].reverse().map((e, i) => (
            <li key={`${e.date}-${i}`}>
              <time dateTime={e.date}>{longDate(e.date)}</time>
              <span>{e.note}</span>
            </li>
          ))}
        </ol>
      </div>
    </details>
  );
}
