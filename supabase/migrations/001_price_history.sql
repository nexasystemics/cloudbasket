-- Price history table for real-time price tracking
CREATE TABLE IF NOT EXISTS price_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  platform TEXT NOT NULL DEFAULT 'manual',
  recorded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_price_history_product_id ON price_history(product_id);
CREATE INDEX IF NOT EXISTS idx_price_history_recorded_at ON price_history(recorded_at DESC);

-- Row Level Security
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read price history" ON price_history FOR SELECT USING (true);
CREATE POLICY "Service role insert" ON price_history FOR INSERT WITH CHECK (true);