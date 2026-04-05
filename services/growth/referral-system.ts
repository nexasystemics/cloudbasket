import { isConfigured, env } from '@/lib/env'

export interface Referral {
  id: string
  referrerId: string
  referrerEmail: string
  refereeEmail: string
  refereeId?: string
  code: string
  status: 'pending' | 'clicked' | 'registered' | 'converted' | 'rewarded'
  rewardType: 'cashback' | 'credits' | 'coupon'
  rewardAmount: number
  referrerReward: number
  refereeReward: number
  createdAt: string
  convertedAt?: string
  rewardedAt?: string
  source: 'share' | 'email' | 'whatsapp' | 'link'
}

export interface ReferralStats {
  totalReferrals: number
  pendingReferrals: number
  convertedReferrals: number
  totalEarned: number
  pendingRewards: number
  conversionRate: number
  topReferrers: TopReferrer[]
}

export interface TopReferrer {
  userId: string
  email: string
  referralCount: number
  convertedCount: number
  totalEarned: number
}

export interface ReferralInvite {
  referrerName: string
  referrerEmail: string
  refereeEmail: string
  referralCode: string
  rewardAmount: number
  channel: 'email' | 'whatsapp'
}

export interface InviteResult {
  success: boolean
  channel: string
}

function generateReferralCode(userId: string): string {
  const base = userId.slice(-6).toUpperCase()
  const suffix = Math.random().toString(36).slice(2, 5).toUpperCase()
  return `CB${base}${suffix}`
}

async function sendReferralEmail(invite: ReferralInvite): Promise<boolean> {
  if (!isConfigured('RESEND_API_KEY')) {
    console.warn('[ReferralSystem] RESEND_API_KEY not configured — skipping email')
    return false
  }

  const siteUrl = env.NEXT_PUBLIC_SITE_URL ?? 'https://cloudbasket.in'
  const referralLink = `${siteUrl}/join?ref=${invite.referralCode}`

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'invite@cloudbasket.in',
        to: invite.refereeEmail,
        subject: `${invite.referrerName} invited you to CloudBasket — Get ₹${invite.rewardAmount} off!`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#fff;">
            <div style="background:linear-gradient(135deg,#f97316,#fb923c);padding:32px;text-align:center;">
              <h1 style="color:white;margin:0;font-size:1.75rem;">You're Invited! 🎁</h1>
            </div>
            <div style="padding:32px;">
              <p style="font-size:1.125rem;">
                <strong>${invite.referrerName}</strong> thinks you'll love CloudBasket — 
                India's smartest price comparison platform.
              </p>
              <div style="background:#fff7ed;border:2px dashed #f97316;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
                <p style="margin:0;color:#6b7280;font-size:0.875rem;">Your Welcome Bonus</p>
                <p style="margin:8px 0;font-size:2rem;font-weight:bold;color:#f97316;">₹${invite.rewardAmount} OFF</p>
                <p style="margin:0;color:#6b7280;font-size:0.875rem;">on your first purchase</p>
              </div>
              <div style="text-align:center;">
                <a href="${referralLink}" style="
                  display:inline-block;background:#f97316;color:white;
                  padding:14px 32px;border-radius:8px;text-decoration:none;
                  font-weight:bold;font-size:1.125rem;
                ">Claim My ₹${invite.rewardAmount} →</a>
              </div>
              <p style="color:#9ca3af;font-size:0.75rem;text-align:center;margin-top:24px;">
                Valid for new users only. Reward credited after first purchase above ₹499.
              </p>
            </div>
          </div>
        `,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.warn('[ReferralSystem] Resend error:', error)
      return false
    }

    return true
  } catch (err) {
    console.warn('[ReferralSystem] Email invite failed:', err)
    return false
  }
}

async function sendReferralWhatsApp(invite: ReferralInvite): Promise<boolean> {
  if (!isConfigured('WHATSAPP_ACCESS_TOKEN') || !isConfigured('WHATSAPP_PHONE_NUMBER_ID')) {
    console.warn('[ReferralSystem] WhatsApp not configured — skipping')
    return false
  }

  const siteUrl = env.NEXT_PUBLIC_SITE_URL ?? 'https://cloudbasket.in'
  const referralLink = `${siteUrl}/join?ref=${invite.referralCode}`

  const message = [
    `🎁 *${invite.referrerName} invited you to CloudBasket!*`,
    ``,
    `India's smartest price comparison platform.`,
    ``,
    `✅ Get *₹${invite.rewardAmount} OFF* your first purchase!`,
    ``,
    `Join now: ${referralLink}`,
    ``,
    `_Valid for new users only_`,
  ].join('\n')

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: invite.refereeEmail,
          type: 'text',
          text: { body: message },
        }),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.warn('[ReferralSystem] WhatsApp error:', error)
      return false
    }

    return true
  } catch (err) {
    console.warn('[ReferralSystem] WhatsApp invite failed:', err)
    return false
  }
}

export async function sendReferralInvite(invite: ReferralInvite): Promise<InviteResult> {
  let success = false

  if (invite.channel === 'email') {
    success = await sendReferralEmail(invite)
  } else if (invite.channel === 'whatsapp') {
    success = await sendReferralWhatsApp(invite)
  }

  return { success, channel: invite.channel }
}

export function createReferral(params: {
  referrerId: string
  referrerEmail: string
  refereeEmail: string
  source: Referral['source']
}): Referral {
  return {
    id: crypto.randomUUID(),
    referrerId: params.referrerId,
    referrerEmail: params.referrerEmail,
    refereeEmail: params.refereeEmail,
    code: generateReferralCode(params.referrerId),
    status: 'pending',
    rewardType: 'cashback',
    rewardAmount: 200,
    referrerReward: 100,
    refereeReward: 200,
    createdAt: new Date().toISOString(),
    source: params.source,
  }
}

export function getReferralStats(referrals: Referral[]): ReferralStats {
  const converted = referrals.filter(
    (r) => r.status === 'converted' || r.status === 'rewarded'
  )
  const rewarded = referrals.filter((r) => r.status === 'rewarded')
  const totalEarned = rewarded.reduce((sum, r) => sum + r.referrerReward, 0)
  const pending = referrals.filter((r) => r.status === 'converted' && !r.rewardedAt)
  const pendingRewards = pending.reduce((sum, r) => sum + r.referrerReward, 0)

  const referrerMap = new Map<string, TopReferrer>()

  for (const r of referrals) {
    const existing: TopReferrer = referrerMap.get(r.referrerId) ?? {
      userId: r.referrerId,
      email: r.referrerEmail,
      referralCount: 0,
      convertedCount: 0,
      totalEarned: 0,
    }
    existing.referralCount++
    if (r.status === 'converted' || r.status === 'rewarded') existing.convertedCount++
    if (r.status === 'rewarded') existing.totalEarned += r.referrerReward
    referrerMap.set(r.referrerId, existing)
  }

  const topReferrers = [...referrerMap.values()]
    .sort((a, b) => b.convertedCount - a.convertedCount)
    .slice(0, 10)

  return {
    totalReferrals: referrals.length,
    pendingReferrals: referrals.filter((r) => r.status === 'pending').length,
    convertedReferrals: converted.length,
    totalEarned,
    pendingRewards,
    conversionRate:
      referrals.length > 0
        ? Math.round((converted.length / referrals.length) * 100)
        : 0,
    topReferrers,
  }
}

export function getReferralLink(code: string): string {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL ?? 'https://cloudbasket.in'
  return `${siteUrl}/join?ref=${code}`
}
