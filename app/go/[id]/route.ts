import { NextRequest, NextResponse } from 'next/server'

const AMAZON_BASE = 'https://www.amazon.in'
const FLIPKART_BASE = 'https://www.flipkart.com'
const CJ_BASE = 'https://www.tkqlhce.com'
const VCOMMISSION_BASE = 'https://www.vcommission.com'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const amazonTag = process.env.AMAZON_ASSOCIATE_TAG ?? 'cloudbasket-21'
  const flipkartAffid = process.env.FLIPKART_AFFID ?? 'cb-flipkart-pending'
  const vcommissionId = process.env.VCOMMISSION_ID ?? 'cb-vcm-pending'
  const cjPublisherId = process.env.CJ_PUBLISHER_ID ?? 'cb-cj-pending'

  const { id } = await params
  const normalizedId = decodeURIComponent(id ?? '').trim()

  if (!normalizedId) {
    return NextResponse.redirect(new URL('/not-found', request.url), { status: 302 })
  }

  const [prefixRaw, ...targetParts] = normalizedId.split('-')
  const prefix = prefixRaw.toLowerCase()
  const targetId = targetParts.join('-').trim()

  if (prefix === 'amazon' && targetId) {
    const destination = `${AMAZON_BASE}/dp/${encodeURIComponent(targetId)}?tag=${encodeURIComponent(amazonTag)}`
    return NextResponse.redirect(destination, { status: 302 })
  }

  if (prefix === 'flipkart' && targetId) {
    const destination = `${FLIPKART_BASE}/search?q=${encodeURIComponent(targetId)}&affid=${encodeURIComponent(
      flipkartAffid,
    )}`
    return NextResponse.redirect(destination, { status: 302 })
  }

  if (prefix === 'cj' && targetId) {
    const destination = `${CJ_BASE}/click-${encodeURIComponent(targetId)}?publisher=${encodeURIComponent(cjPublisherId)}`
    return NextResponse.redirect(destination, { status: 302 })
  }

  if (prefix === 'pod' && targetId) {
    return NextResponse.redirect(new URL('/pod', request.url), { status: 302 })
  }

  if (prefix === 'vcm' && targetId) {
    const destination = `${VCOMMISSION_BASE}/track/${encodeURIComponent(targetId)}?id=${encodeURIComponent(vcommissionId)}`
    return NextResponse.redirect(destination, { status: 302 })
  }

  const fallback = `${AMAZON_BASE}/s?k=${encodeURIComponent(normalizedId)}&tag=${encodeURIComponent(amazonTag)}`
  return NextResponse.redirect(fallback, { status: 302 })
}
