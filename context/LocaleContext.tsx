'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { CURRENCY_MAP, DEFAULT_LOCALE, type SupportedLocale } from '@/lib/i18n/config'
import { convertPrice as convertPriceHelper, formatPrice as formatPriceHelper, type ExchangeRates, EXCHANGE_RATES } from '@/lib/i18n/currency'

interface LocaleContextType {
  locale: SupportedLocale
  setLocale: (nextLocale: SupportedLocale) => void
  currency: string
  formatPrice: (amountINR: number) => string
  convertPrice: (amountINR: number) => number
  exchangeRates: ExchangeRates
}

const LocaleContext = createContext<LocaleContextType | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(DEFAULT_LOCALE)
  const [exchangeRates] = useState<ExchangeRates>(EXCHANGE_RATES)

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const saved = window.localStorage.getItem('cb_locale') as SupportedLocale | null
      if (saved && Object.keys(CURRENCY_MAP).includes(saved)) {
        setLocaleState(saved)
      }
    } catch {
      // No-op
    }
  }, [])

  const setLocale = useCallback((nextLocale: SupportedLocale) => {
    setLocaleState(nextLocale)
    if (typeof window === 'undefined') return

    try {
      window.localStorage.setItem('cb_locale', nextLocale)
    } catch {
      // No-op
    }
  }, [])

  const convertPrice = useCallback(
    (amountINR: number): number => convertPriceHelper(amountINR, locale, exchangeRates),
    [exchangeRates, locale],
  )

  const formatPrice = useCallback(
    (amountINR: number): string => {
      const converted = convertPrice(amountINR)
      return formatPriceHelper(converted, locale)
    },
    [convertPrice, locale],
  )

  const currency = useMemo(() => CURRENCY_MAP[locale].code, [locale])

  const value = useMemo<LocaleContextType>(() => ({
    locale,
    setLocale,
    currency,
    formatPrice,
    convertPrice,
    exchangeRates,
  }), [currency, convertPrice, exchangeRates, formatPrice, locale, setLocale])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextType {
  const context = useContext(LocaleContext)
  if (context === null) {
    throw new Error('useLocale must be used within LocaleProvider')
  }
  return context
}
