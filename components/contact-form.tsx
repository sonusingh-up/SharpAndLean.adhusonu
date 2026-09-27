'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export function ContactForm() {
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState('');
  return (
    <form className="contact-form" aria-label="Contact the editorial team" onSubmit={async (event) => {
      event.preventDefault();
      if (busy) return;
      const form = event.currentTarget;
      setBusy(true);
      setFeedback('');
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(Object.fromEntries(new FormData(form))),
        });
        const result = await response.json();
        setFeedback(result.message || result.error || 'Please try again.');
        if (response.ok) form.reset();
      } catch {
        setFeedback('We couldn’t connect. Please try again.');
      } finally {
        setBusy(false);
      }
    }}>
      <h3>Send a message</h3>
      <label htmlFor="contact-name">Your name</label>
      <input id="contact-name" name="name" autoComplete="name" minLength={2} maxLength={100} required />
      <label htmlFor="contact-email">Email address</label>
      <input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} required />
      <label htmlFor="contact-subject">Subject</label>
      <input id="contact-subject" name="subject" minLength={3} maxLength={160} required />
      <label htmlFor="contact-message">Your message</label>
      <textarea id="contact-message" name="message" rows={6} minLength={10} maxLength={5000} aria-describedby="contact-hint" required />
      <p id="contact-hint" className="muted">Please don’t include private medical information.</p>
      <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <label className="consent">
        <input type="checkbox" name="consent" value="yes" required />
        <span>I agree to my details being used to respond to this message, as explained in the <Link href="/privacy-policy">privacy policy</Link>.</span>
      </label>
      <button className="button" disabled={busy}>{busy ? 'Sending…' : 'Send message'} <ArrowUpRight size={16} aria-hidden="true" /></button>
      <p className="form-message" role="status" aria-live="polite">{feedback}</p>
    </form>
  );
}
