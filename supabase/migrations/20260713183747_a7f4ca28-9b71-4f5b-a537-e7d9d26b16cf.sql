
-- 1. Remove overly-permissive INSERT policy on xenium_requests.
-- Inserts are performed by edge functions using the service role, which bypasses RLS.
DROP POLICY IF EXISTS "Allow insert via service role" ON public.xenium_requests;

-- Explicit service-role INSERT policy for clarity (service_role bypasses RLS but this documents intent).
CREATE POLICY "Service role inserts requests"
  ON public.xenium_requests
  FOR INSERT
  TO public
  WITH CHECK (auth.role() = 'service_role');

-- 2. Admin visibility into email_send_state.
CREATE POLICY "Admins can read email send state"
  ON public.email_send_state
  FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- 3. Explicit service-role policy for tracking_otps.
CREATE POLICY "Service role manages tracking otps"
  ON public.tracking_otps
  FOR ALL
  TO public
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 4. Set immutable search_path on functions that lack one.
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public, pgmq;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public, pgmq;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public, pgmq;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public, pgmq;

-- 5. Revoke EXECUTE from anon/authenticated on SECURITY DEFINER functions that should
-- only be callable from the service role (cron/edge functions).
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_short_code() FROM PUBLIC, anon, authenticated;

-- email_queue_dispatch/email_queue_wake are provisioned separately (pg_cron
-- dispatch helpers). Guard the REVOKE so a fresh database — where they don't
-- exist yet — still applies this migration cleanly.
DO $$
BEGIN
  IF to_regprocedure('public.email_queue_dispatch()') IS NOT NULL THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.email_queue_dispatch() FROM PUBLIC, anon, authenticated';
  END IF;
  IF to_regprocedure('public.email_queue_wake()') IS NOT NULL THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.email_queue_wake() FROM PUBLIC, anon, authenticated';
  END IF;
END$$;

-- is_admin is used inside RLS policies — keep it callable by authenticated but not anon.
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated, service_role;
