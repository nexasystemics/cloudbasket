import { NextRequest, NextResponse } from 'next/server'
import { smsSubscribeSchema, zodError } from '@/lib/validation'

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = smsSubscribeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: zodError(parsed.error) }, { status: 400 })
  }

  return NextResponse.json({ ok: true, mobile: `+91${parsed.data.mobile}` })
}
