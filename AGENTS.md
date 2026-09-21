# AGENTS.md

## Scope

These instructions apply to the entire repository. The application root is `site/`; the repository root contains documentation and deployment configuration but no `package.json`.

Read `WEBSITE_STRUCTURE.md` when changing route composition, blog rendering, themes, visual layers, or deployment behavior. Treat source and configuration as authoritative when documentation differs, and update the relevant documentation in the same change.

## Working sequence

1. Inspect `git status` and preserve unrelated user changes.
2. Locate the owning source before editing: routes in `site/app/`, UI in `site/components/`, projects in `site/data/projects.ts`, posts in `site/content/blog/`, and public files in `site/public/`.
3. Make the smallest coherent change and follow the nearby TypeScript and Tailwind style.
4. Run `npm run build` from `site/`. Completion means the static export succeeds and every changed route is generated.
5. For animation, layout, theme, accessibility, or performance changes, inspect the affected pages at mobile and desktop widths. Run `npm run lh` after a build when Lighthouse validation is relevant and network access is available.

## Architecture contracts

- Preserve static-export compatibility. GitHub Pages cannot run API routes, server actions, request-time data fetching, or other server runtime behavior.
- Keep filesystem blog access in server/build-time modules. Client components must not import `site/lib/blog.ts`.
- Add `'use client'` only for browser APIs, state, effects, event handlers, portals, or animation hooks; keep content-only components server-rendered.
- Mount `CircuitBackground`, `GlobalParticles`, and `CursorGlow` once in `site/app/layout.tsx`. Keep route content above them with the established stacking order.
- Use existing CSS variables and Tailwind brand tokens for colors. Verify both light and dark themes after visual changes.
- Respect `prefers-reduced-motion`, keyboard navigation, semantic structure, visible focus, and meaningful accessible labels.
- Keep trailing-slash URLs and root-relative public asset paths because the production target is a static GitHub Pages export.

## Content conventions

Project records must satisfy the `Project` interface in `site/data/projects.ts`. Keep external links HTTPS where available and include only link types the card supports.

Blog filenames define their slugs. Use ISO `YYYY-MM-DD` values for `publishedDate` and optional `updatedDate`, an explicit boolean `draft`, and a YAML list for `tags`. Place post media in `site/public/blog/` and reference it as `/blog/<filename>`.

Mermaid: use `size=compact|standard|wide` and a quoted `caption` in the fence metadata, plus `accTitle` and `accDescr` in the source. Make topology, labels, shapes, and edge styles carry the meaning without color; see `README.md` for the complete syntax.

## Validation notes

- `npm run build` is the required baseline; there is no committed unit-test suite.
- `npm run lh` expects `site/out/`, downloads Lighthouse CI through `npx`, and writes reports to ignored paths.
- Generated directories such as `site/.next/`, `site/out/`, `site/.lighthouseci/`, and `site/lighthouse/reports/` are not source files and should not be committed.
- Dependency changes must include the matching `site/package-lock.json` update.
