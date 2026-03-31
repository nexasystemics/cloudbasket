// © 2026 NEXQON HOLDINGS — CloudBasket scripts/generate-legal-pdf.ts
// Generates public/legal/terms-of-service.pdf from rendered HTML
// Run: pnpm generate:legal-pdf   (requires: puppeteer, tsx)
//
// Output: public/legal/terms-of-service.pdf
// Page:   ISO A4 Portrait, running header/footer, title page, TOC
import puppeteer from 'puppeteer'
import path from 'path'
import fs from 'fs/promises'

// ── Brand tokens ──────────────────────────────────────────────────────────────
const BLUE = '#039BE5'
const DARK = '#1a1a1a'
const GRAY = '#555555'
const LIGHT = '#D0D7DE'

// ── ToS Section data ──────────────────────────────────────────────────────────
interface TosSection {
  number: number
  title: string
  content: string
}

const SECTIONS: TosSection[] = [
  {
    number: 1,
    title: 'ACCEPTANCE OF TERMS',
    content: `<p>By accessing or using CloudBasket (www.cloudbasket.co), you agree to be bound by these Terms of Service. If you do not agree to these Terms, you must not use the Website.</p>
<p>CloudBasket is operated by <strong>NEXQON HOLDINGS</strong>, a sole proprietorship registered under the laws of India, located at Kadapa, Andhra Pradesh – 516002, India.</p>
<p>These Terms are a legally binding agreement between you ("User") and NEXQON HOLDINGS and are governed by Indian law.</p>`,
  },
  {
    number: 2,
    title: 'NATURE OF SERVICE',
    content: `<p>CloudBasket is an <strong>affiliate product discovery and comparison platform</strong>. We do not sell products directly, accept payments, operate a checkout system, hold inventory, act as a retailer, or represent any merchant.</p>
<p>When you click a product link, you are redirected to a third-party merchant website where the actual purchase occurs. All purchases, payments, shipping, returns, and customer service are governed by the respective merchant's terms.</p>
<p>CloudBasket functions as an <strong>intermediary</strong> under the IT Act, 2000, complying with IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.</p>`,
  },
  {
    number: 3,
    title: 'ELIGIBILITY',
    content: `<p>You must be at least <strong>18 years of age</strong> to use this Website independently. Users under 18 may only use the Website under direct supervision of a parent or legal guardian who accepts these Terms.</p>
<p>We do not knowingly collect data from children under 13.</p>`,
  },
  {
    number: 4,
    title: 'AFFILIATE RELATIONSHIPS AND DISCLOSURE',
    content: `<p>CloudBasket participates in affiliate marketing programs. We earn a commission when you click affiliate links and make a qualifying purchase. Commissions are paid by merchants — you pay the same price either way.</p>
<p>Affiliate links are marked with <strong>#ad</strong> or "Affiliate Link" labeling per FTC Guidelines (16 CFR Part 255) and ASCI Guidelines.</p>
<p><strong>Participating programs:</strong> Amazon Associates India, Flipkart Affiliate, CJ Affiliate, Google AdSense, and others as disclosed.</p>
<p><strong>Amazon Associates (effective Oct 15, 2025):</strong> Commissions qualify only when purchase is completed within 180 days of your click, on the exact product variant linked.</p>
<p>Full Affiliate Disclosure: www.cloudbasket.co/legal/affiliate-disclosure</p>`,
  },
  {
    number: 5,
    title: 'INTERMEDIARY COMPLIANCE — IT ACT 2000 / IT RULES 2021 & 2026',
    content: `<p><strong>5.1 IT (Intermediary Guidelines) Rules 2021:</strong> We publish all required user policies, do not host user-generated content, and maintain a grievance redressal mechanism.</p>
<p><strong>5.2 IT Amendment Rules 2026 (effective Feb 20, 2026):</strong> AI-assisted content on this site is reviewed by a human editor before publication, is not presented as independently verified fact without human validation, and may be labeled "AI-assisted." CloudBasket does not publish synthetic media (deepfakes).</p>
<p><strong>5.3 Consumer Protection (E-Commerce) Rules 2020:</strong> We disclose affiliate relationships prominently, do not favor any associated enterprise over others, and do not manipulate search results deceptively.</p>`,
  },
  {
    number: 6,
    title: 'DATA PROTECTION AND PRIVACY — DPDP ACT 2023 COMPLIANCE',
    content: `<p><strong>6.1 Data Fiduciary Status:</strong> NEXQON HOLDINGS is a Data Fiduciary under the Digital Personal Data Protection Act, 2023 and DPDP Rules notified November 14, 2025.</p>
<p><strong>6.2 Your Consent:</strong> Before non-essential data processing, we obtain explicit, informed, specific consent via our cookie consent mechanism. Consent may be withdrawn at any time.</p>
<p><strong>6.3 Your Rights:</strong> Access · Correction · Erasure · Grievance Redressal. We respond to data rights requests within 90 days.</p>
<p><strong>6.4 Data Breach Notification:</strong> In the event of a breach, we notify affected users and the Data Protection Board of India within DPDP Rules 2025 (Rule 7) timelines.</p>
<p>Full Privacy Policy: www.cloudbasket.co/legal/privacy</p>`,
  },
  {
    number: 7,
    title: 'INTELLECTUAL PROPERTY',
    content: `<p><strong>7.1 Our Content:</strong> All original content is the property of NEXQON HOLDINGS, protected under the Indian Copyright Act, 1957.</p>
<p><strong>7.2 Trademarks:</strong> "CloudBasket" and "NEXQON HOLDINGS" are trademarks of NEXQON HOLDINGS. Unauthorized use is prohibited.</p>
<p><strong>7.3 Third-Party Trademarks:</strong> "Amazon", "Flipkart" and other brand names are property of their respective owners. CloudBasket is not an official partner of Amazon or Flipkart.</p>
<p><strong>7.4 No Amazon Trademark Misuse:</strong> Per Amazon Associates Operating Agreement (Oct 2025), we do not use "Amazon" in our domain, subdomain, or paid advertising.</p>
<p><strong>7.5 Product Images:</strong> Product images are sourced from licensed stock image providers, for illustrative purposes only.</p>`,
  },
  {
    number: 8,
    title: 'ACCURACY OF INFORMATION',
    content: `<p><strong>8.1 Pricing:</strong> Prices are indicative only, sourced from affiliate feeds, subject to change without notice. Always confirm on the merchant's website. CloudBasket is not liable for price discrepancies.</p>
<p><strong>8.2 Commission Eligibility:</strong> Per Amazon's 180-day rule (Oct 2025), commissions depend on purchase completion within 180 days of your click.</p>
<p><strong>8.3 Product Availability:</strong> Availability may not reflect real-time stock. Always verify on the merchant's website.</p>
<p><strong>8.4 Product Descriptions:</strong> For general reference only. CloudBasket does not verify manufacturer claims.</p>`,
  },
  {
    number: 9,
    title: 'USER CONDUCT',
    content: `<p>You agree not to: use the Website for unlawful purposes; attempt unauthorized access; use bots or scrapers without written permission; reproduce or exploit any portion without consent; upload malicious code; interfere with infrastructure; manipulate affiliate tracking; or click affiliate links with fraudulent purchase intent (self-referral fraud).</p>`,
  },
  {
    number: 10,
    title: 'THIRD-PARTY LINKS AND WEBSITES',
    content: `<p>Once you leave CloudBasket via an affiliate link, you are subject to that merchant's Terms of Service and Privacy Policy. CloudBasket has no control over and accepts no responsibility for third-party website content, availability, or practices. Visiting any external website is entirely at your own risk.</p>`,
  },
  {
    number: 11,
    title: 'DISCLAIMERS',
    content: `<p class="caps"><strong>11.1 No Warranty:</strong> THE WEBSITE AND ITS CONTENT ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.</p>
<p><strong>11.2 No Guarantee:</strong> We do not warrant that the Website will be uninterrupted or error-free, that affiliate links will always function, or that commission income will be generated.</p>
<p><strong>11.3 No Professional Advice:</strong> Nothing on CloudBasket constitutes financial, legal, medical, or professional advice.</p>`,
  },
  {
    number: 12,
    title: 'LIMITATION OF LIABILITY',
    content: `<p class="caps">TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, NEXQON HOLDINGS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE WEBSITE, INCLUDING LOSS OF PROFITS OR REVENUE, LOSS OF DATA, RELIANCE ON INFORMATION PROVIDED, OR PURCHASES OR DISPUTES WITH THIRD-PARTY MERCHANTS.</p>
<p><strong>Liability Cap:</strong> Our total liability shall not exceed the actual direct loss proven by you, subject to a maximum of <strong>INR 5,000 (Five Thousand Rupees)</strong>, except in cases of gross negligence, wilful misconduct, or fraud by NEXQON HOLDINGS. This cap applies because CloudBasket processes zero financial transactions and collects no payment data.</p>`,
  },
  {
    number: 13,
    title: 'GRIEVANCE REDRESSAL',
    content: `<p>In compliance with IT (Intermediary Guidelines) Rules, 2021, Rule 3(2), and DPDP Rules 2025, Rule 14:</p>
<p><strong>Grievance Officer:</strong> NEXQON HOLDINGS | Kadapa, Andhra Pradesh – 516002, India<br>
<strong>Email:</strong> info@cloudbasket.co<br>
<strong>Response Time:</strong> Acknowledgement within 24 hours | Resolution within 30 days</p>
<p>Unresolved complaints may be escalated to the Data Protection Board of India or appropriate consumer forum.</p>`,
  },
  {
    number: 14,
    title: 'INDEMNIFICATION',
    content: `<p>You agree to indemnify and hold harmless NEXQON HOLDINGS, its owners, agents, and representatives from any claims, damages, losses, liabilities, and expenses (including reasonable legal fees) arising from: (a) your use of the Website; (b) your violation of these Terms; or (c) your violation of any third party's rights.</p>`,
  },
  {
    number: 15,
    title: 'GOVERNING LAW AND JURISDICTION',
    content: `<p>These Terms are governed by Indian law, including: Information Technology Act 2000, Consumer Protection Act 2019, Digital Personal Data Protection Act 2023, and Indian Contract Act 1872.</p>
<p><strong>Commercial disputes:</strong> Exclusive jurisdiction of courts in Kadapa, Andhra Pradesh, India.</p>
<p><strong>Consumer disputes:</strong> Nothing limits your right to approach the appropriate Consumer Disputes Redressal Commission under the Consumer Protection Act 2019. Venue for consumer disputes is determined per that Act.</p>`,
  },
  {
    number: 16,
    title: 'CHANGES TO TERMS',
    content: `<p>We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated "Last Updated" date. Material changes will be notified via a banner on the Website. Continued use after posting constitutes acceptance.</p>`,
  },
  {
    number: 17,
    title: 'TERMINATION',
    content: `<p>We reserve the right to block or restrict access to the Website at any time, without notice, for conduct that violates these Terms or applicable law, or for any reason at our sole discretion.</p>`,
  },
  {
    number: 18,
    title: 'SEVERABILITY',
    content: `<p>If any provision of these Terms is found unenforceable by a court of competent jurisdiction, that provision shall be modified to the minimum extent necessary to make it enforceable, and the remaining provisions shall continue in full force and effect.</p>`,
  },
  {
    number: 19,
    title: 'ENTIRE AGREEMENT',
    content: `<p>These Terms, together with our Privacy Policy, Cookie Policy, and Affiliate Disclosure, constitute the entire agreement between you and NEXQON HOLDINGS regarding your use of the Website.</p>`,
  },
  {
    number: 20,
    title: 'CONTACT',
    content: `<p><strong>NEXQON HOLDINGS</strong><br>
Kadapa, Andhra Pradesh – 516002, India<br>
<strong>Email:</strong> info@cloudbasket.co<br>
<strong>Website:</strong> www.cloudbasket.co<br>
<strong>Grievance Response:</strong> Acknowledgement within 24 hours | Resolution within 30 days</p>`,
  },
]

