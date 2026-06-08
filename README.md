# beme-web

Marketing site for [Beme](https://beme.com.au) — brick and block estimating software.

The app itself lives at [`app.beme.com.au`](https://app.beme.com.au) in a separate repo (`beme`). This repo is the public-facing site visitors hit before they sign up.

## Stack

- **Astro 4** — content/marketing-first, zero JS by default, instant page loads
- **Tailwind CSS v4** — same palette + utilities as the app (see `src/styles/global.css`)
- **TypeScript** — strict mode via `astro/tsconfigs/strict`
- **Vercel** — static deploy, free tier, automatic preview deploys per branch

## Local dev

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Scripts

| Script | Does |
|--------|------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build to `dist/` |
| `npm run preview` | Preview the build locally |
| `npm run check` | TypeScript + Astro checks |

## Structure

```
src/
├── components/        Reusable .astro components (Nav, Footer, Hero, etc.)
├── layouts/           Page layouts (BaseLayout wraps every page)
├── lib/               Client helpers (checkout.ts)
├── pages/             One file per route — index.astro → /
└── styles/
    └── global.css     Tailwind import + Beme palette as @theme vars
public/
├── favicon.svg        Brand mark
├── og.png             Open Graph social-share image (1200x630)
├── robots.txt         Search-engine crawl directives
└── sitemap.xml        Site map for search engine indexing
```

## Adding a page

Create `src/pages/<route>.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro'
---

<BaseLayout title="Page title — Beme">
  <section class="container-tight py-16">
    <h1>Hello</h1>
  </section>
</BaseLayout>
```

Astro picks up the route automatically — no router config. Remember to add the new URL to `public/sitemap.xml`.

## Deploying to Vercel

### One-time setup

1. **Push this repo to GitHub** — create a new repo at github.com, then from this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: marketing site"
   git branch -M main
   git remote add origin https://github.com/<your-handle>/beme-web.git
   git push -u origin main
   ```

2. **Connect to Vercel** — sign in at vercel.com → New Project → Import the GitHub repo
   - Framework preset: **Astro** (auto-detected)
   - Root directory: `./`
   - Build command: `npm run build` (auto-detected)
   - Output directory: `dist` (auto-detected)
   - Click Deploy. The site goes live at `<project>.vercel.app` within ~30 seconds.

3. **Connect the custom domain** — in Vercel project Settings → Domains → Add `beme.com.au`
   - Vercel shows you the DNS records to add at your domain registrar
   - For an apex domain (`beme.com.au` with no subdomain), add an `A` record pointing to `76.76.21.21`
   - For `www.beme.com.au`, add a `CNAME` pointing to `cname.vercel-dns.com`
   - SSL certificates are issued automatically once DNS propagates (usually within 5 minutes)

### Ongoing deploys

- Every push to `main` deploys to production automatically
- Every other branch / PR gets its own preview URL — useful for reviewing copy changes before they go live
- No CI to maintain — Vercel runs `npm install && npm run build` on each push and serves `dist/`

### Environment variables

None required for the marketing site today. The Stripe checkout flow calls `https://app.beme.com.au/functions/v1/create-checkout-session` directly — no client-side Stripe key needed because Stripe Checkout is server-redirect, not client-SDK.

## Brand palette

Defined in `src/styles/global.css` as Tailwind v4 `@theme` vars. Mirrors the app:

- `beme-*` — primary orange (`beme-500` is the brand `#ff7a2d`)
- `ink-*` — neutral chrome (dark scale by default; flipped to light in `:root.light`)
- `paper-*` — warm off-whites for light-mode panels

Add new shades to BOTH this repo and the app's `src/index.css` to keep the brand consistent.

## Theme

Default theme is **light**. Toggle in the top-right of the nav (sun/moon pill, identical to the app's). Choice persists per browser via `localStorage` under `beme-web-theme`.

The theme bootstrap script in `BaseLayout.astro` runs synchronously in `<head>` to apply the saved theme class before first paint — no flash of the wrong theme on load.

## What's NOT here yet

- Real hero screenshot (placeholder in `Hero.astro` — replace `/public/hero.png` with a 3D capture from the app)
- Audience-block screenshots (placeholders in `AudienceBlock.astro` — same fix)
- Blog / docs (add when needed via Astro Content Collections)
- Analytics — add Plausible / Fathom / GA once you want traffic insight
