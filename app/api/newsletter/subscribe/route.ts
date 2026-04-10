import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { rateLimit } from '@/lib/redis'

const newsletterSubscribeSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.').max(254, 'Email must be 254 characters or fewer.'),
  preferences: z.record(z.string(), z.unknown()).optional(),
}).strict()

type NewsletterSubscribePayload = z.infer<typeof newsletterSubscribeSchema>
type NewsletterSubscribeField = keyof NewsletterSubscribePayload
type NewsletterSubscribeFieldErrors = Partial<Record<NewsletterSubscribeField, string>>

function getRequestIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
}

function getFieldErrors(error: z.ZodError<NewsletterSubscribePayload>): NewsletterSubscribeFieldErrors {
  const fieldErrors: NewsletterSubscribeFieldErrors = {}
  const flattened = error.flatten().fieldErrors

  if (flattened.email?.[0]) {
    fieldErrors.email = flattened.email[0]
  }

  if (flattened.preferences?.[0]) {
    fieldErrors.preferences = flattened.preferences[0]
  }

  return fieldErrors
}

export async function POST(request: NextRequest) {
  const ip = getRequestIp(request)
  const limit = await rateLimit(ip, 10, 60)
  if (!limit.success) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again shortly.' },
      { status: 429 },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = newsletterSubscribeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: 'Please correct the highlighted fields.',
        fieldErrors: getFieldErrors(parsed.error),
      },
      { status: 400 },
    )
  }
  const { email, preferences } = parsed.data

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ success: true, message: 'Subscribed (offline mode)' })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { error } = await supabase.from('newsletter_subscribers').upsert({
      email,
      preferences: preferences ?? {},
      subscribed_at: new Date().toISOString(),
      unsubscribed_at: null,
    }, { onConflict: 'email' })

    if (error) {
      console.error('[newsletter/subscribe] DB error:', error.message)
      return NextResponse.json(
        { success: false, error: 'Failed to subscribe.' },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[newsletter/subscribe] Unexpected error:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe.' },
      { status: 500 },
    )
  }
}
