// Shared product catalogue for the products grid.
// Data is static and intentionally normalized for category-brand consistency.

export type Platform =
  | 'Amazon'
  | 'Barnes & Noble'
  | 'Best Buy'
  | 'Dick Sporting Goods'
  | 'Flipkart'
  | 'Macys'
  | 'Sephora'
  | 'Target'
  | 'Walmart'
  | 'Zappos'

export type Category =
  | 'All'
  | 'Mobiles'
  | 'Laptops'
  | 'Fashion'
  | 'Home'
  | 'Cameras'
  | 'Gaming'
  | 'Electronics'
  | 'Footwear'
  | 'Books'
  | 'Beauty'
  | 'Sports'
  | 'Toys'

type CatalogCategory = Exclude<Category, 'All'>

export interface StoreListing {
  name: Platform
  price: string
  url: string
}

export interface Product {
  id: string
  name: string
  brand: string
  platform: Platform
  originalPrice: string
  discountedPrice: string
  priceValue: number
  rating: number
  reviews: string
  discountPercent: number
  category: Category
  imageUrl: string
  description: string
  tags: string[]
  inStock: boolean
  affiliateUrl: string
  stores: StoreListing[]
}

type StoreSeed = {
  name: Platform
  priceValue: number
  url: string
}

type ProductSeed = {
  id: string
  name: string
  brand: string
  originalPriceValue: number
  rating: number
  reviews: string
  category: CatalogCategory
  description: string
  tags: string[]
  affiliateUrl: string
  stores: readonly [StoreSeed, StoreSeed, ...StoreSeed[]]
}

export const CATEGORIES: readonly Category[] = [
  'All',
  'Mobiles',
  'Laptops',
  'Fashion',
  'Home',
  'Cameras',
  'Gaming',
  'Electronics',
  'Footwear',
  'Books',
  'Beauty',
  'Sports',
  'Toys',
]

function formatUsd(value: number): string {
  return `${value.toLocaleString('en-US')} USD`
}

function getCategoryImage(category: Category): string {
  switch (category) {
    case 'Mobiles':
      return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop'
    case 'Laptops':
      return 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop'
    case 'Fashion':
      return 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop'
    case 'Home':
      return 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&h=400&fit=crop'
    case 'Cameras':
      return 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop'
    case 'Gaming':
      return 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop'
    case 'Electronics':
      return 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop'
    case 'Footwear':
      return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'
    case 'Books':
      return 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop'
    case 'Beauty':
      return 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop'
    case 'Sports':
      return 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop'
    case 'Toys':
      return 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop'
    default:
      return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
  }
}

