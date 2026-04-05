// services/price-engine/india-apis.ts
// Purpose: API integration layer for live price fetching from free-tier APIs.
// All functions return LivePriceResult[] with static fallback if env vars are missing.

import type { IndiaProduct } from '@/lib/india-catalog/types'

export interface LivePriceResult {
  productId: string
  platform: string
  price: number
  inStock: boolean
  url: string
  fetchedAt: Date
  source: 'amazon-pa-api' | 'flipkart-affiliate' | 'open-food-facts' | 'static'
}

export interface PriceAPIConfig {
  enabled: boolean
  apiKey?: string
  associateTag?: string
  rateLimit: number
}

// ─── In-memory cache ────────────────────────────────────────────────────────
const priceCache = new Map<string, { data: LivePriceResult[]; expiry: number }>()
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

export function getCached(key: string): LivePriceResult[] | null {
  const entry = priceCache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiry) {
    priceCache.delete(key)
    return null
  }
  return entry.data
}

export function setCache(key: string, data: LivePriceResult[]): void {
  priceCache.set(key, { data, expiry: Date.now() + CACHE_TTL_MS })
}

// ─── Static fallback helper ──────────────────────────────────────────────────
function staticFallback(productIds: string[], platform: string, source: LivePriceResult['source']): LivePriceResult[] {
  return productIds.map((id) => ({
    productId: id,
    platform,
    price: 0,
    inStock: true,
    url: `https://cloudbasket.in/go/${id}`,
    fetchedAt: new Date(),
    source,
  }))
}

// ─── Amazon PA-API v5 ────────────────────────────────────────────────────────
// Endpoint: webservices.amazon.in
// Requires: AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, AMAZON_ASSOCIATE_TAG
// Free tier rate limit: 1 request per second
export async function fetchAmazonPrices(productIds: string[]): Promise<LivePriceResult[]> {
  const cacheKey = `amazon:${productIds.join(',')}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  const accessKey = process.env.AMAZON_ACCESS_KEY
  const secretKey = process.env.AMAZON_SECRET_KEY
  const associateTag = process.env.AMAZON_ASSOCIATE_TAG

  if (!accessKey || !secretKey || !associateTag) {
    console.warn('[price-engine] Amazon PA-API env vars missing — returning static fallback')
    return staticFallback(productIds, 'Amazon', 'static')
  }

  try {
    // TODO: Implement Amazon PA-API v5 signed request
    // POST https://webservices.amazon.in/paapi5/getitems
    // Headers: X-Amz-Date, Authorization (AWS4-HMAC-SHA256)
    // Body: { ItemIds: productIds, Resources: ['Offers.Listings.Price'], PartnerTag: associateTag }
    console.warn('[price-engine] Amazon PA-API: TODO — real implementation pending')
    const results = staticFallback(productIds, 'Amazon', 'amazon-pa-api')
    setCache(cacheKey, results)
    return results
  } catch (error) {
    console.error('[price-engine] Amazon fetch error:', error)
    return staticFallback(productIds, 'Amazon', 'static')
  }
}

// ─── Flipkart Affiliate API ───────────────────────────────────────────────────
// Requires: FLIPKART_AFFILIATE_ID, FLIPKART_AFFILIATE_TOKEN
export async function fetchFlipkartPrices(productIds: string[]): Promise<LivePriceResult[]> {
  const cacheKey = `flipkart:${productIds.join(',')}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  const affiliateId = process.env.FLIPKART_AFFILIATE_ID
  const affiliateToken = process.env.FLIPKART_AFFILIATE_TOKEN

  if (!affiliateId || !affiliateToken) {
    console.warn('[price-engine] Flipkart Affiliate env vars missing — returning static fallback')
    return staticFallback(productIds, 'Flipkart', 'static')
  }

  try {
    // TODO: Implement Flipkart Affiliate API
    // GET https://affiliate-api.flipkart.net/affiliate/offers/v1/dotd/json
    // Headers: Fk-Affiliate-Id, Fk-Affiliate-Token
    console.warn('[price-engine] Flipkart API: TODO — real implementation pending')
    const results = staticFallback(productIds, 'Flipkart', 'flipkart-affiliate')
    setCache(cacheKey, results)
    return results
  } catch (error) {
    console.error('[price-engine] Flipkart fetch error:', error)
    return staticFallback(productIds, 'Flipkart', 'static')
  }
}

// ─── Open Food Facts (Free, no API key) ─────────────────────────────────────
// Endpoint: https://world.openfoodfacts.org/api/v2/product/{barcode}
// Useful for food-grocery category products
export async function fetchOpenFoodFactsData(barcode: string): Promise<Partial<IndiaProduct>> {
  const cacheKey = `off:${barcode}`
  const cached = getCached(cacheKey)
  if (cached && cached.length > 0) return {}

  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${barcode}`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) throw new Error(`OpenFoodFacts returned ${res.status}`)
    const data = await res.json()
    const product = data?.product

    if (!product) return {}

    setCache(cacheKey, [])
    return {
      name: product.product_name ?? '',
      brand: product.brands ?? '',
      image: product.image_url ?? '',
      description: product.generic_name ?? '',
      tags: (product.categories_tags ?? []).slice(0, 5),
    }
  } catch (error) {
    console.error('[price-engine] OpenFoodFacts fetch error:', error)
    return {}
  }
}

