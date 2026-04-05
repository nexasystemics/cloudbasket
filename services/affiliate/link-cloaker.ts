// services/affiliate/link-cloaker.ts
import { createClient } from "@supabase/supabase-js";
import { isConfigured } from "@/lib/env";
import crypto from "crypto";

/**
 * Link Cloaker Service.
 * Manages affiliate link redirection, tracking, and obfuscation.
 * Routes through internal /go/[slug] endpoints.
 */

export interface CloakedLink {
  id: string;
  slug: string;
  target_url: string;
  platform: 'amazon' | 'flipkart' | 'cj' | 'other';
  clicks: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
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
 * Creates a unique slug for a given target URL.
 */
function generateSlug(url: string): string {
  const hash = crypto.createHash('md5').update(url + Date.now()).digest('hex');
  return hash.substring(0, 8);
}

/**
 * Creates a new cloaked link for an affiliate destination.
 */
export async function createCloakedLink(
  targetUrl: string,
  platform: CloakedLink['platform'] = 'other',
  customSlug?: string
): Promise<string> {
  const sb = getClient();
  if (!sb) return targetUrl;

  try {
    const slug = customSlug || generateSlug(targetUrl);
    
    const { error } = await sb.from("cloaked_links").upsert([{
      slug,
      target_url: targetUrl,
      platform,
      is_active: true,
      created_at: new Date().toISOString()
    }], { onConflict: 'slug' });

    if (error) throw error;
    
    return `${process.env.NEXT_PUBLIC_SITE_URL}/go/${slug}`;
  } catch (err) {
    console.warn("[LinkCloaker] createCloakedLink failed", err);
    return targetUrl;
  }
}

/**
 * Resolves a cloaked slug to its original target URL and increments click count.
 */
export async function getOriginalUrl(slug: string): Promise<string | null> {
  const sb = getClient();
  if (!sb) return null;

  try {
    const { data, error } = await sb
      .from("cloaked_links")
      .select("id, target_url, is_active, expires_at")
      .eq("slug", slug)
      .single();

    if (error || !data || !data.is_active) return null;

    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      await deactivateLink(slug);
      return null;
    }

    // Increment click count asynchronously
    await trackRedirect(slug);

    return data.target_url;
  } catch (err) {
    console.warn("[LinkCloaker] getOriginalUrl failed", err);
    return null;
  }
}

/**
 * Records a redirect event for analytics.
 */
export async function trackRedirect(slug: string, metadata: any = {}): Promise<void> {
  const sb = getClient();
  if (!sb) return;

  try {
    // 1. Increment total clicks
    const { error: incErr } = await sb.rpc('increment_link_clicks', { link_slug: slug });
    if (incErr) {
      // Fallback if RPC doesn't exist
      const { data: current } = await sb.from("cloaked_links").select("clicks").eq("slug", slug).single();
      await sb.from("cloaked_links").update({ clicks: (current?.clicks || 0) + 1 }).eq("slug", slug);
    }

    // 2. Log specific redirection event
    await sb.from("redirection_logs").insert([{
      slug,
      ip_address: metadata.ip || 'unknown',
      user_agent: metadata.userAgent || 'unknown',
      referrer: metadata.referrer || 'direct',
      created_at: new Date().toISOString()
    }]);
  } catch (err) {
    console.warn("[LinkCloaker] trackRedirect failed", err);
  }
}

/**
 * Deactivates a cloaked link.
 */
export async function deactivateLink(slug: string): Promise<boolean> {
  const sb = getClient();
  if (!sb) return false;

  try {
    const { error } = await sb
      .from("cloaked_links")
      .update({ is_active: false })
      .eq("slug", slug);

    return !error;
  } catch (err) {
    console.warn("[LinkCloaker] deactivateLink failed", err);
    return false;
  }
}

/**
 * Purges expired or inactive cloaked links to keep the database lean.
 */
export async function purgeExpiredLinks(): Promise<number> {
  const sb = getClient();
  if (!sb) return 0;

  try {
    const now = new Date().toISOString();
    const { data, error } = await sb
      .from("cloaked_links")
      .delete()
      .or(`expires_at.lt.${now},is_active.eq.false`)
      .select("id");

    if (error) throw error;
    return data?.length ?? 0;
  } catch (err) {
    console.warn("[LinkCloaker] purgeExpiredLinks failed", err);
    return 0;
  }
}

/**
 * Gets top performing cloaked links by clicks.
 */
export async function getTopLinks(limit: number = 10): Promise<CloakedLink[]> {
  const sb = getClient();
  if (!sb) return [];

  try {
    const { data, error } = await sb
      .from("cloaked_links")
      .select("*")
      .order("clicks", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as CloakedLink[];
  } catch (err) {
    console.warn("[LinkCloaker] getTopLinks failed", err);
    return [];
  }
}
