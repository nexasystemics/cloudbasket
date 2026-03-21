'use client'
import { useState } from 'react'
import { RefreshCw } from 'lucide-react'

const PLATFORMS = ['Printify','Printful','Etsy','Shopify','Amazon Merch','Redbubble','CloudBasket']

export default function SyncDashboardPage() {
  const [syncing, setSyncing] = useState(false)
  const mockDesigns = [{id:'D001',name:'Sunset Gradient Tee'},{id:'D002',name:'Mountain Minimal'},{id:'D003',name:'Geometric Abstract'}]

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-8">Cross-Platform Sync</h1>
      <div className="cb-card overflow-hidden">
        <div className="p-5 border-b border-[var(--cb-border)] flex items-center justify-between">
          <h2 className="font-black">Design × Platform Status Matrix</h2>
          <button type="button" onClick={()=>setSyncing(true)} className="cb-btn cb-btn-primary text-sm gap-2"><RefreshCw size={14} className={syncing?'animate-spin':''} />Sync All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-[var(--cb-border)]">
              <th className="p-3 text-left font-black">Design</th>
              {PLATFORMS.map(p=><th key={p} className="p-3 text-center font-black">{p}</th>)}
            </tr></thead>
            <tbody>
              {mockDesigns.map(d=>(
                <tr key={d.id} className="border-b border-[var(--cb-border)]">
                  <td className="p-3 font-bold">{d.name}</td>
                  {PLATFORMS.map(p=><td key={p} className="p-3 text-center"><span className="w-3 h-3 rounded-full bg-orange-400 inline-block" title="Pending" /></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}