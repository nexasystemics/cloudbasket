export type CashbackStatus = 'pending' | 'confirmed' | 'paid' | 'rejected' | 'expired'
export type CashbackPlatform = 'amazon' | 'flipkart' | 'cj' | 'myntra' | 'meesho' | 'ajio'

export interface CashbackTransaction {
  id: string
  userId: string
  platform: CashbackPlatform
  orderId: string
  orderValue: number
  cashbackPercent: number
  cashbackAmount: number
  status: CashbackStatus
  affiliateCommission: number
  userShare: number // amount user actually gets
  createdAt: string
  confirmedAt?: string
  paidAt?: string
  expiresAt: string
  productName?: string
  productCategory?: string
}

export interface CashbackSummary {
  userId: string
  totalEarned: number
  pendingAmount: number
  confirmedAmount: number
  paidAmount: number
  rejectedAmount: number
  transactionCount: number
  byPlatform: PlatformBreakdown[]
}

export interface PlatformBreakdown {
  platform: CashbackPlatform
  transactionCount: number
  totalCashback: number
  pendingCashback: number
  confirmedCashback: number
}

export interface CashbackRate {
  platform: CashbackPlatform
  category: string
  affiliatePercent: number
  userPercent: number // share passed to user
  minOrderValue: number
  maxCashback?: number
}

export interface CashbackWithdrawal {
  id: string
  userId: string
  amount: number
  method: 'upi' | 'bank' | 'wallet'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  upiId?: string
  bankAccount?: string
  requestedAt: string
  processedAt?: string
  referenceId?: string
}

// Cashback rates per platform and category
const CASHBACK_RATES: CashbackRate[] = [
  { platform: 'amazon', category: 'electronics', affiliatePercent: 4, userPercent: 2, minOrderValue: 299 },
  { platform: 'amazon', category: 'fashion', affiliatePercent: 9, userPercent: 4.5, minOrderValue: 199 },
  { platform: 'amazon', category: 'home', affiliatePercent: 7, userPercent: 3.5, minOrderValue: 299 },
  { platform: 'amazon', category: 'default', affiliatePercent: 4, userPercent: 2, minOrderValue: 199 },
  { platform: 'flipkart', category: 'electronics', affiliatePercent: 5, userPercent: 2.5, minOrderValue: 299 },
  { platform: 'flipkart', category: 'fashion', affiliatePercent: 10, userPercent: 5, minOrderValue: 199 },
  { platform: 'flipkart', category: 'default', affiliatePercent: 5, userPercent: 2.5, minOrderValue: 199 },
  { platform: 'myntra', category: 'fashion', affiliatePercent: 8, userPercent: 4, minOrderValue: 399 },
  { platform: 'myntra', category: 'default', affiliatePercent: 8, userPercent: 4, minOrderValue: 399 },
  { platform: 'meesho', category: 'default', affiliatePercent: 12, userPercent: 6, minOrderValue: 99 },
  { platform: 'ajio', category: 'fashion', affiliatePercent: 9, userPercent: 4.5, minOrderValue: 299 },
  { platform: 'ajio', category: 'default', affiliatePercent: 9, userPercent: 4.5, minOrderValue: 299 },
  { platform: 'cj', category: 'default', affiliatePercent: 6, userPercent: 3, minOrderValue: 299 },
]

export function getCashbackRate(
  platform: CashbackPlatform,
  category: string
): CashbackRate | null {
  const specific = CASHBACK_RATES.find(
    (r) => r.platform === platform && r.category === category.toLowerCase()
  )
  if (specific) return specific

  const fallback = CASHBACK_RATES.find(
    (r) => r.platform === platform && r.category === 'default'
  )
  return fallback ?? null
}

export function calculateCashback(
  platform: CashbackPlatform,
  category: string,
  orderValue: number
): { affiliateCommission: number; userCashback: number; rate: CashbackRate | null } {
  const rate = getCashbackRate(platform, category)

  if (!rate || orderValue < rate.minOrderValue) {
    return { affiliateCommission: 0, userCashback: 0, rate }
  }

  let affiliateCommission = (orderValue * rate.affiliatePercent) / 100
  let userCashback = (orderValue * rate.userPercent) / 100

  if (rate.maxCashback) {
    userCashback = Math.min(userCashback, rate.maxCashback)
  }

  affiliateCommission = Math.round(affiliateCommission * 100) / 100
  userCashback = Math.round(userCashback * 100) / 100

  return { affiliateCommission, userCashback, rate }
}

