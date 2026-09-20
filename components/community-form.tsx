'use client';
import { useState } from 'react';
export function CommunityForm({ reviewId }: { reviewId: string }) {
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="community-form"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        const form = e.currentTarget;
        try {
          const response = await fetch('/api/submit-review', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...Object.fromEntries(new FormData(form)),
              review_id: reviewId,
            }),
          });
          const data = await response.json();
          setMessage(data.message || data.error);
          if (response.ok) form.reset();
        } catch {
          setMessage('Could not connect. Please try again.');
        } finally {
          setBusy(false);
        }
      }}
    >
      <h3>Share your experience</h3>
      <p>
        Submissions are moderated before appearing. Please leave out personal medical information.
      </p>
      <div className="field-row">
        <label className="field">
          Display name
          <input name="reviewer_name" required minLength={2} maxLength={80} />
        </label>
        <label className="field">
          Your rating
          <select name="rating" required defaultValue="">
            <option value="" disabled>
              Select a rating
            </option>
            {[5, 4, 3, 2, 1].map((v) => (
              <option value={v} key={v}>
                {v} / 5
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="field">
        Your experience
        <textarea name="review_text" required minLength={20} maxLength={3000} />
      </label>
      <input name="website" className="honeypot" tabIndex={-1} aria-hidden="true" />
      <button className="button" disabled={busy}>
        {busy ? 'Submitting…' : 'Submit for review'}
      </button>
      <p role="status">{message}</p>
    </form>
  );
}
