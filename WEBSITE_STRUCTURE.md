# Website Structure Documentation

## Overview
This is a Next.js 14 portfolio website for Yash Sharma using the App Router, TypeScript, Tailwind CSS, and Framer Motion for animations.

---

## Tech Stack
- **Framework**: Next.js 14.2.15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4.14
- **Animations**: Framer Motion 12.23.24
- **UI Components**: Custom components with glassmorphism design

---

## Project Structure

```
site/
├── app/
│   ├── page.tsx              # Main page component (Homepage)
│   ├── layout.tsx            # Root layout with providers
│   └── globals.css           # Global styles and Tailwind setup
├── components/
│   ├── Header.tsx            # Navigation header with sections
│   ├── Hero.tsx              # Hero section (landing)
│   ├── About.tsx             # About section with bio and avatar
│   ├── Projects.tsx          # Projects section with glassmorphism cards
│   ├── Contact.tsx           # Contact section with social links
│   ├── Footer.tsx            # Compact footer
│   ├── CircuitBackground.tsx # Global circuit board SVG background
│   ├── GlobalParticles.tsx   # Fixed particle network animation
│   ├── CursorGlow.tsx        # Custom cursor glow effect
│   └── TypingAnimation.tsx   # Typing text animation for hero
├── data/
│   └── projects.ts           # Project data (titles, descriptions, links, tech stack)
└── public/
    └── avatar.jpeg           # Profile picture
```

---

## Page Layout (`app/page.tsx`)

The main page renders in this order:

```tsx
<>
  <GlobalParticles />           // Fixed particle network layer (z-0)
  
  <main>
    <CircuitBackground />       // Circuit board SVG background (z-0)
    <Hero />                    // Hero section
    <About />                   // About section
    <Projects />                // Projects section
    <Contact />                 // Contact section
    <Footer />                  // Footer
  </main>
</>
```

**Important**: `GlobalParticles` is rendered **outside** the `<main>` element to ensure true fixed positioning that doesn't scroll with content.

---

## Key Components

### 1. **Header** (`components/Header.tsx`)
- Fixed navigation bar at the top
- Smooth scroll links to sections (Hero, About, Projects, Contact)
- Glassmorphism backdrop blur effect
- z-index: 50 (always on top)

### 2. **Hero** (`components/Hero.tsx`)
- Full viewport height (`min-h-screen`)
- Displays name and typing animation
- "Get In Touch" CTA button scrolls to contact
- **No longer has its own particles** (uses global particles)
- z-index: 10 for content

### 3. **About** (`components/About.tsx`)
- Circular avatar image (264x264px)
- Bio text with personality
- Link to CV PDF
- z-index: 10 for content

### 4. **Projects** (`components/Projects.tsx`)
- **Design**: Glassmorphism cards with 3D tilt effect
- **Layout**: Alternating left/right positioned cards
- **Features**:
  - Mouse-tracking 3D rotation (max 7.5°)
  - Frosted glass effect (`backdrop-blur-xl`)
  - Gradient glow on hover
  - Technology tags below description
  - Link icons (GitHub, Demo, Website) below tech tags
  - Corner accent gradient
- **Data Source**: `/data/projects.ts`
- **Card Component**: `ProjectCard` with advanced animations
- z-index: 10 for content

**Project Card Structure**:
```tsx
- Glow effect (animated opacity on hover)
- Card container (glassmorphism)
  - Content padding
    - Title (hover changes to brand-zaffre)
    - Description (3-line clamp)
    - Technology tags (rounded pills)
    - Link icons (GitHub, Demo, Website)
  - Corner accent (gradient)
```

### 5. **Contact** (`components/Contact.tsx`)
- Full viewport height (`min-h-screen`)
- Centered "Let's talk" heading
- Large circular social media icons
- Links: GitHub, LinkedIn, Email
- Tooltips on hover
- z-index: 10 for content

### 6. **Footer** (`components/Footer.tsx`)
- **Compact design** (py-4, text-xs)
- Copyright © Year + Name
- "Made with ❤️ and vibes!" message
- Separator dots between items

---

## Background & Visual Effects

### CircuitBackground (`components/CircuitBackground.tsx`)
- **Type**: Static SVG circuit board pattern
- **Position**: Absolute (within main container)
- **Height**: 400vh (covers entire page)
- **Opacity**: 0.17
- **Color**: #0088CC (circuit traces)
- **Features**:
  - Randomly generated traces, pads, vias, and chips
  - Uses client-side seed for randomness
  - Mounted state prevents hydration mismatch
  - z-index: 0

