# beme-web

Marketing site for [Beme](https://beme.com.au), brick and block estimating software.

The app itself lives at [`app.beme.com.au`](https://app.beme.com.au) in a separate repo (`beme`). This repo is the public-facing site visitors hit before they sign up.

## Stack

- **Astro 4** for a content-first, zero-JS-by-default site with instant page loads
- **Tailwind CSS v4** using the same palette and utilities as the app (see `src/styles/global.css`)
- **TypeScript** in strict mode via `astro/tsconfigs/strict`
- **Vercel** for static deploys on the free tier, with an automatic preview deploy per branch

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
├── components/        Reusable .astro components (Nav, Footer, Hero, Pillar, FeatureSection, GuideStep, ...)
├── data/              Shared content (faqs.ts feeds both the rendered FAQ and the FAQ structured data)
├── layouts/           Page layouts (BaseLayout wraps every page; GuideLayout wraps each how-to)
├── lib/               Client helpers (checkout.ts)
├── pages/             One file per route, index.astro maps to /
│   └── guides/        The how-to library (index + one file per guide)
└── styles/
    └── global.css     Tailwind import + Beme palette as @theme vars
public/
├── favicon.svg        Brand mark
├── og.png             Open Graph social-share image (1200x630)
├── robots.txt         Search-engine crawl directives
└── sitemap.xml        Site map for search engine indexing
```

### Routes

`/`, `/features`, `/for-tradies`, `/for-suppliers`, `/pricing`, `/guides` (+ five guide pages), `/about`, `/contact`, `/legal/terms`, `/legal/privacy`, and a `404`.

## Adding a page

Create `src/pages/<route>.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro'
---

<BaseLayout title="Page title" description="One-line summary for search and social.">
  <section class="container-tight py-16">
    <h1>Hello</h1>
  </section>
</BaseLayout>
```

`BaseLayout` brands the tab title for you (it appends `· Beme` unless the title already says "Beme"), and sets the canonical URL, Open Graph and Twitter tags, and the sitewide structured data. Pass `image` to override the social card, `noindex` to keep a page out of search, or `jsonLd` to add page-level structured data (see `pricing.astro` for an FAQ example).

Astro picks up the route automatically, no router config. Remember to add the new URL to `public/sitemap.xml`.

## SEO

Handled centrally in `BaseLayout.astro`:

- Per-page `<title>`, meta description, canonical URL, and `og:url`
- Open Graph + Twitter cards, with a per-page `image` override falling back to `/og.png`
- `Organization` and `SoftwareApplication` structured data sitewide, plus `FAQPage` data on the home and pricing pages (sourced from `src/data/faqs.ts` so the markup and the rendered FAQ never drift)
- `noindex` support for pages that should stay out of search (the 404)
- `public/sitemap.xml` and `public/robots.txt` kept in step with the real routes

## Analytics

Privacy-friendly [Plausible](https://plausible.io) is wired into `BaseLayout.astro`. It is cookie-less, so no consent banner is needed. It stays dormant until you set `PUBLIC_ANALYTICS_DOMAIN` in the production environment, and never runs in dev. See `.env.example`. Swap the script `src` for a self-hosted or Fathom endpoint if you prefer.

## Deploying to Vercel

### One-time setup

1. **Push this repo to GitHub**, create a new repo at github.com, then from this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: marketing site"
   git branch -M main
   git remote add origin https://github.com/<your-handle>/beme-web.git
   git push -u origin main
   ```

2. **Connect to Vercel**, sign in at vercel.com, then New Project and import the GitHub repo
   - Framework preset: **Astro** (auto-detected)
   - Root directory: `./`
   - Build command: `npm run build` (auto-detected)
   - Output directory: `dist` (auto-detected)
   - Click Deploy. The site goes live at `<project>.vercel.app` within about 30 seconds.

3. **Connect the custom domain**, in Vercel project Settings then Domains, add `beme.com.au`
   - Vercel shows you the DNS records to add at your domain registrar
   - For an apex domain (`beme.com.au` with no subdomain), add an `A` record pointing to `76.76.21.21`
   - For `www.beme.com.au`, add a `CNAME` pointing to `cname.vercel-dns.com`
   - SSL certificates are issued automatically once DNS propagates (usually within 5 minutes)

### Ongoing deploys

- Every push to `main` deploys to production automatically
- Every other branch or PR gets its own preview URL, useful for reviewing copy changes before they go live
- No CI to maintain. Vercel runs `npm install && npm run build` on each push and serves `dist/`

### Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `PUBLIC_ANALYTICS_DOMAIN` | No | Set to `beme.com.au` to switch Plausible analytics on in production. Leave unset to keep analytics off. |

The Stripe checkout flow calls `https://app.beme.com.au/functions/v1/create-checkout-session` directly. No client-side Stripe key is needed because Stripe Checkout is a server redirect, not a client SDK.

## Brand palette

Defined in `src/styles/global.css` as Tailwind v4 `@theme` vars. Mirrors the app:

- `beme-*` is the primary brand orange (`beme-500` is `#ff7a2d`)
- `ink-*` is the neutral chrome (the light values live in the `:root.light` block, which is always applied)
- `paper-*` are the warm off-whites for light-mode panels

Add new shades to BOTH this repo and the app's `src/index.css` to keep the brand consistent.

## Theme

The site is **light-mode only**. The `light` class is hardcoded on `<html>` in `BaseLayout.astro`, so the light palette always applies. There is no theme toggle and no dark variant.

## What is NOT here yet

- **Real screenshots and gifs.** Every screenshot is a styled placeholder box that names the path to use. The hero (`/public/hero.png`) and audience blocks (`AudienceBlock.astro`) already swap in automatically once the file exists. For the eight feature shots and the guide steps, pass the captured path as the component's `mediaSrc` (`FeatureSection` and `GuideStep` both accept it) and it renders in place of the placeholder. Search the `src/` tree for `Add /` to find every slot and its suggested path.
- **Blog / docs.** Add when needed via Astro Content Collections.
