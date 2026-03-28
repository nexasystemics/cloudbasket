// audit-deep.ts
// CloudBasket — FULL SITE DEEP CRAWL (1200+ pages)
// Discovers ALL routes dynamically from sitemap + static list
// Run: npx ts-node audit-deep.ts

import { chromium, type Browser, type Page } from 'playwright'
import * as fs from 'fs'
import * as path from 'path'

const BASE_URL = 'http://localhost:3000'
const CONCURRENCY = 4        // parallel tabs — increase if machine is fast
const TIMEOUT_MS  = 12000
const OUT_DIR     = path.join(process.cwd(), 'audit-deep-results')

// ── Static routes (all 96 pages) ──────────────────────────────────────────
const STATIC_ROUTES = [
  '/', '/about', '/affiliate', '/affiliate-disclosure', '/app',
  '/associates', '/best-deals', '/blog', '/brands', '/careers',
  '/categories', '/cj', '/compare', '/contact', '/cookies',
  '/dashboard', '/dashboard/rewards', '/dashboard/settings',
  '/deals', '/deals/flash', '/faq',
  '/legal/privacy', '/legal/terms', '/login', '/offline',
  '/partners', '/pod', '/pod/designs', '/pod/mugs',
  '/pod/phone-cases', '/pod/tshirts', '/pod/upload',
  '/pricing', '/products', '/quiz', '/register', '/sale',
  '/search', '/sitemap-page', '/support/ticket', '/unsubscribed',
  // Admin sample (will redirect — confirms guard working)
  '/admin', '/admin/analytics', '/admin/catalog', '/admin/health',
  '/admin/monitoring', '/admin/revenue', '/admin/seo',
  '/admin/pod/ai-studio', '/admin/pod/orders', '/admin/settings',
]

// ─── Types ────────────────────────────────────────────────────────────────
interface PageResult {
  url: string
  status: 'ok' | 'redirect' | 'error' | 'timeout'
  finalUrl: string
  httpStatus: number | null
  loadMs: number
  title: string
  hasMetaDesc: boolean
  h1Count: number
  h1: string
  consoleErrors: number
  brokenImages: number
  missingAlts: number
  emptyLinks: number
  emptyButtons: number
  hasOverflow: boolean
  issues: string[]
}

// ─── Discover all product/category/blog routes from sitemap ───────────────
async function discoverRoutes(browser: Browser): Promise<string[]> {
  console.log('🔍 Discovering routes from sitemap...')
  const discovered: string[] = []

  try {
    const page = await browser.newPage()
    const res = await page.goto(`${BASE_URL}/sitemap.xml`, { timeout: 10000 })

    if (res?.status() === 200) {
      const xml = await page.content()
      const matches = xml.match(/<loc>([^<]+)<\/loc>/g) ?? []
      for (const m of matches) {
        const url = m.replace('<loc>', '').replace('</loc>', '').trim()
        const route = url.replace(BASE_URL, '')
        if (route && route !== '/' && !STATIC_ROUTES.includes(route)) {
          discovered.push(route)
        }
      }
      console.log(`  ✅ Found ${discovered.length} routes in sitemap`)
    } else {
      console.log('  ⚠️  Sitemap returned non-200, using fallback product IDs')
    }
    await page.close()
  } catch {
    console.log('  ⚠️  Sitemap fetch failed, using fallback')
  }

  // Fallback: if sitemap empty, sample known product IDs
  if (discovered.length === 0) {
    const brands = ['mob', 'IN-EL-BOT', 'IN-EL-RLM', 'IN-FA-PUM', 'IN-HA-BAJ']
    for (const b of brands) {
      for (let i = 1; i <= 20; i++) {
        discovered.push(`/product/${b}-${String(i).padStart(3, '0')}`)
      }
    }
  }

  return discovered
}

