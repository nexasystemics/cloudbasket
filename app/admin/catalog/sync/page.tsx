'use client'
import { useState } from 'react'
import { RefreshCw, Check } from 'lucide-react'
type SyncResult = { source: string; productsChecked: number; pricesUpdated: number; errors: number }
export default function CatalogSyncPage() {
  const [results, setResults] = useState<SyncResult[]>([])
  const [syncing, setSyncing] = useState<string | null>(null)
  const trigger = async (source: string) => {
    setSyncing(source)
    const trigger = async (source: string) => {
    setSyncing(source)
    try {
      const r = await fetch('/api/catalog/sync', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ source }) })
      const data = await r.json()
      setResults(p => [data, ...p.filter(x => x.source !== source)])
    } catch { /* no-op */ }
    setSyncing(null)
  }
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-8">Catalog Sync</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(['amazon','flipkart','cj'] as const).map(s => {
          const r = results.find(x => x.source === s)
          return (
            <div key={s} className="cb-card p-5">
              <div className="flex items-center justify-between mb-3"><h3 className="font-black capitalize">{s}</h3>{r && <span className="cb-badge cb-badge-green"><Check size={10} />Done</span>}</div>
              {r && <p className="text-xs text-[var(--cb-text-muted)] mb-3">Checked: {r.productsChecked} | Updated: {r.pricesUpdated}</p>}
              <button type="button" onClick={() => trigger(s)} disabled={syncing === s} className="cb-btn cb-btn-primary w-full text-sm gap-2"><RefreshCw size={14} className={syncing === s ? 'animate-spin' : ''} />{syncing === s ? 'Syncing...' : 'Sync Now'}</button>
            </div>
          )
        })}
      </div>
    </main>
  )
}}