import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
export async function GET(r: NextRequest) {
  const mode = r.nextUrl.searchParams.get('hub.mode'); const token = r.nextUrl.searchParams.get('hub.verify_token'); const challenge = r.nextUrl.searchParams.get('hub.challenge')
  if (mode === 'subscribe' && token === env.WHATSAPP_VERIFY_TOKEN) return new NextResponse(challenge, { status: 200 })
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
export async function POST(r: NextRequest) {
  try {
    const body = await r.json(); const message = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]
    if (message?.text?.body?.toUpperCase().trim() === 'STOP' && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try { const { createClient } = await import('@supabase/supabase-js'); const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY!); await sb.from('whatsapp_subscribers').update({ unsubscribed_at: new Date().toISOString() }).eq('phone_number', message.from) } catch { /* no-op */ }
    }
    return NextResponse.json({ ok: true })
  } catch { return NextResponse.json({ ok: true }) }
}