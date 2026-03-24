export interface Product {
  id: string
  name: string
  brand: string
  category: string
  subCategory: string
  price: number
  originalPrice: number
  priceRange: 'budget' | 'mid' | 'premium' | 'luxury'
  rating: number
  reviews: number
  image: string
  tags: string[]
  affiliatePlatform: 'amazon' | 'flipkart' | 'cj' | 'pod' | 'vcm'
  affiliateId: string
  badge?: string
  description: string
}

const CATALOG_SEEDS: Omit<Product, 'id'>[] = [
  { name: 'Samsung Galaxy S25 Ultra', brand: 'Samsung', category: 'mobiles', subCategory: 'flagship', price: 129999, originalPrice: 149999, priceRange: 'luxury', rating: 4.8, reviews: 8420, image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400', tags: ['5G','flagship'], affiliatePlatform: 'amazon', affiliateId: 'B0CS4VHMGJ', badge: 'Bestseller', description: 'AI-powered flagship with 200MP camera' },
  { name: 'iPhone 16 Pro Max', brand: 'Apple', category: 'mobiles', subCategory: 'flagship', price: 159900, originalPrice: 179900, priceRange: 'luxury', rating: 4.9, reviews: 12350, image: 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=400', tags: ['5G','flagship'], affiliatePlatform: 'amazon', affiliateId: 'B0D3J5K7X2', badge: 'Top Pick', description: 'A18 Pro chip with ProRes video' },
  { name: 'OnePlus 12R 5G', brand: 'OnePlus', category: 'mobiles', subCategory: 'mid-range', price: 38999, originalPrice: 45999, priceRange: 'mid', rating: 4.5, reviews: 9300, image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400', tags: ['5G','fast-charge'], affiliatePlatform: 'amazon', affiliateId: 'B0CPM72P4K', description: 'Snapdragon 8 Gen 2, 100W fast charge' },
  { name: 'Xiaomi Redmi Note 13 Pro 5G', brand: 'Xiaomi', category: 'mobiles', subCategory: 'mid-range', price: 23999, originalPrice: 28999, priceRange: 'mid', rating: 4.3, reviews: 18800, image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400', tags: ['200MP','5G'], affiliatePlatform: 'flipkart', affiliateId: 'NOTEPRO13', description: '200MP camera, vivid AMOLED display' },
  { name: 'Realme 12 Pro+ 5G', brand: 'Realme', category: 'mobiles', subCategory: 'mid-range', price: 26999, originalPrice: 31999, priceRange: 'mid', rating: 4.2, reviews: 8420, image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400', tags: ['periscope','5G'], affiliatePlatform: 'flipkart', affiliateId: 'REALME12PP', description: 'Periscope zoom camera and curved display' },
  { name: 'Motorola Edge 50 Pro', brand: 'Motorola', category: 'mobiles', subCategory: 'mid-range', price: 29999, originalPrice: 35999, priceRange: 'mid', rating: 4.4, reviews: 6120, image: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=400', tags: ['125W','5G'], affiliatePlatform: 'flipkart', affiliateId: 'MOTOEDGE50', description: 'Pantone design, 125W fast charge' },
  { name: 'Nothing Phone (2a) Plus', brand: 'Nothing', category: 'mobiles', subCategory: 'mid-range', price: 27999, originalPrice: 32999, priceRange: 'mid', rating: 4.5, reviews: 4890, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', tags: ['glyph','5G'], affiliatePlatform: 'amazon', affiliateId: 'NOTHING2AP', description: 'Glyph interface, clean Android, balanced performance' },
  { name: 'Vivo V30 5G', brand: 'Vivo', category: 'mobiles', subCategory: 'mid-range', price: 33999, originalPrice: 39999, priceRange: 'mid', rating: 4.2, reviews: 5210, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400', tags: ['ZEISS','5G'], affiliatePlatform: 'flipkart', affiliateId: 'VIVOV305G', description: 'ZEISS portrait cameras, premium design' },
  { name: 'MacBook Air M3', brand: 'Apple', category: 'laptops', subCategory: 'ultrabook', price: 104900, originalPrice: 124900, priceRange: 'luxury', rating: 4.9, reviews: 7830, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', tags: ['M3','fanless'], affiliatePlatform: 'amazon', affiliateId: 'B0CV7LM89J', badge: 'Top Pick', description: '18-hour battery, M3 chip, fanless design' },
  { name: 'HP Pavilion Plus 14', brand: 'HP', category: 'laptops', subCategory: 'work-laptop', price: 76990, originalPrice: 91990, priceRange: 'premium', rating: 4.4, reviews: 2150, image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400', tags: ['OLED','Ryzen7'], affiliatePlatform: 'amazon', affiliateId: 'HPPAV14', description: 'OLED display, Ryzen 7, great battery life' },
  { name: 'Dell Inspiron 14', brand: 'Dell', category: 'laptops', subCategory: 'student-laptop', price: 58990, originalPrice: 70990, priceRange: 'mid', rating: 4.3, reviews: 3610, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', tags: ['Intel','SSD'], affiliatePlatform: 'flipkart', affiliateId: 'DELLINSP14', description: 'Reliable productivity laptop with solid thermals' },
  { name: 'Lenovo IdeaPad Slim 5', brand: 'Lenovo', category: 'laptops', subCategory: 'student-laptop', price: 64990, originalPrice: 78990, priceRange: 'mid', rating: 4.4, reviews: 4890, image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400', tags: ['CoreUltra','WUXGA'], affiliatePlatform: 'flipkart', affiliateId: 'LENOVOSLIM5', description: 'Comfortable keyboard, bright display, reliable performance' },
  { name: 'ASUS Vivobook 15 OLED', brand: 'Asus', category: 'laptops', subCategory: 'student-laptop', price: 55990, originalPrice: 67990, priceRange: 'mid', rating: 4.5, reviews: 6120, image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400', tags: ['OLED','Ryzen5'], affiliatePlatform: 'amazon', affiliateId: 'ASUSVIVOBOOK', description: 'Value OLED for entertainment and creative work' },
  { name: 'Acer Swift Go 14', brand: 'Acer', category: 'laptops', subCategory: 'ultrabook', price: 69990, originalPrice: 84990, priceRange: 'premium', rating: 4.2, reviews: 1840, image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400', tags: ['OLED','CoreUltra'], affiliatePlatform: 'flipkart', affiliateId: 'ACERSWIFTGO', description: 'Portable OLED machine with light metal build' },
  { name: "L'Oreal Hyaluron Shampoo", brand: "L'Oreal", category: 'beauty', subCategory: 'haircare', price: 399, originalPrice: 499, priceRange: 'budget', rating: 4.4, reviews: 12650, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400', tags: ['hydrating','haircare'], affiliatePlatform: 'amazon', affiliateId: 'LOREALSH', description: 'Hydrating shampoo for all hair types' },
  { name: 'Maybelline Fit Me Foundation', brand: 'Maybelline', category: 'beauty', subCategory: 'makeup', price: 549, originalPrice: 699, priceRange: 'budget', rating: 4.5, reviews: 18340, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', tags: ['matte','foundation'], affiliatePlatform: 'flipkart', affiliateId: 'MAYBFITME', description: 'Matte finish foundation, flexible shades' },
  { name: 'Lakme 9to5 Vitamin C Cream', brand: 'Lakme', category: 'beauty', subCategory: 'skincare', price: 329, originalPrice: 399, priceRange: 'budget', rating: 4.2, reviews: 5210, image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400', tags: ['vitaminC','SPF'], affiliatePlatform: 'amazon', affiliateId: 'LAKMEVITC', description: 'Vitamin C day cream with SPF protection' },
  { name: 'Mamaearth Vitamin C Serum', brand: 'Mamaearth', category: 'beauty', subCategory: 'skincare', price: 499, originalPrice: 899, priceRange: 'budget', rating: 4.3, reviews: 45600, image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400', tags: ['vitaminC','serum'], affiliatePlatform: 'flipkart', affiliateId: 'MAMVITCSER', badge: 'Bestseller', description: 'Toxin-free vitamin C with turmeric for natural glow' },
  { name: 'Himalaya Purifying Neem Pack', brand: 'Himalaya', category: 'beauty', subCategory: 'skincare', price: 169, originalPrice: 210, priceRange: 'budget', rating: 4.2, reviews: 7360, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400', tags: ['neem','facepack'], affiliatePlatform: 'amazon', affiliateId: 'HIMNEEM', description: 'Affordable neem face pack for oily skin' },
  { name: 'Forest Essentials Rose Water', brand: 'Forest Essentials', category: 'beauty', subCategory: 'skincare', price: 895, originalPrice: 1295, priceRange: 'mid', rating: 4.5, reviews: 12400, image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400', tags: ['ayurvedic','rosewater'], affiliatePlatform: 'amazon', affiliateId: 'FORESTRE', description: 'Distilled from Kannauj roses, pure ayurvedic' },
  { name: 'Nike Air Zoom Pegasus', brand: 'Nike', category: 'sports', subCategory: 'running', price: 7995, originalPrice: 11995, priceRange: 'premium', rating: 4.5, reviews: 15200, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', tags: ['running','cushioning'], affiliatePlatform: 'amazon', affiliateId: 'NIKEPEG', description: 'Daily trainer with responsive cushioning' },
  { name: 'Adidas Training Yoga Mat', brand: 'Adidas', category: 'sports', subCategory: 'yoga', price: 1299, originalPrice: 1599, priceRange: 'budget', rating: 4.3, reviews: 1470, image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400', tags: ['yoga','mat'], affiliatePlatform: 'flipkart', affiliateId: 'ADIYOGA', description: '6mm non-slip yoga mat' },
  { name: 'Decathlon Domyos Kettlebell', brand: 'Decathlon', category: 'sports', subCategory: 'strength', price: 1999, originalPrice: 2399, priceRange: 'budget', rating: 4.5, reviews: 840, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400', tags: ['kettlebell','strength'], affiliatePlatform: 'flipkart', affiliateId: 'DECKETTLE', description: '8kg kettlebell for home strength training' },
  { name: 'Yonex Arcsaber 11 Badminton', brand: 'Yonex', category: 'sports', subCategory: 'racquet', price: 7999, originalPrice: 11999, priceRange: 'premium', rating: 4.8, reviews: 3120, image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400', tags: ['badminton','racquet'], affiliatePlatform: 'amazon', affiliateId: 'YONEXARC11', description: 'High-flex shaft, used by national champions' },
  { name: 'Garmin Forerunner 165', brand: 'Garmin', category: 'sports', subCategory: 'smartwatch', price: 27990, originalPrice: 33990, priceRange: 'premium', rating: 4.7, reviews: 610, image: 'https://images.unsplash.com/photo-1517438984742-1262db08379e?w=400', tags: ['GPS','running'], affiliatePlatform: 'amazon', affiliateId: 'GARMIN165', description: 'Running-first GPS smartwatch with AMOLED display' },
  { name: "Levi's 511 Slim Fit Jeans", brand: "Levi's", category: 'fashion', subCategory: 'mens', price: 2199, originalPrice: 2999, priceRange: 'mid', rating: 4.5, reviews: 14260, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', tags: ['denim','slim'], affiliatePlatform: 'flipkart', affiliateId: 'LEVIS511', description: 'The gold-standard slim fit denim' },
  { name: 'Biba Printed Kurta Set', brand: 'Biba', category: 'fashion', subCategory: 'womens-ethnic', price: 1899, originalPrice: 2499, priceRange: 'mid', rating: 4.2, reviews: 1940, image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400', tags: ['ethnic','kurta'], affiliatePlatform: 'flipkart', affiliateId: 'BIBAKURTA', description: 'Printed cotton kurta set for festivals' },
  { name: 'Nike Dri-FIT Training Tee', brand: 'Nike', category: 'fashion', subCategory: 'activewear', price: 1299, originalPrice: 1699, priceRange: 'budget', rating: 4.4, reviews: 2480, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', tags: ['driFIT','training'], affiliatePlatform: 'amazon', affiliateId: 'NIKEDRIFT', description: 'Everyday performance tee' },
  { name: 'Zara Crossbody Bag', brand: 'Zara', category: 'fashion', subCategory: 'accessories', price: 2790, originalPrice: 3490, priceRange: 'mid', rating: 4.1, reviews: 820, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400', tags: ['bag','crossbody'], affiliatePlatform: 'cj', affiliateId: 'ZARABAG', description: 'Structured mini crossbody in premium finish' },
  { name: 'Allen Solly Slim Fit Shirt', brand: 'Allen Solly', category: 'fashion', subCategory: 'mens-formal', price: 1299, originalPrice: 2499, priceRange: 'budget', rating: 4.4, reviews: 8920, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400', tags: ['formal','shirt'], affiliatePlatform: 'amazon', affiliateId: 'ALLENSOLLY', badge: '48% Off', description: 'Wrinkle-free cotton blend for office and events' },
  { name: 'Philips Air Fryer 4.2L', brand: 'Philips', category: 'home', subCategory: 'kitchen', price: 6499, originalPrice: 7999, priceRange: 'mid', rating: 4.5, reviews: 8760, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', tags: ['airfryer','kitchen'], affiliatePlatform: 'amazon', affiliateId: 'PHILIPSAF', description: 'Rapid Air Technology for low-oil cooking' },
  { name: 'Prestige Induction Cooktop', brand: 'Prestige', category: 'home', subCategory: 'kitchen', price: 1799, originalPrice: 2299, priceRange: 'budget', rating: 4.2, reviews: 14200, image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400', tags: ['induction','kitchen'], affiliatePlatform: 'flipkart', affiliateId: 'PRESSTIC20', description: 'Everyday cooktop with Indian menu presets' },
  { name: 'Godrej Double Door Fridge 244L', brand: 'Godrej', category: 'home', subCategory: 'appliances', price: 23990, originalPrice: 28990, priceRange: 'mid', rating: 4.3, reviews: 2240, image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400', tags: ['refrigerator','inverter'], affiliatePlatform: 'amazon', affiliateId: 'GODR244L', description: 'Popular fridge size with inverter technology' },
  { name: 'IFB Front Load Washer 8kg', brand: 'IFB', category: 'home', subCategory: 'appliances', price: 29990, originalPrice: 36990, priceRange: 'premium', rating: 4.4, reviews: 1320, image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400', tags: ['washing-machine','frontload'], affiliatePlatform: 'flipkart', affiliateId: 'IFBFL8KG', description: 'Front-load washer with steam function' },
  { name: 'Atomic Habits', brand: 'Penguin', category: 'books', subCategory: 'self-help', price: 399, originalPrice: 499, priceRange: 'budget', rating: 4.8, reviews: 145000, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', tags: ['habits','bestseller'], affiliatePlatform: 'amazon', affiliateId: 'ATOMICHABITS', badge: 'Bestseller', description: 'The definitive guide to building good habits by James Clear' },
  { name: 'The Psychology of Money', brand: 'Harper Collins', category: 'books', subCategory: 'finance', price: 299, originalPrice: 399, priceRange: 'budget', rating: 4.8, reviews: 19840, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', tags: ['finance','money'], affiliatePlatform: 'amazon', affiliateId: 'PSYCHMONEY', description: 'Morgan Housel on money mindset and behaviour' },
  { name: 'NCERT Class 12 Complete Set', brand: 'NCERT', category: 'books', subCategory: 'academic', price: 2999, originalPrice: 4500, priceRange: 'budget', rating: 4.7, reviews: 56000, image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', tags: ['academic','exam'], affiliatePlatform: 'amazon', affiliateId: 'NCERT12', badge: 'Exam Essential', description: 'Official NCERT 2025-26 complete reference pack' },
  { name: 'Sony PlayStation 5 Slim', brand: 'Sony PlayStation', category: 'gaming', subCategory: 'consoles', price: 44990, originalPrice: 54990, priceRange: 'luxury', rating: 4.9, reviews: 18700, image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400', tags: ['console','4K'], affiliatePlatform: 'amazon', affiliateId: 'PS5SLIM', badge: '#1 Console', description: 'Next-gen gaming with 4K and haptic feedback' },
  { name: 'Xbox Series S 512GB', brand: 'Xbox', category: 'gaming', subCategory: 'consoles', price: 29990, originalPrice: 35990, priceRange: 'premium', rating: 4.6, reviews: 2180, image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400', tags: ['console','GamePass'], affiliatePlatform: 'amazon', affiliateId: 'XBOXSS', description: 'Compact console for Game Pass households' },
  { name: 'Razer BlackShark V2 X Headset', brand: 'Razer', category: 'gaming', subCategory: 'accessories', price: 3499, originalPrice: 4299, priceRange: 'mid', rating: 4.4, reviews: 5930, image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400', tags: ['headset','surround'], affiliatePlatform: 'amazon', affiliateId: 'RAZERBV2X', description: '7.1 surround gaming headset' },
  { name: 'Abbott Ensure Diabetes Care', brand: 'Abbott', category: 'health', subCategory: 'nutrition', price: 749, originalPrice: 899, priceRange: 'budget', rating: 4.4, reviews: 5230, image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=400', tags: ['nutrition','health'], affiliatePlatform: 'amazon', affiliateId: 'ABBOTTEN', description: 'Condition-specific nutrition powder' },
  { name: 'Omron HEM 7120 BP Monitor', brand: 'Omron', category: 'health', subCategory: 'devices', price: 2499, originalPrice: 3199, priceRange: 'mid', rating: 4.6, reviews: 34500, image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=400', tags: ['BP','monitor'], affiliatePlatform: 'amazon', affiliateId: 'OMRONBP', badge: 'Gift for Parents', description: 'Clinically validated home BP monitor' },
  { name: 'Dabur Chyawanprash 1kg', brand: 'Dabur', category: 'health', subCategory: 'wellness', price: 329, originalPrice: 399, priceRange: 'budget', rating: 4.6, reviews: 10420, image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400', tags: ['ayurvedic','immunity'], affiliatePlatform: 'flipkart', affiliateId: 'DABURCHYA', description: 'Immunity booster with 40+ Ayurvedic herbs' },
  { name: 'American Tourister Trolley', brand: 'American Tourister', category: 'travel', subCategory: 'luggage', price: 3499, originalPrice: 6999, priceRange: 'mid', rating: 4.4, reviews: 23400, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400', tags: ['luggage','cabin'], affiliatePlatform: 'amazon', affiliateId: 'AMTTWIST', badge: 'Travel Pick', description: 'Cabin-size trolley with TSA lock' },
  { name: 'LEGO Classic Creative Bricks', brand: 'LEGO', category: 'toys', subCategory: 'building', price: 1499, originalPrice: 1899, priceRange: 'mid', rating: 4.8, reviews: 2860, image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400', tags: ['LEGO','STEM'], affiliatePlatform: 'amazon', affiliateId: 'LEGOBRICKS', description: 'Creative building set for all ages' },
  { name: 'Hasbro Monopoly Classic', brand: 'Hasbro', category: 'toys', subCategory: 'board-games', price: 899, originalPrice: 1099, priceRange: 'budget', rating: 4.7, reviews: 3280, image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400', tags: ['boardgame','family'], affiliatePlatform: 'amazon', affiliateId: 'HASBMONO', description: 'Family board game evergreen classic' },
  { name: 'CloudBasket Graphic Tee', brand: 'CloudBasket Design Studio', category: 'pod', subCategory: 'tshirts', price: 499, originalPrice: 649, priceRange: 'budget', rating: 4.5, reviews: 180, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', tags: ['POD','tshirt'], affiliatePlatform: 'pod', affiliateId: 'pod-tee-001', description: 'Premium cotton tee with clean chest graphic' },
  { name: 'CloudBasket Desk Mug', brand: 'CloudBasket Design Studio', category: 'pod', subCategory: 'mugs', price: 299, originalPrice: 379, priceRange: 'budget', rating: 4.4, reviews: 92, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400', tags: ['POD','mug'], affiliatePlatform: 'pod', affiliateId: 'pod-mug-001', description: 'Ceramic desk mug with studio design' },
  { name: 'CloudBasket Phone Case', brand: 'CloudBasket Design Studio', category: 'pod', subCategory: 'phone-cases', price: 349, originalPrice: 449, priceRange: 'budget', rating: 4.5, reviews: 64, image: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=400', tags: ['POD','case'], affiliatePlatform: 'pod', affiliateId: 'pod-case-001', description: 'Matte black case for iPhone 15' },
]

function varyPrice(price: number, index: number): number {
  const multiplier = 1 + ((index % 7) - 3) * 0.02
  return Math.max(99, Math.round(price * multiplier))
}

function varyRating(rating: number, index: number): number {
  const next = rating + ((index % 5) - 2) * 0.03
  return Number(Math.max(3.8, Math.min(4.95, next)).toFixed(1))
}

function buildCatalog(size: number = 500): Product[] {
  const products: Product[] = []
  let idCounter = 1

  while (products.length < size) {
    for (const seed of CATALOG_SEEDS) {
      if (products.length >= size) break
      const variant = Math.floor(products.length / CATALOG_SEEDS.length) + 1
      const id = `cb-${String(idCounter++).padStart(5, '0')}`
      const price = varyPrice(seed.price, variant)
      const originalPrice = Math.max(price + 50, varyPrice(seed.originalPrice, variant + 1))
      products.push({
        ...seed,
        id,
        name: variant > 1 ? `${seed.name} — ${['Pro', 'Plus', 'Max', 'Lite', 'Neo', 'Elite', 'Prime', 'Ultra', 'Go', 'Air'][variant % 10]} Edition` : seed.name,
        price,
        originalPrice,
        rating: varyRating(seed.rating, variant),
        reviews: seed.reviews + variant * 7,
        affiliateId: `${seed.affiliateId}-v${variant}`,
      })
    }
  }
  return products
}

export const CATALOG: Product[] = buildCatalog()

export function getProductsByCategory(cat: string): Product[] {
  return CATALOG.filter((p) => p.category === cat)
}

export function getProductById(id: string): Product | undefined {
  return CATALOG.find((p) => p.id === id)
}

export function getAllCategories(): string[] {
  return [...new Set(CATALOG.map((p) => p.category))]
}

