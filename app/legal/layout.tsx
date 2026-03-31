// © 2026 NEXQON HOLDINGS — CloudBasket app/legal/layout.tsx
'use client'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  href: string
  label: string
}

const NAV_ITEMS: NavItem[] = [
  { href: '/legal/terms', label: 'Terms of Service' },
  { href: '/legal/privacy', label: 'Privacy Policy' },
  { href: '/legal/cookies', label: 'Cookie Policy' },
  { href: '/legal/affiliate-disclosure', label: 'Affiliate Disclosure' },
  { href: '/legal/disclaimer', label: 'Disclaimer' },
]

export default function LegalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-white">
      {/* Site header */}
      <header className="border-b border-gray-200 bg-white print:hidden">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm font-medium text-[#039BE5] hover:underline"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M10 13L5 8l5-5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back to Home
            </Link>
            <Link href="/" className="text-lg font-black tracking-tight text-[#039BE5]">
              CloudBasket
            </Link>
            {/* spacer */}
            <div className="w-24" aria-hidden="true" />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Mobile — horizontal tab nav */}
        <nav
          className="overflow-x-auto border-b border-gray-200 print:hidden lg:hidden"
          aria-label="Legal pages"
        >
          <div className="flex gap-1 py-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  pathname === item.href
                    ? 'bg-[#039BE5] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="flex gap-8 py-8">
          {/* Desktop — sidebar nav */}
          <aside
            className="hidden w-56 shrink-0 print:hidden lg:block"
            aria-label="Legal navigation"
          >
            <div className="sticky top-8">
              <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Legal Documents
              </p>
              <nav className="space-y-0.5">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? 'bg-[#039BE5]/10 font-semibold text-[#039BE5]'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-8 border-t border-gray-200 pt-5">
                <Link
                  href="/legal"
                  className="block text-xs text-gray-400 hover:text-[#039BE5]"
                >
                  ← All Legal Pages
                </Link>
                <Link
                  href="/"
                  className="mt-2 block text-xs text-gray-400 hover:text-[#039BE5]"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </aside>

          {/* Page content */}
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-6 print:hidden">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-gray-500 sm:px-6 lg:px-8">
          <p>© 2026 NEXQON HOLDINGS | CloudBasket | www.cloudbasket.in</p>
          <p className="mt-1">
            Kadapa, Andhra Pradesh – 516002, India |{' '}
            <a href="mailto:info@cloudbasket.co" className="hover:text-[#039BE5]">
              info@cloudbasket.co
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
