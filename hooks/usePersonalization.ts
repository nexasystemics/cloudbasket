'use client'

import { useEffect, useState } from 'react'
import { getCalendarContext } from '@/lib/intelligence/calendar'
import { CATALOG } from '@/lib/intelligence/catalog'
import { getLocationFromTimezone } from '@/lib/intelligence/location'
import { buildUserProfile, type UserProfile } from '@/lib/intelligence/profile'
import { personalizeProducts, type ScoredProduct } from '@/lib/intelligence/scorer'

export interface PersonalizationState {
  products: ScoredProduct[]
  profile: UserProfile | null
  isLoading: boolean
  seasonLabel: string
  festivalLabel: string | null
}

export function usePersonalization(count: number = 48): PersonalizationState {
  const [state, setState] = useState<PersonalizationState>({
    products: [],
    profile: null,
    isLoading: true,
    seasonLabel: '',
    festivalLabel: null,
  })

  useEffect(() => {
    try {
      const cookieStr = document.cookie
      const location = getLocationFromTimezone()
      const calendar = getCalendarContext()
      const profile = buildUserProfile(cookieStr, calendar, location)
      const products = personalizeProducts(CATALOG, profile, count)

      const seasonNames: Record<string, string> = {
        summer: '☀️ Summer Picks',
        monsoon: '🌧️ Monsoon Must-Haves',
        winter: '❄️ Winter Essentials',
        spring: '🌸 Spring Collection',
      }

      const nextFest = calendar.festivals[0]
      const festLabels: Record<string, string> = {
        holi: '🎨 Holi is coming — Festival picks for you',
        diwali: '🪔 Diwali Dhamaka — Best prices now',
        dussehra: '🏹 Dussehra Special Deals',
        christmas: '🎄 Christmas Sale is Live',
        pongal: '🌾 Pongal — South India Specials',
        navratri: '🪔 Navratri Collection is Here',
        raksha_bandhan: '🪢 Rakhi Gifts — Express Delivery',
        school_opening: '📚 School Season — Best Study Deals',
        wedding_season: '💍 Wedding Season — Shop the Looks',
        valentines_day: '❤️ Valentine\'s Day — Gift Ideas',
        mothers_day: '💐 Mother\'s Day Gifts',
        fathers_day: '🧔 Father\'s Day — Best Picks',
        independence_day: '🇮🇳 Independence Day Sale',
      }

      setState({
        products,
        profile,
        isLoading: false,
        seasonLabel: seasonNames[calendar.season] ?? '',
        festivalLabel: nextFest ? (festLabels[nextFest] ?? null) : null,
      })

      const sessions = (Number.parseInt(document.cookie.match(/cb_sessions=(\d+)/)?.[1] ?? '0', 10) || 0) + 1
      document.cookie = `cb_sessions=${sessions}; max-age=31536000; path=/`
    } catch (error) {
      console.error('Personalization error:', error)
      setState((prev) => ({
        ...prev,
        isLoading: false,
        products: CATALOG.slice(0, count).map((product) => ({
          ...product,
          personalScore: 0,
          matchReasons: [],
        })),
      }))
    }
  }, [count])

  return state
}
