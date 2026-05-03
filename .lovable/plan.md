## Plan

### 1. Update Instagram link
In `src/components/xenium/Footer.tsx`, replace the current Instagram URL with `https://www.instagram.com/xenium.sites/` and add `target="_blank"`, `rel="noopener noreferrer"`, and `aria-label="Xenium on Instagram"` (plus `aria-label="Email Xenium"` on the mail icon).

### 2. Create Privacy Policy page
New file `src/pages/Privacy.tsx` — a simple, branded page (matches dark theme, Cormorant headings, Jakarta body) with sections:
- Introduction
- Information we collect (name, email, phone, occasion details, uploaded media)
- How we use it (creating your Xenium experience, sending transactional emails, customer support)
- Sharing (we do not sell data; processors: Lovable Cloud / Supabase, Resend for email)
- Data retention & your rights (access, deletion via xeniumgifts@gmail.com)
- Cookies (only essential)
- Contact

Includes a back-to-home link and the same Navbar/Footer for consistency.

### 3. Create Terms of Service page
New file `src/pages/Terms.tsx` — sections:
- Acceptance of terms
- Service description (personalized digital experiences, ₹750 fixed price)
- Order, delivery & revisions
- Refund policy (work begins on submission; non-refundable once delivery starts)
- User content & rights (you own your media; you grant Xenium license to use it solely to build your experience)
- Acceptable use (no illegal/infringing/harmful content)
- Limitation of liability
- Changes to terms
- Governing law (India)
- Contact

### 4. Wire up routes
In `src/App.tsx`, add:
```
<Route path="/privacy" element={<Privacy />} />
<Route path="/terms" element={<Terms />} />
```
(above the catch-all).

### 5. Update Footer links
Replace dead Privacy/Terms `<button>`s in `Footer.tsx` with `<Link to="/privacy">` and `<Link to="/terms">` from `react-router-dom`.

### 6. SEO
Add the two new URLs to `public/sitemap.xml`.

### 7. Bonus fix found during validation
Add `whitespace-nowrap` to the two hero CTA buttons in `src/components/xenium/Hero.tsx` — they currently wrap to two lines on ~1366px laptop viewports.

### Files touched
- `src/components/xenium/Footer.tsx` (Instagram link + Privacy/Terms links + a11y)
- `src/components/xenium/Hero.tsx` (whitespace-nowrap)
- `src/pages/Privacy.tsx` (new)
- `src/pages/Terms.tsx` (new)
- `src/App.tsx` (routes)
- `public/sitemap.xml` (add entries)
