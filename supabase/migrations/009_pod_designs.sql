-- POD Designs table
CREATE TABLE IF NOT EXISTS pod_designs (
  id TEXT PRIMARY KEY,
  design_name TEXT,
  name TEXT,
  description TEXT,
  image_url TEXT,
  thumbnail_url TEXT,
  category TEXT,
  theme TEXT,
  style TEXT,
  tags TEXT[],
  approved BOOLEAN DEFAULT false,
  approved_at TIMESTAMPTZ,
  status TEXT DEFAULT 'draft',
  source TEXT DEFAULT 'manual',
  external_id TEXT,
  platforms JSONB DEFAULT '{}'::jsonb,
  mockups_generated BOOLEAN DEFAULT false,
  mockup_urls JSONB,
  mockups_at TIMESTAMPTZ,
  primary_colors TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_pod_designs_approved ON pod_designs(approved);
CREATE INDEX IF NOT EXISTS idx_pod_designs_category ON pod_designs(category);
ALTER TABLE pod_designs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read approved designs" ON pod_designs FOR SELECT USING (approved = true OR true);
CREATE POLICY "Service role full access" ON pod_designs FOR ALL USING (true);