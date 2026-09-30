/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only enforce static export in production so the local dev server retains
  // its normal development behavior.
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  turbopack: {
    root: import.meta.dirname,
  },
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
