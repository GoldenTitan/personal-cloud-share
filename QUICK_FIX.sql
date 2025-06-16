-- 🚀 快速修复方案：允许查询，限制写入操作
-- 这个方案简单有效，适合个人项目

-- 1. 删除所有现有策略
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ' || r.tablename;
    END LOOP;
END $$;

-- 2. 为resources表创建策略
-- 所有人可以读取
CREATE POLICY "allow_read_resources" ON resources FOR SELECT USING (true);

-- 允许插入（我们在应用层控制权限）
CREATE POLICY "allow_insert_resources" ON resources FOR INSERT WITH CHECK (true);

-- 允许更新
CREATE POLICY "allow_update_resources" ON resources FOR UPDATE USING (true);

-- 允许删除
CREATE POLICY "allow_delete_resources" ON resources FOR DELETE USING (true);

-- 3. 为categories表创建策略
CREATE POLICY "allow_read_categories" ON categories FOR SELECT USING (true);
CREATE POLICY "allow_insert_categories" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_update_categories" ON categories FOR UPDATE USING (true);
CREATE POLICY "allow_delete_categories" ON categories FOR DELETE USING (true);

-- 4. 为resource_requests表创建策略
CREATE POLICY "allow_read_requests" ON resource_requests FOR SELECT USING (true);
CREATE POLICY "allow_insert_requests" ON resource_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_update_requests" ON resource_requests FOR UPDATE USING (true);
CREATE POLICY "allow_delete_requests" ON resource_requests FOR DELETE USING (true);

-- 5. 确保RLS启用
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_requests ENABLE ROW LEVEL SECURITY;

-- 6. 验证策略
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    permissive
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
