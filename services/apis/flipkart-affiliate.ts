// services/apis/flipkart-affiliate.ts
// Flipkart Affiliate API integration — live product data and deal feeds.
// Stubs return empty arrays when credentials are not configured.
// Wire FLIPKART_AFFILIATE_ID, FLIPKART_AFFILIATE_TOKEN in .env.local.

import { env, isConfigured } from '@/lib/env'

export type FlipkartProduct = {
  productId: string
  title: string
  productUrl: string
  imageUrl: string
  price: number
  mrp: number
  discount: number
  affiliateUrl: string
  brand?: string
  category?: string
  inStock: boolean
}

type CacheEntry = { data: FlipkartProduct[]; expiry: number }

const BASE_URL = 'https://affiliate.flipkart.com/api'

export class FlipkartAffiliateAPI {
  private cache = new Map<string, CacheEntry>()

  private isReady(): boolean {
    return isConfigured('FLIPKART_AFFILIATE_ID') && isConfigured('FLIPKART_AFFILIATE_TOKEN')
  }

  private getHeaders(): Record<string, string> {
    return {
      'Fk-Affiliate-Id': env.FLIPKART_AFFILIATE_ID,
      'Fk-Affiliate-Token': env.FLIPKART_AFFILIATE_TOKEN,
      'Content-Type': 'application/json',
    }
  }

  private getCached(key: string): FlipkartProduct[] | null {
    const entry = this.cache.get(key)
    if (entry && entry.expiry > Date.now()) return entry.data
    this.cache.delete(key)
    return null
  }

  private setCache(key: string, data: FlipkartProduct[], ttlMs = 7200000): void {
    this.cache.set(key, { data, expiry: Date.now() + ttlMs })
  }

  private parseFlipkartJSON(json: any): FlipkartProduct[] {
    try {
      const items = json?.products || json?.result || json?.data || []
      return items.map((item: any) => ({
        productId: item.productId || item.id || '',
        title: item.title || item.name || '',
        productUrl: item.productUrl || item.url || '',
        imageUrl: item.imageUrl || item.image || '',
        price: Number(item.sellingPrice?.amount || item.price || 0),
        mrp: Number(item.mrp?.amount || item.mrp || 0),
        discount: Number(item.discount || 0),
        affiliateUrl: `/go/fk-${item.productId || item.id}`,
        brand: item.brand,
        category: item.category,
        inStock: item.inStock !== false,
      }))
    } catch { return [] }
  }

  async searchProducts(query: string, category?: string): Promise<FlipkartProduct[]> {
    if (!this.isReady()) { console.warn('[FlipkartAPI] Credentials not configured'); return [] }
    const cacheKey = `search:${query}:${category}`
    const cached = this.getCached(cacheKey)
    if (cached) return cached

    try {
      const params = new URLSearchParams({ query, affid: env.FLIPKART_AFFILIATE_ID })
      if (category) params.set('category', category)
      const res = await fetch(`${BASE_URL}/2.0/feeds/search?${params}`, { headers: this.getHeaders() })
      if (res.status === 401) { console.warn('[FlipkartAPI] Invalid credentials'); return [] }
      if (res.status === 429) { console.warn('[FlipkartAPI] Rate limited'); return [] }
      if (!res.ok) return []
      const json = await res.json()
      const products = this.parseFlipkartJSON(json)
      this.setCache(cacheKey, products)
      return products
    } catch (err) {
      console.warn('[FlipkartAPI] Search error:', err)
      return []
    }
  }

  async getDeals(): Promise<FlipkartProduct[]> {
    if (!this.isReady()) return []
    const cacheKey = 'deals'
    const cached = this.getCached(cacheKey)
    if (cached) return cached

    try {
      const res = await fetch(`${BASE_URL}/2.0/feeds/deals?affid=${env.FLIPKART_AFFILIATE_ID}`, { headers: this.getHeaders() })
      if (!res.ok) return []
      const json = await res.json()
      const products = this.parseFlipkartJSON(json)
      this.setCache(cacheKey, products, 1800000) // 30 min TTL for deals
      return products
    } catch { return [] }
  }

  async getCategoryFeed(categoryUrl: string): Promise<FlipkartProduct[]> {
    if (!this.isReady()) return []
    const cacheKey = `category:${categoryUrl}`
    const cached = this.getCached(cacheKey)
    if (cached) return cached

    try {
      const params = new URLSearchParams({ categoryUrl, affid: env.FLIPKART_AFFILIATE_ID })
      const res = await fetch(`${BASE_URL}/2.0/feeds/category?${params}`, { headers: this.getHeaders() })
      if (!res.ok) return []
      const json = await res.json()
      const products = this.parseFlipkartJSON(json)
      this.setCache(cacheKey, products)
      return products
    } catch { return [] }
  }

  trackClick(productId: string): string {
    return `/go/fk-${productId}?affid=${env.FLIPKART_AFFILIATE_ID}`
  }
}

export const flipkartAPI = new FlipkartAffiliateAPI()