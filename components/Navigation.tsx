'use client'
import Link from 'next/link'
import { useState } from 'react'
import { TenantTheme } from '@/lib/themes'

const NAV_LINKS: Record<string, { label: string; href: string }[]> = {
    cloudbasket: [
        { label: 'Home', href: '/' },
        { label: 'POD Products', href: '/cloudbasket/pod' },
        { label: 'Affiliate Programs', href: '/cloudbasket/affiliate' },
        { label: 'CJ Network', href: '/cloudbasket/cj' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
      ],
  infotyx: [
    { label: 'Home', href: '/' },
    { label: 'News', href: '/news' },
    { label: 'Insights', href: '/insights' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  myhomefinder: [
    { label: 'Home', href: '/' },
    { label: 'Properties', href: '/properties' },
    { label: 'Developers', href: '/developers' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  dynomatrix: [
    { label: 'Home', href: '/' },
    { label: 'Solutions', href: '/solutions' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  energymetals: [
    { label: 'Home', href: '/' },
    { label: 'Metals', href: '/metals' },
    { label: 'Energy', href: '/energy' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
}

interface NavigationProps {
  tenant: string
  theme: TenantTheme
}

export function Navigation({ tenant, theme }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const links = NAV_LINKS[tenant] ?? NAV_LINKS['cloudbasket']

  return (
    <>
      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center space-x-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-medium text-gray-600 hover:text-gray-900
                       transition-colors duration-200"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sr-only">Open menu</span>
        ☰
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-lg
                        border-b z-50 md:hidden">
          <div className="px-4 py-2 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-sm font-medium text-gray-600
                           hover:bg-gray-50 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}