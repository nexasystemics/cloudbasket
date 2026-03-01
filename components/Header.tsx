'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useCallback, useEffect } from 'react'
import type { FormEvent, ChangeEvent, JSX } from 'react'
import { Star, ShoppingBag, Search, Menu, X, ChevronDown, Sun, Moon } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useTheme } from 'next-themes'

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
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest select-none bg-skyline-accent/10 text-skyline-accent dark:bg-skyline-accent/20"
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
      className="relative flex items-center justify-center p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-all active:scale-95 group"
      aria-label={`Open basket, ${totalItems} items`}
    >
      <ShoppingBag size={22} className="text-gray-700 dark:text-white group-hover:scale-110 transition-transform" />
      {totalItems > 0 && (
        <span
          className="absolute -top-1 -right-1 flex items-center justify-center rounded-full font-black min-w-[18px] h-[18px] px-1 bg-skyline-accent text-white text-[10px] shadow-lg border-2 border-white dark:border-gray-900"
        >
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  )
}

function ThemeToggle({ mounted, theme, setTheme }: { mounted: boolean, theme?: string, setTheme: (t: string) => void }): JSX.Element | null {
  if (!mounted) return <div className="w-10 h-10" />

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2.5 rounded-xl text-gray-700 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center border border-gray-200 dark:border-white/10"
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
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
  const [mounted,        setMounted]        = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

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

  const logoSrc = (mounted && theme === 'dark') ? '/brand/logo-full-dark.svg' : '/brand/logo-full.svg'

  return (
    <header className="glass-header transition-all duration-300">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo - Start */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative w-[180px] h-[40px]">
               <Image 
                src={logoSrc} 
                alt="CloudBasket" 
                fill 
                className="object-contain group-hover:scale-105 transition-transform"
                priority
               />
            </div>
          </Link>

          {/* Desktop Nav - Middle */}
          <nav className="hidden xl:flex items-center gap-1 mx-4">
            {NAV_ITEMS.map((item) => (
              <div 
                key={item.id} 
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-skyline-primary dark:hover:text-white rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-all whitespace-nowrap"
                >
                  {item.label}
                  <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === item.id ? 'rotate-180' : ''}`} />
                </Link>

                {activeDropdown === item.id && (
                  <div className="absolute top-full start-0 pt-2 w-48">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="block px-4 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-skyline-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
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

          {/* Search & Actions - End */}
          <div className="flex items-center gap-2 sm:gap-4">
            <form onSubmit={handleSearchSubmit} className="hidden md:block relative w-64 lg:w-96">
              <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
                placeholder="Search catalog..."
                className="w-full bg-black/5 dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-xl py-2.5 ps-12 pe-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 outline-none focus:bg-white dark:focus:bg-white/20 focus:border-skyline-primary transition-all"
              />
            </form>

            <div className="flex items-center gap-2 sm:gap-4">
              <ThemeToggle mounted={mounted} theme={theme} setTheme={setTheme} />
              <div className="hidden 2xl:block">
                <AffiliateBadge />
              </div>
              <CartButton />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 text-gray-700 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-all"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 animate-in slide-in-from-top duration-300 transition-colors duration-300">
          <div className="px-4 py-6 space-y-4">
            {NAV_ITEMS.map((item) => (
              <div key={item.id} className="space-y-3">
                <Link href={item.href} className="text-lg font-black text-gray-900 dark:text-white block">{item.label}</Link>
                <div className="grid grid-cols-1 gap-2 ps-4">
                  {item.dropdown.map((sub) => (
                    <Link key={sub.href} href={sub.href} className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-skyline-primary">{sub.label}</Link>
                  ))}
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              <AffiliateBadge />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
