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
- ⬜ **Task 6.3: Compare Page Enhancements** — Sticky column + swipe hint for mobile.
- ⬜ **Task 6.4: Footer Sitemap** — Expand Footer to 4-column structured sitemap.

## SECTION 7 — SEO & METADATA
- ⬜ **Task 7.1: JSON-LD for Categories** — ItemList schema in `category/[slug]`.
- ⬜ **Task 7.2: JSON-LD for Products** — Product schema in `product/[id]`.
- ⬜ **Task 7.3: JSON-LD for FAQ** — FAQPage schema in `faq/page`.
- ⬜ **Task 7.4: Dynamic OG Images** — Implement OG routes for products/categories.
- ⬜ **Task 7.5: Canonical Alternates** — Ensure canonical tags across all routes.

## SECTION 8 — CODE QUALITY & STABILITY
- ⚠️ **Task 8.1: Error Boundary Wrapping** — Wrap remaining key components:
  - ✅ `FeedbackWidget` (in layout)
  - ⬜ `PriceAlertBanner` (in page/products)
  - ⬜ `RecentlyViewed` (in product/[id])
- ⬜ **Task 8.2: Type Safety** — Audit `lib/types.ts` for undefined fields/missing strict types.
- ⬜ **Task 8.3: Deprecation Cleanup** — Add `@deprecated` JSDoc to root `ProductCard.tsx` (if replacing with `products/ProductCard.tsx` or vice-versa).
- ✅ **Task 8.4: Environment Config** — `lib/env.ts` created and integrated.

## SECTION 9 — PERFORMANCE & UX
- ✅ **Task 9.1: Loading Skeletons** — Created `loading.tsx` for all major route segments.
- ⬜ **Task 9.2: Image Optimization** — Curate ~50 high-quality category URLs to replace Unsplash randoms (Ref: Image Audit).
- ⬜ **Task 9.3: Effect Cleanup** — Fix "setState synchronously within an effect" in `app/page.tsx`, `Header.tsx`, etc.

---
*Last Updated: March 18, 2026*
