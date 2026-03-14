import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { IMAGE_ASSETS } from '@/lib/image-assets'

export const metadata: Metadata = {
  title: 'POD Phone Cases',
  description: 'Browse CloudBasket print-on-demand phone cases with device-focused designs and verified partner redirects.',
}

export default function PodPhoneCasesPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="w-full py-12 px-6" style={{ backgroundColor: '#039BE5' }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-white/60 mb-2">cloudbasket · pod</p>
          <h1 className="text-4xl font-extrabold text-white mb-2">Phone Cases</h1>
          <p className="text-white/80 text-sm">
            Protect your phone in style with exclusive CloudBasket designs.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <section
          className="rounded-2xl p-8 text-center"
          style={{ backgroundColor: '#f0fdf4', border: '2px dashed #1B5E20' }}
        >
          <div
            className="w-14 h-14 rounded-full overflow-hidden mx-auto mb-4"
            style={{ backgroundColor: '#1B5E20' }}
          >
            <Image
              src={IMAGE_ASSETS.pod['phone-cases']}
              alt="Phone case"
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Phone Case Collection</h2>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            Compatible with iPhone, Samsung and more. Available on Redbubble.
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
