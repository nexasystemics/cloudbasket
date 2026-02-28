import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Clock, User, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

// ── Post data (mirrors blog/page.tsx) ─────────────────────────────────────────
const ALL_POSTS = [
  {
    id: 'featured-1',
    title: 'Top 10 Smart Home Devices for 2026',
    excerpt: 'Discover the best smart home devices that will transform your living space. From voice assistants to automated lighting, we review the top products that offer the best value and functionality.',
    body: [
      'Smart home technology has evolved dramatically over the past few years, making it easier and more affordable than ever to automate your home. From simple plug-in adapters to full home automation systems, there is something for every budget and every need.',
      'Voice assistants like Amazon Alexa and Google Home are the backbone of most smart home setups. They act as the central hub for controlling lights, thermostats, security cameras, and more. Integration with third-party devices has improved significantly, meaning most new smart home products work seamlessly with both platforms.',
      'Smart lighting is often the first step into home automation. Brands like Philips Hue offer a wide range of bulbs, strips, and fixtures that can be controlled via app or voice. You can set schedules, create scenes, and even sync your lights with your TV or music.',
      'Smart security is another fast-growing category. Video doorbells from Ring and Arlo let you see who is at your door from anywhere in the world. Indoor cameras with motion detection send alerts to your phone, while smart locks let you control entry remotely.',
      'For energy savings, smart thermostats like the Nest Learning Thermostat adapt to your schedule and preferences, reducing energy bills by up to 15%. Pair this with smart plugs that cut standby power to appliances and you have a genuinely eco-friendly setup.',
      'Our top pick for 2026 is the Amazon Echo Hub — a dedicated smart home control panel that puts everything in one place. Combined with Matter-compatible devices from multiple brands, it creates a truly unified smart home experience.',
    ],
    category: 'Reviews',
    author: { name: 'Sarah Chen', avatar: 'SC' },
    date: 'February 15, 2026',
    readTime: '12 min read',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop',
  },
  {
    id: '1',
    title: 'Best Budget Smartphones Under ₹15,000',
    excerpt: 'We tested 20 budget smartphones to find the best value for money. Here are our top picks that deliver excellent performance without breaking the bank.',
    body: [
      'The budget smartphone segment in India has never been more competitive. With brands like Redmi, Realme, and Samsung fighting for the sub-₹15,000 segment, consumers have an embarrassment of riches to choose from.',
      'Our top pick is the Redmi Note 13 5G, which packs a 50MP camera, 5G connectivity, and a 5000mAh battery into a sleek design for under ₹14,000. The AMOLED display is vibrant and the performance is snappy for everyday tasks.',
      'For camera enthusiasts on a budget, the Realme Narzo 70 Pro offers impressive versatility with its 50MP main sensor and Night Mode capabilities. The Sony IMX890 sensor punches well above its price point.',
      'Samsung fans should look at the Galaxy M15 5G, which brings Samsung\'s reliable software experience and three years of OS updates to an affordable price bracket. The build quality feels premium and the display is excellent.',
      'Battery life is a crucial consideration in this segment. All our recommended phones offer at least 5000mAh capacity with 33W or faster charging, ensuring you can get through a full day without anxiety.',
    ],
    category: 'Reviews',
    author: { name: 'Raj Kumar', avatar: 'RK' },
    date: 'February 14, 2026',
    readTime: '8 min read',
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1200&h=600&fit=crop',
  },
  {
    id: '2',
    title: 'How to Choose the Perfect Laptop',
    excerpt: 'A comprehensive guide to selecting the right laptop for your needs.',
    body: [
      'Choosing a laptop can feel overwhelming given the sheer number of options available. This guide breaks down the key factors to consider so you can make a confident purchase decision.',
      'The processor is the heart of any laptop. For everyday tasks like browsing, email, and document editing, an Intel Core i5 or AMD Ryzen 5 is more than sufficient. For video editing or software development, step up to an i7 or Ryzen 7 for a noticeably smoother experience.',
      'RAM and storage are equally important. We recommend a minimum of 16GB RAM for smooth multitasking in 2026. For storage, a 512GB SSD is the sweet spot — fast boot times, ample space for most users, and significantly better than older HDD options.',
      'Display quality matters more than most people realise. An IPS panel with at least Full HD (1920×1080) resolution will look sharp and have good viewing angles. If you do colour-sensitive work like photo or video editing, look for a panel with 100% sRGB coverage.',
      'Battery life claims from manufacturers are often optimistic. Look for real-world reviews that test under typical usage conditions. A good target is 8+ hours for a business laptop and 6+ for a gaming machine.',
    ],
    category: 'Guides',
    author: { name: 'Priya Sharma', avatar: 'PS' },
    date: 'February 13, 2026',
    readTime: '10 min read',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&h=600&fit=crop',
  },
  {
    id: '3',
    title: 'Smart Shopping with Price Comparison',
    excerpt: 'Learn how to use price comparison tools effectively to save money on every purchase.',
    body: [
      'Price comparison has become an essential skill for smart shoppers. With dozens of e-commerce platforms competing for your business, the same product can vary in price by 20–30% or more depending on where you buy.',
      'CloudBasket\'s price comparison tool tracks prices across Amazon, Flipkart, Meesho, and other major Indian retailers in real time. Set a target price and get notified when a product drops to your desired level.',
      'Beyond the listed price, always factor in delivery charges, applicable coupons, and bank offers. A product that appears cheaper on one platform may end up costing more after factoring in a ₹99 delivery fee versus free delivery elsewhere.',
      'Cashback platforms like CashKaro and GoPaisa add another layer of savings. Combining a platform discount with a credit card cashback offer and a CashKaro rebate can bring the effective price down significantly.',
      'Historical price data is your best ally during sale events. Products are often artificially inflated before major sales like the Amazon Great Indian Festival, then "discounted" back to the regular price. Price history charts expose this tactic immediately.',
    ],
    category: 'Guides',
    author: { name: 'Amit Patel', avatar: 'AP' },
    date: 'February 12, 2026',
    readTime: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=600&fit=crop',
  },
  {
    id: '4',
    title: 'Amazon Great Indian Festival Preview',
    excerpt: 'Everything you need to know about the upcoming Amazon sale.',
    body: [
      'The Amazon Great Indian Festival is one of the biggest shopping events of the year, typically held in October during the Navratri and Dussehra period. Millions of products across every category go on sale simultaneously, with some deals reaching 70–80% off.',
      'Electronics and smartphones consistently offer the deepest discounts. Expect significant cuts on flagship phones, laptops, televisions, and audio products. Amazon also uses this period to push its own devices like Echo, Fire TV, and Kindle with aggressive pricing.',
      'Fashion and apparel is another strong category. Premium brands that rarely discount become accessible during the festival. However, stock sells out fast, so wishlist your items well in advance and be ready to purchase the moment the sale opens.',
      'Bank offers can add a further 10% instant discount. SBI, HDFC, and ICICI credit cards typically have exclusive partnerships with Amazon during these events. Checking which cards offer the best additional benefit can save you thousands.',
      'Our advice: make your list now, compare prices using CloudBasket to know the pre-sale baseline, and set alerts for your target products. Do not wait until sale day to start researching — it will be too chaotic.',
    ],
    category: 'Deals',
    author: { name: 'Neha Singh', avatar: 'NS' },
    date: 'February 11, 2026',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=600&fit=crop',
  },
  {
    id: '5',
    title: 'Latest Wireless Earbuds Compared',
    excerpt: 'We compare the newest wireless earbuds from Apple, Samsung, Sony, and more.',
    body: [
      'The wireless earbuds market has matured significantly. Top-tier options now offer exceptional audio quality, reliable connectivity, and all-day battery life. The challenge is deciding which pair is right for you.',
      'Apple AirPods Pro 2nd Gen remain the benchmark for iOS users, offering seamless integration, excellent ANC, and spatial audio. If you live in the Apple ecosystem, nothing else comes close.',
      'For Android users, Samsung Galaxy Buds3 Pro provide excellent integration with Samsung phones and a comfortable fit. Sony WF-1000XM5 are arguably the best ANC earbuds regardless of platform, with outstanding noise cancellation and audiophile-grade sound.',
      'The budget segment is dominated by boAt and OnePlus in India. boAt Airdopes 181 and OnePlus Nord Buds 2 both punch well above their price points, offering 30+ hours of total playback and solid call quality.',
      'Key factors to consider: ANC performance, fit and comfort for extended wear, microphone quality for calls, and codec support (AptX or LDAC for high-quality audio). Do not overlook the companion app, which can make or break the overall experience.',
    ],
    category: 'Comparisons',
    author: { name: 'Vikram Rao', avatar: 'VR' },
    date: 'February 10, 2026',
    readTime: '9 min read',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1200&h=600&fit=crop',
  },
  {
    id: '6',
    title: '4K TV Buying Guide 2026',
    excerpt: 'Everything you need to know before buying a 4K TV.',
    body: [
      'Buying a TV in 2026 involves navigating more acronyms and specifications than ever before. OLED, QLED, Mini-LED, HDR10, Dolby Vision, HDMI 2.1 — the list is daunting, but this guide cuts through the noise.',
      'OLED panels remain the gold standard for picture quality, offering perfect blacks, infinite contrast ratios, and vibrant colours. LG and Sony produce the best OLED TVs, though Samsung\'s QD-OLED panels are a strong competitor.',
      'If OLED is out of budget, QLED and Mini-LED TVs offer an excellent alternative with high peak brightness — important for HDR content in bright rooms. Samsung QN90D and Hisense U8N are excellent value propositions.',
      'For gaming, look for HDMI 2.1 ports (enabling 4K/120Hz input), low input lag (under 10ms in game mode), and VRR/G-Sync/FreeSync support. LG C4 OLED is widely considered the best gaming TV money can buy.',
      'Screen size should be determined by viewing distance. The recommended formula is: viewing distance in inches ÷ 1.5 = ideal screen size in inches. For a 10-foot (120-inch) viewing distance, a 77-inch TV is appropriate.',
    ],
    category: 'Guides',
    author: { name: 'Anjali Mehta', avatar: 'AM' },
    date: 'February 9, 2026',
    readTime: '11 min read',
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=1200&h=600&fit=crop',
  },
  {
    id: '7',
    title: 'Affiliate Marketing 101',
    excerpt: 'A beginner-friendly guide to affiliate marketing.',
    body: [
      'Affiliate marketing is one of the most accessible ways to earn income online. At its core, you earn a commission every time someone purchases a product through your unique referral link.',
      'The first step is choosing the right platform. Amazon Associates and Flipkart Affiliate are the most popular in India, with millions of products and reliable payment systems. Commission rates vary by category — electronics typically pay 1–4%, while fashion and beauty can go up to 10–15%.',
      'Content is the foundation of successful affiliate marketing. Product reviews, comparison articles, and buying guides drive qualified traffic — people who are already in a buying mindset. Focus on being genuinely helpful rather than salesy.',
      'SEO is your best long-term strategy. A well-optimised blog post that ranks on Google can send traffic and earn commissions for years with minimal ongoing effort. Target long-tail keywords like "best budget laptop under ₹40000" rather than competitive head terms.',
      'CloudBasket\'s affiliate programme offers competitive commissions and real-time analytics. Sign up through our affiliate portal to get started. We provide banners, product feeds, and dedicated support to help you maximise your earnings.',
    ],
    category: 'Guides',
    author: { name: 'Rohit Desai', avatar: 'RD' },
    date: 'February 8, 2026',
    readTime: '7 min read',
    imageUrl: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=1200&h=600&fit=crop',
  },
]

