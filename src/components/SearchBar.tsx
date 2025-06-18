'use client'

import { useState, useCallback } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { debounce } from '@/lib/utils'

interface SearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
  className?: string
  defaultValue?: string
}

export function SearchBar({ 
  onSearch, 
  placeholder = "搜索资源...", 
  className = "",
  defaultValue = ""
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)

  // 防抖搜索函数
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      onSearch?.(searchQuery)
    }, 300),
    [onSearch]
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    debouncedSearch(value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="pl-10 pr-4 py-3 w-full bg-white shadow-sm border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength={100}
        />
      </div>
    </form>
  )
}
