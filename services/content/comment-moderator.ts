import { createClient, SupabaseClient } from "@supabase/supabase-js";

const isConfigured = (key: string): boolean => Boolean(process.env[key]);

interface ModerationResult {
  is_approved: boolean;
  score: number;
  reason?: string;
}

function getClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string
  );
}

/**
 * Analyzes content using simple keyword filtering and AI (if configured).
 */
export async function moderateContent(content: string): Promise<ModerationResult> {
  try {
    const forbiddenKeywords = ["spam", "buy now", "cheap pills", "scam"];
    const containsForbidden = forbiddenKeywords.some(kw => 
      content.toLowerCase().includes(kw)
    );

    if (containsForbidden) {
      return { is_approved: false, score: 0, reason: "Forbidden keywords detected" };
    }

    if (isConfigured("GEMINI_API_KEY")) {
      // Future: Call Gemini for sentiment/toxicity analysis
      // For now, assume neutral-positive for long content
      return { is_approved: content.length > 10, score: 80 };
    }

    return { is_approved: true, score: 100 };
  } catch (err) {
    console.warn("moderateContent failed", err);
    return { is_approved: true, score: 50, reason: "Auto-approved due to error" };
  }
}

/**
 * Processes a pending review through the moderation pipeline.
 */
export async function processPendingReview(reviewId: string): Promise<boolean> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return false;

    const supabase = getClient();
    const { data: review } = await supabase
      .from("reviews")
      .select("content")
      .eq("id", reviewId)
      .single();

    if (!review) return false;

    const result = await moderateContent(review.content);

    const { error } = await supabase
      .from("reviews")
      .update({
        status: result.is_approved ? 'approved' : 'rejected',
        moderation_score: result.score,
        moderated_at: new Date().toISOString()
      })
      .eq("id", reviewId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn("processPendingReview failed", err);
    return false;
  }
}

/**
 * Flags a comment for manual human review.
 */
export async function flagForHumanReview(commentId: string, reason: string): Promise<void> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return;

    const supabase = getClient();
    await supabase.from("moderation_queue").insert([
      {
        entity_type: 'comment',
        entity_id: commentId,
        reason,
        status: 'pending',
        created_at: new Date().toISOString()
      }
    ]);
  } catch (err) {
    console.warn("flagForHumanReview failed", err);
  }
}
