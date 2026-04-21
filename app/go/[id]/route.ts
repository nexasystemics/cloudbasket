import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const AMAZON_BASE     = 'https://www.amazon.in'
const FLIPKART_BASE   = 'https://www.flipkart.com'
const CJ_BASE         = 'https://www.tkqlhce.com'
const VCOMMISSION_BASE = 'https://www.vcommission.com'

// ── Supabase client (service role — bypasses RLS for logging) ─────────
// Fails silently if keys not yet set by IBF — redirect still works
function getSupabase() {
  const url   = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key   = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, {
    auth: { persistSession: false },
  })
}

// ── Log click to attributed_clicks table ─────────────────────────────
async function logClick(data: {
  platform:    string
  target_id:   string
  destination: string
}) {
  try {
    const supabase = getSupabase()
    if (!supabase) return // Supabase keys not set yet — skip silently

    const { error } = await supabase.from('attributed_clicks').insert({
      product_id: data.target_id,
      platform:   data.platform,
      page_url:   data.destination,
      clicked_at: new Date().toISOString(),
    })

    if (error) {
      // Log error but never let it block the redirect
      console.error('[go/route] Click log failed:', error.message)
    }
  } catch (err) {
    // Fail open — redirect must always work even if logging breaks
    console.error('[go/route] Click log exception:', err)
  }
}

// ── GET handler ───────────────────────────────────────────────────────
export async function GET(
  request: NextRequest,
  context: { params: Promise<unknown> },
): Promise<NextResponse> {

  const amazonTag      = process.env.AMAZON_ASSOCIATE_TAG  ?? 'cloudbasket-21'
  const flipkartAffid  = process.env.FLIPKART_AFFID        ?? 'cb-flipkart-pending'
  const vcommissionId  = process.env.VCOMMISSION_ID        ?? 'cb-vcm-pending'
  const cjPublisherId  = process.env.CJ_PUBLISHER_ID       ?? 'cb-cj-pending'

  const { id } = (await context.params) as { id?: string }

  let normalizedId: string
  try {
    normalizedId = decodeURIComponent(id ?? '').trim()
  } catch {
    return NextResponse.redirect(new URL('/not-found', request.url), { status: 302 })
  }

  if (!normalizedId) {
    return NextResponse.redirect(new URL('/not-found', request.url), { status: 302 })
  }

  // ── Parse platform prefix and target ─────────────────────────────
  const [prefixRaw, ...targetParts] = normalizedId.split('-')
  const prefix   = prefixRaw.toLowerCase()
  const targetId = targetParts.join('-').trim()

  // ── Amazon ────────────────────────────────────────────────────────
  if (prefix === 'amazon' && targetId) {
    const destination = `${AMAZON_BASE}/dp/${encodeURIComponent(targetId)}?tag=${encodeURIComponent(amazonTag)}`

    // Fire-and-forget — do not await, redirect immediately
    void logClick({ platform: 'amazon', target_id: targetId, destination })

    return NextResponse.redirect(destination, { status: 302 })
  }

  // ── Flipkart ──────────────────────────────────────────────────────
  if (prefix === 'flipkart' && targetId) {
    const destination = `${FLIPKART_BASE}/search?q=${encodeURIComponent(targetId)}&affid=${encodeURIComponent(flipkartAffid)}`

    void logClick({ platform: 'flipkart', target_id: targetId, destination })

    return NextResponse.redirect(destination, { status: 302 })
  }

  // ── CJ (Commission Junction) ──────────────────────────────────────
  if (prefix === 'cj' && targetId) {
    const destination = `${CJ_BASE}/click-${encodeURIComponent(targetId)}?publisher=${encodeURIComponent(cjPublisherId)}`

    void logClick({ platform: 'cj', target_id: targetId, destination })

    return NextResponse.redirect(destination, { status: 302 })
  }

  // ── POD ───────────────────────────────────────────────────────────
  if (prefix === 'pod' && targetId) {
    const destination = new URL('/pod', request.url).toString()

    void logClick({ platform: 'pod', target_id: targetId, destination })

    return NextResponse.redirect(destination, { status: 302 })
  }

  // ── VCommission ───────────────────────────────────────────────────
  if (prefix === 'vcm' && targetId) {
    const destination = `${VCOMMISSION_BASE}/track/${encodeURIComponent(targetId)}?id=${encodeURIComponent(vcommissionId)}`

    void logClick({ platform: 'vcommission', target_id: targetId, destination })

    return NextResponse.redirect(destination, { status: 302 })
  }

  // ── Fallback — Amazon search ──────────────────────────────────────
  const fallback = `${AMAZON_BASE}/s?k=${encodeURIComponent(normalizedId)}&tag=${encodeURIComponent(amazonTag)}`

  void logClick({ platform: 'amazon_fallback', target_id: normalizedId, destination: fallback })

  return NextResponse.redirect(fallback, { status: 302 })
}