const RAW_PRODUCTS = [
  {
    id: 'mob-1',
    name: 'Samsung Galaxy S25',
    brand: 'Samsung',
    originalPriceValue: 799,
    rating: 4.6,
    reviews: '18,240',
    category: 'Mobiles',
    description: 'Flagship Android phone with a bright AMOLED panel, strong cameras, and reliable all-day battery life.',
    tags: ['5G', '256GB', 'AMOLED'],
    affiliateUrl: '/go/amazon-mob-1',
    stores: [
      { name: 'Amazon', priceValue: 699, url: '/go/amazon-mob-1' },
      { name: 'Best Buy', priceValue: 729, url: '/go/bestbuy-mob-1' },
    ],
  },
  {
    id: 'mob-2',
    name: 'Apple iPhone 16',
    brand: 'Apple',
    originalPriceValue: 929,
    rating: 4.8,
    reviews: '26,910',
    category: 'Mobiles',
    description: 'Balanced premium phone with excellent battery life, fast performance, and dependable camera output.',
    tags: ['128GB', 'A18', 'USB-C'],
    affiliateUrl: '/go/amazon-mob-2',
    stores: [
      { name: 'Amazon', priceValue: 829, url: '/go/amazon-mob-2' },
      { name: 'Best Buy', priceValue: 849, url: '/go/bestbuy-mob-2' },
    ],
  },
  {
    id: 'mob-3',
    name: 'OnePlus 13R',
    brand: 'OnePlus',
    originalPriceValue: 679,
    rating: 4.5,
    reviews: '11,430',
    category: 'Mobiles',
    description: 'Performance-led phone with a smooth display, fast charging, and premium everyday feel.',
    tags: ['120Hz', 'Fast Charging', '256GB'],
    affiliateUrl: '/go/amazon-mob-3',
    stores: [
      { name: 'Amazon', priceValue: 599, url: '/go/amazon-mob-3' },
      { name: 'Best Buy', priceValue: 619, url: '/go/bestbuy-mob-3' },
    ],
  },
  {
    id: 'mob-4',
    name: 'Xiaomi 14T Pro',
    brand: 'Xiaomi',
    originalPriceValue: 749,
    rating: 4.4,
    reviews: '9,780',
    category: 'Mobiles',
    description: 'Camera-focused flagship with fast silicon, vivid display tuning, and strong value for the segment.',
    tags: ['Leica', '5G', '120W'],
    affiliateUrl: '/go/amazon-mob-4',
    stores: [
      { name: 'Amazon', priceValue: 649, url: '/go/amazon-mob-4' },
      { name: 'Best Buy', priceValue: 669, url: '/go/bestbuy-mob-4' },
    ],
  },
  {
    id: 'lap-1',
    name: 'Dell XPS 13',
    brand: 'Dell',
    originalPriceValue: 1299,
    rating: 4.6,
    reviews: '4,860',
    category: 'Laptops',
    description: 'Compact premium ultraportable with strong battery life, solid build quality, and a sharp display.',
    tags: ['13-inch', '16GB RAM', '512GB SSD'],
    affiliateUrl: '/go/amazon-lap-1',
    stores: [
      { name: 'Amazon', priceValue: 1099, url: '/go/amazon-lap-1' },
      { name: 'Best Buy', priceValue: 1149, url: '/go/bestbuy-lap-1' },
    ],
  },
  {
    id: 'lap-2',
    name: 'HP Envy x360 14',
    brand: 'HP',
    originalPriceValue: 1099,
    rating: 4.4,
    reviews: '3,920',
    category: 'Laptops',
    description: 'Flexible 2-in-1 notebook with a responsive touchscreen and enough power for work and school.',
    tags: ['2-in-1', 'Touchscreen', 'Ryzen 7'],
    affiliateUrl: '/go/amazon-lap-2',
    stores: [
      { name: 'Amazon', priceValue: 949, url: '/go/amazon-lap-2' },
      { name: 'Best Buy', priceValue: 979, url: '/go/bestbuy-lap-2' },
    ],
  },
  {
    id: 'lap-3',
    name: 'Lenovo Yoga Slim 7i',
    brand: 'Lenovo',
    originalPriceValue: 1199,
    rating: 4.5,
    reviews: '5,230',
    category: 'Laptops',
    description: 'Thin productivity laptop with a bright panel, good keyboard, and dependable thermals.',
    tags: ['Core Ultra', '16GB RAM', 'OLED'],
    affiliateUrl: '/go/amazon-lap-3',
    stores: [
      { name: 'Amazon', priceValue: 999, url: '/go/amazon-lap-3' },
      { name: 'Best Buy', priceValue: 1049, url: '/go/bestbuy-lap-3' },
    ],
  },
  {
    id: 'lap-4',
    name: 'Apple MacBook Air 13-inch',
    brand: 'Apple',
    originalPriceValue: 1199,
    rating: 4.9,
    reviews: '21,610',
    category: 'Laptops',
    description: 'Quiet, efficient laptop with excellent battery life and polished hardware for daily use.',
    tags: ['MacBook Air', 'Apple Silicon', 'Retina'],
    affiliateUrl: '/go/amazon-lap-4',
    stores: [
      { name: 'Amazon', priceValue: 999, url: '/go/amazon-lap-4' },
      { name: 'Best Buy', priceValue: 1029, url: '/go/bestbuy-lap-4' },
    ],
  },
  {
    id: 'fas-1',
    name: 'Nike Dri-FIT Club Tee',
    brand: 'Nike',
    originalPriceValue: 45,
    rating: 4.5,
    reviews: '7,180',
    category: 'Fashion',
    description: 'Clean everyday performance tee with breathable fabric and an easy athletic fit.',
    tags: ['Dri-FIT', 'Cotton Blend', 'Everyday'],
    affiliateUrl: '/go/amazon-fas-1',
    stores: [
      { name: 'Amazon', priceValue: 35, url: '/go/amazon-fas-1' },
      { name: 'Macys', priceValue: 39, url: '/go/macys-fas-1' },
    ],
  },
  {
    id: 'fas-2',
    name: 'Adidas Essentials Fleece Hoodie',
    brand: 'Adidas',
    originalPriceValue: 70,
    rating: 4.4,
    reviews: '5,460',
    category: 'Fashion',
    description: 'Soft fleece hoodie with a classic fit that works for travel, layering, and casual wear.',
    tags: ['Fleece', 'Hoodie', 'Casual'],
    affiliateUrl: '/go/amazon-fas-2',
    stores: [
      { name: 'Amazon', priceValue: 58, url: '/go/amazon-fas-2' },
      { name: 'Macys', priceValue: 62, url: '/go/macys-fas-2' },
    ],
  },
  {
    id: 'fas-3',
    name: 'Zara Straight Leg Denim',
    brand: 'Zara',
    originalPriceValue: 89,
    rating: 4.3,
    reviews: '4,180',
    category: 'Fashion',
    description: 'Modern straight-leg jeans with a clean wash and easy day-to-night styling.',
    tags: ['Denim', 'Straight Leg', 'Wardrobe'],
    affiliateUrl: '/go/amazon-fas-3',
    stores: [
      { name: 'Amazon', priceValue: 69, url: '/go/amazon-fas-3' },
      { name: 'Target', priceValue: 74, url: '/go/target-fas-3' },
    ],
  },
  {
    id: 'fas-4',
    name: 'Levis Trucker Jacket',
    brand: 'Levis',
    originalPriceValue: 98,
    rating: 4.7,
    reviews: '8,920',
    category: 'Fashion',
    description: 'Classic denim jacket that layers well and holds up as a year-round staple.',
    tags: ['Denim Jacket', 'Classic Fit', 'Layering'],
    affiliateUrl: '/go/amazon-fas-4',
    stores: [
      { name: 'Amazon', priceValue: 79, url: '/go/amazon-fas-4' },
      { name: 'Macys', priceValue: 84, url: '/go/macys-fas-4' },
    ],
  },
  {
    id: 'hom-1',
    name: 'Philips 3000 Series Air Fryer',
    brand: 'Philips',
    originalPriceValue: 189,
    rating: 4.5,
    reviews: '12,680',
    category: 'Home',
    description: 'Countertop air fryer with quick heating, dependable results, and easy cleanup.',
    tags: ['Air Fryer', 'Kitchen', 'RapidAir'],
    affiliateUrl: '/go/amazon-hom-1',
    stores: [
      { name: 'Amazon', priceValue: 149, url: '/go/amazon-hom-1' },
      { name: 'Walmart', priceValue: 159, url: '/go/walmart-hom-1' },
    ],
  },
  {
    id: 'hom-2',
    name: 'Bosch Series 2 Vacuum Cleaner',
    brand: 'Bosch',
    originalPriceValue: 279,
    rating: 4.4,
    reviews: '3,780',
    category: 'Home',
    description: 'Bagged vacuum with strong suction and a practical compact design for apartment cleaning.',
    tags: ['Vacuum', 'Home Care', 'Compact'],
    affiliateUrl: '/go/amazon-hom-2',
    stores: [
      { name: 'Amazon', priceValue: 229, url: '/go/amazon-hom-2' },
      { name: 'Walmart', priceValue: 239, url: '/go/walmart-hom-2' },
    ],
  },
  {
    id: 'hom-3',
    name: 'Dyson Purifier Cool TP10',
    brand: 'Dyson',
    originalPriceValue: 499,
    rating: 4.6,
    reviews: '4,540',
    category: 'Home',
    description: 'Air purifier fan with sleek design, simple controls, and strong room coverage.',
    tags: ['Air Purifier', 'HEPA', 'Cooling'],
    affiliateUrl: '/go/amazon-hom-3',
    stores: [
      { name: 'Amazon', priceValue: 429, url: '/go/amazon-hom-3' },
      { name: 'Target', priceValue: 449, url: '/go/target-hom-3' },
    ],
  },
  {
    id: 'hom-4',
    name: 'Philips Hue White Starter Kit',
    brand: 'Philips',
    originalPriceValue: 149,
    rating: 4.5,
    reviews: '9,210',
    category: 'Home',
    description: 'Smart lighting kit for simple room upgrades, routines, and voice assistant control.',
    tags: ['Smart Home', 'Lighting', 'Starter Kit'],
    affiliateUrl: '/go/amazon-hom-4',
    stores: [
      { name: 'Amazon', priceValue: 119, url: '/go/amazon-hom-4' },
      { name: 'Target', priceValue: 129, url: '/go/target-hom-4' },
    ],
  },
  {
    id: 'cam-1',
    name: 'Canon EOS R50 Kit',
    brand: 'Canon',
    originalPriceValue: 899,
    rating: 4.7,
    reviews: '2,940',
    category: 'Cameras',
    description: 'Approachable mirrorless kit with fast autofocus and clean image quality for creators.',
    tags: ['Mirrorless', '4K', 'Content Creation'],
    affiliateUrl: '/go/amazon-cam-1',
    stores: [
      { name: 'Amazon', priceValue: 799, url: '/go/amazon-cam-1' },
      { name: 'Best Buy', priceValue: 829, url: '/go/bestbuy-cam-1' },
    ],
  },
  {
    id: 'cam-2',
    name: 'Sony ZV-E10',
    brand: 'Sony',
    originalPriceValue: 849,
    rating: 4.8,
    reviews: '3,410',
    category: 'Cameras',
    description: 'Popular creator camera with reliable autofocus, sharp video, and interchangeable lenses.',
    tags: ['APS-C', 'Vlogging', 'Sony'],
    affiliateUrl: '/go/amazon-cam-2',
    stores: [
      { name: 'Amazon', priceValue: 749, url: '/go/amazon-cam-2' },
      { name: 'Best Buy', priceValue: 769, url: '/go/bestbuy-cam-2' },
    ],
  },
  {
    id: 'cam-3',
    name: 'GoPro HERO12 Black',
    brand: 'GoPro',
    originalPriceValue: 449,
    rating: 4.6,
    reviews: '6,050',
    category: 'Cameras',
    description: 'Rugged action camera built for travel, sports, and fast handheld capture.',
    tags: ['Action Camera', 'Waterproof', '5.3K'],
    affiliateUrl: '/go/amazon-cam-3',
    stores: [
      { name: 'Amazon', priceValue: 379, url: '/go/amazon-cam-3' },
      { name: 'Best Buy', priceValue: 399, url: '/go/bestbuy-cam-3' },
    ],
  },
  {
    id: 'cam-4',
    name: 'Fujifilm Instax Mini 12',
    brand: 'Fujifilm',
    originalPriceValue: 99,
    rating: 4.5,
    reviews: '8,890',
    category: 'Cameras',
    description: 'Instant camera that is simple to use and well suited to casual parties and travel memories.',
    tags: ['Instant Camera', 'Travel', 'Casual'],
    affiliateUrl: '/go/amazon-cam-4',
    stores: [
      { name: 'Amazon', priceValue: 79, url: '/go/amazon-cam-4' },
      { name: 'Target', priceValue: 84, url: '/go/target-cam-4' },
    ],
  },
  {
    id: 'gam-1',
    name: 'Sony DualSense Wireless Controller',
    brand: 'Sony',
    originalPriceValue: 75,
    rating: 4.8,
    reviews: '19,470',
    category: 'Gaming',
    description: 'Responsive controller with strong haptics and a premium feel for console or PC play.',
    tags: ['PS5', 'Wireless', 'Haptics'],
    affiliateUrl: '/go/amazon-gam-1',
    stores: [
      { name: 'Amazon', priceValue: 69, url: '/go/amazon-gam-1' },
      { name: 'Best Buy', priceValue: 72, url: '/go/bestbuy-gam-1' },
    ],
  },
  {
    id: 'gam-2',
    name: 'Nintendo Switch OLED',
    brand: 'Nintendo',
    originalPriceValue: 379,
    rating: 4.9,
    reviews: '22,840',
    category: 'Gaming',
    description: 'Portable hybrid console with a vivid screen and excellent first-party library.',
    tags: ['OLED', 'Portable', 'Console'],
    affiliateUrl: '/go/amazon-gam-2',
    stores: [
      { name: 'Amazon', priceValue: 349, url: '/go/amazon-gam-2' },
      { name: 'Target', priceValue: 359, url: '/go/target-gam-2' },
    ],
  },
  {
    id: 'gam-3',
    name: 'Logitech G Pro X Superlight 2',
    brand: 'Logitech',
    originalPriceValue: 159,
    rating: 4.7,
    reviews: '5,960',
    category: 'Gaming',
    description: 'Lightweight performance mouse built for competitive play and long sessions.',
    tags: ['Wireless', 'Esports', 'Lightweight'],
    affiliateUrl: '/go/amazon-gam-3',
    stores: [
      { name: 'Amazon', priceValue: 129, url: '/go/amazon-gam-3' },
      { name: 'Best Buy', priceValue: 139, url: '/go/bestbuy-gam-3' },
    ],
  },
  {
    id: 'gam-4',
    name: 'Razer BlackShark V2 X',
    brand: 'Razer',
    originalPriceValue: 59,
    rating: 4.4,
    reviews: '7,520',
    category: 'Gaming',
    description: 'Comfortable wired headset with clear positional audio and a solid mic for team chat.',
    tags: ['Headset', '7.1 Audio', 'PC Gaming'],
    affiliateUrl: '/go/amazon-gam-4',
    stores: [
      { name: 'Amazon', priceValue: 49, url: '/go/amazon-gam-4' },
      { name: 'Best Buy', priceValue: 54, url: '/go/bestbuy-gam-4' },
    ],
  },
  {
    id: 'ele-1',
    name: 'Sony WH-1000XM5',
    brand: 'Sony',
    originalPriceValue: 399,
    rating: 4.8,
    reviews: '15,380',
    category: 'Electronics',
    description: 'Premium noise-cancelling headphones with balanced tuning and excellent travel comfort.',
    tags: ['ANC', 'Bluetooth', '30 Hours'],
    affiliateUrl: '/go/amazon-ele-1',
    stores: [
      { name: 'Amazon', priceValue: 329, url: '/go/amazon-ele-1' },
      { name: 'Best Buy', priceValue: 349, url: '/go/bestbuy-ele-1' },
    ],
  },
  {
    id: 'ele-2',
    name: 'Samsung Smart Monitor M8',
    brand: 'Samsung',
    originalPriceValue: 699,
    rating: 4.5,
    reviews: '4,210',
    category: 'Electronics',
    description: 'Stylish 4K smart monitor that doubles as a flexible work and streaming screen.',
    tags: ['4K', 'Smart Monitor', 'USB-C'],
    affiliateUrl: '/go/amazon-ele-2',
    stores: [
      { name: 'Amazon', priceValue: 549, url: '/go/amazon-ele-2' },
      { name: 'Best Buy', priceValue: 579, url: '/go/bestbuy-ele-2' },
    ],
  },
  {
    id: 'ele-3',
    name: 'Bose SoundLink Flex',
    brand: 'Bose',
    originalPriceValue: 149,
    rating: 4.6,
    reviews: '8,140',
    category: 'Electronics',
    description: 'Portable speaker with punchy sound, rugged design, and easy outdoor usability.',
    tags: ['Portable Speaker', 'Water Resistant', 'Bluetooth'],
    affiliateUrl: '/go/amazon-ele-3',
    stores: [
      { name: 'Amazon', priceValue: 129, url: '/go/amazon-ele-3' },
      { name: 'Best Buy', priceValue: 134, url: '/go/bestbuy-ele-3' },
    ],
  },
  {
    id: 'ele-4',
    name: 'Sony ZV-1F',
    brand: 'Sony',
    originalPriceValue: 549,
    rating: 4.5,
    reviews: '2,860',
    category: 'Electronics',
    description: 'Simple fixed-lens creator camera that fits quick recording and desk setups well.',
    tags: ['Vlogging', 'Creator Camera', '4K'],
    affiliateUrl: '/go/amazon-ele-4',
    stores: [
      { name: 'Amazon', priceValue: 499, url: '/go/amazon-ele-4' },
      { name: 'Best Buy', priceValue: 519, url: '/go/bestbuy-ele-4' },
    ],
  },
  {
    id: 'foo-1',
    name: 'Nike Revolution 7',
    brand: 'Nike',
    originalPriceValue: 90,
    rating: 4.4,
    reviews: '12,930',
    category: 'Footwear',
    description: 'Daily running shoe with a comfortable ride and enough structure for casual workouts.',
    tags: ['Running', 'Breathable', 'Daily Wear'],
    affiliateUrl: '/go/amazon-foo-1',
    stores: [
      { name: 'Amazon', priceValue: 75, url: '/go/amazon-foo-1' },
      { name: 'Zappos', priceValue: 79, url: '/go/zappos-foo-1' },
    ],
  },
  {
    id: 'foo-2',
    name: 'Adidas Grand Court 2.0',
    brand: 'Adidas',
    originalPriceValue: 85,
    rating: 4.3,
    reviews: '9,640',
    category: 'Footwear',
    description: 'Simple court-inspired sneaker that works well as an everyday casual option.',
    tags: ['Lifestyle', 'Sneaker', 'Court'],
    affiliateUrl: '/go/amazon-foo-2',
    stores: [
      { name: 'Amazon', priceValue: 68, url: '/go/amazon-foo-2' },
      { name: 'Zappos', priceValue: 73, url: '/go/zappos-foo-2' },
    ],
  },
  {
    id: 'foo-3',
    name: 'New Balance 574 Core',
    brand: 'New Balance',
    originalPriceValue: 110,
    rating: 4.6,
    reviews: '6,420',
    category: 'Footwear',
    description: 'Classic retro runner with plush underfoot comfort and strong day-long wearability.',
    tags: ['Retro', 'Lifestyle', 'Comfort'],
    affiliateUrl: '/go/amazon-foo-3',
    stores: [
      { name: 'Amazon', priceValue: 89, url: '/go/amazon-foo-3' },
      { name: 'Zappos', priceValue: 94, url: '/go/zappos-foo-3' },
    ],
  },
  {
    id: 'foo-4',
    name: 'Crocs Classic Clog',
    brand: 'Crocs',
    originalPriceValue: 60,
    rating: 4.7,
    reviews: '31,210',
    category: 'Footwear',
    description: 'Lightweight clog that remains easy to clean, easy to wear, and reliably comfortable.',
    tags: ['Clog', 'Lightweight', 'Comfort'],
    affiliateUrl: '/go/amazon-foo-4',
    stores: [
      { name: 'Amazon', priceValue: 50, url: '/go/amazon-foo-4' },
      { name: 'Zappos', priceValue: 54, url: '/go/zappos-foo-4' },
    ],
  },
  {
    id: 'boo-1',
    name: 'Atomic Habits',
    brand: 'Penguin',
    originalPriceValue: 25,
    rating: 4.9,
    reviews: '124,300',
    category: 'Books',
    description: 'A practical bestseller about designing repeatable systems for better habits.',
    tags: ['Self Improvement', 'Bestseller', 'Habits'],
    affiliateUrl: '/go/amazon-boo-1',
    stores: [
      { name: 'Amazon', priceValue: 18, url: '/go/amazon-boo-1' },
      { name: 'Barnes & Noble', priceValue: 20, url: '/go/bn-boo-1' },
    ],
  },
  {
    id: 'boo-2',
    name: 'The Alchemist',
    brand: 'HarperCollins',
    originalPriceValue: 18,
    rating: 4.8,
    reviews: '89,740',
    category: 'Books',
    description: 'Short, widely loved fiction about purpose, luck, and following a difficult path.',
    tags: ['Fiction', 'Classic', 'Inspirational'],
    affiliateUrl: '/go/amazon-boo-2',
    stores: [
      { name: 'Amazon', priceValue: 14, url: '/go/amazon-boo-2' },
      { name: 'Barnes & Noble', priceValue: 15, url: '/go/bn-boo-2' },
    ],
  },
  {
    id: 'boo-3',
    name: 'The Psychology of Money',
    brand: 'Simon & Schuster',
    originalPriceValue: 22,
    rating: 4.8,
    reviews: '67,520',
    category: 'Books',
    description: 'Accessible finance writing focused on behavior, risk, patience, and long-term decision making.',
    tags: ['Finance', 'Money', 'Behavior'],
    affiliateUrl: '/go/amazon-boo-3',
    stores: [
      { name: 'Amazon', priceValue: 17, url: '/go/amazon-boo-3' },
      { name: 'Barnes & Noble', priceValue: 19, url: '/go/bn-boo-3' },
    ],
  },
  {
    id: 'boo-4',
    name: 'Deep Work',
    brand: 'Hachette',
    originalPriceValue: 21,
    rating: 4.7,
    reviews: '48,330',
    category: 'Books',
    description: 'Popular productivity book arguing for deliberate focus in an increasingly distracted world.',
    tags: ['Productivity', 'Focus', 'Work'],
    affiliateUrl: '/go/amazon-boo-4',
    stores: [
      { name: 'Amazon', priceValue: 16, url: '/go/amazon-boo-4' },
      { name: 'Barnes & Noble', priceValue: 18, url: '/go/bn-boo-4' },
    ],
  },
  {
    id: 'bea-1',
    name: 'LOreal Revitalift Hyaluronic Serum',
    brand: 'LOreal',
    originalPriceValue: 36,
    rating: 4.5,
    reviews: '14,640',
    category: 'Beauty',
    description: 'Hydrating serum for daily skincare routines with a simple, familiar ingredient story.',
    tags: ['Serum', 'Hyaluronic', 'Skincare'],
    affiliateUrl: '/go/amazon-bea-1',
    stores: [
      { name: 'Amazon', priceValue: 29, url: '/go/amazon-bea-1' },
      { name: 'Sephora', priceValue: 32, url: '/go/sephora-bea-1' },
    ],
  },
  {
    id: 'bea-2',
    name: 'Maybelline Sky High Mascara',
    brand: 'Maybelline',
    originalPriceValue: 17,
    rating: 4.6,
    reviews: '28,750',
    category: 'Beauty',
    description: 'Well-known mascara with flexible wear, strong hold, and broad day-to-night appeal.',
    tags: ['Mascara', 'Makeup', 'Lash'],
    affiliateUrl: '/go/amazon-bea-2',
    stores: [
      { name: 'Amazon', priceValue: 13, url: '/go/amazon-bea-2' },
      { name: 'Target', priceValue: 14, url: '/go/target-bea-2' },
    ],
  },
  {
    id: 'bea-3',
    name: 'Nivea Soft Moisturizing Cream',
    brand: 'Nivea',
    originalPriceValue: 12,
    rating: 4.5,
    reviews: '18,110',
    category: 'Beauty',
    description: 'Simple lightweight cream for face, hands, and body with straightforward everyday use.',
    tags: ['Moisturizer', 'Soft Cream', 'Daily Care'],
    affiliateUrl: '/go/amazon-bea-3',
    stores: [
      { name: 'Amazon', priceValue: 9, url: '/go/amazon-bea-3' },
      { name: 'Target', priceValue: 10, url: '/go/target-bea-3' },
    ],
  },
  {
    id: 'bea-4',
    name: 'LOreal Elvive Hyaluron Shampoo',
    brand: 'LOreal',
    originalPriceValue: 19,
    rating: 4.4,
    reviews: '10,520',
    category: 'Beauty',
    description: 'Hydration-led shampoo designed for daily use without feeling overly heavy.',
    tags: ['Haircare', 'Shampoo', 'Hydration'],
    affiliateUrl: '/go/amazon-bea-4',
    stores: [
      { name: 'Amazon', priceValue: 14, url: '/go/amazon-bea-4' },
      { name: 'Sephora', priceValue: 16, url: '/go/sephora-bea-4' },
    ],
  },
  {
    id: 'spo-1',
    name: 'Nike Pegasus 41',
    brand: 'Nike',
    originalPriceValue: 160,
    rating: 4.7,
    reviews: '6,870',
    category: 'Sports',
    description: 'Trusted running shoe with a springy ride and durable outsole for regular training.',
    tags: ['Running', 'Road', 'Training'],
    affiliateUrl: '/go/amazon-spo-1',
    stores: [
      { name: 'Amazon', priceValue: 140, url: '/go/amazon-spo-1' },
      { name: 'Dick Sporting Goods', priceValue: 148, url: '/go/dsg-spo-1' },
    ],
  },
  {
    id: 'spo-2',
    name: 'Adidas UCL Club Ball',
    brand: 'Adidas',
    originalPriceValue: 35,
    rating: 4.4,
    reviews: '4,990',
    category: 'Sports',
    description: 'Durable training football with predictable touch for casual games and practice sessions.',
    tags: ['Football', 'Training', 'Match Ball'],
    affiliateUrl: '/go/amazon-spo-2',
    stores: [
      { name: 'Amazon', priceValue: 29, url: '/go/amazon-spo-2' },
      { name: 'Dick Sporting Goods', priceValue: 31, url: '/go/dsg-spo-2' },
    ],
  },
  {
    id: 'spo-3',
    name: 'Decathlon Domyos Yoga Mat 8mm',
    brand: 'Decathlon',
    originalPriceValue: 30,
    rating: 4.5,
    reviews: '8,330',
    category: 'Sports',
    description: 'Comfortable non-slip mat for stretching, yoga sessions, and at-home floor workouts.',
    tags: ['Yoga', '8mm', 'Workout'],
    affiliateUrl: '/go/amazon-spo-3',
    stores: [
      { name: 'Amazon', priceValue: 24, url: '/go/amazon-spo-3' },
      { name: 'Dick Sporting Goods', priceValue: 26, url: '/go/dsg-spo-3' },
    ],
  },
  {
    id: 'spo-4',
    name: 'Nike Brasilia Training Duffel',
    brand: 'Nike',
    originalPriceValue: 55,
    rating: 4.6,
    reviews: '5,410',
    category: 'Sports',
    description: 'Gym-ready duffel with dependable storage, simple organization, and easy carry handles.',
    tags: ['Duffel', 'Training', 'Gym Bag'],
    affiliateUrl: '/go/amazon-spo-4',
    stores: [
      { name: 'Amazon', priceValue: 42, url: '/go/amazon-spo-4' },
      { name: 'Dick Sporting Goods', priceValue: 46, url: '/go/dsg-spo-4' },
    ],
  },
  {
    id: 'toy-1',
    name: 'LEGO Classic Creative Box',
    brand: 'LEGO',
    originalPriceValue: 50,
    rating: 4.9,
    reviews: '13,520',
    category: 'Toys',
    description: 'Open-ended brick box that works well for young builders and family play time.',
    tags: ['Building', 'Creative', 'STEM'],
    affiliateUrl: '/go/amazon-toy-1',
    stores: [
      { name: 'Amazon', priceValue: 42, url: '/go/amazon-toy-1' },
      { name: 'Target', priceValue: 45, url: '/go/target-toy-1' },
    ],
  },
  {
    id: 'toy-2',
    name: 'Hasbro Nerf Elite Disruptor',
    brand: 'Hasbro',
    originalPriceValue: 25,
    rating: 4.5,
    reviews: '9,620',
    category: 'Toys',
    description: 'Fast-loading foam blaster that is easy to learn and consistently fun for group play.',
    tags: ['Nerf', 'Foam Blaster', 'Action'],
    affiliateUrl: '/go/amazon-toy-2',
    stores: [
      { name: 'Amazon', priceValue: 19, url: '/go/amazon-toy-2' },
      { name: 'Walmart', priceValue: 21, url: '/go/walmart-toy-2' },
    ],
  },
  {
    id: 'toy-3',
    name: 'Mattel Barbie Dream Closet',
    brand: 'Mattel',
    originalPriceValue: 42,
    rating: 4.6,
    reviews: '6,780',
    category: 'Toys',
    description: 'Dress-up playset with plenty of accessories and strong gift appeal for younger kids.',
    tags: ['Barbie', 'Dress Up', 'Playset'],
    affiliateUrl: '/go/amazon-toy-3',
    stores: [
      { name: 'Amazon', priceValue: 34, url: '/go/amazon-toy-3' },
      { name: 'Target', priceValue: 37, url: '/go/target-toy-3' },
    ],
  },
  {
    id: 'toy-4',
    name: 'LEGO City Space Rover',
    brand: 'LEGO',
    originalPriceValue: 45,
    rating: 4.7,
    reviews: '4,390',
    category: 'Toys',
    description: 'Compact themed set that delivers a quick build and strong replay value afterward.',
    tags: ['LEGO City', 'Space', 'Build Set'],
    affiliateUrl: '/go/amazon-toy-4',
    stores: [
      { name: 'Amazon', priceValue: 38, url: '/go/amazon-toy-4' },
      { name: 'Walmart', priceValue: 40, url: '/go/walmart-toy-4' },
    ],
  },
] as const satisfies readonly ProductSeed[]

