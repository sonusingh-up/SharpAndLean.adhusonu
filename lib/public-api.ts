import 'server-only';
import { createHash } from 'node:crypto';
import { serviceClient } from './supabase/server';
import { siteUrl } from './config';
export async function publicRequest(request: Request, scope: string) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(siteUrl).origin && origin !== new URL(request.url).origin)
    throw new Error('Origin not allowed.');
  const length = Number(request.headers.get('content-length') || 0);
  if (length > 10000) throw new Error('Request is too large.');
  const db = serviceClient();
  const ip = (request.headers.get('x-forwarded-for') || 'local').split(',')[0].trim();
  const key = createHash('sha256').update(`${scope}:${ip}`).digest('hex');
  const { data, error } = await db.rpc('consume_rate_limit', { p_key: key, p_limit: 5 });
  if (error || !data) throw new Error('Please wait a minute before trying again.');
  const raw = await request.text();
  if (raw.length > 10000) throw new Error('Request is too large.');
  return { db, body: JSON.parse(raw) };
}
export function apiFailure(error: unknown) {
  const message = error instanceof Error ? error.message : '';
  if (message === 'Service is not configured.')
    return Response.json(
      { error: 'This form is not live yet. Please check back after launch.' },
      { status: 503 },
    );
  if (message.includes('wait a minute')) return Response.json({ error: message }, { status: 429 });
  return Response.json(
    { error: 'We couldn’t accept that submission. Please check the details and try again.' },
    { status: 400 },
  );
}
