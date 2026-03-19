-- supabase/migrations/20260320000000_price_history.sql
-- Migration: Create price_history table for real-time tracking

CREATE TABLE IF NOT EXISTS price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  platform TEXT NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster product history lookups
CREATE INDEX IF NOT EXISTS idx_price_history_product_id ON price_history(product_id);
