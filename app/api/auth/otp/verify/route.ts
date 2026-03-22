import { NextRequest, NextResponse } from 'next/server'
import { hasSupabase, env } from '@/lib/env'
export async function POST(request: NextRequest) {
  try {
    const { identifier, code } = await request.json()
    if (!identifier || !code) return NextResponse.json({ valid: false, error: 'Missing fields' }, { status: 400 })
    if (!hasSupabase()) return NextResponse.json({ valid: false, error: 'Storage not configured' }, { status: 500 })
    const { createClient } = await import('@supabase/supabase-js')
    const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
    const { data } = await sb.from('otp_codes').select('*').eq('identifier', identifier).eq('code', code).eq('used', false).gt('expires_at', new Date().toISOString()).single()
    if (!data) return NextResponse.json({ valid: false })
    await sb.from('otp_codes').update({ used: true }).eq('identifier', identifier)
    return NextResponse.json({ valid: true })
  } catch { return NextResponse.json({ valid: false, error: 'Failed' }, { status: 500 }) }
}