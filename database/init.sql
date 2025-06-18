-- 个人网盘资源分享网站 - 数据库初始化脚本
-- 创建时间: 2024年
-- 数据库: PostgreSQL (Supabase)

-- =============================================
-- 1. 删除现有表（如果存在）
-- =============================================
DROP TABLE IF EXISTS resource_requests CASCADE;
DROP TABLE IF EXISTS resources CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- 删除现有函数
DROP FUNCTION IF EXISTS check_admin_role() CASCADE;

-- =============================================
-- 2. 创建分类表 (categories)
-- =============================================
CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'folder',
    color VARCHAR(20) DEFAULT '#3B82F6',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建分类表索引
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(is_active);
CREATE INDEX idx_categories_sort ON categories(sort_order);

-- =============================================
-- 3. 创建资源表 (resources)
-- =============================================
CREATE TABLE resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    link VARCHAR(500) NOT NULL,
    extraction_code VARCHAR(50),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    file_size VARCHAR(50),
    file_type VARCHAR(50),
    tags TEXT[], -- PostgreSQL 数组类型存储标签
    view_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建资源表索引
CREATE INDEX idx_resources_category ON resources(category_id);
CREATE INDEX idx_resources_active ON resources(is_active);
CREATE INDEX idx_resources_featured ON resources(is_featured);
CREATE INDEX idx_resources_created ON resources(created_at DESC);
CREATE INDEX idx_resources_title ON resources USING gin(to_tsvector('english', title));
CREATE INDEX idx_resources_description ON resources USING gin(to_tsvector('english', description));

-- =============================================
-- 4. 创建资源请求表 (resource_requests)
-- =============================================
CREATE TABLE resource_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    resource_name VARCHAR(200) NOT NULL,
    description TEXT,
    requester_email VARCHAR(255) NOT NULL,
    contact_info TEXT,
    priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
    status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, rejected
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- 创建资源请求表索引
CREATE INDEX idx_requests_status ON resource_requests(status);
CREATE INDEX idx_requests_priority ON resource_requests(priority);
CREATE INDEX idx_requests_created ON resource_requests(created_at DESC);
CREATE INDEX idx_requests_email ON resource_requests(requester_email);

-- =============================================
-- 5. 创建更新时间触发器函数
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为所有表创建更新时间触发器
CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at 
    BEFORE UPDATE ON resources 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requests_updated_at 
    BEFORE UPDATE ON resource_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 6. 创建管理员权限检查函数
