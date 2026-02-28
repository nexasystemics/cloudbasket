import { getTheme } from '@/lib/themes'
import { headers } from 'next/headers'
import Link from 'next/link'
import { Search, Clock, User, Calendar, TrendingUp, ChevronRight, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

const CATEGORIES = [
  { id: 'reviews',     label: 'Reviews',     count: 24 },
  { id: 'guides',      label: 'Guides',      count: 18 },
  { id: 'deals',       label: 'Deals',       count: 32 },
  { id: 'tech-news',   label: 'Tech News',   count: 15 },
  { id: 'comparisons', label: 'Comparisons', count: 12 },
] as const

const FEATURED_POST = {
  id: 'featured-1',
  title: 'Top 10 Smart Home Devices for 2026',
  excerpt: 'Discover the best smart home devices that will transform your living space. From voice assistants to automated lighting, we review the top products that offer the best value and functionality.',
  category: 'Reviews',
  author: { name: 'Sarah Chen', avatar: 'SC' },
  date: 'February 15, 2026',
  readTime: '12 min read',
  image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
}

const BLOG_POSTS = [
  {
    id: '1',
    title: 'Best Budget Smartphones Under ₹15,000',
    excerpt: 'We tested 20 budget smartphones to find the best value for money. Here are our top picks that deliver excellent performance without breaking the bank.',
    category: 'Reviews',
    author: { name: 'Raj Kumar', avatar: 'RK' },
    date: 'February 14, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop',
  },
  {
    id: '2',
    title: 'How to Choose the Perfect Laptop',
    excerpt: 'A comprehensive guide to selecting the right laptop for your needs. We cover processors, RAM, storage, and everything you need to know before buying.',
    category: 'Guides',
    author: { name: 'Priya Sharma', avatar: 'PS' },
    date: 'February 13, 2026',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop',
  },
  {
    id: '3',
    title: 'Smart Shopping with Price Comparison',
    excerpt: 'Learn how to use price comparison tools effectively to save money on every purchase. Tips and tricks from shopping experts.',
    category: 'Guides',
    author: { name: 'Amit Patel', avatar: 'AP' },
    date: 'February 12, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=400&fit=crop',
  },
  {
    id: '4',
    title: 'Amazon Great Indian Festival Preview',
    excerpt: 'Everything you need to know about the upcoming Amazon sale. Best deals, timing tips, and products to watch out for.',
    category: 'Deals',
    author: { name: 'Neha Singh', avatar: 'NS' },
    date: 'February 11, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=600&h=400&fit=crop',
  },
  {
    id: '5',
    title: 'Latest Wireless Earbuds Compared',
    excerpt: 'We compare the newest wireless earbuds from Apple, Samsung, Sony, and more. Find out which ones offer the best sound quality and battery life.',
    category: 'Comparisons',
    author: { name: 'Vikram Rao', avatar: 'VR' },
    date: 'February 10, 2026',
    readTime: '9 min read',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=400&fit=crop',
  },
  {
    id: '6',
    title: '4K TV Buying Guide 2026',
    excerpt: 'Everything you need to know before buying a 4K TV. From HDR to refresh rates, we break down all the technical jargon.',
    category: 'Guides',
    author: { name: 'Anjali Mehta', avatar: 'AM' },
    date: 'February 9, 2026',
    readTime: '11 min read',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=600&h=400&fit=crop',
  },
  {
    id: '7',
    title: 'Affiliate Marketing 101',
    excerpt: 'A beginner-friendly guide to affiliate marketing. Learn how to get started, choose the right products, and maximize your earnings.',
    category: 'Guides',
    author: { name: 'Rohit Desai', avatar: 'RD' },
    date: 'February 8, 2026',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
  },
  {
    id: '8',
    title: 'Product Photography Tips',
    excerpt: 'Professional product photography techniques that will make your listings stand out. Lighting, angles, and editing tips from experts.',
    category: 'Guides',
    author: { name: 'Kavya Nair', avatar: 'KN' },
    date: 'February 7, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&fit=crop',
  },
  {
    id: '9',
    title: 'AI-Powered Shopping Assistants',
    excerpt: 'How artificial intelligence is revolutionizing online shopping. Explore the latest AI tools that help you find the best deals.',
    category: 'Tech News',
    author: { name: 'Arjun Menon', avatar: 'AM' },
    date: 'February 6, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=400&fit=crop',
  },
] as const

const POPULAR_POSTS = [
  { id: 'pop-1', title: 'Top 10 Smart Home Devices for 2026',         views: '24.5K' },
  { id: 'pop-2', title: 'Best Budget Smartphones Under ₹15,000',       views: '18.2K' },
  { id: 'pop-3', title: 'Amazon Great Indian Festival Preview',         views: '15.8K' },
  { id: 'pop-4', title: 'Latest Wireless Earbuds Compared',            views: '12.3K' },
  { id: 'pop-5', title: '4K TV Buying Guide 2026',                     views: '10.1K' },
] as const

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>
}) {
  const headersList = await headers()
  const tenant = headersList.get('x-tenant') || 'cloudbasket'
  const theme = getTheme(tenant)
  const resolved = await searchParams
  const activeCategory = resolved.category?.toLowerCase() || 'all'
  const currentPage = parseInt(resolved.page || '1', 10)

  const brandColor = '#039BE5'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#039BE5] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Blog</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section
        className="py-16 px-4 text-white"
        style={{ backgroundColor: brandColor }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            CloudBasket Insights
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Expert reviews, buying guides, and tech trends
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search blog posts..."
                className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id
              return (
                <Link
                  key={cat.id}
                  href={`/blog?category=${cat.id}`}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white shadow-lg'
                      : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                  }`}
                  style={isActive ? { color: brandColor } : undefined}
                >
                  {cat.label}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Featured + Blog Grid */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Post */}
            <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/2 overflow-hidden min-h-[300px] md:min-h-[400px]">
                  <img
                    src={FEATURED_POST.image}
                    alt={FEATURED_POST.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="inline-block rounded-full px-3 py-1 text-xs font-semibold text-white"
                      style={{ backgroundColor: brandColor }}
                    >
                      {FEATURED_POST.category}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    {FEATURED_POST.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {FEATURED_POST.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{FEATURED_POST.readTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{FEATURED_POST.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                      style={{ backgroundColor: brandColor }}
                    >
                      {FEATURED_POST.author.avatar}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-700">
                      <User className="w-4 h-4" />
                      <span className="font-medium">{FEATURED_POST.author.name}</span>
                    </div>
                  </div>
                  <Link
                    href={`/blog/${FEATURED_POST.id}`}
                    className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                    style={{ backgroundColor: brandColor }}
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </article>

            {/* Blog Grid */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {BLOG_POSTS.map((post) => (
                  <article
                    key={post.id}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="relative aspect-video overflow-hidden bg-gray-100">
                      <span className="absolute left-3 top-3 z-10">
                        <span
                          className="rounded-full px-2 py-1 text-xs font-semibold text-white"
                          style={{ backgroundColor: brandColor }}
                        >
                          {post.category}
                        </span>
                      </span>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#039BE5] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{post.author.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{post.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      <Link
                        href={`/blog/${post.id}`}
                        className="text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                        style={{ color: brandColor }}
                      >
                        Read More
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 pt-8">
              <button
                type="button"
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {[1, 2, 3, 4, 5].map((page) => (
                <Link
                  key={page}
                  href={`/blog?page=${page}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'text-white shadow-lg'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  style={currentPage === page ? { backgroundColor: brandColor } : undefined}
                >
                  {page}
                </Link>
              ))}
              <button
                type="button"
                disabled={currentPage === 5}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Popular Posts */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5" style={{ color: brandColor }} />
                <h3 className="text-lg font-bold text-gray-900">Popular Posts</h3>
              </div>
              <div className="space-y-4">
                {POPULAR_POSTS.map((post, idx) => (
                  <Link key={post.id} href={`/blog/${post.id}`} className="block group">
                    <div className="flex items-start gap-3">
                      <div
                        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: brandColor }}
                      >
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#039BE5] transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">{post.views} views</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div
              className="rounded-xl p-6 text-white shadow-lg"
              style={{ backgroundColor: brandColor }}
            >
              <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
              <p className="text-sm text-white/90 mb-4">
                Get the latest blog posts and deals delivered to your inbox.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-2 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-white rounded-lg px-4 py-2 font-semibold text-sm hover:bg-gray-100 transition-colors"
                  style={{ color: brandColor }}
                >
                  Subscribe
                </button>
              </form>
              <p className="text-xs text-white/70 mt-3">No spam. Unsubscribe anytime.</p>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {[
                  { Icon: Facebook,  label: 'Facebook'  },
                  { Icon: Twitter,   label: 'Twitter'   },
                  { Icon: Instagram, label: 'Instagram' },
                  { Icon: Linkedin,  label: 'LinkedIn'  },
                ].map(({ Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-300 hover:border-[#039BE5] hover:bg-sky-50 transition-colors"
                    style={{ color: brandColor }}
                    aria-label={label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/blog?category=${cat.id}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-sky-50 transition-colors group"
                  >
                    <span className="text-sm font-medium text-gray-700 group-hover:text-[#039BE5] transition-colors">
                      {cat.label}
                    </span>
                    <span
                      className="text-xs font-semibold px-2 py-1 rounded-full"
                      style={{ backgroundColor: `${brandColor}15`, color: brandColor }}
                    >
                      {cat.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
