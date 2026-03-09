import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, SlidersHorizontal, ChevronDown, Star, Zap, TrendingDown } from 'lucide-react'
import TrackBehavior from '@/components/TrackBehavior'
import { PRODUCTS as MOCK_PRODUCTS } from '@/lib/mock-data'
const CATEGORY_META: Record<string, { title: string; description: string }> = {
  mobiles: {
    title: 'Mobile Phones - Best Prices in India',
    description: 'Compare mobile phone prices across Amazon, Flipkart & more. Find the lowest price on iPhone, Samsung, OnePlus & all brands.'
  },
  laptops: {
    title: 'Laptops - Best Prices in India',
    description: 'Compare laptop prices. Best deals on MacBook, Dell, HP, Lenovo across all major stores.'
  },
  fashion: {
    title: 'Fashion - Best Deals on Clothing & Accessories',
    description: 'Best fashion deals from Amazon, Flipkart, Myntra. Clothing, shoes, bags at lowest prices.'
  },
  home: {
    title: 'Home & Kitchen - Best Prices',
    description: 'Compare home appliance and furniture prices. Best deals on kitchen, decor and more.'
  },
  beauty: {
    title: 'Beauty & Personal Care - Best Deals',
    description: 'Best prices on beauty, skincare and personal care products across all stores.'
  },
  sports: {
    title: 'Sports & Fitness - Best Prices',
    description: 'Compare prices on sports equipment, fitness gear and outdoor products.'
  },
  toys: {
    title: 'Toys & Games - Best Prices for Kids',
    description: 'Best deals on toys, board games and kids products across Amazon and Flipkart.'
  },
  grocery: {
    title: 'Grocery - Best Online Prices',
    description: 'Compare grocery prices across Blinkit, Zepto, Amazon Fresh and more.'
  },
  automotive: {
    title: 'Automotive - Best Prices on Car Accessories',
    description: 'Best deals on car accessories, tools and automotive products.'
  },
  books: {
    title: 'Books - Best Prices in India',
    description: 'Compare book prices across Amazon, Flipkart and more. Best deals on all genres.'
  },
}

const CATEGORY_ALIASES: Record<string, keyof typeof CATEGORY_CONTENT> = {
  electronics: 'mobiles',
  health: 'beauty',
  food: 'grocery',
  auto: 'automotive',
  finance: 'books',
  gaming: 'toys',
  investments: 'books',
  jewellery: 'fashion',
  music: 'books',
  courses: 'books',
  travel: 'automotive',
  watches: 'fashion',
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const resolvedSlug = CATEGORY_ALIASES[slug] ?? slug
  const meta = CATEGORY_META[resolvedSlug] ?? {
    title: `${resolvedSlug.charAt(0).toUpperCase() + resolvedSlug.slice(1)} - Best Prices`,
    description: `Compare ${resolvedSlug} prices across Amazon, Flipkart and more.`,
  }
  return {
    title: meta.title,
    description: meta.description,
  }
}

const CATEGORY_CONTENT = {
  mobiles: {
    title: 'Mobiles & Smartphones',
    desc: 'Best prices on smartphones from Samsung, Apple, OnePlus & more',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80',
    count: 200,
    color: '#039BE5',
  },
  laptops: {
    title: 'Laptops & Computers',
    desc: 'Top deals on laptops from Dell, HP, Lenovo, Apple & more',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80',
    count: 150,
    color: '#334155',
  },
  fashion: {
    title: 'Fashion & Apparel',
    desc: 'Latest trends in clothing, footwear and accessories',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80',
    count: 500,
    color: '#EC4899',
  },
  home: {
    title: 'Home & Living',
    desc: 'Everything for your home at the best prices',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&q=80',
    count: 300,
    color: '#F97316',
  },
  beauty: {
    title: 'Beauty & Skincare',
    desc: 'Top beauty brands at unbeatable prices',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&q=80',
    count: 250,
    color: '#8B5CF6',
  },
  sports: {
    title: 'Sports & Fitness',
    desc: 'Gear up with the best sports equipment deals',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80',
    count: 180,
    color: '#10B981',
  },
  toys: {
    title: 'Toys & Games',
    desc: 'Best deals on toys, games and entertainment',
    image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=1200&q=80',
    count: 120,
    color: '#F5C842',
  },
  grocery: {
    title: 'Grocery & Essentials',
    desc: 'Daily essentials at the lowest prices',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80',
    count: 400,
    color: '#84CC16',
  },
  automotive: {
    title: 'Automotive & Accessories',
    desc: 'Car and bike accessories at best prices',
    image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80',
    count: 90,
    color: '#EF4444',
  },
  books: {
    title: 'Books & Education',
    desc: 'Bestsellers and educational books at lowest prices',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80',
    count: 200,
    color: '#6366F1',
  },
} as const

