// F24: Gamification Leaderboard
import { hasSupabase, env } from '@/lib/env'
export type LeaderboardEntry = { rank: number; userId: string; displayName: string; points: number; level: string; badge: string }

export function getLevel(points: number): { level: string; badge: string; nextLevel: number } {
  if (points >= 10000) return { level: 'Legend', badge: '👑', nextLevel: 99999 }
  if (points >= 5000) return { level: 'Diamond', badge: '💎', nextLevel: 10000 }
  if (points >= 2000) return { level: 'Gold', badge: '🥇', nextLevel: 5000 }
  if (points >= 500) return { level: 'Silver', badge: '🥈', nextLevel: 2000 }
  if (points >= 100) return { level: 'Bronze', badge: '🥉', nextLevel: 500 }
  return { level: 'Starter', badge: '🌱', nextLevel: 100 }
}

export async function getLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
  if (!hasSupabase()) return []
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    const { data } = await sb.rpc('get_points_leaderboard', { p_limit: limit })
    return (data || []).map((row: any, i: number) => {
      const { level, badge } = getLevel(row.total_points)
      return { rank: i + 1, userId: row.user_id, displayName: row.display_name || `User ${row.user_id.slice(0, 6)}`, points: row.total_points, level, badge }
    })
  } catch { return [] }
}