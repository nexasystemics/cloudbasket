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
          <div className="bg-skyline-primary text-white text-[11px] font-black p-3 rounded-xl shadow-2xl animate-tooltip-bounce relative text-center leading-tight tracking-wide border-2 border-white/20">
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-skyline-primary" />
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
    <div className="flex flex-col items-center gap-8 py-12 border-t border-gray-100 dark:border-gray-800 mt-12 transition-colors duration-300 w-full">
      {/* Navigation Buttons - High Contrast */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black disabled:opacity-20 disabled:hover:bg-transparent transition-all active:scale-95 shadow-sm"
          aria-label="Previous page"
        >
          <ChevronLeft size={20} strokeWidth={3} />
        </button>

        <div className="flex items-center gap-2 px-4 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-2xl border border-gray-100 dark:border-gray-800">
          {pages.map((page) => (
            <Tooltip key={page} text={BRANDED_TOOLTIPS[page - 1] || "Explore more catalog highlights!"}>
              <button
                onClick={() => onPageChange(page)}
                className={`w-12 h-12 rounded-xl text-sm font-black transition-all active:scale-95 border-2 ${
                  currentPage === page
                    ? 'bg-skyline-primary border-skyline-primary text-white shadow-xl shadow-skyline-primary/30 scale-110 z-10'
                    : 'bg-white dark:bg-gray-800 border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'
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
          className="p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black disabled:opacity-20 disabled:hover:bg-transparent transition-all active:scale-95 shadow-sm"
          aria-label="Next page"
        >
          <ChevronRight size={20} strokeWidth={3} />
        </button>
      </div>

      {/* Items Per Page Dropdown */}
      <div className="flex items-center gap-4 bg-white dark:bg-gray-900 p-2 rounded-2xl border-2 border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-2 ps-3 text-gray-400 dark:text-gray-500">
          <Settings2 size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Display Density</span>
        </div>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-2 text-xs font-black text-gray-900 dark:text-white focus:ring-2 focus:ring-skyline-primary focus:outline-none transition-all cursor-pointer appearance-none min-w-[140px] text-center"
        >
          <option value={10}>10 Items</option>
          <option value={20}>20 Items</option>
          <option value={50}>50 Items</option>
          <option value={100}>100 Items</option>
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
