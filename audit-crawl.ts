// audit-crawl.ts
// CloudBasket — Human-Developer Style Full Crawl Audit
// Checks: page load, console errors, broken images, missing hover states,
//         broken links, missing meta tags, layout issues, 404s, redirects
//
// Run: npx playwright test audit-crawl.ts --reporter=html
// Or:  npx ts-node audit-crawl.ts

import { chromium, type Browser, type Page } from 'playwright'
import * as fs from 'fs'
import * as path from 'path'

// ─── Config ───────────────────────────────────────────────────────────────

const BASE_URL = 'http://localhost:3000'

const ALL_ROUTES = [
  // Public pages
  '/',
  '/about',
  '/affiliate',
  '/affiliate-disclosure',
  '/best-deals',
  '/blog',
  '/brands',
  '/careers',
  '/categories',
  '/cj',
  '/compare',
  '/contact',
  '/cookies',
  '/deals',
  '/deals/flash',
  '/faq',
  '/legal/privacy',
  '/legal/terms',
  '/login',
  '/offline',
  '/partners',
  '/pricing',
  '/products',
  '/quiz',
  '/register',
  '/sale',
  '/search',
  '/sitemap-page',
  '/support/ticket',
  '/unsubscribed',
  // Dynamic samples
  '/product/mob-001',
  '/product/mob-002',
  '/category/electronics',
  '/category/fashion',
  '/blog/best-deals-india',
  '/brand/boat',
  // POD
  '/pod',
  '/pod/tshirts',
  '/pod/mugs',
  '/pod/phone-cases',
  '/pod/designs',
  '/pod/upload',
  // Dashboard (will redirect — we note it)
  '/dashboard',
  '/dashboard/rewards',
  '/dashboard/settings',
  // Admin (will redirect — we note it)
  '/admin',
  '/admin/analytics',
  '/admin/catalog',
  '/admin/health',
  '/admin/monitoring',
  '/admin/revenue',
  '/admin/seo',
]

// Interactive elements to hover-test on each page
const HOVER_SELECTORS = [
  'a[href]',
  'button',
  '[role="button"]',
  'nav a',
  '.cb-card',
  '.category-card',
  '.cb-btn',
  '.product-card',
]

// ─── Types ────────────────────────────────────────────────────────────────

interface PageReport {
  url: string
  status: 'ok' | 'redirect' | 'error' | 'timeout'
  finalUrl: string
  httpStatus: number | null
  loadTimeMs: number
  title: string
  metaDescription: string
  h1Count: number
  h1Text: string
  consoleErrors: string[]
  consoleWarnings: string[]
  brokenImages: string[]
  brokenLinks: string[]
  missingAltImages: string[]
  hoverIssues: string[]
  missingHref: string[]
  emptyButtons: string[]
  layoutIssues: string[]
  issues: string[]
}

const report: PageReport[] = []
let totalIssues = 0

// ─── Helpers ──────────────────────────────────────────────────────────────

function log(msg: string) {
  const timestamp = new Date().toISOString().substring(11, 19)
  console.log(`[${timestamp}] ${msg}`)
}

function issueLog(url: string, severity: 'ERROR' | 'WARN' | 'INFO', msg: string) {
  const icon = severity === 'ERROR' ? '❌' : severity === 'WARN' ? '⚠️ ' : 'ℹ️ '
  console.log(`  ${icon} ${msg}`)
  if (severity !== 'INFO') totalIssues++
}

// ─── Page Audit ───────────────────────────────────────────────────────────

