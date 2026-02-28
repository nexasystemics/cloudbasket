'use client'

import { Search, Filter } from 'lucide-react'

interface ProductFilterProps {
  search: string
  setSearch: (val: string) => void
  selectedCategories: string[]
  setSelectedCategories: (categories: string[]) => void
  priceRange: number
  setPriceRange: (val: number) => void
  categories: string[]
  maxPrice: number
}

export default function ProductFilter({
  search,
  setSearch,
  selectedCategories,
  setSelectedCategories,
  priceRange,
  setPriceRange,
  categories,
  maxPrice,
}: ProductFilterProps) {
  
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  return (
    <div className="space-y-8 sticky top-24">
      {/* Header */}
      <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
        <div className="bg-[#039BE5]/10 p-2 rounded-lg">
          <Filter size={20} className="text-[#039BE5]" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Refine Search</h2>
      </div>

      {/* Search Bar */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
          Search Products
        </label>
        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#039BE5] transition-colors"
            size={18}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type to search..."
            className="w-full bg-gray-50 border border-transparent focus:border-[#039BE5]/30 focus:bg-white focus:outline-none rounded-xl py-3.5 pl-11 pr-4 text-sm text-gray-900 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
          Categories
        </label>
        <div className="space-y-3">
          {categories.map((category) => (
            <label key={category} className="flex items-center group cursor-pointer">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="peer h-5 w-5 appearance-none rounded-md border-2 border-gray-200 checked:bg-[#039BE5] checked:border-[#039BE5] transition-all cursor-pointer"
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
              <span className="ml-3 text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Price Range
          </label>
          <span className="text-[10px] font-black bg-gray-900 text-white px-2 py-0.5 rounded-md">
            Up to ₹{priceRange.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="px-1">
          <input
            type="range"
            min="0"
            max={maxPrice}
            step="100"
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#039BE5]"
          />
          <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
            <span>₹0</span>
            <span>₹{maxPrice.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
