'use client'

import Link from 'next/link'
import { Shield } from 'lucide-react'
import { useGlobal } from '@/context/GlobalContext'
import { ROUTES } from '@/lib/constants'

const MOCK_ASSOCIATES = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', status: 'Active', earnings: '₹12,400', clicks: 842 },
  { id: 2, name: 'Priya Nair', email: 'priya@example.com', status: 'Active', earnings: '₹8,200', clicks: 631 },
  { id: 3, name: 'Amit Patel', email: 'amit@example.com', status: 'Pending', earnings: '₹0', clicks: 0 },
] as const

export default function AdminAssociatesPage() {
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

  return (
    <div className="min-h-screen bg-[var(--cb-surface-2)]">
      <div className="mx-auto w-full max-w-5xl px-6 py-12">
        <header className="mb-6 flex items-center gap-3">
          <h1 className="font-display text-2xl font-black text-[var(--cb-text-primary)]">Associates</h1>
          <span className="cb-badge bg-skyline-glow text-skyline-primary">{MOCK_ASSOCIATES.length}</span>
        </header>

        <div className="cb-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[var(--cb-surface-3)] text-[11px] uppercase tracking-widest text-[var(--cb-text-muted)]">
                <th className="px-4 py-3 text-start">Name</th>
                <th className="px-4 py-3 text-start">Email</th>
                <th className="px-4 py-3 text-start">Status</th>
                <th className="px-4 py-3 text-start">Clicks</th>
                <th className="px-4 py-3 text-start">Earnings</th>
                <th className="px-4 py-3 text-start">Action</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ASSOCIATES.map((associate) => (
                <tr key={associate.id} className="border-t cb-border">
                  <td className="px-4 py-3 text-sm text-[var(--cb-text-primary)]">{associate.name}</td>
                  <td className="px-4 py-3 text-sm text-[var(--cb-text-muted)]">{associate.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`cb-badge ${
                        associate.status === 'Active'
                          ? 'bg-status-success/10 text-status-success'
                          : 'bg-status-warning/10 text-status-warning'
                      }`}
                    >
                      {associate.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--cb-text-primary)]">{associate.clicks}</td>
                  <td className="px-4 py-3 text-sm text-[var(--cb-text-primary)]">{associate.earnings}</td>
                  <td className="px-4 py-3">
                    <button type="button" className="cb-btn-ghost py-1 text-xs">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
