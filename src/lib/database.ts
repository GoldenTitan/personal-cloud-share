import { supabase, type Resource, type Category, type ResourceRequest, type PaginationParams, type SearchResult } from './supabase'

// 简单的输入清理函数
function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }
  return input.trim().replace(/[<>]/g, '')
}

// 根据分类名称获取默认图标
function getDefaultIcon(categoryName: string): string {
  const name = categoryName.toLowerCase()
  if (name.includes('book') || name.includes('ebook') || name.includes('书')) return 'book'
  if (name.includes('study') || name.includes('学习') || name.includes('教育')) return 'graduation-cap'
  if (name.includes('document') || name.includes('文档') || name.includes('资料')) return 'file-text'
  if (name.includes('music') || name.includes('音乐')) return 'music'
  if (name.includes('video') || name.includes('视频') || name.includes('影视')) return 'video'
  if (name.includes('software') || name.includes('软件') || name.includes('工具')) return 'download'
  if (name.includes('image') || name.includes('图片') || name.includes('图像')) return 'image'
  return 'folder'
}

// 根据索引获取默认颜色
function getDefaultColor(index: number): string {
  const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316']
  return colors[index % colors.length]
}

// =============================================
// 分类相关操作
// =============================================

export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      // 返回默认分类而不是抛出错误
      return getDefaultCategories()
    }

    // 为每个分类添加缺失的字段默认值
    const categoriesWithDefaults = (data || []).map((category, index) => ({
      ...category,
      slug: category.name.toLowerCase().replace(/\s+/g, '-'),
      icon: getDefaultIcon(category.name),
      color: getDefaultColor(index),
      sort_order: index + 1,
      is_active: true,
      updated_at: category.created_at
    }))

    return categoriesWithDefaults
  } catch (error) {
    console.error('Database error:', error)
    // 返回默认分类而不是抛出错误
    return getDefaultCategories()
  }
}

// 默认分类数据（当数据库不可用时使用）
function getDefaultCategories(): Category[] {
  return [
    {
      id: '1',
      name: '电子书籍',
      slug: 'ebooks',
      description: '各类电子书籍资源',
      icon: 'book',
      color: '#10B981',
      sort_order: 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: '学习资料',
      slug: 'study',
      description: '学习相关资料',
      icon: 'graduation-cap',
      color: '#3B82F6',
      sort_order: 2,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      name: '文档资料',
      slug: 'documents',
      description: '各类文档资料',
      icon: 'file-text',
      color: '#8B5CF6',
      sort_order: 3,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const sanitizedSlug = sanitizeInput(slug)

    // 由于数据库中没有 slug 字段，我们通过 name 来匹配
    // 先获取所有分类，然后在内存中匹配 slug
    const categories = await getCategories()
    const category = categories.find(cat => cat.slug === sanitizedSlug)

    return category || null
  } catch (error) {
    console.error('Database error:', error)
    return null
  }
}

// =============================================
// 资源相关操作
// =============================================

export async function getResources(params: PaginationParams = {}): Promise<SearchResult> {
  try {
    const {
      page = 1,
      limit = 12,
      search = '',
      category = '',
      sort = 'created_at',
      order = 'desc'
    } = params

    let query = supabase
      .from('resources')
      .select('*', { count: 'exact' })

    // 搜索过滤
    if (search) {
      const sanitizedSearch = sanitizeInput(search)
      query = query.or(`title.ilike.%${sanitizedSearch}%,description.ilike.%${sanitizedSearch}%`)
    }

    // 分类过滤 - 使用 category 字段而不是 category_id
    if (category) {
      const categoryData = await getCategoryBySlug(category)
      if (categoryData) {
        // 通过分类名称匹配
        query = query.eq('category', categoryData.name)
      }
    }

    // 排序
    query = query.order(sort, { ascending: order === 'asc' })

    // 分页
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching resources:', error)
      throw new Error('Failed to fetch resources')
    }

    // 为每个资源添加缺失字段的默认值并手动关联分类信息
    const categories = await getCategories()
    const resourcesWithDefaults = (data || []).map(resource => ({
      ...resource,
      view_count: 0,
      download_count: 0,
      is_featured: false,
      is_active: true,
      category_info: categories.find(cat => cat.name === resource.category)
    }))

    return {
      resources: resourcesWithDefaults,
      total: count || 0,
      page,
      limit
    }
  } catch (error) {
    console.error('Database error:', error)
    throw error
  }
}

export async function getResourceById(id: string): Promise<Resource | null> {
  try {
    const sanitizedId = sanitizeInput(id)

    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('id', sanitizedId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // No rows found
      }
      console.error('Error fetching resource:', error)
      throw new Error('Failed to fetch resource')
    }

    // 添加缺失字段的默认值并手动关联分类信息
    const categories = await getCategories()
    const resourceWithDefaults = {
      ...data,
      view_count: data.view_count || 0,
      download_count: data.download_count || 0,
      is_featured: data.is_featured || false,
      is_active: data.is_active !== false, // 默认为 true
      category_info: categories.find(cat => cat.name === data.category)
    }

    return resourceWithDefaults
  } catch (error) {
    console.error('Database error:', error)
    throw error
  }
}

