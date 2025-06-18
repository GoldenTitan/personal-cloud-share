/**
 * 安全相关函数库
 * 包含输入验证、清理和安全检查功能
 */

// =============================================
// 输入清理和验证
// =============================================

/**
 * 清理用户输入，防止XSS攻击
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }

  return input
    .trim()
    .replace(/[<>]/g, '') // 移除尖括号
    .replace(/javascript:/gi, '') // 移除javascript协议
    .replace(/on\w+=/gi, '') // 移除事件处理器
    .replace(/script/gi, '') // 移除script标签
}

/**
 * 验证邮箱格式
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 255
}

/**
 * 验证URL格式
 */
export function validateUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return ['http:', 'https:'].includes(urlObj.protocol)
  } catch {
    return false
  }
}

/**
 * 验证UUID格式
 */
export function validateUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

/**
 * 验证文件大小字符串格式
 */
export function validateFileSize(size: string): boolean {
  const sizeRegex = /^\d+(\.\d+)?\s*(B|KB|MB|GB|TB)$/i
  return sizeRegex.test(size) && size.length <= 20
}

/**
 * 验证文件类型
 */
export function validateFileType(type: string): boolean {
  const allowedTypes = [
    'PDF', 'DOC', 'DOCX', 'XLS', 'XLSX', 'PPT', 'PPTX',
    'TXT', 'RTF', 'ZIP', 'RAR', '7Z',
    'MP4', 'AVI', 'MKV', 'MOV', 'WMV',
    'MP3', 'WAV', 'FLAC', 'AAC',
    'JPG', 'JPEG', 'PNG', 'GIF', 'BMP', 'SVG',
    'EXE', 'MSI', 'DMG', 'APK'
  ]
  return allowedTypes.includes(type.toUpperCase()) && type.length <= 10
}

// =============================================
// 内容过滤
// =============================================

/**
 * 检查内容是否包含敏感词
 */
export function containsSensitiveContent(content: string): boolean {
  const sensitiveWords = [
    // 这里可以添加敏感词列表
    'virus', 'malware', 'hack', 'crack',
    '病毒', '木马', '破解', '盗版'
  ]
  
  const lowerContent = content.toLowerCase()
  return sensitiveWords.some(word => lowerContent.includes(word.toLowerCase()))
}

/**
 * 过滤HTML标签
 */
export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

/**
 * 转义HTML特殊字符
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }
  
  return text.replace(/[&<>"']/g, (char) => map[char])
}

// =============================================
// 速率限制
// =============================================

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

/**
 * 检查速率限制
 */
export function checkRateLimit(
  identifier: string, 
  maxRequests: number = 10, 
  windowMs: number = 60000
): boolean {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)
  
  if (!entry || now > entry.resetTime) {
    // 新的时间窗口
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    })
    return true
  }
  
  if (entry.count >= maxRequests) {
    return false // 超过限制
  }
  
  entry.count++
  return true
}

/**
 * 清理过期的速率限制记录
 */
export function cleanupRateLimit(): void {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

// =============================================
// 管理员验证
// =============================================

/**
 * 验证管理员凭据
 */
export function validateAdminCredentials(email: string, password: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD
  
  if (!adminEmail || !adminPassword) {
    console.error('Admin credentials not configured')
    return false
  }
  
  return email === adminEmail && password === adminPassword
}

/**
 * 生成安全的会话令牌
 */
export function generateSessionToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// =============================================
// 数据验证规则
// =============================================

export const ValidationRules = {
  // 资源相关
  resourceTitle: {
    minLength: 1,
    maxLength: 200,
    required: true
  },
  resourceDescription: {
    minLength: 0,
    maxLength: 1000,
    required: false
  },
  resourceLink: {
    minLength: 10,
    maxLength: 500,
    required: true,
    pattern: /^https?:\/\/.+/
  },
  extractionCode: {
    minLength: 0,
    maxLength: 50,
    required: false,
    pattern: /^[a-zA-Z0-9]*$/
  },
  
  // 分类相关
  categoryName: {
    minLength: 1,
    maxLength: 100,
    required: true
  },
  categorySlug: {
    minLength: 1,
    maxLength: 100,
    required: true,
    pattern: /^[a-z0-9-]+$/
  },
  
  // 请求相关
  requestResourceName: {
    minLength: 1,
    maxLength: 200,
    required: true
  },
  requestDescription: {
    minLength: 0,
    maxLength: 1000,
    required: false
  },
  requesterEmail: {
    minLength: 5,
    maxLength: 255,
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  contactInfo: {
    minLength: 0,
    maxLength: 500,
    required: false
  }
}

/**
 * 验证字段值
 */
export function validateField(
  value: string, 
  rules: typeof ValidationRules.resourceTitle
): { valid: boolean; error?: string } {
  if (rules.required && (!value || value.trim().length === 0)) {
    return { valid: false, error: '此字段为必填项' }
  }
  
  if (value && value.length < rules.minLength) {
    return { valid: false, error: `最少需要 ${rules.minLength} 个字符` }
  }
  
  if (value && value.length > rules.maxLength) {
    return { valid: false, error: `最多允许 ${rules.maxLength} 个字符` }
  }
  
  if (rules.pattern && value && !rules.pattern.test(value)) {
    return { valid: false, error: '格式不正确' }
  }
  
  return { valid: true }
}

// 定期清理速率限制记录
if (typeof window === 'undefined') {
  // 仅在服务器端运行
  setInterval(cleanupRateLimit, 300000) // 每5分钟清理一次
}
