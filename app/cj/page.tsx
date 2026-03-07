import Link from 'next/link'
import Image from 'next/image'
import { Globe, ExternalLink, DollarSign, Zap, ArrowRight, Package } from 'lucide-react'

type CJProduct = {
  name: string
  usdPrice: number
  inrPrice: number
  image: string
}

const CJ_PRODUCTS: readonly CJProduct[] = [
  {
    name: 'Anker PowerBank 26800mAh',
    usdPrice: 49.99,
    inrPrice: 4149,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80',
  },
  {
    name: 'Logitech MX Master 3S',
    usdPrice: 99.99,
    inrPrice: 8299,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80',
  },
  {
    name: 'Belkin MagSafe Charger',
    usdPrice: 39.99,
    inrPrice: 3319,
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&q=80',
  },
  {
    name: 'JBL Clip 4 Speaker',
    usdPrice: 79.99,
    inrPrice: 6649,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80',
  },
  {
    name: 'Apple AirTag 4-Pack',
    usdPrice: 99.99,
    inrPrice: 8299,
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80',
  },
  {
    name: 'Samsung T7 SSD 1TB',
    usdPrice: 89.99,
    inrPrice: 7469,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&q=80',
  },
  {
    name: 'Kindle Paperwhite',
    usdPrice: 139.99,
    inrPrice: 11619,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80',
  },
  {
    name: 'Garmin Forerunner 255',
    usdPrice: 349.99,
    inrPrice: 29069,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
  },
]

const CJ_BENEFITS = [
  {
    icon: Globe,
    title: 'Global Inventory',
    desc: 'Access products not available in India',
  },
  {
    icon: DollarSign,
    title: 'Best USD Rates',
    desc: 'Real-time INR conversion at best rates',
  },
  {
    icon: Package,
    title: 'Direct Shipping',
    desc: 'Ships direct from international warehouse',
  },
  {
    icon: Zap,
    title: 'Fast Customs',
    desc: 'Pre-cleared customs for faster delivery',
  },
] as const

export default function CJPage() {
  return (
    <main className="bg-[var(--cb-bg)]">
      <section className="bg-gradient-to-r from-[#10B981]/5 to-[#059669]/5 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="cb-badge cb-badge-green mb-6">
            <Globe size={14} /> CJ Global Network
          </span>
          <h1 className="text-5xl font-black tracking-tighter">Shop Global. Save Big.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--cb-text-muted)]">
            Access international products via Commission Junction. Best USD/INR rates. Direct shipping to India.
          </p>
          <Link href="#featured-cj" className="cb-btn cb-btn-primary mt-8 gap-2">
            Browse CJ Products <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {CJ_BENEFITS.map((benefit) => {
            const BenefitIcon = benefit.icon
            return (
              <article key={benefit.title} className="cb-card p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#10B981]/10">
                  <BenefitIcon size={22} className="text-[#10B981]" />
                </div>
                <h3 className="mt-3 text-sm font-black">{benefit.title}</h3>
                <p className="mt-1 text-xs text-[var(--cb-text-muted)]">{benefit.desc}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section id="featured-cj" className="mx-auto max-w-5xl px-6 py-8 pb-16">
        <h2 className="mb-8 text-2xl font-black tracking-tighter">Featured International Products</h2>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {CJ_PRODUCTS.map((product, index) => (
            <article key={product.name} className="cb-card group overflow-hidden">
              <div className="relative h-48">
                <Image fill className="object-cover" src={product.image} alt={product.name} />
              </div>
              <div className="p-4">
                <span className="cb-badge cb-badge-green mb-2">
                  <Globe size={10} /> CJ Global
                </span>
                <h3 className="line-clamp-2 text-sm font-black">{product.name}</h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <p className="price-current">₹{product.inrPrice.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-[var(--cb-text-muted)]">${product.usdPrice.toFixed(2)}</p>
                </div>
                <Link href={`/go/cj-${index + 1}`} className="cb-btn cb-btn-primary mt-3 w-full gap-1 text-xs">
                  <ExternalLink size={12} /> View Deal
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