export async function getFeaturedResources(limit: number = 6): Promise<Resource[]> {
  try {
    // 由于数据库中没有 is_featured 字段，我们返回最新的资源作为推荐
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching featured resources:', error)
      // 返回空数组而不是抛出错误
      return []
    }

    // 为每个资源添加缺失字段的默认值并手动关联分类信息
    const categories = await getCategories()
    const resourcesWithDefaults = (data || []).map(resource => ({
      ...resource,
      view_count: resource.view_count || 0,
      download_count: resource.download_count || 0,
      is_featured: true, // 既然是推荐资源，就标记为 featured
      is_active: resource.is_active !== false,
      category_info: categories.find(cat => cat.name === resource.category)
    }))

    return resourcesWithDefaults
  } catch (error) {
    console.error('Database error:', error)
    // 返回空数组而不是抛出错误
    return []
  }
}

export async function incrementViewCount(resourceId: string): Promise<void> {
  try {
    // 由于数据库中没有 view_count 字段，我们暂时跳过这个功能
    // 可以在日志中记录访问，或者使用其他方式统计
    console.log(`Resource ${resourceId} viewed`)
  } catch (error) {
    console.error('Database error:', error)
    // 不抛出错误，因为这不是关键操作
  }
}

export async function incrementDownloadCount(resourceId: string): Promise<void> {
  try {
    // 由于数据库中没有 download_count 字段，我们暂时跳过这个功能
    // 可以在日志中记录下载，或者使用其他方式统计
    console.log(`Resource ${resourceId} downloaded`)
  } catch (error) {
    console.error('Database error:', error)
    // 不抛出错误，因为这不是关键操作
  }
}

// =============================================
// 资源请求相关操作
// =============================================

export async function createResourceRequest(requestData: {
  resource_name: string
  description?: string
  requester_email: string
  contact_info?: string
}): Promise<ResourceRequest> {
  try {
    // 数据清理和验证
    const sanitizedData = {
      resource_name: sanitizeInput(requestData.resource_name).slice(0, 200),
      description: requestData.description ? sanitizeInput(requestData.description).slice(0, 1000) : null,
      requester_email: sanitizeInput(requestData.requester_email).slice(0, 255),
      contact_info: requestData.contact_info ? sanitizeInput(requestData.contact_info).slice(0, 500) : null,
      priority: 'normal' as const,
      status: 'pending' as const
    }

    const { data, error } = await supabase
      .from('resource_requests')
      .insert(sanitizedData)
      .select()
      .single()

    if (error) {
      console.error('Error creating resource request:', error)
      throw new Error('Failed to create resource request')
    }

    return data
  } catch (error) {
    console.error('Database error:', error)
    throw error
  }
}

export async function getResourceRequests(params: PaginationParams = {}): Promise<{
  requests: ResourceRequest[]
  total: number
  page: number
  limit: number
}> {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      sort = 'created_at',
      order = 'desc'
    } = params

    let query = supabase
      .from('resource_requests')
      .select('*', { count: 'exact' })

    // 搜索过滤
    if (search) {
      const sanitizedSearch = sanitizeInput(search)
      query = query.or(`resource_name.ilike.%${sanitizedSearch}%,requester_email.ilike.%${sanitizedSearch}%`)
    }

    // 排序
    query = query.order(sort, { ascending: order === 'asc' })

    // 分页
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching resource requests:', error)
      throw new Error('Failed to fetch resource requests')
    }

    return {
      requests: data || [],
      total: count || 0,
      page,
      limit
    }
  } catch (error) {
    console.error('Database error:', error)
    throw error
  }
}

// =============================================
// 搜索相关操作
// =============================================

export async function searchResources(query: string, limit: number = 20): Promise<Resource[]> {
  try {
    if (!query.trim()) {
      return []
    }

    const sanitizedQuery = sanitizeInput(query.trim())

    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .or(`title.ilike.%${sanitizedQuery}%,description.ilike.%${sanitizedQuery}%`)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error searching resources:', error)
      throw new Error('Failed to search resources')
    }

    // 为每个资源添加缺失字段的默认值并手动关联分类信息
    const categories = await getCategories()
    const resourcesWithDefaults = (data || []).map(resource => ({
      ...resource,
      view_count: resource.view_count || 0,
      download_count: resource.download_count || 0,
      is_featured: false,
      is_active: resource.is_active !== false,
      category_info: categories.find(cat => cat.name === resource.category)
    }))

    return resourcesWithDefaults
  } catch (error) {
    console.error('Database error:', error)
    throw error
  }
}
