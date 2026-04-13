-- ============================================================
-- Migration 018: RLS policies for price_history table
-- Created: 2026-04-13
-- IBF Note: Run in Supabase Dashboard > SQL Editor against production.
--           DO NOT run in this session — file creation only.
-- ============================================================
-- Context: price_history RLS was set in 001_price_history.sql, but
-- migration 20260320000000_price_history.sql re-creates the table
-- without repeating the RLS statements. In a fresh environment where
-- migrations run in timestamp order, RLS may be absent if 001 did not
-- execute before 20260320000000.
-- Risk: LOW in production (RLS already active from 001).
--       MEDIUM in fresh/staging environments (fresh migration order may skip 001).
-- Fix: Idempotent guards — ENABLE RLS is a no-op if already enabled;
--      policy creation is skipped if policies already exist.
-- ============================================================

-- Idempotent: no-op if RLS is already enabled on this table
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;

-- Create policies only if they do not already exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'price_history'
      AND policyname = 'Public read price history'
  ) THEN
    CREATE POLICY "Public read price history"
      ON price_history
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'price_history'
      AND policyname = 'Service role insert'
  ) THEN
    CREATE POLICY "Service role insert"
      ON price_history
      FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;
