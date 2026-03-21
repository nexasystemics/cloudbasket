-- Printify blueprints cache
CREATE TABLE IF NOT EXISTS printify_blueprints (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  brand TEXT,
  model TEXT,
  base_cost_min DECIMAL(10,2),
  base_cost_max DECIMAL(10,2),
  synced_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE printify_blueprints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read blueprints" ON printify_blueprints FOR SELECT USING (true);
CREATE POLICY "Service role write" ON printify_blueprints FOR ALL USING (true);