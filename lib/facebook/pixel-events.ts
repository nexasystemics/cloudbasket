// lib/facebook/pixel-events.ts
export const fbPixel = {
  trackViewContent: (id: string, name: string, price: number) => { try { (window as any).fbq?.('track', 'ViewContent', { content_ids: [id], content_name: name, value: price, currency: 'INR', content_type: 'product' }) } catch { /* no-op */ } },
  trackSearch: (query: string) => { try { (window as any).fbq?.('track', 'Search', { search_string: query }) } catch { /* no-op */ } },
  trackAffiliateClick: (id: string, platform: string, price: number) => { try { (window as any).fbq?.('trackCustom', 'AffiliateClick', { content_id: id, platform, value: price }) } catch { /* no-op */ } },
}
