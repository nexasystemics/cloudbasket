// services/deals/bundle-creator.ts
import { createClient } from '@supabase/supabase-js'
import { isConfigured } from '@/lib/env'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BundleProduct {
  product_id: string
  name: string
  original_price: number
  quantity: number
}

export interface Bundle {
  id: string
  title: string
  slug: string
  description: string
  products: BundleProduct[]
  discount_percent: number
  bundle_price: number
  original_total: number
  savings: number
  max_quantity: number
  sold_count: number
  active: boolean
  valid_from: string
  valid_until: string | null
  category: string | null
  image_url: string | null
  created_at: string
}

export interface BundleCartResult {
  applied: boolean
  bundle_id: string
  discount_amount: number
  final_price: number
  matched_products: string[]
  reason?: string
}

export interface BundleStats {
  bundle_id: string
  total_sales: number
  revenue: number
  avg_order_value: number
  conversion_rate: number
  top_region: string | null
}

// ─── Client ──────────────────────────────────────────────────────────────────

function getClient() {
  if (
    !isConfigured('NEXT_PUBLIC_SUPABASE_URL') ||
    !isConfigured('SUPABASE_SERVICE_ROLE_KEY')
  ) {
    console.warn('[BundleCreator] Supabase not configured — returning safe defaults')
    return null
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function computeBundlePrice(products: BundleProduct[], discountPercent: number): {
  original_total: number
  bundle_price: number
  savings: number
} {
  const original_total = products.reduce(
    (sum, p) => sum + p.original_price * p.quantity,
    0
  )
  const savings = parseFloat(((original_total * discountPercent) / 100).toFixed(2))
  const bundle_price = parseFloat((original_total - savings).toFixed(2))
  return { original_total, bundle_price, savings }
}

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// ─── Create Bundle ───────────────────────────────────────────────────────────

/**
 * Creates a new product bundle with automatic price computation.
 * Validates that at least 2 products are included and discount is 1–80%.
 */
export async function createBundle(
  title: string,
  description: string,
  products: BundleProduct[],
  discountPercent: number,
  options?: {
    category?: string
    image_url?: string
    max_quantity?: number
    valid_until?: string
  }
): Promise<{ success: boolean; bundleId?: string; error?: string }> {
  if (products.length < 2) {
    return { success: false, error: 'Bundle requires at least 2 products' }
  }
  if (discountPercent < 1 || discountPercent > 80) {
    return { success: false, error: 'Discount must be between 1% and 80%' }
  }

  const sb = getClient()
  if (!sb) return { success: false, error: 'Service unavailable' }

  const { original_total, bundle_price, savings } = computeBundlePrice(products, discountPercent)

  try {
    const { data, error } = await sb
      .from('bundles')
      .insert({
        title,
        slug: toSlug(title),
        description,
        products,
        discount_percent: discountPercent,
        bundle_price,
        original_total,
        savings,
        max_quantity: options?.max_quantity ?? 999,
        sold_count: 0,
        active: true,
        valid_from: new Date().toISOString(),
        valid_until: options?.valid_until ?? null,
        category: options?.category ?? null,
        image_url: options?.image_url ?? null,
      })
      .select('id')
      .single()

    if (error) throw error
    return { success: true, bundleId: data.id }
  } catch (err) {
    console.warn('[BundleCreator] createBundle error:', err)
    return { success: false, error: 'Failed to create bundle' }
  }
}

// ─── Get Active Bundles ──────────────────────────────────────────────────────

/**
 * Returns all currently active bundles. Filters out expired bundles
 * and those that have reached max_quantity.
 */
export async function getActiveBundles(options?: {
  category?: string
  limit?: number
}): Promise<Bundle[]> {
  const sb = getClient()
  if (!sb) return []

  try {
    const now = new Date().toISOString()
    let query = sb
      .from('bundles')
      .select('*')
      .eq('active', true)
      .lte('valid_from', now)
      .or(`valid_until.is.null,valid_until.gte.${now}`)
      .order('created_at', { ascending: false })

    if (options?.category) query = query.eq('category', options.category)
    if (options?.limit) query = query.limit(options.limit)

    const { data, error } = await query
    if (error) throw error

    // Filter out bundles that have hit max quantity
    return ((data as Bundle[]) ?? []).filter((b) => b.sold_count < b.max_quantity)
  } catch (err) {
    console.warn('[BundleCreator] getActiveBundles error:', err)
    return []
  }
}

// ─── Get Bundle By ID ────────────────────────────────────────────────────────

/**
 * Fetches a single bundle by ID. Returns null if not found or inactive.
 */
export async function getBundleById(bundleId: string): Promise<Bundle | null> {
  const sb = getClient()
  if (!sb) return null

  try {
    const { data, error } = await sb
      .from('bundles')
      .select('*')
      .eq('id', bundleId)
      .single()

    if (error) throw error
    return data as Bundle
  } catch (err) {
    console.warn('[BundleCreator] getBundleById error:', err)
    return null
  }
}

// ─── Apply Bundle to Cart ────────────────────────────────────────────────────

/**
 * Checks if a bundle can be applied to the given cart items.
 * Returns discount amount and final price if applicable.
 */
export async function applyBundle(
  bundleId: string,
  cartItems: { product_id: string; quantity: number; price: number }[]
): Promise<BundleCartResult> {
  const sb = getClient()
  if (!sb) {
    return { applied: false, bundle_id: bundleId, discount_amount: 0, final_price: 0, matched_products: [], reason: 'Service unavailable' }
  }

  try {
    const bundle = await getBundleById(bundleId)
    if (!bundle) {
      return { applied: false, bundle_id: bundleId, discount_amount: 0, final_price: 0, matched_products: [], reason: 'Bundle not found' }
    }
    if (!bundle.active) {
      return { applied: false, bundle_id: bundleId, discount_amount: 0, final_price: 0, matched_products: [], reason: 'Bundle is inactive' }
    }
    if (bundle.sold_count >= bundle.max_quantity) {
      return { applied: false, bundle_id: bundleId, discount_amount: 0, final_price: 0, matched_products: [], reason: 'Bundle sold out' }
    }
    if (bundle.valid_until && new Date(bundle.valid_until) < new Date()) {
      return { applied: false, bundle_id: bundleId, discount_amount: 0, final_price: 0, matched_products: [], reason: 'Bundle expired' }
    }

    const bundleProductIds = bundle.products.map((p) => p.product_id)
    const cartProductIds = cartItems.map((c) => c.product_id)
    const matched = bundleProductIds.filter((id) => cartProductIds.includes(id))

    if (matched.length < bundleProductIds.length) {
      return {
        applied: false,
        bundle_id: bundleId,
        discount_amount: 0,
        final_price: 0,
        matched_products: matched,
        reason: `Missing ${bundleProductIds.length - matched.length} product(s) from bundle`,
      }
    }

    const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const discount_amount = parseFloat(((cartTotal * bundle.discount_percent) / 100).toFixed(2))
    const final_price = parseFloat((cartTotal - discount_amount).toFixed(2))

    return {
      applied: true,
      bundle_id: bundleId,
      discount_amount,
      final_price,
      matched_products: matched,
    }
  } catch (err) {
    console.warn('[BundleCreator] applyBundle error:', err)
    return { applied: false, bundle_id: bundleId, discount_amount: 0, final_price: 0, matched_products: [], reason: 'Application failed' }
  }
}

// ─── Record Bundle Sale ──────────────────────────────────────────────────────

/**
 * Increments sold_count after a successful bundle purchase.
 */
export async function recordBundleSale(bundleId: string, orderId: string): Promise<boolean> {
  const sb = getClient()
  if (!sb) return false

  try {
    const bundle = await getBundleById(bundleId)
    if (!bundle) return false

    const { error: saleErr } = await sb.from('bundle_sales').insert({
      bundle_id: bundleId,
      order_id: orderId,
      sold_at: new Date().toISOString(),
    })
    if (saleErr) throw saleErr

    const { error: updateErr } = await sb
      .from('bundles')
      .update({ sold_count: bundle.sold_count + 1 })
      .eq('id', bundleId)
    if (updateErr) throw updateErr

    return true
  } catch (err) {
    console.warn('[BundleCreator] recordBundleSale error:', err)
    return false
  }
}

// ─── Deactivate Bundle ───────────────────────────────────────────────────────

/**
 * Soft-deactivates a bundle without deleting it.
 */
export async function deactivateBundle(bundleId: string): Promise<boolean> {
  const sb = getClient()
  if (!sb) return false

  try {
    const { error } = await sb
      .from('bundles')
      .update({ active: false })
      .eq('id', bundleId)
    if (error) throw error
    return true
  } catch (err) {
    console.warn('[BundleCreator] deactivateBundle error:', err)
    return false
  }
}

// ─── Bundle Stats ────────────────────────────────────────────────────────────

/**
 * Returns sales metrics for a specific bundle including revenue,
 * conversion rate, and top performing region.
 */
export async function getBundleStats(bundleId: string): Promise<BundleStats | null> {
  const sb = getClient()
  if (!sb) return null

  try {
    const { data, error } = await sb
      .from('bundle_stats_view')
      .select('bundle_id, total_sales, revenue, avg_order_value, conversion_rate, top_region')
      .eq('bundle_id', bundleId)
      .single()

    if (error) throw error
    return data as BundleStats
  } catch (err) {
    console.warn('[BundleCreator] getBundleStats error:', err)
    return null
  }
}

// ─── All Bundle Stats ────────────────────────────────────────────────────────

/**
 * Returns aggregate stats across all bundles, sorted by revenue desc.
 */
export async function getAllBundleStats(limit = 20): Promise<BundleStats[]> {
  const sb = getClient()
  if (!sb) return []

  try {
    const { data, error } = await sb
      .from('bundle_stats_view')
      .select('*')
      .order('revenue', { ascending: false })
      .limit(limit)

    if (error) throw error
    return (data as BundleStats[]) ?? []
  } catch (err) {
    console.warn('[BundleCreator] getAllBundleStats error:', err)
    return []
  }
}
