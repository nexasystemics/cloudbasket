// Estimated: ~60 lines
export type IndiaCategory = 'personal-care' | 'home-appliances' | 'electronics' | 'fashion' | 'food-grocery' | 'sports' | 'toys' | 'books'
export type AffiliatePlatform = 'amazon' | 'flipkart' | 'croma' | 'myntra' | 'ajio' | 'bigbasket' | 'reliance-digital'
export type AffiliateSource = 'amazon-pa-api' | 'flipkart-affiliate' | 'cj-network' | 'direct-link' | 'static' | 'amazon-pa-api-free' | 'flipkart-affiliate-free'
export type APISource = 'amazon-pa-api-free' | 'flipkart-affiliate-free' | 'open-food-facts-free' | 'static-only' | 'static' | 'cj-paid' | 'impact-paid'
export interface IndiaProduct {
  id: string
  name: string
  brand: string
  subBrand: string
  category: IndiaCategory
  subCategory: string
  variant: string
  description: string
  price: number
  originalPrice?: number
  discount?: number
  image: string
  affiliateUrl: string
  affiliatePlatform: AffiliatePlatform
  affiliateSource: AffiliateSource
  inStock: boolean
  rating?: number
  reviewCount?: number
  tags: string[]
  isSponsored?: boolean
  isFeatured?: boolean
  isTrending?: boolean
  apiSource: APISource
}
