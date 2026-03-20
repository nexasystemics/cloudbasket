import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'

const BLOG_POSTS = [
  { slug: 'best-smartphones-under-20000', title: 'Best Smartphones Under ₹20,000 in 2026', tag: 'Buying Guide', readTime: '8 min', color: 'from-blue-500 to-blue-700' },
  { slug: 'amazon-vs-flipkart-2026', title: 'Amazon vs Flipkart: Who Has Better Prices in 2026?', tag: 'Analysis', readTime: '10 min', color: 'from-orange-500 to-orange-700' },
  { slug: 'top-laptops-under-50000', title: 'Top 10 Laptops Under ₹50,000 — March 2026', tag: 'Buying Guide', readTime: '6 min', color: 'from-purple-500 to-purple-700' },
]

export default function HomeBlogSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tighter">Buying Guides and Deal Alerts</h2>
        <Link href="/blog" className="cb-btn cb-btn-ghost text-sm gap-1">View all <ArrowRight size={14} /></Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {BLOG_POSTS.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="cb-card group overflow-hidden">
            <div className={`h-32 bg-gradient-to-br ${post.color} flex items-end p-4`}>
              <span className="cb-badge bg-white/20 text-white border-white/20 text-[10px]">{post.tag}</span>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-black line-clamp-2 group-hover:text-skyline-primary transition-colors">{post.title}</h3>
              <div className="mt-2 flex items-center gap-1 text-xs text-[var(--cb-text-muted)]">
                <Clock size={11} /> {post.readTime} read
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}