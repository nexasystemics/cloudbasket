// Estimated: ~60 lines
export type IndiaCategory = 'personal-care' | 'home-appliances' | 'electronics' | 'fashion' | 'food-grocery'

export type AffiliatePlatform = 'amazon' | 'flipkart' | 'croma' | 'myntra' | 'ajio' | 'bigbasket' | 'reliance-digital'

export type AffiliateSource = 'amazon-pa-api' | 'flipkart-affiliate' | 'cj-network' | 'direct-link' | 'static'

export type APISource = 'amazon-pa-api-free' | 'flipkart-affiliate-free' | 'open-food-facts-free' | 'static-only' | 'cj-paid' | 'impact-paid'

export interface IndiaProduct {
  id: string                          // format: IN-{CAT}-{BRAND}-{NUM} e.g. IN-PC-HUL-001
  name: string                        // exact brand SKU name — no generic names
  brand: string                       // parent company name
  subBrand: string                    // product line name e.g. Dove, Vatika, Surf Excel
  category: IndiaCategory             // one of 5 main categories
  subCategory: string                 // one of 5 per category
  variant: string                     // size/colour/flavour/pack variant
  description: string
  price: number                       // INR
  originalPrice?: number              // INR before discount
  discount?: number                   // percentage
  image: string                       // placeholder path /assets/products/{id}.jpg
  affiliateUrl: string                // routed via /go/{id}
  affiliatePlatform: AffiliatePlatform
  affiliateSource: AffiliateSource
  inStock: boolean
  rating?: number
  reviewCount?: number
  tags: string[]
  isSponsored?: boolean
  isFeatured?: boolean
  isTrending?: boolean
  apiSource: APISource                // which API can pull live data
}
