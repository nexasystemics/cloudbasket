'use client'
import { useState } from 'react'
import { Zap, Check, Clock } from 'lucide-react'
export default function BlogContentManagerPage() {
  const [tab, setTab] = useState<'generate' | 'review'>('generate')
  const [form, setForm] = useState({ category: '', topic: '' })
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState<any[]>([])
  const generate = async () => {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 1500))
    setGenerated(p => [{ id: Date.now(), title: `Best ${form.category || form.topic} in India 2026`, wordCount: Math.floor(Math.random() * 500) + 600, status: 'pending_review' }, ...p])
    setGenerating(false); setTab('review')
  }
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-2">Blog Content Manager</h1>
      <div className="flex gap-2 mb-8">
        {(['generate', 'review'] as const).map(t => <button key={t} type="button" onClick={() => setTab(t)} className={`cb-btn text-sm ${tab === t ? 'cb-btn-primary' : 'cb-btn-ghost'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>)}
      </div>
      {tab === 'generate' && (
        <div className="cb-card p-6 max-w-lg">
          <h2 className="font-black mb-4">Generate New Content</h2>
          <input className="cb-input w-full mb-3" placeholder="Category (e.g. Smartphones)" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          <button type="button" onClick={generate} disabled={generating} className="cb-btn cb-btn-primary w-full gap-2">
            <Zap size={16} />{generating ? 'Generating...' : 'Generate with Gemini'}
          </button>
        </div>
      )}
      {tab === 'review' && (
        <div className="space-y-3">
          {generated.length === 0 ? <p className="text-[var(--cb-text-muted)]">No drafts yet.</p> : generated.map(post => (
            <div key={post.id} className="cb-card p-5 flex items-center justify-between gap-4">
              <div><p className="font-black">{post.title}</p><p className="text-xs text-[var(--cb-text-muted)]">{post.wordCount} words</p></div>
              <button type="button" className="cb-btn cb-btn-primary text-xs gap-1"><Check size={12} />Approve</button>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}