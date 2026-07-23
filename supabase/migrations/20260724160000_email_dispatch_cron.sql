-- Email dispatch cron.
--
-- The transactional email queue (pgmq) is not self-draining — something must
-- invoke the process-email-queue edge function on a schedule. This sets up a
-- pg_cron job that does exactly that, reading the service-role key + project
-- URL from Supabase Vault (NEVER hardcoded).
--
-- ONE-TIME SETUP (run out-of-band, do NOT commit — needs your service-role key
-- from Dashboard → Settings → API):
--
--   select vault.create_secret(
--     'https://qhbpxctyequhjbeogofi.supabase.co', 'project_url',
--     'Base URL for edge-function calls from pg_cron');
--   select vault.create_secret(
--     '<YOUR-SERVICE-ROLE-KEY>', 'service_role_key',
--     'Service role key used by email_queue_dispatch');
--
-- Until both secrets exist the job runs every minute but no-ops (logs a notice).

create extension if not exists pg_cron;
create extension if not exists pg_net;

create or replace function public.email_queue_dispatch()
returns void
language plpgsql
security definer
set search_path = public, net, vault
as $$
declare
  v_url text;
  v_key text;
begin
  select decrypted_secret into v_url from vault.decrypted_secrets where name = 'project_url' limit 1;
  select decrypted_secret into v_key from vault.decrypted_secrets where name = 'service_role_key' limit 1;
  if v_url is null or v_key is null then
    raise notice 'email_queue_dispatch: project_url/service_role_key not set in Vault; skipping';
    return;
  end if;
  perform net.http_post(
    url := v_url || '/functions/v1/process-email-queue',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || v_key
    ),
    body := '{}'::jsonb
  );
end;
$$;

-- Only the service role / cron should ever call this (it wields the key).
revoke execute on function public.email_queue_dispatch() from public, anon, authenticated;

-- Schedule it every minute (idempotent).
do $$
begin
  if exists (select 1 from cron.job where jobname = 'email-queue-dispatch') then
    perform cron.unschedule('email-queue-dispatch');
  end if;
  perform cron.schedule('email-queue-dispatch', '* * * * *', 'select public.email_queue_dispatch();');
end$$;
