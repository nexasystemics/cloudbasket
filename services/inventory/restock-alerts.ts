import { createClient, SupabaseClient } from "@supabase/supabase-js";

const isConfigured = (key: string): boolean => Boolean(process.env[key]);

interface InventoryAlert {
  product_id: string;
  vendor_id: string;
  current_stock: number;
  threshold: number;
  status: 'pending' | 'notified' | 'ignored';
}

function getClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string
  );
}

/**
 * Scans inventory for products below their restock threshold.
 */
export async function checkLowStock(): Promise<InventoryAlert[]> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return [];

    const supabase = getClient();
    const { data, error } = await supabase
      .from("products")
      .select("id, vendor_id, stock_count, restock_threshold")
      .filter("stock_count", "lte", "restock_threshold")
      .eq("inventory_tracking", true);

    if (error) throw error;

    return (data ?? []).map(p => ({
      product_id: p.id,
      vendor_id: p.vendor_id,
      current_stock: p.stock_count,
      threshold: p.restock_threshold,
      status: 'pending'
    }));
  } catch (err) {
    console.warn("checkLowStock failed", err);
    return [];
  }
}

/**
 * Creates or updates a restock alert record.
 */
export async function triggerRestockAlert(alert: InventoryAlert): Promise<boolean> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return false;

    const supabase = getClient();
    
    // Check if alert already exists recently
    const { data: existing } = await supabase
      .from("restock_alerts")
      .select("id")
      .eq("product_id", alert.product_id)
      .eq("status", "pending")
      .single();

    if (existing) return true;

    const { error } = await supabase.from("restock_alerts").insert([
      {
        ...alert,
        created_at: new Date().toISOString()
      }
    ]);

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn("triggerRestockAlert failed", err);
    return false;
  }
}

/**
 * Marks a restock alert as notified (after sending email/sms).
 */
export async function markAlertNotified(alertId: string): Promise<boolean> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return false;

    const supabase = getClient();
    const { error } = await supabase
      .from("restock_alerts")
      .update({
        status: 'notified',
        notified_at: new Date().toISOString()
      })
      .eq("id", alertId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn("markAlertNotified failed", err);
    return false;
  }
}

/**
 * Gets active restock alerts for a specific vendor.
 */
export async function getVendorRestockAlerts(vendorId: string): Promise<any[]> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return [];

    const supabase = getClient();
    const { data, error } = await supabase
      .from("restock_alerts")
      .select(`
        *,
        products (title, sku)
      `)
      .eq("vendor_id", vendorId)
      .eq("status", "pending");

    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.warn("getVendorRestockAlerts failed", err);
    return [];
  }
}
