import type { Metadata } from 'next'
import Link from 'next/link'
import { Home, Search, TrendingDown, ArrowLeft, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Not Found - CloudBasket',
  description: 'The requested CloudBasket page was not found. Explore verified categories and deals.',
}

const CATEGORIES = [
  { name: 'Mobiles', slug: 'mobiles' },
  { name: 'Laptops', slug: 'laptops' },
  { name: 'Fashion', slug: 'fashion' },
  { name: 'Home', slug: 'home' },
  { name: 'Beauty', slug: 'beauty' },
  { name: 'Sports', slug: 'sports' },
]

export default function NotFoundRoutePage() {
  return (
    <main className="min-h-screen bg-[var(--cb-bg)] px-6 text-center">
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p className="bg-gradient-to-r from-[#039BE5] to-[#4FC3F7] bg-clip-text text-[120px] font-black leading-none text-transparent">
          404
        </p>
        <h1 className="mt-4 text-3xl font-black tracking-tighter">Page Not Found</h1>
        <p className="text-muted mt-3 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="cb-btn cb-btn-primary gap-2">
            <Home size={16} />
            Go Home
          </Link>
          <Link href="/deals" className="cb-btn cb-btn-ghost gap-2">
            <Zap size={16} />
            Today&apos;s Deals
          </Link>
          <Link href="/search" className="cb-btn cb-btn-ghost gap-2">
            <Search size={16} />
            Search Products
          </Link>
          <Link href="/compare" className="cb-btn cb-btn-ghost gap-2">
            <TrendingDown size={16} />
            Compare Prices
          </Link>
        </div>

        <div className="mt-12">
          <p className="text-muted mb-4 text-xs font-black uppercase tracking-widest">Popular Categories</p>
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((category) => (
              <Link key={category.slug} href={`/category/${category.slug}`} className="cb-badge cb-badge-blue">
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        <Link href="/" className="text-muted mt-10 inline-flex items-center gap-1 text-xs">
          <ArrowLeft size={14} />
          Back to home
        </Link>

        <p className="text-muted mt-12 text-xs">Powered by NEXQON HOLDINGS Technology</p>
      </div>
    </main>
  )
}

