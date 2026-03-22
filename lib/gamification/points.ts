import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function getUserPoints(userId: string): Promise<number> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('user_points')
    .select('total_points')
    .eq('user_id', userId)
    .single()
  return data?.total_points ?? 0
}

export async function addPoints(userId: string, points: number, reason: string): Promise<void> {
  const supabase = await createServerSupabaseClient()
  await supabase.rpc('add_user_points', { p_user_id: userId, p_points: points, p_reason: reason })
}

export async function deductPoints(userId: string, points: number, reason: string): Promise<void> {
  const supabase = await createServerSupabaseClient()
  await supabase.rpc('deduct_user_points', { p_user_id: userId, p_points: points, p_reason: reason })
}
