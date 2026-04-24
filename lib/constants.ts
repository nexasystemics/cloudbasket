export const SITE_NAME = 'CloudBasket'
export const SITE_URL = 'https://cloudbasket.co'
export const SITE_DESCRIPTION = "Compare Prices. Discover Deals. Shop Smarter."
export const SITE_TAGLINE = 'Know It. Find It. Get It.'

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
  'Beauty & Care',
  'Books',
  'Electronics',
  'Fashion',
  'Finance',
  'Food & Grocery',
  'Gaming',
  'Health',
  'Home & Kitchen',
  'Investments',
  'Jewellery',
  'Kids & Toys',
  'Laptops & PCs',
  'Mobiles',
  'Music',
  'Online Courses',
  'Print on Demand',
  'Sports',
  'Travel & Hotels',
  'Watches',
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
