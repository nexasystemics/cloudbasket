-- Sponsored listings campaigns
CREATE TABLE IF NOT EXISTS sponsored_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_name TEXT NOT NULL,
  product_ids TEXT[] NOT NULL,
  placement_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','active','paused','ended')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget DECIMAL(10,2),
  spent DECIMAL(10,2) DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sponsored_impressions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES sponsored_campaigns(id),
  product_id TEXT,
  placement TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE sponsored_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsored_impressions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access campaigns" ON sponsored_campaigns USING (true);
CREATE POLICY "Insert impressions" ON sponsored_impressions FOR INSERT WITH CHECK (true);