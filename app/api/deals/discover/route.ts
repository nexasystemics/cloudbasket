import { NextRequest, NextResponse } from 'next/server'
import { dealDiscovery } from '@/services/deals/auto-discovery'
import { env } from '@/lib/env'
export async function POST(r: NextRequest) {
  const apiKey = r.headers.get('x-internal-api-key')
  if (env.INTERNAL_API_KEY && apiKey !== env.INTERNAL_API_KEY) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const fk = await dealDiscovery.discoverFromFlipkart()
    const curated = await dealDiscovery.curateDeals(fk)
    await dealDiscovery.publishDeals(curated)
    return NextResponse.json({ discovered: fk.length, curated: curated.length, autoApproved: curated.filter(d => d.approved).length })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}