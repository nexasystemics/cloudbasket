// services/seo/sitemap-manager.ts
// Dynamic sitemap generation and submission management.

import { INDIA_CATALOG } from '@/lib/india-catalog'
import { getAllBrands } from '@/lib/brand-data'

export type SitemapEntry = { url: string; lastModified: Date; changeFrequency: string; priority: number }

const STATIC_PAGES: SitemapEntry[] = [
  { url: '/', lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
  { url: '/deals', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  { url: '/deals/flash', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  { url: '/products', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  { url: '/categories', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  { url: '/search', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  { url: '/compare', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  { url: '/blog', lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
  { url: '/pod', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  { url: '/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  { url: '/contact', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  { url: '/faq', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  { url: '/associates', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  { url: '/partners', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  { url: '/app', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  { url: '/brands', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  { url: '/best-deals', lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  { url: '/sale', lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
]

export class SitemapManager {
  generateDynamicSitemap(): SitemapEntry[] {
    const productEntries = INDIA_CATALOG.slice(0, 500).map(p => ({ url: `/product/${p.id}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 }))
    const brandEntries = getAllBrands().map(b => ({ url: `/brand/${encodeURIComponent(b)}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 }))
    return [...STATIC_PAGES, ...productEntries, ...brandEntries]
  }

  toXML(entries: SitemapEntry[]): string {
    const urls = entries.map(e => `  <url>\n    <loc>https://cloudbasket.in${e.url}</loc>\n    <lastmod>${e.lastModified.toISOString().split('T')[0]}</lastmod>\n    <changefreq>${e.changeFrequency}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`).join('\n')
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`
  }

  async submitToGoogle(): Promise<{ success: boolean; message: string }> {
    try {
      const sitemapUrl = 'https://cloudbasket.in/sitemap.xml'
      const res = await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`)
      return { success: res.ok, message: res.ok ? 'Sitemap submitted to Google' : 'Submission failed' }
    } catch { return { success: false, message: 'Network error' } }
  }
}

export const sitemapManager = new SitemapManager()