// ─── Audit a single page ──────────────────────────────────────────────────
async function auditPage(page: Page, route: string): Promise<PageResult> {
  const url = `${BASE_URL}${route}`
  let consoleErrors = 0
  page.on('console', m => { if (m.type() === 'error') consoleErrors++ })

  const t0 = Date.now()
  let httpStatus: number | null = null
  let finalUrl = url

  try {
    const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: TIMEOUT_MS })
    httpStatus = res?.status() ?? null
    finalUrl = page.url()
    await page.waitForTimeout(400)

    const loadMs = Date.now() - t0
    const title = await page.title()
    const hasMetaDesc = await page.$('meta[name="description"]').then(el => !!el)
    const h1s = await page.$$eval('h1', els => els.map(e => e.textContent?.trim() ?? ''))
    const issues: string[] = []

    // Redirected — skip deep checks
    if (finalUrl !== url) {
      return {
        url: route, finalUrl, status: 'redirect',
        httpStatus, loadMs, title, hasMetaDesc,
        h1Count: 0, h1: '', consoleErrors: 0,
        brokenImages: 0, missingAlts: 0,
        emptyLinks: 0, emptyButtons: 0,
        hasOverflow: false, issues: [`→ ${finalUrl.replace(BASE_URL, '')}`]
      }
    }

    // Broken images
    const brokenImages = await page.$$eval('img', imgs =>
      imgs.filter((img: HTMLImageElement) => img.complete && img.naturalWidth === 0).length
    )

    // Missing alts
    const missingAlts = await page.$$eval('img', imgs =>
      imgs.filter((img: HTMLImageElement) => !img.alt).length
    )

    // Empty links
    const emptyLinks = await page.$$eval('a', anchors =>
      anchors.filter(a => !a.href || a.href === '#' || a.href === window.location.href + '#').length
    )

    // Empty buttons
    const emptyButtons = await page.$$eval('button', btns =>
      btns.filter(b => !b.textContent?.trim() && !b.getAttribute('aria-label')).length
    )

    // Horizontal overflow
    const hasOverflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth + 5
    )

    // Build issues list
    if (!title || title.length < 5) issues.push('Missing title')
    if (!hasMetaDesc) issues.push('No meta description')
    if (h1s.length === 0) issues.push('No H1')
    if (h1s.length > 1) issues.push(`${h1s.length} H1 tags`)
    if (brokenImages > 0) issues.push(`${brokenImages} broken images`)
    if (missingAlts > 0) issues.push(`${missingAlts} missing alt`)
    if (emptyLinks > 0) issues.push(`${emptyLinks} empty links`)
    if (emptyButtons > 0) issues.push(`${emptyButtons} unlabelled buttons`)
    if (hasOverflow) issues.push('Horizontal overflow')
    if (consoleErrors > 0) issues.push(`${consoleErrors} console errors`)
    if (loadMs > 3000) issues.push(`Slow: ${loadMs}ms`)
    if (httpStatus && httpStatus >= 400) issues.push(`HTTP ${httpStatus}`)

    return {
      url: route, finalUrl,
      status: httpStatus === 200 ? 'ok' : 'error',
      httpStatus, loadMs, title, hasMetaDesc,
      h1Count: h1s.length, h1: h1s[0] ?? '',
      consoleErrors, brokenImages, missingAlts,
      emptyLinks, emptyButtons, hasOverflow, issues
    }
  } catch (e: unknown) {
    return {
      url: route, finalUrl: url, status: 'timeout',
      httpStatus: null, loadMs: Date.now() - t0,
      title: '', hasMetaDesc: false, h1Count: 0, h1: '',
      consoleErrors: 0, brokenImages: 0, missingAlts: 0,
      emptyLinks: 0, emptyButtons: 0, hasOverflow: false,
      issues: [`TIMEOUT/ERROR: ${String(e).substring(0, 80)}`]
    }
  }
}

