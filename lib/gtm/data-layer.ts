// lib/gtm/data-layer.ts
// Google Tag Manager dataLayer event helpers.
export const GTM_EVENTS = { PAGE_VIEW: 'page_view', PRODUCT_VIEW: 'view_item', AFFILIATE_CLICK: 'affiliate_click', SEARCH: 'search', ADD_TO_WISHLIST: 'add_to_wishlist', PRICE_ALERT_SET: 'price_alert_set' } as const
function push(data: Record<string, unknown>): void { if (typeof window === 'undefined') return; try { const w = window as any; (w.dataLayer = w.dataLayer || []).push(data) } catch { /* no-op */ } }
export const gtm = {
  pushPageView: (pageType: string) => push({ event: GTM_EVENTS.PAGE_VIEW, page_type: pageType, page_location: typeof window !== 'undefined' ? window.location.pathname : '/' }),
  pushProductView: (id: string, name: string, brand: string, category: string, price: number, platform: string) => push({ event: GTM_EVENTS.PRODUCT_VIEW, item_id: id, item_name: name, item_brand: brand, item_category: category, price, currency: 'INR', affiliation: platform }),
  pushAffiliateClick: (id: string, name: string, platform: string, price: number) => push({ event: GTM_EVENTS.AFFILIATE_CLICK, item_id: id, item_name: name, platform, price, currency: 'INR' }),
  pushSearch: (query: string, resultCount: number) => push({ event: GTM_EVENTS.SEARCH, search_term: query, result_count: resultCount }),
}