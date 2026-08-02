# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # dev server at http://localhost:3000
npm run build    # production build (also the de-facto type check)
npm run lint     # eslint
```

There is no test suite. Verify changes with `npm run build` and by exercising the page in the dev server.

One-off Shopify product seeding (Admin API, creates drafts only):

```bash
npx ts-node scripts/create-shopify-products.ts --dry-run   # preview
npx ts-node scripts/create-shopify-products.ts --execute
```

## What this is

KATACHI is a premium Japanese-inspired minimalist homeware store: a headless Shopify storefront built with Next.js App Router (v16), React 19, Tailwind 4, and framer-motion. Deployed on Vercel.

**Brand rules live in `.claude/skills/katachi-brand/SKILL.md`.** All customer-facing copy and UI must follow it (calm, declarative, no hype, no emoji, English-language). Use that skill for any page, component, or copy work.

## Architecture

### Shopify integration (the core of the app)

Three server-only modules talk to Shopify; route handlers and server components are the only runtime consumers:

- `lib/shopify.ts` — Storefront API client for the catalog (`getProducts`, `getProductByHandle`, `getProductSpecs`). **Falls back to `lib/mockProducts.ts`** when credentials are missing or a fetch fails, so the site always renders without real Shopify access. Product specs (material, diameter, care, …) come from `custom.*` metafields; per-variant gallery images come from a variant metafield with a fallback to product media.
- `lib/shopify-cart.ts` — Storefront cart mutations, used only by the `/api/cart` and `/api/cart/lines` route handlers.
- Admin API calls live inline in `app/api/notify/route.ts` and the seeding script.

`lib/shopify.js` is a legacy leftover — do not use or extend it; `lib/shopify.ts` is the real client.

Client components never import runtime code from these modules — only types, via `import type { ShopifyProduct, ... } from '@/lib/shopify'`. Keep it that way.

### Cart flow

`contexts/CartContext.tsx` (client) owns cart state and renders `CartDrawer` itself; components call `useCart()`. The context talks to `/api/cart` (create/fetch) and `/api/cart/lines` (add/update/remove), which proxy to Shopify via `lib/shopify-cart.ts`. Checkout hands off to Shopify's hosted `checkoutUrl`.

### API routes

- `/api/cart`, `/api/cart/lines` — cart proxy (above).
- `/api/newsletter`, `/api/notify` — store signups / back-in-stock requests as tagged Shopify customers via the Admin API (notify uses tags `notify-me` + `notify:{handle}:{variant}`). Both degrade gracefully to logging when no admin token is set, so the UI works either way.
- `/api/contact` — contact form.

### Pages & routing

Public routes use a mix of Dutch and English slugs: `/collectie` (+ `/collectie/[handle]` for product detail), `/filosofie`, `/journal`, `/contact`, `/privacy-policy`, `/shipping-returns`, `/terms`. Old paths (`/collection`, `/privacy`, `/verzending-retour`, `/voorwaarden`) 301 in `next.config.ts` — add redirects there when renaming routes.

Server pages (`app/**/page.tsx`) fetch from `lib/shopify.ts` and pass data into `*Client.tsx` components (`HomeClient`, `CollectionClient`, `ProductDetail`) that handle interaction and framer-motion animation. `components/Reveal.tsx` is the shared scroll-reveal wrapper; `app/template.tsx` handles page transitions.

### Environment

`.env.local` (not committed): `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`, `SHOPIFY_ADMIN_ACCESS_TOKEN`. The storefront modules also accept `NEXT_PUBLIC_`-prefixed variants. Product images are served from `cdn.shopify.com` (allowed in `next.config.ts` `images.remotePatterns`; `lib/img.ts` builds sized CDN URLs).
