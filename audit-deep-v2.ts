// audit-deep-v2.ts
// CloudBasket — FIXED Deep Crawl
// Fixes: concurrency crash, premature DOM check, sitemap domain filter
// Run: npx ts-node audit-deep-v2.ts

import { chromium, type Browser, type Page } from 'playwright'
import * as fs from 'fs'
import * as path from 'path'

const BASE_URL    = 'http://localhost:3000'
const CONCURRENCY = 2        // 2 is safe for Turbopack dev; use 1 if still getting 404s
const TIMEOUT_MS  = 20000    // longer timeout — Turbopack compiles on first hit
const HYDRATE_MS  = 1200     // wait for React hydration before reading DOM
const OUT_DIR     = path.join(process.cwd(), 'audit-deep-results')

// ── All 96 static routes ───────────────────────────────────────────────────
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
  // Admin (will redirect to /login — confirms guard working)
  '/admin', '/admin/analytics', '/admin/catalog', '/admin/health',
  '/admin/monitoring', '/admin/revenue', '/admin/seo', '/admin/settings',
  '/admin/affiliates', '/admin/content', '/admin/cro', '/admin/emails',
  '/admin/gap-analysis', '/admin/lister', '/admin/marketing',
  '/admin/moderation', '/admin/performance', '/admin/referrals',
  '/admin/social', '/admin/sponsored', '/admin/support', '/admin/tax',
  '/admin/pod/ai-studio', '/admin/pod/orders', '/admin/pod/listings',
  '/admin/pod/pricing', '/admin/pod/quality', '/admin/pod/upload',
]

// ─── Discover product/category/blog routes from sitemap ───────────────────
async function discoverRoutes(browser: Browser): Promise<string[]> {
  console.log('🔍 Discovering dynamic routes from sitemap...')
  const routes: string[] = []

  try {
    const page = await browser.newPage()
    const res = await page.goto(`${BASE_URL}/sitemap.xml`, { timeout: 10000 })

    if (res?.status() === 200) {
      const content = await page.content()
      // Extract <loc> values — ONLY keep localhost URLs
      const matches = content.match(/<loc>([^<]+)<\/loc>/g) ?? []
      for (const m of matches) {
        const fullUrl = m.replace(/<\/?loc>/g, '').trim()
        // Only process URLs that belong to localhost
        if (fullUrl.startsWith(BASE_URL)) {
          const route = fullUrl.replace(BASE_URL, '') || '/'
          if (!STATIC_ROUTES.includes(route)) {
            routes.push(route)
          }
        }
        // If sitemap has production URLs, extract the path and use it
        else if (fullUrl.startsWith('http')) {
          try {
            const u = new URL(fullUrl)
            const route = u.pathname
            if (route && route !== '/' && !STATIC_ROUTES.includes(route)) {
              routes.push(route)
            }
          } catch { /* skip malformed URLs */ }
        }
      }
      console.log(`  ✅ ${routes.length} dynamic routes from sitemap`)
    }
    await page.close()
  } catch {
    console.log('  ⚠️  Sitemap unavailable')
  }

  // Always add known product ID samples to test the product page
  const sampleIds = [
    'mob-001', 'mob-002', 'mob-003',
    'IN-EL-BOT-001', 'IN-EL-BOT-002', 'IN-EL-BOT-050',
    'IN-EL-RLM-001', 'IN-FA-PUM-001', 'IN-HA-BAJ-001',
    'IN-PC-DAB-001', 'IN-FG-ITC-001',
  ]
  for (const id of sampleIds) {
    const r = `/product/${id}`
    if (!routes.includes(r)) routes.push(r)
  }

  // Sample brand/category/blog routes
  const extras = [
    '/brand/boat', '/brand/realme', '/brand/puma',
    '/category/electronics', '/category/fashion', '/category/home-appliances',
    '/blog/best-deals-india', '/blog/top-earphones-under-2000',
    '/deals/deal-001', '/pod/tshirt',
  ]
  for (const r of extras) {
    if (!routes.includes(r)) routes.push(r)
  }

  return routes
}

