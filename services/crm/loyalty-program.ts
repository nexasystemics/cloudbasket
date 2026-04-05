export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum'

export interface TierConfig {
  name: LoyaltyTier
  label: string
  minPoints: number
  cashbackPercent: number
  bonusMultiplier: number
  perks: string[]
  color: string
}

export interface LoyaltyAccount {
  userId: string
  email: string
  tier: LoyaltyTier
  pointsBalance: number
  pointsEarned: number
  pointsRedeemed: number
  totalSpend: number
  joinedAt: string
  tierUpdatedAt: string
  nextTierPoints: number
}

export interface PointTransaction {
  id: string
  userId: string
  type: 'earn' | 'redeem' | 'expire' | 'bonus' | 'adjust'
  points: number
  description: string
  orderId?: string
  orderValue?: number
  createdAt: string
  expiresAt?: string
}

export interface RewardOption {
  id: string
  title: string
  description: string
  pointsCost: number
  rewardType: 'cashback' | 'coupon' | 'free_delivery' | 'gift_card'
  rewardValue: number
  isAvailable: boolean
}

export interface RedemptionResult {
  success: boolean
  reward?: RewardOption
  pointsDeducted: number
  newBalance: number
  couponCode?: string
  message: string
}

export interface LoyaltyStats {
  totalMembers: number
  tierBreakdown: Record<LoyaltyTier, number>
  totalPointsIssued: number
  totalPointsRedeemed: number
  avgPointsPerUser: number
  redemptionRate: number
}

export const TIER_CONFIG: Record<LoyaltyTier, TierConfig> = {
  bronze: {
    name: 'bronze',
    label: 'Bronze',
    minPoints: 0,
    cashbackPercent: 1,
    bonusMultiplier: 1,
    perks: ['1% cashback on every purchase', 'Birthday bonus points'],
    color: '#cd7f32',
  },
  silver: {
    name: 'silver',
    label: 'Silver',
    minPoints: 1000,
    cashbackPercent: 2,
    bonusMultiplier: 1.5,
    perks: [
      '2% cashback on every purchase',
      '1.5x points on all orders',
      'Early access to sales',
      'Free delivery on orders ₹299+',
    ],
    color: '#c0c0c0',
  },
  gold: {
    name: 'gold',
    label: 'Gold',
    minPoints: 5000,
    cashbackPercent: 3,
    bonusMultiplier: 2,
    perks: [
      '3% cashback on every purchase',
      '2x points on all orders',
      'Priority customer support',
      'Exclusive member deals',
      'Free delivery on all orders',
    ],
    color: '#ffd700',
  },
  platinum: {
    name: 'platinum',
    label: 'Platinum',
    minPoints: 20000,
    cashbackPercent: 5,
    bonusMultiplier: 3,
    perks: [
      '5% cashback on every purchase',
      '3x points on all orders',
      'Dedicated account manager',
      'VIP early access to all deals',
      'Free express delivery',
      'Quarterly gift voucher ₹500',
    ],
    color: '#e5e4e2',
  },
}

const REWARD_OPTIONS: RewardOption[] = [
  {
    id: 'rwd_001',
    title: '₹50 Cashback',
    description: 'Get ₹50 credited to your wallet',
    pointsCost: 500,
    rewardType: 'cashback',
    rewardValue: 50,
    isAvailable: true,
  },
  {
    id: 'rwd_002',
    title: '₹100 Cashback',
    description: 'Get ₹100 credited to your wallet',
    pointsCost: 900,
    rewardType: 'cashback',
    rewardValue: 100,
    isAvailable: true,
  },
  {
    id: 'rwd_003',
    title: '₹200 Off Coupon',
    description: '₹200 off on your next order above ₹999',
    pointsCost: 1500,
    rewardType: 'coupon',
    rewardValue: 200,
    isAvailable: true,
  },
  {
    id: 'rwd_004',
    title: 'Free Delivery Pass (30 days)',
    description: 'Free delivery on all orders for 30 days',
    pointsCost: 2000,
    rewardType: 'free_delivery',
    rewardValue: 30,
    isAvailable: true,
  },
  {
    id: 'rwd_005',
    title: '₹500 Gift Card',
    description: 'Redeemable on CloudBasket or partner stores',
    pointsCost: 4000,
    rewardType: 'gift_card',
    rewardValue: 500,
    isAvailable: true,
  },
]

