// services/subscriptions/subscription-manager.ts
import { createClient } from '@supabase/supabase-js'
import { isConfigured } from '@/lib/env'

interface Plan {
  id: string
  name: string
  price: number
  interval: 'monthly' | 'quarterly' | 'yearly'
  features: string[]
  max_alerts: number
  max_wishlists: number
  cashback_rate: number
}

interface Subscription {
  id: string
  user_id: string
  plan_id: string
  status: 'active' | 'cancelled' | 'expired' | 'trial'
  current_period_start: string
  current_period_end: string
  razorpay_subscription_id?: string
}

function getClient() {
  if (
    !isConfigured('NEXT_PUBLIC_SUPABASE_URL') ||
    !isConfigured('SUPABASE_SERVICE_ROLE_KEY')
  ) {
    console.warn('[SubscriptionManager] Supabase not configured')
    return null
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getPlans(): Promise<Plan[]> {
  const sb = getClient()
  if (!sb) return []

  try {
    const { data, error } = await sb
      .from('subscription_plans')
      .select('*')
      .eq('active', true)
      .order('price', { ascending: true })
    if (error) throw error
    return (data as Plan[]) ?? []
  } catch (err) {
    console.warn('[SubscriptionManager] getPlans error:', err)
    return []
  }
}

export async function getUserSubscription(
  userId: string
): Promise<Subscription | null> {
  const sb = getClient()
  if (!sb) return null

  try {
    const { data, error } = await sb
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()
    if (error) throw error
    return data as Subscription
  } catch (err) {
    console.warn('[SubscriptionManager] getUserSubscription error:', err)
    return null
  }
}

export async function createSubscription(
  userId: string,
  planId: string,
  razorpaySubscriptionId?: string
): Promise<string | null> {
  const sb = getClient()
  if (!sb) return null

  try {
    const now = new Date()
    const end = new Date()
    end.setMonth(end.getMonth() + 1)

    const { data, error } = await sb
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_id: planId,
        status: 'active',
        current_period_start: now.toISOString(),
        current_period_end: end.toISOString(),
        razorpay_subscription_id: razorpaySubscriptionId ?? null,
      })
      .select('id')
      .single()

    if (error) throw error
    return data.id
  } catch (err) {
    console.warn('[SubscriptionManager] createSubscription error:', err)
    return null
  }
}

export async function cancelSubscription(subscriptionId: string): Promise<boolean> {
  const sb = getClient()
  if (!sb) return false

  try {
    const { error } = await sb
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('id', subscriptionId)
    if (error) throw error
    return true
  } catch (err) {
    console.warn('[SubscriptionManager] cancelSubscription error:', err)
    return false
  }
}

export async function startTrial(userId: string, planId: string): Promise<boolean> {
  const sb = getClient()
  if (!sb) return false

  try {
    const trialEnd = new Date()
    trialEnd.setDate(trialEnd.getDate() + 14)

    const { error } = await sb.from('subscriptions').insert({
      user_id: userId,
      plan_id: planId,
      status: 'trial',
      current_period_start: new Date().toISOString(),
      current_period_end: trialEnd.toISOString(),
    })
    if (error) throw error
    return true
  } catch (err) {
    console.warn('[SubscriptionManager] startTrial error:', err)
    return false
  }
}

export async function getSubscriptionMetrics(): Promise<{
  total: number
  active: number
  trial: number
  cancelled: number
  mrr: number
}> {
  const sb = getClient()
  if (!sb) return { total: 0, active: 0, trial: 0, cancelled: 0, mrr: 0 }

  try {
    const { data, error } = await sb.from('subscription_metrics').select('*').single()
    if (error) throw error
    return data ?? { total: 0, active: 0, trial: 0, cancelled: 0, mrr: 0 }
  } catch (err) {
    console.warn('[SubscriptionManager] getSubscriptionMetrics error:', err)
    return { total: 0, active: 0, trial: 0, cancelled: 0, mrr: 0 }
  }
}
