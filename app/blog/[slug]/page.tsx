import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { BLOG_POSTS as LIB_BLOG_POSTS, type BlogPost as LibraryBlogPost } from '@/lib/blog-data'
import BlogArticlePageClient from './BlogArticlePageClient'

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

function sentenceToHeading(sentence: string, index: number): string {
  const words = sentence.replace(/[.!?]+$/, '').split(/\s+/).slice(0, 7)
  const heading = words.join(' ').trim()
  return heading.length > 0 ? heading : `Section ${index + 1}`
}

function buildArticleSections(content: string): Pick<BlogArticlePost, 'intro' | 'conclusion' | 'sections'> {
  const sentences = content
    .replace(/\s+/g, ' ')
    .match(/[^.!?]+[.!?]?/g)
    ?.map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0) ?? []

  const intro = sentences[0] ?? content
  const conclusion = sentences[sentences.length - 1] ?? content
  const middleSentences = sentences.slice(1, Math.max(sentences.length - 1, 1))
  const sections: BlogArticleSection[] = []

  for (let index = 0; index < middleSentences.length; index += 2) {
    const chunk = middleSentences.slice(index, index + 2)
    if (chunk.length === 0) continue

    sections.push({
      id: `section-${sections.length + 1}`,
      heading: sentenceToHeading(chunk[0], sections.length),
      body: chunk.join(' '),
    })
  }

  return {
    intro,
    conclusion,
    sections,
  }
}

function convertLibraryPost(post: LibraryBlogPost): BlogArticlePost | null {
  if (post.author === undefined || post.content === undefined) return null

  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    author: post.author,
    date: post.date,
    image: `https://images.unsplash.com/photo-${post.imageId}?w=1200&q=80`,
    ...buildArticleSections(post.content),
  }
}

const BLOG_POSTS = LIB_BLOG_POSTS.map(convertLibraryPost).filter((post): post is BlogArticlePost => post !== null)

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = BLOG_POSTS.find((entry) => entry.slug === slug)

  if (!post) {
    return { title: 'Post Not Found' }
  }

  return {
    title: `${post.title} | CloudBasket Intelligence`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = BLOG_POSTS.find((entry) => entry.slug === slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = BLOG_POSTS.filter((entry) => entry.slug !== post.slug).slice(0, 2).map((entry) => ({
    slug: entry.slug,
    title: entry.title,
    image: entry.image,
    category: entry.category,
  }))

  return <BlogArticlePageClient post={post} relatedPosts={relatedPosts} />
}
