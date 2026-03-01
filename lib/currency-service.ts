/**
 * currency-service.ts
 * Manages exchange rates and formatting for Global Scaling.
 */

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface ExchangeRates {
  [key: string]: number;
}

const DEFAULT_RATES: ExchangeRates = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
};

let cachedRates: ExchangeRates | null = null;
let lastFetch: number = 0;
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

export async function getExchangeRates(): Promise<ExchangeRates> {
  const now = Date.now();
  if (cachedRates && (now - lastFetch < CACHE_DURATION)) {
    return cachedRates;
  }

  try {
    // In a real production app, fetch from an API like fixer.io or openexchangerates.org
    // const response = await fetch('https://api.exchangerate-api.com/v4/latest/INR');
    // const data = await response.json();
    // cachedRates = data.rates;
    
    // For now, use high-fidelity mock data to ensure speed
    cachedRates = DEFAULT_RATES;
    lastFetch = now;
    return cachedRates;
  } catch (error) {
    console.error('Failed to fetch exchange rates, falling back to defaults', error);
    return DEFAULT_RATES;
  }
}

export function formatPrice(amount: number, currency: CurrencyCode, locale: string = 'en-IN'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function convertPrice(amount: number, toCurrency: CurrencyCode, rates: ExchangeRates): number {
  const rate = rates[toCurrency] || 1;
  return amount * rate;
}
