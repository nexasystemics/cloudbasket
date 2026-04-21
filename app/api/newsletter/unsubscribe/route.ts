import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { rateLimit } from '@/lib/redis'
import { emailSchema } from '@/lib/validation'

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
  const rl = await rateLimit(ip, 10, 60)
  if (!rl.success) {
    return NextResponse.redirect(new URL('/unsubscribed?error=1', request.url))
  }

  try {
    const rawEmail = request.nextUrl.searchParams.get('email') ?? ''
    const parsed = emailSchema.safeParse(rawEmail)
    if (!parsed.success) return NextResponse.redirect(new URL('/unsubscribed?error=1', request.url))
    const email = parsed.data

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey)
      await supabase.from('newsletter_subscribers').update({
        unsubscribed_at: new Date().toISOString()
      }).eq('email', email)
    }

    return NextResponse.redirect(new URL('/unsubscribed', request.url))
  } catch {
    return NextResponse.redirect(new URL('/unsubscribed?error=1', request.url))
  }
}
