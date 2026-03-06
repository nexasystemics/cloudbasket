import { MAIN_CATEGORIES } from '@/lib/constants'
import type { Product } from '@/lib/types'

type MainCategory = (typeof MAIN_CATEGORIES)[number]

const CATEGORY_IMAGES: Record<MainCategory, string[]> = {
  Mobiles: [
    '1511707171634-5f897ff02aa9',
    '1512941937669-90a1b58e7e9c',
    '1592750475338-74b7b21085ab',
    '1565849904461-04a58ad377e0',
    '1601784551446-20c326b5ae20',
  ],
  Laptops: [
    '1496181133206-80ce9b88a853',
    '1525547719571-a2d4ac8945e2',
    '1588872657578-7efd1f1555ed',
    '1593642632559-0c6d3fc62b89',
    '1541807084-5c52e6e76cf3',
  ],
  Fashion: [
    '1483985988355-763728e1935b',
    '1539109136881-3be0616acf4b',
    '1445205170230-053b83e26dd7',
    '1490481651871-ab68de25d43d',
    '1512436991641-6745cae8528e',
  ],
  Home: [
    '1513519245088-0e12902e5a38',
    '1524758631624-e2822e304c36',
    '1505693416388-ac5ce068fe85',
    '1556909114-f6e7ad7d3136',
    '1484101403633-562f891dc89a',
  ],
  Beauty: [
    '1512446819047-4c62175c2005',
    '1522335777465-50149b6e1f41',
    '1596462502278-27bfdc403348',
    '1571781926291-c77da103c14e',
    '1503236823255-152405cbe7c2',
  ],
  Sports: [
    '1517836357463-d25dfeac3438',
    '1517438984742-1262db08379e',
    '1434596954615-59fbd0c0b557',
    '1526506118085-60ce8714f8c5',
    '1549060279-7e168fcee0c2',
  ],
  Toys: [
    '1537655780520-1e392ede8139',
    '1558060370-d644479cb6f7',
    '1515488042361-ee00e0ddd4e4',
    '1587654780291-39c9404d58be',
    '1472457897821-70d3819a0e24',
  ],
  Grocery: [
    '1542838132-92c53300491e',
    '1506368249639-73a05d6f6488',
    '1543168253-40520932252c',
    '1610832958506-a03559b6e838',
    '1488459716781-31db52582fe9',
  ],
  Automotive: [
    '1492144531155-ad8d5f4c2921',
    '1503376780353-7e6692767b70',
    '1533473359331-0135ef1b58bf',
    '1544636331-e28e68a17c9e',
    '1549317661-cf369843f2af',
  ],
  Books: [
    '1495442358998-961f6d17fbb5',
    '1512820790803-83ca734da794',
    '1589998059171-d88d334039f2',
    '1550399105-c4db5952163d',
    '1481627834876-b7833e8f5570',
  ],
}

