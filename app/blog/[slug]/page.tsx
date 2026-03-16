import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { BLOG_POSTS as LIB_BLOG_POSTS, type BlogPost as LibraryBlogPost } from '@/lib/blog-data'
import BlogPostClient from './BlogPostClient'

type BlogContentBlock =
  | { type: 'intro'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'deal'; product: string; price: string; link: string }
  | { type: 'conclusion'; text: string }

type BlogPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  date: string
  readTime: string
  image: string
  content: BlogContentBlock[]
  tags: string[]
}

function buildContentBlocks(content: string): BlogContentBlock[] {
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0)

  return paragraphs.map((paragraph, index) => {
    if (index === 0) return { type: 'intro', text: paragraph }
    if (index === paragraphs.length - 1) return { type: 'conclusion', text: paragraph }
    return { type: 'paragraph', text: paragraph }
  })
}

function convertLibraryPost(post: LibraryBlogPost): BlogPost | null {
  if (post.author === undefined || post.content === undefined) return null
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    author: post.author,
    date: post.date,
    readTime: post.readTime,
    image: `https://images.unsplash.com/photo-${post.imageId}?w=1200&q=80`,
    content: buildContentBlocks(post.content),
    tags: [post.category, 'CloudBasket', 'Shopping'],
  }
}

const BLOG_POSTS = LIB_BLOG_POSTS.map(convertLibraryPost).filter((p): p is BlogPost => p !== null)

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)
  if (!post) return { title: 'Post Not Found' }
  return { title: `${post.title} | CloudBasket Intelligence`, description: post.excerpt }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)
  if (!post) notFound()

  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2)

  return <BlogPostClient post={post} relatedPosts={relatedPosts} />
}
