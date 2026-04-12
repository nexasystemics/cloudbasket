import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { rateLimit } from '@/lib/redis'

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
  const rl = await rateLimit(ip, 60, 60)
  if (!rl.success) return NextResponse.json({ ok: false, error: 'Too many requests. Please try again shortly.' }, { status: 429 })

  try {
    const secret = request.headers.get('x-webhook-secret')
    if (!env.PRINTIFY_WEBHOOK_SECRET || secret !== env.PRINTIFY_WEBHOOK_SECRET) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }
    const body = await request.json()
    const event = body?.type
    if (event === 'order:fulfilled' && body?.data) {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        try {
          const {createClient} = await import('@supabase/supabase-js')
          const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
          await sb.from('pod_orders').update({status:'shipped',fulfiller:'printify',fulfiller_order_id:body.data.id,shipped_at:new Date().toISOString()}).eq('razorpay_order_id',body.data.external_id)
        } catch { /* no-op */ }
      }
    }
    return NextResponse.json({ok:true})
  } catch { return NextResponse.json({ ok: false }, { status: 400 }) }
}
