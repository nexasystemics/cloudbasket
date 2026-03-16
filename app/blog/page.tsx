import type { Metadata } from 'next'
import BlogListingPageClient from './BlogListingPageClient'
import { BLOG_POSTS as LIB_BLOG_POSTS } from '@/lib/blog-data'

export const metadata: Metadata = {
  title: "Deals Intelligence & Buying Guides | CloudBasket Blog",
  description:
    'Expert buying guides, deal analysis, and price comparison insights designed to help shoppers research products and trends for smarter purchases.',
}

export default function BlogPage() {
  const posts = LIB_BLOG_POSTS.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    image: `https://images.unsplash.com/photo-${post.imageId}?w=800&q=80`,
    category: post.category,
    date: post.date,
    content: post.content ?? post.excerpt,
  }))

  return (
    <main className="bg-zinc-50 dark:bg-zinc-950 min-h-screen pt-12">
      <BlogListingPageClient posts={posts} />
    </main>
  )
}
