'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Category } from '@/lib/supabase'

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory?: string
  onCategoryChange?: (categorySlug: string | null) => void
  className?: string
}

export function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  className = ""
}: CategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(selectedCategory || null)

  const handleCategoryClick = (categorySlug: string | null) => {
    setActiveCategory(categorySlug)
    onCategoryChange?.(categorySlug)
  }

  // 预定义的分类颜色映射
  const categoryColors: Record<string, string> = {
    'ebooks': 'bg-green-100 text-green-700 hover:bg-green-200',
    'study': 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    'documents': 'bg-purple-100 text-purple-700 hover:bg-purple-200',
    'music': 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
    'videos': 'bg-red-100 text-red-700 hover:bg-red-200',
    'software': 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200',
    'images': 'bg-pink-100 text-pink-700 hover:bg-pink-200',
    'others': 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  }

  const getButtonStyle = (categorySlug: string | null) => {
    const isActive = activeCategory === categorySlug
    
    if (categorySlug === null) {
      // "全部" 按钮
      return isActive 
        ? 'bg-blue-500 text-white hover:bg-blue-600' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }
    
    const colorClass = categoryColors[categorySlug] || 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    
    if (isActive) {
      // 激活状态：使用更深的颜色
      const activeColorMap: Record<string, string> = {
        'ebooks': 'bg-green-500 text-white hover:bg-green-600',
        'study': 'bg-blue-500 text-white hover:bg-blue-600',
        'documents': 'bg-purple-500 text-white hover:bg-purple-600',
        'music': 'bg-yellow-500 text-white hover:bg-yellow-600',
        'videos': 'bg-red-500 text-white hover:bg-red-600',
        'software': 'bg-cyan-500 text-white hover:bg-cyan-600',
        'images': 'bg-pink-500 text-white hover:bg-pink-600',
        'others': 'bg-gray-500 text-white hover:bg-gray-600',
      }
      return activeColorMap[categorySlug] || 'bg-gray-500 text-white hover:bg-gray-600'
    }
    
    return colorClass
  }

  return (
    <div className={`flex flex-wrap justify-center gap-3 ${className}`}>
      {/* 全部分类按钮 */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleCategoryClick(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 ${getButtonStyle(null)}`}
      >
        全部
      </Button>

      {/* 分类按钮 */}
      {categories
        .filter(category => category.is_active)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((category) => (
          <Button
            key={category.id}
            variant="ghost"
            size="sm"
            onClick={() => handleCategoryClick(category.slug)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 ${getButtonStyle(category.slug)}`}
          >
            {category.name}
          </Button>
        ))}
    </div>
  )
}
