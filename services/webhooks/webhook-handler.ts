
import crypto from "crypto";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const isConfigured = (key: string): boolean => Boolean(process.env[key]);

type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

interface RazorpayPaymentEntity {
  id: string;
  amount: number;
  currency: string;
  status: string;
  order_id: string;
  method: string;
  created_at: number;
}

interface RazorpayWebhookPayload {
  event: string;
  payload: {
    payment?: { entity: RazorpayPaymentEntity };
  };
}

interface WhatsAppMessage {
  from: string;
  id: string;
  timestamp: string;
  text?: { body: string };
  type: string;
}

interface WhatsAppWebhookPayload {
  object: string;
  entry: Array<{
    changes: Array<{
      value: {
        messages?: WhatsAppMessage[];
      };
    }>;
  }>;
}

interface WebhookLog {
  source: string;
  event: string;
  payload: Json;
  status: string;
}

function getClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string
  );
}

async function safeInsertLog(log: WebhookLog): Promise<boolean> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return false;

    const supabase = getClient();

    const { error } = await supabase.from("webhook_logs").insert([log]);

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn("safeInsertLog failed", err);
    return false;
  }
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retry<T>(fn: () => Promise<T>, attempts: number): Promise<T | null> {
  let lastError: unknown = null;

  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      await sleep(200 * (i + 1));
    }
  }

  console.warn("retry failed", lastError);
  return null;
}

/**
 * Verify Razorpay webhook signature
 */
export async function verifyRazorpaySignature(
  body: string,
  signature: string
): Promise<boolean> {
  try {
    if (!isConfigured("RAZORPAY_KEY_SECRET")) return false;
    if (!body || !signature) return false;

    const secret = process.env.RAZORPAY_KEY_SECRET as string;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    return expectedSignature === signature;
  } catch (err) {
    console.warn("verifyRazorpaySignature failed", err);
    return false;
  }
}

/**
 * Process Razorpay payment webhook
 */
export async function processPaymentWebhook(
  payload: RazorpayWebhookPayload
): Promise<boolean> {
  try {
    if (!payload || !payload.event) return false;

    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return false;

    const payment = payload.payload.payment?.entity;
    if (!payment) return false;

    const supabase = getClient();

    const statusMap: Record<string, string> = {
      "payment.captured": "paid",
      "payment.failed": "failed",
      "payment.authorized": "authorized",
    };

    const mappedStatus = statusMap[payload.event] || "unknown";

    const updateResult = await retry(async () => {
      const { error } = await supabase
        .from("orders")
        .update({
          payment_status: mappedStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("razorpay_payment_id", payment.id);

      if (error) throw error;
      return true;
    }, 3);

    const success = Boolean(updateResult);

    await safeInsertLog({
      source: "razorpay",
      event: payload.event,
      payload: payload as unknown as Json,
      status: success ? "processed" : "failed",
    });

    return success;
  } catch (err) {
    console.warn("processPaymentWebhook failed", err);
    return false;
  }
}

/**
 * Process WhatsApp webhook
 */
export async function processWhatsAppWebhook(
  payload: WhatsAppWebhookPayload
): Promise<boolean> {
  try {
    if (!payload || payload.object !== "whatsapp_business_account") return false;

    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return false;

    const supabase = getClient();

    const messages: WhatsAppMessage[] = [];

    for (const entry of payload.entry) {
      for (const change of entry.changes) {
        if (change.value.messages) {
          messages.push(...change.value.messages);
        }
      }
    }

    if (messages.length === 0) {
      await safeInsertLog({
        source: "whatsapp",
        event: "no_messages",
        payload: payload as unknown as Json,
        status: "ignored",
      });
      return true;
    }

    for (const msg of messages) {
      await retry(async () => {
        const { error } = await supabase.from("support_messages").insert([
          {
            external_id: msg.id,
            sender: msg.from,
            message: msg.text?.body || "",
            type: msg.type,
            created_at: new Date().toISOString(),
          },
        ]);

        if (error) throw error;
        return true;
      }, 3);
    }

    await safeInsertLog({
      source: "whatsapp",
      event: "message_received",
      payload: payload as unknown as Json,
      status: "processed",
    });

    return true;
  } catch (err) {
    console.warn("processWhatsAppWebhook failed", err);
    return false;
  }
}

/**
 * Log webhook event explicitly
 */
export async function logWebhookEvent(
  source: string,
  event: string,
  payload: Json,
  status: string
): Promise<boolean> {
  try {
    if (!source || !event) return false;

    return await safeInsertLog({ source, event, payload, status });
  } catch (err) {
    console.warn("logWebhookEvent failed", err);
    return false;
  }
}

/**
 * Get webhook logs
 */
export async function getWebhookLogs(
  source: string,
  limit: number
): Promise<WebhookLog[]> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return [];

    const supabase = getClient();

    const safeLimit = Math.min(Math.max(limit, 1), 100);

    const { data, error } = await supabase
      .from("webhook_logs")
      .select("*")
      .eq("source", source)
      .order("created_at", { ascending: false })
      .limit(safeLimit);

    if (error) throw error;

    return (data ?? []) as WebhookLog[];
  } catch (err) {
    console.warn("getWebhookLogs failed", err);
    return [];
  }
}

/**
 * Retry failed webhook events
 */
export async function retryFailedWebhooks(): Promise<number> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return 0;

    const supabase = getClient();

    const { data, error } = await supabase
      .from("webhook_logs")
      .select("*")
      .eq("status", "failed")
      .limit(50);

    if (error) throw error;

    let successCount = 0;

    for (const log of data ?? []) {
      if (log.source === "razorpay") {
        const ok = await processPaymentWebhook(
          log.payload as unknown as RazorpayWebhookPayload
        );
        if (ok) successCount++;
      } else if (log.source === "whatsapp") {
        const ok = await processWhatsAppWebhook(
          log.payload as unknown as WhatsAppWebhookPayload
        );
        if (ok) successCount++;
      }
    }

    return successCount;
  } catch (err) {
    console.warn("retryFailedWebhooks failed", err);
    return 0;
  }
}
