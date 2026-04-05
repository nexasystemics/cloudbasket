'use client';

import React, { useEffect, useState } from 'react';
import { Activity, Server, Database, CheckCircle, AlertTriangle } from 'lucide-react';

interface SystemStatus {
  service: string;
  status: 'online' | 'degraded' | 'offline';
  latency: string;
  uptime: string;
}

export default function SystemHealthPage() {
  const [stats, setStats] = useState<SystemStatus[]>([
    { service: 'Supabase DB', status: 'online', latency: '45ms', uptime: '99.9%' },
    { service: 'Redis Cache', status: 'online', latency: '2ms', uptime: '100%' },
    { service: 'Edge Functions', status: 'online', latency: '120ms', uptime: '99.8%' },
    { service: 'Affiliate PA-API', status: 'online', latency: '450ms', uptime: '98.5%' },
  ]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-3">
          <Activity className="text-cb-primary" />
          System Telemetry
        </h1>
        <div className="px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 text-sm font-medium">
          Cluster: production-in-west-1
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.service} className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-500 font-medium">{s.service}</span>
              {s.status === 'online' ? (
                <CheckCircle size={16} className="text-emerald-500" />
              ) : (
                <AlertTriangle size={16} className="text-amber-500" />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-mono font-bold text-slate-900 dark:text-slate-100">{s.latency}</p>
              <p className="text-xs text-slate-400">Uptime: {s.uptime}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 bg-zinc-950 rounded-2xl border border-zinc-800 text-slate-400 font-mono text-sm overflow-hidden">
        <div className="flex items-center gap-2 mb-4 text-emerald-400">
          <Server size={14} />
          <span>Real-time Log Stream</span>
        </div>
        <div className="space-y-1 opacity-80">
          <p>[09:12:01] INFO: Completed daily price history archive (5,402 records)</p>
          <p>[09:12:05] WARN: Amazon PA-API rate-limited for key ...X42</p>
          <p>[09:12:15] INFO: Webhook processed from Razorpay: pay_4Kj89Lz</p>
          <p>[09:12:22] INFO: System health check passed</p>
        </div>
      </div>
    </div>
  );
}
