import Link from 'next/link'

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

interface RouteEntry {
  readonly route:       string
  readonly label:       string
  readonly description: string
  readonly group:       'Core' | 'POD' | 'Affiliate' | 'Content' | 'System'
  readonly exists:      boolean
}

type Group = RouteEntry['group']

// ---------------------------------------------------------------------------
// STATIC ROUTE REGISTRY
// ---------------------------------------------------------------------------

const ROUTES: readonly RouteEntry[] = [
  {
    route:       '/',
    label:       'Homepage',
    description: 'Hero, search, featured categories',
    group:       'Core',
    exists:      true,
  },
  {
    route:       '/products',
    label:       'Products',
    description: 'Full product catalogue with filters',
    group:       'Core',
    exists:      true,
  },
  {
    route:       '/deals',
    label:       'Deals',
    description: 'Daily curated deals and discount codes',
    group:       'Core',
    exists:      true,
  },
  {
    route:       '/compare',
    label:       'Compare Prices',
    description: 'Side-by-side price comparison across platforms',
    group:       'Core',
    exists:      true,
  },
  {
    route:       '/pod',
    label:       'POD Store',
    description: 'Print-on-demand exclusive CloudBasket designs',
    group:       'POD',
    exists:      true,
  },
  {
    route:       '/affiliate',
    label:       'Affiliate Program',
    description: 'Earn commissions — dashboard and signup',
    group:       'Affiliate',
    exists:      true,
  },
  {
    route:       '/cj',
    label:       'CJ Partner Hub',
    description: 'Commission Junction affiliate integration',
    group:       'Affiliate',
    exists:      true,
  },
  {
    route:       '/blog',
    label:       'Blog & Reviews',
    description: 'Shopping guides, reviews and smart tips',
    group:       'Content',
    exists:      true,
  },
  {
    route:       '/sitemap',
    label:       'Sitemap',
    description: 'Route registry — this page',
    group:       'System',
    exists:      true,
  },
] as const

const GROUPS: readonly Group[] = ['Core', 'POD', 'Affiliate', 'Content', 'System']

const GROUP_META: Record<Group, { label: string; color: string }> = {
  Core:      { label: 'Core',      color: '#039BE5' },
  POD:       { label: 'POD',       color: '#1B5E20' },
  Affiliate: { label: 'Affiliate', color: '#E65100' },
  Content:   { label: 'Content',   color: '#F5C518' },
  System:    { label: 'System',    color: '#36454F' },
}

// ---------------------------------------------------------------------------
// PAGE — server component, zero external calls
// ---------------------------------------------------------------------------

export default function SitemapPage() {
  const total   = ROUTES.length
  const live    = ROUTES.filter((r) => r.exists).length
  const missing = total - live

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>

      {/* ── HEADER ── */}
      <div className="w-full py-12 px-6" style={{ backgroundColor: '#039BE5' }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-[0.25em] text-white/60 mb-2">
            cloudbasket · system
          </p>
          <h1 className="text-4xl font-extrabold text-white mb-2">
            Route Sitemap
          </h1>
          <p className="text-white/80 text-sm max-w-lg">
            Static registry of all{' '}
            <code className="bg-white/20 rounded px-1.5 py-0.5 font-mono text-white">
              app/
            </code>{' '}
            pages. Click any card to visit. Green badge = exists · Orange badge = missing.
          </p>

          {/* Summary chips */}
          <div className="flex flex-wrap gap-3 mt-5">
            <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-white inline-block" />
              {total} routes
            </span>
            <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#1B5E20' }} />
              {live} live
            </span>
            {missing > 0 && (
              <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-full">
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#E65100' }} />
                {missing} missing
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── GROUPS ── */}
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        {GROUPS.map((group) => {
          const entries = ROUTES.filter((r) => r.group === group)
          if (entries.length === 0) return null
          const meta = GROUP_META[group]

          return (
            <section key={group}>
              {/* Group heading */}
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="w-1 h-5 rounded-full inline-block flex-shrink-0"
                  style={{ backgroundColor: meta.color }}
                />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  {meta.label}
                </span>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: meta.color + '18', color: meta.color }}
                >
                  {entries.length}
                </span>
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {entries.map((entry) =>
                  entry.exists ? (
                    <Link
                      key={entry.route}
                      href={entry.route}
                      className="block rounded-2xl p-5 border-2 transition-all group hover:shadow-md hover:border-[#039BE5]"
                      style={{
                        backgroundColor: '#ffffff',
                        borderColor:     '#e5e7eb',
                      }}
                    >
                      <CardInner entry={entry} />
                    </Link>
                  ) : (
                    <div
                      key={entry.route}
                      className="block rounded-2xl p-5 border-2 opacity-70 cursor-not-allowed"
                      style={{
                        backgroundColor: '#fff7f0',
                        borderColor:     '#E65100' + '40',
                      }}
                    >
                      <CardInner entry={entry} />
                    </div>
                  )
                )}
              </div>
            </section>
          )
        })}

        <p className="text-xs text-gray-400 text-center pt-2 pb-6">
          cloudbasket · static sitemap · no external calls · {total} routes registered
        </p>
      </div>
    </main>
  )
}

// ---------------------------------------------------------------------------
// CARD INNER — shared between Link and div variants
// ---------------------------------------------------------------------------

interface CardInnerProps {
  entry: RouteEntry
}

function CardInner({ entry }: CardInnerProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Top row: label + badge */}
      <div className="flex items-start justify-between gap-2">
        <span className="font-bold text-gray-900 text-base leading-tight">
          {entry.label}
        </span>
        {entry.exists ? (
          <span
            className="flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: '#1B5E20', color: '#ffffff' }}
          >
            Live
          </span>
        ) : (
          <span
            className="flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: '#E65100', color: '#ffffff' }}
          >
            Missing
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-gray-500 leading-snug">
        {entry.description}
      </p>

      {/* Route path */}
      <code
        className="text-xs font-mono px-2 py-1 rounded-lg self-start"
        style={{ backgroundColor: '#f1f5f9', color: '#039BE5' }}
      >
        {entry.route}
      </code>
    </div>
  )
}
