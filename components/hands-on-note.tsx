import Image from 'next/image';
import Link from 'next/link';
import type { HandsOnNote } from '@/lib/types';
import { getAuthorBySlug } from '@/lib/author';
import s from './hands-on-note.module.css';

/**
 * A named tester's own notes on a product, with their photo. Rendered only
 * when a note exists: the page never shows an empty "tester's view" box or
 * words the tester did not write.
 */
export function HandsOnBlock({ note }: { note?: HandsOnNote }) {
  if (!note) return null;
  const tester = getAuthorBySlug(note.tester);
  return (
    <aside className={s.note} aria-label={`${tester?.name ?? 'Tester'}’s notes`}>
      <div className={s.head}>
        {tester?.photo_url && (
          <Image className={s.avatar} src={tester.photo_url} alt="" width={40} height={40} />
        )}
        <div>
          <span className={s.label}>Hands-on notes</span>
          {tester ? (
            <Link className={s.name} href={`/author/${tester.slug}`}>
              {tester.name}
            </Link>
          ) : null}
        </div>
      </div>
      <p className={s.text}>{note.notes}</p>
      <p className={s.meta}>
        {note.used}
        {note.bought ? ` · ${note.bought}` : ''}
      </p>
    </aside>
  );
}
