import { supabase, type Resource, type Category, type ResourceRequest } from './supabase'
import { sanitizeInput } from './utils'

// 资源相关操作
export async function getResources(): Promise<Resource[]> {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching resources:', error)
    throw new Error('Failed to fetch resources')
  }

  return data || []
}

export async function getResourceById(id: string): Promise<Resource | null> {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching resource:', error)
    throw new Error('Failed to fetch resource')
  }

  return data
}

export async function createResource(resource: Omit<Resource, 'id' | 'created_at' | 'updated_at'>): Promise<Resource> {
  const { data, error } = await supabase
    .from('resources')
    .insert([resource])
    .select()
    .single()

  if (error) {
    console.error('Error creating resource:', error)
    throw new Error('Failed to create resource')
  }

  return data
}

export async function updateResource(id: string, updates: Partial<Resource>): Promise<Resource> {
  const { data, error } = await supabase
    .from('resources')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating resource:', error)
    throw new Error('Failed to update resource')
  }

  return data
}

export async function deleteResource(id: string): Promise<void> {
  const { error } = await supabase
    .from('resources')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting resource:', error)
    throw new Error('Failed to delete resource')
  }
}

// 分类相关操作
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    throw new Error('Failed to fetch categories')
  }

  return data || []
}

export async function createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .insert([category])
    .select()
    .single()

  if (error) {
    console.error('Error creating category:', error)
    throw new Error('Failed to create category')
  }

  return data
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating category:', error)
    throw new Error('Failed to update category')
  }

  return data
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting category:', error)
    throw new Error('Failed to delete category')
  }
}

// 资源请求相关操作
export async function createResourceRequest(request: Omit<ResourceRequest, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<ResourceRequest> {
  const sanitizedRequest = {
    name: sanitizeInput(request.name),
    email: sanitizeInput(request.email),
    description: sanitizeInput(request.description),
    status: 'pending' as const
  }

  const { data, error } = await supabase
    .from('resource_requests')
    .insert([sanitizedRequest])
    .select()
    .single()

  if (error) {
    console.error('Error creating resource request:', error)
    throw new Error('Failed to create resource request')
  }

  return data
}
