import { createClient, SupabaseClient } from "@supabase/supabase-js";

const isConfigured = (key: string): boolean => Boolean(process.env[key]);

function getClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string
  );
}

/**
 * Archives price history older than the specified days to an archive table.
 */
export async function archiveOldPrices(days: number = 90): Promise<number> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return 0;

    const supabase = getClient();
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    // 1. Fetch old records
    const { data: oldPrices, error: fetchError } = await supabase
      .from("price_history")
      .select("*")
      .lt("created_at", cutoffDate)
      .limit(5000);

    if (fetchError) throw fetchError;
    if (!oldPrices || oldPrices.length === 0) return 0;

    // 2. Insert into archive
    const { error: archiveError } = await supabase
      .from("price_history_archive")
      .insert(oldPrices);

    if (archiveError) throw archiveError;

    // 3. Delete from main table
    const ids = oldPrices.map(p => p.id);
    const { error: deleteError } = await supabase
      .from("price_history")
      .delete()
      .in("id", ids);

    if (deleteError) throw deleteError;

    return oldPrices.length;
  } catch (err) {
    console.warn("archiveOldPrices failed", err);
    return 0;
  }
}

/**
 * Performs a hard delete on truly ancient data (e.g., older than 2 years).
 */
export async function purgeAncientData(years: number = 2): Promise<number> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return 0;

    const supabase = getClient();
    const cutoffDate = new Date(Date.now() - years * 365 * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from("price_history_archive")
      .delete()
      .lt("created_at", cutoffDate)
      .select("id");

    if (error) throw error;
    return data?.length ?? 0;
  } catch (err) {
    console.warn("purgeAncientData failed", err);
    return 0;
  }
}

/**
 * Vacuum/Optimize table (if using specific Postgres functions via RPC).
 */
export async function optimizePriceTable(): Promise<boolean> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return false;

    const supabase = getClient();
    const { error } = await supabase.rpc("vacuum_price_history");

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn("optimizePriceTable: RPC not available or failed", err);
    return false;
  }
}
