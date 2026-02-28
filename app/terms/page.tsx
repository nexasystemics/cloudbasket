import Link from 'next/link'

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="w-full py-12 px-6" style={{ backgroundColor: '#039BE5' }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-white/60 mb-2">cloudbasket · legal</p>
          <h1 className="text-4xl font-extrabold text-white mb-2">Terms of Service</h1>
          <p className="text-white/80 text-sm">Last updated: February 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        {[
          {
            title: '1. Acceptance',
            body: 'By using CloudBasket you agree to these Terms. If you do not agree, please discontinue use of the platform.',
          },
          {
            title: '2. Affiliate Links',
            body: 'CloudBasket contains affiliate links. We may earn a commission when you purchase via these links. The price you pay is never affected.',
          },
          {
            title: '3. Price Accuracy',
            body: 'Prices displayed are updated regularly but are not guaranteed to be current. Always confirm the final price at the retailer checkout before purchasing.',
          },
          {
            title: '4. Intellectual Property',
            body: 'All CloudBasket original designs (POD collection) are protected intellectual property. Reproduction without written permission is prohibited.',
          },
          {
            title: '5. Limitation of Liability',
            body: 'CloudBasket is an information and affiliate aggregator. We are not liable for transactions completed on third-party platforms.',
          },
          {
            title: '6. Governing Law',
            body: 'These Terms are governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of courts in India.',
          },
          {
            title: '7. Contact',
            body: 'legal@cloudbasket.in',
          },
        ].map((s) => (
          <section key={s.title}>
            <h2 className="font-bold text-gray-900 mb-2">{s.title}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{s.body}</p>
          </section>
        ))}

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: '#E65100' }}
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  )
}
