import Link from 'next/link'

export default function FlashSalesPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="w-full py-12 px-6" style={{ backgroundColor: '#039BE5' }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-white/60 mb-2">cloudbasket · deals</p>
          <h1 className="text-4xl font-extrabold text-white mb-2">Flash Sales</h1>
          <p className="text-white/80 text-sm">
            Time-limited deals refreshed every hour. Act fast — these won&apos;t last.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <section
          className="rounded-2xl p-8 text-center"
          style={{ backgroundColor: '#fff7f0', border: '2px dashed #E65100' }}
        >
          <div
            className="w-14 h-14 rounded-full overflow-hidden mx-auto mb-4"
            style={{ backgroundColor: '#E65100' }}
          >
            <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=56&h=56&fit=crop" alt="Flash deal" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Flash Sales Coming Soon</h2>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            Our automated flash sale engine is being set up. Subscribe to be notified the moment
            a flash deal goes live.
          </p>
        </section>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/deals"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: '#039BE5' }}
          >
            View All Deals →
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: '#E65100' }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
