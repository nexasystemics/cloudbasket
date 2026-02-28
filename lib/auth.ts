import { createClient } from './supabase-server'

export async function getSession() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getTenant(headers: Headers): Promise<string> {
  return headers.get('x-tenant') || 'cloudbasket'
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
}