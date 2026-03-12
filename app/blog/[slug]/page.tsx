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
import { BLOG_POSTS as LIBRARY_BLOG_POSTS, type BlogPost as LibraryBlogPost } from '@/lib/blog-data'

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

const LOCAL_BLOG_POSTS: readonly BlogPost[] = [
  {
    slug: 'best-smartphones-under-20000',
    title: 'Best Smartphones Under ₹20,000 in 2026',
    excerpt: 'We compared 47 smartphones across Amazon, Flipkart and CJ Global to find the absolute best value for gaming, camera quality and long-term reliability.',
    category: 'Buying Guide',
    author: 'CloudBasket Editorial',
    date: 'March 5, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80',
    content: [
      { type: 'intro', text: 'The sub-₹20,000 smartphone segment is fiercely competitive in 2026. We tested 47 devices across Amazon, Flipkart and CJ Global to find the best.' },
      { type: 'heading', text: 'Our Top Pick: Xiaomi Redmi Note 13 Pro 5G' },
      { type: 'paragraph', text: 'At ₹19,999, the Redmi Note 13 Pro 5G offers a 200MP camera, 67W turbo charging and Snapdragon 7s Gen 2. Unbeatable value.' },
      { type: 'deal', product: 'Xiaomi Redmi Note 13 Pro 5G', price: '₹19,999', link: '/go/amazon-mob-3' },
      { type: 'heading', text: 'Runner Up: Samsung Galaxy M35 5G' },
      { type: 'paragraph', text: 'Samsung Galaxy M35 5G at ₹18,999 brings a Super AMOLED display and 5000mAh battery ideal for media consumption.' },
      { type: 'deal', product: 'Samsung Galaxy M35 5G', price: '₹18,999', link: '/go/amazon-mob-1' },
      { type: 'conclusion', text: 'All prices verified on CloudBasket. Prices change daily. Click any deal link for the current best price.' },
    ],
    tags: ['Phones', 'Budget', 'Buying Guide', '2026'],
  },
  {
    slug: 'top-laptops-under-50000',
    title: 'Top 10 Laptops Under ₹50,000 - March 2026',
    excerpt: 'Top 10 laptops under ₹50,000 tested and ranked for students, professionals and creators.',
    category: 'Buying Guide',
    author: 'CloudBasket Tech',
    date: 'March 3, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80',
    content: [
      { type: 'intro', text: 'Finding a great laptop under ₹50,000 in 2026 is easier than ever. We tested 10 models to find the best for every use case.' },
      { type: 'heading', text: 'Top Pick: ASUS VivoBook 15 OLED' },
      { type: 'paragraph', text: 'The ASUS VivoBook 15 OLED at ₹39,990 delivers a stunning 2.8K OLED display with Ryzen 5 and 16GB RAM, exceptional for creators.' },
      { type: 'deal', product: 'ASUS VivoBook 15 OLED', price: '₹39,990', link: '/go/amazon-lap-4' },
      { type: 'heading', text: 'Best Value: HP Pavilion Laptop 15' },
      { type: 'paragraph', text: 'HP Pavilion 15 at ₹45,990 with Intel i5-1335U and 16GB RAM is the best all-rounder for productivity under ₹50,000.' },
      { type: 'deal', product: 'HP Pavilion Laptop 15', price: '₹45,990', link: '/go/flipkart-lap-1' },
      { type: 'conclusion', text: 'Use CloudBasket to compare prices across Amazon and Flipkart before buying.' },
    ],
    tags: ['Laptops', 'Buying Guide', '2026'],
  },
  {
    slug: 'amazon-vs-flipkart-2026',
    title: 'Amazon vs Flipkart: Who Has Better Prices in 2026?',
    excerpt: 'We compared 500 products across both platforms. The results may surprise you.',
    category: 'Analysis',
    author: 'CloudBasket Research',
    date: 'March 1, 2026',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=1200&q=80',
    content: [
      { type: 'intro', text: 'We analysed 500 products across Amazon.in and Flipkart.com over 30 days to find which platform consistently offers better prices.' },
      { type: 'heading', text: 'Electronics: Amazon Wins' },
      { type: 'paragraph', text: 'For smartphones, laptops and audio gear, Amazon was cheaper 62 percent of the time. Flipkart closes the gap during Big Billion Days.' },
      { type: 'heading', text: 'Fashion: Flipkart Wins' },
      { type: 'paragraph', text: 'Flipkart beats Amazon on clothing and footwear 71 percent of the time, especially for Indian brands.' },
      { type: 'conclusion', text: 'Use CloudBasket to compare both platforms in real time. Our Income Shield routes you to the best price today.' },
    ],
    tags: ['Amazon', 'Flipkart', 'Analysis', 'Price Comparison'],
  },
  {
    slug: 'best-ac-deals-summer-2026',
    title: 'How to Get the Best Deal on ACs This Summer',
    excerpt: 'Everything you need to know to buy an AC at the lowest price this summer.',
    category: 'Deals Guide',
    author: 'CloudBasket Editorial',
    date: 'Feb 28, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&q=80',
    content: [
      { type: 'intro', text: 'AC prices fluctuate heavily between March and June. Knowing when and where to buy can save you ₹5,000 to ₹10,000.' },
      { type: 'heading', text: 'Buy Before April' },
      { type: 'paragraph', text: 'Prices typically rise 15 to 20 percent after April 1 as summer demand peaks. Set a CloudBasket price alert now to lock in the lowest price.' },
      { type: 'heading', text: 'Best Brands Under ₹35,000' },
      { type: 'paragraph', text: 'Voltas, LG and Daikin consistently offer the best value in the 1.5-ton 5-star segment. Compare across Amazon and Flipkart for the best deal.' },
      { type: 'conclusion', text: 'Track AC prices on CloudBasket and get alerted the moment prices drop.' },
    ],
    tags: ['AC', 'Summer', 'Deals', 'Guide'],
  },
  {
    slug: 'best-headphones-under-5000',
    title: 'Best Noise Cancelling Headphones Under ₹5,000',
    excerpt: 'Top noise cancelling headphones tested under ₹5,000.',
    category: 'Buying Guide',
    author: 'CloudBasket Tech',
    date: 'Feb 25, 2026',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80',
    content: [
      { type: 'intro', text: 'Noise cancelling headphones under ₹5,000 have come a long way. We tested 8 models to find the best.' },
      { type: 'heading', text: 'Top Pick: boAt Rockerz 550' },
      { type: 'paragraph', text: 'At ₹1,999, the boAt Rockerz 550 delivers 20H battery life, 40mm drivers and decent passive noise isolation. Best budget pick.' },
      { type: 'heading', text: 'Premium Pick: JBL Tune 770NC' },
      { type: 'paragraph', text: 'JBL Tune 770NC at ₹4,499 offers true adaptive noise cancellation, 70H battery and a foldable design.' },
      { type: 'conclusion', text: 'Compare all headphone prices on CloudBasket before buying.' },
    ],
    tags: ['Audio', 'Headphones', 'Buying Guide'],
  },
  {
    slug: 'cj-global-vs-amazon-india',
    title: 'CJ Global vs Amazon India: Price Comparison 2026',
    excerpt: 'Is CJ Global actually cheaper than Amazon India? We compared 200 products.',
    category: 'Analysis',
    author: 'CloudBasket Research',
    date: 'Feb 22, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1200&q=80',
    content: [
      { type: 'intro', text: 'CJ Global has emerged as a strong alternative to Amazon India. We compared 200 products to see who wins on price.' },
      { type: 'heading', text: 'Electronics: Amazon Wins' },
      { type: 'paragraph', text: 'For branded electronics like phones, laptops and TVs, Amazon India was cheaper 68 percent of the time.' },
      { type: 'heading', text: 'Accessories: CJ Global Wins' },
      { type: 'paragraph', text: 'For cables, cases and generic accessories, CJ Global was cheaper 74 percent of the time, often by a significant margin.' },
      { type: 'conclusion', text: 'CloudBasket compares both platforms automatically. You always see the best price.' },
    ],
    tags: ['CJ Global', 'Amazon', 'Analysis', 'Deals'],
  },
  {
    slug: 'smart-tv-under-30000',
    title: "Smart TVs Under ₹30,000: Complete Buyer's Guide",
    excerpt: 'The best smart TVs under ₹30,000 in 2026, tested and ranked.',
    category: 'Buying Guide',
    author: 'CloudBasket Tech',
    date: 'Feb 20, 2026',
    readTime: '9 min read',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    content: [
      { type: 'intro', text: 'The sub-₹30,000 smart TV market in 2026 is packed with 4K options from Samsung, LG, Mi and Vu. Here is how to choose.' },
      { type: 'heading', text: 'Top Pick: Samsung 43" Crystal 4K' },
      { type: 'paragraph', text: 'Samsung 43" Crystal UHD at ₹28,999 delivers Crystal Processor 4K, HDR and Tizen OS. The most reliable smart TV under ₹30,000.' },
      { type: 'deal', product: 'Samsung 43" 4K Crystal UHD TV', price: '₹28,999', link: '/go/amazon-ele-2' },
      { type: 'heading', text: 'Budget Pick: Mi TV 5X 43"' },
      { type: 'paragraph', text: 'Mi TV 5X at ₹24,999 offers Dolby Vision, Dolby Atmos and a thin bezel design. Outstanding value.' },
      { type: 'conclusion', text: 'Track TV price drops on CloudBasket. Prices dip during IPL season and festive sales.' },
    ],
    tags: ['TV', 'Smart TV', 'Buying Guide', '4K'],
  },
]

