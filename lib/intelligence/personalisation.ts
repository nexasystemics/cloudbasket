// lib/intelligence/personalisation.ts
// Purpose: Client-side personalisation engine based on user behaviour.
// A20: LocalStorage based preference tracking.

type ViewEntry = { productId: string; category: string; brand: string; viewedAt: number }
type ClickEntry = { productId: string; platform: string; clickedAt: number }
type SearchEntry = { query: string; searchedAt: number }

const KEYS = {
  VIEW_HISTORY: 'cb_view_history',
  CLICK_HISTORY: 'cb_click_history',
  SEARCH_HISTORY: 'cb_search_history',
}

/**
 * Records a product view.
 */
export function trackView(productId: string, category: string, brand: string): void {
  try {
    const history: ViewEntry[] = JSON.parse(localStorage.getItem(KEYS.VIEW_HISTORY) || '[]')
    const updated = [{ productId, category, brand, viewedAt: Date.now() }, ...history.filter(h => h.productId !== productId)].slice(0, 50)
    localStorage.setItem(KEYS.VIEW_HISTORY, JSON.stringify(updated))
  } catch (err) {
    console.error('Personalisation trackView error:', err)
  }
}

/**
 * Records a product click (exit to platform).
 */
export function trackClick(productId: string, platform: string): void {
  try {
    const history: ClickEntry[] = JSON.parse(localStorage.getItem(KEYS.CLICK_HISTORY) || '[]')
    const updated = [{ productId, platform, clickedAt: Date.now() }, ...history].slice(0, 50)
    localStorage.setItem(KEYS.CLICK_HISTORY, JSON.stringify(updated))
  } catch (err) {
    console.error('Personalisation trackClick error:', err)
  }
}

/**
 * Records a search query.
 */
export function trackSearch(query: string): void {
  if (!query.trim()) return
  try {
    const history: SearchEntry[] = JSON.parse(localStorage.getItem(KEYS.SEARCH_HISTORY) || '[]')
    const updated = [{ query: query.trim(), searchedAt: Date.now() }, ...history.filter(h => h.query !== query.trim())].slice(0, 20)
    localStorage.setItem(KEYS.SEARCH_HISTORY, JSON.stringify(updated))
  } catch (err) {
    console.error('Personalisation trackSearch error:', err)
  }
}

/**
 * Gets the top 3 preferred categories.
 */
export function getPreferredCategories(): string[] {
  try {
    const history: ViewEntry[] = JSON.parse(localStorage.getItem(KEYS.VIEW_HISTORY) || '[]')
    const counts: Record<string, number> = {}
    history.forEach(h => counts[h.category] = (counts[h.category] || 0) + 1)
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(e => e[0]).slice(0, 3)
  } catch {
    return []
  }
}

/**
 * Gets the top 3 preferred brands.
 */
export function getPreferredBrands(): string[] {
  try {
    const history: ViewEntry[] = JSON.parse(localStorage.getItem(KEYS.VIEW_HISTORY) || '[]')
    const counts: Record<string, number> = {}
    history.forEach(h => counts[h.brand] = (counts[h.brand] || 0) + 1)
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(e => e[0]).slice(0, 3)
  } catch {
    return []
  }
}

/**
 * Gets the most clicked platform.
 */
export function getPreferredPlatform(): string {
  try {
    const history: ClickEntry[] = JSON.parse(localStorage.getItem(KEYS.CLICK_HISTORY) || '[]')
    const counts: Record<string, number> = {}
    history.forEach(h => counts[h.platform] = (counts[h.platform] || 0) + 1)
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(e => e[0])[0] || ''
  } catch {
    return ''
  }
}
