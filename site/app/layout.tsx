import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import dynamic from 'next/dynamic';
import Navigation from '@/components/Navigation';
const CursorGlow = dynamic(() => import('@/components/CursorGlow'), { ssr: false, loading: () => null });

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Yash Sharma - Student / Engineer / Nerd',
  description: 'Personal portfolio of Yash Sharma - showcasing projects, skills, and experience.',
  keywords: ['Yash Sharma', 'Portfolio', 'Web Developer', 'Software Engineer', 'Student'],
  authors: [{ name: 'Yash Sharma' }],
  icons: {
    icon: [
      // Modern browsers prefer SVG when available
      { url: '/favicon.svg', type: 'image/svg+xml' },
      // PNG fallbacks/sizes for broad compatibility
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/android-chrome-192x192.png', type: 'image/png', sizes: '192x192' },
      { url: '/android-chrome-512x512.png', type: 'image/png', sizes: '512x512' }
    ],
    apple: [
      { url: '/apple-touch-icon.png' }
    ],
    shortcut: [
      { url: '/favicon-32x32.png', type: 'image/png' }
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Yash Sharma - Student / Engineer / Nerd',
    description: 'Personal portfolio of Yash Sharma - showcasing projects, skills, and experience.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yash Sharma - Student / Engineer / Nerd',
    description: 'Personal portfolio of Yash Sharma - showcasing projects, skills, and experience.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'dark';
                document.documentElement.classList.add(theme);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={inter.variable}>
        <ThemeProvider>
          <CursorGlow />
          <Navigation />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