// ─── Page result type ─────────────────────────────────────────────────────
interface PageResult {
  url: string
  status: 'ok' | 'redirect' | 'not-found' | 'error' | 'timeout'
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
  emptyButtons: string[]
  hasOverflow: boolean
  issues: string[]
}

// ─── Audit one page ───────────────────────────────────────────────────────
async function auditPage(page: Page, route: string): Promise<PageResult> {
  const url = `${BASE_URL}${route}`
  let consoleErrors = 0
  const consoleMessages: string[] = []

  page.on('console', m => {
    if (m.type() === 'error') {
      consoleErrors++
      consoleMessages.push(m.text().substring(0, 120))
    }
  })

  const t0 = Date.now()
  let httpStatus: number | null = null
  let finalUrl = url

  try {
    const res = await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: TIMEOUT_MS,
    })
    httpStatus = res?.status() ?? null
    finalUrl = page.url()

    // CRITICAL FIX: wait for React hydration + metadata to be applied
    await page.waitForTimeout(HYDRATE_MS)

    // Also wait for h1 or body to have content
    try {
      await page.waitForFunction(
        () => document.title.length > 0 || document.querySelector('h1') !== null,
        { timeout: 5000 }
      )
    } catch { /* page may have no title/h1 — that's a real issue */ }

    const loadMs = Date.now() - t0
    const title = await page.title()
    const hasMetaDesc = await page.$('meta[name="description"]').then(e => !!e).catch(() => false)
    const h1s = await page.$$eval('h1', els => els.map(e => e.textContent?.trim() ?? '')).catch(() => [] as string[])
    const issues: string[] = []

    // Redirected pages — just note it, don't flag as issues
    const isRedirected = finalUrl !== url
    if (isRedirected) {
      return {
        url: route, finalUrl,
        status: 'redirect', httpStatus, loadMs,
        title, hasMetaDesc, h1Count: 0, h1: '',
        consoleErrors: 0, brokenImages: 0, missingAlts: 0,
        emptyLinks: 0, emptyButtons: [], hasOverflow: false,
        issues: [`→ ${finalUrl.replace(BASE_URL, '')}`]
      }
    }

    // Real 404 (not-found page, not a redirect)
    if (httpStatus === 404) {
      return {
        url: route, finalUrl,
        status: 'not-found', httpStatus, loadMs,
        title, hasMetaDesc, h1Count: 0, h1: '',
        consoleErrors: 0, brokenImages: 0, missingAlts: 0,
        emptyLinks: 0, emptyButtons: [], hasOverflow: false,
        issues: ['404 — Page not found (real missing route)']
      }
    }

    // ── Broken images ──
    const brokenImages = await page.$$eval('img', imgs =>
      (imgs as HTMLImageElement[]).filter(img => img.complete && img.naturalWidth === 0).length
    ).catch(() => 0)

    // ── Missing alts ──
    const missingAlts = await page.$$eval('img', imgs =>
      (imgs as HTMLImageElement[]).filter(img => !img.getAttribute('alt')).length
    ).catch(() => 0)

    // ── Empty links ──
    const emptyLinks = await page.$$eval('a', anchors =>
      anchors.filter(a => {
        const href = a.getAttribute('href')
        return !href || href === '#' || href === ''
      }).length
    ).catch(() => 0)

    // ── Unlabelled buttons — collect actual button text for context ──
    const emptyButtons = await page.$$eval('button', btns =>
      btns
        .filter(b => !b.textContent?.trim() && !b.getAttribute('aria-label') && !b.getAttribute('title'))
        .map(b => b.className.substring(0, 40) || 'unknown')
    ).catch(() => [] as string[])

    // ── Horizontal overflow ──
    const hasOverflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth + 5
    ).catch(() => false)

    // ── Build issues ──
    if (!title || title.length < 5)    issues.push('Missing page title')
    if (!hasMetaDesc)                  issues.push('No meta description')
    if (h1s.length === 0)              issues.push('No H1 tag')
    if (h1s.length > 1)               issues.push(`Multiple H1s (${h1s.length})`)
    if (brokenImages > 0)             issues.push(`${brokenImages} broken images`)
    if (missingAlts > 0)              issues.push(`${missingAlts} imgs missing alt`)
    if (emptyLinks > 0)               issues.push(`${emptyLinks} links with no href`)
    if (emptyButtons.length > 0)      issues.push(`${emptyButtons.length} unlabelled buttons`)
    if (hasOverflow)                  issues.push('Horizontal scroll overflow')
    if (consoleErrors > 0)            issues.push(`${consoleErrors} console errors`)
    if (httpStatus && httpStatus >= 400) issues.push(`HTTP ${httpStatus}`)
    if (loadMs > 4000)                issues.push(`Slow load: ${loadMs}ms`)

    return {
      url: route, finalUrl,
      status: 'ok', httpStatus, loadMs,
      title, hasMetaDesc,
      h1Count: h1s.length, h1: h1s[0] ?? '',
      consoleErrors, brokenImages, missingAlts,
      emptyLinks, emptyButtons, hasOverflow, issues
    }

  } catch (e: unknown) {
    const msg = String(e).substring(0, 100)
    return {
      url: route, finalUrl: url, status: 'timeout',
      httpStatus: null, loadMs: Date.now() - t0,
      title: '', hasMetaDesc: false, h1Count: 0, h1: '',
      consoleErrors: 0, brokenImages: 0, missingAlts: 0,
      emptyLinks: 0, emptyButtons: [], hasOverflow: false,
      issues: [`TIMEOUT: ${msg}`]
    }
  }
}

