// © 2026 NEXQON HOLDINGS — CloudBasket route.ts
import { createHash, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { hasSupabase, env } from '@/lib/env'
import { rateLimit } from '@/lib/redis'
import { otpVerifySchema, zodError } from '@/lib/validation'

function getRequestIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
}

export async function POST(request: NextRequest) {
  const ip = getRequestIp(request)
  const limit = await rateLimit(ip, 5, 60)
  if (!limit.success) {
    return NextResponse.json({ valid: false, error: 'Too many requests. Please try again shortly.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ valid: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = otpVerifySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ valid: false, error: zodError(parsed.error) }, { status: 400 })
  }
  const { identifier, code } = parsed.data

  if (!hasSupabase()) {
    return NextResponse.json({ valid: false, error: 'Storage not configured' }, { status: 500 })
  }

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

    const { data, error } = await sb
      .from('otp_codes')
      .select('*')
      .eq('identifier', identifier)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('[auth/otp/verify] DB error:', error.message)
      return NextResponse.json({ valid: false, error: 'Verification failed' }, { status: 500 })
    }

    if (!data) return NextResponse.json({ valid: false })

    // Constant-time comparison — prevents timing attacks on hash comparison
    const record = data as { code: string }
    const storedHashBuf = Buffer.from(record.code, 'hex')
    const incomingHashBuf = Buffer.from(createHash('sha256').update(code).digest('hex'), 'hex')
    if (storedHashBuf.length !== incomingHashBuf.length || !timingSafeEqual(storedHashBuf, incomingHashBuf)) {
      return NextResponse.json({ valid: false })
    }

    const { error: updateError } = await sb
      .from('otp_codes')
      .update({ used: true })
      .eq('identifier', identifier)

    if (updateError) {
      console.error('[auth/otp/verify] Failed to mark used:', updateError.message)
    }

    return NextResponse.json({ valid: true })
  } catch (err) {
    console.error('[auth/otp/verify] Unexpected error:', err)
    return NextResponse.json({ valid: false, error: 'Verification failed' }, { status: 500 })
  }
}
