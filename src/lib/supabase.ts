import { createClient } from '@supabase/supabase-js'

// 环境变量验证
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// 创建 Supabase 客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // 我们使用自定义认证，不需要持久化会话
  },
})

// 数据库类型定义 - 适配实际数据库结构
export interface Category {
  id: string
  name: string
  description?: string
  created_at: string
  // 以下字段在实际数据库中不存在，提供默认值
  slug?: string
  icon?: string
  color?: string
  sort_order?: number
  is_active?: boolean
  updated_at?: string
}

export interface Resource {
  id: string
  title: string
  description?: string
  link: string
  category?: string  // 实际数据库中是字符串类型
  tags?: string[]
  created_at: string
  updated_at: string
  // 以下字段在实际数据库中不存在，提供默认值
  extraction_code?: string
  category_id?: string
  file_size?: string
  file_type?: string
  view_count?: number
  download_count?: number
  is_featured?: boolean
  is_active?: boolean
  // 关联数据（手动处理）
  category_info?: Category
}

export interface ResourceRequest {
  id: string
  resource_name: string
  description?: string
  requester_email: string
  contact_info?: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  status: 'pending' | 'processing' | 'completed' | 'rejected'
  admin_notes?: string
  created_at: string
  updated_at: string
  processed_at?: string
}

// 扩展的资源类型（包含分类信息）
export interface ResourceWithCategory extends Resource {
  category_name?: string
  category_slug?: string
}

// 搜索结果类型
export interface SearchResult {
  resources: ResourceWithCategory[]
  total: number
  page: number
  limit: number
}

// 管理员统计类型
export interface AdminStats {
  total_resources: number
  total_categories: number
  pending_requests: number
  today_requests: number
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 分页参数类型
export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  category?: string
  sort?: 'created_at' | 'title' | 'view_count'
  order?: 'asc' | 'desc'
}

// 表单数据类型
export interface ResourceFormData {
  title: string
  description?: string
  link: string
  extraction_code?: string
  category_id?: string
  file_size?: string
  file_type?: string
  tags?: string[]
  is_featured?: boolean
}

export interface CategoryFormData {
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  sort_order?: number
}

export interface ResourceRequestFormData {
  resource_name: string
  description?: string
  requester_email: string
  contact_info?: string
}

// 验证函数
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// 常量定义
export const CATEGORIES_ICONS = {
  'ebooks': 'book',
  'study': 'graduation-cap',
  'documents': 'file-text',
  'music': 'music',
  'videos': 'video',
  'software': 'download',
  'images': 'image',
  'others': 'folder',
} as const

export const PRIORITY_LABELS = {
  low: '低',
  normal: '普通',
  high: '高',
  urgent: '紧急',
} as const

export const STATUS_LABELS = {
  pending: '待处理',
  processing: '处理中',
  completed: '已完成',
  rejected: '已拒绝',
} as const

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 12,
} as const
