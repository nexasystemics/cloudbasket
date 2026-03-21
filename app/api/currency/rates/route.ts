import { NextResponse } from 'next/server'
import { getExchangeRates } from '@/services/currency/exchange-rates'
export async function GET() { return NextResponse.json(await getExchangeRates()) }