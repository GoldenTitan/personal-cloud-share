'use client'

import { Resource } from '@/lib/supabase'
import { ResourceCard } from './ResourceCard'

interface ResourceGridProps {
  resources: Resource[]
  loading?: boolean
  className?: string
}

export function ResourceGrid({ resources, loading = false, className = "" }: ResourceGridProps) {
  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        {/* 加载骨架屏 */}
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-5 bg-gray-200 rounded-full w-16"></div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
              
              <div className="flex items-center justify-between text-sm mb-4">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
              
              <div className="h-9 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (resources.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无资源</h3>
          <p className="text-gray-500 mb-6">
            当前没有找到匹配的资源，请尝试调整搜索条件或浏览其他分类。
          </p>
          <div className="space-y-2 text-sm text-gray-400">
            <p>• 检查搜索关键词是否正确</p>
            <p>• 尝试使用不同的关键词</p>
            <p>• 浏览其他资源分类</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {resources.map((resource) => (
        <ResourceCard
          key={resource.id}
          resource={resource}
          className="h-full"
        />
      ))}
    </div>
  )
}
