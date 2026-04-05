// services/crm/review-incentive.ts
import { createClient } from '@supabase/supabase-js'
import { isConfigured } from '@/lib/env'

interface ReviewIncentive {
  id: string
  user_id: string
  product_id: string
  review_id: string
  reward_type: 'cashback' | 'points' | 'coupon'
  reward_value: number
  status: 'pending' | 'approved' | 'paid' | 'rejected'
  created_at: string
}

interface IncentiveConfig {
  min_review_length: number
  photo_bonus: number
  video_bonus: number
  base_reward_points: number
  cashback_percent: number
}

function getClient() {
  if (
    !isConfigured('NEXT_PUBLIC_SUPABASE_URL') ||
    !isConfigured('SUPABASE_SERVICE_ROLE_KEY')
  ) {
    console.warn('[ReviewIncentive] Supabase not configured')
    return null
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const DEFAULT_CONFIG: IncentiveConfig = {
  min_review_length: 50,
  photo_bonus: 10,
  video_bonus: 25,
  base_reward_points: 50,
  cashback_percent: 1,
}

export async function getIncentiveConfig(): Promise<IncentiveConfig> {
  const sb = getClient()
  if (!sb) return DEFAULT_CONFIG

  try {
    const { data, error } = await sb
      .from('incentive_config')
      .select('*')
      .single()
    if (error) throw error
    return (data as IncentiveConfig) ?? DEFAULT_CONFIG
  } catch (err) {
    console.warn('[ReviewIncentive] getIncentiveConfig error:', err)
    return DEFAULT_CONFIG
  }
}

export async function calculateReward(
  reviewText: string,
  hasPhoto: boolean,
  hasVideo: boolean,
  config?: IncentiveConfig
): Promise<number> {
  const cfg = config ?? DEFAULT_CONFIG
  if (reviewText.trim().length < cfg.min_review_length) return 0

  let points = cfg.base_reward_points
  if (hasPhoto) points += cfg.photo_bonus
  if (hasVideo) points += cfg.video_bonus
  return points
}

export async function issueIncentive(
  userId: string,
  productId: string,
  reviewId: string,
  rewardPoints: number
): Promise<boolean> {
  const sb = getClient()
  if (!sb) return false

  try {
    const { error } = await sb.from('review_incentives').insert({
      user_id: userId,
      product_id: productId,
      review_id: reviewId,
      reward_type: 'points',
      reward_value: rewardPoints,
      status: 'pending',
      created_at: new Date().toISOString(),
    } satisfies Omit<ReviewIncentive, 'id'>)

    if (error) throw error
    return true
  } catch (err) {
    console.warn('[ReviewIncentive] issueIncentive error:', err)
    return false
  }
}

export async function approveIncentive(incentiveId: string): Promise<boolean> {
  const sb = getClient()
  if (!sb) return false

  try {
    const { error } = await sb
      .from('review_incentives')
      .update({ status: 'approved' })
      .eq('id', incentiveId)
    if (error) throw error
    return true
  } catch (err) {
    console.warn('[ReviewIncentive] approveIncentive error:', err)
    return false
  }
}

export async function getUserIncentives(userId: string): Promise<ReviewIncentive[]> {
  const sb = getClient()
  if (!sb) return []

  try {
    const { data, error } = await sb
      .from('review_incentives')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data as ReviewIncentive[]) ?? []
  } catch (err) {
    console.warn('[ReviewIncentive] getUserIncentives error:', err)
    return []
  }
}

export async function getPendingIncentives(): Promise<ReviewIncentive[]> {
  const sb = getClient()
  if (!sb) return []

  try {
    const { data, error } = await sb
      .from('review_incentives')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
    if (error) throw error
    return (data as ReviewIncentive[]) ?? []
  } catch (err) {
    console.warn('[ReviewIncentive] getPendingIncentives error:', err)
    return []
  }
}