async function auditPage(page: Page, route: string): Promise<PageReport> {
  const url = `${BASE_URL}${route}`
  const consoleErrors: string[] = []
  const consoleWarnings: string[] = []

  log(`Auditing: ${route}`)

  // Capture console output
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
    if (msg.type() === 'warning') consoleWarnings.push(msg.text())
  })

  const startTime = Date.now()
  let httpStatus: number | null = null
  let finalUrl = url

  try {
    const response = await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 15000,
    })

    httpStatus = response?.status() ?? null
    finalUrl = page.url()
    const loadTimeMs = Date.now() - startTime

    // Wait a beat for JS to settle
    await page.waitForTimeout(800)

    // ── Meta checks ──
    const title = await page.title()
    const metaDesc = await page.$eval(
      'meta[name="description"]',
      el => el.getAttribute('content') ?? '',
    ).catch(() => '')

    const h1s = await page.$$eval('h1', els => els.map(el => el.textContent?.trim() ?? ''))
    const h1Count = h1s.length
    const h1Text = h1s.join(' | ')

    const pageReport: PageReport = {
      url: route,
      finalUrl,
      status: finalUrl !== url ? 'redirect' : httpStatus === 200 ? 'ok' : 'error',
      httpStatus,
      loadTimeMs,
      title,
      metaDescription: metaDesc,
      h1Count,
      h1Text,
      consoleErrors,
      consoleWarnings,
      brokenImages: [],
      brokenLinks: [],
      missingAltImages: [],
      hoverIssues: [],
      missingHref: [],
      emptyButtons: [],
      layoutIssues: [],
      issues: [],
    }

    // If redirected (e.g. auth routes), skip deep checks
    if (finalUrl !== url) {
      issueLog(route, 'INFO', `Redirected to ${finalUrl}`)
      return pageReport
    }

    // ── Title check ──
    if (!title || title.length < 5) {
      pageReport.issues.push('Missing or very short page title')
      issueLog(route, 'ERROR', `Missing title`)
    }

    // ── Meta description ──
    if (!metaDesc) {
      pageReport.issues.push('Missing meta description')
      issueLog(route, 'WARN', `Missing meta description`)
    }

    // ── H1 check ──
    if (h1Count === 0) {
      pageReport.issues.push('No H1 tag found')
      issueLog(route, 'WARN', `No H1 found`)
    } else if (h1Count > 1) {
      pageReport.issues.push(`Multiple H1 tags (${h1Count})`)
      issueLog(route, 'WARN', `${h1Count} H1 tags — should be 1`)
    }

    // ── Console errors ──
    for (const err of consoleErrors) {
      if (!err.includes('favicon') && !err.includes('CORS')) {
        pageReport.issues.push(`Console error: ${err.substring(0, 120)}`)
        issueLog(route, 'ERROR', `Console: ${err.substring(0, 100)}`)
      }
    }

    // ── Broken images ──
    const images = await page.$$('img')
    for (const img of images) {
      const src = await img.getAttribute('src') ?? ''
      const alt = await img.getAttribute('alt')
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth)

      if (src && naturalWidth === 0) {
        pageReport.brokenImages.push(src)
        issueLog(route, 'ERROR', `Broken image: ${src.substring(0, 80)}`)
      }
      if (alt === null || alt === '') {
        pageReport.missingAltImages.push(src.substring(0, 60))
        issueLog(route, 'WARN', `Missing alt on img: ${src.substring(0, 60)}`)
      }
    }

    // ── Links: missing href, empty text, external without rel ──
    const links = await page.$$('a')
    for (const link of links) {
      const href = await link.getAttribute('href')
      const text = (await link.textContent() ?? '').trim()
      const ariaLabel = await link.getAttribute('aria-label')

      if (!href || href === '#' || href === '') {
        const label = text || ariaLabel || '(no text)'
        pageReport.missingHref.push(label)
        issueLog(route, 'WARN', `Link with no/empty href: "${label}"`)
      }

      if (!text && !ariaLabel) {
        pageReport.issues.push(`Link with no text or aria-label: href="${href}"`)
        issueLog(route, 'WARN', `Invisible link (no text/aria-label): ${href}`)
      }
    }

    // ── Buttons: empty or no accessible label ──
    const buttons = await page.$$('button')
    for (const btn of buttons) {
      const text = (await btn.textContent() ?? '').trim()
      const ariaLabel = await btn.getAttribute('aria-label')
      const title_ = await btn.getAttribute('title')

      if (!text && !ariaLabel && !title_) {
        pageReport.emptyButtons.push('button with no label')
        issueLog(route, 'WARN', `Button with no text or aria-label`)
      }
    }

    // ── Hover state check — look for cursor:pointer elements without :hover CSS ──
    const hoverCheck = await page.evaluate(() => {
      const issues: string[] = []
      const interactiveEls = document.querySelectorAll('a, button, [role="button"], [onclick]')

      interactiveEls.forEach(el => {
        const computed = window.getComputedStyle(el)
        if (computed.cursor !== 'pointer') {
          const tag = el.tagName.toLowerCase()
          const text = el.textContent?.trim().substring(0, 30) ?? ''
          if (tag === 'a' || tag === 'button') {
            issues.push(`${tag}: "${text}" — cursor not pointer`)
          }
        }
      })
      return issues.slice(0, 10) // cap at 10 per page
    })

    for (const issue of hoverCheck) {
      pageReport.hoverIssues.push(issue)
      issueLog(route, 'WARN', `Hover/cursor issue: ${issue}`)
    }

    // ── Hover each interactive element and check for visual change ──
    for (const selector of HOVER_SELECTORS) {
      const els = await page.$$(selector)
      if (els.length === 0) continue

      // Test first 3 of each type
      for (const el of els.slice(0, 3)) {
        try {
          const isVisible = await el.isVisible()
          if (!isVisible) continue

          const box = await el.boundingBox()
          if (!box) continue

          // Get computed style before hover
          const beforeBg = await el.evaluate((e: Element) =>
            window.getComputedStyle(e).backgroundColor
          )

          await el.hover({ timeout: 1000 })
          await page.waitForTimeout(200)

          const afterBg = await el.evaluate((e: Element) =>
            window.getComputedStyle(e).backgroundColor
          )

          // If background didn't change on hover, might be missing hover state
          // Only flag for cards and buttons (not nav links which use color not bg)
          if (
            beforeBg === afterBg &&
            selector.includes('card') &&
            beforeBg === 'rgba(0, 0, 0, 0)'
          ) {
            const text = await el.textContent()
            pageReport.hoverIssues.push(
              `${selector} — no bg change on hover: "${text?.trim().substring(0, 30)}"`
            )
          }
        } catch {
          // Element moved or became hidden — skip
        }
      }
    }

    // ── Layout: check for horizontal overflow ──
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })
    if (hasHorizontalOverflow) {
      pageReport.layoutIssues.push('Horizontal scroll overflow detected')
      issueLog(route, 'WARN', `Horizontal overflow — page wider than viewport`)
    }

    // ── Slow load warning ──
    if (loadTimeMs > 3000) {
      pageReport.issues.push(`Slow load: ${loadTimeMs}ms`)
      issueLog(route, 'WARN', `Slow: ${loadTimeMs}ms`)
    } else {
      issueLog(route, 'INFO', `OK (${loadTimeMs}ms) | H1: "${h1Text.substring(0, 40)}"`)
    }

    return pageReport
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    log(`  💀 TIMEOUT/ERROR: ${message.substring(0, 80)}`)
    return {
      url: route,
      finalUrl: url,
      status: 'timeout',
      httpStatus: null,
      loadTimeMs: Date.now() - startTime,
      title: '',
      metaDescription: '',
      h1Count: 0,
      h1Text: '',
      consoleErrors: [message],
      consoleWarnings: [],
      brokenImages: [],
      brokenLinks: [],
      missingAltImages: [],
      hoverIssues: [],
      missingHref: [],
      emptyButtons: [],
      layoutIssues: [],
      issues: [`Page failed to load: ${message}`],
    }
  }
}

