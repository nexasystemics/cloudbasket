'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Copy, MessageCircle } from 'lucide-react'

interface BlogArticleSection {
  id: string
  heading: string
  body: string
}

interface BlogArticlePost {
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  date: string
  image: string
  intro: string
  conclusion: string
  sections: BlogArticleSection[]
}

interface RelatedPost {
  slug: string
  title: string
  image: string
  category: string
}

interface BlogArticlePageClientProps {
  post: BlogArticlePost
  relatedPosts: RelatedPost[]
}

export default function BlogArticlePageClient({ post, relatedPosts }: BlogArticlePageClientProps) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [copied, setCopied] = useState(false)
  const copyResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const headings = useMemo(() => post.sections.slice(0, 6), [post.sections])

  useEffect(() => {
    const handleScroll = () => {
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = documentHeight > 0 ? (window.scrollY / documentHeight) * 100 : 0
      setScrollProgress(Math.min(Math.max(progress, 0), 100))
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (copyResetTimeoutRef.current) {
        clearTimeout(copyResetTimeoutRef.current)
      }
    }
  }, [])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)

      if (copyResetTimeoutRef.current) {
        clearTimeout(copyResetTimeoutRef.current)
      }

      copyResetTimeoutRef.current = setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (error) {
      console.error('Failed to copy blog URL:', error)
    }
  }

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`Check out this article on CloudBasket: ${post.title} https://cloudbasket.in/blog/${post.slug}`)}`

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cb_blog_recently_read')
      const current = stored ? (JSON.parse(stored) as BlogArticlePost[]) : []
      const filtered = current.filter((item) => item.slug !== post.slug)
      const normalized = [
        { slug: post.slug, title: post.title, excerpt: post.excerpt, image: post.image, category: post.category, date: post.date, content: post.intro },
        ...filtered,
      ]
      localStorage.setItem('cb_blog_recently_read', JSON.stringify(normalized.slice(0, 5)))
    } catch {
      // no-op
    }
  }, [post])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    image: post.image,
    author: { '@type': 'Person', name: post.author },
    datePublished: post.date,
    articleSection: post.category,
    publisher: { '@type': 'Organization', name: 'CloudBasket', logo: { '@type': 'ImageObject', url: 'https://cloudbasket.in/logo.png' } },
    description: post.excerpt,
  }

  return (
    <div className="relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="fixed left-0 top-0 z-[70] h-1 w-full bg-zinc-100 dark:bg-zinc-800">
        <div className="h-full bg-skyline-primary transition-[width] duration-150" style={{ width: `${scrollProgress}%` }} />
      </div>

      <section className="relative h-[50vh] min-h-[360px] overflow-hidden">
        <Image src={post.image} alt={post.title} fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-12 text-white">
          <Link href="/blog" className="text-sm font-semibold text-white/70 hover:text-white">
            Back to Blog
          </Link>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-skyline-primary">{post.category}</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-black uppercase italic tracking-tight sm:text-6xl">{post.title}</h1>
          <p className="mt-4 text-sm text-white/70">{post.author} · {post.date}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_280px]">
        <article className="max-w-3xl">
          <p className="border-l-4 border-skyline-primary pl-6 text-lg italic leading-relaxed text-zinc-600 dark:text-zinc-300">
            {post.intro}
          </p>

          <div className="mt-10 space-y-10">
            {post.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">{section.heading}</h2>
                <p className="mt-4 text-base leading-8 text-zinc-600 dark:text-zinc-300">{section.body}</p>
              </section>
            ))}
          </div>

          <div className="mt-12 rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            {post.conclusion}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white"
            >
              <MessageCircle size={16} />
              Share on WhatsApp
            </a>
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
            >
              <Copy size={16} />
              {copied ? 'Copied!' : 'Copy link'}
            </button>
          </div>
        </article>

        {headings.length >= 3 ? (
          <aside className="hidden lg:block">
            <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 lg:sticky lg:top-24">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Table of Contents</h2>
              <nav className="mt-4 space-y-3">
                {headings.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className="block text-sm font-semibold text-zinc-600 hover:text-skyline-primary dark:text-zinc-300"
                  >
                    {heading.heading}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        ) : null}
      </section>

      {relatedPosts.length > 0 ? (
        <section className="border-t border-zinc-100 bg-zinc-50/80 py-16 dark:border-zinc-800 dark:bg-zinc-950/50">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">More from CloudBasket</h2>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="relative h-56">
                    <Image src={relatedPost.image} alt={relatedPost.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                  </div>
                  <div className="space-y-2 p-6">
                    <p className="text-xs font-black uppercase tracking-widest text-skyline-primary">{relatedPost.category}</p>
                    <h3 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">{relatedPost.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}
