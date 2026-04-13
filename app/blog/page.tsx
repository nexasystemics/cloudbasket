import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ArrowRight, Tag, TrendingUp, Bell } from 'lucide-react'
import { getDailyDeals } from '@/lib/deals-engine'

export const metadata: Metadata = {
  title: "Buying Guides, Deal Alerts and Brand Reviews | CloudBasket Blog",
  description: "India's most trusted price comparison blog. Expert buying guides, deal alerts, product reviews and brand spotlights to help you save more.",
  openGraph: {
    title: "CloudBasket Blog — Buying Guides & Deal Alerts",
    description: "India's most trusted price comparison blog.",
    images: [{ url: '/brand/og-image.svg', width: 1200, height: 630 }],
  },
}

const BLOG_POSTS = [
  { slug: 'best-smartphones-under-20000', title: 'Best Smartphones Under ₹20,000 in 2026', excerpt: 'We compared 47 smartphones across Amazon, Flipkart and CJ Global to find the absolute best value.', tag: 'Buying Guide', category: 'buying-guide', date: 'March 5, 2026', readTime: '8 min', color: 'from-blue-600 to-blue-800', featured: true },
  { slug: 'top-laptops-under-50000', title: 'Top 10 Laptops Under ₹50,000 — March 2026', excerpt: 'Top 10 laptops under ₹50,000 tested and ranked for students, professionals and creators.', tag: 'Buying Guide', category: 'buying-guide', date: 'March 3, 2026', readTime: '6 min', color: 'from-purple-600 to-purple-800', featured: false },
  { slug: 'amazon-vs-flipkart-2026', title: 'Amazon vs Flipkart: Who Has Better Prices in 2026?', excerpt: 'We compared 500 products across both platforms. The results may surprise you.', tag: 'Analysis', category: 'product-review', date: 'March 1, 2026', readTime: '10 min', color: 'from-orange-600 to-orange-800', featured: false },
  { slug: 'best-ac-deals-summer-2026', title: 'How to Get the Best Deal on ACs This Summer', excerpt: 'Everything you need to know to buy an AC at the lowest price this summer.', tag: 'Deal Alert', category: 'deal-alert', date: 'Feb 28, 2026', readTime: '5 min', color: 'from-cyan-600 to-cyan-800', featured: false },
  { slug: 'best-headphones-under-5000', title: 'Best Noise Cancelling Headphones Under ₹5,000', excerpt: 'Top noise cancelling headphones tested under ₹5,000 — boAt, JBL, Sony compared.', tag: 'Buying Guide', category: 'buying-guide', date: 'Feb 25, 2026', readTime: '7 min', color: 'from-green-600 to-green-800', featured: false },
  { slug: 'cj-global-vs-amazon-india', title: 'CJ Global vs Amazon India: Price Comparison 2026', excerpt: 'Is CJ Global actually cheaper than Amazon India? We compared 200 products.', tag: 'Analysis', category: 'product-review', date: 'Feb 22, 2026', readTime: '4 min', color: 'from-red-600 to-red-800', featured: false },
  { slug: 'smart-tv-under-30000', title: "Smart TVs Under ₹30,000: Complete Buyer's Guide", excerpt: "The best smart TVs under ₹30,000 in 2026, tested and ranked.", tag: 'Buying Guide', category: 'buying-guide', date: 'Feb 20, 2026', readTime: '9 min', color: 'from-indigo-600 to-indigo-800', featured: false },
  { slug: 'best-mixer-grinders-india-2026', title: 'Best Mixer Grinders in India 2026 — Bajaj vs Philips vs Prestige', excerpt: 'Complete comparison of the top mixer grinder brands in India with price analysis.', tag: 'Brand Spotlight', category: 'brand-spotlight', date: 'Feb 18, 2026', readTime: '8 min', color: 'from-yellow-600 to-yellow-800', featured: false },
  { slug: 'boat-vs-noise-earbuds-2026', title: 'boAt vs Noise: Which Budget Earbuds Brand Wins in 2026?', excerpt: 'Head-to-head comparison of India\'s two biggest budget audio brands.', tag: 'Brand Spotlight', category: 'brand-spotlight', date: 'Feb 15, 2026', readTime: '7 min', color: 'from-pink-600 to-pink-800', featured: false },
  { slug: 'top-dabur-products-india', title: 'Top 10 Dabur Products Every Indian Home Should Have', excerpt: 'From Dabur Honey to Chyawanprash — the essential Dabur products and best prices.', tag: 'Brand Spotlight', category: 'brand-spotlight', date: 'Feb 12, 2026', readTime: '6 min', color: 'from-emerald-600 to-emerald-800', featured: false },
  { slug: 'godrej-vs-samsung-refrigerator-india', title: 'Godrej vs Samsung: Refrigerator Buying Guide India 2026', excerpt: 'Which brand offers better value for refrigerators in India? Complete comparison.', tag: 'Buying Guide', category: 'buying-guide', date: 'Feb 10, 2026', readTime: '9 min', color: 'from-teal-600 to-teal-800', featured: false },
  { slug: 'cloudbasket-how-to-get-best-deals', title: 'How to Get the Best Deals on Amazon and Flipkart Using CloudBasket', excerpt: 'Step-by-step guide to using CloudBasket to find the lowest prices every time.', tag: 'How-To', category: 'how-to', date: 'Feb 8, 2026', readTime: '5 min', color: 'from-sky-600 to-sky-800', featured: false },
]

const CATEGORIES = ['All', 'Buying Guide', 'Deal Alert', 'Product Review', 'Brand Spotlight', 'How-To']

