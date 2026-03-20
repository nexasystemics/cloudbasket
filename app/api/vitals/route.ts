import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, value, id, page } = body

    if (!name || value === undefined) {
      return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (supabaseUrl && supabaseKey) {
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(supabaseUrl, supabaseKey)
        await supabase.from('web_vitals').insert({
          metric_name: name,
          value: Math.round(value),
          page_url: page ?? '/',
          session_id: id,
          recorded_at: new Date().toISOString(),
        })
      } catch { /* no-op — metrics are not critical */ }
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}