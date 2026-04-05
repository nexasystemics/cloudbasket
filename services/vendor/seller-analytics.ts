// services/vendor/seller-analytics.ts
import { createClient } from '@supabase/supabase-js'
import { isConfigured } from '@/lib/env'

// ─── Types ───────────────────────────────────────────────────────────────────

export type AnalyticsPeriod = '7d' | '30d' | '90d' | '12m' | 'ytd' | 'all'

export interface RevenueData {
  vendor_id: string
  period: AnalyticsPeriod
  total_revenue: number
  net_revenue: number
  commission_paid: number
  refunds_total: number
  orders_count: number
  avg_order_value: number
  currency: 'INR'
}

export interface TopProduct {
  product_id: string
  name: string
  sku: string
  units_sold: number
  revenue: number
  avg_rating: number
  return_rate: number
  category: string
}

export interface ConversionData {
  vendor_id: string
  views: number
  clicks: number
  add_to_cart: number
  purchases: number
  click_rate: number
  cart_rate: number
  purchase_rate: number
  period: AnalyticsPeriod
}

export interface SalesTimelinePoint {
  date: string
  orders: number
  revenue: number
  refunds: number
  net: number
}

export interface VendorDashboardSummary {
  revenue: RevenueData
  top_products: TopProduct[]
  conversion: ConversionData
  timeline: SalesTimelinePoint[]
  rank: number | null
  total_vendors: number
}

// ─── Client ──────────────────────────────────────────────────────────────────

