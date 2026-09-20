'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, CornerDownLeft } from 'lucide-react';
import type { SearchHit } from '@/lib/search';

export function SiteSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState('');
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [active, setActive] = useState(0);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setTerm('');
    setHits([]);
    setActive(0);
    setFailed(false);
    openerRef.current?.focus();
  }, []);

  // Cmd/Ctrl+K from anywhere, matching the shortcut people already expect.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((wasOpen) => !wasOpen);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // The result list scrolls, so keep the keyboard selection in view.
  useEffect(() => {
    listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  // Debounced so typing does not fire a request per keystroke.
  useEffect(() => {
    const query = term.trim();
    if (query.length < 2) {
      setHits([]);
      setBusy(false);
      setFailed(false);
      return;
    }
    setBusy(true);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        const data = await response.json();
        setHits(data.hits || []);
        setFailed(!response.ok);
        setActive(0);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') setFailed(true);
      } finally {
        setBusy(false);
      }
    }, 220);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [term]);

  const go = (url: string) => {
    close();
    router.push(url);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') return close();
    if (!hits.length) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((i) => (i + 1) % hits.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((i) => (i - 1 + hits.length) % hits.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      go(hits[active].url);
    }
  };

  const query = term.trim();

  return (
    <>
      <button
        ref={openerRef}
        type="button"
        className="search-toggle"
        aria-label="Search the site"
        onClick={() => setOpen(true)}
      >
        <Search size={16} strokeWidth={1.8} />
      </button>

      {open && (
        <div className="search-overlay" onMouseDown={close}>
          <div
            className="search-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Search SharpAndLean"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="search-field">
              <Search size={17} strokeWidth={1.8} />
              <input
                ref={inputRef}
                type="search"
                value={term}
                placeholder="Search reviews, guides and pages"
                aria-label="Search term"
                autoComplete="off"
                onChange={(event) => setTerm(event.target.value)}
                onKeyDown={onKeyDown}
              />
              <button type="button" onClick={close} aria-label="Close search">
                <X size={16} strokeWidth={1.8} />
              </button>
            </div>

            <div className="search-results" ref={listRef}>
              {failed && <p className="search-note">Search is unavailable right now.</p>}
              {!failed && query.length < 2 && (
                <p className="search-note">Type at least two characters to search.</p>
              )}
              {!failed && query.length >= 2 && !busy && !hits.length && (
                <p className="search-note">
                  Nothing matched “{query}”. Try an ingredient or product name.
                </p>
              )}
              {hits.map((hit, index) => (
                <button
                  type="button"
                  key={hit.url}
                  className={`search-hit ${index === active ? 'is-active' : ''}`}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => go(hit.url)}
                >
                  <span className="search-hit-kind">{hit.kind}</span>
                  <span className="search-hit-title">{hit.title}</span>
                  {hit.summary && <span className="search-hit-summary">{hit.summary}</span>}
                </button>
              ))}
            </div>

            <div className="search-foot">
              <span>
                <CornerDownLeft size={12} /> to open
              </span>
              <span>↑ ↓ to move</span>
              <span>Esc to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
