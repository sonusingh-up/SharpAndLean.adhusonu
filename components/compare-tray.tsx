'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useSyncExternalStore } from 'react';
import { ArrowUpRight, Check, Plus, X } from 'lucide-react';
import { comparePath, MAX_COMPARE } from '@/lib/compare-path';

/*
 * The reader's compare tray: pick up to three products from one category on
 * any card or review page, then open the comparison. The selection is a
 * per-browser convenience, so it lives in localStorage — with an in-memory
 * fallback for private windows where storage throws — and never on a server.
 */

type Item = { slug: string; name: string; category: string };

const KEY = 'sl-compare';
const EVENT = 'sl-compare-change';
const EMPTY: Item[] = [];

let memory: Item[] = EMPTY;
let cachedRaw: string | null | undefined;
let cached: Item[] = EMPTY;

function isItem(v: unknown): v is Item {
  const o = v as Item;
  return (
    !!o &&
    typeof o.slug === 'string' &&
    typeof o.name === 'string' &&
    typeof o.category === 'string'
  );
}

function read(): Item[] {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return memory;
  }
  // useSyncExternalStore needs the same array back while nothing has changed.
  if (raw === cachedRaw) return cached;
  cachedRaw = raw;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cached = Array.isArray(parsed) ? parsed.filter(isItem).slice(0, MAX_COMPARE) : EMPTY;
  } catch {
    cached = EMPTY;
  }
  return cached;
}

function write(items: Item[]) {
  memory = items;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // Storage blocked: the in-memory copy still works for this page view.
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

function useTray() {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function CompareToggle({ slug, name, category }: Item) {
  const items = useTray();
  const [notice, setNotice] = useState('');
  const inTray = items.some((i) => i.slug === slug);
  const otherCategory = items.length > 0 && items[0].category !== category;
  const full = !inTray && !otherCategory && items.length >= MAX_COMPARE;

  function toggle() {
    if (inTray) {
      write(items.filter((i) => i.slug !== slug));
      setNotice('');
      return;
    }
    if (otherCategory) {
      // Comparisons stay inside a category, so a product from another one
      // starts a fresh tray rather than being silently refused.
      write([{ slug, name, category }]);
      setNotice('Started a new comparison. Products are compared within one category.');
      return;
    }
    if (full) return;
    write([...items, { slug, name, category }]);
    setNotice('');
  }

  return (
    <span className="compare-toggle-wrap">
      <button
        type="button"
        className={`compare-toggle${inTray ? ' is-on' : ''}`}
        onClick={toggle}
        disabled={full}
        aria-pressed={inTray}
      >
        {inTray ? <Check size={14} /> : <Plus size={14} />}
        {inTray ? 'In comparison' : full ? `Tray full (${MAX_COMPARE})` : 'Compare'}
      </button>
      <span className="compare-toggle-notice" aria-live="polite">
        {notice}
      </span>
    </span>
  );
}

export function CompareTray() {
  const items = useTray();
  const pathname = usePathname();
  if (!items.length) return null;
  const href = comparePath(items.map((i) => i.slug));
  const here = pathname === href;
  return (
    <aside className="compare-tray" aria-label="Products to compare">
      <div className="compare-tray-inner">
        <span className="compare-tray-label">Compare</span>
        <ul className="compare-tray-items">
          {items.map((i) => (
            <li key={i.slug}>
              <span>{i.name}</span>
              <button
                type="button"
                aria-label={`Remove ${i.name}`}
                onClick={() => write(items.filter((x) => x.slug !== i.slug))}
              >
                <X size={13} />
              </button>
            </li>
          ))}
        </ul>
        <span className="compare-tray-actions">
          {items.length < 2 ? (
            // The product's own list of comparable products, which covers the
            // cross-category alternatives a category page would not show.
            <Link
              key="hint"
              className="compare-tray-hint"
              href={`/${items[0].category}/${items[0].slug}#compare-with`}
            >
              Pick one more to compare <ArrowUpRight size={14} />
            </Link>
          ) : here ? (
            <span className="compare-tray-hint">Showing this comparison</span>
          ) : (
            // Keyed apart from the hint link above so React mounts a fresh
            // element instead of animating the hint's styles into a button.
            <Link key="go" className="button compare-tray-go" href={href}>
              Compare {items.length} <ArrowUpRight size={15} />
            </Link>
          )}
          <button type="button" className="compare-tray-clear" onClick={() => write(EMPTY)}>
            Clear
          </button>
        </span>
      </div>
    </aside>
  );
}
