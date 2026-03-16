'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { ArrowRight, Search, Shield, TrendingDown, Zap, Users, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/lib/constants'

const PLACEHOLDERS = [
  "Search for iPhone 16...",
  "Search for Nike shoes...",
  "Search for boAt earphones..."
]

export default function HeroSection() {
  const router = useRouter()
  const [productCount, setProductCount] = useState(0)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    if (mediaQuery.matches) {
      setProductCount(122)
      return
    }

    let start: number | null = null
    const duration = 1500
    const finalCount = 122

    const animate = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = timestamp - start
      const percentage = Math.min(progress / duration, 1)
      setProductCount(Math.floor(percentage * finalCount))

      if (progress < duration) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return

    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [prefersReducedMotion])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <section className="hero-gradient relative overflow-hidden px-6 py-24">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(3,155,229,0.08) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="pointer-events-none absolute -end-20 top-0 h-[300px] w-[300px] rounded-full bg-skyline-primary/30 blur-3xl opacity-20" />
      <div className="pointer-events-none absolute -start-12 bottom-8 h-[200px] w-[200px] rounded-full bg-[#F97316]/30 blur-3xl opacity-20" />

      <div className="relative mx-auto flex min-h-[80vh] max-w-7xl flex-col justify-center items-center text-center">
        <div className="mb-8 inline-flex">
          <span className="cb-badge cb-badge-blue inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold">
            <Zap size={14} className="fill-current" />
            Tracking {productCount}+ curated deals today
          </span>
        </div>

        <div className="space-y-4 max-w-4xl">
          <h1 className="font-display text-5xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-7xl lg:text-8xl">
            Compare. Discover. <span className="text-skyline-primary">Save.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-500 dark:text-zinc-400 sm:text-xl">
            Everything in one basket. Compare prices across 50+ stores in India. Zero checkout, just pure savings.
          </p>
        </div>

        <form 
          onSubmit={handleSearch}
          className="mt-12 w-full max-w-2xl px-4"
        >
          <div className="relative flex items-center p-1.5 bg-white dark:bg-zinc-900 rounded-full shadow-2xl shadow-skyline-primary/10 border border-zinc-200 dark:border-zinc-800 ring-4 ring-skyline-primary/5 focus-within:ring-skyline-primary/20 transition-all duration-300">
            <Search className="absolute left-6 text-zinc-400" size={20} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={prefersReducedMotion ? "Search for deals..." : PLACEHOLDERS[placeholderIndex]}
              className="w-full bg-transparent pl-14 pr-32 py-4 text-zinc-900 dark:text-white font-medium outline-none placeholder:text-zinc-400"
            />
            <button 
              type="submit"
              className="absolute right-2 cb-btn-primary h-12 px-6 rounded-full font-bold shadow-lg shadow-skyline-primary/20"
            >
              Search Deals
            </button>
          </div>
        </form>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {[
            { label: '₹2Cr+ saved by users', icon: TrendingDown },
            { label: '50K+ deals tracked', icon: Users },
            { label: '4.8★ user rating', icon: CheckCircle }
          ].map((stat, i) => (
            <div 
              key={i}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700 text-[11px] font-black uppercase tracking-wider text-zinc-600 dark:text-zinc-300"
            >
              <stat.icon size={14} className="text-skyline-primary" />
              {stat.label}
            </div>
          ))}
        </div>

        <div className="mt-16 flex min-h-[48px] flex-wrap items-center justify-center gap-4">
          <Link href={ROUTES.PRODUCTS} className="cb-btn-primary px-8 py-4 rounded-2xl flex items-center gap-2 text-base">
            Browse All Deals
            <ArrowRight size={18} />
          </Link>
          <Link href={ROUTES.COMPARE} className="px-8 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
            Compare Products
          </Link>
        </div>
      </div>
    </section>
  )
}

