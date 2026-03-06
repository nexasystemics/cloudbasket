================================================================================
  CLOUDBASKET — GEMINI GOVERNANCE & STANDING INSTRUCTIONS
  VERSION : 3.0.0 — SOVEREIGN EDITION
  DATE    : 2026-03-06
  SCOPE   : ALL SESSIONS — ALL PROMPTS — ALL EXECUTIONS
  AUTHORITY: Principal Developer — CloudBasket Engineering
================================================================================

  ╔══════════════════════════════════════════════════════════════════════╗
  ║  THIS FILE MUST BE LOADED BEFORE EVERY PROMPT EXECUTION.           ║
  ║  EVERY RULE HERE OVERRIDES ANY CONFLICTING INSTRUCTION IN A PROMPT. ║
  ║  NON-COMPLIANCE = EXECUTION REJECTED. NO EXCEPTIONS.               ║
  ╚══════════════════════════════════════════════════════════════════════╝

================================================================================
  SECTION 1 — PROJECT IDENTITY
================================================================================

  PROJECT      : CloudBasket — Sovereign Price Aggregator & Affiliate Hub
  VERSION      : 2.0.0 (Full Rebuild — Sovereign Edition)
  WORKING DIR  : F:\cloudbasket
  PACKAGE MGR  : pnpm ONLY (never npm, never yarn)
  STACK        : Next.js 16 · TypeScript 5 strict · Tailwind 4 · Supabase
                 Framer Motion · Upstash Redis · Playwright · Gemini AI API
                 Plunk + Resend · next-pwa · @vercel/og
  DEPLOY       : Vercel (free tier)
  COMPLIANCE   : DPDPA 2023 (India) · GDPR (EU) · FTC (US)

================================================================================
  SECTION 2 — THE ZERO-CHECKOUT MANDATE (CORE PILLAR — NEVER VIOLATE)
================================================================================

  CloudBasket is a PURE DISCOVERY ENGINE. This is non-negotiable.

  ✅ ALLOWED:
    - Displaying products, prices, deals, comparisons
    - Routing users to external partners via /go/[id] Income Shield Node
    - Affiliate tracking and commission attribution
    - User accounts for wishlists, price alerts, associate dashboards

  ❌ STRICTLY FORBIDDEN — NEVER GENERATE CODE FOR:
    - Local shopping cart (no CartContext, no useCart, no addToCart)
    - Local checkout flow (no checkout page, no order confirmation)
    - Payment processing (no Stripe, Razorpay, PayU, or any gateway)
    - Storage of financial data of any kind
    - Simulating a purchase inside the app

  Income Shield Node — /go/[id]:
    - ALL purchase-intent actions MUST route to /go/[id]
    - Returns HTTP 302 Temporary Redirect only
    - Injects affiliate tags: Amazon (cloudbasket-21), Flipkart (cloudbasket_fk)
    - Invalid IDs redirect to /not-found
    - This node is the ONLY exit point for monetization

================================================================================
  SECTION 3 — SECURITY & PRIVACY RULES
================================================================================

  3.1  SECRET PROTECTION (ABSOLUTE):
    - NEVER write API keys, tokens, or secrets in any source file
    - ALL secrets via environment variables only (.env.local)
    - NEVER commit .env or .env.local (enforced in .gitignore)
    - .env.example is the ONLY place placeholder keys are shown

  3.2  USER PRIVACY (DPDPA 2023 COMPLIANT):
    - No PII collected from non-authenticated users
    - Cookie consent required before any tracking
    - Analytics data: anonymized only
    - No third-party tracking scripts without explicit consent gate
    - GDPR-aligned data deletion on user request

  3.3  CONTENT SECURITY:
    - All external URLs sanitized before redirect
    - No javascript: protocol in any href
    - All image domains whitelisted in next.config.ts
    - XSS: dangerouslySetInnerHTML NEVER used
    - CSRF: Supabase session tokens for all mutations

================================================================================
  SECTION 4 — CODE QUALITY RULES (NON-NEGOTIABLE)
