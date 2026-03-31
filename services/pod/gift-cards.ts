// E24: POD Gift Card and Voucher System
import { hasSupabase, env } from '@/lib/env'
import crypto from 'crypto'

export type GiftCard = { id: string; code: string; amount: number; balance: number; purchaserEmail: string; recipientEmail?: string; message?: string; expiresAt: string; used: boolean; createdAt: string }

export function generateGiftCardCode(): string {
  return `CB-${crypto.randomBytes(3).toString('hex').toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`
}

export async function createGiftCard(amount: number, purchaserEmail: string, recipientEmail?: string, message?: string): Promise<GiftCard | null> {
  if (!hasSupabase()) return null
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
    const card: Omit<GiftCard, 'id'> = {
      code: generateGiftCardCode(), amount, balance: amount,
      purchaserEmail, recipientEmail, message,
      expiresAt: new Date(Date.now() + 365 * 86400000).toISOString(),
      used: false, createdAt: new Date().toISOString()
    }
    const { data, error } = await sb.from('gift_cards').insert({ id: `GC-${Date.now()}`, ...card }).select().single()
    if (error) throw error
    return data
  } catch { return null }
}

export async function redeemGiftCard(code: string, amount: number): Promise<{ success: boolean; remainingBalance: number; error?: string }> {
  if (!hasSupabase()) return { success: false, remainingBalance: 0, error: 'Database not configured' }
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
    const { data: card } = await sb.from('gift_cards').select('*').eq('code', code.toUpperCase()).single()
    if (!card) return { success: false, remainingBalance: 0, error: 'Invalid gift card code' }
    if (card.balance < amount) return { success: false, remainingBalance: card.balance, error: 'Insufficient balance' }
    if (new Date(card.expiresAt) < new Date()) return { success: false, remainingBalance: 0, error: 'Gift card expired' }
    const newBalance = card.balance - amount
    await sb.from('gift_cards').update({ balance: newBalance, used: newBalance === 0 }).eq('code', code.toUpperCase())
    return { success: true, remainingBalance: newBalance }
  } catch { return { success: false, remainingBalance: 0, error: 'Redemption failed' } }
}
