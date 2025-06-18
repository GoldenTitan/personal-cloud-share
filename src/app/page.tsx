import { Metadata } from 'next'
import { SearchBar } from '@/components/SearchBar'
import { CategoryFilter } from '@/components/CategoryFilter'
import { ResourceGrid } from '@/components/ResourceGrid'
import { getCategories, getFeaturedResources, getResources } from '@/lib/database'

export const metadata: Metadata = {
  title: '首页',
  description: '浏览和搜索各类网盘资源，包括电子书籍、学习资料、文档资料等。',
}

export default async function HomePage() {
  // 获取分类、推荐资源和最新资源
  const [categories, featuredResources, latestResourcesResult] = await Promise.all([
    getCategories().catch(() => []),
    getFeaturedResources().catch(() => []),
    getResources({ page: 1, limit: 8, sort: 'created_at', order: 'desc' }).catch(() => ({ resources: [], total: 0, page: 1, limit: 8 }))
  ])

  const latestResources = latestResourcesResult.resources

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 头部区域 */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo 和标题 */}
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">云</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                个人网盘资源分享
              </h1>
            </div>

            {/* 管理员入口（隐藏） */}
            <div className="hidden">
              <button className="text-sm text-gray-500 hover:text-gray-700">
                管理
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="container mx-auto px-4 py-8">
        {/* 欢迎区域 */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            欢迎来到资源分享站
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            这里汇集了各类优质资源，包括电子书籍、学习资料、文档资料等。
            使用搜索功能快速找到您需要的资源，或者浏览不同分类发现更多内容。
          </p>
        </div>

        {/* 搜索区域 */}
        <div className="max-w-2xl mx-auto mb-12">
          <SearchBar placeholder="搜索资源..." />
        </div>

        {/* 分类筛选 */}
        <CategoryFilter
          categories={categories}
          className="mb-12"
        />

        {/* 推荐资源 */}
        {featuredResources.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              推荐资源
            </h2>
            <ResourceGrid resources={featuredResources} />
          </div>
        )}

        {/* 最新资源 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            最新资源
          </h2>
          <ResourceGrid resources={latestResources} loading={false} />
        </div>

        {/* 资源请求区域 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            没有找到您需要的资源？
          </h3>
          <p className="text-gray-600 mb-6">
            告诉我们您需要什么资源，我们会尽力为您找到并分享。
          </p>
          <button className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium">
            提交资源请求
          </button>
        </div>
      </main>

      {/* 底部 */}
      <footer className="bg-gray-50 border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 个人网盘资源分享. 保留所有权利.</p>
            <p className="mt-2 text-sm">
              本站仅用于学习交流，请支持正版资源。
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
