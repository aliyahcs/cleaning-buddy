-- Cleaning Buddy Seed Data

-- 1. Cleaner Categories
INSERT INTO cleaner_categories (category_id, name, min_score, max_score, default_message) VALUES
(1, 'Minimalist Maintainer', 0, 20, 'You prefer a clean but minimal approach to cleaning'),
(2, 'Casual Cleaner', 21, 40, 'You like to keep things tidy without being too strict'),
(3, 'Routine Ready', 41, 60, 'You have a solid cleaning routine and stick to it'),
(4, 'Neat Freak', 61, 80, 'You take pride in maintaining a spotless living space'),
(5, 'Spotless Specialist', 81, 100, 'You are a cleaning expert who maintains perfection');

-- 2. Dwelling Types
INSERT INTO dwelling_types (dwelling_type_id, name, description) VALUES
(1, 'Apartment', 'Multi-unit residential dwelling with shared walls'),
(2, 'House', 'Single-family residential dwelling'),
(3, 'Studio', 'Single-room living space with combined areas');

-- 3. Rooms
INSERT INTO rooms (room_id, name, description) VALUES
(1, 'Kitchen', 'Food preparation and dining area'),
(2, 'Bathroom', 'Personal hygiene and grooming space'),
(3, 'Bedroom', 'Sleeping and personal space'),
(4, 'Living Room', 'Common gathering and relaxation area'),
(5, 'Laundry', 'Clothing washing and care area');

-- 4. Task Templates for Each Room

-- Kitchen Tasks (11 tasks)
INSERT INTO task_templates (room_id, task_name, description, display_order) VALUES
(1, 'Wipe down counter tops', 'Clean and disinfect all kitchen counter surfaces', 1),
(1, 'Clean out refrigerator', 'Remove old food and wipe down interior shelves', 2),
(1, 'Wipe down stove', 'Clean stove top and control knobs', 3),
(1, 'Clean oven', 'Deep clean oven interior and racks', 4),
(1, 'Wash dishes', 'Clean all dirty dishes and put away', 5),
(1, 'Wipe down walls', 'Clean kitchen walls and remove splatters', 6),
(1, 'Sweep floor', 'Sweep kitchen floor to remove debris', 7),
(1, 'Mop floors', 'Mop kitchen floor with appropriate cleaner', 8),
(1, 'Clean microwave', 'Clean microwave interior and exterior', 9),
(1, 'Clean cabinet under sink', 'Organize and clean under-sink cabinet', 10),
(1, 'Take out trash/recyclables', 'Empty kitchen trash and recycling bins', 11);

-- Bathroom Tasks (7 tasks)
INSERT INTO task_templates (room_id, task_name, description, display_order) VALUES
(2, 'Clean toilet', 'Clean and disinfect toilet bowl, seat, and tank', 1),
(2, 'Clean bathtub/shower', 'Scrub and clean bathtub or shower surfaces', 2),
(2, 'Sweep floor', 'Sweep bathroom floor to remove hair and debris', 3),
(2, 'Mop floor', 'Mop bathroom floor with disinfectant', 4),
(2, 'Clean mirror', 'Wipe down and polish bathroom mirror', 5),
(2, 'Clean sink and countertop', 'Clean and disinfect sink and counter surfaces', 6),
(2, 'Clean cabinet under sink', 'Organize and clean bathroom storage cabinet', 7);

-- Bedroom Tasks (8 tasks)
INSERT INTO task_templates (room_id, task_name, description, display_order) VALUES
(3, 'Make bed', 'Arrange bedding neatly and pillows', 1),
(3, 'Vacuum', 'Vacuum bedroom floor and under furniture', 2),
(3, 'Clean window seals', 'Wipe down window seals and tracks', 3),
(3, 'Clean baseboards', 'Dust and clean bedroom baseboards', 4),
(3, 'Remove dishes/debris', 'Remove any dishes or trash from bedroom', 5),
(3, 'Dust', 'Dust all surfaces including furniture', 6),
(3, 'Clean off dresser', 'Organize and clean dresser top', 7),
(3, 'Clean windowsill', 'Wipe down and clean bedroom windowsill', 8);

