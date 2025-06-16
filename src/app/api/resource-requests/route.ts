import { NextRequest, NextResponse } from 'next/server'
import { createResourceRequest } from '@/lib/database'
import { sanitizeInput, isValidEmail } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, description } = body

    // 验证必填字段
    if (!name || !email || !description) {
      return NextResponse.json(
        { error: '请填写所有必填字段' },
        { status: 400 }
      )
    }

    // 验证邮箱格式
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
        { status: 400 }
      )
    }

    // 验证字段长度
    if (name.length > 50) {
      return NextResponse.json(
        { error: '姓名不能超过50个字符' },
        { status: 400 }
      )
    }

    if (description.length > 500) {
      return NextResponse.json(
        { error: '描述不能超过500个字符' },
        { status: 400 }
      )
    }

    // 清理输入数据
    const sanitizedRequest = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      description: sanitizeInput(description)
    }

    const resourceRequest = await createResourceRequest(sanitizedRequest)

    return NextResponse.json({ 
      message: '资源请求提交成功',
      request: resourceRequest 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating resource request:', error)
    return NextResponse.json(
      { error: '提交失败，请重试' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const adminToken = request.headers.get('x-admin-auth')
    if (!adminToken || adminToken !== 'admin-authenticated') {
      return NextResponse.json(
        { error: 'Admin authentication required' },
        { status: 401 }
      )
    }

    // 这里可以添加获取所有资源请求的逻辑
    // const requests = await getResourceRequests()
    
    return NextResponse.json({ requests: [] })
  } catch (error) {
    console.error('Error fetching resource requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resource requests' },
      { status: 500 }
    )
  }
}