function getPost(slug: string) {
  return ALL_POSTS.find((p) => p.id === slug) ?? null
}

// ── Page ──────────────────────────────────────────────────────────────────────
interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return ALL_POSTS.map((p) => ({ slug: p.id }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return { title: 'Post Not Found | CloudBasket Blog' }
  return {
    title: `${post.title} | CloudBasket Blog`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const currentIndex = ALL_POSTS.findIndex((p) => p.id === slug)
  const prev = ALL_POSTS[currentIndex - 1] ?? null
  const next = ALL_POSTS[currentIndex + 1] ?? null

  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero ── */}
      <div className="relative h-64 md:h-96 overflow-hidden bg-gray-900">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 bg-gradient-to-t from-black/70 to-transparent">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 w-fit"
            style={{ backgroundColor: '#039BE5', color: '#fff' }}
          >
            {post.category}
          </span>
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight max-w-3xl">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-gray-300 text-sm">
            <span className="flex items-center gap-1">
              <User size={14} />
              {post.author.name}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {post.readTime}
            </span>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <article className="max-w-3xl mx-auto px-4 py-10 md:py-14">
        <p className="text-lg text-gray-600 leading-relaxed mb-8 font-medium border-l-4 pl-4" style={{ borderColor: '#039BE5' }}>
          {post.excerpt}
        </p>
        <div className="space-y-5 text-gray-700 leading-relaxed text-base">
          {post.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {/* ── CTA ── */}
        <div
          className="mt-12 rounded-2xl p-6 md:p-8 text-white text-center"
          style={{ backgroundColor: '#039BE5' }}
        >
          <h2 className="text-xl font-bold mb-2">Find the best price for these products</h2>
          <p className="text-sky-100 mb-4 text-sm">
            CloudBasket compares prices across Amazon, Flipkart, and more — all in one place.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white font-semibold px-6 py-3 rounded-full text-sm transition-colors hover:bg-sky-50"
            style={{ color: '#039BE5' }}
          >
            Compare Prices Now
            <ChevronRight size={16} />
          </Link>
        </div>

        {/* ── Prev / Next ── */}
        <nav className="mt-10 flex flex-col sm:flex-row gap-4">
          {prev && (
            <Link
              href={`/blog/${prev.id}`}
              className="flex-1 flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-[#039BE5] hover:shadow-sm transition-all group"
            >
              <ChevronLeft size={18} className="text-gray-400 group-hover:text-[#039BE5] transition-colors shrink-0" />
              <span>
                <span className="block text-xs text-gray-400 mb-0.5">Previous</span>
                <span className="text-sm font-medium text-gray-800 line-clamp-2">{prev.title}</span>
              </span>
            </Link>
          )}
          {next && (
            <Link
              href={`/blog/${next.id}`}
              className="flex-1 flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-[#039BE5] hover:shadow-sm transition-all group text-right justify-end"
            >
              <span>
                <span className="block text-xs text-gray-400 mb-0.5">Next</span>
                <span className="text-sm font-medium text-gray-800 line-clamp-2">{next.title}</span>
              </span>
              <ChevronRight size={18} className="text-gray-400 group-hover:text-[#039BE5] transition-colors shrink-0" />
            </Link>
          )}
        </nav>

        {/* ── Back ── */}
        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ color: '#039BE5' }}
          >
            <ChevronLeft size={14} />
            Back to Blog
          </Link>
        </div>
      </article>
    </main>
  )
}
