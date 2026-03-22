// lib/realtime/notifications.ts — F19: Real-time notifications
import { hasSupabase, env } from '@/lib/env'
export type NotificationType = 'deal_alert' | 'price_drop' | 'order_update' | 'system' | 'promo'
export type Notification = { id: string; userId: string; type: NotificationType; title: string; message: string; read: boolean; data?: Record<string, any>; createdAt: string }
export async function createNotification(userId: string, type: NotificationType, title: string, message: string, data?: Record<string, any>): Promise<boolean> {
  if (!hasSupabase()) return false
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
    const { error } = await sb.from('notifications').insert({ user_id: userId, type, title, message, read: false, data: data || {} })
    return !error
  } catch { return false }
}
export async function getUserNotifications(userId: string, limit = 20): Promise<Notification[]> {
  if (!hasSupabase()) return []
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    const { data } = await sb.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(limit)
    return (data || []).map((n: any) => ({ id: n.id, userId: n.user_id, type: n.type, title: n.title, message: n.message, read: n.read, data: n.data, createdAt: n.created_at }))
  } catch { return [] }
}
export async function markAsRead(notificationId: string): Promise<void> {
  if (!hasSupabase()) return
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
    await sb.from('notifications').update({ read: true }).eq('id', notificationId)
  } catch { /* no-op */ }
}