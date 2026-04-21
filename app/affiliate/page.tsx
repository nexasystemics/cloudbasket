import type { Metadata } from 'next'
import Link from 'next/link'
import {
  DollarSign,
  Target,
  Package,
  CreditCard,
  TrendingUp,
  Users,
  Link2,
  BarChart3,
  Wallet,
  Palette,
  Smartphone,
  GraduationCap,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  LogIn,
  HelpCircle,
  Share2,
} from 'lucide-react'

const purpleTheme = '#039BE5'

export const metadata: Metadata = {
  title: 'CloudBasket Affiliate Program',
  description:
    'Join the CloudBasket affiliate program to earn commissions, track clicks and conversions, and grow revenue by sharing verified products and deals today.',
  openGraph: {
    title: 'CloudBasket Affiliate Program',
    description: 'Join the CloudBasket affiliate program to earn commissions, track clicks and conversions, and grow revenue by sharing verified products and deals today.',
    url: 'https://cloudbasket.co/affiliate',
    siteName: 'CloudBasket',
    images: [
      {
        url: 'https://cloudbasket.co/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'CloudBasket Affiliate Program',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CloudBasket Affiliate Program',
    description: 'Join the CloudBasket affiliate program to earn commissions, track clicks and conversions, and grow revenue by sharing verified products and deals today.',
    images: ['https://cloudbasket.co/og-image.svg'],
  },
}

const FAQS = [
  {
    question: 'How do I get paid?',
    answer:
      'We process payments weekly via bank transfer, UPI, or PayPal. You need to reach the minimum payout threshold of ₹500 before your first payment. All payments are processed automatically every Monday.',
  },
  {
    question: 'When do I receive commission?',
    answer:
      'Commissions are credited to your account immediately after a successful sale. However, there is a 7-day return window before the commission is finalized. Once finalized, commissions are included in the next weekly payout cycle.',
  },
  {
    question: 'Can I promote on social media?',
    answer:
      'Yes! You can promote CloudBasket products on any platform including Instagram, Facebook, Twitter, YouTube, TikTok, and your blog. Just make sure to disclose that you are using affiliate links as per FTC and ASCI guidelines.',
  },
  {
    question: 'What products can I promote?',
    answer:
      'You can promote any of the 10,000+ products available on CloudBasket. This includes electronics, fashion, home & kitchen, books, and more from Amazon, Flipkart, and other partner retailers.',
  },
  {
    question: 'How do I track my earnings?',
    answer:
      "Once you sign up, you'll get access to your affiliate dashboard where you can track clicks, conversions, earnings, and top-performing products in real-time. You can also download detailed reports and analytics.",
  },
] as const

export default function AffiliatePage() {
  // Mock earnings data for chart (last 7 days)
  const earningsData = [
    { day: 'Mon', amount: 1200 },
    { day: 'Tue', amount: 1800 },
    { day: 'Wed', amount: 1500 },
    { day: 'Thu', amount: 2200 },
    { day: 'Fri', amount: 2800 },
    { day: 'Sat', amount: 1900 },
    { day: 'Sun', amount: 850 },
  ]

  const maxEarnings = Math.max(...earningsData.map((d) => d.amount))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#039BE5] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Affiliate Program</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section
        className="py-20 px-4 text-white relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${purpleTheme} 0%, #0288D1 50%, #0277BD 100%)`,
        }}
      >
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            CloudBasket Affiliate Program
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Earn up to 8% commission on every sale you refer
          </p>
          <button
            className="px-8 py-4 rounded-lg bg-white text-lg font-semibold transition hover:opacity-90 shadow-lg"
            style={{ color: purpleTheme }}
          >
            Join Now
          </button>
        </div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="max-w-7xl mx-auto px-4 py-12 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: DollarSign,
              value: 'Up to 8%',
              label: 'Commission Rate',
            },
            {
              icon: Target,
              value: '30 Days',
              label: 'Cookie Duration',
            },
            {
              icon: Package,
              value: '10,000+',
              label: 'Products Available',
            },
            {
              icon: CreditCard,
              value: '₹500',
              label: 'Minimum Payout',
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: `${purpleTheme}15` }}
                >
                  <stat.icon className="w-6 h-6" style={{ color: purpleTheme }} />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1" style={{ color: purpleTheme }}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          How It Works
        </h2>
        <div className="relative">
          {/* Timeline connector */}
          <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-[#B3E5FC] via-[#039BE5] to-[#B3E5FC]"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              {
                step: 1,
                title: 'Sign up & get your unique link',
                description:
                  'Create your affiliate account in minutes and receive your personalized tracking link.',
                icon: Users,
              },
              {
                step: 2,
                title: 'Share products with your audience',
                description:
                  'Promote CloudBasket products through your blog, social media, or website.',
                icon: Share2,
              },
              {
                step: 3,
                title: 'Earn commission on every sale',
                description:
                  'Get paid automatically when customers purchase through your affiliate links.',
                icon: DollarSign,
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center hover:shadow-md transition-shadow">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold"
                    style={{ backgroundColor: purpleTheme }}
                  >
                    {item.step}
                  </div>
                  <div className="flex justify-center mb-4">
                    <div
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: `${purpleTheme}15` }}
                    >
                      <item.icon className="w-8 h-8" style={{ color: purpleTheme }} />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          Your Affiliate Dashboard
        </h2>
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
          {/* Dashboard Header */}
          <div
            className="px-6 py-4 text-white"
            style={{ backgroundColor: purpleTheme }}
          >
            <h3 className="text-xl font-semibold">Earnings Overview</h3>
            <p className="text-sm text-white/80">Last 7 days performance</p>
          </div>

          {/* Chart */}
          <div className="p-6 border-b border-gray-200">
            <div className="h-64 flex items-end justify-between gap-2">
              {earningsData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center justify-end h-full">
                    <div
                      className="w-full rounded-t-lg transition-all hover:opacity-80"
                      style={{
                        height: `${(data.amount / maxEarnings) * 100}%`,
                        backgroundColor: purpleTheme,
                        minHeight: '8px',
                      }}
                      title={`₹${data.amount.toLocaleString()}`}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">{data.day}</span>
                  <span className="text-xs text-gray-500">₹{(data.amount / 1000).toFixed(1)}k</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border-b border-gray-200">
            {[
              { label: 'Clicks', value: '1,234', icon: TrendingUp },
              { label: 'Conversions', value: '45', icon: Target },
              { label: 'Earnings', value: '₹12,450', icon: DollarSign },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${purpleTheme}15` }}
                  >
                    <stat.icon className="w-5 h-5" style={{ color: purpleTheme }} />
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1" style={{ color: purpleTheme }}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Top Products & Recent Commissions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Top Products */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" style={{ color: purpleTheme }} />
                Top Performing Products
              </h4>
              <div className="space-y-2">
                {[
                  { name: 'iPhone 15 Pro', sales: 12, commission: '₹4,200' },
                  { name: 'Samsung Galaxy S24', sales: 8, commission: '₹2,800' },
                  { name: 'MacBook Air M3', sales: 5, commission: '₹3,500' },
                ].map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
                  >
                    <div>
                      <div className="font-medium text-sm text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-500">{product.sales} sales</div>
                    </div>
                    <div className="font-semibold" style={{ color: purpleTheme }}>
                      {product.commission}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Commissions */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Wallet className="w-5 h-5" style={{ color: purpleTheme }} />
                Recent Commissions
              </h4>
              <div className="space-y-2">
                {[
                  { date: 'Feb 16', product: 'AirPods Pro', amount: '₹850' },
                  { date: 'Feb 15', product: 'iPad Air', amount: '₹1,200' },
                  { date: 'Feb 14', product: 'Sony Headphones', amount: '₹650' },
                ].map((commission, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
                  >
                    <div>
                      <div className="font-medium text-sm text-gray-900">{commission.product}</div>
                      <div className="text-xs text-gray-500">{commission.date}</div>
                    </div>
                    <div className="font-semibold" style={{ color: purpleTheme }}>
                      {commission.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-white">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          Affiliate Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Link2,
              title: 'Custom affiliate links',
              description: 'Generate unique tracking links for any product or category.',
            },
            {
              icon: BarChart3,
              title: 'Real-time tracking',
              description: 'Monitor clicks, conversions, and earnings in real-time.',
            },
            {
              icon: Wallet,
              title: 'Weekly payouts',
              description: 'Get paid every week directly to your bank account.',
            },
            {
              icon: Palette,
              title: 'Marketing materials',
              description: 'Access banners, product images, and promotional content.',
            },
            {
              icon: Smartphone,
              title: 'Mobile app access',
              description: 'Manage your affiliate account on the go with our mobile app.',
            },
            {
              icon: GraduationCap,
              title: 'Training resources',
              description: 'Learn best practices with our comprehensive affiliate guides.',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: `${purpleTheme}15` }}
                >
                  <feature.icon className="w-6 h-6" style={{ color: purpleTheme }} />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Affiliate Tiers */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          Commission Tiers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              tier: 'Bronze',
              sales: '0-10',
              commission: '5%',
              color: '#CD7F32',
              description: 'Perfect for getting started',
            },
            {
              tier: 'Silver',
              sales: '11-50',
              commission: '6%',
              color: '#C0C0C0',
              description: 'Growing your affiliate business',
            },
            {
              tier: 'Gold',
              sales: '51-100',
              commission: '7%',
              color: '#FFD700',
              description: 'Established affiliate partner',
            },
            {
              tier: 'Platinum',
              sales: '100+',
              commission: '8%',
              color: '#E5E4E2',
              description: 'Top-tier affiliate status',
            },
          ].map((tier, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border-2 p-6 text-center hover:shadow-lg transition-shadow relative overflow-hidden"
              style={{
                borderColor: tier.color,
              }}
            >
              {index === 3 && (
                <div
                  className="absolute top-0 right-0 px-3 py-1 text-xs font-semibold text-white"
                  style={{ backgroundColor: purpleTheme }}
                >
                  BEST VALUE
                </div>
              )}
              <div className="mb-4">
                <div
                  className="text-4xl font-bold mb-2"
                  style={{ color: tier.color }}
                >
                  {tier.tier}
                </div>
                <div className="text-3xl font-bold mb-1" style={{ color: purpleTheme }}>
                  {tier.commission}
                </div>
                <div className="text-sm text-gray-600">{tier.sales} sales/month</div>
              </div>
              <div className="h-px bg-gray-200 my-4"></div>
              <p className="text-sm text-gray-600">{tier.description}</p>
              {index === 0 && (
                <div className="mt-4 text-xs text-gray-500">Starting tier</div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Tiers are calculated monthly. Your commission rate applies to all sales made during
            that month.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {FAQS.map((faq) => (
            <details
              key={faq.question}
              className="group overflow-hidden rounded-lg border border-gray-200 bg-white"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors">
                <span className="flex items-center gap-2 font-semibold text-gray-900">
                  <HelpCircle className="w-5 h-5" style={{ color: purpleTheme }} />
                  {faq.question}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-t border-gray-200 px-6 py-4 text-gray-600">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section
        className="py-16 px-4 text-white"
        style={{
          background: `linear-gradient(135deg, ${purpleTheme} 0%, #0277BD 100%)`,
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Earning?</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of affiliates already earning with CloudBasket. Sign up today and
            start promoting products you love.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-8 py-4 rounded-lg bg-white text-lg font-semibold transition hover:opacity-90 shadow-lg flex items-center justify-center gap-2"
              style={{ color: purpleTheme }}
            >
              Start Earning Today
              <ArrowRight className="w-5 h-5" />
            </button>
            <Link
              href="#"
              className="px-8 py-4 rounded-lg border-2 border-white text-lg font-semibold text-white transition hover:bg-white hover:bg-opacity-10 flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Login to Dashboard
            </Link>
          </div>
          <div className="mt-8 pt-8 border-t border-white/20">
            <p className="text-sm text-white/80 mb-2">Need help? Contact our support team</p>
            <Link
              href="/contact"
              className="text-white font-medium hover:underline inline-flex items-center gap-1"
            >
              Contact Support
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
