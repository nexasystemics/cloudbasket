import { NextRequest, NextResponse } from 'next/server'
import { crossPlatformSync } from '@/services/pod/cross-platform-sync'
import { env } from '@/lib/env'

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('x-internal-api-key')
  if (env.INTERNAL_API_KEY && apiKey !== env.INTERNAL_API_KEY) return NextResponse.json({error:'Unauthorized'},{status:401})
  try {
    const {designId, platforms} = await request.json()
    if (!designId) return NextResponse.json({error:'Missing designId'},{status:400})
    const results = await crossPlatformSync.syncDesignToAllPlatforms(designId, platforms||['printify','amazon_merch','redbubble'])
    return NextResponse.json({results})
  } catch { return NextResponse.json({error:'Sync failed'},{status:500}) }
}