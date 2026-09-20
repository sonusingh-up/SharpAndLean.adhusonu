'use client';
import { createClient } from '@supabase/supabase-js';
import { supabasePublicKey } from '@/lib/config';
export function browserClient(getToken: () => Promise<string | null>) {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, supabasePublicKey!, {
    accessToken: getToken,
  });
}
