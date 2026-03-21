'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'lucide-react'
import { Zap, Clock, ExternalLink } from 'lucide-react'
import { getDailyDeals } from '@/lib/deals-engine'

function getTimeUntilMidnight(): string {
  const now = new Date()
  const midnight = new Date()
  midnight.setHours(24, 0, 0, 0)
  const diff = midnight.getTime() - now.getTime()
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export default function DealOfTheDay() {
  const [timeLeft, setTimeLeft] = useState('00:00:00')
  const deals = getDailyDeals(3)
  const deal = deals[0]

  useEffect(() => {
    setTimeLeft(getTimeUntilMidnight())
    const interval = setInterval(() => setTimeLeft(getTimeUntilMidnight()), 1000)
    return () => clearInterval(interval)
  }, [])

  if (!deal) return null

  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <div className="cb-card overflow-hidden bg-gradient-to-r from-[#0F2D4A] to-[#1F4E79] text-white">
        <div className="flex flex-col md:flex-row">
          {/* Left — Deal Info */}
          <div className="flex-1 p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-1.5 text-xs font-black uppercase tracking-widest">
                <Zap size={12} className="fill-current" /> Deal of the Day
              </span>
              <span className="cb-badge bg-white/10 text-white border-white/20 text-xs">
                {deal.discountPercent}% OFF
              </span>
            </div>
            <h2 className="text-3xl font-black tracking-tight leading-tight">{deal.title}</h2>
            <p className="mt-2 text-white/70 text-sm">{(deal as any).subtitle}</p>
            <div className="mt-6 flex items-baseline gap-4">
              <span className="text-5xl font-black">₹{deal.dealPrice.toLocaleString('en-IN')}</span>
              <span className="text-xl text-white/50 line-through">₹{deal.originalPrice.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-green-400 font-black mt-1 text-sm">
              You save ₹{(deal.originalPrice - deal.dealPrice).toLocaleString('en-IN')}
            </p>
            <Link href={`/product/${deal.id}`} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white text-[#1F4E79] px-8 py-3 font-black text-sm hover:bg-white/90 transition-colors">
              <ExternalLink size={16} /> Grab This Deal
            </Link>
          </div>

          {/* Right — Countdown */}
          <div className="flex flex-col items-center justify-center bg-black/20 p-8 md:w-64">
            <p className="text-xs font-black uppercase tracking-widest text-white/60 mb-3">Deal Expires In</p>
            <div className="flex items-center gap-2">
              {timeLeft.split(':').map((unit, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="bg-white/10 rounded-xl w-16 h-16 flex items-center justify-center">
                    <span className="text-3xl font-black tabular-nums">{unit}</span>
                  </div>
                  <span className="text-[10px] text-white/50 mt-1 uppercase tracking-widest">
                    {i === 0 ? 'HRS' : i === 1 ? 'MIN' : 'SEC'}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-2 w-full">
              {deals.slice(1, 3).map((d) => (
                <Link key={d.id} href={`/product/${d.id}`} className="flex items-center justify-between bg-white/10 rounded-xl px-3 py-2 hover:bg-white/20 transition-colors">
                  <span className="text-xs font-bold line-clamp-1 flex-1">{d.title}</span>
                  <span className="text-xs font-black text-green-400 ml-2">-{d.discountPercent}%</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