function getClient() {
  if (
    !isConfigured('NEXT_PUBLIC_SUPABASE_URL') ||
    !isConfigured('SUPABASE_SERVICE_ROLE_KEY')
  ) {
    console.warn('[SellerAnalytics] Supabase not configured — returning safe defaults')
    return null
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getPeriodFilter(period: AnalyticsPeriod): string {
  const now = new Date()
  switch (period) {
    case '7d':
      return new Date(now.getTime() - 7 * 86400000).toISOString()
    case '30d':
      return new Date(now.getTime() - 30 * 86400000).toISOString()
    case '90d':
      return new Date(now.getTime() - 90 * 86400000).toISOString()
    case '12m':
      return new Date(now.getTime() - 365 * 86400000).toISOString()
    case 'ytd':
      return new Date(now.getFullYear(), 0, 1).toISOString()
    case 'all':
    default:
      return new Date(0).toISOString()
  }
}

// ─── Get Vendor Revenue ───────────────────────────────────────────────────────

/**
 * Returns revenue breakdown for a vendor over the given period.
 * Includes gross revenue, commissions, refunds, order count, and AOV.
 */
export async function getVendorRevenue(
  vendorId: string,
  period: AnalyticsPeriod = '30d'
): Promise<RevenueData | null> {
  const sb = getClient()
  if (!sb) return null

  try {
    const since = getPeriodFilter(period)

    const { data, error } = await sb
      .from('vendor_revenue_view')
      .select(
        'vendor_id, total_revenue, net_revenue, commission_paid, refunds_total, orders_count, avg_order_value'
      )
      .eq('vendor_id', vendorId)
      .gte('period_start', since)
      .single()

    if (error) throw error

    return {
      ...(data as Omit<RevenueData, 'period' | 'currency'>),
      period,
      currency: 'INR',
    }
  } catch (err) {
    console.warn('[SellerAnalytics] getVendorRevenue error:', err)
    return null
  }
}

// ─── Get Top Products ────────────────────────────────────────────────────────

/**
 * Returns the top N performing products for a vendor by revenue.
 * Includes units sold, ratings, and return rates.
 */
export async function getTopProducts(
  vendorId: string,
  limit = 10,
  period: AnalyticsPeriod = '30d'
): Promise<TopProduct[]> {
  const sb = getClient()
  if (!sb) return []

  try {
    const since = getPeriodFilter(period)

    const { data, error } = await sb
      .from('vendor_product_stats_view')
      .select('product_id, name, sku, units_sold, revenue, avg_rating, return_rate, category')
      .eq('vendor_id', vendorId)
      .gte('period_start', since)
      .order('revenue', { ascending: false })
      .limit(limit)

    if (error) throw error
    return (data as TopProduct[]) ?? []
  } catch (err) {
    console.warn('[SellerAnalytics] getTopProducts error:', err)
    return []
  }
}

// ─── Get Conversion Rate ─────────────────────────────────────────────────────

/**
 * Returns full conversion funnel data for a vendor:
 * views → clicks → add-to-cart → purchase.
 */
export async function getConversionRate(
  vendorId: string,
  period: AnalyticsPeriod = '30d'
): Promise<ConversionData | null> {
  const sb = getClient()
  if (!sb) return null

  try {
    const since = getPeriodFilter(period)

    const { data, error } = await sb
      .from('vendor_conversion_view')
      .select('vendor_id, views, clicks, add_to_cart, purchases')
      .eq('vendor_id', vendorId)
      .gte('period_start', since)
      .single()

    if (error) throw error

    const d = data as { vendor_id: string; views: number; clicks: number; add_to_cart: number; purchases: number }
    const click_rate = d.views > 0 ? parseFloat(((d.clicks / d.views) * 100).toFixed(2)) : 0
    const cart_rate = d.clicks > 0 ? parseFloat(((d.add_to_cart / d.clicks) * 100).toFixed(2)) : 0
    const purchase_rate = d.add_to_cart > 0 ? parseFloat(((d.purchases / d.add_to_cart) * 100).toFixed(2)) : 0

    return {
      ...d,
      click_rate,
      cart_rate,
      purchase_rate,
      period,
    }
  } catch (err) {
    console.warn('[SellerAnalytics] getConversionRate error:', err)
    return null
  }
}

// ─── Get Sales Timeline ──────────────────────────────────────────────────────

/**
 * Returns day-by-day sales timeline for the past N days.
 * Each point includes orders, gross revenue, refunds, and net.
 */
export async function getSalesTimeline(
  vendorId: string,
  days = 30
): Promise<SalesTimelinePoint[]> {
  const sb = getClient()
  if (!sb) return []

  try {
    const since = new Date(Date.now() - days * 86400000).toISOString()

    const { data, error } = await sb
      .from('vendor_sales_timeline')
      .select('date, orders, revenue, refunds, net')
      .eq('vendor_id', vendorId)
      .gte('date', since)
      .order('date', { ascending: true })

    if (error) throw error
    return (data as SalesTimelinePoint[]) ?? []
  } catch (err) {
    console.warn('[SellerAnalytics] getSalesTimeline error:', err)
    return []
  }
}

// ─── Get Vendor Rank ─────────────────────────────────────────────────────────

/**
 * Returns the vendor's rank among all vendors by revenue for the period.
 */
export async function getVendorRank(
  vendorId: string,
  period: AnalyticsPeriod = '30d'
): Promise<{ rank: number | null; total_vendors: number }> {
  const sb = getClient()
  if (!sb) return { rank: null, total_vendors: 0 }

  try {
    const since = getPeriodFilter(period)

    const { data, error } = await sb
      .from('vendor_revenue_view')
      .select('vendor_id, total_revenue')
      .gte('period_start', since)
      .order('total_revenue', { ascending: false })

    if (error) throw error

    const list = (data as { vendor_id: string; total_revenue: number }[]) ?? []
    const rank = list.findIndex((v) => v.vendor_id === vendorId)

    return {
      rank: rank >= 0 ? rank + 1 : null,
      total_vendors: list.length,
    }
  } catch (err) {
    console.warn('[SellerAnalytics] getVendorRank error:', err)
    return { rank: null, total_vendors: 0 }
  }
}

// ─── Full Dashboard Summary ──────────────────────────────────────────────────

/**
 * Aggregates all analytics into a single dashboard payload.
 * Use this for the vendor dashboard page to minimize round trips.
 */
export async function getVendorDashboardSummary(
  vendorId: string,
  period: AnalyticsPeriod = '30d'
): Promise<VendorDashboardSummary | null> {
  const [revenue, top_products, conversion, timeline, rankData] = await Promise.all([
    getVendorRevenue(vendorId, period),
    getTopProducts(vendorId, 5, period),
    getConversionRate(vendorId, period),
    getSalesTimeline(vendorId, 30),
    getVendorRank(vendorId, period),
  ])

  if (!revenue || !conversion) {
    console.warn('[SellerAnalytics] getVendorDashboardSummary: missing core data')
    return null
  }

  return {
    revenue,
    top_products,
    conversion,
    timeline,
    rank: rankData.rank,
    total_vendors: rankData.total_vendors,
  }
}

// ─── Compare Periods ─────────────────────────────────────────────────────────

/**
 * Compares revenue between two periods and returns percent change.
 */
export async function compareRevenuePeriods(
  vendorId: string,
  currentPeriod: AnalyticsPeriod,
  previousPeriod: AnalyticsPeriod
): Promise<{ current: number; previous: number; change_percent: number } | null> {
  const [current, previous] = await Promise.all([
    getVendorRevenue(vendorId, currentPeriod),
    getVendorRevenue(vendorId, previousPeriod),
  ])

  if (!current || !previous) return null

  const change_percent =
    previous.total_revenue > 0
      ? parseFloat(
          (
            ((current.total_revenue - previous.total_revenue) /
              previous.total_revenue) *
            100
          ).toFixed(2)
        )
      : 0

  return {
    current: current.total_revenue,
    previous: previous.total_revenue,
    change_percent,
  }
}
