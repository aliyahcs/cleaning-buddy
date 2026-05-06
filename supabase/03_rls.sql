-- RLS Policies for Cleaning Buddy
-- Safe to run multiple times — uses CREATE OR REPLACE POLICY (Postgres 15+).
-- Paste into the Supabase SQL editor and run.

-- ============================================================
-- Reference / lookup tables (read-only, any authenticated user)
-- ============================================================

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE POLICY "rooms_read" ON public.rooms FOR SELECT TO authenticated USING (true);

ALTER TABLE public.task_templates ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE POLICY "task_templates_read" ON public.task_templates FOR SELECT TO authenticated USING (true);

ALTER TABLE public.dwelling_types ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE POLICY "dwelling_types_read" ON public.dwelling_types FOR SELECT TO authenticated USING (true);

ALTER TABLE public.dwelling_type_rooms ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE POLICY "dwelling_type_rooms_read" ON public.dwelling_type_rooms FOR SELECT TO authenticated USING (true);

ALTER TABLE public.cleaner_categories ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE POLICY "cleaner_categories_read" ON public.cleaner_categories FOR SELECT TO authenticated USING (true);

ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE POLICY "quiz_questions_read" ON public.quiz_questions FOR SELECT TO authenticated USING (true);

ALTER TABLE public.quiz_answer_options ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE POLICY "quiz_answer_options_read" ON public.quiz_answer_options FOR SELECT TO authenticated USING (true);

ALTER TABLE public.cleaning_tips ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE POLICY "cleaning_tips_read" ON public.cleaning_tips FOR SELECT TO authenticated USING (true);

ALTER TABLE public.notification_sounds ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE POLICY "notification_sounds_read" ON public.notification_sounds FOR SELECT TO authenticated USING (true);

-- ============================================================
-- User data tables (own-row-only access)
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE POLICY "users_select_own" ON public.users FOR SELECT USING (auth.uid() = user_id);
CREATE OR REPLACE POLICY "users_insert_own" ON public.users FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE OR REPLACE POLICY "users_update_own" ON public.users FOR UPDATE USING (auth.uid() = user_id);
CREATE OR REPLACE POLICY "users_delete_own" ON public.users FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE POLICY "user_profiles_select_own" ON public.user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE OR REPLACE POLICY "user_profiles_insert_own" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE OR REPLACE POLICY "user_profiles_update_own" ON public.user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE OR REPLACE POLICY "user_profiles_delete_own" ON public.user_profiles FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.user_room_priorities ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE POLICY "user_room_priorities_select_own" ON public.user_room_priorities FOR SELECT USING (auth.uid() = user_id);
CREATE OR REPLACE POLICY "user_room_priorities_insert_own" ON public.user_room_priorities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE OR REPLACE POLICY "user_room_priorities_update_own" ON public.user_room_priorities FOR UPDATE USING (auth.uid() = user_id);
CREATE OR REPLACE POLICY "user_room_priorities_delete_own" ON public.user_room_priorities FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.user_quiz_responses ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE POLICY "user_quiz_responses_select_own" ON public.user_quiz_responses FOR SELECT USING (auth.uid() = user_id);
CREATE OR REPLACE POLICY "user_quiz_responses_insert_own" ON public.user_quiz_responses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE OR REPLACE POLICY "user_quiz_responses_update_own" ON public.user_quiz_responses FOR UPDATE USING (auth.uid() = user_id);
CREATE OR REPLACE POLICY "user_quiz_responses_delete_own" ON public.user_quiz_responses FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.user_task_completions ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE POLICY "user_task_completions_select_own" ON public.user_task_completions FOR SELECT USING (auth.uid() = user_id);
CREATE OR REPLACE POLICY "user_task_completions_insert_own" ON public.user_task_completions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE OR REPLACE POLICY "user_task_completions_update_own" ON public.user_task_completions FOR UPDATE USING (auth.uid() = user_id);
CREATE OR REPLACE POLICY "user_task_completions_delete_own" ON public.user_task_completions FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.user_custom_tasks ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE POLICY "user_custom_tasks_select_own" ON public.user_custom_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE OR REPLACE POLICY "user_custom_tasks_insert_own" ON public.user_custom_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE OR REPLACE POLICY "user_custom_tasks_update_own" ON public.user_custom_tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE OR REPLACE POLICY "user_custom_tasks_delete_own" ON public.user_custom_tasks FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE POLICY "user_notif_prefs_select_own" ON public.user_notification_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE OR REPLACE POLICY "user_notif_prefs_insert_own" ON public.user_notification_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE OR REPLACE POLICY "user_notif_prefs_update_own" ON public.user_notification_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE OR REPLACE POLICY "user_notif_prefs_delete_own" ON public.user_notification_preferences FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE POLICY "notifications_select_own" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE OR REPLACE POLICY "notifications_insert_own" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE OR REPLACE POLICY "notifications_update_own" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE OR REPLACE POLICY "notifications_delete_own" ON public.notifications FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.analytics_snapshots ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE POLICY "analytics_snapshots_select_own" ON public.analytics_snapshots FOR SELECT USING (auth.uid() = user_id);
CREATE OR REPLACE POLICY "analytics_snapshots_insert_own" ON public.analytics_snapshots FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE OR REPLACE POLICY "analytics_snapshots_update_own" ON public.analytics_snapshots FOR UPDATE USING (auth.uid() = user_id);
CREATE OR REPLACE POLICY "analytics_snapshots_delete_own" ON public.analytics_snapshots FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.score_shares ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE POLICY "score_shares_select_own" ON public.score_shares FOR SELECT USING (auth.uid() = user_id);
CREATE OR REPLACE POLICY "score_shares_insert_own" ON public.score_shares FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE OR REPLACE POLICY "score_shares_update_own" ON public.score_shares FOR UPDATE USING (auth.uid() = user_id);
CREATE OR REPLACE POLICY "score_shares_delete_own" ON public.score_shares FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- Cycle tables (no direct user_id — join through cleaning_cycles)
-- ============================================================

