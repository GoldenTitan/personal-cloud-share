import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并 Tailwind CSS 类名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 格式化日期
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }
  
  return dateObj.toLocaleDateString('zh-CN', defaultOptions)
}

/**
 * 格式化相对时间
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return '刚刚'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}分钟前`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}小时前`
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}天前`
  } else {
    return formatDate(dateObj)
  }
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number | string): string {
  if (typeof bytes === 'string') {
    return bytes // 如果已经是字符串格式，直接返回
  }
  
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 生成随机字符串
 */
export function generateRandomString(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * 复制文本到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // 降级方案
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      const success = document.execCommand('copy')
      document.body.removeChild(textArea)
      return success
    }
  } catch (error) {
    console.error('Failed to copy text:', error)
    return false
  }
}

/**
 * 验证邮箱格式
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证URL格式
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 截断文本
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * 生成slug（URL友好的字符串）
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-') // 替换空格和特殊字符为连字符
    .replace(/^-+|-+$/g, '') // 移除开头和结尾的连字符
}

/**
 * 解析网盘分享文本
 * 例如：通过网盘分享的文件：JavaScript高级程序设计 链接: https://pan.baidu.com/s/example 提取码: js2024
 */
export function parseShareText(text: string): {
  title?: string
  link?: string
  extractionCode?: string
} {
  const result: { title?: string; link?: string; extractionCode?: string } = {}
  
  // 匹配标题
  const titleMatch = text.match(/(?:通过网盘分享的文件：|文件名：|标题：)([^链接]+)/i)
  if (titleMatch) {
    result.title = titleMatch[1].trim()
  }
  
  // 匹配链接
  const linkMatch = text.match(/(?:链接[:：]\s*)(https?:\/\/[^\s]+)/i)
  if (linkMatch) {
    result.link = linkMatch[1].trim()
  }
  
  // 匹配提取码
  const codeMatch = text.match(/(?:提取码[:：]\s*)([a-zA-Z0-9]+)/i)
  if (codeMatch) {
    result.extractionCode = codeMatch[1].trim()
  }
  
  return result
}

/**
 * 获取文件类型图标
 */
export function getFileTypeIcon(fileType?: string): string {
  if (!fileType) return 'file'
  
  const type = fileType.toLowerCase()
  
  if (type.includes('pdf')) return 'file-text'
  if (type.includes('doc') || type.includes('docx')) return 'file-text'
  if (type.includes('xls') || type.includes('xlsx')) return 'file-spreadsheet'
  if (type.includes('ppt') || type.includes('pptx')) return 'presentation'
  if (type.includes('zip') || type.includes('rar') || type.includes('7z')) return 'archive'
  if (type.includes('mp4') || type.includes('avi') || type.includes('mkv')) return 'video'
  if (type.includes('mp3') || type.includes('wav') || type.includes('flac')) return 'music'
  if (type.includes('jpg') || type.includes('png') || type.includes('gif')) return 'image'
  if (type.includes('exe') || type.includes('msi')) return 'download'
  
  return 'file'
}

/**
 * 安全的JSON解析
 */
export function safeJsonParse<T>(json: string, defaultValue: T): T {
  try {
    return JSON.parse(json)
  } catch {
    return defaultValue
  }
}

/**
 * 延迟函数
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 获取随机颜色
 */
export function getRandomColor(): string {
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#06B6D4', '#EC4899', '#6B7280'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
