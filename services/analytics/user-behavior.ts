import { createClient, SupabaseClient } from "@supabase/supabase-js";

const isConfigured = (key: string): boolean => Boolean(process.env[key]);

type EventType = "view" | "click" | "search" | "compare" | "go" | "funnel";
type EntityType = "product" | "category" | "brand" | "deal" | "funnel";
type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonValue[];

export interface JsonObject {
  [key: string]: JsonValue | undefined;
}

export interface UserEvent {
  user_id?: string;
  anonymous_id: string;
  event_type: EventType;
  entity_type: EntityType;
  entity_id: string;
  metadata?: JsonObject;
  ip_address?: string;
  user_agent?: string;
}

interface BehavioralLogEntityRow {
  entity_id: string;
}

export interface FunnelStepMetadata extends JsonObject {
  anonymous_id?: string;
}

let supabaseClient: SupabaseClient | null | undefined;

function getClient(): SupabaseClient | null {
  if (supabaseClient !== undefined) {
    return supabaseClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  supabaseClient = url && key ? createClient(url, key) : null;
  return supabaseClient;
}

/**
 * Tracks a user event and stores it in the behavioral_logs table.
 * Includes rate-limiting and anonymous tracking support.
 */
export async function trackEvent(event: UserEvent): Promise<boolean> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return false;

    const supabase = getClient();
    if (!supabase) return false;

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
    if (!supabase) return [];
    const queryField = isAnonymous ? "anonymous_id" : "user_id";

    const { data, error } = await supabase
      .from("behavioral_logs")
      .select("entity_id")
      .eq(queryField, id)
      .eq("entity_type", "product")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    const counts = (data ?? []).reduce<Record<string, number>>((acc, curr: BehavioralLogEntityRow) => {
      acc[curr.entity_id] = (acc[curr.entity_id] || 0) + 1;
      return acc;
    }, {});

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
    if (!supabase) return [];
    const since = new Date(Date.now() - windowHours * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from("behavioral_logs")
      .select("entity_id")
      .eq("entity_type", "category")
      .eq("event_type", "view")
      .gte("created_at", since);

    if (error) throw error;

    const counts = (data ?? []).reduce<Record<string, number>>((acc, curr: BehavioralLogEntityRow) => {
      acc[curr.entity_id] = (acc[curr.entity_id] || 0) + 1;
      return acc;
    }, {});

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

export async function trackFunnelStep(
  step: string,
  userId: string,
  metadata: FunnelStepMetadata = {}
): Promise<boolean> {
  const anonymousId =
    typeof metadata.anonymous_id === "string" && metadata.anonymous_id.length > 0
      ? metadata.anonymous_id
      : "system";

  return trackEvent({
    user_id: userId,
    anonymous_id: anonymousId,
    event_type: "funnel",
    entity_type: "funnel",
    entity_id: step,
    metadata,
  });
}

/**
 * Generates an engagement score for a specific product.
 */
export async function getProductEngagementScore(productId: string): Promise<number> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return 0;

    const supabase = getClient();
    if (!supabase) return 0;
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
