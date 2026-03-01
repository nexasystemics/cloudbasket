'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CurrencyCode, getExchangeRates, ExchangeRates } from '@/lib/currency-service'

export type CountryCode = 'IN' | 'US' | 'EU' | 'GB';

interface GlobalContextType {
  country: CountryCode
  setCountry: (country: CountryCode) => void
  currency: CurrencyCode
  setCurrency: (currency: CurrencyCode) => void
  rates: ExchangeRates
  isReady: boolean
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

const COUNTRY_CURRENCY_MAP: Record<CountryCode, CurrencyCode> = {
  IN: 'INR',
  US: 'USD',
  EU: 'EUR',
  GB: 'GBP',
}

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [country, setCountry] = useState<CountryCode>('IN')
  const [currency, setCurrency] = useState<CurrencyCode>('INR')
  const [rates, setRates] = useState<ExchangeRates>({ INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0095 })
  const [isReady, setIsReady] = useState(false)

  // Initialize data
  useEffect(() => {
    async function init() {
      const latestRates = await getExchangeRates()
      setRates(latestRates)
      
      // Try to get from localStorage
      const savedCountry = localStorage.getItem('cb-user-country') as CountryCode
      const savedCurrency = localStorage.getItem('cb-user-currency') as CurrencyCode
      
      if (savedCountry) setCountry(savedCountry)
      if (savedCurrency) setCurrency(savedCurrency)
      
      setIsReady(true)
    }
    init()
  }, [])

  // Auto-sync currency when country changes (unless user manually overrides)
  const handleSetCountry = (newCountry: CountryCode) => {
    setCountry(newCountry)
    setCurrency(COUNTRY_CURRENCY_MAP[newCountry])
    localStorage.setItem('cb-user-country', newCountry)
    localStorage.setItem('cb-user-currency', COUNTRY_CURRENCY_MAP[newCountry])
  }

  const handleSetCurrency = (newCurrency: CurrencyCode) => {
    setCurrency(newCurrency)
    localStorage.setItem('cb-user-currency', newCurrency)
  }

  return (
    <GlobalContext.Provider
      value={{
        country,
        setCountry: handleSetCountry,
        currency,
        setCurrency: handleSetCurrency,
        rates,
        isReady,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export function useGlobal() {
  const context = useContext(GlobalContext)
  if (context === undefined) {
    throw new Error('useGlobal must be used within a GlobalProvider')
  }
  return context
}
