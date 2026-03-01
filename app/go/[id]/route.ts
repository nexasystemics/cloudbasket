import { NextRequest, NextResponse } from 'next/server'
import { PRODUCTS } from '@/lib/mock-data'

/**
 * Step 10: Sovereign Redirect Node
 * Ensures "Income Shield" logic is applied to every exit.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id)
  const product = PRODUCTS.find((p) => p.id === id)

  if (!product) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 1. Resolve Attribution Identity
  const searchParams = request.nextUrl.searchParams
  const associateRef = searchParams.get('ref') || 'admin-master'
  const campaign = searchParams.get('utm_campaign') || 'sovereign_audit'

  // 2. Platform-Specific Tag Injection Logic
  let finalUrl = product.affiliateUrl
  const urlObj = new URL(finalUrl)

  if (finalUrl.includes('amazon')) {
    urlObj.searchParams.set('tag', associateRef === 'admin-master' ? 'cloudbasket-21' : associateRef)
  } else if (finalUrl.includes('flipkart')) {
    urlObj.searchParams.set('affid', associateRef)
  } else {
    urlObj.searchParams.set('cb_ref', associateRef)
  }
  
  urlObj.searchParams.set('utm_source', 'cloudbasket')
  urlObj.searchParams.set('utm_medium', 'referral')
  urlObj.searchParams.set('utm_campaign', campaign)

  // 3. Sovereign Click Insurance Logging
  console.log(`[EXIT NODE] ID: ${id} | Platform: ${urlObj.hostname} | Ref: ${associateRef} | Time: ${new Date().toISOString()}`)

  // 4. Perform High-Speed Redirect
  return NextResponse.redirect(urlObj.toString())
}