ALTER TABLE public.cleaning_cycles ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE POLICY "cleaning_cycles_select_own" ON public.cleaning_cycles FOR SELECT USING (auth.uid() = user_id);
CREATE OR REPLACE POLICY "cleaning_cycles_insert_own" ON public.cleaning_cycles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE OR REPLACE POLICY "cleaning_cycles_update_own" ON public.cleaning_cycles FOR UPDATE USING (auth.uid() = user_id);
CREATE OR REPLACE POLICY "cleaning_cycles_delete_own" ON public.cleaning_cycles FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.cycle_room_checklists ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE POLICY "cycle_room_checklists_select_own" ON public.cycle_room_checklists FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.cleaning_cycles cc WHERE cc.cycle_id = cycle_room_checklists.cycle_id AND cc.user_id = auth.uid()));
CREATE OR REPLACE POLICY "cycle_room_checklists_insert_own" ON public.cycle_room_checklists FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.cleaning_cycles cc WHERE cc.cycle_id = cycle_room_checklists.cycle_id AND cc.user_id = auth.uid()));
CREATE OR REPLACE POLICY "cycle_room_checklists_update_own" ON public.cycle_room_checklists FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.cleaning_cycles cc WHERE cc.cycle_id = cycle_room_checklists.cycle_id AND cc.user_id = auth.uid()));
CREATE OR REPLACE POLICY "cycle_room_checklists_delete_own" ON public.cycle_room_checklists FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.cleaning_cycles cc WHERE cc.cycle_id = cycle_room_checklists.cycle_id AND cc.user_id = auth.uid()));

ALTER TABLE public.cycle_tasks ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE POLICY "cycle_tasks_select_own" ON public.cycle_tasks FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.cycle_room_checklists crc
    JOIN public.cleaning_cycles cc ON cc.cycle_id = crc.cycle_id
    WHERE crc.cycle_room_id = cycle_tasks.cycle_room_id AND cc.user_id = auth.uid()
  ));
CREATE OR REPLACE POLICY "cycle_tasks_insert_own" ON public.cycle_tasks FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.cycle_room_checklists crc
    JOIN public.cleaning_cycles cc ON cc.cycle_id = crc.cycle_id
    WHERE crc.cycle_room_id = cycle_tasks.cycle_room_id AND cc.user_id = auth.uid()
  ));
CREATE OR REPLACE POLICY "cycle_tasks_update_own" ON public.cycle_tasks FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.cycle_room_checklists crc
    JOIN public.cleaning_cycles cc ON cc.cycle_id = crc.cycle_id
    WHERE crc.cycle_room_id = cycle_tasks.cycle_room_id AND cc.user_id = auth.uid()
  ));
CREATE OR REPLACE POLICY "cycle_tasks_delete_own" ON public.cycle_tasks FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.cycle_room_checklists crc
    JOIN public.cleaning_cycles cc ON cc.cycle_id = crc.cycle_id
    WHERE crc.cycle_room_id = cycle_tasks.cycle_room_id AND cc.user_id = auth.uid()
  ));

ALTER TABLE public.task_postponements ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE POLICY "task_postponements_select_own" ON public.task_postponements FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.cycle_tasks ct
    JOIN public.cycle_room_checklists crc ON crc.cycle_room_id = ct.cycle_room_id
    JOIN public.cleaning_cycles cc ON cc.cycle_id = crc.cycle_id
    WHERE ct.cycle_task_id = task_postponements.cycle_task_id AND cc.user_id = auth.uid()
  ));
CREATE OR REPLACE POLICY "task_postponements_insert_own" ON public.task_postponements FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.cycle_tasks ct
    JOIN public.cycle_room_checklists crc ON crc.cycle_room_id = ct.cycle_room_id
    JOIN public.cleaning_cycles cc ON cc.cycle_id = crc.cycle_id
    WHERE ct.cycle_task_id = task_postponements.cycle_task_id AND cc.user_id = auth.uid()
  ));
CREATE OR REPLACE POLICY "task_postponements_delete_own" ON public.task_postponements FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.cycle_tasks ct
    JOIN public.cycle_room_checklists crc ON crc.cycle_room_id = ct.cycle_room_id
    JOIN public.cleaning_cycles cc ON cc.cycle_id = crc.cycle_id
    WHERE ct.cycle_task_id = task_postponements.cycle_task_id AND cc.user_id = auth.uid()
  ));

ALTER TABLE public.weekly_health_scores ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE POLICY "weekly_health_scores_select_own" ON public.weekly_health_scores FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.cleaning_cycles cc WHERE cc.cycle_id = weekly_health_scores.cycle_id AND cc.user_id = auth.uid()));
