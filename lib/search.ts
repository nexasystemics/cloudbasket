// lib/search.ts
// Comprehensive multi-filter product search with relevance scoring.

import { INDIA_CATALOG } from '@/lib/india-catalog'

export type SearchFilters = {
  categories?: string[]
  brands?: string[]
  platforms?: string[]
  minPrice?: number
  maxPrice?: number
  minDiscount?: number
  inStock?: boolean
  sortBy?: 'relevance' | 'price-asc' | 'price-desc' | 'discount-desc' | 'newest'
}

export type SearchResult = {
  id: string; name: string; brand: string; category: string
  price: number; originalPrice?: number; discount?: number
  image: string; affiliateUrl: string; platform: string
  inStock: boolean; relevanceScore: number
}

function scoreProduct(product: any, query: string): number {
  const q = query.toLowerCase().trim()
  if (!q) return 50
  const name = (product.name || product.title || '').toLowerCase()
  const brand = (product.brand || '').toLowerCase()
  const tags = ((product.tags || []) as string[]).join(' ').toLowerCase()
  const desc = (product.description || '').toLowerCase()
  if (name === q) return 100
  if (name.startsWith(q)) return 95
  if (name.includes(q)) return 80
  if (brand.includes(q)) return 70
  if (tags.includes(q)) return 50
  if (desc.includes(q)) return 30
  return 0
}

export function searchProducts(query: string, filters: SearchFilters = {}): SearchResult[] {
  let results = INDIA_CATALOG as any[]

  // Score + filter by query
  if (query.trim()) {
    results = results.map(p => ({ ...p, relevanceScore: scoreProduct(p, query) })).filter(p => p.relevanceScore > 0)
  } else {
    results = results.map(p => ({ ...p, relevanceScore: 50 }))
  }

  // Apply filters
  if (filters.categories?.length) results = results.filter(p => filters.categories!.includes(p.category))
  if (filters.brands?.length) results = results.filter(p => filters.brands!.includes(p.brand))
  if (filters.minPrice !== undefined) results = results.filter(p => p.price >= filters.minPrice!)
  if (filters.maxPrice !== undefined) results = results.filter(p => p.price <= filters.maxPrice!)
  if (filters.minDiscount !== undefined) results = results.filter(p => (p.discount || 0) >= filters.minDiscount!)
  if (filters.inStock !== undefined) results = results.filter(p => p.inStock === filters.inStock)

  // Sort
  switch (filters.sortBy) {
    case 'price-asc': results.sort((a, b) => a.price - b.price); break
    case 'price-desc': results.sort((a, b) => b.price - a.price); break
    case 'discount-desc': results.sort((a, b) => (b.discount || 0) - (a.discount || 0)); break
    case 'newest': results.reverse(); break
    default: results.sort((a, b) => b.relevanceScore - a.relevanceScore)
  }

  return results.slice(0, 100).map(p => ({
    id: p.id, name: p.name || p.title, brand: p.brand, category: p.category,
    price: p.price, originalPrice: p.originalPrice, discount: p.discount,
    image: p.image, affiliateUrl: p.affiliateUrl, platform: p.platform || 'Amazon',
    inStock: p.inStock !== false, relevanceScore: p.relevanceScore,
  }))
}

export function getSearchSuggestions(query: string): string[] {
  if (!query.trim() || query.length < 2) return []
  const q = query.toLowerCase()
  const suggestions = new Set<string>()
  INDIA_CATALOG.forEach((p: any) => {
    const name = (p.name || '').toLowerCase()
    if (name.includes(q)) suggestions.add(p.name || '')
    if ((p.brand || '').toLowerCase().includes(q)) suggestions.add(p.brand || '')
  })
  return Array.from(suggestions).slice(0, 8)
}