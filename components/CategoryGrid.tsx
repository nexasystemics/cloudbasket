'use client'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants'
import { CATEGORY_DEFINITIONS, CATALOG_PRODUCTS } from '@/lib/cloudbasket-data'
import { getIndiaCatalogBySlug } from '@/lib/india-catalog/utils'
import { getCategoryIcon, getCategoryGradient } from '@/lib/category-icons'

const COMING_SOON_CATEGORIES = new Set(['courses', 'investments', 'jewellery', 'travel'])

export default function CategoryGrid() {
  const categories = CATEGORY_DEFINITIONS.map((cat) => {
    const baseCount = CATALOG_PRODUCTS.filter((p) => p.category === cat.slug).length
    const indiaCount = getIndiaCatalogBySlug(cat.slug).length
    const count = baseCount + indiaCount
    return {
      ...cat,
      count,
      icon: getCategoryIcon(cat.slug),
      gradient: getCategoryGradient(cat.slug),
    }
  })

  return (
    <section className="bg-[var(--cb-surface-2)] py-20">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="mb-12 flex items-end justify-between gap-4">
          <div className="min-h-[60px]">
            <h2 className="font-display text-3xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">
              Explore Categories
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Find deals across every curated segment</p>
          </div>
          <Link href={ROUTES.PRODUCTS} className="cb-btn-ghost inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest">
            View All
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categories.map((category) => {
            const Icon = category.icon
            const isComingSoon = COMING_SOON_CATEGORIES.has(category.slug)
            const isEmpty = category.count === 0 || isComingSoon
            const href = category.slug === 'pod' ? '/pod' : `/category/${category.slug}`
            
            return (
              <Link 
                key={category.slug} 
                href={isEmpty ? '#' : href} 
                className={`group relative overflow-hidden rounded-2xl border border-zinc-100 bg-white transition-transform duration-200 hover:-translate-y-1 dark:border-zinc-800 dark:bg-zinc-900 motion-reduce:hover:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 ${isEmpty ? 'cursor-not-allowed opacity-80' : ''}`}
              >
                <div className="relative h-32 w-full overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.label}
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-105 motion-reduce:group-hover:scale-100"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-60 group-hover:opacity-80 transition-opacity`} />
                  <div className="absolute inset-0 bg-skyline-primary opacity-0 transition-opacity duration-200 group-hover:opacity-10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon size={32} className="text-white drop-shadow-lg transition-transform duration-300 group-hover:scale-110" />
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight truncate">
                    {category.label}
                  </p>
                  <div className="mt-1">
                    {isComingSoon ? (
                      <span className="text-xs italic text-zinc-400">
                        Coming soon
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{category.count} products</span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
