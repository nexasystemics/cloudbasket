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
      label: 'DPDPA and GDPR Safe',
      sub: 'Privacy-first data handling',
      href: '/legal/privacy',
    },
    {
      icon: '⚡',
      label: 'Real-time Prices',
      sub: 'Fresh deal tracking',
      href: '/products',
    },
    {
      icon: '🧭',
      label: 'Zero Checkout',
      sub: 'Direct to merchant stores',
      href: '/about',
    },
    {
      icon: '🏷️',
      label: 'Best Price Guarantee',
      sub: 'Find the strongest live offer',
      href: '/deals',
    },
  ]

  return (
    <div className="border-t border-white/5 bg-[#09090B] py-8">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs text-muted mb-6 tracking-widest uppercase font-semibold">
          Verified Commerce Platform
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {badges.map((badge) => (
            <Link
              key={badge.label}
              title={badge.sub}
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



