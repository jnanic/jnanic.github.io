# Website Architecture

## Runtime model

This repository contains a Next.js 14 App Router application in `site/`. Production uses `output: 'export'`, so every route is generated as static files for GitHub Pages. There is no production Node.js server, database, API route, or request-time rendering layer.

The main technologies are TypeScript, React, Tailwind CSS, Framer Motion, `gray-matter`, `marked`, and Mermaid. Exact versions live in `site/package.json` and `site/package-lock.json`.

## Routes and shared layout

`site/app/layout.tsx` owns metadata, the Inter font, the theme provider, navigation, and all fixed visual layers. Those layers are mounted once for every route:

```text
RootLayout
└── ThemeProvider
    ├── CircuitBackground
    ├── GlobalParticles
    ├── CursorGlow
    ├── Navigation
    └── route content
```

Application routes are:

| Route | Source | Purpose |
| --- | --- | --- |
| `/` | `app/page.tsx` | Portfolio homepage |
| `/blog/` | `app/blog/page.tsx` | Posts grouped by publication year |
| `/blog/[slug]/` | `app/blog/[slug]/page.tsx` | Statically generated article |
| `sitemap.xml` | `app/sitemap.ts` | Homepage, blog index, and published posts |
| `robots.txt` | `app/robots.ts` | Allows crawling and links the sitemap |
| fallback | `app/not-found.tsx` | Custom neon 404 page |

Trailing slashes are intentional and configured in `next.config.mjs` for the static host.

## Homepage

`app/page.tsx` composes the visible sections in this order:

```text
main
├── Hero
│   └── TypingAnimation
├── About
├── Projects
├── WritingPreview
├── Contact
└── Footer
```

- `Hero` introduces Yash and links to the contact section.
- `About` renders the avatar, biography, and `/cv.pdf` link.
- `Projects` reads `data/projects.ts` and uses Framer Motion for entrance, parallax, and pointer-tilt effects. It is dynamically imported without server rendering to defer its client-side animation code.
- `WritingPreview` is a server component that shows the two newest visible posts.
- `Contact` contains GitHub, LinkedIn, and email links.
- `Footer` renders the current year in the browser.

## Blog pipeline

`lib/blog.ts` is the build-time content layer:

1. It reads `.md` and `.mdx` files from `content/blog/`.
2. `gray-matter` parses the frontmatter.
3. `marked` converts the Markdown body to HTML.
4. A custom code-block renderer converts Mermaid fences into base64-backed placeholders with semantic size and caption metadata.
5. Posts are sorted newest first, and production lists omit posts with `draft: true`.

`app/blog/[slug]/page.tsx` obtains every slug through `generateStaticParams`, adds article metadata and JSON-LD, and inserts the generated HTML into the article. `MermaidRendererWithTheme` observes the active theme and uses client-side portals to replace Mermaid placeholders with responsive figures.

Mermaid figures use `compact`, `standard`, or `wide` maximum-size presets instead of author-supplied pixels. Inline diagrams retain their natural SVG width rather than being enlarged to fill a preset, then scale down responsively when necessary. The renderer applies a shared high-contrast light or dark theme, preserves Mermaid's SVG accessibility metadata, and displays the fence caption in a `figcaption`. Wide or naturally overfull diagrams expose a native-dialog expanded view with contained scrolling; the inline figure remains viewport-clamped so it cannot create page-level horizontal overflow. Authoring syntax and accessibility requirements live in `README.md`.

The supported `BlogPost` fields are defined by the interface in `lib/blog.ts`. `coverImage` is parsed for future presentation use but is not currently rendered by the index or article page.

## Client and server boundaries

The default is a server component. A component uses `'use client'` only when it needs browser state, effects, animation hooks, portals, or event handlers.

Client-rendered functionality includes:

- Theme state and the theme toggle
- Responsive navigation state
- Typing, project-card, cursor, and particle animation
- Circuit-pattern seeding after hydration
- Mermaid diagram hydration and optional expanded view
- The custom 404 presentation

Blog file access remains in server/build-time modules. Client components must not import `lib/blog.ts` because it depends on Node.js filesystem APIs.

## Theme and styling

`app/globals.css` defines light and dark color variables. `ThemeProvider` synchronizes the `light` or `dark` class on `<html>` with `localStorage`; the inline script in `app/layout.tsx` applies a saved theme before hydration to reduce theme flash.

Tailwind extends the palette with:

- `brand-black`: `#000500`
- `brand-zaffre`: `#0ABEFF`
- `brand-red`: `#f7253a`
- `brand-white`: `#ffffff`

Article typography, Mermaid containers, custom 404 animations, and reusable 3D helpers live in `globals.css`. UI colors should use the existing CSS variables and brand tokens so both themes remain legible.

## Fixed visual layers

The three ambient effects render through portals into `document.body` and ignore pointer input:

| Layer | z-index | Behavior |
| --- | ---: | --- |
| `CircuitBackground` | 0 | Seeded, fixed SVG circuit pattern |
| `CursorGlow` | 1 | Spring-smoothed radial glow following the pointer |
| `GlobalParticles` | 2 | Responsive particle network with cursor repulsion |
| Route content | 10 | Homepage and blog content |
| Navigation backdrop/panel | 40 | Open-menu overlay and drawer |
| Navigation controls | 50 | Theme toggle and menu button |

The particle count adapts to viewport and pointer type, connections are disabled on small/coarse-pointer devices, and animation pauses when the tab is hidden. Particles are also hidden on individual article routes to reduce reading distraction. Particles and cursor glow opt out when `prefers-reduced-motion: reduce` is active, while global CSS shortens CSS animations and transitions.

These effects belong in the root layout rather than individual routes; mounting another copy causes duplicate event listeners and visual work.

## Content sources

- `data/projects.ts` is the single source of truth for project cards.
- `content/blog/` is the single source of truth for articles.
- `public/` contains directly served assets, including the avatar, CV, blog images, icons, `CNAME`, and `.nojekyll`.
- `app/layout.tsx` is the source of truth for global site metadata.

## Static-export constraints

Changes must remain compatible with a filesystem-only deployment:

- Dynamic blog paths need values from `generateStaticParams`.
- Server-only data must be available during the build.
- Request-time APIs, server actions, and API routes have no runtime on GitHub Pages.
- Public asset URLs start at `/`.
- Next.js image optimization stays disabled because GitHub Pages does not provide the image optimizer.

## Accessibility and performance

The site uses semantic sections, labeled controls, keyboard-focus styles, Escape-to-close navigation, and reduced-motion handling. New interactive elements should preserve keyboard access and visible focus states.

Heavy client components are dynamically imported where useful. The production build is the baseline correctness check; Lighthouse budgets and assertions are defined in `lighthouserc.desktop.json`, `lighthouserc.mobile.json`, and `lighthouse/budgets.json`.

## Deployment flow

`.github/workflows/deploy.yml` runs on pushes to `master` and `main`:

```text
npm ci → npm run build → npm run lh → upload site/out → deploy GitHub Pages
```

The Lighthouse step is currently non-blocking, while the static build and Pages upload must succeed.
