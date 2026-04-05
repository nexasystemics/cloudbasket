// services/inventory/inventory-sync.ts
import { createClient } from '@supabase/supabase-js'
import { isConfigured } from '@/lib/env'

// ─── Types ───────────────────────────────────────────────────────────────────

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued'

export interface InventoryRecord {
  id: string
  product_id: string
  sku: string
  quantity: number
  reserved: number
  available: number
  status: StockStatus
  warehouse: string
  reorder_point: number
  reorder_qty: number
  last_synced_at: string
  updated_at: string
}

export interface StockMovement {
  id: string
  product_id: string
  sku: string
  movement_type: 'inbound' | 'outbound' | 'adjustment' | 'reserved' | 'released'
  quantity: number
  reference_id: string | null
  reference_type: 'order' | 'return' | 'manual' | 'sync' | null
  note: string | null
  created_at: string
}

export interface SyncResult {
  synced: number
  failed: number
  low_stock_alerts: string[]
  out_of_stock_alerts: string[]
  errors: string[]
}

export interface BulkStockUpdate {
  sku: string
  quantity: number
  warehouse?: string
}

// ─── Client ──────────────────────────────────────────────────────────────────

function getClient() {
  if (
    !isConfigured('NEXT_PUBLIC_SUPABASE_URL') ||
    !isConfigured('SUPABASE_SERVICE_ROLE_KEY')
  ) {
    console.warn('[InventorySync] Supabase not configured — returning safe defaults')
    return null
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function deriveStatus(quantity: number, reorderPoint: number): StockStatus {
  if (quantity <= 0) return 'out_of_stock'
  if (quantity <= reorderPoint) return 'low_stock'
  return 'in_stock'
}

async function logMovement(
  sb: any,
  movement: Omit<StockMovement, 'id' | 'created_at'>
): Promise<void> {
  try {
    const { error } = await sb.from('stock_movements').insert([{
      ...movement,
      created_at: new Date().toISOString(),
    }])
    if (error) throw error
  } catch (err) {
    console.warn('[InventorySync] logMovement error:', err)
  }
}

// ─── Get Inventory by Product ────────────────────────────────────────────────

/**
 * Fetches the current inventory record for a specific product.
 * Returns null if product is not tracked in inventory.
 */
export async function getInventory(productId: string): Promise<InventoryRecord | null> {
  const sb = getClient()
  if (!sb) return null

  try {
    const { data, error } = await sb
      .from('inventory')
      .select('*')
      .eq('product_id', productId)
      .single()

    if (error) throw error
    return data as InventoryRecord
  } catch (err) {
    console.warn('[InventorySync] getInventory error:', err)
    return null
  }
}

// ─── Get Inventory by SKU ────────────────────────────────────────────────────

/**
 * Fetches inventory record by SKU string.
 */
export async function getInventoryBySku(sku: string): Promise<InventoryRecord | null> {
  const sb = getClient()
  if (!sb) return null

  try {
    const { data, error } = await sb
      .from('inventory')
      .select('*')
      .eq('sku', sku)
      .single()

    if (error) throw error
    return data as InventoryRecord
  } catch (err) {
    console.warn('[InventorySync] getInventoryBySku error:', err)
    return null
  }
}

// ─── Adjust Stock ─────────────────────────────────────────────────────────────

/**
 * Adjusts stock quantity for a product by a delta (positive = add, negative = remove).
 * Automatically recalculates status and available quantity.
 * Logs movement to stock_movements table.
 */
export async function adjustStock(
  productId: string,
  delta: number,
  options?: {
    reference_id?: string
    reference_type?: StockMovement['reference_type']
    note?: string
  }
): Promise<boolean> {
  const sb = getClient()
  if (!sb) return false

  try {
    const current = await getInventory(productId)
    if (!current) {
      console.warn('[InventorySync] adjustStock: product not found in inventory')
      return false
    }

    const newQty = Math.max(0, current.quantity + delta)
    const newAvailable = Math.max(0, newQty - current.reserved)
    const newStatus = deriveStatus(newQty, current.reorder_point)

    const { error } = await sb
      .from('inventory')
      .update({
        quantity: newQty,
        available: newAvailable,
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('product_id', productId)

    if (error) throw error

    await logMovement(sb, {
      product_id: productId,
      sku: current.sku,
      movement_type: delta >= 0 ? 'inbound' : 'outbound',
      quantity: Math.abs(delta),
      reference_id: options?.reference_id ?? null,
      reference_type: options?.reference_type ?? 'manual',
      note: options?.note ?? null,
    })

    return true
  } catch (err) {
    console.warn('[InventorySync] adjustStock error:', err)
    return false
  }
}

// ─── Reserve Stock ───────────────────────────────────────────────────────────

/**
 * Reserves stock when an order is placed (before payment confirmation).
 * Prevents overselling by reducing available count without removing from quantity.
 */
export async function reserveStock(
  productId: string,
  qty: number,
  orderId: string
): Promise<boolean> {
  const sb = getClient()
  if (!sb) return false

  try {
    const current = await getInventory(productId)
    if (!current) return false

    if (current.available < qty) {
      console.warn('[InventorySync] reserveStock: insufficient available stock')
      return false
    }

    const { error } = await sb
      .from('inventory')
      .update({
        reserved: current.reserved + qty,
        available: current.available - qty,
        updated_at: new Date().toISOString(),
      })
      .eq('product_id', productId)

    if (error) throw error

    await logMovement(sb, {
      product_id: productId,
      sku: current.sku,
      movement_type: 'reserved',
      quantity: qty,
      reference_id: orderId,
      reference_type: 'order',
      note: `Reserved for order ${orderId}`,
    })

    return true
  } catch (err) {
    console.warn('[InventorySync] reserveStock error:', err)
    return false
  }
}

// ─── Release Reserved Stock ───────────────────────────────────────────────────

/**
 * Releases previously reserved stock (e.g. on order cancellation or timeout).
 */
export async function releaseStock(
  productId: string,
  qty: number,
  orderId: string
): Promise<boolean> {
  const sb = getClient()
  if (!sb) return false

  try {
    const current = await getInventory(productId)
    if (!current) return false

    const newReserved = Math.max(0, current.reserved - qty)
    const newAvailable = current.quantity - newReserved

    const { error } = await sb
      .from('inventory')
      .update({
        reserved: newReserved,
        available: newAvailable,
        updated_at: new Date().toISOString(),
      })
      .eq('product_id', productId)

    if (error) throw error

    await logMovement(sb, {
      product_id: productId,
      sku: current.sku,
      movement_type: 'released',
      quantity: qty,
      reference_id: orderId,
      reference_type: 'order',
      note: `Released reservation for order ${orderId}`,
    })

    return true
  } catch (err) {
    console.warn('[InventorySync] releaseStock error:', err)
    return false
  }
}

// ─── Bulk Sync ───────────────────────────────────────────────────────────────

/**
 * Bulk-updates inventory from an external source (e.g. warehouse feed, vendor upload).
 * Processes each SKU individually to avoid partial-batch failures.
 * Returns a detailed sync result with alerts for low/out-of-stock items.
 */
export async function bulkSyncInventory(updates: BulkStockUpdate[]): Promise<SyncResult> {
  const result: SyncResult = {
    synced: 0,
    failed: 0,
    low_stock_alerts: [],
    out_of_stock_alerts: [],
    errors: [],
  }

  const sb = getClient()
  if (!sb) {
    result.errors.push('Supabase not configured')
    return result
  }

  for (const update of updates) {
    try {
      const { data: current, error: fetchErr } = await sb
        .from('inventory')
        .select('product_id, reserved, reorder_point, sku')
        .eq('sku', update.sku)
        .single()

      if (fetchErr || !current) {
        result.failed++
        result.errors.push(`SKU not found: ${update.sku}`)
        continue
      }

      const newAvailable = Math.max(0, update.quantity - (current.reserved ?? 0))
      const newStatus = deriveStatus(update.quantity, current.reorder_point ?? 5)

      const { error: updateErr } = await sb
        .from('inventory')
        .update({
          quantity: update.quantity,
          available: newAvailable,
          status: newStatus,
          warehouse: update.warehouse ?? 'default',
          last_synced_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('sku', update.sku)

      if (updateErr) throw updateErr

      await logMovement(sb, {
        product_id: current.product_id,
        sku: update.sku,
        movement_type: 'adjustment',
        quantity: update.quantity,
        reference_id: null,
        reference_type: 'sync',
        note: 'Bulk inventory sync',
      })

      if (newStatus === 'out_of_stock') result.out_of_stock_alerts.push(update.sku)
      if (newStatus === 'low_stock') result.low_stock_alerts.push(update.sku)

      result.synced++
    } catch (err) {
      result.failed++
      result.errors.push(`Failed for SKU ${update.sku}: ${String(err)}`)
      console.warn('[InventorySync] bulkSyncInventory item error:', err)
    }
  }

  return result
}

// ─── Get Low Stock Items ──────────────────────────────────────────────────────

/**
 * Returns all items that are at or below their reorder point.
 * Used for automated reorder alerts and admin dashboard.
 */
export async function getLowStockItems(limit = 50): Promise<InventoryRecord[]> {
  const sb = getClient()
  if (!sb) return []

  try {
    const { data, error } = await sb
      .from('inventory')
      .select('*')
      .in('status', ['low_stock', 'out_of_stock'])
      .order('quantity', { ascending: true })
      .limit(limit)

    if (error) throw error
    return (data as InventoryRecord[]) ?? []
  } catch (err) {
    console.warn('[InventorySync] getLowStockItems error:', err)
    return []
  }
}

// ─── Get Movement History ─────────────────────────────────────────────────────

/**
 * Returns the stock movement history for a product, newest first.
 */
export async function getMovementHistory(
  productId: string,
  limit = 30
): Promise<StockMovement[]> {
  const sb = getClient()
  if (!sb) return []

  try {
    const { data, error } = await sb
      .from('stock_movements')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return (data as StockMovement[]) ?? []
  } catch (err) {
    console.warn('[InventorySync] getMovementHistory error:', err)
    return []
  }
}

// ─── Inventory Summary ────────────────────────────────────────────────────────

/**
 * Returns aggregate inventory health metrics for the admin dashboard.
 */
export async function getInventorySummary(): Promise<{
  total_skus: number
  in_stock: number
  low_stock: number
  out_of_stock: number
  discontinued: number
  total_units: number
  last_sync: string | null
}> {
  const defaults = {
    total_skus: 0,
    in_stock: 0,
    low_stock: 0,
    out_of_stock: 0,
    discontinued: 0,
    total_units: 0,
    last_sync: null,
  }

  const sb = getClient()
  if (!sb) return defaults

  try {
    const { data, error } = await sb
      .from('inventory_summary_view')
      .select('*')
      .single()

    if (error) throw error
    return data ?? defaults
  } catch (err) {
    console.warn('[InventorySync] getInventorySummary error:', err)
    return defaults
  }
}
