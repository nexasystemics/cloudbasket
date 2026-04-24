# CloudBasket — Deployment Guide

## Prerequisites
- Node.js 20+
- pnpm 9+
- Supabase account
- Vercel account

## Local Setup
```bash
git clone https://github.com/nexasystemics/cloudbasket.git
cd cloudbasket
pnpm install
cp .env.example .env.local
# Fill in .env.local values
pnpm dev
```

## Environment Variables
See `.env.example` for all required and optional variables.

### Required for core functionality:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `NEXT_PUBLIC_SITE_URL` — Production URL (https://cloudbasket.co)

### Optional but recommended:
- `NEXT_PUBLIC_GA_ID` — Google Analytics 4 measurement ID
- `SUPABASE_SERVICE_ROLE_KEY` — Required for admin features
- `PLUNK_API_KEY` — Email notifications

## Supabase Setup
1. Create new Supabase project
2. Run migrations: `supabase db push`
3. Enable Row Level Security on all tables
4. Copy URL and anon key to .env.local

## Vercel Deployment
1. Connect GitHub repo to Vercel
2. Set all environment variables in Vercel dashboard
3. Deploy: `git push origin main`
4. Vercel auto-deploys on every push to main

## Post-Deployment Checklist
- [ ] Submit sitemap to Google Search Console: https://cloudbasket.co/sitemap.xml
- [ ] Verify OG images at https://cloudbasket.co/api/og
- [ ] Test affiliate redirect: https://cloudbasket.co/go/amazon-mob-001
- [ ] Verify price alert email delivery
- [ ] Run Lighthouse audit on homepage (target: 90+ performance)
- [ ] Test PWA install on Android Chrome
- [ ] Verify dark mode toggle works
- [ ] Check all 1198 static pages are indexed

## Supabase Migrations
Located in `supabase/migrations/`:
- `20260320000000_price_history.sql` — Price history tracking table

## Build Commands
```bash
pnpm build          # Production build
pnpm dev            # Development server
pnpm lint           # ESLint check
```

## Support
NEXQON HOLDINGS — nexqon.com