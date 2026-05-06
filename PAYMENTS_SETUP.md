# Payments, tracking & admin — setup guide

This guide walks through wiring the new Razorpay integration, the public order-tracking page, and the admin panel. It assumes you already have the Supabase project (id `jrdzsftxhhwaumhubzkf`) provisioned.

---

## 1. Apply the database migration

A new migration was added at:

```
supabase/migrations/20260505020000_payments_admin_tracking.sql
```

It adds payment / production columns to `xenium_requests`, plus two new tables: `admin_users` and `tracking_otps`.

Apply it with the Supabase CLI:

```bash
npx supabase db push
```

(or paste the file's SQL into the Supabase dashboard SQL editor.)

---

## 2. Set Supabase function secrets

Use either the Dashboard (Project Settings → Edge Functions → Secrets) or the CLI:

```bash
npx supabase secrets set \
  RAZORPAY_KEY_ID=rzp_test_SlRB9VXGZ7erjq \
  RAZORPAY_KEY_SECRET=2Cw2dPqE1ygnQurzKl0NFc4P \
  RAZORPAY_WEBHOOK_SECRET=replace-with-a-long-random-string \
  PUBLIC_SITE_URL=https://xenium-sites.com \
  XENIUM_DEFAULT_AMOUNT_PAISE=75000 \
  TRACK_REQUIRE_OTP=false
```

> **Rotate the test keys you shared in chat** — anyone who saw the message can use them. Generate a fresh test pair in the Razorpay dashboard before going live.

For local dev with `supabase start`, the same values can go in `supabase/functions/.env` (gitignored).

`RAZORPAY_WEBHOOK_SECRET` is **not** the same as the API key secret. It's a long random string you'll create in step 4.

---

## 3. Deploy the new edge functions

```bash
npx supabase functions deploy create-payment-link \
                              razorpay-webhook \
                              check-payment-status \
                              track-order \
                              verify-tracking-otp \
                              admin-orders \
                              submit-xenium-request \
                              send-transactional-email
```

(The last two are existing functions that I updated — `submit-xenium-request` now creates the payment link and sends the customer email; `send-transactional-email` picks up the new templates from the registry automatically.)

---

## 4. Create the Razorpay webhook

In the Razorpay dashboard → **Settings → Webhooks → Add new**:

- **URL**: `https://jrdzsftxhhwaumhubzkf.supabase.co/functions/v1/razorpay-webhook`
- **Active events**:
  - `payment_link.paid`
  - `payment_link.cancelled`
  - `payment_link.expired`
  - `payment.failed` (optional)
- **Secret**: paste the same string you put into `RAZORPAY_WEBHOOK_SECRET` above. Razorpay will sign every webhook with HMAC-SHA256 using this secret; the function verifies it before doing anything.

You can hit "Send test event" from the Razorpay dashboard to confirm the function returns 200 OK. Until the webhook is configured, the tracking page also has a **polling fallback** (`check-payment-status`) that asks Razorpay for the latest status on demand — so the system works without the webhook, just less promptly.

---

## 5. Create your admin user

Supabase Dashboard → **Authentication → Users → Add user** → set an email + password.

Then mark the user as an admin (Dashboard → SQL editor):

```sql
INSERT INTO public.admin_users (user_id, email, display_name)
SELECT id, email, 'Pranav'
FROM auth.users
WHERE email = 'you@you.com';
```

Sign in at `/admin/login` with that email + password. Non-admins are signed out automatically.

---

## 6. Test the full flow locally

```bash
npm run dev
```

1. Open `http://localhost:8080`, fill in the form (any test occasion).
2. After submission you'll see the new "Pay ₹750 securely" button — Razorpay test page opens. Use any test card (e.g., `4111 1111 1111 1111`, expiry `12/30`, CVV `123`) or test UPI (`success@razorpay`).
3. After paying, Razorpay redirects to `/track/XEN-XXXXXX?paid=1` and your tracking page polls until the webhook (or fallback poll) flips the row to `paid`.
4. Sign in to `/admin` and confirm the order shows up. Try changing its production status with **"Email the customer"** ticked — they should receive the branded `order-status-update` template.

---

## 7. What's wired

| Function / page | Purpose |
| --- | --- |
| `submit-xenium-request` | Creates the row, creates the Razorpay payment link, sends the customer email, notifies the admin email |
| `create-payment-link` | Used by the tracking page to (re-)issue a payment link for an existing order |
| `razorpay-webhook` | Public webhook receiver; verifies the HMAC signature, updates the row, sends the `payment-confirmed` email |
| `check-payment-status` | Public polling fallback — the tracking page calls it after a payment redirect |
| `track-order` | Public lookup; if `TRACK_REQUIRE_OTP=true` it emails an OTP first |
| `verify-tracking-otp` | Verifies the OTP and returns the order summary |
| `admin-orders` | Admin-only API for list / get / update / `create_manual` / `resend_payment_email` |
| `/track`, `/track/:orderId` | Public tracking page (with optional OTP) |
| `/admin/login` | Admin sign-in (Supabase Auth) |
| `/admin` | Order list with filters & search |
| `/admin/orders/:id` | View / update one order, optionally email customer |
| `/admin/orders/new` | Create a manual / corporate order with optional payment link |

Email templates (all branded — dark accent strip, violet→rose→amber gradient button, Cormorant heading):

- `customer-payment-link` — sent on submission
- `payment-confirmed` — sent after webhook flips status to paid
- `order-status-update` — sent from the admin panel when you tick the box
- `tracking-otp` — sent only when `TRACK_REQUIRE_OTP=true`

Preview any of these locally via the existing `preview-transactional-email` function.

---

## 8. Toggling email-OTP verification on the tracking page

The `/track` page can either show order status as soon as the order ID + email match, or require a 6-digit code emailed to the customer first. Toggle with:

```bash
npx supabase secrets set TRACK_REQUIRE_OTP=true   # or false
```

No redeploy needed — the function reads it on each invocation.

---

## 9. Going live

When you upgrade Razorpay from test → live:

1. Replace the secrets:
   ```bash
   npx supabase secrets set \
     RAZORPAY_KEY_ID=rzp_live_xxx \
     RAZORPAY_KEY_SECRET=xxx \
     RAZORPAY_WEBHOOK_SECRET=fresh-random-string
   ```
2. Update the Razorpay webhook in the live dashboard with the same URL and the new secret.
3. Run a real ₹1 transaction end-to-end. Refund it from the dashboard if you don't want it on the books.

---

## 10. Things to consider next

- **Refunds**: the data model supports it (`payment_status = 'refunded'`); add an admin button later that calls Razorpay's refund API.
- **Order list pagination cursors**: today we use `offset/limit`; fine up to ~10k orders.
- **Audit log**: every admin update could be logged in a separate `admin_audit` table — useful when there are 2+ admins.
- **Rate-limit on `track-order`**: today only OTP requests are rate-limited; consider IP-based limits if abuse appears.
