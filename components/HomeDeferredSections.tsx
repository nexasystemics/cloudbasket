'use client'

import dynamic from 'next/dynamic'

const TrustScoreWidget = dynamic(() => import('@/components/TrustScoreWidget'), {
  ssr: false,
  loading: () => <div className="mx-auto min-h-28 w-full max-w-7xl rounded-[var(--cb-radius-card)] bg-[var(--cb-surface-2)]" aria-hidden="true" />,
})

const PersonalizedGrid = dynamic(() => import('@/components/PersonalizedGrid'), {
  ssr: false,
  loading: () => (
    <section className="py-12" aria-hidden="true">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 min-h-16 rounded-[var(--cb-radius-card)] bg-[var(--cb-surface-2)]" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="min-h-72 rounded-[var(--cb-radius-card)] bg-[var(--cb-surface-2)]" />
          ))}
        </div>
      </div>
    </section>
  ),
})

const NewsletterSection = dynamic(() => import('@/components/NewsletterSection'), {
  ssr: false,
  loading: () => <div className="mx-auto min-h-64 w-full max-w-7xl rounded-[var(--cb-radius-card)] bg-[var(--cb-surface-2)]" aria-hidden="true" />,
})

export default function HomeDeferredSections() {
  return (
    <>
      <TrustScoreWidget />
      <PersonalizedGrid />
      <NewsletterSection />
    </>
  )
}
