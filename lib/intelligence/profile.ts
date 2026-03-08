import type { CalendarContext } from './calendar'
import type { LocationContext } from './location'

export interface UserProfile {
  viewedCategories: string[]
  searchHistory: string[]
  priceRange: 'budget' | 'mid' | 'premium' | 'luxury'
  clickedProducts: string[]
  sessionCount: number
  season: string
  activeFestivals: string[]
  lifeSituations: string[]
  locationSignals: string[]
  cityTier: string
  preferredCategories: string[]
  deviceType: 'mobile' | 'tablet' | 'desktop'
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  dayType: 'weekday' | 'weekend'
}

export function buildUserProfile(
  cookieStr: string,
  calendarCtx: CalendarContext,
  locationCtx: LocationContext,
): UserProfile {
  const viewedCategories = parseCookieArray(cookieStr, 'cb_cats')
  const searchHistory = parseCookieArray(cookieStr, 'cb_search')
  const clickedProducts = parseCookieArray(cookieStr, 'cb_clicks')
  const sessionCount = Number.parseInt(parseCookie(cookieStr, 'cb_sessions') ?? '1', 10)
  const priceRangeRaw = parseCookie(cookieStr, 'cb_price') as UserProfile['priceRange'] | null
  const priceRange = priceRangeRaw ?? inferPriceRange(locationCtx)

  const hour = new Date().getHours()
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : hour < 21 ? 'evening' : 'night'

  const day = new Date().getDay()
  const dayType = day === 0 || day === 6 ? 'weekend' : 'weekday'

  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
  const deviceType = /Mobile|Android|iPhone/i.test(ua)
    ? 'mobile'
    : /iPad|Tablet/i.test(ua)
      ? 'tablet'
      : 'desktop'

  const catFreq: Record<string, number> = {}
  viewedCategories.forEach((category) => {
    catFreq[category] = (catFreq[category] ?? 0) + 1
  })

  const preferredCategories = Object.entries(catFreq)
    .sort((a, b) => b[1] - a[1])
    .map(([category]) => category)

  return {
    viewedCategories,
    searchHistory,
    priceRange,
    clickedProducts,
    sessionCount,
    season: calendarCtx.season,
    activeFestivals: calendarCtx.festivals,
    lifeSituations: calendarCtx.lifeSituations,
    locationSignals: locationCtx.signals,
    cityTier: locationCtx.tier,
    preferredCategories,
    deviceType,
    timeOfDay,
    dayType,
  }
}

function inferPriceRange(loc: LocationContext): UserProfile['priceRange'] {
  if (loc.signals.includes('luxury_buyer') || loc.signals.includes('uae')) return 'luxury'
  if (loc.tier === 'tier1') return 'premium'
  if (loc.tier === 'tier2') return 'mid'
  return 'budget'
}

function parseCookieArray(cookieStr: string, key: string): string[] {
  try {
    const match = cookieStr.match(new RegExp(`${key}=([^;]+)`))
    if (match) return JSON.parse(decodeURIComponent(match[1])) as string[]
  } catch {
    return []
  }
  return []
}

function parseCookie(cookieStr: string, key: string): string | null {
  try {
    const match = cookieStr.match(new RegExp(`${key}=([^;]+)`))
    return match ? decodeURIComponent(match[1]) : null
  } catch {
    return null
  }
}
