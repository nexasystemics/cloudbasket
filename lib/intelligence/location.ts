export type CityTier = 'tier1' | 'tier2' | 'tier3'
export type IndiaRegion = 'north' | 'south' | 'east' | 'west' | 'central' | 'northeast'
export type CountryContext = 'india' | 'global'

export interface LocationContext {
  tier: CityTier
  region: IndiaRegion | null
  countryContext: CountryContext
  signals: string[]
  currency: 'INR' | 'USD' | 'GBP' | 'AED'
  language: 'en' | 'hi' | 'te' | 'ta' | 'kn' | 'mr' | 'bn'
}

export function getLocationFromTimezone(): LocationContext {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    return inferFromTimezone(tz)
  } catch {
    return getDefaultLocation()
  }
}

function inferFromTimezone(tz: string): LocationContext {
  if (tz.includes('Calcutta') || tz.includes('Kolkata')) {
    return {
      tier: 'tier1',
      region: 'east',
      countryContext: 'india',
      currency: 'INR',
      language: 'bn',
      signals: ['east_india', 'metro', 'bengali_culture', 'sweets_culture'],
    }
  }
  if (tz.includes('Dubai') || tz.includes('Abu_Dhabi')) {
    return {
      tier: 'tier1',
      region: null,
      countryContext: 'global',
      currency: 'AED',
      language: 'en',
      signals: ['expat_indian', 'luxury_buyer', 'uae', 'high_income'],
    }
  }
  if (tz.includes('London')) {
    return {
      tier: 'tier1',
      region: null,
      countryContext: 'global',
      currency: 'GBP',
      language: 'en',
      signals: ['uk_indian_diaspora', 'global_brand_preference'],
    }
  }
  if (tz.includes('America')) {
    return {
      tier: 'tier1',
      region: null,
      countryContext: 'global',
      currency: 'USD',
      language: 'en',
      signals: ['us_market', 'high_income', 'tech_products'],
    }
  }

  return getDefaultLocation()
}

function getDefaultLocation(): LocationContext {
  return {
    tier: 'tier2',
    region: 'north',
    countryContext: 'india',
    currency: 'INR',
    language: 'en',
    signals: ['india', 'value_conscious', 'hindi_belt'],
  }
}

export function getLocationFromCookie(cookieStr: string): Partial<LocationContext> {
  try {
    const match = cookieStr.match(/cb_location=([^;]+)/)
    if (match) return JSON.parse(decodeURIComponent(match[1])) as Partial<LocationContext>
  } catch {
    return {}
  }
  return {}
}
