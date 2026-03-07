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
  endsIn: string
  productId: number
}

const DEALS_DATA: readonly DealItem[] = [
  {
    id: 'deal-1',
    title: 'Samsung Galaxy S25 Ultra',
    subtitle: '256GB • Snapdragon flagship • 5G',
    discount: 33,
    originalPrice: 44999,
    dealPrice: 29999,
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

function getBadgeClass(badge: DealItem['badge']): string {
  if (badge === 'Flash') {
    return 'cb-badge-orange'
  }
  if (badge === 'Hot') {
    return 'cb-badge bg-red-500 text-white border-red-500'
  }
  if (badge === 'Exclusive') {
    return 'cb-badge border-purple-500 bg-purple-500 text-white'
  }
  return 'cb-badge-green'
}

const FLASH_DEALS = DEALS_DATA.filter((deal) => deal.badge === 'Flash' || deal.badge === 'Hot')

export default function FlashDealsPage() {
  return (
    <main className="bg-[var(--cb-bg)]">
      <section className="bg-gradient-to-r from-[#F97316] to-[#EA580C] py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <span className="cb-badge mb-4 border-white/30 bg-white/20 text-white">
            <Zap size={14} /> Flash Sales
          </span>
          <h1 className="text-5xl font-black tracking-tighter text-white">Flash Sales</h1>
          <p className="mt-3 text-white/80">Limited time. Maximum savings. Move fast.</p>

          <div className="mt-8 flex justify-center gap-4">
            {[
              { value: '02', label: 'Hours' },
              { value: '47', label: 'Minutes' },
              { value: '33', label: 'Seconds' },
            ].map((time) => (
              <div key={time.label} className="cb-card border-white/20 bg-white/10 px-6 py-4 text-center">
                <p className="text-3xl font-black text-white">{time.value}</p>
                <p className="text-xs text-white/60">{time.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {FLASH_DEALS.map((deal) => (
            <article key={deal.id} className="cb-card group relative flex flex-col overflow-hidden">
              <div className="relative h-52">
                <Image fill className="object-cover" src={deal.image} alt={deal.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                <span className={`absolute left-3 top-3 ${getBadgeClass(deal.badge)}`}>{deal.badge}</span>
                <p className="absolute right-3 top-3 text-2xl font-black text-white">-{deal.discount}%</p>
                <span className="cb-badge absolute bottom-3 left-3 border-white/30 bg-white/20 text-[10px] text-white">
                  {deal.platform}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="line-clamp-2 text-sm font-black leading-snug">{deal.title}</h3>
                <p className="line-clamp-1 text-xs text-[var(--cb-text-muted)]">{deal.subtitle}</p>

                <div className="mt-1 flex items-baseline gap-2">
                  <p className="price-current">₹{deal.dealPrice.toLocaleString('en-IN')}</p>
                  <p className="price-original text-xs">₹{deal.originalPrice.toLocaleString('en-IN')}</p>
                </div>

                <p className="price-savings text-xs">
                  You save ₹{(deal.originalPrice - deal.dealPrice).toLocaleString('en-IN')}
                </p>

                <div className="mt-1 flex items-center gap-1">
                  <Clock size={12} className="text-[#F97316]" />
                  <p className="text-xs font-bold text-[#F97316]">Ends in {deal.endsIn}</p>
                </div>

                <div className="mt-auto pt-3">
                  <Link href={`/go/amazon-${deal.productId}`} className="cb-btn cb-btn-orange w-full text-sm">
                    <ExternalLink size={14} /> Grab This Deal
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
