import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  Calendar,
  Clock,
  User,
  Tag,
  ArrowLeft,
  ExternalLink,
  TrendingDown,
  Share2,
} from 'lucide-react'
import SchemaMarkup from '@/components/SchemaMarkup'

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

const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'best-phones-under-20000-2026',
    title: 'Best Phones Under Rs20,000 in 2026',
    excerpt: 'We compared 24 phones to find the absolute best value under Rs20,000.',
    category: 'Buying Guide',
    author: 'CloudBasket Editorial',
    date: 'March 1, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80',
    content: [
      {
        type: 'intro',
        text: 'The sub-Rs20,000 smartphone segment in India is fiercely competitive in 2026. With brands like Xiaomi, Realme, Samsung and Motorola all vying for your rupee, choosing the right phone can be overwhelming. We tested 24 devices over 6 weeks to bring you this definitive guide.'
      },
      { type: 'heading', text: 'Our Top Pick: Xiaomi Redmi Note 14 Pro' },
      {
        type: 'paragraph',
        text: 'At Rs18,999, the Redmi Note 14 Pro offers a 200MP camera, 5000mAh battery and AMOLED display that rivals phones costing twice as much. It is our clear top pick for 2026.'
      },
      {
        type: 'deal',
        product: 'Xiaomi Redmi Note 14 Pro',
        price: 'Rs18,999',
        link: '/go/amazon-redmi-note-14'
      },
      { type: 'heading', text: 'Runner Up: Samsung Galaxy A35' },
      {
        type: 'paragraph',
        text: 'Samsung\'s Galaxy A35 at Rs19,499 brings 4 years of OS updates - a rare promise in this segment. If software longevity matters to you, this is your phone.'
      },
      {
        type: 'deal',
        product: 'Samsung Galaxy A35',
        price: 'Rs19,499',
        link: '/go/flipkart-galaxy-a35'
      },
      { type: 'heading', text: 'Best Battery: Motorola Edge 50' },
      {
        type: 'paragraph',
        text: 'The Motorola Edge 50 at Rs17,999 has a 5000mAh battery with 68W fast charging. In our tests it lasted 2 full days with moderate usage.'
      },
      {
        type: 'conclusion',
        text: 'All prices verified on CloudBasket on March 1, 2026. Prices change daily - click any deal link for the current best price.'
      }
    ],
    tags: ['Phones', 'Budget', 'Buying Guide', '2026']
  },
  {
    slug: 'amazon-vs-flipkart-who-wins-2026',
    title: 'Amazon vs Flipkart: Who Has Better Prices in 2026?',
    excerpt: 'We compared 500 products across both platforms. The results may surprise you.',
    category: 'Analysis',
    author: 'CloudBasket Research',
    date: 'February 20, 2026',
    readTime: '12 min read',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80',
    content: [
      { type: 'intro', text: 'We analysed 500 products across Amazon.in and Flipkart.com over 30 days to determine which platform consistently offers better prices. Here is what we found.' },
      { type: 'heading', text: 'Electronics: Amazon Wins' },
      { type: 'paragraph', text: 'For smartphones, laptops and audio gear, Amazon was cheaper 62% of the time. Flipkart closes the gap during Big Billion Days but Amazon leads the rest of the year.' },
      { type: 'heading', text: 'Fashion: Flipkart Wins' },
      { type: 'paragraph', text: 'Flipkart\'s fashion vertical - powered by Myntra - beats Amazon on clothing and footwear 71% of the time, especially for Indian brands.' },
      { type: 'conclusion', text: 'Use CloudBasket to compare both platforms in real time. Our Income Shield routes you to whichever platform has the best price today.' }
    ],
    tags: ['Amazon', 'Flipkart', 'Analysis', 'Price Comparison']
  },
  {
    slug: 'macbook-air-m3-review-india',
    title: 'MacBook Air M3 India Review: Worth Rs1,14,900?',
    excerpt: 'The best laptop ever made. But is it worth the price in India?',
    category: 'Review',
    author: 'CloudBasket Tech',
    date: 'February 15, 2026',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80',
    content: [
      { type: 'intro', text: 'The MacBook Air M3 is arguably the best laptop ever made for most people. At Rs1,14,900 in India, it is also expensive. Is it worth it? After 3 months of daily use, here is our verdict.' },
      { type: 'heading', text: 'Performance' },
      { type: 'paragraph', text: 'The M3 chip handles everything we threw at it - video editing, coding, design - without breaking a sweat. Battery life averaged 14 hours in our tests.' },
      { type: 'deal', product: 'MacBook Air M3 13"', price: 'Rs1,14,900', link: '/go/amazon-macbook-m3' },
      { type: 'conclusion', text: 'If you can afford it, buy it. If budget is tight, the M2 model at Rs89,900 is still excellent.' }
    ],
    tags: ['MacBook', 'Apple', 'Review', 'Laptop']
  },
  {
    slug: 'diwali-deals-guide-2026',
    title: 'Diwali Deals 2026: Complete Buying Guide',
    excerpt: 'Everything you need to know to get the best deals this Diwali.',
    category: 'Deals Guide',
    author: 'CloudBasket Editorial',
    date: 'January 30, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=1200&q=80',
    content: [
      { type: 'intro', text: 'Diwali is the biggest shopping event in India. Both Amazon Great Indian Festival and Flipkart Big Billion Days run simultaneously. Here is how to get the best deals.' },
      { type: 'heading', text: 'Set Price Alerts Now' },
      { type: 'paragraph', text: 'Use CloudBasket price alerts to track products before the sale. Prices often drop 2-3 weeks before the official sale starts.' },
      { type: 'conclusion', text: 'Bookmark CloudBasket and check back daily as Diwali approaches for real-time price tracking.' }
    ],
    tags: ['Diwali', 'Deals', 'Festivals', 'Guide']
  },
  {
    slug: 'best-budget-laptops-india-2026',
    title: 'Best Budget Laptops Under Rs40,000 in India 2026',
    excerpt: 'Top 8 laptops under Rs40,000 tested and ranked.',
    category: 'Buying Guide',
    author: 'CloudBasket Tech',
    date: 'January 20, 2026',
    readTime: '9 min read',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80',
    content: [
      { type: 'intro', text: 'Finding a good laptop under Rs40,000 in India requires careful research. We tested 8 popular models to find the best options for students, professionals and casual users.' },
      { type: 'heading', text: 'Top Pick: HP Pavilion x360' },
      { type: 'paragraph', text: 'The HP Pavilion x360 at Rs38,990 offers a 2-in-1 design, 12th Gen Intel Core i5 and a bright touch display. Best all-rounder under Rs40,000.' },
      { type: 'deal', product: 'HP Pavilion x360', price: 'Rs38,990', link: '/go/amazon-hp-pavilion' },
      { type: 'conclusion', text: 'All prices verified March 2026. Use CloudBasket compare to find the best current price.' }
    ],
    tags: ['Laptop', 'Budget', 'Buying Guide', 'HP']
  },
  {
    slug: 'cloudbasket-how-it-works',
    title: 'How CloudBasket Works: Zero Checkout Explained',
    excerpt: 'Why CloudBasket never sells directly - and why that is better for you.',
    category: 'About',
    author: 'NEXQON Team',
    date: 'January 10, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    content: [
      { type: 'intro', text: 'CloudBasket is a price comparison platform, not a store. We never hold inventory, process payments or ship products. Here is why that makes us better for you.' },
      { type: 'heading', text: 'The Income Shield' },
      { type: 'paragraph', text: 'Every deal link on CloudBasket uses our Income Shield - a /go/ redirect that routes you to the retailer with the best current price. We earn a small affiliate commission. You pay nothing extra.' },
      { type: 'heading', text: 'Zero Checkout Philosophy' },
      { type: 'paragraph', text: 'By never handling payments, we eliminate risk for you. No data breaches, no payment failures, no refund hassles. Just the best price, direct from the retailer.' },
      { type: 'conclusion', text: 'CloudBasket is built by NEXQON HOLDINGS — global price intelligence platform.' }
    ],
    tags: ['About', 'How It Works', 'NEXQON']
  }
]

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)
  if (!post) {
    return { title: 'Post Not Found' }
  }
  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = BLOG_POSTS.filter((item) => item.slug !== post.slug).slice(0, 2)

  return (
    <main className="bg-[var(--cb-bg)]">
      <SchemaMarkup
        type="article"
        data={{
          title: post.title,
          excerpt: post.excerpt,
          author: post.author,
          date: post.date,
          image: post.image,
        }}
      />
      <section className="relative h-72 md:h-96">
        <Image fill className="object-cover" src={post.image} alt={post.title} priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto w-full max-w-3xl px-6 pb-8">
          <span className="cb-badge cb-badge-blue mb-3">{post.category}</span>
          <h1 className="text-3xl font-black leading-tight tracking-tighter text-white md:text-4xl">{post.title}</h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-white/70">
            <span className="inline-flex items-center gap-1.5">
              <User size={14} />
              {post.author}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={14} />
              {post.date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} />
              {post.readTime}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-10">
        <Link href="/blog" className="text-muted mb-8 inline-flex items-center gap-2 text-sm">
          <ArrowLeft size={16} />
          Back to Blog
        </Link>

        {post.content.map((block, index) => {
          if (block.type === 'intro') {
            return (
              <p key={`${block.type}-${index}`} className="mb-6 border-l-4 border-[#039BE5] pl-4 text-lg leading-relaxed text-muted">
                {block.text}
              </p>
            )
          }

          if (block.type === 'heading') {
            return (
              <h2 key={`${block.type}-${index}`} className="mt-8 mb-4 text-2xl font-black tracking-tighter">
                {block.text}
              </h2>
            )
          }

          if (block.type === 'paragraph') {
            return (
              <p key={`${block.type}-${index}`} className="mb-6 text-base leading-relaxed text-[var(--cb-text-primary)]">
                {block.text}
              </p>
            )
          }

          if (block.type === 'deal') {
            return (
              <div key={`${block.type}-${index}`} className="cb-card mb-6 flex items-center justify-between border-[#039BE5]/20 bg-[#039BE5]/5 p-5">
                <div className="flex items-center">
                  <TrendingDown size={20} className="text-[#039BE5]" />
                  <div className="ml-3">
                    <p className="text-sm font-black">{block.product}</p>
                    <p className="price-current text-lg">{block.price}</p>
                  </div>
                </div>
                <Link href={block.link} className="cb-btn cb-btn-primary gap-2">
                  <ExternalLink size={14} />
                  View Best Price
                </Link>
              </div>
            )
          }

          return (
            <div key={`${block.type}-${index}`} className="cb-card mt-8 bg-[var(--cb-surface-2)] p-6">
              <p className="text-sm italic text-muted">{block.text}</p>
            </div>
          )
        })}

        <div className="mt-10 flex flex-wrap gap-2 border-t border-[var(--cb-border)] pt-6">
          <Tag size={14} className="text-muted" />
          {post.tags.map((tag) => (
            <span key={tag} className="cb-badge">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <Share2 size={16} className="text-muted" />
          <button type="button" className="cb-btn cb-btn-ghost text-sm">
            Share Article
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16">
        <h2 className="mb-6 text-2xl font-black tracking-tighter">More Articles</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {relatedPosts.map((relatedPost) => (
            <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`} className="cb-card group overflow-hidden">
              <div className="relative h-40">
                <Image fill className="object-cover" src={relatedPost.image} alt={relatedPost.title} />
              </div>
              <div className="p-4">
                <span className="cb-badge text-xs">{relatedPost.category}</span>
                <h3 className="mt-2 line-clamp-2 text-sm font-bold">{relatedPost.title}</h3>
                <p className="text-muted mt-1 text-xs">{relatedPost.readTime}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

