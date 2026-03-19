// Purpose: Google Analytics 4 tracking helper functions for page and event tracking.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

function isGtagAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function'
}

export function trackPageView(url: string): void {
  if (!isGtagAvailable()) return
  window.gtag?.('event', 'page_view', { page_path: url })
}

export function trackEvent(category: string, action: string, label?: string, value?: number): void {
  if (!isGtagAvailable()) return
  const eventData: Record<string, unknown> = { event_category: category, event_action: action }
  if (label) eventData.event_label = label
  if (typeof value === 'number') eventData.value = value
  window.gtag?.('event', action, eventData)
}

export function trackAffiliateClick(productId: string, platform: string, price: number): void {
  trackEvent('affiliate', 'click', `${productId}-${platform}`, price)
}

export function trackPriceAlertSet(productId: string, targetPrice: number): void {
  trackEvent('price_alert', 'set', productId, targetPrice)
}

export function trackSearch(query: string, resultCount: number): void {
  trackEvent('search', 'submit', query, resultCount)
}

export function trackProductView(productId: string, category: string, price: number): void {
  if (!isGtagAvailable()) return
  window.gtag?.('event', 'view_item', {
    item_id: productId,
    item_category: category,
    value: price,
    currency: 'INR',
  })
}
