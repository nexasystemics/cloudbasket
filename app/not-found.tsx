import Link from 'next/link'
import { ArrowLeft, Home, Search } from 'lucide-react'
import { ROUTES } from '@/lib/constants'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--cb-surface)] px-6 text-center">
      <p className="font-display text-[120px] font-black leading-none text-skyline-primary opacity-20">404</p>
      <h1 className="mt-4 font-display text-3xl font-black text-[var(--cb-text-primary)]">Page Not Found</h1>
      <p className="mt-3 max-w-sm text-base leading-relaxed text-[var(--cb-text-muted)]">
        The page you&apos;re looking for doesn&apos;t exist or the deal has expired.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href={ROUTES.HOME} className="cb-btn-primary gap-2">
          <Home size={16} />
          Go Home
        </Link>
        <Link href={ROUTES.PRODUCTS} className="cb-btn-ghost gap-2">
          <Search size={16} />
          Browse Deals
        </Link>
      </div>

      <p className="mt-8 text-[10px] italic text-[var(--cb-text-muted)]">
        Looking for a product deal? All links route through /go/[id] for secure affiliate redirect.
      </p>
      <p className="mt-1 text-[10px] italic text-[var(--cb-text-muted)]">Use Income Shield routing to continue.</p>
      <Link href={ROUTES.HOME} className="mt-3 inline-flex items-center gap-1 text-xs text-[var(--cb-text-muted)]">
        <ArrowLeft size={12} />
        Back to home
      </Link>
    </div>
  )
}