export default function BlogPage() {
  const featured = BLOG_POSTS[0]
  const topDeals = getDailyDeals(1)
  const topDeal = topDeals[0]

  return (
    <main className="bg-[var(--cb-bg)]">
      {/* Hero */}
      <section className="bg-[var(--cb-surface-2)] py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <span className="cb-badge cb-badge-blue mb-4 inline-flex items-center gap-2">
            <Tag size={13} /> CloudBasket Blog
          </span>
          <h1 className="text-4xl font-black tracking-tighter md:text-5xl">Buying Guides, Deal Alerts & Brand Reviews</h1>
          <p className="mt-3 text-lg text-[var(--cb-text-muted)]">India's most trusted price comparison blog</p>
          <input className="cb-input mx-auto mt-6 block w-full max-w-md" placeholder="Search articles..." aria-label="Search articles" />
        </div>
      </section>

      {/* Category Tabs */}
      <section className="sticky top-0 z-30 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-[var(--cb-border)]">
        <div className="mx-auto max-w-7xl px-6 py-3 flex gap-2 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <span key={cat} className="cb-badge cursor-pointer whitespace-nowrap px-4 py-2 hover:cb-badge-blue transition-colors">
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* Featured Post */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <article className="cb-card overflow-hidden md:flex">
          <div className={`relative h-64 bg-gradient-to-br ${featured.color} md:h-auto md:w-1/2`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <span className="cb-badge bg-white/20 text-white border-white/20 mb-3">{featured.tag}</span>
                <p className="text-4xl font-black mt-2">Featured</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center p-8 md:w-1/2">
            <span className="cb-badge cb-badge-orange mb-3 w-fit">Featured Post</span>
            <h2 className="text-2xl font-black tracking-tighter leading-tight">{featured.title}</h2>
            <p className="mt-3 text-[var(--cb-text-muted)] text-sm leading-relaxed">{featured.excerpt}</p>
            <div className="mt-4 flex items-center gap-4 text-xs text-[var(--cb-text-muted)]">
              <span className="inline-flex items-center gap-1"><Calendar size={12} /> {featured.date}</span>
              <span className="inline-flex items-center gap-1"><Clock size={12} /> {featured.readTime} read</span>
            </div>
            <Link href={`/blog/${featured.slug}`} className="cb-btn cb-btn-primary mt-5 w-fit gap-2">
              Read Article <ArrowRight size={16} />
            </Link>
          </div>
        </article>
      </section>

      {/* Main Content + Sidebar */}
      <section className="mx-auto max-w-7xl px-6 pb-16 lg:grid lg:grid-cols-[1fr_300px] lg:gap-10">
        {/* Articles Grid */}
        <div>
          <h2 className="text-2xl font-black tracking-tighter mb-6">Latest Articles</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {BLOG_POSTS.slice(1).map((post) => (
              <article key={post.slug} className="cb-card group overflow-hidden">
                <div className={`h-44 bg-gradient-to-br ${post.color} flex items-end p-4`}>
                  <span className="cb-badge bg-white/20 text-white border-white/20 text-[10px]">{post.tag}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-black line-clamp-2 group-hover:text-skyline-primary transition-colors leading-snug">{post.title}</h3>
                  <p className="mt-2 text-xs text-[var(--cb-text-muted)] line-clamp-2">{post.excerpt}</p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-[var(--cb-text-muted)]">
                    <span className="inline-flex items-center gap-1"><Calendar size={11} /> {post.date}</span>
                    <span className="inline-flex items-center gap-1"><Clock size={11} /> {post.readTime}</span>
                  </div>
                  <Link href={`/blog/${post.slug}`} className="cb-btn cb-btn-ghost mt-4 w-full gap-1 text-xs">
                    Read More <ArrowRight size={12} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="mt-10 space-y-6 lg:mt-0">
          {/* Trending */}
          <div className="cb-card p-5">
            <h3 className="font-black mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-skyline-primary" /> Trending Articles</h3>
            <div className="space-y-3">
              {BLOG_POSTS.slice(0, 5).map((post, i) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="flex gap-3 group">
                  <span className="text-2xl font-black text-[var(--cb-text-muted)] w-8 flex-shrink-0">{i + 1}</span>
                  <p className="text-sm font-bold group-hover:text-skyline-primary transition-colors line-clamp-2">{post.title}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Price Alert CTA */}
          <div className="cb-card p-5 bg-skyline-primary/5 border-skyline-primary/20">
            <Bell size={20} className="text-skyline-primary mb-3" />
            <h3 className="font-black mb-1">Get Price Drop Alerts</h3>
            <p className="text-xs text-[var(--cb-text-muted)] mb-3">Be the first to know when prices drop on products you want.</p>
            <Link href="/search" className="cb-btn cb-btn-primary w-full text-sm">Set Price Alert →</Link>
          </div>

          {/* Top Deal Widget */}
          {topDeal && (
            <div className="cb-card p-5">
              <h3 className="font-black mb-4 text-sm uppercase tracking-widest text-[var(--cb-text-muted)]">Top Deal Today</h3>
              <div className="space-y-2">
                <p className="font-black text-sm line-clamp-2">{topDeal.title}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-skyline-primary">₹{topDeal.dealPrice.toLocaleString('en-IN')}</span>
                  <span className="text-xs line-through text-[var(--cb-text-muted)]">₹{topDeal.originalPrice.toLocaleString('en-IN')}</span>
                </div>
                <span className="cb-badge cb-badge-green">{topDeal.discountPercent}% OFF</span>
                <Link href={`/product/${topDeal.id}`} className="cb-btn cb-btn-primary w-full text-xs mt-2">View Deal →</Link>
              </div>
            </div>
          )}
        </aside>
      </section>
    </main>
  )
}