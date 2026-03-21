import { NextRequest, NextResponse } from 'next/server'
export async function POST(r: NextRequest) {
  try {
    const body = await r.json(); if (!body.productId) return NextResponse.json({ ok: false }, { status: 400 })
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try { const { createClient } = await import('@supabase/supabase-js'); const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY); await sb.from('attributed_clicks').insert({ product_id: body.productId, platform: body.platform, price: body.price, estimated_commission: body.estimatedCommission, session_id: body.sessionId, page_url: body.pageUrl, clicked_at: body.clickedAt }) } catch { /* no-op */ }
    }
    return NextResponse.json({ ok: true })
  } catch { return NextResponse.json({ ok: false }) }
}