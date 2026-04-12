import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ShoppingBag, Star, Printer } from 'lucide-react'
import { getProductImage } from '@/lib/utils/product-image'

type PODProduct = {
  id: string
  name: string
  image: string
  price: number
  originalPrice: number
  rating: number
  reviews: number
  colors: string[]
  sizes: string[]
}

type PODCategory = {
  name: string
  desc: string
  count: number
  image: string
  products: PODProduct[]
}

const TSHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const MUG_SIZES = ['250ml', '320ml', '400ml']
const CASE_SIZES = ['Samsung', 'iPhone', 'OnePlus', 'Pixel']
const GENERIC_SIZES = ['Standard', 'Large', 'XL']

const POD_META: Record<string, PODCategory> = {
  tshirts: {
    name: 'T-Shirts',
    desc: 'Premium cotton tees with custom prints for daily wear and statement looks.',
    count: 48,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1000&q=80',
    products: [
      { id: 'tshirt-1', name: 'India Pride Tee', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80', price: 599, originalPrice: 899, rating: 4.6, reviews: 218, colors: ['#111827', '#FFFFFF', '#2563EB'], sizes: TSHIRT_SIZES },
      { id: 'tshirt-2', name: 'Minimal Black Tee', image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80', price: 549, originalPrice: 849, rating: 4.4, reviews: 162, colors: ['#000000', '#374151', '#9CA3AF'], sizes: TSHIRT_SIZES },
      { id: 'tshirt-3', name: 'NEXQON Logo Tee', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80', price: 649, originalPrice: 949, rating: 4.8, reviews: 301, colors: ['#039BE5', '#FFFFFF', '#0F172A'], sizes: TSHIRT_SIZES },
      { id: 'tshirt-4', name: 'CloudBasket OG Tee', image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80', price: 599, originalPrice: 899, rating: 4.5, reviews: 194, colors: ['#16A34A', '#F59E0B', '#111827'], sizes: TSHIRT_SIZES },
      { id: 'tshirt-5', name: 'Geometric Print Tee', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80', price: 699, originalPrice: 999, rating: 4.7, reviews: 128, colors: ['#7C3AED', '#EC4899', '#F59E0B'], sizes: TSHIRT_SIZES },
      { id: 'tshirt-6', name: 'Vintage Wash Tee', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80', price: 749, originalPrice: 1099, rating: 4.6, reviews: 89, colors: ['#78350F', '#92400E', '#A16207'], sizes: TSHIRT_SIZES },
      { id: 'tshirt-7', name: 'Urban Street Tee', image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80', price: 629, originalPrice: 929, rating: 4.3, reviews: 74, colors: ['#111827', '#DB2777', '#4F46E5'], sizes: TSHIRT_SIZES },
      { id: 'tshirt-8', name: 'NEXQON Matrix Tee', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80', price: 799, originalPrice: 1199, rating: 4.9, reviews: 267, colors: ['#0F172A', '#039BE5', '#22C55E'], sizes: TSHIRT_SIZES },
      { id: 'tshirt-9', name: 'Minimal White Tee', image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80', price: 579, originalPrice: 879, rating: 4.2, reviews: 55, colors: ['#FFFFFF', '#E5E7EB', '#D1D5DB'], sizes: TSHIRT_SIZES },
      { id: 'tshirt-10', name: 'Retro Gradient Tee', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80', price: 849, originalPrice: 1249, rating: 4.8, reviews: 141, colors: ['#F97316', '#8B5CF6', '#14B8A6'], sizes: TSHIRT_SIZES },
      { id: 'tshirt-11', name: 'Creator Edition Tee', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80', price: 689, originalPrice: 989, rating: 4.5, reviews: 93, colors: ['#111827', '#10B981', '#F59E0B'], sizes: TSHIRT_SIZES },
      { id: 'tshirt-12', name: 'Midnight Blue Tee', image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80', price: 769, originalPrice: 1149, rating: 4.7, reviews: 176, colors: ['#039BE5', '#1D4ED8', '#60A5FA'], sizes: TSHIRT_SIZES },
    ],
  },
  mugs: {
    name: 'Mugs & Drinkware',
    desc: 'Ceramic mugs and insulated drinkware with durable print finishes.',
    count: 32,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=1000&q=80',
    products: [
      { id: 'mug-1', name: 'India Pride Mug', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80', price: 349, originalPrice: 549, rating: 4.6, reviews: 322, colors: ['#FFFFFF', '#111827', '#EF4444'], sizes: MUG_SIZES },
      { id: 'mug-2', name: 'CloudBasket Mug', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80', price: 399, originalPrice: 599, rating: 4.7, reviews: 178, colors: ['#039BE5', '#FFFFFF', '#0F172A'], sizes: MUG_SIZES },
      { id: 'mug-3', name: 'Minimal White Mug', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80', price: 329, originalPrice: 499, rating: 4.4, reviews: 95, colors: ['#FFFFFF', '#E5E7EB', '#94A3B8'], sizes: MUG_SIZES },
      { id: 'mug-4', name: 'Classic Black Mug', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80', price: 379, originalPrice: 569, rating: 4.5, reviews: 111, colors: ['#000000', '#374151', '#6B7280'], sizes: MUG_SIZES },
      { id: 'mug-5', name: 'Motivation Quote Mug', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80', price: 299, originalPrice: 449, rating: 4.2, reviews: 67, colors: ['#F59E0B', '#FFFFFF', '#111827'], sizes: MUG_SIZES },
      { id: 'mug-6', name: 'Code Fuel Mug', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80', price: 429, originalPrice: 629, rating: 4.8, reviews: 206, colors: ['#111827', '#10B981', '#22C55E'], sizes: MUG_SIZES },
      { id: 'mug-7', name: 'Blue Circuit Mug', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80', price: 389, originalPrice: 579, rating: 4.3, reviews: 88, colors: ['#1D4ED8', '#60A5FA', '#DBEAFE'], sizes: MUG_SIZES },
      { id: 'mug-8', name: 'Premium Matte Mug', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80', price: 499, originalPrice: 749, rating: 4.9, reviews: 149, colors: ['#111827', '#F3F4F6', '#9333EA'], sizes: MUG_SIZES },
      { id: 'mug-9', name: 'Midnight Ceramic Mug', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80', price: 359, originalPrice: 539, rating: 4.4, reviews: 73, colors: ['#020617', '#1E293B', '#475569'], sizes: MUG_SIZES },
      { id: 'mug-10', name: 'Team NEXQON Mug', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80', price: 449, originalPrice: 679, rating: 4.7, reviews: 194, colors: ['#039BE5', '#0F172A', '#FFFFFF'], sizes: MUG_SIZES },
      { id: 'mug-11', name: 'Weekend Chill Mug', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80', price: 319, originalPrice: 489, rating: 4.1, reviews: 51, colors: ['#84CC16', '#FACC15', '#FB7185'], sizes: MUG_SIZES },
      { id: 'mug-12', name: 'Thermal Travel Cup', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80', price: 489, originalPrice: 699, rating: 4.6, reviews: 122, colors: ['#111827', '#DC2626', '#0EA5E9'], sizes: MUG_SIZES },
    ],
  },
  'phone-cases': {
    name: 'Phone Cases',
    desc: 'Shockproof, slim and custom printed cases for popular flagship devices.',
    count: 64,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1000&q=80',
    products: [
      { id: 'case-1', name: 'Samsung S25 Case', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80', price: 299, originalPrice: 499, rating: 4.5, reviews: 302, colors: ['#111827', '#0EA5E9', '#F59E0B'], sizes: CASE_SIZES },
      { id: 'case-2', name: 'iPhone 16 Case', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80', price: 349, originalPrice: 549, rating: 4.8, reviews: 420, colors: ['#FFFFFF', '#111827', '#EC4899'], sizes: CASE_SIZES },
      { id: 'case-3', name: 'OnePlus 13 Case', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80', price: 279, originalPrice: 449, rating: 4.4, reviews: 198, colors: ['#EF4444', '#111827', '#9CA3AF'], sizes: CASE_SIZES },
      { id: 'case-4', name: 'Pixel 9 Shield Case', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80', price: 319, originalPrice: 499, rating: 4.6, reviews: 145, colors: ['#1D4ED8', '#0F172A', '#22C55E'], sizes: CASE_SIZES },
      { id: 'case-5', name: 'Galaxy Fold Case', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80', price: 399, originalPrice: 599, rating: 4.7, reviews: 84, colors: ['#0F172A', '#4B5563', '#A855F7'], sizes: CASE_SIZES },
      { id: 'case-6', name: 'iPhone MagSafe Case', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80', price: 379, originalPrice: 579, rating: 4.9, reviews: 337, colors: ['#FFFFFF', '#94A3B8', '#111827'], sizes: CASE_SIZES },
      { id: 'case-7', name: 'OnePlus Carbon Case', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80', price: 329, originalPrice: 519, rating: 4.5, reviews: 122, colors: ['#111827', '#334155', '#64748B'], sizes: CASE_SIZES },
      { id: 'case-8', name: 'Samsung Armor Case', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80', price: 359, originalPrice: 559, rating: 4.3, reviews: 101, colors: ['#16A34A', '#111827', '#DC2626'], sizes: CASE_SIZES },
      { id: 'case-9', name: 'iPhone Clear Shield', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80', price: 249, originalPrice: 399, rating: 4.1, reviews: 56, colors: ['#FFFFFF', '#CBD5E1', '#E2E8F0'], sizes: CASE_SIZES },
      { id: 'case-10', name: 'Pixel Matte Grip Case', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80', price: 289, originalPrice: 459, rating: 4.2, reviews: 64, colors: ['#111827', '#10B981', '#0EA5E9'], sizes: CASE_SIZES },
      { id: 'case-11', name: 'Samsung Neon Case', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80', price: 319, originalPrice: 499, rating: 4.4, reviews: 77, colors: ['#E11D48', '#F59E0B', '#7C3AED'], sizes: CASE_SIZES },
      { id: 'case-12', name: 'OnePlus Studio Case', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80', price: 399, originalPrice: 599, rating: 4.8, reviews: 158, colors: ['#039BE5', '#111827', '#FFFFFF'], sizes: CASE_SIZES },
    ],
  },
  posters: {
    name: 'Posters & Prints',
    desc: 'Museum quality poster paper and vibrant color prints for desks and walls.',
    count: 28,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1000&q=80',
    products: Array.from({ length: 12 }, (_, index) => ({
      id: `poster-${index + 1}`,
      name: `Signature Poster #${index + 1}`,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
      price: 449 + index * 20,
      originalPrice: 699 + index * 20,
      rating: 4.1 + (index % 5) * 0.15,
      reviews: 40 + index * 11,
      colors: ['#111827', '#F97316', '#8B5CF6', '#0EA5E9'],
      sizes: GENERIC_SIZES,
    })),
  },
  hoodies: {
    name: 'Hoodies',
    desc: 'Heavyweight fleece hoodies for comfort-first style and premium feel.',
    count: 24,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=1000&q=80',
    products: Array.from({ length: 12 }, (_, index) => ({
      id: `hoodie-${index + 1}`,
      name: `Cloud Hoodie ${index + 1}`,
      image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80',
      price: 999 + index * 40,
      originalPrice: 1399 + index * 45,
      rating: 4.2 + (index % 4) * 0.2,
      reviews: 35 + index * 9,
      colors: ['#111827', '#334155', '#EC4899', '#10B981'],
      sizes: TSHIRT_SIZES,
    })),
  },
  'tote-bags': {
    name: 'Tote Bags',
    desc: 'Reusable canvas tote bags with durable stitching and long-wear prints.',
    count: 20,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1000&q=80',
    products: Array.from({ length: 12 }, (_, index) => ({
      id: `tote-${index + 1}`,
      name: `Eco Tote ${index + 1}`,
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80',
      price: 449 + index * 18,
      originalPrice: 649 + index * 18,
      rating: 4.0 + (index % 5) * 0.18,
      reviews: 24 + index * 7,
      colors: ['#A16207', '#FFFFFF', '#111827', '#22C55E'],
      sizes: GENERIC_SIZES,
    })),
  },
}

export async function generateStaticParams() {
  return Object.keys(POD_META).map((category) => ({ category }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const meta = POD_META[category]

  if (!meta) return { title: 'Category Not Found | CloudBasket POD' }

  const title = `${meta.name} | Print on Demand | CloudBasket`
  const description = `${meta.desc} Explore our collection of ${meta.count} unique designs. Discover custom ${meta.name.toLowerCase()} at best prices.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://cloudbasket.in/pod/${category}`,
      images: [{ url: meta.image }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [meta.image],
    },
  }
}

export default async function PODCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const meta = POD_META[category]

  if (!meta) {
    notFound()
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://cloudbasket.in' },
      { '@type': 'ListItem', position: 2, name: 'POD', item: 'https://cloudbasket.in/pod' },
      { '@type': 'ListItem', position: 3, name: meta.name, item: `https://cloudbasket.in/pod/${category}` },
    ],
  }

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${meta.name} Designs | CloudBasket Originals`,
    description: meta.desc,
    url: `https://cloudbasket.in/pod/${category}`,
    numberOfItems: meta.products.length,
    itemListElement: meta.products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        image: product.image,
        brand: { '@type': 'Brand', name: 'CloudBasket Originals' },
        offers: { '@type': 'Offer', price: product.price, priceCurrency: 'INR', availability: 'https://schema.org/InStock', url: `https://cloudbasket.in/go/pod-${product.id}` },
      },
    })),
  }

  return (
    <main className="bg-[var(--cb-bg)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <section className="bg-[var(--cb-surface-2)] py-12">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs text-[var(--cb-text-muted)]">Home / POD / {meta.name}</p>
          <h1 className="mt-2 text-4xl font-black tracking-tighter">{meta.name}</h1>
          <p className="mt-2 text-[var(--cb-text-muted)]">{meta.desc}</p>
          <span className="cb-badge cb-badge-orange mt-3">
            <Printer size={12} /> {meta.count} designs
          </span>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-4">
        <div className="ad-slot-leaderboard">Ad Space · Contact us to advertise</div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 pb-16">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {meta.products.map((product) => (
            <article key={product.id} className="cb-card group overflow-hidden">
              <div className="relative h-56">
                <Image fill className="object-cover" src={getProductImage(product.image, 'fashion')} alt={product.name} />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <button type="button" className="cb-btn bg-white text-xs text-[#09090B]">
                    Quick View
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="line-clamp-2 text-sm font-black">{product.name}</h3>

                <div className="mt-1 flex items-center gap-1 text-xs text-[var(--cb-text-muted)]">
                  <span className="inline-flex items-center gap-0.5 text-[#F5C842]">
                    <Star size={11} fill="currentColor" />
                    <Star size={11} fill="currentColor" />
                    <Star size={11} fill="currentColor" />
                    <Star size={11} fill="currentColor" />
                    <Star size={11} />
                  </span>
                  <span>
                    {product.rating.toFixed(1)} ({product.reviews})
                  </span>
                </div>

                <div className="mt-2 flex gap-1">
                  {product.colors.map((color) => (
                    <span
                      key={`${product.id}-${color}`}
                      className="h-4 w-4 rounded-full border-2 border-white"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                <p className="mt-2 line-clamp-1 text-[10px] uppercase tracking-widest text-[var(--cb-text-muted)]">
                  Sizes: {product.sizes.join(' / ')}
                </p>

                <div className="mt-2 flex items-baseline gap-2">
                  <p className="price-current">₹{product.price.toLocaleString('en-IN')}</p>
                  <p className="price-original text-xs">₹{product.originalPrice.toLocaleString('en-IN')}</p>
                </div>

                <Link href={`/go/pod-${product.id}`} className="cb-btn cb-btn-orange mt-3 w-full gap-1 text-sm">
                  <ShoppingBag size={14} /> Buy Now
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
