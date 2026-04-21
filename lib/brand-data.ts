// lib/brand-data.ts
// Brand descriptions for all brands across India Catalog and India Catalog 2

export type BrandInfo = {
  name: string
  description: string
  founded: number
  headquarters: string
  primaryCategory: string
  website?: string
}

export const BRAND_DESCRIPTIONS: Record<string, BrandInfo> = {
  HUL: { name: 'Hindustan Unilever Limited', description: 'India\'s largest fast-moving consumer goods company with iconic brands like Dove, Lakme, Surf Excel and Lifebuoy. Over 80 years of trusted products in Indian homes.', founded: 1933, headquarters: 'Mumbai', primaryCategory: 'Personal Care & Home Care' },
  Dabur: { name: 'Dabur India Ltd', description: 'One of India\'s largest Ayurveda and natural health care companies. Known for Dabur Honey, Chyawanprash, and Real fruit juices. 138+ years of trust.', founded: 1884, headquarters: 'Ghaziabad', primaryCategory: 'Health & Personal Care' },
  ITC: { name: 'ITC Limited', description: 'Diversified Indian conglomerate with leading brands in personal care, foods, and home care. Classmate, Fiama, Engage and Yippee! are flagship brands.', founded: 1910, headquarters: 'Kolkata', primaryCategory: 'FMCG & Personal Care' },
  Godrej: { name: 'Godrej Consumer Products', description: 'A leading emerging markets FMCG company with household brands like Good Knight, Hit, Cinthol and Godrej No.1. Pan-India trusted name.', founded: 1897, headquarters: 'Mumbai', primaryCategory: 'Home Care & Personal Care' },
  'Bajaj Electricals': { name: 'Bajaj Electricals Limited', description: 'India\'s most trusted consumer electrical brand. From fans and irons to lighting and appliances — Bajaj has been powering Indian homes since 1938.', founded: 1938, headquarters: 'Mumbai', primaryCategory: 'Home Appliances' },
  Havells: { name: 'Havells India Limited', description: 'Premium Indian electrical equipment company known for fans, water heaters, appliances and lighting. Synonymous with quality and innovation in India.', founded: 1958, headquarters: 'Noida', primaryCategory: 'Electrical Appliances' },
  Philips: { name: 'Philips India', description: 'Global leader in health technology and consumer lifestyle products. In India, known for air fryers, grooming products, kitchen appliances and healthcare devices.', founded: 1930, headquarters: 'Gurgaon', primaryCategory: 'Health & Kitchen Appliances' },
  Prestige: { name: 'TTK Prestige Limited', description: 'India\'s leading kitchen appliances brand. Synonymous with pressure cookers, cookware, and kitchen gadgets in every Indian home for over 60 years.', founded: 1955, headquarters: 'Bengaluru', primaryCategory: 'Kitchen Appliances' },
  boAt: { name: 'Imagine Marketing (boAt)', description: 'India\'s fastest growing consumer electronics brand for audio products. The #1 wearables brand in India by shipments. Known for affordable, stylish earbuds and headphones.', founded: 2016, headquarters: 'New Delhi', primaryCategory: 'Audio & Wearables' },
  Noise: { name: 'Nexter Inc (Noise)', description: 'India\'s leading smartwatch brand and a top player in the TWS earbuds segment. Known for feature-rich wearables at accessible price points.', founded: 2014, headquarters: 'Gurugram', primaryCategory: 'Smartwatches & Audio' },
  realme: { name: 'realme India', description: 'One of India\'s fastest growing smartphone brands. Known for delivering flagship-grade specifications at mid-range prices. Popular with India\'s youth.', founded: 2018, headquarters: 'Shenzhen (India ops: Bengaluru)', primaryCategory: 'Smartphones' },
  Samsung: { name: 'Samsung India Electronics', description: 'The world\'s largest smartphone manufacturer and a leading consumer electronics brand in India. From Galaxy phones to QLED TVs and home appliances.', founded: 1969, headquarters: 'Noida (India HQ)', primaryCategory: 'Electronics & Appliances' },
  Puma: { name: 'Puma India', description: 'Global sports lifestyle brand with strong presence in Indian fashion. Known for performance footwear, athletic apparel and streetwear collaborations.', founded: 1948, headquarters: 'Munich (India: Bengaluru)', primaryCategory: 'Sports Fashion' },
  Biba: { name: 'Biba Apparels', description: 'India\'s leading women\'s ethnic wear brand. Known for beautiful kurtas, salwar suits and festive collections that blend tradition with contemporary fashion.', founded: 1986, headquarters: 'Mumbai', primaryCategory: 'Women\'s Fashion' },
  Anker: { name: 'Anker Innovations India', description: 'World\'s leading charging technology brand. Known for GaN chargers, PowerCore power banks, and Soundcore audio products. Trusted by millions globally.', founded: 2011, headquarters: 'Shenzhen (India: Mumbai)', primaryCategory: 'Tech Accessories' },
  Portronics: { name: 'Portronics Digital Pvt Ltd', description: 'India\'s homegrown tech accessories brand offering affordable mice, keyboards, cables, and wireless devices. Popular for value-for-money products.', founded: 2008, headquarters: 'New Delhi', primaryCategory: 'Tech Accessories' },
  Syska: { name: 'SSK Group (Syska)', description: 'Indian electronics brand known for LED lighting, mobile accessories, and personal care gadgets. A trusted name for affordable tech products in India.', founded: 2012, headquarters: 'Mumbai', primaryCategory: 'Electronics & Accessories' },
  Ambrane: { name: 'Ambrane India', description: 'Indian brand specialising in mobile accessories, power banks, earbuds and charging cables. Known for feature-rich products at budget-friendly prices.', founded: 2012, headquarters: 'New Delhi', primaryCategory: 'Mobile Accessories' },
  Belkin: { name: 'Belkin International India', description: 'Premium accessories brand offering high-quality cables, chargers, cases and networking products. Known for MFi-certified iPhone accessories.', founded: 1983, headquarters: 'El Segundo (India: Mumbai)', primaryCategory: 'Premium Accessories' },
  Decathlon: { name: 'Decathlon India', description: 'The world\'s largest sporting goods retailer with 90+ stores across India. Offers quality sports equipment, apparel and fitness gear at accessible prices.', founded: 1976, headquarters: 'Lille (India: Bengaluru)', primaryCategory: 'Sports & Fitness' },
  'Fisher-Price': { name: 'Fisher-Price (Mattel India)', description: 'The world\'s most trusted baby and toddler toy brand. Known for developmental toys, baby gear and educational products that help children learn through play.', founded: 1930, headquarters: 'El Segundo (India: Mumbai)', primaryCategory: 'Baby & Toddler Toys' },
  Hasbro: { name: 'Hasbro India', description: 'Global entertainment and toy company behind Monopoly, Nerf, Play-Doh, Transformers and My Little Pony. Bringing joy to families across India for decades.', founded: 1923, headquarters: 'Pawtucket (India: Mumbai)', primaryCategory: 'Board Games & Action Toys' },
  Lego: { name: 'The LEGO Group India', description: 'The world\'s most beloved toy brand. LEGO bricks encourage creativity, problem-solving and imagination in children of all ages. Available across India.', founded: 1932, headquarters: 'Billund (India: Mumbai)', primaryCategory: 'Construction Toys' },
  Funskool: { name: 'Funskool India Ltd', description: 'India\'s own toy company — a joint venture with Hasbro. Known for board games, puzzles, GI Joe, Barbie and other classic toys manufactured in India.', founded: 1987, headquarters: 'Chennai', primaryCategory: 'Toys & Board Games' },
  MDH: { name: 'Mahashian Di Hatti (MDH)', description: 'India\'s most iconic spice brand. Known for premium quality masalas and spices used in households and restaurants across India and worldwide since 1919.', founded: 1919, headquarters: 'New Delhi', primaryCategory: 'Spices & Seasonings' },
  Himalaya: { name: 'The Himalaya Drug Company', description: 'Indian pharmaceutical company known for Ayurvedic wellness products, herbal supplements and personal care. Over 300 products sold in 90+ countries.', founded: 1930, headquarters: 'Bengaluru', primaryCategory: 'Health & Wellness' },
  Patanjali: { name: 'Patanjali Ayurved Limited', description: 'India\'s largest FMCG Ayurvedic company founded by Yoga Guru Baba Ramdev. Known for natural, affordable products across food, healthcare and personal care.', founded: 2006, headquarters: 'Haridwar', primaryCategory: 'Ayurvedic Products' },
  MTR: { name: 'MTR Foods', description: 'Iconic Indian food brand known for ready-to-eat meals, instant mixes and breakfast foods. A Bengaluru heritage brand trusted for authentic South Indian taste.', founded: 1924, headquarters: 'Bengaluru', primaryCategory: 'Ready-to-Eat Foods' },
}

export function getBrandInfo(brandName: string): BrandInfo | null {
  return BRAND_DESCRIPTIONS[brandName] ?? null
}

export function getAllBrands(): string[] {
  return Object.keys(BRAND_DESCRIPTIONS).sort()
}
