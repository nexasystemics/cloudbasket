import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { ROUTES, SITE_NAME } from '@/lib/constants'

const discoverLinks = [
  { label: 'Categories', href: ROUTES.CATEGORIES },
  { label: 'Compare', href: ROUTES.COMPARE },
  { label: 'Deals', href: ROUTES.DEALS },
  { label: 'Blog', href: ROUTES.BLOG },
  { label: 'POD', href: ROUTES.POD },
  { label: 'Products', href: ROUTES.PRODUCTS },
] as const

const companyLinks = [
  { label: 'About', href: ROUTES.ABOUT },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: ROUTES.CONTACT },
  { label: 'FAQ', href: '/faq' },
] as const

const legalLinks = [
  { label: 'Affiliate Disclosure', href: ROUTES.AFFILIATE },
  { label: 'Privacy Policy', href: ROUTES.PRIVACY },
  { label: 'Terms', href: ROUTES.TERMS },
] as const

const complianceBadges = [
  { label: 'DPDPA 2023', href: '/legal/privacy#dpdpa' },
  { label: 'GDPR', href: '/legal/privacy#gdpr' },
  { label: 'FTC Compliant', href: '/affiliate-disclosure' },
] as const

export default function Footer() {
  return (
    <footer className="border-t border-[#1E293B] bg-[#09090B] text-white dark:bg-[#020206]">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-6 py-16 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-600 text-xl font-black text-white">
            CB
          </div>
          <p className="mt-3 text-2xl font-black tracking-tighter text-white">{SITE_NAME}</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#64748B]">
            Compare Prices. Discover Deals. Shop Smarter.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {complianceBadges.map((badge) => (
              <Link
                key={badge.label}
                href={badge.href}
                className="inline-block rounded-full border border-blue-600/30 bg-blue-600/10 px-3 py-1 text-xs font-semibold text-blue-400 hover:bg-blue-600/20 transition"
              >
                {badge.label}
              </Link>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2">
            
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER ?? ''}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white transition-opacity hover:opacity-90"
              aria-label="Chat with CloudBasket on WhatsApp"
            >
              <MessageCircle size={14} />
            </a>
          </div>
        </div>

        <div>
          <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-[#334155]">Browse</p>
          {discoverLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-1 text-sm text-[#64748B] transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div>
          <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-[#334155]">Company</p>
          {companyLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-1 text-sm text-[#64748B] transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div>
          <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-[#334155]">Legal</p>
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-1 text-sm text-[#64748B] transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-[#1E293B] py-6">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-6 text-center sm:flex-row sm:text-start">
          <p className="text-xs text-[#94A3B8]">Created by VERSION STATE {'{VS.IN+}'}</p>
          <p className="text-xs text-[#94A3B8]">CloudBasket vs.cb.1.0 · March 2026</p>
          <p className="text-xs text-[#94A3B8]">Powered by NEXQON HOLDINGS</p>
        </div>
        <div className="mx-auto mt-3 w-full max-w-7xl px-6 text-center">
          <p className="text-xs text-[#475569]">© 2026 CloudBasket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

