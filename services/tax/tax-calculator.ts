// services/tax/tax-calculator.ts
import { isConfigured } from '@/lib/env'
import { createClient } from '@supabase/supabase-js'

// ─── Types ───────────────────────────────────────────────────────────────────

export type GSTSlot = 0 | 5 | 12 | 18 | 28

export interface HSNCode {
  code: string
  description: string
  gst_rate: GSTSlot
  cess_rate: number
  category: string
}

export interface TaxLineItem {
  product_id: string
  name: string
  hsn_code: string
  quantity: number
  unit_price: number
  total_price: number
  gst_rate: GSTSlot
  cess_rate: number
  taxable_value: number
  cgst: number
  sgst: number
  igst: number
  cess: number
  total_tax: number
  final_price: number
}

export interface TaxBreakdown {
  subtotal: number
  total_taxable: number
  total_cgst: number
  total_sgst: number
  total_igst: number
  total_cess: number
  total_tax: number
  grand_total: number
  is_interstate: boolean
  buyer_state: string
  seller_state: string
  currency: 'INR'
  line_items: TaxLineItem[]
}

export interface GSTInvoiceMeta {
  invoice_number: string
  invoice_date: string
  seller_gstin: string
  seller_name: string
  seller_address: string
  buyer_gstin: string | null
  buyer_name: string
  buyer_address: string
  place_of_supply: string
}

// ─── Client ──────────────────────────────────────────────────────────────────

