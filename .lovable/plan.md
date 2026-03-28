

# Xenium — Premium Digital Gifting Website

## Overview
A luxury, emotionally immersive single-page website for Xenium, a premium digital gifting and storytelling brand. Dark, cinematic aesthetic with violet-to-amber gradients, refined typography, and conversion-focused UX.

## Brand Setup
- Copy the uploaded Xenium logo into the project
- Configure brand colors (Void #0C0C14, Deep Violet #6B3FA0, Mid Violet #8B55C0, Rose #B85590, Warm Amber #F0A020, Golden Light #F8C060)
- Import Google Fonts: Cormorant Garamond (headlines) + Plus Jakarta Sans (body/UI)
- Set up gradient utilities and glow effects in Tailwind config

## Navigation
- Sticky top nav with logo, section links (Home, How It Works, Occasions, Examples, Pricing, FAQ), and a glowing "Create Your Xenium" CTA button
- Mobile hamburger menu with elegant slide-in drawer

## Homepage Sections (13 total)

1. **Hero** — Cinematic full-viewport section with headline "Some feelings deserve more than a text message", subheadline, two CTA buttons, and a stylized mockup of a Xenium experience on devices with glowing gradient backgrounds

2. **What Xenium Is** — 4 elegant glass-morphism cards explaining the concept

3. **Occasions** — 7 premium cards (Birthday, Anniversary, Proposal, Memorial, Love Story, Retirement, Corporate) with icons, emotional taglines, and hover effects

4. **What Can Be Included** — 6 feature showcase cards (Photo Gallery, Video, Timeline, Messages, Music, Animated Text) plus visual hints at premium add-ons

5. **How It Works** — 4-step horizontal flow with numbered steps and connecting lines

6. **Sample Experiences** — 6 preview cards with gradient overlays and emotional titles

7. **Why Xenium Is Different** — Comparison grid showing Xenium vs WhatsApp/cards/builders/social media

8. **Who It's For** — 3 audience cards (Couples, Families, Teams)

9. **Pricing** — 3 tiered cards (Essential, Signature, Bespoke) with "starting from" pricing and feature lists

10. **Create Your Xenium Form** — Premium 6-step multi-step form with progress indicator, smooth transitions between steps, and a beautiful confirmation state on submit

11. **FAQ** — Accordion-style FAQ with 8+ questions

12. **Final CTA** — Full-width cinematic section with headline and two buttons

13. **Footer** — Logo, quick links, contact info, social links, tagline "Where emotion becomes experience"

## Animations & Polish
- Scroll-reveal animations on all sections using intersection observer
- Subtle gradient glow effects on cards and CTAs
- Smooth hover states with scale and glow transitions
- Parallax-like depth on hero section
- Step transitions in the multi-step form with fade/slide animations

## Technical Structure
- Single-page app with smooth scroll navigation
- Components: Navbar, Hero, WhatIsXenium, Occasions, Features, HowItWorks, SampleExperiences, Comparison, Audience, Pricing, RequestForm, FAQ, FinalCTA, Footer
- Form state managed with React useState, multi-step logic with validation per step
- Fully responsive with mobile-first approach

