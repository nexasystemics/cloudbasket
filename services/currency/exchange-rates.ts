// services/currency/exchange-rates.ts
// Live exchange rates from open.er-api.com — free, no key required.
// Primary cache: Upstash Redis (shared across serverless instances, TTL 1 hour).
// Fallback: hardcoded static rates when both Redis and the external API are unavailable.
import { getCache, setCache } from '@/lib/redis'

type ExchangeRatePayload = { base: 'INR'; rates: Record<string, number> }
export type ExchangeRatesData = ExchangeRatePayload & { timestamp: string }

const CACHE_KEY = 'cb:cache:currency:INR'
const CACHE_TTL  = 3600 // seconds

const STATIC_FALLBACK: ExchangeRatesData = {
  base:      'INR',
  rates:     { USD: 0.012, GBP: 0.0095, EUR: 0.011, AED: 0.044, SGD: 0.016 },
  timestamp: new Date().toISOString(),
}

export async function getExchangeRates(): Promise<ExchangeRatesData> {
  // 1. Try distributed cache first (survives cold starts)
  const cached = await getCache<ExchangeRatePayload>(CACHE_KEY)
  if (cached) {
    return { ...cached, timestamp: new Date().toISOString() }
  }

  // 2. Fetch live rates
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/INR', {
      next: { revalidate: CACHE_TTL },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json() as { rates: Record<string, number> }
    const payload: ExchangeRatePayload = { base: 'INR', rates: json.rates }
    await setCache(CACHE_KEY, payload, CACHE_TTL)
    return { ...payload, timestamp: new Date().toISOString() }
  } catch {
    return STATIC_FALLBACK
  }
}

export async function convertPrice(amountINR: number, targetCurrency: string): Promise<number> {
  const { rates } = await getExchangeRates()
  const rate = rates[targetCurrency]
  return rate ? Math.round(amountINR * rate * 100) / 100 : amountINR
}

export function formatPrice(amount: number, currency: string, locale = 'en-IN'): string {
  try {
    return new Intl.NumberFormat(locale, {
      style:              'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `${currency} ${amount}`
  }
}
