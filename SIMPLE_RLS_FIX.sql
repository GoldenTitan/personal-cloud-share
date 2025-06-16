-- 🔐 简单而安全的RLS策略
-- 这个方案允许所有人查询，但只有通过特定方式才能进行增删改操作

-- 1. 删除所有现有策略
DROP POLICY IF EXISTS "Allow public read access on resources" ON resources;
DROP POLICY IF EXISTS "Allow public read access on categories" ON categories;
DROP POLICY IF EXISTS "Allow public insert on resource_requests" ON resource_requests;
DROP POLICY IF EXISTS "Allow admin full access on resources" ON resources;
DROP POLICY IF EXISTS "Allow admin full access on categories" ON categories;
DROP POLICY IF EXISTS "Allow admin full access on resource_requests" ON resource_requests;
DROP POLICY IF EXISTS "Allow anonymous insert on resources" ON resources;
DROP POLICY IF EXISTS "Allow anonymous update on resources" ON resources;
DROP POLICY IF EXISTS "Allow anonymous delete on resources" ON resources;
DROP POLICY IF EXISTS "Allow all operations on resources" ON resources;
DROP POLICY IF EXISTS "Allow all operations on categories" ON categories;
DROP POLICY IF EXISTS "Allow all operations on resource_requests" ON resource_requests;
DROP POLICY IF EXISTS "Public read resources" ON resources;
DROP POLICY IF EXISTS "Public read categories" ON categories;
DROP POLICY IF EXISTS "Allow all resource operations" ON resources;
DROP POLICY IF EXISTS "Allow all category operations" ON categories;
DROP POLICY IF EXISTS "Allow all request operations" ON resource_requests;
DROP POLICY IF EXISTS "Anyone can read resources" ON resources;
DROP POLICY IF EXISTS "Only admin can insert resources" ON resources;
DROP POLICY IF EXISTS "Only admin can update resources" ON resources;
DROP POLICY IF EXISTS "Only admin can delete resources" ON resources;
DROP POLICY IF EXISTS "Anyone can read categories" ON categories;
DROP POLICY IF EXISTS "Only admin can manage categories" ON categories;
DROP POLICY IF EXISTS "Anyone can read requests" ON resource_requests;
DROP POLICY IF EXISTS "Anyone can insert requests" ON resource_requests;
DROP POLICY IF EXISTS "Only admin can update requests" ON resource_requests;
DROP POLICY IF EXISTS "Only admin can delete requests" ON resource_requests;

-- 2. 创建管理员检查函数
CREATE OR REPLACE FUNCTION check_admin_role()
RETURNS BOOLEAN AS $$
BEGIN
  -- 检查当前用户是否有管理员角色
  -- 这里我们使用一个简单的方法：检查用户的email
  RETURN auth.jwt() ->> 'email' = '974405281@qq.com' 
         OR current_setting('request.jwt.claims', true)::json ->> 'email' = '974405281@qq.com'
         OR current_setting('role', true) = 'admin';
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Resources表策略
-- 所有人可以读取资源
CREATE POLICY "Public can read resources" ON resources
    FOR SELECT USING (true);

-- 管理员可以进行所有操作
CREATE POLICY "Admin can manage resources" ON resources
    FOR ALL USING (check_admin_role()) WITH CHECK (check_admin_role());

-- 4. Categories表策略
-- 所有人可以读取分类
CREATE POLICY "Public can read categories" ON categories
    FOR SELECT USING (true);

-- 管理员可以管理分类
CREATE POLICY "Admin can manage categories" ON categories
    FOR ALL USING (check_admin_role()) WITH CHECK (check_admin_role());

-- 5. Resource_requests表策略
-- 所有人可以读取和插入资源请求
CREATE POLICY "Public can read requests" ON resource_requests
    FOR SELECT USING (true);

CREATE POLICY "Public can insert requests" ON resource_requests
    FOR INSERT WITH CHECK (true);

-- 管理员可以更新和删除资源请求
CREATE POLICY "Admin can update requests" ON resource_requests
    FOR UPDATE USING (check_admin_role());

CREATE POLICY "Admin can delete requests" ON resource_requests
    FOR DELETE USING (check_admin_role());

-- 6. 启用RLS
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_requests ENABLE ROW LEVEL SECURITY;

-- 7. 测试查询（可选）
-- 测试读取操作（应该成功）
SELECT COUNT(*) FROM resources;
SELECT COUNT(*) FROM categories;
SELECT COUNT(*) FROM resource_requests;
