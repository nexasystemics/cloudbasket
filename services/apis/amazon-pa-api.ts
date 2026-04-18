// services/apis/amazon-pa-api.ts
// Amazon Product Advertising API v5 — live product data, India marketplace.
// Credentials: AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, AMAZON_ASSOCIATE_TAG (.env.local)
// Endpoint: webservices.amazon.in | Region: us-east-1 | Signing: AWS Sig v4

import { signRequest } from '@/lib/aws-signature'
import { env, isConfigured } from '@/lib/env'

// ─── Public types ─────────────────────────────────────────────────────────────

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

export type AmazonPriceResult = {
  price: number
  title: string
  imageUrl: string
}

// ─── Raw PA-API v5 response shapes ────────────────────────────────────────────

interface PaApiPrice {
  Amount?: number
  Currency?: string
}

interface PaApiListing {
  Price?: PaApiPrice
}

interface PaApiImageDetail {
  URL?: string
}

interface PaApiItem {
  ASIN?: string
  ItemInfo?: {
    Title?: { DisplayValue?: string }
    ByLineInfo?: { Brand?: { DisplayValue?: string } }
    Features?: { DisplayValues?: string[] }
  }
  Offers?: {
    Listings?: PaApiListing[]
  }
  Images?: {
    Primary?: { Large?: PaApiImageDetail }
  }
  CustomerReviews?: {
    Count?: number
    StarRating?: { Value?: number }
  }
}

interface PaApiSearchResponse {
  SearchResult?: { Items?: PaApiItem[] }
}

