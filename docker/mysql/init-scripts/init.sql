CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Prompts table
CREATE TABLE IF NOT EXISTS prompts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    variables JSON NOT NULL,  -- Массив переменных в формате JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Many-to-Many relationship between Prompts and Tags
CREATE TABLE IF NOT EXISTS prompt_tags (
    prompt_id INT NOT NULL,
    tag_id INT NOT NULL,
    FOREIGN KEY (prompt_id) REFERENCES prompts(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (prompt_id, tag_id)
) ENGINE=InnoDB;

-- Many-to-Many relationship between Templates and Prompts (assumed prompts are related to templates)
CREATE TABLE IF NOT EXISTS template_prompts (
    template_id INT NOT NULL,
    prompt_id INT NOT NULL,
    `order` INT DEFAULT 0,
    FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE,
    FOREIGN KEY (prompt_id) REFERENCES prompts(id) ON DELETE CASCADE,
    PRIMARY KEY (template_id, prompt_id)
) ENGINE=InnoDB;

-- Foreign key relations on update, ensure correct integrity across all relations

-- ==========================
-- Вставка данных
-- ==========================

-- Добавление тегов
INSERT IGNORE INTO tags (name) VALUES
('AI'), ('Copywriting'), ('Marketing'), ('SEO'), ('Social Media'),
('Email'), ('Technical'), ('Creative');

-- Добавление промптов
INSERT IGNORE INTO prompts (name, content, variables, created_at, updated_at) VALUES
('Product Description',
 'Write a compelling product description for {{ product_name }} by {{ company_name }}. The target audience is {{ target_audience }}. Key features include: {{ key_features }}. Use a {{ tone }} tone.',
 '[{"id": "1", "name": "product_name"}, {"id": "2", "name": "company_name"}, {"id": "3", "name": "target_audience"}, {"id": "4", "name": "key_features"}, {"id": "5", "name": "tone"}]',
 NOW(), NOW()),

('Blog Post Outline',
 'Create an outline for a blog post about {{ product_name }}. The post should be approximately {{ word_count }} words and target {{ target_audience }}.',
 '[{"id": "1", "name": "product_name"}, {"id": "3", "name": "target_audience"}, {"id": "6", "name": "word_count"}]',
 NOW(), NOW()),

('Social Media Post',
 'Write a {{ tone }} social media post for {{ company_name }} promoting {{ product_name }}. Highlight these features: {{ key_features }}.',
 '[{"id": "1", "name": "product_name"}, {"id": "2", "name": "company_name"}, {"id": "3", "name": "key_features"}, {"id": "5", "name": "tone"}]',
 NOW(), NOW()),

('Email Newsletter',
 'Draft an email newsletter for {{ company_name }} announcing {{ product_name }}. The email should be in a {{ tone }} tone and highlight the following features: {{ key_features }}.',
 '[{"id": "1", "name": "product_name"}, {"id": "2", "name": "company_name"}, {"id": "3", "name": "key_features"}, {"id": "5", "name": "tone"}]',
 NOW(), NOW()),

('Technical Documentation',
 'Create technical documentation for {{ product_name }}. Include the following features and specifications: {{ key_features }}.',
 '[{"id": "1", "name": "product_name"}, {"id": "3", "name": "key_features"}]',
 NOW(), NOW()),

('Creative Story',
 'Write a creative story about {{ product_name }} in a {{ tone }} style. The story should appeal to {{ target_audience }} and be approximately {{ word_count }} words.',
 '[{"id": "1", "name": "product_name"}, {"id": "3", "name": "target_audience"}, {"id": "5", "name": "tone"}, {"id": "6", "name": "word_count"}]',
 NOW(), NOW());

-- Привязка тегов к промптам
INSERT IGNORE INTO prompt_tags (prompt_id, tag_id) VALUES
(1, 2), (1, 3),  -- Product Description (Copywriting, Marketing)
(2, 2), (2, 4),  -- Blog Post Outline (Copywriting, SEO)
(3, 2), (3, 5),  -- Social Media Post (Copywriting, Social Media)
(4, 2), (4, 6),  -- Email Newsletter (Copywriting, Email)
(5, 7),          -- Technical Documentation (Technical)
(6, 8);          -- Creative Story (Creative)

-- Добавление шаблонов
INSERT IGNORE INTO templates (name, description, created_at, updated_at) VALUES
('Marketing Campaign',
 'Complete marketing campaign template with product description, blog post, and social media content.',
 NOW(), NOW()),

('Product Launch',
 'Template for launching a new product with technical documentation and email announcement.',
 NOW(), NOW());

-- Привязка промптов к шаблонам
INSERT IGNORE INTO template_prompts (template_id, prompt_id, `order`) VALUES
(1, 1, 1), (1, 2, 2), (1, 3, 3),  -- Marketing Campaign
(2, 5, 1), (2, 4, 2);              -- Product Launch

-- ==========================
-- Завершение
-- ==========================
COMMIT;