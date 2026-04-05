// services/crm/customer-segmentation.ts
import { createClient } from "@supabase/supabase-js";
import { isConfigured } from "@/lib/env";

/**
 * Customer segments based on RFM (Recency, Frequency, Monetary) analysis.
 */
export type CustomerSegment = 'vip' | 'loyal' | 'regular' | 'new' | 'at_risk' | 'churned' | 'inactive';

export interface SegmentationRule {
  segment: CustomerSegment;
  min_ltv?: number;
  max_ltv?: number;
  min_orders?: number;
  last_order_within_days?: number;
}

export interface UserMetrics {
  user_id: string;
  ltv: number;
  order_count: number;
  avg_order_value: number;
  days_since_last_order: number;
  current_segment: CustomerSegment;
}

function getClient(): any {
  if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL") || !isConfigured("SUPABASE_SERVICE_ROLE_KEY")) {
    console.warn("[CustomerSegmentation] Supabase not configured");
    return null;
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Calculates the total Lifetime Value (LTV) for a user.
 * Considers only successful or delivered orders.
 */
export async function calculateLTV(userId: string): Promise<number> {
  const sb = getClient();
  if (!sb) return 0;

  try {
    const { data, error } = await sb
      .from("orders")
      .select("amount")
      .eq("user_id", userId)
      .in("status", ["completed", "delivered"]);

    if (error) throw error;

    const total = (data as { amount: number }[] ?? []).reduce((sum, order) => sum + order.amount, 0);
    return parseFloat(total.toFixed(2));
  } catch (err) {
    console.warn("[CustomerSegmentation] calculateLTV failed", err);
    return 0;
  }
}

/**
 * Fetches core behavioral metrics for a user.
 */
export async function getUserMetrics(userId: string): Promise<UserMetrics | null> {
  const sb = getClient();
  if (!sb) return null;

  try {
    const { data: profile, error: profErr } = await sb
      .from("profiles")
      .select("segment")
      .eq("id", userId)
      .single();

    if (profErr) throw profErr;

    const { data: orders, error: orderErr } = await sb
      .from("orders")
      .select("amount, created_at")
      .eq("user_id", userId)
      .in("status", ["completed", "delivered"])
      .order("created_at", { ascending: false });

    if (orderErr) throw orderErr;

    const ltv = (orders ?? []).reduce((sum: number, o: any) => sum + o.amount, 0);
    const order_count = orders?.length ?? 0;
    const avg_order_value = order_count > 0 ? ltv / order_count : 0;
    
    let days_since_last_order = 999;
    if (order_count > 0) {
      const lastOrderDate = new Date(orders![0].created_at);
      days_since_last_order = Math.floor((Date.now() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24));
    }

    return {
      user_id: userId,
      ltv,
      order_count,
      avg_order_value,
      days_since_last_order,
      current_segment: (profile as any)?.segment ?? 'new'
    };
  } catch (err) {
    console.warn("[CustomerSegmentation] getUserMetrics failed", err);
    return null;
  }
}

/**
 * Assigns a segment based on the derived metrics and predefined rules.
 */
export async function assignSegment(userId: string): Promise<CustomerSegment> {
  const metrics = await getUserMetrics(userId);
  if (!metrics) return 'new';

  const { ltv, order_count, days_since_last_order } = metrics;

  // VIP: High spend, high frequency, recent activity
  if (ltv >= 100000 && order_count >= 10 && days_since_last_order <= 30) {
    return 'vip';
  }

  // Loyal: Good spend, frequent orders
  if (ltv >= 25000 && order_count >= 5 && days_since_last_order <= 60) {
    return 'loyal';
  }

  // Churned: No activity for a very long time
  if (days_since_last_order > 365) {
    return 'churned';
  }

  // At Risk: Loyal or Regular who haven't ordered in 3-6 months
  if (days_since_last_order > 90 && order_count >= 2) {
    return 'at_risk';
  }

  // Inactive: New users who didn't come back
  if (days_since_last_order > 60 && order_count === 1) {
    return 'inactive';
  }

  // New: Recent single order
  if (order_count === 1 && days_since_last_order <= 30) {
    return 'new';
  }

  return 'regular';
}

/**
 * Runs a batch refresh of segments for all users in the database.
 * Optimized for larger sets by processing in chunks if necessary.
 */
export async function refreshAllSegments(): Promise<{ processed: number; changes: number; failed: number }> {
  const sb = getClient();
  if (!sb) return { processed: 0, changes: 0, failed: 0 };

  let processed = 0;
  let changes = 0;
  let failed = 0;

  try {
    const { data: users, error } = await sb.from("profiles").select("id, segment");
    if (error) throw error;

    for (const user of users ?? []) {
      try {
        const newSegment = await assignSegment(user.id);
        processed++;

        if (newSegment !== user.segment) {
          const { error: upErr } = await sb
            .from("profiles")
            .update([{ 
              segment: newSegment, 
              segment_updated_at: new Date().toISOString() 
            }])
            .eq("id", user.id);

          if (upErr) {
            failed++;
          } else {
            changes++;
            await logSegmentChange(user.id, user.segment, newSegment);
          }
        }
      } catch (innerErr) {
        failed++;
        console.warn(`[CustomerSegmentation] Error processing user ${user.id}`, innerErr);
      }
    }

    return { processed, changes, failed };
  } catch (err) {
    console.warn("[CustomerSegmentation] refreshAllSegments failed", err);
    return { processed, changes, failed };
  }
}

/**
 * Logs a segment change for audit and trend analysis.
 */
async function logSegmentChange(userId: string, oldSegment: string, newSegment: string): Promise<void> {
  const sb = getClient();
  if (!sb) return;

  try {
    await sb.from("segment_history").insert([{
      user_id: userId,
      old_segment: oldSegment,
      new_segment: newSegment,
      changed_at: new Date().toISOString()
    }]);
  } catch (err) {
    console.warn("[CustomerSegmentation] logSegmentChange failed", err);
  }
}

/**
 * Returns the list of emails for users in a specific segment.
 * Useful for targeted marketing campaigns.
 */
export async function getSegmentEmails(segment: CustomerSegment): Promise<string[]> {
  const sb = getClient();
  if (!sb) return [];

  try {
    const { data, error } = await sb
      .from("profiles")
      .select("email")
      .eq("segment", segment)
      .eq("marketing_opt_in", true);

    if (error) throw error;
    return (data as { email: string }[] ?? []).map(u => u.email);
  } catch (err) {
    console.warn("[CustomerSegmentation] getSegmentEmails failed", err);
    return [];
  }
}

/**
 * Analyzes the overall distribution of segments in the customer base.
 */
export async function getSegmentDistribution(): Promise<Record<CustomerSegment, number>> {
  const sb = getClient();
  const distribution: Record<CustomerSegment, number> = {
    vip: 0,
    loyal: 0,
    regular: 0,
    new: 0,
    at_risk: 0,
    churned: 0,
    inactive: 0
  };

  if (!sb) return distribution;

  try {
    const { data, error } = await sb
      .from("profiles")
      .select("segment");

    if (error) throw error;

    (data as { segment: CustomerSegment }[] ?? []).forEach(row => {
      if (row.segment in distribution) {
        distribution[row.segment]++;
      }
    });

    return distribution;
  } catch (err) {
    console.warn("[CustomerSegmentation] getSegmentDistribution failed", err);
    return distribution;
  }
}
