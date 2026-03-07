import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react'

type BlogPost = {
  title: string
  excerpt?: string
  image: string
  tag: string
  date: string
  readTime: string
  slug: string
}

const BLOG_POSTS: readonly BlogPost[] = [
  {
    title: 'Best Smartphones Under ₹20,000 in 2026',
    excerpt:
      'We compared 47 smartphones across Amazon, Flipkart and CJ Global to find the absolute best value for gaming, camera quality and long-term reliability in this budget segment.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
    tag: 'Mobiles',
    date: 'March 5, 2026',
    readTime: '8 min',
    slug: 'best-smartphones-under-20000',
  },
  {
    title: 'Top 10 Laptops Under ₹50,000 — March 2026',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
    tag: 'Laptops',
    date: 'March 3, 2026',
    readTime: '6 min',
    slug: 'top-laptops-under-50000',
  },
  {
    title: 'Amazon vs Flipkart: Who Has Better Prices in 2026?',
    image: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=600&q=80',
    tag: 'Comparison',
    date: 'March 1, 2026',
    readTime: '10 min',
    slug: 'amazon-vs-flipkart-2026',
  },
  {
    title: 'How to Get the Best Deal on ACs This Summer',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80',
    tag: 'Home',
    date: 'Feb 28, 2026',
    readTime: '5 min',
    slug: 'best-ac-deals-summer-2026',
  },
  {
    title: 'Best Noise Cancelling Headphones Under ₹5,000',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    tag: 'Audio',
    date: 'Feb 25, 2026',
    readTime: '7 min',
    slug: 'best-headphones-under-5000',
  },
  {
    title: 'CJ Global vs Amazon India: Price Comparison 2026',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80',
    tag: 'Deals',
    date: 'Feb 22, 2026',
    readTime: '4 min',
    slug: 'cj-global-vs-amazon-india',
  },
  {
    title: "Smart TVs Under ₹30,000: Complete Buyer's Guide",
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    tag: 'Electronics',
    date: 'Feb 20, 2026',
    readTime: '9 min',
    slug: 'smart-tv-under-30000',
  },
]

export default function BlogPage() {
  const featured = BLOG_POSTS[0]
  const latest = BLOG_POSTS.slice(1)

  return (
    <main className="bg-[var(--cb-bg)]">
      <section className="bg-[var(--cb-surface-2)] py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <span className="cb-badge cb-badge-blue mb-4">
            <Tag size={13} /> CloudBasket Blog
          </span>
          <h1 className="text-4xl font-black tracking-tighter">Deals Intelligence & Buying Guides</h1>
          <p className="mt-3 text-[var(--cb-text-muted)]">
            Expert reviews, price history analysis and smart buying guides
          </p>
          <input className="cb-input mx-auto mt-6 block w-full max-w-md" placeholder="Search articles..." />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <article className="cb-card overflow-hidden md:flex">
          <div className="relative h-64 min-h-[240px] md:h-auto md:w-1/2">
            <Image fill className="object-cover" src={featured.image} alt={featured.title} />
          </div>
          <div className="flex flex-col justify-center p-8 md:w-1/2">
            <span className="cb-badge cb-badge-orange mb-3 w-fit">Featured</span>
            <h2 className="text-2xl font-black tracking-tighter">{featured.title}</h2>
            <p className="mt-2 line-clamp-3 text-sm text-[var(--cb-text-muted)]">{featured.excerpt}</p>
            <div className="mt-4 flex items-center gap-4 text-xs text-[var(--cb-text-muted)]">
              <span className="inline-flex items-center gap-1">
                <Calendar size={12} /> {featured.date}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock size={12} /> {featured.readTime} read
              </span>
            </div>
            <Link href={`/blog/${featured.slug}`} className="cb-btn cb-btn-primary mt-4 w-fit gap-2">
              Read Article <ArrowRight size={16} />
            </Link>
          </div>
        </article>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <h2 className="mb-8 text-2xl font-black tracking-tighter">Latest Articles</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((post) => (
            <article key={post.slug} className="cb-card group overflow-hidden">
              <div className="relative h-44 overflow-hidden">
                <Image
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  src={post.image}
                  alt={post.title}
                />
              </div>
              <div className="p-4">
                <span className="cb-badge cb-badge-blue mb-2 text-[10px]">{post.tag}</span>
                <h3 className="mt-1 line-clamp-2 text-sm font-black leading-snug">{post.title}</h3>
                <div className="mt-2 flex items-center gap-3 text-xs text-[var(--cb-text-muted)]">
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={11} /> {post.date}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={11} /> {post.readTime}
                  </span>
                </div>
                <Link href={`/blog/${post.slug}`} className="cb-btn cb-btn-ghost mt-3 w-full gap-1 text-xs">
                  Read More <ArrowRight size={12} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
