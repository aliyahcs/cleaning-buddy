-- WARNING: This schema is for documentation/context only and is not meant to be run.
-- The live schema is managed directly in Supabase. Table order and constraints
-- may not be valid for execution.

CREATE TABLE public.users (
  user_id uuid NOT NULL,
  email character varying NOT NULL UNIQUE,
  first_name character varying,
  last_name character varying,
  time_zone character varying DEFAULT 'UTC',
  locale character varying DEFAULT 'en-US',
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT users_pkey PRIMARY KEY (user_id),
  CONSTRAINT users_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

CREATE TABLE public.cleaner_categories (
  category_id smallint NOT NULL DEFAULT nextval('cleaner_categories_category_id_seq'::regclass),
  name character varying NOT NULL UNIQUE,
  min_score smallint NOT NULL CHECK (min_score >= 0 AND min_score <= 100),
  max_score smallint NOT NULL CHECK (max_score >= 0 AND max_score <= 100),
  default_message character varying NOT NULL,
  CONSTRAINT cleaner_categories_pkey PRIMARY KEY (category_id)
);

CREATE TABLE public.dwelling_types (
  dwelling_type_id smallint NOT NULL DEFAULT nextval('dwelling_types_dwelling_type_id_seq'::regclass),
  name character varying NOT NULL UNIQUE,
  description character varying,
  CONSTRAINT dwelling_types_pkey PRIMARY KEY (dwelling_type_id)
);

CREATE TABLE public.rooms (
  room_id smallint NOT NULL DEFAULT nextval('rooms_room_id_seq'::regclass),
  name character varying NOT NULL UNIQUE,
  description character varying,
  CONSTRAINT rooms_pkey PRIMARY KEY (room_id)
);

CREATE TABLE public.dwelling_type_rooms (
  dwelling_type_id smallint NOT NULL,
  room_id smallint NOT NULL,
  is_default boolean NOT NULL DEFAULT true,
  CONSTRAINT dwelling_type_rooms_pkey PRIMARY KEY (dwelling_type_id, room_id),
  CONSTRAINT dwelling_type_rooms_dwelling_type_id_fkey FOREIGN KEY (dwelling_type_id) REFERENCES public.dwelling_types(dwelling_type_id),
  CONSTRAINT dwelling_type_rooms_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(room_id)
);

CREATE TABLE public.user_profiles (
  user_id uuid NOT NULL,
  dwelling_type_id smallint NOT NULL,
  selected_cleaning_weekday smallint NOT NULL CHECK (selected_cleaning_weekday >= 0 AND selected_cleaning_weekday <= 6),
  selected_cleaning_time time without time zone NOT NULL,
  neat_freak_score smallint CHECK (neat_freak_score >= 0 AND neat_freak_score <= 100),
  neat_freak_category_id smallint,
  quiz_completed_at timestamp without time zone,
  onboarding_completed_at timestamp without time zone,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT user_profiles_pkey PRIMARY KEY (user_id),
  CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT user_profiles_dwelling_type_id_fkey FOREIGN KEY (dwelling_type_id) REFERENCES public.dwelling_types(dwelling_type_id),
  CONSTRAINT user_profiles_neat_freak_category_id_fkey FOREIGN KEY (neat_freak_category_id) REFERENCES public.cleaner_categories(category_id)
);

CREATE TABLE public.user_room_priorities (
  user_id uuid NOT NULL,
  room_id smallint NOT NULL,
  priority_rank smallint NOT NULL CHECK (priority_rank = ANY (ARRAY[1, 2])),
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT user_room_priorities_pkey PRIMARY KEY (user_id, priority_rank),
  CONSTRAINT user_room_priorities_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT user_room_priorities_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(room_id)
);

CREATE TABLE public.quiz_questions (
  question_id smallint NOT NULL DEFAULT nextval('quiz_questions_question_id_seq'::regclass),
  question_text character varying NOT NULL,
  display_order smallint NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  CONSTRAINT quiz_questions_pkey PRIMARY KEY (question_id)
);

CREATE TABLE public.quiz_answer_options (
  option_id bigint NOT NULL DEFAULT nextval('quiz_answer_options_option_id_seq'::regclass),
  question_id smallint NOT NULL,
  option_text character varying NOT NULL,
  score_value smallint NOT NULL,
  display_order smallint NOT NULL,
  CONSTRAINT quiz_answer_options_pkey PRIMARY KEY (option_id),
  CONSTRAINT quiz_answer_options_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.quiz_questions(question_id)
);

CREATE TABLE public.user_quiz_responses (
  response_id bigint NOT NULL DEFAULT nextval('user_quiz_responses_response_id_seq'::regclass),
  user_id uuid NOT NULL,
  question_id smallint NOT NULL,
  option_id bigint,
  free_text_response character varying,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT user_quiz_responses_pkey PRIMARY KEY (response_id),
  CONSTRAINT user_quiz_responses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT user_quiz_responses_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.quiz_questions(question_id),
  CONSTRAINT user_quiz_responses_option_id_fkey FOREIGN KEY (option_id) REFERENCES public.quiz_answer_options(option_id)
);

CREATE TABLE public.task_templates (
  task_template_id bigint NOT NULL DEFAULT nextval('task_templates_task_template_id_seq'::regclass),
  room_id smallint NOT NULL,
  task_name character varying NOT NULL,
  description character varying,
  display_order smallint NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  CONSTRAINT task_templates_pkey PRIMARY KEY (task_template_id),
  CONSTRAINT task_templates_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(room_id)
);

CREATE TABLE public.user_task_completions (
  user_id uuid NOT NULL,
  task_template_id integer NOT NULL,
  postponed boolean NOT NULL DEFAULT false,
  due_date text,
  CONSTRAINT user_task_completions_pkey PRIMARY KEY (user_id, task_template_id),
  CONSTRAINT user_task_completions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

CREATE TABLE public.user_custom_tasks (
  custom_task_id bigint NOT NULL DEFAULT nextval('user_custom_tasks_custom_task_id_seq'::regclass),
  user_id uuid NOT NULL,
  room_id integer NOT NULL,
  task_name text NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  postponed boolean NOT NULL DEFAULT false,
  due_date text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_custom_tasks_pkey PRIMARY KEY (custom_task_id),
  CONSTRAINT user_custom_tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

CREATE TABLE public.notification_sounds (
  sound_id smallint NOT NULL DEFAULT nextval('notification_sounds_sound_id_seq'::regclass),
  sound_name character varying NOT NULL UNIQUE,
  file_uri character varying,
  is_active boolean NOT NULL DEFAULT true,
  CONSTRAINT notification_sounds_pkey PRIMARY KEY (sound_id)
);

CREATE TABLE public.user_notification_preferences (
  user_id uuid NOT NULL,
  enable_push boolean NOT NULL DEFAULT true,
  enable_in_app boolean NOT NULL DEFAULT true,
  sound_id smallint,
  reminder_time time without time zone,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT user_notification_preferences_pkey PRIMARY KEY (user_id),
  CONSTRAINT user_notification_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT user_notification_preferences_sound_id_fkey FOREIGN KEY (sound_id) REFERENCES public.notification_sounds(sound_id)
);

CREATE TABLE public.cleaning_tips (
  tip_id smallint NOT NULL DEFAULT nextval('cleaning_tips_tip_id_seq'::regclass),
  title character varying NOT NULL,
  tip_text character varying NOT NULL,
  display_order smallint NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  CONSTRAINT cleaning_tips_pkey PRIMARY KEY (tip_id)
);

CREATE TABLE public.cleaning_cycles (
  cycle_id bigint NOT NULL DEFAULT nextval('cleaning_cycles_cycle_id_seq'::regclass),
  user_id uuid NOT NULL,
  week_start_date date NOT NULL,
  week_end_date date NOT NULL,
  scheduled_at timestamp without time zone NOT NULL,
  status character varying NOT NULL CHECK (status::text = ANY (ARRAY['scheduled','in_progress','completed','partially_completed','missed']::text[])),
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT cleaning_cycles_pkey PRIMARY KEY (cycle_id),
  CONSTRAINT cleaning_cycles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id)
);

CREATE TABLE public.cycle_room_checklists (
  cycle_room_id bigint NOT NULL DEFAULT nextval('cycle_room_checklists_cycle_room_id_seq'::regclass),
  cycle_id bigint NOT NULL,
  room_id smallint NOT NULL,
  priority_rank smallint CHECK ((priority_rank = ANY (ARRAY[1, 2])) OR priority_rank IS NULL),
  is_overdue boolean NOT NULL DEFAULT false,
  is_complete boolean NOT NULL DEFAULT false,
  completed_at timestamp without time zone,
  CONSTRAINT cycle_room_checklists_pkey PRIMARY KEY (cycle_room_id),
  CONSTRAINT cycle_room_checklists_cycle_id_fkey FOREIGN KEY (cycle_id) REFERENCES public.cleaning_cycles(cycle_id),
  CONSTRAINT cycle_room_checklists_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(room_id)
);

CREATE TABLE public.cycle_tasks (
  cycle_task_id bigint NOT NULL DEFAULT nextval('cycle_tasks_cycle_task_id_seq'::regclass),
  cycle_room_id bigint NOT NULL,
  task_template_id bigint NOT NULL,
  due_at timestamp without time zone NOT NULL,
  status character varying NOT NULL CHECK (status::text = ANY (ARRAY['pending','completed','postponed','overdue']::text[])),
  completed_at timestamp without time zone,
  postponed_from_task_id bigint,
  notes character varying,
  CONSTRAINT cycle_tasks_pkey PRIMARY KEY (cycle_task_id),
  CONSTRAINT cycle_tasks_cycle_room_id_fkey FOREIGN KEY (cycle_room_id) REFERENCES public.cycle_room_checklists(cycle_room_id),
  CONSTRAINT cycle_tasks_task_template_id_fkey FOREIGN KEY (task_template_id) REFERENCES public.task_templates(task_template_id),
  CONSTRAINT cycle_tasks_postponed_from_task_id_fkey FOREIGN KEY (postponed_from_task_id) REFERENCES public.cycle_tasks(cycle_task_id)
);

CREATE TABLE public.task_postponements (
  postponement_id bigint NOT NULL DEFAULT nextval('task_postponements_postponement_id_seq'::regclass),
  cycle_task_id bigint NOT NULL,
  postponement_type character varying NOT NULL CHECK (postponement_type::text = ANY (ARRAY['tomorrow','next_week','custom_date']::text[])),
  old_due_at timestamp without time zone NOT NULL,
  new_due_at timestamp without time zone NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT task_postponements_pkey PRIMARY KEY (postponement_id),
  CONSTRAINT task_postponements_cycle_task_id_fkey FOREIGN KEY (cycle_task_id) REFERENCES public.cycle_tasks(cycle_task_id)
);

CREATE TABLE public.notifications (
  notification_id bigint NOT NULL DEFAULT nextval('notifications_notification_id_seq'::regclass),
  user_id uuid NOT NULL,
  cycle_task_id bigint,
  notification_type character varying NOT NULL CHECK (notification_type::text = ANY (ARRAY['push','in_app']::text[])),
  title character varying NOT NULL,
  body character varying NOT NULL,
  scheduled_for timestamp without time zone NOT NULL,
  sent_at timestamp without time zone,
  status character varying NOT NULL CHECK (status::text = ANY (ARRAY['pending','sent','failed','dismissed']::text[])),
  CONSTRAINT notifications_pkey PRIMARY KEY (notification_id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT notifications_cycle_task_id_fkey FOREIGN KEY (cycle_task_id) REFERENCES public.cycle_tasks(cycle_task_id)
);

CREATE TABLE public.weekly_health_scores (
  weekly_score_id bigint NOT NULL DEFAULT nextval('weekly_health_scores_weekly_score_id_seq'::regclass),
  cycle_id bigint NOT NULL UNIQUE,
  score_percent numeric NOT NULL CHECK (score_percent >= 0::numeric AND score_percent <= 100::numeric),
  completed_rooms smallint NOT NULL DEFAULT 0,
  total_rooms smallint NOT NULL DEFAULT 0,
  completed_tasks smallint NOT NULL DEFAULT 0,
  total_tasks smallint NOT NULL DEFAULT 0,
  score_message character varying NOT NULL,
  calculated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT weekly_health_scores_pkey PRIMARY KEY (weekly_score_id),
  CONSTRAINT weekly_health_scores_cycle_id_fkey FOREIGN KEY (cycle_id) REFERENCES public.cleaning_cycles(cycle_id)
);

CREATE TABLE public.score_shares (
  share_id bigint NOT NULL DEFAULT nextval('score_shares_share_id_seq'::regclass),
  user_id uuid NOT NULL,
  share_type character varying NOT NULL CHECK (share_type::text = ANY (ARRAY['neat_freak','weekly_health']::text[])),
  weekly_score_id bigint,
  shared_value character varying NOT NULL,
  shared_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  share_method character varying NOT NULL CHECK (share_method::text = ANY (ARRAY['clipboard','manual']::text[])),
  CONSTRAINT score_shares_pkey PRIMARY KEY (share_id),
  CONSTRAINT score_shares_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT score_shares_weekly_score_id_fkey FOREIGN KEY (weekly_score_id) REFERENCES public.weekly_health_scores(weekly_score_id)
);

CREATE TABLE public.analytics_snapshots (
  snapshot_id bigint NOT NULL DEFAULT nextval('analytics_snapshots_snapshot_id_seq'::regclass),
  user_id uuid NOT NULL,
  snapshot_date date NOT NULL,
  most_missed_room_id smallint,
  most_completed_room_id smallint,
  overdue_task_count integer NOT NULL DEFAULT 0,
  completion_rate numeric NOT NULL CHECK (completion_rate >= 0::numeric AND completion_rate <= 100::numeric),
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT analytics_snapshots_pkey PRIMARY KEY (snapshot_id),
  CONSTRAINT analytics_snapshots_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT analytics_snapshots_most_missed_room_id_fkey FOREIGN KEY (most_missed_room_id) REFERENCES public.rooms(room_id),
  CONSTRAINT analytics_snapshots_most_completed_room_id_fkey FOREIGN KEY (most_completed_room_id) REFERENCES public.rooms(room_id)
);
