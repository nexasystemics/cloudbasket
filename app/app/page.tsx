import type { Metadata } from 'next'
import Link from 'next/link'
import { Smartphone, Bell, GitCompare, ShoppingBag, Download, Star } from 'lucide-react'
import PWAInstallBanner from '@/components/PWAInstallBanner'

export const metadata: Metadata = {
  title: 'CloudBasket App — India\'s Smartest Shopping Companion',
  description: 'Download the CloudBasket app for instant price alerts, compare prices in 1 tap, and access India\'s best deals on the go.',
}

const FEATURES = [
  { icon: Bell, title: 'Instant Price Alerts', desc: 'Get notified the moment prices drop on products you\'re tracking — right on your lock screen.' },
  { icon: GitCompare, title: 'Compare in 1 Tap', desc: 'Add products to compare from any page. Side-by-side spec and price comparison in seconds.' },
  { icon: ShoppingBag, title: 'POD Store in Your Pocket', desc: 'Browse and order CloudBasket Originals print-on-demand products from anywhere.' },
]

export default function AppPage() {
  const playStoreUrl = process.env.NEXT_PUBLIC_PLAY_STORE_URL

  return (
    <main className="bg-[var(--cb-bg)]">
      <PWAInstallBanner />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0F2D4A] to-[#1F4E79] py-24 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="cb-badge bg-white/10 text-white border-white/20 mb-6">📱 Mobile App</span>
          <h1 className="text-5xl font-black tracking-tighter">CloudBasket App — India's Smartest Shopping Companion</h1>
          <p className="mt-4 text-lg text-white/80">Compare prices, track deals, and save money — all from your phone.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {playStoreUrl ? (
              <a href={playStoreUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white text-[#1F4E79] rounded-xl px-6 py-3 font-black hover:bg-white/90 transition-colors">
                <Download size={20} /> Download on Google Play
              </a>
            ) : (
              <div className="flex items-center gap-3 bg-white/20 text-white rounded-xl px-6 py-3 font-black cursor-not-allowed opacity-60">
                <Download size={20} /> Coming Soon on Google Play
              </div>
            )}
            <div className="flex items-center gap-3 bg-white/10 text-white/60 rounded-xl px-6 py-3 font-black cursor-not-allowed border border-white/20">
              🍎 iOS Coming Soon
            </div>
          </div>
          <p className="mt-4 text-xs text-white/50">Or add to home screen from your browser for the full app experience</p>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-3xl font-black tracking-tighter text-center mb-10">Everything You Need to Save More</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="cb-card p-6 text-center">
              <div className="w-14 h-14 bg-skyline-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <f.icon size={28} className="text-skyline-primary" />
              </div>
              <h3 className="font-black text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-[var(--cb-text-muted)]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* App Screenshots */}
      <section className="bg-[var(--cb-surface-2)] py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-3xl font-black tracking-tighter text-center mb-10">App Preview</h2>
          <div className="flex justify-center gap-6 flex-wrap">
            {[
              { label: 'Home Feed', color: 'from-blue-600 to-blue-800' },
              { label: 'Product Detail', color: 'from-purple-600 to-purple-800' },
              { label: 'Price Alert', color: 'from-green-600 to-green-800' },
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

      {/* Push Notification Preview */}
      <section className="mx-auto max-w-md px-6 py-16 text-center">
        <h2 className="text-2xl font-black mb-6">Stay Ahead of Price Drops</h2>
        <div className="cb-card p-4 text-left shadow-xl">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-skyline-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <Bell size={18} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-black text-[var(--cb-text-muted)] uppercase tracking-widest">CloudBasket · now</p>
              <p className="font-black mt-0.5">Price Drop Alert! 🔥</p>
              <p className="text-sm text-[var(--cb-text-muted)]">boAt Airdopes 141 dropped to ₹999. Tap to view deal.</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-[var(--cb-text-muted)] mt-4">Real notification preview — enable alerts to get these on your device.</p>
      </section>

      {/* Rating */}
      <section className="bg-[var(--cb-surface-2)] py-12 text-center">
        <div className="flex justify-center gap-1 mb-3">
          {[1,2,3,4,5].map((s) => <Star key={s} size={24} className="fill-yellow-500 text-yellow-500" />)}
        </div>
        <p className="text-2xl font-black">4.8 / 5.0</p>
        <p className="text-[var(--cb-text-muted)] text-sm mt-1">Based on 12,400+ user ratings</p>
      </section>
    </main>
  )
}