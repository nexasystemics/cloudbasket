import { NextRequest, NextResponse } from 'next/server'
export async function POST(request: NextRequest) {
  try {
    const metrics = await request.json()
    if (process.env.NODE_ENV === 'development') console.log('[Vitals]', metrics)
    return NextResponse.json({ ok: true })
  } catch { return NextResponse.json({ ok: true }) }
}