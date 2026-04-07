/**
 * app/feature-disabled/page.tsx
 * CloudBasket — Feature Disabled Landing Page
 *
 * PURPOSE: Shown when a user accesses a route whose feature flag is off.
 * RISK LEVEL: None — static display page
 * DEPENDENCIES: lib/features.ts (for feature name display)
 */

import { type FeatureKey, getFeatureStatus } from '@/lib/features';
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{ feature?: string }>;
}

const FEATURE_LABELS: Record<string, string> = {
  ORDERS: 'Order Management',
  WALLET: 'Wallet & Balance',
  INVOICES: 'Invoices',
  PAYOUTS: 'Vendor Payouts',
  PAYMENTS: 'Payment Processing',
  ADMIN: 'Admin Dashboard',
  DASHBOARD: 'User Dashboard',
  VENDOR: 'Vendor Portal',
  GIFT_CARDS: 'Gift Cards',
  POD_FULFILLMENT: 'POD Fulfillment',
  EMAIL_FULFILLMENT: 'Fulfillment Emails',
  CHECKOUT: 'Checkout Flow',
  RETURNS: 'Returns & Refunds',
};

export default async function FeatureDisabledPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const feature = params.feature as FeatureKey | undefined;
  const label = feature ? (FEATURE_LABELS[feature] ?? feature) : 'This feature';
  const envKey = feature ? `FEATURE_${feature}` : null;
  const status = getFeatureStatus();

  const enabledCount = Object.values(status).filter(Boolean).length;
  const totalCount = Object.keys(status).length;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">

        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          {label} is currently disabled
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          This feature exists in the codebase but has been turned off.
          It can be enabled via environment configuration.
        </p>

        {/* Enable hint */}
        {envKey && (
          <div className="bg-gray-50 rounded-lg p-4 text-left mb-6">
            <p className="text-xs font-medium text-gray-600 mb-2">To enable, add to .env.local:</p>
            <code className="text-xs font-mono text-sky-700 bg-sky-50 px-3 py-2 rounded block">
              {envKey}=true
            </code>
            <p className="text-xs text-gray-400 mt-2">Then restart the dev server.</p>
          </div>
        )}

        {/* Feature status summary */}
        <p className="text-xs text-gray-400 mb-6">
          {enabledCount} of {totalCount} optional features currently active
        </p>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="px-4 py-2 bg-sky-500 text-white text-sm font-medium rounded-lg hover:bg-sky-600 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/deals"
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Browse Deals
          </Link>
        </div>
      </div>
    </main>
  );
}
