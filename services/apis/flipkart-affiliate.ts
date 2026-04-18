// services/apis/flipkart-affiliate.ts
// Flipkart Affiliate API v2 — live product data, deals, and category feeds.
// Credentials: FLIPKART_AFFILIATE_ID, FLIPKART_AFFILIATE_TOKEN (.env.local)
// Endpoint: affiliate.flipkart.com | Auth: Fk-Affiliate-Id + Fk-Affiliate-Token headers

import { env, isConfigured } from '@/lib/env'

// ─── Public types ─────────────────────────────────────────────────────────────

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

export type FlipkartPriceResult = {
  price: number
  title: string
  imageUrl: string
}

// ─── Raw Flipkart Affiliate API response shapes ───────────────────────────────

interface FkMoney {
  amount?: number | string
}

interface FkItem {
  productId?: string
  id?: string
  title?: string
  name?: string
  productUrl?: string
  url?: string
  imageUrl?: string
  image?: string
  sellingPrice?: FkMoney
  price?: number | string
  mrp?: FkMoney | number | string
  discount?: number | string
  brand?: string
  category?: string
  inStock?: boolean
}

interface FkApiResponse {
  products?: FkItem[]
  result?: FkItem[]
  data?: FkItem[]
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

type CacheEntry = { data: FlipkartProduct[]; expiry: number }

const BASE_URL = 'https://affiliate.flipkart.com/api'

function isReady(): boolean {
  return isConfigured('FLIPKART_AFFILIATE_ID') && isConfigured('FLIPKART_AFFILIATE_TOKEN')
}

function getHeaders(): Record<string, string> {
  return {
    'Fk-Affiliate-Id': env.FLIPKART_AFFILIATE_ID,
    'Fk-Affiliate-Token': env.FLIPKART_AFFILIATE_TOKEN,
    'Content-Type': 'application/json',
  }
}

function resolveMrp(raw: FkMoney | number | string | undefined): number {
  if (raw === undefined || raw === null) return 0
  if (typeof raw === 'object') return Number(raw.amount ?? 0)
  return Number(raw)
}

function parseItems(response: FkApiResponse): FlipkartProduct[] {
  const items: FkItem[] = response.products ?? response.result ?? response.data ?? []
  return items.map((item) => {
    const id = item.productId ?? item.id ?? ''
    return {
      productId: id,
      title: item.title ?? item.name ?? '',
      productUrl: item.productUrl ?? item.url ?? '',
      imageUrl: item.imageUrl ?? item.image ?? '',
      price: Number(item.sellingPrice?.amount ?? item.price ?? 0),
      mrp: resolveMrp(item.mrp),
      discount: Number(item.discount ?? 0),
      affiliateUrl: `/go/fk-${id}`,
      brand: item.brand,
      category: item.category,
      inStock: item.inStock !== false,
    }
  })
}

// ─── Module-level cache (shared by standalone functions and class) ─────────────

const _cache = new Map<string, CacheEntry>()

function getCached(key: string): FlipkartProduct[] | null {
  const entry = _cache.get(key)
  if (entry && entry.expiry > Date.now()) return entry.data
  _cache.delete(key)
  return null
}

function setCache(key: string, data: FlipkartProduct[], ttlMs = 7_200_000): void {
  _cache.set(key, { data, expiry: Date.now() + ttlMs })
}

// ─── Core fetch helpers ───────────────────────────────────────────────────────

async function _get(path: string, params: Record<string, string>): Promise<FkApiResponse> {
  const qs = new URLSearchParams({ ...params, affid: env.FLIPKART_AFFILIATE_ID })
  const res = await fetch(`${BASE_URL}${path}?${qs}`, { headers: getHeaders() })

  if (res.status === 401) {
    console.warn('[FlipkartAPI] Invalid credentials (401)')
    return {}
  }
  if (res.status === 429) {
    console.warn('[FlipkartAPI] Rate limited (429)')
    return {}
  }
  if (!res.ok) {
    console.warn('[FlipkartAPI] HTTP error:', res.status)
    return {}
  }

  return (await res.json()) as FkApiResponse
}

// ─── Standalone exported functions ───────────────────────────────────────────

/**
 * Fetches live price, title, and image for a single Flipkart product ID.
 * Uses the v2 search feed and returns the first matching product.
 * Returns null if credentials are missing or the request fails.
 */
export async function fetchFlipkartProduct(
  productId: string
): Promise<FlipkartPriceResult | null> {
  if (!isReady()) {
    console.warn('[FlipkartAPI] fetchFlipkartProduct: credentials not configured')
    return null
  }

  const cacheKey = `product:${productId}`
  const cached = getCached(cacheKey)
  if (cached?.[0]) {
    const p = cached[0]
    return { price: p.price, title: p.title, imageUrl: p.imageUrl }
  }

  try {
    const json = await _get('/2.0/feeds/search', { query: productId })
    const products = parseItems(json)

    // Prefer an exact productId match; fall back to first result
    const match = products.find((p) => p.productId === productId) ?? products[0]
    if (!match) return null

    setCache(cacheKey, products)
    return { price: match.price, title: match.title, imageUrl: match.imageUrl }
  } catch (err) {
    console.warn('[FlipkartAPI] fetchFlipkartProduct error:', err)
    return null
  }
}

/**
 * Searches Flipkart for products matching the query string.
 * Returns an empty array if credentials are missing or the request fails.
 */
export async function searchFlipkartProducts(
  query: string,
  category?: string
): Promise<FlipkartProduct[]> {
  if (!isReady()) {
    console.warn('[FlipkartAPI] searchFlipkartProducts: credentials not configured')
    return []
  }

  const cacheKey = `search:${query}:${category ?? ''}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  try {
    const params: Record<string, string> = { query }
    if (category) params.category = category
    const json = await _get('/2.0/feeds/search', params)
    const products = parseItems(json)
    setCache(cacheKey, products)
    return products
  } catch (err) {
    console.warn('[FlipkartAPI] searchFlipkartProducts error:', err)
    return []
  }
}

// ─── Class API (kept for callers using flipkartAPI.searchProducts / .getDeals) ─

export class FlipkartAffiliateAPI {
  async searchProducts(query: string, category?: string): Promise<FlipkartProduct[]> {
    return searchFlipkartProducts(query, category)
  }

  async getDeals(): Promise<FlipkartProduct[]> {
    if (!isReady()) return []
    const cacheKey = 'deals'
    const cached = getCached(cacheKey)
    if (cached) return cached

    try {
      const json = await _get('/2.0/feeds/deals', {})
      const products = parseItems(json)
      setCache(cacheKey, products, 1_800_000)
      return products
    } catch (err) {
      console.warn('[FlipkartAPI] getDeals error:', err)
      return []
    }
  }

  async getCategoryFeed(categoryUrl: string): Promise<FlipkartProduct[]> {
    if (!isReady()) return []
    const cacheKey = `category:${categoryUrl}`
    const cached = getCached(cacheKey)
    if (cached) return cached

    try {
      const json = await _get('/2.0/feeds/category', { categoryUrl })
      const products = parseItems(json)
      setCache(cacheKey, products)
      return products
    } catch (err) {
      console.warn('[FlipkartAPI] getCategoryFeed error:', err)
      return []
    }
  }

  trackClick(productId: string): string {
    return `/go/fk-${productId}?affid=${env.FLIPKART_AFFILIATE_ID}`
  }
}

export const flipkartAPI = new FlipkartAffiliateAPI()
