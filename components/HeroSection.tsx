'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Search, Zap } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/lib/constants'

const PLACEHOLDERS = [
  "Search for iPhone 16...",
  "Search for Nike shoes...",
  "Search for boAt earphones...",
  "Search for PS5...",
  "Search for air fryer...",
]

export default function HeroSection() {
  const router = useRouter()
  const [productCount, setProductCount] = useState(0)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches)
    updatePreference()

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updatePreference)
      return () => mediaQuery.removeEventListener('change', updatePreference)
    }

    mediaQuery.addListener(updatePreference)
    return () => mediaQuery.removeListener(updatePreference)
  }, [])

  useEffect(() => {
    let animationFrameId = 0

    if (prefersReducedMotion) {
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
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [prefersReducedMotion])

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

      <div className="relative mx-auto flex min-h-[80vh] max-w-7xl flex-col items-center justify-center text-center">
        <div className="mb-8 inline-flex">
          <span className="cb-badge cb-badge-blue inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold">
            <Zap size={14} className="fill-current" />
            Live India deal radar
          </span>
        </div>

        <div className="max-w-4xl space-y-4">
          <h1 className="font-display text-5xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-7xl lg:text-8xl">
            Compare. Discover. <span className="text-skyline-primary">Save.</span>
          </h1>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-skyline-primary sm:text-base">
            {productCount}+ curated products tracked daily
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-500 dark:text-zinc-400 sm:text-xl">
            Everything in one basket. Compare prices across 50+ stores in India. Zero checkout, just pure savings.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="mt-12 w-full max-w-[600px]"
        >
          <div className="relative flex items-center rounded-full border border-zinc-200 bg-white p-1.5 shadow-2xl shadow-skyline-primary/10 ring-4 ring-skyline-primary/5 transition-all duration-300 focus-within:ring-skyline-primary/20 dark:border-zinc-800 dark:bg-zinc-900">
            <Search className="absolute left-6 text-zinc-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={prefersReducedMotion ? 'Search for the best deals in India...' : PLACEHOLDERS[placeholderIndex]}
              className="w-full bg-transparent py-4 pl-14 pr-32 font-medium text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-white"
            />
            <button
              type="submit"
              className="cb-btn-primary absolute right-2 h-12 rounded-full px-6 font-bold shadow-lg shadow-skyline-primary/20"
            >
              Search Deals
            </button>
          </div>
        </form>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {['₹2Cr+ saved by users', '50K+ deals tracked', '4.8★ user rating'].map((stat) => (
            <div
              key={stat}
              className="rounded-full border border-white/40 bg-white/60 px-4 py-2 text-[11px] font-black text-zinc-700 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-200"
            >
              {stat}
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
