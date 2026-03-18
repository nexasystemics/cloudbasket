// Estimated: ~90 lines
import { INDIA_CATALOG } from './index'
import { IndiaProduct, IndiaCategory } from './types'

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
