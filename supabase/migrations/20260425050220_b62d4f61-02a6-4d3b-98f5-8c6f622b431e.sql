CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_session_id TEXT NOT NULL UNIQUE,
  stripe_payment_intent TEXT,
  stripe_customer_id TEXT,
  customer_email TEXT,
  price_id TEXT,
  product_id TEXT,
  amount_total INTEGER,
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'pending',
  environment TEXT NOT NULL DEFAULT 'sandbox',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_session_id ON public.orders(stripe_session_id);
CREATE INDEX idx_orders_email ON public.orders(customer_email);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Anyone can look up an order by its session id (used by the confirmation page).
CREATE POLICY "Public can read orders by session id"
  ON public.orders FOR SELECT
  USING (true);

-- Only the backend (service role) writes orders. No client-side inserts/updates.
CREATE POLICY "Service role manages orders"
  ON public.orders FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');