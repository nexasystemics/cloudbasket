# CLOUDBASKET — DEVELOPER HANDOVER PASSPORT
## Version 2.0 | March 2026 | NEXQON HOLDINGS
### ⚡ READ THIS FIRST — NO QUESTIONS NEEDED — BUILD FROM HERE

---

## 🔴 CRITICAL RULES FOR NEW CLAUDE SESSION

1. **RFC = Rule Full Code** — Always provide complete file replacements. Never patches. Never "find and replace this line". Always full file.
2. **PowerShell only** — Windows machine. No bash. No Linux commands.
3. **VS Code paste method** — `code "F:\path\file.tsx"` → Ctrl+A → paste → Ctrl+S
4. **pnpm build** after every 2-3 files. Fix errors before moving on.
5. **git add -A ; git commit -m "..." ; git push origin main** after every passing build.
6. **No questions** — all project info is in this document. Build directly.
7. **Bracket paths** use `-LiteralPath` flag in PowerShell e.g. `Get-Content -LiteralPath "F:\cloudbasket\app\product\[id]\page.tsx"`

---

## 📁 PROJECT LOCATION

```
F:\cloudbasket
```

- **Framework:** Next.js 16.1.6 (Turbopack)
- **Package manager:** pnpm
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS
- **Database:** Supabase (local: http://127.0.0.1:54321)
- **Repo:** https://github.com/nexasystemics/cloudbasket (branch: main)
- **Last commit:** 0749e05
- **Build status:** ✅ PASSING — 1,200+ static pages

---

## 🏢 COMPANY INFO

- **Company:** NEXQON HOLDINGS
- **Platform:** CloudBasket — India's Smartest Price Comparison Platform
- **Domain:** cloudbasket.in
- **Model:** Hybrid — Affiliate aggregator + Print-on-Demand + Associates + Sponsored Listings
- **Market:** India (primary), Global (secondary)
- **Amazon tag:** cloudbasket-21

---

## 🗝️ ENVIRONMENT VARIABLES (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJ... (exists)
NEXT_PUBLIC_SITE_URL=https://cloudbasket.co
MAINTENANCE_MODE=false
AMAZON_ASSOCIATE_TAG=cloudbasket-21
FLIPKART_AFFID=cb-flipkart-pending
CJ_PUBLISHER_ID=cb-cj-pending
PLUNK_API_KEY=your_plunk_api_key_here
DATABASE_URL=postgresql://... (exists)
```

**All other env vars** are typed in `lib/env.ts` with empty string fallbacks — stub-safe. Wire real keys later.

---

## 📊 COMPLETE PROMPT REGISTRY — BUILD STATUS

### SET A — India Catalog (ALL DONE ✅)
| # | Title | Status | Commit |
|---|-------|--------|--------|
| A01-A20 | India Catalog 1000 products, 10 brands, 5 categories | ✅ Done | 538ba3e |

**Result:** 1,000 products across HUL, Dabur, ITC, Godrej, Bajaj, Havells, Philips, Prestige, boAt, Noise, realme, Samsung, Puma, Biba

---

### SET B — Platform Features (ALL DONE ✅)
| # | Title | Status | Commit |
|---|-------|--------|--------|
| P08-P20 | Dark mode, Analytics, Blog, Wishlist, Compare, CJ, i18n, PWA, Admin, Email, Lighthouse, Deploy, Audit | ✅ Done | 6ce1dab |

---

### SET C — UI/UX Supreme (ALL DONE ✅)
| # | Title | Status | Commit |
|---|-------|--------|--------|
| C01 | Design System Tokens | ✅ | 280802e |
| C02 | Logo SVG System + OG Image | ✅ | 280802e |
| C03 | Dark Mode Complete | ✅ | e1b7eea |
| C04 | Typography System (Inter font) | ✅ | e1b7eea |
| C05 | Terms of Service page | ✅ | e1b7eea |
| C06 | Privacy Policy (DPDP 2023) | ✅ | db52fa9 |
| C07 | Cookie Policy + Consent Banner | ✅ | db52fa9 |
| C08 | Affiliate Disclosure + Legal Hub | ✅ | db52fa9 |
| C09 | Associates Program page | ✅ | db52fa9 |
| C10 | Partners page | ✅ | db52fa9 |
| C11 | ProductSpecifications component | ✅ | db52fa9 |
| C12 | Compare page (done in P11) | ✅ | edcbe49 |
| C13 | About Us page | ✅ | db52fa9 |
| C14 | Contact page | ✅ | existing |
| C15 | FAQ comprehensive rebuild | ✅ | db52fa9 |
| C16 | Search enhancement (done P08-P13) | ✅ | edcbe49 |
| C17 | Product Detail (done A13) | ✅ | 892beb3 |
| C18 | HomeBlogSection component | ✅ | db52fa9 |
| C19 | MegaMenu component | ✅ | db52fa9 |
| C20 | POD SizeGuide component | ✅ | db52fa9 |
| C21 | Blog System SEO | ✅ | 0f3765b |
| C22 | DealOfTheDay component | ✅ | 0f3765b |
| C23 | Dashboard Enhanced | ✅ | 0f3765b |
| C24 | Careers page with modal | ✅ | 0f3765b |
| C25 | App Landing page (/app) | ✅ | 0f3765b |
| C26 | Sitemap Visual page | ✅ | 0f3765b |
| C27 | 404 + error.tsx | ✅ | 0f3765b |
| C28 | Skeleton components | ✅ | 0f3765b |
| C29 | India Catalog 2 (15 products stub) | ✅ | 0f3765b |
| C30 | Brand Data + Brands Directory | ✅ | 0f3765b |
| C31 | PriceHistoryChart SVG | ✅ | 0f3765b |
| C32 | Notifications Store | ✅ | 0f3765b |
| C33 | Share System + ShareButton | ✅ | 0f3765b |
| C34 | Admin SEO + Email + Settings pages | ✅ | 0f3765b |
| C35 | Web Vitals + Performance Dashboard | ✅ | 0f3765b |
| C36 | i18n Translations (en-IN + hi-IN) | ✅ | 0f3765b |
| C37 | ReferralWidget | ✅ | 0f3765b |
| C38 | Image Utils | ✅ | 0f3765b |
| C39 | SEO Landing pages (best-deals, sale) | ✅ | 0f3765b |
| C40 | Launch Readiness Report | ✅ | 0f3765b |

---

### SET D — APIs and Automation (5/50 done)

| # | Title | Status | Commit |
|---|-------|--------|--------|
| D01 | Amazon PA-API v5 + AWS Sig V4 | ✅ | 0749e05 |
| D02 | Flipkart Affiliate API | ✅ | 0749e05 |
| D03 | Commission Junction API | ✅ | 0749e05 |
| D04 | AdSense Placement Engine | ✅ | 0749e05 |
| D05 | Gemini Description Generator | ✅ | 0749e05 |
| D06 | Automated Blog Content Pipeline | ⏳ NEXT | — |
| D07 | Product Review Aggregation | ⏳ | — |
| D08 | Price Intelligence Engine | ⏳ | — |
| D09 | Automated SEO Updater | ⏳ | — |
| D10 | Deal Discovery Automation | ⏳ | — |
| D11 | Affiliate Link Health Monitor | ⏳ | — |
| D12 | Open Food Facts API | ⏳ | — |
| D13 | UGC Community System | ⏳ | — |
| D14 | Email Marketing Pipeline | ⏳ | — |
| D15 | Real-Time Stock Monitor | ⏳ | — |
| D16 | Google Search Console API | ⏳ | — |
| D17 | Automated Sitemap Manager | ⏳ | — |
| D18 | CRO Conversion Tracker | ⏳ | — |
| D19 | Associates Program Backend | ⏳ | — |
| D20 | Sponsored Listings System | ⏳ | — |
| D21 | WhatsApp Business API | ⏳ | — |
| D22 | Razorpay POD Payment | ⏳ | — |
| D23 | Social Media Content Pipeline | ⏳ | — |
| D24 | Catalog Sync Automation | ⏳ | — |
| D25 | Revenue Attribution Engine | ⏳ | — |
| D26 | Price Alert Email (Plunk) | ⏳ | — |
| D27 | Google Tag Manager | ⏳ | — |
| D28 | Microsoft Clarity | ⏳ | — |
| D29 | Competitive Intelligence | ⏳ | — |
| D30 | Push Notifications (VAPID) | ⏳ | — |
| D31 | Image CDN Pipeline | ⏳ | — |
| D32 | Schema Validator | ⏳ | — |
| D33 | Broken Link Finder | ⏳ | — |
| D34 | Content Freshness Monitor | ⏳ | — |
| D35 | A/B Test Auto-Deploy | ⏳ | — |
| D36 | Customer Support Tickets | ⏳ | — |
| D37 | Referral Program Backend | ⏳ | — |
| D38 | Influencer Campaign Tracker | ⏳ | — |
| D39 | SMS via MSG91 | ⏳ | — |
| D40 | Google Merchant Center Feed | ⏳ | — |
| D41 | Facebook Pixel + Catalogue | ⏳ | — |
| D42 | Competitive Price Monitoring | ⏳ | — |
| D43 | YouTube Video Integration | ⏳ | — |
| D44 | Voice Search Optimisation | ⏳ | — |
| D45 | GST Compliance for POD | ⏳ | — |
| D46 | Multi-Currency Display | ⏳ | — |
| D47 | Newsletter Personalisation AI | ⏳ | — |
| D48 | Cohort Analysis System | ⏳ | — |
| D49 | Daily Deal Email at 9AM IST | ⏳ | — |
| D50 | Platform Health Dashboard | ⏳ | — |

---

### SET E — POD Platform Integrations (0/50)

| # | Title | Status |
|---|-------|--------|
| E01 | Bulk Image Upload Engine | ⏳ |
| E02 | Printify API | ⏳ |
| E03 | Printful API | ⏳ |
| E04 | Etsy Integration | ⏳ |
| E05 | Shopify Integration | ⏳ |
| E06 | Amazon Merch Integration | ⏳ |
| E07 | Redbubble Integration | ⏳ |
| E08 | Cross-Platform Sync Engine | ⏳ |
| E09 | AI Design Generator (DALL-E + Stability) | ⏳ |
| E10 | Design Library + Asset Management | ⏳ |
| E11 | Mockup Generator Pipeline | ⏳ |
| E12 | POD Order Manager | ⏳ |
| E13 | POD Pricing Engine | ⏳ |
| E14 | POD Website Integration | ⏳ |
| E15 | Multi-Platform Listing Manager | ⏳ |
| E16 | Print Quality Processor | ⏳ |
| E17 | POD Analytics Dashboard | ⏳ |
| E18 | POD Listing SEO Optimiser | ⏳ |
| E19 | POD Review Collector | ⏳ |
| E20 | Integration Test Suite | ⏳ |
| E21 | Seasonal Campaign Manager | ⏳ |
| E22 | Design Trend Analyser | ⏳ |
| E23 | Bundle Creator | ⏳ |
| E24 | Gift Card System | ⏳ |
| E25 | Size Chart Generator | ⏳ |
| E26 | B2B Bulk Order System | ⏳ |
| E27 | Currency Hedging POD | ⏳ |
| E28 | POD Recommendation Engine | ⏳ |
| E29 | Bulk Title/Tag Generator | ⏳ |
| E30 | Artist Affiliate Program | ⏳ |
| E31 | Cloudflare CDN | ⏳ |
| E32 | Rate Limiting + DDoS | ⏳ |
| E33 | Database Backup | ⏳ |
| E34 | Multi-Region Deployment | ⏳ |
| E35 | API Gateway | ⏳ |
| E36 | Webhook Manager | ⏳ |
| E37 | SSL Security Audit | ⏳ |
| E38 | Redis Caching | ⏳ |
| E39 | Real-Time WebSocket Dashboard | ⏳ |
| E40 | Log Analysis | ⏳ |
| E41 | GraphQL API | ⏳ |
| E42 | Mobile App API (React Native) | ⏳ |
| E43 | Offline-First PWA Sync | ⏳ |
| E44 | Biometric Auth PWA | ⏳ |
| E45 | QR Code Generator | ⏳ |
| E46 | Barcode Scanner | ⏳ |
| E47 | AR Product Preview (WebXR) | ⏳ |
| E48 | Competitor Monitor Alerts | ⏳ |
| E49 | Search Query Intelligence | ⏳ |
| E50 | System Handoff Documentation | ⏳ |

---

### SET F — Final 100 Prompts (0/100 — TO BE CREATED)
Covers: CRM, Auth (Google/Microsoft/OTP), User Panel, Associate Panel, Affiliate Panel, Investor/CJ Panel, Admin Panel, Desktop .exe App, Biometric Login, App Lock, Favicon all sizes, Legal docs (ToS/Privacy/Cookie full text), Email OTP, Face scan, Fingerprint, All settings, PWA full, Mobile app, Cloudflare, All legal pages open in new tab as PDF downloadable

---

## 📁 KEY FILE LOCATIONS

```
F:\cloudbasket\
├── app/
│   ├── layout.tsx              ← Root layout, ThemeProvider, LocaleProvider
│   ├── page.tsx                ← Homepage
│   ├── globals.css             ← Global styles + CSS vars
│   ├── admin/                  ← All admin pages
│   ├── api/                    ← All API routes
│   ├── product/[id]/           ← Product detail (use -LiteralPath)
│   ├── pod/                    ← POD store pages
│   ├── legal/                  ← Legal pages (terms, privacy, etc)
│   ├── associates/             ← Associates program
│   ├── partners/               ← Partners page
│   ├── blog/                   ← Blog listing + posts
│   ├── deals/                  ← Deals + flash sale
│   ├── dashboard/              ← User dashboard
│   ├── careers/                ← Careers page
│   └── brand/[brandName]/      ← Brand pages
├── components/
│   ├── Header.tsx              ← Navigation
│   ├── Footer.tsx              ← Footer
│   ├── ProductCard.tsx         ← Product card
│   ├── HeroSection.tsx         ← Homepage hero
│   ├── ThemeProvider.tsx       ← Dark mode
│   ├── CookieConsent.tsx       ← Cookie banner
│   ├── MegaMenu.tsx            ← Mega navigation
│   ├── ShareButton.tsx         ← Social sharing
│   ├── DealOfTheDay.tsx        ← Deal countdown
│   ├── ads/                    ← AdSense components
│   ├── brand/Logo.tsx          ← CloudBasket SVG logo
│   ├── pod/                    ← POD components
│   ├── skeletons/              ← Loading skeletons
│   └── ui/Typography.tsx       ← Typography system
├── lib/
│   ├── env.ts                  ← ALL env vars typed here
│   ├── cloudbasket-data.ts     ← Main product catalog
│   ├── india-catalog/          ← 1000 India products
│   ├── india-catalog-2/        ← 15 products (stub, expand to 1000)
│   ├── design-system/          ← Design tokens
│   ├── brand-data.ts           ← Brand descriptions
│   ├── share.ts                ← Social sharing utils
│   ├── notifications-store.ts  ← Notification system
│   ├── web-vitals.ts           ← Performance tracking
│   ├── image-utils.ts          ← Image URL utils
│   ├── deals-engine.ts         ← Deals generation
│   ├── aws-signature.ts        ← AWS V4 signing
│   └── adsense/                ← AdSense placement
├── services/
│   ├── apis/
│   │   ├── amazon-pa-api.ts    ← Amazon API (stub)
│   │   ├── flipkart-affiliate.ts ← Flipkart API (stub)
│   │   ├── flipkart-sync.ts    ← Flipkart sync
│   │   └── cj-api.ts           ← CJ API (stub)
│   ├── content/
│   │   └── description-generator.ts ← Gemini AI
│   ├── affiliate-engine/       ← Existing affiliate logic
│   ├── price-engine/           ← Price tracking
│   └── email-engine/           ← Email (Plunk)
├── public/
│   ├── brand/og-image.svg      ← OG image
│   └── assets/placeholders/   ← Category SVG placeholders
├── vercel.json                 ← Deployment config
├── DEPLOYMENT.md               ← Deploy guide
├── LAUNCH_READINESS_REPORT.md  ← Launch checklist
├── PROMPTS-STATUS.md           ← Prompt tracker
└── SESSION-2026-03-21.txt      ← Last session backup
```

---

## 🔧 EXISTING SERVICES STRUCTURE

```
services/
├── affiliate-engine/adapters/  ← Amazon, Flipkart, CJ adapters
├── ai-engine/                  ← AI utilities
├── email-engine/
│   ├── plunk-client.ts         ← Plunk email client
│   └── templates/              ← Email HTML templates
├── price-engine/
│   ├── india-apis.ts           ← India price APIs
│   ├── scraper.ts              ← Price scraper
│   └── tracker.ts              ← Price tracking
└── search-engine/              ← Search utilities
```

---

## 🎨 DESIGN SYSTEM

- **Primary Blue:** `#1F4E79` (brand blue)
- **Secondary:** `#039BE5` (skyline primary — used as `text-skyline-primary`)
- **Accent:** `#F59E0B` (amber)
- **Success:** `#10B981`
- **Error:** `#EF4444`
- **Dark bg:** `#0F172A`
- **Card dark:** `#1E293B`

**CSS Variables used in components:**
```css
var(--cb-bg)           /* Page background */
var(--cb-surface-2)    /* Secondary surface */
var(--cb-border)       /* Border color */
var(--cb-text-primary) /* Primary text */
var(--cb-text-muted)   /* Muted text */
var(--cb-text-secondary) /* Secondary text */
```

**Common class patterns:**
```
cb-card          ← Card with border + bg
cb-btn           ← Base button
cb-btn-primary   ← Blue primary button
cb-btn-ghost     ← Ghost button
cb-badge         ← Small badge
cb-badge-blue    ← Blue badge
cb-badge-green   ← Green badge
cb-badge-orange  ← Orange badge
cb-input         ← Form input
```

---

## 📦 PRODUCT CATALOGS

| Catalog | File | Products | Status |
|---------|------|----------|--------|
| Main | `lib/cloudbasket-data.ts` | ~50 | ✅ |
| India | `lib/india-catalog/index.ts` | 1,000 | ✅ |
| India 2 | `lib/india-catalog-2/index.ts` | 15 (stub) | ⚠️ Expand |
| Combined | Via `getIndiaCatalogAsCatalogProducts()` | 1,065+ | ✅ |

**India Catalog categories:** `personal-care | home-appliances | electronics | fashion | food-grocery | sports | toys | books`

**India Catalog brands:** HUL, Dabur, ITC, Godrej, Bajaj, Havells, Philips, Prestige, boAt, Noise, realme, Samsung, Puma, Biba, Anker, Portronics, Syska, Ambrane, Belkin, Decathlon, Fisher-Price, Hasbro, Lego, Funskool, MDH, Himalaya, Patanjali, MTR

---

## 🚀 BUILD AND DEPLOY COMMANDS

```powershell
# Check build
cd F:\cloudbasket
pnpm build

# Dev server
pnpm dev

# Git workflow
git add -A
git commit -m "feat: description"
git push origin main

# Check file exists
Test-Path "F:\cloudbasket\path\to\file.ts"

# Read file
Get-Content "F:\cloudbasket\lib\env.ts" -Raw

# Create directory
New-Item -Path "F:\cloudbasket\services\apis" -ItemType Directory -Force

# Open in VS Code
code "F:\cloudbasket\app\page.tsx"

# PowerShell bracket path (IMPORTANT)
Get-Content -LiteralPath "F:\cloudbasket\app\product\[id]\page.tsx" -Raw
```

---

## ⚡ NEXT STEPS — START HERE

### IMMEDIATE NEXT: Set D D6

```powershell
# First check current state
cd F:\cloudbasket
git log --oneline -5
pnpm build
```

Then generate **D6 — Automated Blog Content Pipeline** which needs:
- `services/content/blog-generator.ts`
- `app/admin/content/blog/page.tsx`
- `lib/content/schedule.ts`
- Supabase stub for `blog_drafts` table

**Pattern for all Set D prompts:**
1. All API calls wrapped in `try/catch` with `console.warn` fallback
2. All Supabase calls wrapped in `if (hasSupabase())` check
3. All external services stub-safe when credentials missing
4. `isConfigured('KEY_NAME')` from `lib/env.ts` before any API call

---

## 📋 STANDARD FILE TEMPLATE

Every new service file follows this pattern:

```ts
// services/[folder]/[name].ts
// [ONE LINE PURPOSE DESCRIPTION]
// Stubs return empty/null when credentials not configured.
// Wire real credentials in .env.local before production.

import { env, isConfigured, hasSupabase } from '@/lib/env'

export class ServiceName {
  private isReady(): boolean {
    return isConfigured('REQUIRED_KEY')
  }

  async method(): Promise<ReturnType> {
    if (!this.isReady()) {
      console.warn('[ServiceName] Not configured — returning stub')
      return [] // or null or default value
    }
    try {
      // actual implementation
    } catch (err) {
      console.warn('[ServiceName] Error:', err)
      return [] // safe fallback
    }
  }
}

export const serviceName = new ServiceName()
```

---

## 🔐 AUTH SYSTEM (NOT YET BUILT — Set F)

Currently: mock auth with `MOCK_USER` in dashboard.
Planned (Set F): Google OAuth, Microsoft OAuth, Email OTP, Phone OTP, Biometric (WebAuthn).

---

## 📱 REVENUE STREAMS

1. **Amazon Associates** — affiliate commission on product clicks
2. **Flipkart Affiliate** — affiliate commission
3. **CJ Network** — global affiliate
4. **Google AdSense** — display advertising (consent-gated)
5. **Sponsored Listings** — brand advertising (₹5K-15K/month)
6. **Associates Program** — sub-affiliates earning 2-15%
7. **Print-on-Demand** — CloudBasket Originals via Printify/Printful + Razorpay

---

## ⚠️ KNOWN ISSUES / TO-DO

1. **India Catalog 2** — only 15 products (stub). Expand to 1,000 using patterns in `lib/india-catalog-2/tech-accessories.ts`
2. **Real product images** — using Unsplash/placeholder URLs. Replace with actual product images.
3. **Supabase production** — currently local (127.0.0.1:54321). Create cloud project at supabase.com for production.
4. **Plunk API key** — placeholder. Get real key from useplunk.com.
5. **9.3 setState cleanup** — some useEffect setState calls need cleanup functions.
6. **Auth** — no real auth yet. Dashboard uses mock user.

---

## 📊 PLATFORM STATS

- **Static pages:** 1,200+
- **Products:** 1,065+ (main + India catalog + India catalog 2 stub)
- **Categories:** 8 (electronics, fashion, personal-care, home-appliances, food-grocery, sports, toys, books)
- **Brands:** 28+ in brand directory
- **Blog posts:** 12
- **POD categories:** 6 (T-shirts, Mugs, Phone Cases, Posters, Hoodies, Tote Bags)
- **Legal pages:** 7 (Terms, Privacy, Cookies, Affiliate, Refund, Accessibility, Legal Hub)

---

## 🎯 LAUNCH CHECKLIST

- [ ] Set Supabase cloud URL in Vercel env vars
- [ ] Set NEXT_PUBLIC_GA_ID
- [ ] Set PLUNK_API_KEY
- [ ] Submit sitemap to Google Search Console
- [ ] Test all affiliate /go/ redirects
- [ ] Test price alert email delivery
- [ ] Run Lighthouse (target 90+)
- [ ] Test PWA install on Android Chrome
- [ ] Verify dark mode all pages
- [ ] QA all legal pages open in new tab

---

## 💬 HOW TO USE THIS DOCUMENT

**In your new Claude session, paste this at the start:**

> "I am continuing development of the CloudBasket Next.js platform. Here is the complete handover document with all project context, file structure, build status, and next steps. Do not ask questions — build from this point. RFC rule applies: always provide full file replacements. Start with Set D D6 — Automated Blog Content Pipeline."
>
> [paste this entire document]

---

*CloudBasket Handover Passport v2.0 — Generated March 2026 — NEXQON HOLDINGS*
*Last commit: 0749e05 | Build: ✅ Passing | Pages: 1,200+ | Products: 1,065+*