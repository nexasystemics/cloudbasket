// © 2026 NEXQON HOLDINGS — CloudBasket validation.ts
// lib/validation.ts — Shared Zod schemas for API route request validation.
// Import the schema you need and call .safeParse(body) before touching any data.

import { z } from 'zod'

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

export const emailSchema = z
  .string({ error: 'email is required' })
  .trim()
  .min(1, 'email is required')
  .email('Invalid email address')
  .max(254, 'Email too long')
  .toLowerCase()

export const phoneIndiaSchema = z
  .string({ error: 'phoneNumber is required' })
  .trim()
  .min(1, 'phoneNumber is required')
  .regex(/^(\+91|91)?[6-9]\d{9}$/, 'Invalid Indian phone number (10 digits, starting 6-9)')

export const productIdSchema = z
  .string({ error: 'productId is required' })
  .trim()
  .min(1, 'productId cannot be empty')
  .max(120, 'productId too long')

export const campaignIdSchema = z
  .string({ error: 'campaignId is required' })
  .trim()
  .min(1, 'campaignId cannot be empty')

// ---------------------------------------------------------------------------
// Newsletter
// ---------------------------------------------------------------------------

export const newsletterSubscribeSchema = z.object({
  email: emailSchema,
  preferences: z.record(z.string(), z.unknown()).optional(),
})
export type NewsletterSubscribeBody = z.infer<typeof newsletterSubscribeSchema>

// ---------------------------------------------------------------------------
// Search / currency query params
// ---------------------------------------------------------------------------

export const amazonSearchQuerySchema = z.object({
  q: z.string().trim().min(1, 'q is required').max(200, 'q too long'),
  category: z.string().trim().min(1).max(100, 'category too long').optional().default('All'),
})
export type AmazonSearchQuery = z.infer<typeof amazonSearchQuerySchema>

export const flipkartSearchQuerySchema = z.object({
  q: z.string().trim().min(1, 'q is required').max(200, 'q too long'),
  category: z.string().trim().min(1, 'category cannot be empty').max(100, 'category too long').optional(),
})
export type FlipkartSearchQuery = z.infer<typeof flipkartSearchQuerySchema>

export const currencyRatesQuerySchema = z.object({
  base: z.literal('INR').optional().default('INR'),
})
export type CurrencyRatesQuery = z.infer<typeof currencyRatesQuerySchema>

// ---------------------------------------------------------------------------
// OTP
// ---------------------------------------------------------------------------

export const otpSendSchema = z.object({
  identifier: z.string({ error: 'identifier is required' }).trim().min(1, 'identifier is required'),
  type: z.enum(['email', 'sms'], { error: 'type must be email or sms' }),
})
export type OtpSendBody = z.infer<typeof otpSendSchema>

export const otpVerifySchema = z.object({
  identifier: z.string({ error: 'identifier is required' }).trim().min(1, 'identifier is required'),
  code: z.string({ error: 'code is required' }).trim().length(6, 'OTP must be 6 digits'),
})
export type OtpVerifyBody = z.infer<typeof otpVerifySchema>

// ---------------------------------------------------------------------------
// Revenue / attribution
// ---------------------------------------------------------------------------

export const revenueClickSchema = z.object({
  productId: productIdSchema,
  platform: z.string().optional(),
  price: z.number().positive().optional(),
  estimatedCommission: z.number().nonnegative().optional(),
  sessionId: z.string().max(128).optional(),
  pageUrl: z.string().max(2048).optional(),
  clickedAt: z.string().datetime().optional(),
})
export type RevenueClickBody = z.infer<typeof revenueClickSchema>

// ---------------------------------------------------------------------------
// Push notifications
// ---------------------------------------------------------------------------

export const pushSubscribeSchema = z.object({
  endpoint: z.string({ error: 'endpoint is required' }).trim().url('endpoint must be a valid URL'),
  keys: z.object({
    p256dh: z.string({ error: 'keys.p256dh is required' }).trim().min(1, 'keys.p256dh is required'),
    auth: z.string({ error: 'keys.auth is required' }).trim().min(1, 'keys.auth is required'),
  }),
  userId: z.string().optional(),
})
export type PushSubscribeBody = z.infer<typeof pushSubscribeSchema>

// ---------------------------------------------------------------------------
// Price tracker
// ---------------------------------------------------------------------------

export const priceTrackerPostSchema = z.object({
  productId: productIdSchema,
  price: z.number({ error: 'price is required' }).positive('price must be positive'),
  platform: z.string().max(64).optional(),
})
export type PriceTrackerPostBody = z.infer<typeof priceTrackerPostSchema>

// ---------------------------------------------------------------------------
// Email alerts
// ---------------------------------------------------------------------------

export const emailSendAlertSchema = z.object({
  email: emailSchema,
  productName: z.string({ error: 'productName is required' }).trim().min(1, 'productName is required').max(300),
  productImage: z.string().max(2048).optional(),
  newPrice: z.number().positive(),
  oldPrice: z.number().positive(),
  affiliateUrl: z.string().max(2048).optional().default(''),
  platform: z.string().max(64).optional().default('amazon'),
})
export type EmailSendAlertBody = z.infer<typeof emailSendAlertSchema>

// ---------------------------------------------------------------------------
// Associates
// ---------------------------------------------------------------------------

export const associatesApplySchema = z.object({
  name: z.string({ error: 'name is required' }).trim().min(2, 'name is required').max(120),
  email: emailSchema,
  websiteUrl: z.string({ error: 'websiteUrl is required' }).trim().url('Invalid website URL'),
  phone: z.string().trim().optional(),
  category: z.string().trim().optional(),
  monthlyTraffic: z.number().nonnegative().optional(),
})
export type AssociatesApplyBody = z.infer<typeof associatesApplySchema>

