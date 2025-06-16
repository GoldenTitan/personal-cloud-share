'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  Mail, 
  LogOut,
  Users,
  TrendingUp,
  Database
} from 'lucide-react'

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState({
    totalResources: 0,
    totalCategories: 0,
    totalRequests: 0,
    recentRequests: 0
  })
  const router = useRouter()

  useEffect(() => {
    // 检查管理员认证状态
    const adminAuth = localStorage.getItem('admin-authenticated')
    if (adminAuth === 'true') {
      setIsAuthenticated(true)
      fetchStats()
    } else {
      router.push('/')
    }
  }, [router])

  const fetchStats = async () => {
    try {
      // 获取统计数据
      const [resourcesRes, categoriesRes] = await Promise.all([
        fetch('/api/resources'),
        fetch('/api/categories')
      ])

      const resourcesData = await resourcesRes.json()
      const categoriesData = await categoriesRes.json()

      setStats({
        totalResources: resourcesData.resources?.length || 0,
        totalCategories: categoriesData.categories?.length || 0,
        totalRequests: 0, // 待实现
        recentRequests: 0 // 待实现
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin-authenticated')
    localStorage.removeItem('admin-email')
    router.push('/')
  }

  const menuItems = [
    { id: 'dashboard', label: '仪表板', icon: LayoutDashboard },
    { id: 'resources', label: '资源管理', icon: FileText },
    { id: 'categories', label: '分类管理', icon: FolderOpen },
    { id: 'requests', label: '资源请求', icon: Mail }
  ]

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">验证管理员身份...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 侧边栏 */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* 头部 */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800">管理员面板</h1>
          </div>

          {/* 菜单 */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* 底部退出按钮 */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>退出登录</span>
            </button>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="ml-64 p-8">
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">仪表板</h2>
            
            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">总资源数</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalResources}</p>
                  </div>
                  <Database className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">分类数量</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalCategories}</p>
                  </div>
                  <FolderOpen className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">待处理请求</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalRequests}</p>
                  </div>
                  <Mail className="w-8 h-8 text-orange-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">本周新增</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.recentRequests}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* 快速操作 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">快速操作</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('resources')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <FileText className="w-6 h-6 text-blue-600 mb-2" />
                  <h4 className="font-medium text-gray-800">添加资源</h4>
                  <p className="text-sm text-gray-600">上传新的网盘资源</p>
                </button>

                <button
                  onClick={() => setActiveTab('categories')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <FolderOpen className="w-6 h-6 text-green-600 mb-2" />
                  <h4 className="font-medium text-gray-800">管理分类</h4>
                  <p className="text-sm text-gray-600">创建和编辑资源分类</p>
                </button>

                <button
                  onClick={() => setActiveTab('requests')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <Mail className="w-6 h-6 text-orange-600 mb-2" />
                  <h4 className="font-medium text-gray-800">处理请求</h4>
                  <p className="text-sm text-gray-600">查看用户资源请求</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">资源管理</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600">资源管理功能开发中...</p>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">分类管理</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600">分类管理功能开发中...</p>
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">资源请求</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600">资源请求管理功能开发中...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
