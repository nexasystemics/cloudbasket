'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import ProductGrid from '@/components/ProductGrid'
import ProductFilter from '@/components/ProductFilter'
import { PRODUCTS } from '@/lib/mock-data'
import {
  ShoppingCart,
  Zap,
  Layout,
  BookOpen,
  Scale,
  Shield,
} from 'lucide-react'

function HomeContent() {
  const searchParams = useSearchParams()
  
  // --- Filtering State ---
  const [search, setSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState(100000)

  // --- Sync with URL Params ---
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    const queryParam = searchParams.get('q')

    if (categoryParam) {
      setSelectedCategories([categoryParam])
    } else {
      setSelectedCategories([])
    }

    if (queryParam) {
      setSearch(queryParam)
    } else {
      setSearch('')
    }
  }, [searchParams])

  // --- Master Data Info ---
  const categories = ['Beauty', 'Books', 'Sports', 'Toys']
  const maxPrice = 100000

  // --- Filtering Logic ---
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                            product.description.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category)
      const matchesPrice = product.price <= priceRange
      return matchesSearch && matchesCategory && matchesPrice
    })
  }, [search, selectedCategories, priceRange])

  const resetFilters = () => {
    setSearch('')
    setSelectedCategories([])
    setPriceRange(maxPrice)
    window.history.pushState({}, '', '/')
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Section */}
      <section className="relative w-full bg-[#039BE5] text-white pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_#ffffff_0%,_transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] font-black text-white/60 mb-4">
            India &amp; Global Price Engine
          </p>
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 tracking-tighter">
            Design. Print. Earn.
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Compare prices, track deals, and discover exclusive POD designs. 
            All your shopping essentials, unified in one basket.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/products"
              className="bg-white text-[#039BE5] px-8 py-4 rounded-xl font-bold text-sm hover:shadow-xl transition-all flex items-center gap-2"
            >
              <ShoppingCart size={18} />
              Browse Catalog
            </Link>
            <Link 
              href="/products?q=deal"
              className="bg-[#E65100] text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-[#BF360C] transition-all flex items-center gap-2 shadow-lg"
            >
              <Zap size={18} />
              Lightning Deals
            </Link>
          </div>
        </div>
      </section>

      {/* Unified Filtering System (Featured on Home) */}
      <section id="shop" className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Featured Collections</h2>
            <p className="text-gray-500 font-medium">Explore our curated selection of global essentials across top categories.</p>
          </div>

          <div className="grid grid-cols-12 gap-12">
            <aside className="col-span-12 lg:col-span-3">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <ProductFilter
                  search={search}
                  setSearch={setSearch}
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  categories={categories}
                  maxPrice={maxPrice}
                />
              </div>
            </aside>
            <main className="col-span-12 lg:col-span-9">
              <ProductGrid products={filteredProducts} onReset={resetFilters} />
            </main>
          </div>
        </div>
      </section>

      {/* Categories Section - Links to Catalog */}
      <section className="py-24 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-16 uppercase">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: 'Electronics', q: 'Electronics' },
              { name: 'Fashion', q: 'Fashion' },
              { name: 'Home & Kitchen', q: 'Home' },
              { name: 'Sports', q: 'Sports' }
            ].map((cat) => (
              <Link 
                key={cat.name} 
                href={`/products?category=${cat.q}`}
                className="p-10 bg-gray-50 rounded-2xl hover:bg-sky-50 transition-colors border border-transparent hover:border-[#039BE5]/20 group"
              >
                <div className="w-16 h-16 bg-white rounded-xl shadow-sm mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Layout className="text-[#039BE5]" size={32} />
                </div>
                <h3 className="font-bold text-gray-900">{cat.name}</h3>
                <p className="text-xs text-gray-400 font-bold mt-2 uppercase tracking-widest">Explore Catalog</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 bg-white rounded-2xl shadow-sm">
              <BookOpen className="mx-auto mb-4 text-[#039BE5]" size={32} />
              <h4 className="font-black text-gray-900 mb-2">Shopping Guides</h4>
              <p className="text-sm text-gray-500 font-medium mb-4">Expert reviews and buying advice for global markets.</p>
              <Link href="/blog" className="text-[#039BE5] text-xs font-black uppercase tracking-widest hover:underline">Read Blog</Link>
            </div>
            <div className="p-8 bg-white rounded-2xl shadow-sm">
              <Scale className="mx-auto mb-4 text-[#039BE5]" size={32} />
              <h4 className="font-black text-gray-900 mb-2">Price Compare</h4>
              <p className="text-sm text-gray-500 font-medium mb-4">Track historical prices across 5+ major retailers.</p>
              <Link href="/compare" className="text-[#039BE5] text-xs font-black uppercase tracking-widest hover:underline">Compare Now</Link>
            </div>
            <div className="p-8 bg-white rounded-2xl shadow-sm">
              <Shield className="mx-auto mb-4 text-[#039BE5]" size={32} />
              <h4 className="font-black text-gray-900 mb-2">Safe & Secure</h4>
              <p className="text-sm text-gray-500 font-medium mb-4">Compliant with DPDP Act 2023 for your privacy.</p>
              <Link href="/privacy" className="text-[#039BE5] text-xs font-black uppercase tracking-widest hover:underline">Learn More</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-20 mt-auto">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#039BE5] flex items-center justify-center text-white font-black">CB</div>
              <span className="text-2xl font-black tracking-tighter">CloudBasket</span>
            </div>
            <p className="text-gray-400 max-w-sm leading-relaxed font-medium">
              The world's most advanced price comparison engine and POD discovery hub. 
              Helping you shop smarter, save faster, and discover unique designs.
            </p>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-xs mb-6 text-white/40">Resources</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-300">
              <li><Link href="/products" className="hover:text-white transition-colors">Product Catalog</Link></li>
              <li><Link href="/products?q=deal" className="hover:text-white transition-colors">All Deals</Link></li>
              <li><Link href="/affiliate" className="hover:text-white transition-colors">Affiliate Hub</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-xs mb-6 text-white/40">Compliance</h4>
            <p className="text-[10px] text-gray-500 leading-relaxed font-bold">
              © 2026 CloudBasket India. <br/>
              DPDP Act 2023 Compliant. <br/>
              No data resale guaranteed.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function CloudBasketHome() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center font-black">LOADING...</div>}>
      <HomeContent />
    </Suspense>
  )
}
