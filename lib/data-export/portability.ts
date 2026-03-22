// F98: Data Export and Portability (GDPR/DPDP compliance)
import { hasSupabase, env } from '@/lib/env'

export async function exportUserData(userId: string): Promise<Record<string, any> | null> {
  if (!hasSupabase()) return null
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
    const [points, notifications, searches] = await Promise.allSettled([
      sb.from('user_points').select('*').eq('user_id', userId),
      sb.from('notifications').select('*').eq('user_id', userId),
      sb.from('search_queries').select('query, created_at').eq('session_id', userId).limit(100),
    ])
    return {
      exportedAt: new Date().toISOString(), userId,
      points: points.status === 'fulfilled' ? points.value.data : [],
      notifications: notifications.status === 'fulfilled' ? notifications.value.data : [],
      searches: searches.status === 'fulfilled' ? searches.value.data : [],
    }
  } catch { return null }
}

export async function deleteUserData(userId: string): Promise<boolean> {
  if (!hasSupabase()) return false
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
    await Promise.allSettled([
      sb.from('user_points').delete().eq('user_id', userId),
      sb.from('notifications').delete().eq('user_id', userId),
    ])
    return true
  } catch { return false }
}