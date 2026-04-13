import { NextRequest, NextResponse } from 'next/server'
import { socialGenerator } from '@/services/social/content-generator'
import { getDailyDeals } from '@/lib/deals-engine'
import { env } from '@/lib/env'
import { rateLimit } from '@/lib/redis'
export async function POST(r: NextRequest) {
  const ip = r.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? r.headers.get('x-real-ip')
    ?? 'unknown'
  const rl = await rateLimit(ip, 10, 60)
  if (!rl.success) return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })

  const apiKey = r.headers.get('x-internal-api-key')
  if (!apiKey || apiKey !== env.INTERNAL_API_KEY) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const deals = getDailyDeals(5); if (!deals.length) return NextResponse.json({ posts: [] })
    const top = deals[0]
    const ig = await socialGenerator.generateInstagramCaption(top.title, top.dealPrice, top.discountPercent, top.brand)
    const tweets = socialGenerator.generateTweetThread(deals.map(d => ({ title: d.title, price: d.dealPrice, discount: d.discountPercent })))
    const wa = socialGenerator.generateWhatsAppStatus(top.title, top.discountPercent, top.dealPrice)
    return NextResponse.json({ posts: [ig, ...tweets, { id: `wa-${Date.now()}`, platform: 'whatsapp', content: wa, status: 'draft', generatedAt: new Date() }] })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
