# CloudBasket — Sovereign Price Aggregator v2.0

**Status:** ✅ Production Ready | **Zero-Checkout Enforced** | **GDPR/DPDPA Compliant**

## Unified Global Price Discovery & Affiliate Hub

CloudBasket is a premium price aggregator and affiliate discovery engine designed for the Indian and Global marketplace. Built with a focus on speed, privacy, transparency, and affiliate monetization through the Income Shield redirect system.

### 🛡️ Zero-Checkout Architecture (ENFORCED)

CloudBasket is a **pure discovery engine**. No shopping cart, no local checkout, no payment processing.

**Architecture:**
```
User Discovery Flow → Product Comparison → View Deal Button → /go/[id] → External Partner (302 Redirect)
                                                                          ├── Amazon (tag: cloudbasket-21)
                                                                          ├── Flipkart (affid: cb-flipkart)
                                                                          ├── CJ Global (publisher: cb-cj-pending)
                                                                          └── VCommission (id: cb-vcm-pending)
```

**Removed (Zero-Checkout Enforcement):**
- ❌ `/checkout` page
- ❌ `/api/checkout/*` endpoints
- ❌ Payment processing (Razorpay, Stripe)
- ❌ Order management systems
- ❌ Wallet/financial data storage
- ❌ Admin dashboards
- ❌ Vendor/seller portals
- ❌ POD fulfillment

**All revenue flows through `/go/[id]` Income Shield Node only.**

### 🚀 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js | 16.1.6 |
| Language | TypeScript | ^5 (strict) |
| Runtime | Node.js | v24 |
| UI Library | React | 19.2.3 |
| Styling | TailwindCSS | 4.x |
| Database | Supabase (PostgreSQL) | — |
| Cache | Redis (Upstash) | ^5 |
| Package Manager | pnpm | 10.33.0 |
| Testing | Playwright | ^1.58 |
| CI/CD | GitHub Actions | — |
| Deployment | Vercel | Free tier |

### 🎨 Design System

**Colors:**
- **Primary:** Skyline Blue `#039BE5` (affiliate CTAs)
- **Accent:** Yellow-Gold `#F5C518` (highlights)
- **Success:** Emerald Green `#1B5E20`
- **Text:** Dark Charcoal `#36454F`
- **Background:** White/Zinc-950

**Typography:**
- Display: Space Grotesk (headings)
- Body: Inter (content)
- Mono: JetBrains Mono (prices, code)

### 📂 Route Map

**Public Discovery Routes:**
- `/` — Homepage
- `/products` — Product catalog
- `/product/[id]` — Product details (routes to `/go` for purchase)
- `/deals` — Deal aggregation
- `/deals/[id]` — Deal details
- `/deals/flash` — Flash sales
- `/compare` — Side-by-side comparison
- `/category/[slug]` — Category browsing
- `/search` — Product search
- `/pod/*` — Print-on-demand showcase
- `/blog`, `/faq`, `/about`, `/contact` — Information pages

**User Account Routes:**
- `/login` — Sign in (for wishlists & price alerts)
- `/register` — Registration
- `/associates` — Associate info

**Affiliate Routes:**
- `/go/[id]` — **Income Shield Node** (HTTP 302 redirects only)
- `/affiliate` — Affiliate information
- `/legal/affiliate-disclosure` — FTC compliance

**Removed Routes:**
- ❌ `/checkout`
- ❌ `/dashboard/*`
- ❌ `/admin/*`
- ❌ `/vendor/*`
- ❌ `/account/orders/*`

### 🧪 Testing

**Automated Test Suite (50+ tests):**

```bash
# Run all tests
pnpm test

# Run with UI
pnpm test:ui

# Run specific suite
pnpm test tests/affiliate-redirects.spec.ts
```

**Test Coverage:**
- ✅ **Affiliate Redirects:** Income Shield `/go/[id]` validation
- ✅ **Discovery Flows:** Search, comparison, deals
- ✅ **SEO:** Metadata, structured data, OG tags
- ✅ **Accessibility:** WCAG 2.2 AA compliance
- ✅ **Security:** XSS protection, data isolation
- ✅ **Performance:** Load time < 5 seconds

### 📊 Build & Deploy

**Build Status:**
```
✅ TypeScript Strict: 0 errors
✅ ESLint: 0 errors
✅ Next.js Build: 1,263 routes prerendered
✅ Deployment: Ready for Vercel
```

**Development:**
```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build production
pnpm build

# Start production server
pnpm start

# Type check
pnpm type-check

# Lint
pnpm lint

# Run tests
pnpm test
```

### 🔐 Security & Compliance

**Governance:**
- ✅ **GEMINI.md v3.0.0** — Zero-checkout mandate enforced
- ✅ **DPDPA 2023** — Indian data privacy compliance
- ✅ **GDPR** — EU data protection
- ✅ **FTC Compliance** — Affiliate disclosure & transparency

**Data Protection:**
- No local payment data storage
- No wallet or financial information
- Cookie consent required
- User data deletion support
- Anonymous analytics only

**Security Measures:**
- ✅ TypeScript strict mode
- ✅ No `any` types or non-null assertions
- ✅ XSS prevention (sanitized URLs)
- ✅ CSRF protection (Supabase sessions)
- ✅ Secrets via environment variables only
- ✅ No API keys in source code

### 📈 Recent Updates (April 6, 2026)

**Phase 1: Compliance Enforcement**
- Removed 105+ files (~12,000 LOC)
- Deleted all payment/checkout functionality
- Removed admin dashboards and vendor portals
- Removed POD fulfillment services
- Build: SUCCESS ✅

**Phase 2: Automated Testing**
- Added Playwright test suite (50+ tests)
- Income Shield redirect validation
- Discovery flow integration tests
- SEO & accessibility compliance tests
- Performance benchmarking

**Commits:**
1. `4b885a0` — Remove admin dashboards, checkout, POD fulfillment
2. `ddff655` — Add comprehensive Playwright test suite
3. `5d31d6e` — Add discovery flow and SEO/accessibility tests

### 🚢 Deployment Checklist

Before deploying to production:

- [ ] All tests pass: `pnpm test`
- [ ] Build succeeds: `pnpm build`
- [ ] No TypeScript errors: `pnpm type-check`
- [ ] No lint errors: `pnpm lint`
- [ ] Environment variables configured:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - Affiliate IDs (Amazon, Flipkart, CJ, VCommission)
- [ ] Affiliate redirects tested manually
- [ ] Privacy policy updated
- [ ] FTC affiliate disclosure visible
- [ ] Analytics configured (non-PII)

### 📚 Documentation

- [`CLAUDE.md`](./CLAUDE.md) — Development rules & standards
- [`GEMINI.md`](./GEMINI.md) — Governance & compliance
- [`tests/README.md`](./tests/README.md) — Test suite guide
- [`DEPLOYMENT.md`](./DEPLOYMENT.md) — Deployment guide

### 🤝 Contributing

All changes must:
1. Pass TypeScript strict mode
2. Pass ESLint linter
3. Pass Playwright tests (50+)
4. Comply with GEMINI.md governance
5. Include proper commit messages with co-author trailer

### 📝 License

CloudBasket is proprietary software. All rights reserved.

---

**Generated:** April 6, 2026  
**Status:** Production Ready  
**Last Audit:** Compliance Enforcement + Testing Phase  
**Next:** Deploy to Vercel
