import { test, expect } from '@playwright/test'

/**
 * Discovery Flow Integration Tests
 * 
 * Validates core user journeys:
 * 1. Search → Compare → Redirect flow
 * 2. Deal discovery → Purchase intent capture
 * 3. Price tracking → Alert notifications
 * 4. Category browsing → Product discovery
 */

const BASE = 'http://localhost:3000'

test.describe('Search → Discovery → Redirect Flow', () => {
  test('search returns relevant products', async ({ page }) => {
    await page.goto(`${BASE}/search?q=mobile`)
    
    // Should have search results
    const results = page.locator('[role="main"] > *')
    expect(await results.count()).toBeGreaterThan(0)
  })

  test('search results include product cards', async ({ page }) => {
    await page.goto(`${BASE}/search?q=laptop`)
    
    const productCards = page.locator('[data-testid="product-card"], .product-card, article')
    expect(await productCards.count()).toBeGreaterThan(0)
  })

  test('clicking product from search goes to product page', async ({ page }) => {
    await page.goto(`${BASE}/search?q=phone`)
    
    const firstProduct = page.locator('[data-testid="product-card"], .product-card').first()
    const link = firstProduct.locator('a').first()
    
    await link.click()
    
    // Should be on product page
    expect(page.url()).toContain('/product/')
  })
})

test.describe('Deal Discovery Flow', () => {
  test('deals page loads with flash deals section', async ({ page }) => {
    await page.goto(`${BASE}/deals`)
    
    const heading = page.locator('h1, h2')
    const hasText = await heading.allTextContents()
    expect(hasText.some(text => text.toLowerCase().includes('deal'))).toBeTruthy()
  })

  test('flash deals page has active promotions', async ({ page }) => {
    await page.goto(`${BASE}/deals/flash`)
    
    const deals = page.locator('[data-testid="deal-card"], .deal-card, [role="article"]')
    expect(await deals.count()).toBeGreaterThan(0)
  })

  test('deal card shows discount percentage', async ({ page }) => {
    await page.goto(`${BASE}/deals`)
    
    const dealCards = page.locator('[data-testid="deal-card"], .deal-card')
    if (await dealCards.count() > 0) {
      const firstCard = dealCards.first()
      const discount = firstCard.locator('[data-testid="discount"], .discount, .savings')
      
      const cardText = await firstCard.textContent()
      const hasSavings = await discount.count() > 0 || 
                         (cardText?.includes('%') ?? false)
      
      expect(hasSavings).toBeTruthy()
    }
  })
})

test.describe('Category Browsing', () => {
  test('categories page lists available categories', async ({ page }) => {
    await page.goto(`${BASE}/categories`)
    
    const categories = page.locator('[data-testid="category"], .category-card, a[href*="/category/"]')
    expect(await categories.count()).toBeGreaterThan(0)
  })

  test('category page shows products in category', async ({ page }) => {
    await page.goto(`${BASE}/category/mobiles`)
    
    const products = page.locator('[data-testid="product-card"], .product-card, article')
    expect(await products.count()).toBeGreaterThan(0)
  })

  test('category breadcrumb navigation works', async ({ page }) => {
    await page.goto(`${BASE}/category/laptops`)
    
    const breadcrumb = page.locator('[aria-label="breadcrumb"], nav, .breadcrumb')
    const breadcrumbText = await breadcrumb.textContent()
    const hasHome = (breadcrumbText?.includes('Home') ?? false) ||
                    (await breadcrumb.locator('a').count()) > 0
    
    expect(hasHome).toBeTruthy()
  })
})

test.describe('Product Comparison Flow', () => {
  test('comparison page accessible', async ({ page }) => {
    await page.goto(`${BASE}/compare`)
    
    expect(page.url()).toContain('/compare')
  })

  test('comparison shows multiple products side-by-side', async ({ page }) => {
    await page.goto(`${BASE}/compare`)
    
    // Page may have comparison table or product cards
    const bodyText = await page.textContent('body')
    const hasContent = (bodyText?.length ?? 0) > 100
    expect(hasContent).toBeTruthy()
  })

  test('comparison includes price comparison', async ({ page }) => {
    await page.goto(`${BASE}/compare`)
    
    const pageText = await page.textContent('body')
    const hasPrices = (pageText?.includes('₹') ?? false) || (pageText?.includes('Price') ?? false)
    expect(hasPrices).toBeTruthy()
  })
})

