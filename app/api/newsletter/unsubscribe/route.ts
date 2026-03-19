import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')
    if (!email) return NextResponse.redirect(new URL('/unsubscribed?error=1', request.url))

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