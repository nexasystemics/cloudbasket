-- WhatsApp subscribers
CREATE TABLE IF NOT EXISTS whatsapp_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  preferences JSONB DEFAULT '{"priceAlerts": true, "deals": true, "weeklyDigest": true}'::jsonb
);

ALTER TABLE whatsapp_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON whatsapp_subscribers USING (true);