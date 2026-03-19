'use client'

// Estimated: ~160 lines
// Purpose: Main site footer with navigation sitemap, compliance badges and legal info.

'use client'

import Link from 'next/link'
import { MessageCircle, ArrowUp } from 'lucide-react'
import FooterComplianceBadges from '@/components/FooterComplianceBadges'
import { ROUTES, SITE_NAME } from '@/lib/constants'

const sitemap = [
  {
    title: 'Shop',
    links: [
      { label: 'All Products', href: ROUTES.PRODUCTS },
      { label: 'Hot Deals', href: ROUTES.DEALS },
      { label: 'Flash Sales', href: '/deals/flash' },
      { label: 'Categories', href: ROUTES.CATEGORIES },
      { label: 'Compare', href: ROUTES.COMPARE },
      { label: 'Price Tracker', href: '/search' },
    ],
  },
  {
    title: 'Custom POD',
    links: [
      { label: 'Designer T-Shirts', href: '/pod/tshirts' },
      { label: 'Custom Mugs', href: '/pod/mugs' },
      { label: 'Phone Cases', href: '/pod/phone-cases' },
      { label: 'POD Hub', href: '/pod' },
      { label: 'Shopping Quiz', href: '/quiz' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: ROUTES.ABOUT },
      { label: 'CloudBasket Blog', href: ROUTES.BLOG },
      { label: 'Help Center (FAQ)', href: '/faq' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact Support', href: '/contact' },
      { label: 'Site Index', href: '/sitemap' },
    ],
  },
  {
    title: 'Trust & Legal',
    links: [
      { label: 'Privacy Policy', href: ROUTES.PRIVACY },
      { label: 'Terms of Service', href: ROUTES.TERMS },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Affiliate Disclosure', href: ROUTES.AFFILIATE },
      { label: 'Associate Program', href: '/associates' },
    ],
  },
]

const complianceBadges = [
  {
    label: 'DPDPA 2023',
    title: 'DPDPA 2023',
    description:
      'We never sell your personal data and comply with India Digital Personal Data Protection Act 2023.',
  },
  {
    label: 'GDPR',
    title: 'GDPR',
    description:
      'You can access correct or delete your data anytime under EU GDPR rights.',
  },
  {
    label: 'FTC',
    title: 'FTC',
    description:
      'All affiliate relationships and sponsored links are clearly disclosed per FTC guidelines.',
  },
  {
    label: 'ONDC',
    title: 'ONDC',
    description:
      'CloudBasket supports Open Network for Digital Commerce standards for fair price discovery.',
  },
  {
    label: 'Startup India',
    title: 'Startup India',
    description:
      'CloudBasket is recognised under Startup India initiative by DPIIT.',
  },
] as const

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 text-white pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-6">
          <div className="col-span-2">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
            >
              <div className="w-10 h-10 bg-[#039BE5] rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-sm">CB</span>
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">{SITE_NAME}</span>
            </Link>
            
            <p className="mt-4 max-w-xs text-sm font-bold text-zinc-400 leading-relaxed uppercase tracking-tight italic">
              India&apos;s Smartest Price Aggregator — No checkout, no storage, just the best prices.
            </p>

            <div className="mt-6">
              <FooterComplianceBadges badges={complianceBadges} />
            </div>

            <div className="mt-6 flex items-center gap-4">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER ?? ''}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                aria-label="Chat with CloudBasket on WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 rounded-lg p-1"
              >
                Back to top <ArrowUp size={14} />
              </button>
            </div>
          </div>

          {sitemap.map((section) => (
            <div key={section.title}>
              <p className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                {section.title}
              </p>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs font-bold text-zinc-400 transition-colors hover:text-skyline-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 rounded-md p-1 -m-1"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-zinc-900 pt-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="text-center md:text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                © {currentYear} {SITE_NAME}. All rights reserved.
              </p>
              <p className="mt-1 text-[9px] font-bold text-zinc-700 uppercase tracking-widest">
                Powered by NEXQON HOLDINGS · VERSION STATE {'{VS.IN+}'}
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <div className="px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-[9px] font-black text-zinc-500 uppercase tracking-[0.15em]">
                DPDPA 2023 Compliant
              </div>
              <div className="px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-[9px] font-black text-zinc-500 uppercase tracking-[0.15em]">
                GDPR Verified
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

