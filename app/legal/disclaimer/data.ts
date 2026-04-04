// © 2026 NEXQON HOLDINGS — CloudBasket app/legal/disclaimer/data.ts

export const DISCLAIMER_VERSION = '1.0'
export const DISCLAIMER_EFFECTIVE_DATE = '01 April 2026'
export const DISCLAIMER_LAST_UPDATED = '01 April 2026'
export const DISCLAIMER_DOCUMENT_ID = 'DISCLAIMER-FINAL'
export const DISCLAIMER_URL = 'www.cloudbasket.co/legal/disclaimer'
export const LEGAL_EMAIL = 'info@cloudbasket.co'
export const DISCLAIMER_LAWS_APPLIED = [
  'Consumer Protection Act 2019',
  'E-Commerce Rules 2020',
  'IT Act 2000 (s.79)',
  'IT Intermediary Guidelines 2021',
  'DPDP Act 2023',
  'Indian Contract Act 1872',
] as const

export const DISCLAIMER_SUMMARY =
  'CloudBasket shows you prices and product information gathered from Amazon, Flipkart, and other merchants. We do not sell products, process payments, or hold stock. Prices and availability shown here may not match what you see on the merchant site, so always verify before buying. We may earn affiliate commissions from qualifying purchases at no extra cost to you. Our liability is limited to the extent described below.'

export interface DisclaimerSection {
  id: string
  title: string
  paragraphs: string[]
  bullets?: string[]
  callout?:
    | {
        title: string
        body: string
        tone: 'warning' | 'success' | 'neutral'
      }
    | undefined
  legalBasis?: string
}

