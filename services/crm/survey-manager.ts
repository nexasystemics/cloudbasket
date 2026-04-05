// services/crm/survey-manager.ts
import { createClient } from "@supabase/supabase-js";
import { isConfigured } from "@/lib/env";

/**
 * Survey and NPS Management Service.
 * Handles creation, submission, and analysis of customer feedback surveys.
 */

export type QuestionType = 'rating' | 'text' | 'choice' | 'boolean';

export interface SurveyQuestion {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[]; // Only for 'choice'
  required: boolean;
}

export interface Survey {
  id: string;
  title: string;
  description: string | null;
  questions: SurveyQuestion[];
  is_active: boolean;
  created_at: string;
}

export interface SurveyResponse {
  survey_id: string;
  user_id: string;
  answers: Record<string, any>;
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
 * Creates a new survey with defined questions.
 */
export async function createSurvey(
  title: string,
  questions: Omit<SurveyQuestion, 'id'>[],
  description?: string
): Promise<Survey | null> {
  const sb = getClient();
  if (!sb) return null;

  try {
    const questionsWithIds = questions.map((q, index) => ({
      ...q,
      id: `q${index + 1}`
    }));

    const { data, error } = await sb.from("surveys").insert([{
      title,
      description: description || null,
      questions: questionsWithIds,
      is_active: true,
      created_at: new Date().toISOString()
    }]).select().single();

    if (error) throw error;
    return data as Survey;
  } catch (err) {
    console.warn("[SurveyManager] createSurvey failed", err);
    return null;
  }
}

/**
 * Submits a user response to a survey.
 * Validates that the user hasn't already responded.
 */
export async function submitResponse(
  surveyId: string,
  userId: string,
  answers: Record<string, any>
): Promise<boolean> {
  const sb = getClient();
  if (!sb) return false;

  try {
    // Check for existing response
    const { data: existing } = await sb
      .from("survey_responses")
      .select("id")
      .eq("survey_id", surveyId)
      .eq("user_id", userId)
      .single();

    if (existing) {
      console.warn(`[SurveyManager] User ${userId} already responded to survey ${surveyId}`);
      return false;
    }

    const { error } = await sb.from("survey_responses").insert([{
      survey_id: surveyId,
      user_id: userId,
      answers,
      created_at: new Date().toISOString()
    }]);

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn("[SurveyManager] submitResponse failed", err);
    return false;
  }
}

/**
 * Calculates Net Promoter Score (NPS) based on a specific rating question.
 * NPS = % Promoters (9-10) - % Detractors (0-6).
 */
export async function calculateNPS(surveyId: string, questionId: string = 'q1'): Promise<{
  nps: number;
  promoters: number;
  passives: number;
  detractors: number;
  total: number;
}> {
  const sb = getClient();
  const empty = { nps: 0, promoters: 0, passives: 0, detractors: 0, total: 0 };
  if (!sb) return empty;

  try {
    const { data, error } = await sb
      .from("survey_responses")
      .select("answers")
      .eq("survey_id", surveyId);

    if (error || !data) throw error;

    const scores = (data as any[]).map(r => r.answers[questionId]).filter(s => typeof s === 'number');
    const total = scores.length;
    if (total === 0) return empty;

    let p = 0; let pas = 0; let d = 0;
    scores.forEach(s => {
      if (s >= 9) p++;
      else if (s >= 7) pas++;
      else d++;
    });

    const nps = ((p / total) * 100) - ((d / total) * 100);

    return {
      nps: Math.round(nps),
      promoters: p,
      passives: pas,
      detractors: d,
      total
    };
  } catch (err) {
    console.warn("[SurveyManager] calculateNPS failed", err);
    return empty;
  }
}

/**
 * Fetches pending (active) surveys that the user hasn't responded to yet.
 */
export async function getPendingSurveys(userId: string): Promise<Survey[]> {
  const sb = getClient();
  if (!sb) return [];

  try {
    // 1. Get active surveys
    const { data: activeSurveys, error: sErr } = await sb
      .from("surveys")
      .select("*")
      .eq("is_active", true);

    if (sErr || !activeSurveys) throw sErr;

    // 2. Get user's responded survey IDs
    const { data: responses, error: rErr } = await sb
      .from("survey_responses")
      .select("survey_id")
      .eq("user_id", userId);

    if (rErr) throw rErr;

    const respondedIds = new Set((responses as any[] ?? []).map(r => r.survey_id));
    
    // 3. Filter out responded ones
    return (activeSurveys as Survey[]).filter(s => !respondedIds.has(s.id));
  } catch (err) {
    console.warn("[SurveyManager] getPendingSurveys failed", err);
    return [];
  }
}

/**
 * Retrieves the full analysis of text-based questions.
 */
export async function getVerbatimAnalysis(surveyId: string, questionId: string): Promise<string[]> {
  const sb = getClient();
  if (!sb) return [];

  try {
    const { data, error } = await sb
      .from("survey_responses")
      .select("answers")
      .eq("survey_id", surveyId);

    if (error || !data) throw error;

    return (data as any[])
      .map(r => r.answers[questionId])
      .filter(a => typeof a === 'string' && a.length > 0);
  } catch (err) {
    console.warn("[SurveyManager] getVerbatimAnalysis failed", err);
    return [];
  }
}
