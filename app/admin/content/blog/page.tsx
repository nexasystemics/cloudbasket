'use client'
import { useState } from 'react'
import { Zap, Check, Clock, Eye } from 'lucide-react'

const CATEGORIES = ['buying-guide', 'deal-alert', 'brand-spotlight', 'how-to', 'product-review']

export default function BlogContentManagerPage() {
  const [tab, setTab] = useState<'generate' | 'review' | 'approved' | 'published'>('generate')
  const [form, setForm] = useState({ type: 'buying-guide', category: '', topic: '' })
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState<any[]>([])

  const handleGenerate = async () => {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 1500))
    setGenerated(prev => [{
      id: Date.now(),
      title: `Best ${form.category || form.topic} in India 2026`,
      wordCount: Math.floor(Math.random() * 500) + 600,
      status: 'pending_review',
      generatedAt: new Date().toISOString(),
    }, ...prev])
    setGenerating(false)
    setTab('review')
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-2">Blog Content Manager</h1>
      <div className="flex gap-2 mb-8">
        {(['generate', 'review', 'approved', 'published'] as const).map(t => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`cb-btn text-sm ${tab === t ? 'cb-btn-primary' : 'cb-btn-ghost'}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'generate' && (
        <div className="cb-card p-6 max-w-lg">
          <h2 className="font-black mb-4">Generate New Content</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-1">Content Type</label>
              <select className="cb-input w-full" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-1">Category / Topic</label>
              <input className="cb-input w-full" value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="e.g. Smartphones, Mixer Grinders" />
            </div>
            <button type="button" onClick={handleGenerate} disabled={generating} className="cb-btn cb-btn-primary w-full gap-2">
              <Zap size={16} /> {generating ? 'Generating with Gemini...' : 'Generate'}
            </button>
          </div>
        </div>
      )}

      {tab === 'review' && (
        <div className="space-y-3">
          <h2 className="text-xl font-black mb-4">Pending Review ({generated.length})</h2>
          {generated.length === 0 && <p className="text-[var(--cb-text-muted)]">No drafts yet. Generate content first.</p>}
          {generated.map(post => (
            <div key={post.id} className="cb-card p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-black">{post.title}</p>
                <div className="flex gap-3 mt-1 text-xs text-[var(--cb-text-muted)]">
                  <span><Clock size={11} className="inline mr-1" />{post.wordCount} words</span>
                  <span className="cb-badge">{post.status}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" className="cb-btn cb-btn-ghost text-xs gap-1"><Eye size={12} /> Preview</button>
                <button type="button" className="cb-btn cb-btn-primary text-xs gap-1"><Check size={12} /> Approve</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(tab === 'approved' || tab === 'published') && (
        <div className="cb-card p-8 text-center">
          <p className="text-[var(--cb-text-muted)]">No {tab} posts yet. Connect Gemini API and generate content.</p>
        </div>
      )}
    </main>
  )
}