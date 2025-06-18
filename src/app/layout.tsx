import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: '个人网盘资源分享',
    template: '%s | 个人网盘资源分享',
  },
  description: '一个功能完整的个人网盘资源分享网站，支持资源浏览、搜索、分类管理和用户请求功能。',
  keywords: [
    '网盘分享',
    '资源分享',
    '文件分享',
    '资源管理',
    '个人网盘',
  ],
  authors: [
    {
      name: 'Personal Cloud Share',
      url: 'https://github.com/GoldenTitan/personal-cloud-share',
    },
  ],
  creator: 'Personal Cloud Share',
  publisher: 'Personal Cloud Share',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: '/',
    title: '个人网盘资源分享',
    description: '一个功能完整的个人网盘资源分享网站，支持资源浏览、搜索、分类管理和用户请求功能。',
    siteName: '个人网盘资源分享',
  },
  twitter: {
    card: 'summary_large_image',
    title: '个人网盘资源分享',
    description: '一个功能完整的个人网盘资源分享网站，支持资源浏览、搜索、分类管理和用户请求功能。',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className={inter.variable}>
      <head>
        {/* 预加载关键资源 */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* 主题色 */}
        <meta name="theme-color" content="#3B82F6" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        
        {/* 移动端优化 */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* 图标 */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {/* 主要内容 */}
        <div id="root" className="min-h-screen bg-background">
          {children}
        </div>

        {/* 全局通知组件 */}
        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={4000}
        />

        {/* 模态框容器 */}
        <div id="modal-container" />
        
        {/* 开发环境调试信息 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 left-4 z-50 rounded bg-black/80 px-2 py-1 text-xs text-white">
            <div className="sm:hidden">XS</div>
            <div className="hidden sm:block md:hidden">SM</div>
            <div className="hidden md:block lg:hidden">MD</div>
            <div className="hidden lg:block xl:hidden">LG</div>
            <div className="hidden xl:block 2xl:hidden">XL</div>
            <div className="hidden 2xl:block">2XL</div>
          </div>
        )}
      </body>
    </html>
  )
}
