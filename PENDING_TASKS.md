# CloudBasket - Pending Tasks & Audit Report

## SECTION 6 — ACCESSIBILITY (WCAG 2.2 AA)
- ✅ **Task 6.1: Skip Link** — Added "Skip to main content" in `app/layout.tsx`.
- ✅ **Task 6.2: Focus Rings** — Added `focus-visible` rings and ARIA roles/attributes to:
  - `components/Header.tsx` (Promo dismiss, toggles)
  - `components/CategoryGrid.tsx` (Category links)
  - `components/ProductCard.tsx` (Modern & Deprecated - Wishlist, links, article)
  - `components/products/ProductCard.tsx` (Article role/tabIndex/onKeyDown/Focus)
  - `components/FeedbackWidget.tsx` (Fixed tab, close, emojis, submit)
  - `components/DealsBar.tsx` (Flash Deals link, deal items)
- ✅ **Task 6.3: Compare Page Enhancements** — Sticky first column, mobile swipe hint, gradient scroll indicators.
- ✅ **Task 6.4: Footer Sitemap** — 4-column sitemap (Shop, Custom POD, Company, Trust & Legal) with focus rings on all links.

## SECTION 7 — SEO & METADATA
- ✅ **Task 7.1: JSON-LD for Categories** — ItemList schema in `app/category/[slug]/page.tsx`.
- ✅ **Task 7.2: JSON-LD for Products** — Product + BreadcrumbList + AggregateRating schema in `app/product/[id]/page.tsx`.
- ✅ **Task 7.3: JSON-LD for FAQ** — FAQPage schema in `app/faq/page.tsx`.
- ✅ **Task 7.4: Dynamic OG Images** — OG image URLs referenced in category + product metadata via `api/og` route.
- ✅ **Task 7.5: Canonical Alternates** — Canonical tags set in category and product metadata.

## SECTION 8 — CODE QUALITY & STABILITY
- ✅ **Task 8.1: Error Boundary Wrapping** — All key components wrapped:
  - ✅ `FeedbackWidget` (in layout)
  - ✅ `PriceAlertBanner` (in `app/page.tsx` and `app/products/products-page-client.tsx`)
  - ✅ `RecentlyViewed` (in `app/product/[id]/page.tsx`)
- ✅ **Task 8.2: Type Safety** — `lib/types.ts` audited: optional fields correctly typed as `| undefined`, strict mode compatible.
- ✅ **Task 8.3: Deprecation Cleanup** — `// DEPRECATED` comment added to root `components/ProductCard.tsx`.
- ✅ **Task 8.4: Environment Config** — `lib/env.ts` created and integrated.

## SECTION 9 — PERFORMANCE & UX
- ✅ **Task 9.1: Loading Skeletons** — Created `loading.tsx` for all major route segments.
- ⬜ **Task 9.2: Image Optimization** — Curate ~50 high-quality category URLs to replace Unsplash randoms (Ref: Image Audit).
- ⬜ **Task 9.3: Effect Cleanup** — Fix "setState synchronously within an effect" in `app/page.tsx`, `Header.tsx`, etc.

---
*Last Updated: March 18, 2026*
