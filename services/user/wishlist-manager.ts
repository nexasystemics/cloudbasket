export interface WishlistItem {
  id: string
  userId: string
  productId: string
  productName: string
  productUrl: string
  imageUrl: string
  platform: 'amazon' | 'flipkart' | 'cj'
  priceAtAdd: number
  currentPrice: number
  lowestPrice: number
  discount: number
  rating: number
  availability: boolean
  notes?: string
  addedAt: string
  lastChecked: string
  alertEnabled: boolean
  targetPrice?: number
}

export interface Wishlist {
  id: string
  userId: string
  name: string
  description?: string
  isPublic: boolean
  shareCode?: string
  items: WishlistItem[]
  createdAt: string
  updatedAt: string
}

export interface WishlistStats {
  totalItems: number
  totalCurrentValue: number
  totalSavings: number
  priceDropItems: number
  outOfStockItems: number
  avgDiscount: number
}

export interface PriceDropAlert {
  item: WishlistItem
  previousPrice: number
  currentPrice: number
  savings: number
  savingsPercent: number
  isTargetMet: boolean
}

export interface SharedWishlist {
  shareCode: string
  ownerName: string
  wishlistName: string
  items: Pick<
    WishlistItem,
    'productId' | 'productName' | 'imageUrl' | 'currentPrice' | 'platform' | 'affiliateUrl'
  >[]
  itemCount: number
}

// Extend WishlistItem to include affiliateUrl for shared views
export interface WishlistItemWithAffiliate extends WishlistItem {
  affiliateUrl: string
}

function generateShareCode(): string {
  return Math.random().toString(36).slice(2, 10).toUpperCase()
}

export function createWishlist(params: {
  userId: string
  name: string
  description?: string
  isPublic?: boolean
}): Wishlist {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    userId: params.userId,
    name: params.name,
    description: params.description,
    isPublic: params.isPublic ?? false,
    shareCode: params.isPublic ? generateShareCode() : undefined,
    items: [],
    createdAt: now,
    updatedAt: now,
  }
}

export function addItemToWishlist(
  wishlist: Wishlist,
  item: Omit<WishlistItem, 'id' | 'userId' | 'addedAt' | 'lastChecked' | 'lowestPrice'>
): Wishlist {
  const exists = wishlist.items.some(
    (i) => i.productId === item.productId && i.platform === item.platform
  )

  if (exists) return wishlist

  const now = new Date().toISOString()
  const newItem: WishlistItem = {
    ...item,
    id: crypto.randomUUID(),
    userId: wishlist.userId,
    lowestPrice: item.currentPrice,
    addedAt: now,
    lastChecked: now,
  }

  return {
    ...wishlist,
    items: [...wishlist.items, newItem],
    updatedAt: now,
  }
}

export function removeItemFromWishlist(wishlist: Wishlist, itemId: string): Wishlist {
  return {
    ...wishlist,
    items: wishlist.items.filter((i) => i.id !== itemId),
    updatedAt: new Date().toISOString(),
  }
}

export function updateItemPrice(
  item: WishlistItem,
  newPrice: number,
  availability: boolean
): WishlistItem {
  return {
    ...item,
    currentPrice: newPrice,
    availability,
    lowestPrice: Math.min(item.lowestPrice, newPrice),
    lastChecked: new Date().toISOString(),
  }
}

export function detectPriceDrops(
  items: WishlistItem[],
  updatedPrices: Map<string, number>
): PriceDropAlert[] {
  const alerts: PriceDropAlert[] = []

  for (const item of items) {
    const newPrice = updatedPrices.get(item.productId)
    if (newPrice === undefined) continue
    if (newPrice >= item.currentPrice) continue

    const savings = item.currentPrice - newPrice
    const savingsPercent = (savings / item.currentPrice) * 100
    const isTargetMet = item.targetPrice !== undefined && newPrice <= item.targetPrice

    alerts.push({
      item,
      previousPrice: item.currentPrice,
      currentPrice: newPrice,
      savings,
      savingsPercent: Math.round(savingsPercent * 10) / 10,
      isTargetMet,
    })
  }

  return alerts
}

export function getWishlistStats(wishlist: Wishlist): WishlistStats {
  const items = wishlist.items

  if (items.length === 0) {
    return {
      totalItems: 0,
      totalCurrentValue: 0,
      totalSavings: 0,
      priceDropItems: 0,
      outOfStockItems: 0,
      avgDiscount: 0,
    }
  }

  const totalCurrentValue = items.reduce((sum, i) => sum + i.currentPrice, 0)
  const totalSavings = items.reduce(
    (sum, i) => sum + Math.max(0, i.priceAtAdd - i.currentPrice),
    0
  )
  const priceDropItems = items.filter((i) => i.currentPrice < i.priceAtAdd).length
  const outOfStockItems = items.filter((i) => !i.availability).length
  const avgDiscount =
    items.length > 0
      ? Math.round(items.reduce((sum, i) => sum + i.discount, 0) / items.length)
      : 0

  return {
    totalItems: items.length,
    totalCurrentValue: Math.round(totalCurrentValue),
    totalSavings: Math.round(totalSavings),
    priceDropItems,
    outOfStockItems,
    avgDiscount,
  }
}

export function makeWishlistPublic(wishlist: Wishlist): Wishlist {
  return {
    ...wishlist,
    isPublic: true,
    shareCode: wishlist.shareCode ?? generateShareCode(),
    updatedAt: new Date().toISOString(),
  }
}

export function makeWishlistPrivate(wishlist: Wishlist): Wishlist {
  return {
    ...wishlist,
    isPublic: false,
    shareCode: undefined,
    updatedAt: new Date().toISOString(),
  }
}

export function getShareableWishlist(
  wishlist: Wishlist,
  ownerName: string,
  affiliateUrls: Map<string, string>
): SharedWishlist | null {
  if (!wishlist.isPublic || !wishlist.shareCode) return null

  return {
    shareCode: wishlist.shareCode,
    ownerName,
    wishlistName: wishlist.name,
    itemCount: wishlist.items.length,
    items: wishlist.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      imageUrl: item.imageUrl,
      currentPrice: item.currentPrice,
      platform: item.platform,
      affiliateUrl: affiliateUrls.get(item.productId) ?? item.productUrl,
    })),
  }
}

export function sortWishlistItems(
  items: WishlistItem[],
  sortBy: 'date' | 'price_asc' | 'price_desc' | 'discount' | 'price_drop'
): WishlistItem[] {
  const sorted = [...items]

  switch (sortBy) {
    case 'date':
      return sorted.sort(
        (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      )
    case 'price_asc':
      return sorted.sort((a, b) => a.currentPrice - b.currentPrice)
    case 'price_desc':
      return sorted.sort((a, b) => b.currentPrice - a.currentPrice)
    case 'discount':
      return sorted.sort((a, b) => b.discount - a.discount)
    case 'price_drop':
      return sorted.sort(
        (a, b) =>
          b.priceAtAdd - b.currentPrice - (a.priceAtAdd - a.currentPrice)
      )
    default:
      return sorted
  }
}
