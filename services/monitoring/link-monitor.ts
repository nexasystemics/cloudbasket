// services/monitoring/link-monitor.ts
// Affiliate link health monitoring system.

export type LinkCheckResult = {
  productId: string
  url: string
  status: 'ok' | 'broken' | 'redirected' | 'slow' | 'blocked'
  statusCode: number
  responseTimeMs: number
  finalUrl?: string
  redirectHops: number
  checkedAt: Date
}

export type LinkHealthReport = {
  totalLinks: number
  healthy: number
  broken: number
  slow: number
  blocked: number
  issues: LinkCheckResult[]
  healthScore: number
}

export class AffiliateLinkMonitor {
  async checkLink(productId: string, affiliateUrl: string): Promise<LinkCheckResult> {
    const start = Date.now()
    try {
      const res = await fetch(affiliateUrl, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(10000) })
      const responseTimeMs = Date.now() - start
      const status = res.status === 200 ? (responseTimeMs > 2000 ? 'slow' : 'ok') : res.status === 404 ? 'broken' : res.status === 403 ? 'blocked' : 'redirected'
      return { productId, url: affiliateUrl, status, statusCode: res.status, responseTimeMs, finalUrl: res.url, redirectHops: 0, checkedAt: new Date() }
    } catch {
      return { productId, url: affiliateUrl, status: 'broken', statusCode: 0, responseTimeMs: Date.now() - start, redirectHops: 0, checkedAt: new Date() }
    }
  }

  async bulkCheck(productIds: string[], urls: string[]): Promise<LinkCheckResult[]> {
    const results: LinkCheckResult[] = []
    for (let i = 0; i < productIds.length; i += 10) {
      const batch = await Promise.allSettled(
        productIds.slice(i, i + 10).map((id, j) => this.checkLink(id, urls[i + j] || ''))
      )
      batch.forEach(r => { if (r.status === 'fulfilled') results.push(r.value) })
    }
    return results
  }

  generateHealthReport(results: LinkCheckResult[]): LinkHealthReport {
    const healthy = results.filter(r => r.status === 'ok').length
    const broken = results.filter(r => r.status === 'broken').length
    const slow = results.filter(r => r.status === 'slow').length
    const blocked = results.filter(r => r.status === 'blocked').length
    const healthScore = results.length ? Math.round((healthy / results.length) * 100) : 100
    return { totalLinks: results.length, healthy, broken, slow, blocked, issues: results.filter(r => r.status !== 'ok'), healthScore }
  }
}

export const linkMonitor = new AffiliateLinkMonitor()