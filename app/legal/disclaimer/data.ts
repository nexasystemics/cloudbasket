// © 2026 NEXQON HOLDINGS — CloudBasket app/legal/disclaimer/data.ts

export const DISCLAIMER_VERSION = 'v1.0'
export const DISCLAIMER_EFFECTIVE_DATE = '01 April 2026'
export const DISCLAIMER_LAST_UPDATED = '01 April 2026'
export const DISCLAIMER_DOCUMENT_ID = 'CB-LEGAL-DISCLAIMER-2026-001'
export const LEGAL_EMAIL = 'info@cloudbasket.co'

export interface DisclaimerSection {
  id: string
  title: string
  paragraphs: string[]
  bullets?: string[]
  callout?:
    | {
        tone: 'warning' | 'success' | 'neutral'
        title: string
        body: string
      }
    | undefined
  legalBasis?: string
}

export const DISCLAIMER_SECTIONS: DisclaimerSection[] = [
  {
    id: 'nature-of-service',
    title: 'Nature of Service',
    paragraphs: [
      'CloudBasket is an affiliate-led product discovery and comparison platform operated by NEXQON HOLDINGS. We do not sell products directly, collect purchase payments, dispatch orders, or operate as the merchant of record for the items shown on the platform.',
      'When you click a product link on CloudBasket, you are redirected to a third-party merchant website where any purchase transaction takes place under that merchant’s own terms, privacy policy, refund rules, and customer service process.',
    ],
    callout: {
      tone: 'success',
      title: 'Intermediary positioning',
      body: 'CloudBasket functions as an information intermediary and referral platform, not as the seller, manufacturer, distributor, or payment processor for listed products.',
    },
  },
  {
    id: 'pricing-accuracy',
    title: 'Price Accuracy Disclaimer',
    paragraphs: [
      'Prices shown on CloudBasket are sourced from third-party feeds, APIs, affiliate networks, or merchant references and may not reflect the live selling price displayed by the merchant at the time you visit their website.',
      'Promotional pricing, coupons, shipping fees, taxes, cashback, seller-specific adjustments, and region-based pricing can all change independently of CloudBasket.',
    ],
    bullets: [
      'Displayed prices may be delayed, rounded, cached, or updated on different refresh cycles',
      'The final payable amount is determined only on the merchant website at checkout',
      'CloudBasket does not guarantee that a product is listed at the lowest market price',
    ],
  },
  {
    id: 'product-availability',
    title: 'Product Availability Disclaimer',
    paragraphs: [
      'Product availability information on CloudBasket is indicative only and may not reflect real-time stock status or delivery eligibility on third-party websites.',
    ],
    bullets: [
      'A product may be out of stock, discontinued, or unavailable in your location',
      'Availability may differ by seller, marketplace listing, city, pin code, or fulfilment method',
      'CloudBasket makes no guarantee that any item shown on the platform remains available when you attempt to buy it',
    ],
  },
  {
    id: 'product-content',
    title: 'Product Description Disclaimer',
    paragraphs: [
      'Product names, specifications, descriptions, images, dimensions, compatibility statements, colours, and features displayed on CloudBasket may originate from merchants, brands, distributors, feeds, or public sources and may contain errors or omissions.',
      'For authoritative information, always verify the current product page and manufacturer documentation before purchasing.',
    ],
  },
  {
    id: 'affiliate-income',
    title: 'Affiliate Income Disclaimer',
    paragraphs: [
      'CloudBasket may earn commissions when you click affiliate links and complete qualifying purchases with merchant partners. This usually does not increase the price you pay.',
      'Affiliate relationships do not guarantee editorial endorsement, lowest price ranking, product quality, or merchant reliability.',
    ],
    callout: {
      tone: 'success',
      title: 'Mandatory affiliate notice',
      body: 'As an Amazon Associate, CloudBasket earns from qualifying purchases.',
    },
  },
  {
    id: 'external-links',
    title: 'External Links Disclaimer',
    paragraphs: [
      'CloudBasket includes links to websites and services that are not owned or controlled by NEXQON HOLDINGS. We are not responsible for the content, security, availability, data practices, or transactions that occur on those third-party properties.',
      'Your use of any external website is at your own risk and remains subject to the third party’s legal terms and policies.',
    ],
  },
  {
    id: 'no-professional-advice',
    title: 'No Professional Advice',
    paragraphs: [
      'Nothing on CloudBasket constitutes financial, legal, tax, medical, health, safety, engineering, or other professional advice. Product comparisons and editorial content are provided for general information only.',
      'You remain solely responsible for evaluating whether a product, merchant, or offer is appropriate for your needs.',
    ],
  },
  {
    id: 'no-warranty',
    title: 'No Warranty',
    paragraphs: [
      'To the fullest extent permitted by applicable law, CloudBasket and all related content are provided on an “as is” and “as available” basis without warranties of any kind, whether express, implied, or statutory.',
      'We do not warrant uninterrupted availability, uninterrupted affiliate tracking, error-free data, or the absence of harmful components.',
    ],
    legalBasis: 'Indian Contract Act, 1872 and Consumer Protection Act, 2019',
  },
  {
    id: 'limitation-of-liability',
    title: 'Limitation of Liability',
    paragraphs: [
      'To the maximum extent permitted by law, NEXQON HOLDINGS and CloudBasket shall not be liable for indirect, incidental, consequential, special, exemplary, or punitive damages arising from your use of the platform, your reliance on content, or any transaction you enter into with a third-party merchant.',
      'Where liability cannot be excluded under applicable law, the total aggregate liability of NEXQON HOLDINGS for claims arising from use of CloudBasket shall not exceed INR 5,000 or the amount directly paid by you to NEXQON HOLDINGS, whichever is greater, excluding fraud or wilful misconduct.',
    ],
    callout: {
      tone: 'warning',
      title: 'Reliance boundary',
      body: 'Purchase disputes, order fulfilment problems, shipping issues, warranty claims, and refund matters must be handled with the merchant that completed the transaction.',
    },
    legalBasis: 'Indian Contract Act, 1872 and Consumer Protection Act, 2019',
  },
  {
    id: 'intermediary-status',
    title: 'Intermediary Status under IT Act 2000',
    paragraphs: [
      'CloudBasket qualifies as an intermediary under Section 2(w) of the Information Technology Act, 2000 and claims the protection available under Section 79 with respect to qualifying third-party content displayed through feeds, merchant sources, and integrations.',
      'This status depends on observance of due diligence requirements and does not apply where the law removes safe harbour protection.',
    ],
    callout: {
      tone: 'neutral',
      title: 'Report unlawful content',
      body: `If you identify unlawful, infringing, or objectionable content on CloudBasket, notify ${LEGAL_EMAIL} for review and response under applicable law.`,
    },
    legalBasis: 'IT Act, 2000 Sections 2(w) and 79; IT Intermediary Guidelines, 2021',
  },
  {
    id: 'data-disclaimer',
    title: 'DPDP Act 2023 Data Disclaimer',
    paragraphs: [
      'CloudBasket is designed as a low-data platform and does not require a full customer account for routine browsing. Limited personal data may still be processed through analytics, cookies, forms, and related operational tooling as disclosed in our Privacy Policy and Cookie Policy.',
      'We do not warrant the completeness, accuracy, or currency of data received from third-party systems.',
    ],
    legalBasis: 'Digital Personal Data Protection Act, 2023',
  },
  {
    id: 'changes',
    title: 'Changes to This Disclaimer',
    paragraphs: [
      'NEXQON HOLDINGS may update, revise, suspend, or withdraw this Disclaimer at any time. The Last Updated date on this document reflects the latest revision date.',
      'Continued use of CloudBasket after publication of changes constitutes acceptance of the revised Disclaimer.',
    ],
  },
  {
    id: 'governing-law',
    title: 'Governing Law and Jurisdiction',
    paragraphs: [
      'This Disclaimer and your use of CloudBasket are governed by the laws of India. Subject to applicable consumer rights, disputes shall be subject to the jurisdiction of competent courts in Kadapa, Andhra Pradesh, India.',
    ],
  },
  {
    id: 'contact',
    title: 'Contact and Grievance Channel',
    paragraphs: [
      'For legal notices, disclaimer-related queries, or reports concerning unlawful content, contact NEXQON HOLDINGS at the address below.',
      `Email: ${LEGAL_EMAIL}`,
      'Address: Kadapa, Andhra Pradesh – 516002, India',
    ],
    callout: {
      tone: 'success',
      title: 'Response target',
      body: 'Grievance notices are targeted for acknowledgement within 24 hours and handled within applicable statutory timelines.',
    },
  },
]
