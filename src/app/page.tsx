'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Download, Mail } from 'lucide-react'
import AdminLoginModal from '@/components/AdminLoginModal'
import ResourceRequestModal from '@/components/ResourceRequestModal'
import ResourceGrid from '@/components/ResourceGrid'
import CategoryFilter from '@/components/CategoryFilter'
import SearchBar from '@/components/SearchBar'

export default function HomePage() {
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [showResourceRequest, setShowResourceRequest] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [resources, setResources] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // 处理左上角图标点击
  const handleLogoClick = () => {
    setClickCount(prev => {
      const newCount = prev + 1
      if (newCount === 5) {
        setShowAdminLogin(true)
        return 0 // 重置计数
      }
      return newCount
    })

    // 3秒后重置计数
    setTimeout(() => {
      setClickCount(0)
    }, 3000)
  }

  // 获取资源数据
  useEffect(() => {
    fetchResources()
    fetchCategories()
  }, [])

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/resources')
      const data = await response.json()
      setResources(data.resources || [])
    } catch (error) {
      console.error('Failed to fetch resources:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  // 过滤资源
  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* 头部导航 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* 左上角图标 - 点击5次打开管理员登录 */}
            <div
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors"
              onClick={handleLogoClick}
            >
              <Plus className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">资源分享</span>
            </div>

            {/* 右侧按钮 */}
            <button
              onClick={() => setShowResourceRequest(true)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>请求资源</span>
            </button>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-8">
        {/* 搜索和筛选区域 */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="搜索资源..."
            />
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        </div>

        {/* 资源网格 */}
        <ResourceGrid resources={filteredResources} />

        {/* 空状态 */}
        {filteredResources.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              暂无资源
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || selectedCategory !== 'all'
                ? '没有找到匹配的资源，试试其他关键词或分类'
                : '管理员还没有上传任何资源'}
            </p>
            <button
              onClick={() => setShowResourceRequest(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              请求资源
            </button>
          </div>
        )}
      </main>

      {/* 模态框 */}
      <AdminLoginModal
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
      />

      <ResourceRequestModal
        isOpen={showResourceRequest}
        onClose={() => setShowResourceRequest(false)}
        onSuccess={() => {
          setShowResourceRequest(false)
          // 可以添加成功提示
        }}
      />
    </div>
  )
}
