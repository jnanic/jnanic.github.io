import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import Navigation from '@/components/Navigation';
import CursorGlow from '@/components/CursorGlow';

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
