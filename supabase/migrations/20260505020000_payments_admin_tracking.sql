-- =============================================================
-- Payments, admin auth and order tracking
-- =============================================================

-- ---------- xenium_requests: payment + production columns -----
ALTER TABLE public.xenium_requests
  ADD COLUMN IF NOT EXISTS amount_paise INTEGER NOT NULL DEFAULT 75000,
  ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'INR',
  ADD COLUMN IF NOT EXISTS payment_link_id TEXT,
  ADD COLUMN IF NOT EXISTS payment_link_url TEXT,
  ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'created', 'paid', 'cancelled', 'expired', 'failed', 'refunded', 'waived')),
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT,
  ADD COLUMN IF NOT EXISTS production_status TEXT NOT NULL DEFAULT 'awaiting_payment'
    CHECK (production_status IN ('awaiting_payment','queued','in_progress','review','revisions','delivered','cancelled')),
  ADD COLUMN IF NOT EXISTS delivery_url TEXT,
  ADD COLUMN IF NOT EXISTS admin_notes TEXT,
  ADD COLUMN IF NOT EXISTS is_manual BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS short_code TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS tracking_email_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- A short, friendly order code customers can quote (e.g. XEN-7K9P2A).
-- We can't depend on extensions in this migration, so we generate from the UUID.
CREATE OR REPLACE FUNCTION public.generate_short_code() RETURNS TEXT
LANGUAGE plpgsql AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; -- no 0/O/1/I/L confusion
  result TEXT := '';
  i INT;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, 1 + floor(random() * length(chars))::int, 1);
  END LOOP;
  RETURN 'XEN-' || result;
END$$;

CREATE OR REPLACE FUNCTION public.set_short_code() RETURNS TRIGGER
LANGUAGE plpgsql AS $$
DECLARE
  candidate TEXT;
  attempts INT := 0;
BEGIN
  IF NEW.short_code IS NULL THEN
    LOOP
      candidate := public.generate_short_code();
      EXIT WHEN NOT EXISTS (SELECT 1 FROM public.xenium_requests WHERE short_code = candidate);
      attempts := attempts + 1;
      IF attempts > 8 THEN EXIT; END IF;
    END LOOP;
    NEW.short_code := candidate;
  END IF;
  RETURN NEW;
END$$;

DROP TRIGGER IF EXISTS xenium_requests_set_short_code ON public.xenium_requests;
CREATE TRIGGER xenium_requests_set_short_code
  BEFORE INSERT ON public.xenium_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_short_code();

-- Backfill short codes for any pre-existing rows.
UPDATE public.xenium_requests
SET short_code = public.generate_short_code()
WHERE short_code IS NULL;

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at := now(); RETURN NEW; END$$;

DROP TRIGGER IF EXISTS xenium_requests_touch_updated_at ON public.xenium_requests;
CREATE TRIGGER xenium_requests_touch_updated_at
  BEFORE UPDATE ON public.xenium_requests
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Indexes that public lookup + admin views actually use.
CREATE INDEX IF NOT EXISTS idx_xenium_requests_short_code ON public.xenium_requests (short_code);
CREATE INDEX IF NOT EXISTS idx_xenium_requests_sender_email ON public.xenium_requests (lower(sender_email));
CREATE INDEX IF NOT EXISTS idx_xenium_requests_payment_status ON public.xenium_requests (payment_status);
CREATE INDEX IF NOT EXISTS idx_xenium_requests_production_status ON public.xenium_requests (production_status);
CREATE INDEX IF NOT EXISTS idx_xenium_requests_payment_link_id ON public.xenium_requests (payment_link_id);
CREATE INDEX IF NOT EXISTS idx_xenium_requests_created_at ON public.xenium_requests (created_at DESC);

-- ---------- admin_users (linked to auth.users) ----------------
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Admins can read their own row (so the app can confirm "am I admin?").
CREATE POLICY "Admins read self" ON public.admin_users
  FOR SELECT USING (auth.uid() = user_id);

-- Helper: is the calling JWT an admin?
CREATE OR REPLACE FUNCTION public.is_admin(uid UUID) RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS(SELECT 1 FROM public.admin_users WHERE user_id = uid);
$$;

GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated, anon;

-- ---------- tracking_otps (email-verification for /track) -----
CREATE TABLE IF NOT EXISTS public.tracking_otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.xenium_requests(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  code_hash TEXT NOT NULL, -- SHA-256 of 6-digit code; we never store the plaintext
  attempts INT NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tracking_otps_request ON public.tracking_otps (request_id);
CREATE INDEX IF NOT EXISTS idx_tracking_otps_email ON public.tracking_otps (lower(email));
CREATE INDEX IF NOT EXISTS idx_tracking_otps_expires ON public.tracking_otps (expires_at);

ALTER TABLE public.tracking_otps ENABLE ROW LEVEL SECURITY;
-- No public policies — only edge functions (service role) touch this table.

-- ---------- xenium_requests RLS additions ---------------------
-- Existing migration already enabled RLS and created an INSERT policy.
-- Add admin SELECT/UPDATE policies so authed admin clients can read/write.
DROP POLICY IF EXISTS "Admins read all requests" ON public.xenium_requests;
CREATE POLICY "Admins read all requests" ON public.xenium_requests
  FOR SELECT USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins update all requests" ON public.xenium_requests;
CREATE POLICY "Admins update all requests" ON public.xenium_requests
  FOR UPDATE USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- =============================================================
-- Notes for the operator (Pranav):
-- 1. After this runs, create your admin user via the Supabase
--    Dashboard → Authentication → Users → Add user (email + password).
--    Then INSERT INTO public.admin_users(user_id, email, display_name)
--    SELECT id, email, 'Admin' FROM auth.users WHERE email = 'you@you.com';
-- 2. Razorpay test keys are NOT stored in this migration — they go into
--    Supabase function secrets only. See README for setup.
-- =============================================================
