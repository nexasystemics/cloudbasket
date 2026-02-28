'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Link2,
  Globe,
  TrendingUp,
  Settings,
  ExternalLink,
  ChevronRight,
  Check,
  Info,
  DollarSign,
  Clock,
  BarChart3,
  HelpCircle,
  BookOpen,
  Mail,
  Shield,
  Zap,
  Toolbox,
} from 'lucide-react'

const themeColor = '#039BE5'

const BRANDS = [
  { name: 'Amazon',        logo: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=48&h=48&fit=crop' },
  { name: 'Flipkart',      logo: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=48&h=48&fit=crop' },
  { name: 'Myntra',        logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=48&h=48&fit=crop' },
  { name: 'Ajio',          logo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=48&h=48&fit=crop' },
  { name: 'Nykaa',         logo: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=48&h=48&fit=crop' },
  { name: 'Shoppers Stop', logo: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=48&h=48&fit=crop' },
  { name: 'HP',            logo: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=48&h=48&fit=crop' },
  { name: 'Dell',          logo: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=48&h=48&fit=crop' },
  { name: 'Lenovo',        logo: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=48&h=48&fit=crop' },
  { name: 'Samsung',       logo: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=48&h=48&fit=crop' },
  { name: 'LG',            logo: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=48&h=48&fit=crop' },
  { name: 'Sony',          logo: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=48&h=48&fit=crop' },
]

const COMMISSION_RATES = [
  { category: 'Electronics', commission: '2-5%', cookieDuration: '30 days' },
  { category: 'Fashion', commission: '5-10%', cookieDuration: '7 days' },
  { category: 'Beauty', commission: '8-15%', cookieDuration: '30 days' },
  { category: 'Home & Kitchen', commission: '3-7%', cookieDuration: '14 days' },
]

const INTEGRATION_STEPS = [
  {
    number: 1,
    title: 'Sign up for CJ account',
    description: 'Create your account at cj.com',
    link: 'https://www.cj.com',
  },
  {
    number: 2,
    title: 'Get approved by merchants',
    description: 'Apply and get approved by your preferred merchants',
  },
  {
    number: 3,
    title: 'Connect your CJ Publisher ID',
    description: 'Enter your Publisher ID in CloudBasket settings',
  },
  {
    number: 4,
    title: 'Generate affiliate links',
    description: 'Create and manage your affiliate links',
  },
  {
    number: 5,
    title: 'Start earning commissions',
    description: 'Track earnings and optimize your campaigns',
  },
]

const FAQS = [
  {
    question: 'Do I need a separate CJ account?',
    answer:
      'Yes, you need to create a separate account on Commission Junction (cj.com). Once approved, you can connect it to CloudBasket using your Publisher ID.',
  },
  {
    question: 'How long does approval take?',
    answer:
      'Merchant approval times vary, typically ranging from 24 hours to 7 business days. Some merchants may require additional verification.',
  },
  {
    question: 'Can I use both CJ and direct affiliate links?',
    answer:
      'Yes, CloudBasket supports multiple affiliate networks. You can use CJ links alongside direct merchant affiliate programs for maximum flexibility.',
  },
  {
    question: 'How are CJ commissions paid?',
    answer:
      'CJ pays commissions monthly via direct deposit or check, typically 30-60 days after the end of the month in which the sale occurred. Minimum payment threshold applies.',
  },
]

export default function CJPage() {
  const [publisherId, setPublisherId] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'not-connected' | 'pending' | 'connected'>(
    'not-connected'
  )

  const handleConnect = () => {
    if (publisherId && apiKey) {
      setConnectionStatus('pending')
      // Simulate connection process
      setTimeout(() => {
        setIsConnected(true)
        setConnectionStatus('connected')
      }, 2000)
    }
  }

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
            <Link href="/affiliate" className="hover:text-[#039BE5] transition-colors">
              Affiliate
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">CJ Integration</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section
        className="py-16 px-4 text-white"
        style={{ backgroundColor: themeColor }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl">
              <Link2 className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            CJ Affiliate Network Integration
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Access premium brands and exclusive offers through CJ
          </p>
          <button
            onClick={() => {
              document.getElementById('setup-instructions')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-white text-[#039BE5] font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            <Link2 className="w-5 h-5" />
            Connect CJ Account
          </button>
        </div>
      </section>

      {/* What is CJ? Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What is CJ?</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Commission Junction is one of the world&apos;s largest affiliate networks, connecting
            publishers with premium brands and reliable tracking systems for global reach.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: `${themeColor}15` }}>
              <Shield className="w-6 h-6" style={{ color: themeColor }} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Trusted Network</h3>
            <p className="text-gray-600">
              Join one of the most established affiliate networks with over 20 years of experience
              and thousands of trusted merchants.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: `${themeColor}15` }}>
              <DollarSign className="w-6 h-6" style={{ color: themeColor }} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">High Commissions</h3>
            <p className="text-gray-600">
              Earn competitive commission rates across multiple categories, with some merchants
              offering up to 15% commission.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: `${themeColor}15` }}>
              <Toolbox className="w-6 h-6" style={{ color: themeColor }} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Advanced Toolboxes</h3>
            <p className="text-gray-600">
              Access powerful reporting Toolboxes, link generators, and performance analytics to optimize
              your affiliate campaigns.
            </p>
          </div>
        </div>
      </section>

      {/* Available Brands */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Available Brands</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {BRANDS.map((brand) => (
              <div
                key={brand.name}
                className="group bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-[#039BE5] hover:shadow-md transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <p className="text-sm font-medium text-gray-700 text-center">{brand.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Steps */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Integration Steps</h2>
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-8 top-12 bottom-12 w-0.5 bg-[#039BE5] hidden md:block" />

          <div className="space-y-8">
            {INTEGRATION_STEPS.map((step, index) => (
              <div key={step.number} className="relative flex items-start gap-6">
                {/* Step Number Circle */}
                <div
                  className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10"
                  style={{ backgroundColor: themeColor }}
                >
                  {step.number}
                </div>

                {/* Step Content */}
                <div className="flex-1 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600 mb-3">{step.description}</p>
                      {step.link && (
                        <a
                          href={step.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                          style={{ color: themeColor }}
                        >
                          Visit cj.com
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <Check className="w-6 h-6 flex-shrink-0" style={{ color: themeColor }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Rates Table */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Commission Rates</h2>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Average Commission
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Cookie Duration
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {COMMISSION_RATES.map((rate) => (
                  <tr key={rate.category} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {rate.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{rate.commission}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{rate.cookieDuration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Setup Instructions */}
      <section id="setup-instructions" className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Setup Instructions</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Enter your CJ Publisher ID
              </label>
              <input
                type="text"
                value={publisherId}
                onChange={(e) => setPublisherId(e.target.value)}
                placeholder="e.g., 12345678"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#039BE5] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your CJ API key"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#039BE5] focus:border-transparent"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                {connectionStatus === 'connected' && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                    <Check className="w-4 h-4" />
                    Connected ✓
                  </span>
                )}
                {connectionStatus === 'pending' && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
                    <Clock className="w-4 h-4" />
                    Pending
                  </span>
                )}
                {connectionStatus === 'not-connected' && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                    Not Connected
                  </span>
                )}
              </div>

              <button
                onClick={handleConnect}
                disabled={!publisherId || !apiKey || connectionStatus === 'pending'}
                className="px-6 py-3 rounded-lg font-semibold text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: themeColor }}
              >
                {connectionStatus === 'pending' ? 'Connecting...' : 'Connect Account'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${themeColor}15` }}>
                  <DollarSign className="w-6 h-6" style={{ color: themeColor }} />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-sm text-gray-600 mb-1">CJ Earnings (Last 30 days)</p>
              <p className="text-2xl font-bold text-gray-900">₹24,500</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${themeColor}15` }}>
                  <Link2 className="w-6 h-6" style={{ color: themeColor }} />
                </div>
                <Zap className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Active CJ Links</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${themeColor}15` }}>
                  <Globe className="w-6 h-6" style={{ color: themeColor }} />
                </div>
                <BarChart3 className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Top CJ Merchant</p>
              <p className="text-lg font-bold text-gray-900">Amazon</p>
              <p className="text-sm text-gray-600">₹8,900</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${themeColor}15` }}>
                  <BarChart3 className="w-6 h-6" style={{ color: themeColor }} />
                </div>
                <TrendingUp className="w-5 h-5 text-[#039BE5]" />
              </div>
              <p className="text-sm text-gray-600 mb-1">CJ Click-through rate</p>
              <p className="text-2xl font-bold text-gray-900">3.2%</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <HelpCircle className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: themeColor }} />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Resources */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a
              href="https://www.cj.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gray-50 rounded-xl border border-gray-200 p-6 hover:border-[#039BE5] hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${themeColor}15` }}>
                <ExternalLink className="w-6 h-6" style={{ color: themeColor }} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">CJ Signup</h3>
              <p className="text-sm text-gray-600">Create your Commission Junction account</p>
            </a>

            <a
              href="#"
              className="group bg-gray-50 rounded-xl border border-gray-200 p-6 hover:border-[#039BE5] hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${themeColor}15` }}>
                <BookOpen className="w-6 h-6" style={{ color: themeColor }} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">CJ University</h3>
              <p className="text-sm text-gray-600">Training and educational resources</p>
            </a>

            <a
              href="#"
              className="group bg-gray-50 rounded-xl border border-gray-200 p-6 hover:border-[#039BE5] hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${themeColor}15` }}>
                <Settings className="w-6 h-6" style={{ color: themeColor }} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Integration Docs</h3>
              <p className="text-sm text-gray-600">Technical documentation and guides</p>
            </a>

            <a
              href="#"
              className="group bg-gray-50 rounded-xl border border-gray-200 p-6 hover:border-[#039BE5] hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${themeColor}15` }}>
                <Mail className="w-6 h-6" style={{ color: themeColor }} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Support Contact</h3>
              <p className="text-sm text-gray-600">Get help from our support team</p>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
