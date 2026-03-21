'use client'
import { useState } from 'react'
import { Zap, Copy, Check } from 'lucide-react'
type SocialPost = { id: string; platform: string; content: string; status: string }
export default function SocialMediaHubPage() {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const generate = async () => {
    setLoading(true)
    try { const r = await fetch('/api/social/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'deals' }) }); const d = await r.json(); setPosts(d.posts || []) } catch { /* no-op */ }
    setLoading(false)
  }
  const copy = (id: string, content: string) => { try { navigator.clipboard.writeText(content); setCopied(id); setTimeout(() => setCopied(null), 2000) } catch { /* no-op */ } }
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-8">Social Media Hub</h1>
      <button type="button" onClick={generate} disabled={loading} className="cb-btn cb-btn-primary mb-6 gap-2"><Zap size={16} />{loading ? 'Generating...' : 'Generate All Platforms'}</button>
      <div className="space-y-4">
        {posts.map(p => (
          <div key={p.id} className="cb-card p-5">
            <div className="flex items-center gap-2 mb-2"><span className="font-black capitalize text-sm">{p.platform}</span><span className="cb-badge text-[10px]">{p.status}</span></div>
            <p className="text-sm whitespace-pre-line line-clamp-3">{p.content}</p>
            <button type="button" onClick={() => copy(p.id, p.content)} className="cb-btn cb-btn-ghost text-xs mt-2 gap-1">{copied === p.id ? <><Check size={12} />Copied!</> : <><Copy size={12} />Copy</>}</button>
          </div>
        ))}
      </div>
    </main>
  )
}