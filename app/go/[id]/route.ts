import { NextRequest, NextResponse } from 'next/server'
import { PRODUCTS } from '@/lib/mock-data'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id)
  const product = PRODUCTS.find((p) => p.id === id)

  if (!product) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 1. Log click in Supabase (Placeholder logic)
  console.log(`[CLICK LOG] Product: ${product.name}, ID: ${product.id}, Time: ${new Date().toISOString()}`)
  
  // 2. Resolve final affiliate URL with Admin/Associate tags
  // In a real app, you'd fetch the associate's tag from the user profile if 'ref' param exists
  const searchParams = request.nextUrl.searchParams
  const ref = searchParams.get('ref') || 'admin-default'
  
  const finalUrl = `${product.affiliateUrl}&cb_ref=${ref}`

  // 3. Perform high-speed redirect
  return NextResponse.redirect(finalUrl)
}
