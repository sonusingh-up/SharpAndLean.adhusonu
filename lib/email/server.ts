import 'server-only';
import { ResendClient } from './resend';

function client() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('Service is not configured.');
  return new ResendClient(key);
}

export function newsletterEmail() {
  const segment = process.env.RESEND_NEWSLETTER_SEGMENT_ID;
  if (!segment) throw new Error('Service is not configured.');
  return { client: client(), segment };
}

export function contactEmail() {
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  if (!from || !to) throw new Error('Service is not configured.');
  return { client: client(), from, to };
}
