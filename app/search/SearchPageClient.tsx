'use client'

import { Suspense, useDeferredValue, useEffect, useMemo, useState, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Search, ExternalLink, SlidersHorizontal, X, TrendingUp, SearchX } from 'lucide-react'
import TrackBehavior from '@/components/TrackBehavior'
import { ProductCard } from '@/components/products/ProductCard'
import { CATALOG_PRODUCTS } from '@/lib/cloudbasket-data'

const POPULAR_SEARCHES = [
  "iPhone 16", "Samsung Galaxy S25", "Nike shoes", "boAt earphones", 
  "Levi's jeans", "Atomic Habits", "PS5", "air fryer", "yoga mat", "Titan watch"
]

function SearchPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get('q') ?? ''

  const [query, setQuery] = useState<string>(initialQuery)
  const [sortBy, setSortBy] = useState<string>('relevance')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const deferredQuery = useDeferredValue(query)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const nextQuery = searchParams.get('q') ?? ''
    setQuery(nextQuery)
  }, [searchParams])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowSuggestions(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const suggestions = useMemo(() => {
    if (!query.trim()) return []
    return POPULAR_SEARCHES.filter(s => 
      s.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5)
  }, [query])

  const results = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase()
    if (!normalized) return CATALOG_PRODUCTS.slice(0, 20)

    let filtered = CATALOG_PRODUCTS.filter(p => 
      p.title.toLowerCase().includes(normalized) || 
      p.brand.toLowerCase().includes(normalized) ||
      p.category.toLowerCase().includes(normalized)
    )

    if (sortBy === 'price-low') {
      return [...filtered].sort((a, b) => a.price - b.price)
    }
    if (sortBy === 'price-high') {
      return [...filtered].sort((a, b) => b.price - a.price)
    }
    if (sortBy === 'discount') {
      return [...filtered].sort((a, b) => {
        const dA = ((a.mrp - a.price) / a.mrp)
        const dB = ((b.mrp - b.price) / b.mrp)
        return dB - dA
      })
    }

    return filtered
  }, [deferredQuery, sortBy])

  const handleSuggestionClick = (s: string) => {
    setQuery(s)
    setShowSuggestions(false)
    router.push(`/search?q=${encodeURIComponent(s)}`)
  }

  return (
    <main className="bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      <TrackBehavior searchTerm={deferredQuery.trim() || undefined} />
      
      <section className="bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 py-12">
        <div className="mx-auto max-w-3xl px-6" ref={containerRef}>
          <h1 className="mb-8 text-center text-4xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic">
            Search Deals
          </h1>

          <div className="relative group">
            <div className="relative flex items-center p-1.5 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 ring-4 ring-skyline-primary/5 focus-within:ring-skyline-primary/20 transition-all duration-300">
              <Search className="absolute left-5 text-zinc-400" size={20} />
              <input
                className="w-full bg-transparent pl-12 pr-12 py-4 text-zinc-900 dark:text-white font-medium outline-none placeholder:text-zinc-400 text-lg"
                value={query}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setShowSuggestions(true)
                }}
                placeholder="What are you looking for today?"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => { setQuery(''); setShowSuggestions(false); }}
                  className="absolute right-5 p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSuggestionClick(s)}
                      className="w-full text-left px-4 py-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-3 transition-colors"
                    >
                      <TrendingUp size={14} className="text-skyline-primary" />
                      <span className="font-bold text-zinc-700 dark:text-zinc-200">{s}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <p className="mr-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">Popular:</p>
            {POPULAR_SEARCHES.slice(0, 4).map((term) => (
              <button
                key={term}
                onClick={() => handleSuggestionClick(term)}
                className="px-4 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 hover:bg-skyline-primary hover:text-white transition-all"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
              {query ? `Results for "${query}"` : 'Top Trending Deals'}
            </h2>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">
              {results.length} verified price points found
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-100 dark:border-zinc-800">
            <SlidersHorizontal size={14} className="text-zinc-400" />
            <select
              className="bg-transparent text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-300 outline-none cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="relevance">Relevance</option>
              <option value="price-low">Price Low-High</option>
              <option value="price-high">Price High-Low</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-20 text-center shadow-xl">
            <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <SearchX size={40} className="text-zinc-300 dark:text-zinc-600" />
            </div>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">No results matched</h2>
            <p className="mt-3 text-zinc-500 dark:text-zinc-400 font-medium">We couldn't find anything for "{query}". Try one of these:</p>
            
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {["iPhone", "Shoes", "Laptops"].map(chip => (
                <button 
                  key={chip}
                  onClick={() => handleSuggestionClick(chip)}
                  className="px-6 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 text-[11px] font-black uppercase tracking-widest text-skyline-primary hover:bg-skyline-primary hover:text-white transition-all shadow-sm"
                >
                  {chip}
                </button>
              ))}
            </div>
            
            <Link href="/products" className="cb-btn-ghost mt-10 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
              Browse Full Catalog <ExternalLink size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((product) => (
              <ProductCard 
                key={product.id} 
                product={{
                  ...product,
                  name: product.title,
                  rating: 4.5,
                  discount: Math.round(((product.mrp - product.price) / product.mrp) * 100)
                }} 
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default function SearchPageClient() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-skyline-primary border-t-transparent"></div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  )
}
