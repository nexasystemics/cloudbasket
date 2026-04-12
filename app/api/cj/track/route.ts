import { NextRequest, NextResponse } from 'next/server'
import { cjAPI } from '@/services/apis/cj-api'
import { cjTrackSchema, zodError } from '@/lib/validation'

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = cjTrackSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: zodError(parsed.error) }, { status: 400 })
  }
  const { orderId, amount, advertiserId } = parsed.data

  try {
    cjAPI.trackCommission(orderId, amount, advertiserId)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[cj/track] Error:', err)
    return NextResponse.json({ error: 'Tracking failed' }, { status: 500 })
  }
}
