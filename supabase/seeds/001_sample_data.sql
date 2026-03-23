-- Sample data for Cleaning Buddy

-- Note: This seed file assumes you're running it with a specific user context
-- You'll need to replace the UUIDs with actual user IDs from your auth system

-- Sample categories
INSERT INTO categories (id, name, description, color, icon, user_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Kitchen', 'Kitchen cleaning tasks', '#EF4444', 'chef-hat', '550e8400-e29b-41d4-a716-446655440000'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Bathroom', 'Bathroom cleaning tasks', '#3B82F6', 'droplets', '550e8400-e29b-41d4-a716-446655440000'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Living Room', 'Living room cleaning tasks', '#10B981', 'sofa', '550e8400-e29b-41d4-a716-446655440000'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Bedroom', 'Bedroom cleaning tasks', '#8B5CF6', 'bed', '550e8400-e29b-41d4-a716-446655440000'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Outdoor', 'Outdoor and yard work', '#F59E0B', 'tree', '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT DO NOTHING;

-- Sample tasks
INSERT INTO tasks (id, title, description, category_id, user_id, priority, status, due_date, estimated_duration, recurring, recurring_pattern) VALUES
  ('650e8400-e29b-41d4-a716-446655440001', 'Clean kitchen counters', 'Wipe down all kitchen countertops and backsplash', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'medium', 'pending', NOW() + INTERVAL '1 day', 15, true, '{"frequency": "daily", "days": ["monday", "wednesday", "friday"]}'),
  ('650e8400-e29b-41d4-a716-446655440002', 'Clean bathroom mirror', 'Clean and polish the bathroom mirror', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'low', 'pending', NOW() + INTERVAL '2 days', 5, true, '{"frequency": "weekly", "day": "sunday"}'),
  ('650e8400-e29b-41d4-a716-446655440003', 'Vacuum living room', 'Vacuum all carpets and rugs in the living room', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'medium', 'pending', NOW() + INTERVAL '3 days', 30, true, '{"frequency": "weekly", "day": "saturday"}'),
  ('650e8400-e29b-41d4-a716-446655440004', 'Change bed sheets', 'Remove and wash all bed linens', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'medium', 'pending', NOW() + INTERVAL '7 days', 20, true, '{"frequency": "biweekly"}'),
  ('650e8400-e29b-41d4-a716-446655440005', 'Mow the lawn', 'Mow the front and back lawn', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 'high', 'pending', NOW() + INTERVAL '5 days', 60, true, '{"frequency": "weekly", "day": "saturday"}'),
  ('650e8400-e29b-41d4-a716-446655440006', 'Clean microwave', 'Clean the inside and outside of the microwave', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'low', 'pending', NOW() + INTERVAL '10 days', 10, true, '{"frequency": "monthly", "day": 1}'),
  ('650e8400-e29b-41d4-a716-446655440007', 'Organize closet', 'Organize and declutter the bedroom closet', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'low', 'pending', NOW() + INTERVAL '14 days', 45, false, null),
  ('650e8400-e29b-41d4-a716-446655440008', 'Clean toilet', 'Clean and disinfect the toilet', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'high', 'pending', NOW() + INTERVAL '1 day', 15, true, '{"frequency": "weekly", "day": "sunday"}')
ON CONFLICT DO NOTHING;

-- Sample task instances (for the next week)
INSERT INTO task_instances (task_id, scheduled_date, status) VALUES
  ('650e8400-e29b-41d4-a716-446655440001', CURRENT_DATE + INTERVAL '1 day', 'pending'),
  ('650e8400-e29b-41d4-a716-446655440002', CURRENT_DATE + INTERVAL '2 days', 'pending'),
  ('650e8400-e29b-41d4-a716-446655440003', CURRENT_DATE + INTERVAL '3 days', 'pending'),
  ('650e8400-e29b-41d4-a716-446655440008', CURRENT_DATE + INTERVAL '1 day', 'pending')
ON CONFLICT DO NOTHING;