// ---------------------------------------------------------------------------
// WhatsApp / SMS subscriptions
// ---------------------------------------------------------------------------

export const whatsappSubscribeSchema = z.object({
  phoneNumber: phoneIndiaSchema,
  consent: z.literal(true, { error: 'Consent is required' }),
  preferences: z.record(z.string(), z.unknown()).optional(),
})
export type WhatsappSubscribeBody = z.infer<typeof whatsappSubscribeSchema>

export const smsSubscribeSchema = z.object({
  mobile: z
    .string({ error: 'mobile is required' })
    .trim()
    .min(1, 'mobile is required')
    .regex(/^[6-9]\d{9}$/, 'Invalid 10-digit Indian mobile number'),
  consent: z.literal(true, { error: 'Consent is required' }),
})
export type SmsSubscribeBody = z.infer<typeof smsSubscribeSchema>

// ---------------------------------------------------------------------------
// Sponsored
// ---------------------------------------------------------------------------

export const sponsoredClickSchema = z.object({
  campaignId: campaignIdSchema,
})
export type SponsoredClickBody = z.infer<typeof sponsoredClickSchema>

export const sponsoredImpressionSchema = z.object({
  campaignId: campaignIdSchema,
  productId: productIdSchema.optional(),
  placement: z.string().max(64).optional(),
})
export type SponsoredImpressionBody = z.infer<typeof sponsoredImpressionSchema>

// ---------------------------------------------------------------------------
// Support tickets
// ---------------------------------------------------------------------------

export const supportTicketSchema = z.object({
  subject: z.string({ error: 'subject is required' }).trim().min(3, 'subject is required').max(200),
  email: emailSchema,
  description: z.string().max(5000).optional(),
  type: z.string().max(64).optional(),
})
export type SupportTicketBody = z.infer<typeof supportTicketSchema>

// ---------------------------------------------------------------------------
// Reviews / UGC
// ---------------------------------------------------------------------------

export const reviewPostSchema = z.object({
  productId: productIdSchema,
  body: z.string({ error: 'body is required' }).trim().min(10, 'Review must be at least 10 characters').max(2000),
  rating: z.number({ error: 'rating is required' }).min(1).max(5),
  author: z.string().max(80).optional(),
  source: z.enum(['amazon', 'flipkart', 'internal']).optional().default('internal'),
})
export type ReviewPostBody = z.infer<typeof reviewPostSchema>

export const ugcPostSchema = z.object({
  productId: productIdSchema,
  content: z.string({ error: 'content is required' }).trim().min(20, 'Content must be at least 20 characters').max(5000),
  type: z.string().max(64).optional(),
})
export type UgcPostBody = z.infer<typeof ugcPostSchema>

// ---------------------------------------------------------------------------
// CRM
// ---------------------------------------------------------------------------

export const crmContactSchema = z.object({
  email: emailSchema,
  name: z.string().max(120).optional(),
  phone: z.string().max(20).optional(),
  source: z.string().max(64).optional(),
})
export type CrmContactBody = z.infer<typeof crmContactSchema>

// ---------------------------------------------------------------------------
// POD / AI
// ---------------------------------------------------------------------------

export const podAiGenerateSchema = z.object({
  prompt: z.string({ error: 'prompt is required' }).trim().min(3, 'Prompt too short').max(1000),
  style: z.string().max(64).optional(),
  generator: z.enum(['dalle', 'stability']).optional().default('stability'),
})
export type PodAiGenerateBody = z.infer<typeof podAiGenerateSchema>

// ---------------------------------------------------------------------------
// Analytics / Ads
// ---------------------------------------------------------------------------

export const adsAnalyticsSchema = z.object({
  impressions: z.number({ error: 'impressions is required' }).int().nonnegative(),
  sessionId: z.string().max(128).optional(),
  pageUrl: z.string().max(2048).optional(),
  recordedAt: z.string().datetime().optional(),
})
export type AdsAnalyticsBody = z.infer<typeof adsAnalyticsSchema>

// ---------------------------------------------------------------------------
// CJ Commission tracking
// ---------------------------------------------------------------------------

export const cjTrackSchema = z.object({
  orderId: z.string({ error: 'orderId is required' }).trim().min(1, 'orderId is required').max(128),
  amount: z.number({ error: 'amount is required' }).positive(),
  advertiserId: z.string({ error: 'advertiserId is required' }).trim().min(1, 'advertiserId is required').max(64),
})
export type CjTrackBody = z.infer<typeof cjTrackSchema>

// ---------------------------------------------------------------------------
// Product search (unified — amazon / flipkart / all)
// ---------------------------------------------------------------------------

export const productSearchQuerySchema = z.object({
  q:        z.string().trim().min(1, 'q is required').max(200, 'q too long'),
  category: z.string().trim().max(100).optional(),
  platform: z.enum(['amazon', 'flipkart', 'all']).optional().default('all'),
})
export type ProductSearchQuery = z.infer<typeof productSearchQuerySchema>

// ---------------------------------------------------------------------------
// Affiliate redirect
// ---------------------------------------------------------------------------

export const affiliateRedirectSchema = z.object({
  url:       z.string({ error: 'url is required' }).trim().url('url must be a valid URL').max(2048, 'url too long'),
  productId: productIdSchema.optional(),
  platform:  z.string().max(64).optional(),
})
export type AffiliateRedirectQuery = z.infer<typeof affiliateRedirectSchema>

// ---------------------------------------------------------------------------
// Utility: format Zod errors into a flat messages string
// ---------------------------------------------------------------------------

export function zodError(error: z.ZodError): string {
  return error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ')
}
