// F53: Subscription + Membership System
import { hasSupabase, env } from '@/lib/env'

export type MembershipPlan = { id: string; name: string; price: number; billingCycle: 'monthly' | 'yearly'; features: string[]; badgeColor: string }
export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  { id: 'free', name: 'Free', price: 0, billingCycle: 'monthly', features: ['Price comparison', 'Basic search', 'Up to 10 price alerts', 'Standard support'], badgeColor: 'bg-zinc-500/10 text-zinc-500' },
  { id: 'pro', name: 'Pro', price: 99, billingCycle: 'monthly', features: ['Everything in Free', 'Unlimited price alerts', 'Deal predictions', 'Priority support', 'Ad-free experience', 'Early access to deals'], badgeColor: 'bg-skyline-primary/10 text-skyline-primary' },
  { id: 'business', name: 'Business', price: 499, billingCycle: 'monthly', features: ['Everything in Pro', 'B2B bulk POD orders', 'API access', 'Custom integrations', 'Dedicated account manager', 'GST invoicing'], badgeColor: 'bg-purple-500/10 text-purple-500' },
]

export async function getUserMembership(userId: string): Promise<MembershipPlan> {
  if (!hasSupabase()) return MEMBERSHIP_PLANS[0]
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    const { data } = await sb.from('memberships').select('plan_id').eq('user_id', userId).eq('active', true).single()
    return MEMBERSHIP_PLANS.find(p => p.id === data?.plan_id) || MEMBERSHIP_PLANS[0]
  } catch { return MEMBERSHIP_PLANS[0] }
}