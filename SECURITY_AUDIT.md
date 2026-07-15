# Security Audit — Xenium Gifts

Audit date: 2026-07-14. Scope: full repo (React/Vite frontend + Supabase Postgres/Deno edge functions + Razorpay payments), not a diff review. Findings are ranked by severity with exact file:line references, an exploit scenario, and a fix direction. Check off items as they're remediated.

---

## Critical

### [x] 1. `send-transactional-email` is a fully unauthenticated, unrestricted email-send endpoint — brand-impersonation phishing relay

**Fixed 2026-07-15**: `supabase/config.toml` now sets `verify_jwt = true` for this function, and `send-transactional-email/index.ts` requires an explicit `service_role` JWT claim (same pattern as `process-email-queue`), rejecting anything else with 403. Verified all 6 existing call sites (`submit-xenium-request` ×2, `track-order`, `razorpay-webhook`, `admin-orders` ×2) already authenticate with `SUPABASE_SERVICE_ROLE_KEY`, so no legitimate flow breaks. **Requires `supabase functions deploy send-transactional-email` to take effect in production.**

- **Where**: `supabase/config.toml` → `[functions.send-transactional-email] verify_jwt = false`. No in-function auth check anywhere in `supabase/functions/send-transactional-email/index.ts`. A comment at `index.ts:33-35` incorrectly claims `verify_jwt = true` protects it — the config actually sets it to `false`, and no in-code check exists.
- **Exploit**: Anyone can `POST` directly to `https://jrdzsftxhhwaumhubzkf.supabase.co/functions/v1/send-transactional-email` with `{templateName: "customer-payment-link", recipientEmail: "<any victim>", templateData: {paymentLinkUrl: "<attacker phishing URL>", trackUrl: "<attacker URL>", senderName, occasion, shortCode, amount}}`. Four of five registered templates (`customer-payment-link`, `payment-confirmed`, `order-status-update`, `tracking-otp`) have no fixed `to` in `registry.ts`, so `recipientEmail` is fully attacker-controlled. In `customer-payment-link.tsx:39,68,73` the `paymentLinkUrl`/`trackUrl` render as clickable buttons/links with no validation. Result: a real, domain-verified "Your Xenium order XEN-XXXXXX — secure payment link inside" email lands in any inbox with a "Pay ₹750 securely" button pointing anywhere the attacker wants. Also a free spam/cost-abuse relay against the email API.
- **Fix**: Set `verify_jwt = true` in `config.toml` and add the same `claims.role === 'service_role'` check already used correctly in `process-email-queue/index.ts:107`. This function should only ever be invoked server-to-server.

---

## High

### [x] 2. `submit-xenium-request` — no rate limiting, honeypot never checked server-side

- **Where**: `supabase/functions/submit-xenium-request/index.ts` (whole file). Validation is minimal (required-fields + email regex, lines 22-34). The `website` honeypot field defined client-side in `src/lib/validation.ts:85` is never checked server-side. No IP/rate limiting anywhere (contrast with `xenium-chat/index.ts:64-79`, which has one).
- **Exploit**: A bot posting directly to the function (bypassing the client form entirely) can submit unlimited requests. Each call inserts a DB row, fires a real Razorpay `createPaymentLink` API call, and emails both the attacker-chosen `senderEmail` and the admin inbox (`xeniumgifts@gmail.com`). Usable to spam arbitrary victims with real Xenium payment-link emails, flood the admin inbox, burn Razorpay API calls, and pollute `xenium_requests`.
- **Fix**: Add IP-based rate limiting; re-check the honeypot field server-side.
- **Fixed 2026-07-15**: Added an in-memory per-IP rate limit (5 requests / 10 minutes, same best-effort pattern as `xenium-chat`) and a server-side honeypot check — if `website` arrives non-empty (the real form always strips it before sending, so this only happens when something posts to the endpoint directly), the function returns a fake success response without touching the DB, Razorpay, or email. **Requires `supabase functions deploy submit-xenium-request` to take effect in production.**

---

## Medium

### [ ] 3. `create-payment-link` — ownership check is optional, not mandatory

- **Where**: `supabase/functions/create-payment-link/index.ts:52-54` — `if (senderEmail && senderEmail !== row.sender_email.toLowerCase()) return json(403, ...)`.
- **Exploit**: Omitting `senderEmail` entirely skips the check, returning/creating a live payment link and payment status for *any* `requestId` (matched only by raw UUID at line 41). Not practically exploitable today since UUIDv4s aren't guessable and nothing currently leaks other users' UUIDs, but it's a latent bug — one log line, analytics event, or Referer header leak away from being exploitable.
- **Fix**: Make `senderEmail` required, not conditional.

### [ ] 4. Confirm the RLS-hardening migration is actually deployed to production

- **Where**: `supabase/migrations/20260713183747_a7f4ca28-9b71-4f5b-a537-e7d9d26b16cf.sql:2-11` fixes a previously critical hole: the original `xenium_requests` INSERT policy (`supabase/migrations/20260408181348_...sql:20-21`, `WITH CHECK (true)`, no `TO` clause) defaulted to role `PUBLIC` — the anon key could insert arbitrary rows directly via PostgREST, including self-setting `payment_status='paid'` without ever paying.
- **Exploit**: If `20260713183747` has not actually been `supabase db push`'d to the live project (it isn't mentioned in `OPERATOR_RUNBOOK.md`, which only documents the earlier `20260505020000` migration), the original hole is still open in production right now.
- **Fix**: **Verify directly against the live Supabase project** — run `supabase db diff` or check `information_schema` for the current INSERT policy on `xenium_requests`. This cannot be confirmed from source alone.

