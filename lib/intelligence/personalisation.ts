// lib/intelligence/personalisation.ts
// Client-side personalisation engine — preference tracking via localStorage.
// All operations wrapped in try/catch — never crashes if storage unavailable.

type ViewEntry = { productId: string; category: string; brand: string; viewedAt: string }
type ClickEntry = { productId: string; platform: string; clickedAt: string }
type SearchEntry = { query: string; searchedAt: string }

function readLS<T>(key: string): T[] {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : [] } catch { return [] }
}
function writeLS<T>(key: string, data: T[], max: number): void {
  try { localStorage.setItem(key, JSON.stringify(data.slice(0, max))) } catch { /* no-op */ }
}

export function trackView(productId: string, category: string, brand: string): void {
  const history = readLS<ViewEntry>('cb_view_history')
  history.unshift({ productId, category, brand, viewedAt: new Date().toISOString() })
  writeLS('cb_view_history', history, 50)
}

export function trackClick(productId: string, platform: string): void {
  const history = readLS<ClickEntry>('cb_click_history')
  history.unshift({ productId, platform, clickedAt: new Date().toISOString() })
  writeLS('cb_click_history', history, 50)
}

export function trackSearch(query: string): void {
  if (!query.trim()) return
  const history = readLS<SearchEntry>('cb_search_history')
  history.unshift({ query: query.trim(), searchedAt: new Date().toISOString() })
  writeLS('cb_search_history', history, 20)
}

export function getPreferredCategories(): string[] {
  const history = readLS<ViewEntry>('cb_view_history')
  const counts: Record<string, number> = {}
  history.forEach(e => { counts[e.category] = (counts[e.category] || 0) + 1 })
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([cat]) => cat)
}

export function getPreferredBrands(): string[] {
  const history = readLS<ViewEntry>('cb_view_history')
  const counts: Record<string, number> = {}
  history.forEach(e => { counts[e.brand] = (counts[e.brand] || 0) + 1 })
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([brand]) => brand)
}

export function getPreferredPlatform(): string {
  const history = readLS<ClickEntry>('cb_click_history')
  const counts: Record<string, number> = {}
  history.forEach(e => { counts[e.platform] = (counts[e.platform] || 0) + 1 })
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
  return sorted[0]?.[0] || 'Amazon'
}

export function getRecentlyViewed(): string[] {
  return readLS<ViewEntry>('cb_view_history').slice(0, 10).map(e => e.productId)
}