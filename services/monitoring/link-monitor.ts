// services/monitoring/link-monitor.ts
// Affiliate link health monitoring.

export type LinkCheckResult = { productId: string; url: string; status: 'ok' | 'broken' | 'redirected' | 'slow' | 'blocked'; statusCode: number; responseTimeMs: number; checkedAt: Date }
export type LinkHealthReport = { totalLinks: number; healthy: number; broken: number; slow: number; healthScore: number; issues: LinkCheckResult[] }

export class AffiliateLinkMonitor {
  async checkLink(productId: string, url: string): Promise<LinkCheckResult> {
    const start = Date.now()
    try {
      const r = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(10000) })
      const ms = Date.now() - start
      return { productId, url, status: r.status === 200 ? (ms > 2000 ? 'slow' : 'ok') : r.status === 404 ? 'broken' : 'redirected', statusCode: r.status, responseTimeMs: ms, checkedAt: new Date() }
    } catch { return { productId, url, status: 'broken', statusCode: 0, responseTimeMs: Date.now() - start, checkedAt: new Date() } }
  }
  async bulkCheck(productIds: string[], urls: string[]): Promise<LinkCheckResult[]> {
    const results: LinkCheckResult[] = []
    for (let i = 0; i < productIds.length; i += 10) {
      const batch = await Promise.allSettled(productIds.slice(i, i + 10).map((id, j) => this.checkLink(id, urls[i + j] || '')))
      batch.forEach(r => { if (r.status === 'fulfilled') results.push(r.value) })
    }
    return results
  }
  generateReport(results: LinkCheckResult[]): LinkHealthReport {
    const healthy = results.filter(r => r.status === 'ok').length
    return { totalLinks: results.length, healthy, broken: results.filter(r => r.status === 'broken').length, slow: results.filter(r => r.status === 'slow').length, healthScore: results.length ? Math.round((healthy / results.length) * 100) : 100, issues: results.filter(r => r.status !== 'ok') }
  }
}
export const linkMonitor = new AffiliateLinkMonitor()

