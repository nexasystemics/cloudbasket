import { createClient, SupabaseClient } from "@supabase/supabase-js";

const isConfigured = (key: string): boolean => Boolean(process.env[key]);

export interface UserEvent {
  user_id?: string;
  anonymous_id: string;
  event_type: 'view' | 'click' | 'search' | 'compare' | 'go';
  entity_type: 'product' | 'category' | 'brand' | 'deal';
  entity_id: string;
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

function getClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string
  );
}

/**
 * Tracks a user event and stores it in the behavioral_logs table.
 * Includes rate-limiting and anonymous tracking support.
 */
export async function trackEvent(event: UserEvent): Promise<boolean> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return false;

    const supabase = getClient();

    const { error } = await supabase.from("behavioral_logs").insert([
      {
        ...event,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.warn("trackEvent: Insert failed", error);
      return false;
    }

    return true;
  } catch (err) {
    console.warn("trackEvent: Exception", err);
    return false;
  }
}

/**
 * Retrieves the most viewed products for a specific user or anonymous ID.
 */
export async function getPersonalizedRecommendations(
  id: string,
  isAnonymous: boolean = false
): Promise<string[]> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return [];

    const supabase = getClient();
    const queryField = isAnonymous ? "anonymous_id" : "user_id";

    const { data, error } = await supabase
      .from("behavioral_logs")
      .select("entity_id")
      .eq(queryField, id)
      .eq("entity_type", "product")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    const counts = (data ?? []).reduce((acc, curr) => {
      acc[curr.entity_id] = (acc[curr.entity_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => id)
      .slice(0, 10);
  } catch (err) {
    console.warn("getPersonalizedRecommendations failed", err);
    return [];
  }
}

/**
 * Aggregates site-wide trending categories based on recent behavior.
 */
export async function getTrendingCategories(windowHours: number = 24): Promise<string[]> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return [];

    const supabase = getClient();
    const since = new Date(Date.now() - windowHours * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from("behavioral_logs")
      .select("entity_id")
      .eq("entity_type", "category")
      .eq("event_type", "view")
      .gte("created_at", since);

    if (error) throw error;

    const counts = (data ?? []).reduce((acc, curr) => {
      acc[curr.entity_id] = (acc[curr.entity_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => id)
      .slice(0, 6);
  } catch (err) {
    console.warn("getTrendingCategories failed", err);
    return [];
  }
}

/**
 * Logs a redirection to an affiliate partner.
 */
export async function logAffiliateRedirect(
  productId: string,
  userId?: string,
  anonymousId?: string
): Promise<void> {
  if (!anonymousId && !userId) return;

  await trackEvent({
    user_id: userId,
    anonymous_id: anonymousId || "system",
    event_type: "go",
    entity_type: "product",
    entity_id: productId,
    metadata: { source: "income_shield_node" }
  });
}

/**
 * Generates an engagement score for a specific product.
 */
export async function getProductEngagementScore(productId: string): Promise<number> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return 0;

    const supabase = getClient();
    const { count, error } = await supabase
      .from("behavioral_logs")
      .select("*", { count: "exact", head: true })
      .eq("entity_id", productId);

    if (error) throw error;

    return count || 0;
  } catch (err) {
    console.warn("getProductEngagementScore failed", err);
    return 0;
  }
}
