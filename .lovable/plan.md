## Overview

Implement Flow 2 (email notification to `xeniumgifts@gmail.com` on every new Xenium request) and ship a focused round of UX/SEO/mobile polish. No layout redesign — only targeted upgrades to the requested sections.

---

## 1. Email notifications when a request is submitted (Flow 2)

Goal: every time someone submits the request form, an email is delivered to `xeniumgifts@gmail.com` containing the full request details.

Approach: use Lovable's built-in email infrastructure (no third-party keys needed).

Steps:
- Set up the project's email domain (one-time setup dialog shown to the user).
- Provision the email infrastructure (queues, suppression, send log, cron dispatcher).
- Scaffold the transactional email system.
- Add a new template `new-xenium-request.tsx` styled to match the Xenium dark/elegant brand (Cormorant headings, amber/violet accents, white email body per email rules). Renders: occasion, recipient name + relation, sender name/email/phone, mood, selected features, story, deadline, submitted-at timestamp.
- Update the `submit-xenium-request` edge function to, after a successful DB insert, invoke `send-transactional-email` with:
  - `templateName: "new-xenium-request"`
  - `recipientEmail: "xeniumgifts@gmail.com"` (admin notification, hardcoded)
  - `idempotencyKey: \`xenium-request-${insertedRow.id}\``
  - `templateData`: the full request payload
- Email send failure must NOT fail the user submission — wrap in try/catch and just log.
- Create a minimal `/unsubscribe` page (required by transactional email rules) styled to match the site.

Note: domain DNS verification can take time; sending starts working as soon as DNS is verified — the user will be told to monitor in Cloud → Emails.

---

## 2. Navbar scrollspy (active section bold)

In `Navbar.tsx`:
- Use `IntersectionObserver` to track which `<section id="...">` is currently in view (root-margin tuned so the section becomes "active" when ~40% from top).
- Track a single `activeId` state; the matching link gets `font-semibold text-foreground` (and a subtle amber underline glow), while inactive links stay at `text-muted-foreground`.
- Works on desktop nav AND mobile menu.
- Smooth-scroll behavior preserved.

---

## 3. "Why Xenium" (WhatIsXenium) — make it richer

Same 4-card grid (no layout change), but upgrade content + visuals:
- Add a small photo/illustration strip above the cards: a row of 3 narrow image tiles (using existing emotional / hero assets) with soft gradient masks — gives the section a visual anchor.
- Improve copy density: each card gets a one-line proof point under the description (e.g. "Crafted in 48–72 hrs", "Works on every device", "Original soundtrack option", "Private link, no account needed").
- Add subtle hover micro-interaction: icon glow expands + card border shifts to a soft amber-violet gradient.
- Add a centered tagline strip below the cards: "750 ₹ — one price, fully crafted, delivered as a private link."

---

## 4. Experience preview — distinct gallery images (not filtered duplicates)

In `src/pages/ExperiencePreview.tsx`:
- Replace the single `galleryImg` repeated with `hue-rotate` filters by giving each experience an array of 3–4 DIFFERENT images.
- Reduce thumbnails from 6 to 4 per experience (the user asked for "less but different").
- Generate (or curate) one new image per experience per slot — distinct compositions (e.g. for birthday: candles close-up, group hug, gift unwrap, smile portrait). Files saved as `src/assets/gallery-{slug}-{1..4}.jpg`. No filter trick; each thumbnail is its own real photograph.
- Update the data shape: `photos: { label: string; src: string }[]` and the featured image becomes `photos[activePhoto].src`.

---

## 5. Video section — real thumbnail + trust signals

