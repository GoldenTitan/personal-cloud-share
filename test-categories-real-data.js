// 测试分类数据是否正确加载
const { createClient } = require('@supabase/supabase-js')

// 从环境变量读取配置
const supabaseUrl = 'https://gouutuihaizvkounahog.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvdXV0dWloYWl6dmtvdW5haG9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNjI4MDUsImV4cCI6MjA2NTYzODgwNX0.5j-aLM3tMjzFIxH5p0IS-nQZqYzn7tue1fFiGYzKta0'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testCategories() {
  try {
    console.log('🔍 测试分类数据加载...')
    
    // 获取分类数据
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    if (error) {
      console.error('❌ 获取分类数据失败:', error)
      return
    }
    
    console.log('✅ 分类数据加载成功!')
    console.log('📊 分类数量:', categories.length)
    console.log('📋 分类列表:')
    
    categories.forEach((category, index) => {
      console.log(`  ${index + 1}. ${category.name} (${category.slug})`)
      if (category.description) {
        console.log(`     描述: ${category.description}`)
      }
    })
    
    // 测试资源数据中的分类字段
    console.log('\n🔍 检查资源数据中的分类使用情况...')
    const { data: resources, error: resourceError } = await supabase
      .from('resources')
      .select('category')
    
    if (resourceError) {
      console.error('❌ 获取资源数据失败:', resourceError)
      return
    }
    
    const categoryUsage = {}
    resources.forEach(resource => {
      if (resource.category) {
        categoryUsage[resource.category] = (categoryUsage[resource.category] || 0) + 1
      }
    })
    
    console.log('📈 分类使用统计:')
    Object.entries(categoryUsage).forEach(([category, count]) => {
      const categoryInfo = categories.find(cat => cat.slug === category)
      const categoryName = categoryInfo ? categoryInfo.name : '未知分类'
      console.log(`  ${category} (${categoryName}): ${count} 个资源`)
    })
    
    // 检查是否有不匹配的分类
    const validSlugs = categories.map(cat => cat.slug)
    const invalidCategories = Object.keys(categoryUsage).filter(cat => !validSlugs.includes(cat))
    
    if (invalidCategories.length > 0) {
      console.log('\n⚠️  发现无效的分类标识符:')
      invalidCategories.forEach(cat => {
        console.log(`  - ${cat} (在资源中使用但在分类表中不存在)`)
      })
    } else {
      console.log('\n✅ 所有资源的分类标识符都有效!')
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error)
  }
}

testCategories()
