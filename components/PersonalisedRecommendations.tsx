'use client'
// components/PersonalisedRecommendations.tsx
// Purpose: Displays product recommendations based on user behaviour.
// A20: Personalisation engine integration.

import { useEffect, useState, useMemo } from 'react'
import { CATALOG_PRODUCTS } from '@/lib/cloudbasket-data'
import { INDIA_CATALOG } from '@/lib/india-catalog'
import { getPreferredCategories, getPreferredBrands } from '@/lib/intelligence/personalisation'
import { ProductCard } from '@/components/products/ProductCard'
import { Sparkles, TrendingUp } from 'lucide-react'

export function PersonalisedRecommendations() {
  const [preferences, setPreferences] = useState<{ categories: string[], brands: string[] } | null>(null)

  useEffect(() => {
    const categories = getPreferredCategories()
    const brands = getPreferredBrands()
    if (categories.length > 0 || brands.length > 0) {
      setPreferences({ categories, brands })
    } else {
      setPreferences({ categories: [], brands: [] })
    }
  }, [])

  const recommendations = useMemo(() => {
    if (!preferences) return []

    // 1. If we have preferences, find matches
    if (preferences.categories.length > 0 || preferences.brands.length > 0) {
      const allProducts = [
        ...CATALOG_PRODUCTS.map(p => ({
          ...p,
          source: (p.platform === 'Flipkart' ? 'Flipkart' : (p.platform === 'CJ Global' ? 'CJ' : 'Amazon')) as any,
          affiliatePlatform: (p.platform === 'Flipkart' ? 'flipkart' : (p.platform === 'CJ Global' ? 'cj' : 'amazon')) as any,
          reviewCount: p.reviewCount || 0
        })),
        ...INDIA_CATALOG.map(p => ({
          id: p.id,
          title: p.name,
          image: p.image,
          brand: p.brand,
          price: p.price,
          mrp: p.originalPrice || p.price,
          category: p.category,
          rating: p.rating || 4.0,
          reviewCount: p.reviewCount || 0,
          source: (p.affiliatePlatform === 'flipkart' ? 'Flipkart' : 'Amazon') as any,
          affiliatePlatform: (p.affiliatePlatform === 'flipkart' ? 'flipkart' : 'amazon') as any,
          isTrending: p.isTrending
        }))
      ]

      const matched = allProducts.filter(p => 
        preferences.categories.includes(p.category) || 
        preferences.brands.includes(p.brand)
      )

      // Shuffle and take 8
      return matched.sort(() => Math.random() - 0.5).slice(0, 8)
    }

    // 2. No preferences? Show Trending/isTrending
    const trending = [
      ...CATALOG_PRODUCTS.filter(p => p.isTrending).map(p => ({
        ...p,
        source: (p.platform === 'Flipkart' ? 'Flipkart' : (p.platform === 'CJ Global' ? 'CJ' : 'Amazon')) as any,
        affiliatePlatform: (p.platform === 'Flipkart' ? 'flipkart' : (p.platform === 'CJ Global' ? 'cj' : 'amazon')) as any,
        reviewCount: p.reviewCount || 0
      })),
      ...INDIA_CATALOG.filter(p => p.isTrending).map(p => ({
        id: p.id,
        title: p.name,
        image: p.image,
        brand: p.brand,
        price: p.price,
        mrp: p.originalPrice || p.price,
        category: p.category,
        rating: p.rating || 4.0,
        reviewCount: p.reviewCount || 0,
        source: (p.affiliatePlatform === 'flipkart' ? 'Flipkart' : 'Amazon') as any,
        affiliatePlatform: (p.affiliatePlatform === 'flipkart' ? 'flipkart' : 'amazon') as any,
        isTrending: true
      }))
    ]

    return trending.sort(() => Math.random() - 0.5).slice(0, 8)
  }, [preferences])

  if (!preferences) return <div className="h-40 animate-pulse bg-zinc-100 dark:bg-zinc-900 rounded-3xl" />

  const isPersonalised = preferences.categories.length > 0 || preferences.brands.length > 0

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isPersonalised ? 'bg-skyline-primary/10 text-skyline-primary' : 'bg-orange-500/10 text-orange-500'}`}>
            {isPersonalised ? <Sparkles size={20} /> : <TrendingUp size={20} />}
          </div>
          <div>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight italic">
              {isPersonalised ? 'Picked For You' : 'Popular Right Now'}
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
              {isPersonalised ? 'Based on your recent activity' : 'Top trending products across categories'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {recommendations.map((product) => (
          <ProductCard 
            key={product.id} 
            product={{
              id: product.id,
              name: product.title,
              image: product.image,
              brand: product.brand,
              price: product.price,
              originalPrice: (product as any).mrp || product.price,
              discount: Math.round(((((product as any).mrp || product.price) - product.price) / ((product as any).mrp || product.price)) * 100),
              rating: product.rating,
              reviewCount: product.reviewCount,
              source: (product as any).source,
              affiliatePlatform: (product as any).affiliatePlatform
            }} 
          />
        ))}
      </div>
    </section>
  )
}
