import { NextRequest, NextResponse } from 'next/server'
import { dealDiscovery } from '@/services/deals/auto-discovery'
import { env } from '@/lib/env'

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('x-internal-api-key')
  if (env.INTERNAL_API_KEY && apiKey !== env.INTERNAL_API_KEY) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const flipkartDeals = await dealDiscovery.discoverFromFlipkart()
    const curated = await dealDiscovery.curateDeals(flipkartDeals)
    await dealDiscovery.publishDeals(curated)
    return NextResponse.json({ discovered: flipkartDeals.length, curated: curated.length, autoApproved: curated.filter(d => d.autoApproved).length })
  } catch { return NextResponse.json({ error: 'Discovery failed' }, { status: 500 }) }
}