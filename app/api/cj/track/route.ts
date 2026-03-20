import { NextRequest, NextResponse } from 'next/server'
import { cjAPI } from '@/services/apis/cj-api'

export async function POST(request: NextRequest) {
  try {
    const { orderId, amount, advertiserId } = await request.json()
    if (!orderId || !amount || !advertiserId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    cjAPI.trackCommission(orderId, amount, advertiserId)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Tracking failed' }, { status: 500 })
  }
}