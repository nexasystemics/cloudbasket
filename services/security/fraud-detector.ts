
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const isConfigured = (key: string): boolean => Boolean(process.env[key]);

interface RiskAssessment {
  score: number;
  reasons: string[];
}

interface OrderRow {
  id: string;
  user_id: string;
  amount: number;
  created_at: string;
  ip_address: string;
}

interface PaymentRow {
  status: string;
  created_at: string;
}

interface IpMetadata {
  ip: string;
  is_vpn: boolean;
  is_proxy: boolean;
  country: string;
}

function getClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string
  );
}

function nowISO(): string {
  return new Date().toISOString();
}

/**
 * Assess order fraud risk score (0–100)
 */
export async function assessOrderRisk(
  orderId: string,
  userId: string,
  amount: number,
  ipAddress: string
): Promise<RiskAssessment> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) {
      return { score: 0, reasons: [] };
    }

    const reasons: string[] = [];
    let score = 0;

    const velocity = await checkVelocityLimits(userId, 30);

    if (velocity > 5) {
      score += 25;
      reasons.push("High order velocity");
    }

    if (amount > 50000) {
      score += 20;
      reasons.push("High value order");
    }

    const suspicious = await detectSuspiciousPatterns(userId);
    if (suspicious) {
      score += 25;
      reasons.push("Multiple failed payments");
    }

    const supabase = getClient();

    const { data: ipData } = await supabase
      .from("ip_metadata")
      .select("*")
      .eq("ip", ipAddress)
      .single();

    const ipMeta = ipData as IpMetadata | null;

    if (ipMeta?.is_vpn || ipMeta?.is_proxy) {
      score += 30;
      reasons.push("VPN or Proxy detected");
    }

    if (reasons.length === 0) {
      reasons.push("No major risks detected");
    }

    return {
      score: Math.min(score, 100),
      reasons,
    };
  } catch (err) {
    console.warn("assessOrderRisk failed", err);
    return { score: 0, reasons: [] };
  }
}

/**
 * Check order velocity within time window
 */
export async function checkVelocityLimits(
  userId: string,
  window_minutes: number
): Promise<number> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return 0;

    const supabase = getClient();

    const since = new Date(Date.now() - window_minutes * 60000).toISOString();

    const { data, error } = await supabase
      .from("orders")
      .select("id")
      .eq("user_id", userId)
      .gte("created_at", since);

    if (error) throw error;

    return data?.length ?? 0;
  } catch (err) {
    console.warn("checkVelocityLimits failed", err);
    return 0;
  }
}

/**
 * Detect suspicious patterns (failed payments etc.)
 */
export async function detectSuspiciousPatterns(
  userId: string
): Promise<boolean> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return false;

    const supabase = getClient();

    const { data, error } = await supabase
      .from("payments")
      .select("status")
      .eq("user_id", userId);

    if (error) throw error;

    const failures =
      (data as { status: string }[])?.filter((p) => p.status === "failed").length ?? 0;

    return failures >= 3;
  } catch (err) {
    console.warn("detectSuspiciousPatterns failed", err);
    return false;
  }
}

/**
 * Flag transaction for fraud review
 */
export async function flagTransaction(
  transactionId: string,
  reason: string,
  severity: number
): Promise<boolean> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return false;

    if (!transactionId || !reason) return false;

    const supabase = getClient();

    const { error } = await supabase.from("security_events").insert([
      {
        transaction_id: transactionId,
        reason,
        severity,
        created_at: nowISO(),
      },
    ]);

    if (error) throw error;

    return true;
  } catch (err) {
    console.warn("flagTransaction failed", err);
    return false;
  }
}

/**
 * Get high-risk users based on severity
 */
export async function getHighRiskUsers(
  limit: number
): Promise<string[]> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return [];

    const supabase = getClient();

    const safeLimit = Math.min(Math.max(limit, 1), 100);

    const { data, error } = await supabase
      .from("security_events")
      .select("user_id")
      .order("severity", { ascending: false })
      .limit(safeLimit);

    if (error) throw error;

    return (data ?? []).map((row) => row.user_id as string);
  } catch (err) {
    console.warn("getHighRiskUsers failed", err);
    return [];
  }
}

/**
 * Get overall security metrics
 */
export async function getSecurityMetrics(): Promise<{
  total_flags: number;
  high_severity: number;
}> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) {
      return { total_flags: 0, high_severity: 0 };
    }

    const supabase = getClient();

    const { data, error } = await supabase
      .from("security_events")
      .select("severity");

    if (error) throw error;

    const total = data?.length ?? 0;

    const highSeverity =
      data?.filter((d) => (d.severity as number) >= 70).length ?? 0;

    return {
      total_flags: total,
      high_severity: highSeverity,
    };
  } catch (err) {
    console.warn("getSecurityMetrics failed", err);
    return { total_flags: 0, high_severity: 0 };
  }
}
