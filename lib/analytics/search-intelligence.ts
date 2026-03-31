// E49: Platform-Wide Search Analytics and Query Intelligence
import { hasSupabase, env } from '@/lib/env'

export type SearchEvent = { query: string; resultsCount: number; userAgent?: string; sessionId?: string; timestamp: string }
export type SearchInsight = { query: string; count: number; avgResults: number; zeroResultRate: number }

export async function trackSearchQuery(query: string, resultsCount: number, sessionId?: string): Promise<void> {
  if (!hasSupabase() || !query.trim()) return
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
    await sb.from('search_queries').insert({ query: query.toLowerCase().trim(), results_count: resultsCount, session_id: sessionId, created_at: new Date().toISOString() })
  } catch { /* no-op */ }
}

export async function getTopSearchQueries(limit = 20): Promise<SearchInsight[]> {
  if (!hasSupabase()) return []
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    const { data } = await sb.rpc('get_top_searches', { p_limit: limit })
    return data || []
  } catch { return [] }
}

export async function getZeroResultQueries(limit = 20): Promise<string[]> {
  if (!hasSupabase()) return []
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    const { data } = await sb.from('search_queries').select('query').eq('results_count', 0).order('created_at', { ascending: false }).limit(limit)
    return (data || []).map((r: { query: string }) => r.query)
  } catch { return [] }
}
