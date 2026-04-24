// services/seo/sitemap-manager.ts
import { INDIA_CATALOG } from '@/lib/india-catalog'
export type SitemapEntry = { url: string; lastModified: Date; changeFrequency: string; priority: number }
const STATIC: SitemapEntry[] = ['/', '/deals', '/deals/flash', '/products', '/blog', '/compare', '/search', '/pod', '/about', '/contact', '/faq', '/associates', '/partners', '/app', '/brands', '/best-deals', '/sale', '/sitemap-page'].map(url => ({ url, lastModified: new Date(), changeFrequency: url === '/' || url === '/deals' ? 'daily' : 'weekly', priority: url === '/' ? 1.0 : url === '/deals' ? 0.9 : 0.7 }))
export class SitemapManager {
  generateDynamicSitemap(): SitemapEntry[] {
    const products = INDIA_CATALOG.slice(0, 500).map((p: any) => ({ url: `/product/${p.id}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 }))
    return [...STATIC, ...products]
  }
  toXML(entries: SitemapEntry[]): string {
    const urls = entries.map(e => `  <url><loc>https://cloudbasket.co${e.url}</loc><lastmod>${e.lastModified.toISOString().split('T')[0]}</lastmod><changefreq>${e.changeFrequency}</changefreq><priority>${e.priority}</priority></url>`).join('\n')
    return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`
  }
  async submitToGoogle(): Promise<{ success: boolean; message: string }> {
    try { const r = await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent('https://cloudbasket.co/sitemap.xml')}`); return { success: r.ok, message: r.ok ? 'Submitted' : 'Failed' } } catch { return { success: false, message: 'Network error' } }
  }
}
export const sitemapManager = new SitemapManager()

