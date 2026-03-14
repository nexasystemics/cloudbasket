'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Zap, Clock, ExternalLink } from 'lucide-react'

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

function getSecondsUntilMidnight(): number {
  const now = new Date()
  const midnight = new Date()
  midnight.setHours(24, 0, 0, 0)
  return Math.floor((midnight.getTime() - now.getTime()) / 1000)
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0')
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${h}:${m}:${s}`
}

const BADGE_STYLES: Record<DealItem['badge'], string> = {
  Flash: 'bg-rose-500 text-white',
  Hot: 'bg-orange-500 text-white',
  Exclusive: 'bg-purple-600 text-white',
  Limited: 'bg-blue-600 text-white',
}

export default function FlashSalePageClient() {
  const [timeLeft, setTimeLeft] = useState(getSecondsUntilMidnight())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? getSecondsUntilMidnight() : prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <main className="min-h-screen bg-[var(--cb-bg)]">
      <section className="bg-gradient-to-r from-rose-600 to-orange-500 py-12">
        <div className="mx-auto max-w-6xl px-6 text-center text-white">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Zap size={28} className="text-yellow-300" />
            <h1 className="text-4xl font-black tracking-tighter">Flash Sales</h1>
          </div>
          <p className="mb-6 text-rose-100">Limited time. Maximum savings. Move fast.</p>
          <div className="inline-flex items-center gap-3 rounded-2xl bg-black/30 px-6 py-3">
            <Clock size={20} className="text-yellow-300" />
            <span className="text-sm font-semibold text-rose-100">Resets in</span>
            <span className="tabular-nums text-3xl font-black tracking-widest text-white">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <p className="mb-6 text-sm text-muted">Showing {DEALS_DATA.length} flash deals · Prices update every hour</p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DEALS_DATA.map((deal) => (
            <Link
              key={deal.id}
              href={`/product/${deal.productId}`}
              className="cb-card group flex flex-col overflow-hidden transition-shadow hover:shadow-lg"
            >
              <div className="relative h-48 bg-[var(--cb-surface-2)]">
                <Image
                  src={deal.image}
                  alt={deal.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                />
                <span className={`absolute left-2 top-2 rounded-full px-2 py-1 text-xs font-black ${BADGE_STYLES[deal.badge]}`}>
                  {deal.badge}
                </span>
                <span className="absolute right-2 top-2 rounded-full bg-rose-600 px-2 py-1 text-xs font-black text-white">
                  -{deal.discount}%
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <p className="line-clamp-2 text-sm font-bold leading-snug">{deal.title}</p>
                <p className="text-xs text-muted">{deal.subtitle}</p>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div>
                    <p className="text-lg font-black">₹{deal.dealPrice.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-muted line-through">₹{deal.originalPrice.toLocaleString('en-IN')}</p>
                  </div>
                  <span className="rounded bg-[var(--cb-surface-2)] px-2 py-1 text-xs font-semibold">{deal.platform}</span>
                </div>
                <button className="cb-btn cb-btn-primary mt-2 flex w-full items-center justify-center gap-2 text-sm">
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
