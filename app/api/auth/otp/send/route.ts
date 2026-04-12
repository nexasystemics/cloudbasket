// © 2026 NEXQON HOLDINGS — CloudBasket route.ts
import { NextRequest, NextResponse } from 'next/server'
import { generateOTP, sendEmailOTP, sendSMSOTP } from '@/lib/auth/otp'
import { hasSupabase, env } from '@/lib/env'
import { rateLimit } from '@/lib/redis'
import { otpSendSchema, zodError } from '@/lib/validation'

function getRequestIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
}

export async function POST(request: NextRequest) {
  const ip = getRequestIp(request)
  const limit = await rateLimit(ip, 5, 60)
  if (!limit.success) {
    return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = otpSendSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: zodError(parsed.error) }, { status: 400 })
  }
  const { identifier, type } = parsed.data

  try {
    const otp = generateOTP(6)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    if (hasSupabase()) {
      const { createClient } = await import('@supabase/supabase-js')
      const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
      const { error } = await sb.from('otp_codes').upsert({
        identifier,
        code: otp,
        type,
        expires_at: expiresAt.toISOString(),
        used: false,
      })
      if (error) {
        console.error('[auth/otp/send] DB error:', error.message)
        return NextResponse.json({ error: 'Failed to store OTP' }, { status: 500 })
      }
    }

    let sent = false
    if (type === 'email') sent = await sendEmailOTP(identifier, otp)
    else if (type === 'sms') sent = await sendSMSOTP(identifier, otp)

    return NextResponse.json({ ok: sent, expiresAt })
  } catch (err) {
    console.error('[auth/otp/send] Unexpected error:', err)
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}
