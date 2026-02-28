import Link from 'next/link'
import { headers } from 'next/headers'
import { getTheme } from '@/lib/themes'
import ProductGrid from '@/components/ProductGrid'
import {
  ShoppingCart,
  TrendingDown,
  Shirt,
  BookOpen,
  Scale,
  DollarSign,
  ExternalLink,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Heart,
  Search,
  Layout,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

interface Category {
  name: string
  icon: string
  link: string
}

interface Platform {
  name: string
  icon: React.ReactNode
  desc: string
  products: string
  link: string
}

interface Feature {
  icon: React.ReactNode
  title: string
  desc: string
}

export default async function CloudBasketHome() {
  const headersList = await headers()
  const tenant = headersList.get('x-tenant') || 'cloudbasket'
  const theme = getTheme(tenant)

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Navigation */}
      <header className="bg-white/10 absolute inset-x-0 top-0 z-20">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold shadow-lg"
              style={{ backgroundColor: theme.primaryColor }}
            >
              CB
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-gray-900">CloudBasket</span>
              <span className="text-[11px] uppercase tracking-wide text-gray-500">
                Smart shopping hub
              </span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/products"
              className="text-gray-700 hover:text-[#039BE5] transition-colors"
            >
              Products
            </Link>
            <Link
              href="/deals"
              className="text-gray-700 hover:text-[#039BE5] transition-colors"
            >
              Deals
            </Link>
            <Link
              href="/compare"
              className="text-gray-700 hover:text-[#039BE5] transition-colors"
            >
              Compare
            </Link>
            <Link
              href="/pod"
              className="text-gray-700 hover:text-[#039BE5] transition-colors"
            >
              POD Store
            </Link>
            <Link
              href="/blog"
              className="text-gray-700 hover:text-[#039BE5] transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-[#039BE5] transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-[#039BE5] transition-colors"
            >
              Contact
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/affiliate"
              className="hidden sm:inline-flex items-center space-x-2 text-xs font-semibold px-4 py-2 rounded-full border border-[#039BE5]/40 text-[#039BE5] hover:bg-sky-50 transition-colors"
            >
              <DollarSign size={16} />
              <span>Affiliate Login</span>
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-[#039BE5] text-white text-xs font-semibold px-4 py-2 shadow-md hover:bg-[#0288D1] transition-colors"
            >
              <ShoppingCart size={16} className="mr-1.5" />
              <span>Start Shopping</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section — rebuilt */}
      <section className="relative w-full bg-[#039BE5] text-white pt-32 pb-24 overflow-hidden">
        {/* Subtle radial highlight — no external resources */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_#ffffff_0%,_transparent_60%)]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow */}
          <p className="text-xs uppercase tracking-[0.3em] text-white/70 mb-3">
            India &amp; Global Price Engine
          </p>

          {/* Headline / Tagline */}
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4">
            Design. Print. Earn.
          </h1>

          {/* Sub-tagline */}
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Compare prices, track deals, discover exclusive POD designs and earn
            affiliate commissions — all in one basket.
          </p>

          {/* Search Bar — pure HTML GET form, zero external calls */}
          <form
            action="/products"
            method="GET"
            className="flex items-center bg-white rounded-full shadow-2xl overflow-hidden max-w-2xl mx-auto mb-10"
          >
            <Search
              className="ml-5 shrink-0 text-[#039BE5]"
              size={20}
              aria-hidden="true"
            />
            <input
              type="text"
              name="q"
              placeholder="Search products, brands, deals…"
              className="flex-1 px-4 py-4 text-gray-800 text-base bg-transparent placeholder:text-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#E65100] hover:bg-[#BF360C] text-white font-semibold px-7 py-4 text-sm transition-colors whitespace-nowrap"
            >
              Search
            </button>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link
              href="/products"
              className="bg-white text-[#039BE5] px-8 py-4 rounded-full font-semibold text-base hover:bg-sky-50 transition-colors inline-flex items-center gap-2 shadow-lg"
            >
              <ShoppingCart size={20} />
              Browse Products
            </Link>
            <Link
              href="/deals"
              className="bg-[#E65100] text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-[#BF360C] transition-colors inline-flex items-center gap-2 shadow-lg"
            >
              <Zap size={20} />
              Today&apos;s Deals
            </Link>
          </div>

          {/* Trust line */}
          <p className="text-xs text-white/60">
            Amazon · Flipkart · CJ · Redbubble · Teepublic &nbsp;·&nbsp; DPDP
            Act 2023 Compliant · Zero data resale
          </p>
        </div>
      </section>

      {/* Featured Collections Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Collections</h2>
            <p className="text-gray-600">Explore our curated selection of global essentials</p>
          </div>
          <ProductGrid />
        </div>
      </section>

      {/* Main Features - 4 Cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1: Product Catalog */}
            <Link href="/products" className="group">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 h-full border-2 border-transparent hover:border-[#039BE5] flex flex-col">
                <div className="bg-gradient-to-br from-orange-400 to-orange-600 w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShoppingCart className="text-white" size={32} />
                </div>
                <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center mb-3">
                  <span>Amazon + Flipkart</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Product Catalog</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Browse 1M+ products from Amazon, Flipkart and top brands with live prices,
                  reviews and ratings.
                </p>
                <div className="mt-auto flex items-center text-[#039BE5] font-semibold group-hover:translate-x-2 transition-transform">
                  Explore Products <ArrowRight className="ml-2" size={20} />
                </div>
              </div>
            </Link>

            {/* Card 2: Price Compare */}
            <Link href="/compare" className="group">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 h-full border-2 border-transparent hover:border-[#039BE5] flex flex-col">
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Scale className="text-white" size={32} />
                </div>
                <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center mb-3">
                  <span>Best Prices</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Price Compare</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Compare prices across platforms in real time. Avoid overpaying by checking
                  CloudBasket before every purchase.
                </p>
                <div className="mt-auto flex items-center text-[#039BE5] font-semibold group-hover:translate-x-2 transition-transform">
                  Start Comparing <ArrowRight className="ml-2" size={20} />
                </div>
              </div>
            </Link>

            {/* Card 3: Deals & Coupons */}
            <Link href="/deals" className="group">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 h-full border-2 border-transparent hover:border-[#039BE5] flex flex-col">
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingDown className="text-white" size={32} />
                </div>
                <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center mb-3">
                  <span>Save Money</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Deals & Coupons</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Daily curated deals, discount codes and cashback offers from top affiliates,
                  refreshed every hour.
                </p>
                <div className="mt-auto flex items-center text-[#039BE5] font-semibold group-hover:translate-x-2 transition-transform">
                  View Deals <ArrowRight className="ml-2" size={20} />
                </div>
              </div>
            </Link>

            {/* Card 4: POD Products */}
            <Link href="/pod" className="group">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 h-full border-2 border-transparent hover:border-[#039BE5] flex flex-col">
                <div className="bg-gradient-to-br from-green-400 to-green-600 w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shirt className="text-white" size={32} />
                </div>
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center mb-3">
                  <span>POD Products</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Designs</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Exclusive CloudBasket designs on t-shirts, mugs, stickers and more on global
                  POD platforms.
                </p>
                <div className="mt-auto flex items-center text-[#039BE5] font-semibold group-hover:translate-x-2 transition-transform">
                  Shop Designs <ArrowRight className="ml-2" size={20} />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by Category - Larger Icons */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Shop by Category
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {(
              [
                { name: 'Mobiles', icon: 'https://placehold.co/300x300', link: '/products?category=mobiles' },
                { name: 'Laptops', icon: 'https://placehold.co/300x300', link: '/products?category=laptops' },
                { name: 'Fashion', icon: 'https://placehold.co/300x300', link: '/products?category=fashion' },
                { name: 'Home', icon: 'https://placehold.co/300x300', link: '/products?category=home' },
                { name: 'Cameras', icon: 'https://placehold.co/300x300', link: '/products?category=cameras' },
                { name: 'Gaming', icon: 'https://placehold.co/300x300', link: '/products?category=gaming' },
                {
                  name: 'Electronics',
                  icon: 'https://placehold.co/300x300',
                  link: '/products?category=electronics',
                },
                {
                  name: 'Footwear',
                  icon: 'https://placehold.co/300x300',
                  link: '/products?category=footwear',
                },
                { name: 'Books', icon: 'https://placehold.co/300x300', link: '/products?category=books' },
                { name: 'Beauty', icon: 'https://placehold.co/300x300', link: '/products?category=beauty' },
                { name: 'Sports', icon: 'https://placehold.co/300x300', link: '/products?category=sports' },
                { name: 'Toys', icon: 'https://placehold.co/300x300', link: '/products?category=toys' },
              ] as Category[]
            ).map((category) => (
              <Link
                key={category.name}
                href={category.link}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 text-center group border-2 border-transparent hover:border-[#039BE5]"
              >
                <div className="mb-3 group-hover:scale-110 transition-transform">
                  <img src={category.icon} alt={category.name} width={300} height={300} className="mx-auto rounded-lg" />
                </div>
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* POD Platforms */}
      <section className="py-16 bg-sky-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Available On These Platforms
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Our exclusive designs are available on multiple print-on-demand platforms
            worldwide.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(
              [
                {
                  name: 'Redbubble',
                  icon: <Layout className="text-[#E6192E]" size={64} />,
                  desc: 'Global marketplace. Ships to 150+ countries.',
                  products: 'T-Shirts, Hoodies, Stickers, Cases',
                  link: 'https://redbubble.com/people/cloudbasket',
                },
                {
                  name: 'Teepublic',
                  icon: <Layout className="text-[#207BFF]" size={64} />,
                  desc: 'Affordable prices. Fast US and India shipping.',
                  products: 'T-Shirts, Mugs, Tote Bags, Posters',
                  link: 'https://teepublic.com/user/cloudbasket',
                },
                {
                  name: 'Teespring',
                  icon: <Layout className="text-[#FFC107]" size={64} />,
                  desc: 'Custom merchandise. Creator-friendly platform.',
                  products: 'Apparel, Accessories, Home Decor',
                  link: 'https://teespring.com/stores/cloudbasket',
                },
              ] as Platform[]
            ).map((platform) => (
              <div
                key={platform.name}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8"
              >
                <div className="flex items-center mb-4">
                  <div className="mr-4">{platform.icon}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{platform.name}</h3>
                    <p className="text-sm text-gray-600">{platform.desc}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 text-sm">
                  <strong>Products:</strong> {platform.products}
                </p>
                <a
                  href={platform.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-[#039BE5] hover:bg-[#0288D1] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <span>Visit {platform.name} Store</span>
                  <ExternalLink size={18} />
                </a>
                <p className="text-xs text-gray-500 mt-3">
                  This link will take you to {platform.name} to complete your order.
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/pod"
              className="inline-flex items-center space-x-2 bg-[#039BE5] hover:bg-[#0288D1] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              <Shirt size={24} />
              <span>View All Designs</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose CloudBasket */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose CloudBasket?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {(
              [
                { icon: <Star className="text-[#F5C518]" size={40} />, title: 'Best Prices', desc: 'Always find the lowest price across trusted marketplaces.' },
                { icon: <Zap className="text-[#E65100]" size={40} />, title: 'Fast Updates', desc: 'Real-time price and deal tracking, refreshed constantly.' },
                { icon: <Shield className="text-[#039BE5]" size={40} />, title: 'Trusted Sources', desc: 'Only verified affiliate and POD platforms are listed.' },
                { icon: <Heart className="text-[#1B5E20]" size={40} />, title: 'User Friendly', desc: 'Simple, clutter-free UI designed for quick decisions.' },
              ] as Feature[]
            ).map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Affiliate CTA */}
      <section className="py-16 bg-gradient-to-br from-[#039BE5] to-[#0277BD] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <DollarSign className="mx-auto mb-6" size={64} />
          <h2 className="text-4xl font-bold mb-4">Earn While You Shop</h2>
          <p className="text-xl mb-8 text-white/80">
            Join our affiliate program and earn up to 8% commission on every sale you refer
            across supported marketplaces.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/affiliate"
              className="bg-white text-[#039BE5] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-sky-50 transition-colors"
            >
              Join Affiliate Program
            </Link>
            <Link
              href="/cj"
              className="bg-[#0288D1] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#0277BD] transition-colors border-2 border-white"
            >
              Connect CJ Account
            </Link>
          </div>
          <p className="mt-6 text-xs text-white/70">
            * Affiliate disclosure: We may earn a commission when you buy via our links. Prices
            stay exactly the same for you.
          </p>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Updated</h2>
          <p className="text-gray-600 mb-8">
            Get the latest deals, product reviews, and smart shopping tips delivered to your
            inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-lg border-2 border-gray-300 focus:border-[#039BE5] focus:outline-none text-lg"
            />
            <button
              type="submit"
              className="bg-[#039BE5] hover:bg-[#0288D1] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors whitespace-nowrap"
            >
              Subscribe Now
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-4">
            We respect your privacy. DPDP Act 2023 compliant. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <Link href="/blog" className="group">
              <BookOpen
                className="mx-auto mb-2 text-[#039BE5] group-hover:scale-110 transition-transform"
                size={32}
              />
              <span className="text-gray-700 font-semibold group-hover:text-[#039BE5]">
                Blog &amp; Reviews
              </span>
            </Link>
            <Link href="/compare" className="group">
              <Scale
                className="mx-auto mb-2 text-[#039BE5] group-hover:scale-110 transition-transform"
                size={32}
              />
              <span className="text-gray-700 font-semibold group-hover:text-[#039BE5]">
                Compare Products
              </span>
            </Link>
            <Link href="/about" className="group">
              <Shield
                className="mx-auto mb-2 text-[#039BE5] group-hover:scale-110 transition-transform"
                size={32}
              />
              <span className="text-gray-700 font-semibold group-hover:text-[#039BE5]">
                About Us
              </span>
            </Link>
            <Link href="/contact" className="group">
              <Heart
                className="mx-auto mb-2 text-[#039BE5] group-hover:scale-110 transition-transform"
                size={32}
              />
              <span className="text-gray-700 font-semibold group-hover:text-[#039BE5]">
                Contact Support
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