### GlobalParticles (`components/GlobalParticles.tsx`)
- **Type**: Interactive particle network animation
- **Position**: Fixed to viewport (doesn't scroll)
- **Rendering**: Outside `<main>` to ensure true fixed positioning
- **Particle Count**: 90 particles
- **Features**:
  - Cursor repulsion effect (150px radius)
  - Particles bounce off viewport edges
  - Dynamic connections between nearby particles (150px max distance)
  - Glow filter on particles
  - Pulsing scale animation on cursor proximity
  - 30fps update rate for performance
- **Styling**:
  - Position: fixed
  - Top/Left: 0
  - Size: 100vw x 100vh
  - z-index: 0
  - pointer-events: none

**Why particles are rendered outside `<main>`**:
When a fixed element is inside a container with `position: relative`, it can create a new containing block, causing the fixed element to scroll with the container instead of staying fixed to the viewport.

---

## Styling & Theme

### Brand Colors
- **Primary Blue**: `#0088CC` (circuit traces)
- **Accent Zaffre**: `#0ABEFF` (particles, highlights, links)
- **CSS Variables** (in `globals.css`):
  - `--color-bg`: Background color
  - `--color-fg`: Foreground/text color
  - `--color-custom`: Border color

### Design Patterns
1. **Glassmorphism**: Used in projects cards and header
   - `backdrop-blur-xl` or `backdrop-blur-md`
   - Semi-transparent backgrounds (`bg-[var(--color-bg)]/60`)
   - Subtle borders with low opacity

2. **3D Effects**: Project cards
   - Mouse-tracking tilt (`rotateX`, `rotateY`)
   - `transform-style: preserve-3d`
   - `translateZ` for depth layers

3. **Gradients**: Glow effects and accents
   - `from-cyan-500 via-brand-zaffre to-violet-500`
   - Corner accents with `bg-gradient-to-bl`

### Custom Tailwind Classes
- `brand-zaffre`: #0ABEFF color
- `perspective-1000`: 3D perspective
- `preserve-3d`: Preserve 3D transforms
- `backface-hidden`: Hide element back face
- `rotate-y-180`: 180° Y-axis rotation

---

## Data Management

### Projects Data (`data/projects.ts`)
```typescript
export const projects = [
  {
    title: string,
    description: string,
    technologies: string[],
    links?: {
      github?: string,
      demo?: string,
      website?: string
    }
  }
]
```

**Current Projects**:
1. SpartaHack API - Flask REST API for hackathon
2. BikesForERP - Bike-sharing platform
3. StudyBuddy - Study session organizer
4. WeatherWise - Weather dashboard

---

## Animation Details

### Framer Motion Patterns

1. **Scroll Animations** (Projects):
   - `useScroll` with container ref
   - `useTransform` for parallax offsets
   - Cards alternate left/right positioning

2. **3D Tilt** (Project Cards):
   - `useMotionValue` for mouse tracking
   - `useSpring` for smooth rotation
   - Spring config: `{ stiffness: 300, damping: 30 }`
   - Rotation limits: ±7.5°

3. **Entrance Animations**:
   - `initial={{ opacity: 0, y: 30 }}`
   - `whileInView={{ opacity: 1, y: 0 }}`
   - Custom easing: `[0.25, 0.46, 0.45, 0.94]`
   - Duration: 0.6s

4. **Hover Effects**:
   - Scale transformations: `whileHover={{ scale: 1.05 }}`
   - Opacity transitions
   - Color changes with CSS transitions

---

## Performance Optimizations

1. **Particles**:
   - Reduced from 180 to 90 particles
   - 30fps update rate (32ms interval)
   - RequestAnimationFrame for smooth mouse tracking
   - Passive event listeners

2. **Images**:
   - Next.js Image component with automatic optimization
   - Priority loading for avatar

3. **Animations**:
   - Hardware acceleration (`will-change: transform`)
   - GPU-accelerated transforms
   - Debounced scroll events

4. **Circuit Background**:
   - Single static SVG (no animations)
   - Client-side rendering to avoid hydration mismatch

---

## Z-Index Layers (Bottom to Top)

```
0   - CircuitBackground (static SVG)
0   - GlobalParticles (fixed, pointer-events: none)
10  - Section content (Hero, About, Projects, Contact)
50  - Header (navigation)
9999 - CursorGlow
```

---

## Known Issues & Solutions

### Issue: Particles scrolling with page
**Cause**: GlobalParticles was inside `<main className="relative">`, creating a new containing block
**Solution**: Moved GlobalParticles outside `<main>` element in `page.tsx`

### Issue: Circuit background hydration mismatch
**Cause**: Random values different on server vs client
**Solution**: Added `mounted` state to only render circuit after client-side hydration

### Issue: Framer Motion scroll warnings
**Status**: Cosmetic warning, doesn't affect functionality
**Message**: "Please ensure that the container has a non-static position"

---

## File Sizes & Performance

- **Particle Count**: 90 (reduced from 180 for performance)
- **Animation Frame Rate**: 30fps (particles), 60fps (cursor)
- **Circuit Background**: ~400vh height, static SVG
- **Image Optimization**: Automatic via Next.js Image component

---

## Development Commands

```bash
npm run dev      # Start development server (port 3000 or 3001)
npm run build    # Build for production
npm run start    # Start production server
```

---

## Browser Support
- Modern browsers with CSS Grid, Flexbox, and SVG support
- Backdrop blur requires webkit support
- Framer Motion requires JavaScript enabled

---

## Future Enhancements

Potential improvements:
1. Add dark/light theme toggle
2. Blog section with MDX
3. Project detail pages
4. More interactive particle behaviors
5. Performance mode toggle for low-end devices
6. PWA support
7. Analytics integration

---

## Component Dependency Tree

```
page.tsx
├── GlobalParticles (fixed layer, no dependencies)
└── main
    ├── CircuitBackground (no dependencies)
    ├── Hero
    │   └── TypingAnimation
    ├── About (uses Next Image)
    ├── Projects
    │   └── ProjectCard (uses data/projects.ts)
    ├── Contact (social links)
    └── Footer
```

---

## Critical CSS Classes

### Layout
- `min-h-screen` - Full viewport height
- `relative` - Positioning context
- `fixed inset-0` - Fixed fullscreen positioning
- `z-{number}` - Stacking order

### Visual Effects
- `backdrop-blur-{size}` - Glassmorphism blur
- `bg-{color}/{opacity}` - Semi-transparent backgrounds
- `border-{color}/{opacity}` - Subtle borders
- `shadow-{size}` - Drop shadows

### Animations
- `transition-all` - Smooth property transitions
- `hover:scale-{value}` - Hover scale effect
- `transform-gpu` - GPU acceleration

---

This documentation should help other models understand the complete structure and functionality of the website.
