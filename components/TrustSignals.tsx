// components/TrustSignals.tsx
// Trust signals section — social proof numbers.

import { Users, TrendingDown, Package, Shield } from 'lucide-react'

const SIGNALS = [
  { icon: Users, label: '5,00,000+', sublabel: 'Happy Shoppers', color: 'text-blue-500' },
  { icon: TrendingDown, label: '₹2 Crore+', sublabel: 'Saved by Users', color: 'text-green-500' },
  { icon: Package, label: '50,000+', sublabel: 'Products Tracked', color: 'text-orange-500' },
  { icon: Shield, label: '100% Safe', sublabel: 'Secure & Private', color: 'text-purple-500' },
]

export default function TrustSignals() {
  return (
    <section className="py-8 border-y border-[var(--cb-border)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {SIGNALS.map(({ icon: Icon, label, sublabel, color }) => (
            <div key={label} className="text-center">
              <Icon size={28} className={`${color} mx-auto mb-2`} />
              <p className={`text-2xl font-black ${color}`}>{label}</p>
              <p className="text-xs text-[var(--cb-text-muted)] mt-1">{sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