const SUB_CATEGORIES: Record<MainCategory, string[]> = {
  Mobiles: [
    'Flagship',
    'Budget',
    'Mid-range',
    '5G Phones',
    'iPhones',
    'Refurbished',
    'Gaming Phones',
    'Tablets',
    'Foldables',
    'Accessories',
  ],
  Laptops: [
    'Workstations',
    'Gaming',
    'Ultrabooks',
    'Student',
    'MacBooks',
    'Chromebooks',
    '2-in-1s',
    'Monitors',
    'Peripherals',
    'Servers',
  ],
  Fashion: [
    'Menswear',
    'Womenswear',
    'Kids',
    'Footwear',
    'Watches',
    'Jewelry',
    'Bags',
    'Activewear',
    'Winterwear',
    'Luxury',
  ],
  Home: [
    'Furniture',
    'Kitchen',
    'Decor',
    'Bedding',
    'Lighting',
    'Garden',
    'Smart Home',
    'Appliances',
    'Storage',
    'Wall Art',
  ],
  Beauty: [
    'Skincare',
    'Makeup',
    'Haircare',
    'Fragrance',
    'Bath & Body',
    'Tools',
    'Mens Grooming',
    'Natural',
    'Sunscreen',
    'Professional',
  ],
  Sports: [
    'Fitness',
    'Running',
    'Cycling',
    'Swimming',
    'Cricket',
    'Football',
    'Yoga',
    'Racket Sports',
    'Golf',
    'Adventure',
  ],
  Toys: [
    'Education',
    'Action Figures',
    'Dolls',
    'Board Games',
    'Puzzles',
    'Lego',
    'Remote Control',
    'Plush',
    'Outdoors',
    'Collectibles',
  ],
  Grocery: [
    'Beverages',
    'Snacks',
    'Pantry',
    'Organic',
    'Dairy',
    'Frozen',
    'Health Food',
    'Sweets',
    'Spices',
    'International',
  ],
  Automotive: [
    'Car Care',
    'Accessories',
    'Parts',
    'Electronics',
    'Tools',
    'Tyres',
    'Oil & Fluids',
    'Safety',
    'Motorbike',
    'Cleaning',
  ],
  Books: [
    'Fiction',
    'Non-Fiction',
    'Business',
    'Tech',
    'Self-Help',
    'Children',
    'Cookbooks',
    'Comics',
    'Education',
    'Biography',
  ],
}

const BRANDS: string[] = [
  'Samsung',
  'Apple',
  'Sony',
  'LG',
  'Philips',
  'Bosch',
  'Nike',
  'Adidas',
  'Puma',
  'Asus',
  'Dell',
  'HP',
  'Lenovo',
  'OnePlus',
  'Xiaomi',
]

const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const randomBrand = (): string => BRANDS[randomInt(0, BRANDS.length - 1)]

const toSlug = (value: string): string => {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const toImageUrl = (imageId: string): string => {
  return `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&q=80&w=800`
}

const generateProducts = (): Product[] => {
  const products: Product[] = []
  let id = 1

  for (const mainCategory of MAIN_CATEGORIES) {
    const subCategories = SUB_CATEGORIES[mainCategory]
    const imageIds = CATEGORY_IMAGES[mainCategory]

    for (const subCategory of subCategories) {
      for (let i = 1; i <= 20; i += 1) {
        const brand = randomBrand()
        const name = `${subCategory} Pro ${i} — ${brand}`
        const price = randomInt(1299, 86999)
        const createdAt = new Date().toISOString()
        const primaryImageIndex = i % 5
        const galleryIndexes = [(i + 1) % 5, (i + 2) % 5, (i + 3) % 5]

        products.push({
          id,
          name,
          slug: toSlug(name),
          price,
          originalPrice: Math.round(price * 1.15),
          discount: 15,
          description: `${name} is engineered for reliable ${subCategory.toLowerCase()} performance with high-quality components and global standards. This ${mainCategory.toLowerCase()} product is curated for professional and everyday buyers who need consistent value.`,
          mainCategory,
          subCategory,
          image: toImageUrl(imageIds[primaryImageIndex]),
          images: galleryIndexes.map((imageIndex) => toImageUrl(imageIds[imageIndex])),
          brand,
          rating: Number((randomInt(35, 50) / 10).toFixed(1)),
          reviewCount: randomInt(50, 2000),
          stock: randomInt(5, 50),
          warranty: '1 Year Brand Warranty',
          specs: {
            Display: '6.1"',
            Storage: '128GB',
            RAM: '8GB',
            Battery: '4500mAh',
          },
          affiliateUrl: `/go/amazon-${id}`,
          source: 'Amazon',
          status: 'Approved',
          isFeatured: id % 10 === 0,
          isTrending: id % 7 === 0,
          createdAt,
        })

        id += 1
      }
    }
  }

  return products
}

export const PRODUCTS: Product[] = generateProducts()

export { SUB_CATEGORIES, CATEGORY_IMAGES }
