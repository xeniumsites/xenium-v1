# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Xenium Gifts — marketing site + order pipeline for premium personalized digital gifting experiences (cinematic microsites for birthdays, anniversaries, proposals, memorials, retirements, corporate moments). Frontend is a single-page React app; the backend is entirely Supabase (Postgres + Deno edge functions). Live at https://xenium-sites.com. This is a private commercial project — origin is a Lovable-managed repo (see `.lovable/`, `lovable-tagger` dev plugin, `lovable-agent-playwright-config`), so expect some Lovable-specific tooling in configs.

## Commands

```bash
npm run dev          # vite dev server, http://localhost:8080
npm run build         # production build to /dist
npm run build:dev     # dev-mode build (unminified, source maps)
npm run preview       # preview a production build locally
npm run lint          # ESLint over the whole repo
npm run test          # vitest run (single pass)
npm run test:watch    # vitest watch mode
```

Run a single test file: `npx vitest run src/test/example.test.ts`. Tests live under `src/**/*.{test,spec}.{ts,tsx}` and run in jsdom (`vitest.config.ts`, setup in `src/test/setup.ts`).

Supabase backend (edge functions + migrations) is deployed via the Supabase CLI, not via `npm`. See `OPERATOR_RUNBOOK.md` for the full one-time setup and `PAYMENTS_SETUP.md` for the payments-specific wiring. Common ongoing commands:

```bash
supabase functions deploy <name>          # redeploy one edge function
supabase functions logs <name> --tail     # tail logs
supabase db push                          # apply pending migrations
supabase secrets list                     # verify edge function secrets are set (values hidden)
```

## Architecture

**Frontend** is a single-route-tree React 18 + TypeScript app (Vite, port 8080). Routing is in `src/App.tsx`:
- `/` — `Index.tsx`, the landing page, composed almost entirely of section components from `src/components/xenium/` (Hero, HowItWorks, Occasions, Pricing, RequestForm, FAQ, etc.) rendered in sequence.
- `/experience/:slug` — demo microsite viewer.
- `/track`, `/track/:orderId` — public order-tracking page (`TrackOrder.tsx`), backed by `src/lib/paymentClient.ts`.
- `/admin/*` — admin panel (`src/pages/admin/`): `AdminLogin` → `AdminLayout` (route guard via `useAdminAuth`) wraps `AdminDashboard` (list/filter orders), `AdminOrderDetail` (view/update one order, optionally email the customer), `AdminCreateOrder` (manual/corporate order creation). Backed by `src/lib/adminClient.ts`.
- `/unsubscribe`, `/privacy`, `/terms` — static/legal pages.

`src/components/ui/` is shadcn/ui (Radix-based primitives, ~50 components) — treat as vendored, prefer composing over editing. `src/components/xenium/` is where all domain/business UI lives. Path alias `@/*` → `src/*` (see `vite.config.ts`, `tsconfig.json`, `components.json`).

**Backend is 100% Supabase** (project ref `jrdzsftxhhwaumhubzkf`, hardcoded in runbooks — see `.env` for the URL/anon key actually used by the client). No custom Node/Express server exists. All business logic that can't live in the browser is a Deno edge function under `supabase/functions/`:

