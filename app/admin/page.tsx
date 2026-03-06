'use client'

import Link from 'next/link'
import {
  BarChart2,
  ChevronRight,
  Eye,
  ExternalLink,
  Package,
  Settings,
  Shield,
  Tag,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useGlobal } from '@/context/GlobalContext'
import { ROUTES } from '@/lib/constants'
import { DEALS, FLASH_DEALS } from '@/lib/deals-data'
import { PRODUCTS } from '@/lib/mock-data'

const ADMIN_SECTIONS = [
  { id: 'lister', label: 'Product Lister', icon: Package, href: '/admin/lister' },
  { id: 'associates', label: 'Associates', icon: Users, href: '/admin/associates' },
  { id: 'marketing', label: 'Marketing Studio', icon: TrendingUp, href: '/admin/marketing' },
  { id: 'keys', label: 'Affiliate Vault', icon: Shield, href: '/admin/affiliate-keys' },
  { id: 'moderation', label: 'Moderation', icon: Eye, href: '/admin/moderation' },
] as const

export default function AdminPage() {
  const { user } = useGlobal()

  if (!user || user.role !== 'Admin') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--cb-surface)] px-6 text-center">
        <Shield size={48} className="text-status-error" />
        <h1 className="mt-3 font-display text-2xl font-black text-[var(--cb-text-primary)]">Admin Access Required</h1>
        <p className="mt-2 text-sm text-[var(--cb-text-muted)]">Sign in with an admin account to continue.</p>
        <Link href={ROUTES.LOGIN} className="cb-btn-primary mt-4">
          Sign In
        </Link>
      </div>
    )
  }

  const totalProducts = PRODUCTS.length
  const approvedProducts = PRODUCTS.filter((item) => item.status === 'Approved').length
  const pendingProducts = PRODUCTS.filter((item) => item.status === 'Pending').length
  const totalDeals = DEALS.length
  const flashDeals = FLASH_DEALS.length
  const featuredProducts = PRODUCTS.filter((item) => item.isFeatured).length

  const stats = [
    { id: 'products', label: 'Total Products', value: totalProducts, icon: Package },
    { id: 'approved', label: 'Approved', value: approvedProducts, icon: Shield },
    { id: 'pending', label: 'Pending', value: pendingProducts, icon: Settings },
    { id: 'deals', label: 'Total Deals', value: totalDeals, icon: Tag },
  ] as const

  return (
    <div className="min-h-screen bg-[var(--cb-surface-2)]">
      <header className="flex items-center justify-between border-b cb-border bg-[var(--cb-surface)] px-6 py-4">
        <h1 className="flex items-center gap-2 font-display text-xl font-black text-[var(--cb-text-primary)]">
          <Shield size={20} className="text-skyline-primary" />
          <BarChart2 size={18} className="text-[var(--cb-text-muted)]" />
          Admin Command Center
        </h1>
        <p className="text-sm text-[var(--cb-text-muted)]">{user.email}</p>
      </header>

      <section className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-4 px-6 py-8 lg:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.id} className="cb-card p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-skyline-glow">
              <stat.icon size={20} className="text-skyline-primary" />
            </div>
            <p className="mt-3 font-display text-3xl font-black text-[var(--cb-text-primary)]">
              {new Intl.NumberFormat('en-IN').format(stat.value)}
            </p>
            <p className="mt-1 text-[11px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">
              {stat.label}
            </p>
          </article>
        ))}
      </section>

      <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 px-6 sm:grid-cols-2 lg:grid-cols-3">
        {ADMIN_SECTIONS.map((section) => (
          <Link key={section.id} href={section.href} className="cb-card cursor-pointer p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-skyline-glow">
              <section.icon size={22} className="text-skyline-primary" />
            </div>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[var(--cb-text-primary)]">{section.label}</h2>
              <div className="flex items-center gap-1 text-[var(--cb-text-muted)]">
                <ExternalLink size={14} />
                <ChevronRight size={16} />
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-black text-[var(--cb-text-primary)]">Recent Products</h2>
          <div className="text-xs text-[var(--cb-text-muted)]">
            Flash deals: {flashDeals} · Featured: {featuredProducts}
          </div>
        </div>

        <div className="cb-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[var(--cb-surface-3)] text-[11px] uppercase tracking-widest text-[var(--cb-text-muted)]">
                <th className="px-4 py-3 text-start">ID</th>
                <th className="px-4 py-3 text-start">Name</th>
                <th className="px-4 py-3 text-start">Category</th>
                <th className="px-4 py-3 text-start">Price</th>
                <th className="px-4 py-3 text-start">Status</th>
              </tr>
            </thead>
            <tbody>
              {PRODUCTS.slice(0, 10).map((product) => (
                <tr key={product.id} className="border-t cb-border transition-colors hover:bg-[var(--cb-surface-2)]">
                  <td className="px-4 py-3 text-sm text-[var(--cb-text-muted)]">{product.id}</td>
                  <td className="px-4 py-3 text-sm text-[var(--cb-text-primary)]">{product.name}</td>
                  <td className="px-4 py-3 text-sm text-[var(--cb-text-muted)]">{product.mainCategory}</td>
                  <td className="px-4 py-3 text-sm text-[var(--cb-text-primary)]">
                    ₹{new Intl.NumberFormat('en-IN').format(product.price)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`cb-badge ${
                        product.status === 'Approved'
                          ? 'bg-status-success/10 text-status-success'
                          : product.status === 'Pending'
                            ? 'bg-status-warning/10 text-status-warning'
                            : 'bg-status-error/10 text-status-error'
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
