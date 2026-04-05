// services/affiliate/influencer-portal.ts
// D18: Influencer Affiliate Portal — stub-safe

import { isConfigured } from '@/lib/env'

export type Influencer = {
  id: string
  name: string
  email: string
  platform: 'instagram' | 'youtube' | 'twitter' | 'blog'
  followers: number
  commissionRate: number
  referralCode: string
  totalClicks: number
  totalConversions: number
  totalEarnings: number
  status: 'pending' | 'active' | 'suspended'
  joinedAt: string
}

export type InfluencerApplication = {
  name: string
  email: string
  platform: Influencer['platform']
  profileUrl: string
  followers: number
  niche: string
}

export type ReferralClick = {
  influencerId: string
  referralCode: string
  productId: string
  clickedAt: string
  converted: boolean
  commissionEarned: number
}

const STUB_INFLUENCERS: Influencer[] = [
  {
    id: 'INF-001', name: 'Priya Sharma', email: 'priya@example.com',
    platform: 'instagram', followers: 125000, commissionRate: 8,
    referralCode: 'PRIYA8', totalClicks: 3420, totalConversions: 187,
    totalEarnings: 24680, status: 'active', joinedAt: '2026-01-15',
  },
  {
    id: 'INF-002', name: 'Tech With Rahul', email: 'rahul@example.com',
    platform: 'youtube', followers: 89000, commissionRate: 10,
    referralCode: 'RAHUL10', totalClicks: 5670, totalConversions: 312,
    totalEarnings: 41200, status: 'active', joinedAt: '2026-02-01',
  },
]

class InfluencerPortal {
  private isHubspotReady(): boolean {
    return isConfigured('HUBSPOT_API_KEY')
  }

  private isEmailReady(): boolean {
    return isConfigured('RESEND_API_KEY')
  }

  async getInfluencers(): Promise<Influencer[]> {
    try {
      // Real Supabase fetch would go here
      return STUB_INFLUENCERS
    } catch (err) {
      console.warn('[influencer-portal] getInfluencers failed:', err)
      return STUB_INFLUENCERS
    }
  }

  async getInfluencerById(id: string): Promise<Influencer | null> {
    try {
      return STUB_INFLUENCERS.find(i => i.id === id) ?? null
    } catch (err) {
      console.warn('[influencer-portal] getInfluencerById failed:', err)
      return null
    }
  }

  async applyAsInfluencer(application: InfluencerApplication): Promise<{ success: boolean; message: string }> {
    try {
      if (this.isEmailReady()) {
        console.info('[influencer-portal] Would send welcome email via Resend')
      }
      if (this.isHubspotReady()) {
        console.info('[influencer-portal] Would create HubSpot contact')
      }
      return { success: true, message: 'Application received. We will review and contact you within 48 hours.' }
    } catch (err) {
      console.warn('[influencer-portal] apply failed:', err)
      return { success: false, message: 'Application failed. Please try again.' }
    }
  }

  async trackClick(referralCode: string, productId: string): Promise<ReferralClick | null> {
    try {
      const influencer = STUB_INFLUENCERS.find(i => i.referralCode === referralCode)
      if (!influencer) return null
      return {
        influencerId: influencer.id,
        referralCode,
        productId,
        clickedAt: new Date().toISOString(),
        converted: false,
        commissionEarned: 0,
      }
    } catch (err) {
      console.warn('[influencer-portal] trackClick failed:', err)
      return null
    }
  }

  generateReferralCode(name: string, rate: number): string {
    const prefix = name.split(' ')[0].toUpperCase().slice(0, 6)
    return `${prefix}${rate}`
  }
}

export const influencerPortal = new InfluencerPortal()
