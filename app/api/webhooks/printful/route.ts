import { NextRequest, NextResponse } from 'next/server'
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.info('[Printful Webhook]', body?.type)
    return NextResponse.json({ok:true})
  } catch { return NextResponse.json({ok:true}) }
}