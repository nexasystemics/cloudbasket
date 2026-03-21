# CLOUDBASKET — DEVELOPER HANDOVER PASSPORT v3.0
## March 22, 2026 | NEXQON HOLDINGS | Resume from here

---

## 🔴 CRITICAL RULES — READ FIRST

1. **RFC** = Always full file replacement — never patches
2. **PowerShell only** — Windows machine
3. **pnpm build** after every 2-3 files
4. **git add -A ; git commit -m "..." ; git push origin main** after every passing build
5. **Docs folder:** `E:\cloudbasket-docs\` (NOT F:)
6. **Project folder:** `F:\cloudbasket`
7. **Bracket paths:** use `-LiteralPath` flag

---

## 📁 PROJECT

- **Path:** `F:\cloudbasket`
- **Framework:** Next.js 16.1.6 (Turbopack)
- **Package manager:** pnpm
- **Repo:** https://github.com/nexasystemics/cloudbasket (branch: main)
- **Last commit:** `dd7fabe` — SearchProduct -> SearchResult fix
- **Build status:** ⚠️ FAILING — 1 error remaining (see below)

---

## 🚨 CURRENT BUILD ERROR — FIX THIS FIRST

```
./app/search/SearchPageClient.tsx:11
Export 'SearchResults' doesn't exist in lib/search.ts
```

**Fix:**
```powershell
(Get-Content -LiteralPath "F:\cloudbasket\app\search\SearchPageClient.tsx" -Raw) `
  -replace 'SearchResults,\s*', '' `
  | Set-Content -LiteralPath "F:\cloudbasket\app\search\SearchPageClient.tsx"
pnpm build
git add -A ; git commit -m "fix: remove SearchResults import — build passing" ; git push origin main
```

---

## ✅ COMPLETED SETS

| Set | Prompts | Status | Last Commit |
|-----|---------|--------|-------------|
| Set A | A01–A20 India Catalog 1000 products | ✅ DONE | 538ba3e |
| Set B | B01–B07 pending code applied | ✅ DONE | bc0f6e2 |
| Set B | B08–B20 platform features | ✅ DONE | 6ce1dab |
| Set C | C01–C40 UI/UX Supreme | ✅ DONE | 0f3765b |
| Set D | D01–D05 Amazon, Flipkart, CJ, AdSense, Gemini | ✅ DONE | 0749e05 |
| Set D | D06–D50 all API automation services | ✅ DONE | b3659be |

**Total coded: 143 prompts ✅**

---

## ⏳ PENDING — START HERE AFTER FIXING BUILD

### Next: Apply E-set codes
```powershell
cd F:\cloudbasket
python -c "
import os
with open(r'E:\cloudbasket-docs\CB_all_pending_codes.txt','r',encoding='utf-8') as f:
    content = f.read()
sections = content.split('--- FILE:')
created = 0
for section in sections[1:]:
    lines = section.split('\n')
    filepath = lines[0].strip().rstrip('---').strip()
    code = '\n'.join(lines[1:]).strip()
    if not filepath or not code: continue
    full_path = os.path.join(r'F:\cloudbasket', filepath.replace('/', os.sep))
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    open(full_path, 'w', encoding='utf-8').write(code)
    print(f'OK: {filepath}')
    created += 1
