'use client'

import { Search, Filter, ChevronRight, Layers } from 'lucide-react'

interface ProductFilterProps {
  search: string
  setSearch: (val: string) => void
  selectedMainCategory: string
  setSelectedMainCategory: (cat: string) => void
  selectedSubCategories: string[]
  setSelectedSubCategories: (subs: string[]) => void
  priceRange: number
  setPriceRange: (val: number) => void
  mainCategories: string[]
  subCategoriesMap: Record<string, string[]>
  maxPrice: number
}

export default function ProductFilter({
  search,
  setSearch,
  selectedMainCategory,
  setSelectedMainCategory,
  selectedSubCategories,
  setSelectedSubCategories,
  priceRange,
  setPriceRange,
  mainCategories,
  subCategoriesMap,
  maxPrice,
}: ProductFilterProps) {
  
  const toggleSubCategory = (sub: string) => {
    if (selectedSubCategories.includes(sub)) {
      setSelectedSubCategories(selectedSubCategories.filter((s) => s !== sub))
    } else {
      setSelectedSubCategories([...selectedSubCategories, sub])
    }
  }

  const handleMainCategoryChange = (cat: string) => {
    setSelectedMainCategory(cat)
    setSelectedSubCategories([]) // Reset subs when main changes
  }

  return (
    <div className="space-y-10 sticky top-24">
      {/* Header */}
      <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
        <div className="bg-[#039BE5]/10 p-2 rounded-lg">
          <Filter size={20} className="text-[#039BE5]" />
        </div>
        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Refine</h2>
      </div>

      {/* Search Bar */}
      <div className="space-y-4">
        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          Search Products
        </label>
        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#039BE5] transition-colors"
            size={16}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type to search..."
            className="w-full bg-white border-2 border-gray-100 focus:border-[#039BE5] focus:outline-none rounded-xl py-3 pl-11 pr-4 text-xs font-bold text-gray-900 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Main Category Filter */}
      <div className="space-y-4">
        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          Main Category
        </label>
        <div className="relative">
          <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          <select 
            value={selectedMainCategory}
            onChange={(e) => handleMainCategoryChange(e.target.value)}
            className="w-full bg-white border-2 border-gray-100 rounded-xl py-3 pl-11 pr-4 text-xs font-black text-gray-900 focus:border-[#039BE5] outline-none appearance-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            {mainCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" size={14} />
        </div>
      </div>

      {/* Sub Category Filter (Dynamic) */}
      {selectedMainCategory !== 'All' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            {selectedMainCategory} Subs
          </label>
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {subCategoriesMap[selectedMainCategory].map((sub) => (
              <label key={sub} className="flex items-center group cursor-pointer">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedSubCategories.includes(sub)}
                    onChange={() => toggleSubCategory(sub)}
                    className="peer h-5 w-5 appearance-none rounded-lg border-2 border-gray-100 checked:bg-[#039BE5] checked:border-[#039BE5] transition-all cursor-pointer"
                  />
                  <svg
                    className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity left-0.5 pointer-events-none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span className="ml-3 text-[11px] font-bold text-gray-500 group-hover:text-gray-900 transition-colors uppercase tracking-tight">
                  {sub}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            Price Range
          </label>
          <span className="text-[9px] font-black bg-gray-900 text-white px-2 py-1 rounded-lg">
            MAX ₹{priceRange.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="px-1">
          <input
            type="range"
            min="0"
            max={maxPrice}
            step="500"
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#039BE5]"
          />
          <div className="flex justify-between mt-3 text-[9px] font-black text-gray-300 uppercase tracking-tighter">
            <span>₹0</span>
            <span>₹{maxPrice.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
