'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import ProductGrid from '@/components/ProductGrid'
import ProductFilter from '@/components/ProductFilter'
import { PRODUCTS } from '@/lib/mock-data'
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

export default function CloudBasketHome() {
  // --- Filtering State ---
  const [search, setSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState(100000)

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
  }

  // NOTE: In a real Next.js 16 app, tenant/theme logic would be handled by 
  // a provider or passed from a layout. For this prototype, we'll use 
  // the 'cloudbasket' default theme colors directly.

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold shadow-lg bg-[#039BE5]">
              CB
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-gray-900 tracking-tight">CloudBasket</span>
              <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                Smart shopping hub
              </span>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500">
            <Link href="/products" className="hover:text-[#039BE5] transition-colors">Products</Link>
            <Link href="/deals" className="hover:text-[#039BE5] transition-colors">Deals</Link>
            <Link href="/compare" className="hover:text-[#039BE5] transition-colors">Compare</Link>
            <Link href="/pod" className="hover:text-[#039BE5] transition-colors">POD Store</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-xl bg-[#039BE5] text-white text-xs font-bold px-5 py-2.5 shadow-md hover:bg-[#0288D1] transition-all active:scale-95"
            >
              <ShoppingCart size={16} className="mr-2" />
              <span>Start Shopping</span>
            </Link>
          </div>
        </nav>
      </header>

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
            <button className="bg-white text-[#039BE5] px-8 py-4 rounded-xl font-bold text-sm hover:shadow-xl transition-all flex items-center gap-2">
              <ShoppingCart size={18} />
              Browse Catalog
            </button>
            <button className="bg-[#E65100] text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-[#BF360C] transition-all flex items-center gap-2 shadow-lg">
              <Zap size={18} />
              Flash Deals
            </button>
          </div>
        </div>
      </section>

      {/* Unified Filtering System */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Featured Collections</h2>
            <p className="text-gray-500 font-medium">Explore our curated selection of global essentials across top categories.</p>
          </div>

          <div className="grid grid-cols-12 gap-12">
            {/* Sidebar Filter (3 Columns) */}
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

            {/* Product Grid (9 Columns) */}
            <main className="col-span-12 lg:col-span-9">
              <ProductGrid products={filteredProducts} onReset={resetFilters} />
            </main>
          </div>
        </div>
      </section>

      {/* Categories & Platforms (Secondary Sections) */}
      <section className="py-24 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-16 uppercase">Shop by Marketplace</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {['Amazon', 'Flipkart', 'Redbubble', 'Teepublic'].map((partner) => (
              <div key={partner} className="p-10 bg-gray-50 rounded-2xl hover:bg-sky-50 transition-colors border border-transparent hover:border-[#039BE5]/20 group">
                <div className="w-16 h-16 bg-white rounded-xl shadow-sm mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Layout className="text-[#039BE5]" size={32} />
                </div>
                <h3 className="font-bold text-gray-900">{partner}</h3>
                <p className="text-xs text-gray-400 font-bold mt-2 uppercase tracking-widest">Official Partner</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
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
              <li><Link href="/deals" className="hover:text-white transition-colors">Daily Deals</Link></li>
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
