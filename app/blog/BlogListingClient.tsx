'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ArrowRight, Tag, Search } from 'lucide-react'

type BlogPost = {
  title: string
  excerpt?: string
  image: string
  tag: string
  date: string
  readTime: string
  slug: string
  content?: string
}

interface BlogListingClientProps {
  posts: BlogPost[]
}

export default function BlogListingClient({ posts }: BlogListingClientProps) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = useMemo(() => {
    const cats = new Set(posts.map(p => p.tag))
    return ['All', ...Array.from(cats)]
  }, [posts])

  const calculateReadTime = (content?: string, fallback?: string) => {
    if (!content) return fallback || '5 min'
    const words = content.split(/\s+/).length
    const mins = Math.ceil(words / 200)
    return `${mins} min`
  }

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesCat = activeCategory === 'All' || post.tag === activeCategory
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCat && matchesSearch
    })
  }, [posts, activeCategory, searchQuery])

  const featured = filteredPosts[0]
  const latest = filteredPosts.slice(1)

  return (
    <div className="space-y-12">
      <section className="bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 py-16 -mt-12">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-skyline-primary/20 bg-skyline-primary/5 px-4 py-1.5 text-xs font-black text-skyline-primary uppercase tracking-widest mb-4">
            <Tag size={14} className="fill-current" /> CloudBasket Intel
          </span>
          <h1 className="text-5xl font-black tracking-tighter text-zinc-900 dark:text-white sm:text-6xl uppercase italic">
            Buying Guides & Analysis
          </h1>
          <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto font-medium">
            Expert reviews, price history deep-dives and data-driven shopping insights.
          </p>
          
          <div className="mt-10 max-w-2xl mx-auto space-y-6">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-skyline-primary transition-colors" size={20} />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, guides, or trends..."
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl py-4 pl-14 pr-6 text-zinc-900 dark:text-white font-medium outline-none ring-4 ring-skyline-primary/0 focus:ring-skyline-primary/5 transition-all"
              />
            </div>

            <div className="flex items-center justify-center overflow-x-auto no-scrollbar gap-2 pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeCategory === cat 
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xl shadow-zinc-900/10' 
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {filteredPosts.length > 0 ? (
        <div className="mx-auto max-w-7xl px-6 pb-20">
          {featured && (
            <section className="mb-16">
              <article className="group bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-2xl transition-all hover:shadow-skyline-primary/5 flex flex-col md:flex-row">
                <div className="relative h-72 md:h-auto md:w-3/5 overflow-hidden">
                  <Image
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    src={featured.image}
                    alt={featured.title}
                    sizes="(max-width: 768px) 100vw, 60vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent md:bg-gradient-to-t" />
                </div>
                <div className="flex flex-col justify-center p-10 md:w-2/5 space-y-6">
                  <span className="cb-badge cb-badge-orange w-fit px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">Featured Article</span>
                  <h2 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white leading-tight uppercase italic">{featured.title}</h2>
                  <p className="line-clamp-3 text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">{featured.excerpt}</p>
                  <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <span className="flex items-center gap-2">
                      <Calendar size={14} className="text-skyline-primary" /> {featured.date}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock size={14} className="text-skyline-primary" /> {calculateReadTime(featured.content, featured.readTime)} read
                    </span>
                  </div>
                  <Link href={`/blog/${featured.slug}`} className="cb-btn-primary w-fit px-8 py-4 rounded-2xl flex items-center gap-3 text-sm font-black uppercase tracking-widest shadow-lg shadow-skyline-primary/20 transition-all hover:-translate-y-1">
                    Full Analysis <ArrowRight size={18} />
                  </Link>
                </div>
              </article>
            </section>
          )}

          <section>
            <div className="flex items-end justify-between mb-10 border-b border-zinc-100 dark:border-zinc-800 pb-6">
              <div>
                <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight italic">Latest Intel</h2>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Deep dives from the CloudBasket lab</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((post) => (
                <article key={post.slug} className="group flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden hover:shadow-2xl transition-all duration-500">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      src={post.image}
                      alt={post.title}
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />
                    <span className="absolute left-4 top-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-zinc-900 dark:text-white shadow-sm border border-zinc-100 dark:border-zinc-800">{post.tag}</span>
                  </div>
                  <div className="p-6 flex flex-1 flex-col space-y-4">
                    <h3 className="line-clamp-2 text-lg font-black leading-snug group-hover:text-skyline-primary transition-colors uppercase italic">{post.title}</h3>
                    <div className="mt-auto pt-4 border-t border-zinc-50 dark:border-zinc-800 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-tighter text-zinc-400">
                        <span className="flex items-center gap-1.5"><Calendar size={12} /> {post.date}</span>
                        <span className="flex items-center gap-1.5"><Clock size={12} /> {calculateReadTime(post.content, post.readTime)}</span>
                      </div>
                      <Link href={`/blog/${post.slug}`} className="text-skyline-primary hover:translate-x-1 transition-transform">
                        <ArrowRight size={20} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-6 py-32 text-center">
          <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="text-zinc-300" size={40} />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase italic">No Intel Matches</h2>
          <p className="mt-3 text-zinc-500 dark:text-zinc-400 font-medium">We couldn't find any articles matching "{searchQuery}" in {activeCategory}.</p>
          <button 
            onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
            className="cb-btn-ghost mt-8 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-zinc-200"
          >
            Clear Filters
          </button>
        </div>
      )}
      
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
