import { NextRequest, NextResponse } from 'next/server'
import { getResourceById, updateResource, deleteResource } from '@/lib/database'
import { sanitizeInput } from '@/lib/utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resource = await getResourceById(params.id)
    return NextResponse.json({ resource })
  } catch (error) {
    console.error('Error fetching resource:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resource' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证管理员权限
    const adminToken = request.headers.get('x-admin-auth')
    if (!adminToken || adminToken !== 'admin-authenticated') {
      return NextResponse.json(
        { error: 'Admin authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, link, category, tags } = body

    // 验证必填字段
    if (!title || !description || !link || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 清理输入数据
    const sanitizedUpdates = {
      title: sanitizeInput(title),
      description: sanitizeInput(description),
      link: sanitizeInput(link),
      category: sanitizeInput(category),
      tags: Array.isArray(tags) ? tags.map(tag => sanitizeInput(tag)) : []
    }

    const resource = await updateResource(params.id, sanitizedUpdates)

    return NextResponse.json({ resource })
  } catch (error) {
    console.error('Error updating resource:', error)
    
    // 检查是否是权限错误
    if (error instanceof Error && error.message.includes('管理员权限')) {
      return NextResponse.json(
        { error: 'Admin authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update resource' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证管理员权限
    const adminToken = request.headers.get('x-admin-auth')
    if (!adminToken || adminToken !== 'admin-authenticated') {
      return NextResponse.json(
        { error: 'Admin authentication required' },
        { status: 401 }
      )
    }

    await deleteResource(params.id)
    return NextResponse.json({ message: 'Resource deleted successfully' })
  } catch (error) {
    console.error('Error deleting resource:', error)
    
    // 检查是否是权限错误
    if (error instanceof Error && error.message.includes('管理员权限')) {
      return NextResponse.json(
        { error: 'Admin authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to delete resource' },
      { status: 500 }
    )
  }
}
