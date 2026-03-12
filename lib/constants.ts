export const SITE_NAME = 'CloudBasket'
export const SITE_URL = 'https://cloudbasket.in'
export const SITE_DESCRIPTION = "The World's Smartest Price Aggregator"
export const SITE_TAGLINE = 'Discover. Compare. Save.'

export const AFFILIATE_TAGS = {
  AMAZON: 'cloudbasket-21',
  FLIPKART: 'cloudbasket_fk',
  CJ: 'cloudbasket_cj',
} as const

export const SUPPORTED_CURRENCIES = ['INR', 'USD', 'EUR', 'GBP'] as const
export const DEFAULT_CURRENCY = 'INR' as const
export const DEFAULT_COUNTRY = 'IN' as const
export const DEFAULT_LOCALE = 'en-IN' as const

export const SUPPORTED_COUNTRIES = {
  IN: { name: 'India', currency: 'INR', locale: 'en-IN', flag: 'IN' },
  US: { name: 'United States', currency: 'USD', locale: 'en-US', flag: 'US' },
  EU: { name: 'Europe', currency: 'EUR', locale: 'en-EU', flag: 'EU' },
  GB: { name: 'United Kingdom', currency: 'GBP', locale: 'en-GB', flag: 'GB' },
} as const

export const ROUTES = {
  HOME: '/',
  CATEGORIES: '/categories',
  PRODUCTS: '/products',
  DEALS: '/deals',
  POD: '/pod',
  COMPARE: '/compare',
  TRACK: '/track',
  ADMIN: '/admin',
  ASSOCIATES: '/associates',
  BLOG: '/blog',
  ABOUT: '/about',
  CONTACT: '/contact',
  PRIVACY: '/legal/privacy',
  TERMS: '/legal/terms',
  AFFILIATE: '/affiliate-disclosure',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
} as const

export const MAIN_CATEGORIES = [
  'Automotive',
  'Beauty',
  'Books',
  'Electronics',
  'Fashion',
  'Finance',
  'Gaming',
  'Grocery',
  'Health',
  'Home',
  'Laptops',
  'Mobiles',
  'POD',
  'Sports',
  'Toys',
  'Travel',
  'Watches',
  'Jewellery',
  'Courses',
  'Investments',
] as const

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const

export const CACHE_TTL = {
  PRICES: 3600,
  EXCHANGE_RATES: 86400,
  PRODUCTS: 1800,
} as const

export const INCOME_SHIELD_BASE = '/go' as const
export const REDIRECT_STATUS = 302 as const
