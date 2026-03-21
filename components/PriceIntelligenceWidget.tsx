'use client'
import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { priceIntelligence } from '@/services/price-engine/intelligence'
export default function PriceIntelligenceWidget({ productId }: { productId: string }) {
  const [trend, setTrend] = useState<'rising' | 'falling' | 'stable' | null>(null)
  useEffect(() => { priceIntelligence.predictPriceTrend(productId).then(setTrend) }, [productId])
  if (!trend) return null
  const cfg = { rising: { icon: TrendingUp, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Price Rising', advice: 'Buy soon' }, falling: { icon: TrendingDown, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Price Falling', advice: 'Good time to buy' }, stable: { icon: Minus, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Price Stable', advice: 'Price consistent recently' } }[trend]
  return (
    <div className={`flex items-center gap-3 rounded-xl p-3 ${cfg.bg}`}>
      <cfg.icon size={18} className={cfg.color} />
      <div><p className={`text-sm font-black ${cfg.color}`}>{cfg.label}</p><p className="text-xs text-[var(--cb-text-muted)]">{cfg.advice}</p></div>
    </div>
  )
}