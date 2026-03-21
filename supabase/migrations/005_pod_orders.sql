-- POD orders
CREATE TABLE IF NOT EXISTS pod_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  items JSONB NOT NULL,
  shipping_address JSONB NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  gst_amount DECIMAL(10,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','paid','processing','shipped','delivered','cancelled','refunded')),
  fulfiller TEXT CHECK (fulfiller IN ('printify','printful','manual')),
  fulfiller_order_id TEXT,
  tracking_number TEXT,
  carrier TEXT,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pod_orders_status ON pod_orders(status);
ALTER TABLE pod_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON pod_orders USING (true);