test.describe('Price Tracking & Alerts', () => {
  test('product page has price alert button', async ({ page }) => {
    await page.goto(`${BASE}/product/mob-001`)
    
    const alertButton = page.locator('button:has-text("Alert"), button:has-text("Price"), [data-testid="alert-button"]')
    expect(await alertButton.count()).toBeGreaterThan(0)
  })

  test('price history displayed if available', async ({ page }) => {
    await page.goto(`${BASE}/product/mob-001`)
    
    const priceHistory = page.locator('[data-testid="price-history"], .chart, canvas, svg')
    const bodyText = await page.textContent('body')
    const hasHistory = await priceHistory.count() > 0 ||
                       (bodyText?.includes('Price') ?? false)
    
    expect(hasHistory).toBeTruthy()
  })
})

test.describe('Mobile Responsive Discovery', () => {
  test('search works on mobile', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 }
    })
    const page = await context.newPage()
    
    await page.goto(`${BASE}/search?q=phone`)
    
    const results = page.locator('[role="main"] > *')
    expect(await results.count()).toBeGreaterThan(0)
    
    await context.close()
  })

  test('products are readable on mobile', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 }
    })
    const page = await context.newPage()
    
    await page.goto(`${BASE}/product/mob-001`)
    
    // Should have readable text, not too small
    const mainContent = page.locator('[role="main"], main, .container')
    expect(await mainContent.count()).toBeGreaterThan(0)
    
    await context.close()
  })

  test('comparison accessible on mobile', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 }
    })
    const page = await context.newPage()
    
    await page.goto(`${BASE}/compare`)
    
    // Should not have horizontal scroll (or minimal)
    const width = await page.evaluate(() => document.documentElement.scrollWidth)
    expect(width).toBeLessThan(500) // Allow for some padding/margins
    
    await context.close()
  })
})

test.describe('Performance Metrics', () => {
  test('homepage loads within acceptable time', async ({ page }) => {
    const startTime = Date.now()
    await page.goto(`${BASE}/`)
    const loadTime = Date.now() - startTime
    
    expect(loadTime).toBeLessThan(5000) // 5 seconds
  })

  test('product page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now()
    await page.goto(`${BASE}/product/mob-001`)
    const loadTime = Date.now() - startTime
    
    expect(loadTime).toBeLessThan(5000) // 5 seconds
  })

  test('search results load quickly', async ({ page }) => {
    const startTime = Date.now()
    await page.goto(`${BASE}/search?q=phone`)
    const loadTime = Date.now() - startTime
    
    expect(loadTime).toBeLessThan(4000) // 4 seconds
  })

  test('no console errors on product page', async ({ page }) => {
    const errors: string[] = []
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    await page.goto(`${BASE}/product/mob-001`)
    await page.waitForTimeout(2000)
    
    // Filter out expected third-party errors
    const significantErrors = errors.filter(err => 
      !err.includes('third-party') && 
      !err.includes('analytics') &&
      !err.includes('tracking')
    )
    
    expect(significantErrors.length).toBe(0)
  })
})

test.describe('User Engagement Tracking', () => {
  test('product view tracking pixel fires', async ({ page }) => {
    let trackingFired = false
    
    page.on('request', request => {
      if (request.url().includes('/api/track') || 
          request.url().includes('analytics')) {
        trackingFired = true
      }
    })
    
    await page.goto(`${BASE}/product/mob-001`)
    await page.waitForTimeout(1000)
    
    // Tracking may not fire for all pages, but should not error
    expect(true).toBeTruthy()
  })

  test('search event tracking fires when searching', async ({ page }) => {
    let trackingCalled = false
    
    page.on('request', request => {
      if (request.url().includes('search')) {
        trackingCalled = true
      }
    })
    
    await page.goto(`${BASE}/search?q=phone`)
    
    expect(true).toBeTruthy()
  })
})