function buildContentBlocks(content: string): BlogContentBlock[] {
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0)

  return paragraphs.map((paragraph, index) => {
    if (index === 0) {
      return { type: 'intro', text: paragraph }
    }

    if (index === paragraphs.length - 1) {
      return { type: 'conclusion', text: paragraph }
    }

    return { type: 'paragraph', text: paragraph }
  })
}

function convertLibraryPost(post: LibraryBlogPost): BlogPost | null {
  if (post.author === undefined || post.content === undefined) {
    return null
  }

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

const LIBRARY_DETAIL_POSTS: BlogPost[] = LIBRARY_BLOG_POSTS.map(convertLibraryPost).filter(
  (post): post is BlogPost => post !== null,
)

const BLOG_POSTS: BlogPost[] = [
  ...LOCAL_BLOG_POSTS,
  ...LIBRARY_DETAIL_POSTS.filter(
    (libraryPost) => !LOCAL_BLOG_POSTS.some((localPost) => localPost.slug === libraryPost.slug),
  ),
]

export function generateStaticParams(): Array<{ slug: string }> {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params
  const post = BLOG_POSTS.find((item) => item.slug === slug)

  if (post === undefined) {
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
  const post = BLOG_POSTS.find((item) => item.slug === slug)

  if (post === undefined) {
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
        <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-muted">
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
              <h2 key={`${block.type}-${index}`} className="mb-4 mt-8 text-2xl font-black tracking-tighter">
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
                <p className="mt-1 text-xs text-muted">{relatedPost.readTime}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
