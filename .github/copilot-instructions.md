# Copilot Instructions for jnanic.github.io

## Project Overview
This is a **modern single-page portfolio website** for Yash Sharma (Software Engineer), hosted at `yashsharma.dev`. Built with Next.js 14, React, TypeScript, and Tailwind CSS, featuring dark/light mode, animated UI elements, and optimized for GitHub Pages deployment.

## Architecture & Structure

### Next.js Static Export Setup
- **Framework**: Next.js 14 with App Router configured for static export (`output: 'export'`)
- **Single-page application**: All sections (`#home`, `#projects`, `#contact`) in one page with smooth scrolling
- **No server required**: Exports to static HTML/CSS/JS for GitHub Pages hosting
- **Build output**: `npm run build` generates the `out/` directory

### Tech Stack
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Animations**: Framer Motion for smooth transitions
- **Theme**: next-themes for dark/light mode (defaults to dark)
- **Icons**: React Icons (tree-shakeable)
- **Deployment**: GitHub Pages via GitHub Actions workflow

### Project Structure
```
├── app/
│   ├── layout.tsx          # Root layout with ThemeProvider
│   ├── page.tsx            # Main page combining all sections
│   └── globals.css         # Tailwind imports + custom animations
├── components/
│   ├── sections/
│   │   ├── Hero.tsx        # Landing with animated name + gradient mesh
│   │   ├── Projects.tsx    # Bento grid project showcase
│   │   └── Contact.tsx     # Social links section
│   ├── ui/
│   │   ├── Navigation.tsx  # Slide-out menu with theme toggle
│   │   └── ThemeToggle.tsx # Dark/light mode switcher
│   ├── providers/
│   │   └── ThemeProvider.tsx # next-themes wrapper
│   └── AnimatedBackground.tsx  # Canvas gradient mesh animation
├── data/
│   └── projects.ts         # Project data (easily editable)
├── public/
│   └── .nojekyll          # Required for GitHub Pages
├── assets/content/         # Resume PDFs (legacy, preserved)
└── .github/workflows/
    └── deploy.yml         # Auto-deploy to GitHub Pages
```

## Styling Conventions

### Color Palette & Design
- **Primary font**: Inter (Next.js built-in font optimization)
- **Color themes**: Three accent options defined in Tailwind config:
  - **Cyber Blue** (default): `#00D4FF` - AI-aesthetic, electric feel
  - **Deep Purple-Blue**: `#6366F1` - Modern, tech-forward
  - **Neon Blue**: `#3B82F6` - Classic, professional
- **Dark mode** (default): True black `#000000` backgrounds with subtle blue tints on cards `#0A0E1A`
- **Light mode**: White backgrounds with gray text for accessibility

### Layout & Components
- **Glass-morphism effects**: `.glass-effect` utility class for frosted glass UI elements
- **Gradient text**: `.text-gradient` for accent-colored text with smooth gradients
- **Glow effects**: `.glow-effect` adds subtle box-shadow glow on hover
- **Bento grid**: Asymmetric grid layout in Projects section (first item spans 2x2, others 1x1)
- **Responsive breakpoints**: Tailwind defaults (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)

## Key Features & Animations

### Hero Section Animations
1. **Glitch effect name reveal**: Letter-by-letter reveal of "Yash Sharma" with randomized glitch characters
2. **Gradient mesh background**: Canvas-based animated gradients using `requestAnimationFrame`
3. **Staggered content**: Sequential fade-in of greeting → name → role → description → CTA
4. **Scroll indicator**: Animated vertical line at bottom

### Component Behaviors
- **Navigation**: Fixed top-right menu icon opens slide-out overlay with smooth spring animation
- **Theme toggle**: Sun/moon icon with rotation animation on click
- **Project cards**: Hover effects include glow, gradient border, and subtle scale
- **Smooth scrolling**: Anchor links use `scrollIntoView({ behavior: 'smooth' })`

## Content Management

### Adding Projects
Edit `data/projects.ts` - simple TypeScript array:
```typescript
{
  id: 'unique-slug',
  title: 'Project Name',
  description: 'What it does and tech used...',
  tech: ['TypeScript', 'React', 'Node.js'],  // Shown as tags
  link: 'https://github.com/yash1337/repo',
  featured: true,  // Controls layout size in bento grid
}
```

### Updating Personal Info
- **Social links**: Edit `socialLinks` array in `components/sections/Contact.tsx`
- **Role/tagline**: Update text in `components/sections/Hero.tsx`
- **Resume**: Replace PDFs in `assets/content/` directory
- **Metadata**: Update SEO info in `app/layout.tsx` (title, description, OG tags)

## Deployment

### GitHub Pages Setup
- **Branch**: Currently on `newVersion` (development), deploy from `main` or configure in `.github/workflows/deploy.yml`
- **CNAME**: Points to `yashsharma.dev` (custom domain maintained)
- **GitHub Actions**: Automatic build and deploy on push to main branch
- **Build command**: `npm run build` creates static export in `out/` directory

### Workflow Process
1. Develop on `newVersion` branch
2. Test locally: `npm run dev` (runs on http://localhost:3000)
3. Build test: `npm run build` (checks for errors)
4. Merge to `main` → GitHub Actions automatically deploys
5. Site live at yashsharma.dev in ~2 minutes

### Build Configuration
- **Static export**: `next.config.js` sets `output: 'export'`
- **Images**: `unoptimized: true` required for static hosting
- **No Jekyll**: `.nojekyll` file prevents GitHub Pages from running Jekyll
- **Trailing slashes**: `trailingSlash: true` for consistent routing

## Development Workflows

### Local Development
```bash
npm install        # Install dependencies
npm run dev       # Start dev server (hot reload)
npm run build     # Test production build
npm run lint      # Check for code issues
```

### Common Tasks

#### Change Accent Color
1. Update CSS variable in `app/globals.css`: `--accent: <hsl-value>`
2. Or swap color usage in components (e.g., replace `cyber-blue-*` with `neon-blue-*`)

#### Add New Section
1. Create component in `components/sections/NewSection.tsx`
2. Import and add to `app/page.tsx`
3. Update `navLinks` array in `components/ui/Navigation.tsx`

#### Modify Animations
- **Framer Motion variants**: Defined inline in each component
- **Custom CSS animations**: Add to `tailwind.config.js` keyframes or `globals.css`
- **Canvas animations**: Edit `components/AnimatedBackground.tsx`

## Dependencies & Bundle Size

### Core Libraries (production)
- next: 14.2.x (~500KB)
- react/react-dom: 18.x (~150KB)
- framer-motion: 11.x (~30KB gzipped)
- next-themes: 0.3.x (~2KB)
- react-icons: 5.x (tree-shakeable, ~5-10KB for icons used)

**Total bundle**: ~700KB initial load, optimized with code splitting

### Development Tools
- typescript: 5.x
- tailwindcss: 3.4.x
- eslint: 8.x with Next.js config

## Legacy Files (Old Site)

The following directories contain the old Bootstrap/jQuery site (kept for reference):
- `assets/bootstrap/`, `assets/css/`, `assets/js/` - Old styling and scripts
- `index.html` (OLD) - Original single-file site
- Can be safely deleted after confirming new site works

**Note**: `assets/content/` (resume PDFs) is still used and should be kept.

## Future Enhancements (Planned)

- **Blog section**: Will use Next.js routing (not included in v1)
- **CMS integration**: Consider MDX or headless CMS for blog posts
- **Analytics**: Add Vercel Analytics or similar
- **Contact form**: Replace email link with functional form (requires backend/service)

