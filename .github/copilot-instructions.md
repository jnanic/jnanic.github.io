# Copilot Instructions for jnanic.github.io

## Project Overview
This is a **static GitHub Pages personal portfolio website** for Yash Sharma, hosted at `yashsharma.dev`. The site is a single-page application built with vanilla HTML/CSS/JavaScript using the Bootstrap framework and jQuery plugins for animations and effects.

## Architecture & Structure

### Single-Page Design
- **Everything lives in `index.html`**: The entire site is one HTML file with sections (`#home`, `#services`, `#portfolio`) that users scroll/jump between
- No build process, no bundlers - pure static files served directly by GitHub Pages
- Smooth scrolling navigation managed by `custom.js` with anchor link bindings

### Asset Organization
```
assets/
├── bootstrap/      # Bootstrap 3.x framework (CSS + JS)
├── css/            # Custom styles + third-party CSS (Font Awesome, animate.css, etc.)
├── js/             # jQuery plugins (parallax, sticky nav, animations, etc.)
├── images/         # Site images including cover background
├── content/        # PDF resumes (ResumeMarch2025.pdf, etc.)
└── fonts/          # Icon fonts
```

## Styling Conventions

### Color Palette & Typography
- **Primary font**: Raleway (Google Fonts) - used throughout for clean, modern look
- **Headings**: Uppercase with `letter-spacing: 5px` for visual impact
- **Gray theme**: `#cccccc` text on `#181818` backgrounds (`.pfblock-gray` sections)
- **Dark overlay**: Home section uses `rgba(44, 62, 80, 0.3)` overlay with pattern.png texture
- **Accent color**: `#E7746F` (coral/salmon) for links

### Layout Patterns
- **Section structure**: Each major section uses `.pfblock` with centered `.pfblock-header`
- **Icon boxes**: `.iconbox` elements display skills/tech stack with devicon icons
- **Responsive skills grid**: `.skills` class uses flexbox centering with `margin-left/right: 15%`
- **Fixed dimensions**: `.projectWindow` caps project cards at `max-width: 65%`

## Key JavaScript Behaviors

### Page Initialization (`custom.js`)
1. **Preloader**: Fades out `#status` and `#preloader` on window load
2. **Sticky header**: Uses `.sticky()` plugin for navbar at scroll
3. **Smooth scroll**: All `a[href*=#]` links animate scroll to target sections
4. **Parallax effect**: Home background uses `.parallax()` (desktop only, disabled on mobile)
5. **WOW.js animations**: Triggers CSS animations on scroll with `data-wow-delay` attributes

### Mobile Handling
- Parallax backgrounds switched to `scroll` attachment on mobile devices via user agent detection
- Screen height sections dynamically resize with window

## Content Management

### Updating Personal Info
- **Resume links**: Update path in `index.html` line 51 AND `sitemap.xml`
- **Social links**: Hardcoded in header (lines 48-54) and footer (lines 297-301)
- **Projects**: Each project is a `.grid` element in `#portfolio` section with Unsplash images
- **Skills/Tech stack**: Two sections - "comfortable with" and "Currently Exploring" using devicon classes

### Images
- **Hero background**: `assets/images/cover.jpg` (parallax, full-screen)
- **Project thumbnails**: `assets/images/item-*.jpg` 
- **Devicons**: Loaded from CDN `cdn.rawgit.com/konpa/devicon/master/devicon.min.css`

## Deployment

### GitHub Pages Setup
- **CNAME**: Points to `yashsharma.dev` (custom domain)
- **Jekyll config**: `_config.yml` sets `name: Yash Sharma` and `markdown: kramdown`
- **Sitemap**: Manual XML sitemap at root (`sitemap.xml`) with hardcoded URLs

### Branch Strategy
- **`newVersion` branch**: Active development branch for upcoming changes
- Test changes here before merging to production

### Making Changes Live
1. Edit `index.html` directly (no build step)
2. Commit and push to `newVersion` branch for testing
3. Changes go live automatically via GitHub Pages (typically within 1-2 minutes)

## Dependencies (CDN & Local)

### External CDNs
- Google Fonts: Raleway, Lobster
- Devicon (programming language icons)

### Vendored Libraries
- jQuery 1.11.1
- Bootstrap 3.x
- WOW.js (scroll animations)
- jQuery plugins: parallax, sticky, easypiechart, cbpQTRotator, waypoints

### Legacy Code
- **Contact form** (`assets/php/contact.php`): Non-functional on GitHub Pages (static hosting doesn't support PHP)
- **Future modernization planned**: Bootstrap 3 → 5 upgrade, jQuery replacement in future iterations

## Common Tasks

### Adding a New Project
1. Add new `.grid` div in `#portfolio` section with class `col-md-5 projectWindow`
2. Include `figure.effect-bubba` with project image and overlay
3. Update GitHub link in `<figcaption><a href="...">`

### Updating Skills Section
Add new `.col-sm-3` icon box with devicon class (e.g., `devicon-react-plain colored`)

### Changing Theme Colors
Edit `assets/css/style.css` - search for hex colors like `#181818`, `#cccccc`, `#E7746F`
