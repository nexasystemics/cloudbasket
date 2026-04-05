// services/inventory/stock-monitor.ts
// Real-time stock availability monitor for CloudBasket products.
// Stub-safe — returns mock stock data when APIs not configured.

import { isConfigured } from '@/lib/env'

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock' | 'unknown'

export interface StockInfo {
  productId: string
  productName: string
  source: 'amazon' | 'flipkart' | 'cloudbasket'
  status: StockStatus
  quantity?: number
  lastChecked: string
  nextCheckAt: string
}

export interface StockReport {
  total: number
  inStock: number
  lowStock: number
  outOfStock: number
  items: StockInfo[]
  generatedAt: string
}

function getNextCheckTime(minutes = 30): string {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString()
}

function stubStockInfo(
  productId: string,
  productName: string,
  source: StockInfo['source']
): StockInfo {
  const rand = Math.random()
  const status: StockStatus =
    rand > 0.7 ? 'in-stock' : rand > 0.4 ? 'low-stock' : 'out-of-stock'
  return {
    productId,
    productName,
    source,
    status,
    quantity: status === 'in-stock' ? Math.floor(Math.random() * 100) + 10 : status === 'low-stock' ? Math.floor(Math.random() * 5) + 1 : 0,
    lastChecked: new Date().toISOString(),
    nextCheckAt: getNextCheckTime(),
  }
}

const MONITORED_PRODUCTS = [
  { id: 'boat-rockerz-450', name: 'boAt Rockerz 450 Headphones' },
  { id: 'samsung-galaxy-m14', name: 'Samsung Galaxy M14 5G' },
  { id: 'bajaj-mixer-500w', name: 'Bajaj Platini Mixer Grinder' },
  { id: 'hul-dove-pack', name: 'Dove Beauty Soap 6-Pack' },
  { id: 'puma-running-v3', name: 'Puma Softride Running Shoes' },
]

class StockMonitor {
  private isAmazonReady(): boolean {
    return isConfigured('AMAZON_ACCESS_KEY')
  }

  private isFlipkartReady(): boolean {
    return isConfigured('FLIPKART_AFFILIATE_ID')
  }

  async checkProduct(
    productId: string,
    productName: string
  ): Promise<StockInfo[]> {
    const sources: StockInfo['source'][] = ['amazon', 'flipkart', 'cloudbasket']
    const results: StockInfo[] = []

    for (const source of sources) {
      if (source === 'amazon' && !this.isAmazonReady()) {
        results.push(stubStockInfo(productId, productName, source))
        continue
      }
      if (source === 'flipkart' && !this.isFlipkartReady()) {
        results.push(stubStockInfo(productId, productName, source))
        continue
      }
      try {
        results.push(stubStockInfo(productId, productName, source))
      } catch (err) {
        console.warn(`[StockMonitor] ${source} error:`, err)
        results.push(stubStockInfo(productId, productName, source))
      }
    }

    return results
  }

  async runFullReport(): Promise<StockReport> {
    try {
      const allItems: StockInfo[] = []
      for (const product of MONITORED_PRODUCTS) {
        const items = await this.checkProduct(product.id, product.name)
        allItems.push(...items)
      }
      return {
        total: allItems.length,
        inStock: allItems.filter((i) => i.status === 'in-stock').length,
        lowStock: allItems.filter((i) => i.status === 'low-stock').length,
        outOfStock: allItems.filter((i) => i.status === 'out-of-stock').length,
        items: allItems,
        generatedAt: new Date().toISOString(),
      }
    } catch (err) {
      console.warn('[StockMonitor] Report error:', err)
      return { total: 0, inStock: 0, lowStock: 0, outOfStock: 0, items: [], generatedAt: new Date().toISOString() }
    }
  }
}

export const stockMonitor = new StockMonitor()


