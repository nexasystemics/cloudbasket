export type CategorySlug =
  | 'automotive'
  | 'beauty'
  | 'books'
  | 'courses'
  | 'electronics'
  | 'fashion'
  | 'finance'
  | 'gaming'
  | 'grocery'
  | 'health'
  | 'home'
  | 'investments'
  | 'jewellery'
  | 'laptops'
  | 'mobiles'
  | 'pod'
  | 'sports'
  | 'toys'
  | 'travel'
  | 'watches'

export type PlatformLabel = 'Amazon' | 'CJ Global' | 'Flipkart' | 'Print on Demand'
export type ViewMode = 'grid' | 'list'

export interface CategoryDefinition {
  slug: CategorySlug
  label: string
  description: string
  heroTitle: string
  heroDescription: string
  image: string
  brands: string[]
  flyoutBrands: string[]
  priceRanges: string[]
  sortOptions: string[]
  emptyMessage?: string
}

export interface CatalogProduct {
  id: string
  brand: string
  title: string
  category: CategorySlug
  price: number
  mrp: number
  rating: number
  reviewCount: number
  image: string
  platform: PlatformLabel
  affiliateUrl: string
  badge?: string
  description: string
  specs: string[]
  compatibility?: string
  publishedAt: string
}

export interface SearchResultBucket {
  products: CatalogProduct[]
  deals: CatalogProduct[]
  categories: CategoryDefinition[]
}

const AMAZON_TAG =
  process.env.NEXT_PUBLIC_VITE_AMAZON_AFFILIATE_TAG ??
  process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG ??
  process.env.VITE_AMAZON_AFFILIATE_TAG ??
  'cloudbasket-21'

const FLIPKART_ID =
  process.env.NEXT_PUBLIC_VITE_FLIPKART_AFFILIATE_ID ??
  process.env.NEXT_PUBLIC_FLIPKART_AFFILIATE_ID ??
  process.env.VITE_FLIPKART_AFFILIATE_ID ??
  'cloudbasket'

const CJ_ID =
  process.env.NEXT_PUBLIC_CJ_PUBLISHER_ID ??
  process.env.CJ_PUBLISHER_ID ??
  'cloudbasket'

const date = '2026-03-12T00:00:00.000Z'

const buildAmazonUrl = (asin: string): string => `https://www.amazon.in/dp/${asin}?tag=${AMAZON_TAG}`
const buildFlipkartUrl = (slug: string, itemId: string): string =>
  `https://www.flipkart.com/${slug}/p/${itemId}?affid=${FLIPKART_ID}`
const buildCjUrl = (id: string): string => `https://www.cj.com/product/${id}?sid=${CJ_ID}`

export const SITE_STATS = {
  categories: '20 Categories',
  products: '8K+ Products',
  links: '459+ Verified Links',
  users: '50K+ Verified Users',
} as const

export const HERO_BADGES = [
  { label: '50+ Stores Compared in Real-Time', href: '/about#stores' },
  { label: 'Flash Sale: Up to 70% off Mobiles', href: '/deals/flash' },
  { label: 'CJ Exclusive: Global deals', href: '/deals?platform=cj' },
  { label: 'DPDPA 2023 Compliant', href: '/legal/privacy#dpdpa' },
  { label: 'DPDPA 2023 Compliant', href: '/legal/privacy#dpdpa' },
] as const

export const MAIN_NAV = [
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Categories', href: '/categories' },
  { label: 'Compare', href: '/compare' },
  { label: 'Deals', href: '/deals' },
  { label: 'Deal Quiz', href: '/quiz' },
  { label: 'POD', href: '/pod' },
  { label: 'Products', href: '/products' },
] as const

