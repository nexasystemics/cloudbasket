# CLAUDE.md — cloudbasket

> This file governs all Claude Code sessions for the `F:\cloudbasket` project.
> Read this file completely before taking any action.

---

## 1. PROJECT IDENTITY

| Field       | Value                                             |
|-------------|---------------------------------------------------|
| Project     | cloudbasket                                       |
| Type        | Hybrid POD + Affiliate Aggregator                 |
| Domain      | cloudbasket.in                                    |
| Market      | Indian & Global                                   |
| Root        | `F:\cloudbasket`                                  |
| Tagline     | Design. Print. Earn.                              |

---

## 2. TECH STACK

| Layer          | Technology                          | Version   |
|----------------|-------------------------------------|-----------|
| Framework      | Next.js                             | 16.1.6    |
| Language       | TypeScript                          | ^5 strict |
| UI             | React                               | 19.2.3    |
| Styling        | Tailwind CSS                        | ^4        |
| Database       | PostgreSQL via Supabase             | —         |
| Auth & BaaS    | Supabase (`@supabase/ssr` + `supabase-js`) | —  |
| Cache          | Redis via ioredis                   | ^5        |
| HTTP Client    | Axios                               | ^1        |
| Scraping       | Puppeteer                           | ^21       |
| Local AI       | Ollama                              | ^0.5      |
| Auth Crypto    | bcrypt + jsonwebtoken               | —         |
| Testing        | Playwright                          | ^1.58     |
| Linting        | ESLint                              | ^9        |
| Package Mgr    | pnpm                                | ONLY      |
| Edge/CDN       | Cloudflare                          | —         |

---

## 3. STANDING RULES — ALL SESSIONS

These rules are permanent and non-negotiable. Every Claude response must comply.

| # | Rule |
|---|------|
| 1 | **Never touch `.env` files or any credential file** — `.env.local` and all secrets are off-limits |
| 2 | **Never delete folders or run mass deletion** — single file deletions require explicit user confirmation |
| 3 | **Ask before `git commit` or `git push`** — never commit or push without explicit instruction |
| 4 | **Ask before installing any new package** — present package name, purpose, and license before installing |
| 5 | **All code reviewed before deployment** — draft mode by default; no execution unless user says `RUN` or `DEPLOY` |
| 6 | **TypeScript strict — never use `any` type** — all types must be properly declared or inferred |
| 7 | **pnpm only** — never use `npm` or `yarn` |
| 8 | **Complete files only** — no partial snippets; every file output must be the full file |
| 9 | **Every output must include:** FILE PATH + PURPOSE + RISK LEVEL + DEPENDENCIES + ROLLBACK PLAN |
| 10 | **Draft mode only** — no execution unless user says `RUN` or `DEPLOY` |
| 11 | **Every 10 responses** — auto-save checkpoint to `F:\cloudbasket\cc-output\checkpoint-[HH-MM].txt` |
| 12 | **Context below 15%** — immediately warn user with `⚠️ CONTEXT LOW — saving session` and save summary |
| 13 | **Before any `/exit`** — always save full session summary to `F:\cloudbasket\cc-output\session-[YYYY-MM-DD-HH].txt` |
| 14 | **If interrupted mid-task** — save completed/pending split to `F:\cloudbasket\cc-output\interrupted-[HH-MM].txt` |

---

## 4. SESSION SCOPE

This Claude session operates on `F:\cloudbasket` **only**.

| Tenant          | Session Scope |
|-----------------|---------------|
| cloudbasket     | THIS session — `F:\cloudbasket` |
| myhomefinder    | Separate dedicated session — `F:\myhomefinder` |
| infotyx         | Separate dedicated session |
| All others      | Separate dedicated sessions |

**Do not create files for other tenants in this repository.**
**Do not reference paths outside `F:\cloudbasket` except to note where a file belongs.**

---

## 5. OUTPUT PROTOCOL

Every response this session must be saved to:

```
F:\cloudbasket\cc-output\response-[topic].txt
```

