export function IndiaTrustBar() {
  const badges = [
    { icon: '🇮🇳', label: 'Global Price Discovery', sub: 'Zero checkout. Pure discovery.' },
    { icon: '🔐', label: 'DPDP Compliant', sub: 'Data stored in India' },
    { icon: '✅', label: 'RBI Partners', sub: 'Razorpay · Cashfree' },
    { icon: '⚡', label: 'ONDC Ready', sub: 'Open commerce protocol' },
    { icon: '🏛️', label: 'Startup India', sub: 'DIPP recognised' },
    { icon: '📈', label: '50+ Stores Compared', sub: 'Updated every hour' },
  ]

  return (
    <div className="border-t border-white/5 bg-[#09090B] py-8">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs text-muted mb-6 tracking-widest uppercase font-semibold">
          Trusted Commerce Infrastructure
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {badges.map((badge) => (
            <div key={badge.label} className="flex flex-col items-center text-center gap-1.5 p-3 rounded-lg bg-white/2 hover:bg-white/5 transition">
              <span className="text-2xl">{badge.icon}</span>
              <p className="font-bold text-xs text-white">{badge.label}</p>
              <p className="text-[10px] text-muted">{badge.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

