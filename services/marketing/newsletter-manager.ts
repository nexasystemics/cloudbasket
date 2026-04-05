import { createClient, SupabaseClient } from "@supabase/supabase-js";

const isConfigured = (key: string): boolean => Boolean(process.env[key]);

export interface Subscriber {
  email: string;
  first_name?: string;
  interests?: string[];
  status: 'active' | 'unsubscribed' | 'bounced';
  source: string;
}

function getClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string
  );
}

/**
 * Subscribes a new email to the newsletter.
 */
export async function subscribe(data: Subscriber): Promise<{ success: boolean; message: string }> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) {
      return { success: false, message: "System not configured" };
    }

    const supabase = getClient();

    // Check existing
    const { data: existing } = await supabase
      .from("subscribers")
      .select("status")
      .eq("email", data.email)
      .single();

    if (existing?.status === 'active') {
      return { success: true, message: "Already subscribed" };
    }

    const { error } = await supabase.from("subscribers").upsert([
      {
        ...data,
        status: 'active',
        subscribed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]);

    if (error) throw error;

    return { success: true, message: "Subscription successful" };
  } catch (err) {
    console.warn("Newsletter subscribe failed", err);
    return { success: false, message: "Internal error" };
  }
}

/**
 * Unsubscribes a user from all marketing emails.
 */
export async function unsubscribe(email: string): Promise<boolean> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return false;

    const supabase = getClient();
    const { error } = await supabase
      .from("subscribers")
      .update({
        status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("email", email);

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn("Newsletter unsubscribe failed", err);
    return false;
  }
}

/**
 * Segments subscribers based on their interest tags.
 */
export async function getSubscribersByInterest(interest: string): Promise<string[]> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return [];

    const supabase = getClient();
    const { data, error } = await supabase
      .from("subscribers")
      .select("email")
      .eq("status", "active")
      .contains("interests", [interest]);

    if (error) throw error;
    return (data ?? []).map(s => s.email);
  } catch (err) {
    console.warn("getSubscribersByInterest failed", err);
    return [];
  }
}

/**
 * Logs a campaign send event for analytics.
 */
export async function logCampaignSend(campaignId: string, recipientCount: number): Promise<void> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return;

    const supabase = getClient();
    await supabase.from("campaign_logs").insert([
      {
        campaign_id: campaignId,
        recipient_count: recipientCount,
        sent_at: new Date().toISOString()
      }
    ]);
  } catch (err) {
    console.warn("logCampaignSend failed", err);
  }
}

/**
 * Updates subscriber profile with new interests or data.
 */
export async function updateSubscriberProfile(
  email: string,
  updates: Partial<Subscriber>
): Promise<boolean> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return false;

    const supabase = getClient();
    const { error } = await supabase
      .from("subscribers")
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq("email", email);

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn("updateSubscriberProfile failed", err);
    return false;
  }
}
