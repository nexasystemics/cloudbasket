import Link from 'next/link'
import { headers } from 'next/headers'
import { getTheme } from '@/lib/themes'

const STATS = [
  { label: 'Total Clicks',       value: '1,248',  sub: 'last 30 days' },
  { label: 'Conversions',        value: '34',      sub: 'last 30 days' },
  { label: 'Estimated Earnings', value: '₹4,820',  sub: 'pending payout' },
  { label: 'Active Links',       value: '12',      sub: 'across all platforms' },
] as const

const RECENT_ACTIVITY = [
  { date: 'Feb 27', product: 'Samsung Galaxy M35 5G',    commission: '₹380',  status: 'confirmed' },
  { date: 'Feb 25', product: 'Atomic Habits — James Clear', commission: '₹39',  status: 'confirmed' },
  { date: 'Feb 24', product: 'boAt Airdopes 141 TWS',    commission: '₹100',  status: 'pending'   },
  { date: 'Feb 23', product: 'Pigeon Air Fryer 4.2L',    commission: '₹330',  status: 'confirmed' },
  { date: 'Feb 21', product: 'Boldfit Yoga Mat 6mm',     commission: '₹70',   status: 'pending'   },
] as const

const NAV_LINKS = [
  { href: '/dashboard',          label: 'Overview'      },
  { href: '/dashboard/links',    label: 'My Links'      },
  { href: '/dashboard/payouts',  label: 'Payouts'       },
  { href: '/dashboard/settings', label: 'Settings'      },
] as const

export default async function DashboardPage() {
  const headersList = await headers()
  const tenant = headersList.get('x-tenant') ?? 'cloudbasket'
  const theme  = getTheme(tenant)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-extrabold tracking-tight" style={{ color: theme.primaryColor }}>
            Cloud<span style={{ color: theme.ctaColor ?? '#E65100' }}>Basket</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/login"
            className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition hover:opacity-90"
            style={{ backgroundColor: theme.primaryColor }}
          >
            Sign Out
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Your Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Track your affiliate performance and earnings.</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
            >
              <p className="text-xs text-gray-500 uppercase tracking-wide">{s.label}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="mt-0.5 text-xs text-gray-400">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Activity</h2>
            <Link
              href="/dashboard/links"
              className="text-xs font-medium hover:underline"
              style={{ color: theme.primaryColor }}
            >
              View all links
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {RECENT_ACTIVITY.map((row) => (
              <div key={`${row.date}-${row.product}`} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{row.product}</p>
                  <p className="text-xs text-gray-400">{row.date}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-bold text-gray-900">{row.commission}</span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      row.status === 'confirmed'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {row.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/products"
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <span className="text-sm font-semibold text-gray-800">Browse Products</span>
            <span className="text-xs text-gray-500">Generate affiliate links</span>
          </Link>
          <Link
            href="/deals"
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <span className="text-sm font-semibold text-gray-800">Today&apos;s Deals</span>
            <span className="text-xs text-gray-500">High-converting flash deals</span>
          </Link>
          <Link
            href="/affiliate"
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <span className="text-sm font-semibold text-gray-800">Affiliate Program</span>
            <span className="text-xs text-gray-500">Commission rates &amp; resources</span>
          </Link>
        </div>
      </main>
    </div>
  )
}
