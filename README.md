# HomelyFix — Home services marketing site

A design-focused marketing site for a local home services business: cleaning, lawn care, and repairs. Built for demos and education; there is no backend or database.

## What’s in the app

- **Landing page (`/`)** — Hero, animated sections (Framer Motion + GSAP), three service cards with photos, “why choose us”, testimonials, booking call-to-action, embedded **Google Map** (area hub), and a new **smart local insights** panel that combines browser geolocation, Google geolocation fallback, IP geolocation fallback, and live weather data. The global **footer is hidden only on the home page** so the landing feels full-bleed at the bottom.
- **Shared chrome** — Sticky header with navigation, phone, and book CTA on every page; **active link** styling for the current route.
- **Lead flows** — Quote form on `/contact` and booking on `/booking` (including a map-based location picker when a Maps key is set).
- **Service detail routes** — `/cleaning`, `/lawn-care`, and `/home-repair` still exist as pages, but the main nav focuses on the single landing experience; you can link to them or remove the routes if you no longer need them.

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 3.4](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) — scroll, hover, and section transitions on the landing page
- [GSAP](https://gsap.com/) (with ScrollTrigger) — hero and scroll-driven motion
- [ESLint](https://eslint.org/) with `eslint-config-next`

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Create a `.env.local` in the project root (see `.env.example` for a template).

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical site URL (metadata, Open Graph). Defaults to `http://localhost:3000` in code if unset. |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | For booking map | Powers the address / map picker on `/booking`. Without it, the UI shows a message and the map stays disabled. |
| `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL` | Optional | Full **Embed a map** iframe `src` from Google Maps for an exact pin on the **landing page** map. If omitted, the embed uses lat/lng from `src/lib/site.ts` (`businessLocation`). |
| `NEXT_PUBLIC_GOOGLE_GEOLOCATION_API_KEY` | Optional | Enables Google Maps Geolocation API fallback on the landing page if browser geolocation is unavailable/blocked. |

Example:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL=
NEXT_PUBLIC_GOOGLE_GEOLOCATION_API_KEY=
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (Turbopack by default in Next.js 16) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Routes (App Router)

| Path | Description |
|------|-------------|
| `/` | Landing / home |
| `/pricing` | Pricing |
| `/reviews` | Testimonials |
| `/contact` | Quote / contact form |
| `/booking` | Booking form + map picker (with API key) |
| `/cleaning` | Cleaning (optional detail page) |
| `/lawn-care` | Lawn care (optional detail page) |
| `/home-repair` | Home repair (optional detail page) |

## Project structure

```text
src/
  app/                 # App Router: layouts, pages, global styles
  components/          # Shared UI (header, footer, forms, home/…)
  lib/                 # Site config: brand, nav, map, business copy
public/                # Static assets (images, logos, service photos)
```

Key files:

- `src/lib/site.ts` — Site name, nav, phone, and **map / location** copy for the landing map section.
- `src/components/home/AnimatedHomePage.tsx` — Landing page UI and animations.
- `src/components/ConditionalSiteFooter.tsx` — Hides the footer on `/` only.

## Deployment

Deploy like any Node-hosted Next.js app (for example [Vercel](https://vercel.com/)).

1. Push the repo to GitHub (or another Git host).
2. Import the project on your host.
3. Set `NEXT_PUBLIC_SITE_URL` and any Maps-related variables for production.
4. Deploy.

## Scope

This repo is front-end only: no authenticated APIs, CRM, or persisted leads/bookings. A later phase could add a backend, email/CRM hooks, and analytics.
