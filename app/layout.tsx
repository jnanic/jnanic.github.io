import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Yash Sharma | Software Engineer',
  description: 'Software Engineer with 4 years at Microsoft. Passionate about AI, distributed systems, and building scalable solutions.',
  keywords: ['Yash Sharma', 'Software Engineer', 'Microsoft', 'Azure', 'AI', 'Machine Learning'],
  authors: [{ name: 'Yash Sharma' }],
  openGraph: {
    title: 'Yash Sharma | Software Engineer',
    description: 'Software Engineer specializing in large-scale distributed systems and AI.',
    url: 'https://yashsharma.dev',
    siteName: 'Yash Sharma Portfolio',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
