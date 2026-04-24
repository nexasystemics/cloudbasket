// services/deals/deal-discovery.ts
// Automated deal discovery engine for CloudBasket.
// Stub-safe — returns curated stub deals when APIs not configured.

import { isConfigured } from '@/lib/env'

export interface DiscoveredDeal {
  id: string
  productId: string
  productName: string
  category: string
  originalPrice: number
  dealPrice: number
  discountPercent: number
  source: 'amazon' | 'flipkart' | 'cloudbasket' | 'stub'
  affiliateUrl: string
  expiresAt?: string
  trending: boolean
  discoveredAt: string
}

function generateId(): string {
  return `deal-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}

function formatUrl(source: string, productId: string): string {
  if (source === 'amazon') return `https://amazon.in/dp/${productId}?tag=cloudbasket-21`
  if (source === 'flipkart') return `https://flipkart.com/p/${productId}`
  return `https://cloudbasket.co/product/${productId}`
}

const STUB_DEALS: Omit<DiscoveredDeal, 'id' | 'discoveredAt'>[] = [
  {
    productId: 'boat-rockerz-450',
    productName: 'boAt Rockerz 450 Bluetooth Headphones',
    category: 'electronics',
    originalPrice: 2999,
    dealPrice: 1499,
    discountPercent: 50,
    source: 'amazon',
    affiliateUrl: formatUrl('amazon', 'boat-rockerz-450'),
    trending: true,
  },
  {
    productId: 'samsung-galaxy-m14',
    productName: 'Samsung Galaxy M14 5G 128GB',
    category: 'electronics',
    originalPrice: 15999,
    dealPrice: 11999,
    discountPercent: 25,
    source: 'flipkart',
    affiliateUrl: formatUrl('flipkart', 'samsung-galaxy-m14'),
    trending: true,
  },
  {
    productId: 'bajaj-mixer-500w',
    productName: 'Bajaj Platini Mixer Grinder 500W',
    category: 'home-appliances',
    originalPrice: 3499,
    dealPrice: 2299,
    discountPercent: 34,
    source: 'amazon',
    affiliateUrl: formatUrl('amazon', 'bajaj-mixer-500w'),
    trending: false,
  },
  {
    productId: 'puma-running-v3',
    productName: 'Puma Softride Running Shoes',
    category: 'fashion',
    originalPrice: 4999,
    dealPrice: 2999,
    discountPercent: 40,
    source: 'flipkart',
    affiliateUrl: formatUrl('flipkart', 'puma-running-v3'),
    trending: false,
  },
  {
    productId: 'hul-dove-pack',
    productName: 'Dove Moisturising Soap 6-Pack',
    category: 'personal-care',
    originalPrice: 599,
    dealPrice: 399,
    discountPercent: 33,
    source: 'amazon',
    affiliateUrl: formatUrl('amazon', 'hul-dove-pack'),
    trending: false,
  },
]

class DealDiscoveryEngine {
  private isAmazonReady(): boolean {
    return isConfigured('AMAZON_ACCESS_KEY')
  }

  private isFlipkartReady(): boolean {
    return isConfigured('FLIPKART_AFFILIATE_ID')
  }

  private async fetchAmazonDeals(): Promise<DiscoveredDeal[]> {
    if (!this.isAmazonReady()) {
      console.warn('[DealDiscovery] Amazon not configured — skipping')
      return []
    }
    try {
      console.warn('[DealDiscovery] Amazon deal fetch — wire PA-API')
      return []
    } catch (err) {
      console.warn('[DealDiscovery] Amazon error:', err)
      return []
    }
  }

  private async fetchFlipkartDeals(): Promise<DiscoveredDeal[]> {
    if (!this.isFlipkartReady()) {
      console.warn('[DealDiscovery] Flipkart not configured — skipping')
      return []
    }
    try {
      console.warn('[DealDiscovery] Flipkart deal fetch — wire API')
      return []
    } catch (err) {
      console.warn('[DealDiscovery] Flipkart error:', err)
      return []
    }
  }

  async discover(
    options: { minDiscount?: number; category?: string; limit?: number } = {}
  ): Promise<DiscoveredDeal[]> {
    const { minDiscount = 10, category, limit = 20 } = options
    try {
      const [amazon, flipkart] = await Promise.all([
        this.fetchAmazonDeals(),
        this.fetchFlipkartDeals(),
      ])

      let deals = [...amazon, ...flipkart]

      if (deals.length === 0) {
        deals = STUB_DEALS.map((d) => ({
          ...d,
          id: generateId(),
          discoveredAt: new Date().toISOString(),
        }))
      }

      return deals
        .filter((d) => d.discountPercent >= minDiscount)
        .filter((d) => !category || d.category === category)
        .sort((a, b) => b.discountPercent - a.discountPercent)
        .slice(0, limit)
    } catch (err) {
      console.warn('[DealDiscovery] Discovery error:', err)
      return STUB_DEALS.slice(0, limit).map((d) => ({
        ...d,
        id: generateId(),
        discoveredAt: new Date().toISOString(),
      }))
    }
  }

  async getTrending(limit = 5): Promise<DiscoveredDeal[]> {
    const all = await this.discover({ limit: 50 })
    return all.filter((d) => d.trending).slice(0, limit)
  }
}

export const dealDiscovery = new DealDiscoveryEngine()


