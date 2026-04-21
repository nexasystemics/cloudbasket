import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

const hasSupabase = supabaseUrl !== '' && supabaseAnonKey !== ''
const hasSupabaseAdmin = supabaseUrl !== '' && supabaseServiceRoleKey !== ''

if (!hasSupabase) {
  console.warn('Supabase client is disabled: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.')
}

if (!hasSupabaseAdmin) {
  console.warn('Supabase admin client is disabled: SUPABASE_SERVICE_ROLE_KEY is missing.')
}

export const supabase: SupabaseClient | null = hasSupabase
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const supabaseAdmin: SupabaseClient | null = hasSupabaseAdmin
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null
