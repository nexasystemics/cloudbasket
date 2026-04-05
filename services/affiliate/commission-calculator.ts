import { createClient, SupabaseClient } from "@supabase/supabase-js";

const isConfigured = (key: string): boolean => Boolean(process.env[key]);

export interface CommissionRate {
  category_id: string;
  rate_percentage: number;
  max_cap?: number;
}

function getClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string
  );
}

/**
 * Calculates commission for a specific sale amount based on category.
 */
export async function calculateCommission(
  categoryId: string,
  amount: number
): Promise<number> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return 0;

    const supabase = getClient();
    const { data: rateRow, error } = await supabase
      .from("commission_rates")
      .select("rate_percentage, max_cap")
      .eq("category_id", categoryId)
      .single();

    if (error || !rateRow) return 0;

    const commission = (amount * rateRow.rate_percentage) / 100;
    
    if (rateRow.max_cap && commission > rateRow.max_cap) {
      return rateRow.max_cap;
    }

    return parseFloat(commission.toFixed(2));
  } catch (err) {
    console.warn("calculateCommission failed", err);
    return 0;
  }
}

/**
 * Processes a batch of sales to attribute commissions to associates.
 */
export async function attributeCommissions(sales: any[]): Promise<number> {
  let count = 0;
  for (const sale of sales) {
    const commission = await calculateCommission(sale.category_id, sale.amount);
    if (commission > 0) {
      const ok = await saveCommissionEntry(sale, commission);
      if (ok) count++;
    }
  }
  return count;
}

async function saveCommissionEntry(sale: any, amount: number): Promise<boolean> {
  try {
    const supabase = getClient();
    const { error } = await supabase.from("associate_earnings").insert([
      {
        associate_id: sale.associate_id,
        order_id: sale.order_id,
        amount,
        status: 'pending',
        created_at: new Date().toISOString()
      }
    ]);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Gets total pending earnings for an associate.
 */
export async function getPendingEarnings(associateId: string): Promise<number> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return 0;

    const supabase = getClient();
    const { data, error } = await supabase
      .from("associate_earnings")
      .select("amount")
      .eq("associate_id", associateId)
      .eq("status", "pending");

    if (error) throw error;

    return (data ?? []).reduce((sum, row) => sum + row.amount, 0);
  } catch (err) {
    console.warn("getPendingEarnings failed", err);
    return 0;
  }
}
