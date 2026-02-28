import Link from 'next/link'

export default function PodTshirtsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="w-full py-12 px-6" style={{ backgroundColor: '#039BE5' }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-white/60 mb-2">cloudbasket · pod</p>
          <h1 className="text-4xl font-extrabold text-white mb-2">Custom T-Shirts</h1>
          <p className="text-white/80 text-sm">
            Exclusive CloudBasket designs on premium tees — available on Redbubble &amp; Teepublic.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <section
          className="rounded-2xl p-8 text-center"
          style={{ backgroundColor: '#f0fdf4', border: '2px dashed #1B5E20' }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl"
            style={{ backgroundColor: '#1B5E20' }}
          >
            👕
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">T-Shirt Collection</h2>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            Browse our full t-shirt collection across platforms. New designs added weekly.
          </p>
        </section>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/pod"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: '#039BE5' }}
          >
            View All POD →
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