print(f'Done: {created} files')
"
pnpm build
git add -A ; git commit -m "feat: E01-E20 POD platform integrations" ; git push origin main
```

---

## 📊 FULL PROMPT STATUS

| Set | Total | Done | Pending |
|-----|-------|------|---------|
| A | 20 | 20 ✅ | 0 |
| B | 20 | 20 ✅ | 0 |
| C | 40 | 40 ✅ | 0 |
| D | 50 | 50 ✅ | 0 |
| E | 50 | 0 | 50 ⏳ |
| F | 100 | 0 | 100 ⏳ |
| **Total** | **280** | **130** | **150** |

---

## 📁 FILES IN E:\cloudbasket-docs\

| File | Contains | Status |
|------|----------|--------|
| CB_codes_B01_B07_supabase.txt | B01-B07 + SQL migrations | ✅ Applied |
| CB_codes_D6_D50.txt | D06-D50 services + routes | ✅ Applied |
| CB_all_pending_codes.txt | E01-E20 POD integrations | ⏳ NOT YET APPLIED |
| CB_ALL_280_PROMPTS.docx | All 280 prompts in 4-row tables | Reference |
| CB_MASTER_TRACKER_COMPLETE.xlsx | Full 15-sheet tracker | Reference |

---

## 🔧 KEY FILES

```
F:\cloudbasket\
├── lib/env.ts                    ← ALL env vars — add new keys here
├── lib/india-catalog/            ← 1000 India products
├── lib/deals-engine.ts           ← Deals system
├── lib/search.ts                 ← Search with filters
├── lib/analytics/revenue-attribution.ts
├── services/apis/                ← Amazon, Flipkart, CJ
├── services/payments/razorpay.ts
├── services/pod/                 ← POD services (E-set)
├── supabase/migrations/          ← 001-010 SQL files
├── scripts/apply-code.py         ← Auto file writer
└── E:\cloudbasket-docs\          ← All docs and code files
```

---

## 🗝️ ENV VARS (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321  (local — needs cloud for production)
NEXT_PUBLIC_SITE_URL=https://cloudbasket.co
AMAZON_ASSOCIATE_TAG=cloudbasket-21
PLUNK_API_KEY=your_plunk_api_key_here
```
All other vars typed in `lib/env.ts` with empty fallbacks — stub-safe.

---

## 🎨 DESIGN SYSTEM

- **CSS vars:** `var(--cb-bg)`, `var(--cb-surface-2)`, `var(--cb-border)`, `var(--cb-text-primary)`, `var(--cb-text-muted)`
- **Classes:** `cb-card`, `cb-btn`, `cb-btn-primary`, `cb-btn-ghost`, `cb-badge`, `cb-badge-green`, `cb-input`
- **Brand blue:** `#1F4E79` | **Accent:** `#F59E0B` | **skyline-primary** = `#039BE5`

---

## ⚡ PYTHON APPLY SCRIPT — UNIVERSAL COMMAND

```powershell
cd F:\cloudbasket
python -c "
import os
with open(r'E:\cloudbasket-docs\FILENAME.txt','r',encoding='utf-8') as f:
    content = f.read()
sections = content.split('--- FILE:')
created = 0
for section in sections[1:]:
    lines = section.split('\n')
    filepath = lines[0].strip().rstrip('---').strip()
    code = '\n'.join(lines[1:]).strip()
    if not filepath or not code: continue
    full_path = os.path.join(r'F:\cloudbasket', filepath.replace('/', os.sep))
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    open(full_path, 'w', encoding='utf-8').write(code)
    print(f'OK: {filepath}')
    created += 1
print(f'Done: {created} files')
"
```
Replace `FILENAME.txt` with actual file name.

---

## 📋 COMMON BUILD FIXES

**Pattern: Export X doesn't exist**
```powershell
# Remove bad import
(Get-Content -LiteralPath "F:\cloudbasket\path\to\file.tsx" -Raw) `
  -replace 'BadExport,\s*', '' `
  | Set-Content -LiteralPath "F:\cloudbasket\path\to\file.tsx"
```

**Pattern: deal.product.X doesn't exist**
```powershell
(Get-Content -LiteralPath "FILE" -Raw) `
  -replace 'd\.product\.title', 'd.title' `
  -replace 'd\.product\.brand', 'd.brand' `
  -replace 'd\.product\.category', 'd.category' `
  -replace 'd\.product\.image', 'd.imageUrl' `
  -replace 'd\.product\.price', 'd.dealPrice' `
  | Set-Content -LiteralPath "FILE"
```

**Pattern: default export import mismatch**
```powershell
(Get-Content -LiteralPath "FILE" -Raw) `
  -replace 'import \{ ComponentName \} from', 'import ComponentName from' `
  | Set-Content -LiteralPath "FILE"
```

---

## 🚀 RESUME PROMPT FOR NEW SESSION

Paste this in new Claude chat:

> "I am continuing CloudBasket development. RFC rule = full file always. PowerShell only. Project at F:\cloudbasket. Docs at E:\cloudbasket-docs. Last commit dd7fabe. Build has 1 error — SearchResults export missing in SearchPageClient.tsx. Fix it, then apply E:\cloudbasket-docs\CB_all_pending_codes.txt for E01-E20 POD integrations. Then continue with Set F F01-F21. No questions — build from this passport."
>
> [paste this entire document]

---

*CloudBasket Handover Passport v3.0 | March 22 2026 | Last commit: dd7fabe | 130/280 prompts coded*