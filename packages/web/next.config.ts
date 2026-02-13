import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@charge-spec/shared'],
  output: 'export',
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
