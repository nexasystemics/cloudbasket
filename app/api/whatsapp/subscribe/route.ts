import { NextRequest, NextResponse } from 'next/server'
export async function POST(r: NextRequest) {
  try {
    const { phoneNumber, consent, preferences } = await r.json()
    if (!consent) return NextResponse.json({ error: 'Consent required' }, { status: 400 })
    const cleaned = phoneNumber?.replace(/\s+/g, '')
    if (!cleaned?.match(/^(\+91|91)?[6-9]\d{9}$/)) return NextResponse.json({ error: 'Invalid Indian phone' }, { status: 400 })
    const normalised = `+91${cleaned.replace(/^(\+91|91)/, '')}`
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try { const { createClient } = await import('@supabase/supabase-js'); const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY); await sb.from('whatsapp_subscribers').upsert({ phone_number: normalised, subscribed_at: new Date().toISOString(), unsubscribed_at: null, preferences }) } catch { /* no-op */ }
    }
    return NextResponse.json({ ok: true, phoneNumber: normalised })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}