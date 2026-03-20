// services/apis/amazon-pa-api.ts
// Amazon Product Advertising API v5 — live product data integration.
// Stubs return empty arrays when credentials are not configured.
// Wire AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, AMAZON_ASSOCIATE_TAG in .env.local.

import { signRequest } from '@/lib/aws-signature'
import { env, isConfigured } from '@/lib/env'

export type AmazonProduct = {
  asin: string
  title: string
  price: number
  currency: string
  imageUrl: string
  affiliateUrl: string
  rating?: number
  reviewCount?: number
  brand?: string
  features?: string[]
}

type CacheEntry = { data: AmazonProduct[]; expiry: number }

const ENDPOINT = 'https://webservices.amazon.in/paapi5'
const REGION = env.AMAZON_REGION || 'us-east-1'
const SERVICE = 'ProductAdvertisingAPI'
const RESOURCES = [
  'ItemInfo.Title',
  'Offers.Listings.Price',
  'Images.Primary.Large',
  'ItemInfo.ByLineInfo',
  'ItemInfo.Features',
  'CustomerReviews.Count',
  'CustomerReviews.StarRating',
]

class TokenBucket {
  private tokens = 1
  private lastRefill = Date.now()
  private queue: Array<() => void> = []

  async acquire(): Promise<void> {
    const now = Date.now()
    const elapsed = now - this.lastRefill
    this.tokens = Math.min(1, this.tokens + elapsed / 1000)
    this.lastRefill = now

    if (this.tokens >= 1) {
      this.tokens -= 1
      return
    }

    return new Promise((resolve) => {
      this.queue.push(resolve)
      setTimeout(() => {
        const next = this.queue.shift()
        if (next) { this.tokens -= 1; next() }
      }, 1000 - elapsed)
    })
  }
}

export class AmazonPAAPI {
  private cache = new Map<string, CacheEntry>()
  private rateLimiter = new TokenBucket()

  private isReady(): boolean {
    return isConfigured('AMAZON_ACCESS_KEY') && isConfigured('AMAZON_SECRET_KEY')
  }

  private parseProducts(items: any[]): AmazonProduct[] {
    return items.map((item) => ({
      asin: item.ASIN || '',
      title: item.ItemInfo?.Title?.DisplayValue || '',
      price: item.Offers?.Listings?.[0]?.Price?.Amount || 0,
      currency: item.Offers?.Listings?.[0]?.Price?.Currency || 'INR',
      imageUrl: item.Images?.Primary?.Large?.URL || '',
      affiliateUrl: `/go/${item.ASIN}`,
      rating: item.CustomerReviews?.StarRating?.Value,
      reviewCount: item.CustomerReviews?.Count,
      brand: item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue,
      features: item.ItemInfo?.Features?.DisplayValues || [],
    }))
  }

  private getCached(key: string): AmazonProduct[] | null {
    const entry = this.cache.get(key)
    if (entry && entry.expiry > Date.now()) return entry.data
    this.cache.delete(key)
    return null
  }

  private setCache(key: string, data: AmazonProduct[]): void {
    this.cache.set(key, { data, expiry: Date.now() + 3600000 })
  }

  async searchProducts(query: string, category = 'All', maxResults = 10): Promise<AmazonProduct[]> {
    if (!this.isReady()) { console.warn('[AmazonPAAPI] Credentials not configured — returning stub'); return [] }
    const cacheKey = `search:${query}:${category}`
    const cached = this.getCached(cacheKey)
    if (cached) return cached

    await this.rateLimiter.acquire()

    try {
      const body = JSON.stringify({
        Keywords: query,
        SearchIndex: category,
        Resources: RESOURCES,
        PartnerTag: env.AMAZON_ASSOCIATE_TAG,
        PartnerType: 'Associates',
        Marketplace: 'www.amazon.in',
        ItemCount: maxResults,
      })
      const url = `${ENDPOINT}/searchitems`
      const signed = signRequest('POST', url, {}, body, REGION, SERVICE, env.AMAZON_ACCESS_KEY, env.AMAZON_SECRET_KEY)
      const res = await fetch(url, { method: 'POST', headers: signed, body })
      if (!res.ok) { console.warn('[AmazonPAAPI] Search failed:', res.status); return [] }
      const json = await res.json()
      const products = this.parseProducts(json.SearchResult?.Items || [])
      this.setCache(cacheKey, products)
      return products
    } catch (err) {
      console.warn('[AmazonPAAPI] Search error:', err)
      return []
    }
  }

  async getProduct(asin: string): Promise<AmazonProduct | null> {
    if (!this.isReady()) return null
    const cacheKey = `product:${asin}`
    const cached = this.getCached(cacheKey)
    if (cached?.[0]) return cached[0]

    await this.rateLimiter.acquire()

    try {
      const body = JSON.stringify({
        ItemIds: [asin],
        Resources: RESOURCES,
        PartnerTag: env.AMAZON_ASSOCIATE_TAG,
        PartnerType: 'Associates',
        Marketplace: 'www.amazon.in',
      })
      const url = `${ENDPOINT}/getitems`
      const signed = signRequest('POST', url, {}, body, REGION, SERVICE, env.AMAZON_ACCESS_KEY, env.AMAZON_SECRET_KEY)
      const res = await fetch(url, { method: 'POST', headers: signed, body })
      if (!res.ok) return null
      const json = await res.json()
      const products = this.parseProducts(json.ItemsResult?.Items || [])
      if (products[0]) this.setCache(cacheKey, products)
      return products[0] ?? null
    } catch (err) {
      console.warn('[AmazonPAAPI] GetProduct error:', err)
      return null
    }
  }

  async getBestSellers(category: string): Promise<AmazonProduct[]> {
    return this.searchProducts('best sellers', category, 20)
  }
}

export const amazonAPI = new AmazonPAAPI()