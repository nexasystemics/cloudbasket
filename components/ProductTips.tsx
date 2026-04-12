'use client'
import { useState, useEffect } from 'react'
import { ThumbsUp, Plus } from 'lucide-react'
type Tip = { id: string; content: string; author: string; helpful: number; createdAt: string }
export default function ProductTips({ productId }: { productId: string }) {
  const [tips, setTips] = useState<Tip[]>([])
  const [form, setForm] = useState({ content: '', author: '' })
  const [showing, setShowing] = useState(false)
  useEffect(() => { try { const s = localStorage.getItem(`cb_tips_${productId}`); if (s) setTips(JSON.parse(s)) } catch { /* no-op */ } }, [productId])
  const submit = () => {
    if (form.content.length < 20 || !form.author) return
    const tip: Tip = { id: Date.now().toString(), content: form.content, author: form.author.charAt(0) + '***', helpful: 0, createdAt: new Date().toISOString() }
    const updated = [tip, ...tips]; setTips(updated)
    try { localStorage.setItem(`cb_tips_${productId}`, JSON.stringify(updated)) } catch { /* no-op */ }
    setForm({ content: '', author: '' }); setShowing(false)
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-black">Shopper Tips ({tips.length})</h3>
        <button type="button" onClick={() => setShowing(!showing)} className="cb-btn cb-btn-ghost text-sm gap-1 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"><Plus size={14} />Add Tip</button>
      </div>
      {showing && (
        <div className="cb-card p-4 space-y-3">
          <input className="cb-input w-full" placeholder="Your name" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} />
          <textarea className="cb-input w-full h-20 resize-none" placeholder="Share a tip (min 20 chars)..." value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
          <button type="button" onClick={submit} className="cb-btn cb-btn-primary text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600">Submit</button>
        </div>
      )}
      {tips.length === 0 ? <p className="text-sm text-[var(--cb-text-muted)]">No tips yet. Be the first!</p> : tips.map(tip => (
        <div key={tip.id} className="cb-card p-4">
          <p className="text-sm">{tip.content}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-[var(--cb-text-muted)]">{tip.author}</span>
            <button type="button" className="flex items-center gap-1 text-xs text-[var(--cb-text-muted)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"><ThumbsUp size={12} />{tip.helpful}</button>
          </div>
        </div>
      ))}
    </div>
  )
}