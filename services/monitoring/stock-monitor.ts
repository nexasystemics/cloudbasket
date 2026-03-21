// services/monitoring/stock-monitor.ts
import { hasSupabase, env } from '@/lib/env'
export type StockCheckResult = { productId: string; platform: string; inStock: boolean; checkedAt: Date; confidence: 'high' | 'medium' | 'low' }
export class StockMonitor {
  async checkStockStatus(productId: string, affiliateUrl: string, platform: string): Promise<StockCheckResult> {
    try {
      const r = await fetch(affiliateUrl, { method: 'HEAD', signal: AbortSignal.timeout(8000) })
      return { productId, platform, inStock: r.status !== 404 && r.status !== 410, checkedAt: new Date(), confidence: 'medium' }
    } catch { return { productId, platform, inStock: true, checkedAt: new Date(), confidence: 'low' } }
  }
}
export const stockMonitor = new StockMonitor()