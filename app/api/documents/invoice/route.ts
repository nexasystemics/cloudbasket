// © 2026 NEXQON HOLDINGS — CloudBasket route.ts
import { NextRequest, NextResponse } from 'next/server'
import { generateInvoiceHTML } from '@/lib/documents/pdf-generator'
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    if (!data.orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 })
    const html = generateInvoiceHTML({ ...data, date: new Date().toLocaleDateString('en-IN') })
    return new NextResponse(html, { headers: { 'Content-Type': 'text/html', 'Content-Disposition': `attachment; filename="invoice-${data.orderId}.html"` } })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
