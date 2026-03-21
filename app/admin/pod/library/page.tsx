'use client'
import { useEffect, useState } from 'react'
import { Check, Search } from 'lucide-react'
import { designLibrary, type PODDesign } from '@/services/pod/design-library'

export default function DesignLibraryPage() {
  const [designs, setDesigns] = useState<PODDesign[]>([])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all'|'approved'|'pending'>('all')

  useEffect(() => { designLibrary.searchDesigns({approved:filter==='all'?undefined:filter==='approved'}).then(setDesigns) }, [filter])

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-8">Design Library</h1>
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cb-text-muted)]" /><input className="cb-input w-full pl-9" placeholder="Search designs..." value={query} onChange={e=>setQuery(e.target.value)} /></div>
        {(['all','approved','pending'] as const).map(f=><button key={f} type="button" onClick={()=>setFilter(f)} className={`cb-btn text-sm ${filter===f?'cb-btn-primary':'cb-btn-ghost'}`}>{f.charAt(0).toUpperCase()+f.slice(1)}</button>)}
      </div>
      {designs.length===0?<div className="cb-card p-12 text-center"><p className="text-[var(--cb-text-muted)]">No designs yet. Upload designs via the Bulk Upload page.</p></div>:(
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {designs.filter(d=>!query||d.name.toLowerCase().includes(query.toLowerCase())).map(d=>(
            <div key={d.id} className="cb-card p-3">
              <div className="aspect-square bg-[var(--cb-surface-2)] rounded-xl mb-3"><img src={d.imageUrl} alt={d.name} className="w-full h-full object-cover rounded-xl" /></div>
              <p className="text-xs font-black truncate">{d.name}</p>
              <div className="flex items-center justify-between mt-2">
                <span className={`cb-badge text-[9px] ${d.approved?'cb-badge-green':'bg-orange-500/10 text-orange-500'}`}>{d.approved?'Approved':'Pending'}</span>
                {!d.approved&&<button type="button" onClick={()=>designLibrary.approveDesign(d.id).then(()=>setDesigns(prev=>prev.map(x=>x.id===d.id?{...x,approved:true}:x)))} className="cb-btn text-[10px] py-0.5 px-2 bg-green-500/10 text-green-500"><Check size={10}/></button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}