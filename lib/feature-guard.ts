/**
 * lib/feature-guard.ts
 * CloudBasket Feature Guard — Server-Side Utility
 *
 * PURPOSE: Use at the top of any page.tsx or route.ts to block access
 *          when a feature flag is disabled.
 *
 * RISK LEVEL: Low — read-only, no mutations
 * DEPENDENCIES: lib/features.ts, next/navigation
 * ROLLBACK: Revert this file
 */

import { redirect } from 'next/navigation';
import { type FeatureKey, isEnabled } from '@/lib/features';

/**
 * Call this at the top of any Server Component page that is behind a feature flag.
 * If the feature is disabled, the user is redirected to /feature-disabled.
 *
 * @example
 * // app/dashboard/orders/page.tsx
 * import { requireFeature } from '@/lib/feature-guard';
 * export default async function OrdersPage() {
 *   await requireFeature('ORDERS');
 *   // ... rest of page
 * }
 */
export function requireFeature(feature: FeatureKey): void {
  if (!isEnabled(feature)) {
    redirect(`/feature-disabled?feature=${feature}`);
  }
}

/**
 * Use in API route handlers (route.ts).
 * Returns a 403 JSON response if the feature is disabled.
 *
 * @example
 * // app/api/orders/route.ts
 * import { featureResponse } from '@/lib/feature-guard';
 * export async function GET() {
 *   const blocked = featureResponse('ORDERS');
 *   if (blocked) return blocked;
 *   // ... rest of handler
 * }
 */
export function featureResponse(feature: FeatureKey): Response | null {
  if (!isEnabled(feature)) {
    return Response.json(
      {
        error: 'Feature disabled',
        feature,
        message: `The '${feature}' feature is not enabled on this instance.`,
        enableHint: `Set FEATURE_${feature}=true in .env.local to enable.`,
      },
      { status: 403 }
    );
  }
  return null;
}

/**
 * Use in service functions to early-return when feature is disabled.
 * Returns true if the feature is BLOCKED (disabled), false if allowed.
 *
 * @example
 * import { isBlocked } from '@/lib/feature-guard';
 * export async function createOrder(...) {
 *   if (isBlocked('ORDERS')) return null;
 *   // ... rest of logic
 * }
 */
export function isBlocked(feature: FeatureKey): boolean {
  return !isEnabled(feature);
}
