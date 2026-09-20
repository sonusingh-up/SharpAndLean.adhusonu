'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { moderate } from '@/app/admin/actions';
export function Moderation({
  rows,
  preview,
}: {
  rows: Record<string, unknown>[];
  preview: boolean;
}) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState('');
  return (
    <>
      <p role="status">{message}</p>
      {rows.length ? (
        rows.map((row) => (
          <article className="admin-panel" key={String(row.id)}>
            <div className="moderation-heading">
              <h2>{String(row.reviewer_name)}</h2>
              <span>
                {String(row.rating)} / 5 · {String(row.moderation_status)}
              </span>
            </div>
            <p>{String(row.review_text)}</p>
            <div className="moderation-buttons">
              {[true, false].map((approved) => (
                <button
                  className={`button ${!approved ? 'button-light' : ''}`}
                  key={String(approved)}
                  disabled={preview || busy === row.id}
                  onClick={async () => {
                    setBusy(String(row.id));
                    const result = await moderate(String(row.id), approved);
                    setMessage(result.error || (approved ? 'Approved.' : 'Rejected.'));
                    setBusy('');
                    router.refresh();
                  }}
                >
                  {approved ? 'Approve' : 'Reject'}
                </button>
              ))}
            </div>
          </article>
        ))
      ) : (
        <div className="empty">
          <h2>All caught up.</h2>
          <p>New community experiences will appear here for review.</p>
        </div>
      )}
    </>
  );
}
