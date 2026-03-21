'use client'
// components/NotificationBell.tsx
// Notification bell with dropdown — shows unread alerts from localStorage.

import { useEffect, useState, useRef } from 'react'
import { Bell } from 'lucide-react'
import { getNotifications, markAllRead, type AppNotification } from '@/lib/notifications'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  if (diff < 60000) return 'just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return `${Math.floor(diff / 86400000)}d ago`
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => { setNotifications(getNotifications()) }, [])
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const unread = notifications.filter(n => !n.read).length

  const handleMarkAllRead = () => { markAllRead(); setNotifications(n => n.map(x => ({ ...x, read: true }))) }

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(!open)} className="relative p-2 rounded-xl hover:bg-[var(--cb-surface-2)] transition-colors" aria-label={`Notifications — ${unread} unread`}>
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 cb-card shadow-xl z-50">
          <div className="flex items-center justify-between p-4 border-b border-[var(--cb-border)]">
            <h3 className="font-black text-sm">Notifications</h3>
            {unread > 0 && <button type="button" onClick={handleMarkAllRead} className="text-xs text-skyline-primary hover:underline">Mark all read</button>}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-[var(--cb-text-muted)]">No notifications yet</div>
            ) : notifications.map(n => (
              <a key={n.id} href={n.url || '/deals'} className={`block p-4 border-b border-[var(--cb-border)] hover:bg-[var(--cb-surface-2)] transition-colors ${!n.read ? 'bg-blue-500/5' : ''}`}>
                <div className="flex items-start gap-2">
                  {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0" />}
                  <div className={!n.read ? '' : 'ml-4'}>
                    <p className="font-bold text-xs">{n.title}</p>
                    <p className="text-xs text-[var(--cb-text-muted)] mt-0.5">{n.message}</p>
                    <p className="text-[10px] text-[var(--cb-text-muted)] mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}