'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ProductGrid from '@/components/ProductGrid'
import ProductFilter from '@/components/ProductFilter'
import PromotionSidebar from '@/components/PromotionSidebar'
import Pagination from '@/components/Pagination'
import { PRODUCTS } from '@/lib/mock-data'
import {
  ShoppingCart,
  Zap,
  Layout,
  BookOpen,
  Scale,
  Shield,
  ArrowRight,
  Filter,
} from 'lucide-react'

function HomeContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // --- Filtering & Pagination State ---
  const [search, setSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState(100000)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // --- Sync with URL Params ---
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    const queryParam = searchParams.get('q')
    const pageParam = searchParams.get('page')

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

    if (pageParam) {
      setCurrentPage(Number(pageParam))
    } else {
      setCurrentPage(1)
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

  // --- Pagination Logic ---
  const totalPages = 5 // User requested fixed 5-page system for branded excitement
  
  const paginatedProducts = useMemo(() => {
    // We slice the product array into 5 equal segments
    const segmentSize = Math.ceil(filteredProducts.length / totalPages)
    // However, if user uses the dropdown, we prioritize that itemsPerPage
    const effectiveSize = itemsPerPage !== 10 ? itemsPerPage : segmentSize
    
    const start = (currentPage - 1) * effectiveSize
    return filteredProducts.slice(start, start + effectiveSize)
  }, [filteredProducts, currentPage, itemsPerPage])

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`?${params.toString()}`, { scroll: false })
    setCurrentPage(page)
  }

  const resetFilters = () => {
    setSearch('')
    setSelectedCategories([])
    setPriceRange(maxPrice)
    setCurrentPage(1)
    router.push('/', { scroll: false })
  }

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      {/* Hero Section */}
      <section className="relative w-full bg-[#039BE5] text-white pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_#ffffff_0%,_transparent_60%)]" />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-white/10 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-[10px] uppercase tracking-[0.3em] font-black text-white/80">
              India&apos;s Premium Price Engine 2026
            </p>
          </div>
          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] mb-8 tracking-tighter">
            Marketplace <br/> <span className="text-sky-200">Reimagined.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl mx-auto leading-tight font-medium">
            Compare across 10+ platforms. Discover unique POD designs. 
            All-in-one smart shopping hub.
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <Link 
              href="#shop"
              className="bg-white text-[#039BE5] px-10 py-5 rounded-2xl font-black text-sm hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-3 active:scale-95"
            >
              <ShoppingCart size={20} />
              Start Exploring
            </Link>
            <Link 
              href="/deals/flash"
              className="bg-[#E65100] text-white px-10 py-5 rounded-2xl font-black text-sm hover:bg-[#BF360C] transition-all flex items-center gap-3 shadow-xl active:scale-95"
            >
              <Zap size={20} />
              Flash Deals
            </Link>
          </div>
        </div>
      </section>

      {/* 3-Column Marketplace Layout */}
      <section id="shop" className="bg-white border-b border-gray-100 overflow-hidden">
        <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row min-h-[800px]">
          
          {/* Left Sidebar: Sticky Filter (Desktop) */}
          <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0 border-r border-gray-100 bg-gray-50/30 px-8 py-10 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto custom-scrollbar">
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
          </aside>

          {/* Mobile Filter Trigger */}
          <div className="lg:hidden px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between sticky top-16 z-40 backdrop-blur-md">
             <button 
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-900 bg-white border border-gray-200 px-4 py-2.5 rounded-xl shadow-sm"
             >
               <Filter size={16} />
               {isMobileFilterOpen ? 'Close Filters' : 'Filter Products'}
             </button>
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
               {filteredProducts.length} Results
             </span>
          </div>

          {/* Mobile Filter Drawer (Stacked) */}
          {isMobileFilterOpen && (
            <div className="lg:hidden p-6 bg-white border-b border-gray-100 animate-in slide-in-from-top duration-300">
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
          )}

          {/* Main Grid: Flexible Center */}
          <main className="flex-1 px-6 lg:px-10 py-10">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Featured</h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Curated Selection</p>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                 Sort: <span className="text-gray-900 cursor-pointer hover:text-[#039BE5] transition-colors">Popularity</span>
              </div>
            </div>
            
            <ProductGrid products={paginatedProducts} onReset={resetFilters} />

            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={(val) => {
                setItemsPerPage(val)
                setCurrentPage(1)
              }}
            />
          </main>

          {/* Right Sidebar: Sticky Promotion (Desktop) */}
          <aside className="hidden xl:block w-80 2xl:w-96 flex-shrink-0 border-l border-gray-100 bg-gray-50/30 px-8 py-10 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto custom-scrollbar">
            <PromotionSidebar selectedCategory={selectedCategories[0]} />
          </aside>

          {/* Mobile Promotions (Stacked Below Grid) */}
          <div className="xl:hidden px-6 py-12 bg-gray-50 border-t border-gray-100">
             <div className="max-w-md mx-auto">
                <PromotionSidebar selectedCategory={selectedCategories[0]} />
             </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-16">
            <div className="text-left">
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Global Hub</h2>
              <p className="text-gray-500 font-medium">Quick access to our main categories.</p>
            </div>
            <Link href="/products" className="hidden sm:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#039BE5] hover:underline">
               View All Catalog <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Electronics', q: 'Electronics' },
              { name: 'Fashion', q: 'Fashion' },
              { name: 'Home & Kitchen', q: 'Home' },
              { name: 'Sports', q: 'Sports' }
            ].map((cat) => (
              <Link 
                key={cat.name} 
                href={`/products?category=${cat.q}`}
                className="p-8 bg-gray-50 rounded-[2rem] hover:bg-white hover:shadow-2xl hover:shadow-[#039BE5]/10 transition-all border border-transparent hover:border-[#039BE5]/10 group text-center"
              >
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Layout className="text-[#039BE5]" size={32} />
                </div>
                <h3 className="font-black text-gray-900 uppercase tracking-tighter">{cat.name}</h3>
                <p className="text-[10px] text-gray-400 font-black mt-2 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Explore</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Branding Section */}
      <section className="py-24 border-y border-gray-100 bg-[#F5F5F7]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center p-8">
              <div className="bg-[#039BE5] w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl shadow-[#039BE5]/20">
                <Scale size={28} />
              </div>
              <h4 className="font-black text-xl text-gray-900 mb-4 tracking-tight">Best Value</h4>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                Our engine scans millions of data points to find the absolute lowest price for you.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-8">
              <div className="bg-[#039BE5] w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl shadow-[#039BE5]/20">
                <BookOpen size={28} />
              </div>
              <h4 className="font-black text-xl text-gray-900 mb-4 tracking-tight">Expert Guides</h4>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                Unbiased reviews and detailed comparisons to help you make informed decisions.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-8">
              <div className="bg-[#039BE5] w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl shadow-[#039BE5]/20">
                <Shield size={28} />
              </div>
              <h4 className="font-black text-xl text-gray-900 mb-4 tracking-tight">Secure & Safe</h4>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                Fully DPDP Act 2023 compliant. Your data privacy is our highest priority.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#36454F] text-white py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-[#039BE5] flex items-center justify-center text-white font-black text-xl shadow-lg">CB</div>
              <span className="text-3xl font-black tracking-tighter">CloudBasket</span>
            </div>
            <p className="text-gray-400 max-w-sm leading-relaxed font-medium text-lg">
              The definitive price aggregator and discovery hub for the Indian & Global marketplace.
            </p>
            <div className="mt-10 flex gap-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                    <Layout size={18} className="text-white/60" />
                 </div>
               ))}
            </div>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-[0.2em] text-[10px] mb-8 text-white/40">Marketplace</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-300">
              <li><Link href="/products" className="hover:text-[#039BE5] transition-colors">All Products</Link></li>
              <li><Link href="/deals" className="hover:text-[#039BE5] transition-colors">Daily Deals</Link></li>
              <li><Link href="/pod" className="hover:text-[#039BE5] transition-colors">POD Designs</Link></li>
              <li><Link href="/compare" className="hover:text-[#039BE5] transition-colors">Price Tracker</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-[0.2em] text-[10px] mb-8 text-white/40">Company</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-300">
              <li><Link href="/about" className="hover:text-[#039BE5] transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-[#039BE5] transition-colors">Careers</Link></li>
              <li><Link href="/privacy" className="hover:text-[#039BE5] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#039BE5] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-[10px] font-black uppercase tracking-widest text-white/30">
             © 2026 CloudBasket India. All rights reserved.
           </p>
           <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
             DPDP Act 2023 Compliant Platform
           </p>
        </div>
      </footer>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: #d1d5db;
        }
      `}</style>
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