export const FOOTER_COLUMNS = {
  browse: [
    { label: 'Blog', href: '/blog' },
    { label: 'Categories', href: '/categories' },
    { label: 'Compare', href: '/compare' },
    { label: 'Deals', href: '/deals' },
    { label: 'POD', href: '/pod' },
    { label: 'Products', href: '/products' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
  ],
  legal: [
    { label: 'Affiliate Disclosure', href: '/affiliate-disclosure' },
    { label: 'Privacy Policy', href: '/legal/privacy' },
    { label: 'Terms', href: '/legal/terms' },
  ],
} as const

export const COMPLIANCE_BADGES = [
  {
    key: 'dpdpa',
    title: 'DPDPA 2023',
    learnMoreHref: '/legal/privacy#dpdpa',
    content:
      "India's Digital Personal Data Protection Act 2023 governs how we collect, store, and process your personal data. CloudBasket collects only what's necessary to serve you. We never sell your data to third parties. You have the right to access, correct, and erase your data at any time by contacting us.",
  },
  {
    key: 'gdpr',
    title: 'GDPR',
    learnMoreHref: '/legal/privacy#gdpr',
    content:
      "The EU's General Data Protection Regulation sets the gold standard for data privacy. CloudBasket follows GDPR principles globally — lawful processing, data minimization, transparency, and user rights. If you're in the EU, you have additional rights including data portability and the right to object.",
  },
  {
    key: 'ftc',
    title: 'FTC',
    learnMoreHref: '/affiliate-disclosure',
    content:
      'The US Federal Trade Commission requires clear disclosure of affiliate relationships. CloudBasket earns a commission when you click our links and make a purchase — at no extra cost to you. This compliance badge confirms our affiliate links are clearly identified.',
  },
  {
    key: 'rbi',
    title: 'RBI Partners',
    learnMoreHref: '/about#partners',
    content:
      "CloudBasket works exclusively with payment partners regulated by the Reserve Bank of India (RBI). This ensures all financial transactions on our platform meet India's banking security standards. CloudBasket itself is not an RBI-registered entity.",
  },
  {
    key: 'ondc',
    title: 'ONDC Ready',
    learnMoreHref: '/about#platform',
    content:
      "The Open Network for Digital Commerce (ONDC) is the Government of India's initiative to democratize e-commerce. CloudBasket is building ONDC integration to surface deals and products across the open network — giving sellers and buyers a level playing field beyond any single platform.",
  },
  {
    key: 'startup-india',
    title: 'Startup India',
    learnMoreHref: '/about#platform',
    content:
      "CloudBasket is recognized under the Government of India's Startup India initiative — a program that supports innovation-driven startups with regulatory benefits, funding access, and IP fast-track support. DIPP recognition confirms our commitment to building in India for the world.",
  },
] as const

export const CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  {
    slug: 'automotive',
    label: 'Automotive',
    description: 'Car care, in-car audio, oils, and riding accessories.',
    heroTitle: 'Automotive Deals',
    heroDescription: 'Verified savings on car care, audio, tyres, and road-trip essentials.',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=80',
    brands: ['3M', 'Bosch', 'Castrol', 'JBL', 'Kenwood', "Meguiar's", 'Michelin'],
    flyoutBrands: ['3M', 'Bosch', 'Castrol', 'JBL', 'Kenwood', "Meguiar's", 'Michelin', 'Mothers', 'Pioneer', 'Rain-X', 'Sonax', 'Wurth'],
    priceRanges: ['Under ₹500', '₹500–2K', '₹2K–10K', '₹10K+'],
    sortOptions: ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Top Rated'],
  },
  {
    slug: 'beauty',
    label: 'Beauty',
    description: 'Skincare, makeup, haircare, and wellness-led beauty picks.',
    heroTitle: 'Beauty Deals',
    heroDescription: 'Clean, credible beauty offers across skincare, makeup, and haircare.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80',
    brands: ['Biotique', 'Forest Essentials', 'Himalaya', 'Lakme', "L'Oreal", 'Maybelline', 'Nykaa'],
    flyoutBrands: ['Biotique', 'Cetaphil', 'Dot & Key', 'Forest Essentials', 'Himalaya', 'Lakme', "L'Oreal", 'Mamaearth', 'Maybelline', 'Minimalist', 'Nykaa', 'Plum'],
    priceRanges: ['Under ₹500', '₹500–1.5K', '₹1.5K–5K', '₹5K+'],
    sortOptions: ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Best Rated'],
  },
  {
    slug: 'books',
    label: 'Books',
    description: 'Bestsellers, business books, and deep reads from major publishers.',
    heroTitle: 'Books & Reading',
    heroDescription: 'Title, author, and publisher aligned for readers who compare before buying.',
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1200&q=80',
    brands: ['Harper Collins', 'Oxford', 'Penguin', 'Rupa', 'Scholastic'],
    flyoutBrands: ['Bloomsbury', 'Cambridge', 'Harper Collins', 'Hachette', 'Jaico', 'Oxford', 'Pan Macmillan', 'Penguin', 'Rupa', 'Scholastic', 'Simon & Schuster', 'Westland'],
    priceRanges: ['Under ₹300', '₹300–700', '₹700–1.5K', '₹1.5K+'],
    sortOptions: ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Top Rated'],
  },
  {
    slug: 'courses',
    label: 'Courses',
    description: 'Online learning programs in design, code, and business.',
    heroTitle: 'Courses & Certifications',
    heroDescription: 'Flexible learning picks from verified education platforms.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80',
    brands: ['Coursera', 'Frontend Masters', 'Scaler', 'Skillshare', 'Udemy'],
    flyoutBrands: ['Coursera', 'Domestika', 'Frontend Masters', 'Google Career Certificates', 'Great Learning', 'LinkedIn Learning', 'MasterClass', 'Scaler', 'Skillshare', 'Udacity', 'Udemy', 'upGrad'],
    priceRanges: ['Under ₹1K', '₹1K–5K', '₹5K–20K', '₹20K+'],
    sortOptions: ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest'],
  },
  {
    slug: 'electronics',
    label: 'Electronics',
    description: 'TVs, monitors, accessories, and creator gear.',
    heroTitle: 'Electronics Deals',
    heroDescription: 'Smart home screens, accessories, and creator gear priced to compare.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80',
    brands: ['Anker', 'Canon', 'LG', 'Logitech', 'Samsung', 'Sony', 'Xiaomi'],
    flyoutBrands: ['Anker', 'BenQ', 'Canon', 'GoPro', 'JBL', 'LG', 'Logitech', 'Philips', 'Samsung', 'Sony', 'ViewSonic', 'Xiaomi'],
    priceRanges: ['Under ₹2K', '₹2K–10K', '₹10K–50K', '₹50K+'],
    sortOptions: ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Top Rated'],
  },
  {
    slug: 'fashion',
    label: 'Fashion',
    description: 'Apparel, footwear, bags, and wardrobe staples.',
    heroTitle: 'Fashion Finds',
    heroDescription: 'Handpicked deals across apparel, footwear, and everyday accessories.',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80',
    brands: ['Adidas', 'Biba', "Levi's", 'Mango', 'Nike', 'Puma', 'Zara'],
    flyoutBrands: ['Adidas', 'Allen Solly', 'Biba', 'H&M', "Levi's", 'Mango', 'Marks & Spencer', 'Nike', 'Puma', 'Rare Rabbit', 'Tommy Hilfiger', 'Zara'],
    priceRanges: ['Under ₹500', '₹500–2K', '₹2K–5K', '₹5K+'],
    sortOptions: ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Top Rated'],
  },
  {
    slug: 'finance',
    label: 'Finance',
    description: 'Credit cards, insurance, demat accounts, and saving products.',
    heroTitle: 'Finance Products',
    heroDescription: 'Insurance, investing, and credit products that match the finance URL and content.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80',
    brands: ['Axis Bank', 'Bajaj Finance', 'Groww', 'HDFC', 'Policy Bazaar', 'SBI', 'Zerodha'],
    flyoutBrands: ['Amfi', 'Axis Bank', 'Bajaj Finance', 'CRED', 'Groww', 'HDFC', 'ICICI Bank', 'Kotak', 'Policy Bazaar', 'SBI', 'Tata AIG', 'Zerodha'],
    priceRanges: ['No annual fee', '₹500–2K', '₹2K–10K', 'Premium'],
    sortOptions: ['Relevance', 'Newest', 'Top Rated'],
  },
  {
    slug: 'gaming',
    label: 'Gaming',
    description: 'Consoles, accessories, chairs, and creator-ready gear.',
    heroTitle: 'Gaming Deals',
    heroDescription: 'Console and setup upgrades for gamers who track price drops carefully.',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80',
    brands: ['Corsair', 'HyperX', 'Logitech G', 'Nintendo', 'Razer', 'Sony PlayStation', 'Xbox'],
    flyoutBrands: ['ASUS ROG', 'Corsair', 'Elgato', 'HyperX', 'Lenovo Legion', 'Logitech G', 'Nintendo', 'Razer', 'Sony PlayStation', 'SteelSeries', 'Xbox', 'Zebronics'],
    priceRanges: ['Under ₹1K', '₹1K–5K', '₹5K–25K', '₹25K+'],
    sortOptions: ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Top Rated'],
  },
  {
    slug: 'grocery',
    label: 'Grocery',
    description: 'Everyday pantry staples and household essentials.',
    heroTitle: 'Grocery Deals',
    heroDescription: 'Pantry and daily-use essentials with realistic basket pricing.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80',
    brands: ['Amul', 'Britannia', 'Haldirams', 'ITC', 'MDH', 'Nestle', 'Tata'],
    flyoutBrands: ['Amul', 'Aashirvaad', 'Britannia', 'Haldirams', 'ITC', 'MDH', 'Mother Dairy', 'Nestle', 'Saffola', 'Taj Mahal', 'Tata', 'Yoga Bar'],
    priceRanges: ['Under ₹100', '₹100–500', '₹500–2K', '₹2K+'],
    sortOptions: ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest'],
  },
  {
    slug: 'health',
    label: 'Health',
    description: 'Supplements, medical devices, and wellness products.',
    heroTitle: 'Health & Wellness',
    heroDescription: 'Supplements, monitors, and self-care essentials mapped correctly to health.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80',
    brands: ['Abbott', 'Apollo', 'Cipla', 'Dabur', 'Himalaya', 'Omron', 'Tata 1mg'],
    flyoutBrands: ['Abbott', 'Apollo', 'Cipla', 'Dabur', 'Dr Trust', 'Himalaya', 'Kapiva', 'MuscleBlaze', 'Omron', 'Protinex', 'Tata 1mg', 'Wellbeing Nutrition'],
    priceRanges: ['Under ₹500', '₹500–2K', '₹2K–10K', '₹10K+'],
    sortOptions: ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Top Rated'],
  },
  {
    slug: 'home',
    label: 'Home',
    description: 'Appliances, kitchen, lighting, and cleaning essentials.',
    heroTitle: 'Home Deals',
    heroDescription: 'Practical home upgrades from trusted appliance and decor brands.',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80',
    brands: ['Bosch', 'Crompton', 'Godrej', 'Havells', 'IFB', 'Philips', 'Prestige'],
    flyoutBrands: ['Bosch', 'Crompton', 'Dyson', 'Godrej', 'Havells', 'IFB', 'Karcher', 'LG', 'Philips', 'Prestige', 'Samsung', 'Wonderchef'],
    priceRanges: ['Under ₹1K', '₹1K–5K', '₹5K–25K', '₹25K+'],
    sortOptions: ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Top Rated'],
  },
  {
    slug: 'investments',
    label: 'Investments',
    description: 'Brokerage accounts, mutual fund tools, and long-term wealth products.',
    heroTitle: 'Investment Platforms',
    heroDescription: 'Wealth products and platform offers for disciplined long-term investors.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    brands: ['Angel One', 'ET Money', 'Groww', 'INDmoney', 'Kuvera', 'Smallcase', 'Zerodha'],
    flyoutBrands: ['Angel One', 'ET Money', 'Fisdom', 'Groww', 'INDmoney', 'Kuvera', 'Paytm Money', 'Scripbox', 'Smallcase', 'Upstox', 'Value Research', 'Zerodha'],
    priceRanges: ['Free', '₹500–2K', '₹2K–10K', 'Premium'],
    sortOptions: ['Relevance', 'Newest', 'Top Rated'],
  },
  {
    slug: 'jewellery',
    label: 'Jewellery',
    description: 'Fine jewellery, everyday pieces, and gifting collections.',
    heroTitle: 'Jewellery Picks',
    heroDescription: 'Fine jewellery and everyday sparkle with gift-ready pricing.',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=80',
    brands: ['BlueStone', 'Giva', 'Kalyan', 'Mia', 'Tanishq', 'Voylla'],
    flyoutBrands: ['BlueStone', 'CaratLane', 'Giva', 'Kalyan', 'Kushal', 'Malabar', 'Mia', 'Pipa Bella', 'Senco', 'Tanishq', 'Tribe Amrapali', 'Voylla'],
    priceRanges: ['Under ₹1K', '₹1K–5K', '₹5K–25K', '₹25K+'],
    sortOptions: ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest'],
  },
  {
    slug: 'laptops',
    label: 'Laptops',
    description: 'Student, creator, gaming, and premium laptop deals.',
    heroTitle: 'Laptop Deals',
    heroDescription: 'Student to creator laptops from trusted brands, with realistic India pricing.',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80',
    brands: ['Acer', 'Apple', 'Asus', 'Dell', 'HP', 'Lenovo', 'Microsoft', 'MSI', 'Samsung'],
    flyoutBrands: ['Acer', 'Apple MacBook', 'Asus', 'Dell', 'Framework', 'HP', 'Lenovo', 'LG', 'Microsoft Surface', 'MSI', 'Razer', 'Samsung'],
    priceRanges: ['Under ₹30K', '₹30K–60K', '₹60K–1L', '₹1L+'],
    sortOptions: ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Top Rated'],
  },
  {
    slug: 'mobiles',
    label: 'Mobiles',
    description: 'Budget, mid-range, and flagship smartphones.',
    heroTitle: 'Mobile Phone Deals',
    heroDescription: 'Compare trusted smartphone deals across leading marketplaces.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80',
    brands: ['Apple', 'Motorola', 'Nothing', 'OnePlus', 'Oppo', 'Realme', 'Samsung', 'Vivo', 'Xiaomi'],
    flyoutBrands: ['Apple iPhone', 'Google Pixel', 'iQOO', 'Motorola', 'Nothing Phone', 'Nokia', 'OnePlus', 'Oppo', 'Realme', 'Samsung', 'Vivo', 'Xiaomi'],
    priceRanges: ['Under ₹10K', '₹10K–20K', '₹20K–40K', '₹40K+'],
    sortOptions: ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Top Rated'],
  },
  {
    slug: 'pod',
    label: 'POD',
    description: 'CloudBasket Design Studio originals across mugs, tees, and cases.',
    heroTitle: 'CloudBasket Design Studio',
    heroDescription: 'Print on Demand originals with product-mockup imagery and creator pricing.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&q=80',
    brands: ['CloudBasket Design Studio'],
    flyoutBrands: ['CloudBasket Design Studio', 'Creator Series', 'Minimal Series', 'NEXQON Capsule', 'Office Desk', 'Travel Collection', 'Street Graphic', 'Studio Black', 'Studio Navy', 'Studio White', 'Weekend Drop', 'World Edition'],
    priceRanges: ['Under ₹250', '₹250–500', '₹500–800', '₹800+'],
    sortOptions: ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest'],
  },
  {
    slug: 'sports',
    label: 'Sports',
    description: 'Fitness gear, training accessories, and outdoor performance products.',
    heroTitle: 'Sports & Fitness',
    heroDescription: 'Fitness and sports gear aligned with the approved brand-category mapping.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80',
    brands: ['Adidas', 'Decathlon', 'Fitbit', 'Garmin', 'Nike', 'Puma', 'Reebok', 'Under Armour'],
    flyoutBrands: ['Adidas', 'Asics', 'Decathlon', 'Fitbit', 'Garmin', 'New Balance', 'Nike', 'Polar', 'Puma', 'Reebok', 'Skechers', 'Under Armour'],
    priceRanges: ['Under ₹1K', '₹1K–5K', '₹5K–15K', '₹15K+'],
    sortOptions: ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Top Rated'],
  },
  {
    slug: 'toys',
    label: 'Toys',
    description: 'Learning toys, action sets, and family games.',
    heroTitle: 'Toys & Games',
    heroDescription: 'Family-friendly toys, learning sets, and creative kits.',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1200&q=80',
    brands: ['Barbie', 'Funskool', 'Hasbro', 'Hot Wheels', 'LEGO', 'Melissa & Doug', 'Nerf'],
    flyoutBrands: ['Barbie', 'Funskool', 'Hasbro', 'Hot Wheels', 'LEGO', 'Melissa & Doug', 'Nerf', 'Peppa Pig', 'Play-Doh', 'Skillmatics', 'Toykraft', 'Webby'],
    priceRanges: ['Under ₹500', '₹500–1.5K', '₹1.5K–5K', '₹5K+'],
    sortOptions: ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Top Rated'],
  },
  {
    slug: 'travel',
    label: 'Travel',
    description: 'Luggage, travel accessories, and booking-friendly trip products.',
    heroTitle: 'Travel Essentials',
    heroDescription: 'Travel-ready gear that keeps bookings, luggage, and accessories aligned.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80',
    brands: ['American Tourister', 'Goibibo', 'MakeMyTrip', 'Samsonite', 'Safari', 'Skybags'],
    flyoutBrands: ['American Tourister', 'Away', 'Goibibo', 'MakeMyTrip', 'Mokobara', 'Nasher Miles', 'Samsonite', 'Safari', 'Skyscanner', 'Skybags', 'Tripole', 'Wildcraft'],
    priceRanges: ['Under ₹500', '₹500–2K', '₹2K–10K', '₹10K+'],
    sortOptions: ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest'],
  },
  {
    slug: 'watches',
    label: 'Watches',
    description: 'Classic, smart, and sport watches with brand-aligned pricing.',
    heroTitle: 'Watch Deals',
    heroDescription: 'From analog classics to smartwatches, compare without guesswork.',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200&q=80',
    brands: ['Apple', 'Casio', 'Fossil', 'Garmin', 'Noise', 'Samsung', 'Titan'],
    flyoutBrands: ['Apple Watch', 'Casio', 'Citizen', 'Fossil', 'Garmin', 'G-Shock', 'Michael Kors', 'Noise', 'Samsung', 'Skagen', 'Timex', 'Titan'],
    priceRanges: ['Under ₹2K', '₹2K–10K', '₹10K–25K', '₹25K+'],
    sortOptions: ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Top Rated'],
  },
]

