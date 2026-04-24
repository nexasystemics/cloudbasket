// services/seo/seo-updater.ts
// Automated SEO metadata updater for CloudBasket pages.
// Stub-safe — logs warnings when not configured.

import { isConfigured } from '@/lib/env'

export interface SEOMetadata {
  pageId: string
  path: string
  title: string
  description: string
  keywords: string[]
  ogTitle: string
  ogDescription: string
  canonicalUrl: string
  lastUpdated: string
}

export interface SEOAuditResult {
  pageId: string
  path: string
  issues: string[]
  score: number // 0-100
  suggestions: string[]
}

function stubMetadata(path: string): SEOMetadata {
  const slug = path.replace(/\//g, '-').replace(/^-/, '')
  return {
    pageId: `page-${slug}`,
    path,
    title: `CloudBasket — India's Smartest Price Comparison | ${slug}`,
    description: `Compare prices, find best deals and save money on ${slug} at CloudBasket. India's #1 price comparison platform.`,
    keywords: ['price comparison', 'best deals', 'india', slug, 'cloudbasket'],
    ogTitle: `Best ${slug} Deals — CloudBasket`,
    ogDescription: `Find the lowest prices on ${slug} across Amazon, Flipkart and more.`,
    canonicalUrl: `https://cloudbasket.co${path}`,
    lastUpdated: new Date().toISOString(),
  }
}

function auditMetadata(meta: SEOMetadata): SEOAuditResult {
  const issues: string[] = []
  const suggestions: string[] = []
  let score = 100

  if (meta.title.length < 30) { issues.push('Title too short (min 30 chars)'); score -= 15 }
  if (meta.title.length > 60) { issues.push('Title too long (max 60 chars)'); score -= 10 }
  if (meta.description.length < 120) { issues.push('Description too short (min 120 chars)'); score -= 15 }
  if (meta.description.length > 160) { issues.push('Description too long (max 160 chars)'); score -= 10 }
  if (meta.keywords.length < 3) { issues.push('Too few keywords (min 3)'); score -= 10 }
  if (!meta.canonicalUrl.startsWith('https://')) { issues.push('Canonical URL missing https'); score -= 20 }
  if (!meta.ogTitle) { issues.push('Missing OG title'); score -= 10 }
  if (!meta.ogDescription) { issues.push('Missing OG description'); score -= 10 }

  if (score < 70) suggestions.push('Rewrite title and description with target keywords')
  if (meta.keywords.length < 5) suggestions.push('Add more long-tail keywords')
  if (!meta.title.includes('India')) suggestions.push('Add India geo-modifier to title')

  return {
    pageId: meta.pageId,
    path: meta.path,
    issues,
    score: Math.max(0, score),
    suggestions,
  }
}

class SEOUpdater {
  private isReady(): boolean {
    return isConfigured('NEXT_PUBLIC_SITE_URL')
  }

  async generateMetadata(path: string): Promise<SEOMetadata> {
    if (!this.isReady()) {
      console.warn('[SEOUpdater] NEXT_PUBLIC_SITE_URL not set — using stub')
      return stubMetadata(path)
    }
    try {
      return stubMetadata(path)
    } catch (err) {
      console.warn('[SEOUpdater] Metadata generation error:', err)
      return stubMetadata(path)
    }
  }

  async auditPage(path: string): Promise<SEOAuditResult> {
    try {
      const meta = await this.generateMetadata(path)
      return auditMetadata(meta)
    } catch (err) {
      console.warn('[SEOUpdater] Audit error:', err)
      return {
        pageId: path,
        path,
        issues: ['Audit failed'],
        score: 0,
        suggestions: ['Retry audit'],
      }
    }
  }

  async auditBatch(paths: string[]): Promise<SEOAuditResult[]> {
    const results: SEOAuditResult[] = []
    for (const path of paths) {
      const result = await this.auditPage(path)
      results.push(result)
    }
    return results.sort((a, b) => a.score - b.score)
  }
}

export const seoUpdater = new SEOUpdater()


