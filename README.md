# 个人网盘资源分享网站

一个功能完整的个人网盘资源分享网站，支持资源浏览、搜索、分类管理和用户请求功能。

## ✨ 功能特性

### 用户功能
- 🔍 **资源浏览** - 以卡片形式展示各类资源
- 🔎 **智能搜索** - 支持关键词搜索资源标题和描述
- 📂 **分类筛选** - 按电子书籍、学习资料等分类筛选
- 📋 **一键复制** - 快速复制网盘资源链接
- 📝 **资源请求** - 提交资源需求和联系邮箱

### 管理员功能
- 🔐 **隐蔽登录** - 通过管理员按钮进入后台
- ➕ **资源管理** - 添加、编辑、删除资源
- 🏷️ **分类管理** - 设置和管理资源分类
- 📊 **请求管理** - 查看和处理用户资源请求
- 🛡️ **安全防护** - 内置SQL注入和XSS防护

### 设计特点
- 🎨 **现代化UI** - 使用渐变、阴影和卡片设计
- 📱 **响应式布局** - 完美适配各种屏幕尺寸
- 🔔 **交互反馈** - 操作成功/失败通知
- 🎯 **直观分类** - 清晰的资源分类系统

## 🛠️ 技术栈

- **前端框架**: Next.js 15 + React 19
- **样式方案**: Tailwind CSS + shadcn/ui
- **数据库**: Supabase (PostgreSQL)
- **认证系统**: Supabase Auth
- **部署平台**: Vercel + Cloudflare
- **开发语言**: TypeScript

## 🚀 快速开始

### 环境要求
- Node.js 18.18.0 或更高版本
- npm 或 yarn 包管理器

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd personal-cloud-share
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
复制 `.env.local` 文件并填入你的配置：
```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 文件：
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Admin Configuration
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_password_here
```

4. **设置数据库**
在 Supabase 控制台中执行 `database/init.sql` 脚本

5. **启动开发服务器**
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看网站

## 📦 部署指南

### Vercel 部署

1. **连接 GitHub**
   - 将代码推送到 GitHub 仓库
   - 在 Vercel 中导入项目

2. **配置环境变量**
   在 Vercel 项目设置中添加环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`

3. **部署**
   Vercel 会自动构建和部署项目

### Cloudflare 防护配置

1. **添加域名到 Cloudflare**
2. **启用安全功能**：
   - WAF (Web Application Firewall)
   - DDoS 防护
   - Bot 管理
   - 速率限制

## 🔧 项目结构

```
personal-cloud-share/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── admin/          # 管理员页面
│   │   ├── globals.css     # 全局样式
│   │   ├── layout.tsx      # 根布局
│   │   └── page.tsx        # 首页
│   ├── components/         # React 组件
│   │   ├── ui/            # shadcn/ui 组件
│   │   ├── Header.tsx     # 头部组件
│   │   ├── SearchBar.tsx  # 搜索栏
│   │   ├── CategoryFilter.tsx # 分类筛选
│   │   ├── ResourceGrid.tsx   # 资源网格
│   │   └── ResourceRequestForm.tsx # 资源请求表单
│   └── lib/               # 工具库
│       ├── supabase.ts    # Supabase 客户端
│       ├── database.ts    # 数据库操作
│       └── utils.ts       # 工具函数
├── database/
│   └── init.sql           # 数据库初始化脚本
├── public/                # 静态资源
└── vercel.json           # Vercel 配置
```

## 🔒 安全特性

- **输入验证**: 所有用户输入都经过验证和清理
- **SQL注入防护**: 使用参数化查询
- **XSS防护**: 输入清理和CSP头部
- **CSRF防护**: 内置CSRF令牌
- **速率限制**: 防止暴力攻击
- **安全头部**: 完整的安全HTTP头部配置

## 📝 使用说明

### 普通用户
1. 访问网站首页浏览资源
2. 使用搜索框查找特定资源
3. 点击分类按钮筛选资源
4. 点击"复制链接"获取资源链接
5. 在页面底部提交资源请求

### 管理员
1. 点击右上角"管理"按钮登录
2. 在管理后台添加、编辑、删除资源
3. 查看和处理用户资源请求
4. 管理资源分类

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
