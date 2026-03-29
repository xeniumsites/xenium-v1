

# Xenium Website — Enhancements Plan

## Overview
9 changes: email on form submit, hero stars & typewriter effect, fixed pricing, spacing, occasions layout, icon animations, form validation, and overall luxury polish.

## 1. Form Email Submission
Since no Supabase/Cloud is connected, the form will send email via a `mailto:` link approach won't work well. Instead, we'll use **EmailJS** (free, no backend needed) or construct a fetch to a free form endpoint. The simplest approach without backend: use **Web3Forms** (free, no signup needed with access key) or just open a `mailto:` with form data.

**Recommended approach**: Use Web3Forms (free API, just needs an access key) to send form data to `xeniumgifts@gmail.com`. This requires an API key. Alternatively, we can use `mailto:` to open the user's email client with pre-filled form data — no API key needed but less seamless.

**Decision**: Since we want a seamless luxury experience, we'll use the `mailto:` approach as a fallback-free solution that works without any API keys. The form will compose a formatted email body and open the user's email client. If you'd prefer a proper form-to-email service, we'd need to set up Lovable Cloud.

**Updated approach**: We'll construct a well-formatted mailto link with all form data encoded, sending to `xeniumgifts@gmail.com`.

## 2. Hero — Floating Stars
Add a canvas-based or CSS particle system with small twinkling stars floating across the hero section. Use pure CSS with multiple small dots using `@keyframes` for twinkling and drifting.

## 3. Hero Mockup — Typewriter Effect
Replace the static `"Happy 10th Anniversary, my love..."` text with a typewriter component that cycles through messages like:
- "Happy 10th Anniversary, my love..."
- "Happy Birthday, Mom..."
- "Will you marry me?"
- "In loving memory of Dad..."
- "Thank you for 25 years of service..."

Each message types in, pauses, then backspaces before the next one appears.

## 4. Fixed Price — ₹750 Only
Replace the 3-tier pricing section with a single elegant pricing card showing ₹750 as the fixed price. Remove package selection from the form (Step 6).

## 5. Section Spacing
Increase `py-32` to `py-40` on all sections for more breathing room. Add subtle dividers or spacing between sections.

## 6. Occasions — Center Last Card
The 7 occasions in a 4-column grid leaves 3 in the last row. Center the last row by using flexbox with `justify-center` instead of CSS grid, or use a grid approach with the last item spanning center.

## 7. Icon Animations
Add contextually relevant animations to card icons:
- **Heart**: gentle pulse/beat animation
- **Cake**: subtle bounce
- **Diamond**: sparkle/rotate shimmer
- **Music**: gentle sway
- **Clock**: slow tick rotation
- **Image**: gentle zoom in/out
- **Video**: play button pulse
- etc.

Each icon gets a subtle, slow CSS animation that loops infinitely and feels relevant to its meaning.

## 8. Form Validation — All Fields Mandatory
Add validation on each step's "Continue" button. Show error states (red border, error message) when required fields are empty. Prevent advancing to the next step until all fields in the current step are filled. In Step 4 (features), require at least one selection. In steps with chip selects, require a selection.

## 9. Luxury Emotional Polish
- Add a subtle shimmer overlay on glass cards
- Enhance gradient glows on hover states
- Add a subtle grain texture overlay to the background
- Improve typography spacing and letter-spacing on section headers

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/xenium/Hero.tsx` | Add floating stars particles, typewriter effect in mockup |
| `src/components/xenium/Pricing.tsx` | Replace 3 tiers with single ₹750 card |
| `src/components/xenium/RequestForm.tsx` | Add validation, remove package selection, add mailto submission |
| `src/components/xenium/Occasions.tsx` | Flexbox layout to center last card |
| `src/components/xenium/WhatIsXenium.tsx` | Icon-specific animations |
| `src/components/xenium/Features.tsx` | Icon-specific animations |
| `src/components/xenium/Audience.tsx` | Icon-specific animations |
| `src/components/xenium/HowItWorks.tsx` | Spacing updates |
| `src/components/xenium/SampleExperiences.tsx` | Spacing updates |
| `src/components/xenium/Comparison.tsx` | Spacing updates |
| `src/components/xenium/FAQ.tsx` | Spacing updates |
| `src/components/xenium/FinalCTA.tsx` | Spacing updates |
| `src/index.css` | New keyframes for icon animations, stars, typewriter cursor, grain texture |
| `tailwind.config.ts` | New animation keyframes |
| `src/pages/Index.tsx` | Spacing between sections if needed |

