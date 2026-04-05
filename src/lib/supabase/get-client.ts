import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * Returns a guaranteed non-null Supabase client.
 * Throws if env is missing so callers never need null checks.
 */
export async function getSupabase() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error('[CloudBasket] Supabase client unavailable - check env vars');
  return supabase;
}
