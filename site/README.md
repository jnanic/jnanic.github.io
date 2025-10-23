# Yash Sharma - Portfolio Website

[![Deploy to GitHub Pages](https://github.com/jnanic/jnanic.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/jnanic/jnanic.github.io/actions/workflows/deploy.yml)

A fast, minimalist portfolio website built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- ⚡ **Next.js App Router** with React Server Components
- 🎨 **Tailwind CSS** with custom color palette
- 🌓 **Dark mode** by default with light mode toggle
- ♿ **Accessible** - semantic HTML, keyboard navigation, ARIA labels
- 📱 **Responsive** - mobile-first design
- 🎭 **Smooth animations** - respects `prefers-reduced-motion`
- 🔍 **SEO optimized** - meta tags, OpenGraph, Twitter cards
- 📦 **Static export** - optimized for GitHub Pages

## 🎨 Color Palette

- **Zaffre Blue**: `#3a0ca3` - Primary accent
- **Imperial Red**: `#f7253a` - Secondary accent
- **Black**: `#000500` - Dark mode background
- **White**: `#ffffff` - Light mode background

## 📋 Development

### Prerequisites

- Node.js 18+
- npm

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build for Production

```bash
npm run build
```

This creates a static export in the `out/` directory.

## 🚢 Deployment

### GitHub Pages (CI/CD)

This repo is configured to auto-deploy to GitHub Pages via GitHub Actions.

- Workflow: `.github/workflows/deploy.yml`
- Trigger: Push to `master` (or `main`)
- Build directory: `site/`
- Static export output: `site/out/`
- Custom domain: `yashsharma.dev` (via `public/CNAME`) and `public/.nojekyll`

Deploy steps:

1. Merge your changes into `master` (or `main`).
2. The "Deploy to GitHub Pages" action will build and publish automatically.
3. Your site will be live at [https://yashsharma.dev](https://yashsharma.dev) once the job finishes (~1–2 minutes).

### Manual Deployment (optional)

1. Build locally: `npm run build`
2. Serve or upload the `site/out/` directory to a static host of your choice

## 📁 Project Structure

```text
site/
├── app/
│   ├── layout.tsx       # Root layout with theme provider
│   ├── page.tsx         # Main single-page app
│   └── globals.css      # Global styles + Tailwind
├── components/
│   ├── Navigation.tsx   # Floating hamburger menu
│   ├── ThemeProvider.tsx # Theme context provider
│   └── ThemeToggle.tsx  # Theme toggle button
├── public/
│   └── avatar.jpeg      # Profile image
├── next.config.mjs      # Next.js configuration
├── tailwind.config.ts   # Tailwind configuration
└── package.json         # Dependencies
```

## ✅ Test Checklist

- [ ] Theme toggle works (light/dark)
- [ ] Theme persists on reload
- [ ] No flash of wrong theme on first load
- [ ] Hamburger menu opens/closes smoothly
- [ ] Backdrop blur appears when menu is open
- [ ] ESC key closes menu
- [ ] Keyboard navigation works (Tab, Enter, ESC)
- [ ] All links have visible focus states
- [ ] Responsive on mobile/tablet/desktop
- [ ] Respects `prefers-reduced-motion`
- [ ] Lighthouse score ≥90 on all metrics

## 🎯 Roadmap

- [x] Theme system with dark mode
- [x] Floating navigation menu
- [x] Basic page structure
- [ ] Typing animation for tagline
- [ ] About section with avatar
- [ ] Projects grid with cards
- [ ] Contact section
- [ ] GitHub Pages deployment workflow
- [ ] Blog scaffold (future)

## 📝 License

© 2025 Yash Sharma. All rights reserved.