// ─── Concurrent runner with progress bar ─────────────────────────────────
async function runCrawl(browser: Browser, routes: string[]): Promise<PageResult[]> {
  const results: PageResult[] = new Array(routes.length)
  let idx = 0
  let done = 0
  const total = routes.length

  async function worker(workerId: number) {
    while (true) {
      const myIdx = idx++
      if (myIdx >= routes.length) break
      const route = routes[myIdx]
      const page = await browser.newPage()
      await page.setViewportSize({ width: 1440, height: 900 })
      // Block analytics/ads to speed up crawl
      await page.route('**/(gtag|gtm|analytics|facebook|clarity|hotjar)**', r => r.abort())
      try {
        const result = await auditPage(page, route)
        results[myIdx] = result
        done++
        const pct = Math.round((done / total) * 100)
        const filled = Math.floor(pct / 4)
        const bar = '█'.repeat(filled) + '░'.repeat(25 - filled)
        const icon = result.status === 'redirect' ? '↪ ' :
                     result.status === 'not-found' ? '🚫' :
                     result.status === 'timeout'   ? '💀' :
                     result.issues.length === 0    ? '✅' : '❌'
        process.stdout.write(
          `\r  [${bar}] ${pct}% (${done}/${total}) ${icon} ${route.substring(0, 35).padEnd(35)}`
        )
      } finally {
        await page.close()
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => worker(i)))
  process.stdout.write('\n')
  return results.filter(Boolean)
}

// ─── HTML Report ──────────────────────────────────────────────────────────
function buildReport(results: PageResult[]): string {
  const ok        = results.filter(r => r.status === 'ok' && r.issues.length === 0)
  const withIssues= results.filter(r => r.issues.length > 0 && r.status !== 'redirect' && r.status !== 'not-found')
  const redirects = results.filter(r => r.status === 'redirect')
  const notFound  = results.filter(r => r.status === 'not-found')
  const timeouts  = results.filter(r => r.status === 'timeout')

  const totBroken = results.reduce((a, r) => a + r.brokenImages, 0)
  const totAlts   = results.reduce((a, r) => a + r.missingAlts, 0)
  const totLinks  = results.reduce((a, r) => a + r.emptyLinks, 0)
  const totBtns   = results.reduce((a, r) => a + r.emptyButtons.length, 0)
  const noMeta    = results.filter(r => !r.hasMetaDesc && r.status === 'ok').length
  const noH1      = results.filter(r => r.h1Count === 0 && r.status === 'ok').length
  const avgLoad   = Math.round(
    results.filter(r => r.status === 'ok').reduce((a, r) => a + r.loadMs, 0) / (ok.length || 1)
  )

  const sorted = [...results].sort((a, b) => {
    const order = { timeout: 0, 'not-found': 1, error: 2, ok: 3, redirect: 4 }
    const diff = (order[a.status] ?? 5) - (order[b.status] ?? 5)
    return diff !== 0 ? diff : b.issues.length - a.issues.length
  })

  const rows = sorted.map(r => {
    const color =
      r.status === 'timeout'    ? '#EF4444' :
      r.status === 'not-found'  ? '#EF4444' :
      r.status === 'redirect'   ? '#94A3B8' :
      r.issues.length > 4      ? '#F97316' :
      r.issues.length > 0      ? '#F5C842' : '#10B981'

    const badge =
      r.status === 'redirect'   ? `↪ ${r.finalUrl.replace(BASE_URL,'').substring(0,30)}` :
      r.status === 'not-found'  ? '404' :
      r.status === 'timeout'    ? '💀 TIMEOUT' :
      `${r.httpStatus ?? 'OK'}`

    return `<tr data-status="${r.status}" data-issues="${r.issues.length}" data-broken="${r.brokenImages}">
      <td><a href="${BASE_URL}${r.url}" target="_blank">${r.url}</a></td>
      <td style="color:${color};font-weight:700;white-space:nowrap">${badge}</td>
      <td style="white-space:nowrap">${r.status === 'ok' ? r.loadMs + 'ms' : '—'}</td>
      <td style="text-align:center">${r.brokenImages || (r.status==='ok'?'✅':'—')}</td>
      <td style="text-align:center">${r.missingAlts || (r.status==='ok'?'✅':'—')}</td>
      <td style="text-align:center">${r.emptyButtons.length || (r.status==='ok'?'✅':'—')}</td>
      <td style="text-align:center">${r.hasMetaDesc ? '✅' : r.status==='ok' ? '❌' : '—'}</td>
      <td style="text-align:center">${r.h1Count===1 ? '✅' : r.status==='ok' ? `❌ ${r.h1Count}` : '—'}</td>
      <td style="font-size:12px;color:#94A3B8">${r.h1.substring(0,50) || '—'}</td>
      <td style="font-size:12px">${r.issues.join('<br>') || '—'}</td>
    </tr>`
  }).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>CloudBasket Deep Audit v2 — ${new Date().toLocaleDateString('en-IN')}</title>
<style>
*{box-sizing:border-box}
body{font-family:Inter,system-ui,sans-serif;background:#09090B;color:#f4f4f5;margin:0;padding:24px;font-size:13px}
h1{color:#039BE5;font-size:24px;margin:0 0 4px}
.sub{color:#64748B;font-size:12px;margin-bottom:24px}
.stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px;margin-bottom:24px}
.stat{background:#18181b;border:1px solid #27272a;border-radius:10px;padding:12px 16px}
.stat-n{font-size:26px;font-weight:900;line-height:1}
.stat-l{color:#64748B;font-size:10px;text-transform:uppercase;letter-spacing:.05em;margin-top:3px}
.green{color:#10B981}.red{color:#EF4444}.yellow{color:#F5C842}.orange{color:#F97316}.blue{color:#039BE5}.muted{color:#64748B}
.toolbar{display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap;align-items:center}
.btn{padding:5px 12px;border-radius:6px;border:1px solid #27272a;background:#18181b;
  color:#94A3B8;cursor:pointer;font-size:11px;font-weight:700;transition:all .15s}
.btn:hover,.btn.active{border-color:#039BE5;color:#039BE5;background:rgba(3,155,229,.08)}
input.search{flex:1;min-width:200px;padding:6px 12px;background:#18181b;border:1px solid #27272a;
  border-radius:6px;color:#f4f4f5;font-size:13px;outline:none}
input.search:focus{border-color:#039BE5}
table{width:100%;border-collapse:collapse;background:#18181b;border-radius:10px;overflow:hidden}
th{background:#0f172a;padding:9px 10px;text-align:left;font-size:10px;text-transform:uppercase;
   letter-spacing:.05em;color:#64748B;border-bottom:1px solid #27272a;white-space:nowrap}
td{padding:9px 10px;border-bottom:1px solid #111827;vertical-align:top}
tr:hover td{background:#1E293B}
a{color:#039BE5;text-decoration:none}a:hover{text-decoration:underline}
.count{color:#64748B;font-weight:400;font-size:11px}
</style>
</head>
<body>
<h1>☁️ CloudBasket — Deep Audit v2</h1>
<p class="sub">${new Date().toLocaleString('en-IN')} · ${BASE_URL} · ${results.length} pages · ${CONCURRENCY} workers</p>

<div class="stats">
  <div class="stat"><div class="stat-n">${results.length}</div><div class="stat-l">Crawled</div></div>
  <div class="stat"><div class="stat-n green">${ok.length}</div><div class="stat-l">✅ Clean</div></div>
  <div class="stat"><div class="stat-n red">${withIssues.length}</div><div class="stat-l">❌ Issues</div></div>
  <div class="stat"><div class="stat-n muted">${redirects.length}</div><div class="stat-l">↪ Redirected</div></div>
  <div class="stat"><div class="stat-n red">${notFound.length}</div><div class="stat-l">🚫 Real 404s</div></div>
  <div class="stat"><div class="stat-n red">${timeouts.length}</div><div class="stat-l">💀 Timeouts</div></div>
  <div class="stat"><div class="stat-n red">${totBroken}</div><div class="stat-l">🖼 Broken Imgs</div></div>
  <div class="stat"><div class="stat-n orange">${totAlts}</div><div class="stat-l">🏷 Missing Alt</div></div>
  <div class="stat"><div class="stat-n orange">${totBtns}</div><div class="stat-l">🔘 No-Label Btns</div></div>
  <div class="stat"><div class="stat-n yellow">${noMeta}</div><div class="stat-l">📄 No Meta</div></div>
  <div class="stat"><div class="stat-n yellow">${noH1}</div><div class="stat-l">H1 Missing</div></div>
  <div class="stat"><div class="stat-n blue">${avgLoad}ms</div><div class="stat-l">⚡ Avg Load</div></div>
</div>

<div class="toolbar">
  <button class="btn active" onclick="filter('all')">All <span class="count">(${results.length})</span></button>
  <button class="btn" onclick="filter('issues')">Issues <span class="count">(${withIssues.length})</span></button>
  <button class="btn" onclick="filter('not-found')">Real 404s <span class="count">(${notFound.length})</span></button>
  <button class="btn" onclick="filter('broken')">Broken Imgs <span class="count">(${totBroken})</span></button>
  <button class="btn" onclick="filter('no-meta')">No Meta <span class="count">(${noMeta})</span></button>
  <button class="btn" onclick="filter('redirect')">Redirects <span class="count">(${redirects.length})</span></button>
  <button class="btn" onclick="filter('clean')">Clean <span class="count">(${ok.length})</span></button>
  <input class="search" type="text" placeholder="Search routes..." oninput="search(this.value)">
</div>

<table>
  <thead><tr>
    <th>Route</th><th>Status</th><th>Load</th>
    <th>🖼</th><th>🏷</th><th>🔘</th>
    <th>Meta</th><th>H1</th><th>H1 Text</th><th>Issues</th>
  </tr></thead>
  <tbody id="tb">${rows}</tbody>
</table>

<script>
const rows = Array.from(document.querySelectorAll('#tb tr'))
let activeFilter = 'all'
let searchQ = ''

function applyFilters() {
  rows.forEach(r => {
    const status  = r.dataset.status
    const issues  = parseInt(r.dataset.issues)
    const broken  = parseInt(r.dataset.broken)
    const text    = r.textContent.toLowerCase()
    const matchSearch = !searchQ || text.includes(searchQ)
    const matchFilter =
      activeFilter === 'all'       ? true :
      activeFilter === 'issues'    ? (issues > 0 && status !== 'redirect') :
      activeFilter === 'not-found' ? status === 'not-found' :
      activeFilter === 'broken'    ? broken > 0 :
      activeFilter === 'no-meta'   ? r.children[6].textContent.trim() === '❌' :
      activeFilter === 'redirect'  ? status === 'redirect' :
      activeFilter === 'clean'     ? (issues === 0 && status === 'ok') : true
    r.style.display = (matchSearch && matchFilter) ? '' : 'none'
  })
}

function filter(f) {
  activeFilter = f
  document.querySelectorAll('.btn').forEach(b => b.classList.remove('active'))
  event.target.classList.add('active')
  applyFilters()
}

function search(q) {
  searchQ = q.toLowerCase()
  applyFilters()
}
</script>
</body>
</html>`
}

// ─── Main ─────────────────────────────────────────────────────────────────
async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

  console.log('\n╔══════════════════════════════════════════════╗')
  console.log('║  CloudBasket Deep Crawl v2 — FIXED          ║')
  console.log('╚══════════════════════════════════════════════╝\n')

  const browser: Browser = await chromium.launch({ headless: true })

  const dynamicRoutes = await discoverRoutes(browser)
  const allRoutes = [...STATIC_ROUTES, ...dynamicRoutes]

  console.log(`\n📋 Routes: ${allRoutes.length} (${STATIC_ROUTES.length} static + ${dynamicRoutes.length} dynamic)`)
  console.log(`   Workers: ${CONCURRENCY} | Hydration wait: ${HYDRATE_MS}ms\n`)

  const results = await runCrawl(browser, allRoutes)
  await browser.close()

  const html = buildReport(results)
  const htmlPath = path.join(OUT_DIR, 'deep-audit-v2.html')
  const jsonPath = path.join(OUT_DIR, 'deep-audit-v2.json')
  fs.writeFileSync(htmlPath, html)
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2))

  const ok        = results.filter(r => r.status === 'ok' && r.issues.length === 0)
  const withIssues= results.filter(r => r.issues.length > 0 && r.status !== 'redirect')
  const notFound  = results.filter(r => r.status === 'not-found')

  console.log('\n══════════════════════════════════════════════')
  console.log('  DONE')
  console.log('══════════════════════════════════════════════')
  console.log(`  Pages:          ${results.length}`)
  console.log(`  ✅ Clean:       ${ok.length}`)
  console.log(`  ❌ Issues:      ${withIssues.length}`)
  console.log(`  🚫 Real 404s:   ${notFound.length}`)
  console.log(`  💀 Timeouts:    ${results.filter(r=>r.status==='timeout').length}`)
  console.log(`  🖼 Broken imgs: ${results.reduce((a,r)=>a+r.brokenImages,0)}`)
  console.log(`  🔘 No-label btns:${results.reduce((a,r)=>a+r.emptyButtons.length,0)}`)
  console.log(`\n  📄 ${htmlPath}`)
  console.log(`  📋 ${jsonPath}\n`)

  if (notFound.length > 0) {
    console.log('  🚫 REAL 404 ROUTES (need fixing):')
    notFound.forEach(r => console.log(`     ${r.url}`))
    console.log('')
  }

  console.log('  TOP 10 WORST PAGES:')
  ;[...withIssues]
    .sort((a,b) => b.issues.length - a.issues.length)
    .slice(0, 10)
    .forEach((r,i) => console.log(`  ${i+1}. ${r.url.padEnd(45)} ${r.issues.length} issues`))
  console.log('')
}

main().catch(console.error)
