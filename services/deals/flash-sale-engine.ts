// services/deals/flash-sale-engine.ts
import { createClient } from '@supabase/supabase-js'
import { isConfigured } from '@/lib/env'

interface FlashSale {
  id: string
  title: string
  discount_percent: number
  starts_at: string
  ends_at: string
  max_claims: number
  claims_count: number
  product_ids: string[]
  category?: string
  status: 'scheduled' | 'active' | 'ended'
}

interface FlashSaleClaim {
  sale_id: string
  user_id: string
  product_id: string
  discount_applied: number
  claimed_at: string
}

function getClient() {
  if (
    !isConfigured('NEXT_PUBLIC_SUPABASE_URL') ||
    !isConfigured('SUPABASE_SERVICE_ROLE_KEY')
  ) {
    console.warn('[FlashSaleEngine] Supabase not configured')
    return null
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getActiveSales(): Promise<FlashSale[]> {
  const sb = getClient()
  if (!sb) return []

  try {
    const now = new Date().toISOString()
    const { data, error } = await sb
      .from('flash_sales')
      .select('*')
      .eq('status', 'active')
      .lte('starts_at', now)
      .gte('ends_at', now)
      .order('ends_at', { ascending: true })
    if (error) throw error
    return (data as FlashSale[]) ?? []
  } catch (err) {
    console.warn('[FlashSaleEngine] getActiveSales error:', err)
    return []
  }
}

export async function createFlashSale(
  sale: Omit<FlashSale, 'id' | 'claims_count' | 'status'>
): Promise<string | null> {
  const sb = getClient()
  if (!sb) return null

  try {
    const { data, error } = await sb
      .from('flash_sales')
      .insert({ ...sale, claims_count: 0, status: 'scheduled' })
      .select('id')
      .single()
    if (error) throw error
    return data.id
  } catch (err) {
    console.warn('[FlashSaleEngine] createFlashSale error:', err)
    return null
  }
}

export async function claimFlashSale(
  saleId: string,
  userId: string,
  productId: string
): Promise<{ success: boolean; discount?: number; reason?: string }> {
  const sb = getClient()
  if (!sb) return { success: false, reason: 'Service unavailable' }

  try {
    const { data: sale, error: saleErr } = await sb
      .from('flash_sales')
      .select('*')
      .eq('id', saleId)
      .single()

    if (saleErr || !sale) return { success: false, reason: 'Sale not found' }
    if (sale.claims_count >= sale.max_claims) return { success: false, reason: 'Sale sold out' }
    if (sale.status !== 'active') return { success: false, reason: 'Sale not active' }

    const { error: claimErr } = await sb.from('flash_sale_claims').insert({
      sale_id: saleId,
      user_id: userId,
      product_id: productId,
      discount_applied: sale.discount_percent,
      claimed_at: new Date().toISOString(),
    } satisfies FlashSaleClaim)

    if (claimErr) throw claimErr

    await sb
      .from('flash_sales')
      .update({ claims_count: sale.claims_count + 1 })
      .eq('id', saleId)

    return { success: true, discount: sale.discount_percent }
  } catch (err) {
    console.warn('[FlashSaleEngine] claimFlashSale error:', err)
    return { success: false, reason: 'Claim failed' }
  }
}

export async function endExpiredSales(): Promise<number> {
  const sb = getClient()
  if (!sb) return 0

  try {
    const now = new Date().toISOString()
    const { data, error } = await sb
      .from('flash_sales')
      .update({ status: 'ended' })
      .lt('ends_at', now)
      .neq('status', 'ended')
      .select('id')
    if (error) throw error
    return data?.length ?? 0
  } catch (err) {
    console.warn('[FlashSaleEngine] endExpiredSales error:', err)
    return 0
  }
}

export async function getSaleStats(saleId: string): Promise<{
  claims: number
  remaining: number
  revenue_impact: number
} | null> {
  const sb = getClient()
  if (!sb) return null

  try {
    const { data, error } = await sb
      .from('flash_sale_stats')
      .select('claims, remaining, revenue_impact')
      .eq('sale_id', saleId)
      .single()
    if (error) throw error
    return data
  } catch (err) {
    console.warn('[FlashSaleEngine] getSaleStats error:', err)
    return null
  }
}
