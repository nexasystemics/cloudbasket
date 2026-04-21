// lib/adsense/placement-engine.ts
// Google AdSense intelligent placement system.
// Maximises revenue without harming user experience.

export type AdFormat = 'auto' | 'rectangle' | 'horizontal' | 'vertical' | 'in-article' | 'in-feed'
export type AdPosition = 'header' | 'sidebar' | 'in-content' | 'footer' | 'between-products'

export type AdPlacement = {
  id: string
  slotId: string
  format: AdFormat
  position: AdPosition
  minContentLength?: number
  maxAdsPerPage?: number
  excludeRoutes?: string[]
}

export const PLACEMENT_CONFIG: AdPlacement[] = [
  {
    id: 'blog-in-article',
    slotId: process.env.ADSENSE_SLOT_1 || '',
    format: 'in-article',
    position: 'in-content',
    minContentLength: 500,
    maxAdsPerPage: 2,
    excludeRoutes: ['/admin', '/dashboard', '/legal', '/pod/checkout'],
  },
  {
    id: 'products-in-feed',
    slotId: process.env.ADSENSE_SLOT_2 || '',
    format: 'in-feed',
    position: 'between-products',
    maxAdsPerPage: 1,
    excludeRoutes: ['/admin', '/dashboard'],
  },
  {
    id: 'product-detail-sidebar',
    slotId: process.env.ADSENSE_SLOT_3 || '',
    format: 'rectangle',
    position: 'sidebar',
    maxAdsPerPage: 1,
    excludeRoutes: ['/admin', '/dashboard'],
  },
  {
    id: 'deals-horizontal',
    slotId: process.env.ADSENSE_SLOT_4 || '',
    format: 'horizontal',
    position: 'between-products',
    maxAdsPerPage: 1,
    excludeRoutes: ['/admin', '/dashboard'],
  },
  {
    id: 'search-footer',
    slotId: process.env.ADSENSE_SLOT_5 || '',
    format: 'horizontal',
    position: 'footer',
    maxAdsPerPage: 1,
    excludeRoutes: ['/admin', '/dashboard'],
  },
  {
    id: 'homepage-in-feed',
    slotId: process.env.ADSENSE_SLOT_6 || '',
    format: 'in-feed',
    position: 'in-content',
    maxAdsPerPage: 1,
    excludeRoutes: ['/admin', '/dashboard'],
  },
]

export function getPlacementsForRoute(route: string): AdPlacement[] {
  return PLACEMENT_CONFIG.filter((p) => {
    if (!p.slotId) return false
    if (p.excludeRoutes?.some((r) => route.startsWith(r))) return false
    return true
  })
}

export function isAdSenseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_ADSENSE_CLIENT)
}