-- Living Room Tasks (5 tasks)
INSERT INTO task_templates (room_id, task_name, description, display_order) VALUES
(4, 'Vacuum floor', 'Vacuum living room carpet or floors', 1),
(4, 'Wipe down furniture with pledge', 'Clean and polish wooden furniture surfaces', 2),
(4, 'Dust', 'Dust all surfaces including shelves and decorations', 3),
(4, 'Discard debris', 'Pick up and discard any trash or clutter', 4),
(4, 'Clean windowsill', 'Wipe down living room windowsills', 5);

-- Laundry Tasks (5 tasks)
INSERT INTO task_templates (room_id, task_name, description, display_order) VALUES
(5, 'Separate clothes', 'Sort laundry by color and fabric type', 1),
(5, 'Wash whites', 'Wash white clothes with appropriate settings', 2),
(5, 'Wash colors', 'Wash colored clothes with appropriate settings', 3),
(5, 'Fold clothes', 'Fold all clean laundry neatly', 4),
(5, 'Put clothes away', 'Put folded clothes in proper drawers/closets', 5);

-- 5. Quiz Questions with Answer Options

-- Question 1: How often do you want to vacuum or sweep floors?
INSERT INTO quiz_questions (question_id, question_text, display_order, is_active) VALUES
(1, 'How often do you want to vacuum or sweep floors?', 1, TRUE);

INSERT INTO quiz_answer_options (option_id, question_id, option_text, score_value, display_order) VALUES
(1, 1, 'Daily', 100, 1),
(2, 1, '2-3 times per week', 75, 2),
(3, 1, 'Once a week', 50, 3),
(4, 1, 'Every 2 weeks', 25, 4),
(5, 1, 'Monthly or less', 0, 5);

-- Question 2: How often do you want to clean bathroom?
INSERT INTO quiz_questions (question_id, question_text, display_order, is_active) VALUES
(2, 'How often do you want to clean bathroom?', 2, TRUE);

INSERT INTO quiz_answer_options (option_id, question_id, option_text, score_value, display_order) VALUES
(6, 2, 'Daily', 100, 1),
(7, 2, '2-3 times per week', 75, 2),
(8, 2, 'Once a week', 50, 3),
(9, 2, 'Every 2 weeks', 25, 4),
(10, 2, 'Monthly', 0, 5);

-- Question 3: How often do you want to wipe down kitchen counters/stove?
INSERT INTO quiz_questions (question_id, question_text, display_order, is_active) VALUES
(3, 'How often do you want to wipe down kitchen counters/stove?', 3, TRUE);

INSERT INTO quiz_answer_options (option_id, question_id, option_text, score_value, display_order) VALUES
(11, 3, 'After every use', 100, 1),
(12, 3, 'Daily', 75, 2),
(13, 3, '2-3 times per week', 50, 3),
(14, 3, 'Once a week', 25, 4),
(15, 3, 'Monthly', 0, 5);

-- Question 4: How often do you want to do dishes?
INSERT INTO quiz_questions (question_id, question_text, display_order, is_active) VALUES
(4, 'How often do you want to do dishes?', 4, TRUE);

INSERT INTO quiz_answer_options (option_id, question_id, option_text, score_value, display_order) VALUES
(16, 4, 'After every meal', 100, 1),
(17, 4, 'Daily', 75, 2),
(18, 4, 'Once a day', 50, 3),
(19, 4, 'Every 2 days', 25, 4),
(20, 4, 'Weekly', 0, 5);

-- Question 5: How often do you want to take out trash/recycling?
INSERT INTO quiz_questions (question_id, question_text, display_order, is_active) VALUES
(5, 'How often do you want to take out trash/recycling?', 5, TRUE);

INSERT INTO quiz_answer_options (option_id, question_id, option_text, score_value, display_order) VALUES
(21, 5, 'Daily', 100, 1),
(22, 5, 'Every 2-3 days', 75, 2),
(23, 5, 'Weekly', 50, 3),
(24, 5, 'Every 2 weeks', 25, 4),
(25, 5, 'Monthly', 0, 5);

