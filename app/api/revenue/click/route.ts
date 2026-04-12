import { NextRequest, NextResponse } from 'next/server'
import { revenueClickSchema, zodError } from '@/lib/validation'

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = revenueClickSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: zodError(parsed.error) }, { status: 400 })
  }
  const data = parsed.data

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
      const { error } = await sb.from('attributed_clicks').insert({
        product_id: data.productId,
        platform: data.platform,
        price: data.price,
        estimated_commission: data.estimatedCommission,
        session_id: data.sessionId,
        page_url: data.pageUrl,
        clicked_at: data.clickedAt,
      })
      if (error) {
        console.error('[revenue/click] DB insert error:', error.message)
      }
    } catch (err) {
      console.error('[revenue/click] DB error:', err)
    }
  }

  return NextResponse.json({ ok: true })
}
