// services/currency/exchange-rates.ts
// Live exchange rates from open.er-api.com — free, no key required.
let cache: { data: any; expiry: number } | null = null
export async function getExchangeRates(): Promise<{ base: 'INR'; rates: Record<string, number>; timestamp: Date }> {
  if (cache && cache.expiry > Date.now()) return cache.data
  try { const r = await fetch('https://open.er-api.com/v6/latest/INR', { next: { revalidate: 3600 } }); if (!r.ok) throw new Error(); const j = await r.json(); const data = { base: 'INR' as const, rates: j.rates, timestamp: new Date() }; cache = { data, expiry: Date.now() + 3600000 }; return data } catch { return { base: 'INR', rates: { USD: 0.012, GBP: 0.0095, EUR: 0.011, AED: 0.044, SGD: 0.016 }, timestamp: new Date() } }
}
export async function convertPrice(amountINR: number, targetCurrency: string): Promise<number> { const { rates } = await getExchangeRates(); const rate = rates[targetCurrency]; return rate ? Math.round(amountINR * rate * 100) / 100 : amountINR }
export function formatPrice(amount: number, currency: string, locale = 'en-IN'): string { try { return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount) } catch { return `${currency} ${amount}` } }

