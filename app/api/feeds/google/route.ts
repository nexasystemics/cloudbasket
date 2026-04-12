import { NextRequest, NextResponse } from 'next/server'
import { INDIA_CATALOG } from '@/lib/india-catalog'
import { rateLimit } from '@/lib/redis'
const CAT: Record<string, string> = { electronics: '222', fashion: '1604', 'home-appliances': '604', 'personal-care': '567', 'food-grocery': '422', books: '784', sports: '990', toys: '1249' }
export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
  const rl = await rateLimit(ip, 60, 60)
  if (!rl.success) return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })

  const items = (INDIA_CATALOG as any[]).filter(p => p.inStock && p.image).slice(0, 1000).map(p => `  <item>\n    <g:id>${p.id}</g:id>\n    <g:title>${(p.name||'').replace(/&/g,'&amp;').slice(0,150)}</g:title>\n    <g:link>https://cloudbasket.in/product/${p.id}</g:link>\n    <g:image_link>${p.image}</g:image_link>\n    <g:condition>new</g:condition>\n    <g:availability>in stock</g:availability>\n    <g:price>${p.price} INR</g:price>\n    <g:brand>${p.brand}</g:brand>\n    <g:google_product_category>${CAT[p.category]||'222'}</g:google_product_category>\n  </item>`).join('\n')
  return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><rss xmlns:g="http://base.google.com/ns/1.0" version="2.0"><channel><title>CloudBasket</title><link>https://cloudbasket.in</link><description>India Price Comparison</description>\n${items}\n</channel></rss>`, { headers: { 'Content-Type': 'application/xml' } })
}
