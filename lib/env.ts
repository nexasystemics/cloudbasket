/**
 * lib/env.ts
 * Environment variables — typed interface for all Set A through Set D variables.
 * All variables have safe fallbacks — missing keys log warnings, never crash.
 * Wire real values in .env.local and Vercel dashboard before production deploy.
 */

if (typeof window === 'undefined') {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_SITE_URL',
  ]
  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      console.warn(`[lib/env] WARNING: Missing environment variable: ${envVar}`)
    }
  })
}

export const env = {
  // ── CORE ─────────────────────────────────────────────────────────────────
  NEXT_PUBLIC_SUPABASE_URL:       process.env.NEXT_PUBLIC_SUPABASE_URL       || '',
  NEXT_PUBLIC_SUPABASE_ANON_KEY:  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY  || '',
  SUPABASE_SERVICE_ROLE_KEY:      process.env.SUPABASE_SERVICE_ROLE_KEY       || '',
  NEXT_PUBLIC_SITE_URL:           process.env.NEXT_PUBLIC_SITE_URL            || 'https://cloudbasket.in',
  INTERNAL_API_KEY:               process.env.INTERNAL_API_KEY                || '',
  CRON_SECRET:                    process.env.CRON_SECRET                     || '',

  // ── ANALYTICS ────────────────────────────────────────────────────────────
  NEXT_PUBLIC_GA_ID:              process.env.NEXT_PUBLIC_GA_ID               || '',
  NEXT_PUBLIC_GTM_ID:             process.env.NEXT_PUBLIC_GTM_ID              || '',
  NEXT_PUBLIC_CLARITY_ID:         process.env.NEXT_PUBLIC_CLARITY_ID          || '',
  NEXT_PUBLIC_FB_PIXEL_ID:        process.env.NEXT_PUBLIC_FB_PIXEL_ID         || '',

  // ── AMAZON PA-API ────────────────────────────────────────────────────────
  AMAZON_ACCESS_KEY:              process.env.AMAZON_ACCESS_KEY               || '',
  AMAZON_SECRET_KEY:              process.env.AMAZON_SECRET_KEY               || '',
  AMAZON_ASSOCIATE_TAG:           process.env.AMAZON_ASSOCIATE_TAG            || 'cloudbasket-21',
  AMAZON_REGION:                  process.env.AMAZON_REGION                   || 'us-east-1',

  // ── FLIPKART AFFILIATE ───────────────────────────────────────────────────
  FLIPKART_AFFILIATE_ID:          process.env.FLIPKART_AFFILIATE_ID           || '',
  FLIPKART_AFFILIATE_TOKEN:       process.env.FLIPKART_AFFILIATE_TOKEN        || '',

  // ── COMMISSION JUNCTION ──────────────────────────────────────────────────
  CJ_API_KEY:                     process.env.CJ_API_KEY                      || '',
  CJ_PID:                         process.env.CJ_PID                          || '',
  CJ_WEBSITE_ID:                  process.env.CJ_WEBSITE_ID                   || '',
  CJ_ADVERTISER_IDS:              process.env.CJ_ADVERTISER_IDS               || '',

  // ── GOOGLE ADSENSE ───────────────────────────────────────────────────────
  NEXT_PUBLIC_ADSENSE_CLIENT:     process.env.NEXT_PUBLIC_ADSENSE_CLIENT      || '',
  ADSENSE_SLOT_1:                 process.env.ADSENSE_SLOT_1                  || '',
  ADSENSE_SLOT_2:                 process.env.ADSENSE_SLOT_2                  || '',
  ADSENSE_SLOT_3:                 process.env.ADSENSE_SLOT_3                  || '',
  ADSENSE_SLOT_4:                 process.env.ADSENSE_SLOT_4                  || '',
  ADSENSE_SLOT_5:                 process.env.ADSENSE_SLOT_5                  || '',
  ADSENSE_SLOT_6:                 process.env.ADSENSE_SLOT_6                  || '',

  // ── AI / GEMINI ──────────────────────────────────────────────────────────
  GEMINI_API_KEY:                 process.env.GEMINI_API_KEY                  || '',

  // ── EMAIL — PLUNK ────────────────────────────────────────────────────────
  PLUNK_API_KEY:                  process.env.PLUNK_API_KEY                   || '',

  // ── WHATSAPP BUSINESS ────────────────────────────────────────────────────
  WHATSAPP_ACCESS_TOKEN:          process.env.WHATSAPP_ACCESS_TOKEN           || '',
  WHATSAPP_PHONE_NUMBER_ID:       process.env.WHATSAPP_PHONE_NUMBER_ID        || '',
  WHATSAPP_VERIFY_TOKEN:          process.env.WHATSAPP_VERIFY_TOKEN           || '',

  // ── RAZORPAY ─────────────────────────────────────────────────────────────
  RAZORPAY_KEY_ID:                process.env.RAZORPAY_KEY_ID                 || '',
  RAZORPAY_KEY_SECRET:            process.env.RAZORPAY_KEY_SECRET             || '',
  NEXT_PUBLIC_RAZORPAY_KEY_ID:    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID     || '',

  // ── MSG91 SMS ────────────────────────────────────────────────────────────
  MSG91_AUTH_KEY:                 process.env.MSG91_AUTH_KEY                  || '',
  MSG91_OTP_TEMPLATE_ID:          process.env.MSG91_OTP_TEMPLATE_ID           || '',
  MSG91_PRICE_ALERT_TEMPLATE_ID:  process.env.MSG91_PRICE_ALERT_TEMPLATE_ID   || '',
  MSG91_SENDER_ID:                process.env.MSG91_SENDER_ID                 || '',

  // ── PUSH NOTIFICATIONS — VAPID ───────────────────────────────────────────
  NEXT_PUBLIC_VAPID_PUBLIC_KEY:   process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY    || '',
  VAPID_PRIVATE_KEY:              process.env.VAPID_PRIVATE_KEY               || '',
  VAPID_EMAIL:                    process.env.VAPID_EMAIL                     || 'admin@cloudbasket.in',

  // ── YOUTUBE ──────────────────────────────────────────────────────────────
  YOUTUBE_API_KEY:                process.env.YOUTUBE_API_KEY                 || '',

  // ── GOOGLE SEARCH CONSOLE ────────────────────────────────────────────────
  GOOGLE_SERVICE_ACCOUNT_JSON:    process.env.GOOGLE_SERVICE_ACCOUNT_JSON     || '',
  SEARCH_CONSOLE_SITE_URL:        process.env.SEARCH_CONSOLE_SITE_URL         || 'https://cloudbasket.in',

  // ── GST / TAX ────────────────────────────────────────────────────────────
  SELLER_GSTIN:                   process.env.SELLER_GSTIN                    || '',
  SELLER_STATE_CODE:              process.env.SELLER_STATE_CODE               || '29',

  // ── STORAGE ──────────────────────────────────────────────────────────────
  SUPABASE_STORAGE_BUCKET:        process.env.SUPABASE_STORAGE_BUCKET         || 'product-images',

  // ── APP STORE ────────────────────────────────────────────────────────────
  NEXT_PUBLIC_PLAY_STORE_URL:     process.env.NEXT_PUBLIC_PLAY_STORE_URL      || '',
} as const

export type Env = typeof env

// ── HELPER: check if a service is configured ─────────────────────────────────
export function isConfigured(key: keyof Env): boolean {
  const val = env[key]
  return typeof val === 'string' && val.length > 0 && !val.includes('pending') && !val.includes('your_')
}

// ── HELPER: get Supabase client safely ───────────────────────────────────────
export function hasSupabase(): boolean {
  return isConfigured('NEXT_PUBLIC_SUPABASE_URL') && isConfigured('NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export default env