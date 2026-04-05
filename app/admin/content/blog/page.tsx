'use client'

// app/admin/content/blog/page.tsx
// Admin UI to generate, schedule and manage blog drafts.
// Uses BlogGenerator service + schedule config.

import { useState } from 'react'
import { blogGenerator, BlogDraft, BlogGeneratorInput } from '@/services/content/blog-generator'
import { getUpcomingPosts, formatScheduledDate, DEFAULT_SCHEDULE } from '@/lib/content/schedule'

const CATEGORIES = [
  'deals',
  'electronics',
  'fashion',
  'home-appliances',
  'personal-care',
  'food-grocery',
  'sports',
  'books',
]

export default function AdminBlogPage() {
  const [topic, setTopic] = useState('')
  const [category, setCategory] = useState('deals')
  const [keywords, setKeywords] = useState('')
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium')
  const [drafts, setDrafts] = useState<BlogDraft[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<BlogDraft | null>(null)

  const upcoming = getUpcomingPosts(DEFAULT_SCHEDULE, 7)

  async function handleGenerate() {
    if (!topic.trim()) {
      setError('Please enter a topic.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const input: BlogGeneratorInput = {
        topic: topic.trim(),
        category,
        keywords: keywords.split(',').map((k) => k.trim()).filter(Boolean),
        targetLength: length,
      }
      const draft = await blogGenerator.generate(input)
      if (draft) {
        setDrafts((prev) => [draft, ...prev])
        setSelected(draft)
      } else {
        setError('Generation failed. Please try again.')
      }
    } catch {
      setError('Unexpected error. Check console.')
    } finally {
      setLoading(false)
    }
  }

  function handleDelete(id: string) {
    setDrafts((prev) => prev.filter((d) => d.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  return (
    <div className="min-h-screen bg-[var(--cb-bg)] text-[var(--cb-text-primary)] p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Blog Content Pipeline</h1>
          <p className="text-[var(--cb-text-muted)] text-sm mt-1">
            Generate AI-powered blog drafts for CloudBasket
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Generator Form */}
          <div className="cb-card p-5 space-y-4">
            <h2 className="font-semibold text-lg">Generate Draft</h2>

            <div className="space-y-1">
              <label className="text-sm text-[var(--cb-text-muted)]">Topic *</label>
              <input
                className="cb-input w-full"
                placeholder="e.g. Best Smartphones Under ₹15000"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-[var(--cb-text-muted)]">Category</label>
              <select
                className="cb-input w-full"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-[var(--cb-text-muted)]">
                Keywords <span className="text-xs">(comma separated)</span>
              </label>
              <input
                className="cb-input w-full"
                placeholder="e.g. budget phone, 5G, india"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-[var(--cb-text-muted)]">Length</label>
              <div className="flex gap-2">
                {(['short', 'medium', 'long'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLength(l)}
                    className={`px-3 py-1 rounded text-sm capitalize border transition-colors ${
                      length === l
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-[var(--cb-border)] text-[var(--cb-text-muted)]'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="cb-btn cb-btn-primary w-full"
            >
              {loading ? 'Generating...' : '⚡ Generate Draft'}
            </button>
          </div>

          {/* Drafts List */}
          <div className="cb-card p-5 space-y-3">
            <h2 className="font-semibold text-lg">
              Drafts
              <span className="ml-2 cb-badge cb-badge-blue">{drafts.length}</span>
            </h2>

            {drafts.length === 0 && (
              <p className="text-[var(--cb-text-muted)] text-sm">
                No drafts yet. Generate one to get started.
              </p>
            )}

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  onClick={() => setSelected(draft)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selected?.id === draft.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-[var(--cb-border)] hover:border-blue-400'
                  }`}
                >
                  <p className="text-sm font-medium line-clamp-2">{draft.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="cb-badge cb-badge-green text-xs">{draft.category}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(draft.id) }}
                      className="text-red-400 text-xs hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Schedule */}
          <div className="cb-card p-5 space-y-3">
            <h2 className="font-semibold text-lg">Upcoming Schedule</h2>
            {upcoming.length === 0 && (
              <p className="text-[var(--cb-text-muted)] text-sm">No upcoming posts.</p>
            )}
            <div className="space-y-2">
              {upcoming.map((post) => (
                <div key={post.slotId} className="p-3 rounded-lg border border-[var(--cb-border)]">
                  <p className="text-sm font-medium line-clamp-1">{post.topic}</p>
                  <p className="text-xs text-[var(--cb-text-muted)] mt-1">
                    📅 {formatScheduledDate(post.scheduledFor)}
                  </p>
                  <span className="cb-badge cb-badge-orange text-xs">{post.category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Draft Preview */}
        {selected && (
          <div className="cb-card p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold text-lg">{selected.title}</h2>
                <p className="text-sm text-[var(--cb-text-muted)] mt-1">
                  {selected.metaDescription}
                </p>
              </div>
              <span className="cb-badge cb-badge-blue">{selected.status}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {selected.tags.map((tag) => (
                <span key={tag} className="cb-badge text-xs">#{tag}</span>
              ))}
            </div>

            <div
              className="prose prose-sm max-w-none text-[var(--cb-text-primary)] border-t border-[var(--cb-border)] pt-4"
              dangerouslySetInnerHTML={{ __html: selected.content }}
            />

            <div className="flex gap-3 pt-2">
              <button className="cb-btn cb-btn-primary text-sm">
                Publish to Blog
              </button>
              <button className="cb-btn cb-btn-ghost text-sm">
                Copy Content
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
