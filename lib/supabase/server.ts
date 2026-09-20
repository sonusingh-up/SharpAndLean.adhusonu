import 'server-only';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { hasSupabase, supabasePublicKey } from '@/lib/config';
export async function serverClient() {
  if (!hasSupabase) throw new Error('Supabase is not configured.');
  const { getToken } = await auth();
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, supabasePublicKey!, {
    accessToken: async () => getToken(),
  });
}
export function publicClient() {
  if (!hasSupabase) throw new Error('Supabase is not configured.');
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, supabasePublicKey!, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) =>
        fetch(input, { ...init, next: { revalidate: 3600, tags: ['content'] } }),
    },
  });
}
export function serviceClient() {
  if (!hasSupabase || !process.env.SUPABASE_SERVICE_ROLE_KEY)
    throw new Error('Service is not configured.');
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
export async function requireAdmin() {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) throw new Error('Sign in to continue.');
  const db = await serverClient();
  const { data: allowed, error: roleError } = await db.rpc('is_admin');
  if (roleError || !allowed) throw new Error('An approved editor account is required.');
  return { db, userId };
}
