'use client'

// app/admin/price-intelligence/page.tsx
// Admin UI to analyse and compare product prices across platforms.

import { useState } from 'react'
import {
  priceIntelligence,
  PriceIntelligence,
} from '@/services/price-engine/price-intelligence'

const SAMPLE_PRODUCTS = [
  { id: 'boat-rockerz-450', name: 'boAt Rockerz 450 Headphones' },
  { id: 'samsung-galaxy-m14', name: 'Samsung Galaxy M14 5G' },
  { id: 'bajaj-mixer-grinder', name: 'Bajaj Platini Mixer Grinder' },
  { id: 'hul-dove-soap', name: 'Dove Beauty Soap Bar' },
  { id: 'puma-running-shoes', name: 'Puma Running Shoes' },
]

const RECOMMENDATION_STYLES = {
  'buy-now': 'cb-badge-blue',
  'wait': 'cb-badge-orange',
  'best-price': 'cb-badge-green',
}

const RECOMMENDATION_LABELS = {
  'buy-now': '🛒 Buy Now',
  'wait': '⏳ Wait for Better Price',
  'best-price': '🏆 Best Price Now!',
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function MiniChart({ history }: { history: { price: number }[] }) {
  const prices = history.map((h) => h.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const range = max - min || 1
  const width = 300
  const height = 60
  const points = prices
    .slice(-30)
    .map((p, i) => {
      const x = (i / 29) * width
      const y = height - ((p - min) / range) * height
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-16">
      <polyline
        points={points}
        fill="none"
        stroke="#3B82F6"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function PriceIntelligencePage() {
  const [selected, setSelected] = useState(SAMPLE_PRODUCTS[0])
  const [data, setData] = useState<PriceIntelligence | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [customId, setCustomId] = useState('')
  const [customName, setCustomName] = useState('')

  async function handleAnalyse(id: string, name: string) {
    if (!id || !name) { setError('ID and name required.'); return }
    setError('')
    setLoading(true)
    try {
      const result = await priceIntelligence.analyse(id, name)
      setData(result)
    } catch {
      setError('Analysis failed. Check console.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--cb-bg)] text-[var(--cb-text-primary)] p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Price Intelligence Engine</h1>
          <p className="text-[var(--cb-text-muted)] text-sm mt-1">
            Compare prices across Amazon, Flipkart and CloudBasket
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
                  onClick={() => setSelected(p)}
                  className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                    selected.id === p.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-[var(--cb-border)] hover:border-blue-400'
                  }`}
                >
                  <p className="font-medium line-clamp-1">{p.name}</p>
                  <p className="text-xs text-[var(--cb-text-muted)]">{p.id}</p>
                </button>
              ))}
            </div>

            <div className="border-t border-[var(--cb-border)] pt-3 space-y-2">
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
                onClick={() => handleAnalyse(customId, customName)}
                disabled={loading}
                className="cb-btn cb-btn-ghost w-full text-sm"
              >
                Analyse Custom
              </button>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              onClick={() => handleAnalyse(selected.id, selected.name)}
              disabled={loading}
              className="cb-btn cb-btn-primary w-full"
            >
              {loading ? 'Analysing...' : '📊 Analyse Prices'}
            </button>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-4">
            {!data && !loading && (
              <div className="cb-card p-10 text-center text-[var(--cb-text-muted)]">
                Select a product and click Analyse Prices
              </div>
            )}

            {loading && (
              <div className="cb-card p-10 text-center text-[var(--cb-text-muted)]">
                Fetching prices...
              </div>
            )}

            {data && !loading && (
              <>
                {/* Summary Card */}
                <div className="cb-card p-5 space-y-3">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h2 className="font-semibold">{data.productName}</h2>
                      <p className="text-xs text-[var(--cb-text-muted)]">{data.productId}</p>
                    </div>
                    <span className={`cb-badge ${RECOMMENDATION_STYLES[data.recommendation]}`}>
                      {RECOMMENDATION_LABELS[data.recommendation]}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                      <p className="text-xs text-[var(--cb-text-muted)]">Lowest</p>
                      <p className="font-bold text-green-600">{formatINR(data.lowestPrice)}</p>
                    </div>
                    <div className="bg-[var(--cb-surface-2)] rounded-lg p-3">
                      <p className="text-xs text-[var(--cb-text-muted)]">Average</p>
                      <p className="font-bold">{formatINR(data.averagePrice)}</p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                      <p className="text-xs text-[var(--cb-text-muted)]">Highest</p>
                      <p className="font-bold text-red-500">{formatINR(data.highestPrice)}</p>
                    </div>
                  </div>

                  {data.priceDropPercent > 0 && (
                    <p className="text-green-600 text-sm font-medium">
                      🎉 {data.priceDropPercent}% drop from 30-day high!
                    </p>
                  )}
                </div>

                {/* Price Comparison */}
                <div className="cb-card p-5 space-y-3">
                  <h3 className="font-semibold">Price Comparison</h3>
                  <div className="space-y-2">
                    {data.allPrices.map((p) => (
                      <div
                        key={p.source}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          p.price === data.lowestPrice
                            ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                            : 'border-[var(--cb-border)]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="capitalize font-medium text-sm">{p.source}</span>
                          {p.price === data.lowestPrice && (
                            <span className="cb-badge cb-badge-green text-xs">Best</span>
                          )}
                          {!p.inStock && (
                            <span className="cb-badge text-xs">Out of Stock</span>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatINR(p.price)}</p>
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline"
                          >
                            View →
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price History Chart */}
                <div className="cb-card p-5 space-y-3">
                  <h3 className="font-semibold">30-Day Price History</h3>
                  <MiniChart history={data.history} />
                  <div className="flex justify-between text-xs text-[var(--cb-text-muted)]">
                    <span>30 days ago</span>
                    <span>Today</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
