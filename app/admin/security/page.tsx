
"use client";

import { useEffect, useState } from "react";
import {
  getHighRiskUsers,
  getSecurityMetrics,
} from "@/services/security/fraud-detector";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  name: string;
  value: number;
}

export default function SecurityPage() {
  const [users, setUsers] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<{ total_flags: number; high_severity: number }>({
    total_flags: 0,
    high_severity: 0,
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData(): Promise<void> {
    try {
      setLoading(true);
      setError(null);

      const [usersData, metricsData] = await Promise.all([
        getHighRiskUsers(10),
        getSecurityMetrics(),
      ]);

      setUsers(usersData);
      setMetrics(metricsData);

      const chart: ChartData[] = [
        { name: "Total Flags", value: metricsData.total_flags },
        { name: "High Severity", value: metricsData.high_severity },
      ];

      setChartData(chart);
    } catch (err) {
      console.warn("loadData failed", err);
      setError("Failed to load security data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function confirmBlock(userId: string): void {
    const confirmed = window.confirm("Block this user?");
    if (!confirmed) return;

    console.log("User blocked:", userId);
  }

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="animate-pulse h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="animate-pulse h-40 bg-gray-200 rounded"></div>
        <div className="animate-pulse h-40 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">{error}</p>
        <button
          onClick={loadData}
          className="mt-4 px-4 py-2 bg-gray-800 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Security Dashboard</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white shadow rounded">
          <p className="text-sm text-gray-500">Total Flags</p>
          <h2 className="text-xl font-bold">{metrics.total_flags}</h2>
        </div>

        <div className="p-4 bg-white shadow rounded">
          <p className="text-sm text-gray-500">High Severity</p>
          <h2 className="text-xl font-bold">{metrics.high_severity}</h2>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="mb-4 font-semibold">Risk Distribution</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="mb-4 font-semibold">High Risk Users</h2>

        {users.length === 0 ? (
          <p className="text-gray-500">No high-risk users found</p>
        ) : (
          <table className="w-full text-left border">
            <thead>
              <tr className="border-b">
                <th className="p-2">User ID</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user} className="border-b">
                  <td className="p-2">{user}</td>
                  <td className="p-2">
                    <button
                      onClick={() => confirmBlock(user)}
                      className="px-3 py-1 bg-gray-800 text-white rounded"
                    >
                      Block
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="mb-4 font-semibold">Recent Activity</h2>
        <p className="text-gray-500">Event stream integration coming from security_events table.</p>
      </div>
    </div>
  );
}
