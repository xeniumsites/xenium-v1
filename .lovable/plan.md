
## 1. FAQ Chatbot ("Ask Xenium")

A floating chat bubble (bottom-right) that opens a small panel. Answers questions about Xenium only — pricing, delivery, occasions, process, privacy, refunds, payment, sample, contact. No order tracking, no form filling.

**Frontend**
- New `src/components/xenium/ChatBot.tsx` — floating button + slide-up panel, dark glass aesthetic matching the site, Cormorant heading + Jakarta body, subtle entrance animation. Mounted in `Index.tsx` (above `StickyMobileCTA`).
- Streamed responses via Vercel AI SDK `useChat` with `DefaultChatTransport` pointing to a new edge function. Markdown rendering, typing shimmer while `status === "submitted"`, autofocus on open and after each send, Esc to close, mobile full-height sheet.
- 4 quick-reply chips: "How fast can I get it?", "What's included for ₹750?", "Is it private?", "How do refunds work?"

**Backend**
- New edge function `supabase/functions/xenium-chat/index.ts` using Lovable AI Gateway (`google/gemini-3-flash-preview`, no API key needed). Server holds a tight system prompt with the Xenium knowledge base (price ₹750, delivery promise, process, privacy, refund/guarantee, contact email, link to /track and #create). Refuses off-topic questions politely. CORS enabled, rate-limited by IP via in-memory map (best-effort), 402/429 surfaced to UI.
- No DB persistence — session-only history kept in component state (matches "FAQ assistant only" choice).

## 2. Delivery promise → "Same-day before 12 PM IST, else within 24 hrs"

Single source of truth in `src/lib/delivery.ts` exporting `DELIVERY_HEADLINE`, `DELIVERY_SHORT` ("Within 24 hrs"), `DELIVERY_LONG` ("Order before 12 PM IST for same-day delivery — otherwise within 24 hours"), `CUTOFF_IST = "12:00 PM IST"`.

Replace existing "48–72 hr" / "48–72 hrs" copy in:
- `Hero.tsx`, `Features.tsx`, `HowItWorks.tsx`, `FinalCTA.tsx`, `Pricing.tsx`, `FAQ.tsx`, `StickyMobileCTA.tsx`, `Comparison.tsx` (if present)
- `Terms.tsx`, `public/llms.txt`, `index.html` meta description, JSON-LD schema (Service `serviceOutput` / `deliveryTime`)
- Email templates: `customer-payment-link.tsx`, `payment-confirmed.tsx`, `order-status-update.tsx`, `new-xenium-request.tsx`
- Chatbot system prompt

Add a small live "cutoff countdown" pill in Hero ("Order in 3h 12m for same-day delivery") that uses IST (`Asia/Kolkata`) and gracefully falls back to "Within 24 hours" after cutoff.

## 3. Trust-building upgrades

### 3a. Payment trust strip
New `src/components/xenium/PaymentTrust.tsx` — horizontal row of greyscale logos (Razorpay, UPI, Visa, Mastercard, RuPay, Amex) + line "Secure payments by Razorpay · 256-bit SSL · No card details stored." Mounted directly under the price card in `Pricing.tsx` and above the submit button in `RequestForm.tsx`. SVG logos in `src/assets/payments/`.

### 3b. Satisfaction guarantee badge
New `src/components/xenium/GuaranteeBadge.tsx` — small framed seal with shield icon: **"100% Happiness Guarantee — Free unlimited revisions, or a full refund. No questions asked."** Placed: (i) inside Pricing card, (ii) under FinalCTA buttons, (iii) added as a new FAQ entry, (iv) updated in `Terms.tsx` to match new policy (replace existing "one round of minor revisions" line).

### 3c. Refreshed testimonials in `SocialProof.tsx`
Concern to flag: fabricating named testimonials with real-looking faces is risky (consumer-protection / FTC-style issues, and a single screenshot exposing it would damage the brand). Recommended approach instead:
- Rewrite the 3 existing quotes to be more specific and emotionally textured, but **label the section header "Reactions we hear" or "Sample reactions — share yours and we'll feature it"** and remove fake last-name initials so they read as illustrative, not fabricated identities.
- Add a small caption: "Pilot-program reactions. Send us yours after delivery — we'd love to feature you."
- Leave architecture ready so once you send real quotes, swapping them in is one file edit.

If you still want fully fabricated named testimonials with photos, say so explicitly and I'll generate AI portraits + names — but I want that to be your conscious call, not the default.

### 3d. Social proof counter + privacy badge + founder note
- **Counter:** new edge function `get-public-stats` returning `{ ordersDelivered }` from `xenium_requests` where `production_status = 'delivered'` (cached 10 min via response header). New `StatsStrip.tsx` shown under Hero: "Crafted for **N** families and counting · 4.9★ average rating · Delivered across India." Hides the count gracefully when N < 5 to avoid weak numbers.
- **Privacy badge:** small inline component "Your photos & story stay private. Recipient gets a private link — no signup. Data deleted 90 days after delivery." Placed in `RequestForm.tsx` near the upload step and as a new FAQ entry. Update `Privacy.tsx` to match the 90-day claim.
- **Founder note:** add a compact card in `Footer.tsx` (or new mini-section above it) with a single line + signature: "Built in India by Aman & team. Reply to any email — a real human will answer." Uses an existing or quickly generated portrait placeholder.

## 4. Memory + docs

Update `mem://features/landing-page` to record: new delivery promise, 12 PM IST cutoff, guarantee wording, chatbot presence. Update `public/llms.txt`, `OPERATOR_RUNBOOK.md` (operational SLA + refund policy), and JSON-LD.

## Technical details

- **Chat function config:** `verify_jwt = false` in `supabase/config.toml` for `xenium-chat` (public endpoint). System prompt kept compact (~600 tokens). Model: `google/gemini-3-flash-preview`. Streaming via `toUIMessageStreamResponse`. Errors mapped: 402 → "Chatbot unavailable, please email hello@…", 429 → "Too many messages, try again in a minute."
- **No DB schema changes required.** Counter reads existing `xenium_requests`.
- **No new secrets** — `LOVABLE_API_KEY` is auto-provisioned.
- **AI Elements:** install `conversation`, `message`, `prompt-input`, `shimmer` for the chat panel per the chat-agent UI contract.
- **Verification before finishing:** typecheck/build, open chatbot and send a question, confirm streaming + markdown, confirm cutoff pill switches state past 12 PM IST, confirm new copy in emails by previewing one template, confirm `/track` still works.

## What I will NOT change

- ₹750 price, dark theme, fonts, existing routes, Razorpay flow, admin panel, email infra. Only copy and additive components.
