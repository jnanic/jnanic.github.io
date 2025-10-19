# Yash Sharma Portfolio

## Overview

Minimalist personal site for **Yash Sharma** built with Next.js (App Router), React, and Tailwind CSS. The design defaults to dark mode, respects system preferences, and exports statically for GitHub Pages while remaining deployable on Vercel.

## Prerequisites

- Node.js v18.18 or newer (developed with v23.10.0)
- npm

Install dependencies:

```bash
npm install
```

## Development Workflow

```bash
npm run dev    # start local dev server on http://localhost:3000
npm run build  # create production build + static export in out/
npm run start  # preview the production build locally
npm run lint   # run Next.js lint rules (ESLint + TypeScript)
```

Because `next.config.ts` uses `output: "export"`, `npm run build` also prepares a static bundle in `out/`. Preview it with:

```bash
npm run build
npx serve@14 out
```

## Deployment

- **GitHub Pages:** Run `npm run build`, publish the generated `out/` directory (e.g. `gh-pages` or `/docs`), and keep the `CNAME` file if a custom domain is configured.
- **Vercel:** Import the repository, keep the build command as `npm run build`, and note that image optimisation is already disabled for static hosting compatibility.

## Project Structure

```text
app/         # App Router layouts, routes, and sections
components/  # Reusable UI (header, theme toggle, etc.)
public/      # Static assets, including the downloadable CV
```

Global tokens for typography and colour themes live in `app/globals.css`.

## Contribution Checklist

1. Branch from `newVersion5` for new work.
2. Install dependencies if needed: `npm install`.
3. Develop with `npm run dev`.
4. Run `npm run lint` before committing.
5. Include manual test notes (nav links, theme toggle, anchor jumps) with every PR.

## Customisation Tips

- Update fonts via `app/layout.tsx` (using `next/font`).
- Adjust colour tokens in `app/globals.css` (`--color-*`) for both dark and light themes.
- The downloadable CV lives at `/public/yash-sharma-cv.pdf`; update the file when you publish a new revision.

## Roadmap

- Fill in detailed project write-ups and visuals.
- Add automated smoke tests (Playwright/RTL) for navigation and theming.
- Launch the blog section with the new scaffolding in `app/blog`.
