import Link from 'next/link'

export default function AffiliateDisclosurePage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="w-full py-12 px-6" style={{ backgroundColor: '#039BE5' }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-white/60 mb-2">cloudbasket · legal</p>
          <h1 className="text-4xl font-extrabold text-white mb-2">Affiliate Disclosure</h1>
          <p className="text-white/80 text-sm">
            Transparent disclosure as required by FTC guidelines and DPDP Act 2023.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <section
          className="rounded-2xl p-6"
          style={{ backgroundColor: '#fff7f0', border: '1px solid #E65100' }}
        >
          <h2 className="font-bold text-gray-900 mb-2" style={{ color: '#E65100' }}>
            ★ We Are an Affiliate Partner
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            CloudBasket participates in affiliate marketing programs. This means we may earn a
            commission when you click on links and make a purchase. This comes at{' '}
            <strong>no additional cost to you</strong> — prices are identical whether you use
            our links or visit the retailer directly.
          </p>
        </section>

        {[
          {
            title: 'Which Links Are Affiliate Links?',
            body: 'Any link to Amazon, Flipkart, Redbubble, Teepublic, Teespring, or CJ Affiliate partner products may be an affiliate link. These are clearly marked where possible.',
          },
          {
            title: 'How Commissions Work',
            body: 'When you click an affiliate link, a tracking cookie is placed in your browser (typically 24–90 days depending on the platform). If you purchase within that window, CloudBasket earns a small commission.',
          },
          {
            title: 'Editorial Independence',
            body: 'Affiliate relationships do not influence our editorial content. Product recommendations and price comparisons are based on data accuracy and user value, not commission rates.',
          },
          {
            title: 'Partner Programs',
            body: 'Amazon Associates, Flipkart Affiliate, CJ Affiliate, Redbubble Partner Program, Teepublic Affiliate Program.',
          },
          {
            title: 'Questions?',
            body: 'Contact us at affiliate@cloudbasket.in for any questions about our affiliate relationships.',
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
