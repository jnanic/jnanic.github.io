# Yash Sharma - Portfolio Website

A modern, minimalist personal portfolio built with Next.js, React, TypeScript, and Tailwind CSS.

## 🚀 Features

- ⚡ **Next.js 14** with App Router and static export
- 🎨 **Tailwind CSS** for styling
- 🌓 **Dark/Light mode** with manual toggle (defaults to dark)
- ✨ **Framer Motion** animations
- 🎭 **Glitch effect** animated name reveal
- 🌊 **Animated gradient mesh** background
- 📱 **Fully responsive** design
- 🎯 **Experimental bento grid** project layout

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (Static Export)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Theme**: next-themes
- **Hosting**: GitHub Pages

## 💻 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📦 Deployment to GitHub Pages

1. **Build the static site**:
   ```bash
   npm run build
   ```
   This creates the `out/` directory with static files.

2. **Deploy**: GitHub Pages will automatically serve the exported files from the `out/` directory.

## 🎨 Customization

### Adding Projects

Edit `data/projects.ts` to add new projects:

```typescript
{
  id: 'unique-id',
  title: 'Project Name',
  description: 'Brief description...',
  tech: ['React', 'Node.js', 'TypeScript'],
  link: 'https://github.com/...',
  featured: true,
}
```

### Color Schemes

The site includes three accent color themes in `tailwind.config.js`:
- **Cyber Blue** (default): `#00D4FF`
- **Deep Purple**: `#6366F1`
- **Neon Blue**: `#3B82F6`

## 📁 Project Structure

```
├── app/                    # Next.js App Router
├── components/             # React components
│   ├── sections/          # Page sections
│   ├── ui/                # UI components
│   └── providers/         # Context providers
├── data/                  # Project data
└── public/                # Static files
```

## 👤 Author

**Yash Sharma**
- Website: [yashsharma.dev](https://yashsharma.dev)
- GitHub: [@yash1337](https://github.com/yash1337)
- LinkedIn: [tellsharmayash](https://linkedin.com/in/tellsharmayash)
