'use client'

import { useState } from 'react'
import { Copy, ExternalLink, Download, Eye, Calendar, Tag } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Resource } from '@/lib/supabase'
import { copyToClipboard, formatRelativeTime, truncateText, getFileTypeIcon } from '@/lib/utils'
import { toast } from 'sonner'

interface ResourceCardProps {
  resource: Resource
  className?: string
}

export function ResourceCard({ resource, className = "" }: ResourceCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCopyLink = async () => {
    setIsLoading(true)
    try {
      const linkText = resource.extraction_code 
        ? `${resource.link} 提取码: ${resource.extraction_code}`
        : resource.link
      
      const success = await copyToClipboard(linkText)
      
      if (success) {
        toast.success('链接已复制到剪贴板')
        // 这里可以调用API增加查看次数
        // await incrementViewCount(resource.id)
      } else {
        toast.error('复制失败，请手动复制')
      }
    } catch (error) {
      console.error('Copy failed:', error)
      toast.error('复制失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExternalLink = () => {
    if (resource.link) {
      window.open(resource.link, '_blank', 'noopener,noreferrer')
      // 这里可以调用API增加下载次数
      // await incrementDownloadCount(resource.id)
    }
  }

  // 获取文件类型图标
  const fileIcon = getFileTypeIcon(resource.file_type)

  return (
    <Card className={`group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold text-gray-900 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
            {resource.title}
          </CardTitle>
          
          {resource.is_featured && (
            <div className="flex-shrink-0">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                推荐
              </span>
            </div>
          )}
        </div>

        {(resource.category_info || resource.category) && (
          <div className="flex items-center gap-1 mt-2">
            <Tag className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {resource.category_info?.name || resource.category}
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent className="pb-4">
        {resource.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {truncateText(resource.description, 120)}
          </p>
        )}

        {/* 文件信息 */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            {resource.file_type && (
              <div className="flex items-center gap-1">
                <span className="font-medium">{resource.file_type}</span>
              </div>
            )}
            {resource.file_size && (
              <div className="flex items-center gap-1">
                <span>{resource.file_size}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {resource.view_count > 0 && (
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{resource.view_count}</span>
              </div>
            )}
            {resource.download_count > 0 && (
              <div className="flex items-center gap-1">
                <Download className="h-3 w-3" />
                <span>{resource.download_count}</span>
              </div>
            )}
          </div>
        </div>

        {/* 标签 */}
        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {resource.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-50 text-blue-700"
              >
                {tag}
              </span>
            ))}
            {resource.tags.length > 3 && (
              <span className="text-xs text-gray-400">
                +{resource.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* 创建时间 */}
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Calendar className="h-3 w-3" />
          <span>{formatRelativeTime(resource.created_at)}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex gap-2 w-full">
          <Button
            onClick={handleCopyLink}
            disabled={isLoading}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            size="sm"
          >
            <Copy className="h-4 w-4 mr-2" />
            {isLoading ? '复制中...' : '复制链接'}
          </Button>
          
          {resource.link && (
            <Button
              onClick={handleExternalLink}
              variant="outline"
              size="sm"
              className="px-3"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
