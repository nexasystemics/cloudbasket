'use client'

import { useEffect, useState } from 'react'

type ComplianceBadge = {
  label: string
  title: string
  description: string
}

interface FooterComplianceBadgesProps {
  badges: readonly ComplianceBadge[]
}

export default function FooterComplianceBadges({ badges }: FooterComplianceBadgesProps) {
  const [activeBadge, setActiveBadge] = useState<ComplianceBadge | null>(null)

  useEffect(() => {
    if (activeBadge === null) {
      return
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveBadge(null)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [activeBadge])

  return (
    <>
      <div className="mt-4 flex flex-wrap gap-2">
        {badges.map((badge) => (
          <button
            key={badge.label}
            type="button"
            onClick={() => setActiveBadge(badge)}
            className="inline-block rounded-full border border-blue-600/30 bg-blue-600/10 px-3 py-1 text-xs font-semibold text-blue-400 transition hover:bg-blue-600/20"
          >
            {badge.label}
          </button>
        ))}
      </div>

      {activeBadge !== null ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="footer-compliance-title"
          onClick={() => setActiveBadge(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="footer-compliance-title" className="text-xl font-black text-slate-900">
              {activeBadge.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {activeBadge.description}
            </p>
            <button
              type="button"
              onClick={() => setActiveBadge(null)}
              className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}
