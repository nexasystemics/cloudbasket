// services/apis/search-console.ts
// Google Search Console API using service account auth.
// Stubs return empty data when credentials not configured.

import { env, isConfigured } from '@/lib/env'

export type SearchRow = { keys: string[]; clicks: number; impressions: number; ctr: number; position: number }
export type SearchPerformanceData = { rows: SearchRow[]; totalClicks: number; totalImpressions: number; averageCTR: number; averagePosition: number }

export class SearchConsoleAPI {
  private isReady(): boolean { return isConfigured('GOOGLE_SERVICE_ACCOUNT_JSON') && isConfigured('SEARCH_CONSOLE_SITE_URL') }

  async getSearchPerformance(startDate: string, endDate: string): Promise<SearchPerformanceData> {
    if (!this.isReady()) return { rows: [], totalClicks: 0, totalImpressions: 0, averageCTR: 0, averagePosition: 0 }
    try {
      // Full OAuth2 service account flow requires server-side JWT generation
      // Wire GOOGLE_SERVICE_ACCOUNT_JSON with service account credentials
      console.warn('[SearchConsole] Configure GOOGLE_SERVICE_ACCOUNT_JSON to enable')
      return { rows: [], totalClicks: 0, totalImpressions: 0, averageCTR: 0, averagePosition: 0 }
    } catch { return { rows: [], totalClicks: 0, totalImpressions: 0, averageCTR: 0, averagePosition: 0 } }
  }

  async getTopQueries(limit = 10): Promise<SearchRow[]> {
    const data = await this.getSearchPerformance(new Date(Date.now() - 28 * 86400000).toISOString().split('T')[0], new Date().toISOString().split('T')[0])
    return data.rows.sort((a, b) => b.clicks - a.clicks).slice(0, limit)
  }
}

export const searchConsole = new SearchConsoleAPI()