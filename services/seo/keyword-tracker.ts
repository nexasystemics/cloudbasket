import { createClient, SupabaseClient } from "@supabase/supabase-js";

const isConfigured = (key: string): boolean => Boolean(process.env[key]);

function getClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string
  );
}

/**
 * Logs a keyword ranking for a specific URL.
 */
export async function logKeywordRank(
  keyword: string,
  url: string,
  rank: number
): Promise<void> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return;

    const supabase = getClient();
    await supabase.from("seo_rankings").insert([
      {
        keyword,
        url,
        rank,
        tracked_at: new Date().toISOString()
      }
    ]);
  } catch (err) {
    console.warn("logKeywordRank failed", err);
  }
}

/**
 * Gets ranking history for a keyword.
 */
export async function getRankingHistory(keyword: string): Promise<any[]> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return [];

    const supabase = getClient();
    const { data, error } = await supabase
      .from("seo_rankings")
      .select("*")
      .eq("keyword", keyword)
      .order("tracked_at", { ascending: true });

    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.warn("getRankingHistory failed", err);
    return [];
  }
}
