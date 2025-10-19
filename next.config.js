/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  // Uncomment if deploying to a subdirectory: basePath: '/repo-name',
  trailingSlash: true,
}

module.exports = nextConfig
