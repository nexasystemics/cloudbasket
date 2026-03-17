'use client'

import { useRouter } from 'next/navigation'
import { TrendingUp } from 'lucide-react'

const TRENDING_TERMS = [
  'iPhone 16',
  'boAt earphones',
  'Nike Air Max',
  'PS5',
  "Levi's 511",
  'Atomic Habits',
  'Air Fryer',
  'Yoga Mat',
  'Titan Watch',
  'Noise SmartWatch',
] as const

export default function TrendingSearches() {
  const router = useRouter()

  return (
    <section className="mx-auto max-w-7xl px-6 py-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 shrink-0">
          <TrendingUp size={14} className="text-skyline-primary" />
          Trending now:
        </span>
        {TRENDING_TERMS.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => router.push(`/search?q=${encodeURIComponent(term)}`)}
            className="px-4 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[11px] font-bold text-zinc-600 dark:text-zinc-300 hover:bg-skyline-primary hover:text-white transition-all duration-200 border border-zinc-200 dark:border-zinc-700"
          >
            {term}
          </button>
        ))}
      </div>
    </section>
  )
}
