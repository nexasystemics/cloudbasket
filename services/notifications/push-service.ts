// services/notifications/push-service.ts
import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";
import { isConfigured } from "@/lib/env";

/**
 * Web Push Notification Service.
 * Handles subscription management and delivery using VAPID.
 */

export interface PushSubscription {
  endpoint: string;
  keys: {
    auth: string;
    p256dh: string;
  };
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: {
    url?: string;
    productId?: string;
    category?: string;
  };
}

function getClient(): any {
  if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL") || !isConfigured("SUPABASE_SERVICE_ROLE_KEY")) {
    return null;
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Configures the web-push library with VAPID details from environment.
 */
function configureWebPush(): boolean {
  if (
    !isConfigured("NEXT_PUBLIC_VAPID_PUBLIC_KEY") ||
    !isConfigured("VAPID_PRIVATE_KEY") ||
    !isConfigured("VAPID_EMAIL")
  ) {
    console.warn("[PushService] VAPID credentials missing");
    return false;
  }

  webpush.setVapidDetails(
    `mailto:${process.env.VAPID_EMAIL}`,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
  return true;
}

/**
 * Stores a new push subscription for a user.
 */
export async function subscribeUser(userId: string, subscription: PushSubscription): Promise<boolean> {
  const sb = getClient();
  if (!sb) return false;

  try {
    const { error } = await sb.from("push_subscriptions").upsert([{
      user_id: userId,
      subscription_json: JSON.stringify(subscription),
      endpoint: subscription.endpoint,
      updated_at: new Date().toISOString()
    }], { onConflict: 'endpoint' });

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn("[PushService] subscribeUser failed", err);
    return false;
  }
}

/**
 * Removes a push subscription by endpoint (e.g. after a 410 Gone error).
 */
export async function unsubscribeUser(endpoint: string): Promise<boolean> {
  const sb = getClient();
  if (!sb) return false;

  try {
    const { error } = await sb
      .from("push_subscriptions")
      .delete()
      .eq("endpoint", endpoint);

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn("[PushService] unsubscribeUser failed", err);
    return false;
  }
}

/**
 * Fetches all valid subscriptions for a specific user.
 */
export async function getUserSubscriptions(userId: string): Promise<PushSubscription[]> {
  const sb = getClient();
  if (!sb) return [];

  try {
    const { data, error } = await sb
      .from("push_subscriptions")
      .select("subscription_json")
      .eq("user_id", userId);

    if (error) throw error;

    return (data as any[] ?? []).map(row => JSON.parse(row.subscription_json));
  } catch (err) {
    console.warn("[PushService] getUserSubscriptions failed", err);
    return [];
  }
}

/**
 * Sends a push notification to all devices registered for a user.
 */
export async function sendPushNotification(
  userId: string,
  payload: PushNotificationPayload
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  if (!configureWebPush()) return { sent, failed };

  const subscriptions = await getUserSubscriptions(userId);
  if (subscriptions.length === 0) return { sent, failed };

  const payloadString = JSON.stringify({
    notification: {
      title: payload.title,
      body: payload.body,
      icon: payload.icon ?? "/brand/logo-64.png",
      badge: payload.badge ?? "/brand/badge-32.png",
      data: payload.data ?? {},
    }
  });

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(sub as any, payloadString);
      sent++;
    } catch (err: any) {
      failed++;
      console.warn(`[PushService] Failed to send to endpoint ${sub.endpoint}`, err.statusCode);
      
      // If endpoint is no longer valid, remove it
      if (err.statusCode === 410 || err.statusCode === 404) {
        await unsubscribeUser(sub.endpoint);
      }
    }
  }

  return { sent, failed };
}

/**
 * Broadcasts a notification to all subscribed users (Marketing/Alerts).
 * Processes in batches to avoid timing out on large subscriber bases.
 */
export async function broadcastNotification(
  payload: PushNotificationPayload,
  batchSize: number = 50
): Promise<{ total_sent: number; total_failed: number }> {
  let total_sent = 0;
  let total_failed = 0;

  if (!configureWebPush()) return { total_sent, total_failed };

  const sb = getClient();
  if (!sb) return { total_sent, total_failed };

  try {
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await sb
        .from("push_subscriptions")
        .select("subscription_json, endpoint")
        .range(offset, offset + batchSize - 1);

      if (error) throw error;
      if (!data || data.length === 0) {
        hasMore = false;
        break;
      }

      const payloadString = JSON.stringify({
        notification: {
          title: payload.title,
          body: payload.body,
          icon: payload.icon ?? "/brand/logo-64.png",
          data: payload.data ?? {},
        }
      });

      const promises = data.map(async (row: any) => {
        try {
          const sub = JSON.parse(row.subscription_json);
          await webpush.sendNotification(sub, payloadString);
          return { success: true };
        } catch (err: any) {
          if (err.statusCode === 410 || err.statusCode === 404) {
            await unsubscribeUser(row.endpoint);
          }
          return { success: false };
        }
      });

      const results = await Promise.all(promises);
      results.forEach(res => {
        if (res.success) total_sent++;
        else total_failed++;
      });

      offset += batchSize;
      if (data.length < batchSize) hasMore = false;
    }

    return { total_sent, total_failed };
  } catch (err) {
    console.warn("[PushService] broadcastNotification failed", err);
    return { total_sent, total_failed };
  }
}

/**
 * Helper to generate VAPID keys for the first time setup.
 * Call this once and save to .env.local
 */
export function generateVapidKeys(): { publicKey: string; privateKey: string } {
  const keys = webpush.generateVAPIDKeys();
  return {
    publicKey: keys.publicKey,
    privateKey: keys.privateKey
  };
}
