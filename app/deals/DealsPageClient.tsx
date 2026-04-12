'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Zap, Clock, TrendingDown, ExternalLink, Tag } from 'lucide-react'
import { TelegramCTA } from '@/components/TelegramCTA'
import AffiliateDisclosureBanner from '@/components/AffiliateDisclosureBanner'
import { getDailyDeals } from '@/lib/deals-engine'

type UI_DealItem = {
  id: string
  title: string
  subtitle: string
  category: string
  discount: number
  originalPrice: number
  dealPrice: number
  platform: 'Amazon' | 'Flipkart' | 'CJ Global'
  image: string
  badge: string
  endsIn: string
  productId: string
}

function calculateTimeLeft(expiry: Date): string {
  const totalSeconds = Math.max(0, Math.floor((expiry.getTime() - Date.now()) / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  if (hours > 24) {
    const days = Math.floor(hours / 24)
    return `${days}d ${hours % 24}h`
  }
  return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`
}

function getBadgeClass(badge: string): string {
  if (badge === 'Flash Deal') return 'bg-orange-500 text-white border-orange-500'
  if (badge === 'Best Seller') return 'bg-red-500 text-white border-red-500'
  if (badge === 'Today Only') return 'bg-purple-500 text-white border-purple-500'
  return 'bg-green-500 text-white border-green-500'
}

export default function DealsPageClient() {
  const [activeCategory, setActiveCategory] = useState('All Deals')
  const [deals, setDeals] = useState<UI_DealItem[]>([])

  useEffect(() => {
    const engineDeals = getDailyDeals(20)
    const formattedDeals: UI_DealItem[] = engineDeals.map((d) => ({
      id: d.id,
      title: d.title,
      subtitle: d.title || d.brand,
      category: d.category.charAt(0).toUpperCase() + d.category.slice(1),
      discount: d.discountPercent,
      originalPrice: d.originalPrice,
      dealPrice: d.dealPrice,
      platform: d.platform as 'Amazon' | 'Flipkart' | 'CJ Global',
      image: d.imageUrl,
      badge: d.label || 'Deal',
      endsIn: calculateTimeLeft(d.expiresAt),
      productId: d.id,
    }))
    setDeals(formattedDeals)
  }, [])

  const categories = useMemo(() => ['All Deals', ...Array.from(new Set(deals.map((deal) => deal.category)))], [deals])
  const filteredDeals = useMemo(() => {
    if (activeCategory === 'All Deals') return deals
    return deals.filter((deal) => deal.category === activeCategory)
  }, [activeCategory, deals])

  return (
    <main className="bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      <AffiliateDisclosureBanner />
      <section className="bg-gradient-to-r from-skyline-primary to-skyline-primary-dark py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-1.5 text-xs font-black text-white uppercase tracking-widest mb-4">
            <Zap size={14} className="fill-current" /> Live Deals
          </span>
          <h1 className="text-5xl font-black tracking-tighter text-white sm:text-6xl">Today&apos;s Best Deals</h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">Compare price drops from 50+ stores. Verified savings updated in real-time.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 -mt-8">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center overflow-x-auto gap-2 pb-2 -mx-2 px-2 scroll-smooth" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                    activeCategory === cat
                      ? 'bg-skyline-primary text-white shadow-lg shadow-skyline-primary/20'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <Link href="/deals/flash" className="cb-btn-orange rounded-full px-6 py-2.5 text-xs font-black flex items-center gap-2">
              <Zap size={16} className="fill-current" /> Flash Sales
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredDeals.map((deal) => (
              <article key={deal.id} className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden hover:shadow-2xl transition-all duration-500">
                <div className="relative h-52 overflow-hidden">
                  <Image
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    src={deal.image}
                    alt={deal.title}
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                  <span className={`absolute left-3 top-3 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-lg ${getBadgeClass(deal.badge || 'Deal')}`}>
                    {deal.badge}
                  </span>
                  <p className="absolute right-3 top-3 text-2xl font-black text-white drop-shadow-md">-{deal.discount}%</p>
                  <span className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-[9px] font-black text-zinc-900 dark:text-white uppercase tracking-widest shadow-sm">
                    <Tag size={10} /> {deal.platform}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div>
                    <h3 className="line-clamp-2 text-sm font-black leading-snug group-hover:text-skyline-primary transition-colors">{deal.title}</h3>
                    <p className="line-clamp-1 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{deal.subtitle}</p>
                  </div>
                  <div className="mt-auto">
                    <div className="flex items-baseline gap-2">
                      <p className="text-xl font-black text-zinc-900 dark:text-white">₹{deal.dealPrice.toLocaleString('en-IN')}</p>
                      <p className="text-xs font-bold text-zinc-400 line-through">₹{deal.originalPrice.toLocaleString('en-IN')}</p>
                    </div>
                    <p className="text-[10px] font-black text-green-500 uppercase tracking-tight mt-1">
                      Save ₹{(deal.originalPrice - deal.dealPrice).toLocaleString('en-IN')} today
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-50 dark:border-zinc-800">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="text-orange-500" />
                      <p className="text-[10px] font-black text-orange-500 uppercase tracking-tighter">Ends in {deal.endsIn}</p>
                    </div>
                    <Link href={`/go/${deal.platform.toLowerCase()}-${deal.productId}`} className="cb-btn-primary h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      Grab Deal <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 text-[9px] font-bold text-zinc-300 dark:text-zinc-700 pointer-events-none">
                  <TrendingDown size={10} className="inline mr-1" /> VERIFIED REDIRECT
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <TelegramCTA />
      </section>
    </main>
  )
}
