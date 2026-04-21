// lib/notifications-store.ts
// Notification centre state management — localStorage backed

export type NotificationType = 'price-drop' | 'deal' | 'system' | 'new-products'

export type NotificationItem = {
  id: string
  type: NotificationType
  title: string
  message: string
  createdAt: string
  read: boolean
  dismissed: boolean
}

const STORAGE_KEY = 'cb_notifications'
const MAX_NOTIFICATIONS = 50

function load(): NotificationItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function save(items: NotificationItem[]): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_NOTIFICATIONS))) } catch { /* no-op */ }
}

export function addNotification(item: Omit<NotificationItem, 'id' | 'createdAt' | 'read' | 'dismissed'>): void {
  const items = load()
  items.unshift({ ...item, id: Math.random().toString(36).substring(2), createdAt: new Date().toISOString(), read: false, dismissed: false })
  save(items)
}

export function markRead(id: string): void {
  const items = load().map((n) => n.id === id ? { ...n, read: true } : n)
  save(items)
}

export function markAllRead(): void {
  save(load().map((n) => ({ ...n, read: true })))
}

export function dismissNotification(id: string): void {
  save(load().map((n) => n.id === id ? { ...n, dismissed: true } : n))
}

export function getUnreadCount(): number {
  return load().filter((n) => !n.read && !n.dismissed).length
}

export function getNotifications(): NotificationItem[] {
  return load().filter((n) => !n.dismissed)
}

export function clearOld(daysOld = 30): void {
  const cutoff = Date.now() - daysOld * 86400000
  save(load().filter((n) => new Date(n.createdAt).getTime() > cutoff))
}