export function createCashbackTransaction(params: {
  userId: string
  platform: CashbackPlatform
  orderId: string
  orderValue: number
  category?: string
  productName?: string
}): CashbackTransaction {
  const category = params.category ?? 'default'
  const { affiliateCommission, userCashback, rate } = calculateCashback(
    params.platform,
    category,
    params.orderValue
  )

  return {
    id: crypto.randomUUID(),
    userId: params.userId,
    platform: params.platform,
    orderId: params.orderId,
    orderValue: params.orderValue,
    cashbackPercent: rate?.userPercent ?? 0,
    cashbackAmount: userCashback,
    status: 'pending',
    affiliateCommission,
    userShare: userCashback,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    productName: params.productName,
    productCategory: category,
  }
}

export function getCashbackSummary(
  userId: string,
  transactions: CashbackTransaction[]
): CashbackSummary {
  const userTxns = transactions.filter((t) => t.userId === userId)

  const totalEarned = userTxns
    .filter((t) => t.status !== 'rejected' && t.status !== 'expired')
    .reduce((sum, t) => sum + t.userShare, 0)

  const pendingAmount = userTxns
    .filter((t) => t.status === 'pending')
    .reduce((sum, t) => sum + t.userShare, 0)

  const confirmedAmount = userTxns
    .filter((t) => t.status === 'confirmed')
    .reduce((sum, t) => sum + t.userShare, 0)

  const paidAmount = userTxns
    .filter((t) => t.status === 'paid')
    .reduce((sum, t) => sum + t.userShare, 0)

  const rejectedAmount = userTxns
    .filter((t) => t.status === 'rejected')
    .reduce((sum, t) => sum + t.userShare, 0)

  const platforms: CashbackPlatform[] = ['amazon', 'flipkart', 'cj', 'myntra', 'meesho', 'ajio']
  const byPlatform: PlatformBreakdown[] = platforms
    .map((platform) => {
      const platformTxns = userTxns.filter((t) => t.platform === platform)
      return {
        platform,
        transactionCount: platformTxns.length,
        totalCashback: platformTxns.reduce((sum, t) => sum + t.userShare, 0),
        pendingCashback: platformTxns
          .filter((t) => t.status === 'pending')
          .reduce((sum, t) => sum + t.userShare, 0),
        confirmedCashback: platformTxns
          .filter((t) => t.status === 'confirmed')
          .reduce((sum, t) => sum + t.userShare, 0),
      }
    })
    .filter((p) => p.transactionCount > 0)

  return {
    userId,
    totalEarned: Math.round(totalEarned * 100) / 100,
    pendingAmount: Math.round(pendingAmount * 100) / 100,
    confirmedAmount: Math.round(confirmedAmount * 100) / 100,
    paidAmount: Math.round(paidAmount * 100) / 100,
    rejectedAmount: Math.round(rejectedAmount * 100) / 100,
    transactionCount: userTxns.length,
    byPlatform,
  }
}

export function createWithdrawal(params: {
  userId: string
  amount: number
  method: CashbackWithdrawal['method']
  upiId?: string
  bankAccount?: string
}): CashbackWithdrawal {
  return {
    id: crypto.randomUUID(),
    userId: params.userId,
    amount: params.amount,
    method: params.method,
    status: 'pending',
    upiId: params.upiId,
    bankAccount: params.bankAccount,
    requestedAt: new Date().toISOString(),
  }
}

export function getStatusLabel(status: CashbackStatus): { label: string; color: string } {
  const map: Record<CashbackStatus, { label: string; color: string }> = {
    pending: { label: 'Pending Confirmation', color: 'text-yellow-700' },
    confirmed: { label: 'Confirmed', color: 'text-blue-700' },
    paid: { label: 'Paid', color: 'text-green-700' },
    rejected: { label: 'Rejected', color: 'text-red-700' },
    expired: { label: 'Expired', color: 'text-gray-500' },
  }
  return map[status]
}

export function getAllCashbackRates(): CashbackRate[] {
  return CASHBACK_RATES
}