- `submit-xenium-request` — creates the order row, creates a Razorpay payment link, emails the customer + admin. Entry point for the main request form (`RequestForm.tsx`).
- `create-payment-link` / `check-payment-status` — (re-)issue and poll a payment link; used by the tracking page as a fallback when the webhook hasn't fired yet.
- `razorpay-webhook` — public, `verify_jwt = false`; authenticates via `X-Razorpay-Signature` HMAC (see `_shared/razorpay.ts`), not JWT. Flips `payment_status` to paid/cancelled/expired and sends the `payment-confirmed` email.
- `track-order` / `verify-tracking-otp` — public order lookup by (short_code, email), optionally gated by a 6-digit email OTP when the `TRACK_REQUIRE_OTP` secret is `true`.
- `admin-orders` — the only `verify_jwt = true` function with app-level authorization on top: it takes the caller's Supabase JWT, resolves the user, then checks membership in the `admin_users` table before doing anything (pattern in `supabase/functions/admin-orders/index.ts`). Action-routed via a single `action` field in the POST body (`list`, `get`, `update`, `create_manual`, `resend_payment_email`, `delete`) rather than separate REST routes.
- `send-transactional-email` / `process-email-queue` / `preview-transactional-email` / `handle-email-suppression` / `handle-email-unsubscribe` — transactional email infra. Templates are React components (`.tsx`, rendered server-side in Deno) registered by key in `_shared/transactional-email-templates/registry.ts`; add a new email by writing a template component and registering it there.
- `xenium-chat` — public chatbot via the Lovable AI Gateway (`_shared/ai-gateway.ts`).
- `get-public-stats` — public counter (delivered orders) shown on the landing page.

Each function's `verify_jwt` setting (whether Supabase auto-checks a JWT before invoking) is declared per-function in `supabase/config.toml` — check there before assuming a function is public or protected. Shared per-function helpers (CORS/JSON response helpers, Razorpay client) live in `supabase/functions/_shared/`.

**Auth model**: no end-user accounts. Customers are identified by (order short-code, email) only. Admins use real Supabase Auth (email/password); authorization is *not* role-based in Supabase Auth itself but via presence in the `public.admin_users` table, checked both client-side (`useAdminAuth` hook, for UI gating) and server-side inside `admin-orders` (for actual authorization — the client-side check is UX-only and must not be trusted).

**Data model**: single primary table `xenium_requests` (order = request; `short_code` like `XEN-XXXXXX` is the customer-facing ID) plus `admin_users` and `tracking_otps`, added in `supabase/migrations/20260505020000_payments_admin_tracking.sql`. Payment fields (`amount_paise`, `payment_link_id`, `payment_status`, `razorpay_payment_id`, ...) and production fields (`production_status`, `delivery_url`, `admin_notes`) live on the same row. Money is always in paise (`amount_paise`); format for display with `formatINR()` in `src/lib/paymentClient.ts`. Currency is INR-locked end to end.

**Validation**: the request form's Zod schema (`src/lib/validation.ts`) is the single source of truth for occasions/moods/features/deadlines enums and field constraints — it's validated client-side and the same shape is expected server-side in `submit-xenium-request`. `src/lib/delivery.ts` is the single source of truth for the delivery-cutoff promise (12 PM IST) shown across the marketing site, form and emails — change wording/cutoff there, not per-component.

**Types**: `src/integrations/supabase/types.ts` and `client.ts` are marked auto-generated ("do not edit directly") — regenerate via Supabase CLI rather than hand-editing when the schema changes.

## Environment / secrets

- Client-side (`.env`, `VITE_*` prefix): only the Supabase URL/project ID/anon key. Safe to ship; never put a service-role key here.
- Server-side (edge function secrets, set via `supabase secrets set`, never committed): `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `PUBLIC_SITE_URL`, `XENIUM_DEFAULT_AMOUNT_PAISE`, `TRACK_REQUIRE_OTP`. `SUPABASE_URL` / `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` are auto-injected by Supabase into every function — don't set them manually.
- Razorpay webhook secret and API key secret are two different secrets — don't confuse them (see `PAYMENTS_SETUP.md` §2 if unsure).

## Brand tokens

Colour palette is HSL CSS variables in `src/index.css`: `--xenium-void` (bg), `--xenium-violet-deep`/`--xenium-violet-mid` (primary gradient), `--xenium-rose` (mid-gradient), `--xenium-amber`/`--xenium-gold` (accent/CTA). Typography: Cormorant Garamond (display/italic) + Plus Jakarta Sans (body). Email templates reuse this palette (`_shared/transactional-email-templates/_brand.ts`) — keep marketing site and transactional emails visually consistent when touching either.
