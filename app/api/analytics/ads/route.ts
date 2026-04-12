import { NextRequest, NextResponse } from 'next/server'
import { adsAnalyticsSchema, zodError } from '@/lib/validation'

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = adsAnalyticsSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: zodError(parsed.error) }, { status: 400 })
  }
  const { impressions, sessionId, pageUrl, recordedAt } = parsed.data

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
      const { error } = await supabase.from('ad_analytics').insert({
        impressions,
        session_id: sessionId,
        page_url: pageUrl,
        recorded_at: recordedAt,
      })
      if (error) {
        // ad_analytics is non-critical — log but don't fail the response
        console.warn('[analytics/ads] DB insert error:', error.message)
      }
    } catch (err) {
      console.warn('[analytics/ads] Unexpected error:', err)
    }
  }

  return NextResponse.json({ ok: true })
}
