// © 2026 NEXQON HOLDINGS — CloudBasket route.ts
import { NextRequest, NextResponse } from 'next/server'
import { generateInvoiceHTML } from '@/lib/documents/pdf-generator'
import { rateLimit } from '@/lib/redis'

function getRequestIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
}

export async function POST(request: NextRequest) {
  const ip = getRequestIp(request)
  const limit = await rateLimit(ip, 10, 60)
  if (!limit.success) {
    return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })
  }

  try {
    const data = await request.json()
    if (!data.orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 })
    const html = generateInvoiceHTML({ ...data, date: new Date().toLocaleDateString('en-IN') })
    return new NextResponse(html, { headers: { 'Content-Type': 'text/html', 'Content-Disposition': `attachment; filename="invoice-${data.orderId}.html"` } })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
