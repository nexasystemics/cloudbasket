import { CATALOG_PRODUCTS } from '@/lib/cloudbasket-data'
import { INDIA_CATALOG } from '@/lib/india-catalog/index'

export type Deal = {
  id: string
  title: string
  subtitle: string
  category: string
  discount: number
  discountPercent: number
  originalPrice: number
  dealPrice: number
  platform: 'Amazon' | 'Flipkart' | 'CJ Global'
  image: string
  affiliateUrl: string
  label?: string
  endsAt?: string
  expiresAt: Date
  product: {
    id: string
    title: string
    brand: string
    category: string
    description?: string
    price: number
    mrp: number
    platform: 'Amazon' | 'Flipkart' | 'CJ Global'
    image: string
    affiliateUrl: string
  }
}

function toDeal(p: any): Deal {
  const originalPrice = p.mrp ?? p.originalPrice ?? Math.round((p.price ?? p.priceValue ?? 0) * 1.2)
  const dealPrice = p.price ?? p.priceValue ?? 0
  const discount = originalPrice > 0 ? Math.round(((originalPrice - dealPrice) / originalPrice) * 100) : 0
  const expiresAt = p.expiresAt ? new Date(p.expiresAt) : p.endsAt ? new Date(p.endsAt) : new Date(Date.now() + 4 * 60 * 60 * 1000)

  const platform = p.platform === 'Flipkart' ? 'Flipkart' : p.platform === 'CJ Global' ? 'CJ Global' : 'Amazon'
  const productCategory = p.category ?? ''
  const productTitle = p.title ?? p.name ?? ''
  const productImage = p.image ?? p.imageUrl ?? ''
  const productAffiliateUrl = p.affiliateUrl ?? `/go/${platform.toLowerCase()}-${p.id}`
  const productId = String(p.id)

  return {
    id: productId,
    title: productTitle,
    subtitle: p.brand ?? '',
    category: productCategory,
    discount,
    discountPercent: discount,
    originalPrice,
    dealPrice,
    platform,
    image: productImage,
    affiliateUrl: productAffiliateUrl,
    label: p.badge ?? undefined,
    endsAt: p.endsAt ?? p.expiresAt ?? undefined,
    expiresAt,
    product: {
      id: productId,
      title: productTitle,
      brand: p.brand ?? '',
      category: productCategory,
      description: p.description ?? p.brief ?? '',
      price: dealPrice,
      mrp: originalPrice,
      platform,
      image: productImage,
      affiliateUrl: productAffiliateUrl,
    },
  }
}

export function getDailyDeals(limit = 12): Deal[] {
  const cb = CATALOG_PRODUCTS.map(toDeal)
  const india = INDIA_CATALOG.map(toDeal)
  return [...cb, ...india]
    .filter((d) => d.discount >= 10)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, limit)
}

export function getFlashDeals(limit = 20): Deal[] {
  return getDailyDeals(50)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, limit)
}
