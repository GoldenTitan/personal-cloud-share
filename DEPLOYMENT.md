# 部署指南

## 🚀 快速部署

### 前置要求
- Node.js 18.18.0 或更高版本
- Supabase 账户
- Vercel 账户（可选）
- Cloudflare 账户（可选，用于CDN和安全防护）

## 📋 部署步骤

### 1. 升级 Node.js
```bash
# 使用 nvm 升级 Node.js
nvm install 20
nvm use 20

# 或者从官网下载最新版本
# https://nodejs.org/
```

### 2. 设置 Supabase 数据库

1. **创建 Supabase 项目**
   - 访问 [supabase.com](https://supabase.com)
   - 创建新项目
   - 记录项目URL和anon key

2. **初始化数据库**
   - 在 Supabase 控制台的 SQL Editor 中
   - 执行 `database/init.sql` 文件中的所有SQL语句

3. **配置环境变量**
   ```bash
   cp .env.local.example .env.local
   ```
   
   编辑 `.env.local`：
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ADMIN_EMAIL=admin@yourdomain.com
   ADMIN_PASSWORD=your-secure-password
   ```

### 3. 本地开发测试

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建项目
npm run build

# 启动生产服务器
npm start
```

### 4. Vercel 部署

1. **推送代码到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/personal-cloud-share.git
   git push -u origin main
   ```

2. **在 Vercel 中导入项目**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "New Project"
   - 导入 GitHub 仓库

3. **配置环境变量**
   在 Vercel 项目设置中添加：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`

4. **部署**
   Vercel 会自动构建和部署

### 5. Cloudflare 配置（可选但推荐）

1. **添加域名**
   - 在 Cloudflare 中添加你的域名
   - 更新 DNS 记录指向 Vercel

2. **启用安全功能**
   - WAF (Web Application Firewall)
   - DDoS 防护
   - Bot 管理
   - 速率限制规则

3. **性能优化**
   - 启用 Brotli 压缩
   - 设置缓存规则
   - 启用 HTTP/3

## 🔧 配置说明

### 环境变量
| 变量名 | 描述 | 必需 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | ✅ |
| `ADMIN_EMAIL` | 管理员邮箱 | ✅ |
| `ADMIN_PASSWORD` | 管理员密码 | ✅ |

### Supabase 配置
- 确保启用了 Row Level Security (RLS)
- 配置正确的安全策略
- 设置适当的索引以提高性能

### 安全配置
- 使用强密码作为管理员密码
- 在生产环境中启用 HTTPS
- 配置 Cloudflare 安全规则
- 定期更新依赖包

## 🛠️ 故障排除

### 常见问题

1. **Node.js 版本错误**
   ```
   Error: Node.js version "^18.18.0 || ^19.8.0 || >= 20.0.0" is required
   ```
   **解决方案**: 升级 Node.js 到 18.18.0 或更高版本

2. **Supabase 连接失败**
   ```
   Error: Failed to fetch resources
   ```
   **解决方案**: 检查环境变量配置和网络连接

3. **构建失败**
   ```
   Error: Module not found
   ```
   **解决方案**: 运行 `npm install` 重新安装依赖

4. **管理员登录失败**
   ```
   Error: Invalid credentials
   ```
   **解决方案**: 检查 `ADMIN_EMAIL` 和 `ADMIN_PASSWORD` 环境变量

### 性能优化

1. **数据库优化**
   - 确保所有必要的索引都已创建
   - 定期清理过期数据
   - 监控查询性能

2. **前端优化**
   - 启用图片优化
   - 使用代码分割
   - 配置适当的缓存策略

3. **CDN 配置**
   - 使用 Cloudflare 或其他 CDN
   - 配置静态资源缓存
   - 启用压缩

## 📊 监控和维护

### 日志监控
- 使用 Vercel Analytics 监控性能
- 配置 Supabase 日志监控
- 设置错误报告

### 定期维护
- 更新依赖包
- 备份数据库
- 检查安全漏洞
- 监控资源使用情况

## 🔒 安全最佳实践

1. **密码安全**
   - 使用强密码
   - 定期更换密码
   - 考虑使用双因素认证

2. **数据库安全**
   - 启用 RLS
   - 定期审查权限
   - 监控异常访问

3. **应用安全**
   - 保持依赖更新
   - 使用 HTTPS
   - 配置安全头部

4. **监控安全**
   - 设置异常访问警报
   - 监控登录尝试
   - 定期安全审计
