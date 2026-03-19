import { CURRENCY_MAP, DEFAULT_LOCALE, type SupportedLocale } from '@/lib/i18n/config'

export type ExchangeRates = {
  INR_USD: number
  INR_GBP: number
}

export const EXCHANGE_RATES: ExchangeRates = {
  INR_USD: 0.012,
  INR_GBP: 0.0095,
}

export function formatPrice(amount: number, locale: SupportedLocale = DEFAULT_LOCALE): string {
  const currencyInfo = CURRENCY_MAP[locale] || CURRENCY_MAP[DEFAULT_LOCALE]
  return new Intl.NumberFormat(currencyInfo.locale, {
    style: 'currency',
    currency: currencyInfo.code,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function convertPrice(
  amountINR: number,
  targetLocale: SupportedLocale,
  exchangeRates: ExchangeRates = EXCHANGE_RATES,
): number {
  if (targetLocale === 'en-IN') {
    return amountINR
  }

  if (targetLocale === 'en-US') {
    return amountINR * exchangeRates.INR_USD
  }

  if (targetLocale === 'en-GB') {
    return amountINR * exchangeRates.INR_GBP
  }

  return amountINR
}
