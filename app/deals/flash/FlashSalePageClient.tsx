'use client'

import { useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Zap, Clock, ExternalLink } from 'lucide-react'
import AffiliateDisclosureBanner from '@/components/AffiliateDisclosureBanner'
import { getFlashDeals, Deal } from '@/lib/deals-engine'

// Reuse getFlashDeals from engine, map to UI needs if necessary, but here we can use Deal directly
// with minor adaptations for rendering

const BADGE_STYLES: Record<string, string> = {
  'Flash Deal': 'bg-rose-500 text-white',
  'Best Seller': 'bg-orange-500 text-white',
  'Today Only': 'bg-purple-600 text-white',
  'Limited Stock': 'bg-blue-600 text-white',
  'Best Price': 'bg-green-600 text-white',
}

function getMillisecondsUntilMidnightIST(): number {
  const now = new Date()
  const utcNow = now.getTime() + now.getTimezoneOffset() * 60000
  const istNow = new Date(utcNow + 3600000 * 5.5)
  
  const istMidnight = new Date(istNow)
  istMidnight.setHours(24, 0, 0, 0)
  
  return Math.max(istMidnight.getTime() - istNow.getTime(), 0)
}

function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0')
  const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0')
  const s = (totalSeconds % 60).toString().padStart(2, '0')
  return `${h}:${m}:${s}`
}

export default function FlashSalePageClient() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    setDeals(getFlashDeals(12))
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    setTimeLeft(getMillisecondsUntilMidnightIST())

    if (mediaQuery.matches) {
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(getMillisecondsUntilMidnightIST())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const displayTime = useMemo(() => {
    if (timeLeft === null) return '00:00:00'
    return formatTime(timeLeft)
  }, [timeLeft])

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AffiliateDisclosureBanner />
      <section className="bg-gradient-to-r from-rose-600 to-orange-500 py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="mx-auto max-w-6xl px-6 text-center text-white relative z-10">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Zap size={32} className="text-yellow-300 fill-yellow-300 animate-pulse motion-reduce:animate-none" />
            <h1 className="text-5xl font-black tracking-tighter uppercase italic">Flash Sales</h1>
          </div>
          <p className="mb-8 text-rose-100 font-bold uppercase tracking-widest text-sm">Limited time. Maximum savings. Verified redirects.</p>
          
          <div className="inline-flex flex-col items-center gap-2 rounded-3xl border border-white/10 bg-black/30 px-10 py-6 shadow-2xl backdrop-blur-md">
            <div className="mb-1 flex items-center gap-2 text-yellow-300">
              <Clock size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sale ends in:</span>
            </div>
            {prefersReducedMotion ? (
              <span className="text-3xl font-black tracking-widest text-white">Sale ends at midnight IST</span>
            ) : (
              <span className="font-mono text-5xl font-black tracking-tighter text-white drop-shadow-lg tabular-nums">{displayTime}</span>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Active Flash Drops</h2>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Updated hourly</p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {deals.map((deal) => (
            <Link
              key={deal.id}
              href={`/products/${deal.id}`}
              className="group relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={deal.imageUrl}
                  alt={deal.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className={`absolute left-3 top-3 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg ${BADGE_STYLES[deal.label || 'Flash Deal']}`}>
                  {deal.label || 'Flash'}
                </span>
                <span className="absolute right-3 top-3 bg-white text-zinc-900 px-2.5 py-1 rounded-lg text-[10px] font-black shadow-lg">
                  -{deal.discountPercent}%
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div>
                  <p className="line-clamp-2 text-sm font-black leading-snug group-hover:text-rose-500 transition-colors">{deal.title}</p>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{deal.brand}</p>
                </div>
                <div className="mt-auto flex items-end justify-between">
                  <div>
                    <p className="text-xl font-black text-zinc-900 dark:text-white">₹{deal.dealPrice.toLocaleString('en-IN')}</p>
                    <p className="text-xs font-bold text-zinc-400 line-through tracking-tighter">₹{deal.originalPrice.toLocaleString('en-IN')}</p>
                  </div>
                  <span className="rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 px-2.5 py-1 text-[9px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">{deal.platform}</span>
                </div>
                <button className="cb-btn-primary h-11 rounded-xl mt-2 flex w-full items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest">
                  <ExternalLink size={14} /> Grab Deal
                </button>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}


