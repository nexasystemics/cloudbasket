import { NextRequest, NextResponse } from 'next/server'
import { seoUpdater } from '@/services/content/seo-updater'
import { env } from '@/lib/env'

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('x-internal-api-key')
  if (env.INTERNAL_API_KEY && apiKey !== env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json(await seoUpdater.auditSEOHealth())
}