// ─── Concurrent batch runner ──────────────────────────────────────────────
async function runBatch(browser: Browser, routes: string[]): Promise<PageResult[]> {
  const results: PageResult[] = []
  let idx = 0
  let done = 0
  const total = routes.length

  async function worker() {
    while (idx < routes.length) {
      const route = routes[idx++]
      const page = await browser.newPage()
      await page.setViewportSize({ width: 1440, height: 900 })
      try {
        const result = await auditPage(page, route)
        results.push(result)
        done++
        const pct = Math.round((done / total) * 100)
        const bar = '█'.repeat(Math.floor(pct / 5)) + '░'.repeat(20 - Math.floor(pct / 5))
        const icon = result.issues.length === 0 ? '✅' : result.status === 'redirect' ? '↪ ' : '❌'
        process.stdout.write(`\r  [${bar}] ${pct}% (${done}/${total}) ${icon} ${route.substring(0, 40).padEnd(40)}`)
      } finally {
        await page.close()
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker))
  process.stdout.write('\n')
  return results
}

// ─── HTML Report ──────────────────────────────────────────────────────────
function generateReport(results: PageResult[]): string {
  const clean    = results.filter(r => r.issues.length === 0)
  const issues   = results.filter(r => r.issues.length > 0 && r.status !== 'redirect')
  const redirects= results.filter(r => r.status === 'redirect')
  const timeouts = results.filter(r => r.status === 'timeout')

  const totalBrokenImgs  = results.reduce((a, r) => a + r.brokenImages, 0)
  const totalMissingAlts = results.reduce((a, r) => a + r.missingAlts, 0)
  const totalEmptyLinks  = results.reduce((a, r) => a + r.emptyLinks, 0)
  const totalNoMeta      = results.filter(r => !r.hasMetaDesc && r.status === 'ok').length
  const avgLoad          = Math.round(results.filter(r => r.status === 'ok').reduce((a, r) => a + r.loadMs, 0) / (clean.length || 1))

  // Sort: errors first, then by issue count
  const sorted = [...results].sort((a, b) => {
    if (a.status === 'timeout' && b.status !== 'timeout') return -1
    if (b.status === 'timeout' && a.status !== 'timeout') return 1
    return b.issues.length - a.issues.length
  })

  const rows = sorted.map(r => {
    const color =
      r.status === 'timeout' ? '#EF4444' :
      r.status === 'error'   ? '#EF4444' :
      r.status === 'redirect'? '#F5C842' :
      r.issues.length > 5    ? '#F97316' :
      r.issues.length > 0    ? '#F5C842' : '#10B981'

    const statusBadge =
      r.status === 'redirect' ? `↪ ${r.issues[0] ?? ''}` :
      r.status === 'timeout'  ? 'TIMEOUT' :
      r.httpStatus?.toString() ?? 'OK'

    return `<tr>
      <td><a href="${BASE_URL}${r.url}" target="_blank">${r.url}</a></td>
      <td style="color:${color};font-weight:700;white-space:nowrap">${statusBadge}</td>
      <td style="white-space:nowrap">${r.loadMs}ms</td>
      <td>${r.brokenImages || '—'}</td>
      <td>${r.missingAlts || '—'}</td>
      <td>${r.emptyLinks || '—'}</td>
      <td>${r.hasMetaDesc ? '✅' : r.status === 'ok' ? '❌' : '—'}</td>
      <td>${r.h1Count === 1 ? '✅' : r.status === 'ok' ? `❌ ${r.h1Count}` : '—'}</td>
      <td style="font-size:12px">${r.issues.filter((_,i) => i > 0 || r.status !== 'redirect').join('<br>')}</td>
    </tr>`
  }).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>CloudBasket Deep Audit — ${new Date().toLocaleDateString('en-IN')}</title>
<style>
  *{box-sizing:border-box}
  body{font-family:Inter,system-ui,sans-serif;background:#09090B;color:#f4f4f5;margin:0;padding:24px;font-size:14px}
  h1{color:#039BE5;font-size:26px;margin:0 0 4px}
  .sub{color:#64748B;font-size:13px;margin-bottom:28px}
  .stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;margin-bottom:28px}
  .stat{background:#18181b;border:1px solid #27272a;border-radius:10px;padding:14px 18px}
  .stat-n{font-size:28px;font-weight:900;line-height:1}
  .stat-l{color:#64748B;font-size:11px;text-transform:uppercase;letter-spacing:.05em;margin-top:4px}
  .green{color:#10B981}.red{color:#EF4444}.yellow{color:#F5C842}.orange{color:#F97316}.blue{color:#039BE5}
  .filters{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap}
  .filter-btn{padding:6px 14px;border-radius:6px;border:1px solid #27272a;background:#18181b;
    color:#94A3B8;cursor:pointer;font-size:12px;font-weight:700}
  .filter-btn.active,.filter-btn:hover{border-color:#039BE5;color:#039BE5}
  table{width:100%;border-collapse:collapse;background:#18181b;border-radius:10px;overflow:hidden;font-size:13px}
  th{background:#0f172a;padding:10px 12px;text-align:left;font-size:10px;text-transform:uppercase;
     letter-spacing:.06em;color:#64748B;border-bottom:1px solid #27272a;white-space:nowrap}
  td{padding:10px 12px;border-bottom:1px solid #1e293b;vertical-align:top}
  tr:hover td{background:#1E293B}
  a{color:#039BE5;text-decoration:none}
  a:hover{text-decoration:underline}
  .search-box{width:100%;padding:10px 14px;background:#18181b;border:1px solid #27272a;
    border-radius:8px;color:#f4f4f5;font-size:14px;margin-bottom:12px;outline:none}
  .search-box:focus{border-color:#039BE5}
</style>
</head>
<body>
<h1>☁️ CloudBasket — Deep Site Audit</h1>
<p class="sub">Generated: ${new Date().toLocaleString('en-IN')} | Base: ${BASE_URL} | Pages: ${results.length} | Concurrency: ${CONCURRENCY}</p>

<div class="stats">
  <div class="stat"><div class="stat-n">${results.length}</div><div class="stat-l">Pages Crawled</div></div>
  <div class="stat"><div class="stat-n green">${clean.length}</div><div class="stat-l">Clean ✅</div></div>
  <div class="stat"><div class="stat-n red">${issues.length}</div><div class="stat-l">With Issues</div></div>
  <div class="stat"><div class="stat-n yellow">${redirects.length}</div><div class="stat-l">Redirected</div></div>
  <div class="stat"><div class="stat-n red">${timeouts.length}</div><div class="stat-l">Timeouts</div></div>
  <div class="stat"><div class="stat-n red">${totalBrokenImgs}</div><div class="stat-l">Broken Images</div></div>
  <div class="stat"><div class="stat-n orange">${totalMissingAlts}</div><div class="stat-l">Missing Alts</div></div>
  <div class="stat"><div class="stat-n orange">${totalEmptyLinks}</div><div class="stat-l">Empty Links</div></div>
  <div class="stat"><div class="stat-n yellow">${totalNoMeta}</div><div class="stat-l">No Meta Desc</div></div>
  <div class="stat"><div class="stat-n blue">${avgLoad}ms</div><div class="stat-l">Avg Load</div></div>
</div>

<input class="search-box" type="text" placeholder="🔍 Filter routes..." oninput="filterRows(this.value)">

<div class="filters">
  <button class="filter-btn active" onclick="showAll()">All (${results.length})</button>
  <button class="filter-btn" onclick="filterStatus('error')">Errors (${issues.length})</button>
  <button class="filter-btn" onclick="filterStatus('redirect')">Redirects (${redirects.length})</button>
  <button class="filter-btn" onclick="filterBroken()">Broken Images (${results.filter(r=>r.brokenImages>0).length})</button>
  <button class="filter-btn" onclick="filterNoMeta()">No Meta (${totalNoMeta})</button>
  <button class="filter-btn" onclick="filterStatus('timeout')">Timeouts (${timeouts.length})</button>
</div>

<table id="audit-table">
  <thead>
    <tr>
      <th>Route</th>
      <th>Status</th>
      <th>Load</th>
      <th>🖼 Broken</th>
      <th>🏷 Alt</th>
      <th>🔗 Links</th>
      <th>Meta</th>
      <th>H1</th>
      <th>Issues</th>
    </tr>
  </thead>
  <tbody id="table-body">${rows}</tbody>
</table>

<script>
const allRows = document.querySelectorAll('#table-body tr')

function showAll() { allRows.forEach(r => r.style.display = '') }

function filterStatus(status) {
  allRows.forEach(r => {
    const s = r.children[1].textContent
    r.style.display = (
      status === 'error'    ? (s.includes('4') || s.includes('5') || s.includes('TIMEOUT')) :
      status === 'redirect' ? s.includes('↪') :
      status === 'timeout'  ? s.includes('TIMEOUT') : true
    ) ? '' : 'none'
  })
}

function filterBroken() {
  allRows.forEach(r => {
    const broken = r.children[3].textContent.trim()
    r.style.display = broken && broken !== '—' ? '' : 'none'
  })
}

function filterNoMeta() {
  allRows.forEach(r => {
    const meta = r.children[6].textContent.trim()
    r.style.display = meta === '❌' ? '' : 'none'
  })
}

function filterRows(q) {
  const lq = q.toLowerCase()
  allRows.forEach(r => {
    r.style.display = r.textContent.toLowerCase().includes(lq) ? '' : 'none'
  })
}
</script>
</body>
</html>`
}

// ─── Main ─────────────────────────────────────────────────────────────────
async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

  console.log('\n╔══════════════════════════════════════════════╗')
  console.log('║  CloudBasket DEEP CRAWL — All 1200+ Pages   ║')
  console.log('╚══════════════════════════════════════════════╝\n')

  const browser: Browser = await chromium.launch({ headless: true })

  // 1. Discover dynamic routes from sitemap
  const dynamicRoutes = await discoverRoutes(browser)
  const allRoutes = [...STATIC_ROUTES, ...dynamicRoutes]

  console.log(`\n📋 Total routes to crawl: ${allRoutes.length}`)
  console.log(`   Static:  ${STATIC_ROUTES.length}`)
  console.log(`   Dynamic: ${dynamicRoutes.length}`)
  console.log(`   Workers: ${CONCURRENCY} parallel tabs\n`)

  // 2. Run crawl
  console.log('🚀 Starting crawl...\n')
  const results = await runBatch(browser, allRoutes)
  await browser.close()

  // 3. Save reports
  const html = generateReport(results)
  const htmlPath = path.join(OUT_DIR, 'deep-audit-report.html')
  const jsonPath = path.join(OUT_DIR, 'deep-audit-report.json')
  fs.writeFileSync(htmlPath, html)
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2))

  // 4. Console summary
  const clean     = results.filter(r => r.issues.length === 0)
  const withIssues= results.filter(r => r.issues.length > 0 && r.status !== 'redirect')
  const broken    = results.reduce((a, r) => a + r.brokenImages, 0)

  console.log('\n══════════════════════════════════════════════')
  console.log('  DEEP AUDIT COMPLETE')
  console.log('══════════════════════════════════════════════')
  console.log(`  Pages crawled:    ${results.length}`)
  console.log(`  ✅ Clean:         ${clean.length}`)
  console.log(`  ❌ With issues:   ${withIssues.length}`)
  console.log(`  ↪  Redirected:   ${results.filter(r => r.status === 'redirect').length}`)
  console.log(`  💀 Timeouts:     ${results.filter(r => r.status === 'timeout').length}`)
  console.log(`  🖼 Broken imgs:  ${broken}`)
  console.log(`  🏷 Missing alts: ${results.reduce((a,r) => a + r.missingAlts, 0)}`)
  console.log(`  🔗 Empty links:  ${results.reduce((a,r) => a + r.emptyLinks, 0)}`)
  console.log(`\n  📄 HTML: ${htmlPath}`)
  console.log(`  📋 JSON: ${jsonPath}\n`)

  // 5. Top 10 worst pages
  console.log('  TOP 10 PAGES WITH MOST ISSUES:')
  ;[...withIssues].sort((a,b) => b.issues.length - a.issues.length).slice(0, 10).forEach((r, i) => {
    console.log(`  ${i+1}. ${r.url.padEnd(45)} ${r.issues.length} issues`)
  })
  console.log('')
}

main().catch(console.error)
