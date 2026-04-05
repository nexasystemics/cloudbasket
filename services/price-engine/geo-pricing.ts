// services/price-engine/geo-pricing.ts
import { createClient } from '@supabase/supabase-js'
import { isConfigured } from '@/lib/env'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface GeoPricingRule {
  id: string
  name: string
  state_code: string
  city: string | null
  pincode_prefix: string | null
  adjustment_type: 'percent' | 'fixed'
  adjustment_value: number
  direction: 'increase' | 'decrease'
  category: string | null
  vendor_id: string | null
  priority: number
  active: boolean
  valid_from: string
  valid_until: string | null
}

export interface PriceContext {
  product_id: string
  base_price: number
  category: string
  vendor_id?: string
}

export interface GeoAdjustedPrice {
  product_id: string
  base_price: number
  final_price: number
  adjustment: number
  adjustment_percent: number
  rules_applied: string[]
  currency: 'INR'
}

export interface ShippingZone {
  id: string
  name: string
  state_codes: string[]
  pincode_prefixes: string[]
  base_shipping_cost: number
  free_shipping_threshold: number
  estimated_days_min: number
  estimated_days_max: number
  cod_available: boolean
  cod_charge: number
}

export interface DeliveryEstimate {
  zone_id: string
  zone_name: string
  shipping_cost: number
  is_free: boolean
  estimated_days_min: number
  estimated_days_max: number
  cod_available: boolean
  cod_charge: number
  estimated_delivery_date_min: string
  estimated_delivery_date_max: string
}

// ─── Client ──────────────────────────────────────────────────────────────────

function getClient() {
  if (
    !isConfigured('NEXT_PUBLIC_SUPABASE_URL') ||
    !isConfigured('SUPABASE_SERVICE_ROLE_KEY')
  ) {
    console.warn('[GeoPricing] Supabase not configured — returning safe defaults')
    return null
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function applyAdjustment(
  price: number,
  rule: GeoPricingRule
): number {
  let adjusted = price
  const val = rule.adjustment_value
  if (rule.adjustment_type === 'percent') {
    const delta = parseFloat(((price * val) / 100).toFixed(2))
    adjusted = rule.direction === 'increase' ? price + delta : price - delta
  } else {
    adjusted = rule.direction === 'increase' ? price + val : price - val
  }
  return Math.max(0, parseFloat(adjusted.toFixed(2)))
}

function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date)
  let added = 0
  while (added < days) {
    result.setDate(result.getDate() + 1)
    const day = result.getDay()
    if (day !== 0 && day !== 6) added++
  }
  return result
}

// ─── Get Rules for Location ──────────────────────────────────────────────────

/**
 * Fetches all active geo pricing rules that apply to the given location.
 * Matches by state code, city (if provided), and pincode prefix.
 * Rules are sorted by priority (highest first).
 */
export async function getRulesForLocation(
  stateCode: string,
  pincode?: string,
  city?: string
): Promise<GeoPricingRule[]> {
  const sb = getClient()
  if (!sb) return []

  try {
    const now = new Date().toISOString()

    let query = sb
      .from('geo_pricing_rules')
      .select('*')
      .eq('active', true)
      .eq('state_code', stateCode)
      .lte('valid_from', now)
      .or(`valid_until.is.null,valid_until.gte.${now}`)
      .order('priority', { ascending: false })

    const { data, error } = await query
    if (error) throw error

    const rules = (data as GeoPricingRule[]) ?? []

    // Further filter by city and pincode prefix if provided
    return rules.filter((rule) => {
      if (rule.city && city && rule.city.toLowerCase() !== city.toLowerCase()) return false
      if (rule.pincode_prefix && pincode && !pincode.startsWith(rule.pincode_prefix)) return false
      return true
    })
  } catch (err) {
    console.warn('[GeoPricing] getRulesForLocation error:', err)
    return []
  }
}

// ─── Apply Geo Pricing ───────────────────────────────────────────────────────

/**
 * Applies all matching geo pricing rules to a product price for a given location.
 * Rules are applied in priority order; category/vendor-specific rules take precedence.
 * Returns the adjusted price with a full audit trail of applied rules.
 */
