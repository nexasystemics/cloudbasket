import { NextRequest, NextResponse } from 'next/server'
import { AFFILIATE_TAGS, INCOME_SHIELD_BASE } from '@/lib/constants'

const AFFILIATE_DOMAINS: Record<string, string> = {
  amazon: 'https://www.amazon.in',
  flipkart: 'https://www.flipkart.com',
  cj: 'https://www.cj.com',
}

const DEMO_PRODUCTS: Record<string, string> = {
  'demo-id': `${AFFILIATE_DOMAINS.amazon}?tag=${AFFILIATE_TAGS.AMAZON}`,
  'demo-mobile': `${AFFILIATE_DOMAINS.amazon}/s?k=smartphones&tag=${AFFILIATE_TAGS.AMAZON}`,
  'demo-laptop': `${AFFILIATE_DOMAINS.flipkart}/laptops`,
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params

    if (typeof id !== 'string' || id.trim().length === 0) {
      return NextResponse.redirect(new URL('/not-found', request.url), { status: 302 })
    }

    const normalizedId = id.trim()

    if (normalizedId in DEMO_PRODUCTS) {
      const demoUrl = DEMO_PRODUCTS[normalizedId]
      if (!demoUrl.startsWith('https://')) {
        return NextResponse.redirect(new URL('/not-found', request.url), { status: 302 })
      }
      console.log('[Income Shield]', `${INCOME_SHIELD_BASE}/${normalizedId}`, '→', demoUrl)
      return NextResponse.redirect(demoUrl, { status: 302 })
    }

    const [sourceRaw, ...productParts] = normalizedId.split('-')
    const source = sourceRaw?.toLowerCase()
    const productId = productParts.join('-').trim()

    if (!(source in AFFILIATE_DOMAINS) || productId.length === 0) {
      return NextResponse.redirect(new URL('/not-found', request.url), { status: 302 })
    }

    let affiliateUrl = ''

    if (source === 'amazon') {
      affiliateUrl = `${AFFILIATE_DOMAINS.amazon}/dp/${encodeURIComponent(productId)}?tag=${AFFILIATE_TAGS.AMAZON}`
    } else if (source === 'flipkart') {
      affiliateUrl = `${AFFILIATE_DOMAINS.flipkart}/product/${encodeURIComponent(productId)}?affid=${AFFILIATE_TAGS.FLIPKART}`
    } else if (source === 'cj') {
      affiliateUrl = `${AFFILIATE_DOMAINS.cj}/product/${encodeURIComponent(productId)}?affid=${AFFILIATE_TAGS.CJ}`
    }

    if (!affiliateUrl.startsWith('https://')) {
      return NextResponse.redirect(new URL('/not-found', request.url), { status: 302 })
    }

    console.log('[Income Shield]', `${INCOME_SHIELD_BASE}/${normalizedId}`, '→', affiliateUrl)
    return NextResponse.redirect(affiliateUrl, { status: 302 })
  } catch {
    return NextResponse.redirect(new URL('/not-found', request.url), { status: 302 })
  }
}
