// 测试分类数据获取的简单脚本
const { createClient } = require('@supabase/supabase-js')

// 从环境变量读取配置
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('缺少Supabase配置')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testCategories() {
  try {
    console.log('正在测试分类数据获取...')
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    if (error) {
      console.error('获取分类失败:', error)
      return
    }
    
    console.log('获取到的分类数据:')
    console.log(JSON.stringify(data, null, 2))
    
    if (data.length === 0) {
      console.log('数据库中没有分类数据，可能需要导入CSV文件')
    }
    
  } catch (error) {
    console.error('测试失败:', error)
  }
}

testCategories()
