import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Unsubscribed | CloudBasket',
  robots: { index: false, follow: false },
}

export default function UnsubscribedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--cb-bg)] px-6">
      <div className="cb-card max-w-md w-full p-12 text-center">
        <p className="text-5xl mb-4">👋</p>
        <h1 className="text-2xl font-black tracking-tighter">You have been unsubscribed</h1>
        <p className="mt-3 text-[var(--cb-text-muted)] text-sm">You will no longer receive deal alerts from CloudBasket.</p>
        <Link href="/" className="cb-btn cb-btn-primary mt-8 inline-flex">Back to CloudBasket</Link>
      </div>
    </main>
  )
}
