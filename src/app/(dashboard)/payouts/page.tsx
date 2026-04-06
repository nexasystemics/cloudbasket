'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { getVendorPayouts, getPayoutSummary } from '@/services/payouts/payout-engine';
import type { Payout } from '@/services/payouts/payout-engine';

export default function PayoutsPage() {
  const router = useRouter();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [summary, setSummary] = useState({
    totalPending: 0,
    totalProcessing: 0,
    totalCompleted: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vendorId, setVendorId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPayoutData() {
      try {
        setLoading(true);
        const supabase = createBrowserSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login');
          return;
        }

        setVendorId(user.id);

        const vendorPayouts = await getVendorPayouts(user.id, 20, 0);
        setPayouts(vendorPayouts);

        const payoutSummary = await getPayoutSummary(user.id);
        setSummary(payoutSummary);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load payouts');
      } finally {
        setLoading(false);
      }
    }

    fetchPayoutData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading payouts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Payouts</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm font-medium mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">
              ${summary.totalPending.toFixed(2)}
            </p>
            <p className="text-gray-600 text-xs mt-2">Awaiting processing</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm font-medium mb-1">Processing</p>
            <p className="text-3xl font-bold text-blue-600">
              ${summary.totalProcessing.toFixed(2)}
            </p>
            <p className="text-gray-600 text-xs mt-2">In progress</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm font-medium mb-1">Completed</p>
            <p className="text-3xl font-bold text-green-600">
              ${summary.totalCompleted.toFixed(2)}
            </p>
            <p className="text-gray-600 text-xs mt-2">Total paid out</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Payout ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payouts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No payouts yet.
                  </td>
                </tr>
              ) : (
                payouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {payout.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                      ${payout.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                      {payout.method.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          payout.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : payout.status === 'failed' || payout.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(payout.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
