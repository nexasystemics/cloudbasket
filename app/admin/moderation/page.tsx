'use client'

import Link from 'next/link'
import { Shield } from 'lucide-react'
import { useGlobal } from '@/context/GlobalContext'
import { ROUTES } from '@/lib/constants'
import { PRODUCTS } from '@/lib/mock-data'

export default function AdminModerationPage() {
  const { user } = useGlobal()

  if (!user || user.role !== 'Admin') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--cb-surface)] px-6 text-center">
        <Shield size={48} className="text-status-error" />
        <h1 className="mt-3 font-display text-2xl font-black text-[var(--cb-text-primary)]">Admin Access Required</h1>
        <Link href={ROUTES.LOGIN} className="cb-btn-primary mt-4">
          Sign In
        </Link>
      </div>
    )
  }

  const pendingProducts = PRODUCTS.slice(0, 5)

  return (
    <div className="min-h-screen bg-[var(--cb-surface-2)]">
      <div className="mx-auto w-full max-w-5xl px-6 py-12">
        <header className="mb-6 flex items-center gap-3">
          <h1 className="font-display text-2xl font-black text-[var(--cb-text-primary)]">Moderation Queue</h1>
          <span className="cb-badge bg-skyline-glow text-skyline-primary">{pendingProducts.length}</span>
        </header>

        <div className="cb-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[var(--cb-surface-3)] text-[11px] uppercase tracking-widest text-[var(--cb-text-muted)]">
                <th className="px-4 py-3 text-start">ID</th>
                <th className="px-4 py-3 text-start">Name</th>
                <th className="px-4 py-3 text-start">Category</th>
                <th className="px-4 py-3 text-start">Price</th>
                <th className="px-4 py-3 text-start">Source</th>
                <th className="px-4 py-3 text-start">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingProducts.map((product) => (
                <tr key={product.id} className="border-t cb-border">
                  <td className="px-4 py-3 text-sm text-[var(--cb-text-muted)]">{product.id}</td>
                  <td className="px-4 py-3 text-sm text-[var(--cb-text-primary)]">{product.name}</td>
                  <td className="px-4 py-3 text-sm text-[var(--cb-text-muted)]">{product.mainCategory}</td>
                  <td className="px-4 py-3 text-sm text-[var(--cb-text-primary)]">₹{product.price}</td>
                  <td className="px-4 py-3 text-sm text-[var(--cb-text-muted)]">{product.source}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => void 0}
                        className="cb-btn-primary py-1 text-xs"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => void 0}
                        className="cb-btn-ghost py-1 text-xs text-status-error"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-[var(--cb-text-muted)]">
          Actions will be connected to Supabase in production
        </p>
      </div>
    </div>
  )
}
