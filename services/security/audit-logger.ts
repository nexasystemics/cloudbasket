import { createClient, SupabaseClient } from "@supabase/supabase-js";

const isConfigured = (key: string): boolean => Boolean(process.env[key]);

export type AuditAction = 'create' | 'update' | 'delete' | 'login' | 'export' | 'payout';

function getClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string
  );
}

/**
 * Logs an administrative action to the audit trail.
 */
export async function logAudit(
  adminId: string,
  action: AuditAction,
  entity: string,
  entityId: string,
  details?: any
): Promise<void> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return;

    const supabase = getClient();
    await supabase.from("audit_logs").insert([
      {
        admin_id: adminId,
        action,
        entity_type: entity,
        entity_id: entityId,
        details,
        ip_address: 'system', // Can be enriched by caller
        created_at: new Date().toISOString()
      }
    ]);
  } catch (err) {
    console.warn("logAudit failed", err);
  }
}

/**
 * Retrieves audit logs for a specific entity.
 */
export async function getAuditTrail(entity: string, entityId: string): Promise<any[]> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return [];

    const supabase = getClient();
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("entity_type", entity)
      .eq("entity_id", entityId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.warn("getAuditTrail failed", err);
    return [];
  }
}
