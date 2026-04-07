/**
 * lib/features.ts
 * CloudBasket Feature Flag Registry
 *
 * PURPOSE: Central on/off switches for all optional platform features.
 * HOW TO ENABLE: Set the corresponding env var to "true" in .env.local
 * HOW TO DISABLE: Remove the env var or set it to anything other than "true"
 *
 * RISK LEVEL: Low — read-only config, no side effects
 * DEPENDENCIES: None
 * ROLLBACK: Revert this file or unset env vars
 */

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function flag(envKey: string): boolean {
  return process.env[envKey] === 'true';
}

// ---------------------------------------------------------------------------
// FEATURE FLAG REGISTRY
// All flags default to false (disabled) unless explicitly enabled via env var.
// ---------------------------------------------------------------------------

export const FEATURES = {

  // ── GROUP 1: Orders & Checkout ──────────────────────────────────────────
  // Restored from git: commit 1ffcc9e (D52–D55), commit d1f9056 (original)
  // Env: FEATURE_ORDERS=true
  ORDERS: flag('FEATURE_ORDERS'),

  // ── GROUP 2: Wallet & Financial ─────────────────────────────────────────
  // Restored from git: commit 1ffcc9e (D56–D57), commit d1f9056 (original)
  // Env: FEATURE_WALLET=true
  WALLET: flag('FEATURE_WALLET'),

  // ── GROUP 3: Invoices ───────────────────────────────────────────────────
  // Restored from git: commit 1ffcc9e (D58–D59)
  // Env: FEATURE_INVOICES=true
  INVOICES: flag('FEATURE_INVOICES'),

  // ── GROUP 4: Payouts (Vendor) ───────────────────────────────────────────
  // Restored from git: commit 1ffcc9e (D60–D61)
  // Env: FEATURE_PAYOUTS=true
  PAYOUTS: flag('FEATURE_PAYOUTS'),

  // ── GROUP 5: Payment Processing ─────────────────────────────────────────
  // Restored from git: commit d1f9056 (Razorpay, Stripe, PayU)
  // Env: FEATURE_PAYMENTS=true
  PAYMENTS: flag('FEATURE_PAYMENTS'),

  // ── GROUP 6: Admin Dashboards ───────────────────────────────────────────
  // Restored from git: commit 4b885a0 (60+ admin pages)
  // Env: FEATURE_ADMIN=true
  ADMIN: flag('FEATURE_ADMIN'),

  // ── GROUP 7: User Dashboard ─────────────────────────────────────────────
  // Restored from git: commit 4b885a0 (13 dashboard pages)
  // Env: FEATURE_DASHBOARD=true
  DASHBOARD: flag('FEATURE_DASHBOARD'),

  // ── GROUP 8: Vendor Portal ──────────────────────────────────────────────
  // Restored from git: commit 4b885a0 (9 vendor pages)
  // Env: FEATURE_VENDOR=true
  VENDOR: flag('FEATURE_VENDOR'),

  // ── GROUP 9: Gift Cards ─────────────────────────────────────────────────
  // Restored from git: commit 4b885a0 (services/gift-cards/*)
  // Env: FEATURE_GIFT_CARDS=true
  GIFT_CARDS: flag('FEATURE_GIFT_CARDS'),

  // ── GROUP 10: POD Pricing & Fulfillment ─────────────────────────────────
  // Restored from git: commit 4b885a0 (services/pricing-engine/, fulfillment/)
  // Env: FEATURE_POD_FULFILLMENT=true
  POD_FULFILLMENT: flag('FEATURE_POD_FULFILLMENT'),

  // ── GROUP 11: Email Fulfillment Notifications ───────────────────────────
  // Restored from git: commit 4b885a0 (services/email-engine/fulfillment)
  // Env: FEATURE_EMAIL_FULFILLMENT=true
  EMAIL_FULFILLMENT: flag('FEATURE_EMAIL_FULFILLMENT'),

  // ── GROUP 12: Checkout Flow ─────────────────────────────────────────────
  // Restored from git: commit d1f9056 (app/checkout/*, api/checkout/*)
  // Env: FEATURE_CHECKOUT=true
  CHECKOUT: flag('FEATURE_CHECKOUT'),

  // ── GROUP 13: Returns & Refunds ─────────────────────────────────────────
  // Restored from git: commit 4b885a0 (dashboard/returns/*)
  // Env: FEATURE_RETURNS=true
  RETURNS: flag('FEATURE_RETURNS'),

} as const;

// ---------------------------------------------------------------------------
// Type Exports
// ---------------------------------------------------------------------------

export type FeatureKey = keyof typeof FEATURES;

/**
 * Returns true if a feature is enabled.
 * Use in server components, API routes, and services.
 *
 * @example
 * if (!isEnabled('ORDERS')) return null;
 */
export function isEnabled(feature: FeatureKey): boolean {
  return FEATURES[feature];
}

/**
 * Returns list of all currently enabled features.
 * Useful for admin diagnostics.
 */
export function getEnabledFeatures(): FeatureKey[] {
  return (Object.keys(FEATURES) as FeatureKey[]).filter(
    (key) => FEATURES[key] === true
  );
}

/**
 * Returns full feature status map — for admin/debug use only.
 */
export function getFeatureStatus(): Record<FeatureKey, boolean> {
  return { ...FEATURES };
}
