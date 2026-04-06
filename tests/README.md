# CloudBasket Test Suite

## Overview

This test suite validates the **zero-checkout mandate** and ensures CloudBasket operates as a pure discovery/affiliate aggregator engine.

## Test Categories

### 1. **Affiliate Redirect Tests** (`tests/affiliate-redirects.spec.ts`)
Tests the Income Shield Node (`/go/[id]`) - the core monetization system:
- ✅ Amazon redirects with correct affiliate tag
- ✅ Flipkart redirects with affiliate ID
- ✅ CJ Global tracking
- ✅ VCommission tracking
- ✅ POD redirects to showcase page
- ✅ URL encoding and sanitization
- ✅ Fallback search for unknown products

### 2. **Product Page Routing**
Verifies all CTAs route through Income Shield:
- ✅ "View Deal" buttons link to `/go/[id]`
- ✅ Comparison page deals route correctly
- ✅ Deal hub links route through affiliate system
- ✅ Flash deals route correctly

### 3. **Compliance Checks**
Ensures zero-checkout violations are removed:
- ✅ `/checkout` returns 404
- ✅ `/dashboard/*` returns 404
- ✅ `/admin/*` returns 404
- ✅ `/vendor/*` returns 404
- ✅ `/api/checkout/*` returns 404

### 4. **Security Tests**
Validates XSS protection and data exposure:
- ✅ JavaScript URLs blocked in redirects
- ✅ API keys not exposed in page HTML
- ✅ Affiliate disclosure banner present
- ✅ Newsletter doesn't collect payment info
- ✅ Price alerts are discovery-only

## Running Tests

### All Tests
```bash
pnpm test
```

### Tests with UI
```bash
pnpm test:ui
```

### Debug Mode
```bash
pnpm test:debug
```

### Single Test File
```bash
pnpm test tests/affiliate-redirects.spec.ts
```

### Specific Test
```bash
pnpm test -g "amazon redirect injects affiliate tag"
```

### Headed Mode (see browser)
```bash
pnpm test --headed
```

### Report
After running tests, open the HTML report:
```bash
pnpm test --reporter=html && npx playwright show-report
```

## Pre-requisites

1. **Start the dev server** (in another terminal):
   ```bash
   pnpm dev
   ```

2. **Ensure Playwright is installed**:
   ```bash
   pnpm install
   ```

## CI/CD Integration

Tests run automatically on:
- Pull requests
- Commits to main branch
- Manual trigger via GitHub Actions

Tests must **PASS** before deployment:
- No payment routes accessible
- All affiliate redirects working
- No XSS vulnerabilities
- Build artifacts successful

## Expected Results

✅ **PASS:** All 30+ tests pass  
✅ **No failures:** Zero-checkout mandate enforced  
✅ **All redirects:** 302 status codes  
✅ **No 500s:** All affiliate systems operational  

## Troubleshooting

### Tests fail to start
```bash
# Kill any existing dev server
pkill -f "next dev"

# Start fresh
pnpm dev &
pnpm test
```

### Browser doesn't open
Tests run headless by default. Use `--headed` flag:
```bash
pnpm test --headed
```

### Timeout errors
Increase timeout in `playwright.config.ts`:
```typescript
use: {
  navigationTimeout: 30000,
  actionTimeout: 10000,
}
```

## Adding New Tests

1. Create test file in `tests/` directory
2. Use naming convention: `*.spec.ts`
3. Import `test`, `expect` from `@playwright/test`
4. Use test groups with `test.describe()`
5. Run tests with `pnpm test`

Example:
```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test('should do something', async ({ page, request }) => {
    // Your test here
  })
})
```

## Governance

These tests enforce:
- ✅ **GEMINI.md v3.0.0** - Zero-checkout mandate
- ✅ **CLAUDE.md** - Code quality standards
- ✅ **DPDPA 2023** - Data privacy compliance
- ✅ **FTC Affiliate Disclosure** - Transparency requirements

## Deployment Gate

Tests MUST pass before production deployment. Deploy blocked if:
- ❌ Any payment route is accessible
- ❌ Affiliate redirects fail
- ❌ Security tests fail
- ❌ Build artifacts are broken

---

**Last Updated:** April 6, 2026  
**Maintained By:** Copilot CLI  
**Governance:** CloudBasket Engineering