export async function applyGeoPricing(
  context: PriceContext,
  stateCode: string,
  pincode?: string,
  city?: string
): Promise<GeoAdjustedPrice> {
  const base: GeoAdjustedPrice = {
    product_id: context.product_id,
    base_price: context.base_price,
    final_price: context.base_price,
    adjustment: 0,
    adjustment_percent: 0,
    rules_applied: [],
    currency: 'INR',
  }

  const rules = await getRulesForLocation(stateCode, pincode, city)
  if (rules.length === 0) return base

  // Filter to rules matching this product's category and vendor
  const applicable = rules.filter((rule) => {
    if (rule.category && rule.category !== context.category) return false
    if (rule.vendor_id && rule.vendor_id !== context.vendor_id) return false
    return true
  })

  if (applicable.length === 0) return base

  let price = context.base_price
  const appliedIds: string[] = []

  for (const rule of applicable) {
    price = applyAdjustment(price, rule)
    appliedIds.push(rule.id)
  }

  const adjustment = parseFloat((price - context.base_price).toFixed(2))
  const adjustment_percent =
    context.base_price > 0
      ? parseFloat(((adjustment / context.base_price) * 100).toFixed(2))
      : 0

  return {
    ...base,
    final_price: price,
    adjustment,
    adjustment_percent,
    rules_applied: appliedIds,
  }
}

// ─── Bulk Geo Pricing ────────────────────────────────────────────────────────

/**
 * Applies geo pricing to multiple products at once.
 * Efficient for cart-level pricing adjustments.
 */
export async function bulkApplyGeoPricing(
  products: PriceContext[],
  stateCode: string,
  pincode?: string,
  city?: string
): Promise<GeoAdjustedPrice[]> {
  return Promise.all(
    products.map((p) => applyGeoPricing(p, stateCode, pincode, city))
  )
}

// ─── Create Geo Pricing Rule ─────────────────────────────────────────────────

/**
 * Creates a new geo pricing rule in the database.
 */
export async function createGeoPricingRule(
  rule: Omit<GeoPricingRule, 'id'>
): Promise<string | null> {
  const sb = getClient()
  if (!sb) return null

  try {
    const { data, error } = await sb
      .from('geo_pricing_rules')
      .insert(rule)
      .select('id')
      .single()

    if (error) throw error
    return data.id
  } catch (err) {
    console.warn('[GeoPricing] createGeoPricingRule error:', err)
    return null
  }
}

// ─── Get Shipping Zone ───────────────────────────────────────────────────────

/**
 * Returns the shipping zone for a given pincode or state code.
 * Pincode prefix matching takes priority over state-level matching.
 */
export async function getShippingZone(
  pincode: string,
  stateCode: string
): Promise<ShippingZone | null> {
  const sb = getClient()
  if (!sb) return null

  try {
    const { data, error } = await sb
      .from('shipping_zones')
      .select('*')

    if (error) throw error

    const zones = (data as ShippingZone[]) ?? []
    const prefix = pincode.substring(0, 3)

    // Pincode prefix match (most specific)
    const pincodeMatch = zones.find((z) => z.pincode_prefixes?.includes(prefix))
    if (pincodeMatch) return pincodeMatch

    // State-level match
    const stateMatch = zones.find((z) => z.state_codes?.includes(stateCode))
    if (stateMatch) return stateMatch

    return null
  } catch (err) {
    console.warn('[GeoPricing] getShippingZone error:', err)
    return null
  }
}

// ─── Get Delivery Estimate ───────────────────────────────────────────────────

/**
 * Returns a full delivery estimate for a given location and order value.
 * Calculates free shipping eligibility and COD charges automatically.
 */
export async function getDeliveryEstimate(
  pincode: string,
  stateCode: string,
  orderValue: number
): Promise<DeliveryEstimate | null> {
  const zone = await getShippingZone(pincode, stateCode)
  if (!zone) return null

  const isFree = orderValue >= zone.free_shipping_threshold
  const shippingCost = isFree ? 0 : zone.base_shipping_cost
  const now = new Date()

  return {
    zone_id: zone.id,
    zone_name: zone.name,
    shipping_cost: shippingCost,
    is_free: isFree,
    estimated_days_min: zone.estimated_days_min,
    estimated_days_max: zone.estimated_days_max,
    cod_available: zone.cod_available,
    cod_charge: zone.cod_available ? zone.cod_charge : 0,
    estimated_delivery_date_min: addBusinessDays(now, zone.estimated_days_min).toISOString(),
    estimated_delivery_date_max: addBusinessDays(now, zone.estimated_days_max).toISOString(),
  }
}

// ─── All Active Rules ─────────────────────────────────────────────────────────

/**
 * Returns all active geo pricing rules for the admin management page.
 */
export async function getAllActiveRules(): Promise<GeoPricingRule[]> {
  const sb = getClient()
  if (!sb) return []

  try {
    const { data, error } = await sb
      .from('geo_pricing_rules')
      .select('*')
      .eq('active', true)
      .order('priority', { ascending: false })

    if (error) throw error
    return (data as GeoPricingRule[]) ?? []
  } catch (err) {
    console.warn('[GeoPricing] getAllActiveRules error:', err)
    return []
  }
}
