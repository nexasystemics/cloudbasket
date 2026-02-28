'use client'

import Link from 'next/link'
import { useState, useCallback } from 'react'
import type { FormEvent, ChangeEvent, JSX } from 'react'
import { Star, ShoppingBag, Search, Menu, X, ChevronDown } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import {
  semantic,
  components,
  shadows,
  radii,
  transitions,
  colors,
} from '@/lib/design-system'

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

interface DropdownItem {
  readonly label: string
  readonly href: string
}

interface NavItem {
  readonly id: string
  readonly label: string
  readonly href: string
  readonly dropdown: readonly DropdownItem[]
}

const NAV_ITEMS: readonly NavItem[] = [
  {
    id: 'products',
    label: 'Products',
    href: '/products',
    dropdown: [
      { label: 'All Products',   href: '/products' },
      { label: 'Electronics',    href: '/products?category=Electronics' },
      { label: 'Fashion',        href: '/products?category=Fashion' },
      { label: 'Home & Kitchen', href: '/products?category=Home' },
    ],
  },
  {
    id: 'pod',
    label: 'POD',
    href: '/pod',
    dropdown: [
      { label: 'POD Store',         href: '/pod'       },
      { label: 'Our Designs',       href: '/pod#designs' },
    ],
  },
  {
    id: 'deals',
    label: 'Deals',
    href: '/products?q=deal',
    dropdown: [
      { label: "Today's Deals",  href: '/products?q=deal'   },
      { label: 'Flash Sales',    href: '/products?q=flash' },
    ],
  },
]

// ---------------------------------------------------------------------------
// SUB-COMPONENTS
// ---------------------------------------------------------------------------

function AffiliateBadge(): JSX.Element {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest select-none bg-[#E65100]/10 text-[#E65100]"
      title="CloudBasket contains affiliate links."
    >
      <Star size={12} fill="currentColor" />
      Partner Disclosure
    </span>
  )
}

function CartButton(): JSX.Element {
  const { totalItems, setIsCartOpen } = useCart()
  
  return (
    <button
      onClick={() => setIsCartOpen(true)}
      className="relative flex items-center justify-center p-2.5 rounded-xl hover:bg-white/10 transition-all active:scale-95 group"
      aria-label={`Open basket, ${totalItems} items`}
    >
      <ShoppingBag size={22} className="text-white group-hover:scale-110 transition-transform" />
      {totalItems > 0 && (
        <span
          className="absolute -top-1 -right-1 flex items-center justify-center rounded-full font-black min-w-[18px] h-[18px] px-1 bg-[#E65100] text-white text-[10px] shadow-lg border-2 border-[#039BE5]"
        >
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  )
}

// ---------------------------------------------------------------------------
// MAIN HEADER
// ---------------------------------------------------------------------------

export default function Header(): JSX.Element {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const [searchValue,    setSearchValue]    = useState<string>('')

  const handleSearchSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>): void => {
      e.preventDefault()
      const q = searchValue.trim()
      if (q) {
        window.location.href = `/products?q=${encodeURIComponent(q)}`
      }
    },
    [searchValue]
  )

  return (
    <header className="sticky top-0 z-50 bg-[#039BE5] shadow-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 h-16 sm:h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-xl group-hover:rotate-6 transition-transform">
              <span className="font-black text-[#039BE5] text-lg">CB</span>
            </div>
            <div className="hidden lg:flex flex-col leading-none">
              <span className="text-xl font-black text-white tracking-tighter">CloudBasket</span>
              <span className="text-[10px] font-bold text-white/70 uppercase tracking-[0.2em] mt-0.5">Global Hub</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <div 
                key={item.id} 
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white/90 hover:text-white rounded-lg hover:bg-white/10 transition-all"
                >
                  {item.label}
                  <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === item.id ? 'rotate-180' : ''}`} />
                </Link>

                {activeDropdown === item.id && (
                  <div className="absolute top-full left-0 pt-2 w-48">
                    <div className="bg-white rounded-xl shadow-2xl border border-gray-100 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="block px-4 py-2.5 text-sm font-bold text-gray-600 hover:text-[#039BE5] hover:bg-gray-50 transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="flex-grow max-w-xl relative hidden sm:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
            <input
              type="text"
              value={searchValue}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
              placeholder="Search global essentials..."
              className="w-full bg-white/10 border border-white/20 rounded-xl py-2.5 pl-12 pr-4 text-sm text-white placeholder:text-white/40 outline-none focus:bg-white/20 focus:border-white/40 transition-all"
            />
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            <div className="hidden xl:block">
              <AffiliateBadge />
            </div>
            <CartButton />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-xl transition-all"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top duration-300">
          <div className="px-4 py-6 space-y-4">
            {NAV_ITEMS.map((item) => (
              <div key={item.id} className="space-y-3">
                <Link href={item.href} className="text-lg font-black text-gray-900 block">{item.label}</Link>
                <div className="grid grid-cols-1 gap-2 pl-4">
                  {item.dropdown.map((sub) => (
                    <Link key={sub.href} href={sub.href} className="text-sm font-bold text-gray-500 hover:text-[#039BE5]">{sub.label}</Link>
                  ))}
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-gray-100">
              <AffiliateBadge />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
