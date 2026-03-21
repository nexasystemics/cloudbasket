'use client'
import { useEffect, useState } from 'react'
import { Star, ThumbsUp, Check } from 'lucide-react'
import { reviewAggregator, type AggregatedReview } from '@/services/apis/review-aggregator'

export default function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<AggregatedReview[]>([])
  const [form, setForm] = useState({ rating: 5, title: '', body: '', author: '' })
  const [submitted, setSubmitted] = useState(false)
  const [sort, setSort] = useState<'recent' | 'helpful' | 'highest' | 'lowest'>('recent')

  useEffect(() => { reviewAggregator.getProductReviews(productId).then(setReviews) }, [productId])

  const sorted = [...reviews].sort((a, b) => {
    if (sort === 'helpful') return b.helpful - a.helpful
    if (sort === 'highest') return b.rating - a.rating
    if (sort === 'lowest') return a.rating - b.rating
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0

  const handleSubmit = async () => {
    if (!form.body || !form.author) return
    await reviewAggregator.submitReview({ ...form, productId, source: 'web-aggregated' })
    const updated = await reviewAggregator.getProductReviews(productId)
    setReviews(updated)
    setSubmitted(true)
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="cb-card p-6 flex items-center gap-6">
        <div className="text-center">
          <p className="text-5xl font-black">{avg.toFixed(1)}</p>
          <div className="flex gap-0.5 mt-1 justify-center">
            {[1,2,3,4,5].map(s => <Star key={s} size={16} className={s <= avg ? 'fill-yellow-500 text-yellow-500' : 'text-zinc-300'} />)}
          </div>
          <p className="text-xs text-[var(--cb-text-muted)] mt-1">{reviews.length} reviews</p>
        </div>
        <div className="flex-1">
          {[5,4,3,2,1].map(s => {
            const count = reviews.filter(r => r.rating === s).length
            const pct = reviews.length ? (count / reviews.length) * 100 : 0
            return (
              <div key={s} className="flex items-center gap-2 text-xs mb-1">
                <span className="w-3">{s}</span>
                <div className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-4 text-[var(--cb-text-muted)]">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-[var(--cb-text-muted)]">Sort:</span>
        {(['recent', 'helpful', 'highest', 'lowest'] as const).map(s => (
          <button key={s} type="button" onClick={() => setSort(s)} className={`cb-btn text-xs ${sort === s ? 'cb-btn-primary' : 'cb-btn-ghost'}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Reviews */}
      {sorted.length === 0 ? (
        <div className="cb-card p-8 text-center">
          <p className="text-[var(--cb-text-muted)]">No reviews yet. Be the first to review this product.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(review => (
            <div key={review.id} className="cb-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => <Star key={s} size={12} className={s <= review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-zinc-300'} />)}
                    </div>
                    {review.verified && <span className="cb-badge cb-badge-green text-[9px] gap-1"><Check size={8} /> Verified</span>}
                  </div>
                  {review.title && <p className="font-black text-sm">{review.title}</p>}
                  <p className="text-sm text-[var(--cb-text-secondary)] mt-1">{review.body}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-[var(--cb-text-muted)]">
                    <span>{review.author.charAt(0).toUpperCase()}***</span>
                    <span>{new Date(review.date).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
                <button type="button" className="flex items-center gap-1 text-xs text-[var(--cb-text-muted)] hover:text-skyline-primary">
                  <ThumbsUp size={12} /> {review.helpful}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit Review */}
      {!submitted ? (
        <div className="cb-card p-6">
          <h3 className="font-black mb-4">Write a Review</h3>
          <div className="space-y-3">
            <div className="flex gap-1">
              {[1,2,3,4,5].map(s => (
                <button key={s} type="button" onClick={() => setForm({...form, rating: s})}>
                  <Star size={24} className={s <= form.rating ? 'fill-yellow-500 text-yellow-500' : 'text-zinc-300'} />
                </button>
              ))}
            </div>
            <input className="cb-input w-full" placeholder="Your name" value={form.author} onChange={e => setForm({...form, author: e.target.value})} />
            <input className="cb-input w-full" placeholder="Review title (optional)" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            <textarea className="cb-input w-full h-24 resize-none" placeholder="Share your experience..." value={form.body} onChange={e => setForm({...form, body: e.target.value})} />
            <button type="button" onClick={handleSubmit} className="cb-btn cb-btn-primary">Submit Review</button>
          </div>
        </div>
      ) : (
        <div className="cb-card p-6 text-center">
          <Check size={32} className="text-green-500 mx-auto mb-2" />
          <p className="font-black">Thank you for your review!</p>
        </div>
      )}
    </div>
  )
}