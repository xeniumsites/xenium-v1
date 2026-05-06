-- xenium_requests: payment + production columns
ALTER TABLE public.xenium_requests
  ADD COLUMN IF NOT EXISTS amount_paise INTEGER NOT NULL DEFAULT 75000,
  ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'INR',
  ADD COLUMN IF NOT EXISTS payment_link_id TEXT,
  ADD COLUMN IF NOT EXISTS payment_link_url TEXT,
  ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending','created','paid','cancelled','expired','failed','refunded','waived')),
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

CREATE OR REPLACE FUNCTION public.generate_short_code() RETURNS TEXT
LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INT;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, 1 + floor(random() * length(chars))::int, 1);
  END LOOP;
  RETURN 'XEN-' || result;
END$$;

CREATE OR REPLACE FUNCTION public.set_short_code() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public AS $$
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

UPDATE public.xenium_requests SET short_code = public.generate_short_code() WHERE short_code IS NULL;

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at := now(); RETURN NEW; END$$;

DROP TRIGGER IF EXISTS xenium_requests_touch_updated_at ON public.xenium_requests;
CREATE TRIGGER xenium_requests_touch_updated_at
  BEFORE UPDATE ON public.xenium_requests
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX IF NOT EXISTS idx_xenium_requests_short_code ON public.xenium_requests (short_code);
CREATE INDEX IF NOT EXISTS idx_xenium_requests_sender_email ON public.xenium_requests (lower(sender_email));
CREATE INDEX IF NOT EXISTS idx_xenium_requests_payment_status ON public.xenium_requests (payment_status);
CREATE INDEX IF NOT EXISTS idx_xenium_requests_production_status ON public.xenium_requests (production_status);
CREATE INDEX IF NOT EXISTS idx_xenium_requests_payment_link_id ON public.xenium_requests (payment_link_id);
CREATE INDEX IF NOT EXISTS idx_xenium_requests_created_at ON public.xenium_requests (created_at DESC);

-- admin_users
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read self" ON public.admin_users;
CREATE POLICY "Admins read self" ON public.admin_users
  FOR SELECT USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.is_admin(uid UUID) RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS(SELECT 1 FROM public.admin_users WHERE user_id = uid);
$$;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated, anon;

-- tracking_otps
CREATE TABLE IF NOT EXISTS public.tracking_otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.xenium_requests(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  attempts INT NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tracking_otps_request ON public.tracking_otps (request_id);
CREATE INDEX IF NOT EXISTS idx_tracking_otps_email ON public.tracking_otps (lower(email));
CREATE INDEX IF NOT EXISTS idx_tracking_otps_expires ON public.tracking_otps (expires_at);
ALTER TABLE public.tracking_otps ENABLE ROW LEVEL SECURITY;

-- xenium_requests admin policies
DROP POLICY IF EXISTS "Admins read all requests" ON public.xenium_requests;
CREATE POLICY "Admins read all requests" ON public.xenium_requests
  FOR SELECT USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins update all requests" ON public.xenium_requests;
CREATE POLICY "Admins update all requests" ON public.xenium_requests
  FOR UPDATE USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Create admin auth user (xeniumgifts@gmail.com / admin#1234) and link as admin
DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT := 'xeniumgifts@gmail.com';
  v_password TEXT := 'admin#1234';
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;
  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at, confirmation_token,
      email_change, email_change_token_new, recovery_token,
      raw_app_meta_data, raw_user_meta_data, is_super_admin
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_user_id, 'authenticated', 'authenticated',
      v_email, crypt(v_password, gen_salt('bf')),
      now(), now(), now(), '', '', '', '',
      '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false
    );
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
      'email', v_user_id::text, now(), now(), now());
  END IF;
  INSERT INTO public.admin_users (user_id, email, display_name)
  VALUES (v_user_id, v_email, 'Xenium Admin')
  ON CONFLICT (user_id) DO NOTHING;
END$$;