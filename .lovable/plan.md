## Goal

Lift the overall feel of the Xenium site by fixing the three weakest sections (Live Preview, "The Difference", and the Examples grid) and extending the hero's signature floating-stars ambience across the full page so the whole experience feels cohesive and premium.

---

## 1. Global star ambience (site-wide)

Currently floating stars only exist inside the Hero. Move them into a shared background layer behind the entire page.

- Create `src/components/xenium/StarField.tsx`
  - Renders ~80 floating stars (twinkling + slow drift) using the existing `animate-star-float` keyframe
  - Adds 2–3 very soft violet/rose/amber glow blobs (low opacity, large blur) that drift slowly via framer-motion
  - `position: fixed; inset: 0; z-index: 0; pointer-events: none;` so it sits behind all content but above the body background
  - Respects `prefers-reduced-motion`
- Mount `<StarField />` once inside `src/pages/Index.tsx` (and optionally `ExperiencePreview.tsx`) above all sections
- Remove the now-duplicate local star block from `Hero.tsx` (keep its background glows so the hero still feels denser than other sections)
- Make sure section backgrounds stay transparent so the star field shows through (they already are)

Result: subtle stars + gentle nebula glow on every section, not just the hero.

---

## 2. Redesign the Live Preview section (`XeniumPreview.tsx`)

Current version is a flat dark card with four stacked blocks at low opacity — feels static and "developer-y". Rebuild it as a real-feeling phone preview.

- Replace the "browser window" chrome with an actual phone frame (same notch + rounded shell style as the hero mockup, but larger and centered)
- Inside the phone, animate one cinematic "scene" at a time with smooth crossfade + slight scale (framer-motion `AnimatePresence`):
  1. **Cover** — "For Aisha ❤️ — On your 10th Anniversary" over a soft violet/rose gradient with a few floating star particles inside the screen
  2. **Message** — typewriter quote on a glassy card, gentle parallax background
  3. **Gallery** — 2x2 grid using real assets we already have (`hero-anniversary.jpg`, `hero-birthday.jpg`, `hero-proposal.jpg`, `hero-memorial.jpg`) with staggered fade/scale-in
  4. **Timeline** — vertical timeline with animated dots traveling down a gradient line
- Auto-advance every 4.5s with a thin progress bar at the top of the phone screen showing scene progress
- Replace the dot indicators with small labeled chips ("Cover · Message · Gallery · Timeline") under the phone — tap to jump
- Add a soft floating glow halo behind the phone (violet → rose) and a faint reflective "shelf" shadow underneath so it looks like it's resting on a surface
- Side accent cards (small floating "Music" pill with animated equalizer bars, and a "Tap to open" pill) flanking the phone on desktop only

Result: feels like a live mini product demo, not a static mock.

---

## 3. Rebuild "The Difference" section (`Transformation.tsx`)

Current side-by-side is unbalanced (a chat bubble vs. a tall image), and the arrow is mispositioned.

- Use the same phone-frame component on both sides for visual symmetry
  - **Left phone**: a plain SMS conversation screen — grey iMessage bubbles, one short "Happy Birthday 🎂" message, "Delivered" tag, muted/desaturated styling, slight grayscale filter
  - **Right phone**: the Xenium experience preview (reuse `phone-mockup-screen.jpg` with a soft glowing border, full color, gentle floating animation)
- Center divider:
  - On desktop: animated horizontal gradient line between the two phones with a glowing arrow that pulses left→right
  - On mobile: vertical divider with a downward arrow
- Add three small labeled "feature" badges that fly in beneath the right phone (Photos · Music · Messages · Timeline) with staggered fade-up
- Subtle caption under each phone:
  - Left: "A message they'll forget by tomorrow."
  - Right: "An experience they'll revisit for years."
- Tighten heading copy and increase contrast between the two sides (left = muted/cool, right = warm glow)

Result: an instantly readable visual contrast, balanced composition.

---

## 4. Improve the Examples grid (`SampleExperiences.tsx`)

Reduce density and refine the cards.

- **Reduce from 6 to 4 cards** on the homepage: keep Birthday, Anniversary, Proposal, Memorial. Move Retirement + Corporate behind a "View all experiences" link (no new page yet; link to `#examples` anchor or simply hide for now — confirm during build that we just trim to 4)
- Layout: `lg:grid-cols-2` (2x2) instead of 3-up so each card gets more breathing room and feels premium
- Replace the photo-heavy card with a more designed composition:
  - Aspect ratio `16/11` (less tall, more elegant)
  - Image takes top 60%, with a strong gradient fade into a dark glass footer that holds the text — image and text no longer overlap
  - Add a subtle decorative motif overlay per category (e.g., small candle/heart/ring/star icon in the corner using existing lucide icons) instead of relying only on the photo
- **Hover treatment** (replace the current scale-up which feels like a "shake"):
  - Image: slow `scale(1.05)` + slight brightness lift over 700ms
  - Card: lift via `translateY(-6px)` with a soft expanded violet glow shadow, no scale on the card itself
  - Animated gradient border appears (conic gradient mask or 1px gradient ring fading in)
  - The "Preview Experience →" CTA underlines/slides
  - Use `transition-all duration-500 ease-out` consistently — eliminates the jittery feel
- Add a small "watch preview" play-icon badge on the image so the card reads as interactive

Result: fewer, calmer, more luxurious cards with a smooth, intentional hover.

---

## 5. Cross-section UX polish

Small unifying tweaks while we're in there:

- Standardize section motion timing: all reveals use `duration-700 ease-out` (currently mixed 700–1000ms) for a calmer cadence
- Ensure all sections set `position: relative; z-index: 1` so the new global StarField sits behind them
- Add a very faint top→bottom vignette on the body so the stars feel deeper at the edges

---

## Technical Details

**Files to create**
- `src/components/xenium/StarField.tsx` — fixed background star + glow layer
- `src/components/xenium/PhoneFrame.tsx` — shared phone shell (notch, rounded border, home bar, glow shadow) used by Hero, XeniumPreview, and Transformation

**Files to edit**
- `src/pages/Index.tsx` — mount `<StarField />`, ensure stacking context
- `src/components/xenium/Hero.tsx` — remove local stars (keep glows), use new `PhoneFrame`
- `src/components/xenium/XeniumPreview.tsx` — full redesign with `PhoneFrame` + `AnimatePresence` scene cycling
- `src/components/xenium/Transformation.tsx` — symmetric two-phone composition using `PhoneFrame`
- `src/components/xenium/SampleExperiences.tsx` — trim to 4 cards, 2-col layout, redesigned card + refined hover
- `src/index.css` — add `star-twinkle` keyframe variant + body vignette utility

**No new dependencies.** Everything uses existing `framer-motion`, `lucide-react`, `tailwind`, and assets already in `src/assets/`.

**No backend / DB / route changes.** Read-only to Supabase config.

---

## Out of scope

- No layout/section-order changes
- No new pages or routes
- No copy rewrites beyond the small captions called out above
- No new images generated — reuse existing `hero-*.jpg` assets
