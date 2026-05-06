# Xenium — Operator Runbook

End-to-end checklist to wire payments, the public order tracker, and the admin panel. Copy-paste everything; nothing here is meant to be improvised. Everything in this guide is a one-time operation unless flagged "ongoing".

> **Existing project info already in `.env`**
> - Supabase project ref: `jrdzsftxhhwaumhubzkf`
> - Supabase URL: `https://jrdzsftxhhwaumhubzkf.supabase.co`
> - Anon key: present in `.env` (used by the frontend; safe to ship)
> - Service-role key: NOT in `.env` — this is correct. Get it from the Supabase dashboard only when you need it.

---

## Pre-flight checklist

Tick these off as you go.

- [ ] **Step 0**  Tools installed (Node 18+, Supabase CLI, OpenSSL or PowerShell)
- [ ] **Step 1**  Razorpay account active and KYC started
- [ ] **Step 2**  Razorpay test API keys generated and **rotated** (the pair shared in chat is burned)
- [ ] **Step 3**  Webhook secret generated (random 32+ char string)
- [ ] **Step 4**  Supabase CLI logged in and project linked
- [ ] **Step 5**  Database migration applied
- [ ] **Step 6**  Edge function secrets set
- [ ] **Step 7**  All edge functions deployed
- [ ] **Step 8**  Razorpay webhook configured and verified
- [ ] **Step 9**  Admin user created (`xeniumgifts@gmail.com`)
- [ ] **Step 10** End-to-end test passed (form → pay → webhook → admin sees paid)
- [ ] **Step 11** Production checklist (only when ready to take real money)

---

## Step 0 · Install required tools

### Node 18+

Already installed if `npm install` worked. Confirm:

```bash
node --version    # should print v18 or higher
npm --version
```

### Supabase CLI

Pick one method:

```bash
# npm (recommended; works everywhere)
npm install -g supabase

# OR via scoop on Windows
scoop install supabase

# OR via Homebrew on macOS / Linux
brew install supabase/tap/supabase
```

Confirm:

```bash
supabase --version    # any 1.x or 2.x is fine
```

### OpenSSL or PowerShell (just to generate one random secret in Step 3)

You almost certainly already have either. Test:

```bash
openssl rand -hex 32
# OR on PowerShell:
[Convert]::ToBase64String([byte[]]@(1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

---

## Step 1 · Razorpay account

### 1.1 Sign up

If you don't already have an account:

1. Go to <https://dashboard.razorpay.com/signup>.
2. Sign up with `xeniumgifts@gmail.com` (so the dashboard, KYC mails and payment alerts all live in the same inbox).
3. Verify the email link Razorpay sends you.

### 1.2 Start KYC (so you can go live later)

Razorpay supports two account types:
- **Sole proprietor / individual** — what you want. PAN + Aadhaar + cancelled cheque or bank statement.
- Registered company — only if Xenium is incorporated.

Submit at **Account Settings → KYC** and start the proprietor flow. KYC verification is usually 1–3 business days. You can fully test in test mode while waiting.

### 1.3 Settlement bank account

**Account Settings → Banking & Settlements → Add Bank Account**. The bank you settle into needs to be in your name (or your business's). Settlement is T+2 in India.

You can keep working in test mode without this. You only need it set when you switch on live mode.

### 1.4 Pricing

Default Razorpay pricing for sole-proprietor: **2% + GST** for cards / netbanking, **2%** for UPI (sometimes free for UPI <₹2000 — check current pricing on dashboard). On a ₹750 sale, expect ~₹15–18 fees.

---

## Step 2 · Get / rotate Razorpay test API keys

> **The test keys you pasted in chat earlier are burned**. Anyone who saw the message can use them. Generate a fresh pair.

1. Top-right of Razorpay dashboard → switch to **Test Mode** (toggle).
2. Sidebar → **Account & Settings → API Keys** (under "Website and app settings").
3. Click **Regenerate Test Key** → confirm. Razorpay will void the previous test pair and show you a new one **once**.
4. Copy both:
   - Key ID — looks like `rzp_test_xxxxxxxxxxxxxxxx`
   - Key Secret — random alphanumeric, ~24 chars
5. Stash them in your password manager. We'll paste them into Supabase secrets in Step 6.

> **Don't commit them**. They go into Supabase function secrets only. The repo's `.env` only holds the public anon key.

---

## Step 3 · Generate the webhook secret

This is **separate** from the API key secret. It's a random string you choose and Razorpay will use to HMAC-sign every webhook so our function can verify it really came from Razorpay.

Pick one (any will do):

```bash
# OpenSSL (Linux / macOS / Git Bash on Windows)
openssl rand -hex 32

