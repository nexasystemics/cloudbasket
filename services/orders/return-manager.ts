// services/orders/return-manager.ts
import { createClient } from '@supabase/supabase-js'
import { isConfigured } from '@/lib/env'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ReturnItem {
  product_id: string
  name: string
  qty: number
  unit_price: number
  reason_detail?: string
}

export type ReturnReason =
  | 'defective'
  | 'wrong_item'
  | 'not_as_described'
  | 'changed_mind'
  | 'damaged_in_transit'
  | 'missing_parts'
  | 'other'

export type ReturnStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'pickup_scheduled'
  | 'received'
  | 'refund_processed'
  | 'closed'

export type RefundMethod = 'original_payment' | 'store_credit' | 'bank_transfer'

export interface Return {
  id: string
  order_id: string
  user_id: string
  reason: ReturnReason
  reason_note: string | null
  items: ReturnItem[]
  total_refund_amount: number
  refund_method: RefundMethod
  status: ReturnStatus
  admin_note: string | null
  pickup_date: string | null
  refund_transaction_id: string | null
  created_at: string
  updated_at: string
}

export interface RefundRecord {
  id: string
  return_id: string
  amount: number
  method: RefundMethod
  transaction_id: string | null
  status: 'pending' | 'processed' | 'failed'
  processed_at: string | null
}

// ─── Client ──────────────────────────────────────────────────────────────────

