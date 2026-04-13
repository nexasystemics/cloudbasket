import { NextRequest, NextResponse } from 'next/server'
import { seoUpdater } from '@/services/content/seo-updater'
import { env } from '@/lib/env'
import { rateLimit } from '@/lib/redis'

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
  const limit = await rateLimit(ip, 30, 60)
  if (!limit.success) {
    return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })
  }

  const apiKey = request.headers.get('x-internal-api-key')
  if (!apiKey || apiKey !== env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json(await seoUpdater.auditSEOHealth())
}