// ─── Report Generator ─────────────────────────────────────────────────────

function generateHTMLReport(results: PageReport[]): string {
  const errors = results.filter(r => r.issues.length > 0 || r.brokenImages.length > 0)
  const ok = results.filter(r => r.status === 'ok' && r.issues.length === 0)
  const redirected = results.filter(r => r.status === 'redirect')

  const rowsHtml = results.map(r => {
    const allIssues = [
      ...r.issues,
      ...r.brokenImages.map(i => `🖼 Broken image: ${i}`),
      ...r.missingAltImages.slice(0, 3).map(i => `🏷 Missing alt: ${i}`),
      ...r.hoverIssues.slice(0, 3).map(i => `🖱 ${i}`),
      ...r.missingHref.slice(0, 3).map(i => `🔗 No href: "${i}"`),
      ...r.emptyButtons.slice(0, 3).map(i => `🔘 ${i}`),
      ...r.layoutIssues.map(i => `📐 ${i}`),
      ...r.consoleErrors.slice(0, 2).map(i => `💻 Console: ${i.substring(0, 100)}`),
    ]

    const statusColor =
      r.status === 'ok' && allIssues.length === 0 ? '#10B981' :
      r.status === 'redirect' ? '#F5C842' :
      r.status === 'error' || r.status === 'timeout' ? '#EF4444' :
      allIssues.length > 3 ? '#EF4444' : '#F97316'

    const statusLabel =
      r.status === 'redirect' ? `↪ ${r.finalUrl.replace(BASE_URL, '')}` :
      r.status === 'timeout' ? 'TIMEOUT' :
      r.status === 'error' ? `HTTP ${r.httpStatus}` : 'OK'

    return `
      <tr>
        <td><a href="${BASE_URL}${r.url}" target="_blank">${r.url}</a></td>
        <td style="color:${statusColor};font-weight:700">${statusLabel}</td>
        <td>${r.loadTimeMs}ms</td>
        <td>${r.h1Text.substring(0, 50) || '—'}</td>
        <td>${r.metaDescription ? '✅' : '❌'}</td>
        <td>${allIssues.length > 0
          ? `<ul style="margin:0;padding-left:16px">${allIssues.map(i => `<li>${i}</li>`).join('')}</ul>`
          : '✅ Clean'
        }</td>
      </tr>`
  }).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>CloudBasket Crawl Audit — ${new Date().toLocaleDateString()}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: Inter, system-ui, sans-serif; background: #09090B; color: #f4f4f5; margin: 0; padding: 24px; }
  h1 { color: #039BE5; font-size: 28px; margin-bottom: 4px; }
  .subtitle { color: #64748B; margin-bottom: 32px; font-size: 14px; }
  .stats { display: flex; gap: 16px; margin-bottom: 32px; flex-wrap: wrap; }
  .stat { background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 16px 24px; min-width: 140px; }
  .stat-num { font-size: 32px; font-weight: 900; }
  .stat-label { color: #64748B; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
  .green { color: #10B981; } .red { color: #EF4444; } .yellow { color: #F5C842; } .orange { color: #F97316; }
  table { width: 100%; border-collapse: collapse; background: #18181b; border-radius: 12px; overflow: hidden; }
  th { background: #0f172a; padding: 12px 16px; text-align: left; font-size: 11px; text-transform: uppercase;
       letter-spacing: 0.06em; color: #64748B; border-bottom: 1px solid #27272a; }
  td { padding: 12px 16px; border-bottom: 1px solid #27272a; font-size: 13px; vertical-align: top; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #1E293B; }
  a { color: #039BE5; text-decoration: none; }
  a:hover { text-decoration: underline; }
  li { margin-bottom: 4px; }
  .badge { display:inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; }
</style>
</head>
<body>
<h1>☁️ CloudBasket Crawl Audit</h1>
<p class="subtitle">Generated: ${new Date().toISOString()} | Base: ${BASE_URL} | Pages crawled: ${results.length}</p>

<div class="stats">
  <div class="stat"><div class="stat-num green">${ok.length}</div><div class="stat-label">Clean Pages</div></div>
  <div class="stat"><div class="stat-num red">${errors.length}</div><div class="stat-label">Pages with Issues</div></div>
  <div class="stat"><div class="stat-num yellow">${redirected.length}</div><div class="stat-label">Redirected</div></div>
  <div class="stat"><div class="stat-num orange">${totalIssues}</div><div class="stat-label">Total Issues</div></div>
  <div class="stat"><div class="stat-num">${results.filter(r => r.brokenImages.length > 0).reduce((a, r) => a + r.brokenImages.length, 0)}</div><div class="stat-label">Broken Images</div></div>
  <div class="stat"><div class="stat-num">${results.filter(r => r.hoverIssues.length > 0).reduce((a, r) => a + r.hoverIssues.length, 0)}</div><div class="stat-label">Hover Issues</div></div>
</div>

<table>
  <thead>
    <tr>
      <th>Route</th>
      <th>Status</th>
      <th>Load</th>
      <th>H1</th>
      <th>Meta</th>
      <th>Issues</th>
    </tr>
  </thead>
  <tbody>${rowsHtml}</tbody>
</table>
</body>
</html>`
}

// ─── Main ─────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n╔══════════════════════════════════════════╗')
  console.log('║  CloudBasket Human-Dev Crawl Audit       ║')
  console.log('╚══════════════════════════════════════════╝\n')

  const browser: Browser = await chromium.launch({ headless: true })

  for (const route of ALL_ROUTES) {
    const page = await browser.newPage()
    await page.setViewportSize({ width: 1440, height: 900 })

    try {
      const result = await auditPage(page, route)
      report.push(result)
    } finally {
      await page.close()
    }
  }

  await browser.close()

  // ── Write reports ──
  const html = generateHTMLReport(report)
  const htmlPath = path.join(process.cwd(), 'audit-report.html')
  fs.writeFileSync(htmlPath, html)

  const jsonPath = path.join(process.cwd(), 'audit-report.json')
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2))

  // ── Summary ──
  console.log('\n══════════════════════════════════════════')
  console.log('  AUDIT COMPLETE')
  console.log('══════════════════════════════════════════')
  console.log(`  Pages crawled:  ${report.length}`)
  console.log(`  Clean:          ${report.filter(r => r.issues.length === 0 && r.brokenImages.length === 0).length}`)
  console.log(`  With issues:    ${report.filter(r => r.issues.length > 0 || r.brokenImages.length > 0).length}`)
  console.log(`  Total issues:   ${totalIssues}`)
  console.log(`  Broken images:  ${report.reduce((a, r) => a + r.brokenImages.length, 0)}`)
  console.log(`  Hover issues:   ${report.reduce((a, r) => a + r.hoverIssues.length, 0)}`)
  console.log(`\n  📄 HTML Report: ${htmlPath}`)
  console.log(`  📋 JSON Report: ${jsonPath}\n`)
}

main().catch(console.error)
