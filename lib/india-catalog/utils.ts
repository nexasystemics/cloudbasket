// Estimated: ~130 lines
import { INDIA_CATALOG } from './index'
import { IndiaProduct, IndiaCategory } from './types'
import type { CatalogProduct, CategorySlug, PlatformLabel } from '@/lib/cloudbasket-data'

const CATEGORY_MAP: Record<IndiaCategory, CategorySlug> = {
  'personal-care': 'beauty',
  'home-appliances': 'home',
  'electronics': 'electronics',
  'fashion': 'fashion',
  'food-grocery': 'grocery',
} as const

const PLATFORM_MAP: Record<string, PlatformLabel> = {
  amazon: 'Amazon',
  flipkart: 'Flipkart',
  myntra: 'Flipkart',
  ajio: 'Flipkart',
  croma: 'Amazon',
  bigbasket: 'Amazon',
  'reliance-digital': 'Amazon',
} as const

function toCatalogProduct(p: IndiaProduct): CatalogProduct {
  return {
    id: p.id,
    brand: p.brand,
    title: p.name,
    category: CATEGORY_MAP[p.category],
    price: p.price,
    mrp: p.originalPrice ?? Math.round(p.price * 1.2),
    rating: p.rating ?? 4.0,
    reviewCount: p.reviewCount ?? 0,
    image: p.image,
    platform: PLATFORM_MAP[p.affiliatePlatform] ?? 'Amazon',
    affiliateUrl: p.affiliateUrl,
    badge: p.isSponsored ? 'Sponsored' : p.isTrending ? 'Trending' : undefined,
    description: p.description,
    specs: p.tags,
    publishedAt: '2026-03-18',
  }
}

export function getIndiaCatalogAsCatalogProducts(): CatalogProduct[] {
  return INDIA_CATALOG.map(toCatalogProduct)
}

export function getIndiaCatalogBySlug(slug: CategorySlug): CatalogProduct[] {
  return INDIA_CATALOG
    .filter(p => CATEGORY_MAP[p.category] === slug)
    .map(toCatalogProduct)
}

/**
 * Filter products by category
 */
export function getByCategory(category: IndiaCategory): IndiaProduct[] {
  return INDIA_CATALOG.filter(p => p.category === category)
}

/**
 * Filter products by brand (case-insensitive)
 */
export function getByBrand(brand: string): IndiaProduct[] {
  const query = brand.toLowerCase()
  return INDIA_CATALOG.filter(p => p.brand.toLowerCase() === query)
}

/**
 * Filter products by sub-category
 */
export function getBySubCategory(subCategory: string): IndiaProduct[] {
  const query = subCategory.toLowerCase()
  return INDIA_CATALOG.filter(p => p.subCategory.toLowerCase() === query)
}

/**
 * Get featured products with an optional limit
 */
export function getFeatured(limit?: number): IndiaProduct[] {
  const featured = INDIA_CATALOG.filter(p => p.isFeatured)
  return limit ? featured.slice(0, limit) : featured
}

/**
 * Get trending products with an optional limit
 */
export function getTrending(limit?: number): IndiaProduct[] {
  const trending = INDIA_CATALOG.filter(p => p.isTrending)
  return limit ? trending.slice(0, limit) : trending
}

/**
 * Search catalog by name, brand, or sub-brand
 */
export function searchCatalog(query: string): IndiaProduct[] {
  const term = query.toLowerCase().trim()
  if (!term) return []
  
  return INDIA_CATALOG.filter(p => 
    p.name.toLowerCase().includes(term) ||
    p.brand.toLowerCase().includes(term) ||
    p.subBrand.toLowerCase().includes(term) ||
    p.tags.some(t => t.toLowerCase().includes(term))
  )
}

/**
 * Get related products based on category and sub-category
 */
export function getRelated(productId: string, limit: number = 4): IndiaProduct[] {
  const product = INDIA_CATALOG.find(p => p.id === productId)
  if (!product) return []

  return INDIA_CATALOG
    .filter(p => 
      p.id !== productId && 
      (p.subCategory === product.subCategory || p.category === product.category)
    )
    .sort((a, b) => {
      // Prioritize sub-category matches
      if (a.subCategory === product.subCategory && b.subCategory !== product.subCategory) return -1
      if (a.subCategory !== product.subCategory && b.subCategory === product.subCategory) return 1
      return 0
    })
    .slice(0, limit)
}
