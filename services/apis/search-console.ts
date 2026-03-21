// services/apis/search-console.ts
// Google Search Console API stub.
import { env, isConfigured } from '@/lib/env'
export type SearchRow = { keys: string[]; clicks: number; impressions: number; ctr: number; position: number }
export class SearchConsoleAPI {
  private isReady() { return isConfigured('GOOGLE_SERVICE_ACCOUNT_JSON') }
  async getTopQueries(): Promise<SearchRow[]> {
    if (!this.isReady()) { console.warn('[SearchConsole] Configure GOOGLE_SERVICE_ACCOUNT_JSON'); return [] }
    return []
  }
}
export const searchConsole = new SearchConsoleAPI()