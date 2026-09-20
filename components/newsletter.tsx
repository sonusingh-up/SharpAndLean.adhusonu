'use client';
import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
export function Newsletter({ compact = false }: { compact?: boolean }) {
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  return (
    <form
      className={`newsletter-form ${compact ? 'compact' : ''}`}
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setMessage('');
        const form = e.currentTarget;
        try {
          const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(new FormData(form))),
          });
          const data = await response.json();
          setMessage(data.message || data.error);
          if (response.ok) form.reset();
        } catch {
          setMessage('We couldn’t connect. Please try again.');
        } finally {
          setBusy(false);
        }
      }}
    >
      <label className="sr-only" htmlFor={compact ? 'email-compact' : 'email'}>
        Email address
      </label>
      <div className="email-row">
        <input
          id={compact ? 'email-compact' : 'email'}
          type="email"
          name="email"
          required
          maxLength={254}
          placeholder="Your email address"
          autoComplete="email"
        />
        <button className="button" disabled={busy}>
          {busy ? 'Joining…' : compact ? 'Subscribe' : 'Count me in'}
          <ArrowUpRight size={16} />
        </button>
      </div>
      <input
        className="honeypot"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <label className="consent">
        <input type="checkbox" name="consent" value="yes" required /> I agree to receive review
        updates. Unsubscribe anytime.
      </label>
      {message && (
        <p className="form-message" role="status">
          {message}
        </p>
      )}
    </form>
  );
}
