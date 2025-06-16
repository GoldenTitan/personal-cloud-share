import { NextRequest } from 'next/server'
import crypto from 'crypto'

// ===== CSRF 保护 =====

/**
 * 生成CSRF Token
 * @returns CSRF Token
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * 验证CSRF Token
 * @param token 客户端提供的token
 * @param sessionToken 服务端存储的token
 * @returns 是否有效
 */
export function validateCSRFToken(token: string, sessionToken: string): boolean {
  if (!token || !sessionToken) return false
  return crypto.timingSafeEqual(
    Buffer.from(token, 'hex'),
    Buffer.from(sessionToken, 'hex')
  )
}

// ===== 速率限制 =====

interface RateLimitEntry {
  count: number
  resetTime: number
}

// 内存存储（生产环境建议使用Redis）
const rateLimitStore = new Map<string, RateLimitEntry>()

/**
 * 检查速率限制
 * @param identifier 标识符（通常是IP地址）
 * @param limit 限制次数
 * @param windowMs 时间窗口（毫秒）
 * @returns 是否允许请求
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15分钟
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  // 如果没有记录或已过期，创建新记录
  if (!entry || now > entry.resetTime) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + windowMs
    }
    rateLimitStore.set(identifier, newEntry)
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: newEntry.resetTime
    }
  }

  // 检查是否超过限制
  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime
    }
  }

  // 增加计数
  entry.count++
  rateLimitStore.set(identifier, entry)

  return {
    allowed: true,
    remaining: limit - entry.count,
    resetTime: entry.resetTime
  }
}

/**
 * 从请求中获取客户端IP
 * @param request NextRequest对象
 * @returns 客户端IP地址
 */
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const remoteAddr = request.headers.get('remote-addr')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  return realIP || remoteAddr || 'unknown'
}

// ===== 输入白名单验证 =====

/**
 * 验证字符串是否只包含允许的字符
 * @param input 输入字符串
 * @param allowedPattern 允许的字符模式
 * @returns 是否通过验证
 */
export function validateWhitelist(input: string, allowedPattern: RegExp): boolean {
  if (!input || typeof input !== 'string') return false
  return allowedPattern.test(input)
}

/**
 * 预定义的白名单模式
 */
export const WhitelistPatterns = {
  // 用户名：中文、英文、数字、下划线、连字符
  USERNAME: /^[\u4e00-\u9fa5a-zA-Z0-9_-]+$/,
  
  // 邮箱：标准邮箱格式
  EMAIL: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  
  // 分类标识符：小写字母、数字、连字符
  SLUG: /^[a-z0-9-]+$/,
  
  // 标签：中文、英文、数字、空格
  TAG: /^[\u4e00-\u9fa5a-zA-Z0-9\s]+$/,
  
  // 安全文本：中文、英文、数字、常用标点符号
  SAFE_TEXT: /^[\u4e00-\u9fa5a-zA-Z0-9\s.,!?;:()\-_"']+$/,
  
  // URL路径：字母、数字、连字符、下划线、斜杠、点
  URL_PATH: /^[a-zA-Z0-9\-_.\/]+$/
}

// ===== 危险操作检测 =====

/**
 * 检测是否为危险操作
 * @param input 输入内容
 * @returns 检测结果
 */
export function detectDangerousOperation(input: string): {
  isDangerous: boolean
  reasons: string[]
} {
  const reasons: string[] = []
  
  if (!input || typeof input !== 'string') {
    return { isDangerous: false, reasons }
  }
  
  const dangerousPatterns = [
    // SQL注入模式
    { pattern: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi, reason: '包含SQL关键字' },
    
    // 脚本注入模式
    { pattern: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, reason: '包含脚本标签' },
    { pattern: /javascript:/gi, reason: '包含JavaScript协议' },
    { pattern: /vbscript:/gi, reason: '包含VBScript协议' },
    { pattern: /on\w+\s*=/gi, reason: '包含事件处理器' },
    
    // 文件操作模式
    { pattern: /\.\.\//g, reason: '包含路径遍历' },
    { pattern: /\/etc\/passwd/gi, reason: '尝试访问系统文件' },
    
    // 命令注入模式
    { pattern: /[;&|`$(){}[\]]/g, reason: '包含命令注入字符' },
    
    // 其他危险模式
    { pattern: /<iframe\b/gi, reason: '包含iframe标签' },
    { pattern: /<object\b/gi, reason: '包含object标签' },
    { pattern: /<embed\b/gi, reason: '包含embed标签' },
    { pattern: /data:text\/html/gi, reason: '包含HTML数据URI' }
  ]
  
  dangerousPatterns.forEach(({ pattern, reason }) => {
    if (pattern.test(input)) {
      reasons.push(reason)
    }
  })
  
  return {
    isDangerous: reasons.length > 0,
    reasons
  }
}

// ===== 安全日志记录 =====

export interface SecurityLogEntry {
  timestamp: string
  ip: string
  userAgent?: string
  action: string
  resource?: string
  status: 'success' | 'blocked' | 'warning'
  reason?: string
  details?: any
}

/**
 * 记录安全事件
 * @param entry 日志条目
 */
export function logSecurityEvent(entry: SecurityLogEntry): void {
  // 在生产环境中，这里应该写入到日志文件或数据库
  console.log('[SECURITY]', JSON.stringify(entry, null, 2))
}

/**
 * 创建安全日志条目
 * @param request NextRequest对象
 * @param action 操作类型
 * @param status 状态
 * @param options 其他选项
 * @returns 日志条目
 */
export function createSecurityLogEntry(
  request: NextRequest,
  action: string,
  status: 'success' | 'blocked' | 'warning',
  options: {
    resource?: string
    reason?: string
    details?: any
  } = {}
): SecurityLogEntry {
  return {
    timestamp: new Date().toISOString(),
    ip: getClientIP(request),
    userAgent: request.headers.get('user-agent') || undefined,
    action,
    status,
    ...options
  }
}

// ===== 综合安全检查 =====

/**
 * 综合安全检查函数
 * @param input 输入数据
 * @param options 检查选项
 * @returns 检查结果
 */
export function performSecurityCheck(
  input: any,
  options: {
    checkDangerous?: boolean
    checkWhitelist?: RegExp
    maxLength?: number
    required?: boolean
  } = {}
): {
  passed: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []
  
  const {
    checkDangerous = true,
    checkWhitelist,
    maxLength = 1000,
    required = false
  } = options
  
  // 检查是否为空
  if (!input || (typeof input === 'string' && input.trim() === '')) {
    if (required) {
      errors.push('输入不能为空')
    }
    return { passed: errors.length === 0, errors, warnings }
  }
  
  // 转换为字符串进行检查
  const inputStr = typeof input === 'string' ? input : String(input)
  
  // 长度检查
  if (inputStr.length > maxLength) {
    errors.push(`输入长度不能超过${maxLength}个字符`)
  }
  
  // 危险操作检测
  if (checkDangerous) {
    const dangerCheck = detectDangerousOperation(inputStr)
    if (dangerCheck.isDangerous) {
      errors.push(`输入包含危险内容: ${dangerCheck.reasons.join(', ')}`)
    }
  }
  
  // 白名单检查
  if (checkWhitelist && !validateWhitelist(inputStr, checkWhitelist)) {
    errors.push('输入包含不允许的字符')
  }
  
  return {
    passed: errors.length === 0,
    errors,
    warnings
  }
}
