import { NextRequest, NextResponse } from 'next/server'
import { associateProgram } from '@/services/associates/program'
import { rateLimit } from '@/lib/redis'
import { associatesApplySchema, zodError } from '@/lib/validation'

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

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = associatesApplySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: zodError(parsed.error) }, { status: 400 })
  }

  try {
    const result = await associateProgram.applyForProgram({
      name: parsed.data.name,
      email: parsed.data.email,
      websiteUrl: parsed.data.websiteUrl,
      platformType: 'website',
      niche: parsed.data.category || 'general',
    })
    return NextResponse.json(result)
  } catch (err) {
    console.error('[associates/apply] Error:', err)
    return NextResponse.json({ error: 'Application failed' }, { status: 500 })
  }
}
