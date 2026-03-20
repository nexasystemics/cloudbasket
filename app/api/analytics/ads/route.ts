import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.impressions) return NextResponse.json({ ok: false }, { status: 400 })

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
        await supabase.from('ad_analytics').insert({
          impressions: body.impressions,
          session_id: body.sessionId,
          page_url: body.pageUrl,
          recorded_at: body.recordedAt,
        })
      } catch { /* no-op — analytics are non-critical */ }
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}