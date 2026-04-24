import type { Metadata } from 'next'
import { Smartphone, Bell, GitCompare, ShoppingBag, Download } from 'lucide-react'
import PWAInstallBanner from '@/components/PWAInstallBanner'
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, DEFAULT_LOCALE, SITE_TAGLINE } from '@/lib/constants'

const APP_TITLE = `CloudBasket App — ${SITE_NAME}`

export const metadata: Metadata = {
  title: APP_TITLE,
  description: SITE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/app` },
  openGraph: {
    title: APP_TITLE,
    description: SITE_DESCRIPTION,
    url: `${SITE_URL}/app`,
    siteName: SITE_NAME,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
    locale: DEFAULT_LOCALE,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_TITLE,
    images: [`${SITE_URL}/og-image.png`],
  },
}

const FEATURES = [
  { icon: Bell,       title: 'Instant Price Alerts',      desc: 'Get notified the moment prices drop on products you\'re tracking — right on your lock screen.' },
  { icon: GitCompare, title: 'Compare in 1 Tap',           desc: 'Add products to compare from any page. Side-by-side spec and price comparison in seconds.' },
  { icon: ShoppingBag,title: 'POD Store in Your Pocket',   desc: 'Browse and order CloudBasket Originals print-on-demand products from anywhere.' },
]

export default function AppPage() {
  // IBF: ensure NEXT_PUBLIC_PLAY_STORE_URL is set in Vercel before go-live
  const playStoreUrl = process.env.NEXT_PUBLIC_PLAY_STORE_URL

  return (
    <main className="bg-[var(--cb-bg)]">
      <PWAInstallBanner />

      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-950 to-sky-900 py-24 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="cb-badge bg-white/10 text-white border-white/20 mb-6 inline-flex items-center gap-1.5">
            <Smartphone size={14} aria-hidden="true" /> Mobile App
          </span>
          <h1 className="text-5xl font-black tracking-tighter">CloudBasket App — India&apos;s Smartest Shopping Companion</h1>
          <p className="text-[#F5C518] font-medium mt-2">{SITE_TAGLINE}</p>
          <p className="mt-4 text-lg text-white/80">Compare prices, track deals, and save money — all from your phone.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {playStoreUrl ? (
              <a
                href={playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white text-[#1F4E79] rounded-xl px-6 py-3 font-black hover:bg-white/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Download size={20} aria-hidden="true" /> Download on Google Play
              </a>
            ) : (
              <div className="flex items-center gap-3 bg-white/20 text-white rounded-xl px-6 py-3 font-black cursor-not-allowed opacity-60">
                <Download size={20} aria-hidden="true" /> Coming Soon on Google Play
              </div>
            )}
            {/* IBF: confirm iOS launch date */}
            <div className="flex items-center gap-3 bg-white/10 text-white/60 rounded-xl px-6 py-3 font-black cursor-not-allowed border border-white/20">
              iOS — Coming Q3 2026
            </div>
          </div>
          <p className="mt-4 text-xs text-white/70">Or add to home screen from your browser for the full app experience</p>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-3xl font-black tracking-tighter text-center mb-10">Everything You Need to Save More</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="cb-card p-6 text-center">
              <div className="w-14 h-14 bg-skyline-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <f.icon size={28} className="text-skyline-primary" aria-hidden="true" />
              </div>
              <h3 className="font-black text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-[var(--cb-text-muted)]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* IBF: replace with real app screenshots (1080×1920 PNG) stored in /public/app-screenshots/ before launch */}
      {false && (
        <section className="bg-[var(--cb-surface-2)] py-16">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-3xl font-black tracking-tighter text-center mb-10">App Preview</h2>
            <div className="flex justify-center gap-6 flex-wrap">
              {[
                { label: 'Home Feed',      color: 'from-blue-600 to-blue-800'   },
                { label: 'Product Detail', color: 'from-purple-600 to-purple-800' },
                { label: 'Price Alert',    color: 'from-green-600 to-green-800'  },
              ].map((screen) => (
                <div key={screen.label} className="flex flex-col items-center gap-3">
                  <div className={`w-48 h-96 bg-gradient-to-br ${screen.color} rounded-[2rem] border-4 border-white shadow-2xl flex items-center justify-center`}>
                    <span className="text-white font-black text-lg">{screen.label}</span>
                  </div>
                  <p className="text-sm font-bold text-[var(--cb-text-muted)]">{screen.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* IBF: add QR code pointing to cloudbasket.co/app for desktop users */}
      {false && (
        <section>QR code section</section>
      )}

      {/* Push Notification Preview */}
      <section className="mx-auto max-w-md px-6 py-16 text-center">
        <h2 className="text-2xl font-black mb-6">Stay Ahead of Price Drops</h2>
        <div className="cb-card p-4 text-left shadow-xl">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-skyline-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <Bell size={18} className="text-white" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-black text-[var(--cb-text-muted)] uppercase tracking-widest">CloudBasket · now</p>
              <p className="font-black mt-0.5">Price Drop Alert!</p>
              <p className="text-sm text-[var(--cb-text-muted)]">boAt Airdopes 141 dropped to ₹999. Tap to view deal.</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-[var(--cb-text-muted)] mt-4">Real notification preview — enable alerts to get these on your device.</p>
      </section>

      {/* Launch message — fake rating removed */}
      <section className="bg-[var(--cb-surface-2)] py-12 text-center">
        <p className="text-sm text-[var(--cb-text-muted)]">
          Be among the first to rate us at launch
        </p>
      </section>
    </main>
  )
}