# PowerShell
[Convert]::ToBase64String([byte[]]@(1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Node
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

You'll get something like `a3c7…2f1b`. Save it; you'll paste this exact string into both Supabase (Step 6) and Razorpay (Step 8).

---

## Step 4 · Supabase CLI: login + link

Run from the project root:

```bash
cd "C:/Users/PRANAV/Downloads/Upwork/Xenium/xeniumgifts-main"

# Opens a browser; sign in with the email tied to the Supabase project.
supabase login

# One-time: bind this folder to the project.
supabase link --project-ref jrdzsftxhhwaumhubzkf
```

If `supabase link` asks for the **database password**, that's the postgres password set when the project was provisioned. Find it in Supabase dashboard → **Project Settings → Database → Database password** (Reset if you've lost it).

---

## Step 5 · Apply the database migration

This adds payment / production columns, the `admin_users` table, and the `tracking_otps` table.

### Option A — CLI (preferred)

```bash
supabase db push
```

You should see `Migration 20260505020000_payments_admin_tracking applied`. Verify with:

```bash
supabase db diff   # should print no differences
```

### Option B — Dashboard

If the CLI gives you trouble, open Supabase dashboard → **SQL editor → New query** → paste the contents of:

```
supabase/migrations/20260505020000_payments_admin_tracking.sql
```

… click **Run**. Confirm success in the result panel.

### Verify the migration

In the SQL editor:

```sql
-- Should return 9 columns including amount_paise, payment_link_id, payment_status etc.
SELECT column_name FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'xenium_requests'
ORDER BY ordinal_position;

-- Should both exist
SELECT to_regclass('public.admin_users'), to_regclass('public.tracking_otps');

-- Verify the helper function
SELECT public.is_admin('00000000-0000-0000-0000-000000000000'::uuid);  -- should return false
```

---

## Step 6 · Set Supabase Edge Function secrets

This is where the Razorpay keys live. They are **never** committed to the repo and **never** ship to the browser.

### Option A — CLI

```bash
supabase secrets set \
  RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx \
  RAZORPAY_KEY_SECRET=replace-with-the-secret-from-step-2 \
  RAZORPAY_WEBHOOK_SECRET=replace-with-the-string-from-step-3 \
  PUBLIC_SITE_URL=https://xenium-sites.com \
  XENIUM_DEFAULT_AMOUNT_PAISE=75000 \
  TRACK_REQUIRE_OTP=false
```

(On PowerShell, escape line breaks with backtick `` ` `` instead of `\` or just put the whole command on one line.)

### Option B — Dashboard

Supabase dashboard → **Project Settings → Edge Functions → Secrets** (also visible from the Edge Functions tab → "Manage secrets"). Add each row:

| Name | Value |
| --- | --- |
| `RAZORPAY_KEY_ID` | from Step 2 — `rzp_test_…` |
| `RAZORPAY_KEY_SECRET` | from Step 2 — the long alphanumeric |
| `RAZORPAY_WEBHOOK_SECRET` | from Step 3 — the random hex string |
| `PUBLIC_SITE_URL` | `https://xenium-sites.com` (or your staging domain) |
| `XENIUM_DEFAULT_AMOUNT_PAISE` | `75000` (= ₹750) |
| `TRACK_REQUIRE_OTP` | `false` |

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are auto-injected by Supabase — do NOT add them manually.

### Verify

```bash
supabase secrets list
```

You should see all six names. Values are hidden — that's expected.

---

## Step 7 · Deploy the edge functions

Eight functions in total — six new, two updated. Deploy them all in one shot:

```bash
supabase functions deploy create-payment-link \
                          razorpay-webhook \
                          check-payment-status \
                          track-order \
                          verify-tracking-otp \
                          admin-orders \
                          submit-xenium-request \
                          send-transactional-email
```

Or one-at-a-time if you want to see logs cleanly:

```bash
supabase functions deploy create-payment-link
supabase functions deploy razorpay-webhook
supabase functions deploy check-payment-status
supabase functions deploy track-order
supabase functions deploy verify-tracking-otp
supabase functions deploy admin-orders
supabase functions deploy submit-xenium-request
supabase functions deploy send-transactional-email
```

### Smoke-test deployment

Hit the public webhook URL (it should reject without signature):

```bash
curl -i https://jrdzsftxhhwaumhubzkf.supabase.co/functions/v1/razorpay-webhook \
  -X POST -H "Content-Type: application/json" -d '{}'
# Expect: HTTP 401 invalid_signature  → good, function is live
```

Hit the public lookup endpoint with junk:

```bash
curl -s https://jrdzsftxhhwaumhubzkf.supabase.co/functions/v1/track-order \
  -X POST -H "Content-Type: application/json" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -d '{"code":"NOPE","email":"nope@nope.com"}'
# Expect: {"error":"not_found"}  → good
```

(`$SUPABASE_ANON_KEY` is the publishable key already in `.env`; bash users can set it with
`export SUPABASE_ANON_KEY=$(grep VITE_SUPABASE_PUBLISHABLE_KEY .env | cut -d'=' -f2 | tr -d '"')`.)

---

## Step 8 · Configure the Razorpay webhook

1. Razorpay dashboard (still in **Test mode**) → **Account & Settings → Webhooks**.
2. Click **+ Add new webhook**.
3. Fill in:
   - **Webhook URL**: `https://jrdzsftxhhwaumhubzkf.supabase.co/functions/v1/razorpay-webhook`
   - **Secret**: paste the same value you stored as `RAZORPAY_WEBHOOK_SECRET` in Step 6
   - **Active Events** — tick:
     - `payment_link.paid`
     - `payment_link.cancelled`
     - `payment_link.expired`
     - `payment.failed` (optional, informational)
   - **Alert Email**: `xeniumgifts@gmail.com`
4. Click **Create Webhook**.
5. From the same page, click **⋯ → Send test event** on any of the subscribed events. Open Supabase dashboard → **Edge Functions → razorpay-webhook → Logs**; you should see a 200 OK invocation within seconds.

If you see a 401 in the logs, the webhook secret on either side is wrong — re-paste both, redeploy the function (`supabase functions deploy razorpay-webhook`), and try again.

---

## Step 9 · Create the admin user

### 9.1 Auth user

Supabase dashboard → **Authentication → Users → Add user → Create new user**:

- **Email**: `xeniumgifts@gmail.com`
- **Password**: pick a strong one (12+ chars, mixed). Save in your password manager.
- **Auto Confirm User**: ✅ tick (so they can sign in immediately without email verification)

Click **Create user**. The user is now in `auth.users`.

### 9.2 Promote to admin

Open Supabase dashboard → **SQL editor → New query** → paste:

```sql
INSERT INTO public.admin_users (user_id, email, display_name)
SELECT id, email, 'Xenium Admin'
FROM auth.users
WHERE email = 'xeniumgifts@gmail.com'
ON CONFLICT (user_id) DO NOTHING;

-- Verify
SELECT u.email, a.display_name, a.created_at
FROM public.admin_users a
JOIN auth.users u ON u.id = a.user_id;
```

You should see one row returned. If there are zero rows, the auth user wasn't created — repeat 9.1.

### 9.3 Test sign-in

Local:
```
http://localhost:8080/admin/login
```

Production (after deploy):
```
https://xenium-sites.com/admin/login
```

Sign in with `xeniumgifts@gmail.com` and the password you set. You should land on the dashboard at `/admin`.

If you land on `/admin/login` again or get "not admin", the `admin_users` insert didn't take — re-run 9.2.

---

## Step 10 · End-to-end test

Run the full happy path on **localhost** before pointing at production.

### 10.1 Start the dev server

```bash
npm run dev    # http://localhost:8080
```

### 10.2 Submit a fake order

1. Open <http://localhost:8080/#create>.
2. Walk through the 5-step form. Use a real email you can read (e.g. `xeniumgifts@gmail.com`).
3. Click **Submit Request**.
4. Confirmation panel should show:
   - Order ID `XEN-XXXXXX`
   - "Pay ₹750 securely" button
   - "Track this order" button
5. Inbox should receive the **Customer payment link** email with the same order ID and link.
6. Admin email should receive **New Xenium request** with payment link reference.

### 10.3 Pay in test mode

Click **Pay ₹750 securely**. On Razorpay's hosted page, use any of these:

| Method | Test value |
| --- | --- |
| Card | `4111 1111 1111 1111`, expiry `12/30`, CVV `123`, 3-D Secure password `1234` |
| UPI | `success@razorpay` (auto-success) or `failure@razorpay` |
| Netbanking | Pick any bank → "Success" |

After "Payment successful", Razorpay redirects to `/track/XEN-XXXXXX?paid=1`.

### 10.4 Verify the webhook fired

The tracking page should flip to **Paid** within ~5–10 seconds. If it stays "Awaiting payment":

- Click **Refresh** on the tracking page (calls the polling fallback)
- Open Supabase dashboard → **Edge Functions → razorpay-webhook → Logs** and confirm a 200 invocation
- If no invocation appeared, the webhook URL is wrong, the secret is wrong, or the function isn't deployed — go back to Step 8.

### 10.5 Verify the email + admin

- Inbox should now have **Payment received** email.
- Sign in to `/admin`. The order should be visible with payment_status = paid.
- Click into the order → change "Production status" to `in_progress` → tick **Email the customer about this status change** → **Save**. The customer should receive **Order status update** email.

If all four steps pass, the integration is working.

---

## Step 11 · Going live (only when KYC is approved)

1. Razorpay dashboard → **Settings → Activate Account** → confirm KYC is green.
2. Toggle dashboard to **Live mode**.
3. **Settings → API Keys → Generate Live Key**. Copy the new live `rzp_live_…` ID + secret.
4. **Settings → Webhooks** (still in Live mode) → add the same webhook URL and a fresh secret.
5. Update Supabase secrets:
   ```bash
   supabase secrets set \
     RAZORPAY_KEY_ID=rzp_live_xxx \
     RAZORPAY_KEY_SECRET=xxx \
     RAZORPAY_WEBHOOK_SECRET=fresh-random-string
   ```
6. Trigger a redeploy of the functions to pick up the new secrets (functions read env vars on cold-start, but `supabase functions deploy` forces a fresh container):
   ```bash
   supabase functions deploy submit-xenium-request razorpay-webhook create-payment-link admin-orders
   ```
7. **Test with a real ₹1 order** end-to-end — the cleanest sanity check. Refund it from the Razorpay dashboard if you don't want it on the books.
8. Update `PUBLIC_SITE_URL` in Supabase secrets to your live domain if it's different from `https://xenium-sites.com`.

---

## Optional — turn on email-OTP verification on the tracking page

By default `/track` shows the order as soon as the (order ID, email) pair matches. If you'd rather force a 6-digit email OTP each time:

```bash
supabase secrets set TRACK_REQUIRE_OTP=true
```

The `track-order` function picks this up on the next invocation — no redeploy needed.

To turn it back off:

```bash
supabase secrets set TRACK_REQUIRE_OTP=false
```

---

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Submission "We couldn't send your request" | Edge function not deployed, or DB migration not run | `supabase functions deploy submit-xenium-request` and confirm Step 5 |
| Form succeeds but no payment link in confirmation page | `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` not set or wrong | `supabase secrets list`, then re-set per Step 6, then redeploy `submit-xenium-request` |
| Customer email never arrives | Email infrastructure issue (separate from this work) | Check `email_send_log` table for the row + status; check `process-email-queue` logs |
| Webhook returns 401 in logs | `RAZORPAY_WEBHOOK_SECRET` mismatch between Razorpay and Supabase | Re-paste both, redeploy the webhook function |
| Webhook never fires | Wrong URL in Razorpay, or `payment_link.paid` event not subscribed | Verify URL exactly: `https://jrdzsftxhhwaumhubzkf.supabase.co/functions/v1/razorpay-webhook` |
| Tracking page shows "We couldn't find that order" | Email casing mismatch | The lookup is case-insensitive — re-check the order ID (XEN-…) and the exact email used in the form |
| `/admin` keeps redirecting to login | `admin_users` row missing for that auth user | Re-run the SQL in Step 9.2 |
| Razorpay live mode shows "account not activated" | KYC not yet approved | Wait for Razorpay; you can keep testing in test mode |

### Reading function logs

```bash
# tail logs for a single function
supabase functions logs razorpay-webhook --tail

# or use the dashboard: Edge Functions → <function> → Logs
```

### Re-deploy a single function quickly

```bash
supabase functions deploy razorpay-webhook
```

---

## Useful commands cheat-sheet (ongoing)

```bash
# List orders from the DB directly
supabase db execute --sql "SELECT short_code, sender_email, payment_status, production_status, created_at FROM xenium_requests ORDER BY created_at DESC LIMIT 20"

# Mark an order as manually paid (bypasses Razorpay; use with care)
supabase db execute --sql "UPDATE xenium_requests SET payment_status='paid', paid_at=now(), production_status='queued' WHERE short_code='XEN-XXXXXX'"

# Inspect a webhook event after the fact
supabase functions logs razorpay-webhook --since 30m

# Rotate the webhook secret without downtime
# 1. Generate new random string
# 2. Add it as a SECOND value in Razorpay (Razorpay supports two active webhooks)
# 3. Update RAZORPAY_WEBHOOK_SECRET on Supabase
# 4. Deploy the function
# 5. Delete the old webhook from Razorpay
```

---

## Quick reference — URLs you'll need

| What | Where |
| --- | --- |
| Supabase project dashboard | <https://supabase.com/dashboard/project/jrdzsftxhhwaumhubzkf> |
| Edge Function secrets | Project Settings → Edge Functions → Secrets |
| Edge Function logs | Edge Functions → (pick one) → Logs |
| SQL editor | SQL editor (sidebar) |
| Auth users | Authentication → Users |
| Razorpay dashboard | <https://dashboard.razorpay.com> |
| Razorpay test API keys | Account & Settings → API Keys (test mode) |
| Razorpay webhooks | Account & Settings → Webhooks |
| Webhook endpoint URL | `https://jrdzsftxhhwaumhubzkf.supabase.co/functions/v1/razorpay-webhook` |
| Admin sign-in page | `/admin/login` (locally `http://localhost:8080/admin/login`) |
| Order tracker | `/track` (or direct: `/track/XEN-XXXXXX`) |

---

## What's intentionally NOT in this runbook

- **Refund automation** — supported in the data model (`payment_status='refunded'`) but no admin button yet. For now, refund from the Razorpay dashboard and update the row manually if you want production status to mirror.
- **Customer self-service cancel** — the user can't cancel an order from `/track`. Email/admin only.
- **Multi-currency** — schema has `currency` but everything is INR-locked.
- **Subscription / recurring** — out of scope; Razorpay supports it via separate "Subscriptions" API.

If you want any of those built later, ping and I'll scope it.
