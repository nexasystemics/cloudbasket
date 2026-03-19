import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { email?: string; preferences?: Record<string, unknown> }
    const { email, preferences } = body

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ success: true, message: 'Subscribed (offline mode)' })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const { error } = await supabase.from('newsletter_subscribers').upsert({
      email,
      preferences: preferences ?? {},
      subscribed_at: new Date().toISOString(),
      unsubscribed_at: null,
    }, { onConflict: 'email' })

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to subscribe' }, { status: 500 })
  }
}