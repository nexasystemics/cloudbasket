// lib/search.ts
// Purpose: Comprehensive client-side search function with multi-filter scoring.
// A20: Search logic for Advanced Search System.

import { CATALOG_PRODUCTS, type CatalogProduct } from '@/lib/cloudbasket-data'
import { INDIA_CATALOG, type IndiaProduct } from '@/lib/india-catalog'

export interface SearchFilters {
  categories?: string[]
  brands?: string[]
  platforms?: string[]
  minPrice?: number
  maxPrice?: number
  minDiscount?: number
  inStock?: boolean
  sortBy?: 'relevance' | 'price-asc' | 'price-desc' | 'discount-desc' | 'newest'
}

// Unified product type for search results
export type SearchProduct = (IndiaProduct | CatalogProduct) & {
  relevanceScore: number
  displayPrice: number
  displayOriginalPrice: number
  displayDiscount: number
  displayPlatform: string
  isIndiaProduct: boolean
  unifiedId: string // A unique ID for deduplication
}

const ALL_PRODUCTS: SearchProduct[] = (() => {
  const unifiedProducts = new Map<string, SearchProduct>();

  [...CATALOG_PRODUCTS, ...INDIA_CATALOG].forEach(p => {
    let product: SearchProduct

    if ('category' in p && 'affiliatePlatform' in p) { // IndiaProduct
      const originalPrice = p.originalPrice ?? Math.round(p.price * 1.2)
      product = {
        ...p,
        relevanceScore: 0,
        displayPrice: p.price,
        displayOriginalPrice: originalPrice,
        displayDiscount: Math.max(0, Math.round(((originalPrice - p.price) / originalPrice) * 100)),
        displayPlatform: p.affiliatePlatform, // Use raw affiliatePlatform for filtering
        isIndiaProduct: true,
        unifiedId: p.id,
      } as SearchProduct
    } else { // CatalogProduct
      const originalPrice = p.mrp ?? p.price
      product = {
        id: p.id,
        name: p.title, // Map title to name for consistency
        image: p.image,
        brand: p.brand,
        price: p.price,
        originalPrice: originalPrice,
        description: p.description,
        relevanceScore: 0,
        displayPrice: p.price,
        displayOriginalPrice: originalPrice,
        displayDiscount: Math.max(0, Math.round(((originalPrice - p.price) / originalPrice) * 100)),
        displayPlatform: p.platform, // Use raw platform for filtering
        isIndiaProduct: false,
        unifiedId: p.id,
      } as SearchProduct
    }
    // Deduplicate by ID, India products take precedence if IDs clash
    if (!unifiedProducts.has(product.unifiedId) || product.isIndiaProduct) {
      unifiedProducts.set(product.unifiedId, product);
    }
  });

  return Array.from(unifiedProducts.values());
})();

export function searchProducts(query: string, filters: SearchFilters): SearchProduct[] {
  let results = ALL_PRODUCTS.map(p => ({ ...p, relevanceScore: 0 }))
  const lowerQuery = query.toLowerCase().trim()

  // 1. Scoring based on query
  if (lowerQuery) {
    results = results.map(product => {
      let score = 0
      const name = product.name.toLowerCase()
      const brand = product.brand ? product.brand.toLowerCase() : ''
      const description = product.description ? product.description.toLowerCase() : ''
      const tags = (('tags' in product && product.tags) ? product.tags.map((t: string) => t.toLowerCase()) : []).join(' ')

      if (name === lowerQuery) score += 100 // exact name match
      else if (name.includes(lowerQuery)) score += 80 // name contains query
      if (brand.includes(lowerQuery)) score += 70 // brand match
      if (tags.includes(lowerQuery)) score += 50 // tag match
      if (description.includes(lowerQuery)) score += 30 // description match

      return { ...product, relevanceScore: score }
    }).filter(product => product.relevanceScore > 0) // Only include products with a score
  }

  // 2. Apply Filters
  if (filters.categories && filters.categories.length > 0) {
    results = results.filter(p => filters.categories?.includes(p.category))
  }
  if (filters.brands && filters.brands.length > 0) {
    results = results.filter(p => p.brand && filters.brands?.includes(p.brand))
  }
  if (filters.platforms && filters.platforms.length > 0) {
    results = results.filter(p => p.displayPlatform && filters.platforms?.includes(p.displayPlatform))
  }
  if (filters.minPrice !== undefined) {
    results = results.filter(p => p.displayPrice >= filters.minPrice!)
  }
  if (filters.maxPrice !== undefined) {
    results = results.filter(p => p.displayPrice <= filters.maxPrice!)
  }
  if (filters.minDiscount !== undefined) {
    results = results.filter(p => p.displayDiscount >= filters.minDiscount!)
  }
  if (filters.inStock === true) {
    results = results.filter(p => p.inStock !== false) // inStock is true or undefined (assumed in stock)
  }

  // 3. Sorting
  if (filters.sortBy === 'price-asc') {
    results.sort((a, b) => a.displayPrice - b.displayPrice)
  } else if (filters.sortBy === 'price-desc') {
    results.sort((a, b) => b.displayPrice - a.displayPrice)
  } else if (filters.sortBy === 'discount-desc') {
    results.sort((a, b) => b.displayDiscount - a.displayDiscount)
  } else if (filters.sortBy === 'newest') {
    // Assuming newer items have higher IDs or a 'publishedAt' date
    // For simplicity, let's sort by ID for now, or add a 'publishedAt' to unified type
    results.sort((a, b) => (b.isIndiaProduct ? b.id.localeCompare(a.id) : String(b.id).localeCompare(String(a.id))))
  } else { // Default to relevance (or if sortBy is 'relevance')
    results.sort((a, b) => b.relevanceScore - a.relevanceScore)
  }

  return results
}

// Helper to get unique values for filters from all products
export function getAvailableFilterOptions() {
  const categories = new Set<string>()
  const brands = new Set<string>()
  const platforms = new Set<string>()
  let minPrice = Infinity
  let maxPrice = 0
  let minDiscount = 0 // Assuming all products have at least 0% discount

  ALL_PRODUCTS.forEach(p => {
    if (p.category) categories.add(p.category)
    if (p.brand) brands.add(p.brand)
    if (p.displayPlatform) platforms.add(p.displayPlatform)

    minPrice = Math.min(minPrice, p.displayPrice)
    maxPrice = Math.max(maxPrice, p.displayPrice)
    minDiscount = Math.max(minDiscount, p.displayDiscount) // Update minimum observed discount
  })

  return {
    categories: Array.from(categories).sort(),
    brands: Array.from(brands).sort(),
    platforms: Array.from(platforms).sort(),
    minPrice: Math.floor(minPrice),
    maxPrice: Math.ceil(maxPrice),
    minDiscount: 0, // Always start discount slider from 0
    maxDiscount: Math.ceil(minDiscount), // Max observed discount
  }
}
