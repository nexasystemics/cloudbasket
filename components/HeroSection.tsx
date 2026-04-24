'use client'
// components/HeroSection.tsx
// A19: Accepts totalCount as prop — removes direct INDIA_CATALOG client import.

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

type Props = { totalCount: number }

export default function HeroSection({ totalCount }: Props) {
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
    if (prefersReducedMotion) { setProductCount(totalCount); return }
    let start: number | null = null
    const duration = 1500
    const animate = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = timestamp - start
      const percentage = Math.min(progress / duration, 1)
      setProductCount(Math.floor(percentage * totalCount))
      if (progress < duration) animationFrameId = requestAnimationFrame(animate)
    }
    animationFrameId = requestAnimationFrame(animate)
    return () => { cancelAnimationFrame(animationFrameId) }
  }, [prefersReducedMotion, totalCount])

  useEffect(() => {
    if (prefersReducedMotion) return
    const interval = setInterval(() => setPlaceholderIndex(prev => (prev + 1) % PLACEHOLDERS.length), 3000)
    return () => clearInterval(interval)
  }, [prefersReducedMotion])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
  }

  return (
    <section className="hero-gradient relative overflow-hidden px-6 py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(3,155,229,0.08) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      <div aria-hidden="true" className="pointer-events-none absolute -end-20 top-0 h-[300px] w-[300px] rounded-full bg-skyline-primary/30 blur-3xl opacity-20" />
      <div aria-hidden="true" className="pointer-events-none absolute -start-12 bottom-8 h-[200px] w-[200px] rounded-full bg-[#F97316]/30 blur-3xl opacity-20" />

      <div className="relative mx-auto flex min-h-[80vh] max-w-7xl flex-col items-center justify-center text-center">
        <div className="mb-8 inline-flex">
          <span className="cb-badge cb-badge-blue inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold">
            <Zap size={14} className="fill-current" aria-hidden="true" /> Live India deal radar
          </span>
        </div>

        <div className="max-w-4xl space-y-4">
          <h1 className="font-display text-5xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-7xl lg:text-8xl">
            Know It. Find It. <span className="text-skyline-primary">Get It.</span>
          </h1>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-skyline-primary sm:text-base">
            {productCount.toLocaleString('en-IN')}+ curated products tracked daily
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-500 dark:text-zinc-400 sm:text-xl">
            Everything in one basket. Compare prices across 50+ stores in India. Zero checkout, just pure savings.
          </p>
        </div>

        <form onSubmit={handleSearch} className="mt-12 w-full max-w-[600px]">
          <div className="relative flex items-center rounded-full border border-zinc-200 bg-white p-1.5 shadow-2xl shadow-skyline-primary/10 ring-4 ring-skyline-primary/5 transition-all duration-300 focus-within:ring-skyline-primary/20 dark:border-zinc-800 dark:bg-zinc-900">
            <Search className="absolute left-6 text-zinc-400" size={20} aria-hidden="true" />
            <input
              type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search for deals in India"
              placeholder={prefersReducedMotion ? 'Search for the best deals in India...' : PLACEHOLDERS[placeholderIndex]}
              className="w-full bg-transparent py-4 pl-14 pr-32 font-medium text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-white"
            />
            <button type="submit" className="cb-btn-primary absolute right-2 h-12 rounded-full px-6 font-bold shadow-lg shadow-skyline-primary/20 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600">
              Search Deals
            </button>
          </div>
        </form>

        <p className="mt-8 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
          India&apos;s smartest price discovery platform
        </p>

        <div className="mt-16 flex min-h-[48px] flex-wrap items-center justify-center gap-4">
          <Link href={ROUTES.PRODUCTS} className="cb-btn-primary px-8 py-4 rounded-2xl flex items-center gap-2 text-base transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600">
            Browse All Deals <ArrowRight size={18} />
          </Link>
          <Link href={ROUTES.COMPARE} className="px-8 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600">
            Compare Products
          </Link>
        </div>
      </div>
    </section>
  )
}
