import Link from 'next/link'

export function IndiaTrustBar() {
  const badges = [
    {
      icon: '🌐',
      label: 'Global Price Discovery',
      sub: 'Compare prices worldwide',
      href: '/about',
    },
    {
      icon: '🔐',
      label: 'DPDPA 2023',
      sub: 'Your data is protected',
      title: 'Digital Personal Data Protection Act 2023 — fully compliant',
      href: '/legal/privacy#dpdpa',
    },
    {
      icon: '🛡️',
      label: 'GDPR Compliant',
      sub: 'EU privacy standards',
      title: 'General Data Protection Regulation — EU privacy standards met',
      href: '/legal/privacy#gdpr',
    },
    {
      icon: '📋',
      label: 'FTC Compliant',
      sub: 'Transparent affiliate links',
      title: 'FTC guidelines — all affiliate relationships disclosed',
      href: '/affiliate-disclosure',
    },
    {
      icon: '⚡',
      label: 'ONDC Ready',
      sub: 'Open commerce protocol',
      title: 'Open Network for Digital Commerce — registered discovery partner',
      href: '/about#ondc',
    },
    {
      icon: '🚀',
      label: 'Startup India',
      sub: 'DPIIT recognised',
      title: 'Startup India — DPIIT recognised digital commerce platform',
      href: '/about#startup-india',
    },
  ]

  return (
    <div className="border-t border-white/5 bg-[#09090B] py-8">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs text-muted mb-6 tracking-widest uppercase font-semibold">
          Verified Commerce Platform
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {badges.map((badge) => (
            <Link
              key={badge.label}`n              title={badge.title}
              href={badge.href}
              className="flex flex-col items-center text-center gap-1.5 p-3 rounded-lg bg-white/2 hover:bg-white/5 transition cursor-pointer"
            >
              <span className="text-2xl">{badge.icon}</span>
              <p className="font-bold text-xs text-white">{badge.label}</p>
              <p className="text-[10px] text-muted">{badge.sub}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

