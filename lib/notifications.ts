// lib/notifications.ts
// Browser notification system — push subscriptions + local notifications.

export async function requestPermission(): Promise<'granted' | 'denied' | 'default'> {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'denied'
  return Notification.permission as 'granted' | 'denied' | 'default'
}

export async function subscribeToPush(): Promise<PushSubscription | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) return null
  try {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return null
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    if (!vapidKey) { console.warn('[Notifications] VAPID public key not configured'); return null }
    const reg = await navigator.serviceWorker.ready
    return await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: vapidKey })
  } catch (err) { console.warn('[Notifications] Subscribe error:', err); return null }
}

export function showLocalNotification(title: string, body: string, url?: string): void {
  if (typeof window === 'undefined' || Notification.permission !== 'granted') return
  try {
    const n = new Notification(title, { body, icon: '/brand/og-image.svg', badge: '/brand/og-image.svg' })
    if (url) n.onclick = () => { window.open(url, '_blank'); n.close() }
  } catch { /* no-op */ }
}

export type AppNotification = {
  id: string; title: string; message: string; url?: string
  read: boolean; createdAt: string; type: 'price_drop' | 'deal' | 'system'
}

export function getNotifications(): AppNotification[] {
  try {
    const stored = localStorage.getItem('cb_notifications')
    if (!stored) return []
    const all: AppNotification[] = JSON.parse(stored)
    const cutoff = Date.now() - 7 * 86400000
    return all.filter(n => new Date(n.createdAt).getTime() > cutoff)
  } catch { return [] }
}

export function markAllRead(): void {
  try {
    const notifications = getNotifications().map(n => ({ ...n, read: true }))
    localStorage.setItem('cb_notifications', JSON.stringify(notifications))
  } catch { /* no-op */ }
}

export function addNotification(notification: Omit<AppNotification, 'id' | 'read' | 'createdAt'>): void {
  try {
    const existing = getNotifications()
    const newN: AppNotification = { ...notification, id: Math.random().toString(36).substring(2), read: false, createdAt: new Date().toISOString() }
    localStorage.setItem('cb_notifications', JSON.stringify([newN, ...existing].slice(0, 50)))
  } catch { /* no-op */ }
}
