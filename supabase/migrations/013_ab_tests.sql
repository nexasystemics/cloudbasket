-- A/B test assignments and event tracking
CREATE TABLE IF NOT EXISTS ab_tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  experiment_id TEXT NOT NULL,
  variant_name TEXT NOT NULL,
  user_id TEXT NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  converted BOOLEAN DEFAULT false,
  converted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_ab_tests_user ON ab_tests(user_id, experiment_id);
CREATE INDEX IF NOT EXISTS idx_ab_tests_experiment ON ab_tests(experiment_id, variant_name, assigned_at DESC);

ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own assignments" ON ab_tests FOR SELECT USING (true);
CREATE POLICY "Service role write" ON ab_tests FOR ALL USING (true);

-- A/B test event stream (impressions, clicks, conversions)
CREATE TABLE IF NOT EXISTS ab_test_events (
  event_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  experiment_id TEXT NOT NULL,
  variant TEXT NOT NULL,
  event_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ab_events_experiment ON ab_test_events(experiment_id, event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ab_events_created ON ab_test_events(created_at DESC);

ALTER TABLE ab_test_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Insert only" ON ab_test_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role read" ON ab_test_events USING (true);