// ── HTML builder ──────────────────────────────────────────────────────────────

function buildTocRows(): string {
  return SECTIONS.map(
    (s) =>
      `<tr>
        <td class="toc-num">${s.number}.</td>
        <td class="toc-title">${s.title}</td>
        <td class="toc-dots"></td>
        <td class="toc-page">—</td>
      </tr>`,
  ).join('\n')
}

function buildBodySections(): string {
  return SECTIONS.map(
    (s) =>
      `<div class="section">
        <h2>${s.number}. ${s.title}</h2>
        ${s.content}
      </div>`,
  ).join('\n')
}

function buildHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<style>
  @page {
    size: A4 portrait;
    margin: 25mm 20mm 25mm 25mm;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: Helvetica, Arial, sans-serif;
    font-size: 10pt;
    line-height: 1.5;
    color: ${DARK};
  }
  /* ── Title page ── */
  .title-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 220mm;
    text-align: center;
    page-break-after: always;
  }
  .title-wordmark {
    font-size: 36pt;
    font-weight: 900;
    color: ${BLUE};
    letter-spacing: -1px;
    margin-bottom: 16mm;
  }
  .title-rule {
    width: 80%;
    height: 1pt;
    background: ${BLUE};
    margin: 0 auto 12mm;
  }
  .title-heading {
    font-size: 22pt;
    font-weight: 700;
    color: ${DARK};
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 6mm;
  }
  .title-sub {
    font-size: 11pt;
    color: ${GRAY};
    margin-bottom: 14mm;
  }
  .title-entity {
    font-size: 9pt;
    color: ${GRAY};
    line-height: 1.7;
  }
  .title-entity strong { color: ${DARK}; }
  .title-footer {
    margin-top: 14mm;
    font-size: 8pt;
    color: #888;
  }
  /* ── TOC page ── */
  .toc-page {
    page-break-after: always;
    padding-top: 4mm;
  }
  .toc-page h1 {
    font-size: 14pt;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: ${DARK};
    margin-bottom: 8mm;
    border-bottom: 0.5pt solid ${BLUE};
    padding-bottom: 3mm;
  }
  .toc-table {
    width: 100%;
    border-collapse: collapse;
  }
  .toc-table tr { margin-bottom: 2mm; }
  .toc-num {
    width: 8mm;
    font-size: 9pt;
    color: ${GRAY};
    vertical-align: top;
    padding: 1.5mm 0;
  }
  .toc-title {
    font-size: 9pt;
    color: ${DARK};
    vertical-align: top;
    padding: 1.5mm 4mm;
  }
  .toc-dots {
    border-bottom: 1pt dotted #bbb;
    width: 100%;
    vertical-align: bottom;
    padding-bottom: 2mm;
  }
  .toc-page-num {
    font-size: 9pt;
    color: ${GRAY};
    width: 10mm;
    text-align: right;
    vertical-align: top;
    padding: 1.5mm 0;
  }
  /* ── Body ── */
  .section {
    margin-bottom: 10mm;
  }
  h2 {
    font-size: 13pt;
    font-weight: 700;
    color: ${DARK};
    margin-top: 14pt;
    margin-bottom: 6pt;
    border-bottom: 0.5pt solid #eee;
    padding-bottom: 3pt;
  }
  h3 {
    font-size: 11pt;
    font-weight: 700;
    color: ${DARK};
    margin-top: 8pt;
    margin-bottom: 4pt;
  }
  p {
    font-size: 10pt;
    margin-bottom: 6pt;
  }
  ul {
    margin: 4pt 0 6pt 14pt;
    padding: 0;
  }
  li {
    font-size: 10pt;
    margin-bottom: 3pt;
  }
  .caps {
    font-size: 9pt;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
  strong { font-weight: 700; }
  em { font-style: italic; }
</style>
</head>
<body>

<!-- Title page -->
<div class="title-page">
  <div class="title-wordmark">CloudBasket</div>
  <div class="title-rule"></div>
  <div class="title-heading">Terms of Service</div>
  <div class="title-sub">Version 2.0 | Effective 01 April 2026</div>
  <div class="title-entity">
    <strong>NEXQON HOLDINGS</strong><br>
    Kadapa, Andhra Pradesh – 516002 | India<br>
    www.cloudbasket.co<br><br>
    This document was last reviewed on 31 March 2026
  </div>
  <div class="title-footer">© 2026 NEXQON HOLDINGS. All Rights Reserved.</div>
</div>

<!-- TOC page -->
<div class="toc-page">
  <h1>Table of Contents</h1>
  <table class="toc-table">
    <tbody>
      ${buildTocRows()}
    </tbody>
  </table>
</div>

<!-- Body -->
${buildBodySections()}

</body>
</html>`
}

// ── Header / Footer templates ─────────────────────────────────────────────────

const headerTemplate = `
<div style="
  width: 100%;
  padding: 4mm 20mm 2mm 25mm;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 7pt;
  color: ${GRAY};
  border-bottom: 0.5pt solid ${BLUE};
">
  <span style="color: ${BLUE}; font-weight: 700; font-size: 8pt;">CloudBasket</span>
  <span style="letter-spacing: 1px; text-transform: uppercase;">TERMS OF SERVICE</span>
  <span>www.cloudbasket.co</span>
</div>`

const footerTemplate = `
<div style="
  width: 100%;
  padding: 2mm 20mm 0 25mm;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 7pt;
  color: ${GRAY};
  border-top: 0.5pt solid ${LIGHT};
">
  <span>© 2026 NEXQON HOLDINGS | Confidential</span>
  <span>www.cloudbasket.co/legal/terms</span>
  <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
</div>`

// ── Main ──────────────────────────────────────────────────────────────────────

async function generateLegalPdf(): Promise<void> {
  const outDir = path.resolve('public', 'legal')
  const outPath = path.join(outDir, 'terms-of-service.pdf')

  await fs.mkdir(outDir, { recursive: true })

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()

    await page.setContent(buildHtml(), { waitUntil: 'networkidle0' })

    await page.pdf({
      path: outPath,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate,
      footerTemplate,
      margin: { top: '18mm', bottom: '16mm', left: '0', right: '0' },
    })
  } finally {
    await browser.close()
  }

  process.stdout.write(`PDF generated: ${outPath}\n`)
}

generateLegalPdf().catch((err: unknown) => {
  process.stderr.write(`PDF generation failed: ${String(err)}\n`)
  process.exit(1)
})
