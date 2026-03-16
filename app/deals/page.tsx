'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Zap, Clock, TrendingDown, ExternalLink, Tag } from 'lucide-react'
import { TelegramCTA } from '@/components/TelegramCTA'

type DealItem = {
  id: string
  title: string
  subtitle: string
  category: string
  discount: number
  originalPrice: number
  dealPrice: number
  platform: 'Amazon' | 'Flipkart' | 'CJ Global'
  image: string
  badge: 'Flash' | 'Hot' | 'Exclusive' | 'Limited'
  endsIn: string
  productId: number
}

const DEALS_DATA: readonly DealItem[] = [
  {
    id: 'deal-1',
    title: 'Samsung Galaxy S25 Ultra',
    subtitle: '256GB • Snapdragon flagship • 5G',
    category: 'Mobiles',
    discount: 33,
    originalPrice: 134999,
    dealPrice: 89999,
    platform: 'Amazon',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
    badge: 'Flash',
    endsIn: '02h 48m',
    productId: 101,
  },
  {
    id: 'deal-2',
    title: 'MacBook Air M3',
    subtitle: '13-inch • 16GB RAM • 512GB SSD',
    category: 'Laptops',
    discount: 22,
    originalPrice: 114990,
    dealPrice: 89990,
    platform: 'Flipkart',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80',
    badge: 'Hot',
    endsIn: '05h 21m',
    productId: 102,
  },
  {
    id: 'deal-3',
    title: 'Sony WH-1000XM5',
    subtitle: 'Industry-leading ANC wireless headphones',
    category: 'Electronics',
    discount: 43,
    originalPrice: 34990,
    dealPrice: 19999,
    platform: 'CJ Global',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    badge: 'Exclusive',
    endsIn: '11h 03m',
    productId: 103,
  },
  {
    id: 'deal-4',
    title: 'Nike Air Max 270',
    subtitle: 'Men running shoes • multiple colorways',
    category: 'Fashion',
    discount: 50,
    originalPrice: 9995,
    dealPrice: 4999,
    platform: 'Amazon',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    badge: 'Flash',
    endsIn: '01h 42m',
    productId: 104,
  },
  {
    id: 'deal-5',
    title: 'Instant Pot Duo',
    subtitle: '7-in-1 electric pressure cooker',
    category: 'Home',
    discount: 45,
    originalPrice: 10995,
    dealPrice: 5999,
    platform: 'Flipkart',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',
    badge: 'Limited',
    endsIn: '08h 10m',
    productId: 105,
  },
  {
    id: 'deal-6',
    title: 'iPad Pro 11"',
    subtitle: 'M4 chip • Liquid Retina display',
    category: 'Electronics',
    discount: 22,
    originalPrice: 89900,
    dealPrice: 69900,
    platform: 'CJ Global',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80',
    badge: 'Hot',
    endsIn: '06h 39m',
    productId: 106,
  },
  {
    id: 'deal-7',
    title: "Levi's 511 Jeans",
    subtitle: 'Slim fit stretch denim for daily wear',
    category: 'Fashion',
    discount: 55,
    originalPrice: 3999,
    dealPrice: 1799,
    platform: 'Amazon',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80',
    badge: 'Flash',
    endsIn: '03h 25m',
    productId: 107,
  },
  {
    id: 'deal-8',
    title: 'Dyson V15 Vacuum',
    subtitle: 'Cordless vacuum with laser detection',
    category: 'Home',
    discount: 36,
    originalPrice: 54900,
    dealPrice: 34900,
    platform: 'Flipkart',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    badge: 'Exclusive',
    endsIn: '09h 57m',
    productId: 108,
  },
  {
    id: 'deal-9',
    title: 'OnePlus 13',
    subtitle: 'Flagship killer • 120Hz AMOLED',
    category: 'Mobiles',
    discount: 27,
    originalPrice: 54999,
    dealPrice: 39999,
    platform: 'Amazon',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80',
    badge: 'Hot',
    endsIn: '04h 11m',
    productId: 109,
  },
  {
    id: 'deal-10',
    title: 'Boat Rockerz 450',
    subtitle: 'Bluetooth on-ear headphones',
    category: 'Electronics',
    discount: 75,
    originalPrice: 3990,
    dealPrice: 999,
    platform: 'Flipkart',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    badge: 'Flash',
    endsIn: '00h 59m',
    productId: 110,
  },
  {
    id: 'deal-11',
    title: 'Instant Pot Air Fryer',
    subtitle: 'Crisp technology • family size basket',
    category: 'Home',
    discount: 50,
    originalPrice: 8999,
    dealPrice: 4499,
    platform: 'CJ Global',
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&q=80',
    badge: 'Limited',
    endsIn: '10h 32m',
    productId: 111,
  },
  {
    id: 'deal-12',
    title: 'Canon EOS R50',
    subtitle: 'Mirrorless camera with RF-S lens kit',
    category: 'Electronics',
    discount: 23,
    originalPrice: 64999,
    dealPrice: 49999,
    platform: 'Amazon',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80',
    badge: 'Exclusive',
    endsIn: '07h 08m',
    productId: 112,
  },
]

const CATEGORIES = ['All Deals', 'Mobiles', 'Laptops', 'Fashion', 'Home', 'Electronics']

function getBadgeClass(badge: DealItem['badge']): string {
  if (badge === 'Flash') return 'bg-orange-500 text-white border-orange-500'
  if (badge === 'Hot') return 'bg-red-500 text-white border-red-500'
  if (badge === 'Exclusive') return 'bg-purple-500 text-white border-purple-500'
  return 'bg-green-500 text-white border-green-500'
}

export default function DealsPage() {
  const [activeCategory, setActiveCategory] = useState('All Deals')

  const filteredDeals = useMemo(() => {
    if (activeCategory === 'All Deals') return DEALS_DATA
    return DEALS_DATA.filter(deal => deal.category === activeCategory)
  }, [activeCategory])

  return (
    <main className="bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      <section className="bg-gradient-to-r from-skyline-primary to-skyline-primary-dark py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-1.5 text-xs font-black text-white uppercase tracking-widest mb-4">
            <Zap size={14} className="fill-current" /> Live Deals
          </span>
          <h1 className="text-5xl font-black tracking-tighter text-white sm:text-6xl">Today's Best Deals</h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">Compare price drops from 50+ stores. Verified savings updated in real-time.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 -mt-8">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center overflow-x-auto no-scrollbar gap-2 pb-2 -mx-2 px-2 scroll-smooth">
              {CATEGORIES.map((cat) => (
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

                  <span className={`absolute left-3 top-3 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-lg ${getBadgeClass(deal.badge)}`}>
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
                    <Link href={`/go/amazon-${deal.productId}`} className="cb-btn-primary h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
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
      
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </main>
  )
}