### [ ] 5. No rate limiting on `track-order` / `check-payment-status` when `TRACK_REQUIRE_OTP=false` (the documented default)

- **Where**: The OTP request limiter (`track-order/index.ts:11,69-78`, 5/hour) and OTP brute-force limiter (`verify-tracking-otp/index.ts:7,68-70`, 6 attempts) only engage when `TRACK_REQUIRE_OTP=true`. `.env.example:26-28` documents the default as `false`.
- **Exploit**: With the default, `track-order`/`check-payment-status` have zero throttling on (short_code, email) guesses. Short codes are 6 chars from a 31-char alphabet (~887M combinations per `20260505020000_...sql:29`), so blind brute force is impractical — but an attacker who already has a target's email (e.g. from another breach) can script unlimited lookup attempts to confirm and pull that person's private delivery link. Real surprise-spoiling risk for proposals/memorials specifically, beyond generic data exposure.
- **Fix**: Add IP-based throttling to `track-order`/`check-payment-status` independent of the OTP toggle, or default `TRACK_REQUIRE_OTP` to `true`.

---

## Low

### [ ] 6. Wildcard CORS on every function

- **Where**: `Access-Control-Allow-Origin: '*'` in `supabase/functions/_shared/http.ts:4`, duplicated inline in several functions (e.g. `submit-xenium-request/index.ts:5-8`), applies even to `admin-orders`.
- **Impact**: Low — all auth here is Bearer-token-in-header, not cookies, so this isn't classically CSRF-exploitable (a malicious site can't make a browser auto-attach an admin's token). Hygiene/defense-in-depth only.
- **Fix**: Restrict to `https://xenium-sites.com`.

### [ ] 7. PostgREST filter injection via unescaped `search` param in `admin-orders`

- **Where**: `supabase/functions/admin-orders/index.ts:114-124` — `search` is string-interpolated directly into a `.or()` filter (`short_code.ilike.%${search}%,...`).
- **Impact**: Low — only reachable by already-authenticated admins with full table access via the service-role client anyway, so no privilege escalation. A value containing `,`, `(`, `)`, or `.` could break the intended filter syntax or produce unintended query logic.
- **Fix**: Sanitize/escape before interpolating.

### [ ] 8. `.env` is git-tracked with no `.gitignore` guardrail

- **Where**: `.gitignore` has no `.env` entry; `git log --all -- .env` shows 3 commits.
- **Impact**: Low today — current tracked content is limited to the public anon key + project ref/URL, consistent with the project's stated practice. No secret found in history via grep. But there's no technical guardrail stopping a future commit from accidentally adding a service-role or Razorpay secret to this same file.
- **Fix**: Add `.env` to `.gitignore`; keep `.env.example` tracked.

### [ ] 9. `xenium-chat`'s rate limiter is in-memory per-isolate

- **Where**: `xenium-chat/index.ts:65-79` — a plain `Map`.
- **Impact**: Deno edge functions can scale across multiple concurrent instances, each with its own map, so the nominal 20 req/min/IP cap doesn't hold under real concurrency. Modest AI Gateway cost-abuse exposure, not a data risk.
- **Fix**: Move the limiter to a shared store (e.g. a Postgres table or Deno KV) if chat abuse becomes a real cost concern.

---

## Checked and found clean

- Razorpay webhook HMAC verification (`_shared/razorpay.ts:114-134`) — constant-time compare, fails closed when the secret is unset, idempotent on `payment_link.paid`.
- `admin-orders` mass-assignment — `update` is allowlisted to 5 safe fields (`ALLOWED_FIELDS`, line 151-157); every action routes through `authenticate()` before the action switch.
- `admin_users` RLS — self-row-only SELECT policy; anon gets zero rows; non-admin authenticated users can't see other admins' rows. `src/hooks/useAdminAuth.ts`'s client-side query is safe by construction.
- `xenium_requests` RLS — no SELECT/UPDATE/DELETE policy for anon or plain `authenticated` at any point in migration history; only admin-gated policies exist.
- `process-email-queue` — correctly layers an explicit `role === 'service_role'` JWT-claim check on top of `verify_jwt=true` (the pattern #1 above is missing).
- `handle-email-suppression` — HMAC-signature-verified webhook via the Lovable webhooks library.
- Email unsubscribe tokens — `crypto.getRandomValues`-backed 32-byte hex, unique per email, not guessable (`send-transactional-email/index.ts:25-31`).
- No `dangerouslySetInnerHTML` or raw-HTML injection of user-controlled data anywhere in email templates or client components.
- `get-public-stats` — single aggregate `COUNT`, no per-customer leakage.
- No hardcoded live/test secrets in tracked source (grepped for `rzp_live_`, `rzp_test_`, `sk_`, `service_role`, raw JWTs) beyond the intentionally-public anon key.
- `submit-xenium-request`'s `amount_paise` is always server-set from `XENIUM_DEFAULT_AMOUNT_PAISE`, never trusts a client-supplied amount.

---

## Suggested remediation order

1. **#1** (critical, small fix — mirror the existing `process-email-queue` pattern)
2. **#4** (medium, but potentially already critical in production — verify first, this is a 5-minute check)
3. **#2** (high, moderate fix — add rate limiting + server-side honeypot check)
4. **#5** (medium, moderate fix)
5. **#3, #6, #7, #8, #9** (low/medium, cheap fixes — batch together)
