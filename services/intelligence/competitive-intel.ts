// services/intelligence/competitive-intel.ts
// Competitive price intelligence using official affiliate APIs only (no scraping).
import { amazonAPI } from '@/services/apis/amazon-pa-api'
import { flipkartAPI } from '@/services/apis/flipkart-affiliate'
export type MarketPrice = { source: string; productName: string; price: number; discount?: number; inStock: boolean; affiliateUrl: string; fetchedAt: Date }
export type PriceSpreadAnalysis = { min: number; max: number; average: number; spread: number; spreadPercent: number; bestPlatform: string }
export class CompetitivePriceIntelligence {
  async getMarketPrices(productName: string, brand: string): Promise<MarketPrice[]> {
    const results = await Promise.allSettled([amazonAPI.searchProducts(`${productName} ${brand}`, 'All', 3), flipkartAPI.searchProducts(`${productName} ${brand}`)])
    const prices: MarketPrice[] = []
    if (results[0].status === 'fulfilled') results[0].value.filter(p => p.price > 0).slice(0, 3).forEach(p => prices.push({ source: 'amazon', productName: p.title, price: p.price, inStock: true, affiliateUrl: p.affiliateUrl, fetchedAt: new Date() }))
    if (results[1].status === 'fulfilled') results[1].value.filter(p => p.price > 0).slice(0, 3).forEach(p => prices.push({ source: 'flipkart', productName: p.title, price: p.price, discount: p.discount, inStock: p.inStock, affiliateUrl: p.affiliateUrl, fetchedAt: new Date() }))
    return prices.sort((a, b) => a.price - b.price)
  }
  calculatePriceSpread(prices: MarketPrice[]): PriceSpreadAnalysis {
    const inStock = prices.filter(p => p.inStock); if (!inStock.length) return { min: 0, max: 0, average: 0, spread: 0, spreadPercent: 0, bestPlatform: '' }
    const sorted = inStock.sort((a, b) => a.price - b.price); const min = sorted[0].price; const max = sorted[sorted.length - 1].price
    return { min, max, average: inStock.reduce((s, p) => s + p.price, 0) / inStock.length, spread: max - min, spreadPercent: Math.round(((max - min) / min) * 100), bestPlatform: sorted[0].source }
  }
  findBestPrice(prices: MarketPrice[]): MarketPrice | null { return prices.filter(p => p.inStock).sort((a, b) => a.price - b.price)[0] ?? null }
}
export const competitiveIntel = new CompetitivePriceIntelligence()

