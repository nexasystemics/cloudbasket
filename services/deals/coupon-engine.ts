export interface Coupon {
  id: string
  code: string
  title: string
  description: string
  platform: 'amazon' | 'flipkart' | 'myntra' | 'meesho' | 'ajio' | 'generic'
  discount: number
  discountType: 'percent' | 'flat'
  minOrderValue: number
  maxDiscount?: number
  validFrom: string
  validUntil: string
  categories: string[]
  brands: string[]
  isVerified: boolean
  successRate: number
  usageCount: number
  sourceUrl?: string
}

export interface CouponSearchParams {
  platform?: string
  category?: string
  minDiscount?: number
  query?: string
}

export interface CouponSearchResult {
  coupons: Coupon[]
  total: number
  platform?: string
  category?: string
}

export interface CouponValidationResult {
  code: string
  isValid: boolean
  isExpired: boolean
  successRate: number
  lastWorked?: string
  reportedBroken: number
}

export interface DiscountCalculation {
  finalPrice: number
  savings: number
  applicable: boolean
  reason?: string
}

export interface ExpiryStatus {
  label: string
  urgency: 'low' | 'medium' | 'high'
  hoursLeft: number
}

const MOCK_COUPONS: Coupon[] = [
  {
    id: 'cpn_001',
    code: 'SAVE10',
    title: '10% Off Sitewide',
    description: 'Get 10% off on all products. Max discount ₹500.',
    platform: 'amazon',
    discount: 10,
    discountType: 'percent',
    minOrderValue: 0,
    maxDiscount: 500,
    validFrom: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    categories: ['electronics', 'fashion'],
    brands: [],
    isVerified: true,
    successRate: 87,
    usageCount: 1423,
  },
  {
    id: 'cpn_002',
    code: 'FLAT200',
    title: '₹200 Off on ₹999+',
    description: 'Flat ₹200 discount on orders above ₹999.',
    platform: 'flipkart',
    discount: 200,
    discountType: 'flat',
    minOrderValue: 999,
    validFrom: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    categories: ['home', 'kitchen'],
    brands: [],
    isVerified: true,
    successRate: 92,
    usageCount: 876,
  },
  {
    id: 'cpn_003',
    code: 'NEW15',
    title: '15% Off for New Users',
    description: 'Exclusive 15% discount for first-time buyers.',
    platform: 'generic',
    discount: 15,
    discountType: 'percent',
    minOrderValue: 499,
    maxDiscount: 300,
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    categories: [],
    brands: [],
    isVerified: false,
    successRate: 78,
    usageCount: 234,
  },
  {
    id: 'cpn_004',
    code: 'FASHION20',
    title: '20% Off Fashion',
    description: '20% off on all fashion and apparel products.',
    platform: 'myntra',
    discount: 20,
    discountType: 'percent',
    minOrderValue: 799,
    maxDiscount: 1000,
    validFrom: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    categories: ['fashion', 'clothing', 'footwear'],
    brands: [],
    isVerified: true,
    successRate: 81,
    usageCount: 567,
  },
]

export async function searchCoupons(params: CouponSearchParams): Promise<CouponSearchResult> {
  try {
    const now = new Date()
    let coupons = MOCK_COUPONS.filter((c) => new Date(c.validUntil) > now)

    if (params.platform) {
      coupons = coupons.filter((c) => c.platform === params.platform)
    }

    if (params.category) {
      const cat = params.category.toLowerCase()
      coupons = coupons.filter(
        (c) =>
          c.categories.length === 0 ||
          c.categories.some((ca) => ca.toLowerCase().includes(cat))
      )
    }

    if (typeof params.minDiscount === 'number') {
      coupons = coupons.filter((c) => c.discount >= params.minDiscount!)
    }

    if (params.query) {
      const q = params.query.toLowerCase()
      coupons = coupons.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q)
      )
    }

    coupons.sort((a, b) => b.successRate - a.successRate)

    return {
      coupons,
      total: coupons.length,
      platform: params.platform,
      category: params.category,
    }
  } catch (err) {
    console.warn('[CouponEngine] searchCoupons failed:', err)
    return { coupons: [], total: 0 }
  }
}

export async function validateCoupon(code: string): Promise<CouponValidationResult> {
  try {
    const now = new Date()
    const coupon = MOCK_COUPONS.find(
      (c) => c.code.toUpperCase() === code.toUpperCase()
    )

    if (!coupon) {
      return {
        code,
        isValid: false,
        isExpired: false,
        successRate: 0,
        reportedBroken: 0,
      }
    }

    const isExpired = new Date(coupon.validUntil) < now

    return {
      code,
      isValid: !isExpired,
      isExpired,
      successRate: coupon.successRate,
      lastWorked: coupon.validFrom,
      reportedBroken: Math.floor((100 - coupon.successRate) / 10),
    }
  } catch (err) {
    console.warn('[CouponEngine] validateCoupon failed:', err)
    return { code, isValid: false, isExpired: false, successRate: 0, reportedBroken: 0 }
  }
}

export function calculateDiscountedPrice(
  originalPrice: number,
  coupon: Coupon
): DiscountCalculation {
  if (originalPrice < coupon.minOrderValue) {
    return {
      finalPrice: originalPrice,
      savings: 0,
      applicable: false,
      reason: `Minimum order value is ₹${coupon.minOrderValue.toLocaleString('en-IN')}`,
    }
  }

  let savings = 0

  if (coupon.discountType === 'percent') {
    savings = (originalPrice * coupon.discount) / 100
    if (coupon.maxDiscount) {
      savings = Math.min(savings, coupon.maxDiscount)
    }
  } else {
    savings = coupon.discount
  }

  const finalPrice = Math.max(0, originalPrice - savings)

  return { finalPrice, savings, applicable: true }
}

export function getExpiryStatus(coupon: Coupon): ExpiryStatus {
  const now = Date.now()
  const expiry = new Date(coupon.validUntil).getTime()
  const hoursLeft = Math.max(0, (expiry - now) / (1000 * 60 * 60))

  if (hoursLeft <= 6) return { label: 'Expires soon!', urgency: 'high', hoursLeft }
  if (hoursLeft <= 24) return { label: 'Last 24 hours', urgency: 'medium', hoursLeft }
  return { label: `${Math.ceil(hoursLeft / 24)} days left`, urgency: 'low', hoursLeft }
}

export function getBestCouponForOrder(
  coupons: Coupon[],
  orderValue: number
): Coupon | null {
  try {
    const now = new Date()
    const valid = coupons.filter(
      (c) =>
        new Date(c.validUntil) > now &&
        orderValue >= c.minOrderValue
    )

    if (valid.length === 0) return null

    return valid.reduce((best, c) => {
      const { savings: bestSavings } = calculateDiscountedPrice(orderValue, best)
      const { savings: currSavings } = calculateDiscountedPrice(orderValue, c)
      return currSavings > bestSavings ? c : best
    })
  } catch (err) {
    console.warn('[CouponEngine] getBestCouponForOrder failed:', err)
    return null
  }
}
