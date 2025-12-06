-- Use the quickshrink database
USE quickshrink;

-- Create the links table if it doesn't exist
CREATE TABLE IF NOT EXISTS links (
  id INT AUTO_INCREMENT PRIMARY KEY,
  original_url TEXT NOT NULL,
  short_code VARCHAR(100) NULL UNIQUE,
  qr_code MEDIUMTEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  clicks INT DEFAULT 0,
  last_visited TIMESTAMP NULL,
  expires_at DATETIME NULL,
  password VARCHAR(255) NULL,
  INDEX idx_short_code (short_code),
  INDEX idx_created_at (created_at)
);

-- Modify qr_code to MEDIUMTEXT if it's not already (safe to run multiple times)
ALTER TABLE links MODIFY qr_code MEDIUMTEXT;

