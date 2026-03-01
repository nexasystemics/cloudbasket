'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CurrencyCode, getExchangeRates, ExchangeRates } from '@/lib/currency-service'

export type CountryCode = 'IN' | 'US' | 'EU' | 'GB';
export type Direction = 'ltr' | 'rtl';

interface User {
  id: string;
  email: string;
  role: 'Admin' | 'Associate' | 'User';
}

interface GlobalContextType {
  country: CountryCode
  setCountry: (country: CountryCode) => void
  currency: CurrencyCode
  setCurrency: (currency: CurrencyCode) => void
  rates: ExchangeRates
  direction: Direction
  setDirection: (dir: Direction) => void
  user: User | null
  setUser: (user: User | null) => void
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
  const [direction, setDirection] = useState<Direction>('ltr')
  const [user, setUser] = useState<User | null>(null) // Real app would fetch from Supabase
  const [rates, setRates] = useState<ExchangeRates>({ INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0095 })
  const [isReady, setIsReady] = useState(false)

  // Initialize data
  useEffect(() => {
    async function init() {
      const latestRates = await getExchangeRates()
      setRates(latestRates)
      
      const savedCountry = localStorage.getItem('cb-user-country') as CountryCode
      const savedCurrency = localStorage.getItem('cb-user-currency') as CurrencyCode
      const savedDir = localStorage.getItem('cb-user-dir') as Direction
      
      if (savedCountry) setCountry(savedCountry)
      if (savedCurrency) setCurrency(savedCurrency)
      if (savedDir) setDirection(savedDir)
      
      // Update HTML dir attribute
      document.documentElement.dir = savedDir || 'ltr'
      
      setIsReady(true)
    }
    init()
  }, [])

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

  const handleSetDirection = (newDir: Direction) => {
    setDirection(newDir)
    document.documentElement.dir = newDir
    localStorage.setItem('cb-user-dir', newDir)
  }

  return (
    <GlobalContext.Provider
      value={{
        country,
        setCountry: handleSetCountry,
        currency,
        setCurrency: handleSetCurrency,
        rates,
        direction,
        setDirection: handleSetDirection,
        user,
        setUser,
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
