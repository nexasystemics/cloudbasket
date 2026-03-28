// lib/auth.ts
// FIXED: was importing from './supabase-server' (legacy root file)
// Now imports from './supabase/server' (canonical SSR-aware client)

import { createServerSupabaseClient } from './supabase/server'

export async function getSession() {
  const supabase = await createServerSupabaseClient()
  if (!supabase) return null
  // NOTE: getSession() trusts the cookie without server validation.
  // Use getUser() in security-sensitive contexts (middleware already does this).
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getUser() {
  const supabase = await createServerSupabaseClient()
  if (!supabase) return null
  // getUser() validates the JWT against Supabase — use this for auth checks
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getTenant(headers: Headers): Promise<string> {
  return headers.get('x-tenant') || 'cloudbasket'
}

export async function signOut() {
  const supabase = await createServerSupabaseClient()
  if (!supabase) return
  await supabase.auth.signOut()
}
