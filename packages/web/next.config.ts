import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // GitHub Pages 部署在 /charge-spec 子路径下
  basePath: '/charge-spec',
  // 确保静态资源路径正确
  assetPrefix: '/charge-spec',
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
  // 禁用图片优化以避免静态导出问题
  trailingSlash: true,
}

export default nextConfig
