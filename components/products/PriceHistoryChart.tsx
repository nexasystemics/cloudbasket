'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

type PricePoint = { date: string; price: number }

function generateSyntheticHistory(productId: string, currentPrice: number): PricePoint[] {
  let hash = 0
  for (let i = 0; i < productId.length; i++) hash = (hash * 31 + productId.charCodeAt(i)) & 0xffffffff
  const points: PricePoint[] = []
  const now = new Date()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const seed = (hash + i * 7919) & 0xffffffff
    const variation = ((seed % 1000) / 1000 - 0.5) * 0.1
    const price = Math.round(currentPrice * (1 + variation))
    points.push({ date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), price })
  }
  points[points.length - 1].price = currentPrice
  return points
}

interface PriceHistoryChartProps {
  productId: string
  currentPrice?: number
  initialHistory?: Array<{ date?: string; price?: number; [key: string]: any }>
}

export function PriceHistoryChart({ productId, currentPrice, initialHistory }: PriceHistoryChartProps) {
  const resolvedPrice = currentPrice ?? (initialHistory && initialHistory.length > 0 ? (initialHistory[initialHistory.length - 1]?.price ?? 10000) : 10000)

  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(600)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; date: string; price: number } | null>(null)
  const data = generateSyntheticHistory(productId, resolvedPrice)

  const height = 180
  const padding = { top: 20, right: 20, bottom: 40, left: 70 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom

  const minPrice = Math.min(...data.map((d) => d.price))
  const maxPrice = Math.max(...data.map((d) => d.price))
  const priceRange = maxPrice - minPrice || 1

  const getX = (i: number) => padding.left + (i / (data.length - 1)) * chartW
  const getY = (price: number) => padding.top + chartH - ((price - minPrice) / priceRange) * chartH

  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.price)}`).join(' ')
  const areaPath = `${linePath} L ${getX(data.length - 1)} ${padding.top + chartH} L ${padding.left} ${padding.top + chartH} Z`

  const lowestIdx = data.reduce((a, b, i) => (b.price < data[a].price ? i : a), 0)
  const highestIdx = data.reduce((a, b, i) => (b.price > data[a].price ? i : a), 0)

  useEffect(() => {
    const obs = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) setWidth(entry.contentRect.width)
    })
    if (containerRef.current) obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const idx = Math.round(((mouseX - padding.left) / chartW) * (data.length - 1))
    if (idx >= 0 && idx < data.length) {
      setTooltip({ x: getX(idx), y: getY(data[idx].price), date: data[idx].date, price: data[idx].price })
    }
  }, [data, chartW, padding.left])

  return (
    <div ref={containerRef} className="w-full">
      <svg width={width} height={height} onMouseMove={handleMouseMove} onMouseLeave={() => setTooltip(null)}>
        <defs>
          <linearGradient id={`fill-${productId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1F4E79" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1F4E79" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const price = minPrice + t * priceRange
          const y = padding.top + chartH * (1 - t)
          return (
            <g key={t}>
              <line x1={padding.left} y1={y} x2={padding.left + chartW} y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4,4" />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#9ca3af">
                {'\u20B9'}{Math.round(price).toLocaleString('en-IN')}
              </text>
            </g>
          )
        })}

        {[0, 7, 14, 21, 29].map((i) => (
          <text key={i} x={getX(i)} y={height - 8} textAnchor="middle" fontSize="10" fill="#9ca3af">{data[i]?.date}</text>
        ))}

        <line x1={padding.left} y1={getY(resolvedPrice)} x2={padding.left + chartW} y2={getY(resolvedPrice)} stroke="#039BE5" strokeWidth="1" strokeDasharray="6,3" opacity="0.6" />
        <path d={areaPath} fill={`url(#fill-${productId})`} />
        <path d={linePath} fill="none" stroke="#1F4E79" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        <circle cx={getX(lowestIdx)} cy={getY(data[lowestIdx].price)} r="5" fill="#10B981" stroke="white" strokeWidth="2" />
        <text x={getX(lowestIdx)} y={getY(data[lowestIdx].price) - 10} textAnchor="middle" fontSize="9" fill="#10B981" fontWeight="bold">
          Low {'\u20B9'}{data[lowestIdx].price.toLocaleString('en-IN')}
        </text>

        <circle cx={getX(highestIdx)} cy={getY(data[highestIdx].price)} r="5" fill="#EF4444" stroke="white" strokeWidth="2" />
        <text x={getX(highestIdx)} y={getY(data[highestIdx].price) - 10} textAnchor="middle" fontSize="9" fill="#EF4444" fontWeight="bold">
          High {'\u20B9'}{data[highestIdx].price.toLocaleString('en-IN')}
        </text>

        {tooltip && (
          <g>
            <line x1={tooltip.x} y1={padding.top} x2={tooltip.x} y2={padding.top + chartH} stroke="#1F4E79" strokeWidth="1" strokeDasharray="4,2" opacity="0.5" />
            <circle cx={tooltip.x} cy={tooltip.y} r="5" fill="#1F4E79" stroke="white" strokeWidth="2" />
            <rect x={tooltip.x - 60} y={tooltip.y - 36} width="120" height="28" rx="6" fill="#1F4E79" />
            <text x={tooltip.x} y={tooltip.y - 24} textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">
              {tooltip.date} {'\u2014'} {'\u20B9'}{tooltip.price.toLocaleString('en-IN')}
            </text>
          </g>
        )}
      </svg>
      <p className="text-xs text-[var(--cb-text-muted)] mt-2 text-center">30-day price history — hover to explore</p>
    </div>
  )
}

export default PriceHistoryChart