function getClient() {
  if (
    !isConfigured('NEXT_PUBLIC_SUPABASE_URL') ||
    !isConfigured('SUPABASE_SERVICE_ROLE_KEY')
  ) {
    console.warn('[ReturnManager] Supabase not configured — returning safe defaults')
    return null
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function computeRefundTotal(items: ReturnItem[]): number {
  return parseFloat(
    items.reduce((sum, i) => sum + i.unit_price * i.qty, 0).toFixed(2)
  )
}

async function updateReturnStatus(
  returnId: string,
  status: ReturnStatus,
  extra?: Record<string, unknown>
): Promise<boolean> {
  const sb = getClient()
  if (!sb) return false

  try {
    const { error } = await sb
      .from('returns')
      .update({ status, updated_at: new Date().toISOString(), ...extra })
      .eq('id', returnId)
    if (error) throw error
    return true
  } catch (err) {
    console.warn('[ReturnManager] updateReturnStatus error:', err)
    return false
  }
}

// ─── Initiate Return ─────────────────────────────────────────────────────────

/**
 * Creates a new return request for an order.
 * Validates the order exists and belongs to the user before inserting.
 * Returns the created return record or null on failure.
 */
export async function initiateReturn(
  orderId: string,
  userId: string,
  reason: ReturnReason,
  items: ReturnItem[],
  options?: {
    reason_note?: string
    refund_method?: RefundMethod
  }
): Promise<Return | null> {
  if (!orderId || !userId || items.length === 0) {
    console.warn('[ReturnManager] initiateReturn: invalid parameters')
    return null
  }

  const sb = getClient()
  if (!sb) return null

  try {
    // Validate order belongs to user
    const { data: order, error: orderErr } = await sb
      .from('orders')
      .select('id, user_id, status')
      .eq('id', orderId)
      .eq('user_id', userId)
      .single()

    if (orderErr || !order) {
      console.warn('[ReturnManager] initiateReturn: order not found or unauthorized')
      return null
    }

    if (!['delivered', 'completed'].includes(order.status)) {
      console.warn('[ReturnManager] initiateReturn: order not eligible for return')
      return null
    }

    const total_refund_amount = computeRefundTotal(items)
    const now = new Date().toISOString()

    const { data, error } = await sb
      .from('returns')
      .insert({
        order_id: orderId,
        user_id: userId,
        reason,
        reason_note: options?.reason_note ?? null,
        items,
        total_refund_amount,
        refund_method: options?.refund_method ?? 'original_payment',
        status: 'pending' as ReturnStatus,
        admin_note: null,
        pickup_date: null,
        refund_transaction_id: null,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single()

    if (error) throw error
    return data as Return
  } catch (err) {
    console.warn('[ReturnManager] initiateReturn error:', err)
    return null
  }
}

// ─── Approve Return ──────────────────────────────────────────────────────────

/**
 * Approves a pending return and optionally schedules a pickup date.
 * Sets status to approved or pickup_scheduled if pickup date provided.
 */
export async function approveReturn(
  returnId: string,
  options?: {
    admin_note?: string
    pickup_date?: string
  }
): Promise<boolean> {
  const status: ReturnStatus = options?.pickup_date ? 'pickup_scheduled' : 'approved'
  return updateReturnStatus(returnId, status, {
    admin_note: options?.admin_note ?? null,
    pickup_date: options?.pickup_date ?? null,
  })
}

// ─── Reject Return ───────────────────────────────────────────────────────────

/**
 * Rejects a return request with a mandatory admin note explaining the reason.
 */
export async function rejectReturn(returnId: string, adminNote: string): Promise<boolean> {
  if (!adminNote?.trim()) {
    console.warn('[ReturnManager] rejectReturn: admin note required')
    return false
  }
  return updateReturnStatus(returnId, 'rejected', { admin_note: adminNote })
}

// ─── Mark Item Received ──────────────────────────────────────────────────────

/**
 * Marks the returned item as received at the warehouse.
 * Should be called after physical receipt is confirmed.
 */
export async function markReturnReceived(returnId: string, adminNote?: string): Promise<boolean> {
  return updateReturnStatus(returnId, 'received', {
    admin_note: adminNote ?? null,
  })
}

// ─── Process Refund ──────────────────────────────────────────────────────────

/**
 * Processes a refund for an approved return.
 * Creates a refund record and updates return status to refund_processed.
 * Amount must match or be less than the return's total_refund_amount.
 */
export async function processRefund(
  returnId: string,
  amount: number,
  options?: {
    method?: RefundMethod
    transaction_id?: string
  }
): Promise<boolean> {
  if (amount <= 0) {
    console.warn('[ReturnManager] processRefund: amount must be > 0')
    return false
  }

  const sb = getClient()
  if (!sb) return false

  try {
    // Validate return exists and is in approved/received state
    const { data: ret, error: retErr } = await sb
      .from('returns')
      .select('id, status, total_refund_amount, refund_method')
      .eq('id', returnId)
      .single()

    if (retErr || !ret) {
      console.warn('[ReturnManager] processRefund: return not found')
      return false
    }

    if (!['approved', 'received'].includes(ret.status)) {
      console.warn('[ReturnManager] processRefund: return not in approved/received state')
      return false
    }

    if (amount > ret.total_refund_amount) {
      console.warn('[ReturnManager] processRefund: amount exceeds return total')
      return false
    }

    const now = new Date().toISOString()
    const transaction_id = options?.transaction_id ?? null

    const { error: refundErr } = await sb.from('refunds').insert({
      return_id: returnId,
      amount,
      method: options?.method ?? ret.refund_method,
      transaction_id,
      status: 'processed',
      processed_at: now,
    } satisfies Omit<RefundRecord, 'id'>)

    if (refundErr) throw refundErr

    return updateReturnStatus(returnId, 'refund_processed', {
      refund_transaction_id: transaction_id,
    })
  } catch (err) {
    console.warn('[ReturnManager] processRefund error:', err)
    return false
  }
}

// ─── Get Returns by User ─────────────────────────────────────────────────────

/**
 * Fetches all returns for a specific user, sorted by newest first.
 */
export async function getReturnsByUser(userId: string): Promise<Return[]> {
  const sb = getClient()
  if (!sb) return []

  try {
    const { data, error } = await sb
      .from('returns')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data as Return[]) ?? []
  } catch (err) {
    console.warn('[ReturnManager] getReturnsByUser error:', err)
    return []
  }
}

// ─── Get Pending Returns ─────────────────────────────────────────────────────

/**
 * Fetches all returns currently in pending status for admin review.
 * Sorted by oldest first to prioritize longest-waiting requests.
 */
export async function getPendingReturns(): Promise<Return[]> {
  const sb = getClient()
  if (!sb) return []

  try {
    const { data, error } = await sb
      .from('returns')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })

    if (error) throw error
    return (data as Return[]) ?? []
  } catch (err) {
    console.warn('[ReturnManager] getPendingReturns error:', err)
    return []
  }
}

// ─── Get Return by ID ────────────────────────────────────────────────────────

/**
 * Fetches a single return record by ID.
 */
export async function getReturnById(returnId: string): Promise<Return | null> {
  const sb = getClient()
  if (!sb) return null

  try {
    const { data, error } = await sb
      .from('returns')
      .select('*')
      .eq('id', returnId)
      .single()

    if (error) throw error
    return data as Return
  } catch (err) {
    console.warn('[ReturnManager] getReturnById error:', err)
    return null
  }
}

// ─── Get Return Metrics ───────────────────────────────────────────────────────

/**
 * Returns aggregate return and refund metrics for admin dashboard.
 */
export async function getReturnMetrics(): Promise<{
  total_returns: number
  pending: number
  approved: number
  rejected: number
  refund_processed: number
  total_refunded: number
  avg_processing_days: number
}> {
  const defaults = {
    total_returns: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    refund_processed: 0,
    total_refunded: 0,
    avg_processing_days: 0,
  }

  const sb = getClient()
  if (!sb) return defaults

  try {
    const { data, error } = await sb
      .from('return_metrics_view')
      .select('*')
      .single()

    if (error) throw error
    return data ?? defaults
  } catch (err) {
    console.warn('[ReturnManager] getReturnMetrics error:', err)
    return defaults
  }
}

// ─── Close Return ────────────────────────────────────────────────────────────

/**
 * Closes a return request after the process is fully complete.
 */
export async function closeReturn(returnId: string): Promise<boolean> {
  return updateReturnStatus(returnId, 'closed')
}
