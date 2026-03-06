'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CBUser, CountryCode, CurrencyCode, Direction } from '@/lib/types'
import {
  CACHE_TTL,
  DEFAULT_COUNTRY,
  DEFAULT_CURRENCY,
  SUPPORTED_COUNTRIES,
} from '@/lib/constants'

interface ExchangeRates {
  INR: number
  USD: number
  EUR: number
  GBP: number
  [key: string]: number
}

interface GlobalContextType {
  country: CountryCode
  setCountry: (countryCode: CountryCode) => void
  currency: CurrencyCode
  setCurrency: (currencyCode: CurrencyCode) => void
  direction: Direction
  setDirection: (newDirection: Direction) => void
  user: CBUser | null
  setUser: (nextUser: CBUser | null) => void
  isReady: boolean
  rates: ExchangeRates
  convertPrice: (amount: number, to: CurrencyCode) => number
  formatPrice: (amount: number) => string
}

const COUNTRY_CURRENCY_MAP: Record<CountryCode, CurrencyCode> = {
  IN: 'INR',
  US: 'USD',
  EU: 'EUR',
  GB: 'GBP',
}

const DEFAULT_RATES: ExchangeRates = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
}

const LOCALE_BY_CURRENCY: Record<CurrencyCode, string> = {
  INR: 'en-IN',
  USD: 'en-US',
  EUR: 'en-EU',
  GBP: 'en-GB',
}

const GlobalContext = createContext<GlobalContextType | null>(null)

const isCountryCode = (value: string): value is CountryCode => value in SUPPORTED_COUNTRIES

const isCurrencyCode = (value: string): value is CurrencyCode => {
  return value === 'INR' || value === 'USD' || value === 'EUR' || value === 'GBP'
}

const isDirection = (value: string): value is Direction => value === 'ltr' || value === 'rtl'

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [country, setCountryState] = useState<CountryCode>(DEFAULT_COUNTRY)
  const [currency, setCurrencyState] = useState<CurrencyCode>(DEFAULT_CURRENCY)
  const [direction, setDirectionState] = useState<Direction>('ltr')
  const [user, setUser] = useState<CBUser | null>(null)
  const [isReady, setIsReady] = useState<boolean>(false)
  const [rates] = useState<ExchangeRates>(DEFAULT_RATES)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const savedCountry = window.localStorage.getItem('cb-country')
    const savedCurrency = window.localStorage.getItem('cb-currency')
    const savedDirection = window.localStorage.getItem('cb-dir')

    if (savedCountry !== null && isCountryCode(savedCountry)) {
      setCountryState(savedCountry)
    }

    if (savedCurrency !== null && isCurrencyCode(savedCurrency)) {
      setCurrencyState(savedCurrency)
    }

    if (savedDirection !== null && isDirection(savedDirection)) {
      setDirectionState(savedDirection)
      document.documentElement.dir = savedDirection
    }

    setIsReady(true)
  }, [])

  const setCountry = useCallback((countryCode: CountryCode) => {
    const nextCurrency = COUNTRY_CURRENCY_MAP[countryCode]
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('cb-country', countryCode)
      window.localStorage.setItem('cb-currency', nextCurrency)
    }
    setCountryState(countryCode)
    setCurrencyState(nextCurrency)
  }, [])

  const setCurrency = useCallback((currencyCode: CurrencyCode) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('cb-currency', currencyCode)
    }
    setCurrencyState(currencyCode)
  }, [])

  const setDirection = useCallback((newDirection: Direction) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('cb-dir', newDirection)
      document.documentElement.dir = newDirection
    }
    setDirectionState(newDirection)
  }, [])

  const convertPrice = useCallback(
    (amount: number, to: CurrencyCode): number => amount * rates[to],
    [rates],
  )

  const formatPrice = useCallback(
    (amount: number): string => {
      const locale = LOCALE_BY_CURRENCY[currency]
      const convertedAmount = convertPrice(amount, currency)

      try {
        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency,
          maximumFractionDigits: 2,
        }).format(convertedAmount)
      } catch {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency,
          maximumFractionDigits: 2,
        }).format(convertedAmount)
      }
    },
    [convertPrice, currency],
  )

  const contextValue = useMemo<GlobalContextType>(
    () => ({
      country,
      setCountry,
      currency,
      setCurrency,
      direction,
      setDirection,
      user,
      setUser,
      isReady,
      rates,
      convertPrice,
      formatPrice,
    }),
    [
      convertPrice,
      country,
      currency,
      direction,
      formatPrice,
      isReady,
      rates,
      setCountry,
      setCurrency,
      setDirection,
      user,
    ],
  )

  return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>
}

export function useGlobal(): GlobalContextType {
  const context = useContext(GlobalContext)
  if (context === null) {
    throw new Error('useGlobal must be used within GlobalProvider')
  }
  return context
}

export const EXCHANGE_RATES_CACHE_TTL = CACHE_TTL.EXCHANGE_RATES
