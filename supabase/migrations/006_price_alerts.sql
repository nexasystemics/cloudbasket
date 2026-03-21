-- Price alerts
CREATE TABLE IF NOT EXISTS price_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  current_price DECIMAL(10,2) NOT NULL,
  target_price DECIMAL(10,2) NOT NULL,
  affiliate_url TEXT NOT NULL,
  platform TEXT NOT NULL,
  triggered BOOLEAN DEFAULT false,
  triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_price_alerts_triggered ON price_alerts(triggered, product_id);
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert alerts" ON price_alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role full access" ON price_alerts USING (true);