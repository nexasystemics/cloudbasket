export const SUPPORTED_LOCALES = ['en-IN', 'en-US', 'en-GB'] as const
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: SupportedLocale = 'en-IN'

export type LocaleCurrencyInfo = {
  code: 'INR' | 'USD' | 'GBP'
  symbol: '₹' | '$' | '£'
  locale: SupportedLocale
}

export const CURRENCY_MAP: Record<SupportedLocale, LocaleCurrencyInfo> = {
  'en-IN': { code: 'INR', symbol: '₹', locale: 'en-IN' },
  'en-US': { code: 'USD', symbol: '$', locale: 'en-US' },
  'en-GB': { code: 'GBP', symbol: '£', locale: 'en-GB' },
}
