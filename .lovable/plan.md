## Bug fixes

### 1. Footer quick links cause full page reload on /privacy and /terms
In `src/components/xenium/Footer.tsx`, the `scrollTo` helper currently uses `window.location.href = "/" + href` when not on the home route. That triggers a full reload and loses SPA state. Switch to `useNavigate()` from `react-router-dom` and call `navigate("/" + href)` instead. Also import `useLocation` to check the current path properly.

### 2. Hash navigation doesn't scroll to the section after route change
After navigating from `/privacy` or `/terms` to `/#how-it-works`, React Router doesn't scroll to the hash. Add a small effect in `src/pages/Index.tsx` that, on mount, reads `window.location.hash` and scrolls the matching element into view.

### 3. Footer Privacy/Terms links don't scroll the new page to top
On `/privacy` and `/terms` the pages already call `window.scrollTo(0, 0)` in `useEffect`, so this is fine — no change needed. Just verifying.

### Files to edit
- `src/components/xenium/Footer.tsx` — replace `window.location.href` with `useNavigate`.
- `src/pages/Index.tsx` — add hash-scroll effect on mount.

### Not fixing (intentional)
- The dev-only "Function components cannot be given refs" warnings in the console are emitted by the Lovable editor's runtime injection (`cdn.gpteng.co/lovable.js`) wrapping top-level components. They do not appear in production and don't affect behavior.
- React Router v7 future-flag warnings are informational only.
