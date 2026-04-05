// services/vendor/vendor-portal.ts
import { createClient } from '@supabase/supabase-js'
import { isConfigured } from '@/lib/env'

interface Vendor {
  id: string
  name: string
  gst: string
  email: string
  phone: string
  status: 'pending' | 'active' | 'suspended'
  commission_rate: number
  total_products: number
  total_sales: number
  created_at: string
}

interface VendorApplication {
  name: string
  gst: string
  email: string
  phone: string
  business_type: string
  category: string
  commission_rate: number
}

function getClient() {
  if (
    !isConfigured('NEXT_PUBLIC_SUPABASE_URL') ||
    !isConfigured('SUPABASE_SERVICE_ROLE_KEY')
  ) {
    console.warn('[VendorPortal] Supabase not configured')
    return null
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function registerVendor(
  application: VendorApplication
): Promise<{ success: boolean; vendorId?: string; error?: string }> {
  const sb = getClient()
  if (!sb) return { success: false, error: 'Service unavailable' }

  try {
    const { data, error } = await sb
      .from('vendors')
      .insert({ ...application, status: 'pending' })
      .select('id')
      .single()

    if (error) throw error
    return { success: true, vendorId: data.id }
  } catch (err) {
    console.warn('[VendorPortal] registerVendor error:', err)
    return { success: false, error: 'Registration failed' }
  }
}

export async function getVendors(
  status?: Vendor['status']
): Promise<Vendor[]> {
  const sb = getClient()
  if (!sb) return []

  try {
    let query = sb.from('vendors').select('*').order('created_at', { ascending: false })
    if (status) query = query.eq('status', status)
    const { data, error } = await query
    if (error) throw error
    return (data as Vendor[]) ?? []
  } catch (err) {
    console.warn('[VendorPortal] getVendors error:', err)
    return []
  }
}

export async function approveVendor(vendorId: string): Promise<boolean> {
  const sb = getClient()
  if (!sb) return false

  try {
    const { error } = await sb
      .from('vendors')
      .update({ status: 'active' })
      .eq('id', vendorId)
    if (error) throw error
    return true
  } catch (err) {
    console.warn('[VendorPortal] approveVendor error:', err)
    return false
  }
}

export async function suspendVendor(vendorId: string): Promise<boolean> {
  const sb = getClient()
  if (!sb) return false

  try {
    const { error } = await sb
      .from('vendors')
      .update({ status: 'suspended' })
      .eq('id', vendorId)
    if (error) throw error
    return true
  } catch (err) {
    console.warn('[VendorPortal] suspendVendor error:', err)
    return false
  }
}

export async function updateCommission(
  vendorId: string,
  rate: number
): Promise<boolean> {
  const sb = getClient()
  if (!sb) return false

  try {
    const { error } = await sb
      .from('vendors')
      .update({ commission_rate: rate })
      .eq('id', vendorId)
    if (error) throw error
    return true
  } catch (err) {
    console.warn('[VendorPortal] updateCommission error:', err)
    return false
  }
}

export async function getVendorStats(vendorId: string): Promise<{
  total_products: number
  total_sales: number
  pending_payout: number
} | null> {
  const sb = getClient()
  if (!sb) return null

  try {
    const { data, error } = await sb
      .from('vendor_stats')
      .select('total_products, total_sales, pending_payout')
      .eq('vendor_id', vendorId)
      .single()
    if (error) throw error
    return data
  } catch (err) {
    console.warn('[VendorPortal] getVendorStats error:', err)
    return null
  }
}
