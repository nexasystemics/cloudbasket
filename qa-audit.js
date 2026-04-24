/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║   CloudBasket — Human-Like QA Auditor                   ║
 * ║   Powered by Playwright                                  ║
 * ║   Usage: node qa-audit.js [baseUrl]                      ║
 * ║   Default: http://localhost:3000                         ║
 * ╚══════════════════════════════════════════════════════════╝
 */

const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

// ─── CONFIG ───────────────────────────────────────────────
const BASE_URL = process.argv[2] || 'http://localhost:3000';
const SCREENSHOT_DIR = './audit-screenshots';
const REPORT_FILE = './audit-report.html';

// All pages to audit — edit this list for your site
const PAGES = [
  '/',
  '/products',
  '/deals',
  '/deals/flash',
  '/compare',
  '/search',
  '/quiz',
  '/categories',
  '/category/electronics',
  '/category/fashion',
  '/category/home',
  '/category/health',
  '/category/books',
  '/category/sports',
  '/category/beauty',
  '/category/food',
  '/category/toys',
  '/category/automotive',
  '/product/cb-00001',
  '/blog',
  '/pod',
  '/pod/tshirts',
  '/pod/mugs',
  '/pod/phone-cases',
  '/login',
  '/register',
  '/about',
  '/contact',
  '/faq',
  '/affiliate-disclosure',
  '/legal/privacy',
  '/legal/terms',
  '/cookies',
  '/cj',
];

// ─── BANNED TEXT — things that should NEVER appear on site ─
const BANNED_TEXT = [
  'lorem ipsum',
  'placeholder',
  'TODO',
  'FIXME',
  'test@test.com',
  'hello@cloudbasket.co',
  '+91 98765',
  '+91 99999',
  'AdSense',
  'Google AdSense',
  '728×90',
  '160×600',
  '300×250',
  'Advertisement ·',
  'NEXQON Engineering',
  'Built with sovereignty',
  'Powered by NEXQON Sovereign',
  "India's Sovereign",
  'Made for Bharat',
  'Serving India & Globe',
  'India deals only',
  '500M+ UPI',
  'No Hidden Fees',
  '₹0 Fees',
  'Zero hidden fees',
  'Direct shipping to India',
  'Associates Program',
  'Fitness Pro',
  'Skincare Pro',
  '$500',
  'undefined',
  'NaN',
  'null',
];

// ─── REQUIRED ELEMENTS — must exist on every page ──────────
const REQUIRED_SELECTORS = [
  { selector: 'header, nav', label: 'Header/Nav present' },
  { selector: 'footer', label: 'Footer present' },
  { selector: 'title', label: 'Page title exists' },
];

// ─── LINK PATTERNS that should be real hrefs ───────────────
const DEAD_LINK_PATTERNS = ['href="#"', 'href=""', 'href="javascript:void"'];

// ─── CURRENCY CHECK — should be ₹ not $ ────────────────────
const WRONG_CURRENCY = /\$\d+/;

