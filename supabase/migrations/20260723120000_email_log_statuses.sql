-- Widen email_send_log.status CHECK to include statuses the edge functions
-- actually write but the original constraint (20260503174728) omitted:
--   * 'rate_limited'  — process-email-queue logs this on a Resend 429 backoff.
--   * 'soft_bounced'  — handle-email-suppression logs transient (recoverable)
--                       bounces here WITHOUT adding the address to
--                       suppressed_emails (only permanent bounces suppress).
-- Without this, those inserts violate the CHECK constraint and are silently
-- dropped (the callers don't check the insert error), losing the audit trail.
DO $$
BEGIN
  ALTER TABLE public.email_send_log DROP CONSTRAINT IF EXISTS email_send_log_status_check;
  ALTER TABLE public.email_send_log ADD CONSTRAINT email_send_log_status_check
    CHECK (status IN (
      'pending', 'sent', 'suppressed', 'failed',
      'bounced', 'soft_bounced', 'complained', 'rate_limited', 'dlq'
    ));
END$$;
