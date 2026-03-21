import { NextRequest, NextResponse } from 'next/server'
export async function POST(r: NextRequest) {
  try {
    const { campaignId, productId, placement } = await r.json()
    if (!campaignId) return NextResponse.json({ ok: false }, { status: 400 })
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try { const { createClient } = await import('@supabase/supabase-js'); const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY); await sb.from('sponsored_impressions').insert({ campaign_id: campaignId, product_id: productId, placement, recorded_at: new Date().toISOString() }) } catch { /* no-op */ }
    }
    return NextResponse.json({ ok: true })
  } catch { return NextResponse.json({ ok: false }) }
}