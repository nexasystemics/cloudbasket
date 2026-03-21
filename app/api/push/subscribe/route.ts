import { NextRequest, NextResponse } from 'next/server'
export async function POST(r: NextRequest) {
  try {
    const sub = await r.json(); if (!sub?.endpoint) return NextResponse.json({ error: 'Invalid' }, { status: 400 })
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) { try { const { createClient } = await import('@supabase/supabase-js'); const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY); await sb.from('push_subscriptions').upsert({ endpoint: sub.endpoint, p256dh_key: sub.keys?.p256dh, auth_key: sub.keys?.auth, active: true, subscribed_at: new Date().toISOString() }) } catch { /* no-op */ } }
    return NextResponse.json({ ok: true })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}