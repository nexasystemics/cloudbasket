// services/apis/cj-api.ts
// Commission Junction (CJ Affiliate) API integration.
// Stubs return empty arrays when credentials are not configured.
// Wire CJ_API_KEY, CJ_PID, CJ_WEBSITE_ID in .env.local.

import { env, isConfigured } from '@/lib/env'

export type CJProduct = {
  catalogId: string
  advertiserId: string
  advertiserName: string
  name: string
  description: string
  price: number
  salePrice?: number
  imageUrl: string
  buyUrl: string
  deepLinkUrl: string
  sku: string
  inStock: boolean
  category: string
  brand?: string
  lastUpdated: Date
}

type CacheEntry = { data: CJProduct[]; expiry: number }
const CJ_BASE = 'https://product-search.api.cj.com/v2/product-search'

export class CJAffiliateAPI {
  private cache = new Map<string, CacheEntry>()

  private isReady(): boolean {
    return isConfigured('CJ_API_KEY') && isConfigured('CJ_PID')
  }

  private parseProducts(items: any[]): CJProduct[] {
    return items.map((item) => ({
      catalogId: item['catalog-id'] || item.catalogId || '',
      advertiserId: item['advertiser-id'] || item.advertiserId || '',
      advertiserName: item['advertiser-name'] || item.advertiserName || '',
      name: item.name || '',
      description: item.description || '',
      price: Number(item.price || 0),
      salePrice: item['sale-price'] ? Number(item['sale-price']) : undefined,
      imageUrl: item['image-url'] || item.imageUrl || '',
      buyUrl: item['buy-url'] || item.buyUrl || '',
      deepLinkUrl: this.getDeepLink(item['buy-url'] || '', item['advertiser-id'] || ''),
      sku: item.sku || '',
      inStock: item['in-stock'] !== 'false' && item.inStock !== false,
      category: item.category || '',
      brand: item.brand,
      lastUpdated: new Date(item['last-updated'] || Date.now()),
    }))
  }

  private getCached(key: string): CJProduct[] | null {
    const entry = this.cache.get(key)
    if (entry && entry.expiry > Date.now()) return entry.data
    this.cache.delete(key)
    return null
  }

  private setCache(key: string, data: CJProduct[]): void {
    this.cache.set(key, { data, expiry: Date.now() + 3600000 })
  }

  getDeepLink(baseUrl: string, advertiserId: string): string {
    if (!env.CJ_PID || !advertiserId || !baseUrl) return baseUrl
    return `https://www.tkqlhce.com/click-${env.CJ_PID}-${advertiserId}?url=${encodeURIComponent(baseUrl)}`
  }

  async searchProducts(query: string, advertiserIds?: string[]): Promise<CJProduct[]> {
    if (!this.isReady()) { console.warn('[CJAPI] Credentials not configured'); return [] }
    const cacheKey = `search:${query}:${advertiserIds?.join(',')}`
    const cached = this.getCached(cacheKey)
    if (cached) return cached

    try {
      const params = new URLSearchParams({
        keywords: query,
        'records-per-page': '100',
        'page-number': '1',
        currency: 'INR',
        'website-id': env.CJ_WEBSITE_ID,
      })
      if (advertiserIds?.length) params.set('advertiser-ids', advertiserIds.join(','))

      const res = await fetch(`${CJ_BASE}?${params}`, {
        headers: { Authorization: `Bearer ${env.CJ_API_KEY}` },
      })
      if (!res.ok) { console.warn('[CJAPI] Search failed:', res.status); return [] }
      const json = await res.json()
      const items = json?.products?.product || json?.['cj-api']?.products?.product || []
      const products = this.parseProducts(Array.isArray(items) ? items : [items])
      this.setCache(cacheKey, products)
      return products
    } catch (err) {
      console.warn('[CJAPI] Search error:', err)
      return []
    }
  }

  async getAdvertiserProducts(advertiserId: string, maxPages = 5): Promise<CJProduct[]> {
    if (!this.isReady()) return []
    const allProducts: CJProduct[] = []
    for (let page = 1; page <= maxPages; page++) {
      try {
        const params = new URLSearchParams({
          'advertiser-ids': advertiserId,
          'records-per-page': '100',
          'page-number': String(page),
          'website-id': env.CJ_WEBSITE_ID,
        })
        const res = await fetch(`${CJ_BASE}?${params}`, {
          headers: { Authorization: `Bearer ${env.CJ_API_KEY}` },
        })
        if (!res.ok) break
        const json = await res.json()
        const items = json?.products?.product || []
        const products = this.parseProducts(Array.isArray(items) ? items : [items])
        if (products.length === 0) break
        allProducts.push(...products)
        if (products.length < 100) break
      } catch { break }
    }
    return allProducts
  }

  trackCommission(orderId: string, amount: number, advertiserId: string): void {
    if (typeof window === 'undefined') return
    try {
      const img = document.createElement('img')
      img.src = `https://www.emjcd.com/tags/c?containerTagId=${env.CJ_WEBSITE_ID}&CID=${advertiserId}&OID=${orderId}&CURRENCY=INR&AMOUNT=${amount}&TYPE=471800`
      img.width = 1
      img.height = 1
      img.style.display = 'none'
      document.body.appendChild(img)
    } catch { /* no-op */ }
  }
}

export const cjAPI = new CJAffiliateAPI()