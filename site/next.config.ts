import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "export",
  images: {
    unoptimized: true,
  },
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
