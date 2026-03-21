'use client'
import { useState } from 'react'
export default function SupportDeskPage() {
  const [tab, setTab] = useState<'open' | 'resolved'>('open')
  return (<main className="mx-auto max-w-7xl px-6 py-10"><h1 className="text-3xl font-black tracking-tighter mb-8">Support Desk</h1><div className="flex gap-2 mb-6">{(['open','resolved'] as const).map(t=><button key={t} type="button" onClick={()=>setTab(t)} className={`cb-btn text-sm ${tab===t?'cb-btn-primary':'cb-btn-ghost'}`}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>)}</div><div className="cb-card p-8 text-center"><p className="text-[var(--cb-text-muted)]">No {tab} tickets. Connect Supabase support_tickets table.</p></div></main>)
}