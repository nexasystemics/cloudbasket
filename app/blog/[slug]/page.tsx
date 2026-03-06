import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, BookOpen, Clock } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { BLOG_POSTS, type BlogPost } from '@/lib/blog-data'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

const findPostBySlug = (slug: string): BlogPost | undefined => {
  return BLOG_POSTS.find((post) => post.slug === slug)
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = findPostBySlug(slug)
  return {
    title: post ? `${post.title} | CloudBasket Blog` : 'Article Not Found | CloudBasket Blog',
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = findPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const paragraphs = [
    `This is a detailed guide about ${post.title}. We analyze current market patterns, price movements and buying context relevant to Indian shoppers. The goal is to help you avoid overpaying while still choosing reliable products. Every recommendation is based on practical value rather than marketing claims.`,
    `For this topic, the most important step is comparing verified specifications with actual retailer pricing at checkout time. CloudBasket tracks multiple marketplaces and highlights clearer options when discounts are genuine. You should also compare warranty terms, stock stability and after-sales support before finalizing any purchase. These factors often matter more than headline discount percentages.`,
    `Use this article as a decision framework and revisit it when prices shift during sale windows. A disciplined approach helps you identify durable value instead of short-term hype. If you are researching alternatives, keep your shortlist narrow and compare only core requirements first. This method saves time and improves purchase confidence.`,
  ]

  return (
    <div className="min-h-screen bg-[var(--cb-surface)]">
      <article className="mx-auto w-full max-w-3xl px-6 py-12">
        <Link
          href={ROUTES.BLOG}
          className="inline-flex items-center gap-2 text-sm text-[var(--cb-text-muted)] hover:text-[var(--cb-text-primary)]"
        >
          <ArrowLeft size={14} />
          Back to Blog
        </Link>

        <div className="relative mt-6 h-72 overflow-hidden rounded-card">
          <Image
            src={`https://images.unsplash.com/photo-${post.imageId}?auto=format&fit=crop&q=80&w=1400`}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--cb-text-muted)]">
            <span className="cb-badge bg-skyline-glow text-skyline-primary">{post.category}</span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {post.readTime}
            </span>
            <span>{post.date}</span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-black leading-tight text-[var(--cb-text-primary)]">
            {post.title}
          </h1>
        </header>

        <section className="mt-8 space-y-6 text-base leading-relaxed text-[var(--cb-text-secondary)]">
          {paragraphs.map((paragraph, index) => (
            <p key={`paragraph-${index + 1}`}>{paragraph}</p>
          ))}
        </section>

        <section className="cb-card mt-12 p-6 text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-skyline-glow">
            <BookOpen size={18} className="text-skyline-primary" />
          </div>
          <p className="text-[var(--cb-text-primary)]">Find the best deals mentioned in this article</p>
          <Link href={ROUTES.DEALS} className="cb-btn-primary mt-4 inline-flex justify-center">
            Browse Deals
          </Link>
        </section>
      </article>
    </div>
  )
}
