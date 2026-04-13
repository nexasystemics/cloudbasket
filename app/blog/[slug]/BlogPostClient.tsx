'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  Share2, 
  Copy, 
  MessageCircle,
  ChevronRight,
  TrendingDown,
  ExternalLink
} from 'lucide-react'

type ContentBlock = 
  | { type: 'intro' | 'heading' | 'paragraph' | 'conclusion'; text: string }
  | { type: 'deal'; product: string; price: string; link: string }

interface BlogPostClientProps {
  post: {
    title: string
    author: string
    date: string
    readTime: string
    image: string
    category: string
    content: ContentBlock[]
    slug: string
  }
  relatedPosts: any[]
}

export default function BlogPostClient({ post, relatedPosts }: BlogPostClientProps) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [copyStatus, setCopyStatus] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight
      const currentScroll = window.scrollY
      setScrollProgress((currentScroll / totalScroll) * 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const headings = useMemo(() => {
    return post.content
      .filter(block => block.type === 'heading')
      .map((block, i) => ({ 
        id: `heading-${i}`, 
        text: (block as { text: string }).text 
      }))
  }, [post.content])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopyStatus(true)
    setTimeout(() => setCopyStatus(false), 2000)
  }

  const shareOnWhatsApp = () => {
    const text = `Check out this article on CloudBasket: ${post.title} ${window.location.href}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="relative">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-zinc-100 dark:bg-zinc-800">
        <div 
          className="h-full bg-skyline-primary transition-all duration-100" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <Image 
          fill 
          className="object-cover" 
          src={post.image} 
          alt={post.title} 
          priority 
          sizes="100vw" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto w-full max-w-4xl px-6 pb-12">
          <Link href="/blog" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors mb-6 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Intelligence
          </Link>
          <span className="bg-skyline-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-lg shadow-lg mb-4 inline-block">
            {post.category}
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic leading-[0.9] max-w-3xl">
            {post.title}
          </h1>
          <div className="mt-8 flex flex-wrap items-center gap-8 text-[10px] font-black uppercase tracking-widest text-white/70">
            <span className="flex items-center gap-2 border-r border-white/10 pr-8">
              <User size={14} className="text-skyline-primary" /> {post.author}
            </span>
            <span className="flex items-center gap-2 border-r border-white/10 pr-8">
              <Calendar size={14} className="text-skyline-primary" /> {post.date}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={14} className="text-skyline-primary" /> {post.readTime}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Main Content */}
          <div className="lg:flex-1 max-w-3xl">
            <div className="prose dark:prose-invert prose-zinc prose-lg max-w-none">
              {post.content.map((block, index) => {
                if (block.type === 'intro') {
                  return (
                    <p key={index} className="text-xl font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed italic border-l-4 border-skyline-primary pl-6 mb-10">
                      {block.text}
                    </p>
                  )
                }
                if (block.type === 'heading') {
                  const id = `heading-${post.content.filter((b, i) => b.type === 'heading' && i < index).length}`
                  return (
                    <h2 key={index} id={id} className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mt-12 mb-6 scroll-mt-24 italic">
                      {block.text}
                    </h2>
                  )
                }
                if (block.type === 'paragraph') {
                  return (
                    <p key={index} className="text-zinc-700 dark:text-zinc-300 mb-6 leading-relaxed">
                      {block.text}
                    </p>
                  )
                }
                if (block.type === 'deal') {
                  return (
                    <div key={index} className="my-10 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-8 shadow-xl flex items-center justify-between group">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-skyline-primary/10 rounded-2xl flex items-center justify-center">
                          <TrendingDown className="text-skyline-primary" size={28} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">Editor's Pick</p>
                          <p className="text-lg font-black text-zinc-900 dark:text-white uppercase truncate max-w-[200px]">{block.product}</p>
                          <p className="text-2xl font-black text-skyline-primary leading-none mt-1">{block.price}</p>
                        </div>
                      </div>
                      <Link href={block.link} className="cb-btn-primary h-14 px-8 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest shadow-lg shadow-skyline-primary/20 transition-all group-hover:scale-105 active:scale-95">
                        Grab Deal <ExternalLink size={16} />
                      </Link>
                    </div>
                  )
                }
                if (block.type === 'conclusion') {
                  return (
                    <div key={index} className="mt-12 p-8 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-700">
                      <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 leading-relaxed italic">
                        {block.text}
                      </p>
                    </div>
                  )
                }
                return null
              })}
            </div>

            {/* Share Footer */}
            <div className="mt-16 pt-10 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Share Intelligence:</p>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={shareOnWhatsApp}
                    aria-label="Share on WhatsApp"
                    className="w-10 h-10 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all active:scale-90"
                  >
                    <MessageCircle size={18} />
                  </button>
                  <button 
                    onClick={copyToClipboard}
                    aria-label="Copy link"
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 ${
                      copyStatus ? 'bg-green-500 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200'
                    }`}
                  >
                    {copyStatus ? <Copy size={18} className="animate-pulse" /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/blog" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-skyline-primary transition-colors">
                  Explore More Guides <ChevronRight size={14} className="inline ml-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-24 space-y-10">
              {headings.length > 0 && (
                <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-8 shadow-sm">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 border-b border-zinc-50 dark:border-zinc-800 pb-4">On this page</h3>
                  <nav className="space-y-4">
                    {headings.map((h) => (
                      <a 
                        key={h.id} 
                        href={`#${h.id}`}
                        className="block text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-skyline-primary transition-colors uppercase leading-snug"
                      >
                        {h.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              <div className="bg-gradient-to-br from-skyline-primary to-skyline-primary-dark rounded-3xl p-8 text-white shadow-2xl shadow-skyline-primary/20">
                <TrendingDown className="mb-4 opacity-50" size={32} />
                <h3 className="text-xl font-black uppercase italic leading-none mb-3">Save Every Time</h3>
                <p className="text-xs font-bold text-white/70 uppercase tracking-widest leading-relaxed mb-6">Track price drops across 50+ stores in real-time.</p>
                <Link href="/products" className="block w-full bg-white text-skyline-primary py-3 rounded-xl text-center text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                  Browse Products
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* More Articles */}
      <section className="bg-zinc-100 dark:bg-zinc-900/50 py-20 border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black text-zinc-900 dark:text-white uppercase italic">Keep Learning</h2>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-2">More data-driven insights</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedPosts.map((r) => (
              <Link key={r.slug} href={`/blog/${r.slug}`} className="group flex bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl transition-all duration-500">
                <div className="relative w-1/3 min-h-[160px]">
                  <Image fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" src={r.image} alt={r.title} sizes="33vw" />
                </div>
                <div className="p-8 w-2/3 flex flex-col justify-center">
                  <span className="text-[9px] font-black uppercase tracking-widest text-skyline-primary mb-2">{r.category}</span>
                  <h3 className="text-lg font-black text-zinc-900 dark:text-white uppercase italic leading-tight group-hover:text-skyline-primary transition-colors">{r.title}</h3>
                  <p className="text-[9px] font-black uppercase tracking-tighter text-zinc-400 mt-4">{r.readTime} read</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