function createProduct(seed: ProductSeed): Product {
  const primaryStore = seed.stores[0]
  const discountPercent = Math.max(1, Math.round(((seed.originalPriceValue - primaryStore.priceValue) / seed.originalPriceValue) * 100))

  return {
    id: seed.id,
    name: seed.name,
    brand: seed.brand,
    platform: primaryStore.name,
    originalPrice: formatUsd(seed.originalPriceValue),
    discountedPrice: formatUsd(primaryStore.priceValue),
    priceValue: primaryStore.priceValue,
    rating: seed.rating,
    reviews: seed.reviews,
    discountPercent,
    category: seed.category,
    imageUrl: getCategoryImage(seed.category),
    description: seed.description,
    tags: [...seed.tags],
    inStock: true,
    affiliateUrl: seed.affiliateUrl,
    stores: seed.stores.map((store) => ({
      name: store.name,
      price: formatUsd(store.priceValue),
      url: store.url,
    })),
  }
}

export const PRODUCTS: Product[] = RAW_PRODUCTS.map(createProduct)

export function getProductById(id: string): Product | null {
  return PRODUCTS.find((product) => product.id === id) ?? null
}

export function getProductsByCategory(category: Category): Product[] {
  if (category === 'All') {
    return PRODUCTS
  }

  return PRODUCTS.filter((product) => product.category === category)
}

export function searchProducts(query: string): Product[] {
  const normalizedQuery = query.toLowerCase().trim()

  return PRODUCTS.filter(
    (product) =>
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.brand.toLowerCase().includes(normalizedQuery) ||
      product.category.toLowerCase().includes(normalizedQuery) ||
      product.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery)),
  )
}

