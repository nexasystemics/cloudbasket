import { NextRequest, NextResponse } from 'next/server'
import { notifyZapierNewOrder, notifyZapierNewSignup } from '@/lib/automation/zapier'
import { env } from '@/lib/env'

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-internal-api-key')
    if (!env.INTERNAL_API_KEY || apiKey !== env.INTERNAL_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { event, data } = await request.json()
    if (!event || typeof event !== 'string') return NextResponse.json({ error: 'event required' }, { status: 400 })

    if (event === 'new_order') {
      await notifyZapierNewOrder(data)
      return NextResponse.json({ ok: true })
    }

    if (event === 'new_signup') {
      await notifyZapierNewSignup(data)
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Unsupported event' }, { status: 400 })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
