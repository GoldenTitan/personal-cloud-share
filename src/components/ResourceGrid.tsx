'use client'

import { useState } from 'react'
import { Download, Copy, ExternalLink, Calendar, Tag, Check } from 'lucide-react'

interface Resource {
  id: string
  title: string
  description: string
  link: string
  category: string
  tags: string[]
  created_at: string
}

interface ResourceGridProps {
  resources: Resource[]
}

export default function ResourceGrid({ resources }: ResourceGridProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopyLink = async (link: string, id: string) => {
    try {
      await navigator.clipboard.writeText(link)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'ebooks':
      case '电子书籍':
        return '📚'
      case 'study':
      case '学习资料':
        return '📖'
      case 'documents':
      case '文档资料':
        return '📄'
      case 'music':
      case '音乐资源':
        return '🎵'
      case 'video':
      case '视频资源':
        return '🎬'
      default:
        return '📁'
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((resource) => (
        <div
          key={resource.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
        >
          {/* 卡片头部 */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getCategoryIcon(resource.category)}</span>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {resource.category}
                </span>
              </div>
              <div className="flex items-center text-xs text-gray-400">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(resource.created_at)}
              </div>
            </div>

            {/* 标题和描述 */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
              {resource.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {resource.description}
            </p>

            {/* 标签 */}
            {resource.tags && resource.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {resource.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
                  >
                    <Tag className="w-2 h-2 mr-1" />
                    {tag}
                  </span>
                ))}
                {resource.tags.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{resource.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* 卡片底部操作 */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleCopyLink(resource.link, resource.id)}
                className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                {copiedId === resource.id ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>已复制</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>复制链接</span>
                  </>
                )}
              </button>

              <a
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>下载</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
