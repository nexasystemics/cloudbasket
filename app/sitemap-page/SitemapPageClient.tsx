'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, ExternalLink } from 'lucide-react'

const SITEMAP_SECTIONS = [
  { title: 'Main', links: [{ label: 'Homepage', href: '/' }, { label: 'All Products', href: '/products' }, { label: "Today's Deals", href: '/deals' }, { label: 'Flash Sale', href: '/deals/flash' }, { label: 'Compare Products', href: '/compare' }, { label: 'Search', href: '/search' }, { label: 'All Categories', href: '/categories' }, { label: 'All Brands', href: '/brands' }] },
  { title: 'Categories', links: [{ label: 'Mobiles', href: '/category/mobiles' }, { label: 'Laptops', href: '/category/laptops' }, { label: 'Fashion', href: '/category/fashion' }, { label: 'Home Appliances', href: '/category/home' }, { label: 'Beauty & Personal Care', href: '/category/beauty' }, { label: 'Sports & Fitness', href: '/category/sports' }, { label: 'Books', href: '/category/books' }, { label: 'Toys & Games', href: '/category/toys' }, { label: 'Electronics', href: '/category/electronics' }, { label: 'Gaming', href: '/category/gaming' }] },
  { title: 'POD Store', links: [{ label: 'CloudBasket Originals', href: '/pod' }, { label: 'T-Shirts', href: '/pod/tshirts' }, { label: 'Mugs & Drinkware', href: '/pod/mugs' }, { label: 'Phone Cases', href: '/pod/phone-cases' }] },
  { title: 'Blog', links: [{ label: 'Blog Home', href: '/blog' }, { label: 'Best Smartphones Under ₹20,000', href: '/blog/best-smartphones-under-20000' }, { label: 'Top Laptops Under ₹50,000', href: '/blog/top-laptops-under-50000' }, { label: 'Amazon vs Flipkart 2026', href: '/blog/amazon-vs-flipkart-2026' }] },
  { title: 'Company', links: [{ label: 'About CloudBasket', href: '/about' }, { label: 'Careers', href: '/careers' }, { label: 'Contact Us', href: '/contact' }, { label: 'FAQ', href: '/faq' }, { label: 'Partner With Us', href: '/partners' }, { label: 'Associates Program', href: '/associates' }, { label: 'Mobile App', href: '/app' }] },
  { title: 'Legal', links: [{ label: 'Legal Hub', href: '/legal' }, { label: 'Terms of Service', href: '/legal/terms' }, { label: 'Privacy Policy', href: '/legal/privacy' }, { label: 'Cookie Policy', href: '/cookies' }, { label: 'Affiliate Disclosure', href: '/affiliate-disclosure' }, { label: 'Refund Policy', href: '/legal/refund-policy' }, { label: 'Accessibility Statement', href: '/legal/accessibility' }] },
  { title: 'Account', links: [{ label: 'Login', href: '/login' }, { label: 'Register', href: '/register' }] },
]

export default function SitemapPageClient() {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    if (!query.trim()) return SITEMAP_SECTIONS
    const q = query.toLowerCase()
    return SITEMAP_SECTIONS.map((section) => ({
      ...section,
      links: section.links.filter((link) => link.label.toLowerCase().includes(q) || link.href.toLowerCase().includes(q)),
    })).filter((section) => section.links.length > 0)
  }, [query])

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-4xl font-black tracking-tighter mb-2">Site Map</h1>
      <p className="text-[var(--cb-text-muted)] mb-8">Complete directory of all pages on CloudBasket</p>
      <div className="relative mb-8">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--cb-text-muted)]" />
        <input className="cb-input w-full pl-11" placeholder="Search pages..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((section) => (
          <div key={section.title} className="cb-card p-5">
            <h2 className="font-black text-sm uppercase tracking-widest text-skyline-primary mb-3">{section.title}</h2>
            <ul className="space-y-1.5">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="flex items-center justify-between text-sm hover:text-skyline-primary transition-colors group">
                    <span>{link.label}</span>
                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--cb-text-muted)]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="text-xs text-[var(--cb-text-muted)] mt-10 text-center">
        Total pages: {SITEMAP_SECTIONS.reduce((acc, s) => acc + s.links.length, 0)} |{' '}
        <Link href="/sitemap.xml" className="text-skyline-primary ml-1">XML Sitemap →</Link>
      </p>
    </main>
  )
}
