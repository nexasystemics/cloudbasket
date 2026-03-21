'use client'
import { useEffect, useState } from 'react'
import { Star, ThumbsUp, Check } from 'lucide-react'
import { reviewAggregator, type AggregatedReview } from '@/services/apis/review-aggregator'
export default function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<AggregatedReview[]>([])
  const [form, setForm] = useState({ rating: 5, title: '', body: '', author: '' })
  const [submitted, setSubmitted] = useState(false)
  useEffect(() => { reviewAggregator.getProductReviews(productId).then(setReviews) }, [productId])
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0
  const submit = async () => {
    if (!form.body || !form.author) return
    await reviewAggregator.submitReview({ ...form, productId, source: 'internal' })
    setReviews(await reviewAggregator.getProductReviews(productId)); setSubmitted(true)
  }
  return (
    <div className="space-y-6">
      <div className="cb-card p-6 flex items-center gap-6">
        <div className="text-center">
          <p className="text-5xl font-black">{avg.toFixed(1)}</p>
          <div className="flex gap-0.5 mt-1 justify-center">{[1,2,3,4,5].map(s=><Star key={s} size={16} className={s<=avg?'fill-yellow-500 text-yellow-500':'text-zinc-300'}/>)}</div>
          <p className="text-xs text-[var(--cb-text-muted)] mt-1">{reviews.length} reviews</p>
        </div>
      </div>
      {reviews.map(r => (
        <div key={r.id} className="cb-card p-5">
          <div className="flex gap-0.5 mb-1">{[1,2,3,4,5].map(s=><Star key={s} size={12} className={s<=r.rating?'fill-yellow-500 text-yellow-500':'text-zinc-300'}/>)}</div>
          {r.title && <p className="font-black text-sm">{r.title}</p>}
          <p className="text-sm text-[var(--cb-text-secondary)] mt-1">{r.body}</p>
          <p className="text-xs text-[var(--cb-text-muted)] mt-2">{r.author.charAt(0)}*** · {new Date(r.date).toLocaleDateString('en-IN')}</p>
        </div>
      ))}
      {!submitted ? (
        <div className="cb-card p-6">
          <h3 className="font-black mb-4">Write a Review</h3>
          <div className="flex gap-1 mb-3">{[1,2,3,4,5].map(s=><button key={s} type="button" onClick={()=>setForm({...form,rating:s})}><Star size={24} className={s<=form.rating?'fill-yellow-500 text-yellow-500':'text-zinc-300'}/></button>)}</div>
          <input className="cb-input w-full mb-2" placeholder="Your name" value={form.author} onChange={e=>setForm({...form,author:e.target.value})}/>
          <textarea className="cb-input w-full h-20 resize-none mb-2" placeholder="Share your experience..." value={form.body} onChange={e=>setForm({...form,body:e.target.value})}/>
          <button type="button" onClick={submit} className="cb-btn cb-btn-primary">Submit Review</button>
        </div>
      ) : <div className="cb-card p-6 text-center"><Check size={32} className="text-green-500 mx-auto mb-2"/><p className="font-black">Thank you!</p></div>}
    </div>
  )
}