type CategorySlug = keyof typeof CATEGORY_CONTENT

type Product = (typeof MOCK_PRODUCTS)[number]

const QUICK_PRICE_FILTERS: readonly string[] = ['Under ₹1K', '₹1K–5K', '₹5K–15K', '₹15K+']
const FILTER_BRANDS: readonly string[] = ['Samsung', 'Apple', 'OnePlus', 'Xiaomi', 'HP', 'Dell']
const RATING_FILTERS: readonly string[] = ['4★ & above', '3★', '2★', 'Any']
const PLATFORM_FILTERS: ReadonlyArray<{ name: string; dotClass: string }> = [
  { name: 'Amazon', dotClass: 'bg-[#FF9900]' },
  { name: 'Flipkart', dotClass: 'bg-[#2874F0]' },
  { name: 'CJ Global', dotClass: 'bg-[#10B981]' },
]

function isCategorySlug(value: string): value is CategorySlug {
  return value in CATEGORY_CONTENT
}

function getSourceBadgeClass(source: Product['source']): string {
  if (source === 'Amazon') {
    return 'bg-[#FF9900]/10 text-[#FF9900] border-[#FF9900]/20'
  }
  if (source === 'Flipkart') {
    return 'bg-[#2874F0]/10 text-[#2874F0] border-[#2874F0]/20'
  }
  return 'cb-badge-green'
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const resolvedSlug = CATEGORY_ALIASES[slug] ?? slug

  if (!isCategorySlug(resolvedSlug)) {
    notFound()
  }

  const meta = CATEGORY_CONTENT[resolvedSlug]

  const byCategory = MOCK_PRODUCTS.filter((product) => product.mainCategory.toLowerCase() === resolvedSlug)
  const products = (byCategory.length < 8 ? MOCK_PRODUCTS : byCategory).slice(0, 48)

  return (
    <main className="bg-[var(--cb-bg)]">
      <TrackBehavior category={resolvedSlug} />
      <section className="relative h-64 overflow-hidden">
        <Image fill className="object-cover" src={meta.image} alt={meta.title} priority />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 mx-auto flex w-full max-w-7xl items-end px-8 pb-10">
          <div>
            <p className="mb-3 text-xs text-white/60">Home / {meta.title}</p>
            <h1 className="text-4xl font-black tracking-tighter text-white">{meta.title}</h1>
            <p className="mt-1 text-sm text-white/70">{meta.desc}</p>
            <span className="cb-badge mt-3 border-white/30 bg-white/20 text-white">
              <TrendingDown size={12} />
              {meta.count}+ verified deals
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-4">
        <div className="ad-slot-leaderboard">Advertisement · Google AdSense · 728×90</div>
      </section>

      <section className="mx-auto flex max-w-7xl gap-6 px-6 py-8">
        <aside className="w-64 flex-shrink-0">
          <div className="cb-card p-5">
            <div className="mb-5 flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-[#039BE5]" />
              <p className="text-sm font-black">Filters</p>
            </div>

            <div>
              <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">Price Range</p>
              <div className="grid grid-cols-2 gap-2">
                <input className="cb-input py-2 text-xs" placeholder="Min ₹" />
                <input className="cb-input py-2 text-xs" placeholder="Max ₹" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {QUICK_PRICE_FILTERS.map((pill) => (
                  <span
                    key={pill}
                    className="cb-badge cb-badge-blue cursor-pointer transition-colors hover:bg-[#039BE5] hover:text-white"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">Sort By</p>
              <div className="relative">
                <select className="cb-input w-full appearance-none py-2 pe-8 text-xs">
                  <option>Relevance</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest</option>
                  <option>Top Rated</option>
                </select>
                <ChevronDown size={12} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-[var(--cb-text-muted)]" />
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">Brand</p>
              {FILTER_BRANDS.map((brand) => (
                <label key={brand} className="flex items-center gap-2 py-1">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-[var(--cb-text-secondary)]">{brand}</span>
                </label>
              ))}
            </div>

            <div className="mt-5">
              <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">Min Rating</p>
              <div className="space-y-1">
                {RATING_FILTERS.map((rating) => (
                  <span key={rating} className="cb-badge mb-1 block w-fit cursor-pointer">
                    {rating}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">Platform</p>
              <div className="space-y-1">
                {PLATFORM_FILTERS.map((platform) => (
                  <label key={platform.name} className="flex items-center gap-2 py-1">
                    <input type="checkbox" className="rounded" />
                    <span className={`h-2 w-2 rounded-full ${platform.dotClass}`} />
                    <span className="text-sm text-[var(--cb-text-secondary)]">{platform.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <button className="cb-btn cb-btn-primary mt-6 w-full">Apply Filters</button>
            <button className="cb-btn cb-btn-ghost mt-2 w-full">Reset All</button>
          </div>

          <div className="ad-slot-rectangle mt-4">Advertisement · 300×250</div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-6 flex items-center justify-between gap-3">
            <p className="text-sm text-[var(--cb-text-muted)]">
              Showing {products.length} deals in {meta.title}
            </p>
            <div className="flex items-center gap-2">
              <select className="cb-input w-auto py-1.5 text-xs">
                <option>Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Top Rated</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => {
              const originalPrice = product.originalPrice ?? Math.round(product.price * 1.2)
              const effectiveDiscount = product.discount ?? Math.round(((originalPrice - product.price) / originalPrice) * 100)

              return (
                <article key={product.id} className="cb-card group flex cursor-pointer flex-col overflow-hidden">
                  <div className="product-card-img relative h-48 overflow-hidden">
                    <Image
                      fill
                      className="object-cover"
                      src={product.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80'}
                      alt={product.name}
                    />

                    <div className="absolute left-2 top-2 flex flex-col gap-1">
                      {effectiveDiscount ? <span className="cb-badge cb-badge-green">-{effectiveDiscount}%</span> : null}
                      {product.isTrending ? (
                        <span className="cb-badge cb-badge-orange">
                          <Zap size={10} /> Hot
                        </span>
                      ) : null}
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <Link href={`/product/${product.id}`} className="cb-btn bg-white px-4 py-2 text-xs text-[#09090B]">
                        Quick View
                      </Link>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-1.5 p-3">
                    <span className={`cb-badge w-fit text-[10px] ${getSourceBadgeClass(product.source)}`}>
                      {product.source === 'CJ' ? 'CJ Global' : product.source}
                    </span>

                    <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">{product.brand}</p>

                    <h3 className="line-clamp-2 text-xs font-bold leading-snug text-[var(--cb-text-primary)]">{product.name}</h3>

                    <div className="flex items-center gap-1 text-[10px] text-[var(--cb-text-muted)]">
                      <span className="flex items-center gap-0.5 text-[#F5C842]">
                        <Star size={10} fill="currentColor" />
                        <Star size={10} fill="currentColor" />
                        <Star size={10} fill="currentColor" />
                        <Star size={10} fill="currentColor" />
                        <Star size={10} />
                      </span>
                      <span>
                        {product.rating.toFixed(1)} ({product.reviewCount})
                      </span>
                    </div>

                    <div className="mt-1 flex items-baseline gap-2">
                      <p className="price-current text-base">₹{product.price.toLocaleString('en-IN')}</p>
                      <p className="price-original text-xs">₹{originalPrice.toLocaleString('en-IN')}</p>
                    </div>

                    {effectiveDiscount ? <p className="price-savings text-xs">Save {effectiveDiscount}%</p> : null}

                    <div className="mt-auto pt-2">
                      <Link href={`/go/amazon-${product.id}`} className="cb-btn cb-btn-primary w-full py-2 text-xs">
                        View Deal <ExternalLink size={12} />
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="mt-10 flex justify-center gap-2">
            <button className="cb-btn cb-btn-ghost">Previous</button>
            {[1, 2, 3, 4, 5].map((page) => (
              <button key={page} className={`cb-btn ${page === 1 ? 'cb-btn-primary' : ''}`}>
                {page}
              </button>
            ))}
            <button className="cb-btn cb-btn-ghost">Next</button>
          </div>
        </div>

        <aside className="hidden w-40 flex-shrink-0 xl:block">
          <div className="ad-slot-skyscraper">Advertisement · 160×600</div>
        </aside>
      </section>
    </main>
  )
}

