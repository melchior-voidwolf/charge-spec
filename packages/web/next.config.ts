import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@charge-spec/shared'],
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['@charge-spec/shared'],
  },
};

export default nextConfig;
