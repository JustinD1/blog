ALTER TABLE posts
ADD COLUMN uuid CHAR(8) NOT NULL UNIQUE AFTER id,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created,
ADD COLUMN publish_at DATETIME NULL AFTER updated_at,
ADD COLUMN is_draft TINYINT(1) NOT NULL DEFAULT 0;
