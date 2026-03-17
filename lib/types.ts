export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP'
export type CountryCode = 'IN' | 'US' | 'EU' | 'GB'
export type Direction = 'ltr' | 'rtl'
export type UserRole = 'Admin' | 'Associate' | 'User'
export type ProductStatus = 'Pending' | 'Approved' | 'Rejected'
export type AffiliateSource = 'Amazon' | 'Flipkart' | 'CJ' | 'Direct'

export interface CBUser {
  id: string
  email: string
  role: UserRole
  createdAt: string
}

export interface Product {
  id: number
  name: string
  slug: string
  price: number
  originalPrice: number | undefined // optional — may not be present in all catalog entries
  discount: number | undefined // optional — may not be present in all catalog entries
  description: string | undefined // optional — may not be present in all catalog entries
  mainCategory: string
  subCategory: string
  image: string | undefined // optional — may not be present in all catalog entries
  images: string[]
  brand: string | undefined // optional — may not be present in all catalog entries
  rating: number
  ratingValue?: number | undefined // optional — may not be present in all catalog entries
  reviewCount: number | undefined // optional — may not be present in all catalog entries
  stock: number
  warranty: string
  specs: Record<string, string>
  affiliateUrl: string
  source: AffiliateSource
  status: ProductStatus
  isFeatured: boolean
  isTrending: boolean
  createdAt: string
  affiliateSource?: string | undefined // optional — may not be present in all catalog entries
  prices?: { platform: string; price: number; url: string; badge?: string }[] // optional — may not be present in all catalog entries
}

export interface Deal {
  id: string
  productId: number
  title: string
  discount: number
  expiresAt: string
  isFlash: boolean
  badge: string | null
}

export interface ExchangeRates {
  INR: number
  USD: number
  EUR: number
  GBP: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface NavItem {
  id: string
  label: string
  href: string
  dropdown: { label: string; href: string }[]
}

export interface SiteConfig {
  name: string
  url: string
  description: string
  tagline: string
}
