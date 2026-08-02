/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only enforce static export in production; dev mode doesn't need it and
  // Next.js 14.2 incorrectly rejects dynamic App Router routes with output:'export' in dev.
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  images: {
    unoptimized: true,
  },
  // GitHub Pages requires trailing slashes
  trailingSlash: true,
  compiler: {
    // Strip console.* in production builds except warnings/errors
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
};

export default nextConfig;
