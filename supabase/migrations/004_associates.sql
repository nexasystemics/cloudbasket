-- Associates program
CREATE TABLE IF NOT EXISTS associates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  website_url TEXT,
  tracking_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','suspended')),
  commission_rate DECIMAL(4,4) DEFAULT 0.03,
  platform_type TEXT,
  niche TEXT,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  total_clicks INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS associate_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  associate_id UUID REFERENCES associates(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  source_url TEXT,
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  converted BOOLEAN DEFAULT false,
  conversion_value DECIMAL(10,2)
);

ALTER TABLE associates ENABLE ROW LEVEL SECURITY;
ALTER TABLE associate_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public apply" ON associates FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role full access associates" ON associates USING (true);
CREATE POLICY "Service role full access clicks" ON associate_clicks USING (true);