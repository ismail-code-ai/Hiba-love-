# Hiba — A love without translation

A self-contained cinematic love letter built with React, TypeScript, Vite, GSAP and Canvas. Hundreds of measured multilingual phrases form a mathematical heart around Hiba. Fonts are bundled locally, including Japanese, Korean, Cyrillic, Greek and Vietnamese. No backend, account, API key, or runtime network access is needed.

## Requirements

Node.js 22.12 or newer and npm. The project was validated with Node 24.

## Install and develop

```sh
npm ci
npm run dev
```

Vite prints the local development URL. To run the production build locally:

```sh
npm run build
npm run preview
```

The build is written to `dist/`.

## Test

```sh
npm test
```

The Playwright suite runs desktop, mobile touch and reduced-motion tablet projects. In the cloud setup it uses `/usr/bin/chromium`. On another machine, install a Playwright browser with `npx playwright install chromium` and adjust `launchOptions.executablePath` in `playwright.config.ts` if needed.

## Deploy

Deploy the contents of `dist/` to any static hosting provider. No server-side services or environment variables are required. The default Vite base path serves from the domain root; configure `base` in `vite.config.ts` when deploying under a subdirectory.

## Artwork controls

Tap or press Enter on the heart for a soft pulse. Mouse movement adds subtle parallax. Replay restarts the reveal; Save a moment downloads a 2000 × 2000 PNG. Fullscreen is offered where the browser supports it. Reduced-motion preferences show the completed composition without ambient movement or pulse effects.

## Rendering

`src/heart.ts` samples the classic parametric heart curve and packs measured phrases into rows, checking each text rectangle against the silhouette and reserving the center for Hiba. GSAP animates the reveal and scene parameters. Canvas caches the completed text into a high-resolution offscreen layer, and caps the display pixel ratio at two.
