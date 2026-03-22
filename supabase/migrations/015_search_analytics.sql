CREATE TABLE IF NOT EXISTS search_queries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  query TEXT NOT NULL,
  results_count INTEGER DEFAULT 0,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_search_query ON search_queries(query, created_at DESC);
CREATE TABLE IF NOT EXISTS pod_bundles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  bundle_price DECIMAL(10,2),
  original_total DECIMAL(10,2),
  savings DECIMAL(10,2),
  savings_percent INTEGER,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS pod_artists (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  portfolio_url TEXT,
  commission_rate DECIMAL(4,2) DEFAULT 0.15,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  pending_payout DECIMAL(10,2) DEFAULT 0,
  referral_code TEXT UNIQUE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS pod_commissions (
  id TEXT PRIMARY KEY,
  artist_id TEXT REFERENCES pod_artists(id),
  order_id TEXT,
  amount DECIMAL(10,2),
  rate DECIMAL(4,2),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS b2b_quotes (
  id TEXT PRIMARY KEY,
  company_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  gst_number TEXT,
  product_type TEXT,
  quantity INTEGER,
  design_description TEXT,
  delivery_deadline TEXT,
  unit_price DECIMAL(10,2),
  total_price DECIMAL(10,2),
  gst_amount DECIMAL(10,2),
  grand_total DECIMAL(10,2),
  valid_until TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS competitor_alerts (
  id TEXT PRIMARY KEY,
  keyword TEXT,
  our_price DECIMAL(10,2),
  competitor_price DECIMAL(10,2),
  competitor_name TEXT,
  price_diff DECIMAL(10,2),
  price_diff_percent INTEGER,
  alert_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE search_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE pod_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pod_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE pod_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role all" ON search_queries FOR ALL USING (true);
CREATE POLICY "Service role all" ON pod_bundles FOR ALL USING (true);
CREATE POLICY "Service role all" ON pod_artists FOR ALL USING (true);
CREATE POLICY "Service role all" ON pod_commissions FOR ALL USING (true);
CREATE POLICY "Service role all" ON b2b_quotes FOR ALL USING (true);
CREATE POLICY "Service role all" ON competitor_alerts FOR ALL USING (true);