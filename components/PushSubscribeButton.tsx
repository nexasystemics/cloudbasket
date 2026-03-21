'use client'
import { useEffect, useState } from 'react'
import { Bell, BellOff } from 'lucide-react'
export default function PushSubscribeButton() {
  const [status, setStatus] = useState<'unsupported' | 'denied' | 'subscribed' | 'unsubscribed'>('unsubscribed')
  useEffect(() => { if (!('serviceWorker' in navigator) || !('PushManager' in window)) { setStatus('unsupported'); return }; if (Notification.permission === 'denied') { setStatus('denied'); return }; navigator.serviceWorker.ready.then(r => r.pushManager.getSubscription()).then(s => { if (s) setStatus('subscribed') }).catch(() => { /* no-op */ }) }, [])
  const subscribe = async () => {
    try {
      const { publicKey } = await (await fetch('/api/push/vapid-key')).json(); if (!publicKey) return
      if (await Notification.requestPermission() !== 'granted') { setStatus('denied'); return }
      const reg = await navigator.serviceWorker.ready; const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: publicKey })
      await fetch('/api/push/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sub) }); setStatus('subscribed')
    } catch { /* no-op */ }
  }
  if (status === 'unsupported') return null
  if (status === 'denied') return <span className="text-xs text-[var(--cb-text-muted)]">Push blocked</span>
  return <button type="button" onClick={status === 'subscribed' ? undefined : subscribe} className={`cb-btn cb-btn-ghost text-sm gap-2 ${status === 'subscribed' ? 'text-green-500' : ''}`}>{status === 'subscribed' ? <><BellOff size={16} />Alerts On</> : <><Bell size={16} />Get Alerts</>}</button>
}