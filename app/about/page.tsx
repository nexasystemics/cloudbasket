import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="w-full py-12 px-6" style={{ backgroundColor: '#039BE5' }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-white/60 mb-2">cloudbasket</p>
          <h1 className="text-4xl font-extrabold text-white mb-2">About CloudBasket</h1>
          <p className="text-white/80 text-sm max-w-xl">
            India&apos;s smart shopping hub — compare prices, track deals, discover exclusive
            print-on-demand designs and earn affiliate commissions, all in one place.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: '#36454F' }}>Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            CloudBasket was built to help Indian and global shoppers make smarter purchasing
            decisions. We aggregate prices from top marketplaces, curate daily deals, and
            showcase exclusive print-on-demand designs — all under one roof.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: '#36454F' }}>What We Do</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span style={{ color: '#1B5E20' }} className="font-bold mt-0.5">✓</span>
              Compare prices across Amazon, Flipkart and global marketplaces
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: '#1B5E20' }} className="font-bold mt-0.5">✓</span>
              Curate daily deals, flash sales and coupon codes
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: '#1B5E20' }} className="font-bold mt-0.5">✓</span>
              Publish exclusive designs on print-on-demand platforms
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: '#1B5E20' }} className="font-bold mt-0.5">✓</span>
              Run an affiliate program earning up to 8% commission
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: '#36454F' }}>Compliance</h2>
          <p className="text-gray-600 leading-relaxed">
            CloudBasket is compliant with the DPDP Act 2023. We do not sell or share your
            personal data with third parties. Affiliate links are disclosed transparently on
            every page.
          </p>
        </section>

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
