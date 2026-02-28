import Link from 'next/link'

interface FaqItem {
  readonly q: string
  readonly a: string
}

const FAQS: readonly FaqItem[] = [
  {
    q: 'Is CloudBasket free to use?',
    a: 'Yes. CloudBasket is completely free for shoppers. We earn through affiliate commissions when you make a purchase via our links — at no extra cost to you.',
  },
  {
    q: 'Do you sell products directly?',
    a: 'No. CloudBasket is an aggregator and affiliate platform. We link you to Amazon, Flipkart, Redbubble, Teepublic and other trusted platforms where you complete your purchase.',
  },
  {
    q: 'How does the affiliate program work?',
    a: 'Sign up, get your unique referral links, share them anywhere, and earn up to 8% commission on qualifying sales. Payouts are processed monthly.',
  },
  {
    q: 'Are your prices always accurate?',
    a: 'Prices are updated regularly via our price engine, but final prices are always confirmed at the retailer checkout. Always verify before purchasing.',
  },
  {
    q: 'How do I get my POD design on CloudBasket?',
    a: 'Visit our POD Store page to browse our exclusive designs available on Redbubble, Teepublic and Teespring. Custom submissions will be available soon.',
  },
  {
    q: 'Is my data safe?',
    a: 'Yes. CloudBasket is DPDP Act 2023 compliant. We do not sell or share personal data. See our Privacy Policy for full details.',
  },
]

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="w-full py-12 px-6" style={{ backgroundColor: '#039BE5' }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-white/60 mb-2">cloudbasket</p>
          <h1 className="text-4xl font-extrabold text-white mb-2">Frequently Asked Questions</h1>
          <p className="text-white/80 text-sm">Everything you need to know about CloudBasket.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-4">
        {FAQS.map((item, idx) => (
          <div key={idx} className="rounded-2xl border border-gray-200 p-6">
            <h2 className="font-bold text-gray-900 mb-2">{item.q}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
          </div>
        ))}

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: '#E65100' }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
