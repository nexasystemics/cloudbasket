import { INDIA_CATALOG } from '@/lib/india-catalog'
import type { IndiaProduct, APISource } from '@/lib/india-catalog/types'

export interface PriceData {
  productId: string
  currentPrice: number
  originalPrice: number
  discount: number
  lastUpdated: string
  source: APISource
}

const priceIndex = new Map<string, IndiaProduct>(
  INDIA_CATALOG.map(p => [p.id, p])
)

export function getPriceData(productId: string): PriceData | null {
  const product = priceIndex.get(productId)
  if (!product) return null

  const originalPrice = product.originalPrice ?? Math.round(product.price * 1.2)
  const discount = product.discount ?? Math.max(0, Math.round(((originalPrice - product.price) / originalPrice) * 100))

  return {
    productId: product.id,
    currentPrice: product.price,
    originalPrice,
    discount,
    lastUpdated: new Date().toISOString(),
    source: product.apiSource,
  }
}

export function getPriceDataBulk(productIds: string[]): Map<string, PriceData> {
  const results = new Map<string, PriceData>()
  for (const id of productIds) {
    const data = getPriceData(id)
    if (data) results.set(id, data)
  }
  return results
}

export function getAllPriceData(): PriceData[] {
  return INDIA_CATALOG.map(p => getPriceData(p.id)!).filter(Boolean)
}

export const PRICE_API = {
  getPriceData,
  getPriceDataBulk,
  getAllPriceData,
  totalProducts: INDIA_CATALOG.length,
} as const
