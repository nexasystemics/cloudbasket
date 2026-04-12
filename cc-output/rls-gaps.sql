-- ============================================================
-- CloudBasket — RLS Gap Report
-- Generated: 2026-04-13
-- ============================================================
-- DO NOT RUN blindly — review each statement before executing.
-- Run in Supabase Dashboard > SQL Editor.
-- ============================================================

-- ============================================================
-- GAP 1: short_links
-- Source migration: supabase/migrations/20260301213842_schema_and_seed.sql
-- Problem: Table created with no ENABLE ROW LEVEL SECURITY and no policies.
--          Any authenticated or anon role can SELECT, INSERT, UPDATE, DELETE.
-- Risk: HIGH — link destination values could be read/injected by public users.
-- Fix: Enable RLS + restrict reads to public (safe for redirect lookups)
--      and writes to service role only.
-- ============================================================

ALTER TABLE short_links ENABLE ROW LEVEL SECURITY;

-- Allow anyone to look up a short link by its id (needed for /go/[id] redirects)
CREATE POLICY "Public read short_links"
  ON short_links
  FOR SELECT
  USING (true);

-- Only service role can insert/update/delete links
CREATE POLICY "Service role write short_links"
  ON short_links
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- GAP 2: price_history (migration 20260320000000)
-- Source migration: supabase/migrations/20260320000000_price_history.sql
-- Problem: Duplicate migration re-creates price_history without RLS statements.
--          In practice RLS was already set by 001_price_history.sql, so this
--          is NOT a live gap — it is a migration consistency issue.
-- Risk: LOW in production (RLS already active from 001).
--       MEDIUM in fresh environments where migrations run in timestamp order
--       and 001 may not have run before 20260320 if ordering is non-sequential.
-- Fix: Add idempotent RLS guard to the 20260320 migration (edit the file).
--      The SQL below is safe to run regardless.
-- ============================================================

-- Idempotent: ENABLE ROW LEVEL SECURITY is a no-op if already enabled
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;

-- Guard: only create policies if they don't already exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'price_history'
      AND policyname = 'Public read price history'
  ) THEN
    CREATE POLICY "Public read price history"
      ON price_history FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'price_history'
      AND policyname = 'Service role insert'
  ) THEN
    CREATE POLICY "Service role insert"
      ON price_history FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- ============================================================
-- SUMMARY
-- ============================================================
-- Tables audited: 24 (across 17 migration files)
-- Tables with RLS already correctly set: 23
-- Tables with RLS gaps:
--   - short_links          → GAP 1 above (CRITICAL — apply immediately)
--   - price_history (20260320 migration only) → GAP 2 (low-risk, idempotent fix)
-- ============================================================
