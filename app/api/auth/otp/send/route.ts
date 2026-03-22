import { NextRequest, NextResponse } from 'next/server'
import { generateOTP, sendEmailOTP, sendSMSOTP } from '@/lib/auth/otp'
import { hasSupabase, env } from '@/lib/env'
export async function POST(request: NextRequest) {
  try {
    const { identifier, type } = await request.json()
    if (!identifier || !type) return NextResponse.json({ error: 'identifier and type required' }, { status: 400 })
    const otp = generateOTP(6)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
    if (hasSupabase()) {
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
        await sb.from('otp_codes').upsert({ identifier, code: otp, type, expires_at: expiresAt.toISOString(), used: false })
      } catch { /* no-op */ }
    }
    let sent = false
    if (type === 'email') sent = await sendEmailOTP(identifier, otp)
    else if (type === 'sms') sent = await sendSMSOTP(identifier, otp)
    return NextResponse.json({ ok: sent, expiresAt })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}