-- Question 6: How quickly does clutter bother you?
INSERT INTO quiz_questions (question_id, question_text, display_order, is_active) VALUES
(6, 'How quickly does clutter bother you?', 6, TRUE);

INSERT INTO quiz_answer_options (option_id, question_id, option_text, score_value, display_order) VALUES
(26, 6, 'Immediately - I clean it right away', 100, 1),
(27, 6, 'Within a few hours', 75, 2),
(28, 6, 'By the end of the day', 50, 3),
(29, 6, 'Within a day or two', 25, 4),
(30, 6, 'It doesn''t bother me much', 0, 5);

-- Question 7: How often do you want to change bedding?
INSERT INTO quiz_questions (question_id, question_text, display_order, is_active) VALUES
(7, 'How often do you want to change bedding?', 7, TRUE);

INSERT INTO quiz_answer_options (option_id, question_id, option_text, score_value, display_order) VALUES
(31, 7, 'Weekly', 100, 1),
(32, 7, 'Every 2 weeks', 75, 2),
(33, 7, 'Monthly', 50, 3),
(34, 7, 'Every 6 weeks', 25, 4),
(35, 7, 'Every 3 months', 0, 5);

-- Question 8: How often do you want to do laundry?
INSERT INTO quiz_questions (question_id, question_text, display_order, is_active) VALUES
(8, 'How often do you want to do laundry?', 8, TRUE);

INSERT INTO quiz_answer_options (option_id, question_id, option_text, score_value, display_order) VALUES
(36, 8, '2-3 times per week', 100, 1),
(37, 8, 'Weekly', 75, 2),
(38, 8, 'Every 2 weeks', 50, 3),
(39, 8, 'Monthly', 25, 4),
(40, 8, 'When I run out of clothes', 0, 5);

-- 6. Cleaning Tips
INSERT INTO cleaning_tips (tip_id, title, tip_text, display_order) VALUES
(1, 'Dust before sweeping', 'Always dust surfaces before sweeping or vacuuming to avoid spreading dust around', 1),
(2, 'Always clean top to bottom', 'Start cleaning from high surfaces and work your way down to avoid re-cleaning areas', 2),
(3, 'Always dry clean before wet clean', 'Use dry cleaning methods (dusting, sweeping) before wet methods (mopping, wiping)', 3),
(4, 'Empty your vacuum', 'Empty vacuum bag or canister regularly for better suction and performance', 4),
(5, 'Have towels on hand', 'Keep cleaning towels readily available to wipe up spills immediately', 5),
(6, 'Replenish your cleaning supplies', 'Restock cleaning supplies before you run out to avoid interruptions', 6);

-- Note: User rows (users, user_profiles, user_quiz_responses, user_room_priorities,
-- user_notification_preferences) are not seeded here. Users are created through
-- Supabase Auth — user_id is a UUID from auth.users(id), not an integer.

-- 7. Notification Sounds
INSERT INTO notification_sounds (sound_id, sound_name, file_uri, is_active) VALUES
(1, 'Default Chime', '/sounds/default-chime.mp3', TRUE),
(2, 'Gentle Bell', '/sounds/gentle-bell.mp3', TRUE),
(3, 'Soft Alert', '/sounds/soft-alert.mp3', TRUE);

-- 8. Dwelling Type Room Mappings
INSERT INTO dwelling_type_rooms (dwelling_type_id, room_id, is_default) VALUES
-- Apartment defaults
(1, 1, TRUE), -- Kitchen
(1, 2, TRUE), -- Bathroom
(1, 3, TRUE), -- Bedroom
(1, 4, TRUE), -- Living Room
(1, 5, FALSE), -- Laundry (optional for apartments)

-- House defaults
(2, 1, TRUE), -- Kitchen
(2, 2, TRUE), -- Bathroom
(2, 3, TRUE), -- Bedroom
(2, 4, TRUE), -- Living Room
(2, 5, TRUE), -- Laundry

-- Studio defaults
(3, 1, TRUE), -- Kitchen
(3, 2, TRUE), -- Bathroom
(3, 3, FALSE), -- Bedroom (combined area)
(3, 4, TRUE), -- Living Room (combined area)
(3, 5, FALSE); -- Laundry (optional for studios)