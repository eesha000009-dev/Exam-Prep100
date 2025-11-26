-- Migration: insert a sample profile and a study plan for testing
-- Run this in Supabase SQL editor or psql connected to your project's DB.

-- Use a test UUID for the sample user. Replace if you want a different test id.
\set test_user_id '11111111-1111-1111-1111-111111111111'

-- Ensure extension for gen_random_uuid (optional)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Insert a sample profile (if not exists)
INSERT INTO public.profiles (id, display_name, username, email, avatar_url, level, metadata, created_at, updated_at)
SELECT \:test_user_id::uuid, 'Test Student', 'teststudent', 'test@example.com', 'https://ui-avatars.com/api/?name=Test+Student&background=2563eb&color=fff', 'SS 3', '{}'::jsonb, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = \:test_user_id::uuid);

-- Insert a sample study plan linked to the profile (if not exists)
INSERT INTO public.study_plans (student_id, exam_date, target_score, weak_subjects, schedule, is_active, created_at, updated_at)
SELECT \:test_user_id::uuid, now() + INTERVAL '90 days', 320, to_jsonb(ARRAY['Mathematics','Physics']), jsonb_build_object('days', jsonb_build_array()), true, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM public.study_plans WHERE student_id = \:test_user_id::uuid);

-- Quick verification
SELECT p.id AS profile_id, p.display_name, sp.id AS study_plan_id, sp.exam_date
FROM public.profiles p
LEFT JOIN public.study_plans sp ON sp.student_id = p.id
WHERE p.id = \:test_user_id::uuid;
