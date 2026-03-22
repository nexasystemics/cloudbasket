CREATE TABLE IF NOT EXISTS gift_cards (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  balance DECIMAL(10,2) NOT NULL,
  purchaser_email TEXT NOT NULL,
  recipient_email TEXT,
  message TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_gift_cards_code ON gift_cards(code);
ALTER TABLE gift_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON gift_cards FOR ALL USING (true);