================================================================================

  4.1  TYPESCRIPT:
    - Strict mode: ON at all times
    - Zero `any` types permitted
    - Zero non-null assertions (!) permitted
    - Zero eslint-disable comments permitted
    - Zero console.log in production code
    - All functions: explicit return types
    - All props: fully typed interfaces, no inline type literals in JSX

  4.2  REACT / NEXT.JS:
    - No sync setState inside useEffect without mounted guard
    - All useEffect hooks return a cleanup function
    - No inline object/function creation inside JSX renders
    - React.memo with custom comparator for heavy list components
    - useMemo/useCallback where re-render cost is measurable
    - Server Components by default — 'use client' only when required
    - No deprecated Next.js APIs

  4.3  FILE RULES:
    - Complete files only — no truncation, no TODOs, no placeholder comments
    - One component per file (exceptions: small co-located sub-components)
    - Barrel exports (index.ts) for each component folder
    - Path aliases: @/* always — never relative ../../../

  4.4  STYLING:
    - Tailwind 4 utility classes primary
    - CSS custom properties (--cb-*) for all design tokens
    - CSS logical properties for RTL safety (inline-start/end, not left/right)
    - No inline style={{ }} except for dynamic values unavailable in Tailwind
    - Dark mode via .dark class — never via media query in JS

================================================================================
  SECTION 5 — DESIGN SYSTEM (SOVEREIGN UI — APPLE-CLEAN)
================================================================================

  5.1  COLOR TOKENS:
    Skyline Blue (Primary):
      --cb-primary       : #039BE5
      --cb-primary-light : #4FC3F7
      --cb-primary-dark  : #0277BD
      --cb-primary-glow  : rgba(3,155,229,0.15)

    Titanium Gray (Neutral):
      950 : #09090B  (dark bg)
      900 : #0F172A  (card bg dark)
      800 : #1E293B  (elevated dark)
      500 : #64748B  (muted text)
      400 : #94A3B8  (placeholder)
      200 : #E2E8F0  (border light)
      50  : #F8FAFC  (surface light)

    Status:
      Success : #10B981
      Warning : #F5C842
      Error   : #EF4444
      Info    : #039BE5

  5.2  TYPOGRAPHY:
    Display  : Space Grotesk (headings, hero, section titles)
    Body     : Inter (all body text, UI labels)
    Mono     : JetBrains Mono (code, prices, stats, badges)

  5.3  AESTHETIC RULES:
    - Apple-clean: generous whitespace, precision alignment
    - No emojis in UI (text or JSX) — SVG icons only (lucide-react)
    - Glassmorphism: backdrop-blur panels, subtle borders
    - Micro-interactions via Framer Motion (respect prefers-reduced-motion)
    - Border radius: 16px cards · 10px buttons · 6px badges · 999px pills
    - Shadows: never harsh — use skyline glow for interactive elements

  5.4  DARK MODE:
    - Default: system preference
    - Toggle: ThemeProvider (next-themes, attribute="class")
    - Background dark: #09090B (zinc-950)
    - Text dark: #F8FAFC (slate-200)
    - Glass panels: rgba(15,23,42,0.72) dark / rgba(255,255,255,0.72) light

================================================================================
  SECTION 6 — ACCESSIBILITY (WCAG 2.2 AA — MANDATORY)
================================================================================

  - All interactive elements: keyboard navigable (Tab/Enter/Space)
  - All images: meaningful alt text — never empty unless decorative
  - Decorative images: aria-hidden="true"
  - Color is NEVER the sole state indicator
  - Minimum contrast: 4.5:1 normal text · 3:1 large text / UI components
  - focus-visible: never suppressed — custom ring on all focusable elements
  - Loading states: aria-busy="true"
  - Error states: role="alert" aria-live="assertive"
  - Dynamic content: aria-live="polite"
  - prefers-reduced-motion: all animations skipped or instant

================================================================================
  SECTION 7 — PERFORMANCE RULES
================================================================================

  - Images: next/image always — never <img> for content images
  - Fonts: next/font/google — never @import in CSS
  - Dynamic imports for heavy components (admin panels, charts)
  - Suspense + loading.tsx for all route segments
  - Cache TTL: prices 1hr · exchange rates 24hr · products 30min
  - No blocking data fetches in layout.tsx
  - Target Core Web Vitals: LCP <2.5s · FID <100ms · CLS <0.1

================================================================================
  SECTION 8 — ROUTE MAP (COMPLETE — DO NOT ADD UNDECLARED ROUTES)
================================================================================

  Public:
    /                       Homepage — hero, marketplace, categories
    /products               Full catalog with filters
    /products/[id]          Product detail page
    /category/[slug]        Category landing page
    /deals                  Deals hub
    /deals/flash            Flash sales
    /deals/[id]             Deal detail
    /compare                Side-by-side product compare (2-4 items)
    /track/[id]             Price drop tracker
    /search                 Search results
    /blog                   Blog index
    /blog/[slug]            Blog post
    /pod                    Print-on-Demand hub
    /pod/mugs               Mugs catalog
    /pod/tshirts            T-shirts catalog
    /pod/phone-cases        Phone cases catalog
    /associates             Associate signup + info
    /affiliate-disclosure   FTC/DPDPA compliance page
    /about                  About CloudBasket
    /contact                Contact page
    /faq                    FAQ
    /careers                Careers
    /legal/privacy          Privacy Policy (DPDPA 2023 aligned)
    /legal/terms            Terms of Service
    /sitemap                HTML sitemap

  System:
    /go/[id]                Income Shield — affiliate redirect node (302)
    /not-found              404 page
    /og                     Dynamic OG image generation

  Auth:
    /login                  Login page
    /register               Register page
    /dashboard              User dashboard (wishlist, alerts)

  Admin (role-gated):
    /admin                  Command center + telemetry
    /admin/associates       Associate management
    /admin/lister           Product listing tool
    /admin/marketing        Marketing studio
    /admin/affiliate-keys   Affiliate vault
    /admin/moderation       Content moderation

  API:
    /api/og                 OG image API
    /api/webhooks           Affiliate webhook receiver

================================================================================
  SECTION 9 — ANTI-FREEZE & EXECUTION STABILITY RULES
================================================================================

  These rules exist to prevent Gemini CLI from freezing, truncating,
  or producing incomplete output during code generation.

  9.1  FILE SIZE CONTROL:
    - No single generated file to exceed 400 lines
    - If a component exceeds 400 lines: split into sub-components
    - Gemini must declare file size estimate before writing each file
    - Example: "// Estimated: ~180 lines" at top of generation

  9.2  SEQUENTIAL EXECUTION (ONE FILE AT A TIME):
    - Write ONE file completely before starting the next
    - Confirm each file write with: "✅ FILE WRITTEN: [path] ([N] lines)"
    - Never batch-write multiple files in one shell command
    - Never use && chaining for file creation

  9.3  CHECKPOINTING:
    - After every 3 files written: run pnpm type-check and report result
    - If type-check fails: fix errors before continuing to next file
    - Do not proceed past errors — fix inline

  9.4  MEMORY & CONTEXT:
    - At start of each prompt: echo current working directory
    - At start of each prompt: list files being modified (not created)
    - Never re-read files not relevant to current prompt
    - Avoid loading large files (structure.txt, pnpm-lock.yaml) into context

  9.5  SHELL STABILITY:
    - Use PowerShell New-Item for file creation (not touch or echo >)
    - Use Set-Content for writing file content (not >> append)
    - Always Set-Location F:\cloudbasket before any file operation
    - Use $ErrorActionPreference = "Stop" at start of every shell block
    - Test-Path before any overwrite operation

  9.6  TRUNCATION PREVENTION:
    - If output approaches context limit mid-file:
      STOP at the last complete function/component boundary
      Output: "⚠️ CONTINUATION REQUIRED — Resume from: [function name]"
      Do NOT output incomplete JSX or unclosed brackets
    - Recovery instruction to paste: 
      "Continue [filename] from [function name]. Complete to EOF. No preamble."

  9.7  APPROVAL GATE:
    - After ALL files in a prompt are written and type-check passes:
      Output final summary table:
        FILE | LINES | STATUS
      Then output: "✅ P0X COMPLETE — AWAITING OPERATOR APPROVAL TO PROCEED"
    - Do NOT auto-start next prompt
    - Wait for explicit "PROCEED" or "GO" from operator

================================================================================
  SECTION 10 — SESSION LOGGING RULES
================================================================================

  - After every completed prompt execution:
    Save session log to: F:\cloudbasket\cc-output\session-[date]-P0X.txt
  - Log must include:
    Files written (path + line count)
    TypeScript errors found and fixed
    Any deviations from prompt spec (with reason)
    Pending items if any
  - Filename format: session-YYYY-MM-DD-P[number].txt

================================================================================
  SECTION 11 — WHAT GEMINI MUST NEVER DO
================================================================================

  ❌ Never delete files not explicitly listed for deletion in the prompt
  ❌ Never modify /public/brand/* (logo files are locked)
  ❌ Never expose secrets or API keys in source files
  ❌ Never use npm or yarn (pnpm only)
  ❌ Never generate CartContext, checkout, or payment logic
  ❌ Never use dangerouslySetInnerHTML
  ❌ Never use `any` type or non-null assertion (!)
  ❌ Never leave TODOs, placeholders, or incomplete functions
  ❌ Never truncate a file mid-function
  ❌ Never proceed past a TypeScript error without fixing it
  ❌ Never auto-start the next prompt without operator approval
  ❌ Never use left/right CSS properties — use logical properties only
  ❌ Never hardcode secrets, affiliate IDs in source (use constants.ts)
  ❌ Never use emojis in UI components (SVG icons only)
  ❌ Never use npm's node_modules path — always pnpm virtual store

================================================================================
  SECTION 12 — GEMINI STARTUP CONFIRMATION
================================================================================

  At the start of EVERY session, Gemini must output this confirmation:

  ┌─────────────────────────────────────────────────────┐
  │  CLOUDBASKET GOVERNANCE v3.0.0 — LOADED             │
  │  Working Dir   : F:\cloudbasket                     │
  │  Package Mgr   : pnpm                               │
  │  Zero-Checkout : ENFORCED                           │
  │  TypeScript    : STRICT                             │
  │  Secrets       : ENV ONLY                           │
  │  Anti-Freeze   : ACTIVE                             │
  │  Approval Gate : ACTIVE                             │
  │  READY TO EXECUTE — AWAITING PROMPT                 │
  └─────────────────────────────────────────────────────┘

================================================================================
//  CLOUDBASKET GOVERNANCE v3.0.0
//  © 2026 CLOUDBASKET — SOVEREIGN PLATFORM. ALL RIGHTS RESERVED.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION STRICTLY PROHIBITED.
================================================================================
