-- 为categories表添加slug字段的迁移脚本
-- 执行时间：2024年

-- 1. 添加slug字段
ALTER TABLE categories ADD COLUMN IF NOT EXISTS slug VARCHAR(100);

-- 2. 为现有数据生成slug值（基于name字段）
UPDATE categories 
SET slug = CASE 
    WHEN name = '电子书籍' THEN 'ebooks'
    WHEN name = '学习资料' THEN 'study'
    WHEN name = '文档资料' THEN 'documents'
    WHEN name = '音乐资源' THEN 'music'
    WHEN name = '视频资源' THEN 'video'
    ELSE LOWER(REPLACE(REPLACE(name, ' ', '-'), '资源', ''))
END
WHERE slug IS NULL;

-- 3. 设置slug字段为NOT NULL和UNIQUE
ALTER TABLE categories ALTER COLUMN slug SET NOT NULL;
ALTER TABLE categories ADD CONSTRAINT categories_slug_unique UNIQUE (slug);

-- 4. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- 5. 验证数据
-- SELECT id, name, slug, description FROM categories ORDER BY name;
