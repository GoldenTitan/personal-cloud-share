import { NextRequest, NextResponse } from 'next/server'
import { getResources, createResource } from '@/lib/database'
import { sanitizeInput } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const resources = await getResources()
    return NextResponse.json({ resources })
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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
    const sanitizedResource = {
      title: sanitizeInput(title),
      description: sanitizeInput(description),
      link: sanitizeInput(link),
      category: sanitizeInput(category),
      tags: Array.isArray(tags) ? tags.map(tag => sanitizeInput(tag)) : []
    }

    const resource = await createResource(sanitizedResource)

    return NextResponse.json({ resource }, { status: 201 })
  } catch (error) {
    console.error('Error creating resource:', error)

    // 检查是否是权限错误
    if (error instanceof Error && error.message.includes('管理员权限')) {
      return NextResponse.json(
        { error: 'Admin authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    )
  }
}
