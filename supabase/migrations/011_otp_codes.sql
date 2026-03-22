CREATE TABLE IF NOT EXISTS otp_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL,
  code TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'email',
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_otp_identifier ON otp_codes(identifier, used, expires_at);
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON otp_codes FOR ALL USING (true);