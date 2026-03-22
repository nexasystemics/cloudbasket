import { createBrowserClient } from '@supabase/ssr'

function getClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function getUserPoints(userId: string): Promise<number> {
  const { data } = await getClient()
    .from('user_points').select('total_points')
    .eq('user_id', userId).single()
  return data?.total_points ?? 0
}

export async function addPoints(userId: string, points: number, reason: string): Promise<void> {
  await getClient().rpc('add_user_points', { p_user_id: userId, p_points: points, p_reason: reason })
}

export async function deductPoints(userId: string, points: number, reason: string): Promise<void> {
  await getClient().rpc('deduct_user_points', { p_user_id: userId, p_points: points, p_reason: reason })
}