function getClient() {
  if (
    !isConfigured('NEXT_PUBLIC_SUPABASE_URL') ||
    !isConfigured('SUPABASE_SERVICE_ROLE_KEY')
  ) {
    console.warn('[TaxCalculator] Supabase not configured — returning safe defaults')
    return null
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SELLER_STATE = process.env.SELLER_STATE_CODE ?? 'MH'
const VALID_GST_SLOTS: GSTSlot[] = [0, 5, 12, 18, 28]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalizeGSTRate(rate: number): GSTSlot {
  const nearest = VALID_GST_SLOTS.reduce((prev, curr) =>
    Math.abs(curr - rate) < Math.abs(prev - rate) ? curr : prev
  )
  return nearest
}

function roundInr(val: number): number {
  return parseFloat(val.toFixed(2))
}

function calculateLineItemTax(
  unitPrice: number,
  quantity: number,
  gstRate: GSTSlot,
  cessRate: number,
  isInterstate: boolean
): {
  taxable_value: number
  cgst: number
  sgst: number
  igst: number
  cess: number
  total_tax: number
  final_price: number
} {
  const taxable_value = roundInr(unitPrice * quantity)
  const gstAmount = roundInr((taxable_value * gstRate) / 100)
  const cessAmount = roundInr((taxable_value * cessRate) / 100)

  const cgst = isInterstate ? 0 : roundInr(gstAmount / 2)
  const sgst = isInterstate ? 0 : roundInr(gstAmount / 2)
  const igst = isInterstate ? gstAmount : 0
  const total_tax = roundInr(gstAmount + cessAmount)
  const final_price = roundInr(taxable_value + total_tax)

  return { taxable_value, cgst, sgst, igst, cess: cessAmount, total_tax, final_price }
}

// ─── Get HSN Code ────────────────────────────────────────────────────────────

/**
 * Fetches HSN code details including GST rate and cess from the database.
 * Returns null if code is not found — caller should use a default rate.
 */
export async function getHSNCode(code: string): Promise<HSNCode | null> {
  const sb = getClient()
  if (!sb) return null

  try {
    const { data, error } = await sb
      .from('hsn_codes')
      .select('code, description, gst_rate, cess_rate, category')
      .eq('code', code)
      .single()

    if (error) throw error
    return {
      ...(data as Omit<HSNCode, 'gst_rate'>),
      gst_rate: normalizeGSTRate(data.gst_rate),
    }
  } catch (err) {
    console.warn('[TaxCalculator] getHSNCode error:', err)
    return null
  }
}

// ─── Get GST Rate for Category ───────────────────────────────────────────────

/**
 * Returns the GST rate for a product category when no HSN code is available.
 * Falls back to 18% if category is not mapped.
 */
export async function getGSTRateForCategory(category: string): Promise<GSTSlot> {
  const sb = getClient()
  if (!sb) return 18

  try {
    const { data, error } = await sb
      .from('category_gst_mapping')
      .select('gst_rate')
      .eq('category', category)
      .single()

    if (error) throw error
    return normalizeGSTRate(data?.gst_rate ?? 18)
  } catch (err) {
    console.warn('[TaxCalculator] getGSTRateForCategory error:', err)
    return 18
  }
}

// ─── Calculate Tax for Cart ───────────────────────────────────────────────────

/**
 * Calculates complete GST breakdown for a cart.
 * Handles intrastate (CGST + SGST) vs interstate (IGST) automatically.
 * Each line item gets individual tax calculation for compliance.
 */
export async function calculateCartTax(
  items: Array<{
    product_id: string
    name: string
    hsn_code: string
    category: string
    quantity: number
    unit_price: number
  }>,
  buyerStateCode: string
): Promise<TaxBreakdown> {
  const isInterstate = buyerStateCode.toUpperCase() !== SELLER_STATE.toUpperCase()
  const line_items: TaxLineItem[] = []

  for (const item of items) {
    let gstRate: GSTSlot = 18
    let cessRate = 0

    const hsn = await getHSNCode(item.hsn_code)
    if (hsn) {
      gstRate = hsn.gst_rate
      cessRate = hsn.cess_rate
    } else {
      gstRate = await getGSTRateForCategory(item.category)
    }

    const taxCalc = calculateLineItemTax(
      item.unit_price,
      item.quantity,
      gstRate,
      cessRate,
      isInterstate
    )

    line_items.push({
      product_id: item.product_id,
      name: item.name,
      hsn_code: item.hsn_code,
      quantity: item.quantity,
      unit_price: roundInr(item.unit_price),
      total_price: roundInr(item.unit_price * item.quantity),
      gst_rate: gstRate,
      cess_rate: cessRate,
      ...taxCalc,
    })
  }

  const subtotal = roundInr(line_items.reduce((s, l) => s + l.total_price, 0))
  const total_taxable = roundInr(line_items.reduce((s, l) => s + l.taxable_value, 0))
  const total_cgst = roundInr(line_items.reduce((s, l) => s + l.cgst, 0))
  const total_sgst = roundInr(line_items.reduce((s, l) => s + l.sgst, 0))
  const total_igst = roundInr(line_items.reduce((s, l) => s + l.igst, 0))
  const total_cess = roundInr(line_items.reduce((s, l) => s + l.cess, 0))
  const total_tax = roundInr(total_cgst + total_sgst + total_igst + total_cess)
  const grand_total = roundInr(total_taxable + total_tax)

  return {
    subtotal,
    total_taxable,
    total_cgst,
    total_sgst,
    total_igst,
    total_cess,
    total_tax,
    grand_total,
    is_interstate: isInterstate,
    buyer_state: buyerStateCode,
    seller_state: SELLER_STATE,
    currency: 'INR',
    line_items,
  }
}

// ─── Generate Invoice Number ──────────────────────────────────────────────────

/**
 * Generates a sequential GST-compliant invoice number.
 * Format: CB/FY2526/00001
 */
export function generateInvoiceNumber(sequence: number): string {
  const now = new Date()
  const year = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1
  const fy = `FY${String(year).slice(2)}${String(year + 1).slice(2)}`
  const seq = String(sequence).padStart(5, '0')
  return `CB/${fy}/${seq}`
}

// ─── Build Invoice Meta ───────────────────────────────────────────────────────

/**
 * Builds invoice metadata for GST-compliant invoice generation.
 * Requires SELLER_GSTIN env key to be configured.
 */
export function buildInvoiceMeta(
  invoiceNumber: string,
  buyer: {
    name: string
    address: string
    gstin?: string
    state_code: string
  }
): GSTInvoiceMeta {
  const gstin = isConfigured('SELLER_GSTIN') ? process.env.SELLER_GSTIN! : 'NOT_CONFIGURED'

  return {
    invoice_number: invoiceNumber,
    invoice_date: new Date().toISOString(),
    seller_gstin: gstin,
    seller_name: 'NEXQON HOLDINGS',
    seller_address: 'CloudBasket.in, India',
    buyer_gstin: buyer.gstin ?? null,
    buyer_name: buyer.name,
    buyer_address: buyer.address,
    place_of_supply: buyer.state_code,
  }
}

// ─── Validate GSTIN ───────────────────────────────────────────────────────────

/**
 * Validates a GSTIN format per Indian GST rules.
 * Does not verify with GSTN API — for format validation only.
 */
export function validateGSTIN(gstin: string): boolean {
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
  return gstinRegex.test(gstin.toUpperCase())
}

// ─── Extract State from GSTIN ─────────────────────────────────────────────────

/**
 * Extracts the state code from a GSTIN number (first 2 digits).
 */
export function getStateFromGSTIN(gstin: string): string | null {
  if (!validateGSTIN(gstin)) return null
  return gstin.substring(0, 2)
}
