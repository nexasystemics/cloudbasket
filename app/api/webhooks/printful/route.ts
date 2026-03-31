import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get('x-webhook-secret')
    if (!env.PRINTFUL_WEBHOOK_SECRET || secret !== env.PRINTFUL_WEBHOOK_SECRET) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }
    const body = await request.json()
    console.info('[Printful Webhook]', body?.type)
    return NextResponse.json({ok:true})
  } catch { return NextResponse.json({ ok: false }, { status: 400 }) }
}
