import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ShieldCheck, Truck, RotateCcw, Clock, Flame } from 'lucide-react'
import { getDealById, DEALS, type Deal } from '@/lib/deals-data'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return DEALS.map((d) => ({ id: d.id }))
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const deal = getDealById(id)
  if (!deal) return { title: 'Deal Not Found | CloudBasket' }
  return {
    title: `${deal.name} — ${deal.discount} | CloudBasket Deals`,
    description: deal.description,
  }
}

function PlatformBadge({ platform }: { platform: Deal['platform'] }) {
  if (platform === 'Amazon') {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold text-white"
        style={{ backgroundColor: '#FF9900' }}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white shrink-0" aria-hidden>
          <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.226-.088.39.01.41.24.02.23-.097.408-.31.507-2.968 1.29-6.13 1.936-9.48 1.936-4.286 0-8.307-1.054-12.06-3.162-.218-.13-.293-.363-.163-.57l.33-.23z" />
        </svg>
        Available on Amazon
      </span>
    )
  }
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold text-white"
      style={{ backgroundColor: '#2874F0' }}
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white shrink-0" aria-hidden>
        <path d="M11.5.5C5.25.5.25 5.5.25 11.75S5.25 23 11.5 23 22.75 18 22.75 11.75 17.75.5 11.5.5z" />
      </svg>
      Available on Flipkart
    </span>
  )
}

function StarRating({ rating, reviews }: { rating: number; reviews: string }) {
  const full = Math.floor(rating)
  return (
    <div className="flex items-center gap-2">
      <span className="flex">
        {Array.from({ length: 5 }, (_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < full ? 'text-amber-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </span>
      <span className="text-gray-700 font-semibold">{rating}</span>
      <span className="text-gray-400 text-sm">({reviews} reviews)</span>
    </div>
  )
}

function StockBar({ stock, totalStock }: { stock: number; totalStock: number }) {
  const pct = Math.round((stock / totalStock) * 100)
  const color = pct < 20 ? '#E65100' : pct < 50 ? '#F5C518' : '#1B5E20'
  return (
    <div>
      <div className="flex justify-between text-xs font-medium mb-1.5">
        <span style={{ color }}>
          {pct < 20 ? 'Almost gone!' : pct < 50 ? 'Selling fast' : 'In stock'}
        </span>
        <span className="text-gray-500">{stock} of {totalStock} left</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

export default async function DealDetailPage({ params }: PageProps) {
  const { id } = await params
  const deal = getDealById(id)
  if (!deal) notFound()

  const related = DEALS.filter(
    (d) => d.category === deal.category && d.id !== deal.id,
  ).slice(0, 4)

  const otherDeals = related.length < 4
    ? [
        ...related,
        ...DEALS.filter((d) => d.id !== deal.id && !related.find((r) => r.id === d.id)),
      ].slice(0, 4)
    : related

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          <Link href="/" className="hover:text-[#039BE5] transition-colors">Home</Link>
          <ChevronRight size={14} className="shrink-0" />
          <Link href="/deals" className="hover:text-[#039BE5] transition-colors">Deals</Link>
          <ChevronRight size={14} className="shrink-0" />
          <span className="text-gray-800 font-medium line-clamp-1">{deal.name}</span>
        </div>
      </div>

      {/* ── Deal Hero ── */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

            {/* ── Image panel ── */}
            <div className="relative bg-gray-50 aspect-square md:aspect-auto md:min-h-[440px] flex items-center justify-center p-8">
              <img
                src={deal.imageUrl}
                alt={deal.name}
                className="max-w-full max-h-[380px] object-contain drop-shadow-xl"
              />
              {/* Discount badge */}
              <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-green-500 text-white text-sm font-bold shadow">
                {deal.discount}
              </span>
              {/* Deal type badge */}
              <span
                className="absolute top-4 right-4 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-white text-xs font-bold shadow"
                style={{ backgroundColor: '#E65100' }}
              >
                <Flame size={12} />
                {deal.dealType}
              </span>
            </div>

            {/* ── Info panel ── */}
            <div className="p-6 md:p-8 flex flex-col">
              <PlatformBadge platform={deal.platform} />

              <h1 className="mt-3 text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {deal.name}
              </h1>

              <div className="mt-3">
                <StarRating rating={deal.rating} reviews={deal.reviews} />
              </div>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-bold" style={{ color: '#039BE5' }}>
                  {deal.dealPrice}
                </span>
                <span className="text-lg text-gray-400 line-through">{deal.originalPrice}</span>
                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                  {deal.discount}
                </span>
              </div>

              {/* Timer */}
              <div
                className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold w-fit"
                style={{ backgroundColor: '#FFF3E0', color: '#E65100' }}
              >
                <Clock size={15} />
                Ends in: <span className="font-bold tabular-nums">{deal.expiresIn}</span>
              </div>

              {/* Stock bar */}
              <div className="mt-4">
                <StockBar stock={deal.stock} totalStock={deal.totalStock} />
              </div>

              {/* Description */}
              <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                {deal.description}
              </p>

              {/* CTA */}
              <a
                href={deal.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="mt-6 w-full py-4 rounded-xl font-bold text-white text-center text-base transition-all hover:opacity-90 hover:scale-[1.02] block"
                style={{ backgroundColor: '#E65100' }}
              >
                Grab This Deal — {deal.dealPrice}
              </a>
              <p className="mt-2 text-center text-xs text-gray-400">
                Affiliate link — price at retailer may vary. Opens in new tab.
              </p>

              {/* Trust badges */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { Icon: ShieldCheck, label: 'Secure\nCheckout' },
                  { Icon: Truck,       label: 'Free\nDelivery'  },
                  { Icon: RotateCcw,   label: 'Easy\nReturns'   },
                ].map(({ Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl bg-gray-50 border border-gray-100 text-center"
                  >
                    <Icon size={20} style={{ color: '#039BE5' }} />
                    <span className="text-xs text-gray-600 font-medium whitespace-pre-line leading-tight">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── More Deals ── */}
      {otherDeals.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">More Deals You May Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {otherDeals.map((d) => (
              <Link
                key={d.id}
                href={`/deals/${d.id}`}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:scale-[1.03] transition-all duration-300 group"
              >
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  <img
                    src={d.imageUrl}
                    alt={d.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-green-500 text-white text-xs font-bold">
                    {d.discount}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
                    {d.name}
                  </p>
                  <p className="mt-1 font-bold text-sm" style={{ color: '#039BE5' }}>
                    {d.dealPrice}
                  </p>
                  <p className="text-xs text-gray-400 line-through">{d.originalPrice}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Back ── */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <Link
          href="/deals"
          className="inline-flex items-center gap-2 text-sm font-semibold hover:opacity-80 transition-opacity"
          style={{ color: '#039BE5' }}
        >
          <ChevronLeft size={16} />
          Back to Deals
        </Link>
      </div>
    </main>
  )
}
