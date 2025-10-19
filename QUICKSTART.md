# Quick Start Guide

## View Your New Site Locally

Your development server should already be running at http://localhost:3000

If not, start it with:
```bash
npm run dev
```

## What You'll See

1. **Hero Section** - Full-screen landing with:
   - Glitch effect animated name reveal ("Yash Sharma")
   - Animated gradient mesh background (AI aesthetic)
   - Your role: "Software Engineer · AI Enthusiast · Builder"
   - CTA button to scroll to projects

2. **Projects Section** - Experimental bento grid layout with:
   - SpartaHack API project (from your resume)
   - Hover effects with glow and gradient borders
   - Easy to add more in `data/projects.ts`

3. **Contact Section** - Social links:
   - GitHub
   - LinkedIn
   - Email

4. **Navigation** - Top-right controls:
   - Theme toggle (dark/light mode, defaults to dark)
   - Menu icon for section navigation

## Next Steps

### Test the Site
1. Check all three sections scroll smoothly
2. Toggle between dark and light themes
3. Try the menu navigation
4. Test on mobile (responsive design)

### Customize

#### Add More Projects
Edit `data/projects.ts`:
```typescript
{
  id: 'my-new-project',
  title: 'Awesome Project',
  description: 'What it does...',
  tech: ['React', 'TypeScript', 'Node.js'],
  link: 'https://github.com/yash1337/project',
  featured: true,
}
```

#### Change Colors
Three accent themes available in `tailwind.config.js`:
- Cyber Blue (current): `#00D4FF`
- Deep Purple: `#6366F1`
- Neon Blue: `#3B82F6`

To switch, update `--accent` variable in `app/globals.css`

#### Modify Content
- **Hero text**: `components/sections/Hero.tsx`
- **Social links**: `components/sections/Contact.tsx`
- **Resume**: Replace PDFs in `assets/content/`

### Deploy to GitHub Pages

When ready to go live:

```bash
# 1. Build the site
npm run build

# 2. Test the build locally (optional)
npx serve out

# 3. Commit and push
git add .
git commit -m "New Next.js portfolio site"
git push origin newVersion

# 4. Merge to main (or configure GitHub Actions for newVersion branch)
```

GitHub Actions will automatically deploy to yashsharma.dev!

## Troubleshooting

### Build Errors
If you see TypeScript errors, run:
```bash
npm run lint
```

### Dev Server Won't Start
```bash
# Kill any running Next.js processes
pkill -f "next dev"

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Start fresh
npm run dev
```

### Theme Not Working
Clear browser cache and localStorage:
```javascript
localStorage.clear()
location.reload()
```

## File Structure Quick Reference

```
├── app/
│   ├── layout.tsx      # SEO metadata, theme provider
│   ├── page.tsx        # Main page (imports all sections)
│   └── globals.css     # Tailwind + custom styles
├── components/
│   ├── sections/       # Hero, Projects, Contact
│   ├── ui/             # Navigation, ThemeToggle
│   └── AnimatedBackground.tsx
├── data/
│   └── projects.ts     # ← Edit here to add projects
└── public/
    └── .nojekyll       # Required for GitHub Pages
```

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [React Icons](https://react-icons.github.io/react-icons/)

Enjoy your new portfolio! 🚀
