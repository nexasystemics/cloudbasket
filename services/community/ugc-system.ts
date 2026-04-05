// services/community/ugc-system.ts
// User Generated Content community system for CloudBasket.
// Handles posts, tips, questions and answers from users.
// Stub-safe — returns mock data when Supabase not configured.

import { isConfigured } from '@/lib/env'

export interface UGCPost {
  id: string
  type: 'tip' | 'question' | 'review' | 'deal-alert'
  title: string
  body: string
  author: string
  authorAvatar?: string
  productId?: string
  productName?: string
  upvotes: number
  replies: number
  verified: boolean
  createdAt: string
}

export interface UGCReply {
  id: string
  postId: string
  body: string
  author: string
  upvotes: number
  createdAt: string
}

const STUB_POSTS: UGCPost[] = [
  {
    id: 'ugc-001',
    type: 'tip',
    title: 'How I saved ₹3000 on boAt headphones',
    body: 'Waited for the sale and used CloudBasket price alerts. Got them at ₹1499 instead of ₹2999!',
    author: 'Rahul M.',
    upvotes: 142,
    replies: 23,
    verified: true,
    productId: 'boat-rockerz-450',
    productName: 'boAt Rockerz 450',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ugc-002',
    type: 'question',
    title: 'Is Samsung Galaxy M14 worth it in 2026?',
    body: 'Comparing it with Realme Narzo. Anyone using M14 for a year now?',
    author: 'Priya S.',
    upvotes: 89,
    replies: 47,
    verified: false,
    productId: 'samsung-galaxy-m14',
    productName: 'Samsung Galaxy M14',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ugc-003',
    type: 'deal-alert',
    title: 'Bajaj Mixer at 34% off — ends tonight!',
    body: 'Just spotted this deal. Grabbed one for my mom. Link in comments.',
    author: 'Amit K.',
    upvotes: 234,
    replies: 12,
    verified: true,
    productId: 'bajaj-mixer-500w',
    productName: 'Bajaj Mixer Grinder',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

class UGCSystem {
  private isReady(): boolean {
    return isConfigured('NEXT_PUBLIC_SUPABASE_URL')
  }

  async getPosts(options: {
    type?: UGCPost['type']
    productId?: string
    limit?: number
  } = {}): Promise<UGCPost[]> {
    const { type, productId, limit = 20 } = options

    if (!this.isReady()) {
      console.warn('[UGCSystem] Supabase not configured — returning stub posts')
      return STUB_POSTS
        .filter((p) => !type || p.type === type)
        .filter((p) => !productId || p.productId === productId)
        .slice(0, limit)
    }

    try {
      // Wire Supabase query here when configured
      console.warn('[UGCSystem] Supabase wire pending')
      return STUB_POSTS.slice(0, limit)
    } catch (err) {
      console.warn('[UGCSystem] getPosts error:', err)
      return STUB_POSTS.slice(0, limit)
    }
  }

  async submitPost(post: Omit<UGCPost, 'id' | 'upvotes' | 'replies' | 'createdAt'>): Promise<UGCPost> {
    const newPost: UGCPost = {
      ...post,
      id: `ugc-${Date.now()}`,
      upvotes: 0,
      replies: 0,
      createdAt: new Date().toISOString(),
    }

    if (!this.isReady()) {
      console.warn('[UGCSystem] Stub submit — Supabase not configured')
      return newPost
    }

    try {
      console.warn('[UGCSystem] Supabase insert wire pending')
      return newPost
    } catch (err) {
      console.warn('[UGCSystem] Submit error:', err)
      return newPost
    }
  }

  async upvotePost(postId: string): Promise<void> {
    if (!this.isReady()) {
      console.warn('[UGCSystem] Upvote stub — Supabase not configured')
      return
    }
    try {
      console.warn('[UGCSystem] Supabase upvote wire pending:', postId)
    } catch (err) {
      console.warn('[UGCSystem] Upvote error:', err)
    }
  }

  async getTrending(limit = 5): Promise<UGCPost[]> {
    const posts = await this.getPosts({ limit: 50 })
    return posts.sort((a, b) => b.upvotes - a.upvotes).slice(0, limit)
  }
}

export const ugcSystem = new UGCSystem()


