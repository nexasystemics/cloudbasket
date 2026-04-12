import { NextRequest, NextResponse } from 'next/server'
import { sponsoredImpressionSchema, zodError } from '@/lib/validation'

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = sponsoredImpressionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: zodError(parsed.error) }, { status: 400 })
  }
  const { campaignId, productId, placement } = parsed.data

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
      const { error } = await sb.from('sponsored_impressions').insert({
        campaign_id: campaignId,
        product_id: productId,
        placement,
        recorded_at: new Date().toISOString(),
      })
      if (error) {
        console.error('[sponsored/impression] DB error:', error.message)
      }
    } catch (err) {
      console.error('[sponsored/impression] Unexpected error:', err)
    }
  }

  return NextResponse.json({ ok: true })
}
