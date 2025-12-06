-- Use the quickshrink database
USE quickshrink;

-- Option 1: DELETE all records (slower but can be rolled back)
-- DELETE FROM links;

-- Option 2: TRUNCATE table (faster, resets AUTO_INCREMENT, cannot be rolled back)
TRUNCATE TABLE links;

-- Verify the table is empty
SELECT COUNT(*) AS total_records FROM links;

