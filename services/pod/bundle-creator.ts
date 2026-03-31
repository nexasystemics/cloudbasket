// E23: POD Bundle Creator and Combo Product System
import { hasSupabase, env } from '@/lib/env'

export type BundleItem = { designId: string; productType: string; quantity: number; unitPrice: number }
export type PODBundle = { id: string; name: string; description: string; items: BundleItem[]; bundlePrice: number; originalTotal: number; savings: number; savingsPercent: number; imageUrl?: string; active: boolean }

export function calculateBundle(items: BundleItem[], discountPercent = 15): Omit<PODBundle, 'id' | 'name' | 'description' | 'imageUrl' | 'active'> {
  const originalTotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
  const bundlePrice = Math.round(originalTotal * (1 - discountPercent / 100) / 10) * 10
  const savings = originalTotal - bundlePrice
  return { items, bundlePrice, originalTotal, savings, savingsPercent: discountPercent }
}

export async function createBundle(bundle: Omit<PODBundle, 'id'>): Promise<PODBundle | null> {
  if (!hasSupabase()) return null
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
    const id = `bundle-${Date.now()}`
    const { data, error } = await sb.from('pod_bundles').insert({ id, ...bundle, created_at: new Date().toISOString() }).select().single()
    if (error) throw error
    return { id, ...bundle }
  } catch { return null }
}

export async function getBundles(): Promise<PODBundle[]> {
  if (!hasSupabase()) return []
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    const { data } = await sb.from('pod_bundles').select('*').eq('active', true).order('created_at', { ascending: false })
    return data || []
  } catch { return [] }
}
