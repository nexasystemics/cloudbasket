// ── Shared deals catalogue ────────────────────────────────────────────────────
export type DealPlatform = 'Amazon' | 'Flipkart'

export interface Deal {
  id: string
  name: string
  platform: DealPlatform
  originalPrice: string
  dealPrice: string
  priceValue: number
  discount: string
  discountNum: number
  rating: number
  reviews: string
  imageUrl: string
  dealType: string
  expiresIn: string
  stock: number
  totalStock: number
  description: string
  affiliateUrl: string
  category: string
}

export const DEALS: Deal[] = [
  {
    id: 'deal-1',
    name: 'Samsung 43" 4K Smart TV',
    platform: 'Amazon',
    originalPrice: '₹42,990',
    dealPrice: '₹28,999',
    priceValue: 28999,
    discount: '33% OFF',
    discountNum: 33,
    rating: 4.3,
    reviews: '8,421',
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=600&h=600&fit=crop',
    dealType: 'Lightning Deal',
    expiresIn: '2h 45m',
    stock: 23,
    totalStock: 100,
    description: 'Crystal Processor 4K, PurColor, HDR10+, Tizen Smart OS with built-in Alexa. 3 HDMI and 2 USB ports. Wall-mount ready.',
    affiliateUrl: 'https://www.amazon.in',
    category: 'Electronics',
  },
  {
    id: 'deal-2',
    name: 'Apple AirPods Pro (2nd Gen)',
    platform: 'Amazon',
    originalPrice: '₹24,900',
    dealPrice: '₹18,500',
    priceValue: 18500,
    discount: '26% OFF',
    discountNum: 26,
    rating: 4.7,
    reviews: '31,204',
    imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&h=600&fit=crop',
    dealType: 'Today Only',
    expiresIn: '11h 20m',
    stock: 67,
    totalStock: 200,
    description: 'Active Noise Cancellation up to 2x more powerful, Adaptive Transparency, Personalised Spatial Audio with head tracking, MagSafe charging case.',
    affiliateUrl: 'https://www.amazon.in',
    category: 'Electronics',
  },
  {
    id: 'deal-3',
    name: "Levi's Men's Slim Jeans",
    platform: 'Flipkart',
    originalPrice: '₹3,999',
    dealPrice: '₹1,599',
    priceValue: 1599,
    discount: '60% OFF',
    discountNum: 60,
    rating: 4.1,
    reviews: '12,840',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop',
    dealType: 'Fashion Deal',
    expiresIn: '5h 10m',
    stock: 45,
    totalStock: 150,
    description: "Levi's 511 Slim Fit in stretch denim. Sits below the waist, slim through thigh and leg. Available in multiple washes and waist sizes.",
    affiliateUrl: 'https://www.flipkart.com',
    category: 'Fashion',
  },
  {
    id: 'deal-4',
    name: 'Instant Pot Duo 7-in-1',
    platform: 'Amazon',
    originalPrice: '₹12,995',
    dealPrice: '₹7,499',
    priceValue: 7499,
    discount: '42% OFF',
    discountNum: 42,
    rating: 4.5,
    reviews: '6,732',
    imageUrl: 'https://images.unsplash.com/photo-1556911073-52527ac43761?w=600&h=600&fit=crop',
    dealType: 'Kitchen Deal',
    expiresIn: '8h 55m',
    stock: 12,
    totalStock: 50,
    description: 'Pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker and food warmer. 6-quart capacity. 13 customisable programmes.',
    affiliateUrl: 'https://www.amazon.in',
    category: 'Home',
  },
  {
    id: 'deal-5',
    name: 'Dyson V8 Cordless Vacuum',
    platform: 'Flipkart',
    originalPrice: '₹34,900',
    dealPrice: '₹24,999',
    priceValue: 24999,
    discount: '28% OFF',
    discountNum: 28,
    rating: 4.4,
    reviews: '3,156',
    imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&h=600&fit=crop',
    dealType: 'Lightning Deal',
    expiresIn: '1h 30m',
    stock: 8,
    totalStock: 30,
    description: 'Powerful suction, up to 40 minutes of run time, whole-machine filtration captures allergens and bacteria. Converts to handheld.',
    affiliateUrl: 'https://www.flipkart.com',
    category: 'Home',
  },
  {
    id: 'deal-6',
    name: 'Adidas Ultraboost Running Shoes',
    platform: 'Flipkart',
    originalPrice: '₹14,999',
    dealPrice: '₹8,999',
    priceValue: 8999,
    discount: '40% OFF',
    discountNum: 40,
    rating: 4.3,
    reviews: '5,891',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',
    dealType: 'Sports Deal',
    expiresIn: '6h 00m',
    stock: 34,
    totalStock: 100,
    description: 'Primeknit upper, BOOST midsole for incredible energy return, Continental rubber outsole. The world\'s best running shoe.',
    affiliateUrl: 'https://www.flipkart.com',
    category: 'Sports',
  },
  {
    id: 'deal-7',
    name: 'OnePlus 12R 5G 256GB',
    platform: 'Amazon',
    originalPrice: '₹39,999',
    dealPrice: '₹29,999',
    priceValue: 29999,
    discount: '25% OFF',
    discountNum: 25,
    rating: 4.5,
    reviews: '22,103',
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=600&fit=crop',
    dealType: 'Today Only',
    expiresIn: '9h 45m',
    stock: 156,
    totalStock: 500,
    description: 'Snapdragon 8 Gen 2, 50MP Sony IMX890 triple camera, 100W SUPERVOOC charging, 5000mAh battery, 6.78" 120Hz ProXDR display.',
    affiliateUrl: 'https://www.amazon.in',
    category: 'Mobiles',
  },
  {
    id: 'deal-8',
    name: 'Philips Trimmer BT3231',
    platform: 'Amazon',
    originalPrice: '₹1,995',
    dealPrice: '₹799',
    priceValue: 799,
    discount: '60% OFF',
    discountNum: 60,
    rating: 4.2,
    reviews: '44,876',
    imageUrl: 'https://images.unsplash.com/photo-1621607150972-b9ee85cd9b0d?w=600&h=600&fit=crop',
    dealType: 'Lightning Deal',
    expiresIn: '0h 55m',
    stock: 5,
    totalStock: 50,
    description: '11 length settings (1–11mm), DuraPower technology for 30% more battery efficiency, fully washable. 60-minute cordless runtime.',
    affiliateUrl: 'https://www.amazon.in',
    category: 'Beauty',
  },
]

export function getDealById(id: string): Deal | null {
  return DEALS.find((d) => d.id === id) ?? null
}