export function calculateTier(pointsEarned: number): LoyaltyTier {
  if (pointsEarned >= TIER_CONFIG.platinum.minPoints) return 'platinum'
  if (pointsEarned >= TIER_CONFIG.gold.minPoints) return 'gold'
  if (pointsEarned >= TIER_CONFIG.silver.minPoints) return 'silver'
  return 'bronze'
}

export function calculatePointsToEarn(
  orderValue: number,
  tier: LoyaltyTier
): number {
  const config = TIER_CONFIG[tier]
  const basePoints = Math.floor(orderValue / 10) // 1 point per ₹10
  return Math.floor(basePoints * config.bonusMultiplier)
}

export function getNextTierProgress(account: LoyaltyAccount): {
  nextTier: LoyaltyTier | null
  pointsNeeded: number
  progressPercent: number
} {
  const tiers: LoyaltyTier[] = ['bronze', 'silver', 'gold', 'platinum']
  const currentIndex = tiers.indexOf(account.tier)

  if (currentIndex === tiers.length - 1) {
    return { nextTier: null, pointsNeeded: 0, progressPercent: 100 }
  }

  const nextTier = tiers[currentIndex + 1]
  const nextConfig = TIER_CONFIG[nextTier]
  const currentConfig = TIER_CONFIG[account.tier]
  const pointsNeeded = Math.max(0, nextConfig.minPoints - account.pointsEarned)
  const rangeSize = nextConfig.minPoints - currentConfig.minPoints
  const progress = Math.min(
    100,
    Math.round(
      ((account.pointsEarned - currentConfig.minPoints) / rangeSize) * 100
    )
  )

  return { nextTier, pointsNeeded, progressPercent: progress }
}

export function getAvailableRewards(account: LoyaltyAccount): RewardOption[] {
  return REWARD_OPTIONS.filter(
    (r) => r.isAvailable && account.pointsBalance >= r.pointsCost
  )
}

export function getAllRewards(): RewardOption[] {
  return REWARD_OPTIONS
}

export function redeemReward(
  account: LoyaltyAccount,
  rewardId: string
): RedemptionResult {
  const reward = REWARD_OPTIONS.find((r) => r.id === rewardId)

  if (!reward) {
    return {
      success: false,
      pointsDeducted: 0,
      newBalance: account.pointsBalance,
      message: 'Reward not found.',
    }
  }

  if (!reward.isAvailable) {
    return {
      success: false,
      pointsDeducted: 0,
      newBalance: account.pointsBalance,
      message: 'This reward is currently unavailable.',
    }
  }

  if (account.pointsBalance < reward.pointsCost) {
    return {
      success: false,
      pointsDeducted: 0,
      newBalance: account.pointsBalance,
      message: `Insufficient points. You need ${reward.pointsCost - account.pointsBalance} more points.`,
    }
  }

  const newBalance = account.pointsBalance - reward.pointsCost
  const couponCode =
    reward.rewardType === 'coupon'
      ? `CB${Math.random().toString(36).slice(2, 8).toUpperCase()}`
      : undefined

  return {
    success: true,
    reward,
    pointsDeducted: reward.pointsCost,
    newBalance,
    couponCode,
    message: `Successfully redeemed ${reward.title}!`,
  }
}

export function createTransaction(params: {
  userId: string
  type: PointTransaction['type']
  points: number
  description: string
  orderId?: string
  orderValue?: number
}): PointTransaction {
  return {
    id: crypto.randomUUID(),
    userId: params.userId,
    type: params.type,
    points: params.points,
    description: params.description,
    orderId: params.orderId,
    orderValue: params.orderValue,
    createdAt: new Date().toISOString(),
    expiresAt:
      params.type === 'earn'
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        : undefined,
  }
}

export function getLoyaltyStats(accounts: LoyaltyAccount[]): LoyaltyStats {
  const tierBreakdown: Record<LoyaltyTier, number> = {
    bronze: 0,
    silver: 0,
    gold: 0,
    platinum: 0,
  }

  for (const a of accounts) {
    tierBreakdown[a.tier]++
  }

  const totalPointsIssued = accounts.reduce((sum, a) => sum + a.pointsEarned, 0)
  const totalPointsRedeemed = accounts.reduce((sum, a) => sum + a.pointsRedeemed, 0)

  return {
    totalMembers: accounts.length,
    tierBreakdown,
    totalPointsIssued,
    totalPointsRedeemed,
    avgPointsPerUser:
      accounts.length > 0 ? Math.round(totalPointsIssued / accounts.length) : 0,
    redemptionRate:
      totalPointsIssued > 0
        ? Math.round((totalPointsRedeemed / totalPointsIssued) * 100)
        : 0,
  }
}
