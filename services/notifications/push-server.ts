// services/notifications/push-server.ts
// Web Push notification server with VAPID.
import { env, isConfigured } from '@/lib/env'
export type PushPayload = { title: string; body: string; icon: string; url: string; tag?: string }
export class PushNotificationServer {
  private isReady() { return isConfigured('NEXT_PUBLIC_VAPID_PUBLIC_KEY') && isConfigured('VAPID_PRIVATE_KEY') }
  async sendToSubscription(endpoint: string, p256dh: string, auth: string, payload: PushPayload): Promise<{ success: boolean }> {
    if (!this.isReady()) return { success: false }
    try { const webpush = await import('web-push'); webpush.setVapidDetails(`mailto:${env.VAPID_EMAIL}`, env.NEXT_PUBLIC_VAPID_PUBLIC_KEY, env.VAPID_PRIVATE_KEY); await webpush.sendNotification({ endpoint, keys: { p256dh, auth } }, JSON.stringify(payload)); return { success: true } } catch { return { success: false } }
  }
  async broadcastDealAlert(deal: { title: string; price: number; url: string }): Promise<void> {
    if (!isConfigured('NEXT_PUBLIC_SUPABASE_URL')) return
    try {
      const { createClient } = await import('@supabase/supabase-js'); const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
      const { data: subs } = await sb.from('push_subscriptions').select('endpoint,p256dh_key,auth_key').eq('active', true).limit(1000)
      if (!subs) return
      for (let i = 0; i < subs.length; i += 100) { await Promise.allSettled(subs.slice(i, i + 100).map((s: any) => this.sendToSubscription(s.endpoint, s.p256dh_key, s.auth_key, { title: '🔥 Deal Alert — CloudBasket', body: `${deal.title} at ₹${deal.price.toLocaleString('en-IN')}`, icon: '/brand/og-image.svg', url: deal.url }))); await new Promise(r => setTimeout(r, 500)) }
    } catch { /* no-op */ }
  }
}
export const pushServer = new PushNotificationServer()