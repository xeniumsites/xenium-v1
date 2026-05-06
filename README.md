# Xenium Gifts

Premium personalized digital gifting experiences — hand-crafted cinematic microsites for birthdays, anniversaries, proposals, memorials, retirements and corporate moments. Delivered as a private link in 48–72 hours.

Live: https://xenium-sites.com

## Tech stack

- **Framework**: React 18 + TypeScript
- **Build**: Vite 5 (port 8080 in dev)
- **Styling**: Tailwind CSS 3 + custom CSS variables for the brand palette
- **UI primitives**: shadcn/ui (Radix-based) — already includes 50+ accessible components
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Backend**: Supabase (PostgreSQL + edge functions in Deno)
- **Routing**: React Router v6
- **State**: TanStack React Query

## Getting started

```bash
npm install
npm run dev          # http://localhost:8080
```

Other scripts:

```bash
npm run build        # production build to /dist
npm run build:dev    # dev-mode build
npm run preview      # preview production build locally
npm run lint         # ESLint
npm run test         # Vitest (unit / integration)
npm run test:watch   # Vitest in watch mode
```

## Project structure

```
src/
├── pages/                       Route components
│   ├── Index.tsx                Landing page (composed of section components)
│   ├── ExperiencePreview.tsx    /experience/:slug demo viewer
│   ├── Privacy.tsx, Terms.tsx   Legal
│   ├── Unsubscribe.tsx          Email unsubscribe handler
│   └── NotFound.tsx             404
├── components/
│   ├── xenium/                  Domain-specific section components
│   └── ui/                      shadcn primitives
├── integrations/supabase/       Supabase client
├── hooks/                       Custom hooks (useScrollReveal, etc.)
├── lib/                         Utilities (validation schemas, etc.)
└── assets/                      Images bundled with the build

public/
├── favicon.ico
├── og-image.jpg                 1200×630 social share image
├── llms.txt                     For AI crawlers (ChatGPT, Claude, Perplexity)
├── robots.txt
├── sitemap.xml
└── site.webmanifest             PWA manifest
```

## Environment variables

Create `.env.local` (or use the existing `.env`) with:

```bash
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<anon-key>
VITE_SUPABASE_PROJECT_ID=<project-id>
```

Only the publishable / anon key is used on the client. Service-role keys must never be committed.

## Forms & backend

The main request form (`src/components/xenium/RequestForm.tsx`) submits via Supabase edge function `submit-xenium-request`. Validation is enforced both client-side (Zod schema in `src/lib/validation.ts`) and server-side. Email notifications are sent through `send-transactional-email`.

The backend (Supabase project + edge functions) is provisioned and deployed separately.

## Brand tokens

Colour palette defined as HSL variables in `src/index.css`:

| Token | HSL | Use |
|---|---|---|
| `--xenium-void` | 240 29% 6% | Background |
| `--xenium-violet-deep` | 270 44% 44% | Primary gradient start |
| `--xenium-violet-mid` | 270 40% 55% | Hover / secondary |
| `--xenium-rose` | 330 40% 53% | Mid-gradient |
| `--xenium-amber` | 38 86% 53% | Accent / CTA |
| `--xenium-gold` | 38 90% 67% | Soft accent |

Typography: **Cormorant Garamond** (display, italic) + **Plus Jakarta Sans** (body).

## Contributing

This is a private commercial project. For bug reports or feature requests, contact xeniumgifts@gmail.com.
