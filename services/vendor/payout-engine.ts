import { createClient, SupabaseClient } from "@supabase/supabase-js";

const isConfigured = (key: string): boolean => Boolean(process.env[key]);

function getClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string
  );
}

/**
 * Generates a monthly payout summary for a vendor.
 */
export async function generateVendorPayout(vendorId: string, month: string): Promise<boolean> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return false;

    const supabase = getClient();
    
    // 1. Calculate net revenue
    const { data: sales, error: salesError } = await supabase
      .from("vendor_sales")
      .select("amount, commission_deducted")
      .eq("vendor_id", vendorId)
      .eq("status", "completed")
      .eq("payout_id", null);

    if (salesError) throw salesError;
    if (!sales || sales.length === 0) return false;

    const totalAmount = sales.reduce((sum, s) => sum + (s.amount - s.commission_deducted), 0);

    // 2. Create payout record
    const { data: payout, error: payoutError } = await supabase
      .from("vendor_payouts")
      .insert([{
        vendor_id: vendorId,
        amount: totalAmount,
        period: month,
        status: 'pending',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (payoutError) throw payoutError;

    // 3. Link sales to payout
    const { error: linkError } = await supabase
      .from("vendor_sales")
      .update({ payout_id: payout.id })
      .eq("vendor_id", vendorId)
      .eq("payout_id", null);

    if (linkError) throw linkError;

    return true;
  } catch (err) {
    console.warn("generateVendorPayout failed", err);
    return false;
  }
}

/**
 * Marks a payout as completed (after external bank transfer).
 */
export async function markPayoutCompleted(payoutId: string, reference: string): Promise<boolean> {
  try {
    const supabase = getClient();
    const { error } = await supabase
      .from("vendor_payouts")
      .update({
        status: 'completed',
        transaction_reference: reference,
        completed_at: new Date().toISOString()
      })
      .eq("id", payoutId);

    return !error;
  } catch {
    return false;
  }
}
