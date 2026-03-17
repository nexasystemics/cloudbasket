'use client'

import { useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Zap, Clock, ExternalLink } from 'lucide-react'
import AffiliateDisclosureBanner from '@/components/AffiliateDisclosureBanner'

type DealItem = {
  id: string
  title: string
  subtitle: string
  discount: number
  originalPrice: number
  dealPrice: number
  platform: 'Amazon' | 'Flipkart' | 'CJ Global'
  image: string
  badge: 'Flash' | 'Hot' | 'Exclusive' | 'Limited'
  productId: string
}

const DEALS_DATA: readonly DealItem[] = [
  { id: 'deal-1', title: 'Samsung Galaxy S25 Ultra', subtitle: '256GB · Snapdragon · 5G', discount: 18, originalPrice: 149999, dealPrice: 122999, platform: 'Amazon', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80', badge: 'Flash', productId: 'mob-001' },
  { id: 'deal-2', title: 'MacBook Air M3 13"', subtitle: '8GB · 256GB SSD · Liquid Retina', discount: 12, originalPrice: 124900, dealPrice: 104900, platform: 'Amazon', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80', badge: 'Hot', productId: 'lap-005' },
  { id: 'deal-3', title: 'Sony WH-1000XM5', subtitle: 'ANC · 30hr battery · Bluetooth', discount: 17, originalPrice: 29990, dealPrice: 24990, platform: 'Amazon', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80', badge: 'Flash', productId: 'ele-003' },
  { id: 'deal-4', title: 'OnePlus 12R 5G', subtitle: '256GB · 100W · Snapdragon 8 Gen 2', discount: 15, originalPrice: 45999, dealPrice: 38999, platform: 'Flipkart', image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&q=80', badge: 'Limited', productId: 'mob-003' },
  { id: 'deal-5', title: 'ASUS Vivobook 15 OLED', subtitle: 'Ryzen 5 · 16GB · 512GB SSD', discount: 18, originalPrice: 67990, dealPrice: 55990, platform: 'Amazon', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&q=80', badge: 'Hot', productId: 'lap-004' },
  { id: 'deal-6', title: 'Garmin Forerunner 165', subtitle: 'GPS · AMOLED · Running Watch', discount: 18, originalPrice: 33990, dealPrice: 27990, platform: 'Amazon', image: 'https://images.unsplash.com/photo-1517438984742-1262db08379e?w=400&q=80', badge: 'Exclusive', productId: 'spo-005' },
  { id: 'deal-7', title: 'Philips Air Fryer 4.2L', subtitle: '1400W · Preset menu · Easy clean', discount: 19, originalPrice: 7999, dealPrice: 6499, platform: 'Amazon', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80', badge: 'Flash', productId: 'hom-001' },
  { id: 'deal-8', title: 'Xiaomi Redmi Note 13 Pro 5G', subtitle: '256GB · 200MP · 67W charge', discount: 17, originalPrice: 28999, dealPrice: 23999, platform: 'Flipkart', image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&q=80', badge: 'Hot', productId: 'mob-004' },
]

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

const BADGE_STYLES: Record<DealItem['badge'], string> = {
  Flash: 'bg-rose-500 text-white',
  Hot: 'bg-orange-500 text-white',
  Exclusive: 'bg-purple-600 text-white',
  Limited: 'bg-blue-600 text-white',
}

export default function FlashSalePageClient() {
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
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
          {DEALS_DATA.map((deal) => (
            <Link
              key={deal.id}
              href={`/products/${deal.productId}`}
              className="group relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={deal.image}
                  alt={deal.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className={`absolute left-3 top-3 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg ${BADGE_STYLES[deal.badge]}`}>
                  {deal.badge}
                </span>
                <span className="absolute right-3 top-3 bg-white text-zinc-900 px-2.5 py-1 rounded-lg text-[10px] font-black shadow-lg">
                  -{deal.discount}%
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div>
                  <p className="line-clamp-2 text-sm font-black leading-snug group-hover:text-rose-500 transition-colors">{deal.title}</p>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{deal.subtitle}</p>
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
