# HERO SPECIFICATION

## 1. Design Concepts

### Brand Identity
- **Primary Color:** **Sky Blue (#38BDF8)**
- **Accent Color:** **Orange (#F97316)**

### Hero Backdrop
- **Light Mode:** `bg-white`
- **Dark Mode:** `bg-zinc-950`

### Typography
- **Weight:** Black-weight
- **Tracking:** Tight tracking (`tracking-tighter`)
- **Case:** Uppercase headers

## 2. Animation Spec (5-Part Sequence)

The hero features an interactive "Live Search Demo" to illustrate the value proposition.

### 5-Part Animation Checklist
- [ ] **Step 1: Faux-typing**
  - Type "$500 smartphone" into the search input at 100ms per character.
- [ ] **Step 2: Search Pulse**
  - Add `ring-4 ring-sky-400 animate-pulse` to the search input.
  - Trigger a subtle click sound.
- [ ] **Step 3: Grid Fade-In**
  - Show results grid (3 Columns: Amazon | Flipkart | CJ).
  - Animate Amazon column with `fade-in-up` (100ms delay).
  - Animate Flipkart column with `fade-in-up` (200ms delay).
  - Animate CJ column with `fade-in-up` (300ms delay).
- [ ] **Step 4: Price Highlight**
  - Highlight price in CJ column with **#F97316**, `scale-110`, and `font-black`.
  - Apply `border-2 border-[#F97316]` and `shadow-orange-500/20` to the CJ column.
- [ ] **Step 5: Final CTA Action**
  - Move cursor to the button in the CJ column.
  - Trigger button click (redirects to `/go/demo-id`).

### Pseudo-code Implementation
```javascript
// Step 1: Faux-typing
typeEffect(target: "search-input", text: "$500 smartphone", speed: 100ms);

// Step 2: Search Pulse
onComplete(() => {
  searchInput.addClass("ring-4 ring-sky-400 animate-pulse");
  triggerSound("subtle-click");
});

// Step 3: Grid Fade-In
setTimeout(() => {
  resultsGrid.show(); // 3 Columns: Amazon | Flipkart | CJ
  columnAmazon.animate("fade-in-up", delay: 100ms);
  columnFlipkart.animate("fade-in-up", delay: 200ms);
  columnCJ.animate("fade-in-up", delay: 300ms);
}, 1500ms);

// Step 4: Price Highlight
setTimeout(() => {
  columnCJ.find(".price").addClass("text-[#F97316] scale-110 font-black");
  columnCJ.addClass("border-2 border-[#F97316] shadow-orange-500/20");
}, 2500ms);

// Step 5: Final CTA Action
setTimeout(() => {
  cursor.moveTo(columnCJ.button);
  columnCJ.button.click(); // Triggers /go/demo-id
}, 3500ms);
```

## 3. Responsiveness & Layout

- **Desktop (>1024px):** 3-column side-by-side comparison grid.
- **Mobile (<768px):** 1-column stacked list.
- **RTL Support:** Apply `flex-direction: row-reverse` to the grid container when `dir="rtl"` is active.

## 4. Income Shield Rules (Mandate 4.1)

- Every interactive element in the "Search Demo" that represents a product must lead to the `/go/` route.
- **Action:** `onClick={() => router.push('/go/demo-id?ref=hero-demo')}`
- This ensures the Income Shield (Affiliate Redirection) is tested during the hero interaction.

## 5. Final Compliance Checklist

- [ ] Backdrop transitions correctly between `white` and `zinc-950`.
- [ ] No local checkout logic is implied; all buttons use the `/go/` exit node.
- [ ] Shimmer effects are applied to product cards during the "Search Pulse" phase.
- [ ] Animation is accessible (honors `prefers-reduced-motion`).
- [ ] RTL layout correctly mirrors the comparison order (CJ should be on the right in LTR, left in RTL).

---
*Generated for CloudBasket Sovereign UI Audit — March 1, 2026*
