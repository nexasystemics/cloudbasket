-- Revenue attribution clicks
CREATE TABLE IF NOT EXISTS attributed_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL,
  platform TEXT NOT NULL,
  price DECIMAL(10,2),
  estimated_commission DECIMAL(10,2),
  session_id TEXT,
  page_url TEXT,
  clicked_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attr_clicks_product ON attributed_clicks(product_id);
CREATE INDEX IF NOT EXISTS idx_attr_clicks_date ON attributed_clicks(clicked_at DESC);
ALTER TABLE attributed_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Insert only" ON attributed_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role read" ON attributed_clicks USING (true);