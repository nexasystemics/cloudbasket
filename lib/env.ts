// © 2026 NEXQON HOLDINGS — CloudBasket env.ts
// lib/env.ts — Environment variables — typed interface for all Set A through Set F variables.
// All variables have safe fallbacks — missing keys log warnings, never crash.

if (typeof window === 'undefined') {
  const required = ['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_ANON_KEY','NEXT_PUBLIC_SITE_URL']
  required.forEach(v => { if (!process.env[v]) console.warn(`[env] WARNING: Missing: ${v}`) })
}

export const env = {
  NEXT_PUBLIC_SUPABASE_URL:        process.env.NEXT_PUBLIC_SUPABASE_URL        || '',
  NEXT_PUBLIC_SUPABASE_ANON_KEY:   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY   || '',
  SUPABASE_SERVICE_ROLE_KEY:       process.env.SUPABASE_SERVICE_ROLE_KEY        || '',
  NEXT_PUBLIC_SITE_URL:            process.env.NEXT_PUBLIC_SITE_URL             || 'https://cloudbasket.in',
  INTERNAL_API_KEY:                process.env.INTERNAL_API_KEY                 || '',
  CRON_SECRET:                     process.env.CRON_SECRET                      || '',
  NEXT_PUBLIC_GA_ID:               process.env.NEXT_PUBLIC_GA_ID                || '',
  NEXT_PUBLIC_GTM_ID:              process.env.NEXT_PUBLIC_GTM_ID               || '',
  NEXT_PUBLIC_COOKIEYES_ID:        process.env.NEXT_PUBLIC_COOKIEYES_ID         || '',
  NEXT_PUBLIC_CLARITY_ID:          process.env.NEXT_PUBLIC_CLARITY_ID           || '',
  NEXT_PUBLIC_FB_PIXEL_ID:         process.env.NEXT_PUBLIC_FB_PIXEL_ID          || '',
  AMAZON_ACCESS_KEY:               process.env.AMAZON_ACCESS_KEY                || '',
  AMAZON_SECRET_KEY:               process.env.AMAZON_SECRET_KEY                || '',
  AMAZON_ASSOCIATE_TAG:            process.env.AMAZON_ASSOCIATE_TAG             || 'cloudbasket-21',
  AMAZON_REGION:                   process.env.AMAZON_REGION                    || 'us-east-1',
  FLIPKART_AFFILIATE_ID:           process.env.FLIPKART_AFFILIATE_ID            || '',
  FLIPKART_AFFILIATE_TOKEN:        process.env.FLIPKART_AFFILIATE_TOKEN         || '',
  FLIPKART_AFFID:                  process.env.FLIPKART_AFFID                   || '',
  CJ_API_KEY:                      process.env.CJ_API_KEY                       || '',
  CJ_PID:                          process.env.CJ_PID                           || '',
  CJ_WEBSITE_ID:                   process.env.CJ_WEBSITE_ID                    || '',
  NEXT_PUBLIC_ADSENSE_CLIENT:      process.env.NEXT_PUBLIC_ADSENSE_CLIENT       || '',
  ADSENSE_SLOT_1:                  process.env.ADSENSE_SLOT_1                   || '',
  ADSENSE_SLOT_2:                  process.env.ADSENSE_SLOT_2                   || '',
  ADSENSE_SLOT_3:                  process.env.ADSENSE_SLOT_3                   || '',
  GEMINI_API_KEY:                  process.env.GEMINI_API_KEY                   || '',
  RESEND_API_KEY:                  process.env.RESEND_API_KEY                   || '',
  WHATSAPP_ACCESS_TOKEN:           process.env.WHATSAPP_ACCESS_TOKEN            || '',
  WHATSAPP_PHONE_NUMBER_ID:        process.env.WHATSAPP_PHONE_NUMBER_ID         || '',
  WHATSAPP_VERIFY_TOKEN:           process.env.WHATSAPP_VERIFY_TOKEN            || '',
  RAZORPAY_KEY_ID:                 process.env.RAZORPAY_KEY_ID                  || '',
  RAZORPAY_KEY_SECRET:             process.env.RAZORPAY_KEY_SECRET              || '',
  NEXT_PUBLIC_RAZORPAY_KEY_ID:     process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID      || '',
  MSG91_AUTH_KEY:                  process.env.MSG91_AUTH_KEY                   || '',
  MSG91_OTP_TEMPLATE_ID:           process.env.MSG91_OTP_TEMPLATE_ID            || '',
  NEXT_PUBLIC_VAPID_PUBLIC_KEY:    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY     || '',
  VAPID_PRIVATE_KEY:               process.env.VAPID_PRIVATE_KEY                || '',
  VAPID_EMAIL:                     process.env.VAPID_EMAIL                      || 'admin@cloudbasket.in',
  YOUTUBE_API_KEY:                 process.env.YOUTUBE_API_KEY                  || '',
  GOOGLE_SERVICE_ACCOUNT_JSON:     process.env.GOOGLE_SERVICE_ACCOUNT_JSON      || '',
  SEARCH_CONSOLE_SITE_URL:         process.env.SEARCH_CONSOLE_SITE_URL          || 'https://cloudbasket.in',
  SELLER_GSTIN:                    process.env.SELLER_GSTIN                     || '',
  SELLER_STATE_CODE:               process.env.SELLER_STATE_CODE                || '29',
  SUPABASE_STORAGE_BUCKET:         process.env.SUPABASE_STORAGE_BUCKET          || 'product-images',
  PRINTIFY_API_KEY:                process.env.PRINTIFY_API_KEY                 || '',
  PRINTIFY_SHOP_ID:                process.env.PRINTIFY_SHOP_ID                 || '',
  PRINTIFY_WEBHOOK_SECRET:         process.env.PRINTIFY_WEBHOOK_SECRET          || '',
  PRINTFUL_API_KEY:                process.env.PRINTFUL_API_KEY                 || '',
  PRINTFUL_STORE_ID:               process.env.PRINTFUL_STORE_ID                || '',
  PRINTFUL_WEBHOOK_SECRET:         process.env.PRINTFUL_WEBHOOK_SECRET          || '',
  ETSY_API_KEY:                    process.env.ETSY_API_KEY                     || '',
  ETSY_SHARED_SECRET:              process.env.ETSY_SHARED_SECRET               || '',
  ETSY_REDIRECT_URI:               process.env.ETSY_REDIRECT_URI                || '',
  SHOPIFY_STORE_DOMAIN:            process.env.SHOPIFY_STORE_DOMAIN             || '',
  SHOPIFY_STOREFRONT_TOKEN:        process.env.SHOPIFY_STOREFRONT_TOKEN         || '',
  SHOPIFY_ADMIN_TOKEN:             process.env.SHOPIFY_ADMIN_TOKEN              || '',
  SHOPIFY_WEBHOOK_SECRET:          process.env.SHOPIFY_WEBHOOK_SECRET           || '',
  OPENAI_API_KEY:                  process.env.OPENAI_API_KEY                   || '',
  STABILITY_API_KEY:               process.env.STABILITY_API_KEY                || '',
  REMOVE_BG_API_KEY:               process.env.REMOVE_BG_API_KEY                || '',
  REPLICATE_API_TOKEN:             process.env.REPLICATE_API_TOKEN              || '',
  NEXT_PUBLIC_PLAY_STORE_URL:      process.env.NEXT_PUBLIC_PLAY_STORE_URL       || '',
  FRESHDESK_API_KEY:               process.env.FRESHDESK_API_KEY                || '',
  FRESHDESK_DOMAIN:                process.env.FRESHDESK_DOMAIN                 || '',
  FRESHDESK_WEBHOOK_SECRET:        process.env.FRESHDESK_WEBHOOK_SECRET         || '',
  HUBSPOT_API_KEY:                 process.env.HUBSPOT_API_KEY                  || '',
  HUBSPOT_APP_ID:                  process.env.HUBSPOT_APP_ID                   || '',
  ZOHO_ACCESS_TOKEN:               process.env.ZOHO_ACCESS_TOKEN                || '',
  ZOHO_CLIENT_ID:                  process.env.ZOHO_CLIENT_ID                   || '',
  ZOHO_CLIENT_SECRET:              process.env.ZOHO_CLIENT_SECRET               || '',
  GOOGLE_CLIENT_ID:                process.env.GOOGLE_CLIENT_ID                 || '',
  GOOGLE_CLIENT_SECRET:            process.env.GOOGLE_CLIENT_SECRET             || '',
  GITHUB_CLIENT_ID:                process.env.GITHUB_CLIENT_ID                 || '',
  GITHUB_CLIENT_SECRET:            process.env.GITHUB_CLIENT_SECRET             || '',
  MICROSOFT_CLIENT_ID:             process.env.MICROSOFT_CLIENT_ID              || '',
} as const

export type Env = typeof env

export function isConfigured(key: keyof Env): boolean {
  const val = env[key]
  return typeof val === 'string' && val.length > 0 && !val.startsWith('your_') && !val.includes('pending')
}

export function hasSupabase(): boolean {
  return isConfigured('NEXT_PUBLIC_SUPABASE_URL') && isConfigured('NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export default env
