import { NextRequest, NextResponse } from 'next/server'
import { updateCategory, deleteCategory } from '@/lib/database'
import { sanitizeInput } from '@/lib/utils'

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
    const { name, description, slug } = body

    // 验证必填字段
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // 清理输入数据
    const sanitizedUpdates = {
      name: sanitizeInput(name),
      description: description ? sanitizeInput(description) : '',
      slug: sanitizeInput(slug)
    }

    const category = await updateCategory(params.id, sanitizedUpdates)

    return NextResponse.json({ category })
  } catch (error) {
    console.error('Error updating category:', error)
    
    // 检查是否是权限错误
    if (error instanceof Error && error.message.includes('管理员权限')) {
      return NextResponse.json(
        { error: 'Admin authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update category' },
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

    await deleteCategory(params.id)
    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    
    // 检查是否是权限错误
    if (error instanceof Error && error.message.includes('管理员权限')) {
      return NextResponse.json(
        { error: 'Admin authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
