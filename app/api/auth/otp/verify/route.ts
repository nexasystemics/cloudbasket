// © 2026 NEXQON HOLDINGS — CloudBasket route.ts
import { NextRequest, NextResponse } from 'next/server'
import { hasSupabase, env } from '@/lib/env'
import { otpVerifySchema, zodError } from '@/lib/validation'

export async function POST(request: NextRequest) {
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
      .eq('code', code)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('[auth/otp/verify] DB error:', error.message)
      return NextResponse.json({ valid: false, error: 'Verification failed' }, { status: 500 })
    }

    if (!data) return NextResponse.json({ valid: false })

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
