'use client'
// components/products/PriceHistoryChart.tsx
// Purpose: Interactive SVG chart for visualizing price history.
// A20: Real-time data from price_history table.

import { useEffect, useState, useMemo } from 'react'
import type { PriceHistoryPoint } from '@/services/price-engine/tracker'

type Props = {
  productId: string
  initialHistory: PriceHistoryPoint[]
}

export function PriceHistoryChart({ productId, initialHistory }: Props) {
  const [history, setHistory] = useState<PriceHistoryPoint[]>(initialHistory)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // If we only have initial server data, we might want to refresh client-side
    // or if productId changes after mount (though usually page navigation handles this).
    async function refreshHistory() {
      try {
        setLoading(true)
        const res = await fetch(`/api/price-tracker?productId=${productId}`)
        if (res.ok) {
          const data = await res.json()
          setHistory(data)
        }
      } catch (err) {
        console.error('Failed to refresh price history:', err)
      } finally {
        setLoading(false)
      }
    }

    if (initialHistory.length === 0) {
      refreshHistory()
    }
  }, [productId, initialHistory.length])

  const chartData = useMemo(() => {
    if (history.length < 2) return null

    const minPrice = Math.min(...history.map(p => p.price))
    const maxPrice = Math.max(...history.map(p => p.price))
    const priceRange = maxPrice - minPrice || 100 // Avoid division by zero

    const width = 800
    const height = 200
    const padding = 20

    const points = history.map((p, i) => {
      const x = (i / (history.length - 1)) * (width - 2 * padding) + padding
      const y = height - padding - ((p.price - minPrice) / priceRange) * (height - 2 * padding)
      return { x, y, price: p.price, date: new Date(p.recorded_at).toLocaleDateString() }
    })

    const pathD = `M ${points[0].x} ${points[0].y} ` + 
      points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')

    const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`

    return { pathD, areaD, points, width, height, minPrice, maxPrice }
  }, [history])

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
          <svg className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        </div>
        <p className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">Insufficient Price History</p>
        <p className="mt-1 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Tracking started recently. Check back in 24 hours.</p>
      </div>
    )
  }

  return (
    <div className="relative mt-6 w-full overflow-hidden rounded-2xl bg-zinc-50/50 p-4 dark:bg-zinc-950/50">
      {chartData ? (
        <div className="relative">
          <svg 
            viewBox={`0 0 ${chartData.width} ${chartData.height}`} 
            className="h-[200px] w-full" 
            preserveAspectRatio="none"
          >
            {/* Area under curve */}
            <path d={chartData.areaD} fill="url(#priceGradient)" className="opacity-20" />
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#039BE5" />
                <stop offset="100%" stopColor="#039BE5" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Main line */}
            <path 
              d={chartData.pathD} 
              fill="none" 
              stroke="#039BE5" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
          
          <div className="mt-4 flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
            <span>{new Date(history[0].recorded_at).toLocaleDateString()}</span>
            <div className="flex gap-4">
              <span className="text-green-500">Min: ₹{chartData.minPrice.toLocaleString()}</span>
              <span className="text-red-500">Max: ₹{chartData.maxPrice.toLocaleString()}</span>
            </div>
            <span>{new Date(history[history.length - 1].recorded_at).toLocaleDateString()}</span>
          </div>
        </div>
      ) : (
        <div className="flex h-[200px] items-center justify-center">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
            {history.length} price points recorded — need at least 2 for chart.
          </p>
        </div>
      )}
    </div>
  )
}
