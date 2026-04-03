// © 2026 NEXQON HOLDINGS — CloudBasket app/legal/refund-policy/data.ts

export const REFUND_POLICY_VERSION = 'v1.0'
export const REFUND_POLICY_EFFECTIVE_DATE = '02 April 2026'
export const REFUND_POLICY_LAST_UPDATED = '02 April 2026'
export const REFUND_POLICY_DOCUMENT_ID = 'CB-LEGAL-REFUND-2026-001'
export const REFUND_POLICY_CONTACT_EMAIL = 'info@cloudbasket.co'

export interface RefundPolicySection {
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

export const REFUND_POLICY_SECTIONS: RefundPolicySection[] = [
  {
    id: 'plain-language-summary',
    title: 'Plain-Language Summary',
    paragraphs: [
      'CloudBasket does not accept returns or issue refunds for purchases completed on third-party platforms.',
      'Any request for cancellation, replacement, exchange, refund, delivery support, warranty support, or damage claim must be submitted to the marketplace, seller, print partner, or merchant that processed the order.',
    ],
    callout: {
      tone: 'warning',
      title: 'Fast answer',
      body: 'If you paid on Amazon, Flipkart, Etsy, Redbubble, or another external platform, that platform or seller controls the refund and returns process, not CloudBasket.',
    },
  },
  {
    id: 'our-role',
    title: 'Our Role',
    paragraphs: [
      'CloudBasket is an affiliate-led discovery platform and a design publishing layer for third-party POD marketplaces. We help users discover products and, where applicable, publish design-led listings to external sales channels.',
      'CloudBasket provides discovery links and design publishing only, unless a page expressly states that CloudBasket itself is acting as the merchant of record for a separate transaction flow.',
    ],
    bullets: [
      'We do not operate checkout for affiliate purchases',
      'We do not collect payment for third-party marketplace purchases',
      'We do not control external seller fulfilment, replacement, or refund decisions',
    ],
  },
  {
    id: 'where-contract-forms',
    title: 'Where the Contract Is Formed',
    paragraphs: [
      'For affiliate purchases and third-party marketplace POD purchases, the purchase contract is formed between you and the external marketplace, seller, or merchant that accepts your order and payment.',
      'CloudBasket is not a party to that purchase contract merely because a user discovered a product, design, or listing through CloudBasket.',
    ],
  },
  {
    id: 'returns-and-refunds',
    title: 'Returns and Refunds',
    paragraphs: [
      'CloudBasket does not process returns, replacements, cancellations, refunds, or exchanges directly. These are governed by the marketplace, seller, print partner, or merchant where the order was placed.',
      'Before purchasing, you should review the return, cancellation, refund, damage, replacement, shipping, warranty, and buyer-protection policies published on the relevant platform or seller page.',
    ],
    bullets: [
      'Refund eligibility is determined only by the platform or seller that processed the order',
      'CloudBasket cannot approve or reject refund requests for third-party purchases',
      'CloudBasket cannot guarantee that a marketplace or seller will accept a claim',
    ],
  },
  {
    id: 'pod-design-clarification',
    title: 'POD Design Clarification',
    paragraphs: [
      'CloudBasket may create, curate, or upload artwork and design assets to third-party print-on-demand marketplaces or seller accounts. That design involvement alone does not make CloudBasket the fulfilment party, shipping party, or refund authority for the resulting order unless expressly stated otherwise.',
      'Where a design is sold on a third-party marketplace, the marketplace and the seller account that completed the transaction remain responsible for order-level customer service under their own rules.',
    ],
    callout: {
      tone: 'neutral',
      title: 'Design role only',
      body: 'CloudBasket design contribution does not automatically create a direct refund relationship with the end customer.',
    },
  },
  {
    id: 'defective-misprinted-items',
    title: 'Defective or Misprinted Item Workflow',
    paragraphs: [
      'If you receive a defective, damaged, incorrect, delayed, or misprinted product from a third-party marketplace order, you must raise the issue directly with the marketplace, seller, or support channel shown in your order record.',
      'CloudBasket may review reports about a misleading listing, broken outbound link, or design-rights concern and may update or remove the referenced listing from CloudBasket where appropriate, but that does not make CloudBasket the refund authority.',
    ],
    bullets: [
      'Check the order page, invoice, or platform help centre for the correct claim path',
      'Follow the deadline and evidence requirements of the selling platform',
      'Keep photos, packaging evidence, and order records for the marketplace claim process',
    ],
  },
  {
    id: 'no-direct-refund-obligation',
    title: 'No Direct Refund Obligation by CloudBasket',
    paragraphs: [
      'CloudBasket has no direct obligation to issue money refunds, shipping reimbursements, return labels, replacements, or exchange approvals for purchases completed on third-party platforms.',
      'This position applies unless CloudBasket expressly states in a future transaction flow that it is acting as merchant of record or direct contracting party for a specific order.',
    ],
    legalBasis: 'Indian Contract Act, 1872 and Consumer Protection Act, 2019',
  },
  {
    id: 'third-party-policy-supremacy',
    title: 'Third-Party Policy Supremacy',
    paragraphs: [
      'The refund, replacement, cancellation, shipping, and complaint rules of the relevant marketplace, seller, or merchant govern the transaction. These may include Amazon, Flipkart, Etsy, Redbubble, Printify-connected seller accounts, or other external commerce platforms.',
      'If this Policy differs from the live policy published by the platform or seller that processed your order, the transaction-specific platform or seller policy will control the order-level remedy process.',
    ],
  },
  {
    id: 'contact-for-link-issues',
    title: 'Contact for Link or Content Issues Only',
    paragraphs: [
      'You may contact CloudBasket regarding broken links, inaccurate editorial references, misleading listing descriptions shown on CloudBasket, or design-rights concerns related to content surfaced through CloudBasket.',
      `For those non-order issues, contact ${REFUND_POLICY_CONTACT_EMAIL}. We may investigate and update or remove the affected reference where justified.`,
    ],
    callout: {
      tone: 'success',
      title: 'Support boundary',
      body: 'CloudBasket contact channels can review content and link issues, but they do not replace the marketplace or seller refund workflow.',
    },
  },
  {
    id: 'governing-law-disclaimer',
    title: 'Governing Law and Disclaimer',
    paragraphs: [
      'This Policy is governed by the laws of India. Subject to mandatory consumer rights and applicable law, disputes relating to this Policy shall be subject to the jurisdiction of competent courts in Kadapa, Andhra Pradesh, India.',
      'This Policy explains CloudBasket’s role for affiliate and third-party marketplace purchases. It does not constitute legal advice and does not override any mandatory rights available to users under applicable law against the actual seller or marketplace.',
    ],
    legalBasis: 'Consumer Protection Act, 2019; IT Act, 2000; Indian Contract Act, 1872',
  },
]
