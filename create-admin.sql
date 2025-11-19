-- Create admin user for Salin
INSERT INTO users (id, username, password_hash, role, display_name, created_at, updated_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'admin',
  '$2b$10$N6/3QI8qMo4aFQAsAPDE1ORAJsTwYTjv5jLVPvc8o7QbtqQBdLcIm',
  'ADMIN',
  'Administrator',
  datetime('now'),
  datetime('now')
);

-- Create default categories
INSERT INTO categories (id, name, color, icon, created_at) VALUES
  ('cat-1', 'School', '#3b82f6', '🎓', datetime('now')),
  ('cat-2', 'Work', '#8b5cf6', '💼', datetime('now')),
  ('cat-3', 'Hobbies', '#ec4899', '🎨', datetime('now')),
  ('cat-4', 'Home', '#10b981', '🏠', datetime('now')),
  ('cat-5', 'Health', '#f59e0b', '💪', datetime('now')),
  ('cat-6', 'Shopping', '#06b6d4', '🛒', datetime('now')),
  ('cat-7', 'Other', '#6366f1', '📌', datetime('now'));
