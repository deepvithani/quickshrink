-- Use the quickshrink database
USE quickshrink;

-- Modify original_url to allow NULL (safe to run multiple times)
ALTER TABLE links MODIFY original_url TEXT NULL;

-- Modify short_code to allow NULL (safe to run multiple times)
ALTER TABLE links MODIFY short_code VARCHAR(100) NULL;


