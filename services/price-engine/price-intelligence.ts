// services/price-engine/price-intelligence.ts
// Price Intelligence Engine — tracks, compares and analyses product prices.
// Stub-safe — returns mock data when APIs are not configured.

import { isConfigured } from '@/lib/env'

export interface PricePoint {
  source: 'amazon' | 'flipkart' | 'cloudbasket' | 'stub'
  price: number
  currency: 'INR'
  inStock: boolean
  url: string
  fetchedAt: string
}

export interface PriceHistory {
  date: string // ISO
  price: number
  source: string
}

export interface PriceIntelligence {
  productId: string
  productName: string
  lowestPrice: number
  highestPrice: number
  averagePrice: number
  bestDeal: PricePoint
  allPrices: PricePoint[]
  history: PriceHistory[]
  priceDropPercent: number
  recommendation: 'buy-now' | 'wait' | 'best-price'
  lastUpdated: string
}

// Generate realistic stub price history (30 days)
function stubPriceHistory(basePrice: number): PriceHistory[] {
  const history: PriceHistory[] = []
  const now = Date.now()
  for (let i = 30; i >= 0; i--) {
    const variance = (Math.random() - 0.5) * basePrice * 0.15
    history.push({
      date: new Date(now - i * 24 * 60 * 60 * 1000).toISOString(),
      price: Math.round(basePrice + variance),
      source: 'cloudbasket',
    })
  }
  return history
}

function stubPrices(productId: string): PricePoint[] {
  const base = 999 + Math.floor(Math.random() * 9000)
  return [
    {
      source: 'amazon',
      price: base,
      currency: 'INR',
      inStock: true,
      url: `https://amazon.in/dp/${productId}?tag=cloudbasket-21`,
      fetchedAt: new Date().toISOString(),
    },
    {
      source: 'flipkart',
      price: Math.round(base * (0.95 + Math.random() * 0.1)),
      currency: 'INR',
      inStock: true,
      url: `https://flipkart.com/p/${productId}`,
      fetchedAt: new Date().toISOString(),
    },
    {
      source: 'cloudbasket',
      price: Math.round(base * (0.9 + Math.random() * 0.1)),
      currency: 'INR',
      inStock: Math.random() > 0.2,
      url: `https://cloudbasket.co/product/${productId}`,
      fetchedAt: new Date().toISOString(),
    },
  ]
}

function calcRecommendation(
  current: number,
  history: PriceHistory[]
): 'buy-now' | 'wait' | 'best-price' {
  if (history.length < 7) return 'buy-now'
  const avg =
    history.slice(-30).reduce((a, b) => a + b.price, 0) /
    Math.min(history.length, 30)
  if (current <= avg * 0.92) return 'best-price'
  if (current >= avg * 1.08) return 'wait'
  return 'buy-now'
}

class PriceIntelligenceEngine {
  private isAmazonReady(): boolean {
    return isConfigured('AMAZON_ACCESS_KEY')
  }

  private isFlipkartReady(): boolean {
    return isConfigured('FLIPKART_AFFILIATE_ID')
  }

  private async fetchAmazonPrice(productId: string): Promise<PricePoint | null> {
    if (!this.isAmazonReady()) {
      console.warn('[PriceIntelligence] Amazon not configured — skipping')
      return null
    }
    try {
      // Wire real Amazon PA-API call here
      console.warn('[PriceIntelligence] Amazon price fetch stub')
      return null
    } catch (err) {
      console.warn('[PriceIntelligence] Amazon error:', err)
      return null
    }
  }

  private async fetchFlipkartPrice(productId: string): Promise<PricePoint | null> {
    if (!this.isFlipkartReady()) {
      console.warn('[PriceIntelligence] Flipkart not configured — skipping')
      return null
    }
    try {
      // Wire real Flipkart API call here
      console.warn('[PriceIntelligence] Flipkart price fetch stub')
      return null
    } catch (err) {
      console.warn('[PriceIntelligence] Flipkart error:', err)
      return null
    }
  }

  async analyse(
    productId: string,
    productName: string
  ): Promise<PriceIntelligence> {
    try {
      const [amazon, flipkart] = await Promise.all([
        this.fetchAmazonPrice(productId),
        this.fetchFlipkartPrice(productId),
      ])

      const live = [amazon, flipkart].filter(Boolean) as PricePoint[]
      const allPrices = live.length > 0 ? live : stubPrices(productId)

      const prices = allPrices.map((p) => p.price)
      const lowestPrice = Math.min(...prices)
      const highestPrice = Math.max(...prices)
      const averagePrice = Math.round(
        prices.reduce((a, b) => a + b, 0) / prices.length
      )

      const bestDeal = allPrices.reduce((a, b) =>
        a.price <= b.price ? a : b
      )

      const history = stubPriceHistory(averagePrice)
      const previousPrice = history[0]?.price ?? averagePrice
      const priceDropPercent =
        previousPrice > lowestPrice
          ? Math.round(((previousPrice - lowestPrice) / previousPrice) * 100)
          : 0

      return {
        productId,
        productName,
        lowestPrice,
        highestPrice,
        averagePrice,
        bestDeal,
        allPrices,
        history,
        priceDropPercent,
        recommendation: calcRecommendation(lowestPrice, history),
        lastUpdated: new Date().toISOString(),
      }
    } catch (err) {
      console.warn('[PriceIntelligence] Analysis error:', err)
      const fallback = stubPrices(productId)
      const prices = fallback.map((p) => p.price)
      const history = stubPriceHistory(prices[0])
      return {
        productId,
        productName,
        lowestPrice: Math.min(...prices),
        highestPrice: Math.max(...prices),
        averagePrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
        bestDeal: fallback[0],
        allPrices: fallback,
        history,
        priceDropPercent: 0,
        recommendation: 'buy-now',
        lastUpdated: new Date().toISOString(),
      }
    }
  }
}

export const priceIntelligence = new PriceIntelligenceEngine()


