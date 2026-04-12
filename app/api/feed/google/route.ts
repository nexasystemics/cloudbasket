import { NextRequest, NextResponse } from 'next/server'
import { CATALOG } from '@/lib/intelligence/catalog'
import { rateLimit } from '@/lib/redis'

export const dynamic = 'force-dynamic'
export const revalidate = 86400
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cloudbasket.co'

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
  const rl = await rateLimit(ip, 60, 60)
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again shortly.' },
      { status: 429 },
    )
  }

  const items = CATALOG.slice(0, 500)
    .map(
      (product) => `
    <item>
      <g:id>${product.id}</g:id>
      <g:title>${escapeXML(product.name)}</g:title>
      <g:description>${escapeXML(product.description)}</g:description>
      <g:link>${BASE_URL}/product/${product.id}</g:link>
      <g:image_link>${escapeXML(product.image)}</g:image_link>
      <g:price>${product.price} INR</g:price>
      <g:sale_price>${product.price} INR</g:sale_price>
      <g:availability>in_stock</g:availability>
      <g:condition>new</g:condition>
      <g:brand>${escapeXML(product.brand)}</g:brand>
      <g:google_product_category>Electronics</g:google_product_category>
      <g:product_type>${escapeXML(product.category)}</g:product_type>
      ${product.badge ? `<g:custom_label_0>${escapeXML(product.badge)}</g:custom_label_0>` : ''}
    </item>`,
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>CloudBasket — Best Deals India</title>
    <link>${BASE_URL}</link>
    <description>Curated deals across Amazon, Flipkart and top Indian brands</description>
    ${items}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}

function escapeXML(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
