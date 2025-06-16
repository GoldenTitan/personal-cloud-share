import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Categories API is working!' })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'POST method is working!' }, { status: 201 })
}
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Categories API is working!' })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'POST method is working!' }, { status: 201 })
}
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Categories API is working!' })
}

export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限（检查请求头中的认证信息）
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
    const sanitizedCategory = {
      name: sanitizeInput(name),
      description: description ? sanitizeInput(description) : '',
      slug: sanitizeInput(slug)
    }

    const category = await createCategory(sanitizedCategory)

    return NextResponse.json({ category }, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)

    // 检查是否是权限错误
    if (error instanceof Error && error.message.includes('管理员权限')) {
      return NextResponse.json(
        { error: 'Admin authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const categories = await getCategories()
    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限（检查请求头中的认证信息）
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
    const sanitizedCategory = {
      name: sanitizeInput(name),
      description: description ? sanitizeInput(description) : '',
      slug: sanitizeInput(slug)
    }

    const category = await createCategory(sanitizedCategory)

    return NextResponse.json({ category }, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)

    // 检查是否是权限错误
    if (error instanceof Error && error.message.includes('管理员权限')) {
      return NextResponse.json(
        { error: 'Admin authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