const bySlug = Object.fromEntries(CATEGORY_DEFINITIONS.map((category) => [category.slug, category])) as Record<
  CategorySlug,
  CategoryDefinition
>

export const CATEGORY_ORDER = CATEGORY_DEFINITIONS.map((category) => category.slug)
export const CATEGORY_COUNT = CATEGORY_DEFINITIONS.length
export const FILTER_CONFIG = Object.fromEntries(
  CATEGORY_DEFINITIONS.map((category) => [
    category.slug,
    {
      brands: category.brands,
      priceRanges: category.priceRanges,
      sortOptions: category.sortOptions,
    },
  ]),
) as Record<CategorySlug, { brands: string[]; priceRanges: string[]; sortOptions: string[] }>

const catalogProducts: CatalogProduct[] = [
  { id: 'mob-001', brand: 'Samsung', title: 'Samsung Galaxy A55 5G', category: 'mobiles', price: 34999, mrp: 41999, rating: 4.4, reviewCount: 12450, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80', platform: 'Flipkart', affiliateUrl: buildFlipkartUrl('samsung-galaxy-a55-5g', 'itmcbsa55'), description: '6.6-inch AMOLED display, 50MP OIS camera, and dependable daily performance.', specs: ['128GB', '8GB RAM', '5000mAh', '50MP OIS'], publishedAt: date },
  { id: 'mob-002', brand: 'Apple', title: 'Apple iPhone 15 128GB', category: 'mobiles', price: 68900, mrp: 79900, rating: 4.8, reviewCount: 34120, image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0CHX2F5QT'), description: 'Dynamic Island, USB-C, and all-day battery in a balanced flagship.', specs: ['128GB', 'A16 Bionic', '48MP', 'USB-C'], publishedAt: date },
  { id: 'mob-003', brand: 'OnePlus', title: 'OnePlus 12R 5G', category: 'mobiles', price: 38999, mrp: 45999, rating: 4.5, reviewCount: 9300, image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0CPM72P4K'), description: 'Snapdragon 8 Gen 2 power, bright AMOLED display, and fast charging.', specs: ['256GB', '8 Gen 2', '5500mAh', '100W'], publishedAt: date },
  { id: 'mob-004', brand: 'Xiaomi', title: 'Xiaomi Redmi Note 13 Pro 5G', category: 'mobiles', price: 23999, mrp: 28999, rating: 4.3, reviewCount: 18800, image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80', platform: 'Flipkart', affiliateUrl: buildFlipkartUrl('xiaomi-redmi-note-13-pro-5g', 'itmcbnote13'), description: '200MP camera-led mid-range phone with sharp design and vivid screen.', specs: ['256GB', '8GB RAM', '200MP', '67W'], publishedAt: date },
  { id: 'mob-005', brand: 'Realme', title: 'realme 12 Pro+ 5G', category: 'mobiles', price: 26999, mrp: 31999, rating: 4.2, reviewCount: 8420, image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80', platform: 'Flipkart', affiliateUrl: buildFlipkartUrl('realme-12-pro-plus-5g', 'itmcbrealme12'), description: 'Periscope camera and curved display tuned for social-first buyers.', specs: ['256GB', '8GB RAM', 'Periscope', '67W'], publishedAt: date },
  { id: 'mob-006', brand: 'Oppo', title: 'Oppo Reno12 5G', category: 'mobiles', price: 32999, mrp: 38999, rating: 4.1, reviewCount: 3820, image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0D9OPPO12'), description: 'Slim 5G phone with portrait-focused cameras and polished finish.', specs: ['256GB', '8GB RAM', 'AI Camera', '5000mAh'], publishedAt: date },
  { id: 'mob-007', brand: 'Vivo', title: 'vivo V30 5G', category: 'mobiles', price: 33999, mrp: 39999, rating: 4.2, reviewCount: 5210, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80', platform: 'Flipkart', affiliateUrl: buildFlipkartUrl('vivo-v30-5g', 'itmcbv30'), description: 'ZEISS-backed portraits and light, premium styling for everyday use.', specs: ['256GB', '8GB RAM', 'ZEISS', '80W'], publishedAt: date },
  { id: 'mob-008', brand: 'Motorola', title: 'Motorola Edge 50 Pro', category: 'mobiles', price: 29999, mrp: 35999, rating: 4.4, reviewCount: 6120, image: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800&q=80', platform: 'Flipkart', affiliateUrl: buildFlipkartUrl('motorola-edge-50-pro', 'itmcbedge50'), description: 'Pantone-tuned design with clean Android and a strong fast-charge bundle.', specs: ['256GB', '125W', '144Hz', '50MP'], publishedAt: date },
  { id: 'mob-009', brand: 'Nothing', title: 'Nothing Phone (2a) Plus', category: 'mobiles', price: 27999, mrp: 32999, rating: 4.5, reviewCount: 4890, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DNOTHING2A'), description: 'Distinctive glyph interface with balanced performance and clean software.', specs: ['256GB', '12GB RAM', 'AMOLED', '5000mAh'], publishedAt: date },
  { id: 'mob-010', brand: 'Apple', title: 'Apple iPhone 16 Pro 128GB', category: 'mobiles', price: 119900, mrp: 139900, rating: 4.8, reviewCount: 8200, image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DAPPLE16P'), description: 'Flagship titanium build, advanced camera stack, and premium endurance.', specs: ['128GB', 'Pro Camera', 'Titanium', 'A18 Pro'], publishedAt: date },
  { id: 'lap-001', brand: 'Dell', title: 'Dell Inspiron 14 5440', category: 'laptops', price: 58990, mrp: 70990, rating: 4.3, reviewCount: 3610, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80', platform: 'Flipkart', affiliateUrl: buildFlipkartUrl('dell-inspiron-14-5440', 'itmcbdell5440'), description: 'Everyday productivity laptop with solid keyboard and dependable thermal tuning.', specs: ['Core 5', '16GB RAM', '512GB SSD', '14-inch'], publishedAt: date },
  { id: 'lap-002', brand: 'HP', title: 'HP Pavilion Plus 14', category: 'laptops', price: 76990, mrp: 91990, rating: 4.4, reviewCount: 2150, image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DHPPAV14'), description: 'Portable OLED notebook with good battery life for study and work.', specs: ['Ryzen 7', '16GB RAM', '1TB SSD', 'OLED'], publishedAt: date },
  { id: 'lap-003', brand: 'Lenovo', title: 'Lenovo IdeaPad Slim 5', category: 'laptops', price: 64990, mrp: 78990, rating: 4.4, reviewCount: 4890, image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80', platform: 'Flipkart', affiliateUrl: buildFlipkartUrl('lenovo-ideapad-slim-5', 'itmcblenos5'), description: 'Reliable mid-range laptop with comfortable keyboard and bright display.', specs: ['Core Ultra 5', '16GB RAM', '512GB SSD', 'WUXGA'], publishedAt: date },
  { id: 'lap-004', brand: 'Asus', title: 'ASUS Vivobook 15 OLED', category: 'laptops', price: 55990, mrp: 67990, rating: 4.5, reviewCount: 6120, image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DASUSVBO15'), description: 'Value OLED machine for entertainment, writing, and light creative work.', specs: ['Ryzen 5', '16GB RAM', '512GB SSD', 'OLED'], publishedAt: date },
  { id: 'lap-005', brand: 'Apple', title: 'Apple MacBook Air M3 13-inch', category: 'laptops', price: 104900, mrp: 124900, rating: 4.8, reviewCount: 11320, image: 'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DCBMAIRM3'), description: 'Quiet, efficient laptop with strong battery life and polished display.', specs: ['M3', '8GB Unified', '256GB SSD', 'Liquid Retina'], publishedAt: date },
  { id: 'lap-006', brand: 'Acer', title: 'Acer Swift Go 14', category: 'laptops', price: 69990, mrp: 84990, rating: 4.2, reviewCount: 1840, image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80', platform: 'Flipkart', affiliateUrl: buildFlipkartUrl('acer-swift-go-14', 'itmcbswiftgo14'), description: 'Portable work machine with sharp OLED panel and light metal body.', specs: ['Core Ultra 5', '16GB RAM', '512GB SSD', 'OLED'], publishedAt: date },
  { id: 'lap-007', brand: 'MSI', title: 'MSI Thin GF63 Gaming Laptop', category: 'laptops', price: 72990, mrp: 87990, rating: 4.2, reviewCount: 2310, image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DMSIGF63'), description: 'Entry gaming laptop with RTX graphics and upgrade-friendly chassis.', specs: ['RTX 4050', '16GB RAM', '512GB SSD', '144Hz'], publishedAt: date },
  { id: 'lap-008', brand: 'Microsoft', title: 'Microsoft Surface Laptop 6', category: 'laptops', price: 134990, mrp: 159990, rating: 4.6, reviewCount: 920, image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80', platform: 'CJ Global', affiliateUrl: buildCjUrl('surface-laptop-6'), description: 'Premium ultraportable with clean design and excellent trackpad feel.', specs: ['Core Ultra 7', '16GB RAM', '512GB SSD', 'Touch'], publishedAt: date },
  { id: 'lap-009', brand: 'Samsung', title: 'Samsung Galaxy Book4', category: 'laptops', price: 67990, mrp: 81990, rating: 4.3, reviewCount: 1280, image: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DSAMGB4'), description: 'Balanced Windows laptop for phone-laptop ecosystem users.', specs: ['Core 5', '16GB RAM', '512GB SSD', 'FHD'], publishedAt: date },
  { id: 'ele-001', brand: 'Logitech', title: 'Logitech MX Master 3S', category: 'electronics', price: 6495, mrp: 7995, rating: 4.8, reviewCount: 9520, image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B09HM94VDS'), description: 'The benchmark productivity mouse with quiet clicks and reliable battery.', specs: ['Quiet Clicks', 'USB-C', '8K DPI', 'Bluetooth'], publishedAt: date },
  { id: 'ele-002', brand: 'Samsung', title: 'Samsung Crystal 4K UHD TV 55-inch', category: 'electronics', price: 44990, mrp: 56990, rating: 4.4, reviewCount: 4820, image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80', platform: 'Flipkart', affiliateUrl: buildFlipkartUrl('samsung-crystal-4k-uhd-tv-55-inch', 'itmcbsamtv55'), description: 'Bright 4K panel and smart TV features in a popular family-size format.', specs: ['55-inch', '4K UHD', 'Smart TV', 'HDR'], publishedAt: date },
  { id: 'ele-003', brand: 'Sony', title: 'Sony WH-1000XM5', category: 'electronics', price: 24990, mrp: 29990, rating: 4.7, reviewCount: 6880, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B09XS7JWHH'), description: 'Premium ANC headphones with excellent travel and work performance.', specs: ['ANC', '30 Hours', 'Bluetooth', 'Multipoint'], publishedAt: date },
  { id: 'ele-004', brand: 'Canon', title: 'Canon EOS R50 Mirrorless Kit', category: 'electronics', price: 64999, mrp: 79999, rating: 4.6, reviewCount: 1630, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80', platform: 'CJ Global', affiliateUrl: buildCjUrl('canon-eos-r50-kit'), description: 'Light creator camera with reliable autofocus and approachable learning curve.', specs: ['24.2MP', '4K', 'RF-S Lens', 'APS-C'], publishedAt: date },
  { id: 'ele-005', brand: 'LG', title: 'LG UltraWide Monitor 29-inch', category: 'electronics', price: 17999, mrp: 22999, rating: 4.5, reviewCount: 2100, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DLGULTRA29'), description: 'Affordable ultrawide screen for multitasking desks and hybrid work.', specs: ['29-inch', 'IPS', 'USB-C', '21:9'], publishedAt: date },
  { id: 'ele-006', brand: 'Anker', title: 'Anker 737 Power Bank', category: 'electronics', price: 8999, mrp: 10999, rating: 4.6, reviewCount: 1520, image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80', platform: 'CJ Global', affiliateUrl: buildCjUrl('anker-737-power-bank'), description: 'High-output travel battery with laptop-friendly USB-C charging.', specs: ['24,000mAh', '140W', 'USB-C', 'Display'], publishedAt: date },
  { id: 'bea-001', brand: "L'Oreal", title: "L'Oreal Paris Hyaluron Moisture Shampoo", category: 'beauty', price: 399, mrp: 499, rating: 4.4, reviewCount: 12650, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DLOREALSH'), description: 'Hydrating everyday shampoo that fits realistic personal-care pricing.', specs: ['340ml', 'Hydrating', 'Haircare'], publishedAt: date },
  { id: 'bea-002', brand: 'Maybelline', title: 'Maybelline Fit Me Matte + Poreless Foundation', category: 'beauty', price: 549, mrp: 699, rating: 4.5, reviewCount: 18340, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80', platform: 'Flipkart', affiliateUrl: buildFlipkartUrl('maybelline-fit-me-foundation', 'itmcbfitme'), description: 'Everyday matte foundation with flexible shades and lasting wear.', specs: ['Liquid', 'Matte', '30ml'], publishedAt: date },
  { id: 'bea-003', brand: 'Lakme', title: 'Lakme 9to5 Vitamin C Day Cream', category: 'beauty', price: 329, mrp: 399, rating: 4.2, reviewCount: 5210, image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DLAKMEVITC'), description: 'Budget-friendly daily cream with vitamin-C positioning and realistic pricing.', specs: ['50g', 'Day Cream', 'Vitamin C'], publishedAt: date },
  { id: 'bea-004', brand: 'Biotique', title: 'Biotique Bio Neem Face Wash', category: 'beauty', price: 219, mrp: 275, rating: 4.1, reviewCount: 8900, image: 'https://images.unsplash.com/photo-1556228578-dd6dd909e1d6?w=800&q=80', platform: 'Flipkart', affiliateUrl: buildFlipkartUrl('biotique-bio-neem-face-wash', 'itmcbbiowash'), description: 'Classic herbal face wash for oily-skin routines with proper entry pricing.', specs: ['150ml', 'Neem', 'Face Wash'], publishedAt: date },
  { id: 'bea-005', brand: 'Nykaa', title: 'Nykaa SKINRX Ceramide Barrier Moisturizer', category: 'beauty', price: 649, mrp: 799, rating: 4.3, reviewCount: 2430, image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DNYKAACER'), description: 'Barrier-support moisturizer with value-led mid-tier pricing.', specs: ['50g', 'Ceramide', 'Moisturizer'], publishedAt: date },
  { id: 'bea-006', brand: 'Forest Essentials', title: 'Forest Essentials Facial Cleanser Kashmiri Saffron', category: 'beauty', price: 1450, mrp: 1695, rating: 4.6, reviewCount: 810, image: 'https://images.unsplash.com/photo-1503236823255-94609f598e71?w=800&q=80', platform: 'CJ Global', affiliateUrl: buildCjUrl('forest-essentials-cleanser'), description: 'Premium cleanser for buyers seeking luxury Ayurvedic skincare.', specs: ['100ml', 'Saffron', 'Cleanser'], publishedAt: date },
  { id: 'bea-007', brand: 'Himalaya', title: 'Himalaya Purifying Neem Pack', category: 'beauty', price: 169, mrp: 210, rating: 4.2, reviewCount: 7360, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DHIMNEEM'), description: 'Affordable face pack with skincare pricing aligned to the category.', specs: ['100g', 'Neem', 'Face Pack'], publishedAt: date },
  { id: 'gro-001', brand: 'Amul', title: 'Amul Pure Ghee 1L Pack', category: 'grocery', price: 689, mrp: 799, rating: 4.6, reviewCount: 5840, image: 'https://images.unsplash.com/photo-1506617420156-8e4536971650?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DAMULGHEE'), description: 'Kitchen staple priced within a normal grocery basket.', specs: ['1L', 'Ghee', 'Pantry'], publishedAt: date },
  { id: 'gro-002', brand: 'Nestle', title: 'Nestle Everyday Dairy Whitener 1kg', category: 'grocery', price: 459, mrp: 540, rating: 4.5, reviewCount: 4220, image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80', platform: 'Flipkart', affiliateUrl: buildFlipkartUrl('nestle-everyday-dairy-whitener-1kg', 'itmcbnestlekg'), description: 'Pantry refill pack with realistic grocery pricing and frequent deal windows.', specs: ['1kg', 'Dairy Whitener', 'Breakfast'], publishedAt: date },
  { id: 'gro-003', brand: 'ITC', title: 'Aashirvaad Shudh Chakki Atta 10kg', category: 'grocery', price: 495, mrp: 575, rating: 4.7, reviewCount: 7020, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DAASHATTA'), description: 'Large pantry staple suited to basket pricing, not gadget pricing.', specs: ['10kg', 'Atta', 'Staple'], publishedAt: date },
  { id: 'gro-004', brand: 'Britannia', title: 'Britannia Good Day Cashew Cookies Combo', category: 'grocery', price: 149, mrp: 180, rating: 4.3, reviewCount: 9100, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80', platform: 'Flipkart', affiliateUrl: buildFlipkartUrl('britannia-good-day-cashew-cookies-combo', 'itmcbbritgood'), description: 'Fast-moving snack bundle with everyday cart-friendly pricing.', specs: ['Combo', 'Snacks', 'Tea-time'], publishedAt: date },
  { id: 'gro-005', brand: 'Haldirams', title: 'Haldirams Bhujia Namkeen Family Pack', category: 'grocery', price: 110, mrp: 140, rating: 4.4, reviewCount: 3510, image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DHALDIRAM'), description: 'Family-size namkeen pack with realistic save margins.', specs: ['1 Pack', 'Namkeen', 'Snacks'], publishedAt: date },
  { id: 'gro-006', brand: 'MDH', title: 'MDH Kitchen King Masala Value Pack', category: 'grocery', price: 89, mrp: 110, rating: 4.5, reviewCount: 4870, image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=800&q=80', platform: 'Flipkart', affiliateUrl: buildFlipkartUrl('mdh-kitchen-king-masala-value-pack', 'itmcbmdhking'), description: 'Spice pack aligned to grocery pricing and pantry use.', specs: ['200g', 'Masala', 'Pantry'], publishedAt: date },
  { id: 'gro-007', brand: 'Tata', title: 'Tata Sampann Unpolished Toor Dal 1kg', category: 'grocery', price: 189, mrp: 235, rating: 4.4, reviewCount: 2940, image: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e3?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DTATADAL'), description: 'Core pantry pick with credible grocery pricing.', specs: ['1kg', 'Dal', 'Staple'], publishedAt: date },
  { id: 'hea-001', brand: 'Abbott', title: 'Ensure Diabetes Care Vanilla 400g', category: 'health', price: 749, mrp: 899, rating: 4.4, reviewCount: 5230, image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DABBOTTEN'), description: 'Condition-specific nutrition powder with health-led product mapping.', specs: ['400g', 'Nutrition', 'Diabetes Care'], publishedAt: date },
  { id: 'hea-002', brand: 'Cipla', title: 'Cipla Maxirich Daily Multivitamin', category: 'health', price: 399, mrp: 499, rating: 4.3, reviewCount: 3620, image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800&q=80', platform: 'Flipkart', affiliateUrl: buildFlipkartUrl('cipla-maxirich-daily-multivitamin', 'itmcbmaxirich'), description: 'Routine multivitamin with sensible supplement pricing.', specs: ['60 Tablets', 'Multivitamin', 'Daily Use'], publishedAt: date },
  { id: 'hea-003', brand: 'Himalaya', title: 'Himalaya Liv.52 Tablets', category: 'health', price: 209, mrp: 249, rating: 4.5, reviewCount: 4210, image: 'https://images.unsplash.com/photo-1573883430697-4c3479aae6b9?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DHIMLIV52'), description: 'Long-running wellness product with appropriate OTC price band.', specs: ['100 Tablets', 'Wellness', 'Supplements'], publishedAt: date },
  { id: 'hea-004', brand: 'Dabur', title: 'Dabur Chyawanprash 1kg', category: 'health', price: 329, mrp: 399, rating: 4.6, reviewCount: 10420, image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&q=80', platform: 'Flipkart', affiliateUrl: buildFlipkartUrl('dabur-chyawanprash-1kg', 'itmcbdaburchya'), description: 'Seasonal immunity staple with realistic family-pack pricing.', specs: ['1kg', 'Ayurvedic', 'Immunity'], publishedAt: date },
  { id: 'hea-005', brand: 'Apollo', title: 'Apollo Premium Digital Thermometer', category: 'health', price: 249, mrp: 320, rating: 4.2, reviewCount: 1880, image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DAPOLLOTH'), description: 'Simple household health device with entry-level price point.', specs: ['Digital', 'Fast Read', 'Portable'], publishedAt: date },
  { id: 'hea-006', brand: 'Omron', title: 'Omron HEM 7120 BP Monitor', category: 'health', price: 2499, mrp: 3199, rating: 4.6, reviewCount: 8930, image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DOMRON7120'), description: 'Trusted home blood pressure monitor with strong category alignment.', specs: ['BP Monitor', 'Arm Cuff', 'Memory'], publishedAt: date },
  { id: 'hea-007', brand: 'Tata 1mg', title: 'Tata 1mg Whey Protein Concentrate 1kg', category: 'health', price: 1899, mrp: 2299, rating: 4.1, reviewCount: 1420, image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&q=80', platform: 'Flipkart', affiliateUrl: buildFlipkartUrl('tata-1mg-whey-protein-concentrate-1kg', 'itmcbt1mgwhey'), description: 'Protein powder in a believable supplement price range.', specs: ['1kg', '24g Protein', 'Sports Nutrition'], publishedAt: date },
  { id: 'hom-001', brand: 'Philips', title: 'Philips Air Fryer NA120/00', category: 'home', price: 6499, mrp: 7999, rating: 4.5, reviewCount: 8760, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DPHILAF'), description: 'Popular kitchen essential with realistic mass-market appliance pricing.', specs: ['4.2L', 'Air Fryer', 'Preset Menu'], publishedAt: date },
  { id: 'hom-002', brand: 'Prestige', title: 'Prestige PIC 20 Induction Cooktop', category: 'home', price: 1799, mrp: 2299, rating: 4.2, reviewCount: 14200, image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80', platform: 'Flipkart', affiliateUrl: buildFlipkartUrl('prestige-pic-20-induction-cooktop', 'itmcbprestige20'), description: 'Everyday cooktop with dependable entry pricing.', specs: ['1200W', 'Cooktop', 'Indian Menu'], publishedAt: date },
  { id: 'hom-003', brand: 'Havells', title: 'Havells Stealth Air Ceiling Fan', category: 'home', price: 2999, mrp: 3899, rating: 4.3, reviewCount: 2640, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DHAVFAN'), description: 'Clean ceiling fan option for home upgrades on a budget.', specs: ['1200mm', 'Ceiling Fan', 'Decor'], publishedAt: date },
  { id: 'hom-004', brand: 'Crompton', title: 'Crompton InstaBliss Water Heater', category: 'home', price: 5499, mrp: 6799, rating: 4.1, reviewCount: 2190, image: 'https://images.unsplash.com/photo-1556909114-44e0ee7b5c6b?w=800&q=80', platform: 'Flipkart', affiliateUrl: buildFlipkartUrl('crompton-instabliss-water-heater', 'itmcbcromheat'), description: 'Practical bathroom upgrade in a typical mid-range water-heater band.', specs: ['3L', 'Water Heater', 'Safety'], publishedAt: date },
  { id: 'hom-005', brand: 'Bosch', title: 'Bosch Series 4 Dishwasher', category: 'home', price: 37990, mrp: 46990, rating: 4.5, reviewCount: 980, image: 'https://images.unsplash.com/photo-1586201375761-83865001e17c?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DBOSCHDW'), description: 'Premium dishwasher pricing aligned to current India market levels.', specs: ['12 Place', 'Dishwasher', 'Eco Wash'], publishedAt: date },
  { id: 'hom-006', brand: 'IFB', title: 'IFB Front Load Washing Machine 8kg', category: 'home', price: 29990, mrp: 36990, rating: 4.4, reviewCount: 1320, image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&q=80', platform: 'Flipkart', affiliateUrl: buildFlipkartUrl('ifb-front-load-washing-machine-8kg', 'itmcbifb8kg'), description: 'Front-load washer for medium households with realistic appliance pricing.', specs: ['8kg', 'Front Load', 'Steam'], publishedAt: date },
  { id: 'hom-007', brand: 'Godrej', title: 'Godrej Double Door Refrigerator 244L', category: 'home', price: 23990, mrp: 28990, rating: 4.3, reviewCount: 2240, image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DGODR244L'), description: 'Popular fridge size with believable seasonal deal discounting.', specs: ['244L', 'Double Door', 'Inverter'], publishedAt: date },
  { id: 'aut-001', brand: 'Bosch', title: 'Bosch Aerotwin Front Wiper Blades', category: 'automotive', price: 1199, mrp: 1499, rating: 4.4, reviewCount: 1180, image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DBOSCHWIP'), description: 'Popular upgrade for better visibility during monsoon driving.', specs: ['Pair', 'Wiper', 'Car Care'], publishedAt: date },
  { id: 'aut-002', brand: '3M', title: '3M Car Care Interior Cleaner', category: 'automotive', price: 399, mrp: 499, rating: 4.3, reviewCount: 2820, image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80', platform: 'Flipkart', affiliateUrl: buildFlipkartUrl('3m-car-care-interior-cleaner', 'itmcb3mclean'), description: 'Everyday detailing pick with expected automotive consumable pricing.', specs: ['500ml', 'Interior Cleaner', 'Detailing'], publishedAt: date },
  { id: 'aut-003', brand: 'Castrol', title: 'Castrol Magnatec Engine Oil 3.5L', category: 'automotive', price: 1899, mrp: 2299, rating: 4.6, reviewCount: 4310, image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DCASTROL35'), description: 'Routine service purchase mapped correctly to automotive instead of unrelated pages.', specs: ['3.5L', 'Engine Oil', 'Service'], publishedAt: date },
  { id: 'aut-004', brand: 'Michelin', title: 'Michelin Portable Digital Tyre Inflator', category: 'automotive', price: 2499, mrp: 3099, rating: 4.5, reviewCount: 1380, image: 'https://images.unsplash.com/photo-1492144531155-ad8d5f4c2921?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DMICHELINI'), description: 'Road-trip essential with realistic gadget-adjacent pricing.', specs: ['Tyre Inflator', 'Digital', 'Portable'], publishedAt: date },
  { id: 'aut-005', brand: 'JBL', title: 'JBL Stage 9603 Coaxial Car Speakers', category: 'automotive', price: 3299, mrp: 3999, rating: 4.4, reviewCount: 970, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80', platform: 'Flipkart', affiliateUrl: buildFlipkartUrl('jbl-stage-9603-coaxial-car-speakers', 'itmcbjbl9603'), description: 'In-car audio upgrade priced like a real mid-range speaker set.', specs: ['6x9"', 'Car Audio', '300W'], publishedAt: date },
  { id: 'aut-006', brand: "Meguiar's", title: "Meguiar's Ultimate Wash & Wax", category: 'automotive', price: 1499, mrp: 1799, rating: 4.6, reviewCount: 760, image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80', platform: 'CJ Global', affiliateUrl: buildCjUrl('meguiars-ultimate-wash-and-wax'), description: 'Premium detailing liquid for enthusiasts who want better finish quality.', specs: ['1.4L', 'Wash & Wax', 'Detailing'], publishedAt: date },
  { id: 'boo-001', brand: 'Penguin', title: 'Atomic Habits', category: 'books', price: 399, mrp: 499, rating: 4.8, reviewCount: 22750, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('014345667X'), description: 'James Clear · Penguin. Habit-building bestseller with steady reader demand.', specs: ['James Clear', 'Penguin', 'Paperback'], publishedAt: date },
  { id: 'boo-002', brand: 'Harper Collins', title: 'The Psychology of Money', category: 'books', price: 299, mrp: 399, rating: 4.8, reviewCount: 19840, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('0857197681'), description: 'Morgan Housel · Harper Collins. Popular money mindset book for general readers.', specs: ['Morgan Housel', 'Harper Collins', 'Paperback'], publishedAt: date },
  { id: 'boo-003', brand: 'Rupa', title: 'The Alchemist', category: 'books', price: 249, mrp: 299, rating: 4.7, reviewCount: 14100, image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80', platform: 'Flipkart', affiliateUrl: buildFlipkartUrl('the-alchemist-paulo-coelho', 'itmcbalchemist'), description: 'Paulo Coelho · Rupa. Classic inspirational fiction in an affordable price band.', specs: ['Paulo Coelho', 'Rupa', 'Paperback'], publishedAt: date },
  { id: 'boo-004', brand: 'Scholastic', title: "Harry Potter and the Philosopher's Stone", category: 'books', price: 349, mrp: 425, rating: 4.9, reviewCount: 17640, image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('1408855658'), description: 'J.K. Rowling · Scholastic. Evergreen fantasy favorite for younger readers.', specs: ['J.K. Rowling', 'Scholastic', 'Paperback'], publishedAt: date },
  { id: 'boo-005', brand: 'Oxford', title: 'Oxford School Atlas', category: 'books', price: 189, mrp: 225, rating: 4.5, reviewCount: 3320, image: 'https://images.unsplash.com/photo-1455885666463-7f3763be4db0?w=800&q=80', platform: 'Flipkart', affiliateUrl: buildFlipkartUrl('oxford-school-atlas', 'itmcbatlas'), description: 'Oxford. Popular education title with consistent student demand.', specs: ['Oxford', 'Atlas', 'Paperback'], publishedAt: date },
  { id: 'fin-001', brand: 'HDFC', title: 'HDFC Millennia Credit Card', category: 'finance', price: 1000, mrp: 1500, rating: 4.4, reviewCount: 1860, image: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=800&q=80', platform: 'CJ Global', affiliateUrl: buildCjUrl('hdfc-millennia-credit-card'), description: 'Cashback-led credit card offer with clear category alignment to finance.', specs: ['Cashback', 'Credit Card', 'Online Spend'], publishedAt: date },
  { id: 'fin-002', brand: 'SBI', title: 'SBI Health Insurance Family Floater', category: 'finance', price: 18499, mrp: 22499, rating: 4.2, reviewCount: 720, image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80', platform: 'CJ Global', affiliateUrl: buildCjUrl('sbi-health-insurance-family-floater'), description: 'Health policy listing for finance category pages and search results.', specs: ['Insurance', 'Family Floater', 'Cashless'], publishedAt: date },
  { id: 'fin-003', brand: 'Axis Bank', title: 'Axis Ace Credit Card', category: 'finance', price: 499, mrp: 999, rating: 4.3, reviewCount: 1190, image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80', platform: 'CJ Global', affiliateUrl: buildCjUrl('axis-ace-credit-card'), description: 'Low-fee cashback card offer that belongs on finance, not books.', specs: ['Cashback', 'Credit Card', 'Low Fee'], publishedAt: date },
  { id: 'fin-004', brand: 'Bajaj Finance', title: 'Bajaj Finance Insta EMI Card', category: 'finance', price: 530, mrp: 699, rating: 4.1, reviewCount: 890, image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80', platform: 'CJ Global', affiliateUrl: buildCjUrl('bajaj-finance-insta-emi-card'), description: 'EMI offer product mapped accurately to finance.', specs: ['EMI Card', 'Consumer Finance', 'Online Approval'], publishedAt: date },
  { id: 'fin-005', brand: 'Groww', title: 'Groww Stocks + Mutual Funds Account', category: 'finance', price: 0, mrp: 499, rating: 4.5, reviewCount: 2480, image: 'https://images.unsplash.com/photo-1640161704729-cbe966a08476?w=800&q=80', platform: 'CJ Global', affiliateUrl: buildCjUrl('groww-stocks-and-mf-account'), description: 'Zero-opening-cost investment account product for finance searches.', specs: ['Demat', 'Mutual Funds', 'Beginner Friendly'], publishedAt: date },
  { id: 'fin-006', brand: 'Zerodha', title: 'Zerodha Demat + Trading Account', category: 'finance', price: 300, mrp: 400, rating: 4.7, reviewCount: 3520, image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&q=80', platform: 'CJ Global', affiliateUrl: buildCjUrl('zerodha-demat-trading-account'), description: 'Well-known investing account listed under the correct category.', specs: ['Demat', 'Trading', 'Low Brokerage'], publishedAt: date },
  { id: 'fin-007', brand: 'Policy Bazaar', title: 'Policy Bazaar Term Life Cover', category: 'finance', price: 12499, mrp: 14999, rating: 4.3, reviewCount: 610, image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80', platform: 'CJ Global', affiliateUrl: buildCjUrl('policy-bazaar-term-life-cover'), description: 'Insurance listing to keep the finance URL semantically correct.', specs: ['Term Insurance', 'Life Cover', 'Online Quote'], publishedAt: date },
  { id: 'gam-001', brand: 'Sony PlayStation', title: 'Sony PlayStation 5 Slim Console', category: 'gaming', price: 44990, mrp: 54990, rating: 4.8, reviewCount: 4280, image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80', platform: 'Flipkart', affiliateUrl: buildFlipkartUrl('sony-playstation-5-slim-console', 'itmcbps5slim'), description: 'Current-generation console with realistic India pricing.', specs: ['Console', '1TB SSD', '4K Gaming'], publishedAt: date },
  { id: 'gam-002', brand: 'Xbox', title: 'Xbox Series S 512GB', category: 'gaming', price: 29990, mrp: 35990, rating: 4.6, reviewCount: 2180, image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DXBOXS512'), description: 'Compact console for Game Pass-first households.', specs: ['512GB SSD', 'Console', 'Digital'], publishedAt: date },
  { id: 'gam-003', brand: 'Razer', title: 'Razer BlackShark V2 X Gaming Headset', category: 'gaming', price: 3499, mrp: 4299, rating: 4.4, reviewCount: 5930, image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DRAZERBV2X'), description: 'Competitive headset with believable gaming-accessory pricing.', specs: ['Headset', '7.1 Surround', 'Gaming'], publishedAt: date },
  { id: 'gam-004', brand: 'HyperX', title: 'HyperX Alloy Origins Core Keyboard', category: 'gaming', price: 6999, mrp: 8499, rating: 4.5, reviewCount: 1850, image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80', platform: 'CJ Global', affiliateUrl: buildCjUrl('hyperx-alloy-origins-core'), description: 'Compact gaming keyboard priced appropriately for enthusiasts.', specs: ['TKL', 'Mechanical', 'RGB'], publishedAt: date },
  { id: 'gam-005', brand: 'Corsair', title: 'Corsair HS55 Stereo Gaming Headset', category: 'gaming', price: 4499, mrp: 5499, rating: 4.3, reviewCount: 1420, image: 'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DCORSAIRHS55'), description: 'Balanced gaming audio choice for console and PC setups.', specs: ['Headset', 'Stereo', 'Cross-platform'], publishedAt: date },
  { id: 'fas-001', brand: 'Nike', title: 'Nike Dri-FIT Training Tee', category: 'fashion', price: 1299, mrp: 1699, rating: 4.4, reviewCount: 2480, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DNIKEDRIFT'), description: 'Everyday performance tee with sensible fashion pricing.', specs: ['Tee', 'Training', 'Dri-FIT'], publishedAt: date },
  { id: 'fas-002', brand: "Levi's", title: "Levi's 511 Slim Fit Jeans", category: 'fashion', price: 2199, mrp: 2999, rating: 4.5, reviewCount: 14260, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80', platform: 'Flipkart', affiliateUrl: buildFlipkartUrl('levis-511-slim-fit-jeans', 'itmcb511jean'), description: 'A dependable denim staple with realistic seasonal discounting.', specs: ['Denim', 'Slim Fit', 'Menswear'], publishedAt: date },
  { id: 'fas-003', brand: 'Puma', title: 'Puma Smashic Sneakers', category: 'fashion', price: 2499, mrp: 3499, rating: 4.3, reviewCount: 3670, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DPUMASMASH'), description: 'Affordable everyday sneaker priced in a normal fashion band.', specs: ['Sneakers', 'Lifestyle', 'Footwear'], publishedAt: date },
  { id: 'fas-004', brand: 'Biba', title: 'Biba Printed Kurta Set', category: 'fashion', price: 1899, mrp: 2499, rating: 4.2, reviewCount: 1940, image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80', platform: 'Flipkart', affiliateUrl: buildFlipkartUrl('biba-printed-kurta-set', 'itmcbbibakurta'), description: 'Popular ethnicwear pick with a credible discount spread.', specs: ['Kurta Set', 'Ethnic', 'Womenswear'], publishedAt: date },
  { id: 'fas-005', brand: 'Zara', title: 'Zara Structured Mini Crossbody Bag', category: 'fashion', price: 2790, mrp: 3490, rating: 4.1, reviewCount: 820, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80', platform: 'CJ Global', affiliateUrl: buildCjUrl('zara-structured-mini-crossbody-bag'), description: 'Fashion accessory deal positioned as a polished mid-market bag.', specs: ['Bag', 'Crossbody', 'Accessory'], publishedAt: date },
  { id: 'spo-001', brand: 'Nike', title: 'Nike Everyday Cushioned Training Socks 3-Pack', category: 'sports', price: 799, mrp: 999, rating: 4.4, reviewCount: 1820, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DSPORTSOCKS'), description: 'Affordable fitness basic within the approved sports/fitness category.', specs: ['3-Pack', 'Training', 'Running'], publishedAt: date },
  { id: 'spo-002', brand: 'Adidas', title: 'Adidas Training Yoga Mat 6mm', category: 'sports', price: 1299, mrp: 1599, rating: 4.3, reviewCount: 1470, image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80', platform: 'Flipkart', affiliateUrl: buildFlipkartUrl('adidas-training-yoga-mat-6mm', 'itmcbyogamat'), description: 'Yoga mat with realistic sub-₹2K pricing, not device-level pricing.', specs: ['6mm', 'Yoga', 'Fitness'], publishedAt: date },
  { id: 'spo-003', brand: 'Puma', title: 'Puma Resistance Bands Set', category: 'sports', price: 699, mrp: 899, rating: 4.2, reviewCount: 1260, image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DPUMABANDS'), description: 'Home training bundle priced credibly inside the required fitness range.', specs: ['Resistance', 'Home Workout', 'Set'], publishedAt: date },
  { id: 'spo-004', brand: 'Decathlon', title: 'Decathlon Domyos Kettlebell 8kg', category: 'sports', price: 1999, mrp: 2399, rating: 4.5, reviewCount: 840, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80', platform: 'Flipkart', affiliateUrl: buildFlipkartUrl('decathlon-domyos-kettlebell-8kg', 'itmcbkettle8'), description: 'Strength-training staple with realistic equipment pricing.', specs: ['8kg', 'Strength', 'Kettlebell'], publishedAt: date },
  { id: 'spo-005', brand: 'Garmin', title: 'Garmin Forerunner 165', category: 'sports', price: 27990, mrp: 33990, rating: 4.7, reviewCount: 610, image: 'https://images.unsplash.com/photo-1517438984742-1262db08379e?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DGARMIN165'), description: 'Running-first smartwatch that keeps sports tech in the right category.', specs: ['GPS', 'AMOLED', 'Running'], publishedAt: date },
  { id: 'spo-006', brand: 'Fitbit', title: 'Fitbit Charge 6', category: 'sports', price: 13999, mrp: 16999, rating: 4.3, reviewCount: 1780, image: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=800&q=80', platform: 'CJ Global', affiliateUrl: buildCjUrl('fitbit-charge-6'), description: 'Fitness tracker deal with believable wearable pricing.', specs: ['Fitness Tracker', 'Heart Rate', 'GPS'], publishedAt: date },
  { id: 'spo-007', brand: 'Reebok', title: 'Reebok Adjustable Dumbbell Set', category: 'sports', price: 2999, mrp: 3699, rating: 4.1, reviewCount: 690, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DREEBOKDB'), description: 'Home strength gear aligned to normal fitness equipment pricing.', specs: ['Adjustable', 'Strength', 'Home Gym'], publishedAt: date },
  { id: 'spo-008', brand: 'Under Armour', title: 'Under Armour Training Backpack', category: 'sports', price: 2499, mrp: 3199, rating: 4.4, reviewCount: 520, image: 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?w=800&q=80', platform: 'CJ Global', affiliateUrl: buildCjUrl('under-armour-training-backpack'), description: 'Training backpack with proper mid-market sports pricing.', specs: ['Backpack', 'Training', 'Outdoor'], publishedAt: date },
  { id: 'toy-001', brand: 'LEGO', title: 'LEGO Classic Creative Bricks Box', category: 'toys', price: 1499, mrp: 1899, rating: 4.8, reviewCount: 2860, image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DLEGOBRICKS'), description: 'Creative toy set with durable value and credible pricing.', specs: ['Creative', 'STEM', 'Building'], publishedAt: date },
  { id: 'toy-002', brand: 'Hot Wheels', title: 'Hot Wheels Track Builder Launch Kit', category: 'toys', price: 1199, mrp: 1499, rating: 4.6, reviewCount: 1780, image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&q=80', platform: 'Flipkart', affiliateUrl: buildFlipkartUrl('hot-wheels-track-builder-launch-kit', 'itmcbhotlaunch'), description: 'High-energy kids toy mapped to the right category and price band.', specs: ['Track Set', 'Cars', 'Kids'], publishedAt: date },
  { id: 'toy-003', brand: 'Hasbro', title: 'Hasbro Monopoly Classic Board Game', category: 'toys', price: 899, mrp: 1099, rating: 4.7, reviewCount: 3280, image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DHASBMONO'), description: 'Family board-game evergreen with realistic pricing.', specs: ['Board Game', 'Family', 'Classic'], publishedAt: date },
  { id: 'wat-001', brand: 'Titan', title: 'Titan Neo Analog Watch', category: 'watches', price: 2495, mrp: 3195, rating: 4.4, reviewCount: 3240, image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80', platform: 'Amazon', affiliateUrl: buildAmazonUrl('B0DTITANNEO'), description: 'Accessible analog watch with reliable gifting appeal.', specs: ['Analog', 'Stainless Steel', 'Quartz'], publishedAt: date },
  { id: 'wat-002', brand: 'Noise', title: 'Noise ColorFit Pro 5', category: 'watches', price: 3499, mrp: 4499, rating: 4.2, reviewCount: 4680, image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80', platform: 'Flipkart', affiliateUrl: buildFlipkartUrl('noise-colorfit-pro-5', 'itmcbnoisepro5'), description: 'Mass-market smartwatch with fitness features and a realistic price spread.', specs: ['Smartwatch', 'AMOLED', 'Bluetooth Calling'], publishedAt: date },
  { id: 'pod-tee-001', brand: 'CloudBasket Design Studio', title: 'CloudBasket Graphic Tee — Classic Black', category: 'pod', price: 499, mrp: 649, rating: 4.5, reviewCount: 180, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', platform: 'Print on Demand', affiliateUrl: 'https://www.redbubble.com/i/t-shirt/cloudbasket-graphic-tee-classic-black/0001', description: 'Premium cotton tee with clean chest graphic and mockup-first presentation.', specs: ['100% Cotton', 'Classic Fit', 'Print on Demand'], publishedAt: date },
  { id: 'pod-tee-002', brand: 'CloudBasket Design Studio', title: 'NEXQON Logo Tee — Navy Blue', category: 'pod', price: 599, mrp: 749, rating: 4.6, reviewCount: 120, image: 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=800&q=80', platform: 'Print on Demand', affiliateUrl: 'https://www.redbubble.com/i/t-shirt/nexqon-logo-tee-navy-blue/0002', description: 'Minimal navy tee with centered mark and studio-grade mockup imagery.', specs: ['Cotton Blend', 'Regular Fit', 'Print on Demand'], publishedAt: date },
  { id: 'pod-mug-001', brand: 'CloudBasket Design Studio', title: 'CloudBasket Desk Mug — Midnight Blue', category: 'pod', price: 299, mrp: 379, rating: 4.4, reviewCount: 92, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80', platform: 'Print on Demand', affiliateUrl: 'https://www.redbubble.com/i/mug/cloudbasket-desk-mug-midnight-blue/1001', description: 'Ceramic mug for desk setups with simple mockup-led photography.', specs: ['Ceramic', '330ml', 'Print on Demand'], publishedAt: date },
  { id: 'pod-case-001', brand: 'CloudBasket Design Studio', title: 'CloudBasket Matte Black Case — iPhone 15', category: 'pod', price: 349, mrp: 449, rating: 4.5, reviewCount: 64, image: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=800&q=80', platform: 'Print on Demand', affiliateUrl: 'https://www.redbubble.com/i/iphone-case/cloudbasket-matte-black-case-iphone-15/2001', description: 'Clean matte case with mockup imagery and device-specific compatibility.', specs: ['Slim Case', 'Shock Absorb', 'Print on Demand'], compatibility: 'Compatible with iPhone 15 / 14 / 13 series. Available on Redbubble.', publishedAt: date },
]

export const CATALOG_PRODUCTS = [
  ...catalogProducts,
  ...Array.from({ length: 16 }, (_, index) => ({
    id: `spo-extra-${String(index + 1).padStart(3, '0')}`,
    brand: bySlug.sports.brands[index % bySlug.sports.brands.length],
    title: `${bySlug.sports.brands[index % bySlug.sports.brands.length]} Training Essential ${index + 1}`,
    category: 'sports' as const,
    price: 499 + index * 210,
    mrp: Math.round((499 + index * 210) * 1.22),
    rating: 4 + ((index % 5) * 0.1),
    reviewCount: 220 + index * 34,
    image: index % 2 === 0 ? 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80' : 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    platform: index % 3 === 0 ? ('Flipkart' as const) : ('Amazon' as const),
    affiliateUrl: index % 3 === 0 ? buildFlipkartUrl(`sports-training-essential-${index + 1}`, `itmcbspo${index + 1}`) : buildAmazonUrl(`B0DSPORT${index + 1}`),
    description: 'Extended sports catalog item generated to support pagination and filter QA.',
    specs: ['Training', 'Fitness', 'Sports'],
    publishedAt: date,
  })),
  ...Array.from({ length: 8 }, (_, index) => ({
    id: `pod-case-${String(index + 2).padStart(3, '0')}`,
    brand: 'CloudBasket Design Studio',
    title: index % 2 === 0 ? `NEXQON Clear Case — Samsung S24 ${index + 1}` : `CloudBasket Studio Case — iPhone 15 ${index + 1}`,
    category: 'pod' as const,
    price: 199 + index * 25,
    mrp: 249 + index * 30,
    rating: 4.2 + ((index % 3) * 0.1),
    reviewCount: 35 + index * 8,
    image: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=800&q=80',
    platform: 'Print on Demand' as const,
    affiliateUrl: `https://www.redbubble.com/i/iphone-case/cloudbasket-case-${index + 2}/20${index + 2}`,
    description: 'Phone case design rendered in a clean mockup format for POD sub-pages.',
    specs: ['Print on Demand', 'Phone Case', 'Studio Design'],
    compatibility: index % 2 === 0 ? 'Compatible with Samsung S24 / S23 / S22 series. Available on Redbubble.' : 'Compatible with iPhone 15 / 14 / 13 series. Available on Redbubble.',
    publishedAt: date,
  })),
] satisfies CatalogProduct[]

export const POD_COLLECTIONS = {
  tshirts: CATALOG_PRODUCTS.filter((product) => product.id.startsWith('pod-tee')),
  mugs: CATALOG_PRODUCTS.filter((product) => product.id.startsWith('pod-mug')),
  'phone-cases': CATALOG_PRODUCTS.filter((product) => product.id.startsWith('pod-case')),
} as const

export const CATEGORY_ALIASES: Record<string, CategorySlug> = {
  food: 'grocery',
  products: 'electronics',
} as const

export function getCategoryDefinition(slug: string): CategoryDefinition | undefined {
  const resolved = (CATEGORY_ALIASES[slug] ?? slug) as CategorySlug
  return bySlug[resolved]
}

export function getCategoryProducts(slug: CategorySlug): CatalogProduct[] {
  return CATALOG_PRODUCTS.filter((product) => product.category === slug)
}

export function getProductById(id: string): CatalogProduct | undefined {
  return CATALOG_PRODUCTS.find((product) => product.id === id)
}

export function getSavePercent(product: CatalogProduct): number {
  return Math.round(((product.mrp - product.price) / product.mrp) * 100)
}

export function getPlatformQueryValue(platform: PlatformLabel): string {
  if (platform === 'CJ Global') return 'cj'
  if (platform === 'Flipkart') return 'flipkart'
  if (platform === 'Print on Demand') return 'pod'
  return 'amazon'
}

export function getSearchBuckets(query: string): SearchResultBucket {
  const normalized = query.trim().toLowerCase()
  if (!normalized) {
    return {
      products: CATALOG_PRODUCTS.slice(0, 12),
      deals: CATALOG_PRODUCTS.filter((product) => product.platform !== 'Print on Demand').slice(0, 8),
      categories: CATEGORY_DEFINITIONS.slice(0, 6),
    }
  }

  const products = CATALOG_PRODUCTS.filter((product) =>
    `${product.title} ${product.brand} ${product.category}`.toLowerCase().includes(normalized),
  )
  const deals = CATALOG_PRODUCTS.filter(
    (product) =>
      product.platform !== 'Print on Demand' &&
      `${product.title} ${product.brand} ${getPlatformQueryValue(product.platform)}`.toLowerCase().includes(normalized),
  )
  const categories = CATEGORY_DEFINITIONS.filter((category) =>
    `${category.label} ${category.description}`.toLowerCase().includes(normalized),
  )

  return { products, deals, categories }
}

export function getProductDropdownCategories(): CategoryDefinition[] {
  return CATEGORY_DEFINITIONS
}