// ─── MAIN AUDIT ────────────────────────────────────────────
async function auditPage(page, url, results) {
  const fullUrl = `${BASE_URL}${url}`;
  const result = {
    url,
    status: 'PASS',
    issues: [],
    screenshot: null,
    loadTime: 0,
    title: '',
  };

  try {
    const start = Date.now();
    const response = await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
    result.loadTime = Date.now() - start;

    // ── 1. HTTP Status ──────────────────────────────────────
    if (!response || response.status() >= 400) {
      result.issues.push({
        severity: 'CRITICAL',
        type: 'HTTP Error',
        detail: `Status ${response?.status() ?? 'no response'}`,
      });
    }

    // ── 2. Page Title ───────────────────────────────────────
    result.title = await page.title();
    if (!result.title || result.title.trim() === '') {
      result.issues.push({ severity: 'HIGH', type: 'Missing Title', detail: 'Page has no <title>' });
    }

    // ── 3. Get full page text ───────────────────────────────
    const bodyText = await page.evaluate(() => document.body.innerText.toLowerCase());
    const bodyHTML = await page.evaluate(() => document.body.innerHTML);

    // ── 4. Banned text check ────────────────────────────────
    for (const banned of BANNED_TEXT) {
      if (bodyText.includes(banned.toLowerCase())) {
        result.issues.push({
          severity: 'HIGH',
          type: 'Banned Text Found',
          detail: `"${banned}" found on page`,
        });
      }
    }

    // ── 5. Wrong currency ───────────────────────────────────
    const visibleText = await page.evaluate(() => document.body.innerText);
    if (WRONG_CURRENCY.test(visibleText)) {
      const matches = visibleText.match(/\$\d+[,\d]*/g);
      result.issues.push({
        severity: 'HIGH',
        type: 'Wrong Currency',
        detail: `Found $ pricing: ${matches?.slice(0, 3).join(', ')}`,
      });
    }

    // ── 6. Required elements ────────────────────────────────
    for (const req of REQUIRED_SELECTORS) {
      const exists = await page.$(req.selector);
      if (!exists) {
        result.issues.push({ severity: 'HIGH', type: 'Missing Element', detail: req.label });
      }
    }

    // ── 7. Broken images ────────────────────────────────────
    const brokenImages = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs
        .filter(img => !img.complete || img.naturalWidth === 0)
        .map(img => img.src)
        .slice(0, 5);
    });
    if (brokenImages.length > 0) {
      result.issues.push({
        severity: 'MEDIUM',
        type: 'Broken Images',
        detail: `${brokenImages.length} broken: ${brokenImages.join(', ')}`,
      });
    }

    // ── 8. Console errors ───────────────────────────────────
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    // ── 9. Dead links check ─────────────────────────────────
    const deadLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      return links
        .filter(a => !a.href || a.href === window.location.href + '#' || a.getAttribute('href') === '#')
        .map(a => a.textContent?.trim().slice(0, 40))
        .filter(Boolean)
        .slice(0, 5);
    });
    if (deadLinks.length > 3) {
      result.issues.push({
        severity: 'MEDIUM',
        type: 'Dead Links',
        detail: `${deadLinks.length} links with href="#": ${deadLinks.join(' | ')}`,
      });
    }

    // ── 10. Buttons with no action ──────────────────────────
    const deadButtons = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns
        .filter(b => !b.onclick && !b.getAttribute('type') && !b.closest('form'))
        .map(b => b.textContent?.trim().slice(0, 30))
        .filter(Boolean)
        .slice(0, 5);
    });

    // ── 11. Dark mode check ─────────────────────────────────
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.waitForTimeout(300);
    const darkBg = await page.evaluate(() => {
      const body = document.body;
      return window.getComputedStyle(body).backgroundColor;
    });
    if (darkBg === 'rgb(255, 255, 255)' || darkBg === 'rgba(0, 0, 0, 0)') {
      result.issues.push({
        severity: 'MEDIUM',
        type: 'Dark Mode Not Applying',
        detail: `Body background still white/transparent in dark mode`,
      });
    }
    await page.evaluate(() => document.documentElement.classList.remove('dark'));

    // ── 12. Slow load warning ───────────────────────────────
    if (result.loadTime > 3000) {
      result.issues.push({
        severity: 'LOW',
        type: 'Slow Load',
        detail: `Page took ${result.loadTime}ms to load`,
      });
    }

    // ── 13. Screenshot ──────────────────────────────────────
    const screenshotName = url.replace(/\//g, '_').replace(/^_/, '') || 'home';
    const screenshotPath = path.join(SCREENSHOT_DIR, `${screenshotName}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    result.screenshot = `${screenshotName}.png`;

    // ── Set overall status ──────────────────────────────────
    if (result.issues.some(i => i.severity === 'CRITICAL')) result.status = 'CRITICAL';
    else if (result.issues.some(i => i.severity === 'HIGH')) result.status = 'FAIL';
    else if (result.issues.some(i => i.severity === 'MEDIUM')) result.status = 'WARN';

  } catch (err) {
    result.status = 'CRITICAL';
    result.issues.push({ severity: 'CRITICAL', type: 'Page Crashed', detail: err.message });
  }

  results.push(result);

  const icon = result.status === 'PASS' ? '✅' : result.status === 'WARN' ? '⚠️' : '❌';
  console.log(`${icon} ${url} — ${result.issues.length} issues (${result.loadTime}ms)`);
}

// ─── GENERATE HTML REPORT ──────────────────────────────────
function generateReport(results) {
  const total = results.length;
  const passed = results.filter(r => r.status === 'PASS').length;
  const warned = results.filter(r => r.status === 'WARN').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const critical = results.filter(r => r.status === 'CRITICAL').length;
  const allIssues = results.flatMap(r => r.issues).length;

  const statusColor = { PASS: '#22c55e', WARN: '#f59e0b', FAIL: '#ef4444', CRITICAL: '#7f1d1d' };
  const severityColor = { CRITICAL: '#7f1d1d', HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#6b7280' };

  const rows = results.map(r => `
    <tr>
      <td><a href="${BASE_URL}${r.url}" target="_blank">${r.url}</a></td>
      <td style="color:${statusColor[r.status]};font-weight:bold">${r.status}</td>
      <td>${r.title || '—'}</td>
      <td>${r.loadTime}ms</td>
      <td>${r.issues.length === 0 ? '—' : r.issues.map(i =>
        `<span style="color:${severityColor[i.severity]}">[${i.severity}] ${i.type}: ${i.detail}</span>`
      ).join('<br>')}</td>
      <td>${r.screenshot ? `<img src="audit-screenshots/${r.screenshot}" style="width:120px;border:1px solid #333;border-radius:4px">` : '—'}</td>
    </tr>
  `).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>QA Audit Report — ${new Date().toLocaleDateString()}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, sans-serif; background: #0f172a; color: #e2e8f0; padding: 2rem; }
  h1 { font-size: 1.8rem; margin-bottom: 0.5rem; color: #38bdf8; }
  .meta { color: #94a3b8; margin-bottom: 2rem; font-size: 0.9rem; }
  .summary { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
  .card { background: #1e293b; border-radius: 8px; padding: 1rem 1.5rem; min-width: 120px; }
  .card .num { font-size: 2rem; font-weight: bold; }
  .card .label { font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; }
  table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
  th { background: #1e293b; padding: 0.75rem 1rem; text-align: left; color: #38bdf8; border-bottom: 1px solid #334155; }
  td { padding: 0.75rem 1rem; border-bottom: 1px solid #1e293b; vertical-align: top; }
  tr:hover td { background: #1e293b44; }
  a { color: #38bdf8; }
</style>
</head>
<body>
<h1>🔍 QA Audit Report</h1>
<p class="meta">Target: ${BASE_URL} · Audited: ${total} pages · Generated: ${new Date().toLocaleString()}</p>
<div class="summary">
  <div class="card"><div class="num" style="color:#22c55e">${passed}</div><div class="label">Pass</div></div>
  <div class="card"><div class="num" style="color:#f59e0b">${warned}</div><div class="label">Warn</div></div>
  <div class="card"><div class="num" style="color:#ef4444">${failed}</div><div class="label">Fail</div></div>
  <div class="card"><div class="num" style="color:#7f1d1d">${critical}</div><div class="label">Critical</div></div>
  <div class="card"><div class="num" style="color:#94a3b8">${allIssues}</div><div class="label">Total Issues</div></div>
</div>
<table>
  <thead>
    <tr><th>Page</th><th>Status</th><th>Title</th><th>Load</th><th>Issues</th><th>Screenshot</th></tr>
  </thead>
  <tbody>${rows}</tbody>
</table>
</body>
</html>`;

  fs.writeFileSync(REPORT_FILE, html);
  console.log(`\n📊 Report saved: ${REPORT_FILE}`);
  console.log(`📁 Screenshots: ${SCREENSHOT_DIR}/`);
  console.log(`\n✅ PASS: ${passed} | ⚠️ WARN: ${warned} | ❌ FAIL: ${failed} | 🔴 CRITICAL: ${critical}`);
  console.log(`Total issues found: ${allIssues}`);
}

// ─── ENTRY POINT ───────────────────────────────────────────
(async () => {
  console.log(`\n🔍 CloudBasket QA Auditor`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`Pages: ${PAGES.length}\n`);

  if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'QA-Auditor/1.0',
  });
  const page = await context.newPage();

  const results = [];

  for (const url of PAGES) {
    await auditPage(page, url, results);
    await page.waitForTimeout(300); // be gentle
  }

  await browser.close();
  generateReport(results);
})();



