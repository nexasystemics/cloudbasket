import { NextRequest, NextResponse } from 'next/server'
import { sendPriceAlertEmail } from '@/lib/email/sendPriceAlert'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = await sendPriceAlertEmail(body)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
