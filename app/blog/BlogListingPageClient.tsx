'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface BlogListingPost {
  slug: string
  title: string
  excerpt: string
  image: string
  category: string
  date: string
  content: string
}

interface BlogListingPageClientProps {
  posts: BlogListingPost[]
}

function getEstimatedReadTime(content: string): string {
  const characterCount = content.length
  const wordCount = characterCount / 5
  return `${Math.max(1, Math.ceil(wordCount / 200))} min read`
}

export default function BlogListingPageClient({ posts }: BlogListingPageClientProps) {
  const [activeCategory, setActiveCategory] = useState('All')
  const categories = useMemo(() => ['All', ...Array.from(new Set(posts.map((post) => post.category)))], [posts])

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'All') {
      return posts
    }

    return posts.filter((post) => post.category === activeCategory)
  }, [activeCategory, posts])

  return (
    <div className="mx-auto max-w-7xl px-6 pb-20">
      <section className="py-12 text-center">
        <h1 className="text-5xl font-black uppercase italic tracking-tight text-zinc-900 dark:text-white sm:text-6xl">
          CloudBasket Blog
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
          Buying guides, platform analysis, and practical saving tactics for smarter online shopping.
        </p>
      </section>

      <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`rounded-full px-5 py-2 text-xs font-black uppercase tracking-widest transition-colors ${
              activeCategory === category
                ? 'bg-skyline-primary text-white'
                : 'bg-white text-zinc-500 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredPosts.map((post) => (
          <article key={post.slug} className="overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="relative h-56">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              />
            </div>
            <div className="space-y-3 p-6">
              <span className="inline-flex rounded-full bg-skyline-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-skyline-primary">
                {post.category}
              </span>
              <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">{post.title}</h2>
              <p className="text-xs font-medium text-zinc-400">{getEstimatedReadTime(post.content)}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{post.excerpt}</p>
              <div className="flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
                <span className="text-xs font-medium text-zinc-400">{post.date}</span>
                <Link href={`/blog/${post.slug}`} className="text-sm font-semibold text-skyline-primary hover:underline">
                  Read article
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