- Folder: `F:\cloudbasket\cc-output\` (already created)
- Filename: `response-[topic].txt` where `[topic]` is a short kebab-case label
- This is a manual Write call at the end of every response
- If a save is missed, flag it and write immediately on next response

---

## 6. FOLDER STRUCTURE

```
F:\cloudbasket\
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Home — landing page
│   ├── affiliate/page.tsx      # Affiliate aggregator
│   ├── pod/page.tsx            # Print-on-demand
│   ├── products/page.tsx       # Product listings
│   ├── compare/page.tsx        # Price comparison
│   ├── deals/page.tsx          # Deals & offers
│   ├── blog/page.tsx           # Blog
│   ├── cj/page.tsx             # CJ affiliate
│   └── globals.css             # Global styles
├── components/                 # Shared UI components
│   ├── Header.tsx
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   ├── ChatBot.tsx
│   └── WhatsAppButton.tsx
├── lib/                        # Core utilities & tokens
│   ├── design-system.ts        # ← cloudbasket design tokens (PRIMARY)
│   ├── themes.ts               # Multi-tenant theme registry
│   ├── tenant-config.ts        # Tenant configuration
│   ├── supabase.ts             # Supabase client (browser)
│   ├── supabase-server.ts      # Supabase client (server)
│   ├── auth.ts                 # Auth helpers
│   ├── roles.ts                # RBAC roles
│   └── api-helpers.ts          # API utilities
├── services/                   # Background service modules
│   ├── price-engine/
│   │   └── scraper.ts          # Price scraping (Puppeteer)
│   └── email-engine/
│       └── plunk-client.ts     # Transactional email (Plunk)
├── public/                     # Static assets
├── cc-output/                  # Claude Code session output logs
├── CLAUDE.md                   # This file
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
└── package.json
```

---

## 7. PATH ALIASES (tsconfig.json)

| Alias             | Resolves To        |
|-------------------|--------------------|
| `@/*`             | `./*`              |
| `@/components/*`  | `./components/*`   |
| `@/lib/*`         | `./lib/*`          |
| `@/services/*`    | `./services/*`     |
| `@/app/*`         | `./app/*`          |

Always use `@/` aliases in imports — never use relative `../../` paths.

---

## 8. DESIGN SYSTEM

### cloudbasket Brand Colors (LOCKED)

| Role                  | Name          | Hex       | Token                      |
|-----------------------|---------------|-----------|----------------------------|
| Primary Brand         | Sky Blue      | `#039BE5` | `semantic.brand.primary`   |
| CTA / Action          | Orange        | `#E65100` | `semantic.brand.cta`       |
| Accent / Creative     | Yellow-Gold   | `#F5C518` | `semantic.brand.accent`    |
| Success / Confirm     | Emerald Green | `#1B5E20` | `semantic.brand.success`   |
| Background            | White         | `#FFFFFF` | `semantic.brand.background`|
| Text / Footer         | Dark Charcoal | `#36454F` | `semantic.brand.text`      |

### Design Token File

```
lib/design-system.ts
```

- Single source of truth for all design tokens
- Exports: `colors`, `semantic`, `typography`, `spacing`, `radii`, `shadows`,
  `breakpoints`, `zIndex`, `transitions`, `components`, `theme`
- All exports are `as const` — TypeScript strict compliant
- Zero imports, zero side effects, zero external calls
- Import via: `import { semantic, colors } from '@/lib/design-system'`

### Multi-Tenant Themes

```
lib/themes.ts
```

- Exports `TENANT_THEMES` record and `getTheme(tenant)` helper
- cloudbasket entry uses the locked brand colors above
- Other tenant entries have their own isolated color standards

---

## 9. CODING STANDARDS

### TypeScript
- `strict: true` is enforced in `tsconfig.json` — never disable it
- Never use `any` — use `unknown`, proper generics, or inferred types
- All `as const` for token/config objects
- Derive types from values: `typeof X` — do not hand-write duplicate types

### Components
- All components: TypeScript `.tsx`
- Props typed with explicit interfaces — no implicit `any`
- No default exports from lib files — named exports only (except design system `theme`)
- Server components by default in `app/` — add `'use client'` only when needed

### Styling
- Tailwind CSS v4 utility classes
- Design tokens from `lib/design-system.ts` — no magic hex values in components
- No inline `style={{}}` for brand colors — use Tailwind or CSS variables

### Imports
- Use `@/` path aliases — never relative `../../`
- Group: external packages → internal `@/lib` → internal `@/components` → types

### File Naming
- Pages: `app/[route]/page.tsx`
- Components: `PascalCase.tsx`
- Utilities/lib: `kebab-case.ts`
- Services: `kebab-case.ts`

---

## 10. PACKAGE MANAGEMENT

```bash
# Install dependency
pnpm add [package]

# Install dev dependency
pnpm add -D [package]

# Never use:
npm install   # ← FORBIDDEN
yarn add      # ← FORBIDDEN
```

**Before installing any package, Claude must:**
1. State the package name and version
2. State the purpose
3. Confirm license is not GPL
4. Wait for explicit user approval

---

## 11. ENVIRONMENT & CREDENTIALS

- `.env.local` — **never read, never modify, never log**
- All Supabase keys, API keys, and secrets live in `.env.local`
- Never hardcode credentials anywhere in source files
- Never `console.log` objects that may contain tokens or keys

---

## 12. GIT PROTOCOL

- Never commit without explicit user instruction
- Never push without explicit user instruction
- Never use `--force`, `--no-verify`, or `reset --hard` without confirmation
- Never amend a published commit
- Stage specific files by name — never `git add -A` or `git add .` blindly

---

## 13. TENANT SYSTEM

cloudbasket operates a multi-tenant platform. The tenant registry is in `lib/themes.ts`.

| Tenant key    | Brand            | Domain                  | Industry          |
|---------------|------------------|-------------------------|-------------------|
| cloudbasket   | CloudBasket      | cloudbasket.in          | affiliate-pod     |
| infotyx       | INFOTYX          | infotyx.in              | media-info        |
| infotyxco     | INFOTYX Services | infotyx.co              | tech-services     |
| myhomefinder  | MyHomeFinder     | myhomefinder.in         | realestate        |
| skybluecloud  | SkyBlueCloud     | skybluecloud.tech       | tech-affiliate    |
| eseva         | eSevaPragatiMitra| esevapragatimitra.in    | govt-services     |
| esevai        | eSeva Info Hub   | esevapragatimitra.com   | govt-info         |
| nexqon        | NEXQON           | nexqon.in               | holding           |
| nexqonorg     | NEXQON Intelligence | nexqon.org           | info-platform     |

**In this session, only `cloudbasket` tenant work is in scope.**

---

## 14. SERVICES

| Service         | File                              | Purpose                        |
|-----------------|-----------------------------------|--------------------------------|
| Price Engine    | `services/price-engine/scraper.ts`| Puppeteer-based price scraping |
| Email Engine    | `services/email-engine/plunk-client.ts` | Transactional email via Plunk |

---

*Last updated: 2026-02-23 — cloudbasket Claude Code session*
