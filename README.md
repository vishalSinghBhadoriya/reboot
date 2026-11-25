# REBOOT

A local-first mobile repair and electronics storefront for the Indian market. The current repair prices and 30 catalogue items are demonstration data. Product illustrations depict generic concept hardware.

## Run locally

Use Node.js 22.12+ and npm.

```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
```

## Architecture

Vite serves a React and TypeScript SPA with lazy React Router pages. Tailwind and section-specific CSS supply the UI. GSAP and ScrollTrigger animate the homepage. Motion handles route, gallery and estimator entry transitions. Lenis enables smooth scrolling on desktops that allow motion. CSS and the animation hooks respect the system reduced-motion preference.

- `src/features/estimator` uses model and part-grade data in `src/data/repairs.ts`. Unsupported work routes to a quote request.
- `src/data/products.ts` defines catalogue entries, prices in paise, variants, specs and related products.
- `src/stores/useShop.ts` persists cart lines, wishlist, comparisons, variant selections and repair selections. Rehydration filters stale IDs and caps quantities to the current catalogue limit.
- `src/utils/messages.ts` prepares repair and retail enquiry text. The user sends the message from WhatsApp after reviewing it.
- `src/tests` contains Vitest and React Testing Library coverage for pricing, filters, persistence, enquiries and comparison.

Images are served locally in WebP. The main artwork is requested at high priority. Below-the-fold catalogue artwork uses lazy loading.

## Deployment

### GitHub Pages

The workflow in `.github/workflows/pages.yml` publishes pushes to `main` when the repository uses GitHub Actions as its Pages source. It derives the Vite base path from Pages and writes entry files for product links and other site routes. It also generates the sitemap for the Pages URL.

### Vercel

Commit the source and lockfile to GitHub. Configure Vercel for Vite with `npm run build` and output directory `dist`. The SPA rewrite supports nested route refreshes. Set the real public origin and generate a production sitemap as part of launch configuration. Initial HTML includes homepage metadata. Route metadata updates in the browser, so link previews for individual pages depend on the crawler executing JavaScript.

See [Business configuration](BUSINESS.md) and [Asset notes](ASSETS.md).

## Current limits

The store uses browser state and manual WhatsApp handoff. Live inventory, reservations, payments and durable customer records would require services beyond this build. Appointment slots are preferences. The shop confirms prices, availability, delivery and appointments. The homepage loads Three.js separately. The banner shows a still image if WebGL is unavailable, and the anatomy inspector uses a component diagram. The inspector loads as it approaches the viewport. Animation pauses offscreen and respects reduced-motion preferences.