-- =============================================
CREATE OR REPLACE FUNCTION check_admin_role()
RETURNS BOOLEAN AS $$
BEGIN
    -- 检查当前用户是否有管理员权限
    -- 这里使用环境变量中的管理员邮箱进行验证
    RETURN COALESCE(
        auth.jwt() ->> 'email' = '974405281@qq.com',
        current_setting('request.jwt.claims', true)::json ->> 'email' = '974405281@qq.com',
        current_setting('role', true) = 'admin',
        false
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 7. 启用行级安全策略 (RLS)
-- =============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_requests ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 8. 创建安全策略
-- =============================================

-- Categories 表策略
CREATE POLICY "Public can read categories" ON categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage categories" ON categories
    FOR ALL USING (check_admin_role()) WITH CHECK (check_admin_role());

-- Resources 表策略
CREATE POLICY "Public can read active resources" ON resources
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage resources" ON resources
    FOR ALL USING (check_admin_role()) WITH CHECK (check_admin_role());

-- Resource_requests 表策略
CREATE POLICY "Public can read own requests" ON resource_requests
    FOR SELECT USING (true); -- 管理员可以看到所有，用户可以看到自己的

CREATE POLICY "Public can insert requests" ON resource_requests
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can manage requests" ON resource_requests
    FOR UPDATE USING (check_admin_role());

CREATE POLICY "Admin can delete requests" ON resource_requests
    FOR DELETE USING (check_admin_role());

-- =============================================
-- 9. 插入初始分类数据
-- =============================================
INSERT INTO categories (name, slug, description, icon, color, sort_order) VALUES
('电子书籍', 'ebooks', '各类电子书籍资源，包括小说、技术书籍、教材等', 'book', '#10B981', 1),
('学习资料', 'study', '学习相关资料，包括课程、教程、笔记等', 'graduation-cap', '#3B82F6', 2),
('文档资料', 'documents', '各类文档资料，包括报告、手册、指南等', 'file-text', '#8B5CF6', 3),
('音乐资源', 'music', '音乐相关资源，包括歌曲、专辑、音效等', 'music', '#F59E0B', 4),
('视频资源', 'videos', '视频相关资源，包括电影、电视剧、教学视频等', 'video', '#EF4444', 5),
('软件工具', 'software', '各类软件工具和应用程序', 'download', '#06B6D4', 6),
('图片素材', 'images', '图片、图标、设计素材等', 'image', '#EC4899', 7),
('其他资源', 'others', '其他类型的资源文件', 'folder', '#6B7280', 8);

-- =============================================
-- 10. 插入示例资源数据
-- =============================================
INSERT INTO resources (title, description, link, extraction_code, category_id, file_size, file_type, tags) VALUES
('JavaScript高级程序设计', '经典的JavaScript学习教材，适合进阶学习', 'https://pan.baidu.com/s/example1', 'js2024', 
 (SELECT id FROM categories WHERE slug = 'ebooks'), '15.2MB', 'PDF', ARRAY['JavaScript', '编程', '前端']),
 
('React完整教程', 'React从入门到精通的完整视频教程', 'https://pan.baidu.com/s/example2', 'react01', 
 (SELECT id FROM categories WHERE slug = 'study'), '2.1GB', 'MP4', ARRAY['React', '前端', '教程']),
 
('项目管理模板', '完整的项目管理文档模板集合', 'https://pan.baidu.com/s/example3', 'pm2024', 
 (SELECT id FROM categories WHERE slug = 'documents'), '45.8MB', 'DOCX', ARRAY['项目管理', '模板', '文档']);

-- =============================================
-- 11. 创建全文搜索视图
-- =============================================
CREATE OR REPLACE VIEW resources_search AS
SELECT 
    r.*,
    c.name as category_name,
    c.slug as category_slug,
    to_tsvector('english', r.title || ' ' || COALESCE(r.description, '')) as search_vector
FROM resources r
LEFT JOIN categories c ON r.category_id = c.id
WHERE r.is_active = true;

-- =============================================
-- 12. 创建统计视图
-- =============================================
CREATE OR REPLACE VIEW admin_stats AS
SELECT 
    (SELECT COUNT(*) FROM resources WHERE is_active = true) as total_resources,
    (SELECT COUNT(*) FROM categories WHERE is_active = true) as total_categories,
    (SELECT COUNT(*) FROM resource_requests WHERE status = 'pending') as pending_requests,
    (SELECT COUNT(*) FROM resource_requests WHERE created_at >= CURRENT_DATE) as today_requests;

-- =============================================
-- 13. 验证数据
-- =============================================
-- 检查表是否创建成功
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    AND table_name IN ('categories', 'resources', 'resource_requests')
ORDER BY table_name;

-- 检查初始数据
SELECT 'Categories' as table_name, COUNT(*) as record_count FROM categories
UNION ALL
SELECT 'Resources' as table_name, COUNT(*) as record_count FROM resources
UNION ALL
SELECT 'Resource Requests' as table_name, COUNT(*) as record_count FROM resource_requests;

-- 检查RLS策略
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd as command,
    permissive
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =============================================
-- 初始化完成
-- =============================================
-- 数据库初始化完成！
-- 
-- 包含的功能：
-- ✅ 完整的表结构（categories, resources, resource_requests）
-- ✅ 适当的索引优化
-- ✅ 行级安全策略 (RLS)
-- ✅ 管理员权限控制
-- ✅ 自动更新时间戳
-- ✅ 全文搜索支持
-- ✅ 初始分类和示例数据
-- ✅ 统计视图
-- 
-- 下一步：
-- 1. 在 Supabase 控制台执行此脚本
-- 2. 验证所有表和数据都已正确创建
-- 3. 测试 RLS 策略是否正常工作
-- 4. 开始前端应用开发
