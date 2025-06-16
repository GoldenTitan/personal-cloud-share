# Supabase 数据连接设置指南

## 🔧 问题诊断

您遇到的问题是网站显示的是模拟数据，而不是从Supabase数据库中获取的真实数据。

## ✅ 已完成的修复

我已经修改了以下文件来连接Supabase：

1. **ResourceGrid.tsx** - 现在从Supabase获取数据
2. **database.ts** - 添加了tags字段处理
3. **page.tsx** - 添加了搜索和分类状态管理

## 🚀 测试步骤

### 1. 确保Node.js版本正确
```bash
# 检查Node.js版本
node --version

# 如果版本低于18.18.0，请升级
# 使用nvm (推荐)
nvm install 20
nvm use 20

# 或从官网下载: https://nodejs.org/
```

### 2. 验证环境变量
检查 `.env.local` 文件是否包含正确的Supabase配置：
```env
NEXT_PUBLIC_SUPABASE_URL=https://gouutuihaizvkounahog.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. 启动开发服务器
```bash
cd personal-cloud-share
npm install
npm run dev
```

### 4. 测试Supabase连接
访问: http://localhost:3000/api/test-connection

应该返回类似这样的JSON：
```json
{
  "success": true,
  "message": "Supabase connection successful",
  "resourceCount": 10,
  "sampleData": [...]
}
```

## 🔍 数据格式检查

### Supabase中的tags字段格式
如果您在Supabase中导入数据时，tags字段是逗号分隔的字符串（如："JavaScript,前端开发,编程"），代码会自动将其转换为数组格式。

### 支持的tags格式：
- ✅ 字符串格式: `"JavaScript,前端开发,编程"`
- ✅ 数组格式: `["JavaScript", "前端开发", "编程"]`

## 🛠️ 故障排除

### 问题1: 页面显示"获取资源失败"
**原因**: Supabase连接问题
**解决方案**:
1. 检查环境变量是否正确
2. 确认Supabase项目是否正常运行
3. 检查网络连接

### 问题2: 数据显示但tags不正确
**原因**: tags字段格式问题
**解决方案**:
1. 在Supabase中检查tags字段的数据格式
2. 确保tags是逗号分隔的字符串或JSON数组

### 问题3: 搜索和筛选不工作
**原因**: 组件状态传递问题
**解决方案**:
1. 检查浏览器控制台的错误信息
2. 确认SearchBar和CategoryFilter组件正确传递参数

## 📊 数据库表结构验证

确保Supabase中的表结构正确：

### resources表字段：
- `id` (UUID, Primary Key)
- `title` (Text)
- `description` (Text)
- `link` (Text)
- `category` (Text)
- `tags` (Text 或 Text[])
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### 检查RLS策略
确保在Supabase中启用了正确的Row Level Security策略：
```sql
-- 允许公共读取
CREATE POLICY "Allow public read access on resources" ON resources
    FOR SELECT USING (true);
```

## 🔄 实时调试

### 1. 打开浏览器开发者工具
- 按F12或右键 → 检查
- 切换到Console标签

### 2. 查看网络请求
- 切换到Network标签
- 刷新页面
- 查看是否有API请求失败

### 3. 检查控制台日志
ResourceGrid组件现在会输出调试信息：
```
正在获取资源... {category: "all", searchQuery: ""}
获取到的资源数据: [...]
```

## 📞 获取帮助

如果问题仍然存在，请提供以下信息：
1. 浏览器控制台的错误信息
2. Network标签中的API请求状态
3. Supabase项目的表结构截图
4. 环境变量配置（隐藏敏感信息）

## 🎯 预期结果

修复完成后，您应该看到：
1. ✅ 网站显示从Supabase导入的真实资源数据
2. ✅ 搜索功能正常工作
3. ✅ 分类筛选正常工作
4. ✅ 复制链接功能正常工作
5. ✅ Toast通知正常显示
