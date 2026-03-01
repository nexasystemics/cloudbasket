# CloudBasket - Pending Tasks & Audit Report

## 1. Code Cleanup (Unused Imports & Broken Handlers)
- **Navigation Menu:** `components/Navigation.tsx` is an older multi-tenant navigation component that isn't currently used in the main CloudBasket Header (`components/Header.tsx`). 
- **Broken Handlers:** The `Navigation.tsx` mobile menu (`☰`) uses a simple `absolute` positioning which might be hidden behind `glass-header` if ever integrated.
- **Unused Imports (from `pnpm lint`):**
  - `app/blog/page.tsx`: `theme` is assigned but never used.
  - `app/cj/page.tsx`: `Info`, `isConnected`, `index` are defined/assigned but unused.
  - `app/deals/page.tsx`: `TenantTheme` is unused.
  - `components/Navigation.tsx`: `theme` is unused.
  - `services/price-engine/scraper.ts`: `ProductPrice`, `e` are unused.

## 2. Image Audit (Duplicate URLs)
The 2,000 items in `lib/mock-data.ts` are generated with unique IDs in the Unsplash URL:
`https://images.unsplash.com/photo-${1500000000000 + id}?auto=format&fit=crop&q=80&w=800`
- **Status:** No literal duplicates in generation logic, but Unsplash may serve the same placeholder for sequential large IDs.
- **Action:** Recommend a curated list of ~50 high-quality category-specific URLs for a more professional look.

## 3. Header & UI Interaction Audit
- **Header Dropdowns:** `components/Header.tsx` uses `onMouseEnter`/`onMouseLeave` correctly.
- **Theme Switching:** Logo dynamically switches between `logo-full.svg` and `logo-full-dark.svg`.
- **Z-Index Check:** 
  - `.glass-header` has `z-50`.
  - `.glass-sidebar` and `.glass-sidebar-right` are sticky but don't have explicit Z-index, potentially causing them to slide under the header (Good).
  - **Issue:** The `CartDrawer` and `CartSuccessVideo` need to ensure they are at `z-[100]` to stay above the glass header.

## 4. Performance & Performance
- **Sync setState Error:** `app/checkout/page.tsx`, `app/order-success/page.tsx`, `app/page.tsx`, `components/Header.tsx`, and `context/CartContext.tsx` have "setState synchronously within an effect" warnings.
- **Action:** Refactor these to use the `mounted` pattern correctly or move initialization logic out of `useEffect` where possible.

## 5. Mobile UI Density
- **Action:** The `grid-cols-4` on desktop is great, but ensure mobile remains `grid-cols-1` or `grid-cols-2` for readability.

---
*Generated on: March 1, 2026*
