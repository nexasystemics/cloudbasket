import { NextRequest, NextResponse } from 'next/server'
import { ugcPostSchema, zodError } from '@/lib/validation'
import { rateLimit } from '@/lib/redis'

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
  const rl = await rateLimit(ip, 10, 60)
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = ugcPostSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: zodError(parsed.error) }, { status: 400 })
  }

  try {
    return NextResponse.json({
      ok: true,
      id: Math.random().toString(36).substring(2),
      status: 'pending',
    })
  } catch (err) {
    console.error('[ugc] POST error:', err)
    return NextResponse.json({ error: 'Failed to submit content' }, { status: 500 })
  }
}
