// services/monitoring/link-checker.ts
const APP_ROUTES = ['/', '/products', '/deals', '/compare', '/search', '/categories', '/blog', '/pod', '/about', '/contact', '/faq', '/associates', '/partners', '/careers', '/brands', '/legal', '/app', '/best-deals', '/sale', '/sitemap-page', '/quiz', '/register', '/login', '/dashboard', '/unsubscribed']
export class BrokenLinkChecker {
  validateInternalRoute(href: string): boolean { const p = href.split('?')[0].split('#')[0]; if (['/go/','/product/','/brand/','/category/','/blog/'].some(s => p.startsWith(s))) return true; return APP_ROUTES.includes(p) }
  async checkExternalLink(url: string): Promise<{ ok: boolean; status: number }> { try { const r = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(10000) }); return { ok: r.ok, status: r.status } } catch { return { ok: false, status: 0 } } }
}
export const linkChecker = new BrokenLinkChecker()