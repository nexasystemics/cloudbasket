// lib/india-catalog/utils.ts
// A19: Module-level Map cache for all utility functions (static data, no TTL needed).

import { INDIA_CATALOG } from './index'
import { IndiaProduct, IndiaCategory } from './types'
import type { CatalogProduct, CategorySlug, PlatformLabel } from '@/lib/cloudbasket-data'

const CATEGORY_MAP: Record<IndiaCategory, CategorySlug> = {
  'personal-care': 'beauty',
  'home-appliances': 'home',
  'electronics': 'electronics',
  'fashion': 'fashion',
  'food-grocery': 'grocery',
  'sports': 'electronics',
  'toys': 'electronics',
  'books': 'electronics',
} as const

const PLATFORM_MAP: Record<string, PlatformLabel> = {
  amazon: 'Amazon',
  flipkart: 'Flipkart',
  myntra: 'Myntra',
  ajio: 'Flipkart',
  croma: 'Croma',
  bigbasket: 'BigBasket',
  'reliance-digital': 'Reliance Digital',
} as const

// ── Module-level caches ───────────────────────────────────────────────────────
const _categoryCache = new Map<IndiaCategory, IndiaProduct[]>()
const _brandCache = new Map<string, IndiaProduct[]>()
const _subCategoryCache = new Map<string, IndiaProduct[]>()
const _slugCache = new Map<CategorySlug, CatalogProduct[]>()
let _featuredCache: IndiaProduct[] | null = null
let _trendingCache: IndiaProduct[] | null = null
let _allAsCatalogCache: CatalogProduct[] | null = null

function toCatalogProduct(p: IndiaProduct): CatalogProduct {
  return {
    id: p.id, brand: p.brand, title: p.name,
    category: CATEGORY_MAP[p.category],
    price: p.price, mrp: p.originalPrice ?? Math.round(p.price * 1.2),
    rating: p.rating ?? 4.0, reviewCount: p.reviewCount ?? 0,
    image: p.image, platform: PLATFORM_MAP[p.affiliatePlatform] ?? 'Amazon',
    affiliateUrl: p.affiliateUrl,
    badge: p.isSponsored ? 'Sponsored' : p.isTrending ? 'Trending' : undefined,
    description: p.description, specs: p.tags, publishedAt: '2026-03-18',
  }
}

export function getIndiaCatalogAsCatalogProducts(): CatalogProduct[] {
  if (_allAsCatalogCache) return _allAsCatalogCache
  _allAsCatalogCache = INDIA_CATALOG.map(toCatalogProduct)
  return _allAsCatalogCache
}

export function getIndiaCatalogBySlug(slug: CategorySlug): CatalogProduct[] {
  const cached = _slugCache.get(slug)
  if (cached) return cached
  const result = INDIA_CATALOG.filter(p => CATEGORY_MAP[p.category] === slug).map(toCatalogProduct)
  _slugCache.set(slug, result)
  return result
}

export function getByCategory(category: IndiaCategory): IndiaProduct[] {
  const cached = _categoryCache.get(category)
  if (cached) return cached
  const result = INDIA_CATALOG.filter(p => p.category === category)
  _categoryCache.set(category, result)
  return result
}

export function getByBrand(brand: string): IndiaProduct[] {
  const key = brand.toLowerCase()
  const cached = _brandCache.get(key)
  if (cached) return cached
  const result = INDIA_CATALOG.filter(p => p.brand.toLowerCase() === key)
  _brandCache.set(key, result)
  return result
}

export function getBySubCategory(subCategory: string): IndiaProduct[] {
  const key = subCategory.toLowerCase()
  const cached = _subCategoryCache.get(key)
  if (cached) return cached
  const result = INDIA_CATALOG.filter(p => p.subCategory.toLowerCase() === key)
  _subCategoryCache.set(key, result)
  return result
}

export function getFeatured(limit?: number): IndiaProduct[] {
  if (!_featuredCache) _featuredCache = INDIA_CATALOG.filter(p => p.isFeatured)
  return limit ? _featuredCache.slice(0, limit) : _featuredCache
}

export function getTrending(limit?: number): IndiaProduct[] {
  if (!_trendingCache) _trendingCache = INDIA_CATALOG.filter(p => p.isTrending)
  return limit ? _trendingCache.slice(0, limit) : _trendingCache
}

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

export function getRelated(productId: string, limit = 4): IndiaProduct[] {
  const product = INDIA_CATALOG.find(p => p.id === productId)
  if (!product) return []
  return INDIA_CATALOG
    .filter(p => p.id !== productId && (p.subCategory === product.subCategory || p.category === product.category))
    .sort((a, b) => {
      if (a.subCategory === product.subCategory && b.subCategory !== product.subCategory) return -1
      if (a.subCategory !== product.subCategory && b.subCategory === product.subCategory) return 1
      return 0
    })
    .slice(0, limit)
}