export const DISCLAIMER_SECTIONS: DisclaimerSection[] = [
  {
    id: 'general-disclaimer',
    title: 'General Disclaimer',
    paragraphs: [
      'The information provided on CloudBasket (www.cloudbasket.co) is for general informational and product-discovery purposes only. CloudBasket is a price-comparison and affiliate-link aggregation platform. We do not sell products, hold inventory, process payments, or act as a merchant or seller in any transaction.',
      'While we make every reasonable effort to keep information accurate and current, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of this Website or any information, products, or services referred to on it.',
      'Any reliance you place on information provided by CloudBasket is strictly at your own risk. This disclaimer applies to all users of CloudBasket, regardless of location.',
    ],
  },
  {
    id: 'pricing-disclaimer',
    title: 'Pricing Disclaimer',
    paragraphs: [
      'Prices displayed on CloudBasket are sourced from merchant affiliate data feeds and APIs and are indicative only. They may not reflect the current price on the merchant website at the time of your visit or purchase.',
      'Always confirm the current price on the merchant website before completing any purchase. CloudBasket accepts no liability for any price discrepancy between what is displayed on this Website and what is charged by the merchant at checkout.',
    ],
    bullets: [
      'Flash sales, limited-time offers, and promotional events',
      'Platform coupons and loyalty discounts',
      'Stock availability and demand fluctuations',
      'Pricing algorithm updates by the merchant',
      'Regional, device-specific, or user-account-specific pricing',
      'Currency conversion variances where applicable',
    ],
    legalBasis: 'Consumer Protection Act 2019, Sections 2(28) and 2(47); E-Commerce Rules 2020, Rule 4',
  },
  {
    id: 'availability-disclaimer',
    title: 'Product Availability Disclaimer',
    paragraphs: [
      'Product availability information displayed on CloudBasket is sourced from third-party affiliate feeds and may not reflect real-time stock status on merchant websites. A product shown as available or in stock on CloudBasket may no longer be available by the time you reach the merchant site.',
      'CloudBasket makes no guarantee of product availability. Always confirm availability with the merchant before making any purchasing decision.',
    ],
    bullets: [
      'Out of stock or sold out',
      'Discontinued or permanently delisted',
      'Available only in certain regions, pin codes, or user accounts',
      'Available only through a specific seller on the merchant marketplace',
    ],
  },
  {
    id: 'description-disclaimer',
    title: 'Product Description Disclaimer',
    paragraphs: [
      'Product names, descriptions, specifications, features, dimensions, materials, colours, weights, compatibility information, and other product attributes displayed on CloudBasket are sourced from affiliate data feeds, manufacturer-provided data, or publicly available sources.',
      'This information may contain errors, omissions, or outdated details, may differ from the actual product received, and may vary by batch, region, or seller even for the same product listing.',
      'CloudBasket is not the manufacturer, seller, or distributor of any product listed on this Website. For authoritative product specifications, always refer to the merchant product page and the manufacturer documentation.',
    ],
  },
  {
    id: 'affiliate-income-disclaimer',
    title: 'Affiliate Income Disclaimer',
    paragraphs: [
      'CloudBasket contains affiliate links to external merchant websites including, but not limited to, Amazon.in and Flipkart.com. When you click these links and make a qualifying purchase, CloudBasket may earn a commission from the merchant at no additional cost to you.',
      'This relationship is disclosed in full in our Affiliate Disclosure. The existence of an affiliate relationship does not guarantee that featured products represent the best available option, nor does it mean CloudBasket endorses any specific product or merchant beyond what is expressly stated.',
    ],
    callout: {
      title: 'Amazon Associate Notice',
      body: 'As an Amazon Associate, CloudBasket earns from qualifying purchases.',
      tone: 'success',
    },
  },
  {
    id: 'external-links-disclaimer',
    title: 'External Links Disclaimer',
    paragraphs: [
      'CloudBasket contains hyperlinks to external websites and platforms that are not owned, operated, or controlled by NEXQON HOLDINGS. These links are provided for convenience and to enable you to locate and purchase products.',
      'The inclusion of any external link does not imply endorsement, approval, or any affiliation with the linked website or its operators. NEXQON HOLDINGS has no responsibility or liability for the content, accuracy, availability, security, privacy practices, or transactions of any external website.',
      'Visiting any external website linked from CloudBasket is entirely at your own risk and subject to that website’s own terms and policies.',
    ],
  },
  {
    id: 'no-professional-advice',
    title: 'No Professional Advice',
    paragraphs: [
      'Nothing on CloudBasket constitutes professional advice of any kind, including financial, investment, legal, medical, health, safety, or technical advice.',
      'All purchasing decisions are entirely your own. Consult a qualified professional where appropriate before making significant purchasing decisions.',
    ],
    bullets: [
      'Price comparisons and product recommendations are informational only',
      'No content on this Website should be construed as legal advice',
      'Product descriptions do not constitute health, medical, or safety recommendations',
      'Compatibility and technical information is provided for general reference only',
    ],
  },
  {
    id: 'no-warranty',
    title: 'No Warranty',
    paragraphs: [
      'To the fullest extent permitted by applicable Indian law, CloudBasket and this Website are provided on an as is and as available basis without any warranty of any kind.',
      'NEXQON HOLDINGS expressly disclaims all warranties, express or implied, including merchantability, fitness for a particular purpose, non-infringement, accuracy, completeness, timeliness, uninterrupted operation, or error-free operation.',
      'No warranty is given that the Website will be free from viruses, malware, or other harmful components. Use of the Website and any reliance on its content is at your sole risk.',
    ],
    legalBasis: 'Indian Contract Act 1872, Sections 73 to 74; Consumer Protection Act 2019, Section 2(9)',
  },
  {
    id: 'limitation-of-liability',
    title: 'Limitation of Liability',
    paragraphs: [
      'To the maximum extent permitted by applicable law, NEXQON HOLDINGS, its directors, employees, agents, or affiliates shall not be liable for direct, indirect, incidental, or consequential losses arising from your use of or inability to use CloudBasket, your reliance on Website information, or transactions with third-party merchants.',
      'Where liability cannot be entirely excluded under applicable law, NEXQON HOLDINGS total aggregate liability to you for any claim arising from use of this Website shall not exceed INR 5,000 or the amount, if any, paid by you directly to NEXQON HOLDINGS in connection with the relevant matter, whichever is greater. This cap excludes liability for fraud or wilful misconduct.',
      'By using CloudBasket, you agree to indemnify and hold harmless NEXQON HOLDINGS and its officers, employees, and agents from and against claims, liabilities, damages, costs, and expenses arising from your use of this Website, your reliance on information provided here, or transactions entered into with a third-party merchant.',
    ],
    bullets: [
      'Loss of profit, revenue, data, goodwill, or business opportunity',
      'Damages arising from purchases made through affiliate links on this Website',
      'Losses caused by errors, omissions, interruptions, or delays in content',
      'Losses arising from any transaction with a third-party merchant',
    ],
    legalBasis: 'Indian Contract Act 1872, Sections 73 to 74; Consumer Protection Act 2019, Section 88',
  },
  {
    id: 'intermediary-status',
    title: 'Intermediary Status under IT Act 2000, Section 79',
    paragraphs: [
      'CloudBasket qualifies as an intermediary under Section 2(w) of the Information Technology Act, 2000. CloudBasket functions as a conduit that aggregates and displays information sourced from third-party merchant platforms.',
      'CloudBasket does not initiate the transmission of third-party product data, does not select the receiver beyond the user’s own search query, and does not modify third-party product information, pricing, or availability in any substantive way.',
      'Accordingly, NEXQON HOLDINGS claims the protection of Section 79 of the IT Act, 2000 with respect to qualifying third-party content displayed on this Website, subject to compliance with applicable due diligence obligations.',
    ],
    bullets: [
      'CloudBasket does not conspire with, aid, or abet any unlawful act by a merchant or third party',
      'CloudBasket observes due diligence under the IT Intermediary Guidelines and Digital Media Ethics Code Rules, 2021',
      'If user-generated content is introduced in the future, reporting and review workflows will apply',
    ],
    callout: {
      title: 'Report unlawful content',
      body: `If you become aware of unlawful, infringing, or objectionable content on CloudBasket, notify us immediately at ${LEGAL_EMAIL}.`,
      tone: 'warning',
    },
    legalBasis: 'IT Act 2000, Sections 2(w) and 79; IT Intermediary Guidelines 2021, Rule 3(1)(a)',
  },
  {
    id: 'data-disclaimer',
    title: 'DPDP Act 2023 Data Disclaimer',
    paragraphs: [
      'CloudBasket is a zero-account platform. We do not require user registration or login. Product and pricing data displayed on this Website is sourced from third-party affiliate feeds and APIs.',
      'We process minimal personal data through analytics and cookie tools as disclosed in our Privacy Policy and Cookie Policy. Where third-party analytics or affiliate tracking involves processing of visit data, this is conducted in accordance with the Digital Personal Data Protection Act 2023 and applicable rules.',
      'We do not warrant the accuracy, completeness, or currency of data received from third-party sources.',
    ],
  },
  {
    id: 'changes-to-disclaimer',
    title: 'Changes to This Website and Disclaimer',
    paragraphs: [
      'NEXQON HOLDINGS reserves the right to modify, update, suspend, or discontinue any part of CloudBasket at any time without prior notice and to amend this Disclaimer at any time.',
      'The Last Updated date above reflects the most recent revision. Continued use of CloudBasket following any changes to this Disclaimer constitutes your acceptance of the revised terms.',
      `If you identify any factual error or inaccuracy on CloudBasket, please contact us at ${LEGAL_EMAIL} and we will review it promptly.`,
    ],
  },
  {
    id: 'governing-law',
    title: 'Governing Law and Jurisdiction',
    paragraphs: [
      'This Disclaimer and your use of CloudBasket are governed exclusively by the laws of the Republic of India.',
      'Any dispute, controversy, or claim arising out of or relating to your use of this Website or this Disclaimer, including its validity, interpretation, breach, or termination, shall be subject to the exclusive jurisdiction of the competent courts located in Kadapa, Andhra Pradesh, India.',
      'If any provision of this Disclaimer is found to be unenforceable under applicable law, the remaining provisions shall continue in full force and effect.',
    ],
  },
  {
    id: 'contact-grievance',
    title: 'Contact and Grievance Officer',
    paragraphs: [
      'For questions, complaints, or notices relating to this Disclaimer, or to report unlawful content under the IT Intermediary Guidelines 2021, contact the grievance and legal channel below.',
      'Grievance Officer / Legal Contact: NEXQON HOLDINGS, Kadapa, Andhra Pradesh – 516002, India.',
      `Email: ${LEGAL_EMAIL}`,
      'Website: www.cloudbasket.co',
    ],
    callout: {
      title: 'Response timeline',
      body: 'Grievances will be acknowledged within 24 hours and resolved within 15 days as required under the IT Intermediary Guidelines Rules 2021, Rule 3(2)(c).',
      tone: 'neutral',
    },
  },
]

export const DISCLAIMER_RELATED_LINKS = [
  { href: '/legal/privacy', label: 'Privacy Policy' },
  { href: '/legal/cookies', label: 'Cookie Policy' },
  { href: '/legal/terms', label: 'Terms of Service' },
  { href: '/legal/affiliate-disclosure', label: 'Affiliate Disclosure' },
  { href: '/legal/refund-policy', label: 'Refund & Returns Policy' },
] as const