Upgrade `VideoEmbed` so the paused state looks like a real cinematic player:
- Replace gradient placeholder with a true poster image (use the experience's hero image or a dedicated cinematic still).
- Add a soft dark vignette + bottom gradient, large centered play button with a pulsing amber ring.
- Bottom overlay bar showing: title, duration ("01:24"), and a small "HD" pill — looks like a polished video card.
- Top-left small badge: "Original Xenium Video" (italic Cormorant) — increases trust.
- "Playing" state keeps the audio-bars animation but adds a faint moving image (Ken Burns slow zoom on the poster) so it feels like real footage rather than abstract bars.

---

## 6. Mobile-friendliness pass

Targeted, no layout changes:
- Audit all sections for `min-w-0`, `overflow-x-hidden` on hero containers, and proper `flex-wrap` on row-based layouts (Hero metadata row, Navbar, EmotionalStrip, Comparison table → switch to stacked cards under `md`).
- Ensure phone mockups in `XeniumPreview` and `Transformation` shrink to `w-[260px]` on `<sm` so two phones fit side-by-side or stack cleanly.
- Increase tap target sizes: nav links → min `44px` height on mobile; CTA buttons full-width under `sm`.
- Reduce hero font sizes one step on `<sm` to prevent overflow.
- Add `touch-action: manipulation` to all interactive cards.
- Verify `XeniumPreview` scene chips wrap and don't overflow.
- Add `viewport-fit=cover` and ensure no horizontal scroll anywhere.

---

## 7. SEO improvements

`index.html`:
- Add `<meta name="keywords">` with relevant terms (digital gift, personalized experience, anniversary gift, proposal experience, etc.).
- Add `<link rel="canonical">`.
- Add Open Graph: `og:url`, `og:site_name`, `og:locale`.
- Add Twitter `@site` handle slot, `twitter:creator`.
- Add `<meta name="theme-color" content="#0C0C14">`.
- Add JSON-LD structured data: `Organization` schema (name, url, logo, sameAs) and `Product` schema (Xenium Experience, price 750 INR, currency, brand) inline in `index.html`.
- Add `<meta name="robots" content="index, follow, max-image-preview:large">`.
- Set `<html lang="en">` (already), add `<meta name="format-detection" content="telephone=no">` for cleaner mobile rendering.

`public/`:
- Add `sitemap.xml` covering `/` and `/experience/{birthday,anniversary,proposal,memorial,retirement,corporate}`.
- Update `robots.txt` to reference the sitemap.

In code:
- Convert top-level `<div>`s in each section to semantic tags (`<section>` already used; ensure each has a stable `id`, an `aria-label`, and a single `<h2>`).
- Add descriptive `alt` text to every image (currently many are `""`).
- Per-route `<title>` and `<meta description>` for `/experience/:slug` via a small `<DocumentHead>` helper that mutates `document.title` and the description meta on mount (no extra deps).

---

## Technical notes

- Edge function update: `submit-xenium-request` will call `send-transactional-email` using a service-role Supabase client. Idempotency key is derived from the inserted row id (need to add `.select('id').single()` to the insert).
- New template registered in `_shared/transactional-email-templates/registry.ts` as `new-xenium-request`.
- Scrollspy uses native `IntersectionObserver`, no extra dependencies.
- New gallery images generated as project assets (one set per experience, 4 unique images each).
- All visual changes respect existing dark-theme tokens; emails follow the white-body rule.

## Files to create / edit

Create:
- `supabase/functions/_shared/transactional-email-templates/new-xenium-request.tsx`
- `src/pages/Unsubscribe.tsx` + route in `App.tsx`
- `src/components/DocumentHead.tsx`
- `public/sitemap.xml`
- 24 new gallery assets (`src/assets/gallery-{slug}-{1..4}.jpg`)
- A poster asset per experience for the video (or reuse hero image)

Edit:
- `supabase/functions/submit-xenium-request/index.ts`
- `supabase/functions/_shared/transactional-email-templates/registry.ts`
- `src/components/xenium/Navbar.tsx`
- `src/components/xenium/WhatIsXenium.tsx`
- `src/pages/ExperiencePreview.tsx` (gallery + video embed + per-route head)
- `src/components/xenium/Hero.tsx`, `XeniumPreview.tsx`, `Transformation.tsx`, `Comparison.tsx`, `EmotionalStrip.tsx` (mobile polish only)
- `index.html` (SEO meta + JSON-LD)
- `public/robots.txt` (sitemap reference)
