import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BookOpen, Clock } from 'lucide-react'
import { BLOG_POSTS } from '@/lib/blog-data'

export const metadata: Metadata = {
  title: 'Blog | CloudBasket',
  description: 'Buying guides, deal alerts and tech reviews from CloudBasket experts.',
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[var(--cb-surface)]">
      <div className="mx-auto w-full max-w-5xl px-6 py-12">
        <header>
          <h1 className="flex items-center gap-2 font-display text-3xl font-black uppercase tracking-tight text-[var(--cb-text-primary)]">
            <BookOpen size={30} className="text-skyline-primary" />
            CloudBasket Blog
          </h1>
          <p className="mt-2 text-[var(--cb-text-muted)]">Guides, deal alerts and buying advice</p>
        </header>

        <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {BLOG_POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="cb-card group cursor-pointer overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={`https://images.unsplash.com/photo-${post.imageId}?auto=format&fit=crop&q=80&w=1200`}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <span className="cb-badge bg-skyline-glow text-skyline-primary">{post.category}</span>
                <h2 className="mt-2 line-clamp-2 text-base font-bold text-[var(--cb-text-primary)] transition-colors group-hover:text-skyline-primary">
                  {post.title}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm text-[var(--cb-text-muted)]">{post.excerpt}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[11px] text-[var(--cb-text-muted)]">
                    <Clock size={12} />
                    {post.readTime}
                  </span>
                  <span className="text-[11px] text-[var(--cb-text-muted)]">{post.date}</span>
                </div>
                <div className="mt-3 flex justify-end text-skyline-primary opacity-0 transition-opacity group-hover:opacity-100">
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  )
}
