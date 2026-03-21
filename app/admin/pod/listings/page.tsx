'use client'
import { useState } from 'react'
import { RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react'

const PLATFORMS = ['Printify','Printful','Etsy','Shopify','Amazon Merch','Redbubble']
const TABS = ['Overview','Design Matrix','Publish Queue','Platform Health','Revenue','Bulk Ops']

export default function MultiPlatformListingsPage() {
  const [tab, setTab] = useState('Overview')

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-2">Multi-Platform Listing Manager</h1>
      <div className="flex gap-2 mb-8 flex-wrap">
        {TABS.map(t=><button key={t} type="button" onClick={()=>setTab(t)} className={`cb-btn text-sm ${tab===t?'cb-btn-primary':'cb-btn-ghost'}`}>{t}</button>)}
      </div>

      {tab==='Overview' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PLATFORMS.map(p=>(
            <div key={p} className="cb-card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-black">{p}</h3>
                <span className="cb-badge bg-orange-500/10 text-orange-500">Not Connected</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-[var(--cb-text-muted)]">
                <span>Live: 0</span><span>Pending: 0</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==='Platform Health' && (
        <div className="space-y-3">
          {PLATFORMS.map(p=>(
            <div key={p} className="cb-card p-5 flex items-center gap-4">
              <AlertCircle size={18} className="text-orange-500 flex-shrink-0" />
              <span className="font-black">{p}</span>
              <span className="text-sm text-[var(--cb-text-muted)]">Not configured — add API key to .env.local</span>
              <span className="ml-auto cb-badge bg-orange-500/10 text-orange-500">Setup Required</span>
            </div>
          ))}
        </div>
      )}

      {(tab==='Design Matrix'||tab==='Publish Queue'||tab==='Revenue'||tab==='Bulk Ops') && (
        <div className="cb-card p-8 text-center">
          <p className="text-[var(--cb-text-muted)]">{tab} — Connect platform APIs and upload designs to populate this view.</p>
        </div>
      )}
    </main>
  )
}