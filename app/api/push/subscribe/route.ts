import { NextRequest, NextResponse } from 'next/server'
import { pushSubscribeSchema, zodError } from '@/lib/validation'
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

  const parsed = pushSubscribeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: zodError(parsed.error) }, { status: 400 })
  }
  const { endpoint, keys, userId } = parsed.data

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
      const { error } = await sb.from('push_subscriptions').upsert({
        endpoint,
        p256dh_key: keys.p256dh,
        auth_key: keys.auth,
        user_id: userId,
        active: true,
        subscribed_at: new Date().toISOString(),
      }, { onConflict: 'endpoint' })
      if (error) {
        console.error('[push/subscribe] DB error:', error.message)
        return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 })
      }
    } catch (err) {
      console.error('[push/subscribe] Unexpected error:', err)
      return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 })
    }
  }

  return NextResponse.json({ ok: true })
}
