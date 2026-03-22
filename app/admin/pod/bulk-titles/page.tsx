'use client'
import { useState } from 'react'
import { Zap, Download } from 'lucide-react'
import { bulkGenerateMeta, exportMetaAsCSV, type DesignMeta } from '@/services/pod/bulk-title-generator'

export default function BulkTitleGeneratorPage() {
  const [input, setInput] = useState('')
  const [platform, setPlatform] = useState<'amazon'|'etsy'|'redbubble'|'printify'>('etsy')
  const [results, setResults] = useState<DesignMeta[]>([])
  const [progress, setProgress] = useState({ done: 0, total: 0 })
  const [running, setRunning] = useState(false)

  const run = async () => {
    const designs = input.split('\n').map(d => d.trim()).filter(Boolean)
    if (!designs.length) return
    setRunning(true); setProgress({ done: 0, total: designs.length })
    const metas = await bulkGenerateMeta(designs, platform, (done, total) => setProgress({ done, total }))
    setResults(metas); setRunning(false)
  }

  const download = () => {
    const csv = exportMetaAsCSV(results)
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = `pod-titles-${platform}.csv`; a.click()
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-2">Bulk Title + Tag Generator</h1>
      <p className="text-[var(--cb-text-muted)] mb-8">Generate SEO-optimised titles and tags for up to 500 designs at once.</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div><label className="text-xs font-black uppercase tracking-widest block mb-1">Platform</label>
            <div className="flex gap-2">{(['amazon','etsy','redbubble','printify'] as const).map(p => <button key={p} type="button" onClick={() => setPlatform(p)} className={`cb-btn text-xs ${platform===p?'cb-btn-primary':'cb-btn-ghost'}`}>{p}</button>)}</div></div>
          <div><label className="text-xs font-black uppercase tracking-widest block mb-1">Design Descriptions (one per line)</label>
            <textarea className="cb-input w-full h-48 resize-none font-mono text-xs" placeholder="Mountain sunset watercolor&#10;Abstract geometric pattern&#10;Funny cat meme design" value={input} onChange={e => setInput(e.target.value)} /></div>
          <button type="button" onClick={run} disabled={running || !input.trim()} className="cb-btn cb-btn-primary w-full gap-2">
            <Zap size={16} />{running ? `Generating ${progress.done}/${progress.total}...` : 'Generate Titles + Tags'}</button>
          {running && <div className="h-2 bg-[var(--cb-surface-2)] rounded-full"><div className="h-full bg-skyline-primary rounded-full transition-all" style={{ width: `${progress.total > 0 ? (progress.done/progress.total)*100 : 0}%` }} /></div>}
        </div>
        <div>
          {results.length > 0 && <>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-black">Results ({results.length})</h2>
              <button type="button" onClick={download} className="cb-btn cb-btn-ghost text-sm gap-1"><Download size={14}/>CSV</button>
            </div>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {results.map((m, i) => (
                <div key={i} className="cb-card p-3 text-xs">
                  <p className="font-black mb-1">{m.title}</p>
                  <p className="text-[var(--cb-text-muted)] mb-1">{m.description.slice(0, 100)}...</p>
                  <div className="flex flex-wrap gap-1">{m.tags.map(t => <span key={t} className="cb-badge bg-zinc-100 dark:bg-zinc-800 text-[9px]">{t}</span>)}</div>
                </div>
              ))}
            </div>
          </>}
        </div>
      </div>
    </main>
  )
}