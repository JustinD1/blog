CREATE TABLE posts (
       id BIGINT AUTO_INCREMENT PRIMARY KEY,
       title VARCHAR(255) NOT NULL,
       content TEXT NOT NULL,
       author VARCHAR(255) NOT NULL,
       count BIGINT DEFAULT 0,
       created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
       id BIGINT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(100) NOT NULL,
       slugify VARCHAR(100) NOT NULL
);

CREATE TABLE tagged (
       id BIGINT AUTO_INCREMENT PRIMARY KEY,
       post_id BIGINT,
       tag_id BIGINT,
       INDEX idx_post_id (post_id),
       INDEX idx_tag_id (tag_id),
       CONSTRAINT fk_post FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
       CONSTRAINT fk_tag FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
);
