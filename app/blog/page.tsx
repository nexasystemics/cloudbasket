import type { Metadata } from 'next'
import BlogListingClient from './BlogListingClient'
import { BLOG_POSTS as LIB_BLOG_POSTS } from '@/lib/blog-data'

export const metadata: Metadata = {
  title: "Deals Intelligence & Buying Guides | CloudBasket Blog",
  description:
    'Expert buying guides, deal analysis, and price comparison insights designed to help shoppers research products and trends for smarter purchases.',
}

export default function BlogPage() {
  // Normalize data for the client component
  const posts = LIB_BLOG_POSTS.map(post => ({
    title: post.title,
    excerpt: post.excerpt,
    image: `https://images.unsplash.com/photo-${post.imageId}?w=800&q=80`,
    tag: post.category,
    date: post.date,
    readTime: post.readTime,
    slug: post.slug,
    content: post.content
  }))

  return (
    <main className="bg-zinc-50 dark:bg-zinc-950 min-h-screen pt-12">
      <BlogListingClient posts={posts} />
    </main>
  )
}