interface PaApiGetItemsResponse {
  ItemsResult?: { Items?: PaApiItem[] }
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

type CacheEntry = { data: AmazonProduct[]; expiry: number }

const ENDPOINT = 'https://webservices.amazon.in/paapi5'
// PA-API v5 always signs against us-east-1 regardless of marketplace
const REGION = 'us-east-1'
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

// Associates tag: reads NEXT_PUBLIC_AMAZON_AFFILIATE_TAG first, then falls back
// to AMAZON_ASSOCIATE_TAG which is the canonical project env var (default: cloudbasket-21)
function affiliateTag(): string {
  return (
    process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG ||
    env.AMAZON_ASSOCIATE_TAG ||
    'cloudbasket-21'
  )
}

function isReady(): boolean {
  return isConfigured('AMAZON_ACCESS_KEY') && isConfigured('AMAZON_SECRET_KEY')
}

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

function parseProducts(items: PaApiItem[]): AmazonProduct[] {
  return items.map((item) => ({
    asin: item.ASIN ?? '',
    title: item.ItemInfo?.Title?.DisplayValue ?? '',
    price: item.Offers?.Listings?.[0]?.Price?.Amount ?? 0,
    currency: item.Offers?.Listings?.[0]?.Price?.Currency ?? 'INR',
    imageUrl: item.Images?.Primary?.Large?.URL ?? '',
    affiliateUrl: `/go/${item.ASIN ?? ''}`,
    rating: item.CustomerReviews?.StarRating?.Value,
    reviewCount: item.CustomerReviews?.Count,
    brand: item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue,
    features: item.ItemInfo?.Features?.DisplayValues ?? [],
  }))
}

// ─── Module-level cache + rate limiter (shared across class and standalone fns) ─

const _cache = new Map<string, CacheEntry>()
const _rateLimiter = new TokenBucket()

function getCached(key: string): AmazonProduct[] | null {
  const entry = _cache.get(key)
  if (entry && entry.expiry > Date.now()) return entry.data
  _cache.delete(key)
  return null
}

function setCache(key: string, data: AmazonProduct[]): void {
  _cache.set(key, { data, expiry: Date.now() + 3_600_000 })
}

// ─── Core fetch helpers ───────────────────────────────────────────────────────

async function _getItems(asins: string[]): Promise<AmazonProduct[]> {
  const body = JSON.stringify({
    ItemIds: asins,
    Resources: RESOURCES,
    PartnerTag: affiliateTag(),
    PartnerType: 'Associates',
    Marketplace: 'www.amazon.in',
  })
  const url = `${ENDPOINT}/getitems`
  const headers = signRequest(
    'POST', url, {}, body, REGION, SERVICE,
    env.AMAZON_ACCESS_KEY, env.AMAZON_SECRET_KEY
  )
  const res = await fetch(url, { method: 'POST', headers, body })
  if (!res.ok) {
    console.warn('[AmazonPAAPI] GetItems HTTP error:', res.status, await res.text().catch(() => ''))
    return []
  }
  const json = (await res.json()) as PaApiGetItemsResponse
  return parseProducts(json.ItemsResult?.Items ?? [])
}

async function _searchItems(query: string, category: string, maxResults: number): Promise<AmazonProduct[]> {
  const body = JSON.stringify({
    Keywords: query,
    SearchIndex: category,
    Resources: RESOURCES,
    PartnerTag: affiliateTag(),
    PartnerType: 'Associates',
    Marketplace: 'www.amazon.in',
    ItemCount: maxResults,
  })
  const url = `${ENDPOINT}/searchitems`
  const headers = signRequest(
    'POST', url, {}, body, REGION, SERVICE,
    env.AMAZON_ACCESS_KEY, env.AMAZON_SECRET_KEY
  )
  const res = await fetch(url, { method: 'POST', headers, body })
  if (!res.ok) {
    console.warn('[AmazonPAAPI] SearchItems HTTP error:', res.status, await res.text().catch(() => ''))
    return []
  }
  const json = (await res.json()) as PaApiSearchResponse
  return parseProducts(json.SearchResult?.Items ?? [])
}

// ─── Standalone exported functions ───────────────────────────────────────────

/**
 * Fetches live price, title, and image for a single ASIN from Amazon India.
 * Returns null if credentials are missing or the request fails.
 */
export async function fetchAmazonPrice(asin: string): Promise<AmazonPriceResult | null> {
  if (!isReady()) {
    console.warn('[AmazonPAAPI] fetchAmazonPrice: credentials not configured')
    return null
  }
  const cacheKey = `product:${asin}`
  const cached = getCached(cacheKey)
  if (cached?.[0]) {
    const p = cached[0]
    return { price: p.price, title: p.title, imageUrl: p.imageUrl }
  }

  await _rateLimiter.acquire()

  try {
    const products = await _getItems([asin])
    const product = products[0]
    if (!product) return null
    setCache(cacheKey, products)
    return { price: product.price, title: product.title, imageUrl: product.imageUrl }
  } catch (err) {
    console.warn('[AmazonPAAPI] fetchAmazonPrice error:', err)
    return null
  }
}

/**
 * Searches Amazon India for products matching the query.
 * Returns an empty array if credentials are missing or the request fails.
 */
export async function searchAmazonProducts(
  query: string,
  category = 'All',
  maxResults = 10
): Promise<AmazonProduct[]> {
  if (!isReady()) {
    console.warn('[AmazonPAAPI] searchAmazonProducts: credentials not configured')
    return []
  }
  const cacheKey = `search:${query}:${category}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  await _rateLimiter.acquire()

  try {
    const products = await _searchItems(query, category, maxResults)
    setCache(cacheKey, products)
    return products
  } catch (err) {
    console.warn('[AmazonPAAPI] searchAmazonProducts error:', err)
    return []
  }
}

// ─── Class API (kept for callers that use amazonAPI.getProduct / .searchProducts) ──

export class AmazonPAAPI {
  async searchProducts(query: string, category = 'All', maxResults = 10): Promise<AmazonProduct[]> {
    return searchAmazonProducts(query, category, maxResults)
  }

  async getProduct(asin: string): Promise<AmazonProduct | null> {
    if (!isReady()) return null
    const cacheKey = `product:${asin}`
    const cached = getCached(cacheKey)
    if (cached?.[0]) return cached[0]

    await _rateLimiter.acquire()

    try {
      const products = await _getItems([asin])
      if (products[0]) setCache(cacheKey, products)
      return products[0] ?? null
    } catch (err) {
      console.warn('[AmazonPAAPI] getProduct error:', err)
      return null
    }
  }

  async getBestSellers(category: string): Promise<AmazonProduct[]> {
    return searchAmazonProducts('best sellers', category, 20)
  }
}

export const amazonAPI = new AmazonPAAPI()
