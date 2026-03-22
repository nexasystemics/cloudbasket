'use client'
import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import type { Notification } from '@/lib/realtime/notifications'
export default function NotificationBell({ userId }: { userId?: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  const unread = notifications.filter(n => !n.read).length
  useEffect(() => {
    if (!userId || !process.env.NEXT_PUBLIC_SUPABASE_URL) return
    import('@supabase/supabase-js').then(({ createClient }) => {
      const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
      sb.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(10).then(({ data }) => {
        if (data) setNotifications(data.map((n: any) => ({ id: n.id, userId: n.user_id, type: n.type, title: n.title, message: n.message, read: n.read, data: n.data, createdAt: n.created_at })))
      })
      const channel = sb.channel(`notifications:${userId}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, (payload) => {
        const n = payload.new as any
        setNotifications(prev => [{ id: n.id, userId: n.user_id, type: n.type, title: n.title, message: n.message, read: false, data: n.data, createdAt: n.created_at }, ...prev])
      }).subscribe()
      return () => { sb.removeChannel(channel) }
    }).catch(() => {})
  }, [userId])
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
        <Bell size={20} />
        {unread > 0 && <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">{unread > 9 ? '9+' : unread}</span>}
      </button>
      {open && (
        <div className="absolute right-0 top-10 w-80 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-2xl z-50 overflow-hidden">
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800"><p className="font-black text-sm">Notifications</p></div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? <p className="text-sm text-zinc-400 text-center py-8">No notifications</p> : notifications.map(n => (
              <div key={n.id} className={`p-4 border-b border-zinc-50 dark:border-zinc-800 ${!n.read ? 'bg-blue-500/5' : ''}`}>
                <p className="text-sm font-bold">{n.title}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{n.message}</p>
                <p className="text-[10px] text-zinc-400 mt-1">{new Date(n.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}