'use client'

// app/admin/content/reviews/page.tsx
// Admin UI to aggregate and manage product reviews.

import { useState } from 'react'
import {
  reviewAggregator,
  AggregatedReviews,
} from '@/services/reviews/review-aggregator'

const SAMPLE_PRODUCTS = [
  { id: 'boat-rockerz-450', name: 'boAt Rockerz 450 Bluetooth Headphones' },
  { id: 'hul-dove-soap', name: 'Dove Beauty Soap Bar' },
  { id: 'samsung-galaxy-m14', name: 'Samsung Galaxy M14 5G' },
  { id: 'bajaj-mixer-grinder', name: 'Bajaj Platini Mixer Grinder' },
  { id: 'puma-running-shoes', name: 'Puma Running Shoes' },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-amber-400">
      {'★'.repeat(Math.round(rating))}
      {'☆'.repeat(5 - Math.round(rating))}
    </span>
  )
}

function RatingBar({
  star,
  count,
  total,
}: {
  star: number
  count: number
  total: number
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-4 text-right text-[var(--cb-text-muted)]">{star}</span>
      <span className="text-amber-400 text-xs">★</span>
      <div className="flex-1 bg-[var(--cb-surface-2)] rounded-full h-2">
        <div
          className="bg-amber-400 h-2 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-xs text-[var(--cb-text-muted)]">{count}</span>
    </div>
  )
}

export default function AdminReviewsPage() {
  const [selectedProduct, setSelectedProduct] = useState(SAMPLE_PRODUCTS[0])
  const [customId, setCustomId] = useState('')
  const [customName, setCustomName] = useState('')
  const [data, setData] = useState<AggregatedReviews | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleFetch(productId: string, productName: string) {
    if (!productId || !productName) {
      setError('Product ID and name are required.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const result = await reviewAggregator.aggregate(productId, productName)
      setData(result)
    } catch {
      setError('Failed to fetch reviews. Check console.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--cb-bg)] text-[var(--cb-text-primary)] p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Review Aggregator</h1>
          <p className="text-[var(--cb-text-muted)] text-sm mt-1">
            Aggregate product reviews from Amazon, Flipkart and CloudBasket
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Controls */}
          <div className="cb-card p-5 space-y-4">
            <h2 className="font-semibold">Select Product</h2>

            <div className="space-y-2">
              {SAMPLE_PRODUCTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                    selectedProduct.id === p.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-[var(--cb-border)] hover:border-blue-400'
                  }`}
                >
                  <p className="font-medium line-clamp-1">{p.name}</p>
                  <p className="text-xs text-[var(--cb-text-muted)]">{p.id}</p>
                </button>
              ))}
            </div>

            <div className="border-t border-[var(--cb-border)] pt-4 space-y-2">
              <p className="text-sm font-medium">Custom Product</p>
              <input
                className="cb-input w-full text-sm"
                placeholder="Product ID"
                value={customId}
                onChange={(e) => setCustomId(e.target.value)}
              />
              <input
                className="cb-input w-full text-sm"
                placeholder="Product Name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
              <button
                onClick={() => handleFetch(customId, customName)}
                disabled={loading}
                className="cb-btn cb-btn-ghost w-full text-sm"
              >
                Fetch Custom
              </button>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              onClick={() =>
                handleFetch(selectedProduct.id, selectedProduct.name)
              }
              disabled={loading}
              className="cb-btn cb-btn-primary w-full"
            >
              {loading ? 'Fetching...' : '⭐ Fetch Reviews'}
            </button>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-4">
            {!data && !loading && (
              <div className="cb-card p-10 text-center text-[var(--cb-text-muted)]">
                Select a product and click Fetch Reviews
              </div>
            )}

            {loading && (
              <div className="cb-card p-10 text-center text-[var(--cb-text-muted)]">
                Aggregating reviews...
              </div>
            )}

            {data && !loading && (
              <>
                {/* Summary */}
                <div className="cb-card p-5">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                      <h2 className="font-semibold text-lg">{data.productName}</h2>
                      <p className="text-xs text-[var(--cb-text-muted)] mt-1">
                        ID: {data.productId}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{data.averageRating}</div>
                      <StarRating rating={data.averageRating} />
                      <p className="text-xs text-[var(--cb-text-muted)] mt-1">
                        {data.totalReviews} reviews
                      </p>
                    </div>
                  </div>

                  {/* Rating Breakdown */}
                  <div className="mt-4 space-y-1">
                    {([5, 4, 3, 2, 1] as const).map((star) => (
                      <RatingBar
                        key={star}
                        star={star}
                        count={data.ratingBreakdown[star]}
                        total={data.totalReviews}
                      />
                    ))}
                  </div>
                </div>

                {/* Review List */}
                <div className="space-y-3">
                  {data.reviews.map((review) => (
                    <div key={review.id} className="cb-card p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-sm">{review.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <StarRating rating={review.rating} />
                            {review.verified && (
                              <span className="cb-badge cb-badge-green text-xs">
                                ✓ Verified
                              </span>
                            )}
                            <span className="cb-badge text-xs capitalize">
                              {review.source}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-[var(--cb-text-muted)] whitespace-nowrap">
                          {new Date(review.date).toLocaleDateString('en-IN')}
                        </span>
                      </div>

                      <p className="text-sm text-[var(--cb-text-secondary)]">
                        {review.body}
                      </p>

                      <div className="flex items-center justify-between text-xs text-[var(--cb-text-muted)]">
                        <span>— {review.author}</span>
                        <span>👍 {review.helpful} found helpful</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
