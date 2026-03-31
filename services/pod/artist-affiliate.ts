// E30: POD Affiliate Program for Design Artists
import { hasSupabase, env } from '@/lib/env'

export type ArtistProfile = { id: string; name: string; email: string; portfolioUrl?: string; commissionRate: number; totalEarnings: number; pendingPayout: number; status: 'pending' | 'approved' | 'suspended'; referralCode: string; createdAt: string }
export type ArtistCommission = { id: string; artistId: string; orderId: string; amount: number; rate: number; status: 'pending' | 'paid'; createdAt: string }

export function generateReferralCode(name: string): string {
  return `CB-${name.slice(0, 4).toUpperCase().replace(/[^A-Z]/g, 'X')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
}

export async function registerArtist(name: string, email: string, portfolioUrl?: string): Promise<ArtistProfile | null> {
  if (!hasSupabase()) return null
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
    const artist: ArtistProfile = { id: `artist-${Date.now()}`, name, email, portfolioUrl, commissionRate: 0.15, totalEarnings: 0, pendingPayout: 0, status: 'pending', referralCode: generateReferralCode(name), createdAt: new Date().toISOString() }
    const { error } = await sb.from('pod_artists').insert(artist)
    if (error) throw error
    return artist
  } catch { return null }
}

export async function recordCommission(artistId: string, orderId: string, orderAmount: number): Promise<ArtistCommission | null> {
  if (!hasSupabase()) return null
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
    const { data: artist } = await sb.from('pod_artists').select('commission_rate').eq('id', artistId).single()
    const rate = artist?.commission_rate || 0.15
    const commission: ArtistCommission = { id: `com-${Date.now()}`, artistId, orderId, amount: Math.round(orderAmount * rate), rate, status: 'pending', createdAt: new Date().toISOString() }
    await sb.from('pod_commissions').insert(commission)
    await sb.from('pod_artists').update({ pending_payout: sb.rpc('increment', { x: commission.amount }) }).eq('id', artistId)
    return commission
  } catch { return null }
}
