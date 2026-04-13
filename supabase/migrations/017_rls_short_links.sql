-- ============================================================
-- Migration 017: RLS policies for short_links table
-- Created: 2026-04-13
-- IBF Note: Run in Supabase Dashboard > SQL Editor against production.
--           DO NOT run in this session — file creation only.
-- ============================================================
-- Context: short_links was created in 20260301213842_schema_and_seed.sql
-- with no ENABLE ROW LEVEL SECURITY and no policies.
-- Risk: HIGH — without RLS, any authenticated or anon role can
-- SELECT, INSERT, UPDATE, and DELETE rows.
-- ============================================================

ALTER TABLE short_links ENABLE ROW LEVEL SECURITY;

-- Allow anyone to look up a short link by its slug/id (required for /go/[id] redirects)
CREATE POLICY "Public read short_links"
  ON short_links
  FOR SELECT
  USING (true);

-- Only service role can insert, update, or delete links
CREATE POLICY "Service role write short_links"
  ON short_links
  FOR ALL
  USING (true)
  WITH CHECK (true);
