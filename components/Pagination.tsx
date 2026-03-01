'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Settings2 } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  itemsPerPage: number
  onItemsPerPageChange: (size: number) => void
}

const BRANDED_TOOLTIPS = [
  "The Icons: Start your journey with our top-tier essentials!",
  "The Hidden Gems: Discover what the pros are buying!",
  "Mid-Tier Mastery: Perfect balance of price and power!",
  "Budget Legends: Elite quality without the premium tag!",
  "The Final Frontier: Rare finds and last-chance deals!"
]

function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div 
      className="relative flex items-center group"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 w-64 pointer-events-none">
          <div className="bg-[#039BE5] text-white text-[11px] font-black p-3 rounded-xl shadow-2xl animate-tooltip-bounce relative text-center leading-tight tracking-wide border-2 border-white/20">
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-[#039BE5]" />
          </div>
        </div>
      )}
    </div>
  )
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange
}: PaginationProps) {
  
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-12 border-t border-gray-100 mt-12">
      {/* Navigation Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2.5 rounded-xl border border-gray-100 text-gray-400 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-95"
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-2 px-2">
          {pages.map((page) => (
            <Tooltip key={page} text={BRANDED_TOOLTIPS[page - 1] || "Explore more catalog highlights!"}>
              <button
                onClick={() => onPageChange(page)}
                className={`w-11 h-11 rounded-lg text-sm font-black transition-all active:scale-95 border-2 ${
                  currentPage === page
                    ? 'bg-gray-900 border-gray-900 text-white shadow-lg shadow-gray-900/10'
                    : 'bg-white border-transparent text-gray-400 hover:text-gray-900 hover:border-gray-200'
                }`}
              >
                {page}
              </button>
            </Tooltip>
          ))}
        </div>

        <button
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2.5 rounded-lg border border-gray-100 text-gray-400 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-95"
          aria-label="Next page"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Items Per Page Dropdown */}
      <div className="flex items-center gap-4 bg-gray-50/50 p-1.5 rounded-xl border border-gray-100">
        <div className="flex items-center gap-2 pl-3 text-gray-400">
          <Settings2 size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Display</span>
        </div>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="bg-white border-2 border-gray-100 rounded-lg px-4 py-2 text-xs font-black text-gray-900 focus:border-[#039BE5] focus:outline-none transition-colors cursor-pointer appearance-none min-w-[120px]"
        >
          <option value={10}>10 Items / Page</option>
          <option value={12}>12 Items / Page</option>
          <option value={20}>20 Items / Page</option>
          <option value={50}>50 Items / Page</option>
        </select>
      </div>

      <style jsx global>{`
        @keyframes tooltip-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-tooltip-bounce {
          animation: tooltip-bounce 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
