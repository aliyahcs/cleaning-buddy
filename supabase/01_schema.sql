CREATE TABLE cleaner_categories (
 category_id SMALLSERIAL PRIMARY KEY,
 name VARCHAR(50) NOT NULL UNIQUE,
 min_score SMALLINT NOT NULL CHECK (min_score BETWEEN 0 AND 100),
 max_score SMALLINT NOT NULL CHECK (max_score BETWEEN 0 AND 100),
 default_message VARCHAR(255) NOT NULL,
 CHECK (min_score <= max_score)
);

CREATE TABLE dwelling_types (
 dwelling_type_id SMALLSERIAL PRIMARY KEY,
 name VARCHAR(50) NOT NULL UNIQUE,
 description VARCHAR(255)
);

CREATE TABLE rooms (
 room_id SMALLSERIAL PRIMARY KEY,
 name VARCHAR(50) NOT NULL UNIQUE,
 description VARCHAR(255)
);

CREATE TABLE users (
 user_id BIGSERIAL PRIMARY KEY,
 email VARCHAR(255) NOT NULL UNIQUE,
 password_hash VARCHAR(255) NOT NULL,
 first_name VARCHAR(100),
 last_name VARCHAR(100),
 time_zone VARCHAR(100) DEFAULT 'UTC',
 locale VARCHAR(20) DEFAULT 'en-US',
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_profiles (
 user_id BIGINT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
 dwelling_type_id SMALLINT NOT NULL REFERENCES dwelling_types(dwelling_type_id),
 selected_cleaning_weekday SMALLINT NOT NULL CHECK (selected_cleaning_weekday BETWEEN 0 AND 6),
 selected_cleaning_time TIME NOT NULL,
 neat_freak_score SMALLINT CHECK (neat_freak_score BETWEEN 0 AND 100),
 neat_freak_category_id SMALLINT REFERENCES cleaner_categories(category_id),
 quiz_completed_at TIMESTAMP,
 onboarding_completed_at TIMESTAMP,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dwelling_type_rooms (
 dwelling_type_id SMALLINT NOT NULL REFERENCES dwelling_types(dwelling_type_id) ON DELETE CASCADE,
 room_id SMALLINT NOT NULL REFERENCES rooms(room_id) ON DELETE CASCADE,
 is_default BOOLEAN NOT NULL DEFAULT TRUE,
 PRIMARY KEY (dwelling_type_id, room_id)
);

CREATE TABLE quiz_questions (
 question_id SMALLSERIAL PRIMARY KEY,
 question_text VARCHAR(500) NOT NULL,
 display_order SMALLINT NOT NULL,
 is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE quiz_answer_options (
 option_id BIGSERIAL PRIMARY KEY,
 question_id SMALLINT NOT NULL REFERENCES quiz_questions(question_id) ON DELETE CASCADE,
 option_text VARCHAR(255) NOT NULL,
 score_value SMALLINT NOT NULL,
 display_order SMALLINT NOT NULL
);

CREATE TABLE user_quiz_responses (
 response_id BIGSERIAL PRIMARY KEY,
 user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
 question_id SMALLINT NOT NULL REFERENCES quiz_questions(question_id),
 option_id BIGINT REFERENCES quiz_answer_options(option_id),
 free_text_response VARCHAR(500),
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 UNIQUE (user_id, question_id)
);

CREATE TABLE user_room_priorities (
 user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
 room_id SMALLINT NOT NULL REFERENCES rooms(room_id),
 priority_rank SMALLINT NOT NULL CHECK (priority_rank IN (1, 2)),
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY (user_id, priority_rank),
 UNIQUE (user_id, room_id)
);

CREATE TABLE task_templates (
 task_template_id BIGSERIAL PRIMARY KEY,
 room_id SMALLINT NOT NULL REFERENCES rooms(room_id),
 task_name VARCHAR(150) NOT NULL,
 description VARCHAR(255),
 display_order SMALLINT NOT NULL,
 is_active BOOLEAN NOT NULL DEFAULT TRUE,
 UNIQUE (room_id, task_name)
);

CREATE TABLE cleaning_cycles (
 cycle_id BIGSERIAL PRIMARY KEY,
 user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
 week_start_date DATE NOT NULL,
 week_end_date DATE NOT NULL,
 scheduled_at TIMESTAMP NOT NULL,
 status VARCHAR(20) NOT NULL CHECK (status IN ('scheduled','in_progress','completed','partially_completed','missed')),
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 UNIQUE (user_id, week_start_date)
);

CREATE TABLE cycle_room_checklists (
 cycle_room_id BIGSERIAL PRIMARY KEY,
 cycle_id BIGINT NOT NULL REFERENCES cleaning_cycles(cycle_id) ON DELETE CASCADE,
 room_id SMALLINT NOT NULL REFERENCES rooms(room_id),
 priority_rank SMALLINT CHECK (priority_rank IN (1, 2) OR priority_rank IS NULL),
 is_overdue BOOLEAN NOT NULL DEFAULT FALSE,
 is_complete BOOLEAN NOT NULL DEFAULT FALSE,
 completed_at TIMESTAMP,
 UNIQUE (cycle_id, room_id)
);

CREATE TABLE cycle_tasks (
 cycle_task_id BIGSERIAL PRIMARY KEY,
 cycle_room_id BIGINT NOT NULL REFERENCES cycle_room_checklists(cycle_room_id) ON DELETE CASCADE,
 task_template_id BIGINT NOT NULL REFERENCES task_templates(task_template_id),
 due_at TIMESTAMP NOT NULL,
 status VARCHAR(20) NOT NULL CHECK (status IN ('pending','completed','postponed','overdue')),
 completed_at TIMESTAMP,
 postponed_from_task_id BIGINT REFERENCES cycle_tasks(cycle_task_id),
 notes VARCHAR(500),
 UNIQUE (cycle_room_id, task_template_id)
);

CREATE TABLE task_postponements (
 postponement_id BIGSERIAL PRIMARY KEY,
 cycle_task_id BIGINT NOT NULL REFERENCES cycle_tasks(cycle_task_id) ON DELETE CASCADE,
 postponement_type VARCHAR(20) NOT NULL CHECK (postponement_type IN ('tomorrow','next_week')),
 old_due_at TIMESTAMP NOT NULL,
 new_due_at TIMESTAMP NOT NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notification_sounds (
 sound_id SMALLSERIAL PRIMARY KEY,
 sound_name VARCHAR(50) NOT NULL UNIQUE,
 file_uri VARCHAR(255),
 is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE user_notification_preferences (
 user_id BIGINT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
 enable_push BOOLEAN NOT NULL DEFAULT TRUE,
 enable_in_app BOOLEAN NOT NULL DEFAULT TRUE,
 sound_id SMALLINT REFERENCES notification_sounds(sound_id),
 reminder_time TIME,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
 notification_id BIGSERIAL PRIMARY KEY,
 user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
 cycle_task_id BIGINT REFERENCES cycle_tasks(cycle_task_id) ON DELETE SET NULL,
 notification_type VARCHAR(20) NOT NULL CHECK (notification_type IN ('push','in_app')),
 title VARCHAR(150) NOT NULL,
 body VARCHAR(500) NOT NULL,
 scheduled_for TIMESTAMP NOT NULL,
 sent_at TIMESTAMP,
 status VARCHAR(20) NOT NULL CHECK (status IN ('pending','sent','failed','dismissed'))
);

CREATE TABLE weekly_health_scores (
 weekly_score_id BIGSERIAL PRIMARY KEY,
 cycle_id BIGINT NOT NULL UNIQUE REFERENCES cleaning_cycles(cycle_id) ON DELETE CASCADE,
 score_percent NUMERIC(5,2) NOT NULL CHECK (score_percent BETWEEN 0 AND 100),
 completed_rooms SMALLINT NOT NULL DEFAULT 0,
 total_rooms SMALLINT NOT NULL DEFAULT 0,
 completed_tasks SMALLINT NOT NULL DEFAULT 0,
 total_tasks SMALLINT NOT NULL DEFAULT 0,
 score_message VARCHAR(255) NOT NULL,
 calculated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE score_shares (
 share_id BIGSERIAL PRIMARY KEY,
 user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
 share_type VARCHAR(20) NOT NULL CHECK (share_type IN ('neat_freak','weekly_health')),
 weekly_score_id BIGINT REFERENCES weekly_health_scores(weekly_score_id) ON DELETE SET NULL,
 shared_value VARCHAR(100) NOT NULL,
 shared_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 share_method VARCHAR(30) NOT NULL CHECK (share_method IN ('clipboard','manual'))
);

CREATE TABLE cleaning_tips (
 tip_id SMALLSERIAL PRIMARY KEY,
 title VARCHAR(100) NOT NULL,
 tip_text VARCHAR(255) NOT NULL,
 display_order SMALLINT NOT NULL,
 is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE analytics_snapshots (
 snapshot_id BIGSERIAL PRIMARY KEY,
 user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
 snapshot_date DATE NOT NULL,
 most_missed_room_id SMALLINT REFERENCES rooms(room_id),
 most_completed_room_id SMALLINT REFERENCES rooms(room_id),
 overdue_task_count INTEGER NOT NULL DEFAULT 0,
 completion_rate NUMERIC(5,2) NOT NULL CHECK (completion_rate BETWEEN 0 AND 100),
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 UNIQUE (user_id, snapshot_date)
);