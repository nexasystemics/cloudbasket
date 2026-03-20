'use client'
import { useState } from 'react'
import { Zap, RefreshCw, Check, AlertCircle, FileText } from 'lucide-react'
import { INDIA_CATALOG } from '@/lib/india-catalog'

export default function ContentGeneratorPage() {
  const [generating, setGenerating] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, { seoTitle: string; description: string }>>({})
  const [error, setError] = useState<string | null>(null)

  const withoutDescriptions = INDIA_CATALOG.filter((p) => !p.description || p.description.length < 50).slice(0, 20)

  const generateOne = async (productId: string) => {
    setGenerating(productId)
    setError(null)
    try {
      const res = await fetch('/api/content/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })
      const data = await res.json()
      if (data.content) setResults((r) => ({ ...r, [productId]: data.content }))
    } catch {
      setError('Generation failed — check Gemini API key')
    } finally {
      setGenerating(null)
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-2">Content Generator</h1>
      <p className="text-[var(--cb-text-muted)] mb-8">AI-powered product descriptions using Google Gemini</p>

      {error && (
        <div className="cb-card p-4 mb-6 border-red-500/20 bg-red-500/5 flex items-center gap-2 text-red-500">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="cb-card p-5 text-center">
          <p className="text-3xl font-black text-skyline-primary">{INDIA_CATALOG.length}</p>
          <p className="text-xs text-[var(--cb-text-muted)] mt-1">Total Products</p>
        </div>
        <div className="cb-card p-5 text-center">
          <p className="text-3xl font-black text-orange-500">{withoutDescriptions.length}</p>
          <p className="text-xs text-[var(--cb-text-muted)] mt-1">Need Descriptions</p>
        </div>
        <div className="cb-card p-5 text-center">
          <p className="text-3xl font-black text-green-500">{Object.keys(results).length}</p>
          <p className="text-xs text-[var(--cb-text-muted)] mt-1">Generated This Session</p>
        </div>
      </div>

      <div className="cb-card overflow-hidden">
        <div className="p-5 border-b border-[var(--cb-border)] flex items-center justify-between">
          <h2 className="font-black">Products Needing Descriptions</h2>
          <span className="cb-badge">Showing first 20</span>
        </div>
        <div className="divide-y divide-[var(--cb-border)]">
          {withoutDescriptions.map((product) => (
            <div key={product.id} className="p-4 flex items-start gap-4">
              <div className="flex-1">
                <p className="font-bold text-sm">{product.name}</p>
                <p className="text-xs text-[var(--cb-text-muted)]">{product.brand} · {product.category}</p>
                {results[product.id] && (
                  <div className="mt-2 p-3 bg-[var(--cb-surface-2)] rounded-xl">
                    <p className="text-xs font-black text-skyline-primary mb-1">{results[product.id].seoTitle}</p>
                    <p className="text-xs text-[var(--cb-text-muted)]">{results[product.id].description}</p>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => generateOne(product.id)}
                disabled={generating === product.id}
                className="cb-btn cb-btn-primary text-xs gap-2 flex-shrink-0"
              >
                {generating === product.id ? (
                  <><RefreshCw size={12} className="animate-spin" /> Generating...</>
                ) : results[product.id] ? (
                  <><Check size={12} /> Regenerate</>
                ) : (
                  <><Zap size={12} /> Generate</>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}