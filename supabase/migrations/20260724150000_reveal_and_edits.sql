-- Timed-reveal delivery (embed URL gated behind a countdown + password) and
-- post-delivery edit requests.

-- 1. Reveal fields on the order.
--    delivery_url continues to hold the RAW external embed URL (admin-set) but
--    is no longer returned to public clients — it is released only by the
--    reveal-order edge function after the timer passes and the password matches.
alter table public.xenium_requests
  add column if not exists reveal_at      timestamptz,
  add column if not exists reveal_password text,
  add column if not exists reveal_token   text,
  add column if not exists preview_token  text,
  add column if not exists delivered_at   timestamptz;

create unique index if not exists idx_xenium_requests_reveal_token
  on public.xenium_requests (reveal_token) where reveal_token is not null;
create unique index if not exists idx_xenium_requests_preview_token
  on public.xenium_requests (preview_token) where preview_token is not null;

-- 2. Edit requests — a customer can request changes within 24h of delivery.
create table if not exists public.order_edit_requests (
  id         uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.xenium_requests(id) on delete cascade,
  message    text not null,
  status     text not null default 'open' check (status in ('open', 'resolved')),
  created_at timestamptz not null default now()
);
create index if not exists idx_order_edit_requests_request on public.order_edit_requests (request_id);
alter table public.order_edit_requests enable row level security;

-- Admins read (via authenticated + is_admin); edge functions manage via service role.
drop policy if exists "Admins read edit requests" on public.order_edit_requests;
create policy "Admins read edit requests" on public.order_edit_requests
  for select to authenticated using (public.is_admin(auth.uid()));

drop policy if exists "Service role manages edit requests" on public.order_edit_requests;
create policy "Service role manages edit requests" on public.order_edit_requests
  for all to public using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
