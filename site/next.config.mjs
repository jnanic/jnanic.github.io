/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // GitHub Pages requires trailing slashes
  trailingSlash: true,
};

export default nextConfig;
