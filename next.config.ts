import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // 启用实验性功能
  experimental: {
    // 启用 React 19 的新特性
    reactCompiler: false,
    // 启用 Turbopack（开发模式下的快速构建）
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // 图片优化配置
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gouutuihaizvkounahog.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 编译配置
  compiler: {
    // 移除 console.log（仅在生产环境）
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 环境变量配置
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // 重定向配置
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: false,
      },
    ]
  },

  // 重写配置
  async rewrites() {
    return [
      {
        source: '/api/health',
        destination: '/api/health/check',
      },
    ]
  },

  // 头部配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ]
  },

  // 输出配置
  output: 'standalone',

  // 压缩配置
  compress: true,

  // 电源配置（优化构建性能）
  poweredByHeader: false,

  // 严格模式
  reactStrictMode: true,

  // 静态文件配置
  trailingSlash: false,

  // Webpack 配置
  webpack: (config) => {
    // 自定义 webpack 配置
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    }

    // SVG 支持
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },

  // TypeScript 配置
  typescript: {
    // 在构建时忽略 TypeScript 错误（不推荐在生产环境使用）
    ignoreBuildErrors: false,
  },

  // ESLint 配置
  eslint: {
    // 在构建时忽略 ESLint 错误（不推荐在生产环境使用）
    ignoreDuringBuilds: false,
  },
}

export default nextConfig
