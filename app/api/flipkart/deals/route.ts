import { NextResponse } from 'next/server'
import { flipkartAPI } from '@/services/apis/flipkart-affiliate'

export async function GET() {
  const deals = await flipkartAPI.getDeals()
  return NextResponse.json({ deals, count: deals.length })
}