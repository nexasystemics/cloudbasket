import Link from 'next/link'
import { getTheme } from '@/lib/themes'
import { headers } from 'next/headers'
import { DEALS } from '@/lib/deals-data'
import type { TenantTheme } from '@/lib/themes'

const FILTER_OPTIONS = [
  'All Deals',
  'Lightning Deals',
  'Today Only',
  'Electronics',
  'Fashion',
  'Kitchen',
  'Sports',
] as const

export default async function DealsPage() {
  const headersList = await headers()
  const tenant = headersList.get('x-tenant') || 'cloudbasket'
  const theme = getTheme(tenant)

  return (
    <>
      {/* SECTION 1 — HERO BANNER */}
      <section
        className="py-12 px-4 text-center text-white"
        style={{ backgroundColor: theme.primaryColor }}
      >
        <span
          className="mb-4 inline-block rounded-full bg-white px-3 py-1 text-xs font-medium"
          style={{ color: theme.primaryColor }}
        >
          Limited Time Offers
        </span>
        <h1 className="text-3xl font-bold md:text-4xl mt-2">Today&apos;s Best Deals</h1>
        <p className="mt-2 text-white/90 text-sm md:text-base max-w-xl mx-auto">
          Handpicked offers from Amazon and Flipkart. Updated daily.
        </p>
        <div className="flex flex-row flex-wrap justify-center gap-4 mt-6">
          <span className="rounded-full bg-white/10 px-4 py-2 text-sm">8 Active Deals</span>
          <span className="rounded-full bg-white/10 px-4 py-2 text-sm">Up to 67% OFF</span>
        </div>
      </section>

      {/* SECTION 2 — DEAL TYPE FILTER */}
      <section className="sticky top-0 z-10 border-b bg-white overflow-x-auto">
        <div className="flex gap-2 px-4 py-3 min-w-0 shrink-0">
          {FILTER_OPTIONS.map((option) => {
            const isActive = option === 'All Deals'
            return (
              <button
                key={option}
                type="button"
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'text-white hover:opacity-90'
                    : 'border border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                }`}
                style={isActive ? { backgroundColor: theme.primaryColor } : undefined}
              >
                {option}
              </button>
            )
          })}
        </div>
      </section>

      {/* SECTION 3 — COUNTDOWN BANNER */}
      <section
        className="py-3 px-4 text-center text-white"
        style={{ backgroundColor: theme.secondaryColor }}
      >
        <span className="mr-2 font-medium">Flash Sale ends in:</span>
        <span className="inline-flex items-center gap-1 font-mono">
          <span className="rounded bg-white px-2 py-1 text-sm font-bold" style={{ color: theme.secondaryColor }}>02</span>
          <span className="text-white">:</span>
          <span className="rounded bg-white px-2 py-1 text-sm font-bold" style={{ color: theme.secondaryColor }}>45</span>
          <span className="text-white">:</span>
          <span className="rounded bg-white px-2 py-1 text-sm font-bold" style={{ color: theme.secondaryColor }}>30</span>
        </span>
      </section>

      {/* SECTION 4 — DEALS GRID */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEALS.map((deal) => (
            <article
              key={deal.id}
              className="relative rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {/* TOP IMAGE AREA */}
              <div className="relative aspect-square rounded-t-xl bg-gray-50 overflow-hidden">
                <span
                  className={`absolute top-2 left-2 z-10 rounded-full px-2 py-1 text-xs font-medium text-white ${
                    deal.platform === 'Amazon' ? 'bg-orange-500' : 'bg-blue-600'
                  }`}
                >
                  {deal.platform}
                </span>
                <span className="absolute top-2 right-2 z-10 rounded-full bg-green-500 px-2 py-1 text-xs font-medium text-white">
                  {deal.discount}
                </span>
                <img
                  src={deal.imageUrl}
                  alt={deal.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <span className="absolute bottom-2 left-2 z-10 rounded-full border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600">
                  {deal.dealType}
                </span>
              </div>

              {/* CARD BODY */}
              <div className="p-4">
                <h2 className="line-clamp-2 text-sm font-semibold text-gray-800">{deal.name}</h2>
                <p className="mt-1 text-xs">
                  <span className="text-amber-500 font-medium">{deal.rating} / 5</span>
                  <span className="ml-1 text-gray-400">({deal.reviews} reviews)</span>
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-sm text-gray-400 line-through">{deal.originalPrice}</span>
                  <span className="text-xl font-bold" style={{ color: theme.primaryColor }}>
                    {deal.dealPrice}
                  </span>
                </div>
                <p className="mt-1 text-xs text-orange-500">Ends in {deal.expiresIn}</p>

                {/* STOCK PROGRESS BAR */}
                <div className="mt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Stock Left</span>
                    <span className={deal.stock < 15 ? 'font-medium text-red-500' : 'text-gray-500'}>
                      {deal.stock} remaining
                    </span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        deal.stock < 15 ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{
                        width: `${Math.round((deal.stock / deal.totalStock) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* CTA BUTTON */}
                <Link
                  href={`/deals/${deal.id}`}
                  className="mt-3 block w-full rounded-lg py-2.5 text-center text-sm font-semibold text-white transition hover:opacity-90"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  Grab This Deal
                </Link>
                <p className="mt-1 text-center text-xs text-gray-400">
                  Affiliate link — commission earned
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SECTION 5 — DEAL ALERT SIGNUP */}
      <section
        className="py-12 px-4 text-center text-white"
        style={{ backgroundColor: theme.secondaryColor }}
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold">Never Miss a Deal</h2>
          <p className="mt-2 text-white/90 text-sm">
            Get notified when prices drop on your wishlist products
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-lg bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-500"
              aria-label="Email for deal alerts"
            />
            <button
              type="button"
              className="shrink-0 rounded-lg bg-white px-6 py-3 text-sm font-semibold transition hover:opacity-90"
              style={{ color: theme.primaryColor }}
            >
              Alert Me
            </button>
          </div>
          <p className="mt-3 text-xs text-white/70 max-w-md mx-auto">
            By subscribing you agree to our Privacy Policy. DPDP Act 2023 compliant. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* SECTION 6 — DISCLAIMER FOOTER */}
      <section className="border-t bg-gray-50 py-6 px-4">
        <div className="max-w-4xl mx-auto text-center text-xs text-gray-400 leading-relaxed">
          All deals shown are affiliate links. CloudBasket earns a commission when you purchase through our links at no extra cost to you. Prices and availability are subject to change without notice. Deal expiry times shown are approximate. Always verify final price on the retailer&apos;s website before purchasing. ASCI and FTC compliant affiliate disclosures.
        </div>
      </section>
    </>
  )
}
