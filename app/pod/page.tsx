import Link from 'next/link'
import { ChevronRight, ExternalLink, ShoppingBag, Truck, Globe, Heart } from 'lucide-react'

export default function PODPage() {
  // Sample designs with realistic data
  const designs = [
    {
      id: 1,
      title: 'Midnight Mountain',
      category: 'Nature • Minimal',
      description: 'Peaceful mountain landscape with starry night sky',
      platforms: ['Redbubble', 'Teepublic'],
      products: ['T-Shirt', 'Hoodie', 'Mug'],
      priceFrom: 1299,
      badge: 'Bestseller',
      badgeColor: 'bg-yellow-500',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=400&fit=crop',
    },
    {
      id: 2,
      title: 'Circuit Dreams',
      category: 'Tech • Retro',
      description: 'Vintage tech circuit board aesthetic design',
      platforms: ['Teepublic', 'Teespring'],
      products: ['T-Shirt', 'Phone Case', 'Sticker'],
      priceFrom: 999,
      badge: 'New',
      badgeColor: 'bg-green-500',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
    },
    {
      id: 3,
      title: 'Ocean Vibes',
      category: 'Nature • Watercolor',
      description: 'Calming ocean waves in watercolor style',
      platforms: ['Redbubble'],
      products: ['T-Shirt', 'Tote Bag', 'Poster'],
      priceFrom: 1199,
      badge: 'Popular',
      badgeColor: 'bg-blue-500',
      image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400&h=400&fit=crop',
    },
    {
      id: 4,
      title: 'Coffee Addict',
      category: 'Lifestyle • Funny',
      description: 'Perfect for coffee lovers with a sense of humor',
      platforms: ['Teepublic'],
      products: ['Mug', 'T-Shirt', 'Sticker'],
      priceFrom: 843,
      badge: 'Trending',
      badgeColor: 'bg-orange-500',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop',
    },
    {
      id: 5,
      title: 'Space Explorer',
      category: 'Science • Minimal',
      description: 'Minimalist rocket and space exploration theme',
      platforms: ['Redbubble', 'Teespring'],
      products: ['T-Shirt', 'Phone Case', 'Hoodie'],
      priceFrom: 1299,
      badge: 'Bestseller',
      badgeColor: 'bg-yellow-500',
      image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=400&fit=crop',
    },
    {
      id: 6,
      title: 'Cat Programmer',
      category: 'Tech • Funny',
      description: 'Coding cat for the developer community',
      platforms: ['Teepublic', 'Redbubble'],
      products: ['T-Shirt', 'Mug', 'Sticker'],
      priceFrom: 999,
      badge: 'New',
      badgeColor: 'bg-green-500',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop',
    },
    {
      id: 7,
      title: 'Sunrise Yoga',
      category: 'Wellness • Minimal',
      description: 'Peaceful yoga silhouette at sunrise',
      platforms: ['Redbubble'],
      products: ['T-Shirt', 'Tote Bag', 'Poster'],
      priceFrom: 1199,
      badge: 'Popular',
      badgeColor: 'bg-blue-500',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=400&fit=crop',
    },
    {
      id: 8,
      title: 'Retro Gaming',
      category: 'Gaming • Retro',
      description: 'Classic 8-bit gaming controller nostalgia',
      platforms: ['Teepublic', 'Teespring'],
      products: ['T-Shirt', 'Phone Case', 'Hoodie'],
      priceFrom: 1299,
      badge: 'Trending',
      badgeColor: 'bg-orange-500',
      image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=400&fit=crop',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-[#039BE5] hover:text-[#0288D1] font-medium">
              Home
            </Link>
            <ChevronRight size={16} className="text-gray-400" />
            <span className="text-gray-600">POD Products</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-[#039BE5] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">CloudBasket Original Designs</h1>
          <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Exclusive print-on-demand artwork available on premium merchandise across leading global
            platforms.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
              <div className="flex items-center space-x-2 text-sm sm:text-base">
                <Globe size={20} />
                <span>Ships to 150+ countries</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
              <div className="flex items-center space-x-2 text-sm sm:text-base">
                <Truck size={20} />
                <span>Fast & reliable delivery</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
              <div className="flex items-center space-x-2 text-sm sm:text-base">
                <Heart size={20} />
                <span>Premium quality merchandise</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How Print-on-Demand Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Browse Designs', desc: 'Explore our unique original artwork', icon: '🎨' },
              { step: '2', title: 'Choose Product', desc: 'T-shirts, hoodies, mugs, cases & more', icon: '👕' },
              { step: '3', title: 'Place Order', desc: 'Checkout securely on partner platforms', icon: '🛒' },
              { step: '4', title: 'Freshly Printed', desc: 'Produced on demand and shipped to you', icon: '📦' },
            ].map((item, idx) => (
              <div key={item.step} className="text-center relative">
                <div className="bg-[#039BE5] text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg">
                  {item.step}
                </div>
                <div className="text-5xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-6 left-[60%] w-[80%] border-t-2 border-dashed border-[#039BE5]/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Bar (static visual filters for now) */}
      <section className="bg-gray-50 py-6 sticky top-0 z-10 border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Featured POD Designs</h2>
              <p className="text-sm text-gray-600">{designs.length} curated designs available</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 bg-[#039BE5] hover:bg-[#0288D1] text-white rounded-lg text-sm font-semibold shadow-sm transition-colors">
                All
              </button>
              {['T-Shirts', 'Hoodies', 'Mugs', 'Phone Cases', 'Stickers', 'Posters'].map((label) => (
                <button
                  key={label}
                  className="px-4 py-2 bg-white text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-100 border border-gray-200"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Design Grid - Large Cards with external links */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {designs.map((design) => (
              <div
                key={design.id}
                className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100"
              >
                {/* Image Area */}
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-64 flex items-center justify-center relative overflow-hidden">
                  <img src={design.image} alt={design.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" />
                  {/* Badge */}
                  <div
                    className={`absolute top-4 right-4 ${design.badgeColor} text-white px-3 py-1 rounded-full text-xs font-bold shadow`}
                  >
                    {design.badge}
                  </div>
                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center text-white p-4">
                      <ShoppingBag className="mx-auto mb-2" size={32} />
                      <p className="text-sm font-semibold">Open design on partner platforms</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="text-xs text-[#039BE5] font-semibold mb-2">{design.category}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{design.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{design.description}</p>

                  {/* Products */}
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-1">Available products</div>
                    <div className="flex flex-wrap gap-1">
                      {design.products.map((product) => (
                        <span
                          key={product}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs border border-gray-200"
                        >
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-gray-900">₹{design.priceFrom}</span>
                    <span className="text-sm text-gray-500 ml-1">onwards (platform pricing)</span>
                  </div>

                  {/* Platform Buttons with real external links */}
                  <div className="space-y-2">
                    {design.platforms.map((platform) => {
                      const baseUrl = `https://${platform.toLowerCase()}.com`
                      // Example store paths – these are real, visitable URLs you can change later
                      const storePath =
                        platform === 'Redbubble'
                          ? `/people/cloudbasket/shop`
                          : platform === 'Teepublic'
                          ? `/user/cloudbasket`
                          : `/stores/cloudbasket`

                      const href = `${baseUrl}${storePath}`

                      return (
                        <a
                          key={platform}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between bg-[#039BE5] hover:bg-[#0288D1] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors w-full"
                        >
                          <span>View on {platform}</span>
                          <ExternalLink size={16} />
                        </a>
                      )
                    })}
                  </div>

                  {/* Disclaimer */}
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    You will be redirected to our official store on the selected platform to complete
                    purchase.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Details */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Platform Partners</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Redbubble',
                icon: '🔴',
                features: [
                  'Ships to 150+ countries',
                  'Premium apparel & accessories',
                  'Robust artist marketplace and reviews',
                  'Secure payments in multiple currencies',
                ],
                url: 'https://www.redbubble.com/people/cloudbasket/shop',
              },
              {
                name: 'Teepublic',
                icon: '🔵',
                features: [
                  'Aggressive discounts and frequent sales',
                  'Fast shipping to US, EU & India',
                  'High-quality screen printing',
                  'Dedicated mobile shopping experience',
                ],
                url: 'https://www.teepublic.com/user/cloudbasket',
              },
              {
                name: 'Teespring',
                icon: '🟣',
                features: [
                  'Custom creator-owned storefronts',
                  'On-demand fulfillment & no inventory risk',
                  'Apparel, accessories & home decor',
                  'Global logistics and tracking support',
                ],
                url: 'https://teespring.com/stores/cloudbasket',
              },
            ].map((platform) => (
              <div key={platform.name} className="bg-white rounded-xl shadow-md p-8 flex flex-col h-full">
                <div className="text-6xl mb-4 text-center">{platform.icon}</div>
                <h3 className="text-2xl font-bold text-center mb-6">{platform.name}</h3>

                <ul className="space-y-3 mb-6 flex-1">
                  {platform.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 bg-[#039BE5] hover:bg-[#0288D1] text-white px-6 py-3 rounded-lg font-semibold transition-colors w-full text-sm mt-auto"
                >
                  <span>Visit CloudBasket on {platform.name}</span>
                  <ExternalLink size={18} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

          <div className="space-y-6">
            {[
              {
                q: 'What is Print-on-Demand (POD)?',
                a: 'Print-on-Demand means your product is manufactured only after you place an order. This keeps inventory risk near zero, reduces waste, and lets us offer a wide catalog without holding stock.',
              },
              {
                q: 'Who prints and ships my products?',
                a: 'Our POD partners (Redbubble, Teepublic, Teespring) handle printing, packaging, and global shipping. CloudBasket focuses on original artwork, curation, and customer experience.',
              },
              {
                q: 'What about returns, refunds, or damaged items?',
                a: 'Each platform has its own refund and replacement policy. Typically, you can request a replacement or refund in cases of printing defects, damage, or order issues directly from the platform support team.',
              },
              {
                q: 'How long does delivery usually take?',
                a: 'Delivery times vary by region and platform, but typical ranges are: US (3–7 business days), Europe (5–10 business days), India (7–14 business days), and Rest of World (10–20 business days).',
              },
              {
                q: 'Are CloudBasket designs exclusive?',
                a: 'Yes. All artwork is created by CloudBasket designers and listed only via our official profiles on partner marketplaces. We do not license these designs to random third-party sellers.',
              },
            ].map((faq) => (
              <div key={faq.q} className="bg-gray-50 rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#039BE5] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Love These Designs?</h2>
          <p className="text-lg sm:text-xl mb-8 text-white/80">
            Follow CloudBasket for new drops, limited edition collections, and behind-the-scenes design
            stories.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://instagram.com/cloudbasket"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#039BE5] px-6 py-3 rounded-lg font-semibold hover:bg-sky-50 transition-colors text-sm sm:text-base shadow"
            >
              Follow on Instagram
            </a>
            <a
              href="https://twitter.com/cloudbasket"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0288D1] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0277BD] transition-colors border-2 border-white text-sm sm:text-base"
            >
              Follow on Twitter (X)
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
