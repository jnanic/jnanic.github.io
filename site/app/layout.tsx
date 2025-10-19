import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PropsWithChildren } from "react";
import { ThemeScript } from "@/components/theme-script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yash Sharma | Student · Engineer",
  description:
    "Yash Sharma is a student and engineer building human-centered solutions across web and data systems.",
  metadataBase: new URL("https://jnanic.github.io"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "Yash Sharma | Student · Engineer",
    description:
      "Portfolio and contact hub for Yash Sharma, showcasing selected engineering projects and experience.",
    url: "https://jnanic.github.io",
    siteName: "Yash Sharma Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yash Sharma | Student · Engineer",
    description:
      "Explore Yash Sharma's projects, experience, and ways to connect.",
  },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
