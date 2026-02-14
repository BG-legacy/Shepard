-- Sample data for Church Care App
-- This script creates sample users, members, events, attendance, and tasks for testing

-- Create sample users (passwords are 'password123' for all)
-- Password hash for 'password123'
INSERT INTO users (email, password_hash, role) VALUES
  ('admin@church.com', '$2b$10$H4v448iXCMKnhPrnOSfv7OHEl2TLO5CZ7IOBsDxlMh0dMqfBXGyIm', 'admin'),
  ('leader@church.com', '$2b$10$r/p6UnyQ98jksGjtq7Kbue38DsAN4Y.FemmLSezHWzvtcX1leNBea', 'leader'),
  ('volunteer@church.com', '$2b$10$sQyArm1ky6htX5f9/awW..tcf.4W9lhkkAQPLfrjMrR5zji8s5VpO', 'volunteer')
ON CONFLICT (email) DO NOTHING;

-- Create sample members
INSERT INTO members (first_name, last_name, email, phone, address, birth_date, join_date, notes) VALUES
  ('John', 'Smith', 'john.smith@email.com', '555-0101', '123 Main St, Springfield', '1985-03-15', '2023-01-10', 'Active member, helps with youth ministry'),
  ('Mary', 'Johnson', 'mary.johnson@email.com', '555-0102', '456 Oak Ave, Springfield', '1990-07-22', '2023-02-15', 'Choir member, great singer'),
  ('David', 'Williams', 'david.williams@email.com', '555-0103', '789 Pine Rd, Springfield', '1978-11-30', '2023-03-20', 'Helps with maintenance and repairs'),
  ('Sarah', 'Brown', 'sarah.brown@email.com', '555-0104', '321 Elm St, Springfield', '1995-05-08', '2023-04-05', 'Youth group volunteer'),
  ('Michael', 'Davis', 'michael.davis@email.com', '555-0105', '654 Maple Dr, Springfield', '1982-09-14', '2023-05-12', 'Sunday school teacher'),
  ('Jennifer', 'Wilson', 'jennifer.wilson@email.com', '555-0106', '987 Cedar Ln, Springfield', '1988-12-25', '2023-06-18', 'Hospitality team lead'),
  ('Robert', 'Moore', 'robert.moore@email.com', '555-0107', '147 Birch Way, Springfield', '1975-02-28', '2022-08-22', 'Elder board member'),
  ('Lisa', 'Taylor', 'lisa.taylor@email.com', '555-0108', '258 Spruce Ct, Springfield', '1992-06-17', '2023-09-30', 'Prayer ministry coordinator'),
  ('James', 'Anderson', 'james.anderson@email.com', '555-0109', '369 Willow Ave, Springfield', '1980-04-03', '2023-10-15', 'Missions committee member'),
  ('Patricia', 'Thomas', 'patricia.thomas@email.com', '555-0110', '741 Ash Blvd, Springfield', '1987-08-19', '2023-11-25', 'Children\'s ministry volunteer')
ON CONFLICT DO NOTHING;

-- Create sample events
INSERT INTO events (title, description, event_date, location, created_by) VALUES
  ('Sunday Service', 'Weekly worship service', TIMESTAMP '2024-12-01 10:00:00', 'Main Sanctuary', 1),
  ('Bible Study', 'Wednesday evening Bible study', TIMESTAMP '2024-12-04 19:00:00', 'Fellowship Hall', 1),
  ('Youth Group', 'Friday youth gathering', TIMESTAMP '2024-12-06 18:00:00', 'Youth Room', 1),
  ('Prayer Meeting', 'Tuesday morning prayer', TIMESTAMP '2024-12-03 06:30:00', 'Prayer Chapel', 2),
  ('Community Outreach', 'Saturday community service', TIMESTAMP '2024-12-07 09:00:00', 'Community Center', 2),
  ('Worship Practice', 'Choir and band rehearsal', TIMESTAMP '2024-11-28 19:30:00', 'Main Sanctuary', 2)
ON CONFLICT DO NOTHING;

-- Create sample attendance (for recent events)
-- Note: Replace event_id and member_id with actual IDs from your database
INSERT INTO attendance (event_id, member_id, checked_in_by, checked_in_at) VALUES
  (1, 1, 1, TIMESTAMP '2024-12-01 10:05:00'),
  (1, 2, 1, TIMESTAMP '2024-12-01 10:07:00'),
  (1, 3, 1, TIMESTAMP '2024-12-01 10:12:00'),
  (1, 4, 1, TIMESTAMP '2024-12-01 10:08:00'),
  (1, 5, 1, TIMESTAMP '2024-12-01 10:15:00'),
  (2, 1, 1, TIMESTAMP '2024-12-04 19:05:00'),
  (2, 2, 1, TIMESTAMP '2024-12-04 19:10:00'),
  (2, 6, 1, TIMESTAMP '2024-12-04 19:03:00'),
  (3, 4, 2, TIMESTAMP '2024-12-06 18:05:00'),
  (3, 1, 2, TIMESTAMP '2024-12-06 18:12:00')
ON CONFLICT (event_id, member_id) DO NOTHING;

-- Create sample care tasks
INSERT INTO care_tasks (member_id, title, description, status, priority, assigned_to, due_date, created_by) VALUES
  (1, 'Hospital Visit', 'Follow up after surgery', 'pending', 'high', 2, CURRENT_DATE + 2, 1),
  (2, 'Welcome Call', 'New member welcome call', 'in_progress', 'medium', 2, CURRENT_DATE + 5, 1),
  (3, 'Prayer Request Follow-up', 'Check on family situation', 'completed', 'medium', 2, CURRENT_DATE - 2, 1),
  (5, 'Birthday Card', 'Send birthday greeting', 'pending', 'low', 3, CURRENT_DATE + 10, 2),
  (7, 'Counseling Appointment', 'Schedule meeting with pastor', 'in_progress', 'high', 1, CURRENT_DATE + 3, 1),
  (9, 'Meal Delivery', 'Coordinate meal train', 'pending', 'high', 2, CURRENT_DATE + 1, 2)
ON CONFLICT DO NOTHING;

-- Create sample care notes
INSERT INTO care_notes (member_id, task_id, note, created_by) VALUES
  (1, 1, 'Called to schedule visit. Surgery went well, recovering at home.', 1),
  (2, 2, 'Left voicemail, waiting for callback.', 2),
  (3, 3, 'Spoke with family, situation improving. Continuing prayer.', 2),
  (5, NULL, 'Expressed interest in joining the choir.', 1),
  (7, 5, 'Appointment scheduled for next Tuesday at 3 PM.', 1)
ON CONFLICT DO NOTHING;

-- Display summary
SELECT 'Sample data inserted successfully!' as status;
SELECT 'Users created: ' || COUNT(*) FROM users;
SELECT 'Members created: ' || COUNT(*) FROM members;
SELECT 'Events created: ' || COUNT(*) FROM events;
SELECT 'Attendance records: ' || COUNT(*) FROM attendance;
SELECT 'Care tasks created: ' || COUNT(*) FROM care_tasks;
SELECT 'Care notes created: ' || COUNT(*) FROM care_notes;
