CREATE TABLE IF NOT EXISTS email_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_email_subscribers_subscribed_at
  ON email_subscribers (subscribed_at DESC);

ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public insert email subscribers"
  ON email_subscribers
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role full access email subscribers"
  ON email_subscribers
  USING (true);
